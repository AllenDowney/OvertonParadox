# Overton update: plan

> **2026-11-06: work items moved to the board.** Open work is on `PROJECT_BOARD.md` (Tasks 1–8), each task with its own plan. This file now keeps the overall specification: existing material, the original pipeline, the Decisions table, notes, ideas to consider later, and the log. The phase-by-phase history (Phases 1–6, with their results and checklists) moved verbatim to `docs/plan_history.md`. Dated results are in `docs/lab.md`.

Update the Chapter 12 analysis (the Overton paradox) with GSS data through 2024, reconsider how questions are selected, compare with Ricardo Vieira's model, and possibly replicate with ANES.

**Board:** `PROJECT_BOARD.md` in this repo (new tasks get their own planning documents; this plan keeps the overall specification, decisions, and log). Earlier: Tasks 9–11 on the ProbablyOverthinkingIt board.

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

## Decisions

**The decided specification (2026-11-01).** Each step has one decided choice; variations come later, a few per step, to see how much each decision matters (Allen: focus on the decided analysis first, then a small number of variations).

| Step | Decision | Where it's documented |
|---|---|---|
| Data | GSS 1972–2024 (R3a). Interviewer sample (called the primary sample before 2026-11-03): 2021 dropped; in 2022 and 2024, interviewer-administered respondents only (in person, phone), with weights raked to the full sample's margins, the same as CultureWar | `docs/mode_design.md` |
| Weights | `wtssps` (NORC's post-stratification weight) for every year, raked in 2022 and 2024. The same as CultureWar's default and NORC's guidance (Allen, 2026-11-01); before that, `wtssall` filled with `wtssps` | `docs/mode_design.md` (item E) |
| Questions | The primary questions (set `primary`): a rule-based pool, rerun on the interviewer sample: scope, best contiguous coding, ranking by association with `polviews`, coverage (at least half the survey years, 16 of 32), one per topic, no confidence questions (construct rule), stability. **Revised 2026-11-03 after consultation (selection applied, fits not yet rerun):** the fading rule is retired; stability is a reversal rule with a size threshold; an item-drift diagnostic lists questions for inspection, decided case by case. New pool: 53 questions (set `primary`; `librac`, `natspac`, `colrac`, `spkrac` excluded in the drift review, `docs/item_drift_review.md`); it replaces the previous 48 (`p48`, now `previous48`, rules as of 2026-10-31) once the fits are rerun | `docs/stability_review.md` (section 8), `docs/confidence_review.md`, `docs/question_domains.md` (addendum) |
| Difficulties | Weighted EM, calibrated on the primary questions, on the interviewer sample | `docs/difficulties_design.md` |
| Score | Rasch grid, N(0, 4) prior, at least 5 answers (2 for the domain sets), reported as percent conservative responses (out of 15 before 2026-11-02) | |
| Models | Period (national, by `polviews3`, by `polviews`), period–cohort (within-cohort slope: straight line of the standardized period component; decomposition), age model by decade of survey | lab notebook, Phase 4b |
| RW2 coordinates (2026-11-03) | The trend form (`rw2(form="trend")`, the eigenbasis with the linear trend split out), the default for new fits. It is the same model as the double-cumsum form, which the results before 2026-11-03 used. Summaries record `rw2_form`; a summary without it used `cumsum`. | `jb/rw2_reparameterization.md`, lab notebook |
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
- **Confidence questions and stability (revised 2026-11-03, after consultation; `docs/stability_review.md`, section 8):** the confidence exclusion (C1) stays, now justified on construct grounds: confidence in an institution is a different construct from a position on an issue or a norm (approval of current decisions, legitimacy, trust in expertise, partisan alignment), and its meaning isn't stable (declining confidence in the Supreme Court is not a move toward conservatism; confidence in the executive branch tracks the party in power). Applies to all 13. The post hoc timing is disclosed. The stability rule changes: fading no longer excludes a question (a fixed Rasch difficulty predicts fading gaps near consensus, e.g. `fepres`); a reversal of at least a set size (5 points, credible on both sides; decided 2026-11-03 as a substantive judgment, with every candidate's decade gaps already known) does; a leave-one-out item-drift diagnostic lists questions for inspection only (a credible decade effect of at least 0.5 logits). Not adopted: S3, S4, S6, C2–C4. Results are not a criterion and weren't considered.
- **Larger sets (2026-10-30):** the same rule, top N for N = 15–40 (`notebooks/overton/larger_sets.py`). Report the Overton gap as a function of N rather than as one number. Report two pools, all candidates and without the confidence-in-institutions items (`con*`), because `conpress` drifts strongly toward its conservative response. Which pool the article uses is decided later.

## Open questions


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

- 2026-11-06: Literature review for a possible arXiv paper (`docs/literature_review.md`, 18 papers in `papers/`); work items moved to the board (Tasks 4–8), phase history to `docs/plan_history.md`; `paper/` scaffold (Markdown → pandoc → LaTeX, `make arxiv`). ANES replication (Task 5, `docs/anes_plan.md`): 1948–2024 CDF, 32-question pool, `--survey anes` in `overton.apc` and `overton.position`. The decline, replacement and the social/economic split replicate; the Overton crossing doesn't (1974 liberal at the 38th percentile in 2024). Web answers are more conservative than interviewer-administered at the same composition. Variation: a minimum of 2 answered questions instead of 5 makes no material difference (GSS and ANES).
- 2026-11-03: Stability and confidence questions reviewed by an outside consultant (`docs/stability_review.md`). Adopted: confidence exclusion kept on construct grounds; fading rule retired; reversal rule with a size threshold; one leave-one-out drift diagnostic for inspection; explicit definition of the scale; connectivity check; two sensitivity comparisons. Not yet applied (Phase 4b tasks).
- 2026-11-03: Overtron milestone 4: models (trend form, eigenbasis computed in the browser), summaries, worker fits, and relative position in TypeScript, each tested against Python. The page's p48 run (32 fits, including the decade-of-birth fits) takes 149 s in Node and reproduces the decided results. Thread setting: one BLAS thread per chain (2.3× faster locally, no difference on Unity).
- 2026-11-03: The trend form of the RW2 is the default for new fits (Allen), after tests on p48 and four subgroups (same results, 4–7× the ESS per second). The saved results are unchanged. Timed: limiting BLAS to one thread per chain makes the trend fit 2.3× faster locally. Lab notebook entry; memo `jb/rw2_reparameterization.md`.
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
