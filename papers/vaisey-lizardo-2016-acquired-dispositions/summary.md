# Summary: Vaisey and Lizardo, "Cultural Fragmentation or Acquired Dispositions? A New Approach to Accounting for Patterns of Cultural Change" (2016)

## Bibliographic entry

Stephen Vaisey and Omar Lizardo. "Cultural Fragmentation or Acquired Dispositions? A New Approach to Accounting for Patterns of Cultural Change." *Socius: Sociological Research for a Dynamic World* 2 (2016): 1–15.

**DOI:** [10.1177/2378023116669726](https://doi.org/10.1177/2378023116669726)
**Free PDF:** open access (CC-BY-NC) at the DOI. The text does not mention code or replication files.
**Local copy:** `vaisey_lizardo_2016.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

The question comes from cultural sociology. The **cultural fragmentation model** (Swidler, DiMaggio) holds that culture works through the current environment, so it predicts change driven by period effects. The **acquired dispositions model** (Bourdieu's habitus, "imprinting") holds that dispositions form early in life, so it predicts change driven by cohort effects (p. 2).

The measure is a **cultural durability index**, δ = V(C) / [V(C) + V(P)]. Here V(C) and V(P) are the variances of the cohort and period effects, "with 1 meaning all cohort effects and 0 meaning all period effects net of age" (p. 4). Age effects "are not of substantive interest" but must be estimated to avoid bias (note 6, p. 4).

**Data:** 164 GSS variables from 1972–2014, each measured in at least 15 surveys, with first and last measures at least 30 years apart (p. 5). The text does not say whether they used weights, what kind of regression they fit, or how they coded responses.

**Identification:** the full model has a dummy variable for every age, period, and cohort (eq. 1, p. 5), and it cannot be estimated. Instead they consider "window restrictions," grouping each dimension into windows of 1 to 5 years. That gives 125 models, of which 124 can be estimated (p. 5). For each variable they:

1. estimate all 124 models;
2. compute δ for each;
3. regress δ on the three window sizes (quadratic, p. 5);
4. predict δ for the unidentified 1,1,1 cell.

For FEFAM, δ ranges from 0.54 to 0.68 across the restrictions (µ = 0.60), and the extrapolated value is δ = 0.69 (pp. 5–6). δ rises as the age and especially the period windows widen, and it falls as the cohort window widens (pp. 5–6).

## Main results

- **Cohort dominates for most items.** "The median δ value is 0.61, with 111 of the items (68 percent) having δ values of 0.50 or more. Only 10 of the items (6 percent) have δ values less than 0.25," against 42 items (25 percent) at 0.75 or more (p. 6). The distribution is multimodal (p. 6).
- **Range:** the minimum is 0.10, for "attitudes on military spending," and the maximum is 0.95, for "membership in a veterans' organization" (p. 6).
- **Low δ (period-driven):** "political views, subjective class identification, various measures of confidence in legal and political institutions, and opinions about government spending, the legality of capital punishment, and marijuana legalization" (p. 6). Items "that induce respondents to orient themselves toward the external political and economic climate" fit the fragmentation model (pp. 6–7).
- **High δ (cohort-driven):** "the core 'value' and 'morality' items," including civil liberties and tolerance, sexuality and gender roles, attitudes toward racial minorities and interracial marriage, biblical literalism, membership in traditional organizations, and gun ownership (p. 7).
- **Conclusion:** changes in attitudes about "family, gender, race, sexuality, and patterns of organizational membership change almost entirely because of cohort succession" (p. 8). "We would be better off knowing what year the person was born than what year we are observing them" (p. 8).
- **Polviews and the economic items:** the text gives no numbers for polviews, for the redistribution items (helppoor, eqwlth, and so on), or for any spending item except military spending. Political views and government spending appear only in the low-δ list on p. 6. Per-item δ values are only in Figures 4–5 of the PDF.

## Context the paper gives

- They argue that every APC method "must rely on some identifying restriction," citing Yang and Land 2006 and Bell and Jones 2014 (p. 4).
- They reanalyze Caren et al. (2011) on protest. Protest attendance is cohort-driven (δ = 0.92), and petition signing is period-driven (δ = 0.18) (note 7, p. 9).
- They suggest that perceptions of what others think "would exhibit much stronger period effects than the first-order attitudes themselves" (p. 8). The GSS cannot test this.
- Analysts likely "overestimate the extent to which social change reflects sudden period effects rather than cumulative cohort change" (p. 9).

## Caveats/limitations

- **Unequal spans.** The GSS covers about 2.7 times as many birth cohorts as periods (p. 9). If cohort and period both have linear, equal effects, the estimated δ is about 0.74 when the true value is 0.5, so it is "systematically (and strongly) biased in favor of cohort" (p. 10). Cyclical effects bias it less, or not at all (Table A1, p. 10).
- **Robustness check.** They cut off the data at each end year from 2000 to 2014, identifying the models with "a two-year window restriction on age only." The predicted δ falls only slightly, from 0.596 to 0.575 (Table A2, pp. 10–11). Slopes are positive for 81 variables and negative for 83 (p. 11).
- The extrapolation to the 1,1,1 cell is itself an identifying assumption: it assumes δ varies smoothly, as a quadratic in the window sizes. The authors admit that restrictions "incorporate unknown biases" (p. 5) but do not take up this one. (Our note, not theirs.)
- δ is a share of variance. It says nothing about direction or the size of net change, so a cyclical period effect counts the same as a trend.

## Relation to this project

**How the APC approaches differ.**

- *Identification.* They use dummy-coded models identified by binning, with δ extrapolated to the unbinned case. We use smooth RW2 cohort and period components and no age term.
- *Age.* They estimate age and remove it, so their period effect is "net of age." Our period component is within-cohort change, which combines aging and the times. We claim no separation of the two.
- *What "share" means.* Their δ is the share of variance across effects. Ours is the share of net change from 1972 to 2024 (11.8 of 16.4 points from replacement), with a signed within-cohort slope (−0.82/decade). Theirs is scale-free but has no direction. Ours has a direction and is in interpretable units.
- *Items.* They analyze 164 items one at a time. We combine 53 into an IRT latent score, then compare social and economic subsets.

**Supports.** Their broad finding, that most change is cohort change, especially on moral and social items, matches our replacement share and our liberal within-cohort drift on social questions being small.

**Complicates.** By their account, polviews and spending items are period-driven. That fits the Overton paradox: labels are anchored to the times. It also fits our finding that core economic questions behave differently from social ones, although they give no direction, so they cannot show conservative movement within cohorts. Their appendix shows that monotonic trends bias δ toward cohort (p. 10). Our trends are roughly monotonic, so their δ values and our 72% replacement share are not comparable numbers.

## Possible use

- **Related work:** the main prior GSS study of cohort vs period across many items (p. 6). Cite it for "most change is cohort change; political and institutional items are the exception" (pp. 6–8).
- **Methods:** cite it as an example of an alternative identifying strategy (window restrictions), and contrast it with ours. Their period effects are net of age. Ours are within-cohort change, and we make no claim to separate aging from period.
- **Discussion:** they found polviews to be among the least durable items (p. 6), which supports reading self-identified ideology as relative to the times. Their point that "perceptions of others attitudes" should be more period-driven (p. 8) is close to our moving-center argument.
