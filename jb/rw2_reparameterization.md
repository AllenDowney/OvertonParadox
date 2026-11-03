---
title: Reparameterizing the RW2 Prior
subtitle: A technical memo on a faster parameterization of the same model
date: 2026-11-03
---

# Reparameterizing the RW2 prior

The period–cohort model in this project fits two second-order random walks (RW2): one over birth years and one over survey years. Fitted with NUTS in its usual form, almost every draw needs about 1,000 leapfrog steps. This memo describes a change of variables that leaves the model unchanged but cuts the time per fit by 6–20×:

1. write the RW2 prior in the eigenbasis of its covariance matrix;
2. split the walk's linear trend out as a separate coordinate.

The prior, the likelihood, and the posterior over everything the model reports stay the same. Only the coordinates the sampler moves in change.

The code is `rw2(..., form="trend")` in `overton/apc.py`. The check that both forms are the same model is `overton/rw2_trend.py`, and the experiments are in `docs/lab.md`.

## The model

The model is CultureWar's model10 as ported to `overton/apc.py`. Each cohort × year cell has a weighted mean score $\bar y_{ct}$, observed with standard error $\sigma^{\text{resid}}_t / \sqrt{n^{\text{eff}}_{ct}}$, around

$$
\operatorname{logit}^{-1}\left(\alpha + f^{\text{cohort}}_c + f^{\text{period}}_t + \epsilon_t\right),
$$

where $\epsilon$ is zero-sum year noise. With the `p48` question set, there are 2,442 cells, 124 birth years, 53 survey years, and 284 free parameters.

Each walk $f$ of length $n$ is a mean-centered RW2, built by double cumulative sums with a free initial slope:

$$
z \sim \mathcal N(0, I_{n-2}), \qquad v_0 \sim \mathcal N(0, 0.2^2), \qquad
f = \sigma\, P L z + v_0\, r .
$$

- $L$ is the $n \times (n-2)$ double-cumsum map from innovations to levels, with $f_{\text{raw},0} = 0$ and the first slope 0. Row $k$ of $L$ is $(k-1, k-2, \ldots, 1, 0, \ldots, 0)$.
- $P = I - \tfrac1n \mathbf 1 \mathbf 1^\top$ removes the mean.
- $r = P\,(0, 1, \ldots, n-1)^\top$ is the mean-centered ramp, which the initial slope $v_0$ scales.
- $\sigma$ is the walk's scale. It has an exponential prior.

This is the standard non-centered form. The sampler moves in $(z, v_0, \log\sigma)$.

## Why it is slow

NUTS with a diagonal mass matrix can rescale each coordinate, but it can't rotate them. When the posterior is strongly correlated in the sampler's coordinates, trajectories need many small steps.

On the saved draws of the decided `p48` fit, the posterior's correlation matrix in the sampler's coordinates has a condition number of about 9,200. Its smallest-variance directions are smooth shapes of the cohort curve over the data-rich birth years:

- **Many coordinates per shape.** The data pin down each smooth shape well. But in innovation coordinates, a smooth shape is a weighted sum of about 50 entries of $z$, so the posterior is narrow along a direction that no single coordinate represents.
- **A funnel.** The walk is $\sigma$ times the innovations, so each well-identified shape also couples $z$ to $\sigma$.
- **The ramp twice over.** The smoothest of these shapes is nearly the linear ramp $r$, which $v_0$ also scales. So $v_0$ and the smoothest innovations trade off against each other.

As a result, the production fit (nutpie, 4 chains × (4000 + 6000), target_accept 0.99) reached the maximum tree depth of 10 on every draw. That's 1,023 gradient evaluations per draw.

## Step 1: the eigenbasis

Given $\sigma$, the walk without the slope term, $\sigma P L z$, is Gaussian with covariance $\sigma^2 P L L^\top P$. Take its eigendecomposition and keep the $n-2$ nonzero eigenvalues:

$$
P L L^\top P = U \Lambda U^\top, \qquad M = U \Lambda^{1/2} \quad (n \times (n-2)).
$$

Now define

