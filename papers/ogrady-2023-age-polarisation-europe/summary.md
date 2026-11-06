# Summary: O'Grady, "Is ideological polarisation by age group growing in Europe?" (2023)

## Bibliographic entry

Tom O'Grady. "Is ideological polarisation by age group growing in Europe?" *European Journal of Political Research* 62, no. 4 (2023): 1389–1402.

**DOI:** [10.1111/1475-6765.12575](https://doi.org/10.1111/1475-6765.12575)
**Open access:** CC BY-NC. Free copies from the publisher and [UCL Discovery](https://discovery.ucl.ac.uk/id/eprint/10162919/). The Supplementary Information lists every survey item (Tables S1–S5).
**Local copy:** `ogrady_2023.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

Page citations are to the early-view PDF (pp. 1–14). The issue pagination is 1389–1402, probably journal page = PDF page + 1388 (not verified).

---

## Design

The paper uses the group-level IRT model of Caughey et al. (2019), run with the `dgo` R package. It "estimates ideological positions for age groups within each country, rather than individual survey respondents," and smooths them with a hierarchical model so that "country-years with little or no survey data borrow information from other periods and places" (p. 3). The data are "over 100 individual survey questions" from the ESS, Eurobarometer, ISSP, Pew Global Attitudes and the WVS, 1981–2018, for 27 countries (p. 4).

There are four scales, each estimated from its own questions (p. 4):
- **social:** environment, abortion, gender equality, LGBT rights;
- **immigration:** immigration and nationalism;
- **relative economic:** attitudes to the current level of taxation and spending, "akin to 'mood' (Stimson, 1991)";
- **absolute economic:** principles such as "the desirability of redistribution in theory."

Estimates are for 2-year periods and six age groups, 18–27 through 68–77 (p. 4). Each scale has mean 0 and variance 1 across groups and periods, and higher values mean more conservative (p. 4). Figure 1 averages countries without population weights (note 5, p. 11).

**Cohort analysis.** Because the age bands are 10 years wide, comparing estimates 10 years apart follows the same birth cohort: "those aged 18–27 in 1987–1988 will be 38–47 in 2007–2008" (p. 8). This is done by eye, from figures (Figs. 4–6). There is no fitted age–period–cohort model, and no cohort figure for the absolute economic scale.

## Main results

**Social polarisation is not growing.** The young–old gap on social issues stays "relatively constant at around 1 standard deviation" (p. 5), and all age groups liberalise. 68–77 year-olds moved "about 1.3 standard deviations" from the early 1980s to the late 2010s (p. 5). On immigration, "age differences have scarcely changed" (p. 6). Overall, age gaps on social issues and immigration "are no larger today than they were in the 1980s" (p. 6), and the four youngest groups have converged (p. 6).

**Young people are "relatively libertarian."** On the relative economic scale, "age gaps widened from the late 1990s as the young became more opposed to taxing and spending than the elderly" (p. 6). The young are "more socially liberal than older people, but also favouring smaller government" (p. 7). In 20 of 27 countries they are more liberal on social issues and more conservative on tax and spending, and only Denmark shows signs that the young want higher tax and spending (p. 7). The absolute economic scale is different: "Until recently, young Europeans were somewhat more conservative than the old in absolute terms, but age gaps have narrowed over the past decade, becoming very modest" (p. 6).

**Within-cohort drift, social.** "Some intra-cohort liberalisation is clear for all cohorts," but less than the total change (p. 8). Cohort replacement is large. The 1960–1970 cohort scored −0.014 at ages 18–27 in 1987–1988, against −0.53 for the 1970–1980 cohort at the same ages in 1997–1998 (p. 8). "Each cohort began its political life more liberal than its predecessor and maintained this distinctiveness over time" (p. 9). Within-cohort liberalisation plus replacement "left polarisation between different age groups roughly unchanged" (p. 9). O'Grady attributes the within-cohort change to period: all cohorts moved left, "and this continued when cohorts became elderly" (p. 9). (The text cites "Figure 2" here, apparently meaning Figure 4.)

**Within-cohort drift, immigration and economics.** On immigration, within-cohort changes were "mostly negligible," with some movement to the right among older cohorts since 2000 (p. 9). On relative economic issues, within-cohort changes were larger "and their direction also fluctuated over time" (p. 10). Cohorts changed in different ways at the same ages, so "period effects operating on all cohorts at once were dominant" (p. 10). Older cohorts "became so much more left-wing over the financial crisis and its aftermath" that older age groups became the more left-wing ones (p. 10).

**Bottom line:** "there is little evidence that ageing naturally leads to greater conservatism" (p. 11).

## Context the paper gives

- It sets two predictions of growing polarisation against each other: young people moving left on economics because of precarity and recession, and older people moving right on social issues ("cultural backlash," Norris and Inglehart 2019) (p. 2). Life-cycle and personality theories predict stable gaps instead (p. 2).
- It cites Peterson, Smith and Hibbing (2020), "Do people really become more conservative as they age?" (p. 3), which is relevant to post 1.
- Note 6 cites Barnes et al. (2021) for a similar libertarian-youth result in the UK (p. 11).
- It suggests that wider age gaps in voting come from new parties giving voice to long-standing differences, not from opinion polarising (p. 11).

## Caveats/limitations

- Aggregate cohort data "cannot separate out age and period effects as explanations for within-cohort change" (p. 9). The period interpretation is argued on theory, the same identification limit our period component has.
- The cohort comparisons are informal, with 10-year bands and slight overlap from 2-year periods (note 7, p. 11).
- Differential mortality is assumed away. Because "social conservatives die younger," the paper "might slightly over-state the contribution from within-cohort change" on social issues (note 7, p. 11).
- The scales are standardised (SD units), there is no individual-level measure, and countries are weighted equally.
- The relative economic scale depends on the current policy status quo (p. 4), so it is not a measure of fixed positions.

## Relation to this project

**Measurement.** It is the same family of model as ours (Bayesian IRT pooling many questions over decades), but at group level, with separate domain scales and no single conservatism score. Ours is an individual-level IRT on 53 GSS questions selected automatically. His questions are inherited from Caughey et al. (2019) rather than chosen by a reproducible rule.

**Within-cohort drift (supports).** Every cohort liberalises on social issues, including in old age, with cohort replacement on top. That matches our trajectories and our social within-cohort slope (−1.16 points per decade). His finding that within-cohort change is smaller than total change fits our split of 11.8 vs 4.6 points, although he gives no numerical decomposition.

**Young people economically right-leaning (weak parallel).** His economic finding is a cross-sectional age gap on tax and spending mood. Our finding is a within-cohort move toward conservative answers on `helppoor`, `helpnot`, `helpsick`, `eqwlth`. Those four questions are closer to his *absolute* scale, where young people's extra conservatism has faded to "very modest" (p. 6), and he shows no cohort analysis for that scale. On the relative scale, the within-cohort movement goes back and forth and moved *left* after 2008 (p. 10), the opposite of our direction, though with different countries, questions and years. Honest reading: it neither confirms nor contradicts our economic result. At most, it shows that economic and social domains behave differently across age and cohort.

**Overton paradox.** No connection. The paper does not use self-identified ideology.

## Possible use

- **Discussion:** cite it as cross-national evidence that cohorts liberalise on social issues throughout life and that aging does not bring conservatism (pp. 8–9, 11), alongside Peterson et al. (2020).
- **Discussion, economic section:** at most one hedged sentence saying that economic and social attitudes also diverge by age in Europe (pp. 6–7), and that his economic within-cohort change is period-driven and fluctuating (p. 10), which is consistent with our caution that the model cannot separate aging from period.
- **Methods:** optional. Cite Caughey et al. (2019) for group-level IRT as an alternative to our individual-level model.
