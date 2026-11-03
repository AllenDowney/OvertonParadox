"""Composite figures for Phase 4b, in the CultureWar book style.

Uses CultureWar's figure helpers (header, registration marks, direct line
labels, export), from a frozen copy in overton/cw_style.py. Reads only the
fit results in results/apc/results.

Figures, for each question set, in figs/apc/:
- time_series_{set}: period model by polviews3, with the 1974 liberal
  level marked (dotted, unlabeled).
- time_series7_{set}: period model by the 7-point polviews.
- cohort_component_{set} and period_component_{set}: period-cohort model,
  all respondents; ..._by_group_{set} adds the polviews3 groups.
- age_series_{set}: age model, one line per decade of surveys.
- age_by_decade_{set} and age_by_generation_{set}: age model fit separately
  for each decade of birth (1900s-2000s) and each generation (Pew's
  boundaries), plotted against age.
- year_by_decade_{set} and year_by_generation_{set}: the period model fit
  separately for the same groups, plotted against survey year, with the
  overall average dotted.
- trajectories_{set}: the national period-cohort model's trajectory for
  each birth year (alpha + cohort + period, without the year noise), over
  the years it was observed, as in CultureWar's cohort trajectories.
- pc_by_decade_{set} and pc_by_generation_{set}: the period component of a
  period-cohort model fit within each group (standardized to the group's
  birth years), with the overall average dotted.
- within_cohort_slope_by_n: the within-cohort slope against the number of
  questions, for the primary specification (no confidence questions) and the
  sensitivity version.

Usage: python -m overton.apc_figures
"""

import json
import re

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import BoxStyle
import pandas as pd

from overton import cw_style as cw  # frozen copy of CultureWar's figure helpers
from overton.cw_style import _add_direct_line_labels, _add_inline_line_labels
from overton import paths

RESULTS_DIR = paths.RESULTS_DIR / "apc" / "results"
OUT_DIR = paths.FIG_DIR / "apc"

SOURCE = "GSS"
Y_AXIS = "Percent conservative responses"
# zoomed to the data, the same for every figure of a set, so they can be compared
# by eye (docs/plan.md, Decisions, 2026-11-02); legends go above the lines
HEIGHT_FACTOR = 1.2
YLIMS = {"p48": (20, 80), "social": (20, 80), "econA": (10, 60)}
# the age and cohort figures (blog post 1) share a narrower range; a few bands at the extremes are cut off
COHORT_YLIMS = {"p48": (30, 70)}


def cohort_ylim(name):
    return COHORT_YLIMS.get(name, YLIMS[name])
# the colors of Chapter 12 (seaborn "muted" 0, 4, 3)
GROUP_COLORS = {"All": "0.6", "Liberal": "#4878d0", "Moderate": "#956cb4", "Conservative": "#d65f5f"}
POLVIEWS7 = ["Extremely liberal", "Liberal", "Slightly liberal", "Moderate",
             "Slightly conservative", "Conservative", "Extremely conservative"]
# label placements on the time series, (x, offset in points); clear of the lines for v1 and v2
TIME_SERIES_LABELS = {"Conservative": (2000, 6), "Moderate": (2020, -4), "Liberal": (2000, -6)}
# three color families, so the groupings aren't confused (Allen, 2026-11-02): survey decades
# warm (gold to wine), decades of birth viridis, generations cool (teal to indigo); earliest
# lightest. Six-step ramps can't reach full separation, so the lines are always labeled.
SURVEY_CMAP = LinearSegmentedColormap.from_list(
    "survey", ["#ebb840", "#e08a33", "#cc5e33", "#ab3d3d", "#86294a", "#5e1f4a"])
GENERATION_CMAP = LinearSegmentedColormap.from_list(
    "generation", ["#5fc7ae", "#2fa5bb", "#2a80c0", "#3460b0", "#3e4199", "#302676"])
DECADE_LABELS = {"1972-1979": "1970s", "1980-1989": "1980s", "1990-1999": "1990s",
                 "2000-2009": "2000s", "2010-2019": "2010s", "2020-2024": "2020s"}


def read_series(run):
    return pd.read_csv(RESULTS_DIR / f"{run}_series.csv")


