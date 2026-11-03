// Relative position (overton/position.py): where the 1974 liberal would stand in later
// years. Each group's latent distribution of conservatism is normal on the logit scale
// (latent_normals, difficulties fixed), so a group's median is its mean, and a percentile
// is the normal CDF of a z-score.

import { numerics } from "tymc";
import type { Excerpt } from "./excerpt.ts";
import { type Answers, grid_likelihood, latent_normals, latent_normals_from, type Scored } from "./measure.ts";
import { quantile } from "./summaries.ts";

export const GROUPS = ["Liberal", "Moderate", "Conservative"] as const;

/** polviews (1-7) to the three self-identified ideology groups (overton/pipeline.py, RECODE_POLVIEWS). */
export function polviews3(polviews: number): (typeof GROUPS)[number] | null {
  if (polviews >= 1 && polviews <= 3) return "Liberal";
  if (polviews === 4) return "Moderate";
  if (polviews >= 5 && polviews <= 7) return "Conservative";
  return null;
}

/** Expected percent conservative responses at theta (the reporting scale). */
export function to_percent(theta: number, d: ArrayLike<number>): number {
  let s = 0;
  for (let j = 0; j < d.length; j++) s += 1 / (1 + Math.exp(-(theta - d[j])));
  return (s / d.length) * 100;
}

interface Normal {
  readonly mu: number;
  readonly sd: number;
}

/** Percent of the distribution below x. */
const percentile = (dist: Normal, x: number) => 100 * numerics.scalar_ndtr((x - dist.mu) / dist.sd);

/** latent_normals for the scored respondents grouped by key(i); null keys are left out. Returns a map from key to (mu, sd). */
export function distributions(answers: Answers, excerpt: Excerpt, s: Scored, d: ArrayLike<number>,
  key: (i: number) => string | null): Map<string, Normal> {
  const labels = new Map<string, number>();
  const rows: number[] = [];
  const groups: number[] = [];
  for (const i of s.rows) {
    const label = key(i);
    if (label === null) continue;
    if (!labels.has(label)) labels.set(label, labels.size);
    rows.push(i);
    groups.push(labels.get(label)!);
  }
  const { mu, sd } = latent_normals(answers, excerpt.weight, d, Int32Array.from(rows), groups, labels.size);
  return new Map([...labels].map(([label, c]) => [label, { mu: mu[c], sd: sd[c] }]));
}

export interface PositionRow {
  readonly year: number;
  readonly n: number;
  readonly ref_liberal: number; // the reference year's median liberal, as a percentile of this year
  readonly median_percent: number; // this year's median, as percent conservative responses
  readonly liberal: number | null; // this year's median liberal, moderate, conservative, as percentiles
  readonly moderate: number | null;
  readonly conservative: number | null;
}

/** by_year in overton/position.py: percentiles in each year's distribution. */
export function by_year(answers: Answers, excerpt: Excerpt, s: Scored, d: ArrayLike<number>, ref_year = 1974) {
  const year = distributions(answers, excerpt, s, d, (i) => String(excerpt.year[i]));
  const groups = distributions(answers, excerpt, s, d, (i) => {
    const g = polviews3(excerpt.polviews[i]);
    return g === null ? null : `${excerpt.year[i]}|${g}`;
  });
  const ref = groups.get(`${ref_year}|Liberal`)!.mu;
  const n = new Map<number, number>();
  for (const i of s.rows) n.set(excerpt.year[i], (n.get(excerpt.year[i]) ?? 0) + 1);
  const rows: PositionRow[] = [...n.keys()].sort((a, b) => a - b).map((y) => {
    const dist = year.get(String(y))!;
    const group = (g: string) => {
      const gd = groups.get(`${y}|${g}`);
      return gd ? percentile(dist, gd.mu) : null;
    };
    return {
      year: y, n: n.get(y)!, ref_liberal: percentile(dist, ref), median_percent: to_percent(dist.mu, d),
      liberal: group("Liberal"), moderate: group("Moderate"), conservative: group("Conservative"),
    };
  });
  return { rows, ref, ref_percent: to_percent(ref, d) };
}

