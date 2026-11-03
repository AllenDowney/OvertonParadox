"""Period, period-cohort, and age models of conservatism (Phase 4b).

The outcome is each respondent's estimated conservatism from the grid
method (posterior mean number of conservative responses), divided by the
number of questions, so it's a mean between 0 and 1. The models are ported
from CultureWar (commit 0f54767), with the same priors and defaults and the
continuous-outcome ("mean") likelihood from its Task 165:

- period: CultureWar's time_model. logit(mu_t) = alpha + period_t (RW2 on
  an annual grid) + epsilon_t (year noise, sigma_short). Each surveyed
  year's weighted mean ~ Normal(mu_t, s_t / sqrt(n_eff_t)), with the
  weighted SD s_t plugged in.
- period_cohort: CultureWar's model10. logit(mu_ct) = alpha + cohort_c
  (RW2 on annual birth cohorts) + period_t (RW2) + epsilon_t. Each cohort x
  year cell's weighted mean ~ Normal(mu_ct, sigma_resid_t / sqrt(n_eff_ct)).
- age: CultureWar's cohort_model, which is the time model with another
  index; here the index is age, within a window of survey years.

Weights: WEIGHT_COL from overton/data.py (wtssps), on the original
extract, not resampled. n_eff is Kish's effective sample size.

Difficulties (--difficulties):
- "heuristic": the book's -logit of weighted prevalence (default);
- "em": weighted EM (overton/em.py) calibrated on the primary pool (p43);
  questions outside it (the confidence questions in the s{N} sets, natfare
  in v1) are estimated with the primary difficulties held fixed. The
  production choice after review (docs/difficulties_design.md, 2026-11-01);
- "em66": weighted EM calibrated on all 66 candidates (sensitivity);
- "emset": weighted EM calibrated separately on each set (sensitivity);
- "m1pool": posterior means from Ricardo's m1 fitted to all 66 candidates
  (overton/irt.py, set "pool"), averaged over the three resamplings
  (validation of em66).
Data and results other than the heuristic's carry the suffix on the set name
(e.g. p43-em), so the versions can coexist. prepare also writes the
difficulties to results/apc/data/difficulties_{choice}.csv.

Two steps; the fit needs only numpy, pandas, and PyMC (CultureWar env):

    python -m overton.apc prepare              # local: write respondent data
    python -m overton.apc prepare --difficulties em
    python -m overton.apc fit --model period --set v1 [--by polviews3=Liberal]
    python -m overton.apc fit --model age --set v1 --window 1972-1979
    python -m overton.apc fit --model age --set v1 --cohorts 1946-1964
    python -m overton.apc rescale              # results saved out of 15 -> percent

Results go to results/apc/results/{run}_*.csv and _diagnostics.json.
"""

import argparse
import json
import time
from pathlib import Path

import numpy as np
import pandas as pd
from overton import paths

APC_DIR = paths.RESULTS_DIR / "apc"
DATA_DIR = APC_DIR / "data"
RESULTS_DIR = APC_DIR / "results"
MIN_ANSWERED = 5
# the domain sets are small (4 questions in econA), so they use a minimum of 2 (Allen, 2026-10-31)
MIN_ANSWERED_BY_SET = {"econA": 2, "econB": 2, "econC": 2, "social": 2}

