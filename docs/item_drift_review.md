# Item-drift review of the 55-question pool

*2026-11-03. For Allen's case-by-case review; nothing is excluded automatically.*

The diagnostic decided after the stability consultation (`docs/stability_review.md`, section 8, item 4), run once on the new primary pool (55 questions, `p55`: the revised stability rule, reversals of at least 5 points). Code: `overton/item_drift.py`; output: `figs/item_drift.csv`.

## Method

- Difficulties calibrated once by weighted EM on the whole pool, as in the analysis.
- For each question, each respondent's **leave-one-out score**: the posterior mean of latent conservatism (logit scale) from the other 54 questions, for respondents who answered this question and at least 5 of the others.
- A weighted logistic regression of the coded answer on that score and survey-decade indicators. **Decade effects** are on the logit scale, relative to the mean over decades, with 90% intervals from robust standard errors. Decades with fewer than 200 respondents are left out.
- **Listed** if some decade's effect is credible (interval excludes 0) and at least 0.5 logits in size (threshold decided before running).

Reading the effects: the model assumes that, among people with the same conservatism score, the chance of the conservative answer is the same in every decade. A positive effect means that in that decade, the conservative answer was more common than the score predicts, relative to the question's average over decades. Because the score is built from the other questions, the effects are relative to the pool: a question whose answers changed faster than the scale as a whole has positive effects early and negative effects late; a question that changed more slowly has the reverse.

"Score slope" is the coefficient on the leave-one-out score: how strongly the question is associated with the rest of the scale (in a Rasch model, near 1 against the true latent value; the leave-one-out posterior mean is shrunk, so values somewhat above 1 are expected for strongly related questions).

## Listed questions (14 of 55)

Ordered by the largest absolute decade effect. Answer codes are the coded conservative values (see `questions.yaml` / the question table for labels).

| Question | Description | Conservative codes | Decade effects (logits) | Listed decades | Score slope | Decision |
|---|---|---|---|---|---|---|
| `grass` | should marijuana be made legal | 2 | 1970s:+0.28, 1980s:+0.76, 1990s:+0.67, 2000s:+0.20, 2010s:-0.64, 2020s:-1.26 | 1980s 1990s 2010s 2020s | 1.05 || Keep |
| `homosex` | homosexual sex relations | 1 2 3 | 1970s:+0.65, 1980s:+0.84, 1990s:+0.36, 2000s:-0.06, 2010s:-0.78, 2020s:-1.01 | 1970s 1980s 2010s 2020s | 1.60 || Keep |
| `racopen` | vote on open housing law | 1 | 1970s:+1.00, 1980s:+0.43, 1990s:-0.01, 2000s:-0.18, 2010s:-0.43, 2020s:-0.82 | 1970s 2020s | 0.71 || Keep |
| `racpres` | would vote for black president | 2 | 1970s:+0.54, 1980s:+0.44, 1990s:+0.18, 2000s:-0.28, 2010s:-0.89 | 1970s 2010s | 0.91 || Keep |
| `colhomo` | allow homosexual to teach | 5 | 1970s:+0.56, 1980s:+0.41, 1990s:+0.01, 2000s:-0.25, 2010s:-0.74 | 1970s 2010s | 1.63 || Keep |
| `xmarsex` | sex with person other than spouse | 1 | 1970s:-0.71, 1980s:-0.39, 1990s:+0.11, 2000s:+0.38, 2010s:+0.29, 2020s:+0.32 | 1970s | 1.02 || Keep |
| `divlaw` | divorce laws | 2 | 1970s:-0.15, 1980s:+0.24, 1990s:+0.34, 2000s:+0.32, 2010s:-0.06, 2020s:-0.68 | 2020s | 0.85 || Keep |
| `fepol` | women not suited for politics | 1 | 1970s:+0.67, 1980s:+0.30, 1990s:-0.20, 2000s:-0.02, 2010s:-0.31, 2020s:-0.43 | 1970s | 0.91 || Keep |
| `fefam` | better for man to work, woman tend home | 1 2 | 1970s:+0.65, 1980s:+0.00, 1990s:-0.16, 2000s:-0.05, 2010s:-0.31, 2020s:-0.12 | 1970s | 1.25 || Keep |
| `courts` | courts dealing with criminals | 2 | 1970s:+0.24, 1980s:+0.64, 1990s:+0.52, 2000s:-0.29, 2010s:-0.56, 2020s:-0.55 | 1980s 1990s 2010s 2020s | 0.66 || Keep |
| `natspac` | space exploration program | 1 2 | 1970s:-0.63, 1980s:-0.00, 1990s:-0.22, 2000s:+0.01, 2010s:+0.39, 2020s:+0.45 | 1970s | -0.29 || Pending (discuss) |
| `aged` | should aged live with their children | 2 | 1970s:+0.59, 1980s:+0.19, 1990s:+0.02, 2000s:-0.11, 2010s:-0.24, 2020s:-0.46 | 1970s | 0.32 || Keep |
| `racmar` | favor law against racial intermarriage | 1 | 1970s:+0.47, 1980s:+0.30, 1990s:-0.24, 2000s:-0.53 | 2000s | 1.31 || Keep |
| `librac` | allow racists book in library | 1 | 1970s:-0.28, 1980s:-0.20, 1990s:-0.15, 2000s:-0.03, 2010s:+0.15, 2020s:+0.52 | 2020s | 0.67 || **Exclude** |

