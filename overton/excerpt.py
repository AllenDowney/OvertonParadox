"""Data excerpt and reference fixtures for the Overtron (docs/overtron_plan.md, milestone 2).

The excerpt is what the browser page loads: every respondent in the decided
interviewer sample of the candidate extract (GSS 1972-2024, R3a), with the raw
responses to the 170 candidate questions, and the metadata the question picker
shows.

- respondents.bin.gz: a column store, little-endian, gzipped (the page reads it
  with DecompressionStream). Columns and offsets are in the manifest. Missing
  values are -1 in the integer columns and NaN in the weights.
- questions.json: for each candidate, the wording, value labels, default coding,
  ranking and stability statistics, and the reasons it is in or out of the
  decided pool; plus the presets (p48, social, econA, the book's 15).
- manifest.json: version, source, sample rule, git commit, columns, and checksums.

The interviewer sample drops 2021 and, in 2022 and 2024, keeps interviewer-administered
respondents only; `weight` is its analysis weight (wtssps, raked in 2022 and
2024; overton/data.py). The page offers no all-modes variation (Allen, 2026-11-02).

The fixtures (overtron/fixtures/{set}.json) are the Python pipeline's
intermediate results for p48 and econA, so each step of the TypeScript port
can be tested against them: codings, EM difficulties (the decided reference
calibration and a calibration on the set itself), scores for a sample of
respondents, yearly means, the weighted cohort x year cells, and the decided
period-cohort summary.

Before writing the fixtures, the excerpt is decoded and the p48 scores are
recomputed from it, which must reproduce results/apc/data/p48.parquet.

Usage: python -m overton.excerpt [models | summaries | position]   (only that fixture)
"""

import gzip
import hashlib
import json
import re
import subprocess
from pathlib import Path

import numpy as np
import pandas as pd

from overton import paths
from overton.apc import (COHORT_SETTINGS, DATA_DIR as APC_DATA, ECON_A, ECON_B, ECON_C, MIN_ANSWERED,
                         MIN_ANSWERED_BY_SET, NOT_SOCIAL, PERIOD_SETTINGS, RESULTS_DIR as APC_RESULTS,
                         build_period_cohort_model, build_series_model, calibrate, question_sets, weighted_cells)
from overton import out_of_scope, question_categories
from overton.data import CANDIDATES_INTERVIEWER, CONSERVATIVE_VALUES, EXTRACT, WEIGHT_COL
from overton.drift import estimate_with_difficulties
from overton.larger_sets import CONFIDENCE, MIN_WAVES
from overton.pipeline import IN_PERSON_ONLY, ORDER, make_questions
from overton.question_categories import CATEGORIES, CATEGORY_OF
from overton.topics import topic

VERSION = "v1"
SITE = paths.ROOT / "overtron"
OUT = SITE / "public" / "data" / VERSION
FIXTURES = SITE / "fixtures"
FIXTURE_SETS = ["p48", "econA"]
SAMPLE_EVERY = 50  # respondents kept in the score fixtures


def candidates():
    """The 170 candidates with their ranking, coding, stability, and scope metadata."""
    ranking = pd.read_csv(paths.FIG_DIR / "candidates_ranking.csv", index_col=0)
    scope = pd.read_csv(paths.FIG_DIR / "candidates_scope.csv", index_col=0)
    stability = pd.read_csv(paths.FIG_DIR / "candidates_stability.csv", index_col=0)
    return ranking, scope.loc[ranking.index], stability.reindex(ranking.index)


def value_labels(text):
    """'[1] always wrong / [2] ... / [NA(d)] don't know / ...' -> {"1": "always wrong", ...}, valid codes only."""
    pairs = re.findall(r"\[(\d+)\] (.*?)(?= / \[|$)", text)
    return {code: label for code, label in pairs}