def read_components(run):
    return pd.read_csv(RESULTS_DIR / f"{run}_components.csv")


def band(ax, x, df, color, label, z):
    # 84% intervals, so two bands that don't overlap differ at about the 5% level;
    # fits from before 2026-11-02 have only the 90%
    lo, hi = ("lo84", "hi84") if "lo84" in df else ("lo90", "hi90")
    ax.fill_between(x, df[lo], df[hi], color=color, alpha=0.3, lw=0, zorder=z)
    ax.plot(x, df["mean"], color=color, label=label, lw=cw.FIGURE_LINEWIDTH * 1.5, zorder=z + 1)


class Plate(BoxStyle.Round):
    """Rounded plate for labels made of digits: the text box leaves room for
    descenders, so trim the bottom (and a little of the top) to balance the pad."""

    def __call__(self, x0, y0, width, height, mutation_size):
        bottom, top = 0.2 * height, 0.08 * height
        return super().__call__(x0, y0 + bottom, width, height - bottom - top, mutation_size)


def new_figure():
    cw.apply_figure_style()
    # not for the book, so taller than the book's figures
    width, height = cw.FIGURE_FIGSIZE
    return plt.subplots(figsize=(width, height * HEIGHT_FACTOR))


def finish(fig, ax, name, subject, figure_type, xlabel, labels="right", ylim=(0, 100), y_axis=Y_AXIS):
    ax.set_xlabel(xlabel)
    cw.apply_book_grid(ax)
    ax.set_ylim(*ylim)
    ax.set_yticks(range(ylim[0], ylim[1] + 1, 10))
    cw.add_figure_header(subject, figure_type, y_axis, SOURCE, left_align=True)
    # direct labels for up to four lines (a side, or placements along the lines);
    # a legend in rows for more ("legend:<corner>:<columns>")
    if isinstance(labels, tuple):  # ("sides", {label: "left" or "right"})
        _add_direct_line_labels(ax, sides=labels[1])
    elif isinstance(labels, dict):
        _add_inline_line_labels(ax, labels)
    elif labels.startswith("legend:"):
        _, loc, ncol = labels.split(":")
        ax.legend(loc=loc, ncol=int(ncol), frameon=False, fontsize="small", handlelength=1.5, columnspacing=1.2)
    elif labels:
        _add_direct_line_labels(ax, side=labels)
    cw.save_figure(fig, OUT_DIR / name)


def group_runs(prefix, name):
    """All respondents and the polviews3 groups, for the runs that were fit."""
    runs = {"All": f"{prefix}_{name}"}
    runs.update({g: f"{prefix}_{name}_polviews3-{g}" for g in ["Liberal", "Moderate", "Conservative"]})
    return {g: run for g, run in runs.items() if (RESULTS_DIR / f"{run}_summary.json").exists()}


def time_series(name):
    fig, ax = new_figure()
    # the three groups only, as in Chapter 12 (all respondents is close to the moderates)
    runs = group_runs("period", name)
    del runs["All"]
    for z, (group, run) in enumerate(runs.items()):
        df = read_series(run)
        band(ax, df["year"], df, GROUP_COLORS[group], group, 3 + 2 * z)
    # the level of the 1974 liberal, over the range of the data
    lib = read_series(f"period_{name}_polviews3-Liberal").set_index("year")["mean"]
    # 1974, or the first year with data (the core economic questions start in 1975)
    ref_year = 1974 if 1974 in lib.index else lib.index.min()
    ax.hlines(lib.loc[ref_year], lib.index.min(), lib.index.max(), color="0.5", ls=":", lw=1, zorder=2)
    finish(fig, ax, f"time_series_{name}", "Conservatism by self-identified ideology", "time series", "Survey year",
           labels=TIME_SERIES_LABELS, ylim=YLIMS[name])


def time_series7(name):
    fig, ax = new_figure()
    cmap = plt.get_cmap("coolwarm")
    for i, label in enumerate(POLVIEWS7):
        df = read_series(f"period_{name}_polviews-{i + 1}")
        band(ax, df["year"], df, cmap(i / 6), label, 3 + 2 * i)
    finish(fig, ax, f"time_series7_{name}", "Conservatism by political label", "time series", "Survey year",
           labels="legend:upper left:4", ylim=YLIMS[name])


