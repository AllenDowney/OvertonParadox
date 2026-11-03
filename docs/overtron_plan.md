# The Overtron: plan

A web page that runs the whole Overton pipeline in the browser, with [TyMC](https://github.com/pymc-labs/tymc) (PyMC-like modeling and NUTS in TypeScript) in place of PyMC and nutpie. The reader chooses the questions that define "more conservative" (and, optionally, other settings), and the page measures conservatism, fits the age, period, and cohort models, and draws the key figures and numbers.

**Board:** Task 11 in `~/ProbablyOverthinkingIt/PROJECT_BOARD.md`.

**Status (2026-11-02):** planning. Nothing built yet. The decisions below marked *Open* are Allen's to make before work starts.

**Why:** the results depend on which questions count as conservative. The project's answer is a written rule (`docs/plan.md`, Decisions) plus sensitivity analyses, but a reader who would choose differently can only take our word for it. The Overtron lets them make their own choice and see whether the conclusions hold: "people don't get more conservative as they age" should survive most reasonable choices, and the page shows readers where it doesn't.

---

## What the page does

1. **Loads a data excerpt** from this repo: every GSS respondent in the primary sample, with the raw responses to all 170 candidate questions, plus year, age, birth year, self-identified ideology (`polviews`), and the weight. Also a metadata file: question wording, value labels, the default conservative coding, and the selection statistics (rank, separation, waves, stability, topic, domain).
2. **Lets the reader choose the questions.**
   - Presets: the decided pool (`p48`), social, core economic (`econA`), and the book's 15.
   - Or any subset of the 170, in a searchable table sorted by rank. Each row shows the question, its coding, its separation between liberals and conservatives, its years, and flags (failed the stability rule, in-person only since 2022, confidence question, outside the scope rule).
   - Optionally, which responses count as conservative (default: the coding from `overton/coding.py`).
3. **Lets the reader set options** (advanced, collapsed by default; see "Configuration").
4. **Runs the pipeline,** showing progress at each step:
   1. Code responses 1/0/missing.
   2. Calibrate question difficulties by weighted EM on the grid.
   3. Score each respondent (Rasch grid posterior mean, as percent conservative responses).
   4. Aggregate to weighted cells (mean, variance, Kish n_eff).
   5. Fit the models with NUTS (TyMC, in a Web Worker): period by self-identified ideology, period–cohort, and age by decade of survey.
   6. Summarize: components, decomposition, within-cohort slope, age slopes, relative position.
5. **Shows the key figures and numbers.** Each one sits next to the decided specification's value, so the reader can see what changed.

## Key outputs

These follow the blog series (`docs/blog_series.md`), in the post 1 style (`overton/apc_figures.py`): percent scale, 84% bands, and the same y-limits within a family.

| Output | From | Decided value (p48) |
|---|---|---|
| Conservatism by self-identified ideology, by year | period model × 3 | figure `time_series_p48` |
| Conservatism by age, one line per decade of surveys; age slope per decade of age | age model × 6 windows | +3.9 (1970s) … +2.1 to +2.4 (since 2000) |
| Cohort and period components | period–cohort | figures `cohort_component_p48`, `period_component_p48` |
| Within-cohort slope (points per decade) | period–cohort | −0.84 [−1.01, −0.68] |
| Decomposition of the total change | period–cohort | −17.0 = −12.0 (replacement) + −4.9 (changing minds) |
| Cohort trajectories | period–cohort | figure `trajectories_p48` |
| Relative position: the median 1974 liberal as a percentile of 2024 | EM latent distributions | `figs/position_headline.csv` |
| Diagnostics: R-hat, ESS, divergences per model | sampler | shown, with a warning if they fail |

Later (not v1): within-cohort slopes by decade of birth and generation (17 more period–cohort fits), and the by-N curves.

## Architecture

### Data excerpt (built in this repo)

- New step `python -m overton.excerpt`, writing `overtron/public/data/v1/`, which the build copies to the site (see Open decisions, 1):
  - `respondents.bin`: column store, int8 responses (−1 for missing), 170 columns × 68,005 rows. About 11.6 MB raw, 2.7 MB gzipped (measured 2026-11-02). Plus year, age, cohort, polviews as int16, and the weight as float32.
  - `questions.json`: per question, the wording, value labels, default coding, ranking and stability statistics, flags, and domain, plus the presets.
  - `manifest.json`: version, source extract (R3a), sample rule, the git hash, column offsets and dtypes, checksums.
- Build from `data/gss_overton_candidates_r3a_interviewer.hdf` (the primary sample, with raked weights in 2022 and 2024). Primary sample only (decision 5).
- The excerpt isn't committed to `main` (`data/` and outputs stay out of git). The `jb/` build runs `python -m overton.excerpt` and copies the excerpt next to the page, so `ghp-import` publishes it on `gh-pages`. Deploying needs the local `data/`. If others should be able to build the page from a clone, commit the excerpt or host it as a release asset (which could also serve the notebook's data, `docs/plan.md`).
- The version is in the path (`data/v1/…`), so a page built against one excerpt doesn't break when the excerpt changes.
- GSS data can be redistributed with a citation (NORC). The manifest and the page carry the citation.

