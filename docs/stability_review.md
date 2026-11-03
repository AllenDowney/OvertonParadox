# Which questions belong in a measure of conservatism over 50 years? The stability criterion and the confidence questions

*A request for independent consultation. Allen Downey, 2026-11-03.*

This document describes how we chose the survey questions that define "conservative" in an analysis of political beliefs over time. It covers two decisions: a **stability criterion** that excludes questions whose relationship with self-identified ideology changed over time, and the **exclusion of the questions about confidence in institutions**. We are reconsidering both, and we would like an outside view of the options before we choose.

We are asking about the reasoning only. The goal is the most honest estimate we can make of how people's beliefs change as they age. How the options affect the results is not a criterion for choosing among them, and this document doesn't report it.

An earlier review considered the confidence questions alone (`docs/confidence_review.md`, 2026-10-31). This one revisits that decision together with the stability criterion, because the two turn out to be related.

## 1. Background

### The question

Chapter 12 of *Probably Overthinking It* (Downey, 2023) describes what it calls the Overton paradox, using the General Social Survey (GSS):

1. Older people are more likely to say they are conservative.
2. Older people hold more conservative views, on average.
3. But as people get older, their views don't become more conservative; on average, they become a little more liberal.

The explanation offered is that the center of public opinion moves toward liberal faster than individuals do, so a person whose views move slowly finds themselves further right of center and is more likely to call themselves conservative.

