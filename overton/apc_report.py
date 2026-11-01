"""Summary table of the period, period-cohort, and age fits (Phase 4b).

Reads results/apc/results (fits from overton/apc.py, run on Unity) and
writes figs/apc_summary.csv. The figures are made by
overton/apc_figures.py (CultureWar style, CultureWar env).

Usage: python -m overton.apc_report
"""

import json

import pandas as pd

from overton.apc import RESULTS_DIR
from overton.pipeline import FIG_DIR


def load_summaries():
    rows = [json.load(open(path)) for path in sorted(RESULTS_DIR.glob("*_summary.json"))]
    return pd.DataFrame(rows)


REPORTED_SETS = ["p48", "social", "econA"]  # the decided specification (docs/plan.md)


def series(run):
    return pd.read_csv(RESULTS_DIR / f"{run}_series.csv").set_index("year")


def results_table(summaries):
    """Headline quantities for each reported set.

    Within-cohort slope: straight line of the standardized period component
    (national period-cohort model), per decade; decomposition from the same
    fit. Overton gap: the period model's conservatives in the endpoint year
    minus its liberals in the first year (1974; 1975 for econA), for 2024 and
    2018 as endpoints. Changes: first year to 2024, by polviews3.
    """
    rows = []
    for name in REPORTED_SETS:
        pc = summaries.set_index("run").loc[f"period_cohort_{name}"]
        lib = series(f"period_{name}_polviews3-Liberal")
        con = series(f"period_{name}_polviews3-Conservative")
        mod = series(f"period_{name}_polviews3-Moderate")
        first = lib.index.min()
        row = dict(set=name, slope=pc["period_slope_per_decade"], slope_lo90=pc["period_slope_lo90"],
                   slope_hi90=pc["period_slope_hi90"], total_change=pc["total_change"],
                   generational_replacement=pc["generational_replacement"], changing_minds=pc["changing_minds"],
                   first_year=first, liberal_first=lib.loc[first, "mean"])
        for end in [2024, 2018]:
            row[f"overton_gap_{end}"] = con.loc[end, "mean"] - lib.loc[first, "mean"]
        for group, df in [("liberal", lib), ("moderate", mod), ("conservative", con)]:
            row[f"change_{group}"] = df.loc[2024, "mean"] - df.loc[first, "mean"]
        rows.append(row)
    return pd.DataFrame(rows)


def birth_group_table(summaries, name="p48"):
    """Within-cohort slope from the period-cohort model fit within each birth group."""
    pc = summaries[(summaries["model"] == "period_cohort") & (summaries["set"] == name) & summaries["cohorts"].notna()]
    return pc[["cohorts", "period_slope_per_decade", "period_slope_lo90", "period_slope_hi90",
               "respondents", "divergences"]].sort_values("cohorts")


def age_table(summaries, name="p48"):
    """Slope of conservatism vs age, per decade of age, within each decade of surveys."""
    age = summaries[(summaries["model"] == "age") & (summaries["set"] == name) & summaries["cohorts"].isna()]
    return age[["window", "slope_per_decade", "slope_lo90", "slope_hi90", "respondents"]].sort_values("window")


def main():
    summaries = load_summaries()
    if "sample" in summaries:
        results = results_table(summaries)
        results.to_csv(FIG_DIR / "apc_results.csv", index=False)
        groups = birth_group_table(summaries)
        groups.to_csv(FIG_DIR / "apc_birth_groups.csv", index=False)
        ages = age_table(summaries)
        ages.to_csv(FIG_DIR / "apc_age_slopes.csv", index=False)
        with pd.option_context("display.width", 300):
            print(results.round(2).to_string(index=False))
            print(groups.round(2).to_string(index=False))
            print(ages.round(2).to_string(index=False))
    summaries.to_csv(FIG_DIR / "apc_summary.csv", index=False)

    columns = ["run", "slope_per_decade", "slope_lo90", "slope_hi90", "change_first_last",
               "total_change", "generational_replacement", "changing_minds",
               "period_change_per_decade", "period_change_per_decade_lo90", "period_change_per_decade_hi90",
               "divergences", "rhat_max", "ess_bulk_min", "elapsed_seconds"]
    with pd.option_context("display.width", 300, "display.max_rows", 100):
        print(summaries.reindex(columns=columns).round(3).to_string(index=False))


if __name__ == "__main__":
    main()
