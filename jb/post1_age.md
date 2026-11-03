---
title: Do People Get More Conservative as They Age?
description: >-
  An update of the Overton paradox analysis with GSS data through 2024: in every decade of
  surveys, older people hold more conservative beliefs, but following the same people over
  time, their beliefs get a little more liberal.
---

# Do People Get More Conservative as They Age?

% Draft scaffold (2026-11-02): headings follow the outline in docs/blog_series.md, post 1.
% Lines starting with % are notes for drafting; they don't appear on the site.

% Point: In every decade of surveys, older people hold more conservative beliefs. But following
% the same people over time, their beliefs don't get more conservative; they get a little more liberal.

% This is an update of the analysis in Chapter 12: new data (GSS through 2024), better methods
% (developed for YWCN).
% Link: The Overton Paradox (2023-04-24) https://www.allendowney.com/blog/2023/04/24/the-overton-paradox/
% Link: The Overton Paradox in Three Graphs (2023-09-19) https://www.allendowney.com/blog/2023/09/19/the-overton-paradox-in-three-graphs/
% Link: You Would Choose Now (2026-06-16) https://www.allendowney.com/blog/2026/06/16/you-would-choose-now/

## How to measure conservatism

% Core claim: conservative beliefs are the ones where liberals and conservatives differ.
% What I did for the book (15 hand-picked questions).
% What we did this time: rule-based selection (48 questions), and the rationale. Details in post 3.
% The unit: percent conservative responses to the 48 questions.

## Older people are more conservative

```{figure} figs/age_series_p48.png
:name: fig-age-series
:alt: Percent conservative responses by age, one line for each decade of surveys from the 1970s to the 2020s; every line rises with age.

Percent conservative responses by age, for each decade of surveys.
```

% Age slope, percentage points per decade of age: +3.9 (1970s), +2.9 (1980s, 1990s),
% +2.1 to +2.4 (since 2000).

## But people don't get more conservative

```{figure} figs/age_by_decade_p48.png
:name: fig-age-by-decade
:alt: Percent conservative responses by age, one line for each decade of birth from the 1900s to the 2000s; the lines are flat or declining.

Percent conservative responses by age, for each decade of birth: the updated version of the figure in the book.
```

% Each decade of birth is flat or declining as it ages.
% Why this figure is biased: a group spans many birth years, and at older ages only its earliest,
% more conservative birth years have been observed, so the line is pushed up with age even if no
% one changes. So the bias works against the conclusion. (Against survey year, the bias goes the
% other way.) These are directions, not bounds: don't promise the truth lies between the two.
% Link: Simpson's Paradox and Age Effects (2021-05-03) https://www.allendowney.com/blog/2021/05/03/simpsons-paradox-and-age-effects/

## Following each birth year

```{figure} figs/trajectories_p48.png
:name: fig-trajectories
:alt: Estimated percent conservative responses for each birth year from 1900 to 2006, over the survey years it was observed; later birth years are lower, and all lines drift down.

Estimated percent conservative responses for each birth year, from the period–cohort model.
```

% The fix (YWCN): estimate each birth year's trajectory, then aggregate with the mix of birth
% years held fixed, so composition can't move the line.
% Say: the trajectories are parallel by construction (same period curve, shifted by each
% cohort's effect, on the logit scale), so the direction is easier to read from the period component.
% Every birth year observed in 3+ surveys moves toward liberal: median -0.86 points per decade.
% Link: Sexual morality (2026-05-28) https://www.allendowney.com/blog/2026/05/28/sexual-morality/

```{figure} figs/cohort_component_p48.png
:name: fig-cohort-component
:alt: Cohort component: percent conservative responses by birth cohort, falling from about 66 for 1900 to about 40 for 2000.

Cohort component: where each birth year starts.
```

```{figure} figs/period_component_p48.png
:name: fig-period-component
:alt: Period component: percent conservative responses within cohorts, by survey year, falling slowly from about 52 to about 47.

Period component: how everyone moves together.
```

% First metric: the slope of a line through the period component:
% -0.84 [-1.01, -0.68] percentage points per decade (90% interval).
% Decomposition of the total change (-17.0 points): generational replacement -12.0,
% changing minds -4.9 (71% replacement).
% Within-cohort change combines aging and the times (age-period-cohort identification);
% phrase the claim that way.

## Every group moves left

```{figure} figs/pc_by_decade_p48.png
:name: fig-pc-by-decade
:alt: Period component within each decade of birth, by survey year; the lines are flat or declining, except that the 1950s rise until about 1980.

Conservatism within cohorts, for each decade of birth.
```

```{figure} figs/pc_by_generation_p48.png
:name: fig-pc-by-generation
:alt: Period component within each generation, by survey year, with the overall average dotted; every line is flat or declining.

Conservatism within cohorts, for each generation. The dotted line is the overall average.
```

% Every birth group's within-cohort slope is negative or about zero; none moves toward conservative.

## So why do older people say they're conservative?

% Lead-in to post 2 (the Overton paradox).
% Link: The Center Moves Faster Than You (2024-01-04) https://www.allendowney.com/blog/2024/01/04/the-center-moves-faster-than-you/
