// The question picker (docs/overtron_plan.md, milestone 5, design): presets as starting points,
// questions grouped by subject category (overton/question_categories.py) with a three-state
// select-all box and a count per category, p48 first in each, each question's span and status,
// and a coverage strip: how many selected questions were asked in each survey year.

import type { Excerpt, Question, QuestionTable } from "./excerpt.ts";
import { min_answered_for } from "./measure.ts";

export const PRESET_NAMES: Record<string, string> = {
  p48: "Decided pool (48)", social: "Social", econA: "Core economic (econ A)", book15: "The book's 15",
};
const THIN = 5; // fewer selected questions than this in a survey year is flagged
const MIN_RESPONDENTS = 100; // a question counts as asked in a year with at least this many answers

export interface PickerTable extends QuestionTable {
  readonly categories: readonly string[];
  readonly preset_settings: Record<string, { readonly min_answered: number }>;
  readonly questions: Record<string, Question & { category: string; first: number; last: number; waves: number }>;
}

/** For each question, the survey years in which it was asked (enough answers to count). */
export function years_asked(excerpt: Excerpt, names: readonly string[]): Map<string, Set<number>> {
  const out = new Map<string, Set<number>>();
  for (const v of names) {
    const column = excerpt[v];
    const counts = new Map<number, number>();
    for (let i = 0; i < excerpt.rows; i++) if (column[i] !== -1) counts.set(excerpt.year[i], (counts.get(excerpt.year[i]) ?? 0) + 1);
    out.set(v, new Set([...counts].filter(([, n]) => n >= MIN_RESPONDENTS).map(([y]) => y)));
  }
  return out;
}

export class Picker {
  readonly selected = new Set<string>();
  private show_all = false;
  private readonly survey_years: number[];

  constructor(private readonly root: HTMLElement, private readonly table: PickerTable, private readonly excerpt: Excerpt,
    private readonly asked: Map<string, Set<number>>, private readonly on_change: () => void) {
    this.survey_years = [...new Set([...asked.values()].flatMap((s) => [...s]))].sort((a, b) => a - b);
    this.set_preset("p48");
  }

  /** The preset whose questions are exactly the selection, if any. */
  preset(): string | null {
    for (const [name, names] of Object.entries(this.table.presets))
      if (names.length === this.selected.size && names.every((v) => this.selected.has(v))) return name;
    return null;
  }

  set_preset(name: string) {
    this.selected.clear();
    for (const v of this.table.presets[name]) this.selected.add(v);
    this.render();
  }

  /** The minimum answers per respondent for the selection: a preset's, or the rule for a reader's set. */
  min_answered(): number {
    const name = this.preset();
    return name ? this.table.preset_settings[name].min_answered : min_answered_for(this.selected.size);
  }

  /** Respondents in each survey year with at least `min` answers to the selected questions (the ones scored). */
  private scored_by_year(min: number): Map<number, number> {
    const ex = this.excerpt;
    const answered = new Int32Array(ex.rows);
    for (const v of this.selected) {
      const column = ex[v];
      for (let i = 0; i < ex.rows; i++) if (column[i] !== -1) answered[i]++;
    }
    const out = new Map<number, number>();
    for (let i = 0; i < ex.rows; i++)
      if (answered[i] >= min && ex.age[i] !== -1 && ex.cohort[i] !== -1) out.set(ex.year[i], (out.get(ex.year[i]) ?? 0) + 1);
    return out;
  }

  /**
   * Questions asked in each survey year (the bars), and what follows: years where nobody has the
   * minimum answers drop out (counted exactly, from the respondents); in sets of 10 or more, years
   * with fewer than THIN questions are thin; the headline's reference year is the first from 1974
   * on with scored liberals (as in overton/position.py; here, scored respondents).
   */
  coverage() {
    const years = this.survey_years;
    const counts = years.map((y) => [...this.selected].filter((v) => this.asked.get(v)?.has(y)).length);
    const min = this.min_answered();
    const scored = this.scored_by_year(min);
    const dropped = years.filter((y) => !scored.get(y));
    const thin = this.selected.size >= 10 ? years.filter((_, k) => counts[k] >= min && counts[k] < THIN) : [];
    const ref_year = years.find((y) => y >= 1974 && !dropped.includes(y)) ?? null;
    return { years, counts, min, dropped, thin, ref_year, last_ok: !dropped.includes(2024) };
  }

  private visible(v: string) {
    return this.show_all || this.table.questions[v].in_p48 || this.selected.has(v);
  }

