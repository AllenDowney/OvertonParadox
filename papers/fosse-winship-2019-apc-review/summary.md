# Summary: Fosse and Winship, "Analyzing Age-Period-Cohort Data: A Review and Critique" (2019)

## Bibliographic entry

Ethan Fosse and Christopher Winship. "Analyzing Age-Period-Cohort Data: A Review and Critique." *Annual Review of Sociology* 45 (2019): 467–492.

**DOI:** [10.1146/annurev-soc-073018-022616](https://doi.org/10.1146/annurev-soc-073018-022616)
**Local copy:** `fosse_winship_2019.pdf` (this folder; gitignored)

Added 2026-11-06 as related literature for a possible arXiv paper on the Overton paradox.

Page numbers come from the running footers; items that sit across a page break are cited as ranges.

---

## Scope

This is a review of APC methods in sociology and demography. It covers the classical APC model, point identification without measured causes (drop-one, equality constraints, Moore-Penrose/intrinsic estimators, HAPC), point identification with measured causes (proxy variables, mechanism-based models), and partial identification by bounding and sensitivity analysis. It ends with a six-step procedure and a worked GSS example on vocabulary scores (pp. 486–488).

The authors classify the approaches as follows:
- **Explicit constraints:** drop-one variable, equality constraints (p. 475).
- **Mechanical constraints:** "general-purpose" estimators, chiefly the IE and HAPC (p. 476).
- **Measured causes:** proxy variables and mechanism-based models (pp. 479–480).
- **Partial identification:** bounds on the size, sign, or shape of effects, shown on a "2D-APC graph" (pp. 480–485).

## Main points

**Only the linear effects are unidentified.** "Nonlinear effects (or deviations from the slopes) are identified," so the problem "can be radically simplified as a problem of determining the value of the three linear effects" (p. 468). Besides the nonlinear effects, "particular combinations of the linear effects are also identifiable," as are predicted values and forecasts (p. 472).

**What a single design identifies.** "In a panel study, one might examine, say, a single cohort of people and observe how they change as they age. Here, the estimated linear age effect is not α, but α + π" (p. 471 n. 6). A cross-section gives α − γ (p. 471 n. 6). The two identified quantities that fix the solution line are θ1 = α + π and θ2 = γ + π (p. 481).

**APC effects as total effects of bundles of causes.** The variables are "merely indicators" of underlying causes (Clogg, quoted p. 472), and the authors call the APC model "an accounting scheme." Comparing one cohort at two ages, "the difference in their observed mean on the outcome would be equal to the effect of age plus the effect of period" (pp. 474–475). As a simple case they write a period–cohort model, Equation 4, assuming "the age linear effect is zero in the population" (p. 473).

**Drop-one models.** This is "by far the most common approach." "Dropping a variable is equivalent to constraining its linear and nonlinear effects to zero, which is typically an unnecessarily strong assumption." But "because the nonlinear effects are identifiable, constraining them to be zero is a testable assumption" (p. 475). If the constraint is wrong, the other estimates "will be inconsistent" (p. 475 n. 9). Many studies "simply omit one or two of the temporal variables entirely without reference to the identification problem" (p. 468).

**HAPC (Yang & Land).** The model "imposes a set of nonobvious constraints," typically "setting the linear cohort effect to zero or close to zero," because cohort has the most categories (p. 478). They show this with GSS outcomes (Figure 2, p. 478). The model "will, in general, arbitrarily fix the cohort slope near to zero, giving results that assume trendless fluctuation" (p. 479).

**Moore-Penrose estimators and the IE.** These estimators are sensitive to the design matrix and to the number of groups (pp. 476–477). The authors quote Duncan and Stenbeck that all-purpose models are "a methodological absurdity" (p. 477).

**Bounding.** The 2D-APC graph rules out some sign patterns from the data alone (pp. 482–483). Their example uses political ideology: assuming people become "less liberal as they age" fixes the signs of the period and cohort slopes (p. 483). Monotonicity assumptions bound both sign and size (p. 484).

**Smoothing.** The review does not discuss random-walk priors or second differences. It mentions splines once as an alternative to categorical coding (p. 471 n. 3). It suggests smoothing the Lexis table "to rule out the possibility of unreasonable sharp nonlinearities" before a monotonicity analysis (p. 484 n. 16).

## Recommendations the authors make

The six steps (pp. 485–486):
1. Use a linearized design matrix.
2. Report the identified quantities: θ1, θ2, and the nonlinear effects.
3. Plot the canonical solution line.
4. Bound the rest using "explicit theoretical assumptions about the size, sign, and/or shape."
5. Use mechanism-based models and sensitivity analysis, if measured causes are available.
6. Build theory.

Their general principle: "learn as much as possible from the data while making the fewest assumptions possible" (p. 485). They add that researchers "have been too ambitious in immediately desiring point estimates" (p. 489).

## Caveats

- The review is written from the authors' own framework (2D-APC graphs, bounds), and it is sharply critical of the IE and HAPC. Fu, Land and coauthors would dispute parts of it (p. 477).
- It covers main-effects models only; interactions "further exacerbat[e] the identification problem" (p. 471 n. 5).
- It has nothing on Bayesian smoothing priors. Its only Bayesian remark is that HAPC can be fit by MCMC (p. 478).

## Relation to this project

**Supports our framing.**
- Our period component, in a model with no age term, is their θ1 = α + π: the identified within-cohort change (pp. 471 n. 6, 474–475, 481). Reporting it as "aging and the times combined", without claiming a separate age effect, is what their step 2 recommends (p. 485).
- In a period–cohort model, period and cohort are not collinear. So the linear-identification problem, and the HAPC critique of hidden constraints from random effects (pp. 478–479), do not apply to our slopes in the same way. Linear age is absorbed exactly, because α·age = α·period − α·cohort.
- Our cohort component is an identified contrast too (α − γ up to sign, p. 471 n. 6). The replacement-versus-within-cohort decomposition is therefore an accounting of identified quantities, which fits their "accounting scheme" reading (p. 472).

**What a reviewer could use against us.**
- "Dropping a variable is equivalent to constraining its linear and nonlinear effects to zero, which is typically an unnecessarily strong assumption" (p. 475). Our answer covers only the linear part. Age curvature is not absorbed by period and cohort terms, so dropping age assumes no nonlinear age effect.
- They say this is testable (p. 475), and we have not tested it.
- Smooth RW2 components could soak up age curvature, so a reviewer could call our smoothing a kind of hidden constraint, by analogy with their HAPC critique (p. 478).
- A reviewer could also note that our "replacement" includes the life-course age effect with the opposite sign. It is not a pure cohort effect in their sense.

## Possible use

- **Methods:** one or two sentences. Within-cohort change is an identified combination, "α + π" (p. 471 n. 6); we report it rather than a point-identified age effect, following their advice to report identified quantities (p. 485).
- **Methods or limitations:** acknowledge that omitting age sets age nonlinearities to zero and that this is testable (p. 475). As a deferred suggestion, not a change: a check that adds smooth age curvature (a model with linear age removed), or comparing nonlinear age residuals, would answer it directly.
- **Discussion:** as a further deferred suggestion, a bound in the style of their ideology example (pp. 483–484). If aging does not make people more liberal (α ≥ 0 on our scale), then the effect of the times is at least as liberal as our within-cohort change. That turns their framework into a statement in our favor.
- Cite alongside Ghitza, Gelman & Auerbach 2023 as the contrasting approach that identifies the model by its structure.
