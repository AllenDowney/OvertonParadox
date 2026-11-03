// The Overton models in TyMC: ports of build_series_model (period and age) and
// build_period_cohort_model in overton/apc.py, with the RW2 in the trend form
// (jb/rw2_reparameterization.md). Priors are declared in PyMC's order of free
// variables, so parameter vectors line up with PyMC's point for point.

import { distributions as dist, modeling as mdl, numerics, ops } from "tymc";
import type { Variable } from "tymc";
import { eigh } from "./linalg.ts";

// PERIOD_SETTINGS and COHORT_SETTINGS in overton/apc.py
export const PERIOD_SETTINGS = { sigma_t_scale: 0.125, slope_init_scale: 0.2, sigma_short_scale: 0.5 };
export const COHORT_SETTINGS = {
  sigma_c_scale: 0.125, sigma_t_scale: 0.125, slope_init_scale: 0.2, sigma_short_scale: 0.2, sigma_resid_scale: 0.5,
};

export interface TrendBasis {
  readonly n: number;
  readonly k: number; // n - 2
  readonly M: Float64Array; // n x k, row-major: U sqrt(lam), the eigenbasis of the mean-centered RW2 prior
  readonly M_perp: Float64Array; // M with the ramp split out: M = r a' + M_perp
  readonly r: Float64Array; // the mean-centered ramp
  readonly a: Float64Array;
  readonly lam: Float64Array;
  readonly U: Float64Array; // n x k
}

/** The double-cumsum map L (n x (n-2)): f_raw[0] = 0, first slope 0; L[i, m] = i - 1 - m for m < i - 1. */
export function double_cumsum(n: number): Float64Array {
  const L = new Float64Array(n * (n - 2));
  for (let i = 2; i < n; i++) for (let m = 0; m < i - 1; m++) L[i * (n - 2) + m] = i - 1 - m;
  return L;
}

/** rw2_trend_basis in overton/apc.py: eigendecompose P L L' P, keep the n - 2 nonzero eigenvalues. */
export function rw2_trend_basis(n: number): TrendBasis {
  const k = n - 2;
  const L = double_cumsum(n);
  // P L: L with each column's mean removed
  const PL = Float64Array.from(L);
  for (let m = 0; m < k; m++) {
    let mean = 0;
    for (let i = 0; i < n; i++) mean += L[i * k + m];
    mean /= n;
    for (let i = 0; i < n; i++) PL[i * k + m] -= mean;
  }
  const K = new Float64Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let s = 0;
      for (let m = 0; m < k; m++) s += PL[i * k + m] * PL[j * k + m];
      K[i * n + j] = K[j * n + i] = s;
    }
  }
  const { values, vectors } = eigh(K, n);
  // ascending, so the n - 2 nonzero ones are the last; keep them largest first
  const lam = new Float64Array(k);
  const U = new Float64Array(n * k);
  const M = new Float64Array(n * k);
  for (let c = 0; c < k; c++) {
    const src = n - 1 - c;
    lam[c] = values[src];
    for (let i = 0; i < n; i++) {
      U[i * k + c] = vectors[i * n + src];
      M[i * k + c] = vectors[i * n + src] * Math.sqrt(values[src]);
    }
  }
  if (values[1] > 1e-9 * values[n - 1]) throw new Error(`rw2_trend_basis(${n}): expected two zero eigenvalues`);
  const r = Float64Array.from({ length: n }, (_, i) => i - (n - 1) / 2);
  const rr = r.reduce((t, x) => t + x * x, 0);
  const a = Float64Array.from({ length: k }, (_, c) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += M[i * k + c] * r[i];
    return s / rr;
  });
  const M_perp = Float64Array.from(M, (m, idx) => m - r[Math.floor(idx / k)] * a[idx % k]);
  return { n, k, M, M_perp, r, a, lam, U };
}

/**
 * The trend form of the RW2: f = sigma M_perp w + beta r, with w ~ N(0, I), beta flat, and the
 * initial slope's prior, Normal(0, slope_init_scale), as a potential on v0 = beta - sigma a'w.
 */
function rw2_trend(name: string, n: number, sigma: Variable, slope_init_scale: number, statements: unknown[]): Variable {
  const basis = rw2_trend_basis(n);
  const w = mdl.parameter(`${name}_w`, { shape: [basis.k] });
  statements.push(mdl.prior(w, dist.normal({ mu: 0, sigma: 1 })));
  const beta = mdl.parameter(`${name}_trend`);
  statements.push(mdl.prior(beta, dist.flat()));
  const v0 = beta.sub(ops.dot(w, Array.from(basis.a)).mul(sigma));
  const s = slope_init_scale;
  statements.push(mdl.potential(`${name}_slope_init_prior`,
    v0.div(s).square().mul(-0.5).sub(Math.log(s) + 0.5 * Math.log(2 * Math.PI))));
  const f = ops.dot(numerics.to_ndarray(Array.from(basis.M_perp), [n, basis.k]), w.mul(sigma)).add(beta.mul(Array.from(basis.r)));
  statements.push(mdl.deterministic(name, f));
  return f;
}

