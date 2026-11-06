# Overton update: phase history

Moved verbatim from `docs/plan.md` on 2026-11-06, when work items moved to `PROJECT_BOARD.md`. The unchecked items below are carried over to the board: the revised selection to Task 6, the data build and cleanup to Task 7, the difficulties follow-ups and variations to Task 8, the ANES replication to Task 5, figure fine-tuning to Task 3, and headline framing to Tasks 3 and 4. This file is kept as a record and isn't updated.

### Phase 1. Bring in the data

- Copy (or link) the 2024 R3a extract from CultureWar into `data/`. Record the source file and date.
- Check coding of the fifteen questions and `polviews` in the new extract against the codebook, especially 2021–2024 (mode changes: 2021 web, 2022 and 2024 mixed mode).
- Weights: make weighted resamplings from `wtsmerge`, and also run with direct weights as a check.

**Result (2026-10-30):**

- `notebooks/overton/data.py` copies the extract to `data/gss_extract_2024_r3a.hdf` (from `~/CultureWar/notebooks/gss_extract_2024_r3a.hdf`, dated 2026-10-18) and writes `data/gss_overton_resampled_2024.hdf` (keys `gss0`–`gss2`, 75,699 rows, all 404 columns, 56 MB).
- Weights: the book's file used `wtssall.fillna(wtssps)` (GssExtract), which is exactly `wtsmerge`. So `wtsmerge` reproduces the book's method. The 2022 weights match exactly. `wtssnrps` (nonresponse-adjusted, 2004 on) is a possible alternative for the direct-weighting check.
- Codes: all fifteen questions and `polviews` use the same response codes as the book's file, and invalid codes are already NaN. Age 18–89 (89 = 89 and older), cohort 1883–2006.
- Old vs new, percent conservative by year and question, averaged over the three resamplings: identical for 1972–2021, because the same seeds draw the same rows. 2022 differs by up to 2.5 points (`abany`). That's resampling noise, since the raw 2022 `abany` counts are identical. One real revision: `racopen` has about twice as many 2022 responses in R3a (1,173 vs 588).
- Not asked in 2021: `prayer`, `grass`, `divlaw`, `racopen`, `fepol`.
- **2024 moves back toward conservative** on several questions compared with 2022 (percent conservative): `homosex` 37→45, `prayer` 46→53, `grass` 27→33, `racopen` 13→19, `fepol` 15→18. Possible causes: a real change, or a mode effect (2024 was mixed mode; the extract has no mode variable). Check in Phase 2.
- The book's local data file runs through 2022 (72,390 rows), although the chapter text says 2021. Phase 2's baseline is that file.
- For the final notebook, the data has to be downloadable (the chapter downloads from PoliticalAlignmentCaseStudy on GitHub). Decide where to host it later.

### Phase 2. Rerun the existing pipeline on the new data

- Factor the pipeline out of `notebooks/overton.md` into a script (no method changes).
- Reproduce the book's figures from the old data first, to confirm the script matches the chapter.
- Run on the new extract. Compare each figure and the key numbers with the book: what changed, what held.
- Short note on the result in this file.

**Result, first run (2026-10-30):**

- `notebooks/overton/pipeline.py` is the chapter's pipeline as functions, with no method changes. It prints the chapter's key numbers for each dataset (`figs/key_numbers.csv`) and saves the chapter's figures in `figs/<label>/` (`book`, `new`).
- **Reproduction:** on the book's file (`gss0`), every key number matches the saved notebook outputs: mean conservatism 6.833, Con−Lib gap by question 11.4–28.0, age slopes 7 negative / 0 positive of 12 cohorts, smoothed conservatism 7.96 → 5.09, cohort/year ratio 3.34, Con−Lib gap 2.47 (1974) → 3.89 (2021), Moderate 2000 6.76, Conservative 2021 6.99.
- **New data (through 2024), three resamplings:** the main results hold.
  - Smoothed conservatism 8.0 → 5.0–5.1.
  - Age slopes 7–8 negative / 0 positive; year slopes 8–9 negative / 0 positive.
  - Cohort/year ratio 2.9–3.4 (book 3.3).
  - Overton figure: Liberal 1974 ≈ 6.4, Moderate 2000 ≈ 6.75, Conservative 2024 ≈ 6.9–7.2.
  - The Con−Lib gap keeps growing: 4.2–4.3 in 2024.
  - The variation between resamplings is not small (e.g., Conservative 2021: 7.09–7.26), so report ranges.