/** A small seeded generator (mulberry32), for the bootstrap draws. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const HEADLINE_KEYS = ["ref_liberal", "ref_liberal_percent", "median_percent", "liberal", "moderate", "conservative"] as const;
export type Headline = Record<(typeof HEADLINE_KEYS)[number], number> & Record<string, number>;

/**
 * headline in overton/position.py: the last year's percentiles, from the respondents of the
 * reference year and the last year only, with bootstrap intervals (respondents resampled
 * within each year, weights carried along; it ignores the GSS's clustering, so the intervals
 * are somewhat too narrow). Each resample reweights the same rows (weight x count), so the
 * likelihood is computed once. The draws differ from numpy's, so the intervals agree with
 * Python's within Monte Carlo error, not exactly.
 */
export function headline(answers: Answers, excerpt: Excerpt, s: Scored, d: ArrayLike<number>,
  { ref_year = 1974, last_year = 2024, n_bootstrap = 200, seed = 17 } = {}): Headline {
  const rows = Int32Array.from(Array.from(s.rows).filter((i) => excerpt.year[i] === ref_year || excerpt.year[i] === last_year));
  const like = grid_likelihood(answers, d, rows);
  const base = Float64Array.from(rows, (i) => excerpt.weight[i]);
  const year_group = Int32Array.from(rows, (i) => (excerpt.year[i] === ref_year ? 0 : 1));
  // year x polviews3; rows without a group get weight 0 in that fit
  const labels: string[] = [];
  for (const y of [ref_year, last_year]) for (const g of GROUPS) labels.push(`${y}|${g}`);
  const ideology = Int32Array.from(rows, (i) => {
    const g = polviews3(excerpt.polviews[i]);
    return g === null ? -1 : labels.indexOf(`${excerpt.year[i]}|${g}`);
  });

  const numbers = (weights: Float64Array) => {
    const year = latent_normals_from(like, weights, year_group, 2);
    const last = { mu: year.mu[1], sd: year.sd[1] };
    const group_weights = weights.map((w, r) => (ideology[r] < 0 ? 0 : w));
    const groups = latent_normals_from(like, group_weights, ideology.map((c) => Math.max(c, 0)), labels.length);
    const median = (label: string) => groups.mu[labels.indexOf(label)];
    const ref = median(`${ref_year}|Liberal`);
    return {
      ref_liberal: percentile(last, ref), ref_liberal_percent: to_percent(ref, d), median_percent: to_percent(last.mu, d),
      liberal: percentile(last, median(`${last_year}|Liberal`)), moderate: percentile(last, median(`${last_year}|Moderate`)),
      conservative: percentile(last, median(`${last_year}|Conservative`)),
    };
  };

  const point = numbers(base);
  const random = mulberry32(seed);
  const by_year = [ref_year, last_year].map((y) => Array.from(rows.keys()).filter((r) => excerpt.year[rows[r]] === y));
  const draws: ReturnType<typeof numbers>[] = [];
  const counts = new Float64Array(rows.length);
  for (let b = 0; b < n_bootstrap; b++) {
    counts.fill(0);
    for (const members of by_year) for (let k = 0; k < members.length; k++) counts[members[Math.floor(random() * members.length)]] += 1;
    draws.push(numbers(base.map((w, r) => w * counts[r])));
  }
  const out: Record<string, number> = { ref_year };
  for (const key of HEADLINE_KEYS) {
    const values = draws.map((x) => x[key]);
    Object.assign(out, { [key]: point[key], [`${key}_lo90`]: quantile(values, 0.05), [`${key}_hi90`]: quantile(values, 0.95) });
  }
  return out as Headline;
}
