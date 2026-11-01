# How should the analysis handle the GSS's change of interview mode after 2018?

*A design question. Allen Downey, 2026-11-01.*

## Background

We are updating an analysis of the "Overton paradox" (Chapter 12 of *Probably Overthinking It*) with General Social Survey (GSS) data from 1972 through 2024. Each respondent's conservatism is estimated from their answers to 43 opinion questions, chosen by a fixed rule. Each question has a fixed "conservative" answer, and the score comes from a one-parameter item response model whose question difficulties are estimated by weighted EM. Scores are reported as the expected number of conservative answers out of 15.

The scores then feed several analyses:
- trends by self-described political alignment (`polviews`: liberal, moderate, conservative);
- the "Overton gap": the average self-described conservative in the last survey year minus the average liberal in 1974;
- age–period–cohort models (Bayesian random-walk smoothers, survey-weighted), whose main quantity is the "within-cohort slope", the average change in conservatism per decade within birth cohorts.

Until 2018, the GSS was an interviewer-administered survey, almost all face to face. Starting in 2021, it isn't. This document asks how the analysis should handle that change. The decision should rest on what is best justified, not on which choice gives which result.

## What changed

**The survey design** (GSS documentation; sources at the end):
- **1972–2018:** face-to-face interviews, with a small share by phone.
- **2021:** address-based sample, push-to-web: a web questionnaire, with phone as an option. No face-to-face interviews (COVID-19). Weights post-stratified to the 2019 American Community Survey.
- **2022 and 2024:** multimode. Face to face, web, and phone when necessary. **Sampled cases were randomly assigned to be offered the web questionnaire first or a face-to-face interview first;** nonrespondents were then offered the other mode. The design was meant to compare data-collection approaches and to bridge the face-to-face series and the 2021 design.

**Respondents by mode of completion** (`mode`: 1 in person, 2 phone, 3 multimode, 4 web):

| Year | In person | Phone | Multimode | Web |
|---|---|---|---|---|
| 2018 | 2,094 | 245 | 0 | 0 |
| 2021 | 0 | 293 | 218 | 3,521 |
| 2022 | 1,562 | 201 | 148 | 1,633 |
| 2024 | 1,174 | 254 | 119 | 1,762 |

**What NORC says about mode:**
- **Differences by mode are not mode effects.** "While observed differences between modes may suggest mode sensitivities, these are not true 'mode effects.'" The mode a respondent completed in depends on:
  - the experimental condition;
  - the timing and sequence of modes offered;
  - nonresponse follow-up (larger incentives, subsampling);
  - measurement differences: response order, interviewer effects, social desirability.
- **Use the sample as a whole.** "The GSS is intended to be used as a whole sample and so analyzing the data by a single mode is not recommended." The weights are tuned on all cases and "are not designed for single-mode analysis"; there are no single-mode weights.
- **Trends.** NORC asks users to include a statement that changes in 2021–2024 "relative to historical trends may be due to actual change in concept over time and/or may have resulted from methodological changes", and to "take extra care to ensure the analysis reflects actual changes in public opinion and is not unduly influenced by the change in data collection methods."
- **Item-level screening (2022 only, preliminary).** NORC tested 163 trend variables for mode sensitivity, after adjusting for demographics and experimental condition. For our 43 questions:
  - "likely mode sensitive": `xmarsex`;
  - "requires further investigation": `abany`, `fefam`, `fepresch`, `pillok`;
  - "less likely to be mode sensitive": 25 questions, including `polviews` itself;
  - not assessed: 13 questions (`colcom`, `colhomo`, `courts`, `divlaw`, `fepol`, `getahead`, `grass`, `helpnot`, `popular`, `prayer`, `racmar`, `racopen`, `tax`).

  NORC says the screen is limited and that unassessed variables shouldn't be assumed insensitive. It also mentions plans for tools to handle mode, such as mode-specific weights, weights adjusted for the multimode design, or imputation. We haven't found any that have been released.

**Questions not asked on the web.** In 2022 and 2024, 7 of our 43 questions were asked only of interviewer-administered respondents: `grass`, `prayer`, `divlaw`, `courts`, `fepol`, `racopen`, `getahead`. Two more questions weren't asked at all in those years: `colhomo` (last asked 2021) and `racmar` (2002). So in 2022 and 2024, interviewer respondents could answer at most 41 of the 43 questions, and web respondents at most 34. `polviews` was answered by 91–99% of respondents in every mode.

