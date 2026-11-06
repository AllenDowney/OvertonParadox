# Summary: Hare, Armstrong, Bakker, Carroll and Poole, "Using Bayesian Aldrich-McKelvey Scaling to Study Citizens' Ideological Preferences and Perceptions" (2015)

## Bibliographic entry

Christopher Hare, David A. Armstrong II, Ryan Bakker, Royce Carroll, and Keith T. Poole. "Using Bayesian Aldrich-McKelvey Scaling to Study Citizens' Ideological Preferences and Perceptions." *American Journal of Political Science* 59, no. 3 (2015): 759–774.

**DOI:** [10.1111/ajps.12151](https://doi.org/10.1111/ajps.12151)
**Free PDF:** [Essex repository](https://repository.essex.ac.uk/18923/). Replication data, R code and BUGS/JAGS scripts are at voteview.com/BAM.asp and the AJPS Dataverse (p. 2).
**Local copy:** `hare_2015.pdf` (this folder; gitignored). It is a 38-page manuscript dated July 2, 2014, which acknowledges the editor and reviewers, so it is probably the accepted manuscript. Page numbers below are manuscript pages.

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

Differential item functioning (DIF) arises when "respondents interpret and answer survey items such as issue scales differently. Two respondents with the same opinion may nonetheless place themselves at different positions on the scale" (p. 3). The authors give three sources of DIF:

- Extremists perceive the alternatives as farther away (p. 6).
- Social desirability: "moderate" has a positive connotation, so respondents overuse the middle for themselves and their side (pp. 6–7).
- Reversed orderings of stimuli, which are concentrated among the less sophisticated (p. 7).

The A-M model is z_ij = α_i + β_i ζ_j + u_ij (eq. 1, p. 8), where α is the "shift" and β is the "stretch." A negative β means the respondent reversed the order of the stimuli, which the authors read as low political information (p. 7). They estimate it as a Bayesian factor model with individual-varying loadings in JAGS. The scale is identified by fixing one liberal stimulus near −1 and one conservative stimulus near +1 (pp. 9–10). Respondents must place at least three stimuli (p. 11). Ideal points come from eq. 12, x_i = (z_self − α_i)/β_i, and the posterior median serves as the point estimate (p. 11).

Data: the 2004–2012 ANES and the 2010 CCES. In the CCES the stimuli are Obama, the two parties and the Tea Party, plus each state's senators, with 200 respondents resampled per state (pp. 13, 20).

## Main results

**Shift tracks the respondent's own ideology.** Democrats and liberals have positive α, meaning they push the stimuli rightward, and Republicans and conservatives have negative α (p. 13). Mean α correlates with party ID at −0.37 and with self-placement at −0.38 (note 5, p. 13). Their summary: "in most cases, liberal Democrats and conservative Republicans are understating their own ideological extremism in their self-placements" (p. 13).

To avoid diagnosing DIF with a DIF-biased measure, they also regress α on a roll-call-style measure built from eight binary CCES policy votes. That measure is a stronger predictor: standardized β −0.70 with R² 0.49, against −0.59 and R² 0.34 for self-placement (Table 3, p. 33). "34% of self-identified moderates (570 / 1663)" fall in the most liberal or most conservative quartile of the roll-call measure (p. 14). They call these respondents "illusory moderates" (p. 13).

**Polarization is understated.** In the 2012 ANES:

- 31% of Obama voters (663/2166) rated both themselves and Obama "moderate" or "slightly liberal."
- 21% of Romney voters (388/1622) did the equivalent on the conservative side.
- 60% of Romney voters placed Obama at "extremely liberal" (pp. 15–16).

After correction, 44% of respondents are more extreme than Obama or Romney, and the distribution looks "trimodal." The center "appears to hollow out" (pp. 16–17). In every year, the overlap between the parties is significantly lower after correction, by "no case less than 0.09 (or about an 18% decrease in overlap)," and the drop is largest in 2012 (p. 18; Fig. 3, p. 36). The authors' conclusion is that the claim of a centrist electorate "is largely an artifact of DIF" (p. 25).

**Shift also varies by state.** State mean α ranges from −0.45 (South Dakota) to 0.31 (Vermont). It correlates with mean placement of Obama at r = 0.91 and with Obama's 2008 vote share at r = 0.73 (p. 21).

**Perceptions are accurate.** Corrected senator positions correlate with DW-NOMINATE within each party, r = 0.75 for Democrats and 0.69 for Republicans (p. 22). DW-NOMINATE predicts perceptions better than CF scores do (Table 4, p. 33).

## Context the paper gives

- Fiorina's centrist-electorate argument rests on self-placement. About "50 percent" of respondents call themselves moderate or don't place themselves (Hetherington and Weiler, quoted p. 15).
- The paper cites Ellis and Stimson (2012) on Americans' preference for the "conservative" label, and argues that the middle position is overused for similar social-desirability reasons (p. 7).
- Anchoring vignettes (King and Wand) are presented as a nonparametric equivalent of A-M (p. 4).

## Caveats/limitations

- It needs placements of common stimuli. The paper never tests the identifying assumption that stimuli have one true position shared by everyone.
- It covers single cross-sections only, with no over-time analysis of DIF.
- "Any single survey item remains contaminated with measurement error—even after correcting for DIF" (p. 25).
- It does not examine DIF by age, education, or cohort. The only respondent correlates it reports are party, ideology, state, and political information, the last as a negative β.

## Relation to this project

**Supports, in spirit.** The paper is established evidence that the polviews answer is not a fixed reading on an absolute scale. Respondents shift their use of the scale, and the shift depends on where they stand relative to the political actors they perceive. Its social-desirability argument for the "moderate" label (pp. 6–7) fits our story that people label themselves relative to a perceived center.

**But the relativity is a different kind.** A-M's α_i is an individual shift at one time, estimated against contemporary stimuli. The Overton paradox is a shift over time in the population-wide mapping from positions to labels. A-M fixes its scale by pinning stimuli near −1 and +1 (p. 10). So a shift shared by all respondents and all stimuli is not identified. In effect, A-M ideal points are measured relative to the current parties and candidates. That is our own inference, not a claim the paper makes, and it is consistent with our point. The paper says nothing about change over time, age or education, so it gives no evidence on whether DIF varies by cohort.

**Not usable on our data.** The GSS has no placements of parties or candidates, so A-M cannot be applied. Our analogue of "positions independent of the label" is the IRT score from 53 policy questions. That plays the same role as their roll-call-vote measure, which they also used to check self-placement (p. 14).

**A possible tension.** They argue that the direction of DIF bias is toward the middle for partisans, so corrected positions are more polarized. Our claim concerns where the mean sits over time, not its spread, so the two do not conflict directly.

## Possible use

- **Introduction or discussion, one sentence.** Cite it with Ellis and Stimson (2012) as evidence that self-placement is relative to each respondent's perception of the political space. The Overton paradox extends this to a shift over time in the population's reference point.
- **Methods, optional.** Cite it as precedent for checking self-placement against an issue-based measure that is not subject to DIF (the CCES roll-call measure, p. 14), which parallels our comparison of polviews with IRT scores.
- **Not needed** for the core argument. Use it if a reviewer asks how relative self-placement fits with existing measurement models.
