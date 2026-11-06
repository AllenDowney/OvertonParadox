"""Relative position: where the 1974 liberal would stand in later years.

The Overton claim is that a liberal of the 1970s would be right of center
today. So the summary is a percentile (docs/plan.md, Decisions, 2026-11-02):
- headline: the median 1974 liberal's percentile in each survey year's
  distribution of conservatism, with the medians of each year's liberals,
  moderates, and conservatives as reference points;
- mechanism: the median of each decade of birth, as a percentile of each
  survey year's distribution, followed over time.

Distributions: the latent distribution of conservatism in each group (survey
year; year x polviews3; year x decade of birth), normal on the logit scale,
estimated by weighted EM on a fine grid with the decided difficulties held
fixed (overton/em.py, latent_normals; a nonparametric distribution didn't
converge, see there). Unlike the scores, these aren't widened by
measurement noise or pulled in by the prior, so the spread of each year's
distribution doesn't depend on how many questions people answered. Medians,
not means, so the percentile is the same on any monotone scale (logit, out
of 15, percent); with normal distributions, a group's median is its mean, and
the percentile is the normal CDF of a z-score on the logit scale.

Check: the same percentiles from the observed scores (weighted, the decided
Normal(0, 4) scoring prior).

Intervals: for the 2024 numbers only, a bootstrap of respondents within the
two years involved (simple resampling with the weights carried along; it
ignores the GSS's clustering, so the intervals are somewhat too narrow).

Sample, questions, and difficulties are the decided specification's: the
data written by `python -m overton.apc prepare` (respondents with enough
answers and known age and cohort) and its EM difficulties.

Writes figs/position_{set}.csv (by year), figs/position_cohorts_{set}.csv,
figs/position_headline.csv, and the figures figs/apc/position_{set} and
figs/apc/position_cohorts_{set}.

Usage: python -m overton.position [--survey anes]

With --survey anes: the ANES pool "anes" (overton/anes_data.py); the
headline goes to figs/position_headline_anes.csv.
"""

import numpy as np
import pandas as pd
from scipy.special import expit
from scipy.stats import norm

from overton.apc import DATA_DIR, question_sets
from overton.data import CANDIDATES_INTERVIEWER
from overton.drift import estimate_with_difficulties
from overton.em import latent_normals
from overton.pipeline import FIG_DIR, make_questions

SETS = ["primary", "social", "econA"]
ANES_POSITION_SETS = ["anes"]  # --survey anes (Task 5); domain subsets to come
XS = np.linspace(-6, 6, 121)  # finer than the scoring grid
LAST_YEAR = 2024
MIN_CELL = 100  # respondents in a year x decade-of-birth cell
BIRTH_DECADES = list(range(1900, 2001, 10))
N_BOOTSTRAP = 200
GROUPS = ["Liberal", "Moderate", "Conservative"]


def cdf(dist, x):
    """Share of the distribution (a row with mu and sd) below x."""
    return norm.cdf(x, dist["mu"], dist["sd"])


def median(dist):
    return dist["mu"]


def load(name, survey="gss", sample=None):
    """The prepared respondents, their 1/0/NaN answers, and the difficulties.

    survey="anes": the ANES data (overton/anes_data.py) and its EM difficulties
    (difficulties_anes.csv). sample: the ANES sample, all modes (decided) or
    "interviewer" (sensitivity; its own prepared data and difficulties).
    """
    from overton.apc import data_name

    df = pd.read_parquet(DATA_DIR / f"{data_name(name, 'em', sample, survey)}.parquet")
    if survey == "anes":
        from overton.anes_data import ANES, KEY, SETS as ANES_SETS

        path = DATA_DIR / f"difficulties_anes{data_name('', 'em', sample, survey)}.csv"
        d = pd.read_csv(path, index_col=0)[name].dropna()
        gss = pd.read_hdf(ANES, KEY)
        sets = ANES_SETS
    else:
        d = pd.read_csv(DATA_DIR / "difficulties.csv", index_col=0)[name].dropna()
        gss = pd.read_hdf(CANDIDATES_INTERVIEWER, "gss")
        sets = question_sets()
    gss = gss.assign(year=gss["year"].astype(int)).set_index(["year", "id"])
    questions = make_questions(gss, sets[name])[list(d.index)]
    questions = questions.loc[list(zip(df["year"], df["id"]))]
    return df.reset_index(drop=True), questions.reset_index(drop=True), d


