# Post 1, "Do people get more conservative with age?": plan

**Board:** Task 3 in `PROJECT_BOARD.md`. **Draft:** `jb/post1_age.md` (build with `make -C jb build-local`). **Series:** `docs/blog_series.md`.

**Point:** In every decade of surveys, older people hold more conservative beliefs. But following the same people over time, their beliefs don't get more conservative; they get a little more liberal.

## Status (2026-11-04)

The full draft exists. The selection section describes the current process (the `primary` pool, 53 questions). The numbers, figures, and alt text elsewhere are still from the previous selection (`p48`) and have to be refreshed from the `primary` fits, which are done.

## Outline

- This is an update of the analysis in Chapter 12:
  - new data (GSS through 2024);
  - better methods (developed for YWCN).
- Question: do people get more conservative as they get older?
- Method:
  - Core claim: conservative beliefs are the ones where liberals and conservatives differ.
  - What I did for the book.
  - What we did this time: selection process and rationale (six steps; the definition of the scale); details in the technical appendix (Task 1).
- If you observe people over an interval of time, the older ones have more conservative beliefs.
- But in their beliefs, people don't get more conservative over time:
  - aggregate by decade of birth;
  - aggregate by social generation;
  - period–cohort analysis.
- First metric: the slope of the period (within-cohort) component.

## Key figures

From `figs/apc/` (`jb/figs` links there), for the set `primary`:

1. `age_series_primary`: older is more conservative, in every decade of surveys. The setup.
2. `age_by_decade_primary`: the updated version of the book's figure (`overton5`: conservatism by age, grouped by decade of birth). Each decade of birth is flat or declining as it ages. Then explain the bias (below).
3. `trajectories_primary`: the period–cohort model's trajectory for each birth year, before aggregating (as in YWCN's cohort-trajectory figures).
4. `cohort_component_primary` and `period_component_primary`: the trajectories decomposed. The cohort component is where each birth year starts; the period component is how everyone moves together (the within-cohort change). The first metric is the slope of a line through the period component. (Versions with liberals, moderates, and conservatives: `*_component_by_group_primary`.)
5. `pc_by_decade_primary`, then `pc_by_generation_primary`: the same model fit within each decade of birth, then each generation, with each group's mix of birth years held fixed.
- Not in the post: `age_by_generation_primary`; the by-year versions `year_by_decade_primary`, `year_by_generation_primary`.

## Notes

- Within-cohort change combines aging and the times (age–period–cohort identification); phrase the claim that way.
- **Why the book's figure is biased.** A group spans many birth years (a decade, or 16–19 years for a generation), and its mix of birth years changes as you follow it:
  - **Against survey year:** over time, the oldest members die and drop out (and, for recent groups, the youngest age into the survey), so the group shifts toward later, more liberal birth years. The line falls even if no one changes their mind: biased down.
  - **Against age (the book's `overton5`):** at older ages only the group's earliest, more conservative birth years have been observed. The line rises with age even if no one changes: biased up. Figure 2 is the by-age version, so its bias works against its conclusion.
  - **The fix (YWCN):** the period–cohort model estimates each birth year's trajectory (figure 3), then aggregates with the group's mix of birth years held fixed (figure 5), so the composition can't move the line.
  - **The trajectories are parallel by construction:** on the logit scale, each birth year's line is the same period curve shifted by its cohort effect. So figure 3 shows the model's structure, not separate evidence for each cohort; say so in the post.
  - **Caution:** those are the directions composition pushes, not bounds; don't promise that the truth lies between the by-age and by-year versions. (Check how many birth groups fall between them with the `primary` fits before saying anything about it.)
- Decided (2026-11-02): post 1 doesn't mention the core economic exception; it first appears in post 4.
- Possibly mention the Overtron once it's live (Task 2).

## Related posts

(`related-articles`, 2026-11-02)
- [The Overton Paradox](https://www.allendowney.com/blog/2023/04/24/the-overton-paradox/) (2023-04-24): the book excerpt this post updates.
- [The Overton Paradox in Three Graphs](https://www.allendowney.com/blog/2023/09/19/the-overton-paradox-in-three-graphs/) (2023-09-19): the short version of the original argument.
- [The Center Moves Faster Than You](https://www.allendowney.com/blog/2024/01/04/the-center-moves-faster-than-you/) (2024-01-04): the mechanism; the natural lead-in to post 2.
- [Simpson's Paradox and Age Effects](https://www.allendowney.com/blog/2021/05/03/simpsons-paradox-and-age-effects/) (2021-05-03): older people look more conservative because of cohort, not age.
- [Sexual morality](https://www.allendowney.com/blog/2026/05/28/sexual-morality/) (2026-05-28) or [Confidence in Institutions](https://www.allendowney.com/blog/2026/05/19/confidence-in-institutions/) (2026-05-19): recent posts that use the same period–cohort model; link one as the method's introduction.
- [You Would Choose Now](https://www.allendowney.com/blog/2026/06/16/you-would-choose-now/) (2026-06-16): the book where the methods were developed.
- Optional: [Chasing the Overton Window](https://www.allendowney.com/blog/2022/11/09/chasing-the-overton-window/) (2022-11-09); [Old optimists and young pessimists](https://www.allendowney.com/blog/2021/04/27/old-optimists-and-young-pessimists/) (2021-04-27).

## Tasks

- [x] Draft (2026-11-03).
- [x] Selection section rewritten for the current process (2026-11-04).
- [ ] Figures: fine-tune the label placement for `primary` (`overton/apc_figures.py`), then switch the figure references from `_p48` to `_primary`.
- [ ] Numbers: refresh every number in the text, the alt text, and the `%` comments from the `primary` results (`figs/apc_results.csv`, `figs/apc_birth_groups.csv`, `figs/apc_age_slopes.csv`).
- [x] Link the technical appendix (Task 1): https://allendowney.github.io/OvertonParadox/appendix/
- [ ] Check the related-post links in the text.
- [ ] Read-through and edit; build the page in jb.
- [ ] Publish on Probably Overthinking It.
- [ ] Social posts: drafts in `jb/social/post1_age.md`; fill in the blog URL, then post (LinkedIn, X, Bluesky, Fosstodon).