def components(name):
    """All respondents (cohort_component_{set}), and with the polviews3 groups (..._by_group_{set})."""
    runs = group_runs("period_cohort", name)
    for component, xlabel, title in [("cohort", "Birth cohort", "Conservatism by birth cohort"),
                                     ("period", "Survey year", "Conservatism within cohorts")]:
        for suffix, groups in [("", ["All"]), ("_by_group", list(runs))]:
            fig, ax = new_figure()
            for z, group in enumerate(groups):
                df = read_components(runs[group])
                df = df[df["component"] == component]
                if component == "cohort":
                    df = df[df["index"] >= 1900]
                # alone, the line can be darker than the gray that sits behind the groups
                color = "0.25" if len(groups) == 1 else GROUP_COLORS[group]
                band(ax, df["index"], df, color, group, 3 + 2 * z)
            # one line needs no label; the groups are too close together for direct labels that work in both sets
            labels = "legend:lower left:2" if len(groups) > 1 else ""
            finish(fig, ax, f"{component}_component{suffix}_{name}", title, f"{component} component", xlabel,
                   labels=labels, ylim=cohort_ylim(name))


def age_series(name):
    fig, ax = new_figure()
    windows = list(DECADE_LABELS)
    for i, window in enumerate(windows):
        path = RESULTS_DIR / f"age_{name}_window-{window}_series.csv"
        if not path.exists():
            continue
        df = pd.read_csv(path)
        band(ax, df["age"], df, SURVEY_CMAP(i / (len(windows) - 1)), DECADE_LABELS[window], 3 + 2 * i)
    # labels at the right ends; the 1980s and 1990s, and the 2000s and 2010s, end close together
    ax.set_xlim(16, 95.5)
    nudges = {"1980s": 4, "2010s": -4}
    placements = {DECADE_LABELS[w]: (0, nudges.get(DECADE_LABELS[w], 0), "end") for w in windows}
    # the 1970s line rises above the others, so extend the top
    low, high = cohort_ylim(name)
    finish(fig, ax, f"age_series_{name}", "Conservatism by age", "age series", "Age", labels=placements,
           ylim=(low, high + 10))


def trajectories(name):
    """One line per birth year, labeled at each decade; colors as for decades of birth."""
    df = pd.read_csv(RESULTS_DIR / f"period_cohort_{name}_trajectories.csv")
    df = df[df["cohort"] >= 1900]
    fig, ax = new_figure()
    cmap = plt.get_cmap("viridis")
    first, last = df["cohort"].min(), df["cohort"].max()
    for cohort, group in df.groupby("cohort"):
        color = cmap(0.9 * (1 - (cohort - first) / (last - first)))
        ax.plot(group["year"], group["mean"], color=color, lw=cw.FIGURE_LINEWIDTH * 0.6, zorder=3)
        if cohort % 10 == 0:
            # label where the line enters, unless it was there from the first survey
            at_start = group["year"].min() > df["year"].min()
            point = group.iloc[0] if at_start else group.iloc[-1]
            ax.annotate(str(cohort), (point["year"], point["mean"]), xytext=(-4 if at_start else 4, 0),
                        textcoords="offset points", ha="right" if at_start else "left", va="center",
                        fontsize="small", color="0.25", zorder=4,
                        bbox=dict(boxstyle=Plate(pad=0.05, rounding_size=0.3), facecolor="white", linewidth=0))
    ax.set_xlim(1970, 2031)
    finish(fig, ax, f"trajectories_{name}", "Conservatism by birth year", "cohort trajectories", "Survey year",
           labels="", ylim=cohort_ylim(name))


FIGURE_SETS = ["p48", "social", "econA"]
DECADES = [(f"{d}s", f"{d}-{d + 9}") for d in range(1900, 2001, 10)]
GENERATIONS = [("Greatest", "1883-1927"), ("Silent", "1928-1945"), ("Boomers", "1946-1964"),
               ("Gen X", "1965-1980"), ("Millennials", "1981-1996"), ("Gen Z", "1997-2012")]