def domain(v):
    if v in ECON_A:
        return "econA"
    if v in ECON_B:
        return "econB"
    if v in ECON_C:
        return "econC"
    return "neither" if v in NOT_SOCIAL else "social"


def respondents(names):
    """The interviewer sample of the candidate extract, with its analysis weight, and attend
    (an out-of-scope question readers can add back) from the full extract."""
    df = pd.read_hdf(CANDIDATES_INTERVIEWER, "gss").rename(columns={WEIGHT_COL: "weight"})
    if "attend" in names:
        attend = pd.read_hdf(EXTRACT, "gss")[["year", "id", "attend"]]
        df = df.merge(attend, on=["year", "id"], how="left", validate="one_to_one")
    return df[["year", "id", "age", "cohort", "polviews", "mode", "weight"] + names].reset_index(drop=True)


def columns_spec(names):
    spec = [("year", "int16"), ("id", "int16"), ("age", "int8"), ("cohort", "int16"), ("polviews", "int8"),
            ("mode", "int8"), ("weight", "float32")]
    return spec + [(v, "int8") for v in names]


def encode(df, spec):
    """Concatenated little-endian columns; returns the bytes and the column table."""
    parts, table, offset = [], [], 0
    for name, dtype in spec:
        x = df[name]
        if dtype.startswith("float"):
            a = x.to_numpy(dtype="<f4")
        else:
            a = x.fillna(-1).to_numpy().astype(np.dtype(dtype).newbyteorder("<"))
            assert (a == x.fillna(-1).to_numpy()).all(), name  # no overflow or rounding
        b = a.tobytes()
        table.append(dict(name=name, dtype=dtype, offset=offset, length=len(a)))
        parts.append(b)
        offset += len(b)
        pad = -offset % 4  # 4-byte alignment, so the page can view float32 columns in place
        parts.append(b"\0" * pad)
        offset += pad
    return b"".join(parts), table


def decode(raw, table):
    out = {}
    for col in table:
        dtype = np.dtype(col["dtype"]).newbyteorder("<")
        a = np.frombuffer(raw, dtype=dtype, count=col["length"], offset=col["offset"])
        out[col["name"]] = np.where(a == -1, np.nan, a.astype(float)) if dtype.kind == "i" else a.astype(float)
    return pd.DataFrame(out)


def question_table(names, added):
    """The candidates and the out-of-scope questions readers can add back (overton/out_of_scope.py)."""
    ranking, scope, stability = candidates()
    sets = question_sets()
    pool = set(sets["p48"])
    unstable = stability["sign_change"].fillna(False) | stability["fades_any"].fillna(False)
    out = {}
    for v in names:
        reasons = []
        if re.match(CONFIDENCE, v):
            reasons.append("confidence")
        if unstable[v]:
            reasons.append("unstable")
        if ranking.loc[v, "waves"] < MIN_WAVES:
            reasons.append("coverage")
        if v.startswith("nat") and v.endswith("y"):
            reasons.append("wording")
        if v not in pool and not reasons:
            reasons.append("topic")  # another question of the same topic ranks higher
        labels = value_labels(scope.loc[v, "value_labels"])
        out[v] = dict(
            description=ranking.loc[v, "description"], question=scope.loc[v, "question"], value_labels=labels,
            conservative=[int(float(c)) for c in str(ranking.loc[v, "conservative"]).split()],
            rank=int(ranking.loc[v, "rank"]), separation=float(ranking.loc[v, "separation"]),
            polviews_param=float(ranking.loc[v, "param"]), waves=int(ranking.loc[v, "waves"]),
            first=int(ranking.loc[v, "first"]), last=int(ranking.loc[v, "last"]),
            topic=topic(v), domain=domain(v), in_p48=v in pool, excluded_because=reasons,
            in_person_only_since_2022=v in IN_PERSON_ONLY, in_book_15=v in ORDER,
            gap_by_decade=stability.loc[v, "gaps"] if pd.notna(stability.loc[v, "gaps"]) else None)
    for v, row in added.iterrows():
        reasons = [row["scope_reason"]] + (["coverage"] if row["waves"] < MIN_WAVES else [])
        out[v] = dict(
            description=row["description"], question=row["question"], value_labels=value_labels(row["value_labels"]),
            conservative=row["conservative"], rank=None, separation=row["separation"],
            polviews_param=row["polviews_param"], waves=int(row["waves"]), first=int(row["first"]), last=int(row["last"]),
            topic=v, domain="social", in_p48=False, excluded_because=reasons,
            in_person_only_since_2022=None, in_book_15=False, gap_by_decade=None)
    for v in out:
        out[v]["category"] = CATEGORY_OF[v]
    presets = {name: list(sets[name]) for name in ["p48", "social", "econA"]}
    presets["book15"] = list(ORDER)
    book_codes = {v: [int(c) for c in CONSERVATIVE_VALUES[v]] for v in ORDER}
    return out, presets, book_codes, list(CATEGORIES)


