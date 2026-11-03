// The measurement steps of the Overton pipeline, ported from Python:
// - code: responses to 1 (conservative), 0 (other), -1 (not asked or no answer);
//   overton/pipeline.py make_questions
// - em_difficulties: Rasch difficulties by weighted EM on the grid; overton/em.py
// - scores: posterior mean number of conservative responses; overton/drift.py
//   estimate_with_difficulties
// - respondents, yearly means and weighted cells; overton/apc.py prepare, weighted_cells
//
// Answers are an Int8Array, one row per respondent, one column per question.

import type { Excerpt } from "./excerpt.ts";

export type Codes = Record<string, readonly number[]>;

/** The scoring grid and prior: XS = linspace(-6, 6, 21), Normal(0, 4) normalized (overton/pipeline.py). */
export const XS = Float64Array.from({ length: 21 }, (_, k) => -6 + (12 * k) / 20);
export const PRIOR = (() => {
  const p = XS.map((x) => Math.exp(-0.5 * (x / 4) ** 2));
  const total = p.reduce((a, b) => a + b, 0);
  return p.map((x) => x / total);
})();

export interface Answers {
  readonly names: readonly string[];
  readonly rows: number;
  readonly values: Int8Array; // rows x names.length, row-major
}

const expit = (x: number) => 1 / (1 + Math.exp(-x));

export function code(excerpt: Excerpt, codes: Codes): Answers {
  const names = Object.keys(codes);
  const q = names.length;
  const values = new Int8Array(excerpt.rows * q);
  names.forEach((name, j) => {
    const column = excerpt[name];
    if (!column) throw new Error(`no question ${name} in the excerpt`);
    const conservative = new Set(codes[name]);
    for (let i = 0; i < excerpt.rows; i++) {
      const v = column[i];
      values[i * q + j] = v === -1 ? -1 : conservative.has(v) ? 1 : 0;
    }
  });
  return { names, rows: excerpt.rows, values };
}

export function answered(answers: Answers): Int32Array {
  const q = answers.names.length;
  const out = new Int32Array(answers.rows);
  for (let i = 0; i < answers.rows; i++) {
    let n = 0;
    for (let j = 0; j < q; j++) if (answers.values[i * q + j] !== -1) n++;
    out[i] = n;
  }
  return out;
}

/** Log likelihood of each respondent's answers at each grid point, plus the prior, normalized: the grid posterior. */
function grid_posterior(answers: Answers, d: ArrayLike<number>, rows: Int32Array): Float64Array {
  const q = answers.names.length;
  const g = XS.length;
  const logp = new Float64Array(q * g);
  const log1mp = new Float64Array(q * g);
  for (let j = 0; j < q; j++) {
    for (let k = 0; k < g; k++) {
      const p = expit(XS[k] - d[j]);
      logp[j * g + k] = Math.log(p);
      log1mp[j * g + k] = Math.log(1 - p);
    }
  }
  const out = new Float64Array(rows.length * g);
  const loglike = new Float64Array(g);
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r];
    loglike.fill(0);
    for (let j = 0; j < q; j++) {
      const a = answers.values[i * q + j];
      if (a === -1) continue;
      const table = a === 1 ? logp : log1mp;
      for (let k = 0; k < g; k++) loglike[k] += table[j * g + k];
    }
    let max = -Infinity;
    for (let k = 0; k < g; k++) if (loglike[k] > max) max = loglike[k];
    let total = 0;
    for (let k = 0; k < g; k++) {
      const p = Math.exp(loglike[k] - max) * PRIOR[k];
      out[r * g + k] = p;
      total += p;
    }
    for (let k = 0; k < g; k++) out[r * g + k] /= total;
  }
  return out;
}

/** The root of f on [lo, hi], f increasing or decreasing with a sign change, by bisection to machine precision. */
function bisect(f: (x: number) => number, lo: number, hi: number): number {
  let flo = f(lo);
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (mid === lo || mid === hi) break;
    const fm = f(mid);
    if (fm === 0) return mid;
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = mid;
      flo = fm;
    } else hi = mid;
  }
  return 0.5 * (lo + hi);
}

/**
 * Weighted EM difficulties (Bock and Aitkin), from the respondents in `rows`, with the
 * latent distribution fixed at PRIOR. Starts at -logit(weighted share conservative);
 * stops when no difficulty changes by more than tol.
 */