- **Yearly means (average of three resamplings):**

  | Year | All | Conservative | Moderate | Liberal | Questions answered |
  |------|-----|--------------|----------|---------|--------------------|
  | 2018 | 5.21 | 6.94 | 5.00 | 3.32 | 9.6 |
  | 2021 | 5.40 | 7.79 | 5.27 | 3.13 | 6.3 |
  | 2022 | 5.00 | 7.00 | 4.84 | 2.81 | 7.7 |
  | 2024 | 5.29 | 7.66 | 4.67 | 2.93 | 7.2 |

  The overall trend paused or reversed in 2024, mostly because self-identified conservatives moved toward conservative responses. Respondents answered fewer of the fifteen questions after 2018, so the estimates lean more on the prior. Ricardo's pooling point matters more for these years.
- **Mode (2021–2024).** `mode` is not in the extract. I read it from the raw R3a file (`~/CultureWar/data/raw/gss7224_r3a.dta.gz`) into `data/gss_mode_2021_2024.csv` (`year`, `id`, `mode`). It should probably be added to the CultureWar extract.
  - 2021 was almost all web. In 2022 and 2024, about half the respondents were in person and half on the web (2022: 1,562 in person / 1,633 web; 2024: 1,174 / 1,762).
  - **Five of the fifteen questions (`grass`, `prayer`, `divlaw`, `racopen`, `fepol`) were not asked on the web in 2022 or 2024, and were not asked at all in 2021.** Since 2022 their responses come only from in-person and phone respondents, who are a self-selected and different group.
  - The 2024 shift is concentrated among in-person respondents. `homosex`, percent conservative: in person 38 → 50, web 36 → 39. `abany`: in person 47 → 49, web 40 → 37. Conservative self-ID moved the other way (in person 36.9 → 32.2, web 32.0 → 36.3), so the composition of the two modes changed between 2022 and 2024.
  - Implications to discuss: the recent per-question trends for the five in-person questions aren't comparable with earlier years; the missing answers depend on mode, and mode is related to the responses; the 2024 uptick may be partly a composition or mode artifact.