def preset_settings(df, questions, presets, book_codes):
    """Each preset's codes, minimum answers, and difficulties calibrated on the preset itself
    (decision 4), so the page needn't run EM for a preset. For p48 this is the decided calibration."""
    out = {}
    for name, names in presets.items():
        codes = {v: book_codes[v] if name == "book15" else questions[v]["conservative"] for v in names}
        min_answered = MIN_ANSWERED_BY_SET.get(name, MIN_ANSWERED)
        d = calibrate(df, make_questions(df, codes), min_answered)
        out[name] = dict(codes=codes, min_answered=min_answered, difficulties=d[list(codes)].to_dict())
    return out


def check_scores(gss):
    """Recompute the decided p48 scores from the decoded excerpt; they must match the parquet."""
    codes = question_sets()["p48"]
    d = pd.read_csv(APC_DATA / "difficulties.csv", index_col=0)["p48"].dropna()
    questions = make_questions(gss, codes)
    con = estimate_with_difficulties(questions, d[questions.columns].values)
    keep = (questions.notna().sum(axis=1) >= MIN_ANSWERED) & gss["cohort"].notna() & gss["age"].notna()
    mine = pd.DataFrame(dict(year=gss["year"], id=gss["id"], y=con / len(codes)))[keep]
    ref = pd.read_parquet(APC_DATA / "p48.parquet")[["year", "id", "y"]]
    both = ref.merge(mine, on=["year", "id"], suffixes=("_ref", "_excerpt"), validate="one_to_one")
    assert len(both) == len(ref) == len(mine), (len(both), len(ref), len(mine))
    diff = float((both["y_ref"] - both["y_excerpt"]).abs().max())
    assert diff < 1e-12, diff
    return len(both), diff


def fixture(gss, name):
    """The Python pipeline's intermediate results for one set."""
    codes = question_sets()[name]
    min_answered = MIN_ANSWERED_BY_SET.get(name, MIN_ANSWERED)
    questions = make_questions(gss, codes)
    reference = pd.read_csv(APC_DATA / "difficulties.csv", index_col=0)[name].dropna()[questions.columns]
    own = calibrate(gss, questions, min_answered)[questions.columns]
    con = estimate_with_difficulties(questions, reference.values)
    answered = questions.notna().sum(axis=1)
    keep = (answered >= min_answered) & gss["cohort"].notna() & gss["age"].notna()
    scored = gss.loc[keep, ["year", "id", "age", "cohort", "polviews", "weight"]].assign(
        conservatism=con[keep], answered=answered[keep], y=con[keep] / len(codes))
    sample = scored.iloc[::SAMPLE_EVERY]
    yearly = scored.groupby("year").apply(lambda g: np.average(g["y"], weights=g["weight"]))
    cells = weighted_cells(scored.assign(cohort=scored["cohort"].astype(int)), ["cohort", "year"])
    summary = json.loads((APC_RESULTS / f"period_cohort_{name}_summary.json").read_text())
    return dict(
        set=name, codes={v: [int(c) for c in cs] for v, cs in codes.items()}, min_answered=min_answered,
        difficulties_reference=reference.to_dict(), difficulties_own=own.to_dict(),
        respondents=int(keep.sum()), sample_every=SAMPLE_EVERY,
        sample=sample[["year", "id", "answered", "conservatism", "y"]].to_dict(orient="list"),
        yearly_mean_y=yearly.to_dict(),
        cells=cells[["cohort", "year", "p_weighted", "var_weighted", "n", "n_eff"]].to_dict(orient="list"),
        period_cohort_summary={k: summary[k] for k in [
            "period_slope_per_decade", "period_slope_lo90", "period_slope_hi90", "total_change",
            "generational_replacement", "changing_minds"]},
    )


