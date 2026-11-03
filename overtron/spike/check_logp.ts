// Checks the TyMC port against PyMC: log density at the exported random points
// (transformed space, PyMC's order of free variables), which should agree to about 1e-8.

import { modeling as mdl, numerics } from "tymc";
import { build_model, build_model_spectral, build_model_trend, load_cells, trend_basis } from "./model.ts";

const cells = load_cells();
const compiled = mdl.compile_model(build_model(cells));
const spectral = mdl.compile_model(build_model_spectral(cells));
const trend = mdl.compile_model(build_model_trend(cells));
// value_vars: alpha, sigma_c_log__, cohort w, cohort v0, sigma_t_log__, period w, period v0, ...
function to_trend(values: number[][]): number[][] {
  const out = values.map((v) => [...v]);
  for (const [name, iw, iv, isig] of [["cohort", 2, 3, 1], ["period", 5, 6, 4]] as const) {
    const { a } = trend_basis(cells.basis[name]);
    const sigma = Math.exp(out[isig]![0]!);
    out[iv]![0] = out[iv]![0]! + sigma * out[iw]!.reduce((t, w, j) => t + w * a[j]!, 0);
  }
  return out;
}
for (const point of cells.points) {
  const sflat = point.spectral_values.flat();
  const [slp] = spectral.logp_and_grad(numerics.to_ndarray(sflat, [sflat.length]));
  console.log(`spectral: diff from pymc ${((slp.data[0] ?? NaN) - point.logp).toExponential(2)}`);
  const tflat = to_trend(point.spectral_values).flat();
  const [tlp] = trend.logp_and_grad(numerics.to_ndarray(tflat, [tflat.length]));
  console.log(`trend: diff from pymc ${((tlp.data[0] ?? NaN) - point.logp).toExponential(2)}`);
  const flat = point.values.flat();
  const [lp] = compiled.logp_and_grad(numerics.to_ndarray(flat, [flat.length]));
  const logp = lp.data[0] ?? NaN;
  console.log(`pymc ${point.logp.toFixed(6)}  tymc ${logp.toFixed(6)}  diff ${(logp - point.logp).toExponential(2)}`);
}
