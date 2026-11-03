// Summaries of the model fits: ports of the post-processing in fit_series and
// fit_period_cohort (overton/apc.py). Draws are arrays of rows, one per posterior draw.
// Results are on the reporting scale, percent conservative responses (SCALE = 100).

export const SCALE = 100;

type Draws = readonly (readonly number[])[]; // draws x values

const expit = (x: number) => 1 / (1 + Math.exp(-x));
const mean = (x: readonly number[]) => x.reduce((s, v) => s + v, 0) / x.length;

/** numpy.quantile with the default (linear) method. */
export function quantile(x: readonly number[], q: number): number {
  const sorted = [...x].sort((a, b) => a - b);
  const h = (sorted.length - 1) * q;
  const lo = Math.floor(h);
  return lo + 1 < sorted.length ? sorted[lo] + (h - lo) * (sorted[lo + 1] - sorted[lo]) : sorted[lo];
}

/** Mean and 90% interval. */
export function interval(x: readonly number[]): [number, number, number] {
  return [mean(x), quantile(x, 0.05), quantile(x, 0.95)];
}

export interface Band {
  readonly mean: number;
  readonly lo90: number;
  readonly hi90: number;
  readonly lo84: number;
  readonly hi84: number;
}

/** Mean, 90% and 84% intervals of one quantity's draws. */
export function band(x: readonly number[]): Band {
  return { mean: mean(x), lo90: quantile(x, 0.05), hi90: quantile(x, 0.95), lo84: quantile(x, 0.08), hi84: quantile(x, 0.92) };
}

const column = (d: Draws, j: number) => d.map((row) => row[j]);

export interface SeriesCells {
  readonly index: readonly number[];
  readonly p_weighted: readonly number[];
  readonly n: readonly number[];
  readonly n_eff: readonly number[];
}

export interface SeriesRow extends Band {
  readonly index: number;
  readonly observed: number | null;
  readonly n: number | null;
  readonly n_eff: number | null;
}

export interface SeriesSummary {
  readonly slope_per_decade: number;
  readonly slope_lo90: number;
  readonly slope_hi90: number;
  readonly change_first_last: number;
}

/** fit_series: the latent mean by year or age with bands, and its linear slope per decade over the values with data. */
export function summarize_series(mu_draws: Draws, grid: readonly number[], cells: SeriesCells, scale = SCALE):
  { rows: SeriesRow[]; summary: SeriesSummary } {
  const mu = mu_draws.map((row) => row.map((v) => v * scale));
  const rows = grid.map((g, j) => {
    const c = cells.index.indexOf(g);
    return {
      index: g, ...band(column(mu, j)),
      observed: c < 0 ? null : cells.p_weighted[c] * scale, n: c < 0 ? null : cells.n[c], n_eff: c < 0 ? null : cells.n_eff[c],
    };
  });
  const observed = grid.map((g, j) => (cells.index.includes(g) ? j : -1)).filter((j) => j >= 0);
  const x = observed.map((j) => grid[j]);
  const xbar = mean(x);
  const xs = x.map((v) => v - xbar);
  const ss = xs.reduce((s, v) => s + v * v, 0);
  const slope = mu.map((row) => {
    const m = observed.map((j) => row[j]);
    const mbar = mean(m);
    return (m.reduce((s, v, i) => s + (v - mbar) * xs[i], 0) / ss) * 10;
  });
  const [s, lo, hi] = interval(slope);
  const first = observed[0], last = observed[observed.length - 1];
  return {
    rows,
    summary: { slope_per_decade: s, slope_lo90: lo, slope_hi90: hi, change_first_last: mean(mu.map((row) => row[last] - row[first])) },
  };
}

export interface Respondents {
  readonly year: ArrayLike<number>;
  readonly cohort: ArrayLike<number>;
  readonly weight: ArrayLike<number>;
}

export interface CohortYearCells {
  readonly cell_cohort: readonly number[];
  readonly cell_year: readonly number[];
  readonly p_weighted: readonly number[];
  readonly n: readonly number[];
  readonly n_eff: readonly number[];
}

export interface ComponentRow extends Band {
  readonly component: "period" | "cohort";
  readonly index: number;
}

export interface TrajectoryRow {
  readonly cohort: number;
  readonly year: number;
  readonly mean: number;
  readonly observed: number;
  readonly n: number;
  readonly n_eff: number;
}

/**
 * fit_period_cohort: the decomposition of the total change (generational replacement and
 * changing minds), the period and cohort components, the within-cohort slope, and the
 * cohort trajectories. `people` are the scored respondents (for the cohort composition).
 */