def model_points(m, n_points=3, seed=17):
    """PyMC's log density (with Jacobians) at random points in the model's free variables."""
    logp = m.compile_logp()
    rng = np.random.default_rng(seed)
    init = m.initial_point()
    points = []
    for _ in range(n_points):
        point = {v.name: rng.normal(0, 0.5, size=init[v.name].shape) for v in m.value_vars}
        points.append(dict(values=[point[v.name].ravel().tolist() for v in m.value_vars], logp=float(logp(point))))
    return dict(value_vars=[v.name for v in m.value_vars], points=points)


def models_fixture():
    """Inputs and log densities of the period, age and period-cohort models for p48.

    The points are in the current (double-cumsum) form's coordinates; the TypeScript
    test maps them into its own eigenbasis (w = Q z, beta = v0 + sigma a'w), which
    checks the basis and the model together. The trend form has the same log density
    (overton/rw2_trend.py).
    """
    df = pd.read_parquet(APC_DATA / "p48.parquet")
    out = {}
    years = list(range(df["year"].min(), df["year"].max() + 1))
    cells = weighted_cells(df, ["year"])
    m = build_series_model(cells, "year", years, dict(PERIOD_SETTINGS, rw2_form="cumsum"))
    out["period"] = dict(grid=years, index=cells["year"].astype(int).tolist(), **model_points(m),
                         **cells[["p_weighted", "var_weighted", "n_eff"]].to_dict(orient="list"))
    window = df[df["year"].between(2020, 2024)].assign(age=lambda d: d["age"].astype(int))
    ages = list(range(window["age"].min(), window["age"].max() + 1))
    cells = weighted_cells(window, ["age"])
    m = build_series_model(cells, "age", ages, dict(PERIOD_SETTINGS, rw2_form="cumsum"))
    out["age_2020-2024"] = dict(grid=ages, index=cells["age"].astype(int).tolist(), **model_points(m),
                                **cells[["p_weighted", "var_weighted", "n_eff"]].to_dict(orient="list"))
    cohorts = list(range(int(df["cohort"].min()), int(df["cohort"].max()) + 1))
    cells = weighted_cells(df.assign(cohort=df["cohort"].astype(int)), ["cohort", "year"])
    m = build_period_cohort_model(cells, years, cohorts, dict(COHORT_SETTINGS, rw2_form="cumsum"))
    out["period_cohort"] = dict(years=years, cohorts=cohorts, cell_year=cells["year"].astype(int).tolist(),
                                cell_cohort=cells["cohort"].astype(int).tolist(), **model_points(m),
                                **cells[["p_weighted", "n_eff"]].to_dict(orient="list"))
    out["settings"] = dict(period=PERIOD_SETTINGS, period_cohort=COHORT_SETTINGS)
    return out


SUMMARY_DRAWS = 100  # posterior draws kept in the summaries fixture, rounded to 6 decimals


