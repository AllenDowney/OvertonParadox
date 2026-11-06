# Reproducible data build and cleanup: plan

Board: Task 7. Carried over from `docs/plan.md` on 2026-11-06 (history in `docs/plan_history.md`).

## Goal

Anyone with a fresh clone, and the GSS files that the build script downloads or documents, can rebuild `data/` and rerun the pipeline, with no dependence on `~/CultureWar`.

## Items

1. Run `scripts/build_data.sh` end to end from a fresh clone, in a scratch directory, and record what fails.
2. `overton.candidates` and `overton.data` still read from `~/CultureWar`. Copy or download what they need, and record the source and date in `data/README.md`.
3. Retire the scripts that still use resampling, comparisons from the exploratory phase: list them, confirm nothing current imports them, then remove them, with a note in the log.

Nothing here changes results. If a rebuilt file differs from the current one, stop and compare before going on.
