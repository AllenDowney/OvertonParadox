// EM difficulties for a reader's question set (decision 4: calibrated on the set itself), in a
// worker so the page stays responsive: about 25 s for 48 questions, much less for small sets.

import { load } from "./excerpt.ts";
import { answered, type Codes, code, eligible, em_difficulties } from "./measure.ts";

export interface CalibrateRequest {
  readonly base: string;
  readonly codes: Codes;
  readonly min_answered: number;
}

self.onmessage = async (event: MessageEvent<CalibrateRequest>) => {
  const { base, codes, min_answered } = event.data;
  try {
    const { excerpt } = await load(base);
    const answers = code(excerpt, codes);
    const rows = eligible(excerpt, answered(answers), min_answered, { scored: false });
    const d = em_difficulties(answers, excerpt.weight, rows);
    self.postMessage({ ok: true, difficulties: Object.fromEntries(answers.names.map((v, j) => [v, d[j]])) });
  } catch (error) {
    self.postMessage({ ok: false, error: String(error) });
  }
};
