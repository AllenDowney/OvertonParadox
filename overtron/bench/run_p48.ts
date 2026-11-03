// The page's v1 run for p48 in Node: period by self-identified ideology x 3, age by decade
// of surveys x 6, period-cohort x 1, and, within each decade of birth (1900s-2000s), the
// age model and the period-cohort model x 11 each; with the page's sampler settings,
// two worker chains at a time. Times each fit and compares the headline numbers with
// the decided fits (results/apc/results, nutpie, 4 x (4000 + 6000) at 0.99).
//
//     node bench/run_p48.ts [label filter] [target_accept]
//
// e.g. node bench/run_p48.ts "pc born" 0.99 runs only the matching fits, at that target.
//
// Writes bench/results/p48.json (gitignored).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Worker } from "node:worker_threads";
import { gunzipSync } from "node:zlib";
import { decode, type Manifest } from "../src/excerpt.ts";
import { fit, PAGE_SETTINGS } from "../src/fits.ts";
import { make_jobs } from "../src/jobs.ts";
import { answered, code, score } from "../src/measure.ts";

const data = new URL("../public/data/v1/", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("manifest.json", data), "utf8")) as Manifest;
const raw = gunzipSync(readFileSync(new URL("respondents.bin.gz", data)));
const excerpt = decode(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer, manifest);
const p48 = JSON.parse(readFileSync(new URL("../fixtures/p48.json", import.meta.url), "utf8"));
const decided = new URL("../../results/apc/results/", import.meta.url);

// the presets' difficulties are precomputed (the page won't run EM for them)
const answers = code(excerpt, p48.codes);
const scored = score(excerpt, answers, answered(answers), answers.names.map((v) => p48.difficulties_reference[v]), p48.min_answered);

function spawn() {
  const worker = new Worker(new URL("./node_worker.ts", import.meta.url));
  let handler: ((event: { readonly data: unknown }) => void) | null = null;
  worker.on("message", (message) => handler?.({ data: message }));
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

const jobs = make_jobs(excerpt, scored);

const HEADLINE = ["slope_per_decade", "slope_lo90", "slope_hi90", "period_slope_per_decade", "period_slope_lo90",
  "period_slope_hi90", "generational_replacement", "changing_minds"];
const worker_module = new URL("./node_worker.ts", import.meta.url).href;
const out: Record<string, unknown>[] = [];
const began = performance.now();
const [only, target] = [process.argv[2], process.argv[3] ? Number(process.argv[3]) : undefined];
for (const job of jobs.filter((j) => !only || j.label.includes(only))) {
  const result = await fit(job.spec, PAGE_SETTINGS, worker_module, spawn, undefined, target ?? job.target_accept);
  const summary = job.summarize(result.draws).summary as unknown as Record<string, unknown>;
  const path = new URL(`${job.saved}_summary.json`, decided);
  const reference = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
  const keys = HEADLINE.filter((k) => k in summary);
  const compare = Object.fromEntries(keys.map((k) => [k, [summary[k] as number, reference[k] as number]]));
  out.push({ label: job.label, seconds: result.seconds, diagnostics: result.diagnostics, summary, decided: compare });
  const d = result.diagnostics;
  console.log(`${job.label.padEnd(22)} ${result.seconds.toFixed(1).padStart(6)} s  steps ${d.n_steps_mean.toFixed(0).padStart(4)}  ` +
    `r_hat ${d.r_hat_max.toFixed(3)}  ess ${d.ess_bulk_min.toFixed(0).padStart(5)}  div ${d.divergences}  ` +
    keys.slice(0, 3).map((k) => `${k} ${(summary[k] as number).toFixed(2)} (${(reference[k] as number)?.toFixed(2)})`).join("  "));
}
console.log(`total ${((performance.now() - began) / 1000).toFixed(1)} s`);
mkdirSync(new URL("./results/", import.meta.url), { recursive: true });
writeFileSync(new URL(`./results/p48${only ? `_${only.replace(/ /g, "-")}_${target ?? "default"}` : ""}.json`, import.meta.url), JSON.stringify(out, null, 1));
