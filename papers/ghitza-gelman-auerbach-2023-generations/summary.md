# Summary: Ghitza, Gelman, and Auerbach, "The Great Society, Reagan's Revolution, and Generations of Presidential Voting" (2023)

## Bibliographic entry

Yair Ghitza, Andrew Gelman, and Jonathan Auerbach. "The Great Society, Reagan's Revolution, and Generations of Presidential Voting." *American Journal of Political Science* 67, no. 3 (2023): 520–537.

**DOI:** not given in the manuscript text.
**Free PDF:** [Gelman's site](https://sites.stat.columbia.edu/gelman/research/published/cohort_voting_20211209.pdf). This preprint is dated December 9, 2021, and already includes the AJPS Dataverse verification statement, so it is very likely the accepted manuscript before copyediting. It has small errors the published version probably fixed (for example, Figure 6's caption says 91% where the text says 81%, pp. 10–11). Page numbers below are the manuscript's. Replication materials: <https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi%3A10.7910%2FDVN%2FTZVDUQ> (title page).
**Local copy:** `ghitza_gelman_auerbach_2023.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

---

## Design

**Data.** The authors pool presidential-election-year surveys from ANES (1952–2016), Gallup, the Annenberg NES (2000, 2004, 2008), GQRR campaign polls (2012), and CNN/ORC and Pew (2016). That gives 319,678 complete responses (pp. 2–3). Responses are not weighted (note 1, p. 3). Respondents born before 1937 are dropped, because the approval series starts in 1937 and the model needs each voter's whole life. That leaves 215,693 responses covering the 1960–2016 elections and birth years 1937–1998 (p. 5).

**The APC problem.** They explain the identification problem with the standard additive model, logit(θ_ap) = α_a + β_p + γ_{p−a}. A constant shift between terms is harmless. A linear trend δ, however, can be moved among age, period, and cohort, so cohort differences "can be made arbitrarily small or large" (p. 4). Second differences are identified but "only establish the relative influence of events" (note 2, p. 5).

**Their solution.** "We resolve the age-period-cohort problem, not by restricting the cohort parameters … but by directly modeling the generational voting process" (p. 5). The free cohort term is replaced by γ_j = Ω_g Σ_i w_i x_{p−a+i}, where x_t is the Republican-directional Gallup approval in year t (approval minus 50, sign-flipped under Democratic presidents) and w_i is the weight of events at age i (p. 7). The full model is logit(θ_j) = α_a + B_j + γ_j + η_h + δ_sp. It has an **age effect** α_a, an election effect B_j = (1 + λ_g w_a)β_pg that allows young voters to respond more to the current election, a house effect, and a sex effect that is linear in period (pp. 7–8). The age weights follow a random walk, w_i ~ Normal(w_{i−1}, 0.005). The model is fit in Stan (p. 8). Because x is observed and nonlinear in time, the linear trend δ can no longer be moved among the terms.

## Main results

**Impressionable years.** Weight at age 1 is "essentially zero". The weights rise, peak "around 14-24," and decline after that. Around age 18, events are "nearly three times as meaningful as those later in life" (p. 8). A generation's party is "all but locked-in by 40," but the weights "only return to zero around age 60" (p. 8).

**Race/region.** The generational effect is "over twice as large for non-Hispanic whites as for minorities" (p. 9).

**Election effects and age.** "We do not find clear evidence that the election effect varies according to the age-weights." For non-Southern whites the effect is 0–40% greater for young voters (p. 10).

**Fit.** The model explains 81% of variance, against 74% for a model with only period and race/region effects. Within groups, R² goes from 29% to 59% for non-Southern whites, 26% to 38% for Southern whites, and 32% to 43% for minorities (p. 10).

**Five generations,** with peak birth years 1929 (Democratic), 1941 (Republican), 1952 (Democratic), 1968 (Republican), and 1985 (Democratic) (p. 11). Whites born in 1952 are "consistently 5-10 percentage points more likely to support Democratic presidential candidates than those born in 1968" (p. 2). In 1972, white voters under 25 supported Nixon at 53%, compared with 70% for those 25 or older. That 17-point gap is the largest in the data (p. 15).

## Context the paper gives

- It describes the old aging-versus-generation debate. "Older voters were more likely to identify as Republican. Some argued this was the effect of aging … Others argued the effect was generational" (p. 1). It cites Crittendon (1962) for age, and Cutler (1969) and Glenn and Hefner (1972) for cohort.
- It treats life-cycle events (education, marriage, retirement) as age-specific influences, which by definition do not count as generational "because they do not leave the lasting impression that defines a generation" (p. 3).
- Related running-tally models: Fiorina (1981), Achen (1992), and Bartels and Jackman (2014). The authors call the last of these "statistically underpowered" (note 4, p. 5).
- The APC problem arises "regardless of whether additional individual-level covariates are included or age, period, and cohort are treated as continuous" (p. 20).

## Caveats/limitations

- **No estimates of the age effect.** α_a is in the model, but the paper does not report it. So it gives no estimate of life-cycle drift in partisanship.
- Identification depends on a strong structural assumption: lasting cohort differences come *only* through age-weighted presidential approval. The paper does not test this against alternatives.
- The outcome is two-party vote choice in election years, not attitudes. Undecided voters are dropped (p. 7).
- No data on voters born before 1937, and only 31 years for Millennials (pp. 5, 17). The data are concentrated in the last four elections (Figure 3, p. 6).
- All minorities are pooled together (note 5, p. 7).
- Results are macro-level: "we do not study specific voters or political events in detail" (p. 20).

## Relation to this project

**Same problem, different exit.** Both projects face the identification problem. They keep age, period, and cohort and identify the model by tying cohort differences to an observed series. We drop the age term and interpret the period component as within-cohort change, combining aging and the times, without claiming a separate age effect. Their footnote about second differences (note 2, p. 5) supports our choice to report only quantities that are identified, or explicitly combined.

**Their "generational effect" is dynamic, and it is a form of within-cohort change.** In their model a cohort's tally keeps changing as it ages (p. 5), so their cohort term absorbs part of what our period component measures. The difference is that they let sensitivity vary with age. Our period component is common to all cohorts at any time, so if the young respond more to the times, as their weights suggest, our within-cohort slope averages over different responses. This is worth one sentence in our limitations.

**Supports the generational account.** Their main result, stable preferences set early, fits our finding that replacement accounts for about 11.8 of the 16.4-point decline.

**Weak connections.** They study vote choice rather than latent attitudes, use no GSS data, and say nothing about self-identified ideology or the Overton paradox. They do not report the age effect, so they neither support nor contradict our small liberal drift within cohorts.

## Possible use

- **Introduction or related work:** one sentence citing it, with Bartels and Jackman (2014), as an example of solving APC with a structural model of formative-years exposure, set against our choice not to estimate age.
- **Methods:** cite its explanation of APC identification (pp. 4–5, note 2) to support phrasing our result as within-cohort change.
- **Discussion:** cite the impressionable-years weights (p. 8) as a reason our common period component may average over age groups that differ in how responsive they are.
