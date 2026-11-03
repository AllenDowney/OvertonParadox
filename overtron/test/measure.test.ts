// The measurement port against the Python pipeline's fixtures (overton/excerpt.py).
//
//     node --test test/
//
// Needs the excerpt in public/data/v1/ (python -m overton.excerpt).

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { gunzipSync } from "node:zlib";
import { decode, type Manifest } from "../src/excerpt.ts";
import { answered, code, eligible, em_difficulties, score, weighted_cells, yearly_means } from "../src/measure.ts";

const data = new URL("../public/data/v1/", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("manifest.json", data), "utf8")) as Manifest;
const gz = readFileSync(new URL("respondents.bin.gz", data));
const raw = gunzipSync(gz);
const excerpt = decode(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer, manifest);

function max_diff(a: ArrayLike<number>, b: ArrayLike<number>): number {
  assert.equal(a.length, b.length);
  let m = 0;
  for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - b[i]));
  return m;
}

for (const set of ["p48", "econA"]) {
  const fx = JSON.parse(readFileSync(new URL(`../fixtures/${set}.json`, import.meta.url), "utf8"));
  const answers = code(excerpt, fx.codes);
  const count = answered(answers);
  const reference = answers.names.map((v) => fx.difficulties_reference[v]);

  test(`${set}: EM difficulties calibrated on the set`, () => {
    const rows = eligible(excerpt, count, fx.min_answered, { scored: false });
    const d = em_difficulties(answers, excerpt.weight, rows);
    const diff = max_diff(d, answers.names.map((v) => fx.difficulties_own[v]));
    console.log(`${set}: ${rows.length} calibration respondents, EM max diff ${diff.toExponential(1)}`);
    assert.ok(diff < 1e-5, `EM difficulties differ by ${diff}`);
  });

  // the rest uses the fixture's reference difficulties, as the decided pipeline does
  const s = score(excerpt, answers, count, reference, fx.min_answered);

  test(`${set}: respondents and scores`, () => {
    assert.equal(s.rows.length, fx.respondents);
    const ids = Array.from(s.rows, (i) => `${excerpt.year[i]}:${excerpt.id[i]}`);
    const sampled = fx.sample.year.map((_: number, k: number) => k * fx.sample_every);
    assert.deepEqual(sampled.map((r: number) => ids[r]), fx.sample.year.map((y: number, k: number) => `${y}:${fx.sample.id[k]}`));
    assert.deepEqual(sampled.map((r: number) => count[s.rows[r]]), fx.sample.answered);
    const diff = max_diff(sampled.map((r: number) => s.y[r]), fx.sample.y);
    console.log(`${set}: ${s.rows.length} respondents, score max diff ${diff.toExponential(1)}`);
    assert.ok(diff < 1e-12);
  });

  test(`${set}: yearly means and cells`, () => {
    const yearly = yearly_means(excerpt, s);
    assert.deepEqual([...yearly.keys()].map(String), Object.keys(fx.yearly_mean_y));
    const ydiff = max_diff([...yearly.values()], Object.values(fx.yearly_mean_y) as number[]);
    const cells = weighted_cells(excerpt, s);
    assert.deepEqual(Array.from(cells.cohort), fx.cells.cohort);
    assert.deepEqual(Array.from(cells.year), fx.cells.year);
    assert.deepEqual(Array.from(cells.n), fx.cells.n);
    const diffs = ["p_weighted", "var_weighted"].map((k) => max_diff(cells[k as "p_weighted"], fx.cells[k]));
    const rel = Math.max(...Array.from(cells.n_eff, (x, c) => Math.abs(x / fx.cells.n_eff[c] - 1)));
    console.log(`${set}: ${cells.n.length} cells; yearly ${ydiff.toExponential(1)}, p ${diffs[0].toExponential(1)}, ` +
      `var ${diffs[1].toExponential(1)}, n_eff relative ${rel.toExponential(1)}`);
    // the excerpt stores weights as float32
    assert.ok(ydiff < 1e-6 && diffs[0] < 1e-6 && diffs[1] < 1e-6 && rel < 1e-6);
  });
}
