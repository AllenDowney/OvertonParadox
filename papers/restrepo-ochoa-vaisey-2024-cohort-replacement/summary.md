# Summary: Restrepo Ochoa and Vaisey, "Opinions on Hard-to-Discuss Topics Change More via Cohort Replacement" (2024)

## Bibliographic entry

Nicolas Restrepo Ochoa and Stephen Vaisey. "Opinions on Hard-to-Discuss Topics Change More via Cohort Replacement." *Evolutionary Human Sciences* 6 (2024): e25, 1–18.

**DOI:** [10.1017/ehs.2024.13](https://doi.org/10.1017/ehs.2024.13)
**Open access:** Yes, under a CC BY licence (p. 1). The data, code, and supplementary materials are at <https://github.com/NicolasRestrep/sensitive_change> (pp. 2, 17).
**Local copy:** `restrepo_ochoa_vaisey_2024.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

Only the main text was summarized. The supplement, with the item list and model details, is in the GitHub repository above.

---

## Design

The paper uses the two models of individual change from Kiley and Vaisey (2020). In the "settled dispositions" model, beliefs form during youth and then stay stable. In the "active updating" model, people revise their beliefs throughout life (p. 3). The authors do not try to separate age, period, and cohort. Instead they compare between-cohort differences with within-cohort change, "with temporary period effects and biographical age effects subsumed in the latter" (p. 5).

For each item in each country, they fit two Gaussian regressions to individual responses (pp. 6–7):

- **M1:** μ = α + β_cohort[i]
- **M2:** μ = α + β_cohort[i] + φ·year_i + ζ_cohort[i]·year_i. This adds a linear year trend and a separate linear slope for each cohort.

Then **τ = R²_M1 / R²_M2**, "the proportion of variance explained that is preserved when only between-cohort differences matter" (p. 8). Values near 1 mean within-cohort change adds nothing. For their three stylized scenarios, τ is 0.98 with no within-cohort change, 0.72 with both kinds of change, and 0.07 with no cohort differences (p. 8). They defend the linear trend because "cultural change" usually means directional change, and they acknowledge that temporary shocks are invisible to it (p. 7).

**Data:** the WVS, 1981–2020, for eight countries chosen for completeness: Argentina, Australia, Canada, Japan, Mexico, South Africa, Sweden, and the USA. They use **56 items** that were asked in every wave, "some mundane and some highly sensitive," from childrearing qualities to the justifiability of euthanasia (pp. 2, 9). The full item list is only in the supplement.

**Sensitivity:** they ran a separate online survey on Prolific and CloudResearch. Respondents rated "how difficult would it be for the majority of people from you country to discuss the following question" on a scale from 1 to 10 (p. 9). After attention checks, 802 respondents remained, about 100 per country (Table 1, p. 10). Abortion, euthanasia, and suicide are among the hardest topics to discuss in most countries. Some patterns are local: corruption and government in Argentina, and race and immigration in Sweden (Table 2, p. 11).

**Analysis:** Bayesian regressions with intercepts and slopes that vary by country. In the first, absolute change (in pooled SDs, first wave to last) is regressed on median sensitivity, with a lognormal likelihood. In the second, τ is modeled as a mixture of two beta distributions, because it is bimodal, and the probability of belonging to the high-τ component depends on sensitivity (pp. 10, 13–15).

## Main results

- **Little change:** "most variables do not change much," especially in Mexico and South Africa (p. 12).
- **Homosexuality** has the most consistently large change across countries, and it tends to fall in the high-τ, high-change quadrant (p. 12). Abortion, euthanasia, and divorce follow the same pattern "at first glance" (p. 12). Items that change mostly within cohorts "are mostly related to confidence in institutions and childrearing" (pp. 12–13). Examples include confidence in the courts in Argentina, which tracks the trials of the military dictatorship, and confidence in the armed forces in Japan (p. 12).
- **Sensitivity does not predict the amount of change.** The coefficient is centered around 0.15 on the log scale, "and a considerable amount of the mass lies below 0" (p. 14).
- **Sensitivity does predict τ, weakly.** Most of the posterior for the coefficient lies above 0 (p. 15). A one-SD increase in sensitivity "predicts an increase in tau of 0.158 in Mexico" and 0.147 in Sweden. "Although the effect of sensitivity is not large," more sensitive issues tend to change more through between-cohort differences (p. 16).
- **Homosexuality is not pure replacement.** τ for homosexuality is high but "not at its theoretical maximum," so "some within-cohort change is happening everywhere" (p. 16). The text says "In the US, τ is around 0.67," but the sentence sits in a paragraph about Sweden, so the country is ambiguous (p. 16).

## Context the paper gives

- It extends the cross-sectional approach of Vaisey and Lizardo (2016) and the panel results of Kiley and Vaisey (2020), which both found that most change is cohort replacement but singled out gay rights as an exception (pp. 1, 4). It also extends that line of work beyond the U.S.
- Its foil is Tormos (2021), who emphasizes within-cohort change. The authors argue the two positions are compatible: Tormos looks at coefficient sizes, while they look at relative explanatory power, and "even under the circumstances of steep within-cohort changes, between-cohort differences could remain the primary mechanism of long-term linear change" (p. 16).
- They propose two reasons why sensitive beliefs might be slow to change. One is psychological: the beliefs are central to a person's worldview. The other is interactional: people rarely discuss these topics, which creates something like pluralistic ignorance (pp. 4–5). The authors say they cannot tell which applies (p. 15).

## Caveats/limitations

- **τ is a ratio of explained variances, not a share of aggregate change.** M1's R² includes stable cohort gaps in level, which exist even when nothing changes. And because cohort and survey year are correlated in repeated cross-sections, the cohort terms in M1 can absorb some common period trend. The paper does not discuss either point; both are our reading.
- Within-cohort change is linear only, and age is folded into it (pp. 5, 7).
- Only eight countries, none of them majority-Muslim, and India and China are missing (p. 9). The sensitivity sample is not representative (p. 10).
- Directional change is treated in absolute value. Neither the change model nor τ uses direction (p. 10).
- The effect is small, and the evidence for sensitivity comes from posterior mass and model-implied slopes, not from a large effect (pp. 15–16).

## Relation to this project

**Method.** Their M2 has the same structure as our period–cohort model: cohort effects plus a time effect, with no age term, so within-cohort change includes both aging and period effects. This paper is a published precedent for that choice. The decomposition differs, though. We split the change in mean conservatism into points: about 11.8 of 16.4 from replacement and 4.6 within cohorts. They compare R² per item. Our split answers "how much of the change came from replacement?" more directly. Their τ partly measures how well birth year predicts a person's answer, whether or not anything changed.

**Kiley and Vaisey 2020.** This paper is a direct successor. It keeps the settled-dispositions versus active-updating framing, takes gay rights as the known exception, and asks why issues differ. Both papers agree with our headline result: most change is generational, with some within-cohort movement.

**Social/economic contrast: weak connection.** None of the most sensitive items in Table 2 is about redistribution, and the main text names no economic items, so the paper cannot explain why our core economic questions move conservative within cohorts. Their framework ignores direction, so it cannot speak to economic questions polarizing or moving right. Read loosely, it would predict less within-cohort movement on sensitive social items such as abortion and homosexuality. That sits awkwardly with our liberal within-cohort slope for social questions, −1.16 points per decade. But τ is relative, and they also find within-cohort change on homosexuality "everywhere" (p. 16), so this is not a real conflict.

**Confidence questions.** Items about confidence in institutions are the ones they find changing within cohorts in response to events, such as the courts in Argentina and the armed forces in Japan (p. 12). That is consistent with our construct reason for excluding confidence questions: they evaluate institutions and respond to events, rather than take positions. It is supporting context, not a justification, since our exclusion was decided on other grounds.

## Possible use

- **Introduction:** one sentence, with Vaisey and Lizardo (2016) and Kiley and Vaisey (2020), as cross-national evidence that much opinion change is cohort replacement and that the balance differs across issues.
- **Methods:** cite it as precedent for a cohort-plus-time model without an age term, where within-cohort change includes aging (p. 5). Optionally contrast τ with our decomposition into points.
- **Discussion:** possibly in the section on confidence questions, citing p. 12. Do not cite it on the economic result.
