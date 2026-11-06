# Summary: Ojer, Cárcamo, Pastor-Satorras, and Starnini, "Charting multidimensional ideological polarization across demographic groups in the USA" (2025)

## Bibliographic entry

Jaume Ojer, David Cárcamo, Romualdo Pastor-Satorras, and Michele Starnini. "Charting multidimensional ideological polarization across demographic groups in the USA." *Nature Human Behaviour* 9, no. 10 (2025): 2027–2037.

**DOI:** [10.1038/s41562-025-02251-0](https://doi.org/10.1038/s41562-025-02251-0)
**Free PDF:** open access (hybrid) at the journal; also PMC12545191. Preprint: arXiv:2311.06096. Code: <https://github.com/polarizationUS/charting_multidimensional_demographic> (p. 10).
**Local copy:** `ojer_2025_arxiv_v2.pdf` (this folder; gitignored). This is the **arXiv version, v2 (2 July 2025)**, titled "...in the United States," not the typeset article. Page cites below are to the arXiv PDF. The published framing, wording and figure numbering may differ.

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

**Data.** The data come from the ANES Cumulative Data File, starting from 869 opinion variables (p. 8). The authors drop questions about parties and candidates and all binary items, then rescale every answer to [0, 1], which leaves 99 questions. They keep the five presidential-election years with the most questions in common (41 shared). Dropping items with more than 20% missing leaves **29 questions** (p. 8). The remaining missing answers are filled in by 1-nearest-neighbour imputation (p. 14). The 2016 and 2020 samples are randomly cut down to make year sizes similar: 2485, 1807, 2322, 2500 and 2500 respondents (p. 8). No survey weights are mentioned.

**Items** (SM table, pp. 15–16) cover:
- federal waste and spending (on the poor, crime, schools, welfare, environment, Social Security)
- the Bible, moral change, traditional values
- preferential hiring of Black people and the racial-resentment battery
- egalitarianism items, job protection for gays, the death penalty, child-rearing values, divided government
- ratings of whites and blacks as hard-working.

The authors call this a mix of "policy," "moral values," and "procedural" questions, chosen with "question-agnostic quantitative criteria" (p. 7).

**Dimensionality reduction.** They use **Isomap** with K = 10 nearest neighbours to embed all years together into **two dimensions** (pp. 3, 9). "The spatial orientation of the ideological space is arbitrary," and "the Euclidean distance between two points is the only meaningful information" (p. 3). Robustness checks use K = 5, PCA, t-SNE, UMAP, and 3D and 4D embeddings (pp. 3, 23–25). The check that information is preserved is a logistic-regression prediction of party: balanced accuracy is 0.76 ± 0.06 on the 29 raw items and 0.75 ± 0.06 on the 2D coordinates, and it is "the same" in 3D and 4D (p. 3).

**Groups.** Party (Independents excluded), race (Black/White), gender, **age (17–34 vs 55+)**, income (below the 34th vs above the 66th percentile) and education (p. 2). The measures are:
- centroid distances, tested against a permutation null (pp. 5, 9)
- gradient vectors and their cosine similarity (p. 3)
- two-dimensional KS distances
- radius of gyration, to measure dispersion (p. 9).

## Main results

- **Party polarization grows; demographic gaps don't.** Most centroid distances "do not vary much over time, with the notable exception of the Party groups." The party gap overtakes the racial gap after 2008 (p. 5). Republicans are always farther from the population centre, but "in 2016 and 2020 ... Democrats almost caught up with the gap" (p. 6).
- **Alignment with party** (cosine similarity S_c): Race 0.94, Affluence 0.72, Education 0.17, so education is "almost orthogonal" to party on the pooled data (p. 4). The proportion of each party that is White, or low-income, barely changes. For example, Republicans are 0.84 White before 2010 and 0.85 after (p. 7).
- **Age.** "The attributes of Gender and Age, instead, show little polarization, as indicated by short gradient vectors" (p. 3). The 17–34 and 55+ distributions are "much more uniform" across the space (p. 3). The age centroid difference is still significant every year: all p < 10⁻⁴ except Gender in 2016 (p. 5). Age is left out of the trajectory analysis, which covers only Party, Race, Affluence and Education (p. 5).
- **Democrats spread out after 2010.** The KS distance between pre- and post-2010 Democrats is 0.32, compared with 0.13 for Republicans (p. 6). Dispersion rises "for all groups in 2016 and particularly in 2020," except Black respondents and Republicans (p. 6). The largest shifts among Democrats are:
  - "Blacks should not be favored": 0.656 to 0.392
  - "Blacks must try harder": 0.558 to 0.301
  - Bible: 0.630 to 0.400
  - protection for homosexuals: 0.681 to 0.905
  - traditional values: 0.749 to 0.534 (p. 26).

  The shift "emerges mainly" on non-policy questions (p. 6).
- **Policy vs non-policy.** Party distance grows in both subsets. The one difference is a larger education gap on non-policy items (p. 5). The split puts gay job protection, the death penalty and preferential hiring under policy, alongside the spending items (p. 19). **It is not a social vs economic split.**
- **Axes.** "We observed the emergence of two orthogonal axes ... corresponding to partisan orientation and education" (p. 8). These axes are read off the gradients after the fact, not built into the method.

## Context the paper gives

- It frames the work within the "polarized or sorted?" debate (Abramowitz, Fiorina, Levendusky, Mason) and argues the results "directly contradict the hypothesis of partisan sorting" as the source of polarization (p. 7).
- It argues that multiple topics require "a multidimensional modelling framework" (p. 1). It also argues that the 2D space gives "a more nuanced characterization ... than the simple one-dimensional liberal/conservative axis" (p. 7).
- It names the GSS as a dataset the method could be applied to (p. 8).

## Caveats/limitations

- **No test of one dimension against two.** The robustness checks go up to 3D and 4D but never down to 1D. Raw items predict party only 0.01 better than the 2D coordinates (p. 3).
- **The axes have no direction.** The population average "varies over time, especially in 2008 and 2020" (p. 5), but the trajectory figures subtract it (Fig. 4). The paper never says whether that movement is liberal or conservative.
- There are only five years, 1992–2020, and 29 items with a fixed battery. The authors note that transgender rights are missing (p. 7).
- There is no cohort or period–cohort analysis, and age is a coarse two-group comparison that leaves out ages 35–54.
- Imputation, subsampling and the lack of weights could all matter. Centroids can mislead for bimodal groups (pp. 7–8).
- In the preprint, the main text's SM table numbers don't match the SM's own labels: it cites the item list as Table II and the opinion-shift table as Table III, which the SM labels Tables III and IV. The published version may have fixed this.

## Relation to this project

**On dimensionality (the reviewer's point): weaker than it looks.** The paper shows that a 2D embedding is a useful picture. It does not show that one dimension misses something important. Their main findings (growing party distance, Democrats spreading out) hold in 3D and 4D, but no 1D model is compared. They read the two axes as party and education, not social and economic. Our sensitivity analysis, which fits the social and economic subsets separately, already engages multidimensionality more directly than their policy/non-policy split.

**On age: consistent but weak.** Young and old ANES respondents overlap heavily (p. 3), which fits our modest age gap in the latent score. There is no cohort design, so the paper says nothing about whether views move within cohorts.

**Social vs economic over time: only indirect.** The large post-2010 shifts among Democrats on race, religion, traditional values and gay rights (p. 26) match our liberal within-cohort movement on social questions in direction. That evidence comes from one party, two periods and no cohort control. Nothing in the paper speaks to our finding that core economic questions polarize and drift conservative.

**Overton paradox:** no connection. The authors deliberately exclude self-identified ideology (p. 7).

## Possible use

- **Introduction or methods, one sentence:** cite it as an example of multidimensional, machine-learning embeddings of survey opinion (Isomap on ANES), in contrast to our one-dimensional IRT score. Add that their own results are robust across embedding dimension (p. 3).
- **Discussion:** possibly, alongside our separate social and economic fits, to acknowledge that a single score can hide structure. Do not cite it as evidence that one dimension is inadequate, because it doesn't test that.
- **Not recommended** as a counterpoint on age, cohorts or the Overton paradox.
