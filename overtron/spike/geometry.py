"""Screen parameterizations of the period-cohort model by posterior geometry (saved nutpie trace).

NUTS with a diagonal mass matrix needs long trajectories when the posterior,
rescaled coordinate by coordinate, is badly conditioned. This rebuilds the
sampler's coordinates from the saved draws of the decided p48 fit and reports
the condition number of their correlation matrix, and the largest correlations,
for the current (non-centered) parameterization and for a centered one (the
levels of the random walks sampled directly; same model, same posterior).

    PYTHONPATH=. python overtron/spike/geometry.py
"""

import numpy as np
import xarray as xr

from overton import apc


def draws(post, name):
    v = post[name].values
    return v.reshape(-1, *v.shape[2:]).astype(float)


def zerosum_free(x):
    """PyMC's zero-sum transform (one axis): n values summing to zero -> n - 1 free values."""
    n = x.shape[-1]
    return x[..., :-1] - x[..., -1:] * np.sqrt(n) / (np.sqrt(n) + n)  # pymc extend_axis_rev


def report(label, blocks):
    names = [n for n, b in blocks for _ in range(b.shape[1])]
    X = np.concatenate([b for _, b in blocks], axis=1)
    X = X[:, X.std(axis=0) > 0]
    R = np.corrcoef(X, rowvar=False)
    w = np.linalg.eigvalsh(R)
    print(f"{label}: {X.shape[1]} coordinates, condition number {w[-1] / w[0]:.0f} "
          f"(sqrt {np.sqrt(w[-1] / w[0]):.0f}), eigenvalues {w[0]:.2e} .. {w[-1]:.1f}")
    v = np.linalg.eigh(R)[1][:, 0]
    top = np.argsort(-np.abs(v))[:5]
    print("    smallest direction:", ", ".join(f"{names[k]} {v[k]:+.2f}" for k in top))
    np.fill_diagonal(R, 0)
    i, j = np.unravel_index(np.argsort(-np.abs(R), axis=None)[:6:2], R.shape)
    for a, b in zip(i, j):
        print(f"    {names[a]} ~ {names[b]}: {R[a, b]:+.3f}")


def main():
    tree = xr.open_datatree(apc.RESULTS_DIR / "period_cohort_p48_trace.nc", engine="h5netcdf")
    post = tree["posterior"].to_dataset()
    alpha = draws(post, "alpha")[:, None]
    sig = {k: draws(post, k)[:, None] for k in ["sigma_c", "sigma_t", "sigma_short"]}
    cohort, period = draws(post, "cohort"), draws(post, "period")
    epsilon, sigma_resid = draws(post, "epsilon"), draws(post, "sigma_resid")
    global apc_cohort0
    apc_cohort0 = int(post["cohort_grid"].values[0])

    # non-centered: the coordinates nutpie sampled
    def innovations(f, s):
        return np.diff(f, 2, axis=1) / s, (f[:, 1] - f[:, 0])[:, None]

    zc, vc = innovations(cohort, sig["sigma_c"])
    zt, vt = innovations(period, sig["sigma_t"])
    common = [("alpha", alpha), ("log_sigma_c", np.log(sig["sigma_c"])), ("log_sigma_t", np.log(sig["sigma_t"])),
              ("log_sigma_short", np.log(sig["sigma_short"])), ("log_sigma_resid", np.log(sigma_resid))]
    report("non-centered (current)", common + [
        ("cohort_z", zc), ("cohort_v0", vc), ("period_z", zt), ("period_v0", vt),
        ("epsilon_z", zerosum_free(epsilon / sig["sigma_short"]))])

    # non-centered, with the free slope anchored at index k instead of the first: the slope
    # f[k+1] - f[k] replaces v0 (a linear change of variables, so the same model)
    for kc, kt in [(40, 10), (60, 20), (70, 26), (80, 35)]:
        report(f"non-centered, slope anchored at cohort {apc_cohort0 + kc}, year {1972 + kt}", common + [
            ("cohort_z", zc), ("cohort_vk", (cohort[:, kc + 1] - cohort[:, kc])[:, None]),
            ("period_z", zt), ("period_vk", (period[:, kt + 1] - period[:, kt])[:, None]),
            ("epsilon_z", zerosum_free(epsilon / sig["sigma_short"]))])

    # centered: the levels themselves (f_raw[1:], with f_raw[0] = 0), and epsilon itself
    def levels(f):
        return (f - f[:, :1])[:, 1:]

    report("centered levels", common + [
        ("cohort_f", levels(cohort)), ("period_f", levels(period)), ("epsilon", zerosum_free(epsilon))])
    # centered, with the mean-centered levels themselves (zero-sum, as the model's cohort and period are)
    report("centered, mean-centered levels", common + [
        ("cohort_f", zerosum_free(cohort)), ("period_f", zerosum_free(period)), ("epsilon", zerosum_free(epsilon))])
    report("centered cohort (mean-centered), non-centered period", common + [
        ("cohort_f", zerosum_free(cohort)), ("period_z", zt), ("period_v0", vt),
        ("epsilon_z", zerosum_free(epsilon / sig["sigma_short"]))])


