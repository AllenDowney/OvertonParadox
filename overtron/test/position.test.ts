// Relative position against Python (overtron/fixtures/position.json, from overton/position.py).

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { gunzipSync } from "node:zlib";
import { decode, type Manifest } from "../src/excerpt.ts";
import { answered, code, score } from "../src/measure.ts";
import { by_year, distributions, headline, HEADLINE_KEYS } from "../src/position.ts";

const data = new URL("../public/data/v1/", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("manifest.json", data), "utf8")) as Manifest;
const raw = gunzipSync(readFileSync(new URL("respondents.bin.gz", data)));
const excerpt = decode(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer, manifest);
const p48 = JSON.parse(readFileSync(new URL("../fixtures/p48.json", import.meta.url), "utf8"));
const fx = JSON.parse(readFileSync(new URL("../fixtures/position.json", import.meta.url), "utf8"));

const answers = code(excerpt, p48.codes);
const d = answers.names.map((v) => p48.difficulties_reference[v]);
const scored = score(excerpt, answers, answered(answers), d, p48.min_answered);

test("latent normals by year", () => {
  const year = distributions(answers, excerpt, scored, d, (i) => String(excerpt.year[i]));
  let diff = 0;
  fx.year.label.forEach((label: string, k: number) => {
    const dist = year.get(label)!;
    diff = Math.max(diff, Math.abs(dist.mu - fx.year.mu[k]), Math.abs(dist.sd - fx.year.sd[k]));
  });
  console.log(`latent normals by year: ${year.size} years, max diff ${diff.toExponential(1)}`);
  assert.equal(year.size, fx.year.label.length);
  assert.ok(diff < 1e-5, `${diff}`);
});

test("by year: the 1974 liberal's percentile, and each year's groups", () => {
  const { rows, ref } = by_year(answers, excerpt, scored, d, fx.ref_year);
  assert.ok(Math.abs(ref - fx.ref) < 1e-5, `ref ${ref} vs ${fx.ref}`);
  assert.deepEqual(rows.map((r) => r.year), fx.table.year);
  assert.deepEqual(rows.map((r) => r.n), fx.table.n);
  let diff = 0;
  for (const col of ["ref_liberal", "median_percent", "liberal", "moderate", "conservative"] as const) {
    rows.forEach((r, j) => {
      const a = r[col], b = fx.table[col][j];
      if (a === null || b === null) return assert.equal(a, b, `${col}[${j}]`);
      diff = Math.max(diff, Math.abs(a - b));
    });
  }
  const last = rows[rows.length - 1];
  console.log(`by year: max diff ${diff.toExponential(1)} points; 2024: the 1974 liberal at percentile ` +
    `${last.ref_liberal.toFixed(2)} (Python ${fx.table.ref_liberal[rows.length - 1].toFixed(2)})`);
  assert.ok(diff < 1e-3, `${diff}`);
});

test("headline: 2024 percentiles, with bootstrap intervals", () => {
  const began = performance.now();
  const h = headline(answers, excerpt, scored, d, { ref_year: fx.ref_year, last_year: fx.last_year, n_bootstrap: fx.n_bootstrap });
  const seconds = (performance.now() - began) / 1000;
  const py = fx.headline;
  for (const key of HEADLINE_KEYS) {
    console.log(`${key.padEnd(20)} ${h[key].toFixed(2)} [${h[`${key}_lo90`].toFixed(2)}, ${h[`${key}_hi90`].toFixed(2)}]` +
      `  Python ${py[key].toFixed(2)} [${py[`${key}_lo90`].toFixed(2)}, ${py[`${key}_hi90`].toFixed(2)}]`);
    // the point estimate is deterministic; the bootstrap draws differ from numpy's
    assert.ok(Math.abs(h[key] - py[key]) < 1e-4, `${key}: ${h[key]} vs ${py[key]}`);
    const width = py[`${key}_hi90`] - py[`${key}_lo90`];
    for (const end of ["lo90", "hi90"])
      assert.ok(Math.abs(h[`${key}_${end}`] - py[`${key}_${end}`]) < 0.25 * width, `${key}_${end}`);
  }
  console.log(`headline with ${fx.n_bootstrap} resamples: ${seconds.toFixed(1)} s`);
});