def summaries_fixture():
    """Saved draws, thinned, and the Python summaries computed from exactly those draws.

    fit_series and fit_period_cohort run with the sampler replaced by the thinned
    draws of the saved p48 fits (liberals' period model, the 2020-2024 age window,
    and the period-cohort model), so the TypeScript summaries can be compared exactly.
    """
    import tempfile
    from types import SimpleNamespace

    import xarray as xr

    from overton import apc

    df = pd.read_parquet(APC_DATA / "p48.parquet")
    args = SimpleNamespace(tune=0, draws=0, chains=1, seed=17, target_accept=None)
    out = dict(draws=SUMMARY_DRAWS)
    real_sample = apc.sample
    try:
        with tempfile.TemporaryDirectory() as tmp:
            for key, run, names in [("period_liberal", "period_p48_polviews3-Liberal", ["mu"]),
                                    ("age_2020-2024", "age_p48_window-2020-2024", ["mu"]),
                                    ("period_cohort", "period_cohort_p48", ["alpha", "cohort", "period"])]:
                tree = xr.open_datatree(APC_RESULTS / f"{run}_trace.nc", engine="h5netcdf")
                post = tree["posterior"].to_dataset()
                n = post.sizes["chain"] * post.sizes["draw"]
                keep = np.linspace(0, n - 1, SUMMARY_DRAWS).round().astype(int)
                draws = {v: post[v].values.reshape(n, *post[v].shape[2:])[keep].astype(float).round(6) for v in names}
                apc.sample = lambda *a, **k: {"posterior": {v: SimpleNamespace(values=x[None]) for v, x in draws.items()}}
                stem = Path(tmp) / key
                if key == "period_liberal":
                    sub = df[df["polviews3"] == "Liberal"]
                    grid = list(range(sub["year"].min(), sub["year"].max() + 1))
                    _, summary, _ = apc.fit_series(sub, "year", grid, apc.SCALE, stem, args)
                    table = pd.read_csv(f"{stem}_series.csv")
                elif key == "age_2020-2024":
                    sub = df[df["year"].between(2020, 2024)].assign(age=lambda d: d["age"].astype(int))
                    grid = list(range(sub["age"].min(), sub["age"].max() + 1))
                    _, summary, _ = apc.fit_series(sub, "age", grid, apc.SCALE, stem, args)
                    table = pd.read_csv(f"{stem}_series.csv")
                else:
                    _, summary, _ = apc.fit_period_cohort(df, apc.SCALE, stem, args)
                    table = pd.read_csv(f"{stem}_components.csv")
                    out["trajectories"] = pd.read_csv(f"{stem}_trajectories.csv").to_dict(orient="list")
                out[key] = dict(run=run, draws={v: x.tolist() for v, x in draws.items()}, summary=summary,
                                table=table.astype(object).where(table.notna(), None).to_dict(orient="list"))
    finally:
        apc.sample = real_sample
    return out


def position_fixture():
    """Relative position for p48 (overton/position.py): the latent normals by year and by
    year x polviews3, and the by-year table with the 1974 liberal's percentile."""
    from overton import position

    df, questions, d = position.load("p48")
    year = position.distributions(df, questions, d, ["year"])
    in_groups = df["polviews3"].isin(position.GROUPS)
    groups = position.distributions(df[in_groups], questions[in_groups], d, ["year", "polviews3"])
    table, ref, ref_observed = position.by_year(df, questions, d, 1974)
    return dict(ref_year=1974, ref=float(ref), ref_observed=float(ref_observed), grid=position.XS.tolist(),
                difficulties=d.to_dict(),
                year=year.reset_index(names="label").to_dict(orient="list"),
                groups=groups.reset_index(names="label").to_dict(orient="list"),
                table=table.astype(object).where(table.notna(), None).to_dict(orient="list"),
                headline=pd.read_csv(position.FIG_DIR / "position_headline.csv").set_index("set").loc["p48"].to_dict(),
                n_bootstrap=position.N_BOOTSTRAP, last_year=position.LAST_YEAR)