**Weights.** The analysis uses `wtssall`, or `wtssps` where `wtssall` is missing (2021 and later). NORC now recommends its post-stratification weights for every year: `wtssps`, or `wtssnrps`, which adds a nonresponse adjustment. They are "recommended above all other previous GSS weights" and are available from 1972 on in the cumulative file. So our weights come from one system through 2018 and another from 2021, which is a second discontinuity at the same boundary.

## Why it matters for this analysis

The method compares respondents across 50 years on a common scale. That requires three things that the mode change puts in question:
1. **The questions measure the same thing in every year.** If answering on a screen rather than to an interviewer changes the share of conservative answers (social desirability, response order, visual vs aural presentation), a question's difficulty is no longer fixed. The scale then shifts in 2021–2024, for reasons unrelated to opinion.
2. **Respondents' question sets are missing at random, given their conservatism.** Since 2022, which questions a respondent answered depends on mode. Earlier work found that some questions drift (the conservative answer becomes rarer faster than the scale as a whole). If that holds, a systematic difference in which questions were answered becomes bias, not just noise (lab notebook, 2026-10-30: "Item drift"). Mode determines the question set for 7 of the 43 questions.
3. **The sample represents the same population in the same way.** Mode of completion is self-selected within the protocol, and the weights changed systems.

These matter differently for different quantities:
- **The Overton gap** uses the last survey year directly (conservatives in 2024), so it depends entirely on the post-2020 data at one end.
- **The within-cohort slope and the decomposition** use every year. The post-2020 surveys are 3 of 33.
- **The period models** include a year-level noise term, which can absorb a level shift in a single year but not a persistent shift across 2021, 2022, and 2024. A persistent shift would show up in the trend.

**Identification problem.** In this data, mode and time are almost perfectly confounded. Every survey after 2020 is web or multimode, and every survey before is interviewer-administered. So a "design era" term (a level shift from 2021 on) can't be separated from real change in opinion after 2020 without outside information. Within 2022 and 2024, comparing modes of completion mixes measurement with self-selection (NORC's point). The randomized assignment of the first mode offered would identify the effect of the protocol (web-first vs face-to-face-first) on our score. That's an intent-to-treat contrast, diluted by people who completed in the other mode, but it's free of self-selection. We haven't found the assignment indicator in the cumulative file; it may be in the 2022 and 2024 single-year files or the paradata.

## Options

**A. Pool all modes, no adjustment** (the current approach). Treat 2021–2024 like other years, use the whole sample with NORC's weights, report NORC's caveat, and check sensitivity (below).
- For: follows NORC's guidance to use the sample as a whole; adds no assumptions that can't be checked; mode differences are not mode effects, so there's nothing clean to adjust for.
- Against: assumes the difficulties and the measurement are the same across modes, which NORC's screen questions for a few items. Uses the post-2020 data at face value, including for the endpoint of the Overton gap.

**B. Stop the primary analysis at 2018.** Report 2021–2024 separately, as an extension with caveats.
- For: one design throughout (interviewer-administered, one weight system); the question sets are random by ballot, not determined by mode.
- Against: leaves out the most recent and most relevant years ("today's conservatives"); treats a change in measurement as disqualifying even where the evidence of mode sensitivity is weak for most of our questions.

**C. A mode or design-era term in the models.**
- (C1) A level shift for 2021 and later in the period and age–period–cohort models. Not identified apart from real change after 2020 (see above), so it would need a prior from outside the data, e.g., from NORC's experiment.
- (C2) Adjust each respondent's score for mode of completion. Mode is self-selected, so this adjusts for selection as well as measurement, which NORC warns against.
- (C3) A model-based mode adjustment from the survey literature (Kolenikov and Kennedy 2014; Brick et al. 2022). These need auxiliary variables or assumptions (e.g., the selection into mode is ignorable given covariates). That's a substantial extension.

**D. Remove the mode-dependent part of the question sets.** Drop the 7 interviewer-only questions:
- (D1) in every year, which gives a consistent instrument where web and interviewer respondents in 2022–2024 can answer the same questions; or
- (D2) only after 2018. This is what the data already do for web respondents, so it differs from A only for interviewer respondents.

D1 changes the construct (36 questions instead of 43). The interviewer-only questions are not a random subset; they include questions on drugs, school prayer, divorce, courts, women in politics, and housing discrimination.

**E. Weights.** Separate from mode, but at the same boundary: keep `wtssall` filled with `wtssps`, or switch to `wtssps` (or `wtssnrps`) for every year, as NORC recommends. Switching applies one weighting system across the whole series.

