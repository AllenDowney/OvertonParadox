# Summary: Fufunan, Jin, and Freese, "Mode Effects and Temporal Continuity in the General Social Survey: Mode-Specific Weights for 2022 and 2024" (2026)

## Bibliographic entry

Resty Fufunan, Olivia Jin, and Jeremy Freese. "Mode Effects and Temporal Continuity in the General Social Survey: Mode-Specific Weights for 2022 and 2024." SocArXiv preprint, April 10, 2026.

**DOI:** [10.31235/osf.io/tda59_v1](https://doi.org/10.31235/osf.io/tda59_v1) (the PDF itself says "DOI pending")
**Free PDF:** [OSF](https://osf.io/tda59_v1). This is a preprint and has not been peer reviewed. The weights (`wtssps_f2fp`, `wtssps_web`) and all the R code are at <https://github.com/restyfufunan/gss-mode-weights> (p. 15).
**Local copy:** `fufunan_jin_freese_2026.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox. Also relevant to the mode decision in `docs/mode_design.md`, whose reviewer suggested comparing our raked weights with these.

Page numbers are counted from the page headers in the extracted text.

---

## Design

The data are the 2022 and 2024 GSS. In both years, households were randomly assigned to be contacted face to face first or by web first (p. 2). "FTF/Phone" means `mode` 1 or 2 and "web" means `mode` 4 (p. 12). The paper doesn't say what happens to `mode` 3 cases.

The paper makes three analyses:
1. **Who completes by web:** a logistic regression of web completion on the raking variables and year, with Shapley values for each predictor (pp. 3–4).
2. **Mode gaps after adjustment:** two weighted logistic regressions for each of 143 dichotomized items, one with only a mode indicator and one adding the demographic covariates and year. Significance uses Holm correction, and the weight is WTSSPS (pp. 4–5).
3. **Distance from the baseline:** for each item, the absolute distance of the 2022–2024 estimate (under the mode-specific weights) from the pooled 2016–2018 estimate (N = 5,090). An item is "FTF-aligned" if dist_FTF < dist_Web (pp. 7–8).

**How the weights are built (pp. 12–13):**
- The targets are the full sample's WTSSPS-weighted margins, separately for each year.
- Each mode subsample starts from WTSSPS and is raked with `survey::rake()` on seven margins: marital status (2 categories), nativity (2), sex (2), education (3), age group (5), census region (4), and race/Hispanic origin (8).
- Missing raking values are filled by hot-deck imputation first.
- The weights are rescaled to a mean of 1.

## Main results

- **Who completes by web:** education is the strongest predictor (Shapley 32.1%), then race/Hispanic origin (30.1%) and marital status (15.3%, OR = 1.46) (p. 4).
- **Mode gaps survive adjustment:** after demographic adjustment, 65 items (45.5%) still have a Holm-significant mode gap (p. 6). Adjustment "does not alter mode differences as systematically or substantially as one might have expected" (p. 6). The direction is split: 36 of the 65 items are higher under FTF and 29 higher under web (p. 6). `xmarsex` has one of the largest remaining gaps, with web respondents higher (adjusted +0.648; p. 6).
- **Distance from the 2016–2018 baseline:** FTF/Phone is closer on 100 items (70%), with mean distance 0.041, versus 0.066 for web (p. 8). FTF/Phone is also closer than the full multimode sample on 84 items (59%); the full sample's mean distance is 0.046 (p. 8).
- **By domain:** the FTF/Phone advantage is largest for religion (closer on all 11 items) and smallest for race and inequality (47.1%) and civil liberties (41.2%) (Table 5, p. 9).
- **Assigned sequence vs. completion mode:** within each completion mode, respondents assigned to different first contacts barely differ. Zero web items and one FTF item are significant, out of 143 (p. 11). The authors conclude that "it is whether respondents answered via web or FTF that drives the differences" (p. 11).
- **Their recommendation:** "FTF/Phone-restricted analysis using the wtssps_f2fp weights will provide the most direct comparison with the historical GSS time series" (p. 11).

## Context the paper gives

- WTSSPS supports inference from the whole sample. Applied to a single mode, it doesn't bring that subsample in line with the population margins (Table 6 note, p. 14). For example, FTF/Phone respondents are 35.8% married unweighted and 45.8% under WTSSPS, against a target of 50.8%.
- The mode-specific weights "should not be applied to the combined sample" (p. 15).
- The authors expect NORC to release official mode-specific weights later (p. 11).

## Caveats/limitations

- **Built-in advantage:** the baseline was all face to face, which gives FTF "a structural proximity advantage by construction" (note 3, p. 8). Being closer to the past isn't evidence of accuracy, and the comparison ignores any real change between 2018 and 2022–24.
- **Unmeasured selection:** the weights "cannot account for unmeasured characteristics" that predict mode (p. 11).
- **No nonresponse adjustment:** the weights skip WTSSNRPS's nonresponse step (p. 12).
- **Scope:** they cover 2022 and 2024 only; there is nothing for 2021.
- **Minor inconsistencies:**
  - The regression section mentions "eight raking covariates" (p. 5), but the appendix lists seven (p. 12).
  - The paper counts about 206 phone respondents in 2022 (p. 15); our table has 201.
  - The domain lists include `courts` and `racopen` (p. 8), which our data show were asked only of interviewer respondents in 2022 and 2024. The paper doesn't say how it got web estimates for them.

## Relation to this project

**Supports our decision.** Our rule is interviewer respondents in 2022 and 2024, raked to the full sample's margins, with 2021 dropped (`docs/mode_design.md`, Review round 1). Their recommended procedure matches it in sample definition, starting weight, and raking targets. The sequence result fits CultureWar's finding that the randomized arms can tell us little: what matters is the mode respondents completed in, not the arm they were assigned to.

**Complicates it, a little.**
- **Different raking margins:** ours are age group, sex, race/ethnicity, education, and region. Theirs add marital status and nativity, and marital status is the third-strongest predictor of mode (p. 4).
- **Not a justification on its own:** their closeness-to-baseline evidence is results-based and favours FTF by construction. Our justification should stay with continuity of the measurement procedure; their result can be cited as consistent with it.
- **Domain variation:** where web holds up (race and inequality, civil liberties), our score may be affected too.

**Does not contradict it.**

**Weights are available for comparison.** According to the paper, the weights are in `gss20222024_modeweights.dta`, which merges onto the GSS by `id` and `year` (p. 13). We could compare `wtssps_f2fp` with our raked weights case by case, and compare the 2022 and 2024 scores and `polviews` shares under each. One thing to check: their weights are rescaled to a mean of 1, so they may need renormalizing to match how we scale weights across years.

## Possible use

- **Methods (data/mode paragraph):** cite it as the precedent for interviewer-only analysis with raked weights, and for the finding that the differences come from completion mode, not the assigned sequence (p. 11).
- **Sensitivity analysis:** report results with `wtssps_f2fp` alongside our raked weights, as the reviewer suggested.
- **Limitations:** cite the unmeasured-selection caveat (p. 11) and the FTF baseline advantage (note 3, p. 8).
