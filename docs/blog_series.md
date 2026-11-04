# The Overton paradox, updated: blog series outline

A series of short Probably Overthinking It posts presenting the complete analysis. Each post makes one point, with one or two figures. The results come first and the methods after, so a reader can stop after post 2 and have the whole story. The technical appendix notebook holds the details; posts link to it rather than repeat it.

Terminology: "self-identified ideology" for `polviews` (liberal, moderate, conservative), not "alignment" (2026-11-02).

Drafts: `jb/` (MyST site; post 1 is `jb/post1_age.md`, build with `make -C jb build-local`).

Numbers below are from the decided specification (lab notebook, 2026-11-01, "Results of the decided specification"): full pool of 48 questions, percent conservative responses (converted from out of 15 on 2026-11-02), 90% intervals. Relative position (percentiles): `figs/position_headline.csv`, `figs/position_{set}.csv`, `figs/position_cohorts_{set}.csv`. Figures are in `figs/apc/`.

**Open before writing:**
- Headline framing of the domain split (`docs/plan.md`, last checklist item). It affects posts 2 and 4 (post 1 decided: leave it to post 4).
- Variations not yet run (plan, Decisions). They feed post 5.
- By-N curves not yet redone with EM difficulties. They feed post 5.
- Use the `related-articles` skill to find earlier posts to link from each one.

---

## 1. Do people get more conservative as they age?

**Point:** In every decade of surveys, older people hold more conservative beliefs. But following the same people over time, their beliefs don't get more conservative; they get a little more liberal.

Task 3 on the board (`PROJECT_BOARD.md`); outline, figures, notes, related posts, and tasks in `docs/post1_plan.md`. Draft: `jb/post1_age.md`.

---

## 2. The Overton paradox

**Point:** Older people are more likely to say they're conservative, but their beliefs don't move right. They say it because the center moves faster than they do, so their position in the distribution moves right.

**Outline:**
- Old people are more likely to say they are conservative.
  - Task: import the period–cohort model with the ordinal likelihood and run the analysis for the underlying tendency to say "conservative".
- But that's what they say. Let's look at beliefs and attitudes.
- So why do people *say* they are more conservative?
- Because the center of mass moves faster than they do, so their location in the distribution changes.
- Overton shift: the average liberal starts out at the x percentile at the beginning of the series and ends up at the y percentile at the end. The difference is the Overton shift.

**Key results:**
- Change 1974–2024, liberal / moderate / conservative: −20.5 / −19.5 / −10.3 points.
- Overton shift: the median 1974 liberal is at the 26th percentile in 1974 and the 61st in 2024 [56, 66], passing the median around 2014; 63rd [57, 69] for social questions. In 2024, the median moderate is at the 46th and the median conservative at the 79th.
- Each decade of birth moves up in rank as it ages, although its scores fall (e.g. born in the 1950s: 18th–25th percentile in the 1970s, 54th–62nd since 2018).

**Key figures:**
- Self-identification by age (to make; the task above).
- [time_series_p48](../figs/apc/time_series_p48.png): liberals, moderates, and conservatives all move toward liberal answers.
- [position_p48](../figs/apc/position_p48.png): the 1974 liberal's percentile, year by year (the Overton shift).
- [position_cohorts_p48](../figs/apc/position_cohorts_p48.png): each decade of birth's percentile over time.

**Notes:**
- Who uses each label changes over time; that's the point, not a flaw.
- The percentiles come from latent distributions (normal on the logit scale, measurement noise removed). With the observed scores, the 1974 liberal's percentile in 2024 is lower (56th vs 61st); say which the post uses.
- Core economic questions: the 1975 liberal moves only from the 29th to the 44th percentile.

---

## 3. How to measure conservatism

**Point:** How the questions were chosen and how answers become a score, without hand-picking.