ECON_A = ["helppoor", "helpnot", "helpsick", "eqwlth"]
ECON_B = ECON_A + ["natenvir", "nateduc", "natmass", "natpark", "tax", "getahead", "natsoc", "natroad"]
ECON_C = ECON_B + ["helpblk", "natdrug"]
# "neither": defense and foreign aid (review, 2026-10-31); trust, which entered the pool when the
# selection was rerun on the primary sample (2026-11-01; docs/question_domains.md)
NOT_SOCIAL = ECON_C + ["natarms", "nataid", "trust", "natspac"]
# excluded case by case after the item-drift diagnostic (Allen, 2026-11-03; docs/item_drift_review.md)
DRIFT_EXCLUDED = ["librac", "natspac", "colrac", "spkrac"]  # colrac, spkrac: the whole topic (civil liberties: racist)
DOMAIN_SETS = {"econA": ECON_A, "econB": ECON_B, "econC": ECON_C, "social": None}  # social: the rest of the pool
DIFFICULTIES = ["heuristic", "em", "em66", "emset", "m1pool"]
SCALE = 100  # results are reported as percent conservative responses (out of 15 before 2026-11-02)
# summary fields on the reporting scale (the others are on the logit scale, or not results)
SCALED_FIELDS = ["slope_per_decade", "slope_lo90", "slope_hi90", "change_first_last", "period_slope_per_decade",
                 "period_slope_lo90", "period_slope_hi90"] + [
    f"{q}{suffix}" for q in ["total_change", "generational_replacement", "changing_minds", "period_change_per_decade"]
    for suffix in ["", "_lo90", "_hi90"]]

# defaults from CultureWar time_model/settings.py and model10/settings.py
PERIOD_SETTINGS = dict(sigma_t_scale=0.125, slope_init_scale=0.2, sigma_short_scale=0.5, target_accept=0.9,
                       rw2_form="trend")
COHORT_SETTINGS = dict(sigma_c_scale=0.125, sigma_t_scale=0.125, slope_init_scale=0.2,
                       sigma_short_scale=0.2, sigma_resid_scale=0.5, target_accept=0.95, rw2_form="trend")


def question_sets():
    """v1, v2, and the nested top-N sets from the ranked pool.

    p{N}: primary specification, the top N after the stability rule
    (reversals of at least 5 points, revised 2026-11-03) and without the
    confidence-in-institutions questions (construct rule). s{N}: sensitivity,
    the same with the confidence questions that pass the stability rule.
    o{N}: sensitivity, the whole primary pool under the previous stability
    rule (sign change or fading, 2026-10-31); o48 is the previous selection.
    DRIFT_EXCLUDED, decided case by case in the item-drift review, are left
    out of the p and s sets before the topic rule. Sizes run
    in steps of 5 up to the whole pool. econA, econB, econC, social: domain
    subsets of the primary pool (core, broad, and inclusive economic; social
    without the "both" and "neither" questions).
    """
    from overton.larger_sets import CONFIDENCE, codes_for, ranked_questions
    from overton.question_sets import SETS

    from overton.stability import unstable

    stability = pd.read_csv(paths.FIG_DIR / "candidates_stability.csv", index_col=0)
    sets = dict(SETS)
    previous = ranked_questions(CONFIDENCE, drop=unstable(stability, "2026-10-31"))
    sets[f"o{len(previous)}"] = codes_for(previous)
    for prefix, exclude_confidence in [("p", True), ("s", False)]:
        drop = unstable(stability) | set(DRIFT_EXCLUDED)
        ranked = ranked_questions(CONFIDENCE if exclude_confidence else None, drop=drop)
        codes = codes_for(ranked)
        names = list(ranked.index)
        sizes = list(range(15, len(names), 5)) + [len(names)]
        for n in sizes:
            sets[f"{prefix}{n}"] = {v: codes[v] for v in names[:n]}

    # social and economic subsets of the primary pool, prespecified after review
    # (docs/question_domains.md, 2026-10-31)
    pool = sets[f"p{len(names_primary(sets))}"]
    for name, members in DOMAIN_SETS.items():
        members = members or [v for v in pool if v not in NOT_SOCIAL]
        sets[name] = {v: pool[v] for v in members}
    return sets


def names_primary(sets):
    """Names of the full primary pool (the largest p{N} set)."""
    return max((v for k, v in sets.items() if k.startswith("p")), key=len)


def data_name(name, difficulties="em", sample="interviewer"):
    """Name of a set's data and results.

    The decided specification (EM difficulties, primary sample) has plain
    names (e.g. p43); variations get suffixes (e.g. p43-heuristic-all).
    Results from before 2026-11-01 used plain names for the heuristic and all
    modes; they're in results/apc_exploratory.
    """
    suffix = "".join(f"-{v}" for v, default in [(difficulties, "em"), (sample, "interviewer")] if v != default)
    return name + suffix


