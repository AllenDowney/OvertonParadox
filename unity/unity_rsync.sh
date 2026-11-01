#!/usr/bin/env bash
# Push / pull the Overton model fits to and from Unity.
#
# Unity is compute only: no git there. Push sends just the job inputs
# (the overton package, the prepared model data, and the Slurm scripts);
# pull brings back results and logs. Uses the CultureWar conda env on Unity
# (see ~/CultureWar/unity_workflow.md).
#
# Usage (from anywhere):
#   unity/unity_rsync.sh push [--dry-run]
#   unity/unity_rsync.sh pull [--dry-run]

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# UNITY_HOST and UNITY_WORK (see unity/config.example.sh)
source "${ROOT}/unity/config.sh"
REMOTE_DIR="${UNITY_WORK}/OvertonParadox"
REMOTE="${UNITY_HOST}:${REMOTE_DIR}"
STAMP="${ROOT}/unity/UNITY_SYNC_STAMP"

cmd="${1:-}"
shift || true
DRY=()
for a in "$@"; do
  case "$a" in
    --dry-run|-n) DRY=(-n) ;;
  esac
done

case "$cmd" in
  push)
    {
      echo "pushed_at=$(date -Is)"
      echo "git_head=$(git -C "$ROOT" rev-parse HEAD)"
      echo "irt_script_md5=$(md5sum "$ROOT/overton/irt.py" | cut -d' ' -f1)"
      echo "apc_script_md5=$(md5sum "$ROOT/overton/apc.py" | cut -d' ' -f1)"
    } >"$STAMP"
    ssh "$UNITY_HOST" "mkdir -p ${REMOTE_DIR}/overton ${REMOTE_DIR}/results/apc/data ${REMOTE_DIR}/results/irt/data ${REMOTE_DIR}/unity/logs"
    rsync -avP "${DRY[@]}" --delete --exclude __pycache__/ --exclude '*.yaml' "$ROOT"/overton/ "$REMOTE"/overton/
    rsync -avP "${DRY[@]}" --delete "$ROOT"/results/apc/data/ "$REMOTE"/results/apc/data/
    rsync -avP "${DRY[@]}" --delete "$ROOT"/results/irt/data/ "$REMOTE"/results/irt/data/
    rsync -avP "${DRY[@]}" --delete --exclude logs/ --exclude config.sh "$ROOT"/unity/ "$REMOTE"/unity/
    ;;
  pull)
    rsync -avP "${DRY[@]}" "$REMOTE"/results/irt/results/ "$ROOT"/results/irt/results/ || true
    rsync -avP "${DRY[@]}" "$REMOTE"/results/apc/results/ "$ROOT"/results/apc/results/ || true
    rsync -avP "${DRY[@]}" "$REMOTE"/unity/logs/ "$ROOT"/unity/logs/
    ;;
  *)
    echo "Usage: $0 {push|pull} [--dry-run]" >&2
    exit 2
    ;;
esac
