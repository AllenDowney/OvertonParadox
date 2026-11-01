# The Overton Paradox, updated

An update of Chapter 12 of [*Probably Overthinking It*](https://greenteapress.com/wp/probably-overthinking-it/) (Allen B. Downey, 2023), with General Social Survey (GSS) data through 2024.

The chapter describes the "Overton paradox":
- older people are more likely to say they are conservative, and they hold more conservative views on average;
- but as people get older, their views don't become more conservative; on average, they become more liberal.

The explanation is that the center of public opinion moves over time, so the labels shift.

This repo rebuilds that analysis:
- **Questions:** a rule-based selection, in place of the book's hand-picked 15.
- **Model:** a one-parameter item response model with question difficulties estimated by weighted EM.
- **Age, period, and cohort:** Bayesian models (PyMC) that separate generational replacement from change within cohorts.
- **Robustness:** the results as a function of the number of questions, and separately for social and economic questions.

The book's original analysis is in the [ProbablyOverthinkingIt](https://github.com/AllenDowney/ProbablyOverthinkingIt) repo; its method is explained in [this notebook](https://colab.research.google.com/github/AllenDowney/ProbablyOverthinkingIt/blob/book/notebooks/overton_irt.ipynb).

## Where things are

- `docs/lab.md`: the lab notebook, a running record of what was done, why, and what came out.
- `docs/plan.md`: the plan, decisions, and checklist.
- `docs/confidence_review.md`, `docs/question_domains.md`, `docs/difficulties_design.md`: design questions sent out for independent review, with the outcomes.
- `overton/`: the code, one module per step (`python -m overton.<step>`).
- `figs/`: figures and summary tables.
- `unity/`: Slurm scripts and job lists for the model fits, run on the Unity cluster.
- `notebooks/`: an ANES version of the analysis (in progress).
- `data/`, `results/`: data and fit outputs, not in git. See `data/README.md`.

## Running it

```bash
conda env create -f environment.yml
conda activate OvertonParadox
scripts/build_data.sh                    # data and question pool (see data/README.md)
python -m overton.apc fit --model period --set p43 --difficulties em --by polviews3=Liberal
python -m overton.apc_figures            # figures from the fits in results/
```

The model fits are run in parallel on the Unity cluster: copy `unity/config.example.sh` to `unity/config.sh` and fill it in, then `unity/unity_rsync.sh push`, `unity/submit.sh unity/overton_apc_array.sh <job list>`, and `unity/unity_rsync.sh pull`.

## License

See `LICENSE`.