export function em_difficulties(answers: Answers, weights: ArrayLike<number>, rows: Int32Array,
  { tol = 1e-4, max_iter = 100 } = {}): Float64Array {
  const q = answers.names.length;
  const g = XS.length;
  const d = new Float64Array(q);
  for (let j = 0; j < q; j++) {
    let yes = 0, asked = 0;
    for (const i of rows) {
      const a = answers.values[i * q + j];
      if (a === -1) continue;
      asked += weights[i];
      yes += weights[i] * a;
    }
    const mean = yes / asked;
    d[j] = -Math.log(mean / (1 - mean));
  }
  // the M step's targets: weighted conservative answers per question (they don't change)
  const target = new Float64Array(q);
  for (const i of rows) for (let j = 0; j < q; j++) if (answers.values[i * q + j] === 1) target[j] += weights[i];
  // respondents with the same answers have the same posterior: EM runs on the distinct
  // answer patterns, with their weights summed, each listing only the questions answered
  // (as an offset into the log-probability table: conservative answers first, then others)
  const index = new Map<string, number>();
  const pattern_weight: number[] = [];
  const entries: number[][] = [];
  for (const i of rows) {
    const row = answers.values.subarray(i * q, (i + 1) * q);
    const key = String.fromCharCode(...row.map((a) => a + 1));
    let p = index.get(key);
    if (p === undefined) {
      p = pattern_weight.length;
      index.set(key, p);
      pattern_weight.push(0);
      const list: number[] = [];
      row.forEach((a, j) => a !== -1 && list.push((a === 1 ? 0 : q * g) + j * g));
      entries.push(list);
    }
    pattern_weight[p] += weights[i];
  }
  const starts = new Int32Array(entries.length + 1);
  entries.forEach((list, p) => (starts[p + 1] = starts[p] + list.length));
  const offsets = Int32Array.from(entries.flat());
  const table = new Float64Array(2 * q * g);
  const loglike = new Float64Array(g);
  const post = new Float64Array(g);
  const masses = new Float64Array(q * g);
  for (let iter = 0; iter < max_iter; iter++) {
    for (let j = 0; j < q; j++) {
      for (let k = 0; k < g; k++) {
        const p = expit(XS[k] - d[j]);
        table[j * g + k] = Math.log(p);
        table[q * g + j * g + k] = Math.log(1 - p);
      }
    }
    // E step and M-step sums in one pass: each pattern's posterior, added to the
    // weighted mass of every question it answered
    masses.fill(0);
    for (let p = 0; p < pattern_weight.length; p++) {
      loglike.fill(0);
      for (let e = starts[p]; e < starts[p + 1]; e++) {
        const o = offsets[e];
        for (let k = 0; k < g; k++) loglike[k] += table[o + k];
      }
      let max = -Infinity;
      for (let k = 0; k < g; k++) if (loglike[k] > max) max = loglike[k];
      let total = 0;
      for (let k = 0; k < g; k++) {
        post[k] = Math.exp(loglike[k] - max) * PRIOR[k];
        total += post[k];
      }
      const scale = pattern_weight[p] / total;
      for (let k = 0; k < g; k++) post[k] *= scale;
      for (let e = starts[p]; e < starts[p + 1]; e++) {
        const o = offsets[e] % (q * g);
        for (let k = 0; k < g; k++) masses[o + k] += post[k];
      }
    }
    let change = 0;
    const next = new Float64Array(q);
    for (let j = 0; j < q; j++) {
      const mass = masses.subarray(j * g, (j + 1) * g);
      next[j] = bisect((dj) => {
        let s = 0;
        for (let k = 0; k < g; k++) s += mass[k] * expit(XS[k] - dj);
        return s - target[j];
      }, -10, 10);
      change = Math.max(change, Math.abs(next[j] - d[j]));
    }
    d.set(next);
    if (change < tol) break;
  }
  return d;
}

/** Posterior mean number of conservative responses, out of all the questions (blank ones included). */
export function scores(answers: Answers, d: ArrayLike<number>): Float64Array {
  const g = XS.length;
  const ns = new Float64Array(g);
  for (let j = 0; j < answers.names.length; j++) for (let k = 0; k < g; k++) ns[k] += expit(XS[k] - d[j]);
  const all = Int32Array.from({ length: answers.rows }, (_, i) => i);
  const posterior = grid_posterior(answers, d, all);
  const out = new Float64Array(answers.rows);
  for (let i = 0; i < answers.rows; i++) {
    let s = 0;
    for (let k = 0; k < g; k++) s += posterior[i * g + k] * ns[k];
    out[i] = s;
  }
  return out;
}

