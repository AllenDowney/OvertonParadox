// The Overtron page (docs/overtron_plan.md, milestone 5): pick questions, run the pipeline in
// the browser (the excerpt with DecompressionStream, TyMC in module workers, EM and the
// bootstrap in their own workers), and draw post 1's figures as the fits finish.

import type { CalibrateRequest } from "./calibrate_worker.ts";
import { type Excerpt, load } from "./excerpt.ts";
import { conservatism_line } from "./figures.ts";
import { fit, PAGE_SETTINGS } from "./fits.ts";
import { make_jobs } from "./jobs.ts";
import { answered, code, min_answered_for, score } from "./measure.ts";
import { Picker, type PickerTable, years_asked } from "./picker.ts";
import type { Headline } from "./position.ts";
import type { PositionRequest } from "./position_worker.ts";
import { type Done, draw_figures, FIGURES } from "./post_figures.ts";

interface PresetSettings {
  readonly codes: Record<string, number[]>;
  readonly min_answered: number;
  readonly difficulties: Record<string, number>;
}

const BASE = new URL("data/v1", document.baseURI).href;
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const run = $<HTMLButtonElement>("run");
const status = $<HTMLSpanElement>("status");
const progress = $<HTMLProgressElement>("progress");

let excerpt: Excerpt;
let table: PickerTable & { preset_settings: Record<string, PresetSettings> };
let picker: Picker;
let running = false;

function spawn() {
  return new Worker(new URL("./fit_worker.ts", import.meta.url), { type: "module" });
}

// ?position runs only relative position (seconds, not minutes): for working on its figure
const POSITION_ONLY = new URLSearchParams(location.search).has("position");
// ?quick: short chains (300 + 300), for working on the figures; not for results
const SETTINGS = new URLSearchParams(location.search).has("quick") ? { ...PAGE_SETTINGS, tune: 300, draws: 300 } : PAGE_SETTINGS;

const fmt = (x: number, digits = 2) => (Number.isFinite(x) ? x.toFixed(digits) : "–");

/**
 * Run a one-shot worker: post the request, resolve with its reply. The caller creates the worker
 * with the literal `new Worker(new URL("./x.ts", import.meta.url), ...)`, which is the pattern vite
 * bundles; a URL passed in as a variable would be treated as a plain asset.
 */
function in_worker<T>(create: () => Worker, request: unknown, name: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const worker = create();
    worker.onerror = (event) => {
      worker.terminate();
      reject(new Error(`${name}: ${event.message || "the worker failed to start"}`));
    };
    worker.onmessage = (event) => {
      worker.terminate();
      if (event.data.ok) resolve(event.data);
      else reject(new Error(event.data.error));
    };
    worker.postMessage(request);
  });
}

/** Codes, minimum answers, and difficulties for the selection: a preset's, or calibrated on the set. */
async function settings_for_selection(): Promise<PresetSettings & { name: string }> {
  const name = picker.preset();
  if (name) return { name, ...table.preset_settings[name] };
  const names = [...picker.selected];
  const codes = Object.fromEntries(names.map((v) => [v, [...table.questions[v].conservative]]));
  const min_answered = min_answered_for(names.length);
  status.textContent = `Calibrating difficulties for your ${names.length} questions…`;
  const request: CalibrateRequest = { base: BASE, codes, min_answered };
  const { difficulties } = await in_worker<{ difficulties: Record<string, number> }>(
    () => new Worker(new URL("./calibrate_worker.ts", import.meta.url), { type: "module" }), request, "calibration");
  return { name: "custom", codes, min_answered, difficulties };
}

function update_run_button() {
  run.disabled = running || picker.selected.size < 2;
}

async function start() {
  running = true;
  update_run_button();
  $("error").textContent = "";
  const body = $<HTMLTableElement>("fits").tBodies[0];
  body.replaceChildren();
  const began = performance.now();
  const settings = await settings_for_selection();
  status.textContent = "Scoring respondents…";
  const answers = code(excerpt, settings.codes);
  const d = answers.names.map((v) => settings.difficulties[v]);
  const scored = score(excerpt, answers, answered(answers), d, settings.min_answered);
  const jobs = make_jobs(excerpt, scored, settings.name);

  $("position").textContent = "Relative position: running (bootstrap, in its own worker)…";
  const request: PositionRequest = { base: BASE, codes: settings.codes, difficulties: settings.difficulties,
    min_answered: settings.min_answered };
  const pos = in_worker<{ headline: Headline }>(
    () => new Worker(new URL("./position_worker.ts", import.meta.url), { type: "module" }), request, "relative position")
    .then(({ headline: h }) => {
      $("position").classList.remove("muted");
      conservatism_line($("position"), h);
    }).catch((error) => {
      $("position").textContent = `Relative position not available: ${error.message}`;
    });

  if (POSITION_ONLY) jobs.length = 0;
  const figures = $("figures");
  figures.replaceChildren();
  const containers: Record<string, HTMLElement> = {};
  for (const { id } of FIGURES) {
    containers[id] = document.createElement("div");
    figures.appendChild(containers[id]);
  }
  const done: Done = new Map();
  draw_figures(containers, jobs, done);
  const per_fit = SETTINGS.chains * (SETTINGS.tune + SETTINGS.draws);
  for (const [k, job] of jobs.entries()) {
    status.textContent = `Fit ${k + 1} of ${jobs.length}: ${job.label}`;
    const chains = new Map<number, number>();
    const result = await fit(job.spec, SETTINGS, "overtron:fits", spawn as never, (e) => {
      chains.set(e.chain, e.iteration);
      const iterations = [...chains.values()].reduce((a, b) => a + b, 0);
      progress.value = (k + Math.min(iterations / per_fit, 1)) / jobs.length;
    }, job.target_accept);
    const summarized = job.summarize(result.draws);
    done.set(job, summarized);
    draw_figures(containers, jobs, done);
    const s = summarized.summary as unknown as Record<string, number>;
    const [m, lo, hi] = "period_slope_per_decade" in s
      ? [s.period_slope_per_decade, s.period_slope_lo90, s.period_slope_hi90]
      : [s.slope_per_decade, s.slope_lo90, s.slope_hi90];
    const dg = result.diagnostics;
    const row = body.insertRow();
    for (const text of [job.label, fmt(result.seconds, 1), fmt(dg.r_hat_max, 3), fmt(dg.ess_bulk_min, 0),
      String(dg.divergences), `${fmt(m)} [${fmt(lo)}, ${fmt(hi)}]`]) row.insertCell().textContent = text;
  }
  await pos;
  progress.value = 1;
  const seconds = (performance.now() - began) / 1000;
  status.textContent = `Done: ${jobs.length} fits.`;
  $("total").textContent = `Total time ${fmt(seconds, 1)} s, with ${navigator.hardwareConcurrency} logical cores.`;
}

async function init() {
  const loaded = await load(BASE);
  excerpt = loaded.excerpt;
  table = loaded.questions as unknown as typeof table;
  const asked = years_asked(excerpt, Object.keys(table.questions));
  picker = new Picker($("picker"), table, excerpt, asked, update_run_button);
  status.textContent = `${loaded.manifest.rows.toLocaleString()} respondents, ${Object.keys(table.questions).length} questions loaded.`;
  update_run_button();
  run.onclick = () => start().catch((error) => {
    $("error").textContent = String(error?.stack ?? error);
  }).finally(() => {
    running = false;
    update_run_button();
  });
}

init().catch((error) => {
  status.textContent = "Couldn't load the data.";
  $("error").textContent = String(error?.stack ?? error);
});
