# Summary: Kiley and Vaisey, "Measuring Stability and Change in Personal Culture Using Panel Data" (2020)

## Bibliographic entry

Kevin Kiley and Stephen Vaisey. "Measuring Stability and Change in Personal Culture Using Panel Data." *American Sociological Review* 85, no. 3 (2020): 477–506.

**DOI:** [10.1177/0003122420921538](https://doi.org/10.1177/0003122420921538)
**Free PDF:** [Kiley's site](https://krkiley.github.io/publication/measuring-change-and-stability-in-personal-culture-using-panel-data/measuring-change-and-stability-in-personal-culture-using-panel-data.pdf). The R code for cleaning the GSS panels and for all analyses and figures is at <http://github.com/krkiley/panel_change> (note 1, p. 504).
**Local copy:** `kiley_vaisey_2020.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

The paper contrasts two models of how individuals change. In the **active updating model** (AUM), each response starts from the last one plus new considerations, y_it = y_i,t−1 + v_it, so changes persist. In the **settled dispositions model** (SDM), each person has a fixed baseline, y_it = U_i + v_it, so changes are temporary and revert (p. 479). The SDM goes with cohort replacement theories (Mannheim, Ryder); the AUM goes with theories of persuasion, social influence, and elite cues (pp. 480–481).

With three waves, the two models make different predictions. Under the AUM, wave 2 predicts wave 3 and wave 1 adds nothing. Under the SDM, the mean of waves 1 and 2 is the best predictor. The combined model is E(y_i3) = α + φβ y_i2 + (1 − φ)β y_i1 (p. 485). **φ** measures updating: .5 means pure settled dispositions, and it moves toward 1 with persisting change. **β** measures consistency, "analogous to an R2" (p. 485). For each item they compare, by BIC, a model with free φ against one with φ fixed at .5 (p. 488).

Data: the three GSS rotating panels from 2006 to 2014, each interviewing the same adults three times over four years (p. 484). They use **183 items**, including composite scales (abortion, gender roles, misanthropy, civil liberties, and others). They leave out demographics, work, and objective SES. They use respondents who answered in all three waves, with survey weights (p. 488). To check for age differences, they let φ differ above and below every cutoff age from 20 to 45 (p. 488).

## Main results

**Little persisting change.** Most φ estimates fall between .5 and .6 (p. 489). **75 items (about 40%)** prefer the φ = .5 constraint, meaning no evidence of updating. These include "many items about abortion, civil liberties, confidence in institutions, and views on race and gender" (p. 490). For most items, persisting change involves "less than 1 percent of the total sample," and no item exceeds 5% (p. 490). They can be confident of persisting change above 2% for "perhaps 1 in 5" items (p. 490). A worked example: on abortion after rape (φ = .62), 257 of 2,259 respondents changed between waves 1 and 2. Of those, 147 kept the new answer at wave 3, where the SDM predicts about 129. That leaves evidence of persisting change for "about 18 individuals (less than 1 percent of the sample)" (p. 489).

**Age.** Of the 108 items with some evidence of updating, 22 show age differences at more than half the cutoffs (p. 490). Most of these show more updating among the young. For **political views** (polviews), social trust, euthanasia, and affirmative action for women, "all evidence of active updating disappears for people over age 30," an "impressionable years" pattern (p. 490). Eight items show the opposite pattern, including religious activity, suicide after bankruptcy, and aging parents living with their children (p. 491).

**Item content.** Only two groups, public spending and religious activity, have median φ above .6 (p. 494). The items with high φ either have external supports (church attendance, party registration, gun ownership) or a changing referent. Confidence in the executive branch has the highest φ of all items. In the 2008–2012 panel, when the president changed, φ = .95 and β = .51 (p. 494). Spending and subjective-SES items probably reflect the change of administration and the Great Recession (p. 494). All six gay-rights items show updating, which the authors attribute to salience and shifting elite opinion, as Zaller predicts (p. 494).

**Politics (Figure 6, pp. 495–496).** Party ID shows the most updating and among the highest consistency, at all ages (p. 498). Ideological identification and general views on the role of government ("Gov't do more or less," "Gov't reduce inequality") are fairly consistent but show weak updating (p. 495). Opinion on marijuana is consistent but shows little updating, so the authors conclude that "changing views on marijuana have been driven primarily by cohort replacement," while many individuals changed on gay marriage (p. 496). In their words, people over 30 "did not make lasting changes in whether and how strongly they thought of themselves as 'liberal' or 'conservative'" (p. 499).

**Bottom line:** "real, persistent attitude change is an uncommon phenomenon among adults" (p. 500).

## Context the paper gives

- It opens with interracial marriage. In 1972, over 40% of U.S. adults supported a law against it, and the GSS later dropped the question (p. 477).
- It builds on Vaisey and Lizardo (2016), who decomposed GSS repeated cross-sections into period and cohort effects and found that change "most likely comes in the form of cohort replacement" (p. 481). That paper is the closer methodological relative of ours.
- The results are not consistent with polarization in which individuals become more extreme over time, even during the Obama years (p. 498).
- Scales raise consistency but do not change φ, which supports reading wave-to-wave noise in single items as non-persisting error (pp. 486, 496).

## Caveats/limitations

- **Unidirectional shifts are invisible to φ.** "Because our model includes an intercept, changes that shift all responses toward one end of the scale are absorbed into that term and not accounted for in our φ estimates" (p. 487). Changes in variance are absorbed into β (p. 487).
- Measurement error biases φ toward .5, and the method cannot separate error from short-term real change (p. 487).
- A few people making large changes can inflate φ (p. 487).
- The window is short: three waves over four years, 2006–2014 only (p. 484).
- The youngest respondents are 18, so updating before adulthood is missed (p. 496).
- Possible panel conditioning, which the authors argue is not the main driver (pp. 499–500).
- φ correlates only weakly with published reliability estimates (ρ = .165; note 3, p. 505).

## Relation to this project

**Supports.** The paper is panel-based, individual-level evidence for the main story of post 1. Most aggregate change is generational, and adults change little. Our decomposition attributes about 11.8 of 16.4 points to replacement. Their "impressionable years" result for polviews and many social items fits a cohort component that is set early.

**Does not contradict the within-cohort drift.** Our period component is about −0.82 points per decade, which is roughly 0.3 points over one four-year panel. That is the size of change their method calls "less than 1 percent" persisting change. More important, a drift shared by the whole population is exactly what their intercept absorbs (p. 487). So their design cannot detect the effect we report, and their "stability" is relative to the population's movement. Our repeated cross-sections and their panels answer different questions. We measure net change in cohort means over 50 years. They measure whether individuals' deviations persist over four years.

**Supports the social-issue mechanism.** Gay rights is their clearest case of adults updating at all ages (pp. 494, 496). That gives an individual-level mechanism behind within-cohort liberal drift on social questions.

**Complicates the Overton paradox.** They find that ideological identification is "in all practical terms stable for individuals over age 30" (p. 498). Our story needs labels to shift relative to the moving center. Those shifts would be too slow to see in four years, and partly common to everyone, which the intercept absorbs. A reviewer could still raise this paper, so a paper on the paradox should address it.

**Economic questions.** The connection is weak. Spending items have high φ but low consistency, and the authors attribute that to a changing referent (p. 494). The paper says nothing about direction, so it neither supports nor contradicts our finding that economic questions move conservative within cohorts.

## Possible use

- **Introduction:** cite it with Vaisey and Lizardo (2016) as recent evidence that cohort replacement drives most attitude change, setting up our question of whether cohorts also move.
- **Discussion:** cite it (1) to reconcile our small within-cohort liberal drift with panel evidence of stable adults, pointing out that the drift is far below what a four-year panel can detect and that their intercept absorbs common shifts (p. 487); (2) on the stability of polviews after 30 (pp. 498–499), as the panel finding the Overton paradox has to fit with; and (3) on gay rights as the case of active updating (p. 494).
- **Methods:** at most one sentence, noting that composite scales raise consistency without changing estimated updating (p. 496), in support of combining items in a latent score. Not essential.
