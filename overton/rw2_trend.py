"""Check that the trend form of the RW2 (apc.rw2, form="trend") is the same model.

Maps random points from the current coordinates (innovations z, initial slope v0)
to the trend coordinates (w = pinv(M) P L z, a rotation; beta = v0 + sigma a'w)
and compares the log densities, for the p48 period-cohort and period models.

    python -m overton.rw2_trend
"""

import numpy as np
import pandas as pd

from overton import apc


def to_trend(point, walks):
    """A point of the current form, in the trend form's coordinates."""
    out = dict(point)
    for name, n, sigma_name in walks:
        M_perp, r, a = apc.rw2_trend_basis(n)
        M = M_perp + np.outer(r, a)
        L = np.zeros((n, n - 2))
        for k in range(2, n):
            L[k, : k - 1] = np.arange(k - 1, 0, -1)
        P = np.eye(n) - 1 / n
        w = np.linalg.pinv(M) @ P @ L @ out.pop(f"{name}_z_delta")
        sigma = np.exp(point[f"{sigma_name}_log__"])
        out[f"{name}_w"] = w
        out[f"{name}_trend"] = out.pop(f"{name}_slope_init") + sigma * a @ w
    return out


def check(label, build, walks, settings):
    current = build(dict(settings, rw2_form="cumsum"))
    trend = build(dict(settings, rw2_form="trend"))
    logp_current, logp_trend = current.compile_logp(), trend.compile_logp()
    rng = np.random.default_rng(17)
    for _ in range(3):
        point = {k: rng.normal(0, 0.5, size=np.shape(v)) for k, v in current.initial_point().items()}
        a, b = float(logp_current(point)), float(logp_trend(to_trend(point, walks)))
        print(f"{label}: current {a:.6f}, trend {b:.6f}, difference {a - b:.2e}")


def main():
    df = pd.read_parquet(apc.DATA_DIR / "p48.parquet")
    years = list(range(df["year"].min(), df["year"].max() + 1))
    cohorts = list(range(int(df["cohort"].min()), int(df["cohort"].max()) + 1))
    cells = apc.weighted_cells(df.assign(cohort=df["cohort"].astype(int)), ["cohort", "year"])
    check("period-cohort", lambda s: apc.build_period_cohort_model(cells, years, cohorts, s),
          [("cohort", len(cohorts), "sigma_c"), ("period", len(years), "sigma_t")], apc.COHORT_SETTINGS)
    cells = apc.weighted_cells(df, ["year"])
    check("period", lambda s: apc.build_series_model(cells, "year", years, s),
          [("trend", len(years), "sigma_t")], apc.PERIOD_SETTINGS)


if __name__ == "__main__":
    main()