**Key results:**
- Rule-based pool: scope, coding, ranking by association with `polviews`, coverage (16 of 32 years), one question per topic, stability (reversals of at least a set size), no confidence questions → the new pool (48 questions under the rules of 2026-10-31; to be rerun with the revised stability rule, `docs/stability_review.md`, section 8).
- Score: one-parameter item response model, difficulties by weighted EM.
- The book's 15 hand-picked questions rank 4th–47th by the book's own criterion.

**Figures:** TBD (difficulties, or the question list as a table)

**Notes:**
- Why not just pick questions still asked: selects on the outcome (questions retired after opinion reached consensus).
- Item drift: questions move at different speeds, so a changing question set can bias the trend.
- **Definition, stated explicitly** (consultation, 2026-11-03): the scale measures adherence to a fixed collection of positions historically associated with self-identified conservatism. Conservative answers are identified by their association with `polviews`, and the paradox is about self-identification, so say so.
- **Connectivity:** the questions asked in each survey year, and the questions shared between the 1970s and the 2020s; what makes scores comparable across 50 years.
- **Stability:** why fading isn't a reason to exclude a question (near consensus, a stable question's gap shrinks; `fepres`), why reversals are; the drift diagnostic and the questions it listed, with the decisions.
- **Confidence questions:** excluded on construct grounds (evaluations of institutions, not positions; the Supreme Court and executive-branch examples); decided after seeing results, disclosed; the version with them as a sensitivity analysis (post 5).

---

## 4. Economic questions are different

**Point:** On social questions the classic Overton pattern holds; on core economic questions, opinion polarizes and people move toward conservative answers within cohorts.

**Key results:**

| | Social | Core economic |
|---|---|---|
| Within-cohort slope, points per decade | −1.16 [−1.34, −0.98] | +1.61 [+1.16, +2.07] |
| Liberal / moderate / conservative change | −22.3 / −23.0 / −14.0 | −10.1 / −9.5 / +3.9 |
| 1974 liberal's percentile in 2024 (1975 for core economic) | 63 [57, 69] | 44 [37, 50] |

**Figures:** [time_series_social](../figs/apc/time_series_social.png), [time_series_econA](../figs/apc/time_series_econA.png), [position_social](../figs/apc/position_social.png), [position_econA](../figs/apc/position_econA.png)

**Notes:**
- Economic claims scoped to the four core questions (`helppoor`, `helpnot`, `helpsick`, `eqwlth`); broad economic is about flat.
- Could be aging (income, property) or the period (economic politics since the 1980s); the model can't separate them.
- Depends on the headline-framing decision.

---

## 5. How much do the choices matter?

**Point:** Directions are robust; sizes depend on the choices, especially the questions.

**Key results:**
- Within-cohort slope as a function of N, with and without confidence questions.
- Variations, one or two per step: through 2018; all modes; heuristic difficulties; calibration choice; latent distribution (scale about 7% narrower, numbers move 0.04–0.10).

**Figures:** [within_cohort_slope_by_n](../figs/apc/within_cohort_slope_by_n.pdf) (to redo with EM)

**Notes:**
- Waits on the variations array.

---

## 6. Survey mode and the 2024 data (optional)

**Point:** Since 2021 the GSS is partly online, and some questions aren't asked online, so the recent years need care.

**Key results:**
- Five questions asked only in person since 2022; 2024 uptick concentrated among in-person respondents.
- Decision: interviewer-administered respondents in 2022 and 2024, raked weights; 2021 dropped.

**Notes:**
- Might fold into post 3 or 5 instead.

---

## 7. Grids, MCMC, and EM (optional, technical)

**Point:** Follow-up to the Bayesian Bake-Off with Ricardo Vieira: what estimated difficulties and pooling change, and why EM on the grid is the production choice.

**Key results:**
- Estimated difficulties correlate 0.999 with the heuristic, stretched by about 1.2, with a "who was asked" tilt.
- EM reproduces the MCMC difficulties to about 0.016, in seconds.
- Pooling toward one mean compresses group differences by about 40%.

**Notes:**
- Audience: PyMC readers. Could go on the PyMC Labs blog instead.
