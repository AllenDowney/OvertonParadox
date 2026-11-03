# Overton update: plan

Update the Chapter 12 analysis (the Overton paradox) with GSS data through 2024, reconsider how questions are selected, compare with Ricardo Vieira's model, and possibly replicate with ANES.

**Board:** Task 9 in `PROJECT_BOARD.md`.

**Deliverables**

1. A notebook that serves as a technical appendix: complete description of data, question selection, model, and results.
2. A Probably Overthinking It blog article that stands alone as the canonical presentation of the Overton paradox (readable without the book).

Development can happen in Python scripts; the notebook is the finished record.

---

## Existing material

| What | Where | Notes |
|------|-------|-------|
| Chapter 12 notebook | `notebooks/overton.md` / `.ipynb` | The book's analysis. Data through 2021 |
| IRT supplement | `notebooks/overton_irt.ipynb` | Explains the grid-based Bayesian estimate of conservatism. Published as an orphan page: copied by `jb/build.sh` and built, but not in `_toc.yml`, excluded from the sitemap, not linked from the chapter. Data through 2021; last content change 2022 (touched 2023-12 and 2026-10-16 for maintenance). Natural home for the updated appendix, or to be replaced by it |
| Center supplement | `notebooks/overton_center.ipynb` | Same opening as `overton_irt`, then more on where the center is. Tracked, unpublished; last updated 2024-01 |
| College variant | `notebooks/overton-college.ipynb` | Untracked; not yet reviewed |
| ANES exploration | `examples/anes_overton.md`, `~/WorldviewANES/anes_overton.ipynb` | Finds controversial ANES questions, groups them, 2024 pilot section. Relation between the two copies not yet checked |
| CultureWar notes | `~/CultureWar/book/overton.md` | Retired gender items; "Liberal bias?" note on question selection |
| GSS extract | `~/CultureWar/notebooks/gss_extract_2024_r3a.hdf`, key `gss` | 75,699 rows, 404 columns, 1972–2024. Weights `wtssall` (to 2018), `wtssps`, and `wtsmerge` = `wtssall.fillna(wtssps)` |
| Vieira talk | "Bayesian Bake-Off: Grids, MCMC, and IRT", PyMCon Web Series, Dec 2023. [Talk](https://www.youtube.com/watch?v=uyznG61myy0) (transcript: `overton_talk_main_transcript.md`); [Q&A](https://www.youtube.com/watch?v=mNbPpTDfaws) (transcript: `overton_talk_transcript.md`); [slides](https://tinyurl.com/bbo1123); [Discourse](https://discourse.pymc.io/t/13403) | Q&A says little about the model |
| Vieira code | [github.com/ricardoV94/bayesian-bakeoff](https://github.com/ricardoV94/bayesian-bakeoff) | `overton/irt_mcmc.py` (PyMC 5.9, numpyro) and `overton/irt_grid.py`; saved traces `idata1`–`idata4.nc` (~74 MB each). Summary below |

All fifteen book questions and `polviews`, `age`, `cohort` are in the extract and asked in 2024.

## The existing pipeline (Chapter 12)

1. **Data:** `gss_pacs_resampled.hdf` from PoliticalAlignmentCaseStudy: three weighted resamplings (`gss0`–`gss2`) that stand in for the sampling weights and give a rough sense of sampling variability.
2. **Labels:** `polviews` collapsed to `polviews3` (Liberal / Moderate / Conservative).
3. **Question search:** `find_questions()` runs a logistic regression of each candidate (about 120 variables) on `year + cohort + polviews` and ranks by the `polviews` coefficient.
4. **Curated set:** fifteen questions (`homosex`, `cappun`, `grass`, `abany`, `prayer`, `premarsx`, `divlaw`, `natfare`, `natenvir`, `pornlaw`, `racopen`, `letdie1`, `fepol`, `gunlaw`, `sexeduc`), chosen for topic diversity and frequency, with preference for questions still asked. Each coded 1 = conservative response (`conservative_values`).
5. **Model:** one-parameter IRT. Difficulty of each question fixed by heuristic (logit of the overall prevalence); each respondent's latent conservatism estimated on a grid with a wide Gaussian prior; posterior mean reported as expected number of conservative responses out of 15.
6. **Results:** conservatism by age and label; by year; by cohort; "The center does not hold"; "Everything is relative"; polarization; "Chasing Overton" (cohort trajectories vs the moving center).

## Phases

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
- [ ] Data build from a fresh clone: `scripts/build_data.sh` not yet run end to end; `overton.candidates` and `overton.data` still read from `~/CultureWar`.
- [ ] Retire the scripts that still use resampling (comparisons from the exploratory phase).
- [ ] Fine-tune figures (label placement etc.) only after the question set is settled (Allen, 2026-10-31).
- [ ] Headline framing given the domain results: social questions (and the full pool) show no within-cohort conservative shift; core economic questions show +0.24 per decade and polarization. Decide how the article and appendix present the split (Allen).

### Phase 5. ANES replication (later, optional)

- Build on `examples/anes_overton` (controversial-question search already done there).
- Equivalent of `polviews`: ANES 7-point liberal–conservative scale (`VCF0803`).
- Decide whether ANES appears in the article, the appendix, or both.

### Phase 6. Writing

- Lab notebook (started 2026-10-30): `notebooks/docs/lab.md`, a Markdown document with figures from `notebooks/overton/lab_figs.py`. A dated log of analyses and results, not polished; add an entry for each new analysis. Kept off the site (decided 2026-10-30).

- Technical appendix notebook: data, selection, model, comparisons, sensitivity.
- Blog article: stand-alone canonical presentation of the paradox. Use `related-articles` skill to find earlier posts to link.

## Decisions

**The decided specification (2026-11-01).** Each step has one decided choice; variations come later, a few per step, to see how much each decision matters (Allen: focus on the decided analysis first, then a small number of variations).

| Step | Decision | Where it's documented |
|---|---|---|
| Data | GSS 1972–2024 (R3a). Primary sample: 2021 dropped; in 2022 and 2024, interviewer-administered respondents only (in person, phone), with weights raked to the full sample's margins, the same as CultureWar | `docs/mode_design.md` |
| Weights | `wtssps` (NORC's post-stratification weight) for every year, raked in 2022 and 2024. The same as CultureWar's default and NORC's guidance (Allen, 2026-11-01); before that, `wtssall` filled with `wtssps` | `docs/mode_design.md` (item E) |
| Questions | Rule-based pool, rerun on the primary sample: scope, best contiguous coding, ranking by association with `polviews`, coverage (at least half the survey years, 16 of 32), one per topic, no confidence questions, stability rule. 48 questions (`p48`) | `docs/confidence_review.md`, `docs/question_domains.md` (addendum) |
| Difficulties | Weighted EM, calibrated on the 48, on the primary sample | `docs/difficulties_design.md` |
| Score | Rasch grid, N(0, 4) prior, at least 5 answers (2 for the domain sets), reported as percent conservative responses (out of 15 before 2026-11-02) | |
| Models | Period (national, by `polviews3`, by `polviews`), period–cohort (within-cohort slope: straight line of the standardized period component; decomposition), age model by decade of survey | lab notebook, Phase 4b |
| Reported sets | Full pool (headline); social; core economic (econA) | `docs/question_domains.md`, `docs/difficulties_design.md` |
| Birth groups | Period–cohort within each decade of birth and generation (plus the by-age and by-year versions) | lab notebook |
| Relative position (2026-11-02) | Replaces the Overton gap, which is dropped (it was introduced in this project, not the book). The claim is that a liberal of the 1970s would be right of center today, so the summary is a percentile: where the median 1974 liberal falls in each year's distribution of conservatism (headline: 2024), with the 2024 median moderate and conservative as reference points. Mechanism: each decade of birth's median, as a percentile of each survey year's distribution. Distributions: latent distributions estimated on the grid by weighted EM with the decided difficulties held fixed, so measurement noise and the prior don't change the spread; percentiles of the observed scores as a check. A percentile is the same on any monotone scale (logit, out of 15, percent), and medians keep it so, which is why medians and not means | lab notebook, 2026-11-02 |
| Reporting scale (2026-11-02) | Percent conservative responses (expected share of conservative answers to the set's questions × 100), replacing "out of 15", which was left over from the book's 15 questions. Figures zoom the y-axis, with the same limits for every figure in a family, so figures can be compared by eye | lab notebook, 2026-11-02 |

Variations for later (one or two per step): all modes; through 2018; the heuristic difficulties; calibration on all candidates or per set; the pool selected on all respondents; by N; econB/C; with the confidence questions.


- **Location (2026-10-30):** this repo, `notebooks/`, next to `overton.md` and `overton_irt`. The appendix may replace the orphan `overton_irt` page. Article drafted in `~/ProbablyOverthinkingBlog/articles`.
- **Weights (2026-10-30):** both. Weighted resamplings from `wtsmerge` (the book's method) for the main results; direct weighting as a check.
- **ANES (2026-10-30):** later phase, optional; decide after the GSS results.
- **Vieira comparison (2026-10-30):** compare both his hierarchical model (m2) in PyMC and pooling added to the grid method, against the book's method on the same data and questions.
- **Mode (2026-10-30):** keep the main analysis, and report sensitivity runs (through 2018; without the five in-person-only questions). `mode` to be added to the CultureWar extract (CultureWar Task 175); meanwhile `data/gss_mode_2021_2024.csv`.
- **Question selection, round 2 (2026-10-30):** principle: write the rule down first, apply it without computing trends or drift, freeze the list, then run the pipeline. Choices:
  - Pool: the full GSS cumulative file (R3a), filtered mechanically: attitude questions only (no demographics, behaviors, party, vote, or ideology); at least 8 waves spanning at least 15 years; retired questions eligible.
  - Coding: response groupings from CultureWar `variables.yaml` where available, otherwise a fixed rule. The conservative side is the one conservatives choose more often.
  - Score: the book's `find_questions` model (`y ~ year + cohort + polviews`, logit), fit only in the years each question was asked.
  - Redundancy: one question per battery or highly correlated group (the most discriminating, with span as tiebreaker).
  - Mode: questions asked only in person since 2022 are eligible but flagged.
  - Top N = 15 first, the same as the book. Later, possibly more questions, if there are additional good discriminators.
  - Step 0: rerun the book's `find_questions` on the book's data, to document the original ranking.
  - Step 0 result: the book's fifteen rank 4th–47th; see the lab notebook.
  - Scope: exclude presidential vote (circular), religious belief and practice, and behaviors such as gun ownership and hunting, as the book did.
  - Superseded (2026-10-30): redundancy by correlation doesn't reproduce the book's judgments, so topics are assigned by hand (`notebooks/overton/topics.py`), one question per topic. Coverage: asked in ≥17 of 33 waves. Spending items: the original wording. Coding: the best contiguous cut, with the book's codings kept for its fifteen. Ranking outcome: the coded split (weighted).
  - Battery = redundancy by correlation: two questions are redundant if responses are highly correlated among people who answered both. The threshold is set before looking at results. Candidate calibration: the abortion items should merge; `natfare`/`natenvir` and `homosex`/`premarsx` should not (the book's judgments).
- **One feature at a time (2026-10-30):** the first pass sticks with the existing model. New features go in one at a time, each compared with the step before. The book's method is the baseline.

- **Bayesian fits (2026-10-30):** use the CultureWar conda env (PyMC, nutpie), locally for development and on Unity for full fits. No Bayesian libraries in the ProbablyOverthinkingIt env. Unity sandbox: `OvertonParadox/` in the Unity work directory set in `unity/config.sh`, since the move to this repo (2026-11-01; before that, a `ProbablyOverthinkingIt/` sandbox) (no git; `unity/unity_rsync.sh push|pull`; Slurm array `unity/overton_irt_array.sh`).
- **Phase 4 order (2026-10-30):** step A, estimated difficulties: fit m1 (the book's model with difficulties estimated) and feed its difficulties to the grid. Step B, pooling: m2 (hierarchical) on all respondents. Both sets, three resamplings (`notebooks/overton/irt.py`, `overton/irt_compare.py`).
- **Difficulties (review, 2026-11-01):** weighted EM on the grid (`overton/em.py`), calibrated on the 43 primary questions, is the production choice; questions outside the pool are anchored to it. Heuristic kept as a switch for comparison with the book; EM on all 66 and per-set EM are sensitivity analyses; m1 (MCMC) is validation only. No 2PL unless the checks show a problem. Details: `docs/difficulties_design.md`. Second review (2026-11-01) confirmed it:
  - 43-question calibration as a reference convention on construct-validity grounds;
  - no 2PL;
  - common calibration for domain scores, per-set as sensitivity;
  - intervals conditional on calibration, with calibration choice reported separately;
  - economic claims scoped to the four core questions.
- **Headline and robustness (Allen, 2026-10-31; the Overton gap superseded on 2026-11-02 by the relative-position percentile, see the table above):** headline numbers come from the full primary pool (all 43 questions after the rules: the one point on the curve with no choice of where to stop). The by-N curves show robustness. Framing, split by claim: "people don't get more conservative as they age" is robust (never credibly positive at any N; size from about −0.12 to about 0); the Overton gap is positive at every N (1.6–2.5) and the headline uses the smallest value, so the text says it depends on the questions. Show both curves (with and without confidence questions) prominently; mention that the book's 15 give −0.16, more negative than any N in the new pool; note that all questions count equally, including weakly separating ones at the bottom of the pool.
- **Stability rule (2026-10-31):** a question is excluded if the conservative–liberal gap on its coded answer, by decade, credibly changes sign or fades to zero after being credibly positive (`notebooks/overton/stability.py`). Follows from the method's fixed-coding assumption; uses only the gap, not trends. Removes 15 of the 65 pool questions, all ranked 39th or lower.
- **Confidence questions (decided 2026-10-31, after independent review):** primary specification excludes all 13 `con*` questions by a revised scope rule (evaluations of institutions are out); the version including them is reported as a sensitivity analysis, visibly. Decided after seeing results; documented as a post hoc revision (review: `docs/confidence_review.md`; record and checks: lab notebook). Report the Overton gap and within-cohort slope as functions of N, one curve per specification.
- **Larger sets (2026-10-30):** the same rule, top N for N = 15–40 (`notebooks/overton/larger_sets.py`). Report the Overton gap as a function of N rather than as one number. Report two pools, all candidates and without the confidence-in-institutions items (`con*`), because `conpress` drifts strongly toward its conservative response. Which pool the article uses is decided later.

## Open questions

(None at the moment.)

## Notes for CultureWar

Opinion questions that passed the Overton gates but aren't in CultureWar's variable catalog, and might belong in that book (found 2026-10-30; added as CultureWar Task 176):

- **Police use of force:** `polhitok` (any situation where you'd approve of a policeman striking an adult male citizen) and the follow-up situations `polabuse`, `polmurdr`, `polescap`, `polattak`. 29 waves, 1975–2024.
- **Violence between private citizens:** `hitok`, `hitmarch`, `hitdrunk`, `hitchild`, `hitbeatr`, `hitrobbr` (1975–1994).
- **Criminal justice:** `courts` (courts too harsh or not harsh enough; 32 waves, 1974–2024).
- **Civil liberties:** `wirtap` (wiretapping, 1974–1994).
- **Child discipline:** `spanking` (1986–2024). Listed in CultureWar's `book/autonomy_plan.md` but not in the catalog.
- **Pornography beliefs:** `porninf`, `pornmorl`, `pornrape`, `pornout` (1975–1994), alongside `pornlaw`.
- **School integration:** `rachaf`, `racmost` (follow-ups to `racfew`, 1974–1996).
- **Racial contact:** `livewhts` (2000–2016).
- **Gender roles:** `meovrwrk` (1994–2024).
- **Group stereotypes:** `wlthblks`, `workblks`, `intlblks` and the White versions (1990–2024).

## To consider later

(Method alternatives go here until agreed.)

- **Pooling on the grid.** My grid method could get Ricardo's main benefit without MCMC: estimate the spread of the prior on `e` from the data (empirical Bayes, or a grid over `e_std`), then run the same array update. It stays fast and uses all respondents. Check how much the results move compared with the fixed wide prior.
- **Estimated difficulties fed to the grid.** Fit something like Ricardo's model (possibly on a subset of respondents) to estimate question difficulties, then use the posterior estimates (means, or draws to carry their uncertainty) as the difficulties in the grid model. Isolates one change: heuristic vs estimated difficulties.
- **Pooling toward group means.** m2 pools every respondent toward one mean, which shrinks group differences, by an amount that changes with the number of questions answered (Phase 4 step B). Pooling toward means by year and alignment (or a smooth in year), on MCMC or on the grid, would avoid that, but puts the analysis structure into the model. Related to "Trend inside the model".
- **Time-varying difficulties (item drift).** The natural next feature, and it connects with fitting the difficulties with a model like Ricardo's and feeding them to the grid. The catch is identification: if each question has its own trend, the overall trend in conservatism isn't identified without an anchor (question trends average zero, anchor questions, or a common trend). That choice defines what "more liberal over time" means, so decide it explicitly.
- **Trend inside the model vs after it (future alternative).** Ricardo's m3/m4 put the year effect inside the measurement model, so each `e_i` becomes a deviation from the trend. The book measures first and analyzes trends afterward, and the Overton results (center moving, cohorts vs labels) depend on that. Putting the trend in the model could build in the result. A future alternative, not part of the first pass.
- **Calendar year.** If we use a trend term, use calendar year (or decade) rather than the index of the survey, because the surveys are unevenly spaced.

## Log

- 2026-11-02: Overtron milestone 3: the measurement port (`overtron/src/`), tested against both fixtures; the p48 EM stops at its 100-iteration cap (difficulties within 0.009 of converged).
- 2026-11-02: The trend form of the RW2 in the PyMC fits (`--rw2-form trend`, same model): p48 period–cohort in 159 s against 1,026 s, with the same results. Not the default. Lab notebook entry.
- 2026-11-02: Overtron decisions (Allen): calibrate difficulties on the reader's set; primary sample only (the excerpt dropped the other rows); v1 chooses questions only, with the decided coding; the page keeps target_accept 0.95.
- 2026-11-02: Overtron milestone 2: `overton/excerpt.py` writes the browser data excerpt (the 68,005 respondents of the primary sample × 170 candidates, 2.47 MB gzipped; reproduces the decided p48 scores exactly) and the p48 and econA fixtures.
- 2026-11-02: Overtron spike, continued: the RW2 in its eigenbasis with the trend split out (same model) plus nutpie adaptation: period–cohort fit in about 30 s (2 chains × 1000 + 2000), from 638 s. Lab notebook entry.
- 2026-11-02: Overtron spike: the period–cohort model in TyMC reproduces the nutpie fit (same summaries within Monte Carlo error) in 638 s on two cores; trees near maximum depth. Lab notebook entry.
- 2026-11-02: Planned the Overtron, a browser version of the pipeline with TyMC (reader-chosen questions and options; key figures and numbers): `docs/overtron_plan.md`; board Task 11 in `~/ProbablyOverthinkingIt/PROJECT_BOARD.md`.
- 2026-11-02: Decided: post 1 leaves the core economic exception to post 4; "self-identified ideology" replaces "alignment" for polviews (time-series figure title, design docs, outline; book-reproduction code and past lab entries unchanged).
- 2026-11-02: Refit all 82 fits of the decided specification on Unity (`unity/overton_apc_refit_jobs.txt`, generated from the summaries, same settings and seeds), now saving each trace (`*_trace.nc`: posterior without the standardized innovations, float32, compressed; sampler stats) so later summaries need no refit.
- 2026-11-02: Post-1 figures (age, birth group, trajectories, components) share y-limits 30–70 for p48. Fits now also write 84% intervals (`lo84`, `hi84`), which the figure bands use (in effect after the refit below).
- 2026-11-02: Figures (`apc_figures`, `position`) are 20% taller than the book's, since they aren't going in the book. The trajectories figure zooms to the range of its lines (30–70).
- 2026-11-02: Period–cohort fits now also write cohort trajectories (`*_trajectories.csv`, as in CultureWar); `period_cohort_p48` refit locally to get them (same settings and seed; results match the Unity fit to 0.01). Figure `trajectories_p48`. Three color families: survey decades warm, decades of birth viridis, generations cool.
- 2026-11-02: Decided: summarize the Overton claim as a percentile (where the 1974 liberal falls in later years' distributions; each birth decade's percentile over time), from EM latent distributions; drop the Overton gap. Report on a percent scale, with zoomed figures. Blog series outline: `docs/blog_series.md`.
- 2026-10-30: Plan drafted. Confirmed all fifteen questions are in the R3a extract through 2024.
- 2026-10-31: Domain results: social questions show the classic Overton pattern; core economic questions show polarization and a positive within-cohort slope (+0.24 per decade). Headline framing to revisit.
- 2026-10-31: Domain classification reviewed; specifications A/B/C economic and social-only prespecified; fits submitted.
- 2026-10-31: Pool m1 fits (array 66448475) finished, 3/3, about 11 h each, 0 divergences; pulled. Item R-hat up to 1.09 (ESS down to 30), but chains differ by at most 0.004 in mean difficulty (posterior sd about 0.02), the same for every item: a shared location wobble, harmless for point difficulties. Next: run `overton/pool_difficulties.py`.
- 2026-11-01: `--difficulties {heuristic,m1pool}` added to `overton/apc.py` (m1pool data written, not yet fit). Pool difficulties shift results systematically (Overton gap down 0.0–0.15). Prototype EM (marginal ML on the grid, weighted, 6 s) reproduces m1 to 0.017. Per-set fits stretch more and matter more. Design question for Allen: `docs/difficulties_design.md`. Reviewed and adopted the same day: EM calibrated on p43 (see Decisions). Calibration check: weighted table done (43 vs 66 calibration moves the p43 gap from 1.80 to 1.66); model-based fits in Unity array 66468744. EM prototype: `notebooks/overton/em_proto.py`, `overton/em_sets.py` (not yet in the pipeline).
- 2026-10-31: Decision: headline from the full primary pool, by-N curves for robustness, with the claims framed separately (slope robust; gap depends on questions, headline is its smallest value).
- 2026-10-31: By-N results (book's difficulties): primary within-cohort slope never credibly positive; with confidence questions, positive at N = 20–30; Overton gap 1.6–2.5.
- 2026-10-31: Independent review: exclude all confidence questions (primary), report the inclusive version as sensitivity. Its two checks done (`overton/dif.py`): `conpress` drifts strongly at fixed conservatism (18% → 67%), but issue questions drift too; 2020s gaps larger on the web, but the `conpress` jump persists within interviewer-administered surveys.
- 2026-10-31: Stability rule adopted (15 of 65 pool questions out, all rank ≥ 39). Confidence questions sent for independent evaluation (`docs/confidence_review.md`). Slope-vs-N runs on hold.
- 2026-10-31: Period–cohort model within each birth group: removes the composition shift; slopes between by-age and by-year for 15 of 17 groups; Greatest +0.12 by age becomes −0.10.
- 2026-10-31: Age by birth group (decades, generations), v1: every decade 1930s–1980s more liberal with age; 1900s–1920s flat; Greatest +0.12 (composition, 45 birth years).
- 2026-10-31: Phase 4b fits done (Unity; period and age fits rerun at target accept 0.99): within-cohort change v1 −0.13 per decade, v2 −0.05 (includes 0); age gradient +0.4 to +0.6 per decade of age in every decade; generational replacement 76–89% of the total change. Figures in CultureWar style.
- 2026-10-31: Phase 4b planned: period, period–cohort, and age models of conservatism (ported from CultureWar, weighted, no resampling). Pool m1 fit running on Unity (array 66448475).
- 2026-10-31: Phase 4 steps A and B done (Unity array 66416447, all 12 fits clean): estimated difficulties change almost nothing; m2 pooling toward one mean compresses group differences by about 40%, unevenly over time (shrinkage depends on questions answered). Pooling toward group means would be a method change; to discuss.
- 2026-10-30: Phase 4 started: m1 and m2 fits submitted to Unity (array 66416447; v1/v2 × 3 resamplings).
- 2026-10-30: Larger sets extended to all candidates (65; 52 without con*): the gap levels off after N = 40 at about 0.9 (no con*) or 1.4 (with con*).
- 2026-10-30: Larger sets, same rule, N = 15–40 (`overton/larger_sets.py`): Overton gap falls with N (about 1.9 → 0.9 without con* items); `conpress` drifts toward the conservative response and adds positive cohort slopes. Decided: report both pools (with/without con*); report the gap as a function of N.
- 2026-10-30: Completed the square (v1/v2 × through 2018/2024, `overton/compare_square.py`): the Overton gap depends on the question set, not the cutoff; with v2, within-cohort decline for the 1930–1970 cohorts appears only with 2021–2024 data.
- 2026-10-30: Set v2 frozen (`overton/question_sets.py`, `questions.yaml`); v1 vs v2 compared: directions hold; with v2 conservatives barely move, and the Overton gap is 1.85 vs 0.5–0.7.
- 2026-10-30: Selection steps 2–3: coding, ranking, topics; draft set v2 (7 of the book's 15).
- 2026-10-30: Selection step 1: 432 candidates pass the gates; 171 in scope after borderline decisions (`overton/candidates.py`, `overton/scope.py`).
- 2026-10-30: Selection step 0 done (book's ranking recovered); scope and battery rules decided.
- 2026-10-30: Phase 3 step 1: drift by question and question-set sensitivity; lab notebook started (local document, not on the site).
- 2026-10-30: Item drift: the five in-person-only questions drifted relative to the other ten; estimates depend on which questions were answered, increasingly over time.
- 2026-10-30: Phase 2 checks: weighting OK; mode sensitivity runs done; question set changes the size of the Overton result.
- 2026-10-30: Phase 2 first run: pipeline reproduces the book; main results hold through 2024; mode issue found for 2022–2024.
- 2026-10-30: Phase 1 done: extract copied, checked, resampled (`notebooks/overton/data.py`).
- 2026-10-30: Found Vieira code (bayesian-bakeoff); transcripts of talk and Q&A saved; model and talk takeaways summarized in Phase 4.