/** Respondents who answered at least min_answered questions; for scoring, also known age and cohort. */
export function eligible(excerpt: Excerpt, count: Int32Array, min_answered: number, { scored = true } = {}): Int32Array {
  const rows: number[] = [];
  for (let i = 0; i < excerpt.rows; i++) {
    if (count[i] < min_answered) continue;
    if (scored && (excerpt.age[i] === -1 || excerpt.cohort[i] === -1)) continue;
    rows.push(i);
  }
  return Int32Array.from(rows);
}

export interface Scored {
  readonly rows: Int32Array; // indices into the excerpt
  readonly y: Float64Array; // share of the questions, 0 to 1
  readonly conservatism: Float64Array;
}

export interface Measurement extends Scored {
  readonly answers: Answers;
  readonly difficulties: Float64Array;
}

/** Minimum answered questions for a reader's set (Allen, 2026-11-03): 5, or 2 for fewer than 10 questions. */
export function min_answered_for(n_questions: number): number {
  return n_questions < 10 ? 2 : 5;
}

/** The whole measurement step for a reader's set: code, calibrate on the set, score. */
export function measure(excerpt: Excerpt, codes: Codes, min_answered: number): Measurement {
  const answers = code(excerpt, codes);
  const count = answered(answers);
  const difficulties = em_difficulties(answers, excerpt.weight, eligible(excerpt, count, min_answered, { scored: false }));
  return { answers, difficulties, ...score(excerpt, answers, count, difficulties, min_answered) };
}

export function score(excerpt: Excerpt, answers: Answers, count: Int32Array, d: ArrayLike<number>, min_answered: number): Scored {
  const all = scores(answers, d);
  const rows = eligible(excerpt, count, min_answered);
  const conservatism = Float64Array.from(rows, (i) => all[i]);
  return { rows, conservatism, y: conservatism.map((c) => c / answers.names.length) };
}

/** Weighted mean of y by year. */
export function yearly_means(excerpt: Excerpt, s: Scored): Map<number, number> {
  const sums = new Map<number, [number, number]>();
  s.rows.forEach((i, r) => {
    const t = sums.get(excerpt.year[i]) ?? [0, 0];
    t[0] += excerpt.weight[i] * s.y[r];
    t[1] += excerpt.weight[i];
    sums.set(excerpt.year[i], t);
  });
  return new Map([...sums].sort((a, b) => a[0] - b[0]).map(([year, [wy, w]]) => [year, wy / w]));
}

export interface Cells {
  readonly cohort: Int32Array;
  readonly year: Int32Array;
  readonly p_weighted: Float64Array;
  readonly var_weighted: Float64Array;
  readonly n: Int32Array;
  readonly n_eff: Float64Array;
}

/** Weighted mean, weighted variance, and Kish n_eff of y in each cohort x year cell, sorted by cohort then year. */
export function weighted_cells(excerpt: Excerpt, s: Scored): Cells {
  const groups = new Map<number, number[]>();
  s.rows.forEach((i, r) => {
    const key = excerpt.cohort[i] * 10000 + excerpt.year[i];
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  });
  const keys = [...groups.keys()].sort((a, b) => a - b);
  const out = {
    cohort: new Int32Array(keys.length), year: new Int32Array(keys.length), p_weighted: new Float64Array(keys.length),
    var_weighted: new Float64Array(keys.length), n: new Int32Array(keys.length), n_eff: new Float64Array(keys.length),
  };
  keys.forEach((key, c) => {
    const members = groups.get(key)!;
    let w = 0, w2 = 0, wy = 0;
    for (const r of members) {
      const wi = excerpt.weight[s.rows[r]];
      w += wi;
      w2 += wi * wi;
      wy += wi * s.y[r];
    }
    const mean = wy / w;
    let wv = 0;
    for (const r of members) wv += excerpt.weight[s.rows[r]] * (s.y[r] - mean) ** 2;
    out.cohort[c] = Math.floor(key / 10000);
    out.year[c] = key % 10000;
    out.p_weighted[c] = mean;
    out.var_weighted[c] = wv / w;
    out.n[c] = members.length;
    out.n_eff[c] = (w * w) / w2;
  });
  return out;
}
