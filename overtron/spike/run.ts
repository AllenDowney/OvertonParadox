// Samples the period-cohort model with TyMC, two chains at a time in worker threads,
// and writes the draws compare.py needs (alpha, cohort, period) plus timing and diagnostics.
//
//     node spike/run.ts [tune] [draws] [target_accept] [adaptation] [chains] [standard|spectral|trend]
//
// Results go to spike/results/{label}/, labeled by the settings.

import { mkdirSync, writeFileSync } from "node:fs";
import { Worker } from "node:worker_threads";
import { diagnostics, workers } from "tymc";
import { build_model, build_model_spectral, build_model_trend } from "./model.ts";

const [tune, draws, target_accept] = [Number(process.argv[2] ?? 1000), Number(process.argv[3] ?? 1000), Number(process.argv[4] ?? 0.95)];
const adaptation = (process.argv[5] ?? "pymc") as "pymc" | "stan" | "nutpie";
const chains = Number(process.argv[6] ?? 4);
const form = process.argv[7] ?? "standard";
const label = `${form === "standard" ? "" : `${form}_`}${adaptation}_${tune}-${draws}_${target_accept}_c${chains}`;
const out = new URL(`./results/${label}/`, import.meta.url);

function spawn() {
  const worker = new Worker(new URL("./worker.ts", import.meta.url));
  let handler: ((event: { readonly data: unknown }) => void) | null = null;
  worker.on("message", (data) => handler?.({ data }));
  return {
    postMessage: (message: unknown, transfer?: ArrayBuffer[]) => worker.postMessage(message, transfer),
    get onmessage() {
      return handler;
    },
    set onmessage(f) {
      handler = f;
    },
    terminate: () => void worker.terminate(),
  };
}

const builders = { standard: "build_model", spectral: "build_model_spectral", trend: "build_model_trend" } as const;
const model = form === "spectral" ? build_model_spectral() : form === "trend" ? build_model_trend() : build_model();
const began = performance.now();
let last = 0;
const result = await workers.parallel_sample(
  model,
  { module: new URL("./model.ts", import.meta.url).href, export_name: builders[form as keyof typeof builders] },
  {
    tune, draws, chains, seed: 17, target_accept, adaptation, concurrency: 2, cache: false,
    on_progress: (e) => {
      const now = performance.now();
      if (now - last > 30000) {
        last = now;
        console.log(`${((now - began) / 1000).toFixed(0)} s: chain ${e.chain} iteration ${e.iteration}`);
      }
    },
  },
  spawn,
);
const seconds = (performance.now() - began) / 1000;

const summary = diagnostics.summary(result, { include_deterministics: true });
const rows = summary.rows ?? summary;
mkdirSync(out, { recursive: true });
const keep = ["alpha", "cohort", "period", "sigma_c", "sigma_t", "sigma_short"]; // compare.py needs these
const named = [...result.parameters, ...result.deterministics].filter((p) => keep.includes(p.name));
const mean = (x: ArrayLike<number>) => Array.from(x).reduce((a, b) => a + b, 0) / x.length;
const stats = result.chains.map((c) => ({
  n_steps: mean(c.n_steps), tree_depth: mean(c.tree_depth), step_size: c.step_size, tune_n_steps: c.tune_n_steps,
}));
const meta: Record<string, unknown> = { label, tune, draws, chains, target_accept, adaptation, seconds, divergences: result.divergences, chain_stats: stats, variables: {} };
for (const p of named) {
  writeFileSync(new URL(`${p.name}.f64`, out), new Uint8Array(new Float64Array(p.values).buffer));
  (meta.variables as Record<string, unknown>)[p.name] = p.shape;
}
writeFileSync(new URL("summary.json", out), JSON.stringify(rows, null, 1));
writeFileSync(new URL("meta.json", out), JSON.stringify(meta, null, 1));
console.log(`done ${label}: ${seconds.toFixed(1)} s, divergences ${JSON.stringify(result.divergences)}`);
console.log(JSON.stringify(stats));