- **Youngest cohorts.** The 1990s cohort's conservative self-ID (weighted) went 21% (2021) → 26% (2022) → 30% (2024), and liberal self-ID 42% → 39% → 29%. The book said the 1980s and 1990s cohorts showed no trend toward conservative identity, and for the 1990s that's no longer clear. The lowess curves in `overton2`/`overton7` exaggerate the end points; the 2000s cohort is too small to say anything (about 200 per year).
- **Checks (2026-10-30)** (`checks()` in `overton/pipeline.py`; yearly means in `figs/yearly_checks.csv`):
  - **Direct weighting:** the unresampled extract, with `wtsmerge` weights for the difficulties and yearly means, agrees with the resampled results within about 0.1 in every year and group (e.g., 2024 All 5.25 vs 5.29). So the resampling is fine; we can use either.
  - **Through 2018 only:** the book's results hold. Age slopes 6 negative / 0 positive of 11 cohorts; year slopes 8 / 0; smoothed conservatism 7.94 → 5.33; Liberal 1974 6.40, Moderate 2000 6.77, Conservative 2018 7.06.
  - **Drop the five in-person-only questions after 2018:** recent years rise by 0.3–0.4 (2022: 5.40 vs 5.00). A changing question set is not a problem in itself; the model is designed for it. The rise is a symptom of item drift (next bullet).
  - **Item drift (2026-10-30):** for the same respondents, holding the difficulties and the out-of-15 scale fixed, the estimate from the ten questions minus the estimate from all fifteen was about −0.1 in 1974–2008 (noisy), +0.2 in 2010–2016, +0.34 in 2018, +0.51 in 2022, and +0.39 in 2024. The sample is respondents with ≥3 of the five and ≥5 of the ten. On the logit scale, the five (`racopen`, `fepol`, `grass`, `prayer`, `divlaw`) went from about +0.3 relative to the ten in the 1980s–2000s to −0.5 in 2022. They moved toward liberal answers faster than the others. This is already visible by 2018, before the mode change.
    - Interpretation: the model handles any subset of questions if each question's difficulty is fixed. With drift, the estimate depends on which questions were answered. Random subsets (ballots) turn drift into noise; systematic changes in the question set (retirement, additions, mode-specific questions) turn it into bias. Questions are retired because they drifted to consensus, so retirement is correlated with drift by design. Mode since 2022 is a second example: web respondents never see the five fastest-moving questions.
  - **Drop the five in every year** (same ten questions throughout, scores out of 10):

    | Year | All | Conservative | Moderate | Liberal |
    |------|-----|--------------|----------|---------|
    | 2010 | 4.21 | 5.15 | 4.07 | 3.14 |
    | 2018 | 3.68 | 4.87 | 3.57 | 2.40 |
    | 2021 | 3.52 | 5.10 | 3.43 | 2.03 |
    | 2022 | 3.50 | 5.02 | 3.40 | 1.89 |
    | 2024 | 3.57 | 5.23 | 3.16 | 1.95 |

    With a consistent set, the overall decline continues through 2022 and flattens in 2024. In 2024, conservatives move toward conservative responses while moderates keep falling and liberals are flat, which looks more like polarization than a general shift. Within-cohort results still hold (age slopes 5 negative / 0 positive; year slopes 6 / 0).
  - **The question set changes the size of the Overton result.** With ten questions: Liberal 1974 4.09, Moderate 2000 4.35, Conservative 2024 5.02 (out of 10). The 2024 conservative is further from the 1974 liberal than with all fifteen. The five dropped questions (`racopen`, `fepol`, `grass`, `prayer`, `divlaw`) are among those that moved most. This feeds Phase 3: how much of the Overton result depends on which questions we choose?

### Phase 3. Question selection

- The concern (`~/CultureWar/book/overton.md`, "Liberal bias?"): preferring questions still asked in recent surveys favors questions that are still contentious and excludes those retired after opinion moved to consensus. That selects on the outcome.
- Possible approaches to discuss (not yet agreed):
  - Select by a rule that doesn't depend on survival: e.g., all questions that distinguish liberals and conservatives in their own years, including retired ones; let the IRT model handle missingness.
  - Sensitivity check: rerun with alternative sets (current only, retired included, random subsets) and see whether the main results move.
- Use the 404-column extract to widen the candidate list beyond the original ~120 variables.

**Step 1 result (2026-10-30):** `notebooks/overton/sensitivity.py`; details and figures in the lab notebook (`notebooks/docs/lab.md`).
- **Drift by question:** every question except `gunlaw` moved toward liberal responses. Slopes range from −0.51 log odds per decade (`homosex`) to +0.01 (`gunlaw`).
- **Directions hold for every question set:** in every leave-one-out run and every random set of 10, at most one cohort has a significant positive age or year slope, conservatism declines, and the Conservative−Liberal gap grows.
- **The size of the Overton result depends on the questions.** The Overton gap (Conservative 2024 − Liberal 1974, out of 15):
  - all 15 questions: 0.50–0.68 across the resamplings;
  - leave one out: 0.31–1.04;
  - random sets of 10: −1.27 to 1.54 (median 0.64).

  Fast-drifting sets give negative gaps; slow sets (`gunlaw`, `natenvir`, `letdie1`, `cappun`) give positive ones.

### Phase 4. Model comparison (Vieira)

