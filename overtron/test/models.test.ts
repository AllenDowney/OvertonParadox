// The TyMC models against PyMC's log densities (overtron/fixtures/models.json).
// The fixture's points are in the double-cumsum form's coordinates (innovations z,
// initial slope v0); each is mapped into this code's eigenbasis (w = Q z with
// Q = diag(1/sqrt(lam)) U' P L, and beta = v0 + sigma a'w), which checks the basis,
// the mapping and the model together.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { modeling as mdl, numerics } from "tymc";
import {
  build_period_cohort_model, build_series_model, COHORT_SETTINGS, double_cumsum, PERIOD_SETTINGS, rw2_trend_basis,
} from "../src/models.ts";

const fx = JSON.parse(readFileSync(new URL("../fixtures/models.json", import.meta.url), "utf8"));

/** One walk's coordinates (z, v0) -> (w, beta), given log sigma. */
function to_trend(z: number[], v0: number, log_sigma: number): { w: number[]; beta: number } {
  const n = z.length + 2;
  const { k, U, lam, a } = rw2_trend_basis(n);
  const L = double_cumsum(n);
  const Lz = Array.from({ length: n }, (_, i) => z.reduce((s, zm, m) => s + L[i * k + m] * zm, 0));
  const mean = Lz.reduce((s, x) => s + x, 0) / n;
  const PLz = Lz.map((x) => x - mean);
  const w = Array.from({ length: k }, (_, c) => PLz.reduce((s, x, i) => s + U[i * k + c] * x, 0) / Math.sqrt(lam[c]));
  const beta = v0 + Math.exp(log_sigma) * w.reduce((s, wc, c) => s + wc * a[c], 0);
  return { w, beta };
}

/** Map a point's walks (named by their z_delta and slope_init variables) to the trend form; flatten. */
function map_point(names: string[], values: number[][], walks: [string, string][]): number[] {
  const out = values.map((v) => [...v]);
  for (const [walk, sigma] of walks) {
    const iz = names.indexOf(`${walk}_z_delta`), iv = names.indexOf(`${walk}_slope_init`), is = names.indexOf(`${sigma}_log__`);
    const { w, beta } = to_trend(values[iz], values[iv][0], values[is][0]);
    out[iz] = w;
    out[iv] = [beta];
  }
  return out.flat();
}

function check(label: string, model: ReturnType<typeof build_series_model>, f: typeof fx.period, walks: [string, string][]) {
  test(`${label}: log density matches PyMC`, () => {
    const compiled = mdl.compile_model(model);
    for (const point of f.points) {
      const flat = map_point(f.value_vars, point.values, walks);
      const [lp] = compiled.logp_and_grad(numerics.to_ndarray(flat, [flat.length]));
      const diff = lp.data[0] - point.logp;
      console.log(`${label}: PyMC ${point.logp.toFixed(4)}, TyMC ${lp.data[0].toFixed(4)}, difference ${diff.toExponential(1)}`);
      assert.ok(Math.abs(diff) < 1e-5 * Math.max(1, Math.abs(point.logp)), `${label}: ${diff}`);
    }
  });
}

test("settings match overton/apc.py", () => {
  for (const [k, v] of Object.entries(PERIOD_SETTINGS)) assert.equal(fx.settings.period[k], v, k);
  for (const [k, v] of Object.entries(COHORT_SETTINGS)) assert.equal(fx.settings.period_cohort[k], v, k);
});

for (const name of ["period", "age_2020-2024"]) check(name, build_series_model(fx[name]), fx[name], [["trend", "sigma_t"]]);
check("period_cohort", build_period_cohort_model(fx.period_cohort), fx.period_cohort,
  [["cohort", "sigma_c"], ["period", "sigma_t"]]);
