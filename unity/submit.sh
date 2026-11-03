#!/usr/bin/env bash
# Submit a Slurm array on Unity: one task per line of the job list.
#
# Reads UNITY_HOST, UNITY_ACCOUNT, and UNITY_WORK from unity/config.sh.
# Push first (unity/unity_rsync.sh push) so Unity has the job list.
#
# Usage: unity/submit.sh unity/overton_apc_array.sh unity/<job list> [sbatch options]
# e.g. -p cpu,cpu-preempt --requeue for short, idempotent fits

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "${ROOT}/unity/config.sh"

script="$1"
jobs="$2"
shift 2
n=$(grep -cvE '^\s*(#|$)' "${ROOT}/${jobs}")
ssh "$UNITY_HOST" "cd ${UNITY_WORK}/OvertonParadox && UNITY_WORK=${UNITY_WORK} sbatch -A ${UNITY_ACCOUNT} --export=ALL --array=0-$((n - 1)) $* ${script} ${jobs}"
