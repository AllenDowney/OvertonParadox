// The summaries against Python's, computed from the same thinned draws of the saved
// primary fits (overtron/fixtures/summaries.json). The respondents are rebuilt from the
// excerpt with the decided difficulties; the excerpt's float32 weights are why the
// comparisons allow about 1e-5 points instead of exact equality.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { gunzipSync } from "node:zlib";
import { decode, type Manifest } from "../src/excerpt.ts";
import { answered, code, score, series_cells, subset, weighted_cells } from "../src/measure.ts";
import { summarize_period_cohort, summarize_series } from "../src/summaries.ts";

const data = new URL("../public/data/v1/", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("manifest.json", data), "utf8")) as Manifest;
const raw = gunzipSync(readFileSync(new URL("respondents.bin.gz", data)));
const excerpt = decode(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer, manifest);
const primary = JSON.parse(readFileSync(new URL("../fixtures/primary.json", import.meta.url), "utf8"));
const fx = JSON.parse(readFileSync(new URL("../fixtures/summaries.json", import.meta.url), "utf8"));

const answers = code(excerpt, primary.codes);
const scored = score(excerpt, answers, answered(answers), answers.names.map((v) => primary.difficulties_reference[v]), primary.min_answered);

const TOL = 1e-5; // points, on the 0-100 scale

function close(label: string, a: number | null, b: number | null, tol = TOL) {
  if (a === null || b === null) return assert.equal(a, b, label);
  assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${label}: ${a} vs ${b}`);
}

function range(values: Iterable<number>): number[] {
  const v = [...values];
  const lo = Math.min(...v), hi = Math.max(...v);
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

for (const [key, index, keep] of [
  ["period_liberal", "year", (i: number) => excerpt.polviews[i] >= 1 && excerpt.polviews[i] <= 3],
  ["age_2020-2024", "age", (i: number) => excerpt.year[i] >= 2020 && excerpt.year[i] <= 2024],
] as const) {
  test(`${key}: series and slope`, () => {
    const sub = subset(scored, keep);
    const by = index === "year" ? excerpt.year : excerpt.age;
    const grid = range(Array.from(sub.rows, (i) => by[i]));
    const { rows, summary } = summarize_series(fx[key].draws.mu, grid, series_cells(excerpt, sub, by));
    const table = fx[key].table;
    assert.deepEqual(rows.map((r) => r.index), table[index]);
    for (const col of ["mean", "lo90", "hi90", "lo84", "hi84", "observed", "n", "n_eff"] as const)
      rows.forEach((r, j) => close(`${col}[${j}]`, r[col], table[col][j]));
    for (const [k, v] of Object.entries(summary)) close(k, v, fx[key].summary[k]);
    console.log(`${key}: slope ${summary.slope_per_decade.toFixed(4)} vs ${fx[key].summary.slope_per_decade.toFixed(4)}`);
  });
}

test("period_cohort: decomposition, components, slope, trajectories", () => {
  const years = range(Array.from(scored.rows, (i) => excerpt.year[i]));
  const cohorts = range(Array.from(scored.rows, (i) => excerpt.cohort[i]));
  const people = {
    year: Array.from(scored.rows, (i) => excerpt.year[i]), cohort: Array.from(scored.rows, (i) => excerpt.cohort[i]),
    weight: Array.from(scored.rows, (i) => excerpt.weight[i]),
  };
  const c = weighted_cells(excerpt, scored);
  const cells = {
    cell_cohort: Array.from(c.cohort), cell_year: Array.from(c.year), p_weighted: Array.from(c.p_weighted),
    n: Array.from(c.n), n_eff: Array.from(c.n_eff),
  };
  const { summary, components, trajectories } = summarize_period_cohort(fx.period_cohort.draws, years, cohorts, people, cells);
  for (const [k, v] of Object.entries(fx.period_cohort.summary)) {
    if (typeof v === "string") assert.equal(summary[k], v, k);
    else close(k, summary[k] as number, v as number);
  }
  const table = fx.period_cohort.table;
  assert.deepEqual(components.map((r) => r.component), table.component);
  assert.deepEqual(components.map((r) => r.index), table.index);
  for (const col of ["mean", "lo90", "hi90", "lo84", "hi84"] as const)
    components.forEach((r, j) => close(`${col}[${j}]`, r[col], table[col][j]));
  const tr = fx.trajectories;
  assert.deepEqual(trajectories.map((r) => r.cohort), tr.cohort);
  assert.deepEqual(trajectories.map((r) => r.year), tr.year);
  for (const col of ["mean", "observed", "n", "n_eff"] as const)
    trajectories.forEach((r, j) => close(`trajectory ${col}[${j}]`, r[col], tr[col][j]));
  console.log(`period_cohort: within-cohort slope ${(summary.period_slope_per_decade as number).toFixed(4)} vs ` +
    `${fx.period_cohort.summary.period_slope_per_decade.toFixed(4)}; replacement ` +
    `${(summary.generational_replacement as number).toFixed(4)} vs ${fx.period_cohort.summary.generational_replacement.toFixed(4)}`);
});
