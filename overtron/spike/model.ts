// The period-cohort model (model10) in TyMC: a port of build_period_cohort_model in
// overton/apc.py, on the cells that spike/export_cells.py writes. Priors are declared in
// PyMC's order of free variables, so the parameter vectors line up point for point.

import { readFileSync } from "node:fs";
import { distributions as dist, modeling as mdl, numerics, ops } from "tymc";
import type { Variable } from "tymc";

export interface Cells {
  years: number[];
  cohorts: number[];
  cell_year: number[];
  cell_cohort: number[];
  p_weighted: number[];
  n_eff: number[];
  value_vars: string[];
  points: { values: number[][]; spectral_values: number[][]; logp: number }[];
  basis: Record<"cohort" | "period", { M: number[]; shape: [number, number]; r: number[] }>;
}

// COHORT_SETTINGS in overton/apc.py
const S = { sigma_c_scale: 0.125, sigma_t_scale: 0.125, slope_init_scale: 0.2, sigma_short_scale: 0.2, sigma_resid_scale: 0.5 };

export function load_cells(): Cells {
  return JSON.parse(readFileSync(new URL("./cells_p48.json", import.meta.url), "utf8")) as Cells;
}

/** CultureWar's mean-centered RW2: double cumsum, non-centered, free initial slope. */
function rw2(name: string, n: number, sigma: Variable, statements: unknown[]): Variable {
  const z = mdl.parameter(`${name}_z_delta`, { shape: [n - 2] });
  statements.push(mdl.prior(z, dist.normal({ mu: 0, sigma: 1 })));
  const v0 = mdl.parameter(`${name}_slope_init`);
  statements.push(mdl.prior(v0, dist.normal({ mu: 0, sigma: S.slope_init_scale })));
  const rw1 = ops.concatenate([[0], z.mul(sigma).cumsum(0)], 0).add(v0);
  const f_raw = ops.concatenate([[0], rw1.cumsum(0)], 0);
  const f = f_raw.sub(f_raw.mean(0));
  statements.push(mdl.deterministic(name, f));
  return f;
}

/**
 * The same RW2 in the eigenbasis of its prior (spike/geometry.py, rw2_basis): f = sigma * M w + v0 * r,
 * with w ~ N(0, I) a rotation of the innovations, so the model and its log density are unchanged.
 */
function rw2_spectral(name: string, basis: Cells["basis"]["cohort"], sigma: Variable, statements: unknown[]): Variable {
  const w = mdl.parameter(`${name}_z_delta`, { shape: [basis.shape[1]] });
  statements.push(mdl.prior(w, dist.normal({ mu: 0, sigma: 1 })));
  const v0 = mdl.parameter(`${name}_slope_init`);
  statements.push(mdl.prior(v0, dist.normal({ mu: 0, sigma: S.slope_init_scale })));
  const M = numerics.to_ndarray(basis.M, basis.shape);
  const f = ops.dot(M, w.mul(sigma)).add(v0.mul(basis.r));
  statements.push(mdl.deterministic(name, f));
  return f;
}

/**
 * Splits the linear ramp out of the eigenbasis: M = r a' + M_perp, so f = sigma * M_perp w + beta * r,
 * where beta = v0 + sigma * a'w is the total linear trend. (v0, w) -> (beta, w) has Jacobian 1, and
 * v0's prior, Normal(0, slope_init_scale), stays as a potential on beta - sigma * a'w: the same model.
 */
export function trend_basis(basis: Cells["basis"]["cohort"]) {
  const [n, k] = basis.shape;
  const rr = basis.r.reduce((t, x) => t + x * x, 0);
  const a = Array.from({ length: k }, (_v, j) => basis.r.reduce((t, x, i) => t + x * (basis.M[i * k + j] ?? 0), 0) / rr);
  const M_perp = basis.M.map((m, idx) => m - (basis.r[Math.floor(idx / k)] ?? 0) * (a[idx % k] ?? 0));
  return { a, M_perp, shape: [n, k] as [number, number] };
}

