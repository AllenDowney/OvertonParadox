# Summary: Baldassarri and Park, "Was There a Culture War?" (2020)

## Bibliographic entry

Delia Baldassarri and Barum Park. "Was There a Culture War? Partisan Polarization and Secular Trends in U.S. Public Opinion." *Journal of Politics* 82, no. 3 (2020).

**DOI:** [10.1086/707306](https://doi.org/10.1086/707306)
**Free PDF (author manuscript):** <https://static1.squarespace.com/static/50e64c35e4b02b36141d5175/t/5d69426e18a8d5000193c40b/1567179376316/CultureWar.pdf>
**Local copy:** `baldassarri_park_2020.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

The local copy is the authors' manuscript, not the typeset article: a footnote on p. 1 says "Forthcoming in the Journal of Politics," and the layout is the authors' own. It has 28 numbered pages (text, appendix, references) followed by an 11-page online supplement numbered separately. Page numbers below are manuscript pages; "S" marks supplement pages.

---

## Design

Repeated cross-sections, analyzed at the level of issue-by-year proportions. The authors took every issue item asked at least 3 times in the ANES from 1972 to 2016, plus all moral items in the GSS replicating core over the same period, because the ANES has only ten moral questions (pp. 8–9). That gives 78 items, 51 from the ANES and 27 from the GSS, in four domains: economic, civil rights, moral, and foreign policy/security (p. 9). The supplement lists them (pp. S1–S2). All economic and civil rights items come from the ANES. The GSS items are all classed as moral: gender roles (FEFAM, FEPOL, FECHLD, FEPRESCH, ...), sex (PREMARSX, XMARSEX, TEENSEX, PILLOK), homosexuality (HOMOSEX, MARHOMO, COLHOMO, SPKHOMO, LIBHOMO), GRASS, CAPPUN, DIVLAW, an abortion index, a suicide index, LETDIE1, PORNLAW, PRAYER, SEXEDUC and SPANKING.

Each item is split at its scale midpoint, and the outcome is the weighted proportion of liberal responses, overall and for Democrats, Independents and Republicans, with leaners counted as partisans (p. 9). For each domain, a multilevel beta regression (logit link, Bayesian, Stan) models these proportions as a function of time, party and their interaction, with random effects so that each issue gets its own party-specific trend (pp. 14–15, 23). Linear models come first, then quadratic and cubic trends chosen by LOO and WAIC (p. 17, Table 1 on p. 23).

The paper contrasts three ideal types (Figure 1, p. 5). In **issue partisanship**, the overall level stays flat while the parties diverge. In a **secular trend**, everyone moves in the progressive direction, often along an S-shaped diffusion curve. In a **partisan secular trend**, both parties move the same way but Democrats move first, so the gap between parties first widens and then narrows, an inverse U (p. 8).

The analysis does not group respondents by age or birth cohort. Age appears only as a control in a supplementary individual-level logit, in four categories interacted with year dummies; the authors note that this "in effect" controls for the association between cohort and opinion (pp. S7–S8).

## Main results

**Aggregate stability outside the moral domain.** For the population as a whole, "stability (or minor fluctuation) is the norm" in the economic, civil rights and foreign policy domains (p. 10). Regressing the proportion of liberal responses on time, 93% of the statistically distinguishable trends on moral issues were positive, compared with 38% for economic issues and 50% for civil rights (fn. 7, p. 11).

**Liberal shift on moral issues (pp. 11–13).** Support for women's equal role rose from 49% in 1972 to 85% in 2008. Acceptance of premarital sex rose from 51% in 1986 to 75% in 2016. Approval of gay adoption rose 48.8 points from 1992 to 2016, and support for gay marriage went from 12.4% in 1988 to 59.4% in 2016. From 1992 to 2012, support for gays in the military rose 30.0 points and support for job-discrimination protections rose 28.2 points. Support for legal marijuana was under one-fifth in 1973 and rose 41.6 points over the next three decades. Of the 37 moral items, only one (extramarital sex) had a lower proportion of liberal responses at the end of the period than in 1972 (p. 11).

**Economic and civil rights: issue partisanship.** In 1972 the model puts the Democrat–Republican gap at about 14 points on economic items and 10 points on civil rights items, and the positive Democrat × time interaction shows the gap growing after that (p. 16). The trend for Republicans is negative with posterior probability .94 (economic) and .93 (civil rights); the trend for Democrats is positive with probability .80 and .99 (fn. 9, p. 16). On government intervention and market regulation, the sorting is asymmetric: "Republicans have become increasingly conservative, while Democrats have remained relatively stable" (p. 13). Most of the divergence came "from the early 1990s onwards," and in the economic domain the rate of divergence is speeding up (p. 18). An ANES example: support for a guaranteed job and standard of living was about 32% in both 1972 and 2016, but went from 39% of Democrats and 20% of Republicans in 1972 to 47% and 13% in 2012 (p. 4).

**Moral: a partisan secular trend.** The time coefficient, which is the Republican trend, is positive (0.114, 95% interval 0.017 to 0.211, per 20 years on the logit scale), and the Democrat × time interaction is also positive (0.123), so both parties move liberal and Democrats move faster (pp. 16–17; Table 2, p. 24). The posterior probabilities of positive trends are 1.00, 1.00 and .99 for Democrats, Republicans and Independents (fn. 10, p. 17). The partisan gap varies from issue to issue: on some it grows, on others it stays flat or shrinks, and on some it grows and then shrinks (pp. 18–19). On gay employment discrimination the gap opened in the 1990s and "essentially closed" by 2012 (p. 14). Abortion is the main exception: a secular trend that stopped in the late 1980s, when Republicans moved conservative ("arrested development," p. 14).

**Composition.** With controls for party, income, education, sex, race, the South and age, all allowed to vary by year, most moral items still trend liberal in both parties, with abortion again the exception (p. 19; pp. S8–S9). The authors conclude that the change is "too fast to be attributed to mere demographic replacement" (p. 19) and that it reflects "a social diffusion dynamic, which operates within generations" (p. 21).

**Conclusion.** The growing partisan gap on moral issues "is likely an epiphenomenon of a secularization process: the by-product of the different pace at which Democrats and Republicans have adopted liberal views" (pp. 19–20).

## Context the paper gives

- Earlier work on mass polarization finds that the opinion distribution has not become bimodal, though the parties have grown apart (DiMaggio et al. 1996; Fiorina et al. 2005) (p. 3).
- Fischer and Hout (2006) on century-long liberal trends that start with younger, urban and more educated people (pp. 5–6).
- A secular trend puts a ceiling on partisan division: "with 80% of the public supporting gender equality, only 20% of the electorate is able to disagree," and over time such trends turn "position issues" into "valence issues" (pp. 20–21).
- The proposed mechanisms (homophily, selective disclosure, contact with gay people) are speculative. The authors say they "cannot provide empirical evidence of the micro-level dynamic" (p. 21).

## Caveats/limitations

- Groups are defined by party identification, not self-identified ideology. Party switching is set aside with an appeal to the stability of party identification (p. 19).
- The unit of analysis is item proportions with a midpoint cut. The authors report that other cut points change levels but not trends (fn. 5, p. 9).
- They make no age–period–cohort decomposition. The claim that the change is too fast for replacement rests on how fast it was and on demographic controls, not on a cohort model. The authors say these results "are not sufficient to make any rigorous causal claim" (p. 19).
- The moral domain is mostly GSS and the economic domain entirely ANES, so differences between domains are partly differences between surveys. Most economic items are spending items asked in relative terms; a check restricted to absolute items gives the same result (fn. 6, p. 10; p. S10).
- The data end in 2016.

## Relation to this project

**Supports.** The paper's main finding on moral issues matches our social-question result. Both parties move liberal, so the whole population moves liberal, and the authors argue that the change happens within generations, not just through replacement (pp. 19, 21). That fits our finding that views get somewhat more liberal within birth cohorts (repeated cross-sections in both cases). The partisan secular trend, with both groups moving left and the leading group moving faster, also parallels our time series by self-identified ideology on social questions, where liberals move further left than conservatives (blog series, post 4: −22.3 vs −14.0 points) and the gap grows while both move left. Their ceiling argument (pp. 20–21) is close in spirit to the Overton shift, since both describe where positions sit relative to a moving consensus.

**Agrees on economics, with a difference.** They find economic opinion flat overall but polarizing, with Republicans moving conservative and Democrats roughly stable (p. 13). That agrees with our finding that core economic questions polarize. They have no counterpart to our within-cohort conservative drift on economic questions, because they don't separate cohorts and their economic items (all ANES, mostly spending) are not our four GSS questions (`helppoor`, `helpnot`, `helpsick`, `eqwlth`).

**Complicates.** (1) They group by party, we group by self-identified ideology, so the analyses run in parallel and are not directly comparable. (2) They put race and civil rights in a separate domain that shows sorting, not secular change, and count capital punishment and abortion as moral. Our "social" set has a different mix, so per-domain comparisons need care. (3) Their claim that the change is too fast for replacement, which they don't estimate, sits somewhat uneasily with our decomposition, where about 11.8 of the 16.4-point decline is generational. The two aren't strictly in conflict, because their claim is about specific fast-moving issues (gay rights, marijuana) and ours is about a composite scale.

**Not addressed.** They say nothing about age, the age gradient in cross-sections, or how self-identification moves relative to the center.

## Possible use

Cite it. This is a reasonably strong connection, not a passing one: same data source (GSS, plus ANES), same period, and the same moral versus economic contrast, reached by a different route.

- **Introduction / related work:** the main citation for the claim that the whole population has moved liberal on moral and social issues while economic opinion has sorted by party rather than moved. It sets up our domain split.
- **Discussion:** to compare our liberal/conservative gap on social questions with their partisan secular trend (a gap that grows while both groups move left, which they argue may later narrow), and our economic results with their asymmetric Republican shift. Note that we add what they lack: a cohort decomposition and a measure of position relative to the moving center.
- **Methods:** not needed. Their item-proportion beta regression is not our IRT and period–cohort approach. At most, mention them alongside Baldassarri and Gelman (2008) as another way to pool many items.
