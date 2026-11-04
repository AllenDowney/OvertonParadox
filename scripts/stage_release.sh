#!/usr/bin/env bash
# Stage the files of the data release the technical appendix downloads (docs/appendix_plan.md):
# the Overtron excerpt, the reference fixture for the primary questions, and the production
# summaries. Writes release/data-v1/; upload with
#   gh release create data-v1 release/data-v1/* --title "Data v1" --notes "..."
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/release/data-v1"
mkdir -p "$OUT"
cp "$ROOT"/overtron/public/data/v1/{manifest.json,questions.json,respondents.bin.gz} "$OUT"/
cp "$ROOT"/overtron/fixtures/primary.json "$OUT"/primary_fixture.json
cp "$ROOT"/figs/apc_summary.csv "$ROOT"/figs/position_headline.csv "$OUT"/
ls -la "$OUT"