- Recover the model and results from the talk (transcript; open question 1).
- Ricardo's models (from `overton/irt_mcmc.py`; same fifteen questions, 1PL / Rasch, difficulties estimated rather than fixed; fit to a random subsample of 5,000 respondents):
  - **m1, unpooled:** `d_j ~ N(0, 1)`, `e_i ~ N(0, 4)`, `logit p = e_i - d_j`.
  - **m2, hierarchical:** `e_i ~ N(0, e_std)`, `e_std ~ HalfNormal(4)`. Shrinks respondents who answered few questions; posterior `e_std` ≈ 0.9.
  - **m3, conservatism trend:** adds a linear year effect to `logit p` (one slope, on the index of the survey year, not the calendar year).
  - **m4, polarization trend:** also lets the spread of `e` change log-linearly with year (`log e_std = a + b * year_index`).
  - Imputation: posterior predictive count of conservative responses out of 15 for each respondent, and predicted probabilities by year and question for a new respondent.
- From the talk (`overton_talk_main_transcript.md`):
  - Framed as an "adversarial collaboration": same problem, grid vs MCMC. No winner declared; Ricardo's summary was that the grid is fast and good for iterating, while MCMC extends naturally to hierarchical and trend models but needs a GPU, a subsample, and diagnostics when it breaks.
  - My grid method as presented: point-estimate difficulties, then about 72,000 independent one-parameter posteriors in one array operation (under 0.1 s). Missing answers are filled with posterior predictive probabilities (`np.where`: observed where present, predicted where missing), and the trends use the filled-in data.
  - Ricardo's main argument: pooling. With about 72,000 respondents we learn the population spread, which should inform respondents who answered few questions. His example was respondent 309, who gave one answer in 1972. Predicted conservative responses out of 15: unpooled 11, hierarchical 7.8, trend model 9.2.
  - The estimated difficulties were very close to my heuristic ones.
  - The trend model's year effect was clearly negative. The polarization model is in the code only.
  - The subsample size is inconsistent: 47,000 in one place in the talk, 5,000 in the code and the pros and cons.
- Differences from mine to look at: estimated vs heuristic difficulties; fixed vs hierarchical prior on `e`; subsample vs all respondents; no weights; the year index treats unequal gaps between surveys as equal.
- Compare with mine on the same data and question set. Candidate directions, all to discuss first: implement his model in PyMC; extend mine (estimate difficulties instead of fixing them, add discrimination, let item parameters drift over time).
- No change to the book's method without agreement; record options here as "to consider".

### Phase 4b. Age, period, and cohort models of conservatism

Goal (Allen, 2026-10-31): treat each respondent's estimated conservatism as the outcome, and use CultureWar's period-only model (`time_model`) and period–cohort model (`model10`), in their continuous-outcome version, to replace the lowess curves and the per-cohort regressions. These models use the sample weights, so the analysis can move away from resampling. Start with the current grid estimates and update when the pool difficulties are in.

