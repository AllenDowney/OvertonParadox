---
title: Do People Get More Conservative With Age?
description: >-
  An update of the Overton paradox analysis with GSS data through 2024: in every decade of
  surveys, older people hold more conservative beliefs, but following the same people over
  time, their beliefs get a little more liberal.
---

# Do People Get More Conservative With Age?

% Draft (2026-11-03), from the outline in docs/blog_series.md, post 1.
% Lines starting with % are notes; they don't appear on the site.

There's a famous (but unattributable) quip that goes something like this:

> If you are not a liberal at 25, you have no heart. If you are not a conservative at 35, you have no brain.

In Chapter 12 of [*Probably Overthinking It*](https://greenteapress.com/wp/probably-overthinking-it), I used data from the General Social Survey (GSS) to show that the quip is half right. Older people are more likely to say they are conservative, and they hold more conservative views. But as people get older, their views don't become more conservative; on average, they become a little more liberal. I called this combination [the Overton paradox](https://www.allendowney.com/blog/2023/04/24/the-overton-paradox/).

That analysis used data through 2021 and methods that were good enough for a book chapter. Since then, the GSS has released data from 2022 and 2024, and while working on my next book, [*You Would Choose Now*](https://www.allendowney.com/blog/2026/06/16/you-would-choose-now/), I developed better methods for separating the effects of age, birth year, and the times. So it's time for an update.

This is the first in a series of articles. In this one, I'll answer the first question: do people get more conservative as they get older? The answer is still no.

## How to measure conservatism

To answer the question, we need a way to measure how conservative someone's beliefs are. The core idea is that conservative beliefs are the ones where liberals and conservatives disagree. If self-identified conservatives are more likely than self-identified liberals to give a particular answer to a question, we'll call that answer conservative.

For the book, I searched the GSS for the questions that most distinguish liberals and conservatives, and then I curated a list of fifteen that cover a variety of topics and were asked often over the course of the survey. That worked well enough, but curating involves judgment calls, and judgment calls are a place where bias can sneak in.

This time I replaced curation with a rule. I started with every opinion question in the GSS that was asked in at least eight years over at least fifteen, which is about 170 questions. For each question, I identified the conservative side of the answers and measured how strongly it is associated with self-identified ideology, controlling for year of the survey and year of birth. Then I kept the strongest questions, subject to a few requirements:

* Each question had to be asked in at least half of the survey years, so the measure doesn't depend on a few short-lived questions.
* Only one question per topic, so the measure isn't dominated by, for example, the seven versions of the abortion question.
* The relationship between the question and ideology had to be stable over time.

The selection uses only the association between each question and self-identified ideology, never the trends in the answers, so it can't favor questions that tell a particular story. The result is a list of 48 questions. I'll describe the process in more detail, and show how much the results depend on it, in a later article.

To combine responses to 48 questions into a single measure, I use a statistical model that accounts for the fact that not every respondent was asked every question. For each respondent, it estimates the percentage of the 48 questions where they would give a conservative answer if they were asked all of them. I'll call that measure "percent conservative responses". The analysis includes about 65,000 respondents from 1972 to 2024 who answered at least five of the questions.

% Sample: 2021 is dropped and, in 2022 and 2024, only interviewer-administered respondents are
% included (mode; maybe a sentence or a footnote here, details in a later post).

## Older people are more conservative

The following figure shows percent conservative responses as a function of age, with one line for each decade of the survey, from the 1970s to the 2020s.

```{figure} figs/age_series_p48.png
:name: fig-age-series
:alt: Percent conservative responses by age, one line for each decade of surveys from the 1970s to the 2020s; every line rises with age.

Percent conservative responses by age, for each decade of surveys.
```

In every decade, older people give more conservative answers than younger people. In the 1970s, conservatism increased by about 3.9 percentage points per decade of age. Since then the slope has been a little smaller, about 2.9 points per decade in the 1980s and 1990s, and 2.1 to 2.4 points per decade since 2000. But in every decade, the oldest respondents are 15 to 25 points more conservative than the youngest.

The figure also shows that every line is lower than the one before. At every age, people surveyed in the 2020s are more liberal than people the same age surveyed in the 1970s. Keep that in mind; it will be important.

So the first half of the quip is right: older people are more conservative. But that doesn't mean that people *become* more conservative as they get older.

## But people don't get more conservative

To see why, let's group people by decade of birth. The following figure shows percent conservative responses as a function of age again, but this time each line represents a decade of birth, from the 1900s to the 2000s.

```{figure} figs/age_by_decade_p48.png
:name: fig-age-by-decade
:alt: Percent conservative responses by age, one line for each decade of birth from the 1900s to the 2000s; the lines are flat or declining.

Percent conservative responses by age, for each decade of birth: the updated version of the figure in the book.
```

This is the updated version of the figure in the book, and the conclusion is the same. Within each group, the lines are mostly flat or declining. As people get older, they don't become more conservative.

So why are older people more conservative? Because they were born earlier. Almost every decade of birth is more liberal than the one before, and older respondents are more likely to come from the earlier, more conservative groups. That's why we see the age effect in the previous figure, even though no group follows it.

This is an example of Simpson's paradox, which I wrote about in [*Simpson's Paradox and Age Effects*](https://www.allendowney.com/blog/2021/05/03/simpsons-paradox-and-age-effects/) and in Chapter 10 of *Probably Overthinking It*: the trend in every group goes one way, and the overall trend goes the other way.

However, this figure has a subtle problem. Each line represents people born over a ten-year span, and the mix of birth years changes as we follow the line. For example, when we see the 1940s group in their 30s, it includes everyone born in the 1940s. But we only see them in their 70s and 80s near the end of the survey, so the right end of the line includes only people born early in the decade, who are more conservative. As a result, the line is pushed up at older ages, even if no one changes their mind.

Fortunately, that bias works against the conclusion. The lines are flat or declining even though the shifting mix of birth years pushes them up. But to see what is really happening, we need a better method.

% If we plot the same groups by survey year instead of age, the bias goes the other way (members
% drop out and the mix shifts toward later, more liberal birth years). These are the directions
% composition pushes, not bounds: don't say the truth lies between the two.

## Following each birth year

The better method is the one I used in [*You Would Choose Now*](https://www.allendowney.com/blog/2026/06/16/you-would-choose-now/) and recent articles like [*Sexual morality*](https://www.allendowney.com/blog/2026/05/28/sexual-morality/). Using a Bayesian model, I estimate an effect for each year of birth and an effect for each year of the survey. Together, they describe a trajectory for each birth year over the years it was observed. The following figure shows those trajectories.

```{figure} figs/trajectories_p48.png
:name: fig-trajectories
:alt: Estimated percent conservative responses for each birth year from 1900 to 2006, over the survey years it was observed; later birth years are lower, and all lines drift down.

Estimated percent conservative responses for each birth year, from the period–cohort model.
```

Each line represents a single birth year. For example, the yellow-green line at the top left shows people born in 1900, who were 72 when the survey started in 1972 and 90 when they aged out in 1990. The purple line at the bottom right shows people born in 2006, who became eligible for the survey when they turned 18 in 2024.

Two patterns are clear:

* Each birth year starts out more liberal than the one before. People born in 1900 gave conservative answers to about two-thirds of the questions; people born after 2000 give conservative answers to about 40%.

* As each birth year ages, its line drifts down. Following the same people over time, their answers become more liberal, not more conservative.

To be precise about the second point: in this model, the lines have the same shape by construction, shifted up or down for each birth year. So the figure shows the structure of the model, not a separate finding for each birth year. The evidence for the downward drift is that the model is fit to data that follow each birth year over time, and the drift is what the data show. We can see it more directly by separating the two effects.

The following figure shows the cohort effect: the average level of conservatism for each birth year, as if every birth year had been surveyed in every year of the survey.

```{figure} figs/cohort_component_p48.png
:name: fig-cohort-component
:alt: Cohort component: percent conservative responses by birth cohort, falling from about 66 for 1900 to about 40 for 2000.

Cohort component: where each birth year starts.
```

The decline is steepest between people born in the 1930s and 1950s, it pauses for people born in the 1950s and 1960s, and it continues after that.

The following figure shows the period effect: the average level of conservatism in each year of the survey, as if the population had the same mix of birth years throughout.

```{figure} figs/period_component_p48.png
:name: fig-period-component
:alt: Period component: percent conservative responses within cohorts, by survey year, falling slowly from about 52 to about 47.

Period component: how everyone moves together.
```

With the mix of birth years held constant, conservatism declines slowly, from about 52% in the 1970s to about 47% in 2024. If we fit a straight line, the slope is −0.84 percentage points per decade. With 90% confidence, the slope is between −1.01 and −0.68. So the change is small, but we can be confident about the direction: following the same people over time, they become a little more liberal.

One caveat: following a birth year over time, people get older and the times change, and there is no way to separate those effects. So the period effect combines aging and the times. What we can say is that, as people get older in the world as it is, their beliefs don't move toward conservative.

% Within-cohort change combines aging and the times (age-period-cohort identification); the
% paragraph above phrases the claim that way.

Finally, we can use these components to break down the total change. Over the course of the survey, average conservatism fell by 17.0 percentage points. Of that, about 12.0 points are due to generational replacement — older, more conservative people leaving the population and younger, more liberal people joining it — and about 4.9 points are due to changing minds. So more than two-thirds of the change is generational.

% Decomposition: -17.0 = -12.0 (replacement) + -4.9 (changing minds), 71% replacement; window 1972-2024.

## Every group moves left

If we fit the same model separately for each decade of birth, we can see whether the overall trend holds within every group. The following figure shows the period effect for each decade of birth, holding its mix of birth years fixed, so the shifting composition of each group can't move the line.

```{figure} figs/pc_by_decade_p48.png
:name: fig-pc-by-decade
:alt: Period component within each decade of birth, by survey year; the lines are flat or declining, except that the 1950s rise until about 1980.

Conservatism within cohorts, for each decade of birth.
```

The dotted line shows the overall average, which falls faster than most of the groups, because it includes the effect of generational replacement. Within the groups, the lines are flat or declining. People born in the 1950s moved a little toward conservative until about 1980, when they were in their 20s, and toward liberal after that.

The following figure shows the same analysis with respondents grouped by generation, using the Pew Research Center's definitions.

```{figure} figs/pc_by_generation_p48.png
:name: fig-pc-by-generation
:alt: Period component within each generation, by survey year, with the overall average dotted; every line is flat or declining.

Conservatism within cohorts, for each generation. The dotted line is the overall average.
```

The results are the same: no group of birth years, defined either way, became more conservative over the course of the survey. All of them became more liberal or stayed about the same.

% Every birth group's within-cohort slope is negative or about zero; none moves toward conservative.

## So why do older people say they're conservative?

The quip is half right. Older people are more conservative than younger people, but not because they got older. They are more conservative because they were born earlier, and as they age, they become a little more liberal.

That leaves the other half of the paradox. As people get older, they are more likely to *say* they are conservative. If their beliefs are moving toward liberal, why would they?

The answer, as I suggested in [*The Center Moves Faster Than You*](https://www.allendowney.com/blog/2024/01/04/the-center-moves-faster-than-you/), is that "liberal" and "conservative" are relative terms. In the next article, I'll use the updated data to show that the center of public opinion moves faster than the people in it — and what happens to the liberal of 1974 when they find themselves in 2024.

% Possibly mention the Overtron here once it is live: "If you want to see how the results depend
% on which questions count as conservative, you can choose your own and run the analysis in your
% browser."