def pool_difficulties():
    """Posterior mean difficulties from the m1 pool fits, averaged over the resamplings."""
    from overton.data import KEYS
    from overton.irt import RESULTS_DIR as IRT_RESULTS

    means = [pd.read_csv(IRT_RESULTS / f"pool_{key}_m1_items.csv", index_col=0)["mean"] for key in KEYS]
    d = pd.concat(means, axis=1).mean(axis=1)
    d = d[d.index.str.startswith("d[")]
    d.index = d.index.str[2:-1]
    return d


def calibrate(gss, questions, min_answered, fixed=None):
    """EM difficulties from the respondents who answered at least min_answered questions."""
    from overton.em import em_difficulties

    keep = questions.notna().sum(axis=1) >= min_answered
    return em_difficulties(questions[keep], gss.loc[keep, "weight"], fixed)


def reference_difficulties(gss, sets, difficulties):
    """EM difficulties for every question in any set, on one reference calibration.

    em: calibrated on the primary pool; em66: on all 66 candidates. Questions
    used by some set but outside the calibration pool are then estimated with
    the calibrated difficulties held fixed.
    """
    from overton.irt import question_sets as irt_sets
    from overton.pipeline import make_questions

    base = sets[f"p{len(names_primary(sets))}"] if difficulties == "em" else irt_sets()["pool"]
    d = calibrate(gss, make_questions(gss, base), MIN_ANSWERED)
    used = {v: c for codes in sets.values() for v, c in codes.items()}
    if set(used) - set(d.index):
        d = calibrate(gss, make_questions(gss, {**base, **used}), MIN_ANSWERED, fixed=d)
    return d


def prepare(names=None, difficulties="em", sample="interviewer"):
    """Weighted grid estimates for each question set, on the original (not resampled) data.

    sample: "interviewer", the primary sample (overton/data.py), or "all",
    every respondent with NORC's weights.
    """
    from overton.data import CANDIDATES, CANDIDATES_PRIMARY, WEIGHT_COL
    from overton.drift import estimate_with_difficulties
    from overton.pipeline import RECODE_POLVIEWS, estimate_conservatism, make_questions

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    gss = pd.read_hdf(CANDIDATES_PRIMARY if sample == "interviewer" else CANDIDATES, "gss")
    gss["year"] = gss["year"].astype(int)
    gss["weight"] = gss[WEIGHT_COL]
    sets = question_sets()
    d = None
    if difficulties == "m1pool":
        d = pool_difficulties()
    elif difficulties in ["em", "em66"]:
        d = reference_difficulties(gss, sets, difficulties)
    used = {}
    for name in names or sets:
        codes = sets[name]
        questions = make_questions(gss, codes)
        min_answered = MIN_ANSWERED_BY_SET.get(name, MIN_ANSWERED)
        if difficulties == "heuristic":
            con, _, _ = estimate_conservatism(questions, weights=gss["weight"])
        else:
            d_set = calibrate(gss, questions, min_answered) if difficulties == "emset" else d[questions.columns]
            used[name] = d_set
            con = estimate_with_difficulties(questions, d_set.values)
        answered = questions.notna().sum(axis=1)
        df = gss[["year", "id", "age", "cohort", "polviews", "weight"]].copy()
        df["polviews3"] = df["polviews"].replace(RECODE_POLVIEWS)
        df["n_questions"] = questions.shape[1]
        df["conservatism"] = con
        df["answered"] = answered
        df = df[(answered >= min_answered) & df["cohort"].notna() & df["age"].notna()]
        df["y"] = df["conservatism"] / df["n_questions"]
        df.to_parquet(DATA_DIR / f"{data_name(name, difficulties, sample)}.parquet")
        print(data_name(name, difficulties, sample), len(df), df.groupby("year")["y"].mean().iloc[[0, -1]].round(3).to_dict())
    if used:
        pd.DataFrame(used).to_csv(DATA_DIR / f"difficulties{data_name('', difficulties, sample)}.csv")