**Models (from CultureWar at commit `0f54767`):**
- **Period model** (`time_model`): logit of the latent mean = intercept + an RW2 trend over survey years + a year-level noise term (`sigma_short`). The "mean" outcome (Task 165): each year's weighted mean ~ Normal(latent mean, SE), SE = the weighted SD that year / √(Kish n_eff).
- **Period–cohort model** (`model10`): intercept + RW2 cohort component (annual birth cohorts) + RW2 period component + year noise. Cells are cohort × year; each cell's weighted mean ~ Normal(latent mean, `sigma_resid[year]` / √n_eff).
- **Age model** (Allen's request: the cohort-only model, i.e. age within a time window): CultureWar's `cohort_model` is the period model with cohort in place of year. Within one window, cohort and age are the same thing in reverse order, so this gives the age gradient at that time.

**Amendments and suggestions (Claude, 2026-10-31):**
1. **Port the model code rather than import it.** The CultureWar pipelines are about 4,000 lines tied to its variable catalog, artifact paths, and extracts, and CultureWar is still changing. The model cores are small, so copy them into one module here (`notebooks/overton/apc.py`), with the same priors and defaults, citing the CultureWar commit. Fit in the CultureWar env (Bayesian fits stay out of this repo's env).
2. **Outcome.** The posterior mean count of conservative responses, divided by the number of questions, is a mean between 0 and 1, so it fits the "mean" outcome (logit link) as is. Report results as conservative responses out of 15. Respondents who answered fewer than 5 questions are dropped, as in the book.
3. **Weights, no resampling.** Use the original extract with `wtsmerge`: the grid's difficulties from weighted prevalence (the pipeline already supports this; it was the Phase 2 check), and the models use the weights for the cell means and n_eff.
4. **Period model:** national; by `polviews3` (3 fits); by `polviews` (7 fits). Note that these are trends for people who *currently* use each label, and who uses which label changes over time. That's the chapter's point, not a flaw, but the text should say it.
5. **Period–cohort model and the Overton test.** In a period–cohort model with no age term, the period component is the change *within* cohorts over time, so it combines aging and the effects of the times. That's the right quantity for "do people get more conservative as they get older?": if aging made people more conservative, the within-cohort trend would be positive unless the times pushed harder the other way. A negative period slope says the combined effect is toward liberal. Aging and period can't be separated without strong assumptions (the age–period–cohort identification problem), so the claim should be phrased as within-cohort change. The book's version ("people don't get more conservative as they age") already is.
   - **Single number:** the change in the period component per decade (or 1974–2024), holding cohort composition fixed, on the count scale, with a credible interval.
   - **Also report** CultureWar's decomposition of the total change into generational replacement (cohort component, composition shifting) and changing minds (period component). It's another way to state the same answer.
6. **Age model:** fit within windows, each survey year or each decade, and report the slope of conservatism against age per window. Put next to the within-cohort slope, this shows the paradox: in every cross-section the older are more conservative, yet no cohort gets more conservative as it ages.
7. **Measurement uncertainty.** The models treat each respondent's posterior mean as data. The within-cell SD includes the measurement noise, so the uncertainty in the means is accounted for roughly. The uncertainty is not propagated exactly; good enough for now.
8. **Order:** question set v1 first (to compare with the book), then v2 and the pool-difficulty versions, which only change the input.
9. **Compute:** all fits on Unity, in parallel (Allen, 2026-10-31); local runs only for smoke tests.

**Steps:**
- [x] `overton/apc.py`: weighted grid estimates on the original extract; the cell builders (year; cohort × year; age within window); the three models; summaries. Smoke-tested locally (2026-10-31).
- [x] Unity: all fits for v1 and v2 in one array (42 fits: period national, by `polviews3`, by `polviews`; period–cohort national and by `polviews3`; age by decade window), array 66449097 (`unity/overton_apc_jobs.txt`, `unity/overton_apc_array.sh`). Allen: run on Unity so fits run in parallel. Report: `overton/apc_report.py`.
- [x] Period model, national and by `polviews3`, compared with the book's lowess curves (sanity check).
- [x] Period model by `polviews`.
- [x] Period–cohort model: period slope with interval; decomposition. v1: −0.13 per decade [−0.20, −0.07]; v2: −0.05 [−0.14, +0.04].
- [x] Age model by window: age slopes (+0.34 to +0.58 per decade of age, every decade).
- [x] Composite figures in CultureWar style (`overton/apc_figures.py`, CultureWar env, imports CultureWar's figure helpers).
- [x] Age model by birth group (Allen, 2026-10-31: redo Chapter 12's `overton5` by decade of birth and by generation; v1; decades 1900s–2000s; Pew generations incl. Greatest; keep Gen Z; label lines directly). 17 fits; figures `age_by_decade_v1`, `age_by_generation_v1`. Greatest generation's +0.12 slope is likely a composition effect (45 birth years).
- [x] The same birth groups by survey year (period model per group), with the overall average dotted (Allen, 2026-10-31: plot both by age and by year). Composition caveat: by age, slopes biased up; by year, biased down. Decision: keep as is, explain in the text.
- [x] Period–cohort model within each birth group (Allen, 2026-10-31: the period component, standardized to the group's birth years, as the estimate of how each group changed, free of the composition shift). 17 fits, rerun at target accept 0.99. Slopes fall between the by-age and by-year slopes for 15 of 17 groups; no group gets more conservative. Figures `pc_by_decade_v1`, `pc_by_generation_v1`.
- [x] Posterior interval for the straight-line slope of the standardized period component (`period_slope_per_decade` in `overton/apc.py`; Allen: the straight-line slope is the way to go).
- [x] Within-cohort slope and Overton gap as functions of N, primary (`p{N}`: no confidence questions, stability rule) and sensitivity (`s{N}`), with the book's difficulties (weighted): 60 fits + 17 reruns at 8000 draws. Primary: slope −0.03 to −0.12 (never credibly positive); sensitivity: +0.04 to +0.10 at N = 20–30. Overton gap 1.6–2.5, declining with N.
- [x] Calibration check (em vs em66 vs emset) on the period and period–cohort fits: Unity array 66468744, 65 fits, all pass. Full pool with EM: within-cohort −0.14, Overton gap 1.31; core economic unchanged (+0.24); broad and inclusive economic lose their positive slope (+0.01 to +0.02, intervals include 0). Lab notebook 2026-11-01.
- [ ] Redo the by-N results, the birth-group fits, and the figures with `--difficulties em` (first job in this repo, 2026-11-01). Include the mode sensitivity runs for the final set (below), so they use the same difficulties.
- [ ] Future work from the second difficulties review (`docs/difficulties_design.md`), in priority order:
  - [x] EM with a flexible latent distribution (empirical, and by survey decade): the "who was asked" adjustment survives; the scale is about 7% narrower (lab notebook, 2026-11-01). Can join the variations array as a difficulties variation.
  - [ ] Item trends for core vs broad economic questions: what makes broad economic flat?
  - [ ] Residual associations within domains (e.g., the four core economic questions after conditioning on conservatism).
  - [ ] Inspect the divergences in `period_s50-em`.
  - [ ] Optional: bootstrap the EM calibration within survey replicates.
- [x] Social vs economic: classification of the 43 primary-pool questions sent out for review (`docs/question_domains.md`). Review (2026-10-31): keep the classification (race questions social, `helpblk` both; spending: domestic economic, defense and foreign aid neither); prespecify three economic specifications, A core (`helppoor`, `helpnot`, `helpsick`, `eqwlth`), B broad (A + `natenvir`, `nateduc`, `natmass`, `natpark`, `tax`, `getahead`), C inclusive (B + `helpblk`, `natdrug`); compare with social-only (29, without both and neither); don't expand the pool; report on a common scale; spending questions are relative to the status quo, so watch their influence. Minimum answers for these sets: 2 (Allen).
- [x] Run the four domain sets (period national, by `polviews3`, period–cohort): 20 fits, all pass. Social: classic Overton (within-cohort −0.14; Overton gap 1.05). Core economic: polarization; within-cohort **+0.24**, conservatives +1.1; broad economic +0.07. The "don't get more conservative as they age" claim holds for social questions, not economic ones: revisit the headline framing.
- [x] Interview mode after 2018: `docs/mode_design.md`. Decided 2026-11-01, following the review and CultureWar: interviewer-administered responses in 2022 and 2024 with raked weights; 2021 dropped.
- [x] Rerun the question selection on the primary sample (Allen, 2026-11-01): 48 questions; new ones classified (`docs/question_domains.md`, addendum).
- [x] Complete analysis with the decided specification: 82 fits plus 12 birth-group reruns; tables and figures; lab notebook 2026-11-01, "Results of the decided specification".
- [x] Divergences that remain in the period–cohort fits within birth groups (up to 154 in 24,000 draws, 0.6%, at target accept 0.995): accepted as is (Allen, 2026-11-01).
- [x] Relative position (Decisions, 2026-11-02): percentiles from EM latent distributions (`overton/position.py`), with figures; drop the Overton gap from the report and figures. Done 2026-11-02: latent distributions are normal on the logit scale (a nonparametric one didn't converge); the 1974 liberal is at the 61st percentile in 2024 [56, 66] (lab notebook).
- [x] Reporting scale: percent instead of out of 15; saved fit results converted (no refits); figures zoomed, shared limits per family.
- [ ] Variations, a few per step (see Decisions).
- [ ] **Apply the revised selection** (`docs/stability_review.md`, section 8), in order:
  - [x] Thresholds decided (Allen, 2026-11-03): reversal, 5 points, credible on both sides; drift diagnostic, a credible decade effect of at least 0.5 logits.
  - [x] Stability: fading flag retired; reversal-with-size rule added (`overton/stability.py`; sets in `overton/apc.py`, previous selection kept as `previous48`). Only `confed` has a reversal (already excluded as a confidence question).
  - [x] Selection rerun: 55 questions before the drift review (the previous 48 plus `racpres`, `natsoc`, `natspac`, `aged`, `natcrime`, `natroad`, `librac`); domains for the new ones decided.
  - [x] Item-drift diagnostic (`overton/item_drift.py`): 14 of 55 listed; Allen kept 12, excluded `librac` and `natspac`; `colrac`, next in its topic, also listed and excluded with the topic (`docs/item_drift_review.md`). **New pool: 53 questions, the set `primary`.** Recorded in the lab notebook.
  - [x] **Names** (Allen, 2026-11-03): the decided pool is the set `primary` ("the primary questions"), not named by its size; sensitivity sets `with_confidence` and `previous48`; the sample formerly called primary is the **interviewer sample** (code: `CANDIDATES_INTERVIEWER`, `--interviewer`). Done in the Python pipeline and the living docs; the lab notebook and older design docs keep the old names. Figure and result names change to `_primary` with the refit; the Overtron (`in_p48`, presets, fixtures, `excerpt.py`, `question_categories.py`) and the post's figure paths are renamed when they're regenerated.
  - [x] Connectivity table (`overton/connectivity.py`): 25–53 questions per year; 37 shared between the 1970s and the 2020s (lab notebook, 2026-11-03).
  - [ ] Recalibrate, re-prepare, refit (Unity), and regenerate figures, the Overtron excerpt, fixtures, and presets. Prepared (EM calibrated on `primary`; `primary`, `social`, `econA`–`econC`, `with_confidence`) and submitted 2026-11-03: `unity/overton_apc_revised_jobs.txt`, 86 fits (the 82 of the decided specification with `primary` in place of `p48`, plus `with_confidence`'s period–cohort and period-by-ideology fits). The previous selection's results (`p48`) are sensitivity (b) as they stand; no refit. **Fits done** (all 86 completed): R-hat at most 1.009, bulk ESS at least 810; 597 divergences in 20 fits, mostly the birth-decade period–cohort fits (the same 72 fits on `p48`: 977 in 50 fits). Still to do: figures, report, Overtron data.
  - [ ] Sensitivity: with the confidence questions; the previous 48-question selection. Reported neutrally, not used to choose.
  - [ ] Revise post 1's selection steps for the new rules (the stability example, `fepres`, is no longer excluded).
- [ ] Data build from a fresh clone: `scripts/build_data.sh` not yet run end to end; `overton.candidates` and `overton.data` still read from `~/CultureWar`.
- [ ] Retire the scripts that still use resampling (comparisons from the exploratory phase).
- [ ] Fine-tune figures (label placement etc.) only after the question set is settled (Allen, 2026-10-31).
- [ ] Headline framing given the domain results: social questions (and the full pool) show no within-cohort conservative shift; core economic questions show +0.24 per decade and polarization. Decide how the article and appendix present the split (Allen).

### Phase 5. ANES replication (later, optional)

Now board Task 5, plan `docs/anes_plan.md` (2026-11-06). The `examples/anes_overton` path below is stale; the notebook is `~/WorldviewANES/anes_overton.ipynb`.


- Build on `examples/anes_overton` (controversial-question search already done there).
- Equivalent of `polviews`: ANES 7-point liberal–conservative scale (`VCF0803`).
- Decide whether ANES appears in the article, the appendix, or both.

### Phase 6. Writing

- Lab notebook (started 2026-10-30): `notebooks/docs/lab.md`, a Markdown document with figures from `notebooks/overton/lab_figs.py`. A dated log of analyses and results, not polished; add an entry for each new analysis. Kept off the site (decided 2026-10-30).

- Technical appendix notebook: Task 1 on the board (`PROJECT_BOARD.md`); plan in `docs/appendix_plan.md`.
- Blog article: stand-alone canonical presentation of the paradox. Use `related-articles` skill to find earlier posts to link.

