"""Compare the TyMC spike's period-cohort fit with the saved nutpie fit (p48).

Runs overton.apc.fit_period_cohort with its sampler replaced by the TyMC draws
(overtron/spike/results/*.f64), so both fits are summarized by the same code, then
compares the summaries and the components with results/apc/results/period_cohort_p48_*.

    PYTHONPATH=. python overtron/spike/compare.py [label]

label: a folder in overtron/spike/results (default: the most recent run).
"""

import json
import sys
from pathlib import Path
from types import SimpleNamespace

import numpy as np
import pandas as pd

from overton import apc

RESULTS = Path(__file__).parent / "results"
SAVED = apc.RESULTS_DIR / "period_cohort_p48"


class Posterior(dict):
    def __getitem__(self, name):
        return SimpleNamespace(values=dict.__getitem__(self, name))


def tymc_trace(meta):
    chains, draws = meta["chains"], meta["draws"]
    posterior = Posterior()
    for name, shape in meta["variables"].items():
        values = np.fromfile(SPIKE / f"{name}.f64", dtype=np.float64)
        posterior[name] = values.reshape(chains, draws, *shape)
    return {"posterior": posterior}


def main():
    global SPIKE
    runs = sorted((p for p in RESULTS.iterdir() if (p / "meta.json").exists()), key=lambda p: p.stat().st_mtime)
    SPIKE = RESULTS / sys.argv[1] if len(sys.argv) > 1 else runs[-1]
    meta = json.loads((SPIKE / "meta.json").read_text())
    apc.sample = lambda *args, **kwargs: tymc_trace(meta)
    df = pd.read_parquet(apc.DATA_DIR / "p48.parquet")
    _, summary, _ = apc.fit_period_cohort(df, apc.SCALE, SPIKE / "tymc", SimpleNamespace(
        tune=meta["tune"], draws=meta["draws"], chains=meta["chains"], seed=17, target_accept=None))
    saved = json.loads(Path(f"{SAVED}_summary.json").read_text())

    keys = ["period_slope_per_decade", "period_slope_lo90", "period_slope_hi90", "total_change",
            "generational_replacement", "changing_minds"]
    table = pd.DataFrame({"nutpie": [saved[k] for k in keys], "tymc": [summary[k] for k in keys]}, index=keys)
    table["diff"] = table["tymc"] - table["nutpie"]
    print(table.round(3).to_string())

    a = pd.read_csv(f"{SAVED}_components.csv")
    b = pd.read_csv(SPIKE / "tymc_components.csv")
    diff = (a[["mean", "lo84", "hi84"]] - b[["mean", "lo84", "hi84"]]).abs()
    print("components, max abs diff (points):", diff.max().round(3).to_dict())

    rows = json.loads((SPIKE / "summary.json").read_text())
    params = [r for r in rows if r["name"] in ("alpha", "sigma_c", "sigma_t", "sigma_short", "cohort", "period", "sigma_resid")]  # apc's diagnostics names
    steps = np.mean([c["n_steps"] for c in meta.get("chain_stats", [])]) if "chain_stats" in meta else float("nan")
    print(f"tymc {SPIKE.name}: {meta['seconds']:.0f} s, mean leapfrog steps {steps:.0f}, divergences {meta['divergences']}, "
          f"rhat max {max(r['r_hat'] for r in params):.4f}, ess_bulk min {min(r['ess_bulk'] for r in params):.0f}")
    print(f"nutpie (Unity, {saved['tune']}+{saved['draws']} at {saved['target_accept']}): {saved['elapsed_seconds']} s, "
          f"divergences {saved['divergences']}, rhat max {saved['rhat_max']:.4f}, ess_bulk min {saved['ess_bulk_min']:.0f}")


if __name__ == "__main__":
    main()
