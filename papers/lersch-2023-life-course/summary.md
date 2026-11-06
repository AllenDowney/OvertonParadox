# Summary: Lersch, "Change in Personal Culture over the Life Course" (2023)

## Bibliographic entry

Philipp M. Lersch. "Change in Personal Culture over the Life Course." *American Sociological Review* 88, no. 2 (2023): 220–251.

**DOI:** [10.1177/00031224231156456](https://doi.org/10.1177/00031224231156456)
**Free PDF:** open access (CC BY 4.0) at the DOI. The code for the complete analysis is at <https://doi.org/10.17605/OSF.IO/UEY5H> (note 5, p. 247).
**Local copy:** `lersch_2023.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

Only the main text was summarized. Domain-level results (Figure D.4, Table D.2) are in the online supplement, which we don't have; checking it for a left-right or party item is still open.

---

## Design

The paper answers Kiley and Vaisey (2020) directly. It proposes a **life course adaption model** (LCAM): stable dispositions from early imprinting, plus persistent change through life-course transitions, plus transitory fluctuation (pp. 223–228). Persistent change is "a shift in baseline" by age, meaning a change "not followed by a similarly sized change in the opposite direction" (p. 221).

Data: six long-running household panels from Australia, Britain, Germany, Switzerland and the United States. They are BHPS 1991–2008, HILDA 2001–2019, PSID 1968–2019, SHP 1999–2019, SOEP 1984–2019 and UKHLS 2009–2020 (Table 2, p. 230). The sample covers respondents aged 18 to 79 (p. 230). There are **428 outcomes**, each measured in at least three waves, covering "gender ideology, policy issues, moral behavior, party affiliation, interests in politics" and more (pp. 230–231). On average each outcome is measured in about seven waves, about three years apart, over windows of 3 to 36 years (p. 231). A simulation shows that persistent change "cannot be reliably detected" in a three-wave, four-year panel like the GSS (p. 228).

Model (Eq. 3, p. 232): each standardized outcome (z-score) is modeled as β0 + β1·age + u0i + u1i·age + ε. Age is centered at 18 and divided by 10. The model also includes gender, immigrant status, **birth-cohort categories** (–1939, 1940s, 1950s, 1960s [ref.], 1970s, 1980–) and **period fixed effects** (pp. 231, 233). The LCAM is compared by BIC with the settled-disposition model (random intercept only) and an autoregressive active-updating model (p. 233). The 418 usable sets of estimates are pooled in a two-stage individual participant data meta-analysis with survey random intercepts (pp. 233, 238).

## Main results

**Model fit.** On the restricted sample, the LCAM is preferred for 48% of outcomes, active updating for 27% and settled dispositions for 22% (pp. 236–237). The LCAM beats settled dispositions in 71% of outcomes on the full sample (p. 237). This is "in contrast to earlier findings (Kiley and Vaisey 2020)" (p. 237).

**Size of persistent change.** Item-level age coefficients "mostly fall between –.20 and .20," so personal culture shifts "by less than a fifth of a standard deviation" per decade (p. 238). The variance in age slopes is mostly below .03 (p. 238). The pooled estimate: "The typical change in personal culture is .07 standard deviations for every 10 years of age adjusted for period effects," 95% CI .06 to .09 (p. 239). For comparison, cohorts born before 1940 differ from the 1960s cohort by .18 SD (p. 239).

**Direction is not analyzed.** The meta-analysis uses "the absolute values of the coefficients for age … because the direction of change … [is] not of substantive interest" (p. 238). Table 1 says the same: "direction of change is irrelevant" (p. 229). The .07 therefore measures how much people change, not which way. The pooled effects come "with considerable individual-level variation in the direction and size" (p. 239).

**Age pattern.** With 10-year age splines, slopes are smaller at older ages, but the coefficient is still .10 at ages 70–79. From age 20 to 60, culture changes "by a total of about .70 standard deviations," and change is "likely episodic and not continuous" (p. 241). In fixed-effects models with period dummies, age coefficients are larger and fall from .22 at ages 18–29 to .14 at 50–59 (pp. 241–242). He concludes that "change in personal culture becomes less likely with age" (p. 243).

**Other results.**
- Parenthood shifts culture by .07 SD, mostly in "gender and family." There is no association in "politics, government & economy" (pp. 240–241).
- The variance in age slopes grows for younger cohorts (p. 241).
- By domain, the effects are smaller for "environment & climate" and "national identity, ethnicity & immigration," and larger for "occupation & education" (note 13, p. 247).

**Bottom line:** "at the population level, social change will mostly occur through cohort replacement," although within-person change "may nonetheless be consequential at the individual level" (p. 244).

## Context the paper gives

- It quotes Kiley and Vaisey's conclusion that persistent change is "an uncommon phenomenon among adults" (p. 221). The author thanks Kiley for sharing his analysis code (p. 246).
- It cites a literature on within-person change after life events, such as moral progressivism, trust, gender roles and immigration concern. The effect sizes there are "often small" but "can accumulate" (p. 221).
- People "remain open to change" across "all dimensions of personal culture," but "the degree of openness decreases with age" (p. 244).

## Caveats/limitations

- **Common period shifts are absorbed.** Period fixed effects remove shifts that everyone shares. The author says lasting period-driven change is "compatible with" the LCAM, but the fixed effects treat period differences as "fleeting environmental influences" (pp. 231, 245). In our reading, the age slope is identified within individuals only through the coarse cohort bins, because age and period advance together.
- He acknowledges the age-period-cohort problem: "Disentangling these influences … can only rest on (untestable) assumptions" (p. 245). He also says "age has no causal influence on personal culture"; age is "a distal proxy" for life-course transitions (p. 245).
- No result for a specific item or for political ideology is reported in the main text.
- All six panels are household surveys, mostly from outside the US, and the US panel (PSID) has few core culture items (Table 2 note, p. 230).
- The analysis is associational, with no mechanisms tested (p. 245).

## Relation to this project

**Supports replacement as the main channel.** Within-person change is "consistently smaller than between-individual differences," and social change happens "mostly … through cohort replacement" (p. 244). That fits our estimate that replacement accounts for about 11.8 of 16.4 points.

**Neither supports nor contradicts "more conservative with age."** The pooled effect is an absolute value (p. 238), and item coefficients fall on both sides of zero (p. 238). The paper gives no evidence on direction, for ideology or anything else. Citing it as evidence that people do or do not turn conservative would misread it.

**Its age effect is not our within-cohort drift.** Like Kiley and Vaisey's intercept, Lersch's period fixed effects absorb shifts shared by everyone. Our −0.82 points per decade within cohorts is a common period movement, so in his model it would sit in the period terms, not the age slope. His .07 SD per decade is change by age net of common shifts. Our period–cohort model, with no age term, measures the shared movement directly. The two are complementary, not competing.

**Overton paradox: weak connection.** Party affiliation and political interest are among his outcomes (pp. 230–231). However, he reports no left-right self-placement result, and parenthood has no political association (p. 241). The paper does weaken Kiley and Vaisey's finding that ideology is stable after 30 as a general claim about adults, because short panels cannot detect slow change (p. 228). It does not show which way labels move.

## Possible use

- **Introduction:** cite it with Kiley and Vaisey (2020) to say that panel evidence disagrees on whether adults change persistently. It agrees that any such change is small next to between-person differences, and that aggregate change runs mainly through replacement (p. 244).
- **Discussion:** cite it (1) for the point that period fixed effects, like Kiley and Vaisey's intercept, remove the shared drift we estimate (pp. 231, 245); (2) for short panels being unable to detect slow change (p. 228), which bears on reconciling our drift with panel "stability"; and (3) with care, to say that long-panel evidence on direction is not available here (p. 238).
- **Do not** cite it for or against "people become more conservative with age."
