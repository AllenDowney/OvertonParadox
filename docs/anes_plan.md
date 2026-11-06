# ANES replication: plan

Board: Task 5. Planned 2026-11-06. Status: data built and first fits done (2026-11-06). Next: reruns for sampling, relative position, the mode difference.

## Goal

Replicate the main GSS results in the ANES, with the same pipeline as far as the data allow:

- the age gradient in each decade;
- within-cohort change from the period–cohort model;
- self-identified ideology relative to the moving center.

The point is an independent check for the paper (Task 4), not a second analysis with its own choices. Where the ANES forces a different choice, record why.

## What exists

- `~/WorldviewANES/anes_overton.ipynb`: an earlier search for controversial ANES questions. `docs/plan.md` Phase 5 refers to `examples/anes_overton`, which isn't in this repo; the notebook in WorldviewANES appears to be the copy that matters. Not yet reviewed against the current pipeline.
- `~/WorldviewANES/anes_timeseries_cdf_stata_20220916.dta`: the cumulative data file (CDF), release of 2022-09-16, through 2020. It has codebooks.
- `~/WorldviewANES/anes_timeseries_2024_stata_20250219.dta`: the 2024 time series, a separate file with its own variable names.
- The counterpart of `polviews` is `VCF0803`, the 7-point liberal–conservative scale.

## Steps

1. **Feasibility (first, small).** In the CDF, list the attitude items and the years each was asked. Count how many meet a span-and-frequency rule like the GSS one. The ANES has far fewer repeated items than the GSS, so this determines whether the replication is worth doing, and whether the selection rule needs adapting. Report the counts before going further.
2. **Data.** Check for a CDF release that includes 2024. Otherwise, map the 2024 variables onto CDF names for the selected items. Record the source files and dates.
3. **Specification, for Allen to decide.** Each choice gets a recorded rationale:
   - Years: presidential years only, or midterms too.
   - Weights: which CDF weight.
   - Mode: the ANES added web interviews from 2012 on, mostly web by 2020–2024. Whether to handle mode the same way as for the GSS (face-to-face only) depends on sample sizes.
   - Item coding: which response is coded conservative.
4. **Pipeline.** Run the same steps as for the GSS: selection, EM difficulties, scores, the period–cohort model, and relative position. No method changes without discussion.
5. **Comparison.** Put the ANES and GSS results side by side, and decide whether the ANES appears in the paper, the appendix, or both.

## Feasibility (2026-11-06)

`scripts/anes_coverage.py` counts, for each CDF variable, the survey years with a non-missing response. It reads the file in chunks: 9 seconds and 350 MB.

**The CDF (2022 release) has 21 survey years from 1972 to 2020:** biennial through 2004, then 2008, 2012, 2016 and 2020. 2024 is not in it. Half the years is 11.

**Pool.** 640 variables pass the GSS pool rule (at least 8 waves, spanning at least 15 years, from 1972 on). Almost all of them are IDs, weights, demographics, placements of candidates and parties, or contact with House candidates. By hand, **about 37 are attitude or policy questions**:

- Economic and role of government: health insurance (`VCF0806`, 14 years), guaranteed jobs (`VCF0809`, 20), services–spending (`VCF0839`, 15), government too strong (`VCF0829`, 8), less government (`VCF9131`, 8), import limits (`VCF9231`, 10), and federal spending on the poor (`VCF0886`, 9), crime (`VCF0888`, 11), schools (`VCF0890`, 13), welfare (`VCF0894`, 10), food stamps (`VCF9046`, 8), the environment (`VCF9047`, 13), space (`VCF9048`, 9) and Social Security (`VCF9049`, 14).
- Race: aid to Blacks (`VCF0830`, 20), civil rights too fast (`VCF0814`, 9), school integration (`VCF0816`, 8), affirmative action (`VCF0867`, 12), fair jobs for Blacks (`VCF9037`, 9), and the racial-resentment battery (`VCF9040`–`9042`, 11–12).
- Social and moral: women's equal role (`VCF0834`, 16), abortion (`VCF0838`, 16), the moral-traditionalism battery (`VCF0851`–`0853`, 12–13), gay job protection (`VCF0876`, 9), immigration level (`VCF0879`, 9–10), and the death penalty (`VCF9236`, 12).
- Egalitarianism battery (`VCF9013`–`9018`, 11–14).
- Defense spending (`VCF0843`, 14).
- Not counted: religion items (`VCF0846`, `0847`, `0850`, `VCF9243`), the self-placement items (`VCF0803`, `0824`, `0849`), and perceptions such as `VCF0813` and `VCF0848`.

