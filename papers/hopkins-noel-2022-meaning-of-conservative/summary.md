# Summary: Hopkins and Noel, "Trump and the Shifting Meaning of 'Conservative'" (2022)

## Bibliographic entry

Daniel J. Hopkins and Hans Noel. "Trump and the Shifting Meaning of 'Conservative': Using Activists' Pairwise Comparisons to Measure Politicians' Perceived Ideologies." *American Political Science Review* 116, no. 3 (2022): 1133–1140. (APSR Letter.)

**DOI:** [10.1017/S0003055421001416](https://doi.org/10.1017/S0003055421001416)
**Open access:** The copyright line reads "© The Author(s), 2022," but the extracted text has no Creative Commons statement. Check on the Cambridge page. Replication data are on the APSR Dataverse, [doi:10.7910/DVN/UMFJRG](https://doi.org/10.7910/DVN/UMFJRG) (p. 1139).
**Local copy:** `hopkins_noel_2022.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

YouGov fielded three surveys of activists for the Huffington Post in 2016: January (n = 989), July (n = 972) and October–November (n = 1,068). Each had about 500 Republicans and 500 Democrats (p. 1134). To count as an activist, a respondent had done two of these in the past four years: donated, attended an event, volunteered, or made calls. Alternatively, they had been a campaign staffer, a candidate or a party official (p. 1134).

Each respondent compared five pairs of senators from the 114th Congress, listed by state and not by party. Republicans were asked which was "more conservative," and Democrats which was "more liberal." Pairs came mostly from the respondent's own party, plus the 10 most extreme members of the other party by NOMINATE (p. 1134). After dropping pairs where the respondent didn't know a senator, 9,030 pairs remain (p. 1134). A Bradley–Terry model, logit P(i > j) = λi − λj, gives each senator a latent "perceived pairwise ideology," rescaled to the unit interval (p. 1135). An April 2021 follow-up (n = 1,110) asked 12 cross-party pairs, which included 14 non-senators such as Trump, DeSantis, Biden and Harris (p. 1137).

## Main results

- **Close to NOMINATE overall.** Correlation 0.90; 0.63 within Republicans and 0.76 within Democrats (p. 1136). NOMINATE predicts perceived ideology more strongly for Democrats (β = 0.77) than for Republicans (β = 0.33) (p. 1137, Table 1).
- **The parties overlap.** Activists rate Manchin, Tester and Donnelly as more conservative than Collins, Kirk, Ayotte and Capito, an overlap that "has disappeared from twenty-first century NOMINATE scores" (pp. 1135–1136). In 20% of cross-party pairings, respondents picked the Democrat as more conservative (note 5, p. 1137).
- **The effect of Trump.** Sasse and Flake were "among NOMINATE's most conservative senators," but activists did not see them that way. Both had opposed Trump, as had McCain and Ayotte. Sessions, "the first senator to back Trump," was rated more conservative than his record suggests (p. 1136). In Table 1, a Trump-support variable (+1 supported, −1 repudiated) has a coefficient of −0.05 among GOP senators, net of NOMINATE. An anti-Trump senator scores "lower … by 0.10, more than a standard deviation" (p. 1137). The perceived-ideology score's SD is 0.09 among Republicans and 0.14 among Democrats (p. 1135).
- **2021.** Trump is "rated more conservative than 82% of the Republicans queried," and his allies (DeSantis, Hawley, Tuberville, Cotton, Pence) are rated "more conservative still." Harris is rated the most liberal (pp. 1137–1138).
- **Bottom line:** "For these activists, to be conservative is partly to support Trump" (p. 1133). A figure like Trump "can reorient a party's definition of ideology" (p. 1138).

## Context the paper gives

- Activists are chosen as the case most likely to perceive differences within a party: "If anyone is positioned to identify and police within-party ideological heterodoxy, it should be activists" (p. 1133).
- It builds on Barber and Pope (2019): conservatives adopt positions when told Trump holds them, and in the same way "conservative activists evaluate politicians in terms of their relationship to the former president" (p. 1136).
- Some of the gap from NOMINATE may reflect issue salience (abortion, guns) and party-line procedural votes, not personal loyalty (p. 1136).
- Ordinary citizens on the 2016 CCES also rate their own senators, and those ratings correlate with this measure at 0.89 but show no overlap between parties (p. 1137).

## Caveats/limitations

- **There is no pre-Trump baseline.** "Shifting" is inferred from how perceptions depart from NOMINATE in 2016 and 2021, not from a time series of what "conservative" meant before. The authors say activists were "surveyed in just two separate years" (p. 1138).
- The population of activists may itself change with party dynamics (p. 1138).
- Respondents were unfamiliar with at least one senator in 40% of pairs, so less prominent senators are not well distinguished (p. 1135).
- A programming error dropped seven senators from the GOP list in surveys 2 and 3 (note 2, p. 1134).
- The samples are 85–87% white (p. 1134), and the Trump result is for Republicans only.

## Relation to this project

**Supports, by analogy.** This is direct evidence that the meaning of "conservative" moves, and that the change can happen fast. The mechanism it identifies is an **elite reference figure**: loyalty to a party leader, partly separate from policy. That differs from the mechanism in the Overton paradox, where labels are relative to the **center of the opinion distribution**. The two can work together: what counts as conservative is anchored to a benchmark, whether that benchmark is a person or the population median. The measure is also relative by construction, since it is built from pairwise "more conservative than" judgments, which fits our reading of polviews as a comparison.

**How far it stretches.** It does not measure citizens' self-placement, it has no age or cohort dimension, and it covers about five years, not fifty. It concerns how activists perceive politicians within a party, so it says nothing about whether the population's issue positions drift. It also identifies a temporary, personality-driven shift, while our drift is slow and runs through issue opinion. Citing it as evidence for the Overton mechanism would overstate it.

## Possible use

- **Discussion:** one or two sentences, cited with Yeung and Quek (2025). The point would be that ideological labels are known to carry non-policy content and to shift, and that even activists anchor "conservative" partly on leaders (pp. 1136–1138). We would be proposing a second, slower anchor: the center of the opinion distribution.
- **Not for the introduction or methods.** It does not bear on how polviews or our IRT score are measured.
