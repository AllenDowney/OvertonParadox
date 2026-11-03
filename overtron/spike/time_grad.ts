// Times one log-density-and-gradient evaluation of the period-cohort model.
import { modeling as mdl, numerics } from "tymc";
import { build_model, load_cells } from "./model.ts";

const cells = load_cells();
const compiled = mdl.compile_model(build_model(cells));
const flat = cells.points[0]!.values.flat();
const theta = numerics.to_ndarray(flat, [flat.length]);
for (let i = 0; i < 2000; i++) compiled.logp_and_grad(theta);
const n = 20000;
const began = performance.now();
for (let i = 0; i < n; i++) compiled.logp_and_grad(theta);
console.log(`${(((performance.now() - began) / n) * 1000).toFixed(1)} µs per gradient`);
