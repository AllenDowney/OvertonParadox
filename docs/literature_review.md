# Literature review for an arXiv paper on the Overton paradox

Started 2026-11-06. This is a working document for a possible academic version of the Overton work (GSS 1972–2024, IRT conservatism score, period–cohort model). The aim is a focused related-work discussion, not a survey: five to eight substantive citations plus a few methods references.

Paper summaries are in `papers/<slug>/summary.md`; PDFs there are local only (gitignored). The list of papers was built from my own search and from outside guidance Allen received on 2026-11-06. All the papers in the outside list exist and are cited correctly. Where its descriptions overstated a paper, the notes below say so.

Project numbers used below are from post 1 (`jb/post1_age.md`) and `docs/blog_series.md`. From 1972 to 2024, average conservatism fell 16.4 points; about 11.8 of that is generational replacement and −4.6 is change within cohorts (−0.82 points per decade). The within-cohort slope is −1.16 per decade for social questions and +1.61 for core economic questions.

---

## Recommended citations, by where they go

| Part of the paper | Cite | Purpose |
|---|---|---|
| Introduction: the folk claim and the evidence | Peterson, Smith & Hibbing 2020; Kiley & Vaisey 2020; Lersch 2023 | Panel evidence on whether individuals become more conservative with age |
| Introduction: labels vs positions | Ellis & Stimson 2012*; Yeung & Quek 2025; Kollman & Jackson 2026*; Hare et al. 2015 (optional) | Symbolic vs operational ideology; what self-placement measures |
| Related work: generations and within-cohort change | Hout 2021; Vaisey & Lizardo 2016; Jocker et al. 2024; Restrepo Ochoa & Vaisey 2024; O'Grady 2023 | Cohort replacement vs within-cohort change, in the GSS and elsewhere |
| Related work: secular trends and domains | Baldassarri & Park 2020 | Everyone moves liberal on moral issues; economic opinion sorts by party |
| Methods: APC identification | Fosse & Winship 2019; Ghitza, Gelman & Auerbach 2023 | Why we report within-cohort change rather than an age effect |
| Methods: measurement | Caughey & Warshaw 2015 or Caughey et al. 2019; optionally Ojer et al. 2025 | IRT on survey opinion; one dimension vs many |
| Methods: GSS mode | Fufunan, Jin & Freese 2026 |
| Limitations: differential mortality | Pabayo, Kawachi & Muennig 2015 | Size of the mortality gap by ideology in the GSS |
| Discussion: the meaning of labels moves | Hopkins & Noel 2022 | "Conservative" anchored partly on leaders | Precedent for interviewer-only analysis with raked weights |

\* Not yet read; the descriptions come from abstracts and secondary sources. See "Still to get" below.

**Core set (if we cite only six):** Peterson et al. 2020, Kiley & Vaisey 2020, Ellis & Stimson 2012, Baldassarri & Park 2020, Vaisey & Lizardo 2016, Hout 2021. Add Fosse & Winship 2019 as the methods reference.

**Don't cite (or one optional sentence):** Druckman et al. 2026, Pattison 2025.

---

## What the literature already establishes, and what we add

1. **Older people are more conservative in cross-sections, but individuals change little.** Panel studies agree on this. Kiley & Vaisey find that persistent change is rare among adults. Peterson et al. find mostly stable views, with a modest rightward drift concentrated in one decade (1973–82). The cross-sectional age gradient confounds aging with social change, and Peterson et al. say so directly (p. 603). This is not new.
2. **Most aggregate change is cohort replacement, with some movement within cohorts.** Vaisey & Lizardo, Kiley & Vaisey, Lersch, Restrepo Ochoa & Vaisey, and O'Grady agree on this, as do Hout 2021 and Jocker et al. for the GSS. Vaisey & Lizardo single out political views, government spending and confidence in institutions as the *least* cohort-driven GSS items, the ones that follow the times. That fits the Overton reading of polviews as a label anchored to the current center. On moral and social issues the whole population moves liberal (Baldassarri & Park; O'Grady). Our 11.8 / 4.6 split fits.
3. **Self-identified ideology and policy positions come apart.** Ellis & Stimson establish this, and the distinction is well known. We should not present it as a discovery.

**Hout (2021) is the closest prior work, and the main risk of looking redundant.** It uses the same data (GSS to 2018) and the same decomposition: period and cohort with no age term, with within-cohort change read as "period and aging influences" (p. 1019). It defines liberal direction by correlation with polviews, close to how we select questions. Its headline, that cohorts are more liberal and that change within cohorts is mostly liberal too (62% and 51% of opinion items), anticipates our descriptive result. So the paper has to state plainly what it adds beyond Hout: the points below, plus a single score with magnitudes and intervals instead of counts of items, data through 2024, and a smooth model instead of dummies.