def to_percent(theta, d):
    """Expected percent conservative responses at theta (the reporting scale)."""
    return expit(np.asarray(theta)[..., None] - d.values).mean(axis=-1) * 100


def distributions(df, questions, d, keys):
    """Latent distribution (mu, sd) for each group defined by the columns `keys`."""
    labels = df[keys].astype(str).agg("|".join, axis=1)
    return latent_normals(questions, df["weight"], d.values, labels, XS)


def weighted_percentile_of(x, values, weights):
    """Weighted share of values below x (ties count half)."""
    below = weights[values < x].sum() + 0.5 * weights[values == x].sum()
    return below / weights.sum()


def weighted_median(values, weights):
    order = np.argsort(values)
    cum = np.cumsum(weights[order]) / weights.sum()
    return values[order][np.searchsorted(cum, 0.5)]


def by_year(df, questions, d, ref_year):
    """Percentiles in each year's distribution: the reference liberal and each year's own groups."""
    year = distributions(df, questions, d, ["year"])
    groups = distributions(df[df["polviews3"].isin(GROUPS)], questions[df["polviews3"].isin(GROUPS)], d,
                           ["year", "polviews3"])
    ref = median(groups.loc[f"{ref_year}|Liberal"])

    # check: the observed scores
    score = estimate_with_difficulties(questions, d.values) / len(d) * 100
    w = df["weight"].values
    in_ref = ((df["year"] == ref_year) & (df["polviews3"] == "Liberal")).values
    ref_observed = weighted_median(score[in_ref], w[in_ref])

    rows = []
    for y in sorted(df["year"].unique()):
        dist = year.loc[str(y)]
        in_year = (df["year"] == y).values
        row = dict(year=y, n=int(in_year.sum()), ref_liberal=100 * cdf(dist, ref),
                   ref_liberal_observed=100 * weighted_percentile_of(ref_observed, score[in_year], w[in_year]),
                   median_percent=to_percent(median(dist), d))
        for g in GROUPS:
            if f"{y}|{g}" in groups.index:
                row[g.lower()] = 100 * cdf(dist, median(groups.loc[f"{y}|{g}"]))
        rows.append(row)
    return pd.DataFrame(rows), ref, ref_observed


