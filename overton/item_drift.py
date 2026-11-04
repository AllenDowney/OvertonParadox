"""Item-drift diagnostic for the primary pool, for inspection only.

Decided 2026-11-03 after consultation (docs/stability_review.md, section 8).
The measurement model assumes that, among respondents with the same latent
conservatism, the probability of a question's conservative answer doesn't
change over time. For each question in the primary pool:

- calibrate the difficulties once, by weighted EM on the whole pool (as in
  overton/apc.py);
- leave-one-out score: each respondent's posterior mean of theta (logit
  scale, grid and prior from overton/pipeline.py) from the other questions in
  the pool, for respondents who answered this question and at least
  MIN_ANSWERED of the others;
- a weighted logistic regression of the coded answer on that score and one
  indicator per survey decade; decade effects are reported relative to the
  mean over decades, with 90% intervals from robust (HC1) standard errors.
  Decades with fewer than MIN_RESPONDENTS respondents are left out.

A question is listed for inspection if some decade's effect is credible
(90% interval excludes 0) and at least THRESHOLD logits in size (decided by
Allen, 2026-11-03, before running it). Listed questions are reviewed case by
case; nothing is excluded automatically.

Writes figs/item_drift.csv.

Usage: python -m overton.item_drift [question ...]
  (with questions: report only those, written to figs/item_drift_<names>.csv)
"""

import sys

import numpy as np
import pandas as pd
import statsmodels.api as sm
from scipy.special import expit

from overton.apc import MIN_ANSWERED, calibrate, question_sets
from overton.data import CANDIDATES_INTERVIEWER, WEIGHT_COL
from overton.pipeline import FIG_DIR, PRIOR, XS, make_questions

THRESHOLD = 0.5  # logits
MIN_RESPONDENTS = 200
Z90 = 1.645


def item_loglikes(a, d):
    """Per-question log likelihood on the grid: shape (questions, respondents, grid)."""
    P = expit(XS[None, :] - d[:, None])
    out = np.zeros((a.shape[1], a.shape[0], len(XS)))
    for j in range(a.shape[1]):
        col = a[:, j, None]
        out[j] = np.where(col == 1, np.log(P[j]), np.where(col == 0, np.log(1 - P[j]), 0))
    return out


def decade_effects(y, score, decade, w):
    """Decade effects relative to their mean, controlling for the score."""
    decades = np.sort(np.unique(decade))
    X = np.column_stack([score] + [(decade == k).astype(float) for k in decades])
    res = sm.GLM(y, X, family=sm.families.Binomial(), var_weights=w / w.mean()).fit(cov_type="HC1")
    k = len(decades)
    C = np.zeros((k, k + 1))
    C[:, 1:] = np.eye(k) - 1 / k
    effect = C @ res.params
    se = np.sqrt(np.diag(C @ res.cov_params() @ C.T))
    return pd.DataFrame(dict(decade=decades, effect=effect, lo=effect - Z90 * se, hi=effect + Z90 * se)), res.params[0]


def main(only=()):
    sets = question_sets()
    codes = sets["primary"]
    gss = pd.read_hdf(CANDIDATES_INTERVIEWER, "gss")
    gss["year"] = gss["year"].astype(int)
    gss["weight"] = gss[WEIGHT_COL]
    questions = make_questions(gss, codes)
    d = calibrate(gss, questions, MIN_ANSWERED)
    print(f"pool of {len(codes)}; difficulties calibrated")

    a = questions.values
    w_all = gss["weight"].values
    decade_all = (gss["year"].values // 10 * 10).astype(int)
    ll = item_loglikes(a, d[questions.columns].values)
    total = ll.sum(axis=0)
    answered = ~np.isnan(a)
    n_answered = answered.sum(axis=1)

    rows = []
    for j, v in enumerate(questions.columns):
        if only and v not in only:
            continue
        keep = answered[:, j] & (n_answered - 1 >= MIN_ANSWERED)
        loo = total[keep] - ll[j, keep]
        post = np.exp(loo - loo.max(axis=1, keepdims=True)) * PRIOR
        post /= post.sum(axis=1, keepdims=True)
        score = post @ XS
        y, w, decade = a[keep, j], w_all[keep], decade_all[keep]
        counts = pd.Series(decade).value_counts()
        ok = np.isin(decade, counts.index[counts >= MIN_RESPONDENTS])
        effects, slope = decade_effects(y[ok], score[ok], decade[ok], w[ok])
        listed = ((effects["lo"] > 0) | (effects["hi"] < 0)) & (effects["effect"].abs() >= THRESHOLD)
        largest = effects.loc[effects["effect"].abs().idxmax()]
        rows.append(dict(
            variable=v, n=int(ok.sum()), slope=slope,
            effects=" ".join(f"{r.decade}s:{r.effect:+.2f}" for r in effects.itertuples()),
            intervals=" ".join(f"{r.decade}s:[{r.lo:+.2f},{r.hi:+.2f}]" for r in effects.itertuples()),
            largest=largest["effect"], largest_decade=int(largest["decade"]),
            listed=bool(listed.any()),
            listed_decades=" ".join(f"{k}s" for k in effects.loc[listed, "decade"]),
        ))
    table = pd.DataFrame(rows).set_index("variable")
    table.to_csv(FIG_DIR / ("item_drift_" + "_".join(only) + ".csv" if only else "item_drift.csv"))
    with pd.option_context("display.width", 250, "display.max_rows", 100, "display.max_colwidth", 120):
        print(table["listed"].sum(), "of", len(table), f"listed (credible decade effect of at least {THRESHOLD} logits)")
        print(table.sort_values("largest", key=abs, ascending=False)[["n", "slope", "effects", "listed_decades"]].round(2).to_string())


if __name__ == "__main__":
    main(sys.argv[1:])