def by_birth_group(name, groups, index, ends, fname, subject, offsets=None, overall=False, cmap=None):
    """One fit per birth group, plotted against age or survey year.

    index: "age" (age model), "year" (period model), or "pc" (the period
    component of a period-cohort model fit within the group, standardized
    to the group's mix of birth years, so the line doesn't move because
    members enter or leave the group). Within a group, age
    and survey year move together, but a group spans several birth years,
    so the two are separate fits, not shifted copies.
    ends: {label: "start" or "end"}, which end of each line gets its label.
    Line ends are staggered across groups (by age, the early groups start
    late and the late groups end early; by year, the reverse), so labels
    go at the staggered ends. offsets: {label: points} to nudge a label.
    overall: also plot the overall average (the period model for all
    respondents) as a dotted line; only for index="year".
    cmap: None for viridis (decades of birth: yellow, earliest, to purple,
    latest), or GENERATION_CMAP (light, earliest, to dark).
    """
    fig, ax = new_figure()
    viridis = cmap is None
    offsets = offsets or {}
    prefix = {"age": "age", "year": "period", "pc": "period_cohort"}[index]
    if overall:
        df = read_series(f"period_{name}")
        ax.plot(df["year"], df["mean"], color="0.4", ls=":", lw=cw.FIGURE_LINEWIDTH * 1.5, zorder=2)
    placements = {}
    for i, (label, cohorts) in enumerate(groups):
        run = f"{prefix}_{name}_cohorts-{cohorts}"
        if index == "pc":
            df = read_components(run)
            df = df[df["component"] == "period"].rename(columns={"index": "year"})
        else:
            df = read_series(run)
        x = df["age"] if index == "age" else df["year"]
        frac = i / (len(groups) - 1)
        color = plt.get_cmap("viridis")(0.9 * (1 - frac)) if viridis else cmap(frac)
        band(ax, x, df, color, label, 3 + 2 * i)
        placements[label] = (0, offsets.get(label, 0), ends[label])
    if index == "age":
        ax.set_xlim(12, 92)
        figure_type, xlabel = "age series", "Age"
    else:
        ax.set_xlim(1965, 2031)
        figure_type = "time series" if index == "year" else "period component"
        xlabel = "Survey year"
    finish(fig, ax, fname, subject, figure_type, xlabel, labels=placements, ylim=cohort_ylim(name))


def split_ends(groups, n_early, early, late):
    """Label the first n_early groups at one end of their lines, the rest at the other."""
    return {label: (early if i < n_early else late) for i, (label, _) in enumerate(groups)}


def by_n_table(difficulties="em", sample="interviewer"):
    """Within-cohort slope for each set size, both specifications.

    difficulties, sample: which version of the fits to read (see overton/apc.py);
    other versions' results, with a suffix on the set name, are skipped.
    Summaries from before 2026-11-01 have neither field: heuristic, all modes.

    Within-cohort slope: straight-line slope of the standardized period
    component (national period-cohort model).
    """
    rows = []
    for spec, prefix in [("primary", "p"), ("sensitivity", "s")]:
        for path in sorted(RESULTS_DIR.glob(f"period_cohort_{prefix}*_summary.json")) + sorted(
                RESULTS_DIR.glob("period_cohort_v2*_summary.json")):
            summary = json.load(open(path))
            name = summary["set"]
            if (summary.get("difficulties", "heuristic"), summary.get("sample", "all")) != (difficulties, sample):
                continue
            # national fits only, not by ideology or birth group
            if summary.get("by") or summary.get("cohorts"):
                continue
            base = name.split("-")[0]
            # p{N} or s{N}, or v2 (the same questions as p15); not the domain sets (e.g. social)
            if not (base == "v2" or re.fullmatch(f"{prefix}\\d+", base)):
                continue
            n = 15 if base == "v2" else int(base[1:])
            rows.append(dict(spec=spec, n=n, set=name,
                             slope=summary["period_slope_per_decade"],
                             slope_lo90=summary["period_slope_lo90"], slope_hi90=summary["period_slope_hi90"]))
    if not rows:
        return pd.DataFrame(rows)
    return pd.DataFrame(rows).sort_values(["spec", "n"])


