"""Variation: the latent distribution in the EM calibration of the difficulties.

The decided specification calibrates the difficulties with the latent
distribution fixed at the scoring prior, Normal(0, 4). Over 50 years with
uneven question coverage, a fixed distribution could push changes over time
into the difficulties (second review of the difficulties,
docs/difficulties_design.md). This compares, on the interviewer sample and the
48-question pool:
- fixed: the decided specification;
- empirical: one distribution, estimated (Bock and Aitkin);
- by decade: one estimated distribution per decade of surveys, with common
  difficulties.
Free distributions leave the location unidentified, so their mean difficulty
is held at the decided specification's.

Reports the difficulties (and whether the "who was asked" adjustment, the part
of the difference from the heuristic that tracks when a question was asked,
survives), the estimated distributions, and the weighted yearly Overton
numbers with each set of difficulties (scored with the same Normal(0, 4)
prior; descriptive, not model-based).

Writes figs/latent_check_difficulties.csv and figs/latent_check_results.csv.

Usage: python -m overton.latent_check
"""

import numpy as np
import pandas as pd

from overton.apc import MIN_ANSWERED, SCALE, question_sets
from overton.data import CANDIDATES_INTERVIEWER, WEIGHT_COL
from overton.drift import estimate_with_difficulties
from overton.em import em_difficulties
from overton.pipeline import FIG_DIR, RECODE_POLVIEWS, XS, make_questions, weighted_means


def yearly(score, gss):
    df = pd.DataFrame(dict(c=score, w=gss[WEIGHT_COL], year=gss["year"],
                           p=gss["polviews"].replace(RECODE_POLVIEWS)))
    table = df.groupby(["year", "p"]).apply(lambda g: np.average(g["c"], weights=g["w"])).unstack()
    first, last = 1974, table.index.max()
    return dict(overton_gap=table.loc[last, "Conservative"] - table.loc[first, "Liberal"],
                change_conservative=table.loc[last, "Conservative"] - table.loc[first, "Conservative"],
                change_liberal=table.loc[last, "Liberal"] - table.loc[first, "Liberal"])


def main():
    gss = pd.read_hdf(CANDIDATES_INTERVIEWER, "gss")
    gss["year"] = gss["year"].astype(int)
    codes = question_sets()["primary"]
    questions = make_questions(gss, codes)
    keep = questions.notna().sum(axis=1) >= MIN_ANSWERED
    gss, questions = gss[keep], questions[keep]
    w = gss[WEIGHT_COL]
    decade = (gss["year"] // 10 * 10).values

    fixed = em_difficulties(questions, w)
    versions = {
        "fixed": fixed,
        "empirical": em_difficulties(questions, w, groups=np.zeros(len(gss)), mean_difficulty=fixed.mean()),
        "by decade": em_difficulties(questions, w, groups=decade, mean_difficulty=fixed.mean()),
    }
    means = weighted_means(questions, w)
    heuristic = -np.log(means / (1 - means))
    mean_year = pd.Series({v: np.average(gss.loc[questions[v].notna(), "year"],
                                         weights=w[questions[v].notna()]) for v in questions})

    table = pd.DataFrame(versions).assign(heuristic=heuristic, mean_year=mean_year)
    table.to_csv(FIG_DIR / "latent_check_difficulties.csv")
    rows = []
    for name, d in versions.items():
        slope = np.polyfit(heuristic, d, 1)[0]
        residual = d - slope * heuristic
        score = estimate_with_difficulties(questions, d.values) * SCALE / len(d)
        rows.append(dict(version=name, slope_vs_heuristic=slope,
                         residual_corr_mean_year=np.corrcoef(residual, mean_year)[0, 1],
                         rmse_vs_fixed=np.sqrt(((d - fixed) ** 2).mean()),
                         corr_vs_fixed=np.corrcoef(d, fixed)[0, 1],
                         diff_corr_mean_year=np.corrcoef(d - fixed, mean_year)[0, 1] if name != "fixed" else np.nan,
                         **yearly(score, gss)))
    results = pd.DataFrame(rows)
    results.to_csv(FIG_DIR / "latent_check_results.csv", index=False)
    with pd.option_context("display.width", 250):
        print(results.round(3).to_string(index=False))


if __name__ == "__main__":
    main()
