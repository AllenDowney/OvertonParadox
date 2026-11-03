// Post 1's figures (overton/apc_figures.py), drawn from a run's fits as they finish.
// Each figure draws once the fits it needs are done; until then it says what it's waiting for.
// y-limits are post 1's, extended in steps of 10 if a reader's set puts the data outside them.

import { birth_color, survey_decade } from "./colors.ts";
import { COLORS, line_chart, type Series } from "./figures.ts";
import { BIRTH_DECADES, type Job, SURVEY_DECADES } from "./jobs.ts";
import type { summarize_period_cohort, summarize_series } from "./summaries.ts";

type SeriesOut = ReturnType<typeof summarize_series>;
type CohortOut = ReturnType<typeof summarize_period_cohort>;
export type Done = Map<Job, SeriesOut | CohortOut>;

/** The figures, in post 1's order, with the job groups each needs. */
export const FIGURES = [
  { id: "time_series", needs: ["period"] },
  { id: "age_series", needs: ["age"] },
  { id: "age_by_decade", needs: ["age_by_birth"] },
  { id: "trajectories", needs: ["period_cohort"] },
  { id: "cohort_component", needs: ["period_cohort"] },
  { id: "period_component", needs: ["period_cohort"] },
  { id: "pc_by_decade", needs: ["period_cohort_by_birth", "period_all"] },
] as const;

const GRAY = "var(--series-gray)";

/** Post 1's limits, widened by 10s only if a line (not just its band, which is clipped) goes outside them. */
function domain(fixed: readonly [number, number], series: readonly Series[]): [number, number] {
  let [lo, hi] = fixed;
  for (const s of series) for (const v of s.mean) {
    while (v < lo) lo -= 10;
    while (v > hi) hi += 10;
  }
  return [lo, hi];
}

const from_rows = (rows: SeriesOut["rows"], label: string, color: string, label_at: Series["label_at"]): Series => ({
  label, color, label_at, x: rows.map((r) => r.index), mean: rows.map((r) => r.mean),
  lo: rows.map((r) => r.lo84), hi: rows.map((r) => r.hi84),
});

function component(out: CohortOut, which: "period" | "cohort", label: string, color: string,
  label_at: Series["label_at"]): Series {
  const rows = out.components.filter((r) => r.component === which && (which === "period" || r.index >= 1900));
  return { label, color, label_at, x: rows.map((r) => r.index), mean: rows.map((r) => r.mean),
    lo: rows.map((r) => r.lo84), hi: rows.map((r) => r.hi84) };
}

