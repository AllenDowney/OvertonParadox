#!/usr/bin/env bash
# Build the data and the question pool from scratch, in order.
#
# Needs the raw GSS cumulative file, codebook, variable catalog, and 2024
# extract from ~/CultureWar (see data/README.md). Not yet run end to end in
# this repo: the files in data/ were copied from ProbablyOverthinkingIt,
# where these steps ran one at a time (2026-10-30 to 10-31).
#
# Usage: scripts/build_data.sh   (from the repo root, in the OvertonParadox env)

set -euo pipefail
cd "$(dirname "$0")/.."

python -m overton.data            # copy the 2024 extract; three weighted resamplings
python -m overton.candidates      # candidate questions from the full GSS file
python -c "from overton.data import make_candidates_resampled; make_candidates_resampled()"
python -m overton.scope           # in scope: opinion questions
python -m overton.coding          # conservative answer for each candidate
python -m overton.ranking         # rank by association with polviews; coded answers
python -m overton.stability       # liberal-conservative valence by decade
python -m overton.question_sets   # frozen sets; writes overton/questions.yaml

# scores for the age-period-cohort models, for each choice of difficulties
for d in heuristic em em66 emset; do
  python -m overton.apc prepare --difficulties "$d"
done
python -m overton.irt prepare     # inputs for the IRT fits (Ricardo's m1/m2)
