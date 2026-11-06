# Summary: Hout, "America's Liberal Social Climate and Trends: Change in 283 General Social Survey Variables between and within US Birth Cohorts, 1972–2018" (2021)

## Bibliographic entry

Michael Hout. "America's Liberal Social Climate and Trends: Change in 283 General Social Survey Variables between and within US Birth Cohorts, 1972–2018." *Public Opinion Quarterly* 85, no. 4 (2021): 1009–1049.

**DOI:** [10.1093/poq/nfab061](https://doi.org/10.1093/poq/nfab061)
**Free PDF:** open access (CC BY-NC) at the DOI and at [PMC8754487](https://pmc.ncbi.nlm.nih.gov/articles/PMC8754487/). Stata code for all transformations and analyses is in the Supplementary Material (p. 1011).
**Local copy:** `hout_2021.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

The framework comes from James A. Davis (1980, 1992). **Climate** means differences between cohorts, and **weather** means trends within cohorts (p. 1009). Davis found a liberal climate with conservative weather in the Reagan era. Hout updates that analysis to 2018 (p. 1010).

**Data.** Every GSS question asked at least four times over at least twenty years, excluding questions about other people. That gives 312 questions, combined into **283 outcome variables**: attitudes plus behaviors, statuses and identities (pp. 1010–1011). About 30 variables are reverse-coded. Race series start in 1978. N ranges from 3,476 to 64,426 (p. 1011). Weights are oversamp × wtssnr (note 2, p. 1012).

**Model.** For each variable he fits OLS with dummies for year and for cohort. Birth years are grouped so that cohort and period both have 32 categories, to avoid "cohort differences might exceed period differences as an artifact" (p. 1011). He fits seven models, with and without covariates (gender, race-ethnicity, education, immigration, region, rural-urban). The components are square roots of R² differences: net cohort = √(R²₃ − R²₂) and net period = √(R²₃ − R²₁) (eqs. 8–13, p. 1012). He rejects linear trends because "theory predicts nonlinear change" (note 1, p. 1011).

**Age.** "Conspicuously missing from the covariates is age" (p. 1012). Within-cohort change "combines period and aging influences" (p. 1019). His check for age is the period × cohort interaction (Fienberg and Mason). It is significant (p < .01) for **25 of 283 outcomes (9%)** (p. 1013).

**Direction.** He standardizes each variable and regresses it on polviews. A negative coefficient means the variable leans liberal, a positive one means it leans conservative, and |b| < 0.03 means no lean (29%) (pp. 1017–1018). The direction of change is the mean of the latest 10% of cohorts (or periods) minus the mean of the earliest 10% (p. 1018). The text does not say whether the period difference is net of cohort. A trend is liberal if a liberal-leaning item rose or a conservative-leaning item fell (p. 1018).

## Main results

**Climate beats weather on amount of change.** Net cohort change exceeds net period change for **195 of 283 (69%)** variables (p. 1013). The median R for period plus cohort is 0.18. Covariates "barely changed" the results (p. 1013).

**Shares (Table 2, p. 1017), 282 variables (polviews is excluded because it is the classifier):**

| | Opinions (224): cohort | Opinions: period | All (282): cohort | All: period |
|---|---|---|---|---|
| Liberal | 62% | 51% | 60% | 48% |
| Conservative | 5% | 11% | 5% | 11% |
| No trend | 7% | 12% | 6% | 12% |
| No lean | 26% | 26% | 29% | 29% |

The abstract and the conclusions quote the opinion column (62/51; pp. 1009, 1029). The introduction quotes the all-variables column (60/48; p. 1010). The conclusions give 6% conservative between cohorts, where the table has 5% (p. 1029).

**Largest changes.** Retired, ever married, newspaper reading, computer use, gay marriage, and civil liberties for a gay man (Table 1, pp. 1014–1015). For same-sex sex, the within-cohort average "increased one standard deviation unit" (p. 1022). Premarital sex shows cohort change only (pp. 1023–1024). Marijuana shows conservative weather through the 1980s, then liberal weather (p. 1021).

**Hot issues barely move.** "Abortion ranked 237th overall, gun ownership ranked 124th, gun regulation 251st, help for the poor 167th and 229th... health care ranked 149th, 150th, and 227th" (p. 1017). He says the liberal drift "left several hot issues unmoved" (p. 1017).

**Lean codes (Table A4; cohort letter, then period letter).**
- Political views: rank 193, LX (p. 1042).
- Party ID: rank 261, XC (p. 1045).
- Abortion scale: XC, rank 237 (p. 1044). Abortion for any reason: LL, rank 220 (p. 1043).
- Oppose gun permits: XC, rank 251 (p. 1044). Owns a gun: LL, rank 64 (p. 1036).
- Taxes on rich too low: CC, rank 53 (p. 1036).
- Gov't assist the poor: LX, rank 229. Gov't help sick: LL, rank 227 (p. 1043).
- Gov't reduce inequality: LL, rank 238 (p. 1044). Gov't reduce income gap(s): LX at 146 and LL at 159 (pp. 1040–1041).
- Spending: welfare: LX, rank 139 (p. 1040). Spending: poor: LL, rank 167 (p. 1041).

Matching these labels to GSS mnemonics (e.g., "Gov't assist the poor" to `helppoor`) is our inference; the appendix doesn't give mnemonics.

"None of the biggest changes refer to the historic rise in economic inequality" (p. 1025).

**Conservative trends.** Military spending and confidence in the military, and confidence in the press (p. 1027).

## Context the paper gives

- **Politics.** The liberal results are "surprising given conservatives' many wins in elections, legislation, and policy," which "hints that American politics may not respond to public opinion efficiently" (p. 1029). Liberal social items "are not factors in elections," and gun ownership, abortion and law enforcement "changed little" (p. 1029).
- **Party ID.** It moved slightly but steadily toward the Republicans from 1972 to 2004. Its correlation with polviews rose from 0.21 to 0.51 (pp. 1029–1030).
- **Polviews is unstable for individuals.** The two-year panel correlation is 0.62, against 0.81 for party ID. Hout says it "suffices" to classify lean (p. 1018).
- **Sources.** He cites Ellis and Stimson (2012) for stable economic attitudes (p. 1025) and Dangelis et al. (2007) against the stereotype that people become rigid with age (p. 1010).

## Caveats/limitations

- Variables are counted one per item, so heavily asked topics (race, gender, civil liberties) dominate. The set is "not a random sample of opinions" (p. 1030).
- Direction is a crude difference of the earliest and latest 10% of cases. There are no intervals on the direction, and it is unclear whether the period difference is net of cohort (p. 1018). If it is a raw average, his within-cohort direction includes replacement.
- Lean depends on the sign of a regression on polviews, with an arbitrary cutoff at 0.03. The table does not explain why polviews itself gets different lean letters for cohort and period (p. 1042).
- The age check is indirect. A non-significant P×C test does not rule out a smooth aging trend, because linear aging is absorbed into period and cohort (pp. 1012–1013, 1029).
- The data end in 2018. Change is measured in R units, which show size, not direction.

## Relation to this project

**Supports.** Hout uses the same decomposition we do: cohort plus period with no age term, and within-cohort change read as "period and aging influences" combined (p. 1019). His liberal climate and mostly liberal weather on social items match our 11.8 points from replacement and our within-cohort social slope of −1.16 per decade. He also defines liberal by its correlation with polviews, as we do when we select questions.

**Overlap (risk of looking redundant).** On the descriptive headline ("cohorts more liberal, and within cohorts too, mostly"), Hout got there first with the same data. We need to say plainly what we add:
1. a single latent score with magnitudes and credible intervals (−4.6 points, −0.82 per decade), not shares of items;
2. data through 2024;
3. a smooth Bayesian model, not dummies;
4. the relative-position (Overton) analysis of polviews.

**Differs.**
- **Economic items.** His economic items look flat or liberal within cohorts: Gov't help sick LL, reduce inequality LL, assist the poor LX. We find core economic questions moving conservative (+1.61 per decade). Possible reasons are his crude endpoint measure, possibly not net of cohort; the period to 2018 vs 2024; and his "LL/LX" codes on items with tiny R. The discrepancy has to be addressed, not ignored. His "Taxes on rich too low: CC" and his party-ID drift toward the Republicans do lean our way.
- **Politics.** His puzzle (liberal opinion, conservative politics) is a cousin of the Overton paradox, but he explains it by issue salience and inefficient representation. He has nothing on labels moving relative to the center. He also cannot study polviews' trend directionally, because it is his yardstick. We offer a different and complementary explanation: the labels move.

## Possible use

- **Related work:** the main citation for between- and within-cohort liberalization across the GSS (pp. 1009, 1017). Contrast item counting with our latent score.
- **Methods:** precedent for omitting age and interpreting the period component as period plus aging (pp. 1012, 1019). He tests age with the P×C interaction (9% significant, p. 1013); cite that as a partial check.
- **Discussion:** reconcile his flat or liberal economic items with our conservative economic within-cohort trend. Cite his "conservatives' many wins" puzzle (p. 1029) as the motivation that the Overton paradox speaks to. Cite the polviews panel correlation of 0.62 (p. 1018).