export function summarize_period_cohort(
  draws: { alpha: readonly number[]; cohort: Draws; period: Draws }, years: readonly number[], cohorts: readonly number[],
  people: Respondents, cells: CohortYearCells, scale = SCALE,
) {
  const D = draws.alpha.length;
  const C = cohorts.length;
  const { alpha, cohort, period } = draws;
  const cidx = new Map(cohorts.map((c, k) => [c, k]));
  const tidx = new Map(years.map((y, j) => [y, j]));

  // weighted cohort composition of each surveyed year, and pooled over all years
  const by_year = new Map<number, Float64Array>();
  const pooled = new Float64Array(C);
  for (let i = 0; i < people.year.length; i++) {
    const y = people.year[i], k = cidx.get(people.cohort[i])!, w = people.weight[i];
    let row = by_year.get(y);
    if (!row) by_year.set(y, (row = new Float64Array(C)));
    row[k] += w;
    pooled[k] += w;
  }
  const survey_years = [...by_year.keys()].sort((a, b) => a - b);
  const normalize = (row: Float64Array) => {
    const total = row.reduce((s, v) => s + v, 0);
    return row.map((v) => v / total);
  };
  const comp = new Map(survey_years.map((y) => [y, normalize(by_year.get(y)!)]));
  const pooled_mix = normalize(pooled);

  /** Population mean (reporting scale), each draw, with cohort mix `mix` and period at year index t. */
  const level = (mix: Float64Array, t: number) => Array.from({ length: D }, (_, d) => {
    let s = 0;
    for (let k = 0; k < C; k++) if (mix[k] !== 0) s += expit(alpha[d] + cohort[d][k] + period[d][t]) * mix[k];
    return s * scale;
  });

  const y0 = survey_years[0], y1 = survey_years[survey_years.length - 1];
  const c0 = comp.get(y0)!, c1 = comp.get(y1)!;
  const t0 = tidx.get(y0)!, t1 = tidx.get(y1)!;
  const p0 = level(c0, t0), p1 = level(c1, t1);
  const fix_cohort = level(c0, t1); // period changes, cohort mix held at y0
  const fix_period = level(c1, t0); // cohort mix changes, period held at y0
  const total = p1.map((v, d) => v - p0[d]);
  const d_cohort = total.map((v, d) => 0.5 * ((fix_period[d] - p0[d]) + (v - (fix_cohort[d] - p0[d]))));
  const d_period = total.map((v, d) => v - d_cohort[d]);
  const decades = (y1 - y0) / 10;

  // period component, standardized to the pooled cohort mix; cohort component at the average period
  const std_period = years.map((_, j) => level(pooled_mix, j)); // years x draws
  const period_mean = period.map((row) => mean(row));
  const components: ComponentRow[] = [
    ...years.map((y, j) => ({ component: "period" as const, index: y, ...band(std_period[j]) })),
    ...cohorts.map((c, k) => ({
      component: "cohort" as const, index: c,
      ...band(Array.from({ length: D }, (_, d) => expit(alpha[d] + cohort[d][k] + period_mean[d]) * scale)),
    })),
  ];

  // cohort trajectories: the inverse logit of the posterior mean of alpha + cohort + period, per observed cell
  const trajectories: TrajectoryRow[] = cells.cell_cohort.map((c, i) => {
    const k = cidx.get(c)!, t = tidx.get(cells.cell_year[i])!;
    const eta = mean(Array.from({ length: D }, (_, d) => alpha[d] + cohort[d][k] + period[d][t]));
    return {
      cohort: c, year: cells.cell_year[i], mean: expit(eta) * scale, observed: cells.p_weighted[i] * scale,
      n: cells.n[i], n_eff: cells.n_eff[i],
    };
  });

  const summary: Record<string, number | string> = {};
  for (const [label, x] of [["total_change", total], ["generational_replacement", d_cohort], ["changing_minds", d_period],
    ["period_change_per_decade", d_period.map((v) => v / decades)]] as const) {
    const [m, lo, hi] = interval(x);
    Object.assign(summary, { [label]: m, [`${label}_lo90`]: lo, [`${label}_hi90`]: hi });
  }
  summary.window = `${y0}-${y1}`;

  // the within-cohort slope: a straight line fit to the standardized period component over the
  // surveyed years, per decade, on the reporting scale; then the same on the logit scale
  const sy = survey_years.map((y) => tidx.get(y)!);
  const ybar = mean(survey_years);
  const x = survey_years.map((y) => y - ybar);
  const xx = x.reduce((s, v) => s + v * v, 0);
  const fit = (values: (d: number, j: number) => number) => Array.from({ length: D }, (_, d) => {
    const v = sy.map((j) => values(d, j));
    const vbar = mean(v);
    return (v.reduce((s, vi, i) => s + (vi - vbar) * x[i], 0) / xx) * 10;
  });
  const [s, lo, hi] = interval(fit((d, j) => std_period[j][d]));
  Object.assign(summary, { period_slope_per_decade: s, period_slope_lo90: lo, period_slope_hi90: hi });
  const [ls, llo, lhi] = interval(fit((d, j) => period[d][j]));
  Object.assign(summary, { period_logit_slope_per_decade: ls, lo90: llo, hi90: lhi });
  return { summary, components, trajectories };
}