/** Draw every figure whose fits are done; the others show what they're waiting for. */
export function draw_figures(containers: Record<string, HTMLElement>, jobs: readonly Job[], done: Done) {
  const group = (g: Job["group"]) => jobs.filter((j) => j.group === g);
  const ready = (needs: readonly Job["group"][]) => needs.every((g) => group(g).every((j) => done.has(j)));
  const out = <T>(j: Job) => done.get(j) as T;

  for (const { id, needs } of FIGURES) {
    const container = containers[id];
    if (!container || container.dataset.drawn === "1") continue;
    if (needs.some((g) => group(g).length === 0)) {
      // e.g. a set whose questions leave a subgroup without respondents, or a run without fits (?position)
      container.innerHTML = `<div class="waiting">Not available with these questions: no fits for this figure.</div>`;
      continue;
    }
    if (!ready(needs)) {
      const total = needs.reduce((n, g) => n + group(g).length, 0);
      const finished = needs.reduce((n, g) => n + group(g).filter((j) => done.has(j)).length, 0);
      container.innerHTML = `<div class="waiting">Waiting for ${total - finished} of ${total} fits…</div>`;
      continue;
    }
    container.dataset.drawn = "1";
    container.replaceChildren();

    if (id === "time_series") {
      const series = group("period").map((j) => {
        const g = j.label.replace("period ", "") as keyof typeof COLORS;
        return from_rows(out<SeriesOut>(j).rows, g, COLORS[g], "end");
      });
      // the level of the 1974 liberal (or the first year with data), dotted, over the range of the data
      const lib = series.find((s) => s.label === "Liberal");
      if (lib) {
        const i = lib.x.includes(1974) ? lib.x.indexOf(1974) : 0;
        series.unshift({ label: `${lib.x[i]} liberals' level`, color: GRAY, dotted: true, width: 1.5, label_at: null,
          x: [lib.x[0], lib.x[lib.x.length - 1]], mean: [lib.mean[i], lib.mean[i]] });
      }
      line_chart(container, { title: "Conservatism by self-identified ideology", kind: "time series",
        xlabel: "Survey year", xdomain: [1972, 2026], xstep: 10, ydomain: domain([20, 80], series), series });
    } else if (id === "age_series") {
      const jobs_ = group("age");
      const series = jobs_.map((j) => {
        const lo = Number(j.label.slice(4, 8));
        const decade = SURVEY_DECADES.findIndex(([a]) => a === lo);
        return from_rows(out<SeriesOut>(j).rows, `${Math.floor(lo / 10) * 10}s`, survey_decade(decade / 5), "end");
      });
      line_chart(container, { title: "Conservatism by age", kind: "age series", xlabel: "Age",
        xdomain: [16, 92], xstep: 10, ydomain: domain([30, 80], series), series });
    } else if (id === "age_by_decade") {
      const series = group("age_by_birth").map((j) => {
        const d = Number(j.label.match(/\d{4}/)![0]);
        const k = BIRTH_DECADES.indexOf(d);
        // early groups labeled where they start, late groups where they end (post 1)
        return from_rows(out<SeriesOut>(j).rows, `${d}s`, birth_color(k / 10), k < 4 ? "start" : "end");
      });
      line_chart(container, { title: "Conservatism by age and decade of birth", kind: "age series", xlabel: "Age",
        xdomain: [12, 92], xstep: 10, ydomain: domain([30, 70], series), series });
    } else if (id === "trajectories") {
      const pc = out<CohortOut>(group("period_cohort")[0]);
      const rows = pc.trajectories.filter((r) => r.cohort >= 1900);
      const first = Math.min(...rows.map((r) => r.cohort)), last = Math.max(...rows.map((r) => r.cohort));
      const first_year = Math.min(...rows.map((r) => r.year));
      const by = new Map<number, typeof rows>();
      for (const r of rows) by.set(r.cohort, [...(by.get(r.cohort) ?? []), r]);
      const series: Series[] = [...by].sort((a, b) => a[0] - b[0]).map(([c, rs]) => {
        rs.sort((a, b) => a.year - b.year);
        // label each decade where its line enters, unless it was there from the first survey
        const label_at = c % 10 === 0 ? (rs[0].year > first_year ? "start" : "end") : null;
        return { label: String(c), color: birth_color((c - first) / (last - first)), width: 1, label_at, plate: true,
          x: rs.map((r) => r.year), mean: rs.map((r) => r.mean) };
      });
      line_chart(container, { title: "Conservatism by birth year", kind: "cohort trajectories", xlabel: "Survey year",
        xdomain: [1970, 2031], xstep: 10, ydomain: domain([30, 70], series), series, hover: "nearest" });
    } else if (id === "cohort_component" || id === "period_component") {
      const which = id === "cohort_component" ? "cohort" : "period";
      const series = [component(out<CohortOut>(group("period_cohort")[0]), which, "", GRAY, null)];
      line_chart(container, which === "cohort"
        ? { title: "Conservatism by birth cohort", kind: "cohort component", xlabel: "Birth cohort",
          xdomain: [1895, 2012], xstep: 20, ydomain: domain([30, 70], series), series }
        : { title: "Conservatism within cohorts", kind: "period component", xlabel: "Survey year",
          xdomain: [1970, 2026], xstep: 10, ydomain: domain([30, 70], series), series });
    } else if (id === "pc_by_decade") {
      const series: Series[] = [];
      const all = group("period_all")[0];
      if (all) {
        const rows = out<SeriesOut>(all).rows;
        series.push({ label: "all respondents", color: GRAY, dotted: true, width: 2.5, label_at: null,
          x: rows.map((r) => r.index), mean: rows.map((r) => r.mean) });
      }
      for (const j of group("period_cohort_by_birth")) {
        const d = Number(j.label.match(/\d{4}/)![0]);
        const k = BIRTH_DECADES.indexOf(d);
        // early groups labeled where they end, late groups where they start (post 1)
        series.push(component(out<CohortOut>(j), "period", `${d}s`, birth_color(k / 10), k < 6 ? "end" : "start"));
      }
      line_chart(container, { title: "Conservatism within cohorts, by decade of birth", kind: "period component",
        xlabel: "Survey year", xdomain: [1965, 2031], xstep: 10, ydomain: domain([30, 70], series), series });
    }
  }
}