def main():
    import sys

    if sys.argv[1:] == ["position"]:
        (FIXTURES / "position.json").write_text(json.dumps(position_fixture()))
        print(FIXTURES / "position.json")
        return

    if sys.argv[1:] == ["summaries"]:
        (FIXTURES / "summaries.json").write_text(json.dumps(summaries_fixture()))
        print(FIXTURES / "summaries.json")
        return

    if sys.argv[1:] == ["models"]:
        (FIXTURES / "models.json").write_text(json.dumps(models_fixture()))
        print(FIXTURES / "models.json")
        return
    ranking, _, _ = candidates()
    added = out_of_scope.code_all(out_of_scope.load())
    names = list(ranking.index) + list(added.index)
    df = respondents(names)
    spec = columns_spec(names)
    raw, table = encode(df, spec)
    n_checked, diff = check_scores(decode(raw, table))
    print(f"excerpt reproduces the p48 scores of {n_checked} respondents (max diff {diff:.1e})")

    OUT.mkdir(parents=True, exist_ok=True)
    gz = gzip.compress(raw, compresslevel=9, mtime=0)
    (OUT / "respondents.bin.gz").write_bytes(gz)
    questions, presets, book_codes, categories = question_table(list(ranking.index), added)
    question_categories.check(questions)
    preset_info = preset_settings(df, questions, presets, book_codes)
    reference = pd.read_csv(APC_DATA / "difficulties.csv", index_col=0)["p48"].dropna()
    p48_diff = max(abs(preset_info["p48"]["difficulties"][v] - reference[v]) for v in presets["p48"])
    assert p48_diff < 1e-9, p48_diff  # p48 calibrated on itself is the decided calibration
    (OUT / "questions.json").write_text(json.dumps(dict(questions=questions, presets=presets, book_codes=book_codes,
                                                         categories=categories, preset_settings=preset_info)))
    commit = subprocess.run(["git", "rev-parse", "--short", "HEAD"], capture_output=True, text=True, cwd=paths.ROOT).stdout.strip()
    manifest = dict(
        version=VERSION, rows=len(df), source="GSS 1972-2024 cumulative file, release 3a (NORC), via the CultureWar extract",
        citation="Davern, Michael; Bautista, Rene; Freese, Jeremy; Herd, Pamela; and Morgan, Stephen L.; General Social "
                 "Survey 1972-2024. NORC at the University of Chicago. gss.norc.org",
        primary_sample="2021 dropped; in 2022 and 2024, interviewer-administered respondents only (in person, phone), "
                       "with wtssps raked to the full sample's margins (docs/mode_design.md)",
        weight="wtssps, raked to the full sample's margins in 2022 and 2024",
        missing="-1 in integer columns, NaN in weights", byte_order="little", commit=commit,
        columns=table, bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest(),
        gz_bytes=len(gz), gz_sha256=hashlib.sha256(gz).hexdigest())
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1))
    print(f"{OUT}: {len(df)} rows, {len(names)} questions, {len(raw) / 1e6:.1f} MB raw, {len(gz) / 1e6:.2f} MB gzipped")

    FIXTURES.mkdir(parents=True, exist_ok=True)
    for name in FIXTURE_SETS:
        fx = fixture(df, name)
        (FIXTURES / f"{name}.json").write_text(json.dumps(fx))
        own_vs_ref = max(abs(fx["difficulties_own"][v] - fx["difficulties_reference"][v]) for v in fx["codes"])
        print(f"fixture {name}: {fx['respondents']} respondents, {len(fx['cells']['n'])} cells, "
              f"own vs reference calibration max diff {own_vs_ref:.3f}")
    (FIXTURES / "models.json").write_text(json.dumps(models_fixture()))
    (FIXTURES / "summaries.json").write_text(json.dumps(summaries_fixture()))
    (FIXTURES / "position.json").write_text(json.dumps(position_fixture()))


if __name__ == "__main__":
    main()