  render() {
    const q = this.table.questions;
    this.root.replaceChildren();
    const top = div("picker-top");
    const presets = div("presets");
    presets.append("Start from: ");
    for (const [name, label] of Object.entries(PRESET_NAMES)) {
      if (!this.table.presets[name]) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.className = this.preset() === name ? "preset active" : "preset";
      b.onclick = () => this.changed(() => this.set_preset(name));
      presets.append(b);
    }
    const toggle = document.createElement("label");
    toggle.className = "show-all";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = this.show_all;
    box.onchange = () => {
      this.show_all = box.checked;
      this.render();
    };
    toggle.append(box, ` Show the ${Object.values(q).filter((x) => !x.in_p48).length} questions outside p48`);
    top.append(presets, toggle);
    this.root.append(top);

    for (const category of this.table.categories) {
      const names = Object.keys(q).filter((v) => q[v].category === category)
        .sort((a, b) => Number(q[b].in_p48) - Number(q[a].in_p48));
      const shown = names.filter((v) => this.visible(v));
      if (!shown.length) continue;
      const n_selected = names.filter((v) => this.selected.has(v)).length;
      const details = document.createElement("details");
      details.className = "category";
      details.open = (this.root.dataset.open ?? "").split("|").includes(category);
      details.ontoggle = () => {
        const open = new Set((this.root.dataset.open ?? "").split("|").filter(Boolean));
        if (details.open) open.add(category);
        else open.delete(category);
        this.root.dataset.open = [...open].join("|");
      };
      const summary = document.createElement("summary");
      const all = document.createElement("input");
      all.type = "checkbox";
      const shown_selected = shown.filter((v) => this.selected.has(v)).length;
      all.checked = shown_selected === shown.length;
      all.indeterminate = shown_selected > 0 && shown_selected < shown.length;
      all.setAttribute("aria-label", `Select all shown in ${category}`);
      all.onclick = (e) => e.stopPropagation();
      all.onchange = () => this.changed(() => {
        for (const v of shown) all.checked ? this.selected.add(v) : this.selected.delete(v);
      });
      summary.append(all, ` ${category} `, span("count", `${n_selected} of ${names.length} selected`));
      details.append(summary);
      const list = div("questions");
      for (const v of shown) {
        const row = document.createElement("label");
        row.className = "question";
        const check = document.createElement("input");
        check.type = "checkbox";
        check.checked = this.selected.has(v);
        check.onchange = () => this.changed(() => (check.checked ? this.selected.add(v) : this.selected.delete(v)));
        const info = q[v];
        const status = info.in_p48 ? "p48" : `not in p48: ${info.excluded_because.join(", ")}`;
        row.title = String(info.question ?? "");
        row.append(check, span("desc", ` ${info.description} `), span("meta",
          `${v} · ${info.first}–${info.last}, ${info.waves} waves · ${status}`));
        list.append(row);
      }
      details.append(list);
      this.root.append(details);
    }
    this.root.append(this.coverage_strip());
  }

  private changed(update: () => void) {
    update();
    this.render();
    this.on_change();
  }

  private coverage_strip(): HTMLElement {
    const { years, counts, min, dropped, thin, ref_year, last_ok } = this.coverage();
    const wrap = div("coverage");
    const total = this.selected.size;
    const head = div("coverage-head");
    head.textContent = `${total} question${total === 1 ? "" : "s"} selected. Questions asked in each survey year:`;
    wrap.append(head);
    const W = 640, H = 70, max = Math.max(1, ...counts);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Selected questions asked in each survey year");
    const bw = W / years.length;
    years.forEach((y, k) => {
      const h = (counts[k] / max) * (H - 22);
      const r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      r.setAttribute("x", String(k * bw + 1));
      r.setAttribute("y", String(H - 14 - h));
      r.setAttribute("width", String(bw - 2));
      r.setAttribute("height", String(Math.max(h, 1)));
      r.setAttribute("rx", "2");
      r.setAttribute("class", dropped.includes(y) ? "bar dropped" : thin.includes(y) ? "bar thin" : "bar");
      const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
      t.textContent = `${y}: ${counts[k]} question${counts[k] === 1 ? "" : "s"}`;
      r.append(t);
      svg.append(r);
      if (y % 10 === 0 || k === 0 || k === years.length - 1) {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", String(k * bw + bw / 2));
        label.setAttribute("y", String(H - 2));
        label.setAttribute("text-anchor", k === 0 ? "start" : k === years.length - 1 ? "end" : "middle");
        if (k === 0) label.setAttribute("x", String(k * bw + 1));
        if (k === years.length - 1) label.setAttribute("x", String(W - 1));
        label.setAttribute("class", "tick");
        label.textContent = String(y);
        svg.append(label);
      }
    });
    wrap.append(svg);
    const notes: string[] = [];
    if (total < 2) notes.push("Select at least 2 questions.");
    const list = (ys: number[]) => (ys.length > 8 ? `${ys.slice(0, 8).join(", ")}, …` : ys.join(", "));
    if (total >= 2 && dropped.length)
      notes.push(`Respondents need at least ${min} answers, so nobody can be scored in ${dropped.length} survey ` +
        `year${dropped.length === 1 ? "" : "s"} (${list(dropped)}); ${dropped.length === 1 ? "it drops" : "they drop"} out of the results.`);
    if (thin.length)
      notes.push(`Fewer than ${THIN} selected questions in ${thin.length} survey year${thin.length === 1 ? "" : "s"} ` +
        `(${list(thin)}): estimates for ${thin.length === 1 ? "that year rest" : "those years rest"} on few questions.`);
    if (total >= 2 && (ref_year === null || !last_ok))
      notes.push("The relative-position headline can't be computed: it needs respondents in 2024 and in a year from 1974 on.");
    else if (total >= 2 && ref_year !== 1974)
      notes.push(`The relative-position headline will use the median ${ref_year} liberal, the first year with enough questions.`);
    const note = div(notes.length ? "coverage-note warn" : "coverage-note");
    note.textContent = notes.length ? notes.join(" ")
      : "Every survey year has enough questions (bars: selected questions asked that year).";
    wrap.append(note);
    return wrap;
  }
}

function div(className: string) {
  const d = document.createElement("div");
  d.className = className;
  return d;
}

function span(className: string, text: string) {
  const s = document.createElement("span");
  s.className = className;
  s.textContent = text;
  return s;
}
