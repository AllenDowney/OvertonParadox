// The Overtron page, minimal version (docs/overtron_plan.md, milestone 5, step 1): a preset,
// Run, progress, and the numbers as tables. It proves the browser path end to end (the
// excerpt with DecompressionStream, TyMC in module workers, the bootstrap in its own worker)
// before the picker and the figures.

import { type Excerpt, load, type QuestionTable } from "./excerpt.ts";
import { conservatism_line } from "./figures.ts";
import { fit, PAGE_SETTINGS } from "./fits.ts";
import { make_jobs } from "./jobs.ts";
import { answered, code, score } from "./measure.ts";
import type { Headline } from "./position.ts";
import type { PositionRequest } from "./position_worker.ts";

interface PresetSettings {
  readonly codes: Record<string, number[]>;
  readonly min_answered: number;
  readonly difficulties: Record<string, number>;
}

const BASE = new URL("data/v1", document.baseURI).href;
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const preset = $<HTMLSelectElement>("preset");
const run = $<HTMLButtonElement>("run");
const status = $<HTMLSpanElement>("status");
const progress = $<HTMLProgressElement>("progress");

const PRESET_NAMES: Record<string, string> = {
  p48: "Decided pool (48 questions)", social: "Social questions", econA: "Core economic questions (econ A)",
  book15: "The book's 15",
};

let excerpt: Excerpt;
let table: QuestionTable & { preset_settings: Record<string, PresetSettings> };

function spawn() {
  return new Worker(new URL("./fit_worker.ts", import.meta.url), { type: "module" });
}

// ?position runs only relative position (seconds, not minutes): for working on its figure
const POSITION_ONLY = new URLSearchParams(location.search).has("position");

const fmt = (x: number, digits = 2) => (Number.isFinite(x) ? x.toFixed(digits) : "–");

function position(request: PositionRequest): Promise<{ headline: Headline }> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./position_worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event) => {
      worker.terminate();
      if (event.data.ok) resolve(event.data);
      else reject(new Error(event.data.error));
    };
    worker.postMessage(request);
  });
}

async function start() {
  run.disabled = true;
  $("error").textContent = "";
  const body = $<HTMLTableElement>("fits").tBodies[0];
  body.replaceChildren();
  const began = performance.now();
  const settings = table.preset_settings[preset.value];
  const answers = code(excerpt, settings.codes);
  const d = answers.names.map((v) => settings.difficulties[v]);
  const scored = score(excerpt, answers, answered(answers), d, settings.min_answered);
  const jobs = make_jobs(excerpt, scored, preset.value);

  $("position").textContent = "Running (bootstrap, in its own worker)…";
  const pos = position({ base: BASE, codes: settings.codes, difficulties: settings.difficulties,
    min_answered: settings.min_answered }).then(({ headline: h }) => {
    $("position").classList.remove("muted");
    conservatism_line($("position"), h);
  }).catch((error) => {
    $("position").textContent = `Not available: ${error.message}`;
  });

  if (POSITION_ONLY) jobs.length = 0;
  const per_fit = PAGE_SETTINGS.chains * (PAGE_SETTINGS.tune + PAGE_SETTINGS.draws);
  for (const [k, job] of jobs.entries()) {
    status.textContent = `Fit ${k + 1} of ${jobs.length}: ${job.label}`;
    const done = new Map<number, number>();
    const result = await fit(job.spec, PAGE_SETTINGS, "overtron:fits", spawn as never, (e) => {
      done.set(e.chain, e.iteration);
      const iterations = [...done.values()].reduce((a, b) => a + b, 0);
      progress.value = (k + Math.min(iterations / per_fit, 1)) / jobs.length;
    }, job.target_accept);
    const s = job.summarize(result.draws).summary as unknown as Record<string, number>;
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
  run.disabled = false;
}

async function init() {
  const loaded = await load(BASE);
  excerpt = loaded.excerpt;
  table = loaded.questions as typeof table;
  for (const name of Object.keys(table.preset_settings)) preset.add(new Option(PRESET_NAMES[name] ?? name, name));
  status.textContent = `${loaded.manifest.rows.toLocaleString()} respondents, ${Object.keys(table.questions).length} questions loaded.`;
  run.disabled = false;
  run.onclick = () => start().catch((error) => {
    $("error").textContent = String(error?.stack ?? error);
    run.disabled = false;
  });
}

init().catch((error) => {
  status.textContent = "Couldn't load the data.";
  $("error").textContent = String(error?.stack ?? error);
});
