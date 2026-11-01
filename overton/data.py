"""Prepare GSS data for the Overton update.

Copies the GSS extract from ~/CultureWar into ../data, checks it, and
makes three weighted resamplings, the same way the book's data file
(gss_pacs_resampled.hdf) was made in PoliticalAlignmentCaseStudy/01_clean:
resample rows within each year with probability proportional to the
sampling weight.

The book used wtssall, filled with wtssps where wtssall is missing
(2021 and later); in the new extract that's wtsmerge.

Also writes the primary sample (docs/mode_design.md, decided 2026-11-01):
the candidate extract with 2021 dropped and only interviewer-administered
respondents (in person or by phone) in 2022 and 2024, the mode the GSS used
through 2018. In those two years, wtssps and wtssnrps are replaced by
CultureWar's weights, raked to the full sample's weighted margins (age
group, sex, race/ethnicity, education, region); NORC's weights are kept as
*_norc. The rule and the weights are the same as CultureWar's interviewer
extract, so both projects use the same respondents and weights.

Usage: python -m overton.data
       python -c "from overton.data import make_candidates_primary; make_candidates_primary()"
"""

import shutil
from pathlib import Path

import numpy as np
import pandas as pd
from overton import paths

SOURCE = Path.home() / "CultureWar/notebooks/gss_extract_2024_r3a.hdf"
DATA_DIR = paths.DATA_DIR
EXTRACT = DATA_DIR / "gss_extract_2024_r3a.hdf"
RESAMPLED = DATA_DIR / "gss_overton_resampled_2024.hdf"
CANDIDATES = DATA_DIR / "gss_overton_candidates_r3a.hdf"
CANDIDATES_RESAMPLED = DATA_DIR / "gss_overton_candidates_resampled.hdf"
CANDIDATES_PRIMARY = DATA_DIR / "gss_overton_candidates_r3a_interviewer.hdf"
CW_INTERVIEWER = Path.home() / "CultureWar/notebooks/gss_extract_2024_r3a_interviewer.hdf"

# the primary sample: interviewer-administered responses (same rule as CultureWar)
DROPPED_YEARS = (2021,)
MIXED_MODE_YEARS = (2022, 2024)
INTERVIEWER_MODES = (1, 2)  # in person, phone
RAKED_WEIGHTS = ("wtssps", "wtssnrps")

# The analysis weight (decided 2026-11-01, consistent with CultureWar and NORC's
# guidance): NORC's post-stratification weight for every year, "recommended above
# all other previous GSS weights". In the primary sample, raked in 2022 and 2024.
# Before 2026-11-01: wtssall, or wtssps where it's missing.
WEIGHT_COL = "wtssps"

WEIGHT = "wtsmerge"
KEYS = ["gss0", "gss1", "gss2"]

# the fifteen questions from Chapter 12 and the responses considered conservative
CONSERVATIVE_VALUES = {
    "abany": [2],
    "homosex": [1, 2, 3],
    "premarsx": [1, 2, 3],
    "prayer": [2],
    "natfare": [3],
    "grass": [2],
    "natenvir": [2, 3],  # about right or too much
    "divlaw": [2],
    "cappun": [1],
    "racopen": [1],
    "letdie1": [2],
    "fepol": [1],
    "gunlaw": [2],
    "sexeduc": [2],
    "pornlaw": [1],
}


def copy_extract():
    """Copy the extract from CultureWar, unless we already have it."""
    if not EXTRACT.exists():
        shutil.copy2(SOURCE, EXTRACT)
        print(f"Copied {SOURCE} -> {EXTRACT}")
    return pd.read_hdf(EXTRACT, "gss")


