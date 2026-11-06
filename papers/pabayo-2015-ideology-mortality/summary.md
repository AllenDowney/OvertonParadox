# Summary: Pabayo, Kawachi and Muennig, "Political Party Affiliation, Political Ideology and Mortality" (2015)

## Bibliographic entry

Roman Pabayo, Ichiro Kawachi, and Peter Muennig. "Political Party Affiliation, Political Ideology and Mortality." *Journal of Epidemiology & Community Health* 69, no. 5 (2015): 423–431.

**DOI:** [10.1136/jech-2014-204803](https://doi.org/10.1136/jech-2014-204803)
**Local copy:** `pabayo_2015.pdf` (this folder; gitignored). This is the Online First version, and the page cites below use its pages 1–9 (print page = local page + 422).

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

- **Data:** GSS respondents "from 1976 until 2008" linked to the NDI, n = 32,830. Vital status runs through December 31, 2008 (p. 2). Total follow-up is 498,845 person-years, with 9,271 deaths (28.2%) (p. 3).
- **Ideology:** polviews (7 points), measured once at the interview. As stated, the coding is Liberal (1–2), Moderate (3–5) and Conservative (6–7). The alternative coding, 1–3 / 4 / 5–7, gave "similar" results that are "not presented" (p. 2). Weighted shares are liberal 23.8%, moderate 34.5%, conservative 31.3% and missing 10.4% (Table 1, p. 3). **These shares match the GSS distribution under the 1–3/4/5–7 coding better than under 1–2/3–5/6–7, so it is unclear which coding the tables use.** Party ID and polviews correlate at only r = 0.30 (p. 2).
- **Models:** Cox proportional hazards with sampling weights and robust SEs clustered by region (p. 3).
  - Model 1 controls for sex, race, education, religious affiliation, age (8 bands), household income and marital status.
  - Model 2 adds region, urban/rural setting and "cohort", which here means survey year (1980s vs 1990s), not birth cohort.
  - Model 3 adds happiness and self-rated health (Table 3 notes, p. 7).

## Main results

**Ideology (Table 3, p. 6), HRs vs liberals:**

| | Crude | Model 1 | Model 2 | Model 3 |
|---|---|---|---|---|
| Conservative | 1.26 (1.17–1.36) | 1.06 (1.01–1.12) | 1.06 (1.01–1.12) | 1.07 (1.01–1.12) |
| Moderate | 1.22 (1.14–1.32) | 1.06 (1.01–1.10) | 1.06 (1.01–1.11) | 1.06 (1.01–1.11) |
| Other/missing | 1.40 (1.31–1.50) | 1.00 | 1.00 | 0.96 |

- Crude cumulative mortality: liberals 24.5%, conservatives 29.6%, moderates 29.6% (p. 3). The crude HR is confounded by age.
- **Party:** in the crude model Republicans have *lower* mortality than Democrats (0.88). After adjustment only independents differ (AHR 0.93) (Table 2, pp. 3–4).
- **Strata (p. 5):**
  - By SES, ideology is not associated with mortality at high and medium SES. At low SES the HR is 1.08 (reported CI "0.99 to 1.92", probably a typo).
  - By survey period, conservatives have AHR 1.07 (1.01–1.14) before 1990. After 1990 only moderates are significant (AHR 1.09).
  - By sex, there is no association for women; for men, conservatives have HR 1.10 (1.02–1.18).
- **Age:** no age-specific HRs are reported. Age enters only as a covariate (HR 19.26 for over-80s vs 18–20, Table 3), and the model assumes the ideology HR is the same at every age.
- **Mediation:** happiness and self-rated health "did not mediate the relationship" (p. 5).

## Context

The authors present the result as "discordant" with earlier cross-sectional and ecological findings that conservatives are healthier (p. 8). They suggest that subjective health and subjective ideology may share perceptual confounding (p. 8).

## Caveats

- Ideology and covariates are measured once; there are no time-varying measures (p. 8).
- The two CIs are barely above 1, and with clustering by only 9 regions the robust SEs may be understated.
- The category coding is ambiguous (see Design).
- The 1.06 is adjusted for SES, which suits causal questions. For cohort composition the relevant figure is the total mortality differential within a birth cohort, roughly an HR adjusted for age and sex only, and the paper does not report it. It probably lies between 1.06 and 1.26 (1.26 still includes confounding by age).

## Relation to this project

Peterson et al. (2020) and O'Grady (2023) raise differential mortality as a possible source of within-cohort liberal drift. This paper is the GSS evidence on how large that mortality gap is.

**Rough back-of-envelope illustration, not a method change.**

Assumptions:
- Gompertz mortality, h(a) = A·e^(0.085a), calibrated to h(40) ≈ 0.002, h(60) ≈ 0.012 and h(80) ≈ 0.066.
- Moderates and conservatives share one HR relative to liberals.
- Starting shares from Table 1, with missing dropped: liberal 26.6%.
- Survivors' liberal share is p·S / (p·S + (1−p)·S^HR).

Change in the liberal share among survivors:

| Ages followed | Survival S | HR 1.06 | HR 1.26 |
|---|---|---|---|
| 20→72 | 0.68 | +0.5 pp | +2.0 pp |
| 30→82 | 0.40 | +1.1 pp | +4.9 pp |
| 40→92 | 0.12 | +2.6 pp | +12.0 pp |

To convert this into our scale, multiply by D, the gap in mean percent conservative between liberals and non-liberals on polviews. Assuming D ≈ 20 points (a guess that needs checking against our data):
- At HR 1.06 the drift is about 0.1–0.5 points, against our 4.6.
- At the inflated HR of 1.26 it reaches about 1 point for cohorts followed from age 30, and about 2.4 points only for cohorts followed from 40 to 92.

Most cohort-years in the GSS come from people followed less than 52 years, and most of the attrition happens after 75, so mortality plausibly accounts for less than about 10–20% of the within-cohort change. That is the right order to call it minor, but it is not a bound.

**What a proper bound would need:**
1. An HR adjusted for age and sex but not SES, ideally age-specific; GSS-NDI is now public through later years.
2. The actual issue-scale gap by polviews category.
3. Survival applied to each cohort's observed ages and the GSS sample's age distribution, ideally through a reweighting check in our model.

## Possible use

- **Limitations/discussion:** the GSS-NDI estimate of the conservative–liberal mortality gap is small (AHR 1.06, Table 3), so composition effects by mortality are likely a fraction of the −4.6-point within-cohort change. Give the rough calculation as an illustration and propose the proper bound as future work.
- **Do not cite** it as showing that conservatives are less healthy in general. The crude party result points the other way.