def weighted_cells(df, keys):
    """Weighted mean, weighted variance, and Kish n_eff of y in each cell."""

    def summarize(g):
        w = g["weight"].values
        y = g["y"].values
        mean = np.average(y, weights=w)
        var = np.average((y - mean) ** 2, weights=w)
        return pd.Series(dict(p_weighted=mean, var_weighted=var, n=len(g), n_eff=w.sum() ** 2 / (w**2).sum()))

    return df.groupby(keys).apply(summarize).reset_index()


def rw2_trend_basis(n):
    """Eigenbasis of the mean-centered RW2 prior, with the linear ramp split out.

    L maps the n - 2 innovations to f_raw (double cumsum, f_raw[0] = 0, first slope 0),
    P removes the mean, and r is the mean-centered ramp the free slope scales.
    P L L' P = U diag(lam) U', M = U sqrt(lam) = r a' + M_perp.
    """
    L = np.zeros((n, n - 2))
    for k in range(2, n):
        L[k, : k - 1] = np.arange(k - 1, 0, -1)
    P = np.eye(n) - 1 / n
    lam, U = np.linalg.eigh(P @ L @ L.T @ P)
    keep = lam > 1e-9 * lam.max()
    M = U[:, keep] * np.sqrt(lam[keep])
    r = P @ np.arange(n, dtype=float)
    a = M.T @ r / (r @ r)
    return M - np.outer(r, a), r, a


def rw2(name, n, sigma, slope_init_scale, dims, form="cumsum"):
    """CultureWar's mean-centered RW2 (double cumsum, non-centered, free initial slope).

    form="trend" is the same prior in other coordinates (docs/lab.md, Overtron spike):
    f = sigma M_perp w + beta r, with w ~ N(0, I) a rotation of the innovations and
    beta = v0 + sigma a'w the walk's linear trend, flat, with v0's prior as a potential.
    """
    import pymc as pm

    if form == "trend":
        M_perp, r, a = rw2_trend_basis(n)
        w = pm.Normal(f"{name}_w", 0.0, 1.0, shape=n - 2)
        beta = pm.Flat(f"{name}_trend")
        v0 = beta - sigma * pm.math.dot(a, w)
        pm.Potential(f"{name}_slope_init_prior", pm.logp(pm.Normal.dist(0.0, slope_init_scale), v0))
        return pm.Deterministic(name, sigma * pm.math.dot(M_perp, w) + beta * r, dims=dims)
    z_delta = pm.Normal(f"{name}_z_delta", 0.0, 1.0, shape=n - 2)
    delta = sigma * z_delta
    v0 = pm.Normal(f"{name}_slope_init", 0.0, slope_init_scale)
    rw1 = v0 + pm.math.concatenate([pm.math.zeros(1), pm.math.cumsum(delta)])
    f_raw = pm.math.concatenate([pm.math.zeros(1), pm.math.cumsum(rw1)])
    return pm.Deterministic(name, f_raw - pm.math.mean(f_raw), dims=dims)


def build_series_model(cells, index, grid, s=PERIOD_SETTINGS):
    """Time model (period or age): RW2 over `grid`, year noise, Normal on cell means."""
    import pymc as pm

    idx = cells[index].map({v: i for i, v in enumerate(grid)}).values
    se = np.sqrt(np.maximum(cells["var_weighted"].values, 1e-4) / np.maximum(cells["n_eff"].values, 1.0))
    with pm.Model(coords={"grid": grid}) as m:
        alpha = pm.Normal("alpha", 0.0, 1.0)
        sigma_t = pm.Exponential("sigma_t", 1.0 / s["sigma_t_scale"])
        trend = rw2("trend", len(grid), sigma_t, s["slope_init_scale"], dims="grid", form=s["rw2_form"])
        eta = pm.Deterministic("eta", alpha + trend, dims="grid")
        pm.Deterministic("mu", pm.math.sigmoid(eta), dims="grid")
        sigma_short = pm.HalfNormal("sigma_short", s["sigma_short_scale"])
        epsilon_z = pm.ZeroSumNormal("epsilon_z", sigma=1.0, dims="grid")
        epsilon = pm.Deterministic("epsilon", sigma_short * epsilon_z, dims="grid")
        pm.Normal("y_mean", mu=pm.math.sigmoid(eta[idx] + epsilon[idx]), sigma=se, observed=cells["p_weighted"].values)
    return m