**F. Use the randomized protocol assignment as a diagnostic.** If the assignment indicator is available, estimate the difference in the score (and in each question) between the web-first and face-to-face-first protocols in 2022 and 2024. This tests whether the protocol changes the measurement, without self-selection. It doesn't by itself give an adjustment for 2021, which had no face-to-face arm.

## Our lean

**A, with E and F, and B and D1 as sensitivity analyses.** The reasons, in order:

1. **NORC's guidance:** use the whole sample and its weights, and don't treat differences by mode as mode effects. Any adjustment for mode (C) would rest on assumptions this data can't check: either that mode is unconfounded with real change after 2020 (C1), or that selection into mode is ignorable (C2, C3).
2. **One weighting system (E):** NORC's post-stratification weights for every year. This removes a discontinuity at 2018/2021 that's under our control; the mode change isn't.
3. **A randomized check where one exists (F),** if the assignment indicator can be found. It's the only comparison in the data that separates measurement from selection.
4. **Sensitivity analyses that define the scope of the claims:** through 2018 (B), which is the consistent-design version; and without the interviewer-only questions in every year (D1), which is the consistent-instrument version. These are reported because they correspond to the two assumptions the primary analysis makes (stable measurement across designs; question sets missing at random). They aren't there to pick a preferred result.
5. **NORC's statement in the article and the appendix,** with the quantities that depend most on the post-2020 data (the Overton gap, which uses 2024 at one end) identified as such.

## Questions for review

1. **Primary specification.** Is pooling all modes with no adjustment (A) the best-justified primary analysis? Or does the change in design make the 2018 cutoff (B) the better primary, with 2021–2024 as an extension?
2. **Mode terms.** Is there a defensible way to include mode in the models (C) given that mode and time are confounded and mode of completion is self-selected? Or is the right treatment no adjustment plus sensitivity analysis?
3. **Interviewer-only questions.** Should the 7 questions not asked on the web stay in the primary set (missing by design for web respondents), or be dropped in every year for a consistent instrument (D1)? The question-selection rules were fixed before this issue was considered, and dropping them would change the construct.
4. **Weights.** Should the analysis switch to NORC's post-stratification weights (`wtssps` or `wtssnrps`) for every year? If so, which one?
5. **The randomized protocol assignment.** Is the intent-to-treat comparison (F) worth pursuing, and how should its result be used: as a diagnostic only, or to inform an adjustment?
6. **Endpoint quantities.** Should quantities that use the last survey year directly (the Overton gap) be reported with 2018 as well as 2024 as the endpoint, regardless of the primary choice?

## What we have already looked at

These checks were run earlier, before this decision was framed (lab notebook, 2026-10-30; confidence-question review, 2026-10-31). They describe the data and are listed for completeness, not as criteria for the choice.
- In 2022 and 2024, the shares of conservative answers on some questions differ between web and interviewer respondents, in both directions, and the conservative–liberal gaps are larger among web respondents for many questions. The composition of each mode changed between 2022 and 2024 (conservative self-identification fell among in-person respondents and rose among web respondents).
- The five questions that later became interviewer-only were drifting relative to the rest of the book's set before 2018.
- A version of the book's analysis through 2018 only, and versions without the five interviewer-only questions from the book's set, were run with the book's 15 questions. They have not been run for the current 43-question set with EM difficulties.

## Sources

- GSS 2022 mode sensitivity note: "Mode Sensitivity in the 2022 GSS, Release 1" (NORC), https://gss.norc.org/content/dam/gss/get-documentation/pdf/other/2022%20GSS%20Mode%20Sensitivity%20Note%20v1.pdf
- GSS 2022, "What's New in 2022": https://gss.norc.org/content/dam/gss/get-documentation/pdf/other/GSS%202022%20-%20What's%20New.pdf
- GSS 2024, "What's New in 2024" (R3a): https://gss.norc.org/content/dam/gss/get-documentation/pdf/other/GSS%202024%20-%20Whats%20New%20R3a.pdf
- GSS 2022 and 2024 codebooks: https://gss.norc.org/content/dam/gss/get-documentation/pdf/codebook/GSS%202022%20Codebook.pdf, https://gss.norc.org/content/dam/gss/get-documentation/pdf/codebook/GSS%202024%20Codebook%20R3a.pdf
- Kolenikov, S., and C. Kennedy (2014). "Evaluating three approaches to statistically adjust for mode effects." *Journal of Survey Statistics and Methodology* 2(2): 126–158.
- Brick, J. M., C. Kennedy, I. Cervantes-Flores, and A. W. Mercer (2022). "An Adaptive Mode Adjustment for Multimode Household Surveys." *Journal of Survey Statistics and Methodology* 10(4): 1024–1047.
