"""Question difficulties by marginal maximum likelihood (EM on the grid).

The Rasch model used for scoring: P(conservative answer) = expit(theta - d),
with theta on the grid XS and the prior PRIOR from overton_pipeline. EM
(Bock and Aitkin) alternates:
- E step: each respondent's posterior on the grid, given the current
  difficulties;
- M step: for each question, the difficulty at which the weighted expected
  share of conservative answers among the people asked equals the observed
  weighted share.

Starts from the heuristic, -logit(weighted prevalence). Anchored
calibration: difficulties in `fixed` are held constant and only the others
are estimated, which puts new questions on an existing scale.

Latent distribution (a variation; the decided specification uses the fixed
prior): by default, the distribution of theta that the item probabilities are
integrated over is the scoring prior, Normal(0, 4). With `groups`, it is
instead estimated from the data, one distribution on the grid per group (one
group: Bock and Aitkin's empirical distribution; survey decades: a
distribution that can change over time, with common difficulties). A free
distribution leaves the location of the scale unidentified, so the mean
difficulty is held at `mean_difficulty`.

latent_normals: with the difficulties fixed, a normal latent distribution
for each group (overton/position.py).

On the 66-question pool this reproduces the m1 posterior means (overton/irt.py)
to within 0.017 on average, in seconds (docs/difficulties_design.md).
"""

import numpy as np
import pandas as pd
from scipy.optimize import brentq
from scipy.special import expit

from overton.pipeline import PRIOR, XS, weighted_means


def grid_posterior(a, d, prior=PRIOR, xs=XS):
    """Posterior on the grid for each respondent; a is 1/0/NaN, d the difficulties.

    prior: one distribution on the grid, or one row per respondent.
    """
    P = expit(xs[None, :] - d[:, None])
    loglike = np.zeros((len(a), len(xs)))
    for j in range(a.shape[1]):
        col = a[:, j, None]
        loglike += np.where(col == 1, np.log(P[j]), np.where(col == 0, np.log(1 - P[j]), 0))
    posterior = np.exp(loglike - loglike.max(axis=1, keepdims=True)) * prior
    return posterior / posterior.sum(axis=1, keepdims=True)


def em_difficulties(questions, weights, fixed=None, tol=1e-4, max_iter=100, groups=None, mean_difficulty=None):
    """Weighted EM estimates of the difficulties.

    questions: DataFrame of 1/0/NaN, one column per question
    weights: Series aligned with questions
    fixed: Series of difficulties to hold constant (anchors), optional
    groups: labels aligned with questions; if given, estimate the latent
        distribution, one per group (see the module docstring)
    mean_difficulty: with groups, the mean of the difficulties (identifies location)

    returns: Series of difficulties, indexed by question
    """
    names = list(questions.columns)
    a = questions.values
    w = np.asarray(weights, dtype=float)
    means = weighted_means(questions, pd.Series(w, questions.index))
    d = -np.log(means / (1 - means)).values
    free = np.ones(len(names), dtype=bool)
    if fixed is not None:
        for j, name in enumerate(names):
            if name in fixed.index:
                d[j] = fixed[name]
                free[j] = False

    if groups is not None:
        labels, codes = np.unique(np.asarray(groups), return_inverse=True)
        dists = np.tile(PRIOR, (len(labels), 1))
    for _ in range(max_iter):
        prior = PRIOR if groups is None else dists[codes]
        posterior = grid_posterior(a, d, prior)
        if groups is not None:
            for k in range(len(labels)):
                in_group = codes == k
                dist = (w[in_group, None] * posterior[in_group]).sum(axis=0)
                dists[k] = dist / dist.sum()
        new = d.copy()
        for j in np.flatnonzero(free):
            asked = ~np.isnan(a[:, j])
            mass = (w[asked, None] * posterior[asked]).sum(axis=0)
            target = (w[asked] * a[asked, j]).sum()
            new[j] = brentq(lambda dj: (mass * expit(XS - dj)).sum() - target, -10, 10)
        if groups is not None:
            new[free] += mean_difficulty - new.mean()
        change = np.abs(new - d).max()
        d = new
        if change < tol:
            break
    return pd.Series(d, names)



def latent_normals(questions, weights, d, groups, xs=XS, tol=1e-6, max_iter=500):
    """Weighted EM estimates of a normal latent distribution in each group, difficulties fixed.

    E step: each respondent's posterior on the grid xs, with their group's
    normal as the prior; M step: each group's mean and SD from the weighted
    posterior moments. With the difficulties fixed, the groups don't
    interact, so each one's estimate is the same as if it were fit alone.

    A nonparametric distribution on a fine grid (2026-11-02) didn't converge:
    after thousands of iterations, percentiles still moved by about 2 points,
    because 5 to 48 yes/no answers per respondent don't pin down the shape;
    on the 21-point scoring grid it collapsed onto 3 or 4 points. Near the
    center, it agreed with the normal to about 2 percentile points.

    returns: DataFrame with columns mu and sd, one row per group
    """
    from scipy.sparse import csr_matrix
    from scipy.stats import norm

    w = np.asarray(weights, dtype=float)
    labels, codes = np.unique(np.asarray(groups), return_inverse=True)
    # weighted sums by group, as a sparse matrix product
    by_group = csr_matrix((w, (codes, np.arange(len(codes)))), shape=(len(labels), len(codes)))
    # the likelihood doesn't change, so compute it once
    like = grid_posterior(questions.values, np.asarray(d, dtype=float), np.ones(len(xs)), xs)
    mu, sd = np.zeros(len(labels)), np.ones(len(labels))
    for _ in range(max_iter):
        prior = norm.pdf(xs[None, :], mu[:, None], sd[:, None])
        posterior = like * prior[codes]
        posterior /= posterior.sum(axis=1, keepdims=True)
        total = by_group @ posterior
        m1 = (total @ xs) / total.sum(axis=1)
        m2 = (total @ xs**2) / total.sum(axis=1)
        change = max(np.abs(m1 - mu).max(), np.abs(np.sqrt(m2 - m1**2) - sd).max())
        mu, sd = m1, np.sqrt(m2 - m1**2)
        if change < tol:
            break
    return pd.DataFrame(dict(mu=mu, sd=sd), index=labels)