def build_period_cohort_model(cells, years, cohorts, s=COHORT_SETTINGS):
    """model10: RW2 cohort + RW2 period + year noise, Normal on cohort x year cell means."""
    import pymc as pm

    t = cells["year"].map({v: i for i, v in enumerate(years)}).values
    c = cells["cohort"].map({v: i for i, v in enumerate(cohorts)}).values
    with pm.Model(coords={"year": years, "cohort_grid": cohorts}) as m:
        alpha = pm.Normal("alpha", 0.0, 1.0)
        sigma_c = pm.Exponential("sigma_c", 1.0 / s["sigma_c_scale"])
        cohort = rw2("cohort", len(cohorts), sigma_c, s["slope_init_scale"], dims="cohort_grid", form=s["rw2_form"])
        sigma_t = pm.Exponential("sigma_t", 1.0 / s["sigma_t_scale"])
        period = rw2("period", len(years), sigma_t, s["slope_init_scale"], dims="year", form=s["rw2_form"])
        sigma_short = pm.Exponential("sigma_short", 1.0 / s["sigma_short_scale"])
        epsilon_z = pm.ZeroSumNormal("epsilon_z", sigma=1.0, dims="year")
        epsilon = pm.Deterministic("epsilon", sigma_short * epsilon_z, dims="year")
        p_obs = pm.math.sigmoid(alpha + cohort[c] + period[t] + epsilon[t])
        sigma_resid = pm.HalfNormal("sigma_resid", s["sigma_resid_scale"], dims="year")
        se = sigma_resid[t] / np.sqrt(cells["n_eff"].values)
        pm.Normal("y_mean", mu=p_obs, sigma=se, observed=cells["p_weighted"].values)
    return m


def sample(m, target_accept, tune, draws, chains, seed, override=None):
    import nutpie

    target_accept = override or target_accept
    compiled = nutpie.compile_pymc_model(m)
    return nutpie.sample(compiled, tune=tune, draws=draws, chains=chains, seed=seed,
                         target_accept=target_accept, progress_bar=False)


def save_trace(trace, stem):
    """The posterior (without the standardized innovations, which the other variables
    determine) and the sampler stats, as compressed float32 NetCDF, so later summaries
    don't need a refit. Read with arviz.from_netcdf."""
    import xarray as xr

    posterior = trace["posterior"].to_dataset()
    keep = [v for v in posterior.data_vars if not v.endswith(("_z", "_z_delta", "_w"))]
    groups = {"posterior": posterior[keep].astype("float32"), "sample_stats": trace["sample_stats"].to_dataset()}
    encoding = {f"/{g}": {v: dict(zlib=True, complevel=4) for v in ds.data_vars} for g, ds in groups.items()}
    xr.DataTree.from_dict(groups).to_netcdf(f"{stem}_trace.nc", engine="h5netcdf", encoding=encoding)


def draws_of(trace, name):
    """Posterior draws stacked over chains: (draws, ...)."""
    values = trace["posterior"][name].values
    return values.reshape(-1, *values.shape[2:])


def interval(x, axis=0):
    return np.mean(x, axis=axis), np.quantile(x, 0.05, axis=axis), np.quantile(x, 0.95, axis=axis)


def bands(x, axis=0):
    """Mean and the 90% and 84% intervals, for the series and components tables (figures draw the 84%)."""
    return dict(mean=np.mean(x, axis=axis), lo90=np.quantile(x, 0.05, axis=axis), hi90=np.quantile(x, 0.95, axis=axis),
                lo84=np.quantile(x, 0.08, axis=axis), hi84=np.quantile(x, 0.92, axis=axis))