export interface SeriesCells {
  readonly grid: readonly number[]; // years or ages, consecutive
  readonly index: readonly number[]; // each cell's year or age
  readonly p_weighted: readonly number[];
  readonly var_weighted: readonly number[];
  readonly n_eff: readonly number[];
}

/** Period or age model: RW2 over the grid, year noise, Normal on cell means (time_model). */
export function build_series_model(cells: SeriesCells, s = PERIOD_SETTINGS) {
  const G = cells.grid.length;
  const idx = cells.index.map((v) => cells.grid.indexOf(v));
  const se = cells.var_weighted.map((v, i) => Math.sqrt(Math.max(v, 1e-4) / Math.max(cells.n_eff[i], 1)));
  const statements: unknown[] = [];
  const alpha = mdl.parameter("alpha");
  statements.push(mdl.prior(alpha, dist.normal({ mu: 0, sigma: 1 })));
  const sigma_t = mdl.parameter("sigma_t");
  statements.push(mdl.prior(sigma_t, dist.exponential({ lam: 1 / s.sigma_t_scale })));
  const trend = rw2_trend("trend", G, sigma_t, s.slope_init_scale, statements);
  const eta = alpha.add(trend);
  statements.push(mdl.deterministic("mu", eta.sigmoid()));
  const sigma_short = mdl.parameter("sigma_short");
  statements.push(mdl.prior(sigma_short, dist.half_normal({ sigma: s.sigma_short_scale })));
  const epsilon_z = mdl.parameter("epsilon_z", { shape: [G] });
  statements.push(mdl.prior(epsilon_z, dist.zero_sum_normal({ sigma: 1, size: G })));
  const epsilon = epsilon_z.mul(sigma_short);
  statements.push(mdl.observed("y_mean", dist.normal({ mu: eta.at(idx).add(epsilon.at(idx)).sigmoid(), sigma: se }),
    Array.from(cells.p_weighted)));
  return mdl.make_model(statements as Parameters<typeof mdl.make_model>[0]);
}

export interface CohortYearCells {
  readonly years: readonly number[];
  readonly cohorts: readonly number[];
  readonly cell_year: readonly number[];
  readonly cell_cohort: readonly number[];
  readonly p_weighted: readonly number[];
  readonly n_eff: readonly number[];
}

/** model10: RW2 cohort + RW2 period + year noise, Normal on cohort x year cell means. */
export function build_period_cohort_model(cells: CohortYearCells, s = COHORT_SETTINGS) {
  const T = cells.years.length;
  const C = cells.cohorts.length;
  const t = cells.cell_year.map((y) => cells.years.indexOf(y));
  const c = cells.cell_cohort.map((k) => cells.cohorts.indexOf(k));
  const inv_sqrt_n = cells.n_eff.map((n) => 1 / Math.sqrt(n));
  const statements: unknown[] = [];
  const alpha = mdl.parameter("alpha");
  statements.push(mdl.prior(alpha, dist.normal({ mu: 0, sigma: 1 })));
  const sigma_c = mdl.parameter("sigma_c");
  statements.push(mdl.prior(sigma_c, dist.exponential({ lam: 1 / s.sigma_c_scale })));
  const cohort = rw2_trend("cohort", C, sigma_c, s.slope_init_scale, statements);
  const sigma_t = mdl.parameter("sigma_t");
  statements.push(mdl.prior(sigma_t, dist.exponential({ lam: 1 / s.sigma_t_scale })));
  const period = rw2_trend("period", T, sigma_t, s.slope_init_scale, statements);
  const sigma_short = mdl.parameter("sigma_short");
  statements.push(mdl.prior(sigma_short, dist.exponential({ lam: 1 / s.sigma_short_scale })));
  const epsilon_z = mdl.parameter("epsilon_z", { shape: [T] });
  statements.push(mdl.prior(epsilon_z, dist.zero_sum_normal({ sigma: 1, size: T })));
  const epsilon = epsilon_z.mul(sigma_short);
  statements.push(mdl.deterministic("epsilon", epsilon));
  const sigma_resid = mdl.parameter("sigma_resid", { shape: [T] });
  statements.push(mdl.prior(sigma_resid, dist.half_normal({ sigma: s.sigma_resid_scale })));
  const p_obs = alpha.add(cohort.at(c)).add(period.at(t)).add(epsilon.at(t)).sigmoid();
  const se = sigma_resid.at(t).mul(inv_sqrt_n);
  statements.push(mdl.observed("y_mean", dist.normal({ mu: p_obs, sigma: se }), Array.from(cells.p_weighted)));
  return mdl.make_model(statements as Parameters<typeof mdl.make_model>[0]);
}
