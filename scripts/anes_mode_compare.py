"""Compare ANES web and interviewer-administered respondents, 2012-2024 (Task 5).

For each year with both, by mode group (web = VCF0017 4; interviewer = every
other mode): respondents, weighted mean age, percent with a college degree
(VCF0110 = 4), percent white non-Hispanic (VCF0105a = 1), percent placed on
VCF0803, the self-placement shares among the placed, the mean conservatism
score of the decided pool (results/apc/data/anes.parquet), and the weighted
percent giving the conservative answer to each question in the pool.

Descriptive only: it does not separate composition from response (mode)
effects. Weights: VCF0009z, as in the analysis.

Usage: python -I scripts/anes_mode_compare.py <repo root> <out prefix>
writes <out prefix>_groups.csv and <out prefix>_items.csv
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd

root, out = Path(sys.argv[1]), sys.argv[2]
sys.path.insert(0, str(root))
from overton.anes_data import ANES, ANES_CODES, CDF, KEY  # noqa: E402

YEARS = [2012, 2016, 2020, 2024]

anes = pd.read_hdf(ANES, KEY)
extra = pd.concat(c[["VCF0004", "VCF0006", "VCF0110", "VCF0105a"]]
                  for c in pd.read_stata(CDF, chunksize=20000, convert_categoricals=False))
extra = extra.rename(columns={"VCF0004": "year", "VCF0006": "id"})
extra["year"] = extra["year"].astype(int)
anes = anes.merge(extra, on=["year", "id"], how="left")
scores = pd.read_parquet(root / "results/apc/data/anes.parquet")[["year", "id", "y"]]
anes = anes.merge(scores, on=["year", "id"], how="left")
anes = anes[anes["year"].isin(YEARS)].copy()
anes["group"] = np.where(anes["mode"] == 4, "web", "interviewer")


def wmean(x, w):
    ok = x.notna() & w.notna()
    return np.average(x[ok], weights=w[ok]) if ok.any() else np.nan


rows, items = [], []
for (year, group), g in anes.groupby(["year", "group"]):
    w = g["weight"]
    placed = g["polviews"].notna()
    pv = g.loc[placed, "polviews"]
    wp = w[placed]
    row = dict(year=year, group=group, n=len(g),
               age=wmean(g["age"], w),
               college=100 * wmean((g["VCF0110"] == 4).astype(float).where(g["VCF0110"] > 0), w),
               white=100 * wmean((g["VCF0105a"] == 1).astype(float).where(g["VCF0105a"] > 0), w),
               placed=100 * wmean(placed.astype(float), w),
               liberal=100 * wmean((pv <= 3).astype(float), wp),
               moderate=100 * wmean((pv == 4).astype(float), wp),
               conservative=100 * wmean((pv >= 5).astype(float), wp),
               score=100 * wmean(g["y"], w))
    rows.append(row)
    for v, codes in ANES_CODES.items():
        x = g[v]
        if x.notna().sum() < 50:
            continue
        cons = x.isin(codes).astype(float).where(x.notna())
        items.append(dict(year=year, group=group, var=v, n=int(x.notna().sum()), pct_conservative=100 * wmean(cons, w)))

groups = pd.DataFrame(rows)
groups.to_csv(f"{out}_groups.csv", index=False)
items = pd.DataFrame(items)
wide = items.pivot_table(index=["year", "var"], columns="group", values="pct_conservative").dropna()
wide["web_minus_interviewer"] = wide["web"] - wide["interviewer"]
wide.to_csv(f"{out}_items.csv")
pd.set_option("display.width", 200)
print(groups.round(1).to_string(index=False))
print("\nItems, web minus interviewer (percentage points of conservative answers):")
print(wide["web_minus_interviewer"].groupby("year").describe().round(1).to_string())
