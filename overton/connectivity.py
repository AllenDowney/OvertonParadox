"""How well the primary pool connects survey years (for the appendix).

Scores from different years are comparable only through questions asked in
both. For the primary pool, on the interviewer sample:

- by year: the number of selected questions asked (answered by at least
  MIN_RESPONDENTS respondents who also answered polviews);
- by pair of decades: the number of questions asked in both;
- the questions that bridge the 1970s and the 2020s.

Writes figs/connectivity_by_year.csv and figs/connectivity_decades.csv.

Usage: python -m overton.connectivity [set name, default the primary pool]
"""

import sys

import pandas as pd

from overton.apc import question_sets
from overton.data import CANDIDATES_INTERVIEWER
from overton.pipeline import FIG_DIR

MIN_RESPONDENTS = 100


def asked_by_year(gss, names):
    with_polviews = gss[gss["polviews"].notna()]
    counts = with_polviews.groupby("year")[names].count()
    return counts >= MIN_RESPONDENTS


def main(name=None):
    sets = question_sets()
    codes = sets[name or "primary"]
    names = list(codes)
    gss = pd.read_hdf(CANDIDATES_INTERVIEWER, "gss")
    gss["year"] = gss["year"].astype(int)
    asked = asked_by_year(gss, names)

    by_year = asked.sum(axis=1).rename("questions")
    by_year.to_csv(FIG_DIR / "connectivity_by_year.csv")

    decade = asked.index // 10 * 10
    by_decade = asked.groupby(decade).any()
    shared = by_decade.astype(int) @ by_decade.T.astype(int)
    shared.index = shared.columns = [f"{d}s" for d in by_decade.index]
    shared.to_csv(FIG_DIR / "connectivity_decades.csv")

    print(f"{len(names)} questions")
    print("questions asked by year:", " ".join(f"{y}:{n}" for y, n in by_year.items()))
    print("\nquestions asked in both decades:")
    print(shared.to_string())
    bridge = [v for v in names if by_decade.loc[1970, v] and by_decade.loc[2020, v]]
    print(f"\n{len(bridge)} asked in both the 1970s and the 2020s:", " ".join(bridge))
    print("not:", " ".join(v for v in names if v not in bridge))


if __name__ == "__main__":
    main(*sys.argv[1:])
