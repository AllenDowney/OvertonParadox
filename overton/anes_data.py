"""ANES data for the Overton pipeline (board Task 5; plan docs/anes_plan.md).

Reads the ANES Time Series Cumulative Data File (1948-2024, release of
2026-02-05; data/README.md), compressed, and writes data/anes_overton.hdf
(key "anes") with the column names the GSS pipeline uses, so overton.apc can
run on it with --survey anes:

- year (VCF0004), id (VCF0006, year-level case ID), age (VCF0101),
  cohort = year - age;
- polviews: the 7-point liberal-conservative scale (VCF0803), with 0 (NA)
  and 9 (DK, haven't thought) set to missing. Rows without a self-placement
  are kept (Allen, 2026-11-06), unlike the GSS extract;
- weight: VCF0009z (full-sample weight);
- mode: VCF0017 (0 in person, 1-3 telephone, 4 internet, 5 video). The
  interviewer sample is every mode except internet;
- the 32 questions of the pool, with codes <= 0, 8 and 9 (DK, NA, refused,
  inapplicable, depends) set to missing, and VCF0878 code 2 recoded to 5 in
  2024 (the CDF uses 2 for "No" that year only; docs/anes_plan.md, audit).

The pool and its codings come from scripts/anes_ranking.py on the 1948-2024
CDF, with one question per topic and priority for questions asked in 2024
(docs/anes_plan.md, "Pool with priority for questions asked in 2024").

Usage: python -m overton.anes_data
"""

import pandas as pd

from overton.paths import DATA_DIR

CDF = DATA_DIR / "anes_timeseries_cdf_stata_20260205.dta.gz"
ANES = DATA_DIR / "anes_overton.hdf"
KEY = "anes"
INTERNET = 4  # VCF0017; every other mode is interviewer-administered

# question -> codes that count as the conservative response (scripts/anes_ranking.py, 2026-11-06)
ANES_CODES = {
    "VCF0842": [4, 5, 6, 7],  # environmental regulation
    "VCF0806": [4, 5, 6, 7],  # government health insurance
    "VCF9040": [1, 2, 3],  # racial resentment: no special favors
    "VCF0853": [1, 2],  # moral traditionalism: more emphasis on traditional values
    "VCF0830": [4, 5, 6, 7],  # aid to Blacks
    "VCF0878": [5],  # gay adoption (2024: 2 recoded to 5)
    "VCF0838": [1, 2, 3],  # abortion
    "VCF0839": [1, 2, 3, 4],  # government services and spending
    "VCF0809": [5, 6, 7],  # guaranteed jobs and income
    "VCF9017": [1, 2, 3],  # egalitarianism: worry less about equality
    "VCF0894": [3],  # federal spending: welfare
    "VCF9047": [2, 3, 7],  # federal spending: environment
    "VCF0867": [5],  # affirmative action
    "VCF0843": [4, 5, 6, 7],  # defense spending
    "VCF0876": [5],  # job protection for gays
    "VCF9131": [1],  # less government is better
    "VCF9274": [1, 2],  # Blacks' influence in politics
    "VCF9236": [1],  # death penalty
    "VCF0877": [5],  # gays in the military
    "VCF0811": [3, 4, 5, 6, 7],  # urban unrest
    "VCF9249": [2, 3],  # child-rearing: respect for elders
    "VCF0890": [2, 3],  # federal spending: public schools
    "VCF0816": [2],  # school integration
    "VCF0879": [4, 5],  # immigration level
    "VCF0834": [2, 3, 4, 5, 6, 7],  # women's equal role
    "VCF0814": [3],  # civil rights pushes too fast
    "VCF9231": [1],  # import limits
    "VCF9019": [1, 3],  # national goals (nominal)
    "VCF0888": [1],  # federal spending: crime
    "VCF9049": [2, 3, 7],  # federal spending: Social Security
    "VCF9048": [2, 3, 7],  # federal spending: science and technology
    "VCF0892": [3],  # federal spending: foreign aid
}
SETS = {"anes": {v: [float(c) for c in codes] for v, codes in ANES_CODES.items()}}

CORE = {"VCF0004": "year", "VCF0006": "id", "VCF0101": "age", "VCF0803": "polviews",
        "VCF0009z": "weight", "VCF0017": "mode"}


def build():
    cols = list(CORE) + list(ANES_CODES)
    chunks = [c[cols] for c in pd.read_stata(CDF, chunksize=10000, convert_categoricals=False)]
    anes = pd.concat(chunks, ignore_index=True).rename(columns=CORE)
    anes = anes[anes["year"] >= 1972].copy()
    anes["year"] = anes["year"].astype(int)
    anes["age"] = anes["age"].where(anes["age"] > 0)
    anes["cohort"] = anes["year"] - anes["age"]
    anes["polviews"] = anes["polviews"].where(anes["polviews"].between(1, 7))
    for v in ANES_CODES:
        x = anes[v]
        anes[v] = x.where((x > 0) & ~x.isin([8, 9]))
    in_2024 = anes["year"] == 2024
    anes.loc[in_2024 & (anes["VCF0878"] == 2), "VCF0878"] = 5
    return anes.reset_index(drop=True)


def interviewer(anes):
    """Interviewer-administered respondents: every mode except internet."""
    return anes[anes["mode"] != INTERNET]


def main():
    anes = build()
    anes.to_hdf(ANES, key=KEY, mode="w", complevel=6)
    print(f"{anes.shape} -> {ANES}")
    print("respondents per year:", anes.groupby("year").size().to_dict())
    print("placed on VCF0803 (%):", (anes.groupby("year")["polviews"].apply(lambda s: s.notna().mean()) * 100).round().astype(int).to_dict())
    print("interviewer-administered per year:", interviewer(anes).groupby("year").size().to_dict())


if __name__ == "__main__":
    main()