### Reference fixtures (built in this repo)

To check the port step by step, export the Python pipeline's intermediate results for `p48` (and one small set, `econA`): the coded matrix checksum, EM difficulties, scores for a sample of respondents, the weighted cells, and the summaries. The TypeScript tests compare against them.

### Page (TyMC)

- Plain TypeScript, no MCMC, for the measurement steps: coding, EM (Bock–Aitkin, with brentq replaced by bisection or Newton per question), grid scoring, weighted cells, composition weights, and summaries. These run in seconds in Python with numpy; in JS they are loops over 68k × 48 × grid points. Run them in the worker too, so the page stays responsive.
- TyMC for the three model families, ported from `overton/apc.py`:
  - `rw2`: mean-centered RW2 by double cumsum, non-centered, free initial slope;
  - ZeroSumNormal year noise (`zero_sum_normal`; check that its parameterization matches PyMC's);
  - Normal likelihood on cell means with plug-in standard errors.

  Each chain runs in its own Web Worker (`workers.parallel_sample`), and the models run one after another, the headline model first.
- The figures are drawn on the page (SVG), matching the matplotlib styles: same colors, bands, and limits.
- The page links to the blog series and the technical appendix.

*TyMC capabilities, sampler speed, and packaging: see "TyMC facts" below.*

## Configuration

| Option | Default | Notes |
|---|---|---|
| Questions | `p48` | Presets or any subset; at least 2 |
| Coding | from `overton/coding.py` | Fixed in v1 (decision 6) |
| Minimum answers per respondent | 5 (2 for sets of fewer than 10 questions) | `MIN_ANSWERED`, `MIN_ANSWERED_BY_SET` |
| Difficulties | EM calibrated on the chosen set | The decided spec calibrates on `p48` and anchors the others to it. For a reader's set, calibrating on that set is the natural choice (*Open*) |
| Sample | primary (interviewer-administered in 2022–2024) | Fixed (decision 5) |
| Models | period by ideology, period–cohort, age by decade | Birth-group fits later |
| Sampler | chains 2, tune 1000, draws 2000, target_accept 0.95, nutpie adaptation, trend form (the spike's 4 divergences accepted, Allen 2026-11-02; the page reports divergences) | Production used 4000 + 6000 at 0.99, to get the reported precision; the page's default trades precision for time, and says so |
| Prior scales | from `PERIOD_SETTINGS`, `COHORT_SETTINGS` | Advanced; for readers who want to check prior sensitivity |

## Validation

- **Measurement:** the TS EM difficulties and scores match Python to about 1e-6 on the fixtures.
- **Cells:** exact match.
- **Models:** the summaries for `p48` and `econA` match the decided results within Monte Carlo error (for example, the within-cohort slope's mean within 0.05 points per decade, and the interval ends within 0.1). Use the saved traces (`results/apc/results/*_trace.nc`) to compare whole posteriors, not just summaries.
- **Diagnostics:** R-hat < 1.01, no divergences at the page's default settings for `p48`, `social`, and `econA`. If the defaults can't get there in the time budget, choose different defaults; don't hide the warnings.
- **Odd choices:** a reader can pick sets the rule would never choose (two questions, all unstable ones, a single domain). Test a handful, and make sure the page fails gracefully (too few respondents, empty cohort cells, a non-converging EM) with a message instead of a wrong figure.

## Performance budget

- **Target:** the default run finishes in a few minutes on a laptop.
- **Sizes for `p48`:**
  - the period–cohort model has 2,442 cohort × year cells and about 260 parameters (cohort RW2 over about 120 birth years, period RW2 over 53 years, year noise, and 32 residual scales);
  - the period and age models have about 110 parameters each.
- **Unity reference** (nutpie, 4 chains × 10,000 iterations):
  - period–cohort: 1,047 s;
  - period by ideology: 129 s;
  - age window: 174 s.

  At 2,000 iterations, nutpie would take about 210 s for the period–cohort fit. TyMC's speed relative to nutpie on this model is the main unknown. Measure it first (milestone 1).
- **Fallback if it's too slow:** precompute the decided specification's figures and run only the reader's choice. Or fit fewer models by default (period–cohort first, since it carries the headline), with the others on request.

## Open decisions (Allen)

1. **Where the page lives (proposed 2026-11-02, Allen: one site to push):** in this repo, as part of the `jb/` site, so one `make -C jb deploy` publishes the blog drafts and the Overtron together.
   - Source: `overtron/` at the top of the repo (TypeScript, `package.json`, vite config). It sits outside `jb/` so MyST doesn't see `node_modules`.
   - The vite build writes a self-contained page (as TyMC's demos do, `tools/build_demo.mjs`). The excerpt is copied as static files next to the page, in `data/v1/`.
   - `jb/Makefile`: `build` runs the vite build, then `jupyter book build --html`, then copies the page and its data into `_build/html/overtron/`; `deploy` stays `ghp-import` of `_build/html`. The URL is `/OvertonParadox/overtron/`.
   - A MyST page in the table of contents (`jb/overtron.md`) explains what the Overtron does and links to it. An iframe is possible, but a full page gives the picker and figures room.
   - TyMC's examples catalogue can link to it.
2. **Hosting:** GitHub Pages, through the `jb/` deploy above. TyMC doesn't appear to need cross-origin isolation headers, which GitHub Pages can't set (see TyMC facts). Confirm in the spike.
3. **TyMC dependency:** it isn't on npm, so pin a commit of pymc-labs/tymc and build it, until there's a release.
4. **Difficulties for a reader's set:** **decided (Allen, 2026-11-02): calibrate on the chosen set**, as the decided spec does for `p48`. (For `econA`, this moves difficulties by up to 0.93 from the `p48` reference.)
5. **All modes:** **decided (Allen, 2026-11-02): no.** The excerpt holds the primary sample only.
6. **Coding edits:** **decided (Allen, 2026-11-02): v1 lets readers choose questions only**, with the decided coding.

## Milestones

1. **Spike:** port the period–cohort model to TyMC in Node, on cells exported from Python for `p48`. Time it, and compare the summaries with the saved trace. This decides whether the browser plan is feasible as written. Settings (Allen, 2026-11-02): light only, 4 chains × (1000 tune + 1000 draws) at target_accept 0.95, run locally in Node with two worker chains at a time. **Done (2026-11-02):** the same model (log densities agree with PyMC to about 2.5e-7) and the same results (within-cohort slope −0.843 [−1.007, −0.681] against −0.843 [−1.007, −0.682]). But it took 638 s on two cores: every draw is near the maximum tree depth. Next: discuss ways to shorten the trajectories before building the page (lab notebook, 2026-11-02). **Then (2026-11-02):** a reparameterization of the same model (the RW2 in its prior's eigenbasis, with the linear trend split out), plus TyMC's nutpie adaptation, brings the period–cohort fit to about 30 s for 2 chains × (1000 + 2000) on two cores, with R-hat max 1.008 and the headline numbers within 0.01–0.03 points of the saved fit.
2. **Excerpt and fixtures:** `overton/excerpt.py`, the manifest, and the fixtures. **Done (2026-11-02):**
   - **The excerpt** (`overtron/public/data/v1/`, gitignored; rebuild with `python -m overton.excerpt`, about 80 s):
     - the 68,005 respondents of the primary sample and the 170 candidates, 2.47 MB gzipped, with the analysis weight (decision 5);
     - `questions.json`: wording, value labels, default coding, ranking statistics, domain, and why each question is in or out of `p48` (coverage 49, topic 29, unstable 40, wording 12, confidence 13; several have more than one).
   - **Check:** decoded, the excerpt reproduces the decided `p48` scores of all 64,610 respondents (max difference 3e-16).
   - **Fixtures** (`overtron/fixtures/p48.json`, `econA.json`): codings, both calibrations, sampled scores, yearly means, cells, and the decided summary.
   - **For decision 4:** calibrating `econA` on itself moves its difficulties by up to 0.93 from the reference calibration on `p48`. For `p48` the two are the same.
3. **Measurement port:** coding, EM, scoring, and cells in TypeScript, tested against the fixtures. **Done (2026-11-02):**
   - `overtron/src/excerpt.ts` decodes the column store (in the browser with DecompressionStream). `overtron/src/measure.ts` codes the answers, calibrates (EM), scores, and builds the yearly means and the cohort × year cells.
   - **Tests** (`npm test` in `overtron/`, against both fixtures): EM difficulties within 2e-9, scores within 5e-16, and cells within 1e-8. The excerpt stores weights as float32, which accounts for that difference.
   - **EM speed:** about 250 ms per iteration for `p48`, which is about twice as fast as numpy. EM runs on distinct answer patterns, so small sets are nearly instant (`econA` has 72 patterns). But almost every `p48` respondent is distinct, so its calibration takes about 25 s. The page should precompute the presets' difficulties and calibrate custom sets in a Web Worker.
   - **Found:** for `p48`, the Python EM stops at its 100-iteration cap (last step 1.2e-4, tolerance 1e-4). Running to 1,000 iterations moves the difficulties by up to 0.009, mostly a shift in overall level, and the mean score by 0.002 points. The port reproduces the cap. Allen (2026-11-03): leave the cap, since the effect is negligible.
   - **`min_answered` for a reader's set** (Allen, 2026-11-03): 5, or 2 for a set of fewer than 10 questions (`measure.min_answered_for`). Presets keep their decided values: 5, and 2 for the econ and social sets.
4. **Models:** period and age, alongside the period–cohort model from the spike; summaries and components. **In progress (2026-11-03):**
   1. **Done.** `overtron/src/models.ts` has the period/age model and the period–cohort model, both in the trend form. It computes the RW2 eigenbasis in the browser (`src/linalg.ts`, cyclic Jacobi), because the walk length varies from fit to fit. Tested against PyMC (`fixtures/models.json`): points in the double-cumsum coordinates, mapped into this code's basis, reproduce PyMC's log densities within 1e-8 for the period and age models and 2.5e-7 for the period–cohort model.
   2. **Done.** `src/summaries.ts` ports the post-processing in `fit_series` and `fit_period_cohort`: bands, slopes, decomposition, components and trajectories. Tested on the same thinned, rounded draws of the saved fits (`fixtures/summaries.json`, 100 draws each), it matches Python within 1e-5 points.
   3. **Done.** `src/fits.ts` runs one fit in worker chains: the model travels to the workers as a small JSON spec in `ModelReference.argument`. `bench/run_p48.ts` runs the page's `p48` fits in Node, two chains at a time.
      - **Scope** (Allen, 2026-11-03):
        - the period model by self-identified ideology × 3;
        - the age model by decade of surveys × 6;
        - the period–cohort model;
        - within each decade of birth from the 1900s to the 2000s, the age model and the period–cohort model × 11 each.

        That's 32 fits, but not the social generations.
      - **Sampler** (Allen, 2026-11-03): 2 chains × (1000 + 2000), nutpie-style adaptation. target_accept is 0.99 for every fit except the all-respondents period–cohort fit, which uses 0.95.
      - **Result:** 149 s for all 32. The period–cohort fit takes 29 s, the small fits 1–7 s each. Every headline number is within 0.01–0.05 of the decided fits, except the 2000s birth decade (−5.69 vs −5.55, with a 90% interval about 50 points wide). The main fits have no divergences. The birth-decade period–cohort fits have up to 37, about 0.9% of draws, while production had up to 0.6%. At 0.95, the birth-decade fits had up to 217.
   4. **Done.** `latent_normals` (`src/measure.ts`) and `src/position.ts` (`by_year`, the 1974 liberal's percentile in each year, and each year's group medians). Tested against Python (`fixtures/position.json`): latent normals within 2e-9, the by-year table within 3e-7 points. The 2024 headline is percentile 61.32. `by_year` takes about 3 s for `p48`. **Headline** (`headline`, Allen, 2026-11-03): the 2024 percentiles with bootstrap intervals (200 resamples within the two years, weights carried along). Each resample reweights the same respondents (weight × count), so the likelihood is computed only once. Takes 8.3 s. The point estimates match Python exactly. The intervals differ by up to 1.2 points, because the random draws differ from numpy's. **Open:** the mechanism figure by decade of birth (`by_cohort`), which isn't in post 1.
   - **Deferred (Allen, 2026-11-03):** asking TyMC's maintainer to make `numerics.eigh` public, which would replace `src/linalg.ts`. Wait to see whether other requests come up.
5. **Page:** question picker, options, run, progress, figures, numbers, and diagnostics. **Design (Allen, 2026-11-03):**
   - **Look:** figures match post 1 (colors, labels, y-limits, 84% bands), redrawn as interactive SVG.
   - **Layout:** one column. Controls first, then Run and progress, then the results in post 1's order, each with the decided value for comparison.
   - **Picker:** the questions are grouped in subject categories (`overton/question_categories.py`; review table `docs/overtron_categories.md`). Each category has a select-all box with three states (all, none, some) and a count, and each question has its own box. In each category, the `p48` questions come first. Presets (`p48`, social, econ A, the book's 15) set the boxes as a starting point. Each question shows its span (first and last year, number of waves) and its status: `p48`, or why it was excluded.
   - **Coverage:** a strip shows, for each survey year, how many selected questions were asked, and flags thin years. The page warns but doesn't block, and says when the headline can't be computed because the set has no question in 1974 or 2024.
   - **Out of scope, addable** (`overton/out_of_scope.py`): religious belief and practice (16 questions plus `prayer`) and guns and hunting (`owngun`, `hunt`). They're coded and scored like the 170 and shown in their own categories, marked out of scope. The excerpt now has 188 questions, 2.69 MB compressed.
   - **Open:** which questions are hidden by default: all 140 outside `p48`, or only the coverage failures.
6. **Validation pass:** the checks above, plus a few odd choices.
7. **Publish:** host the page and link it from the blog series.

## TyMC facts

From pymc-labs/tymc at commit 6cc9129f (version 0.7.4-dev.1; clone in `~/tymc`), read 2026-11-02. Paths are in that repo. For the port, start with its agent skills: `skills/tymc-from-pymc`, `skills/tymc-in-the-browser`, `skills/tymc-modeling`, and `skills/tymc-checking-a-run`.

- **What the models need is there:**
  - `normal`, `half_normal`, `exponential`, `zero_sum_normal` (`src/distributions/index.ts`);
  - `cumsum`, `sigmoid`, `mean`, `dot`;
  - gather by a constant integer index (`x.at(idx)`);
  - `mdl.deterministic`.

  There's no GaussianRandomWalk; the docs write random walks as cumulative sums, which is how `rw2` is already written. Keep per-row deterministics out of the model, since there could be thousands (the cell-level models don't need any).
- **Likelihood alternatives, if we ever want them** (not v1; any change to the likelihood needs discussion):
  - `binomial` takes `{n, p}` with a per-row `n`;
  - `bernoulli` takes `logit_p`;
  - `ordered_logistic` exists.
- **Sampler:**
  - `sample_model({draws, tune, chains, seed, target_accept, max_tree_depth, adaptation})`. It is synchronous, so it runs in a worker.
  - `workers.parallel_sample` runs one Web Worker per chain and gives the same draws as a sequential run (`docs/guide/live_sampling.md`).
  - The CPU path is JS plus WASM in float64. WebGPU is experimental and slower for small hierarchical models, so use the CPU (`docs/guide/gpu_evaluation.md`).
- **Speed:**
  - The README's median across its corpus is about 1.28× nutpie in ESS per CPU-second.
  - Corpus models with 1,500–2,000 parameters sampled in 100–520 s of CPU (`examples/results/cloud_x86/tymc/`).
  - Our period–cohort model is small by comparison (2,442 cells, about 260 parameters), but it needs high target_accept, so the spike should measure it directly.
- **Outputs:**
  - `result.summary` gives R-hat, ESS bulk and tail, and MCSE; `result.divergences` gives the divergence count.
  - Draws come as `Float64Array`s, chains × draws × size.
  - The plots are Vega-Lite specs, and `mdl.live_session` updates them while sampling. We'd draw our own figures, but live trace plots could show progress.
- **Packaging:**
  - The package is `tymc`, ESM with no runtime dependencies, but it is **not on npm yet**: build it from the repo (`npm run build`) and depend on a pinned commit.
  - The demos bundle with vite into self-contained pages, and start workers from a Blob URL (`tools/build_demo.mjs`).
  - Nothing uses SharedArrayBuffer, so no COOP/COEP headers should be needed, and GitHub Pages should work. That isn't stated explicitly: check it in the spike.
- **Transpiler:**
  - `transpile.pymc(source)` translates PyMC model code to TyMC (`demo/pymc_transpiler.html`).
  - It refuses indexing with a model variable; our models index only with data.
  - It's worth trying on `build_period_cohort_model` as a cross-check of the hand port.
