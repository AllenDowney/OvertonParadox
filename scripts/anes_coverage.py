"""Count, for each ANES CDF variable, the survey years in which it has valid responses.

Reads the Stata file in chunks to keep memory low. Writes a CSV with one row per
variable: name, label, number of years, first year, last year, years list, mean n per year.

Usage: python -I anes_coverage.py <cdf.dta> <out.csv>
"""
import sys
from collections import defaultdict

import pandas as pd

path, out = sys.argv[1], sys.argv[2]

reader = pd.read_stata(path, chunksize=5000, convert_categoricals=False)
labels = None
counts = defaultdict(lambda: defaultdict(int))  # var -> year -> valid n

for chunk in reader:
    if labels is None:
        labels = reader.variable_labels()
    year = chunk["VCF0004"].astype(int)
    valid = chunk.notna()
    # Stata missing codes are converted to NaN; ANES also uses codes like 0, 8, 9 for DK/NA,
    # which this count does not exclude. Good enough for a first coverage pass.
    per_year = valid.groupby(year).sum()
    for y, row in per_year.iterrows():
        for var, n in row.items():
            if n:
                counts[var][y] += int(n)

rows = []
all_years = sorted({y for v in counts.values() for y in v})
for var, yd in counts.items():
    years = sorted(y for y, n in yd.items() if n > 0)
    rows.append(
        dict(
            var=var,
            label=labels.get(var, ""),
            n_years=len(years),
            first=years[0],
            last=years[-1],
            span=years[-1] - years[0],
            mean_n=round(sum(yd.values()) / len(years)),
            years=" ".join(str(y) for y in years),
        )
    )
df = pd.DataFrame(rows).sort_values(["n_years", "var"], ascending=[False, True])
df.to_csv(out, index=False)
print("survey years in file:", len(all_years), all_years[0], "-", all_years[-1])
print(all_years)
print("variables:", len(df))
