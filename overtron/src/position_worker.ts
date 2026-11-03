// Relative position in a worker, alongside the model fits: the by-year percentiles and
// the headline with its bootstrap (src/position.ts). It loads the excerpt itself (the
// browser caches the fetch) and scores the set with the difficulties it's given.

import { load } from "./excerpt.ts";
import { answered, type Codes, code, score } from "./measure.ts";
import { by_year, headline } from "./position.ts";

export interface PositionRequest {
  readonly base: string;
  readonly codes: Codes;
  readonly difficulties: Record<string, number>;
  readonly min_answered: number;
}

self.onmessage = async (event: MessageEvent<PositionRequest>) => {
  const { base, codes, difficulties, min_answered } = event.data;
  try {
    const { excerpt } = await load(base);
    const answers = code(excerpt, codes);
    const d = answers.names.map((v) => difficulties[v]);
    const scored = score(excerpt, answers, answered(answers), d, min_answered);
    const years = by_year(answers, excerpt, scored, d);
    const head = headline(answers, excerpt, scored, d);
    self.postMessage({ ok: true, by_year: years, headline: head });
  } catch (error) {
    self.postMessage({ ok: false, error: String(error) });
  }
};
