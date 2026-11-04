# Technical appendix: plan

**Board:** Task 1 in `PROJECT_BOARD.md`.

**Goal:** an executable notebook that shows the whole process, from the data to the results, for readers who want to check or reuse it. It runs on Colab by downloading the data excerpt built for the Overtron, and it's built as a page of the jb site. Post 1 ("More details about the process are in this technical appendix") and post 3 link to it.

## Decided

- **Form** (Allen, 2026-11-04): an executable notebook, run on Colab and built as a jb page.
- **Data** (Allen, 2026-11-04): the notebook downloads the Overtron excerpt (`overton/excerpt.py`: the interviewer sample, all 170 candidate questions, weights) from a **GitHub release asset** of this repo, versioned. The saved results the notebook loads go in the same release.
- **Fits** (Allen, 2026-11-04): the notebook runs the main fits (period by self-identified ideology, the all-respondents period–cohort fit, age by survey decade) and loads saved summaries for the rest (the birth-decade fits, the sensitivity sets), with the code shown.
- **Code** (Allen, 2026-11-04): **self-contained.** The notebook defines every function it uses (coding, ranking, stability, drift, EM, scoring, models, summaries, figures), so it reads top to bottom with no dependency on the `overton` package. To keep it from drifting away from the code that produced the results, it checks its own outputs against saved values (the selection, the difficulties, the scores, the saved fit summaries).
- **Location** (Allen, 2026-11-04): `notebooks/appendix.ipynb` (paired with `notebooks/appendix.md` by jupytext), executed on Colab or locally with the outputs kept; the jb site builds it from the stored outputs and doesn't execute it. `jb/myst.yml` lists it as `../notebooks/appendix.ipynb` (checked: the site builds it, as `/appendix`, from the stored outputs).
- **Fit budget** (Allen, 2026-11-04): the notebook runs the main fits with shorter sampling (for example, 2 chains × 1,000 draws, as in the Overtron), so the whole notebook runs in about 10–15 minutes on Colab, and shows that they match the saved production results.
- **Selection steps 1–2** (gates and scope) need the full GSS file, which the excerpt doesn't hold, so they're shown from their saved tables (`figs/candidates_*.csv`, in the release). Steps 3–6 (coding, ranking, requirements, drift) and everything after run from the excerpt.

## Outline (proposed)

1. **Data.** Download the excerpt; the interviewer sample (2021 dropped; in 2022 and 2024, interviewer-administered respondents, weights raked to the full sample); self-identified ideology.
2. **Question selection.**
   - Steps 1–2 from the saved tables: 6,943 variables → 432 pass the gates → about 170 in scope.
   - Step 3, coding: the best contiguous split of each answer scale.
   - Step 4, ranking: the weighted logistic regression on year, birth year, and `polviews`.
   - Step 5, requirements: coverage, stability (reversal of at least 5 points), one per topic, no confidence questions.
   - Step 6, drift: leave-one-out scores and decade effects; the 14 flagged questions and the decision on each.
   - The result (53 questions) and the definition of the scale.
   - Connectivity: questions asked in each year, questions shared between decades.
3. **Measurement.** The Rasch model, EM difficulties calibrated on the primary questions, grid scores, percent conservative responses; the minimum of 5 answered questions.
4. **Models.** Period, period–cohort, and age models (random walks; the trend form of the RW2, linking `jb/rw2_reparameterization.md`); weights and cells.
5. **Results.** The main fits, run; the birth-decade fits, loaded; the figures of post 1.
6. **Relative position.** The 1974 liberal's percentile; the bootstrap.
7. **Sensitivity.** With the confidence questions; the previous 48-question selection; the social and economic subsets. Reported neutrally.
8. **Diagnostics.** R-hat, ESS, divergences for every fit.

## Tasks

- [x] Regenerate the excerpt for the `primary` pool, with the Overtron rename (2026-11-04): the decoded excerpt reproduces the scores of all 64,632 respondents; the Overtron's 16 tests pass on the new fixtures.
- [x] Release `data-v1`: staged by `scripts/stage_release.sh` in `release/data-v1/` (gitignored): `manifest.json`, `respondents.bin.gz`, `questions.json` (the selection's saved results, for the checks), `primary_fixture.json` (sample scores, yearly means), `apc_summary.csv` (every production fit), `position_headline.csv`. Published 2026-11-04.
- [x] Notebook drafted (`notebooks/appendix.md`/`.ipynb`, 2026-11-04): data; selection steps 1–9 (1–2 described, 3–9 run, each checked against the production results); connectivity; measurement (EM, scores, checked); the models (trend-form RW2); age by survey decade, period by self-identified ideology, and the period–cohort fit, run with 2 chains × 1,000 draws and compared with production; birth decades, sensitivity, and diagnostics loaded. Runs locally in about 8 minutes, all checks pass.
- [x] Released `data-v1` (2026-11-04); ran on Colab (`colab-run`): all 56 code cells pass, every check agrees with production. Built in jb as `/appendix`. (Colab has no nutpie, so the first run used PyMC's sampler. The notebook now upgrades the sampling stack on Colab, `pymc>=6`, `arviz>=1.1`, `nutpie`, as in YWCN's appendices, matching the local environment: PyMC 6.0.1, ArviZ 1.2.)
- [ ] Link from post 1 and post 3.
