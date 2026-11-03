#!/bin/bash
#SBATCH -c 16
#SBATCH --mem=16G
#SBATCH -t 02:00:00
#SBATCH -J overton_threads
#SBATCH -o unity/logs/overton_threads-%j.out

# Timing test for the BLAS thread setting with the trend form of the RW2
# (docs/lab.md, 2026-11-03): the p48 period-cohort fit at production length,
# 4 chains x (4000 + 6000) at 0.99, seed 17, in four configurations on the same
# node, one at a time: 4 cores (taskset) or all 16, each with BLAS limited to one
# thread or default. A short warm-up fit first (discarded), so no configuration
# pays the cold-start costs; then each configuration twice, the second pass in
# reverse order.
#
#   ssh unity "cd <work>/OvertonParadox && UNITY_WORK=<work> sbatch -A <account> -p cpu-preempt unity/thread_timing.sh"

set -euo pipefail
ROOT="${SLURM_SUBMIT_DIR}"
WORK="${UNITY_WORK:?set when submitting}"
export TMPDIR="${WORK}/tmp"
mkdir -p "$TMPDIR"
source "${WORK}/miniforge3/etc/profile.d/conda.sh"
conda activate CultureWar
cd "$ROOT"

echo "HOST=$(hostname) DATE=$(date -Is) JOB=${SLURM_JOB_ID:-na}"
echo "CPU=$(lscpu | sed -n 's/^Model name: *//p')"
cat unity/UNITY_SYNC_STAMP || true
allowed=$(python -c "import os; print(','.join(map(str, sorted(os.sched_getaffinity(0)))))")
first4=$(echo "$allowed" | cut -d, -f1-4)
echo "ALLOWED_CPUS=$allowed"

echo "=== warm-up (discarded)"
OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1 python -m overton.apc fit --model period_cohort --set p48 \
  --tune 200 --draws 200 --chains 4 --rw2-form trend --tag _threads-warmup > /dev/null

configs="4:one 4:default 16:one 16:default"
reversed="16:default 16:one 4:default 4:one"
for pass in 1 2; do
  [ "$pass" = 1 ] && order=$configs || order=$reversed
  for config in $order; do
    cores=${config%:*}
    threads=${config#*:}
    if [ "$threads" = one ]; then
      export OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1
    else
      unset OMP_NUM_THREADS OPENBLAS_NUM_THREADS MKL_NUM_THREADS
    fi
    pin=""
    [ "$cores" = 4 ] && pin="taskset -c $first4"
    tag="_threads-c${cores}-${threads}-p${pass}"
    samples="$TMPDIR/samples${tag}_${SLURM_JOB_ID}.txt"
    : > "$samples"
    ( while true; do p=$(pgrep -f "tag ${tag}\$" | head -1); [ -n "$p" ] && ps -o nlwp= -p "$p" >> "$samples"; sleep 5; done ) &
    sampler=$!
    echo "=== pass $pass, cores $cores, BLAS threads $threads"
    # shellcheck disable=SC2086
    $pin python -u -m overton.apc fit --model period_cohort --set p48 --tune 4000 --draws 6000 --chains 4 \
      --target-accept 0.99 --rw2-form trend --tag "$tag" \
      | grep -E '"(elapsed_seconds|n_steps_mean|ess_bulk_min|rhat_max|divergences|period_slope_per_decade)"'
    kill "$sampler"
    echo "  max threads $(sort -n "$samples" | tail -1)"
  done
done
echo TIMING_OK