def check_extract(gss):
    """Check the columns the Overton analysis depends on."""
    required = list(CONSERVATIVE_VALUES) + ["polviews", "year", "age", "cohort", WEIGHT]
    missing = [col for col in required if col not in gss]
    assert not missing, missing

    # weights must be present and positive in every row
    assert gss[WEIGHT].notna().all()
    assert (gss[WEIGHT] > 0).all()

    # every question still asked in the most recent year
    last_year = gss["year"].max()
    for varname in CONSERVATIVE_VALUES:
        last = gss.dropna(subset=[varname])["year"].max()
        assert last == last_year, (varname, last)

    # invalid codes already replaced with NaN
    assert set(gss["polviews"].dropna().unique()) <= set(range(1, 8))
    print("age range", gss["age"].min(), gss["age"].max())
    print("cohort range", gss["cohort"].min(), gss["cohort"].max())


def resample_rows_weighted(df, column):
    """Resample rows with probability proportional to `column`."""
    return df.sample(n=len(df), replace=True, weights=df[column])


def resample_by_year(df, column):
    """Resample rows within each year."""
    samples = [resample_rows_weighted(group, column) for _, group in df.groupby("year")]
    return pd.concat(samples, ignore_index=True)


def make_resampled(gss):
    """Make three resamplings, seeded as in the book's data file."""
    if RESAMPLED.exists():
        RESAMPLED.unlink()
    for i, key in enumerate(KEYS):
        np.random.seed(i)
        sample = resample_by_year(gss, WEIGHT)
        sample.to_hdf(RESAMPLED, key=key, complevel=7)
    print(f"Wrote {RESAMPLED}")


def make_candidates_resampled():
    """Three resamplings of the candidate extract (overton/candidates.py)."""
    gss = pd.read_hdf(CANDIDATES, "gss")
    gss[WEIGHT] = gss["wtssall"].fillna(gss["wtssps"])
    gss["year"] = gss["year"].astype(int)
    if CANDIDATES_RESAMPLED.exists():
        CANDIDATES_RESAMPLED.unlink()
    for i, key in enumerate(KEYS):
        np.random.seed(i)
        sample = resample_by_year(gss, WEIGHT)
        sample.to_hdf(CANDIDATES_RESAMPLED, key=key, complevel=7)
    print(f"Wrote {CANDIDATES_RESAMPLED}")


def make_candidates_primary():
    """The candidate extract restricted to the primary sample, with raked weights."""
    gss = pd.read_hdf(CANDIDATES, "gss")
    keep = ~gss["year"].isin(DROPPED_YEARS) & (
        ~gss["year"].isin(MIXED_MODE_YEARS) | gss["mode"].isin(INTERVIEWER_MODES))
    gss = gss[keep].copy()
    raked = pd.read_hdf(CW_INTERVIEWER, "gss")[["year", "id", *RAKED_WEIGHTS]]
    merged = gss[["year", "id"]].merge(raked, on=["year", "id"], how="left", validate="one_to_one")
    assert len(raked) == len(gss) and merged[list(RAKED_WEIGHTS)].notna().any(axis=1).all(), \
        "primary sample doesn't match CultureWar's interviewer extract"
    for col in RAKED_WEIGHTS:
        gss[f"{col}_norc"] = gss[col]
        gss[col] = merged[col].values
    unchanged = ~gss["year"].isin(MIXED_MODE_YEARS)
    assert np.allclose(gss.loc[unchanged, "wtssps"], gss.loc[unchanged, "wtssps_norc"], equal_nan=True)
    if CANDIDATES_PRIMARY.exists():
        CANDIDATES_PRIMARY.unlink()
    gss.to_hdf(CANDIDATES_PRIMARY, key="gss", complevel=7)
    print(f"Wrote {CANDIDATES_PRIMARY}: {len(gss):,} rows")
    print(gss.groupby("year").size().loc[[2018, 2022, 2024]].to_dict())


def main():
    gss = copy_extract()
    gss["year"] = gss["year"].astype(int)
    print(gss.shape, gss["year"].min(), gss["year"].max())
    check_extract(gss)
    make_resampled(gss)


if __name__ == "__main__":
    main()