function rw2_trend(name: string, basis: Cells["basis"]["cohort"], sigma: Variable, statements: unknown[]): Variable {
  const { a, M_perp, shape } = trend_basis(basis);
  const w = mdl.parameter(`${name}_z_delta`, { shape: [shape[1]] });
  statements.push(mdl.prior(w, dist.normal({ mu: 0, sigma: 1 })));
  const beta = mdl.parameter(`${name}_trend`);
  statements.push(mdl.prior(beta, dist.flat()));
  const v0 = beta.sub(ops.dot(w, a).mul(sigma));
  const s = S.slope_init_scale;
  statements.push(mdl.potential(`${name}_slope_init_prior`, v0.div(s).square().mul(-0.5).sub(Math.log(s) + 0.5 * Math.log(2 * Math.PI))));
  statements.push(mdl.deterministic(`${name}_slope_init`, v0));
  const f = ops.dot(numerics.to_ndarray(M_perp, shape), w.mul(sigma)).add(beta.mul(basis.r));
  statements.push(mdl.deterministic(name, f));
  return f;
}

export function build_model_spectral(cells: Cells = load_cells()) {
  return build_model(cells, "spectral");
}

export function build_model_trend(cells: Cells = load_cells()) {
  return build_model(cells, "trend");
}

export function build_model(cells: Cells = load_cells(), form: "standard" | "spectral" | "trend" = "standard") {
  const walk = (name: "cohort" | "period", n: number, sigma: Variable) =>
    form === "spectral" ? rw2_spectral(name, cells.basis[name], sigma, statements)
      : form === "trend" ? rw2_trend(name, cells.basis[name], sigma, statements)
        : rw2(name, n, sigma, statements);
  const T = cells.years.length;
  const C = cells.cohorts.length;
  const t = cells.cell_year.map((y) => cells.years.indexOf(y));
  const c = cells.cell_cohort.map((k) => cells.cohorts.indexOf(k));
  const inv_sqrt_n = cells.n_eff.map((n) => 1 / Math.sqrt(n));
  const statements: unknown[] = [];

  const alpha = mdl.parameter("alpha");
  statements.push(mdl.prior(alpha, dist.normal({ mu: 0, sigma: 1 })));
  const sigma_c = mdl.parameter("sigma_c");
  statements.push(mdl.prior(sigma_c, dist.exponential({ lam: 1 / S.sigma_c_scale })));
  const cohort = walk("cohort", C, sigma_c);
  const sigma_t = mdl.parameter("sigma_t");
  statements.push(mdl.prior(sigma_t, dist.exponential({ lam: 1 / S.sigma_t_scale })));
  const period = walk("period", T, sigma_t);
  const sigma_short = mdl.parameter("sigma_short");
  statements.push(mdl.prior(sigma_short, dist.exponential({ lam: 1 / S.sigma_short_scale })));
  const epsilon_z = mdl.parameter("epsilon_z", { shape: [T] });
  statements.push(mdl.prior(epsilon_z, dist.zero_sum_normal({ sigma: 1, size: T })));
  const epsilon = epsilon_z.mul(sigma_short);
  statements.push(mdl.deterministic("epsilon", epsilon));
  const sigma_resid = mdl.parameter("sigma_resid", { shape: [T] });
  statements.push(mdl.prior(sigma_resid, dist.half_normal({ sigma: S.sigma_resid_scale })));

  const p_obs = alpha.add(cohort.at(c)).add(period.at(t)).add(epsilon.at(t)).sigmoid();
  const se = sigma_resid.at(t).mul(inv_sqrt_n);
  statements.push(mdl.observed("y_mean", dist.normal({ mu: p_obs, sigma: se }), cells.p_weighted));
  return mdl.make_model(statements as Parameters<typeof mdl.make_model>[0]);
}