if __name__ == "__main__":
    main()


def rw2_basis(n):
    """Eigenbasis of the mean-centered RW2 prior: f = sigma * U @ (sqrt(lam) * w) + v0 * r, w ~ N(0, I).

    L is the double-cumsum map from the n - 2 innovations to f_raw (f_raw[0] = 0, first
    slope 0), P removes the mean, and r is the mean-centered ramp the free slope v0 scales.
    sigma * P @ L @ z and sigma * U @ (sqrt(lam) * w) have the same distribution, so the
    model is unchanged; only the coordinates differ.
    """
    L = np.zeros((n, n - 2))
    for k in range(2, n):
        L[k, : k - 1] = np.arange(k - 1, 0, -1)
    P = np.eye(n) - 1 / n
    lam, U = np.linalg.eigh(P @ L @ L.T @ P)
    keep = lam > 1e-9 * lam.max()
    lam, U = lam[keep][::-1], U[:, keep][:, ::-1]  # largest prior variance (smoothest) first
    r = P @ np.arange(n, dtype=float)
    return U, lam, r


def spectral(f, sigma, n_centered=0):
    """Coordinates of f in the RW2 eigenbasis: the slope v0, then w (non-centered) or, for the
    n_centered smoothest components, the coefficient sigma * sqrt(lam) * w itself (centered)."""
    n = f.shape[1]
    U, lam, r = rw2_basis(n)
    v0 = f[:, 1] - f[:, 0]
    coef = (f - v0[:, None] * r) @ U  # = sigma * sqrt(lam) * w
    w = coef / (sigma * np.sqrt(lam))
    w[:, :n_centered] = coef[:, :n_centered]
    return v0[:, None], w


def screen_spectral():
    tree = xr.open_datatree(apc.RESULTS_DIR / "period_cohort_p48_trace.nc", engine="h5netcdf")
    post = tree["posterior"].to_dataset()
    sig = {k: draws(post, k)[:, None] for k in ["sigma_c", "sigma_t", "sigma_short"]}
    cohort, period = draws(post, "cohort"), draws(post, "period")
    epsilon, sigma_resid = draws(post, "epsilon"), draws(post, "sigma_resid")
    common = [("alpha", draws(post, "alpha")[:, None]), ("log_sigma_c", np.log(sig["sigma_c"])),
              ("log_sigma_t", np.log(sig["sigma_t"])), ("log_sigma_short", np.log(sig["sigma_short"])),
              ("log_sigma_resid", np.log(sigma_resid)), ("epsilon_z", zerosum_free(epsilon / sig["sigma_short"]))]
    for kc, kt in [(0, 0), (5, 3), (10, 5), (20, 8)]:
        vc, wc = spectral(cohort, sig["sigma_c"], kc)
        vt, wt = spectral(period, sig["sigma_t"], kt)
        report(f"spectral, {kc} cohort and {kt} period components centered", common + [
            ("cohort_v0", vc), ("cohort_w", wc), ("period_v0", vt), ("period_w", wt)])


if __name__ == "__main__" and "--spectral" in __import__("sys").argv:
    screen_spectral()
