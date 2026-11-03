// Relative position (overton/position.py): where the 1974 liberal would stand in later
// years. Each group's latent distribution of conservatism is normal on the logit scale
// (latent_normals, difficulties fixed), so a group's median is its mean, and a percentile
// is the normal CDF of a z-score.

import { numerics } from "tymc";
import type { Excerpt } from "./excerpt.ts";
import { type Answers, latent_normals, type Scored } from "./measure.ts";

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
