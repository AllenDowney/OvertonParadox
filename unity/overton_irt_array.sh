#!/bin/bash
#SBATCH -p cpu
#SBATCH -c 4
#SBATCH --mem=32G
#SBATCH -t 08:00:00
#SBATCH -J overton_irt
#SBATCH -o unity/logs/overton_irt-%A_%a.out

# One IRT fit per array task; each line of the job list is "set key model".
# Submit with unity/submit.sh, which reads the account and work directory
# from unity/config.sh:
#   unity/submit.sh unity/overton_irt_array.sh unity/overton_irt_jobs.txt
# Sampling length from the environment: IRT_TUNE, IRT_DRAWS (defaults below).

set -euo pipefail
# set by unity/submit.sh: the repo copy on Unity, and the work directory
# with miniforge3/ and tmp/
ROOT="${SLURM_SUBMIT_DIR}"
WORK="${UNITY_WORK:?set by unity/submit.sh}"
export TMPDIR="${WORK}/tmp"
mkdir -p "$TMPDIR"
source "${WORK}/miniforge3/etc/profile.d/conda.sh"
conda activate CultureWar
cd "$ROOT"

mapfile -t jobs < <(grep -vE '^\s*(#|$)' "$1")
read -r SET KEY MODEL <<<"${jobs[$SLURM_ARRAY_TASK_ID]}"

echo "HOST=$(hostname) DATE=$(date -Is) JOB=${SLURM_ARRAY_JOB_ID:-na}_${SLURM_ARRAY_TASK_ID:-na}"
echo "SET=$SET KEY=$KEY MODEL=$MODEL"
cat unity/UNITY_SYNC_STAMP || true
python -c "import pymc, nutpie, arviz; print('pymc', pymc.__version__, 'nutpie', nutpie.__version__, 'arviz', arviz.__version__)"

python -m overton.irt fit --set "$SET" --key "$KEY" --model "$MODEL" \
  --tune "${IRT_TUNE:-2000}" --draws "${IRT_DRAWS:-1000}" --chains 4
echo FIT_OK
