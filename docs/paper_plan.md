# arXiv paper: plan

Board: Task 4. Started 2026-11-06. Status: literature review done; development process confirmed (Allen, 2026-11-06); `paper/` stub builds through `make arxiv`; no decision yet on framing or new analyses.

## Goal

A short academic paper on the Overton work, posted to arXiv: GSS 1972–2024, IRT conservatism score, period–cohort model, the Overton paradox. It should place the work in the recent literature with a handful of citations, not survey the field.

## Done

- Literature search, plus a cross-check against outside guidance (2026-11-06). Eighteen papers archived in `papers/` with summaries; review and citation recommendations in `docs/literature_review.md`.

## Development process (confirmed by Allen 2026-11-06)

**Draft in Markdown, convert to LaTeX with pandoc.** Markdown keeps the drafting the same as the blog posts and the appendix, and pandoc gives full control of the LaTeX it produces. We'd write a small template rather than take what MyST's LaTeX export produces, and the `.tex` is what arXiv needs. Citations go in a BibTeX file and use pandoc's `[@key]` syntax, converted with `--natbib` so that LaTeX and BibTeX do the bibliography. MyST's LaTeX export (`myst build --tex`, with arXiv templates) is the alternative. It would let the paper live in the jb site, but its output is harder to control. I'd use it only if we want the paper on the site too.

**A self-contained folder, `paper/`:**

```
paper/
  paper.md          # the source: YAML front matter (title, authors, abstract) + text
  refs.bib          # BibTeX entries for the cited papers (from papers/*/summary.md)
  template.tex      # pandoc LaTeX template: article class, natbib, graphicx, hyperref
  figures/          # PDFs copied from figs/ by the Makefile (real files, not links)
  figures.txt       # manifest: which figs/ files the paper uses
  numbers.tex       # generated \newcommand macros for the key numbers (optional, see below)
  Makefile
  build/            # gitignored
```

**Makefile targets:**
- `make figures`: copy the files listed in `figures.txt` from `../figs/` into `figures/`.
- `make tex`: `pandoc paper.md --template template.tex --natbib -o build/main.tex`.
- `make pdf`: `latexmk -pdf` in `build/` (pdflatex, latexmk and bibtex are installed; texlive 2025).
- `make arxiv`: assemble `build/arxiv/` with `main.tex`, `main.bbl`, `figures/` and `numbers.tex`, test that it compiles from scratch there, and zip it as `build/arxiv.zip`. arXiv wants source, not a PDF made from TeX. Including the `.bbl` avoids depending on arXiv's BibTeX run.

**Numbers from results, not by hand (optional, to decide).** A small script writes `numbers.tex` from the results CSVs (`figs/key_numbers.csv`, `figs/position_*.csv`, and so on), for example `\newcommand{\withincohort}{−4.6}`, and the text uses the macros. That keeps the paper consistent when the fits change. The cost: the Markdown source is harder to read with macros in it. A lighter option is a check script that compares the numbers in the text with the CSVs.

**Figures.** Use the PDFs in `figs/apc/` (vector, already made for post 1). The paper may need a style different from the blog figures: grayscale-safe, larger fonts at column width. Decide when drafting.

**Order of work:**
1. ~~Set up `paper/` with the template and Makefile; get a one-page stub through `make arxiv`.~~ Done 2026-11-06: a placeholder title, two citations, one figure. `make arxiv` writes `build/arxiv.zip` (`main.tex`, `main.bbl`, `figures/`), which compiles from scratch with no warnings except that the placeholder figure is too tall. pandoc 3.1.3; the template defines `\pandocbounded` for newer pandoc versions.
2. Outline: sections and which citations go where (from `docs/literature_review.md`, "Recommended citations").
3. Draft the methods and results first, from the appendix and post 1; then the introduction and discussion.
4. Decide on the new analyses (below) before the results section is final.
5. Read-through; check that `make arxiv` builds cleanly from the zip; upload.

## ANES replication (status 2026-11-06)

Not started. `docs/plan.md` Phase 5 lists it as "later, optional; decide after the GSS results." What exists:

- `~/WorldviewANES/anes_overton.ipynb`: the earlier exploration, a search for controversial ANES questions. Plan Phase 5 refers to `examples/anes_overton`, which isn't in this repo; the notebook in WorldviewANES appears to be the copy that matters.
- The ANES cumulative data file (CDF), release of 2022-09-16 (through 2020), and the 2024 time series as a separate file, both in `~/WorldviewANES/`. A replication through 2024 means merging 2024 onto the CDF, or getting a newer CDF release if ANES has published one (not checked).
- The ANES 7-point liberal–conservative scale (`VCF0803`) plays the role of `polviews`.

Things to settle before fitting: how many ANES attitude items are asked often enough over 1972–2024 to run our selection rule (the ANES has far fewer repeated items than the GSS); which years (presidential years only, or midterms too); weights and the mode changes (ANES went online in 2016–2024).

## Next

1. Allen: confirm the development process. (ANES replication: started as Task 5, `docs/anes_plan.md`, 2026-11-06.)
2. Get and summarize the papers still missing (`docs/literature_review.md`, "Still to get"): Kollman & Jackson and Ellis & Stimson.
3. Decide on framing. The review suggests building the introduction on Peterson et al.'s (2020) open question about why self-labels move more than issue positions, and on Hout's (2021) puzzle of liberal opinion and conservative politics, and treating the symbolic/operational distinction (Ellis & Stimson) as known. It also suggests stating plainly what we add beyond Hout.
4. Open questions for Allen: venue beyond arXiv; whether to add analyses the literature calls for. The candidates are a bound on differential mortality (Pabayo et al. 2015 gives the hazard ratios); comparison with the Fufunan–Jin–Freese mode weights (already suggested in `docs/mode_design.md`); a check for nonlinear age effects; the economic slope through 2018, to reconcile with Hout 2021; and a Fosse–Winship-style bound on the effect of the times (`docs/literature_review.md`, "Objections"). These would be method additions, so they're for discussion, not decided.
5. **ANES replication (decided 2026-11-06):** a replication section in the main text: what replicates and what doesn't, with the mode caveat (`docs/anes_plan.md`).
