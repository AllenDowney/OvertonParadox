// The fits a run makes, for one scored question set: period by self-identified ideology x 3,
// period for all respondents,
// age by decade of surveys x 6, the period-cohort model, and, within each decade of birth
// (1900s-2000s), the age model and the period-cohort model x 11 each (Allen, 2026-11-03).
// Shared by the page and bench/run_primary.ts, so both make exactly the same fits.

import type { Excerpt } from "./excerpt.ts";
import { type FitSpec, MAIN_PERIOD_COHORT_TARGET } from "./fits.ts";
import { type Scored, series_cells, subset, weighted_cells } from "./measure.ts";
import { summarize_period_cohort, summarize_series } from "./summaries.ts";

export interface Job {
  readonly label: string;
  readonly saved: string; // the decided run with the same specification, for primary (results/apc/results)
  readonly group: "period" | "period_all" | "age" | "period_cohort" | "age_by_birth" | "period_cohort_by_birth";
  readonly spec: FitSpec;
  readonly summarize: (draws: Record<string, unknown>) => ReturnType<typeof summarize_series> | ReturnType<typeof summarize_period_cohort>;
  readonly target_accept?: number;
}

const range = (values: Iterable<number>) => {
  const v = [...values];
  const lo = Math.min(...v), hi = Math.max(...v);
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
};

export const SURVEY_DECADES = [[1972, 1979], [1980, 1989], [1990, 1999], [2000, 2009], [2010, 2019], [2020, 2024]] as const;
export const BIRTH_DECADES = Array.from({ length: 11 }, (_, k) => 1900 + 10 * k);
const IDEOLOGY = [["Liberal", 1, 3], ["Moderate", 4, 4], ["Conservative", 5, 7]] as const;

export function make_jobs(excerpt: Excerpt, scored: Scored, set = "primary"): Job[] {
  // a subgroup needs respondents in at least three cells to fit (a reader's set may leave it empty)
  const enough = (n: number) => n >= 3;

  function series_job(label: string, saved: string, group: Job["group"], keep: (i: number) => boolean,
    by: ArrayLike<number>): Job | null {
    const sub = subset(scored, keep);
    if (!enough(new Set(Array.from(sub.rows, (i) => by[i])).size)) return null;
    const grid = range(Array.from(sub.rows, (i) => by[i]));
    const cells = series_cells(excerpt, sub, by);
    return { label, saved, group, spec: { kind: "series", cells: { grid, ...cells } },
      summarize: (d) => summarize_series(d.mu as number[][], grid, cells) };
  }

  function period_cohort_job(label: string, saved: string, group: Job["group"], keep: (i: number) => boolean): Job | null {
    const sub = subset(scored, keep);
    if (!enough(new Set(Array.from(sub.rows, (i) => excerpt.year[i])).size)) return null;
    const years = range(Array.from(sub.rows, (i) => excerpt.year[i]));
    const cohorts = range(Array.from(sub.rows, (i) => excerpt.cohort[i]));
    const c = weighted_cells(excerpt, sub);
    const cells = {
      years, cohorts, cell_cohort: Array.from(c.cohort), cell_year: Array.from(c.year), p_weighted: Array.from(c.p_weighted),
      n: Array.from(c.n), n_eff: Array.from(c.n_eff),
    };
    const people = {
      year: Array.from(sub.rows, (i) => excerpt.year[i]), cohort: Array.from(sub.rows, (i) => excerpt.cohort[i]),
      weight: Array.from(sub.rows, (i) => excerpt.weight[i]),
    };
    return { label, saved, group, spec: { kind: "period_cohort", cells },
      summarize: (d) => summarize_period_cohort(d as never, years, cohorts, people, cells) };
  }

  const jobs: (Job | null)[] = [];
  for (const [g, lo, hi] of IDEOLOGY)
    jobs.push(series_job(`period ${g}`, `period_${set}_polviews3-${g}`, "period",
      (i) => excerpt.polviews[i] >= lo && excerpt.polviews[i] <= hi, excerpt.year));
  // all respondents: the overall average in the by-decade figure (dotted)
  jobs.push(series_job("period all", `period_${set}`, "period_all", () => true, excerpt.year));
  for (const [lo, hi] of SURVEY_DECADES)
    jobs.push(series_job(`age ${lo}-${hi}`, `age_${set}_window-${lo}-${hi}`, "age",
      (i) => excerpt.year[i] >= lo && excerpt.year[i] <= hi, excerpt.age));
  const main = period_cohort_job("period-cohort", `period_cohort_${set}`, "period_cohort", () => true);
  jobs.push(main && { ...main, target_accept: MAIN_PERIOD_COHORT_TARGET });
  for (const d of BIRTH_DECADES) {
    const born = (i: number) => excerpt.cohort[i] >= d && excerpt.cohort[i] <= d + 9;
    jobs.push(series_job(`age born ${d}s`, `age_${set}_cohorts-${d}-${d + 9}`, "age_by_birth", born, excerpt.age));
    jobs.push(period_cohort_job(`pc born ${d}s`, `period_cohort_${set}_cohorts-${d}-${d + 9}`, "period_cohort_by_birth", born));
  }
  return jobs.filter((j): j is Job => j !== null);
}
