# Data

Not in git. The analysis reads these files:

| File | What | Made by |
|---|---|---|
| `gss_extract_2024_r3a.hdf` | GSS 1972–2024 extract (release 3a) | copied from `~/CultureWar/notebooks/` by `overton.data` |
| `gss_overton_resampled_2024.hdf` | three weighted resamplings of the extract (keys `gss0`–`gss2`) | `overton.data` |
| `gss_overton_candidates_r3a.hdf` | all candidate questions, from the full GSS cumulative file | `overton.candidates` |
| `gss_overton_candidates_resampled.hdf` | three weighted resamplings of the candidate extract | `overton.data.make_candidates_resampled` |
| `gss_pacs_resampled.hdf` | the book's data file (Chapter 12), for reproducing the book | copied from ProbablyOverthinkingIt |

`overton.candidates` also reads, from `~/CultureWar`:
- the raw cumulative file, `data/raw/gss7224_r3a.dta.gz`;
- the codebook, `codebook/extracted/gssrdoc_dict_flat.json`;
- the variable catalog, `notebooks/variable_metadata/variables.yaml`.

**To do:** replace the CultureWar dependencies with a download from the GSS (NORC) and a codebook source in this repo, so the data can be built from a fresh clone.

Order of the build steps: `scripts/build_data.sh`.
