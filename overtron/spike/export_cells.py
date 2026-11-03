"""Export the p48 period-cohort inputs for the TyMC spike (docs/overtron_plan.md, milestone 1).

Writes overtron/spike/cells_p48.json: the cohort x year cells (as overton.apc
builds them), the grids, and PyMC's log density (with Jacobians) at a few random
points in transformed space, in the model's order of free variables, so the
TyMC port can be checked point for point before sampling.

Also the eigenbasis of the mean-centered RW2 prior for the cohort and period walks
(spike/geometry.py, rw2_basis), and the same points in those coordinates, for the
spectral version of the model (build_model_spectral in spike/model.ts).

    python overtron/spike/export_cells.py
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd

from overton.apc import DATA_DIR, build_period_cohort_model, weighted_cells

OUT = Path(__file__).parent / "cells_p48.json"


def main():
    df = pd.read_parquet(DATA_DIR / "p48.parquet")
    years = list(range(df["year"].min(), df["year"].max() + 1))
    cohorts = list(range(int(df["cohort"].min()), int(df["cohort"].max()) + 1))
    df = df.assign(cohort=df["cohort"].astype(int))
    cells = weighted_cells(df, ["cohort", "year"])
    m = build_period_cohort_model(cells, years, cohorts)

    logp = m.compile_logp()
    rng = np.random.default_rng(17)
    points = []
    for _ in range(3):
        point = {v.name: rng.normal(0, 0.5, size=m.initial_point()[v.name].shape) for v in m.value_vars}
        points.append(dict(values=[point[v.name].ravel().tolist() for v in m.value_vars], logp=float(logp(point))))

    # the spectral coordinates: w = pinv(M) @ P @ L @ z, a rotation of z, so the log density is the same
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    from geometry import rw2_basis

    basis = {}
    for name, n in [("cohort", len(cohorts)), ("period", len(years))]:
        U, lam, r = rw2_basis(n)
        M = U * np.sqrt(lam)
        L = np.zeros((n, n - 2))
        for k in range(2, n):
            L[k, : k - 1] = np.arange(k - 1, 0, -1)
        P = np.eye(n) - 1 / n
        basis[name] = dict(M=M, r=r, to_w=np.linalg.pinv(M) @ P @ L)
    names = [v.name for v in m.value_vars]
    for point in points:
        values = [np.array(v) for v in point["values"]]
        for name in ["cohort", "period"]:
            k = names.index(f"{name}_z_delta")
            values[k] = basis[name]["to_w"] @ values[k]
        point["spectral_values"] = [v.tolist() for v in values]

    out = dict(
        years=years,
        cohorts=cohorts,
        cell_year=cells["year"].astype(int).tolist(),
        cell_cohort=cells["cohort"].astype(int).tolist(),
        p_weighted=cells["p_weighted"].tolist(),
        n_eff=cells["n_eff"].tolist(),
        value_vars=[v.name for v in m.value_vars],
        points=points,
        basis={name: dict(M=b["M"].ravel().tolist(), shape=list(b["M"].shape), r=b["r"].tolist()) for name, b in basis.items()},
    )
    OUT.write_text(json.dumps(out))
    print(OUT, len(cells), "cells", len(years), "years", len(cohorts), "cohorts", [p["logp"] for p in points])


if __name__ == "__main__":
    main()