We are updating the analysis with GSS data through 2024. The quantity of central interest is the **within-cohort change**: how the beliefs of people born in the same year change as they age. (Following a birth cohort over time, age and period move together, so this quantity combines the effects of aging and of the times; we don't try to separate them.)

### The data

- GSS 1972–2024, cumulative file, release 3a.
- The analysis sample drops 2021. In 2022 and 2024 it keeps only respondents interviewed in person or by phone (the survey added web self-administration in those years), with weights raked to the full sample's margins.
- Self-identified ideology is the 7-point `polviews` scale, grouped into liberal (1–3), moderate (4), and conservative (5–7).

### How conservatism is measured

- **Coding.** Each selected question has a fixed set of answers that count as "conservative": the side of the answer scale that conservatives choose more often than liberals. The coding is the same in every year.
- **Scoring.** A one-parameter (Rasch) item response model. Each question's difficulty is estimated once, by weighted EM, from all years combined. Each respondent's latent conservatism is estimated on a grid with a wide prior, and reported as the expected percentage of the selected questions they would answer conservatively ("percent conservative responses").
- **Analysis.** A Bayesian period–cohort model (random walks over birth year and survey year) fit to the mean score in each cohort × year cell. The within-cohort change is the slope of the period component, with the mix of cohorts held fixed.

Because respondents in different years answered different subsets of questions (questions were added and dropped, and split ballots assign subsets), the scores of people surveyed decades apart are comparable only through questions they share, and only if each question means the same thing, in relation to conservatism, in every year it was asked. That last condition is what the stability criterion is meant to protect.

## 2. How questions are selected

The selection replaces the hand-curated list used in the book with written rules, applied in order:

1. **Mechanical gates.** From the 6,943 variables in the cumulative file, keep those asked in at least 8 survey years (counting years with at least 100 respondents who also answered `polviews`), spanning at least 15 years, with 2–7 distinct answers, excluding administrative variables. 432 pass.
2. **Scope.** Keep opinion questions on public issues or social norms. Exclude demographics, behaviors and experiences, personal circumstances, knowledge, religious belief and practice, and party identification and vote (circular with `polviews`). About 170 remain.
3. **Coding.** For each question, the contiguous split of the ordered answer scale that best separates conservatives from liberals; the side conservatives choose more is coded conservative. (The book's codings for its 15 questions.)
4. **Ranking.** A weighted logistic regression of the coded answer on survey year, birth year (both linear), and `polviews` (linear, 1–7); questions are ranked by the `polviews` coefficient. The ranking is used only to choose among questions on the same topic.
5. **Requirements.** A question is excluded if it fails any of:
   - *coverage:* asked in at least half the survey years (16 of 32);
   - *stability:* see section 3;
   - *duplicates:* one wording of each split-ballot pair, and one question per topic (the highest-ranked);
   - *confidence:* not a confidence-in-institutions question; see section 4.
6. **Result.** Every question that meets the requirements is used; there is no cutoff on rank. 48 questions.

The rules in steps 1–5, except the confidence exclusion, were written down before looking at how the answers to any question changed over time. The stability criterion uses the difference between conservatives and liberals, not trends in the answers.

## 3. The stability criterion, as implemented

**Rationale.** The method assumes each question has a fixed conservative answer. If, over the years, a question stops distinguishing conservatives from liberals, or comes to distinguish them in the opposite direction, then a fixed coding counts different things as "conservative" in different years.

**Definition** (`overton/stability.py`, decided 2026-10-31, before looking at which questions it would catch):

- For each candidate question and each decade, the **gap**: the weighted percentage giving the coded conservative answer among self-identified conservatives, minus the same among liberals, with a 90% interval based on Kish effective sample sizes. Decades with fewer than 200 liberal and conservative respondents are left out.
- **Sign change:** one decade's gap is credibly positive (interval above 0) and another's is credibly negative (interval below 0).
- **Fades:** the gap is credibly positive in some decade and, in a later decade, its interval includes 0.
- A question is excluded if it has a sign change or fades.

**What it caught.** Of the 170 candidates, 40 are flagged: 5 with a sign change, the rest because the gap fades. For 19 of them, stability is the only reason they're excluded. The full list, with the gap in each decade, is in the appendix. Examples:

- **Voting for a woman for president** (`fepres`, asked 1974–2010; conservative answer "no"): gap +9, +4, +5, +3, +2 points by decade. Flagged as fading.
- **Spending on Social Security** (`natsoc`; conservative answer "about right" or "too much"): +11 in the 1980s, −1 in the 2020s. Flagged as fading.
- **Allowing a racist to speak** (`spkrac`; conservative answer "not allowed"): +7 in the 1970s, about 0 in the 2010s, −5 in the 2020s. Flagged as fading.
- **Spending on the space program** (`natspac`): +5, +3, +4, −4, −2, +3. Flagged as a sign change.

## 4. The exclusion of the confidence questions

The GSS asks 13 questions of the form "As far as the people running these institutions are concerned, would you say you have a great deal of confidence, only some confidence, or hardly any confidence at all in them?", for institutions including the executive branch, Congress, the Supreme Court, the press, organized religion, the military, the scientific community, medicine, major companies, banks, organized labor, education, and television.

**Rationale.** These questions evaluate institutions rather than take a position on an issue, and two features make them a poor fit for a measure of conservatism:

- **The "conservative" answer can mean the opposite.** For the Supreme Court (`conjudge`), the coded conservative answer is lower confidence ("only some" or "hardly any"), because conservatives gave it more often over the whole period. But in the 2020s, liberals were 15 points more likely than conservatives to give it. Declining confidence in the Court in recent years emphatically does not represent a move toward conservatism, but a fixed coding would count it as one.
- **Confidence depends on who is perceived to be in power, so it becomes a partisan marker.** For the executive branch (`confed`; conservative answer "hardly any"), the gap changes sign with the party in the White House: −4 in the 1970s, −10 in the 1980s, +9 in the 1990s, −10 in the 2000s, +15 in the 2010s, +34 in the 2020s. An answer that tracks the incumbent's party measures partisanship relative to the government of the day, not a stable belief.

**Timing.** In the interest of full disclosure: this exclusion was decided after seeing results from a selection that included the confidence questions, after the earlier independent review (`docs/confidence_review.md`). It is recorded as a post hoc revision of the scope rule, and the version including them is to be reported as a sensitivity analysis.

**How it interacts with stability.** Six of the 13 are also excluded by the stability criterion (executive branch, Supreme Court, Congress, banks, major companies, education). The other seven are excluded only by the confidence rule. Their gaps don't fade or reverse; most of them grow:

| Question | Conservative answer | Gap by decade, 1970s to 2020s (points) |
|---|---|---|
| The press (`conpress`) | hardly any | +8, +11, +8, +17, +22, +44 |
| Organized labor (`conlabor`) | hardly any | +12, +14, +11, +18, +21, +20 |
| Organized religion (`conclerg`) | a great deal, only some | +2, +7, +11, +10, +19, +19 |
| The military (`conarmy`) | a great deal | +8, +7, +11, +18, +18, +10 |
| Television (`contv`) | hardly any | +4, +3, +9, +9, +5, +20 |
| The scientific community (`consci`) | only some, hardly any | −1, +3, +5, +10, +15, +31 |
| Medicine (`conmedic`) | only some, hardly any | −1, −2, −0, +3, +2, +15 |

## 5. Why we are revisiting

1. **The fading test can't tell consensus from a change in meaning.** Under the measurement model itself, a question whose relationship to latent conservatism is perfectly stable will show a shrinking percentage-point gap when nearly everyone comes to give the same answer: a floor or ceiling effect. `fepres` may be an example: by 2010 nearly everyone said they would vote for a qualified woman, so there was little room for a gap. The current test excludes such questions as unstable, although the model's assumption (a fixed difficulty on the logit scale) may hold for them.
2. **The test is asymmetric.** It flags gaps that fade or reverse, but not gaps that grow. A gap that grows substantially is also a change in how a question relates to ideology. If the concern is that a question means something different in different years, growth and fading are both evidence of it.
3. **The confidence rule is categorical and post hoc.** It's grounded in a substantive argument (section 4), but it applies to a category of questions rather than to a property every question can be tested for, and it was decided after seeing results. If a general criterion, decided on principle, captures the concern, it would be preferable. If none does, the categorical rule may still be the right call, and we'd like to state why.
4. **The gap mixes two kinds of change.** The gap between self-identified conservatives and liberals can change because a question's meaning changes (the concern), or because the labels change: who calls themselves liberal or conservative, and how closely self-identification tracks beliefs (partisan sorting). The second kind would move the gaps of many questions together, not single out one question. A per-question test on raw gaps doesn't separate the two.

## 6. Options

### Stability criterion

- **S1. Keep the current rule** (sign change or fades, on the percentage-point gap).
- **S2. Reversals only.** Exclude a question only if the gap is credibly positive in one decade and credibly negative in another. Fading by itself is allowed, on the grounds that it may reflect consensus (point 1). Growth is allowed.
- **S3. Any credible change, on the percentage-point scale.** Flag a question if its gap credibly changes across decades in either direction (for example, a test of heterogeneity across decades, or a credible trend in the gap).
- **S4. Any credible change, on the logit scale.** As S3, but on the log odds ratio between conservatives and liberals instead of the percentage-point difference, so that floor and ceiling effects don't by themselves produce a change.
- **S5. Change relative to the other questions.** Flag a question if its gap changes over time differently from the typical question (a differential-item-functioning test across decades). A common shift in all gaps, as partisan sorting would produce, isn't counted against any one question.
- **S6. Model-based drift.** Fit the item response model with question × decade difficulties (or discriminations), and flag questions whose parameters drift beyond a threshold set in advance. This tests the measurement model's assumption directly, rather than a proxy for it.

For S3–S6, the threshold and the size of change that counts would have to be set before applying the rule.

### Confidence questions

- **C1. Keep the categorical exclusion** of all 13, as a scope rule: evaluations of institutions are not positions on issues.
- **C2. Replace it with the stability criterion.** No category rule; the confidence questions are treated like any others, and excluded only if they fail the (possibly revised) stability criterion.
- **C3. A narrower, principled scope rule.** Exclude questions whose conservative answer depends on which party holds power: evaluations of government institutions led by elected or partisan officials (executive branch, Congress, Supreme Court). Treat the others like any other question.
- **C4. Include all 13**, relying on the stability criterion alone, with the post hoc history noted.

The two decisions interact. For example, C2 is only defensible with a stability criterion that responds to growing gaps or partisan alternation (S3–S6), and C1 or C3 can be combined with any stability option.

## 7. Questions for the reviewer

1. Is excluding questions whose gap fades, as in S1, justified, given that the measurement model predicts fading gaps near consensus? Is S2, S4, or S5 a better test of the assumption the selection is protecting?
2. Should growth in a question's gap count against it, as well as fading? Does the answer depend on whether the growth is specific to the question (S5) or shared across questions?
3. Is a model-based test of item drift (S6) worth the complexity here, compared with a gap-based rule?
4. Is the argument in section 4 sufficient grounds to exclude the confidence questions as a category (C1)? Or does it apply only to evaluations of partisan-led government institutions (C3)? Is there a general criterion that captures it?
5. Given that the confidence exclusion was decided after seeing results, which option is most defensible, and how should the history be reported?
6. Is there a concern with either criterion, or with the selection as a whole, that this document doesn't raise?

## 8. Consultation and decisions (2026-11-03)

### What the consultant recommended

- **Retire the fading rule (S1).** A fixed Rasch difficulty predicts a shrinking percentage-point gap near consensus (`fepres`), so the rule can reject a question because of the very kind of change the analysis is meant to measure. Don't adopt S3. S4 is better but still tests the relationship with self-identified ideology, not with the latent scale.
- **Keep reversals (S2) as a simple safeguard,** but judge a reversal by its size, with a threshold for substantive importance set in advance, plus its uncertainty. Requiring only that intervals fall on opposite sides of zero makes the rule depend on sample size.
- **Prefer S5 in a model-based form, as a diagnostic, not an automatic rule.** The comparison that matches the measurement assumption: among respondents with the same latent conservatism, does the probability of the conservative answer to this question change over time? Estimate the latent score without the question being checked (leave one out), so the check isn't circular. Use it to find questions to inspect; a large, substantive change is a stronger case for exclusion than a small, precisely estimated one.
- **Don't build S6.** Item drift and change in the latent distribution aren't separately identified without anchors; a full drift model is more than question selection warrants.
- **Exclude all 13 confidence questions (C1), on construct grounds.** Confidence in an institution is a different construct from a position on an issue or a norm: it can measure approval of current decisions, perceived legitimacy, trust in expertise, or partisan alignment, and those meanings aren't stable. The argument applies to all 13, not only the government institutions, so not C3. The post hoc timing should be disclosed, but it doesn't make the decision wrong; keep the version with them as a sensitivity analysis, not used to choose.
- **State the definition of conservatism explicitly.** Conservative answers are identified by their association with `polviews`, so the scale is not a timeless construct. Its accurate description: adherence to a fixed collection of positions historically associated with self-identified conservatism. Because the paradox is about self-identification, that dependence should be stated, not hidden.
- **Check how well connected the scale is across 50 years:** the network of questions shared between survey years, especially questions that bridge the early and recent decades. This may matter more to comparability than the choice of stability test.

### What we adopt

Following the consultant, with less experimentation than proposed.

1. **Confidence questions: C1.** Excluded as a scope rule: evaluations of institutions are not positions on issues or social norms. The documentation says the rule was adopted after seeing results that included them, and why it is justified on construct grounds. The version including them is reported as a sensitivity analysis.
2. **Stability: the fading rule is retired.** Questions are no longer excluded because a gap fades.
3. **Stability: one reversal rule, with a size threshold.** A question is excluded if, in one decade, conservatives are credibly more likely than liberals to give the coded conservative answer, by at least a set number of points, and in another decade liberals are credibly more likely, by at least the same number ("credibly": the 90% interval excludes 0). *Threshold: 5 percentage points (decided by Allen, 2026-11-03).* Disclosure: the decade-by-decade gaps of every candidate are already known (this document's appendix), so the threshold can't be chosen blind; it should be chosen as a substantive judgment (5 points is a small difference relative to the gaps that define the selected questions), and the choice recorded as such.
4. **Item drift: one diagnostic, for inspection only.** For each selected question: a leave-one-out latent score (the respondent's score from the other selected questions, with the calibrated difficulties), and a logistic regression of the question's coded answer on that score and decade indicators. A question is listed for inspection if its decade effects depart from zero by a substantial amount: some decade's effect, relative to the question's overall average, is credible (90% interval excludes 0) and at least 0.5 logits in size (an odds ratio of about 1.65, about 12 points near the midpoint; decided by Allen, 2026-11-03, before running it). Listed questions are reviewed by Allen, case by case, with the reason for keeping or excluding each recorded. No automatic exclusion, no further rounds.
5. **Not adopted:** S3, S4, S6, and C2–C4.
6. **Definition.** The posts and the appendix describe the scale as adherence to a fixed collection of positions historically associated with self-identified conservatism.
7. **Connectivity check.** A table of the selected questions asked in each survey year, and of the questions shared between each pair of decades (in particular the 1970s and the 2020s), reported in the appendix.
8. **Sensitivity analyses, scaled down.** Two comparisons, reported neutrally and not used to choose: (a) with the confidence questions; (b) the previous 48-question selection (rules as of 2026-10-31). The consultant's third comparison, the reversal rule alone (without exclusions from the drift inspection), is run only if the inspection excludes any question; otherwise it's the same selection.

## Appendix: questions flagged by the stability criterion

Gaps are in percentage points: the weighted share giving the coded conservative answer among self-identified conservatives, minus among liberals, by decade. "Other reasons" are the other requirements the question fails.

| Question | Description | Conservative answer | Gap by decade (points) | Flag | Other reasons |
|---|---|---|---|---|---|
| `anomia7` | officials not interested in average man | disagree | 1970s:-5 1980s:+2 1990s:-1 2000s:+9 | sign change | coverage |
| `confed` | confid. in exec branch of fed govt | hardly any | 1970s:-4 1980s:-10 1990s:+9 2000s:-10 2010s:+15 2020s:+34 | sign change | confidence |
| `conjudge` | confid. in united states supreme court | only some, hardly any | 1970s:+4 1980s:+2 1990s:+3 2000s:-4 2010s:+3 2020s:-15 | sign change, fades | confidence |
| `natroad` | highways and bridges | too little | 1980s:+0 1990s:+3 2000s:+1 2010s:-3 2020s:+2 | sign change, fades | — |
| `natspac` | space exploration program | too little, about right | 1970s:+5 1980s:+3 1990s:+4 2000s:-4 2010s:-2 2020s:+3 | sign change, fades | — |
| `aged` | should aged live with their children | a bad idea | 1970s:+6 1980s:+6 1990s:+6 2000s:+4 2010s:+6 2020s:+4 | fades | — |
| `anomia5` | lot of the average man getting worse | disagree | 1970s:+1 1980s:+7 1990s:+3 | fades | coverage |
| `anomia6` | not fair to bring child into world | disagree | 1970s:-3 1980s:+3 1990s:+3 | fades | coverage |
| `colrac` | allow racist to teach | not allowed | 1970s:+14 1980s:+8 1990s:+7 2000s:+6 2010s:-1 2020s:+5 | fades | — |
| `conbus` | confidence in major companies | a great deal | 1970s:+12 1980s:+11 1990s:+7 2000s:+7 2010s:+9 2020s:+2 | fades | confidence |
| `coneduc` | confidence in education | hardly any | 1970s:+4 1980s:+0 1990s:+6 2000s:+4 2010s:+8 2020s:+16 | fades | confidence |
| `confinan` | confid in banks & financial institutions | a great deal, only some | 1970s:+4 1980s:+4 1990s:+3 2000s:+1 2010s:+13 2020s:+7 | fades | confidence |
| `conlegis` | confidence in congress | hardly any | 1970s:+4 1980s:+2 1990s:+4 2000s:-0 2010s:+1 2020s:+13 | fades | confidence |
| `fair` | people fair or try to take advantage | would try to be fair | 1970s:+3 1980s:+5 1990s:+2 2000s:+4 2010s:-0 2020s:-4 | fades | — |
| `fepres` | vote for woman president | no | 1970s:+9 1980s:+4 1990s:+5 2000s:+3 2010s:+2 | fades | — |
| `helpful` | people helpful or looking out for selves | try to be helpful | 1970s:+3 1980s:+3 1990s:+0 2000s:+2 2010s:+2 2020s:-5 | fades | — |
| `hitdrunk` | drunk bumped into man & wife | yes | 1970s:+3 1980s:-0 1990s:+4 | fades | coverage |
| `hitrobbr` | stranger had broken into mans house | yes | 1970s:+3 1980s:+5 1990s:+2 | fades | coverage |
| `intlblks` | unintelligent - intelligent | 1-unintelligent, 2, 3 | 1990s:+2 2000s:+2 2010s:+2 2020s:+2 | fades | coverage |
| `intlwhts` | unintelligent -intelligent | 5, 6, 7-intelligent | 1990s:+7 2000s:+8 2010s:+6 2020s:+10 | fades | coverage |
| `librac` | allow racists book in library | remove | 1970s:+10 1980s:+6 1990s:+8 2000s:+7 2010s:+3 2020s:+8 | fades | — |
| `marasian` | close relative marry asian | oppose, strongly oppose | 1990s:+15 2000s:+12 2010s:+7 2020s:+2 | fades | coverage |
| `meovrwrk` | men hurt family when focus on work too much | strongly agree, agree | 1990s:+1 2000s:+7 2010s:+3 2020s:+6 | fades | coverage |
| `natcrime` | halting rising crime rate | too little | 1970s:+4 1980s:+1 1990s:-0 2000s:+0 2010s:+5 2020s:+9 | fades | — |
| `natsoc` | social security | about right, too much | 1980s:+11 1990s:+4 2000s:+11 2010s:+6 2020s:-1 | fades | — |
| `natspacy` | space exploration:version y | about right, too much | 1980s:+3 1990s:+2 2000s:+3 2010s:+3 2020s:-2 | fades | wording |
| `nextgen` | science & tech. give more opportunities to next generation | agree, disagree, strongly disagree | 2000s:+3 2010s:+6 2020s:+8 | fades | coverage |
| `polattak` | citizen attacking policeman with fists | yes | 1970s:+1 1980s:+2 1990s:+2 2000s:+4 2010s:+4 2020s:+2 | fades | — |
| `pornout` | materials provide outlet | no | 1970s:+9 1980s:+7 1990s:+4 | fades | coverage |
| `racdif2` | differences due to in-born learning ability | yes | 1970s:+10 1980s:+5 1990s:+3 2000s:+1 2010s:+1 2020s:+4 | fades | — |
| `racpres` | would vote for black president | no | 1970s:+6 1980s:+4 1990s:+2 2000s:+2 2010s:+2 | fades | — |
| `spkath` | allow anti-religionist to speak | not allowed | 1970s:+13 1980s:+8 1990s:+7 2000s:+8 2010s:+6 2020s:+6 | fades | — |
| `spkcom` | allow communist to speak | not allowed | 1970s:+16 1980s:+11 1990s:+9 2000s:+10 2010s:+10 2020s:+10 | fades | — |
| `spkmslm` | allow muslim clergymen preaching hatred of the us | not allowed | 2000s:+16 2010s:+13 2020s:+10 | fades | coverage |
| `spkrac` | allow racist to speak | not allowed | 1970s:+7 1980s:+7 1990s:+5 2000s:+6 2010s:-0 2020s:-5 | fades | — |
| `thnkself` | to think for ones self | 2nd important, 3rd important, 4th important, least important | 1980s:+6 1990s:+12 2000s:+9 2010s:+13 2020s:+7 | fades | — |
| `toofast` | science makes our way of life change too fast | strongly agree, agree | 2000s:+7 2010s:+3 2020s:+36 | fades | coverage |
| `usun` | remain in u.n. or pull out | pull out | 1970s:+9 1980s:+9 1990s:+2 | fades | coverage |
| `workhard` | to work hard | most important, 2nd important | 1980s:+2 1990s:+4 2000s:+3 2010s:+6 2020s:+18 | fades | — |
| `workwhts` | hard working - lazy | 1 - hard-working, 2, 3 | 1990s:+1 2000s:+5 2010s:+4 2020s:+0 | fades | — |

## References

- Downey, A. (2023). *Probably Overthinking It*. University of Chicago Press. Chapter 12, "Chasing the Overton Window."
- NORC at the University of Chicago. General Social Survey, 1972–2024, cumulative file, release 3a.
- Code: `overton/candidates.py` (gates), `overton/scope.py` (scope), `overton/coding.py` (coding), `overton/ranking.py` (ranking), `overton/stability.py` (stability), `overton/question_sets.py` and `overton/excerpt.py` (requirements and the question table).