def diagnostics_for(trace, names):
    import arviz as az

    rhat = az.rhat(trace, var_names=names)
    ess = az.ess(trace, var_names=names)
    stats = trace["sample_stats"]
    return dict(
        divergences=int(stats["diverging"].values.sum()),
        n_steps_mean=float(stats["n_steps"].values.mean()),
        maxdepth_share=float(stats["maxdepth_reached"].values.mean()),
        rhat_max=float(max(np.nanmax(rhat[v].values) for v in names)),
        ess_bulk_min=float(min(np.nanmin(ess[v].values) for v in names)),
    )


def fit_series(df, index, grid, scale, stem, args):
    cells = weighted_cells(df, [index])
    m = build_series_model(cells, index, grid)
    trace = sample(m, PERIOD_SETTINGS["target_accept"], args.tune, args.draws, args.chains, args.seed, args.target_accept)
    mu = draws_of(trace, "mu") * scale
    out = pd.DataFrame({index: grid, **bands(mu)}).merge(
        cells.assign(observed=cells["p_weighted"] * scale)[[index, "observed", "n", "n_eff"]], how="left")
    out.to_csv(f"{stem}_series.csv", index=False)

    # linear slope of the latent mean per decade (reporting scale), over the values with data
    x = np.asarray(grid, float)
    observed = np.isin(x, cells[index].values)
    xs = x[observed] - x[observed].mean()
    slope = (mu[:, observed] - mu[:, observed].mean(axis=1, keepdims=True)) @ xs / (xs @ xs) * 10
    summary = dict(zip(["slope_per_decade", "slope_lo90", "slope_hi90"], map(float, interval(slope))))
    summary["change_first_last"] = float(np.mean(mu[:, observed][:, -1] - mu[:, observed][:, 0]))
    return trace, summary, ["alpha", "sigma_t", "sigma_short", "trend"]