**Coverage.** About 25 of these meet the stricter coverage rule (11 of 21 years). After one question per battery (egalitarianism, moral traditionalism, racial resentment), that leaves **about 16**. The GSS has 53.

**What it means.**

- The pool is small but usable for a single score. It leans economic and racial. On the social side only abortion, women's role, moral traditionalism and the death penalty meet the stricter rule, so a social/economic split would be thin on the social side.
- Several batteries start in the mid-1980s (moral traditionalism, egalitarianism, racial resentment), so the 1970s rest on about 8 questions. The connectivity across decades needs checking, as it was for the GSS.
- The counts include "don't know" and "not ascertained" codes the CDF stores as numbers, so marginal items may fall below the thresholds once those are recoded.
- The step after this is the association with `VCF0803`, the same ranking the GSS selection uses, to see how many of the ~37 actually separate liberals from conservatives.

The coverage table for all 1,030 variables is regenerated by `python -I scripts/anes_coverage.py <cdf.dta> <out.csv>` and is not committed.

### Relaxed criteria (Allen, 2026-11-06)

The ANES runs less often than the GSS, so the wave requirements are halved: at least 4 waves to enter the pool (instead of 8), and at least 6 of the 21 years for coverage (instead of 11). The 15-year span is unchanged.

- 722 variables pass the relaxed pool rule. In the issue block, 14 more attitude questions come in: gays in the military (`VCF0877`, 6 years), gay adoption (`VCF0878`, 7), foreign-aid spending (`VCF0892`, 6), spending on assistance to Blacks (`VCF9050`, 7), "government too involved" (`VCF9133`, 7, same battery as `VCF9131`), the child-rearing battery (`VCF9246`–`9249`, 7), national goals (`VCF9019`–`9020`, 6), urban unrest (`VCF0811`, 4), environmental regulation (`VCF0842`, 4), and "Blacks' influence" (`VCF9274`, 4). The last three fail the 6-year coverage rule.
- **With one question per battery:** 37 candidates, of which **34 meet the relaxed coverage rule** (16 under the strict rule). By domain: economic and government 15 (strict: 7), race 7 (3), social and moral 10 (4), other 2 (2).
- **Questions per year in the relaxed set:** 1972: 9, 1974: 4, 1976: 8, 1978: 6, 1980: 8, 1982: 6, 1984: 18, 1986: 17, 1988: 23, 1990: 21, 1992: 33, 1994: 20, 1996: 24, 1998: 11, 2000: 30, 2002: 8, 2004: 27, 2008: 28, 2012: 25, 2016: 24, 2020: 22. Under the strict rule it is 3–6 per year before 1984 and 14–16 after.
- **What it means.** The relaxed set is about twice as large and better balanced. The social side now has abortion, women's role, moral traditionalism, three gay-rights questions, immigration, the death penalty and child-rearing values, so a social/economic split is possible. The 1970s are still thin (4–9 questions a year, mostly economic and race), and many of the added questions start in 1984 or 1992. The scores in the early years will rest on few questions, and the connectivity check matters more here than in the GSS. Midterm years (1974, 1978, 1982, 1998, 2002) have fewer questions than presidential years.
- **Still the same caveat:** the counts include "don't know" and "not ascertained" codes, so borderline questions may fall below 6 years once those are recoded.

### Relaxed again: 4 waves (Allen, 2026-11-06)

Coverage is now at least 4 of the 21 years, the same as the pool rule; the span is still at least 15 years. This adds back the three questions asked exactly 4 times:

- urban unrest (`VCF0811`: 1972, 1974, 1976, 1992);
- environmental regulation (`VCF0842`: 1996, 1998, 2000, 2020);
- "Blacks' influence in American life and politics" (`VCF9274`: 1972, 1974, 1976, 2000).

**With one question per battery: 37 candidates.** By domain: economic and government 16, race 9, social and moral 10, other 2.

**Questions per year:** 1972: 11, 1974: 6, 1976: 10, 1978: 6, 1980: 8, 1982: 6, 1984: 18, 1986: 17, 1988: 23, 1990: 21, 1992: 34, 1994: 20, 1996: 25, 1998: 12, 2000: 32, 2002: 8, 2004: 27, 2008: 28, 2012: 25, 2016: 24, 2020: 23.