The other 41 questions, with all their decade effects, are in `figs/item_drift.csv`.

## Patterns, for the review

- **Faster than the scale:** `grass`, `homosex`, `racopen`, `racpres`, `colhomo`, `fepol`, `fefam`, `racmar`, `aged`, and `courts` after the 1990s: the conservative answer became rarer than the rest of the scale predicts.
- **Slower than the scale:** `xmarsex`, `librac`, `natspac`, and `divlaw` before the 2020s: the conservative answer became relatively more common.
- This is the "questions move at different speeds" issue noted for post 3. If the same questions were asked every year, the scale would track a fixed composite, and different speeds would be part of what it measures; because the set of questions asked changes from year to year, they can shift the comparison between years that share few questions (the connectivity check, next task, shows which years those are).

## A separate observation, not part of the rule

Some questions have little or no association with the leave-one-out score (slope below 0.25): `natspac` (-0.29), `natroad` (-0.08), `natdrug` (-0.04), `natcrime` (-0.03), `natsoc` (+0.06), `tax` (+0.19), `trust` (+0.19). Each was selected by its association with `polviews`, but among people with the same score on the other questions, its answer is roughly unrelated to the scale. Four of them (`natspac`, `natroad`, `natcrime`, `natsoc`) entered with the revised stability rule. No rule covers this; it's recorded here for discussion, not as a proposal.

## Decisions

Allen, 2026-11-03, reviewed one question at a time (wording, coded answer, decade effects):

- **Keep (12):** `grass`, `homosex`, `racopen`, `racpres`, `colhomo`, `xmarsex`, `divlaw`, `fepol`, `fefam`, `courts`, `aged`, `racmar`. The departures are opinion moving at a different speed from the rest of the scale, not a change in what the answer means.
- **Exclude (1):** `librac`. Removing a racist's book from the library is no longer a distinctively conservative position; the coded answer's meaning is changing (its sibling `spkrac` reversed sign in the 2020s).
- **Exclude (1 more):** `natspac`. Besides the 1970s drift, its answer is slightly negatively related to the leave-one-out score (slope −0.29), so it doesn't relate to the scale as the model assumes. Decided for this question only; the low slopes of the other spending questions are noted above and not acted on.
- **The topic's slot:** with `librac` out, the topic rule gave the slot for "civil liberties: racist" to `colrac` (allow a racist to teach). Its diagnostic, run on the 54-question pool (`figs/item_drift_colrac.csv`): 1970s −0.25, 1980s −0.16, 1990s −0.13, 2000s −0.13, 2010s +0.07, 2020s +0.60; listed for the 2020s, the same pattern as `librac`. Excluded, and the topic left out (the next question, `spkrac`, isn't brought in): the reason for excluding `librac` applies to the whole topic. No further rounds.

**Result:** the primary pool has 53 questions (the set `primary`; called `p53` before it was renamed the same day): the previous 48 plus `racpres`, `natsoc`, `aged`, `natcrime`, `natroad`. Exclusions after the drift review are in `DRIFT_EXCLUDED` (`overton/apc.py`): `librac`, `natspac`, `colrac`, `spkrac`. Domains (Allen, 2026-11-03): `natsoc` and `natroad` in econB (and so econC); `natcrime`, `racpres`, `aged` social; `natspac` would have been "neither".
