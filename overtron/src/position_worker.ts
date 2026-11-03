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
    // the reference year: the first year with scored liberals, from 1974 on (overton/position.py)
    const rows = Array.from(scored.rows);
    const liberal_years = rows.filter((i) => excerpt.polviews[i] >= 1 && excerpt.polviews[i] <= 3).map((i) => excerpt.year[i]);
    if (!liberal_years.some((y) => y >= 1974) || !rows.some((i) => excerpt.year[i] === 2024))
      throw new Error("the selected questions score nobody in 2024, or no liberals from 1974 on");
    const ref_year = Math.max(Math.min(...liberal_years), 1974);
    const years = by_year(answers, excerpt, scored, d, ref_year);
    const head = headline(answers, excerpt, scored, d, { ref_year });
    self.postMessage({ ok: true, by_year: years, headline: head });
  } catch (error) {
    self.postMessage({ ok: false, error: String(error) });
  }
};