Two of the three added questions help the 1970s, the thinnest period, which gains 1–2 questions a year. But each spans a long gap with one late wave, so it does little to link the 1970s to later years. The connectivity check will show whether they matter.

## Coding and ranking (2026-11-06)

`scripts/anes_ranking.py` applies the GSS steps (`overton/coding.py`, `overton/ranking.py`) to the 37 candidates and the other members of their batteries, 51 questions in all. It takes 10 seconds and about 1 GB.

- **Missing:** for every candidate, codes ≤ 0, 8 and 9 (DK, NA, refused, inapplicable, "depends"). For the spending items, "cut out entirely" (7) is a position, and sorts after "decreased".
- **Groups:** `VCF0803` 1–3 (liberal) vs 5–7 (conservative); 9 ("haven't thought") and 0 are missing.
- **Coding:** the best contiguous cut of the ordered responses. National goals (`VCF9019`) is not an ordered scale; it is coded by response (the responses conservatives choose more) and flagged.
- **Score:** weighted logit(conservative ~ year + cohort + libcon), with cohort = year − age (`VCF0101`), weights `VCF0009z` scaled to mean 1.

**Results.** All 51 have positive coefficients, so every coded split goes in the expected direction. The coefficients run from 0.84 (environmental regulation) down to 0.14 (foreign-aid spending), with a median around 0.43. That's much larger than in the GSS, where the median among 170 candidates is 0.17 and the maximum 0.44. That's expected: the ANES issue scales were written as ideological scales, and dropping the many "haven't thought" respondents leaves a more sophisticated group.

**The GSS has no coefficient cutoff.** The pool is every ranked candidate that passes coverage, topic, stability and drift (`overton/larger_sets.py`), so the ANES pool would be all 37, with one question per battery, the highest-ranked:

- egalitarianism: `VCF9017` (0.52);
- moral traditionalism: `VCF0853` (0.60);
- racial resentment: `VCF9041` (0.52);
- child-rearing: `VCF9249` (0.37);
- limited government: `VCF9131` (0.62).

The weakest questions in the pool are foreign aid (`VCF0892`, 0.14), science spending (`VCF9048`, 0.15), crime spending (`VCF0888`, 0.16; conservative = increase), Social Security spending (`VCF9049`, 0.18), national goals (`VCF9019`, 0.20, nominal), import limits (`VCF9231`, 0.20; conservative = favor limits) and government too strong (`VCF0829`, 0.22).

**Open decisions (Allen):**

- **One per topic.** The GSS assigns topics by hand. Candidate topic groups in the ANES are the three gay-rights questions (`VCF0876` job protection, `VCF0877` military, `VCF0878` adoption), the three race-policy questions (`VCF0830` aid to Blacks, `VCF9037` fair jobs, `VCF9050` spending on assistance to Blacks), and the two health questions (`VCF0806` insurance scale), plus the role-of-government cluster (`VCF0839` services–spending, `VCF9131` limited government, `VCF0829` government too strong).
- **Stability and drift rules:** not yet applied. They need the period fits.
- **The self-placement denominator.** "Haven't thought" (`VCF0803` = 9) is 10–35% of respondents, depending on the year. In 2000, 52% have no self-placement at all, probably a form or mode split (to check); in 1972 it's 20% and in 2016 15%. The scores can include everyone, but the Overton comparisons by self-placement rest on the people who placed themselves, and that group changes from year to year. The GSS has much less of this.

| Year | 1972 | 1976 | 1980 | 1984 | 1988 | 1992 | 1996 | 2000 | 2004 | 2008 | 2012 | 2016 | 2020 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Placed (%) | 57 | 67 | 62 | 69 | 70 | 73 | 78 | 37 | 76 | 70 | 90 | 71 | 85 |
| Haven't thought (%) | 22 | 32 | 35 | 30 | 30 | 26 | 22 | 11 | 24 | 30 | 10 | 14 | 15 |

## Decisions (Allen, 2026-11-06)

