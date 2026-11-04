# OvertonParadox Project Board

Numbered tasks for tracking work. Each task has a permanent number; add new tasks at the end. Each task links to its own planning document in `docs/`. Update status as work progresses.

**Status values:** `Pending`, `In progress`, `DONE`

The overall plan, decided specification, and log are in `docs/plan.md`; the dated record of analyses is `docs/lab.md`. Earlier tasks for this work are on the ProbablyOverthinkingIt board (Tasks 9–11).

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
- [ ] Link from posts 1 and 3

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
- [ ] Validation pass, then publish and link from the blog series

**Related:** `docs/plan.md`, `docs/blog_series.md`, `overtron/`, `overton/excerpt.py`

---

## Task 3: Blog post 1, "Do people get more conservative as they age?"

**Status:** In progress (draft written 2026-11-03)

**Context:** The first post of the series (`docs/blog_series.md`): in every decade of surveys, older people are more conservative, but following the same people over time, their beliefs get a little more liberal. Draft `jb/post1_age.md`. Plan: `docs/post1_plan.md`.

**Checklist:**
- [x] Draft
- [x] Selection section for the current process
- [ ] Figures for `primary` (labels, references)
- [ ] Numbers refreshed from the `primary` results
- [ ] Link the technical appendix (Task 1)
- [ ] Read-through, edit, build
- [ ] Publish

**Related:** `docs/blog_series.md`, `overton/apc_figures.py`, `overton/apc_report.py`, `jb/`
