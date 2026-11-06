# Summary: Jocker, van der Brug & Rekker, "Growing Up in a Polarized Party System" (2024)

## Bibliographic entry

Thomas Jocker, Wouter van der Brug, and Roderik Rekker. "Growing Up in a Polarized Party System: Ideological Divergence and Partisan Sorting Across Generations." *Political Behavior* 46 (2024): 2263–2286. Published online 21 February 2024.

**DOI:** [10.1007/s11109-024-09917-x](https://doi.org/10.1007/s11109-024-09917-x)
**Open access:** yes, CC BY 4.0 (p. 2283). The online appendices (A–D) hold the variable lists and most of the tables. Local copy: `jocker_2024_online_appendix.docx` (Springer ESM file `11109_2024_9917_MOESM1_ESM.docx`, downloaded 2026-11-06; gitignored). See "Online Appendix C" below.
**Replication data:** Political Behavior Dataverse, doi:10.7910/DVN/SYFSLI (p. 2275, fn. 8).
**Local copy:** `jocker_vanderbrug_rekker_2024.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

**Question.** Is mass polarization driven by generational replacement? The authors split polarization into two parts, following Lelkes (2016) and Hill & Tausanovitch (2015) (p. 2266):

- **Ideological divergence:** how spread out opinions are, regardless of party.
- **Partisan sorting:** how closely issue positions line up with party identification.

The hypothesis was that generations that came of age with polarized elites would be more sorted (H1, p. 2268).

**Data.** The GSS and ANES cumulative files, 1972–2021 (p. 2271). GSS results are the main ones; ANES is used for immigration (the GSS doesn't ask about it repeatedly) and to replicate the GSS results (Appendix D). The main text doesn't give sample sizes.

**Outcomes (pp. 2271–2272).** Five outcomes:

- three indices: social welfare; race and gender; culture and morality
- ideological self-placement (in the GSS, `polviews`)
- immigration (ANES only)

The full item list is in Online Appendix A. The main text names only the GSS culture and morality items: abortion, premarital sex, same-sex relations, and divorce laws (p. 2272, fn. 3). The 2021 GSS is dropped from the culture models because the questions changed (fn. 2). Every item is coded so that it correlates positively with Republican party identification, and each index is the average of its items, rescaled to 0–1 (p. 2272). So "conservative" is defined by party here; in our project it is defined by `polviews`.

**APC identification (pp. 2272–2273).** They follow Kritzer (1983): they constrain age and cohort and estimate period freely.

- **Period:** one dummy for each survey year. This "pick[s] op [sic] unpredictable oscillations, that could be due to sampling errors as well as sudden events" (p. 2272).
- **Cohort:** five Pew generations, from Greatest (1910–1927) to Millennial (1981–1996) (Table 1, p. 2269). People born before 1910 or after 1997 are dropped. With decade-of-birth groups instead, the general patterns are "similar" (p. 2273, fn. 5).
- **Age:** four life stages, taken from the socialization literature: 17–21, 22–29, 30–65, and 65+ (p. 2273).

They argue that constraining only one component "requires heroic assumptions" (p. 2272, citing Bell 2020).

**Models (pp. 2273–2275).**

1. Regress each outcome on the age, period, and cohort dummies (Eq. 1).
2. Take the absolute residual as each person's divergence and regress it on the same dummies (Eqs. 2–3).
3. Standardize attitudes and party ID by the residual over the predicted divergence (Eq. 4).
4. Regress standardized attitudes on standardized party ID, interacted with all the dummies, to estimate sorting (Eq. 5).

Each model is run with and without controls for race, college education, and active Protestantism. Standard errors come from 1,000 bootstrap resamples (p. 2275).

## Main results

**Mean levels.** These results are in Online Appendix C, not the main text. "New generations are indeed significantly and substantially more liberal than previous generations across all issue dimensions" (p. 2275). In the discussion, the authors also say "citizens grow somewhat more conservative (see 'Online Appendix C') and polarized throughout their lifespan" (p. 2282). The main text gives no size for either effect.

**Generations (pp. 2276–2277).**

- *Divergence:* the effects are small, and "older generations tend to be more diverged ideologically" (p. 2276).
- *Sorting:* the Greatest and Silent generations are the least sorted and Boomers the most. Millennials are "the second least sorted cohort" on social welfare (p. 2276). H1 is rejected (p. 2276).
- *ANES replication:* Millennials come out the most sorted on race and gender, though not significantly. The authors say this shows "some of the instabilities of these APC-models" (p. 2276, fn. 11).

**Period (p. 2278).**

- *Sorting* increased on every outcome. On ideological self-placement it went "from 0.25 in 1974 to 0.78 in 2021." On immigration it went "from 0.00 in 2008 to 0.49 in 2020" (−0.15 to 0.29 with controls). Sorting on cultural issues was "virtually non-existent" until the late 1980s.
- *Divergence* increased for ideological self-placement and social welfare. On culture and immigration, an early increase "seems to have abated." Race and gender show no clear pattern.

The introduction overstates this, describing "modest trends of increasing ideological divergence on all issue dimensions" (p. 2265).

**Age (pp. 2278–2281).**

- *Divergence:* effects are small, and if anything people diverge a little as they age.
- *Sorting:* it increases from the two youngest age groups to age 30 and over, for self-placement and social welfare. These effects "disappear once we control for religion, education, and race/ethnicity" (p. 2278).

**Conclusion.** "period effects are the most consequential factor affecting mass polarization in the US," consistent with the lifelong openness model (p. 2281). Generational replacement "dampens this trend instead of fueling it" (p. 2282).

## Online Appendix C: mean levels (read 2026-11-06)

Table C.1 (GSS; ANES for immigration) gives the mean-level APC estimates from Eq. 1: OLS with dummies for generation, survey year and the four age groups. All outcomes are on a 0 (most liberal) to 1 (most conservative) scale. The reference categories are Boomers, 1996 and ages 30–64. Without controls, then with controls:

- **Age effects are tiny.** Relative to ages 30–64:
  - *Ideological ID:* 17–21 is −0.01/−0.02, 22–29 is −0.01/−0.01, 65+ is −0.00/−0.01.
  - *Social welfare:* 22–29 is −0.01/−0.01, 65+ is +0.02/+0.01.
  - *Race & gender, and culture & morality:* 65+ is +0.02 (+0.00 and +0.01 with controls).

  These are one or two hundredths of the full range of the scale. One hundredth of the scale is about 0.06 points on the 7-point polviews scale.
- **Cohort effects are roughly ten times larger.** On culture and morality, Greatest is +0.15 and Millennial −0.03 relative to Boomers, a spread of 0.18 (0.13 with controls). On ideological ID, the spread is +0.05 to −0.05.
- **Period, ideological ID:** −0.06 in 1974, rising to about 0 by the mid-1990s and staying there through 2021 (−0.01). The appendix text says so: "despite the absence of a conservative trend across any policy dimension, there was a period from the 1970s to the mid-1990s when more Americans identified as conservative," and the trend "has stagnated over the past two decades."
- **Period, policy:** social welfare shows "no discernable trend". Race & gender turns liberal after 2014 (−0.05 in 2016, −0.11 in 2021). Culture & morality is −0.07 in 1974, +0.06 in 2004 and −0.04 in 2018. Net of their age and cohort constraints, that is a rise toward conservative to the mid-2000s and then a fall.
- **The authors' own summary of age:** "Americans grow somewhat more conservative on average throughout their lifespan… However, these effects should not be overstated, and in some instances may even be reversed come late adulthood (65+). Overall, age effects are far weaker than both cohort and period effects, and several age coefficients do not attain statistical significance."

**What this means for us.** The sentence in the main text ("citizens grow somewhat more conservative," p. 2282) rests on age differences of about 0.01 on a 0–1 scale, mostly between young adults (under 30) and ages 30–64, with no further rise after 65. That is much weaker than the main text suggests, and the authors' appendix says as much. It is also identified only through the grouping constraints. The period pattern for ideological ID, with self-identification moving conservative from the 1970s to the 1990s while no policy dimension moves conservative, is the Overton pattern in another model, and it is worth quoting.

## Context the paper gives

- A short review of generational sorting studies (pp. 2264–2265): Stoker & Jennings (2008), Levendusky (2009), and Twenge et al. (2016) found younger people more sorted. Phillips (2022), which separates life-cycle and generational effects, found little generational difference.
- Formative years: about ages 12–25, with the peak at 18 (p. 2267, fn. 1).
- Studies that find people become "somewhat more conservative as they grow older": Peterson et al. (2020) and Tilley & Evans (2014) (p. 2270).

## Caveats/limitations

- The age and cohort effects depend on the grouping constraints. The authors' own footnote on unstable APC results (fn. 11) applies.
- The mean-level results, which are the ones closest to our project, are only in an appendix we haven't read. The main text gives no numbers for them.
- The sorting results are correlational, and causation could run either way between party and issue positions (p. 2275, fn. 6).
- The low R² values in the divergence models mean "only a limited proportion of the individual-level variation" is due to age, period, and cohort (p. 2276, fn. 9).
- The data end in 2021, so the 2022 and 2024 GSS are not included, and Gen Z is excluded.

## Relation to this project

The overlap is real but narrow. The paper is about the spread of opinions and the sorting of opinions by party; we are about the average level of conservatism and self-identified ideology.

**APC approaches compared.** We fit a period–cohort model with no age term: annual cohorts, smooth (RW2) cohort and period components, and year noise. The period component is the change within cohorts, which combines aging with the effects of the times. We don't try to separate the two, and we phrase the claim that way (`docs/plan.md`, step 5).

They identify all three components by grouping age and cohort coarsely. That lets them report an age effect separately, but only because they assume age effects are flat within 30–65 and that cohorts are homogeneous within each generation. Our approach makes fewer assumptions and claims less.

**Supports:**

- Newer generations are more liberal on every dimension (p. 2275). This matches our cohort component.
- Period effects dominate and the electorate shows "lifelong openness" (p. 2281). This fits our finding that every cohort moves with the times.
- Divergence increased on social welfare (p. 2278). This is loosely consistent with our finding that core economic questions polarize. Their index may overlap our `helppoor`-type items, but we can't confirm that without Appendix A.

**Complicates:** They conclude that people "grow somewhat more conservative" with age (p. 2282). This is not a contradiction. Their age effect is net of year dummies, so a positive aging effect could coexist with a period trend toward liberal that is stronger, and that combination would give the slightly negative within-cohort change we find. But a reader could take their sentence as contradicting our headline, so a paper should explain the difference: their age effect is identified by a constraint, while our within-cohort change is directly observable from repeated cross-sections.

**Contradicts:** Nothing directly. They don't analyze the Overton shift, relative position, or self-identification relative to a moving center.

## Possible use

- **Introduction/related work:** cite it in one sentence as a recent GSS APC study finding newer generations more liberal and period effects dominant. Possibly also in the polarization context for post 4 (economic questions polarize), along with the divergence/sorting distinction.
- **Methods:** cite it as an example of the Kritzer-style grouping constraint, the alternative to our choice of omitting age and interpreting the period component as within-cohort change.
- **Discussion:** address the claim that people "grow somewhat more conservative" with age, and explain why it is compatible with our within-cohort result. Online Appendix C shows the age effect is about 0.01 on a 0–1 scale (see above). Also quote their period finding for ideological ID, the Overton pattern.
- It doesn't need to be cited in the core Overton argument.