def plot_by_n(table, column, fname, subject, y_axis, ylim):
    fig, ax = new_figure()
    ax.axhline(0, color="0.6", lw=1, zorder=1)
    for spec, color, label in [("primary", "C0", "Without confidence questions"),
                               ("sensitivity", "C1", "With confidence questions")]:
        df = table[table["spec"] == spec]
        ax.fill_between(df["n"], df[f"{column}_lo90"], df[f"{column}_hi90"], color=color, alpha=0.3, lw=0)
        ax.plot(df["n"], df[column], "o-", color=color, label=label, lw=cw.FIGURE_LINEWIDTH * 1.5, ms=4)
    ax.set_xlabel("Number of questions (top N by the selection rule)")
    cw.apply_book_grid(ax)
    ax.set_ylim(*ylim)
    cw.add_figure_header(subject, "by question set", y_axis, SOURCE, left_align=True)
    ax.legend(loc="lower left", frameon=False, fontsize="small")
    cw.save_figure(fig, OUT_DIR / fname)


def by_n_figures():
    table = by_n_table()
    table.to_csv(paths.FIG_DIR / "apc_by_n.csv", index=False)
    print(table.round(2).to_string(index=False))
    plot_by_n(table, "slope", "within_cohort_slope_by_n", "Change within cohorts",
              "Percentage points per decade", (-4, 2))


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    # the reported sets of the decided specification (docs/plan.md); the others go in the by-N figures
    sets = [name for name in FIGURE_SETS if (RESULTS_DIR / f"period_{name}_summary.json").exists()]
    for name in sets:
        time_series(name)
        if (RESULTS_DIR / f"period_{name}_polviews-1_series.csv").exists():
            time_series7(name)
        components(name)
        if (RESULTS_DIR / f"period_cohort_{name}_trajectories.csv").exists():
            trajectories(name)
        if any(RESULTS_DIR.glob(f"age_{name}_window-*_series.csv")):
            age_series(name)
        if (RESULTS_DIR / f"age_{name}_cohorts-1900-1909_series.csv").exists():
            # by age: early groups labeled where they start, late groups where they end
            ends = split_ends(DECADES, 4, "start", "end")
            by_birth_group(name, DECADES, "age", ends, f"age_by_decade_{name}",
                           "Conservatism by age and decade of birth", offsets={"1960s": -8})
            ends = split_ends(GENERATIONS, 2, "start", "end")
            by_birth_group(name, GENERATIONS, "age", ends, f"age_by_generation_{name}",
                           "Conservatism by age and generation", cmap=GENERATION_CMAP)
        if (RESULTS_DIR / f"period_{name}_cohorts-1900-1909_series.csv").exists():
            # by year: early groups labeled where they end, late groups where they start
            ends = split_ends(DECADES, 6, "end", "start")
            by_birth_group(name, DECADES, "year", ends, f"year_by_decade_{name}",
                           "Conservatism by decade of birth", overall=True)
            ends = split_ends(GENERATIONS, 3, "end", "start")
            by_birth_group(name, GENERATIONS, "year", ends, f"year_by_generation_{name}",
                           "Conservatism by generation", overall=True, cmap=GENERATION_CMAP)
        if (RESULTS_DIR / f"period_cohort_{name}_cohorts-1900-1909_components.csv").exists():
            ends = split_ends(DECADES, 6, "end", "start")
            by_birth_group(name, DECADES, "pc", ends, f"pc_by_decade_{name}",
                           "Conservatism within cohorts, by decade of birth", overall=True)
            ends = split_ends(GENERATIONS, 3, "end", "start")
            by_birth_group(name, GENERATIONS, "pc", ends, f"pc_by_generation_{name}",
                           "Conservatism within cohorts, by generation", overall=True,
                           cmap=GENERATION_CMAP)
        print("figures for", name)
    # by N needs fits for several set sizes (a variation, not part of the decided run)
    if len(by_n_table()) > 2:
        by_n_figures()


if __name__ == "__main__":
    main()
