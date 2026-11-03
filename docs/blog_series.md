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

**Outline:**
- This is an update of the analysis in Chapter 12:
  - new data (GSS through 2024);
  - better methods (developed for YWCN).
- Question: do people get more conservative as they get older?
- Method:
  - Core claim: conservative beliefs are the ones where liberals and conservatives differ.
  - What I did for the book.
  - What we did this time: selection process and rationale.
- If you observe people over an interval of time, the older ones have more conservative beliefs.
- But in their beliefs, people don't get more conservative over time:
  - aggregate by decade of birth;
  - aggregate by social generation;
  - period–cohort analysis.
- First metric: the slope of the period (within-cohort) component.

**Key results:**
- Age slope, percentage points per decade of age: +3.9 (1970s), +2.9 (1980s, 1990s), +2.1–2.4 (since 2000).
- Within-cohort slope: −0.84 [−1.01, −0.68] percentage points per decade.
- Decomposition of the total change (−17.0 points): generational replacement −12.0, changing minds −4.9 (71% replacement).
- Every birth group's within-cohort slope is negative or about zero; none moves toward conservative.

**Key figures:**
1. [age_series_p48](../figs/apc/age_series_p48.png): older is more conservative, in every decade of surveys. The setup.
2. [age_by_decade_p48](../figs/apc/age_by_decade_p48.png): the updated version of the book's figure (`overton5`: conservatism by age, grouped by decade of birth). Each decade of birth is flat or declining as it ages. Then explain the bias (below).
3. [trajectories_p48](../figs/apc/trajectories_p48.png): the period–cohort model's trajectory for each birth year, before aggregating (as in YWCN's cohort-trajectory figures).
4. [cohort_component_p48](../figs/apc/cohort_component_p48.png) and [period_component_p48](../figs/apc/period_component_p48.png): the trajectories decomposed. The cohort component is where each birth year starts (later birth years are more liberal); the period component is how everyone moves together (the within-cohort change). The first metric is the slope of a line through the period component. All respondents (the versions with liberals, moderates, and conservatives are `*_component_by_group_p48`).
5. [pc_by_decade_p48](../figs/apc/pc_by_decade_p48.png), then [pc_by_generation_p48](../figs/apc/pc_by_generation_p48.png): the same model fit within each decade of birth, then each generation, with each group's mix of birth years held fixed; every group moves toward liberal.

**Notes:**
- Within-cohort change combines aging and the times (age–period–cohort identification); phrase the claim that way.
- **Why the book's figure is biased.** A group spans many birth years (a decade, or 16–19 years for a generation), and its mix of birth years changes as you follow it:
  - **Against survey year:** over time, the oldest members die and drop out (and, for recent groups, the youngest age into the survey), so the group shifts toward later, more liberal birth years. The line falls even if no one changes their mind: biased down.
  - **Against age (the book's `overton5`):** at older ages only the group's earliest, more conservative birth years have been observed. The line rises with age even if no one changes: biased up. Figure 2 is the by-age version, so its bias works against its conclusion: the lines are flat or declining despite a bias that pushes them up. The by-year versions ([year_by_decade_p48](../figs/apc/year_by_decade_p48.png), [year_by_generation_p48](../figs/apc/year_by_generation_p48.png)) are biased the other way.
  - **The fix (YWCN):** the period–cohort model estimates each birth year's trajectory (figure 3), then aggregates with the group's mix of birth years held fixed (figure 5), so the composition can't move the line.
  - **The trajectories are parallel by construction:** on the logit scale, each birth year's line is the same period curve shifted by its cohort effect (no age term, no cohort × period interaction). So figure 3 shows the model's structure, not separate evidence for each cohort; the evidence is that the period component is estimated from cells that follow each cohort over time. Say so in the post. It also means the direction is easier to read from the period component (figure 4) than from the trajectories: every birth year's line has the same shape on the logit scale.
  - **Caution:** those are the directions composition pushes, assuming later birth years are more liberal; they aren't bounds. With the decided specification, the period–cohort slope falls between the by-age and by-year slopes for only 11 of 17 groups (10 of 17 before the 2026-11-02 refit, 15 of 17 in the exploratory run), and for the 1950s, 1960s, and 1970s the by-age slope is the more negative one. So the post shouldn't promise that the truth lies between the two.
- By generation instead of decade of birth: [age_by_generation_p48](../figs/apc/age_by_generation_p48.png).
- Decided (2026-11-02): post 1 doesn't mention the core economic exception (+1.6 points per decade within cohorts); it first appears in post 4.

**Related posts** (`related-articles`, 2026-11-02):
- [The Overton Paradox](https://www.allendowney.com/blog/2023/04/24/the-overton-paradox/) (2023-04-24): the book excerpt this post updates.
- [The Overton Paradox in Three Graphs](https://www.allendowney.com/blog/2023/09/19/the-overton-paradox-in-three-graphs/) (2023-09-19): the short version of the original argument.
- [The Center Moves Faster Than You](https://www.allendowney.com/blog/2024/01/04/the-center-moves-faster-than-you/) (2024-01-04): the mechanism; the natural lead-in to post 2.
- [Simpson's Paradox and Age Effects](https://www.allendowney.com/blog/2021/05/03/simpsons-paradox-and-age-effects/) (2021-05-03): older people look more conservative because of cohort, not age; the same argument with GSS data.
- [Sexual morality](https://www.allendowney.com/blog/2026/05/28/sexual-morality/) (2026-05-28) or [Confidence in Institutions](https://www.allendowney.com/blog/2026/05/19/confidence-in-institutions/) (2026-05-19): recent posts that use the same period–cohort model; link one as the method's introduction.
- [You Would Choose Now](https://www.allendowney.com/blog/2026/06/16/you-would-choose-now/) (2026-06-16): the book where the methods were developed.
- Optional: [Chasing the Overton Window](https://www.allendowney.com/blog/2022/11/09/chasing-the-overton-window/) (2022-11-09, the PyData NYC talk); [Old optimists and young pessimists](https://www.allendowney.com/blog/2021/04/27/old-optimists-and-young-pessimists/) (2021-04-27, Simpson's paradox in the GSS).

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