def fit_period_cohort(df, scale, stem, args):
    years = list(range(df["year"].min(), df["year"].max() + 1))
    cohorts = list(range(int(df["cohort"].min()), int(df["cohort"].max()) + 1))
    df = df.assign(cohort=df["cohort"].astype(int))
    cells = weighted_cells(df, ["cohort", "year"])
    m = build_period_cohort_model(cells, years, cohorts)
    trace = sample(m, COHORT_SETTINGS["target_accept"], args.tune, args.draws, args.chains, args.seed, args.target_accept)

    alpha = draws_of(trace, "alpha")[:, None, None]
    cohort = draws_of(trace, "cohort")
    period = draws_of(trace, "period")

    # weighted cohort composition of each surveyed year
    survey_years = sorted(df["year"].unique())
    comp = df.groupby(["year", "cohort"])["weight"].sum().unstack(fill_value=0).reindex(columns=cohorts, fill_value=0)
    comp = comp.div(comp.sum(axis=1), axis=0).loc[survey_years].values  # (years, cohorts)

    def level(comp_row, t_idx):
        """Population mean (reporting scale) with cohort mix comp_row and period at year index t_idx."""
        p = 1 / (1 + np.exp(-(alpha[:, 0, 0, None] + cohort + period[:, t_idx, None])))
        return (p * comp_row).sum(axis=1) * scale

    ti = {y: years.index(y) for y in survey_years}
    y0, y1 = survey_years[0], survey_years[-1]
    c0, c1 = comp[0], comp[-1]
    p0, p1 = level(c0, ti[y0]), level(c1, ti[y1])
    fix_cohort = level(c0, ti[y1])  # period changes, cohort mix held at y0
    fix_period = level(c1, ti[y0])  # cohort mix changes, period held at y0
    total = p1 - p0
    d_cohort = 0.5 * ((fix_period - p0) + (total - (fix_cohort - p0)))
    d_period = total - d_cohort
    decades = (y1 - y0) / 10

    # period component, standardized to the pooled cohort mix of all years
    pooled = df.groupby("cohort")["weight"].sum().reindex(cohorts, fill_value=0).values
    pooled = pooled / pooled.sum()
    std_period = np.stack([level(pooled, j) for j in range(len(years))], axis=1)
    # cohort component, at the average period
    p_c = 1 / (1 + np.exp(-(alpha[:, 0] + cohort + period.mean(axis=1, keepdims=True)))) * scale

    rows = []
    for j, y in enumerate(years):
        rows.append(dict(component="period", index=y, **bands(std_period[:, j])))
    for k, c in enumerate(cohorts):
        rows.append(dict(component="cohort", index=c, **bands(p_c[:, k])))
    pd.DataFrame(rows).to_csv(f"{stem}_components.csv", index=False)

    # cohort trajectories, as in CultureWar's cohort_trajectories: for each observed
    # cohort x year cell, the inverse logit of the posterior mean of alpha + cohort + period
    eta = alpha[:, 0, 0, None] + cohort[:, cells["cohort"].map(cohorts.index)] + \
        period[:, cells["year"].map(years.index)]
    cells.assign(mean=1 / (1 + np.exp(-eta.mean(axis=0))) * scale, observed=cells["p_weighted"] * scale)[
        ["cohort", "year", "mean", "observed", "n", "n_eff"]].to_csv(f"{stem}_trajectories.csv", index=False)

    summary = {}
    for label, x in [("total_change", total), ("generational_replacement", d_cohort), ("changing_minds", d_period),
                     ("period_change_per_decade", d_period / decades)]:
        mean, lo, hi = interval(x)
        summary.update({label: float(mean), f"{label}_lo90": float(lo), f"{label}_hi90": float(hi)})
    summary["window"] = f"{y0}-{y1}"

    # the within-cohort slope: a straight line fit to the standardized period
    # component over the surveyed years, per decade, on the reporting scale (each draw)
    x = np.array(survey_years, float) - np.mean(survey_years)
    sp = std_period[:, [ti[y] for y in survey_years]]
    slope = (sp - sp.mean(axis=1, keepdims=True)) @ x / (x @ x) * 10
    summary.update(dict(zip(["period_slope_per_decade", "period_slope_lo90", "period_slope_hi90"],
                            map(float, interval(slope)))))

    # the same on the logit scale
    pv = period[:, [ti[y] for y in survey_years]]
    slope = (pv - pv.mean(axis=1, keepdims=True)) @ x / (x @ x) * 10
    summary.update(dict(zip(["period_logit_slope_per_decade", "lo90", "hi90"], map(float, interval(slope)))))
    return trace, summary, ["alpha", "sigma_c", "sigma_t", "sigma_short", "cohort", "period", "sigma_resid"]


def fit(args):
    set_name = data_name(args.set, args.difficulties, args.sample)
    df = pd.read_parquet(DATA_DIR / f"{set_name}.parquet")
    label = [args.model, set_name]
    if args.by:
        column, value = args.by.split("=")
        values = pd.Series([value]).astype(df[column].dtype).iloc[0] if column != "polviews3" else value
        df = df[df[column] == values]
        label.append(f"{column}-{value}")
    if args.window:
        first, last = map(int, args.window.split("-"))
        df = df[df["year"].between(first, last)]
        label.append(f"window-{args.window}")
    if args.cohorts:
        first, last = map(int, args.cohorts.split("-"))
        df = df[df["cohort"].between(first, last)]
        label.append(f"cohorts-{args.cohorts}")
    PERIOD_SETTINGS["rw2_form"] = COHORT_SETTINGS["rw2_form"] = args.rw2_form
    if args.rw2_form != "trend":
        label.append(f"rw2-{args.rw2_form}")
    run = "_".join(label) + args.tag
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    stem = RESULTS_DIR / run
    n_questions = int(df["n_questions"].iloc[0])
    scale = SCALE

    start = time.time()
    if args.model == "period":
        grid = list(range(df["year"].min(), df["year"].max() + 1))
        trace, summary, names = fit_series(df, "year", grid, scale, stem, args)
    elif args.model == "age":
        df = df.assign(age=df["age"].astype(int))
        grid = list(range(df["age"].min(), df["age"].max() + 1))
        trace, summary, names = fit_series(df, "age", grid, scale, stem, args)
    else:
        trace, summary, names = fit_period_cohort(df, scale, stem, args)

    summary.update(run=run, scale=scale, model=args.model, set=set_name, difficulties=args.difficulties, sample=args.sample, by=args.by, window=summary.get("window", args.window),
                   cohorts=args.cohorts, age_range=f"{int(df['age'].min())}-{int(df['age'].max())}",
                   respondents=len(df), n_questions=n_questions, elapsed_seconds=round(time.time() - start, 1),
                   tune=args.tune, draws=args.draws, chains=args.chains, seed=args.seed,
                   target_accept=args.target_accept, rw2_form=args.rw2_form)
    summary.update(diagnostics_for(trace, names))
    save_trace(trace, stem)
    with open(f"{stem}_summary.json", "w") as f:
        json.dump(summary, f, indent=2)
    print(json.dumps(summary, indent=2))