**What we add**, in roughly decreasing order of novelty:

- **An answer to Peterson et al.'s open question.** They find that a cohort's *self-label* moves right more than its issue positions do, and they speculate that "aging may increase the likelihood of identifying as a conservative more than it leads people actually to be conservative" (p. 609). They say they know of no evidence that the gap between label and position grows with age. The Overton paradox explains the gap without aging: labels are relative to a center that moves. Their women's-equality item (Table 2) shows the pattern in miniature. To me this is the strongest hook for the introduction.
- **A within-cohort trend measured directly on a broad attitude score**, through 2024, with numbers: −4.6 points within cohorts against 11.8 from replacement. Most prior work reports per-item shares (Hout), ratios of explained variance (Restrepo Ochoa & Vaisey), or informal comparisons by eye (O'Grady).
- **A social/economic split in within-cohort direction.** Social questions move liberal within cohorts, and core economic questions move conservative. Baldassarri & Park and O'Grady both find that economic opinion behaves differently from social opinion, but neither has a within-cohort estimate for economic questions. Hout does, and his economic items look flat or liberal (see "Objections").
- **A different answer to Hout's puzzle.** Hout finds liberal opinion "surprising given conservatives' many wins in elections, legislation, and policy" and explains it by salience and inefficient representation (p. 1029). The Overton paradox offers a complementary explanation: the labels move with the center. Hout can't examine polviews directionally, because he uses it as his yardstick.
- **Reproducible question selection and sensitivity to the definition of conservatism.** The outside guidance made this point and I agree: how much the Overton gap depends on question selection is itself a finding, so the paper shouldn't rest its headline on one number.

---

## Objections the paper has to answer

- **"Ideological identification is stable after 30"** (Kiley & Vaisey, pp. 498–499). Two answers. First, their model's intercept absorbs any shift shared by the whole population (p. 487), so it cannot see the movement the Overton paradox describes. Lersch's period fixed effects do the same (pp. 231, 245). Second, our drift is about 0.3 points per four years, far below what a three-wave panel can detect. Lersch shows by simulation that a GSS-style panel can't reliably detect slow persistent change (p. 228).
- **"Hout found the economic items flat or liberal within cohorts."** His codes for government help for the sick, reducing inequality, and assisting the poor are liberal or no trend within cohorts (Table A4), while our core economic questions move conservative (+1.61 per decade). Possible reasons: his direction is a crude endpoint difference that may not be net of cohort (p. 1018); his data end in 2018; his within-cohort R for these items is tiny. His "taxes on the rich too low" (conservative both ways) and party ID drifting Republican lean our way. We need to reconcile this explicitly, probably by checking our economic slope through 2018.
- **"Dropping age assumes away its nonlinear effects"** (Fosse & Winship, p. 475). Linear age is absorbed exactly by period and cohort, which is why our period component is the identified combination "α + π" (p. 471 n. 6). Age *curvature* is not absorbed, though, and they note that omitting it is testable. Two possible additions, for discussion only and not decided: (a) a check that adds smooth age curvature with the linear part removed; (b) their kind of bound, which says that if aging doesn't make people more liberal, the effect of the times is at least as liberal as our within-cohort change (pp. 483–484).
- **"Citizens grow somewhat more conservative throughout their lifespan"** (Jocker et al., p. 2282). Their age effect is net of year dummies and identified by grouping constraints. A positive aging effect combined with a stronger liberal period trend gives the slightly negative within-cohort change we observe. **Their Online Appendix C (Table C.1) shows the effect is tiny.** Ages 30–64 are about 0.01 more conservative than under-30s on a 0–1 scale, with no further rise after 65. That is roughly a tenth of their cohort spread. The appendix itself says age effects "should not be overstated… may even be reversed come late adulthood… far weaker than both cohort and period effects." Their period estimates for ideological ID also show the Overton pattern: "despite the absence of a conservative trend across any policy dimension, there was a period from the 1970s to the mid-1990s when more Americans identified as conservative." Worth quoting in the discussion. Details are in the Jocker summary.
- **Differential mortality** (Peterson et al., p. 603; O'Grady, note 7). If conservatives die younger, cohort means drift liberal with no individual change. Pabayo et al. (2015) linked GSS respondents to death records: conservatives' mortality hazard is 1.06 times liberals' after adjusting for SES, and 1.26 crude, which is still confounded by age. A rough calculation in the Pabayo summary (illustration only) suggests mortality could account for a few tenths of a point of our −4.6, and perhaps 1–2 points under the inflated hazard ratio. That is probably minor, but it is not a bound. A proper bound needs an HR adjusted only for age and sex, the issue-score gap between polviews groups in our data, and the observed ages of each cohort. Listed in the plan for discussion.
- **Age differences in responsiveness** (Ghitza et al., p. 8). The young respond more to events, and our period component is common to all cohorts, so the within-cohort slope averages over age groups. This needs one sentence in the limitations.
- **One dimension.** The objection is reasonable, but Ojer et al. don't support it as strongly as the outside guidance suggested (see below). Our separate social and economic fits are the better answer.

---

## Paper notes (archived and read)

### Peterson, Smith & Hibbing (2020), *Journal of Politics* 82(2) — **cite (intro, limitations, discussion)**
A panel of the high school class of 1965, interviewed four times up to about age 50. Views are mostly stable. The cohort moved right on 6 of 7 items, mostly from 1973 to 1982, possibly a period effect. Relative to the nation, the drift is only .2–.3 points on a 1–7 scale. The self-label moved more than issues did, and the authors' open question about that is the one the Overton paradox answers. → [summary](../papers/peterson-2020-conservative-with-age/summary.md)

### Kiley & Vaisey (2020), *American Sociological Review* 85(3) — **cite (intro, discussion)**
Three-wave GSS panels from 2006 to 2014, 183 items. The data favor "settled dispositions" over "active updating". Persistent change involves fewer than 1% of respondents on most items. Polviews is stable after age 30, and gay rights is the main case of updating at all ages. It is the main individual-level GSS evidence for the generational story, and it is also where the main objection to the paradox comes from (see above). → [summary](../papers/kiley-vaisey-2020-stability-change/summary.md)

### Baldassarri & Park (2020), *Journal of Politics* 82(3) — **cite (intro/related work, discussion)**
78 items from the ANES and GSS, 1972–2016, grouped by party. On moral issues there is a "partisan secular trend": both parties move liberal, Democrats first. Economic and civil-rights opinion is flat overall but sorts by party, with Republicans moving right. Same data and period as ours, and the same moral/economic contrast, reached by a different route. It groups by party rather than self-identified ideology and has no cohort decomposition. → [summary](../papers/baldassarri-park-2020-culture-war/summary.md)

### Jocker, van der Brug & Rekker (2024), *Political Behavior* 46 — **cite (related work, methods, discussion)**
An APC analysis of the GSS and ANES, 1972–2021, with Pew generations and four age groups as constraints. Partisan sorting rose and divergence rose only modestly. Newer generations are more liberal and less sorted, and period effects dominate. It is the closest recent design, but the outcome is spread and sorting, not mean conservatism. The mean-level results are in an appendix we don't have. → [summary](../papers/jocker-2024-polarized-party-system/summary.md)

### Restrepo Ochoa & Vaisey (2024), *Evolutionary Human Sciences* 6 — **cite briefly (intro, methods)**
WVS data, 8 countries, 56 items. The paper compares the R² of a cohort-only model with one that adds year trends (τ). Hard-to-discuss items lean somewhat toward change by replacement, and items about confidence in institutions change within cohorts. Its model has no age term, the same choice as ours, which makes it a published precedent. It says little about economics. → [summary](../papers/restrepo-ochoa-vaisey-2024-cohort-replacement/summary.md)

### O'Grady (2023), *European Journal of Political Research* 62(4) — **cite (discussion)**
Group-level IRT on more than 100 items, 27 European countries, 1981–2018. Every cohort liberalises on social issues, even in old age, on top of replacement, and there is "little evidence that ageing naturally leads to greater conservatism" (p. 11). The young are "relatively libertarian", more opposed to tax and spending, but that is a cross-sectional gap, not within-cohort change, so it is not a real parallel to our economic result. The outside guidance's description is accurate. → [summary](../papers/ogrady-2023-age-polarisation-europe/summary.md)

### Ghitza, Gelman & Auerbach (2023), *AJPS* 67(3) — **cite briefly (methods, limitations)**
Presidential vote choice, 1960–2016, modeled as an age-weighted running tally of presidential approval, which identifies the APC model by structure. The weights peak at ages 14–24, and partisanship is "locked-in by 40". It is the clearest contrast to our choice of dropping the age term. It studies vote choice, not attitudes, and doesn't report the age effect. → [summary](../papers/ghitza-gelman-auerbach-2023-generations/summary.md)

### Fufunan, Jin & Freese (2026), SocArXiv preprint — **cite (methods)**
Mode-specific raked weights for the GSS in 2022 and 2024. Interviewer estimates are closer to the 2016–18 baseline on 100 of 143 items (70%; the outside guidance's numbers are correct), and the differences come from the mode respondents completed in, not the sequence they were assigned. Their recommended procedure is almost the same as ours. The weights are public, so we can run the comparison the reviewer suggested. Their closeness-to-baseline test favors face to face by construction, so cite it as consistent with our rationale, not as the justification. Not peer reviewed. → [summary](../papers/fufunan-jin-freese-2026-gss-mode/summary.md)

### Ojer, Cárcamo, Pastor-Satorras & Starnini (2025), *Nature Human Behaviour* 9 — **optional, one sentence**
Isomap embedding of 29 ANES items into 2D, five years from 1992 to 2020. Party distance grows, and the age groups barely separate. The outside guidance proposed it as the counterpoint to a one-dimensional score, but it never compares 1D with 2D, its axes have no liberal/conservative direction, and its split is policy vs non-policy, not social vs economic. Cite it at most as an example of a multidimensional alternative. → [summary](../papers/ojer-2025-multidimensional-polarization/summary.md)

### Hout (2021), *Public Opinion Quarterly* 85(4) — **cite (related work, methods, discussion); the closest prior work**
Davis's "climate" (between cohorts) and "weather" (within cohorts) for 283 GSS variables, 1972–2018. OLS with period and cohort dummies (32 categories each) and no age term. The amount of change is a square root of R² differences, and the direction comes from each item's lean on polviews plus an endpoint difference. Cohort change beats period change for 69% of variables. Among opinion items, 62% are more liberal between cohorts and 51% within; across all variables, 60% and 48%. Both pairs of numbers are in Table 2, which resolves the conflicting figures in earlier searches. Abortion, guns, help for the poor and health care barely move. The age check is the period × cohort interaction, significant for 9% of items. See above for how much it overlaps with our work and for the disagreement about economic items. → [summary](../papers/hout-2021-liberal-social-climate/summary.md)

### Vaisey & Lizardo (2016), *Socius* 2 — **cite (related work, methods, discussion)**
APC dummy models for 164 GSS items, 1972–2014, identified by grouping age, period and cohort into windows, then extrapolated. A "durability" index δ = V(C)/(V(C)+V(P)), net of age, has a median of 0.61. Values, morality, gender, race and civil liberties change mostly through cohort succession. Political views, spending, confidence and marijuana follow the period. It is the closest prior GSS study across many items. It differs from ours in three ways: it nets out age, its share is a share of variance with no direction, and the authors show it is biased toward cohort when trends are monotonic (p. 10). So their δ and our 72% replacement share are not comparable numbers. Per-item δ values are only in Figures 4–5 of the PDF. → [summary](../papers/vaisey-lizardo-2016-acquired-dispositions/summary.md)

### Lersch (2023), *ASR* 88(2) — **cite briefly (intro, discussion)**
Six long household panels, 428 measures. Persistent within-person change with age is real but small, .07 SD per decade, and change by replacement dominates at the population level (p. 244). The pooled effect uses **absolute values** of the age slopes (p. 238), and no ideology result appears in the main text, so it says nothing either way about "more conservative with age." Do not cite it for that. Useful as the counterweight to Kiley & Vaisey on whether adults change, and for showing that short panels can't detect slow change. → [summary](../papers/lersch-2023-life-course/summary.md)

### Yeung & Quek (2025), *PSRM* 13 — **cite (intro, one sentence)**
A survey experiment (Lucid, 2022, n = 3828). Removing the words "liberal" and "conservative" halves the partisan gap in self-placement (2.12 → 1.04) and cuts the ideology–party correlation from .58 to .26, while the population mean doesn't move (4.12 vs 4.08). So self-placement is partly a party-linked identity, which supports measuring conservatism from issue questions. It has nothing on age, trends or a moving reference point, and it doesn't engage with Kollman & Jackson. It points to Hopkins & Noel (2022), "Trump and the shifting meaning of 'conservative,'" which may be relevant to the moving-center argument. → [summary](../papers/yeung-quek-2025-self-reported-ideology/summary.md)

### Fosse & Winship (2019), *Annual Review of Sociology* 45 — **cite (methods)**
The standard review of APC identification. Only the three linear slopes are unidentified. Nonlinear deviations and certain sums are identified, including within-cohort change, α + π (p. 471 n. 6), which is the quantity we report. They recommend reporting identified quantities and bounding the rest with explicit assumptions (pp. 485–486). They also say dropping a variable is "typically an unnecessarily strong assumption" (p. 475), which a reviewer could quote against us (see "Objections"). → [summary](../papers/fosse-winship-2019-apc-review/summary.md)

### Pabayo, Kawachi & Muennig (2015), *J. Epidemiology & Community Health* 69(5) — **cite (limitations)**
GSS respondents 1976–2008 (n = 32,830) linked to the National Death Index; Cox models of polviews (three groups) and party. Conservatives and moderates have hazard ratios of 1.06 (adjusted) and 1.26/1.22 (crude) relative to liberals. There are no age-specific estimates, and the paper is ambiguous about which polviews coding the tables use. It is the evidence we need to size the mortality objection (see "Objections"). → [summary](../papers/pabayo-2015-ideology-mortality/summary.md)

### Hopkins & Noel (2022), *APSR* 116(3) — **cite briefly (discussion)**
In 2016 and 2021, activists judged which of two senators was more conservative, and the answers were scaled with a Bradley–Terry model. Perceived ideology tracks NOMINATE (r = .90), but Republicans who opposed Trump were seen as less conservative than their records, and his backers as more. In their words, "to be conservative is partly to support Trump." It is evidence that the meaning of "conservative" moves, anchored on an elite reference figure. The Overton paradox proposes a second, slower anchor, the center of opinion. It is about activists judging politicians, not citizens placing themselves, and there is no baseline from before Trump, so it supports the moving center by analogy only. → [summary](../papers/hopkins-noel-2022-meaning-of-conservative/summary.md)

### Hare, Armstrong, Bakker, Carroll & Poole (2015), *AJPS* 59(3) — **optional, one sentence**
Bayesian Aldrich–McKelvey scaling: each respondent shifts and stretches the liberal–conservative scale, so self-placement has to be read relative to how they place parties and candidates. Partisans place themselves too close to the middle, so raw self-placement understates polarization (party overlap falls by at least 18% after correction). It is established evidence that self-placement is relative, but the relativity is individual and at a single time. Its scale is pinned to the stimuli, so a shift over time shared by everyone, which is the Overton claim, isn't identified. The GSS has no stimulus placements, so the method can't be applied to our data. → [summary](../papers/hare-2015-bayesian-aldrich-mckelvey/summary.md)

### Druckman et al. (2026), *PNAS Nexus* — **don't cite**
A perspective piece on why GSS and ANES infrastructure is worth funding, showing trends in welfare, trust and affective polarization. It says nothing about ideology, age or cohorts. Its useful contribution is a reference: Hout 2021 (below). → [summary](../papers/druckman-2026-public-opinion-trends/summary.md)

---

## Still to get (not read; descriptions from abstracts)

- **Kollman & Jackson (2026)**, "Revisiting Ideology Measures in Political Surveys," *Journal of Politics*, doi:10.1086/734259. **Paywalled.** ANES: self-placement has become more informative about policy and vote over time. Possibly important for the Overton argument. If the labels have become better anchored, how does that interact with a center that moves?
- **Ellis & Stimson (2012)**, *Ideology in America* (Cambridge), especially the chapter "The Operational–Symbolic Disconnect." A book; the foundational reference for labels vs positions.
- *Skipped:* Tilley & Evans (2014), *Electoral Studies*. It is about vote choice, not beliefs and attitudes (Allen, 2026-11-06).
- Optional: Caughey & Warshaw (2015), *Political Analysis*; Caughey, O'Grady & Warshaw (2019), *APSR*; Hare (2022), *BJPS* (dynamic ordinal IRT, ideological constraint); Clark et al. (2026), *Social Science Quarterly* (APC on Gallup data, mostly gender gaps); Peltzman (2019), SSRN (GSS self-ID drifts right with age, a useful foil since we find views and labels diverge); Bartels & Jackman (2014).

## Notes on the outside guidance

- Its overall framing (labels vs positions; within- vs between-cohort change; robustness to the definition of conservatism) fits the literature. Its warning not to present the symbolic/operational distinction as new is right.
- Its suggested title, "Do Americans Become More Conservative as They Age? Evidence from Fifty Years of the General Social Survey," is close to Peterson et al.'s title. That cuts both ways: it places the paper in a clear conversation, but it invites a direct comparison.
- It overstates Ojer et al. on dimensionality (see above) and doesn't mention Hout 2021, Vaisey & Lizardo 2016 or Peterson et al., which I think are more central than Ojer or Druckman.
