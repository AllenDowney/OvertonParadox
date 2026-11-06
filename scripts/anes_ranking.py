"""Code and rank ANES candidate questions the way overton.coding and overton.ranking do for the GSS.

Coding: for each response, the difference in the weighted percentage choosing it
(conservatives minus liberals on VCF0803, 1-3 vs 5-7), within each year, averaged
over years weighted by n. The scale is split, in order, at the point that best
separates the groups; the conservative side is the side conservatives choose more.

Score: weighted logit(conservative ~ year + cohort + libcon), libcon = VCF0803 (1-7),
cohort = year - age (VCF0101), weights VCF0009z scaled to mean 1. Ranked by the
libcon coefficient.

Missing: codes <= 0, 8 and 9 (DK, NA, refused, inapplicable, "depends") for every
candidate; VCF0803 9 (haven't thought) and 0 are missing too.

Usage: python -I scripts/anes_ranking.py <cdf.dta> <out.csv>
"""

import sys

import numpy as np
import pandas as pd
import statsmodels.api as sm
import statsmodels.formula.api as smf

CANDIDATES = {
    # economic and government
    "VCF0806": "econ", "VCF0809": "econ", "VCF0839": "econ", "VCF0829": "econ",
    "VCF9131": "econ", "VCF9133": "econ", "VCF9231": "econ", "VCF0886": "econ",
    "VCF0888": "econ", "VCF0890": "econ", "VCF0894": "econ", "VCF9046": "econ",
    "VCF9047": "econ", "VCF9048": "econ", "VCF9049": "econ", "VCF0892": "econ",
    "VCF0842": "econ",
    # race
    "VCF0830": "race", "VCF0814": "race", "VCF0816": "race", "VCF0867": "race",
    "VCF9037": "race", "VCF9040": "race", "VCF9041": "race", "VCF9042": "race",
    "VCF9050": "race", "VCF0811": "race", "VCF9274": "race",
    # social and moral
    "VCF0834": "social", "VCF0838": "social", "VCF0851": "social", "VCF0852": "social",
    "VCF0853": "social", "VCF0876": "social", "VCF0877": "social", "VCF0878": "social",
    "VCF0879": "social", "VCF9236": "social", "VCF9246": "social", "VCF9247": "social",
    "VCF9248": "social", "VCF9249": "social", "VCF9019": "social",
    # other
    "VCF9013": "other", "VCF9014": "other", "VCF9015": "other", "VCF9016": "other",
    "VCF9017": "other", "VCF9018": "other", "VCF0843": "other",
}
BATTERY = {
    **{v: "egalitarianism" for v in ["VCF9013", "VCF9014", "VCF9015", "VCF9016", "VCF9017", "VCF9018"]},
    **{v: "moral traditionalism" for v in ["VCF0851", "VCF0852", "VCF0853"]},
    **{v: "racial resentment" for v in ["VCF9040", "VCF9041", "VCF9042"]},
    **{v: "child-rearing" for v in ["VCF9246", "VCF9247", "VCF9248", "VCF9249"]},
    **{v: "limited government" for v in ["VCF9131", "VCF9133"]},
}
NOMINAL = {"VCF9019"}  # national goals: categories, not an ordered scale
CORE = ["VCF0004", "VCF0101", "VCF0803", "VCF0009z"]


def load(path):
    cols = CORE + list(CANDIDATES)
    chunks = [c[cols] for c in pd.read_stata(path, chunksize=10000, convert_categoricals=False)]
    df = pd.concat(chunks, ignore_index=True)
    df = df[df["VCF0004"] >= 1972]
    df["year"] = df["VCF0004"].astype(int)
    age = df["VCF0101"].where(df["VCF0101"] > 0)
    df["cohort"] = df["year"] - age
    df["libcon"] = df["VCF0803"].where(df["VCF0803"].between(1, 7))
    df["group"] = np.select([df["libcon"] <= 3, df["libcon"] >= 5], ["Liberal", "Conservative"], None)
    df["w"] = df["VCF0009z"] / df["VCF0009z"].mean()
    for v in CANDIDATES:
        x = df[v]
        df[v] = x.where((x > 0) & ~x.isin([8, 9]))
    return df


def response_differences(df, v):
    data = df[["year", "group", "w", v]].dropna()
    rows = []
    for _, g in data.groupby("year"):
        if set(g["group"]) != {"Liberal", "Conservative"}:
            continue
        share = g.groupby(["group", v])["w"].sum() / g.groupby("group")["w"].sum()
        share = share.unstack(0).fillna(0)
        rows.append((len(g), (share["Conservative"] - share["Liberal"]) * 100))
    weights = np.array([n for n, _ in rows], dtype=float)
    table = pd.concat([d for _, d in rows], axis=1).fillna(0)
    return (table * weights).sum(axis=1) / weights.sum()


def best_cut(diff):
    order = sorted(diff.index)
    cum = diff.reindex(order).cumsum().iloc[:-1]
    k = cum.abs().values.argmax()
    low, high = order[: k + 1], order[k + 1:]
    return (low, cum.iloc[k]) if cum.iloc[k] > 0 else (high, -cum.iloc[k])


def main(path, out):
    df = load(path)
    rows = []
    for v, domain in CANDIDATES.items():
        diff = response_differences(df, v)
        if v in NOMINAL:
            cons = sorted(diff.index[diff > 0])
            sep = diff[diff > 0].sum()
        else:
            cons, sep = best_cut(diff)
        y = df[v].isin(cons).astype(float).where(df[v].notna())
        data = pd.DataFrame(dict(y=y, year=df["year"], cohort=df["cohort"], libcon=df["libcon"], w=df["w"])).dropna()
        fit = smf.glm("y ~ year + cohort + libcon", data=data, family=sm.families.Binomial(),
                      freq_weights=data["w"]).fit()
        years = sorted(df.loc[df[v].notna(), "year"].unique())
        rows.append(dict(
            var=v, domain=domain, battery=BATTERY.get(v, ""), coef=fit.params["libcon"],
            separation=sep, conservative=" ".join(str(int(c)) for c in cons), n=len(data),
            n_years=len(years), first=years[0], last=years[-1], pct_cons=100 * data["y"].mean(),
            nominal=v in NOMINAL,
        ))
    res = pd.DataFrame(rows).sort_values("coef", ascending=False)
    res.to_csv(out, index=False)
    pd.set_option("display.width", 200)
    print(res.round(3).to_string(index=False))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