def rescale():
    """Convert saved results from out of 15 to SCALE, without refitting.

    The models are fit to the fraction of conservative responses; the scale
    is applied only when the results are written, so converting the saved
    results is the same as refitting. A summary with a "scale" field is
    already converted, so this can be rerun (e.g. after pulling from Unity).
    """
    factor = SCALE / 15
    converted = 0
    for path in sorted(RESULTS_DIR.glob("*_summary.json")):
        summary = json.load(open(path))
        if "scale" in summary:
            continue
        for field in SCALED_FIELDS:
            if field in summary:
                summary[field] *= factor
        summary["scale"] = SCALE
        stem = str(path)[:-len("_summary.json")]
        for kind in ["series", "components"]:
            table = Path(f"{stem}_{kind}.csv")
            if table.exists():
                df = pd.read_csv(table)
                columns = [c for c in ["mean", "lo90", "hi90", "lo84", "hi84", "observed"] if c in df]
                df[columns] *= factor
                df.to_csv(table, index=False)
        with open(path, "w") as f:
            json.dump(summary, f, indent=2)
        converted += 1
    print(f"converted {converted} runs to the scale {SCALE}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("step", choices=["prepare", "fit", "rescale"])
    parser.add_argument("--model", choices=["period", "period_cohort", "age"], default="period")
    parser.add_argument("--set", default="v1")
    parser.add_argument("--sets", nargs="*", default=None, help="prepare: which sets (default all)")
    parser.add_argument("--by", default=None, help="subgroup, e.g. polviews3=Liberal or polviews=1")
    parser.add_argument("--window", default=None, help="years, e.g. 1972-1979 (age model)")
    parser.add_argument("--cohorts", default=None, help="years of birth, e.g. 1946-1964 (age model by cohort)")
    parser.add_argument("--tune", type=int, default=2000)
    parser.add_argument("--draws", type=int, default=1000)
    parser.add_argument("--chains", type=int, default=4)
    parser.add_argument("--seed", type=int, default=17)
    parser.add_argument("--target-accept", type=float, default=None, help="default: CultureWar's setting for the model")
    parser.add_argument("--rw2-form", choices=["cumsum", "trend"], default="trend",
                        help="RW2 coordinates; the same prior either way (rw2). trend, the default since "
                             "2026-11-03, samples several times faster; results before then used cumsum")
    parser.add_argument("--tag", default="")
    parser.add_argument("--difficulties", choices=DIFFICULTIES, default="em")
    parser.add_argument("--sample", choices=["interviewer", "all"], default="interviewer")
    args = parser.parse_args()
    if args.step == "prepare":
        prepare(args.sets, args.difficulties, args.sample)
    elif args.step == "rescale":
        rescale()
    else:
        fit(args)


if __name__ == "__main__":
    main()