- **Topics, following the GSS precedent** (`overton/topics.py` groups a policy scale with its spending items, such as `helpblk` with `natrace` and `helppoor` with `natfare`, but keeps `homosex` and `marhomo` as separate topics). At most one question per topic, the highest ranked:
  - welfare and the poor: `VCF0886`, `VCF0894`, `VCF9046`; keep `VCF0894` (welfare spending, 0.52);
  - government help for Black Americans: `VCF0830`, `VCF9037`, `VCF9050`; keep `VCF0830` (aid to Blacks, 0.50);
  - limited government: `VCF9131`, `VCF9133`, `VCF0829`; keep `VCF9131` (0.62);
  - the three gay-rights questions (`VCF0876`, `VCF0877`, `VCF0878`) stay separate topics.

  **Pool: 32 questions.**
- **Self-placement:** the scores include every respondent. The Overton comparisons use the respondents who placed themselves on `VCF0803`, and the share who did is reported for each year. Find out why 52% are missing in 2000.

## Data (2026-11-06)

- **We should have used the 1948–2024 CDF from the start.** CultureWar already uses it: `~/CultureWar/data/raw/anes_timeseries_cdf_stata_20260205.dta.gz`, a symlink to `~/ExtractANES/data/raw/`, released by ANES on 2026-02-05 ([codebook](https://electionstudies.org/anes_timeseries_cdf_codebook_var_20260205/)). Everything above this section used the old 2022-09-16 release in `~/WorldviewANES` (through 2020). That file was the only one I found, and I didn't check CultureWar.
- **Now:** the compressed file is copied to `data/anes_timeseries_cdf_stata_20260205.dta.gz` (gitignored; recorded in `data/README.md`). The scripts read it directly: pandas infers gzip from the extension. The coverage pass takes 24 s and 350 MB, and its output is identical to the run on the decompressed file.
- **The 2000 gap in self-placement is not mode.** About half of every mode is missing (`VCF0017`: in person 449 missing of 842, telephone 350 of 693). That looks like a questionnaire-form split, like the 1972 one ("form III, IV"). Check the codebook's note for `VCF0803`.

### Rerun on the 1948–2024 CDF

- **33 survey years** (1948–2024), so **22 from 1972 on**; 1,030 variables.
- **Coverage:** 33 of the 50 coded questions gain one year (2024), and 17 don't. Environmental regulation (`VCF0842`) now has 5 waves. Urban unrest and "Blacks' influence" still have 4. Every question still passes the 4-wave rule, so the candidate list is unchanged.
- **Coefficients:** all positive. Most change by less than 0.05; the largest changes are `VCF9040` (+0.15), `VCF9131` (−0.16), `VCF0830` (+0.11), `VCF9042` (+0.09) and `VCF9231` (+0.08).
- **A coding inconsistency in the CDF:** for `VCF0878` (gay adoption), 2024 uses code 2 for "No", where the label and earlier years use 5 (2024: 1 = 4,041, 2 = 1,130). The best cut happened to put 2 and 5 together on the conservative side, but the ANES code needs an explicit recode (2 → 5 in 2024), and other questions should be checked for similar 2024 code changes. `VCF9040` also has 245 cases coded −1 in 2024, which is unlabeled and treated as missing.
- **Close calls in the coding:** with 2024 added, the middle category moved to the conservative side for `VCF0830` (4), `VCF9040` and `VCF9042` ("neither"), and the volunteered "both" for `VCF9249`. These cuts were near zero, and the GSS review of close calls (`overton/coding.py`) applies.
- **Battery choices under "highest ranked":**
  - limited government flips to `VCF9133` (0.55; asked 7 times, last in 2016) over `VCF9131` (0.47; 9 times, through 2024);
  - racial resentment flips to `VCF9040` (0.64) over `VCF9041` (0.54);
  - moral traditionalism (`VCF0853`), egalitarianism (`VCF9017`), child-rearing (`VCF9249`), welfare (`VCF0894`) and aid to Blacks (`VCF0830`) are unchanged.

  The GSS breaks ties on span, but these aren't ties. The `VCF9133` flip trades coverage of 2020–2024 for a higher coefficient. **Decision for Allen.**

### Pool with priority for questions asked in 2024 (Allen, 2026-11-06)

**Rule:** within a topic or battery, take the highest-ranked question that was asked in 2024, as long as its coefficient is within 0.1 of the topic's best; otherwise take the best. The margin of 0.1 is a proposal, open to revision. It decides one case: limited government keeps `VCF9131` (0.47, through 2024) over `VCF9133` (0.55, last asked 2016). In every other topic, the best question was already asked in 2024. Questions that are their own topic stay in the pool whether or not they were asked in 2024, as in the GSS.

**The pool: 32 questions, 23 asked in 2024** (1948–2024 CDF; coefficients from `scripts/anes_ranking.py`; "conservative" is the coded side):

| Question | Domain | Topic | Coef | Conservative | Years | Span |
|---|---|---|---|---|---|---|
| `VCF0842` | econ |  | 0.85 | 4 5 6 7 | 5 | 1996–2024 |
| `VCF0806` | econ |  | 0.65 | 4 5 6 7 | 15 | 1972–2024 |
| `VCF9040` | race | racial resentment | 0.64 | 1 2 3 | 13 | 1986–2024 |
| `VCF0853` | social | moral traditionalism | 0.62 | 1 2 | 14 | 1986–2024 |
| `VCF0830` | race | government help for Black Americans | 0.61 | 4 5 6 7 | 21 | 1972–2024 |
| `VCF0878` | social |  | 0.59 | 2 5 | 8 | 1992–2024 |
| `VCF0838` | social |  | 0.58 | 1 2 3 | 17 | 1980–2024 |
| `VCF0839` | econ |  | 0.58 | 1 2 3 4 | 16 | 1982–2024 |
| `VCF0809` | econ |  | 0.57 | 5 6 7 | 21 | 1972–2024 |
| `VCF9017` | other | egalitarianism | 0.55 | 1 2 3 | 14 | 1984–2024 |
| `VCF0894` | econ | welfare and the poor | 0.54 | 3 | 11 | 1992–2024 |
| `VCF9047` | econ |  | 0.53 | 2 3 7 | 14 | 1984–2024 |
| `VCF0867` | race |  | 0.52 | 5 | 13 | 1986–2024 |
| `VCF0843` | other |  | 0.51 | 4 5 6 7 | 15 | 1980–2024 |
| `VCF0876` | social |  | 0.49 | 5 | 10 | 1988–2024 |
| `VCF9131` | econ | limited government | 0.47 | 1 | 9 | 1990–2024 |
| `VCF9274` | race |  | 0.47 | 1 2 | 4 | 1972–2000 |
| `VCF9236` | social |  | 0.44 | 1 | 13 | 1988–2024 |
| `VCF0877` | social |  | 0.44 | 5 | 6 | 1992–2012 |
| `VCF0811` | race |  | 0.43 | 3 4 5 6 7 | 4 | 1972–1992 |
| `VCF9249` | social | child-rearing | 0.42 | 2 3 | 8 | 1992–2024 |
| `VCF0890` | econ |  | 0.42 | 2 3 | 14 | 1984–2024 |
| `VCF0816` | race |  | 0.34 | 2 | 8 | 1972–2000 |
| `VCF0879` | social |  | 0.33 | 4 5 | 10 | 1992–2024 |
| `VCF0834` | social |  | 0.31 | 2 3 4 5 6 7 | 16 | 1972–2008 |
| `VCF0814` | race |  | 0.31 | 3 | 9 | 1972–1992 |
| `VCF9231` | econ |  | 0.28 | 1 | 11 | 1988–2024 |
| `VCF9019` | social |  | 0.20 | 1 3 | 6 | 1972–1992 |
| `VCF0888` | econ |  | 0.19 | 1 | 12 | 1984–2024 |
| `VCF9049` | econ |  | 0.17 | 2 3 7 | 15 | 1984–2024 |
| `VCF9048` | econ |  | 0.15 | 2 3 7 | 9 | 1984–2016 |
| `VCF0892` | econ |  | 0.14 | 3 | 6 | 1990–2008 |

### Audit of 2024 codes (2026-11-06)

For each of the 32 questions, the 2024 codes compared with the previous wave and with the value labels:

- **`VCF0878` (gay adoption): recode 2 → 5 in 2024.** That's the only real change. 2024 uses 2 for "No" (1,130 cases), where earlier years and the label use 5.
- **Code −1, unlabeled, 245 cases in 2024** on `VCF0806`, `VCF0809`, `VCF0842`, `VCF0843`, `VCF9040` and `VCF9236`. The count is the same on each, so it's one group of respondents who weren't asked, probably a subsample. It's treated as missing, like the other codes ≤ 0.
- The other "unlabeled" codes are the interior points (2–6) of the 7-point scales, which the CDF doesn't label. That's normal.
- Every other question uses the same codes in 2024 as in 2020.

### Build decisions (Allen, 2026-11-06)

- **Respondents:** keep everyone, including those without a self-placement on `VCF0803`. This is a stated departure from the GSS pipeline, which keeps only respondents who answered `polviews` (`overton/candidates.py`). The reason: in the ANES that group is 10–35% of respondents a year (about half in 2000), against few in the GSS. The Overton comparisons use the respondents who placed themselves.
- **Mode:** all modes in the main analysis. A refit on face-to-face respondents only, where there are any, is a sensitivity check.
- **Build:** `overton/anes_data.py` writes `data/anes_overton.hdf` with the pipeline's column names. A `--survey anes` option in `overton/em.py` and `overton/apc.py` switches only the input and output files; no method changes.

## First results (2026-11-06)

All 74 fits ran on Unity. 73 completed. One, the 1946–1964 age fit, failed on a stale NFS file handle in numba's cache, which is transient, and is being rerun.

**Headline, period–cohort model, 1972–2024 (points on the percent-conservative scale):**

| | GSS (`primary`) | ANES, all modes (decided) | ANES, interviewer-administered |
|---|---|---|---|
| Total change | −16.4 | −13.1 | −16.5 |
| Generational replacement | −11.8 | −10.5 | −10.5 |
| Change within cohorts | −4.6 | −2.6 | −5.9 |
| Within-cohort slope per decade [90%] | −0.82 [−0.97, −0.66] | −0.38 [−0.99, +0.20] | −1.07 [−1.71, −0.44] |
| Period model: slope per decade | −3.02 | −2.33 | |

- **The direction replicates.** Average conservatism falls, most of the decline is generational replacement (80% in the ANES, 72% in the GSS), and change within cohorts is toward liberal.
- **On all modes, the within-cohort slope is not credibly negative:** the interval includes 0. On the interviewer-administered sample it is, and the total matches the GSS almost exactly. The difference between the two ANES samples is a mode effect in 2016–2024, when most ANES respondents were online. That is worth a closer look: how web respondents differ, and whether that is composition or response.
- **Not yet computed:** relative position (`overton/position.py`) and the Overton comparisons by self-placement; figures.

**Sampling.** Most fits are clean. To rerun with longer tuning or a higher target acceptance, as for the GSS:

- the moderate-group period fits (`polviews3=Moderate`, `polviews=4`): R-hat 1.017, bulk ESS 304;
- several birth-group period–cohort fits with divergences, up to 227 in 24,000 draws (about 1%): 1990–1999, 1997–2012, 1910–1919, 1900–1909;
- the 1972–1979 age window (39 divergences).

The GSS standard was R-hat ≤ 1.009, bulk ESS ≥ 810, and up to 0.6% divergences in birth-group fits at target acceptance 0.995.

**Variation, minimum of 2 answered questions (Allen, 2026-11-06):** prepared for both surveys. The GSS `primary` goes from 64,632 to 66,075 respondents, and the ANES from 53,954 to 56,900. The first- and last-year means barely move. The main fits (8 per survey) are done, and **the minimum makes no material difference** in either survey:

| | GSS min 5 | GSS min 2 | ANES min 5 | ANES min 2 |
|---|---|---|---|---|
| Replacement | −11.8 | −11.75 | −10.5 | −10.36 |
| Within cohorts | −4.6 | −4.61 | −2.59 | −2.77 |
| Within-cohort slope per decade | −0.82 [−0.97, −0.66] | −0.84 [−1.00, −0.68] | −0.38 [−0.99, +0.20] | −0.44 [−1.06, +0.19] |
| Period change, liberals / moderates / conservatives | −18.7 / −18.5 / −10.2 | −18.7 / −18.5 / −10.2 | −18.6 / −16.3 / −3.0 | −18.8 / −16.0 / −2.4 |

The decided minimum of 5 stands. The rerun 1946–1964 age fit is clean (no divergences, R-hat 1.001).

**Note from the by-ideology fits:** ANES conservatives barely move (−3.0) while liberals move as much as in the GSS (−18.6). In the GSS conservatives move −10.2, so the ANES shows more divergence between the groups.

## Open questions

- Is there a newer CDF than 2022-09 (through 2024)? Not checked.
- How to handle the move to web interviewing, given the smaller face-to-face samples after 2012.