$$
w = Q z, \qquad Q = M^{+} P L ,
$$

where $M^{+}$ is the pseudoinverse. Since $M$ has full column rank and $(PL)(PL)^\top = M M^\top$, $Q$ is square and orthogonal, and $PLz = Mw$. So:

- $w \sim \mathcal N(0, I)$, exactly as $z$ is;
- the change of variables has Jacobian 1;
- $f = \sigma M w + v_0 r$ is the same walk.

Each column of $M$ is one shape of the walk, from smoothest (largest $\lambda$) to roughest. A smooth shape the data pin down is now a single coordinate $w_k$, and the mass matrix can scale it.

On its own, this roughly doubled the ESS per minute (with TyMC and PyMC-style adaptation). But with nutpie-style adaptation, a few coordinates mixed badly (ESS 10–20). Those were the smoothest shapes and $v_0$.

## Step 2: split out the trend

The smoothest columns of $M$ are close to the ramp $r$, so $v_0$ and the leading $w_k$ explain nearly the same thing: the walk's overall linear trend. The fix is to make that trend a coordinate of its own. Decompose $M$ into its projection on $r$ and the rest:

$$
a = \frac{M^\top r}{r^\top r}, \qquad M_\perp = \left(I - \frac{r r^\top}{r^\top r}\right) M, \qquad M = r a^\top + M_\perp .
$$

Then

$$
f = \sigma M_\perp w + \beta\, r, \qquad \beta = v_0 + \sigma\, a^\top w .
$$

$\beta$ is the walk's total linear trend, and $M_\perp w$ has no linear component. The map $(v_0, w) \mapsto (\beta, w)$ is a shear with Jacobian 1. So the same model is:

- $w \sim \mathcal N(0, I)$;
- $\beta$ with a flat prior;
- $v_0$'s prior, $\mathcal N(0, 0.2^2)$, added as a potential evaluated at $v_0 = \beta - \sigma a^\top w$.

The data identify $\beta$ directly, as the trend of the curve, and in these coordinates it no longer competes with the smooth shapes.

## Code

The basis is computed once in numpy. In PyMC (`overton/apc.py`):

```python
def rw2_trend_basis(n):
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


# inside rw2(name, n, sigma, slope_init_scale, dims, form="trend")
M_perp, r, a = rw2_trend_basis(n)
w = pm.Normal(f"{name}_w", 0.0, 1.0, shape=n - 2)
beta = pm.Flat(f"{name}_trend")
v0 = beta - sigma * pm.math.dot(a, w)
pm.Potential(f"{name}_slope_init_prior", pm.logp(pm.Normal.dist(0.0, slope_init_scale), v0))
f = pm.Deterministic(name, sigma * pm.math.dot(M_perp, w) + beta * r, dims=dims)
```

The TyMC version, used by the browser page, is `rw2_trend` in `overtron/spike/model.ts`.

## Checking that it is the same model

`python -m overton.rw2_trend` builds the `p48` period–cohort and period models both ways. It draws random points in the current coordinates and maps them to the new ones with $w = Qz$ and $\beta = v_0 + \sigma a^\top w$. Then it compares the log densities, including the Jacobians of the transforms. They agree to about $10^{-9}$. The TyMC port agrees with PyMC to about $2.5 \times 10^{-7}$, the precision of PyMC's float32 constants.

## Results

**nutpie** (PyMC), `p48`, production settings: 4 chains × (4000 + 6000), target_accept 0.99, diagonal mass matrix, on one machine.

| Model | Form | Time | Leapfrog steps per draw | Draws at max depth | ESS bulk min | ESS per second |
|---|---|---|---|---|---|---|
| Period–cohort | current | 1,026 s | 1,023 | 100% | 1,416 | 1.4 |
| Period–cohort | trend | 159 s | 121 | 0% | 1,434 | 9.0 |
| Period | current | 183 s | 1,023 | 61% | 3,064 | 16.8 |
| Period | trend | 20 s | 65 | 0% | 1,327 | 65 |

**Subgroups.** These have fewer cells, so they're a harder test. Same settings, same machine:

| Fit | Form | Time | Steps per draw | Draws at max depth | Divergences | ESS bulk min | ESS per second | Headline (90% CI) |
|---|---|---|---|---|---|---|---|---|
| Period–cohort, liberals | current | 908 s | 1,023 | 39% | 0 | 1,785 | 2.0 | within-cohort slope −2.82 [−3.08, −2.57] |
| | trend | 86 s | 72 | 0% | 0 | 1,107 | 12.9 | −2.82 [−3.08, −2.57] |
| Period–cohort, born 1946–1964 | current | 358 s | 1,002 | 8% | 0 | 5,186 | 14.5 | within-cohort slope −0.12 [−0.34, 0.09] |
| | trend | 31 s | 63 | 0% | 0 | 2,120 | 68 | −0.12 [−0.34, 0.09] |
| Age, born 1946–1964 | current | 54 s | 453 | 0.01% | 4 | 3,924 | 73 | slope −0.16 [−0.42, 0.10] |
| | trend | 16 s | 63 | 0% | 0 | 4,777 | 306 | −0.16 [−0.42, 0.10] |
| Period, extremely liberal | current | 42 s | 354 | 1.1% | 11 | 2,299 | 54 | slope −3.37 [−4.12, −2.62] |
| | trend | 14 s | 56 | 0% | 0 | 4,787 | 339 | −3.37 [−4.14, −2.61] |

In every fit the two forms agree within Monte Carlo error. The trend form has 4–7× the ESS per second, and the divergences in the two smallest fits go away.

**`p48` results.** These also agree within Monte Carlo error:

| | Current | Trend |
|---|---|---|
| Within-cohort slope per decade (90% CI) | −0.843 [−1.006, −0.680] | −0.843 [−1.009, −0.679] |
| Generational replacement | −12.04 | −12.04 |
| Changing minds | −4.92 | −4.94 |

**TyMC** (the browser library), period–cohort model, diagonal mass matrix, target_accept 0.95, two cores:

| Form | Adaptation | Chains × (tune + draws) | Time | Steps per draw | R-hat max | ESS bulk min |
|---|---|---|---|---|---|---|
| Current | PyMC-style | 4 × (1000 + 1000) | 638 s | about 1,000 | 1.009 | 387 |
| Eigenbasis | PyMC-style | 4 × (1000 + 1000) | 569 s | 997 | 1.006 | 785 |
| Eigenbasis | nutpie-style | 4 × (1000 + 1000) | 63 s | 87 | 1.084 | 40 |
| Eigenbasis + trend | nutpie-style | 4 × (1000 + 1000) | 38 s | 50 | 1.021 | 167 |
| Eigenbasis + trend | nutpie-style | 2 × (1000 + 2000) | 30 s | 48 | 1.008 | 138 |

It took both steps, together with nutpie-style adaptation, to get the full speed-up.

## What didn't help

- **Centering.** Sampling the levels of the walk directly made the conditioning worse by 35–175×, as screened on the saved draws (not sampled). Neighboring levels of a smooth curve are nearly collinear. In CultureWar's period-only time model on binomial series, centering did help, so the answer depends on the model and the data.
- **Moving the slope's anchor.** Making the free slope the one at a middle birth year, instead of the first, didn't change the conditioning.

## Caveats

- **Threads.** The trend form multiplies by a dense $n \times (n-2)$ matrix. With default settings, BLAS starts its own threads in every chain: one fit used about 10 cores. Set `OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1`.
- **Prior predictive.** `pm.Flat` and `pm.Potential` can't be forward-sampled. Draw prior predictive samples from the current form, which is the same model.
- **Scope.** The derivation covers the Gaussian RW2 with a free initial slope. A Student-t RW2 isn't Gaussian, so the eigenbasis argument doesn't apply. A walk without the free slope has no $v_0$ to absorb $a^\top w$, so it would need its own derivation.
- **Default since 2026-11-03.** New fits use the trend form, and `--rw2-form cumsum` selects the current form. Results fitted before then used the current form. Summaries record which form was used.