def by_cohort(df, questions, d):
    """Each decade of birth's median, as a percentile of each survey year's distribution."""
    df = df.assign(decade=(df["cohort"] // 10 * 10).astype(int))
    year = distributions(df, questions, d, ["year"])
    cells = df.groupby(["year", "decade"]).size()
    keep = df.set_index(["year", "decade"]).index.isin(cells.index[cells >= MIN_CELL])
    keep &= df["decade"].isin(BIRTH_DECADES).values
    cohort = distributions(df[keep], questions[keep], d, ["year", "decade"])
    rows = []
    for label in cohort.index:
        y, decade = map(int, label.split("|"))
        rows.append(dict(year=y, decade=decade, n=int(cells[(y, decade)]),
                         percentile=100 * cdf(year.loc[str(y)], median(cohort.loc[label]))))
    return pd.DataFrame(rows)


def headline(df, questions, d, ref_year, seed=17):
    """The 2024 percentiles, with bootstrap intervals over respondents in the two years."""
    rng = np.random.default_rng(seed)
    years = df["year"].isin([ref_year, LAST_YEAR]).values
    df, questions = df[years].reset_index(drop=True), questions[years].reset_index(drop=True)

    def numbers(df, questions):
        year = distributions(df, questions, d, ["year"]).loc[str(LAST_YEAR)]
        in_groups = df["polviews3"].isin(GROUPS).values
        groups = distributions(df[in_groups], questions[in_groups], d, ["year", "polviews3"])
        ref = median(groups.loc[f"{ref_year}|Liberal"])
        out = dict(ref_liberal=100 * cdf(year, ref), ref_liberal_percent=to_percent(ref, d),
                   median_percent=to_percent(median(year), d))
        for g in GROUPS:
            out[g.lower()] = 100 * cdf(year, median(groups.loc[f"{LAST_YEAR}|{g}"]))
        return out

    point = numbers(df, questions)
    draws = []
    for _ in range(N_BOOTSTRAP):
        rows = np.concatenate([rng.choice(idx, len(idx)) for idx in df.groupby("year").indices.values()])
        draws.append(numbers(df.iloc[rows].reset_index(drop=True), questions.iloc[rows].reset_index(drop=True)))
    draws = pd.DataFrame(draws)
    row = dict(ref_year=ref_year)
    for key, value in point.items():
        row.update({key: value, f"{key}_lo90": draws[key].quantile(0.05), f"{key}_hi90": draws[key].quantile(0.95)})
    return row


def figures(name, table, cohorts, ref_year):
    from overton import apc_figures as af
    from overton import cw_style as cw
    import matplotlib.pyplot as plt

    y_axis = "Percentile of the year's distribution"
    fig, ax = af.new_figure()
    ax.axhline(50, color="0.6", lw=1, zorder=1)
    for z, g in enumerate(GROUPS):
        ax.plot(table["year"], table[g.lower()], color=af.GROUP_COLORS[g], lw=cw.FIGURE_LINEWIDTH, alpha=0.6,
                label=g, zorder=3 + z)
    ax.plot(table["year"], table["ref_liberal"], "o-", color="0.2", lw=cw.FIGURE_LINEWIDTH * 1.5, ms=3,
            label=f"{ref_year} liberal", zorder=10)
    af.finish(fig, ax, f"position_{name}", f"Where the {ref_year} liberal would stand", "time series",
              "Survey year", labels="right", ylim=(0, 100), y_axis=y_axis)

    fig, ax = af.new_figure()
    ax.axhline(50, color="0.6", lw=1, zorder=1)
    cmap = plt.get_cmap("viridis")
    decades = sorted(cohorts["decade"].unique())
    placements = {}
    for i, decade in enumerate(decades):
        df = cohorts[cohorts["decade"] == decade]
        label = f"{decade}s"
        ax.plot(df["year"], df["percentile"], "o-", color=cmap(0.9 * (1 - i / (len(decades) - 1))),
                lw=cw.FIGURE_LINEWIDTH * 1.5, ms=2.5, label=label, zorder=3 + i)
        placements[label] = (0, 0, "end" if i < len(decades) - 4 else "start")
    ax.set_xlim(1965, 2031)
    af.finish(fig, ax, f"position_cohorts_{name}", "Relative position by decade of birth", "time series",
              "Survey year", labels=placements, ylim=(0, 100), y_axis=y_axis)


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--survey", choices=["gss", "anes"], default="gss")
    parser.add_argument("--sample", choices=["interviewer", "all"], default=None,
                        help="ANES only: interviewer-administered sample as a sensitivity check")
    args = parser.parse_args()
    survey, sample = args.survey, args.sample
    if survey == "gss" and sample is not None:
        raise ValueError("--sample is for the ANES; the GSS uses its decided sample")
    from overton.apc import data_name

    sets = SETS if survey == "gss" else ANES_POSITION_SETS
    suffix = "" if survey == "gss" else "_anes" + data_name("", "em", sample, survey)
    headline_path = FIG_DIR / f"position_headline{suffix}.csv"
    rows = []
    for name in sets:
        df, questions, d = load(name, survey, sample)
        out_name = data_name(name, "em", sample, survey)
        ref_year = int(df.loc[df["polviews3"] == "Liberal", "year"].min())
        ref_year = max(ref_year, 1974)
        table, ref, ref_observed = by_year(df, questions, d, ref_year)
        table.to_csv(FIG_DIR / f"position_{out_name}.csv", index=False)
        cohorts = by_cohort(df, questions, d)
        cohorts.to_csv(FIG_DIR / f"position_cohorts_{out_name}.csv", index=False)
        row = dict(set=out_name, **headline(df, questions, d, ref_year),
                   ref_liberal_observed=table.set_index("year").loc[LAST_YEAR, "ref_liberal_observed"])
        rows.append(row)
        figures(out_name, table, cohorts, ref_year)
        with pd.option_context("display.width", 250):
            print(name, f"reference: median {ref_year} liberal, {to_percent(ref, d):.1f}% "
                        f"(observed scores: {ref_observed:.1f}%)")
            print(table.round(1).to_string(index=False))
            print(cohorts.pivot(index="year", columns="decade", values="percentile").round(0).to_string())
    out = pd.DataFrame(rows)
    out.to_csv(headline_path, index=False)
    with pd.option_context("display.width", 250):
        print(out.round(1).T.to_string())


if __name__ == "__main__":
    main()
