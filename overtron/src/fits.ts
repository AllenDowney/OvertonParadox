// Running one model fit in worker chains. A model graph can't cross a thread boundary,
// so each fit is a small spec (the model kind and its cells), passed to the workers as
// JSON in ModelReference.argument; the workers' loader (load_model) rebuilds the model.

import { diagnostics, workers } from "tymc";
import { build_period_cohort_model, build_series_model, type CohortYearCells, type SeriesCells } from "./models.ts";

export type FitSpec =
  | { readonly kind: "series"; readonly cells: SeriesCells }
  | { readonly kind: "period_cohort"; readonly cells: CohortYearCells };

export function build_from_spec(spec: FitSpec) {
  return spec.kind === "series" ? build_series_model(spec.cells) : build_period_cohort_model(spec.cells);
}

/** The worker side: a ModelLoader for workers.browser_worker_entry. */
export const load_model = async (job: { readonly model: { readonly argument?: string } }) =>
  build_from_spec(JSON.parse(job.model.argument!) as FitSpec);

export interface SamplerSettings {
  readonly chains: number;
  readonly tune: number;
  readonly draws: number;
  readonly target_accept: number;
  readonly seed: number;
  readonly concurrency: number;
}

/**
 * The page's default (docs/overtron_plan.md, configuration; Allen, 2026-11-03): 0.99 for the
 * period and age fits and the birth-group period-cohort fits, as in production, since they're
 * small (a few seconds each); the all-respondents period-cohort fit at MAIN_PERIOD_COHORT_TARGET.
 */
export const PAGE_SETTINGS: SamplerSettings = { chains: 2, tune: 1000, draws: 2000, target_accept: 0.99, seed: 17, concurrency: 2 };

/** target_accept for the all-respondents period-cohort fit: about 30 s at 0.95, with no divergences in primary. */
export const MAIN_PERIOD_COHORT_TARGET = 0.95;

/** The deterministics each kind of summary needs. */
const KEEP = { series: ["mu"], period_cohort: ["alpha", "cohort", "period"] };

export interface FitResult {
  /** Draws (chains stacked) x values, for each kept variable; scalars as one value per draw. */
  readonly draws: Record<string, number[][] | number[]>;
  readonly diagnostics: {
    readonly r_hat_max: number;
    readonly ess_bulk_min: number;
    readonly divergences: number;
    readonly n_steps_mean: number;
  };
  readonly seconds: number;
}

type Spawn = Parameters<typeof workers.parallel_sample>[3];
type Progress = (event: { chain: number; iteration: number }) => void;

/** Fit one model in worker chains. worker_module: the URL of a module that runs browser_worker_entry with load_model. */
export async function fit(spec: FitSpec, settings: SamplerSettings, worker_module: string, spawn: Spawn,
  on_progress?: Progress, target_accept = settings.target_accept): Promise<FitResult> {
  const began = performance.now();
  const result = await workers.parallel_sample(
    build_from_spec(spec),
    { module: worker_module, export_name: "load_model", argument: JSON.stringify(spec) },
    {
      tune: settings.tune, draws: settings.draws, chains: settings.chains, seed: settings.seed,
      target_accept, adaptation: "nutpie", concurrency: settings.concurrency, cache: false,
      ...(on_progress ? { on_progress } : {}),
    },
    spawn,
  );
  const seconds = (performance.now() - began) / 1000;

  const draws: FitResult["draws"] = {};
  for (const p of [...result.parameters, ...result.deterministics]) {
    if (!KEEP[spec.kind].includes(p.name)) continue;
    const size = p.shape.reduce((a: number, b: number) => a * b, 1);
    const n = p.values.length / size;
    draws[p.name] = size === 1 && p.shape.length === 0 ? Array.from(p.values)
      : Array.from({ length: n }, (_, d) => Array.from(p.values.slice(d * size, (d + 1) * size)));
  }
  const rows = (diagnostics.summary(result, { include_deterministics: true }) as unknown as
    { rows: { name: string; r_hat: number; ess_bulk: number }[] }).rows;
  const checked = rows.filter((r) => Number.isFinite(r.r_hat));
  const steps = result.chains.flatMap((c) => Array.from(c.n_steps));
  return {
    draws,
    diagnostics: {
      r_hat_max: Math.max(...checked.map((r) => r.r_hat)),
      ess_bulk_min: Math.min(...checked.map((r) => r.ess_bulk)),
      divergences: Number(result.divergences),
      n_steps_mean: steps.reduce((a, b) => a + b, 0) / steps.length,
    },
    seconds,
  };
}
