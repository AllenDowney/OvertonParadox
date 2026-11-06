# OvertonParadox Project Board

Numbered tasks for tracking work. Each task has a permanent number; add new tasks at the end. Each task links to its own planning document in `docs/`. Update status as work progresses.

**Status values:** `Pending`, `In progress`, `DONE`

The overall specification (Decisions table), ideas to consider later, and the log are in `docs/plan.md`; the phase history is in `docs/plan_history.md`; the dated record of analyses is `docs/lab.md`. Earlier tasks for this work are on the ProbablyOverthinkingIt board (Tasks 9–11).

---

## Task 1: Technical appendix

**Status:** Pending (planned 2026-11-04)

**Context:** An executable notebook that shows the whole process, from data to results. It runs on Colab by downloading the Overtron's data excerpt from a GitHub release, and it's built as a page of the jb site; the blog posts link to it. Plan: `docs/appendix_plan.md`.

**Checklist:**
- [x] Regenerate the excerpt for the `primary` pool (with Task 2)
- [x] Open questions: self-contained code, `notebooks/appendix.ipynb` with stored outputs, shorter fits compared with the saved results (2026-11-04)
- [x] Release `data-v1`
- [x] Write the notebook (draft; runs locally, all checks pass)
- [x] Run on Colab; build in jb
- [x] Deployed with the jb site (https://allendowney.github.io/OvertonParadox/appendix/); linked from post 1
- [ ] Link from post 3

**Related:** `docs/plan.md` (Phase 6), `docs/blog_series.md`, `overton/excerpt.py`, `jb/`

---

## Task 2: The Overtron (the Overton pipeline in the browser, with TyMC)

**Status:** In progress (moved from the ProbablyOverthinkingIt board, Task 11, 2026-11-04)

**Context:** A web page that runs the whole Overton pipeline in the browser with [TyMC](https://github.com/pymc-labs/tymc). It loads a data excerpt from this repo: every interviewer-sample respondent, with raw responses to all 170 candidate questions. The reader chooses the questions that define "more conservative" (presets, categories, or any subset). The page then runs coding, EM difficulties, grid scores, the period, period–cohort, and age models, and the relative position, and shows post 1's figures. Plan: `docs/overtron_plan.md`.

**Checklist:**
- [x] Open decisions
- [x] Spike: the period–cohort model in TyMC
- [x] Data excerpt, manifest, and reference fixtures (`overton/excerpt.py`)
- [x] Measurement in TypeScript, tested against the fixtures
- [x] Models (period, period–cohort, age), summaries, and relative position
- [ ] Page: picker and figures done; diagnostics panel (including failed fits), decided values next to the reader's, `jb/` integration
- [x] Regenerate for the `primary` pool and rename (`in_primary`, presets, fixtures, `run_primary.ts`; 16 tests pass)
- [x] Published with the jb site (`make -C jb deploy` builds it into `/overtron/`): https://allendowney.github.io/OvertonParadox/overtron/; linked from post 1 (2026-11-04)
- [ ] Validation pass

**Related:** `docs/plan.md`, `docs/blog_series.md`, `overtron/`, `overton/excerpt.py`

---

## Task 3: Blog post 1, "Do people get more conservative with age?"

**Status:** In progress (draft written 2026-11-03)

**Context:** The first post of the series (`docs/blog_series.md`): in every decade of surveys, older people are more conservative, but following the same people over time, their beliefs get a little more liberal. Draft `jb/post1_age.md`. Plan: `docs/post1_plan.md`.

**Checklist:**
- [x] Draft
- [x] Selection section for the current process
- [ ] Figures for `primary` (labels, references); fine-tune label placement only after the question set is settled (Allen, 2026-10-31; moved from `docs/plan.md`)
- [ ] Headline framing given the domain results (social questions: no within-cohort conservative shift; core economic: a conservative shift and polarization). Decide how the posts, appendix and paper present the split (Allen; moved from `docs/plan.md`, shared with Task 4)
- [ ] Numbers refreshed from the `primary` results
- [x] Link the technical appendix (Task 1)
- [ ] Read-through, edit, build
- [ ] Publish

**Related:** `docs/blog_series.md`, `overton/apc_figures.py`, `overton/apc_report.py`, `jb/`

---

## Task 4: arXiv paper (possible)

**Status:** In progress (literature review done; development process confirmed and `paper/` stub built; ANES replication in Task 5; 2026-11-06)

**Context:** A more academic version of the Overton work for arXiv, with a focused related-work discussion (not a survey). Plan: `docs/paper_plan.md`. Literature review: `docs/literature_review.md`; papers and summaries in `papers/`.

**Checklist:**
- [x] Find candidate papers; archive and summarize the ones available (18 so far)
- [ ] Get the rest (Kollman & Jackson 2026, Ellis & Stimson 2012) and summarize them
- [x] Confirm the development process (Markdown → pandoc → LaTeX in a self-contained `paper/` folder; `make arxiv` builds the zip)
- [x] Set up `paper/` (template, Makefile, figure manifest); one-page stub through `make arxiv` (2026-11-06)
- [ ] Decide framing and which new analyses, if any (list in the plan)
- [x] Decide whether to do the ANES replication: yes, as Task 5 (`docs/anes_plan.md`, 2026-11-06)
- [ ] Outline; draft methods and results, then introduction and discussion
- [ ] Read-through; build the zip from scratch; upload to arXiv

**Related:** `docs/literature_review.md`, `papers/`, `docs/blog_series.md`

---

## Task 5: ANES replication

**Status:** In progress (data built, all fits and relative position done, results recorded; 2026-11-06)

**Context:** Does the GSS result (older people more conservative in every decade, but a slight liberal drift within cohorts; self-identified ideology relative to a moving center) hold in the ANES? Reviewers of the paper (Task 4) will likely ask. Formerly Phase 5 (`docs/plan_history.md`). Plan: `docs/anes_plan.md`.

**Checklist:**
- [x] Feasibility: count ANES attitude items asked often enough to apply our selection rule (about 37 in the pool, about 16 after coverage and one per battery; 2026-11-06)
- [x] Rank the candidates by association with `VCF0803`, as in the GSS selection; pool of 32 after one per topic (2026-11-06)
- [x] Data: the 1948–2024 CDF (2026-02-05), copied from ~/ExtractANES to data/; coverage and ranking rerun (2026-11-06)
- [x] Decide the specification (years, weights, mode, item coding), recorded in the plan: all years 1972–2024, weight `VCF0009z`, all modes (interviewer-administered as a check), everyone kept whether or not they placed themselves
- [x] Selection, EM difficulties, scores, period–cohort fit, relative position: 74 fits plus reruns, the min-2 variation, domain sets (`docs/anes_question_domains.md`), relative position for both samples
- [x] Compare with the GSS; decide where it appears: a replication section in the paper's main text (Allen)
- [x] Web vs interviewer-administered comparison, 2012–2024: composition close after weighting, answers more conservative on the web (a mode effect)
- [ ] Revisit the decided sample (all modes) in light of the mode comparison? The GSS uses interviewer-administered respondents for measurement continuity (Allen to decide)
- [ ] Sampling: the moderate period–cohort fit and the broad and inclusive economic period–cohort fits are still marginal (R-hat 1.012–1.018)
- [ ] Figures for the replication section (as post 1's, with 2002 flagged)

**Related:** `docs/anes_question_domains.md`, `overton/anes_data.py`, `scripts/anes_*.py`, `docs/plan_history.md` (Phase 5), `docs/paper_plan.md`

---

## Task 6: Apply the revised selection (`primary`)

**Status:** In progress (carried over from `docs/plan.md` 2026-11-06; fits done 2026-11-03)

**Context:** The revised selection rules (stability, item drift) produced the 53-question set `primary`. The 86 fits are done; what's left is regenerating everything downstream. Plan: `docs/stability_review.md`, section 8; history in `docs/plan_history.md` (Phase 4b). The open items were copied as recorded on 2026-11-03, so some may already be done; check before starting.

**Checklist:**
- [x] Thresholds, stability rule, selection rerun, item-drift diagnostic, names, connectivity table
- [x] Recalibrate, re-prepare, and refit on Unity (86 fits, 2026-11-03)
- [x] Figures, report, and Overtron data (excerpt, fixtures, presets) from the new fits (commit 58c4e79)
- [ ] Sensitivity: with the confidence questions; the previous 48-question selection. Reported neutrally, not used to choose
- [ ] Revise post 1's selection steps for the new rules (the stability example, `fepres`, is no longer excluded)

**Related:** `overton/stability.py`, `overton/item_drift.py`, `overton/apc.py`, `unity/overton_apc_revised_jobs.txt`, Task 3

---

## Task 7: Reproducible data build and cleanup

**Status:** Pending (carried over from `docs/plan.md` 2026-11-06)

**Context:** The repo should build its data from a fresh clone, and the scripts left over from the exploratory phase should be retired. Plan: `docs/repro_plan.md`.

**Checklist:**
- [ ] Run `scripts/build_data.sh` end to end from a fresh clone
- [ ] Remove the dependence on `~/CultureWar` in `overton.candidates` and `overton.data`
- [ ] Retire the scripts that still use resampling (comparisons from the exploratory phase)

**Related:** `scripts/build_data.sh`, `overton/data.py`, `overton/candidates.py`

---

## Task 8: Difficulties follow-ups and variations

**Status:** Pending (carried over from `docs/plan.md` 2026-11-06)

**Context:** Follow-up analyses from the second difficulties review, and the planned variations (a few per step of the decided specification) that show how much each choice matters. Plans: `docs/difficulties_design.md` (future work) and the Decisions table in `docs/plan.md` (variations). The paper (Task 4) may add items here; any method change is discussed first.

**Checklist:**
- [ ] Redo the by-N results, the birth-group fits, and the figures with `--difficulties em`, including the mode sensitivity runs for the final set (may be superseded by Task 6; check)
- [ ] Item trends for core vs broad economic questions: what makes broad economic flat?
- [ ] Residual associations within domains (e.g., the four core economic questions after conditioning on conservatism)
- [ ] Inspect the divergences in `period_s50-em`
- [ ] Optional: bootstrap the EM calibration within survey replicates
- [ ] Variations, a few per step (see Decisions in `docs/plan.md`)
  - [x] Minimum number of answered questions: 2 instead of 5, GSS and ANES main fits. No material difference (2026-11-06; `docs/anes_plan.md`, "First results")

**Related:** `docs/difficulties_design.md`, `docs/plan.md` (Decisions), `docs/lab.md`
