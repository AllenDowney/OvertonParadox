---
jupyter:
  jupytext:
    text_representation:
      extension: .md
      format_name: markdown
      format_version: '1.3'
      jupytext_version: 1.19.1
  kernelspec:
    display_name: Python 3 (ipykernel)
    language: python
    name: python3
---

# ANES



[Click here to run this notebook on Colab](https://colab.research.google.com/github/AllenDowney/OvertonParadox/blob/main/notebooks/anes_overton.ipynb)

```python
# Install empiricaldist if we don't already have it

try:
    import empiricaldist
except ImportError:
    !pip install empiricaldist
```

```python
# download utils.py

from os.path import basename, exists


def download(url):
    filename = basename(url)
    if not exists(filename):
        from urllib.request import urlretrieve

        local, _ = urlretrieve(url, filename)
        print("Downloaded " + local)


download(
    "https://github.com/AllenDowney/ProbablyOverthinkingIt/raw/book/notebooks/utils.py"
)
```

```python
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
```

```python
from utils import make_lowess, plot_series_lowess, decorate, underride


def value_counts(series, **options):
    """Make a series of values and the number of times they appear.

    Returns a DataFrame because they get rendered better in Jupyter.

    series: Pandas Series

    returns: Pandas DataFrame
    """
    options = underride(options, dropna=False)
    series = series.value_counts(**options).sort_index()
    series.index.name = "values"
    series.name = "counts"
    return pd.DataFrame(series)
```

```python
def savefig(filename, **options):
    if "dpi" not in options:
        options["dpi"] = 300
    plt.savefig(filename, **options)
```

## Read the Data

[You can get the data here](https://electionstudies.org/data-center/anes-time-series-cumulative-data-file/) -- but you'll need to create an account.

```python
df = pd.read_stata("anes_timeseries_cdf_stata_20220916.dta", convert_categoricals=False)
df.shape
```

```python
column_dict = {
    "VCF0004": "year",
    "VCF0803": "polviews",
    "VCF0301": "partyid",
    "VCF0302": "partyid3",
    "VCF0104": "sex",
    "VCF0101": "age",
    "VCF0009z": "wtsamp",
}

df.rename(columns=column_dict, inplace=True)
```

```python
recode_polviews = {
    1: "Liberal",
    2: "Moderate",
    3: "Conservative",
}
df["polviews3"] = df["VCF0804"].replace(recode_polviews)
df["polviews3"].value_counts()
```

```python
recode_sex = {
    1: "Male",
    2: "Female",
}
df["sex"].replace(recode_sex, inplace=True)
df["sex"].value_counts()
```

```python
df["wtsamp"].describe()
```

```python
value_counts(df["year"])
```

```python
value_counts(df["age"])
```

```python
df["age"].replace(0, np.nan, inplace=True)
```

```python
value_counts(df["polviews"])
```

```python
value_counts(df["VCF0804"])
```

```python
value_counts(df["partyid3"])
```

```python
def resample_by_year(df, column):
    """Resample rows within each year.

    df: DataFrame
    column: string name of weight variable

    returns DataFrame
    """
    grouped = df.groupby("year")
    samples = [resample_rows_weighted(group, column) for _, group in grouped]
    sample = pd.concat(samples, ignore_index=True)
    return sample
```

```python
def percentile_rows(series_seq, ps):
    """Computes percentiles from aligned series.

    series_seq: list of sequences
    ps: cumulative probabilities

    returns: Series of x-values, NumPy array with selected rows
    """
    df = pd.concat(series_seq, axis=1).dropna()
    xs = df.index
    array = df.values.transpose()
    array = np.sort(array, axis=0)
    nrows, _ = array.shape

    ps = np.asarray(ps)
    indices = (ps * nrows).astype(int)
    rows = array[indices]
    return xs, rows
```

```python
def resample_rows_weighted(df, column):
    """Resamples a DataFrame using probabilities proportional to given column.

    df: DataFrame
    column: string column name to use as weights

    returns: DataFrame
    """
    weights = df[column]
    sample = df.sample(n=len(df), replace=True, weights=weights)
    return sample
```

```python
subset = df.query("year >= 1972").copy()
```

```python
sample = resample_by_year(subset, "wtsamp")
subset = sample
```

## Find Controversial Questions

This section explores the questions where we see the biggest difference in responses between liberals and conservatives.

```python
df_con = subset.query('polviews3 == "Conservative"')
df_lib = subset.query('polviews3 == "Liberal"')
```

```python
def compute_diff(col):
    con = df_con[col].dropna().value_counts()
    if len(con) == 0:
        return np.nan
    lib = df_lib[col].dropna().value_counts()
    value = con.idxmax()
    p_con = con[value] / con.sum()
    p_lib = lib.get(value, np.nan) / lib.sum()
    return abs(p_con - p_lib)
```

```python
res = []
for col in subset.columns:
    diff = compute_diff(col)
    res.append((col, diff))

columns = ["name", "diff"]
candidates = (
    pd.DataFrame(res, columns=columns).dropna().sort_values(by="diff", ascending=False)
)
candidates
```

```python
string_to_empty_dict = {key: "" for key in candidates["name"]}
```

Most variables that show a strong difference are questions about political parties and things like that.
I've identified the ones that ask about attitudes, beliefs, and policies.

```python
candidate_dict = {
    "VCF0849": "lib or con",
    "VCF0303": "partyid",
    "VCF0713": "",
    "VCF9204": "",
    "VCF0704": "",
    "VCF0705": "",
    "VCF0704a": "",
    "VCF0706": "",
    "VCF9205": "",
    "VCF9027": "",
    "VCF0487": "",
    "VCF9209": "",
    "VCF0475": "",
    "VCF9212": "",
    "VCF0372": "",
    "VCF0360": "",
    "partyid3": "",
    "VCF9210": "",
    "VCF0734": "",
    "VCF9131": "LESS GOVERNMENT BETTER OR GOVERNMENT DO MORE",
    "VCF0709": "",
    "VCF0386": "",
    "VCF0373": "",
    "VCF0894": "FEDERAL SPENDING- WELFARE PROGRAMS",
    "VCF0481": "",
    "VCF0361": "",
    "VCF0700": "",
    "VCF0374": "",
    "VCF0493": "",
    "VCF0707": "",
    "VCF0736": "",
    "VCF9133": "GOVT TOO INVOLVED IN THINGS OR PROBLEMS REQUIRE",
    "VCF0876a": "LAW TO PROTECT HOMOSEXUALS AGAINST DISCRIMINATION",
    "VCF9238": "SHOULD THE GOVERNMENT MAKE IT MORE DIFFICULT OR EASIER TO BUY A GUN, OR SHOULD THE RULES STAY THE SAME AS THEY ARE NOW",
    "VCF0385b": "",
    "VCF0401": "",
    "VCF0370": "",
    "VCF0371": "",
    "VCF0853": "SHOULD BE MORE EMPHASIS ON TRADITIONAL VALUES",
    "VCF0878": "SHOULD GAYS/LESBIANS BE ABLE TO ADOPT CHILDREN",
    "VCF9228": "MUCH OR SOMEWHAT LARGER/SMALLER GAP IN INCOMES BETWEEN RICH AND POOR IN THE U.S. THAN 20 YEARS AGO",
    "VCF0867a": "AFFIRMATIVE ACTION IN HIRING/PROMOTION",
    "VCF0405": "",
    "VCF0359": "",
    "VCF9085": "",
    "VCF9132": "GOVT HANDLE ECONOMY OR FREE MARKET CAN HANDLE",
    "VCF0877a": "POSITION ON GAYS IN THE MILITARY",
    "VCF9237": "STRENGTH FAVOR/OPPOSE THE DEATH PENALTY FOR PERSONS CONVICTED OF MURDER",
    "VCF9236": "FAVOR OR OPPOSE THE DEATH PENALTY FOR PERSONS CONVICTED OF MURDER",
    "VCF9207": "",
    "VCF9275": "IN AMERICAN POLITICS, DO BLACKS HAVE TOO MUCH, ABOUT THE RIGHT AMOUNT OF, OR TOO LITTLE INFLUENCE",
    "partyid": "",
    "VCF0890": "FEDERAL SPENDING- PUBLIC SCHOOLS",
    "VCF9219": "",
    "VCF0358": "",
    "VCF1043b": "",
    "VCF9086": "",
    "VCF9213": "",
    "VCF0369": "",
    "VCF9211": "",
    "VCF9088": "",
    "VCF0833": "FAVOR OR OPPOSE EQUAL RIGHTS AMENDMENT",
    "VCF0406": "",
    "VCF0601": "APPROVE PARTICIPATION IN PROTESTS",
    "VCF0851": "NEWER LIFESTYLES CONTRIBUTE TO SOCIETY BREAKDOWN",
    "VCF0852": "SHOULD ADJUST VIEW OF MORAL BEHAVIOR TO CHANGES",
    "VCF0867": "AFFIRMATIVE ACTION IN HIRING/PROMOTION",
    "VCF0893": "FEDERAL SPENDING- THE HOMELESS",
    "VCF0846": "IS RELIGION IMPORTANT TO RESPONDENT",
    "VCF9241": "",
    "VCF1004": "",
    "VCF0738": "",
    "VCF0392": "",
    "VCF9215": "",
    "VCF0879a": "INCREASE OR DECREASE NUMBER OF IMMIGRANTS TO U.S. 4-CATEGORY",
    "VCF0889": "FEDERAL SPENDING- AIDS RESEARCH/FIGHT AIDS",
    "VCF9028": "",
    "VCF0876": "LAW TO PROTECT HOMOSEXUALS AGAINST DISCRIMINATION",
    "VCF9216": "",
    "VCF9249": "WHICH IS MORE IMPORTANT FOR A CHILD TO HAVE: INDEPENDENCE OR RESPECT FOR ELDERS",
    "VCF0828": "SHOULD GOVERNMENT CUT MILITARY SPENDING",
    "VCF0838": "WHEN SHOULD ABORTION BE ALLOWED",
    "VCF9247": "WHICH IS MORE IMPORTANT FOR A CHILD TO HAVE: OBEDIENCE OR SELF-RELIANCE",
    "VCF1042b": "",
    "VCF9227": "DOES R THINK THE DIFFERENCE IN INCOMES BETWEEN RICH AND POOR IN THE U.S. IS LARGER, SMALLER, OR ABOUT THE SAME AS 20 YEARS AGO",
    "VCF9040": "BLACKS SHOULD NOT HAVE SPECIAL FAVORS TO SUCCEED",
    "VCF0424": "",
    "VCF9246": "WHICH IS MORE IMPORTANT FOR A CHILD TO HAVE: CURIOSITY OR GOOD MANNERS",
    "VCF0318": "",
    "VCF0826": "DID U.S. DO RIGHT THING GETTING INVOLVED IN WAR (DIFFERENT WARS)",
    "VCF9047": "FEDERAL SPENDING- IMPROVE AND PROTECT THE ENVIRONMENT",
    "VCF9046": "FEDERAL SPENDING- FOOD STAMPS",
    "VCF0391b": "",
    "VCF0603": "APPROVE DEMONSTRATIONS",
    "VCF0602": "APPROVE CIVIL DISOBEDIENCE",
    "VCF0314": "",
    "VCF0808": "GUARANTEED JOBS AND INCOME",
    "VCF9214": "",
    "VCF9084": "",
    "VCF0380": "",
    "VCF9008": "",
    "VCF0877": "FAVOR OR OPPOSE GAYS IN THE MILITARY",
    "VCF0834": "WOMEN EQUAL ROLE SCALE",
    "VCF0387b": "",
    "VCF0866": "",
    "VCF9201": "",
    "VCF0817": "SCHOOL BUSING SCALE",
    "VCF9013": "SOCIETY SHOULD ENSURE EQUAL OPPORTUNITY TO SUCCEED",
    "VCF9014": "WE HAVE GONE TOO FAR PUSHING EQUAL RIGHTS",
    "VCF0738a": "",
    "VCF0402": "",
    "VCF9232": "FAVOR OR OPPOSE THE U.S. GOVERNMENT TORTURING PEOPLE WHO ARE SUSPECTED OF BEING TERRORISTS, TO TRY TO GET INFORMATION",
    "VCF0128": "",
    "VCF0425": "",
    "VCF9037": "GOVERNMENT SHOULD ENSURE FAIR JOBS FOR BLACKS",
    "VCF0363": "",
    "VCF9042": "BLACKS GOTTEN LESS THAN THEY DESERVE OVER THE PAST FEW YEARS",
    "VCF0365": "",
    "VCF9077": "PRESIDENT ON GOVERNMENT HEALTH INSURANCE SCALE",
    "VCF0215": "THERMOMETER",
    "VCF0471": "",
    "VCF0235": "",
    "VCF9051": "SCHOOL PRAYER ALLOWED 2-CATEGORY",
    "VCF0847": "HOW MUCH GUIDANCE FROM RELIGION",
    "VCF9017": "SHOULD WORRY LESS ABOUT HOW EQUAL PEOPLE ARE",
    "VCF1037b": "",
    "VCF0806": "GOVERNMENT HEALTH INSURANCE SCALE",
    "VCF0426": "",
    "VCF0357": "",
    "VCF0130": "",
    "VCF0711": "",
    "VCF0886": "FEDERAL SPENDING- POOR/POOR PEOPLE",
    "VCF9280": "",
    "VCF0442": "",
    "VCF9221": "",
    "VCF0387a": "",
    "VCF0815": "SEGREGATION OR DESEGREGATION",
    "VCF0837": "WHEN SHOULD ABORTION BE ALLOWED",
    "VCF0809": "GUARANTEED JOBS AND INCOME SCALE",
    "VCF0147": "",
    "VCF0212": "",
    "VCF1030b": "",
    "VCF0447": "",
    "VCF9235": "",
    "VCF9202": "",
    "VCF9041": "BLACKS MUST TRY HARDER TO SUCCEED",
    "VCF9014": "WE HAVE GONE TOO FAR PUSHING EQUAL RIGHTS",
    "VCF0381b": "",
    "VCF0830": "AID TO BLACKS SCALE",
    "VCF0443": "",
    "VCF0440": "",
    "VCF0816": "SHOULD GOVERNMENT ENSURE SCHOOL INTEGRATION",
    "VCF0319": "",
    "VCF9087": "",
    "VCF0146": "",
    "VCF0218": "",
    "VCF0356": "",
    "VCF1038": "",
    "VCF0860": "",
    "VCF0224": "",
    "VCF0355": "",
    "VCF0433": "",
    "VCF0845": "",
    "VCF9208": "",
    "VCF0985": "",
    "VCF1032": "",
    "VCF0888": "FEDERAL SPENDING- DEALING WITH CRIME",
    "VCF0427": "",
    "VCF9240": "",
    "VCF0315": "",
    "VCF0381a": "",
    "VCF9015": "BIG PROBLEM THAT NOT EVERYONE HAS EQUAL CHANCE",
    "VCF0892": "FEDERAL SPENDING- FOREIGN AID",
    "VCF9016": "NOT BIG PROBLEM IF SOME HAVE MORE CHANCE IN LIFE",
    "VCF0153b": "",
    "VCF0130a": "",
    "VCF9220": "",
    "VCF0606": "HOW MUCH DOES THE FEDERAL GOVERNMENT WASTE TAX MONEY",
    "VCF0508": "",
    "VCF0384b": "",
    "VCF0748": "",
    "VCF0339": "",
    "VCF9094": "",
    "VCF9078": "",
    "VCF0842": "ENVIRONMENTAL REGULATION SCALE",
    "VCF9231": "FAVOR OR OPPOSE PLACING LIMITS ON IMPORTS TO PROTECT AMERICAN JOBS",
    "VCF0891": "FEDERAL SPENDING- FIN AID FOR COLLEGE STUDENTS",
    "VCF0233": "",
    "VCF0153a": "",
    "VCF0368": "",
    "VCF9081": "",
    "VCF9048": "FEDERAL SPENDING- SPACE/SCIENCE/TECHNOLOGY",
    "VCF9092": "",
    "VCF9039": "CONDITIONS MAKE IT DIFFICULT FOR BLACKS TO SUCCEED",
    "VCF9248": "WHICH IS MORE IMPORTANT FOR A CHILD TO BE: CONSIDERATE OR WELL-BEHAVED",
    "VCF9226": "",
    "VCF0396b": "",
    "VCF1020": "",
    "VCF0338": "",
    "VCF0829": "IS THE GOVERNMENT IN WASHINGTON TOO STRONG",
    "VCF0214": "",
}
```

## Grouping the questions

Some questions are already organized in groups -- like the following four questions about children, or the next group about government spending.

```python
children_dict = {
    "VCF9249": "CHILDREN: INDEPENDENCE OR\nRESPECT FOR ELDERS",
    "VCF9246": "CHILDREN: CURIOSITY OR\nGOOD MANNERS",
    "VCF9247": "CHILDREN: SELF-RELIANCE OR\nOBEDIENCE",
    "VCF9248": "CHILDREN: CONSIDERATE OR\nWELL-BEHAVED",
}
```

```python
spending_dict = {
    "VCF0886": "POOR PEOPLE",
    "VCF0887": "CHILD CARE",
    "VCF0889": "AIDS RESEARCH/FIGHT AIDS",
    "VCF0890": "PUBLIC SCHOOLS",
    "VCF0891": "FIN AID FOR COLLEGE STUDENTS",
    "VCF0893": "THE HOMELESS",
    # 'VCF9046': 'FOOD STAMPS',  limited years
    "VCF9047": "IMPROVE AND PROTECT THE ENVIRONMENT",
    "VCF9048": "SPACE/SCIENCE/TECHNOLOGY",
    "VCF9049": "SOCIAL SECURITY",
    "VCF0888": "DEALING WITH CRIME",
    "VCF0892": "FOREIGN AID",
    "VCF0894": "WELFARE PROGRAMS",
    # 'VCF9050': 'ASSISTANCE TO BLACKS',  limited years
}
```

I selected these questions because the sounded likely to elicit different responses from conservatives and liberals, but it turns out they don't.

```python
nodiff_dict = {
    # first three asked over a short period
    #'VCF0601': 'APPROVE PARTICIPATION\nIN PROTESTS',
    #'VCF0602': 'APPROVE CIVIL DISOBEDIENCE',
    #'VCF0603': 'APPROVE DEMONSTRATIONS',
    "VCF0604": "TRUST THE FEDERAL GOVERNMENT\nTO DO WHAT IS RIGHT",
    "VCF0605": "FEDERAL GOVERNMENT RUN BY FEW INTERESTS\nOR FOR THE BENEFIT OF ALL",
    "VCF0607": "HOW MANY GOVERNMENT OFFICIALS\nARE SMART",
    "VCF0608": "HOW MANY GOVERNMENT OFFICIALS\nARE CROOKED",
    "VCF0609": "GOVERNMENT OFFICIALS CARE\nWHAT PEOPLE LIKE YOU THINK",
}
```

```python
govt_dict = {
    "VCF0606": "HOW MUCH DOES THE FEDERAL\nGOVERNMENT WASTE TAX MONEY",
    "VCF9133": "GOVT TOO INVOLVED IN THINGS",
    "VCF9131": "LESS GOVERNMENT BETTER OR\nGOVERNMENT DO MORE",
    "VCF9132": "GOVT HANDLE ECONOMY OR\nFREE MARKET CAN HANDLE",
    # only asked in two years
    # 'VCF9134': 'MORE IMPORTANT TO BE\nCOOPERATIVE OR SELF-RELIANT'
}
```

Questions about [moral foundations](https://en.wikipedia.org/wiki/Moral_foundations_theory) elicit big differences.

```python
moral_dict = {
    "VCF0853": "SHOULD BE MORE EMPHASIS ON TRADITIONAL VALUES",
    "VCF0851": "NEWER LIFESTYLES CONTRIBUTE TO SOCIETY BREAKDOWN",
    "VCF0852": "SHOULD ADJUST VIEW OF MORAL BEHAVIOR TO CHANGES",
    "VCF0854": "SHOULD BE TOLERANT OF DIFFERENT MORAL STANDARDS",
}
```

```python
equality_dict = {
    "VCF9013": "SOCIETY SHOULD ENSURE EQUAL\nOPPORTUNITY TO SUCCEED",
    "VCF9014": "WE HAVE GONE TOO FAR\nPUSHING EQUAL RIGHTS",
    "VCF9015": "BIG PROBLEM THAT NOT\nEVERYONE HAS EQUAL CHANCE",
    "VCF9016": "NOT BIG PROBLEM IF\nSOME HAVE MORE CHANCE IN LIFE",
    "VCF9017": "SHOULD WORRY LESS ABOUT\nHOW EQUAL PEOPLE ARE",
    "VCF9018": "FEWER PROBLEMS IF\nEVERYONE TREATED EQUALLY",
}
```

But I am mostly interested in questions related to concrete public policies, as opposed to abstract philosophies.

I also tried to find questions that overlap as much as possible with the 15 questions I used in Chapter 12.

```python
policy_dict = {
    "VCF0876": "LAW TO PROTECT HOMOSEXUALS AGAINST DISCRIMINATION",
    "VCF0877": "FAVOR OR OPPOSE GAYS IN THE MILITARY",
    "VCF0878": "SHOULD GAYS/LESBIANS BE ABLE TO ADOPT CHILDREN",
    "VCF0879a": "INCREASE OR DECREASE NUMBER OF IMMIGRANTS TO U.S.",
    "VCF9238": "MORE DIFFICULT OR EASIER TO BUY A GUN",
    "VCF9236": "FAVOR OR OPPOSE THE DEATH PENALTY FOR MURDER",
    # limited years
    # 'VCF9232': 'TORTURING PEOPLE WHO ARE SUSPECTED OF BEING TERRORISTS',
    "VCF9231": "LIMITS ON IMPORTS TO PROTECT AMERICAN JOBS",
    # not much diff
    # 'VCF9230': 'ENCOURAGE OR DISCOURAGE REPLACE U.S. WORKERS WITH FOREIGN WORKERS',
    # 'VCF0823': 'BETTER OFF IF U.S. UNCONCERNED WITH REST OF WORLD',
    "VCF0838": "WHEN SHOULD ABORTION BE ALLOWED",
    "VCF9043": "SCHOOL PRAYER ALLOWED",
    "VCF0816": "SHOULD GOVERNMENT ENSURE SCHOOL INTEGRATION",
    "VCF9037": "SHOULD GOVERNMENT ENSURE FAIR JOBS FOR BLACKS",
    "VCF0867a": "AFFIRMATIVE ACTION IN HIRING/PROMOTION",
}
```

```python
scale_dict = {
    "VCF0842": "ENVIRONMENTAL REGULATION SCALE",
    "VCF0843": "DEFENSE SPENDING SCALE",
    # limited years
    # 'VCF0844': 'HOW WILLING SHOULD U.S. BE TO USE MILITARY FORCE',
    "VCF0806": "GOVERNMENT HEALTH INSURANCE SCALE",
}
```

## Data cleaning

The following sections clean the data, primarily by replacing special codes for unasked, unanswered, or "don't know" with NaN.

```python
for col in scale_dict:
    print(f"'{col}': [1, 2],")
    subset[col].replace([8, 9, 0], np.nan, inplace=True)
```

```python
for col in policy_dict:
    print(f"'{col}': [1],")
    subset[col].replace([7, 8, 9, 0, -7, -8, -9], np.nan, inplace=True)
```

```python
for i in range(1, 5):
    col = f"VCF085{i}"
    print(col)
    subset[col].replace([8, 9, 0], np.nan, inplace=True)
```

```python
for i in range(1, 5):
    col = f"VCF085{i}"
    print(col)
    subset[col].replace([8, 9, 0], np.nan, inplace=True)
```

```python
for i in range(3, 9):
    col = f"VCF901{i}"
    print(col)
    subset[col].replace([8, 9, 0], np.nan, inplace=True)
```

```python
for i in range(6, 10):
    col = f"VCF924{i}"
    print(col)
    subset[col].replace([-8, -9], np.nan, inplace=True)
```

```python
for i in range(1, 10):
    col = f"VCF060{i}"
    print(col)
    subset[col].replace([0, 9], np.nan, inplace=True)
```

```python
for i in range(1, 5):
    col = f"VCF913{i}"
    print(col)
    subset[col].replace([8, 9], np.nan, inplace=True)
```

```python
for i in range(86, 95):
    col = f"VCF08{i}"
    print(f"'{col}': [3, 7],")
    subset[col].replace([8, 9], np.nan, inplace=True)
```

```python
for i in range(46, 51):
    col = f"VCF90{i}"
    print(f"'{col}': [3, 7],")
    subset[col].replace([8, 9], np.nan, inplace=True)
```

```python
value_counts(subset["VCF9050"])
```

```python
conservative_values = {
    "VCF0601": [1],
    "VCF0602": [1],
    "VCF0603": [1],
    "VCF0604": [1, 2],
    "VCF0605": [2],
    "VCF0606": [1],
    "VCF0607": [1],
    "VCF0608": [1],
    "VCF0609": [1],
    "VCF0851": [1, 2],
    "VCF0852": [4, 5],
    "VCF0853": [1, 2],
    "VCF0854": [4, 5],
    "VCF9013": [3, 4, 5],
    "VCF9014": [1, 2],
    "VCF9015": [3, 4, 5],
    "VCF9016": [1, 2],
    "VCF9017": [1, 2],
    "VCF9018": [3, 4, 5],
    "VCF9131": [1],
    "VCF9132": [2],
    "VCF9133": [1],
    "VCF9134": [2],
    "VCF9246": [3],
    "VCF9247": [1],
    "VCF9248": [3],
    "VCF9249": [3],
    "VCF0886": [3, 7],
    "VCF0887": [3, 7],
    "VCF0888": [1],  # dealing with crime
    "VCF0889": [3, 7],
    "VCF0890": [3, 7],
    "VCF0891": [3, 7],
    "VCF0892": [3, 7],
    "VCF0893": [3, 7],
    "VCF0894": [3, 7],
    "VCF9046": [3, 7],
    "VCF9047": [3, 7],
    "VCF9048": [3, 7],
    "VCF9049": [3, 7],
    "VCF9050": [3, 7],
    "VCF0876": [5],
    "VCF0877": [5],
    "VCF0878": [5],
    "VCF0879a": [5],
    "VCF9238": [2, 3],
    "VCF9236": [1],
    "VCF9232": [1],
    "VCF9231": [1],
    "VCF9230": [2, 3],  # not much difference
    "VCF0838": [1, 2],
    "VCF9043": [3, 4],
    "VCF0816": [2],
    "VCF9037": [5],
    "VCF0818": [4, 5],
    "VCF0823": [1],
    "VCF0867a": [5],
    "VCF0842": [5, 6, 7],
    "VCF0843": [5, 6, 7],
    "VCF0806": [5, 6, 7],
}
```

## Analysis

```python
def make_questions(df, issue_dict):
    questions = pd.DataFrame(dtype=float)

    for varname in issue_dict:
        questions[varname] = (
            df[varname].isin(conservative_values[varname]).astype(float)
        )
        null = subset[varname].isna()
        questions.loc[null, varname] = np.nan

    return questions
```

```python
def add_column(df, column):
    return pd.concat([df, column], axis=1)
```

```python
def make_time_series(df, questions):
    questions_year = add_column(questions, subset["year"])
    over_time = questions_year.groupby("year").mean() * 100
    return over_time
```

```python
from scipy.stats import linregress


def find_slopes(over_time, issue_dict):
    res = []
    for column in over_time.columns:
        desc = issue_dict[column].replace("\n", " ").capitalize()
        series = over_time[column].dropna()
        result = linregress(series.index, series.values)
        res.append((column, result.slope, desc))

    columns = ["name", "slope", "desc"]
    return pd.DataFrame(res, columns=columns).sort_values(by="slope")
```

```python
def plot_over_time(over_time, title="", lowess=False):
    for column in over_time.columns:
        if lowess:
            plot_series_lowess(over_time[column], color="C0", alpha=0.5, label="")
        else:
            over_time[column].dropna().plot(style=".-", alpha=0.5)

    decorate(
        xlabel="Year of survey",
        ylabel="Percent",
        title=title,
    )
```

```python
def make_diff_table(questions, df, varname):
    augmented = pd.concat([questions, df[varname]], axis=1)
    table = augmented.groupby(varname).mean().transpose() * 100
    return table
```

```python
polview_names = ["Conservative", "Moderate", "Liberal"]

muted = sns.color_palette("muted", 5)
polview_color_map = dict(zip(polview_names, [muted[3], muted[4], muted[0]]))
marker_map = dict(zip(polview_names, ["s", "^", "o"]))
line_map = dict(zip(polview_names, [":", "-.", "--"]))
```

```python
def plot_differences(table):
    plt.figure(figsize=(7, 4.5))
    plt.hlines(
        issue_names,
        table["Liberal"],
        table["Conservative"],
        color="gray",
        alpha=0.2,
    )

    for polview, color in reversed(polview_color_map.items()):
        x = table[polview]
        marker = marker_map[polview]
        plt.plot(x, issue_names, marker, color=color, alpha=0.9, label=polview)

    decorate(xlabel="Percent choosing conservative responses")
    plt.gca().invert_yaxis()
```

```python
from scipy.special import logit
from scipy.special import expit
from scipy.stats import norm
from empiricaldist import Pmf


def infer_missing(questions, df):
    ds = -logit(questions.mean().values)

    es = np.linspace(-6, 6, 21)
    E, D = np.meshgrid(es, ds)
    P = expit(E - D)
    Q = 1 - P
    ns = P.sum(axis=0)

    ps = norm.pdf(es, 0, 4)
    prior = Pmf(ps, es)
    prior.normalize()

    n, m = questions.shape
    size = n, m, len(es)
    res = np.empty(size)

    a = questions.fillna(2).astype(int).values
    ii, jj = np.nonzero(a == 0)
    res[ii, jj, :] = Q[jj]
    ii, jj = np.nonzero(a == 1)
    res[ii, jj, :] = P[jj]
    ii, jj = np.nonzero(a == 2)
    res[ii, jj, :] = 1

    product = res.prod(axis=1) * prior.values
    posterior = product / product.sum(axis=1)[:, None]
    con = (posterior * ns).sum(axis=1)

    answered = questions.notna().sum(axis=1)

    df["conservatism"] = pd.Series(con, df.index)
    df.loc[answered < 3, "conservatism"] = np.nan
    print(df["conservatism"].notna().sum())
```

```python
def plot_con(df):
    series = df.groupby("year")["conservatism"].mean()

    plot_series_lowess(series, frac=0.7, color="C0", label="", plot_series=True)
    decorate(
        xlabel="Year of survey",
        ylabel="Number of conservative responses",
        title="Conservative responses vs year, all respondents",
    )
```

```python
def plot_by_polviews(df):
    table = df.pivot_table(index="year", columns="polviews3", values="conservatism")

    columns = ["Conservative", "Moderate", "Liberal"]
    options = dict(frac=0.6, plot_series=True)

    for column in columns:
        plot_series_lowess(
            table[column],
            ls=line_map[column],
            color=polview_color_map[column],
            **options
        )

    # plot_series_lowess(series, ls="-", color="gray", alpha=0.5, label="overall")

    decorate(
        xlabel="Year",
        ylabel="Number of conservative responses",
        title="Conservative responses vs year, grouped by alignment",
    )
```

```python
def plot_by_sex(df):
    table = df.pivot_table(index="year", columns="sex", values="conservatism")

    columns = ['Male', 'Female']
    options = dict(frac=0.6, plot_series=True)

    color_map = dict(zip(columns, ['C0', 'C1']))
    label_map = dict(zip(columns, ['Male', 'Female']))

    for column in columns:
        plot_series_lowess(table[column], 
                           color=color_map[column], 
                           label=label_map[column], 
                           **options)

    decorate(xlabel="Year of survey", 
             ylabel="Number of conservative responses",
             title="Conservative responses vs year, grouped by sex",
    )

```

## Make the figures

```python
issue_dict = {**policy_dict, **moral_dict}
issue_dict = {**spending_dict, **scale_dict}
issue_dict = {**policy_dict, **moral_dict, **spending_dict, **scale_dict}
```

```python
issue_names = [name.capitalize() for name in issue_dict.values()]
len(issue_names)
```

```python
questions = make_questions(subset, issue_dict)
over_time = make_time_series(subset, questions)
slopes = find_slopes(over_time, issue_dict)
diff_table = make_diff_table(questions, subset, "polviews3")
infer_missing(questions, subset)
slopes
```

```python
plot_over_time(over_time)
savefig("anes_overton1.png")
```

```python
xtab = pd.crosstab(subset["year"], subset["VCF9037"], normalize="index") * 100
xtab
```

```python
plot_differences(diff_table)
savefig("anes_overton2.png")
```

```python
plot_con(subset)
savefig("anes_overton3.png")
```

```python
plot_by_polviews(subset)
savefig("anes_overton4.png")
```

```python
plot_by_sex(subset)
savefig("anes_overton5.png")
```

```python
young = subset.query("age < 30")
plot_by_sex(young)
plt.title("Conservative responses vs year, grouped by sex, age < 30")
savefig("anes_overton6.png")
```

```python
recent = young.query('year>=2000')
recent
```

```python
male = recent.query('sex=="Male"')
female = recent.query('sex=="Female"')
len(male), len(female)
```

```python
def sample(series):
    return series.sample(10000, replace=True).reset_index(drop=True)
```

```python
male_sample = sample(male['conservatism'])
female_sample = sample(female['conservatism'])
diff = male_sample - female_sample
diff.describe()
```

```python
from empiricaldist import Cdf

Cdf.from_seq(diff).plot()
```

```python
diff.abs().median()
```

```python
(diff.abs() <= 3).mean()
```

## 2024 pilot data

```python
filename = 'anes_pilot_2024_20240319.dta'
df = pd.read_stata(filename, convert_categoricals=False)
df.shape
```

```python
df.head()
```

```python
df.columns.values
```

```python
value_counts(df['gender'])
```

```python
df['age'] = df['age'].replace(-9, np.nan)
value_counts(df['age'])
```

```python
df['weight'].describe()
```

```python
varname = 'follow_campinterest'
value_counts(df[varname])
```

```python
sample = df.sample(len(df), replace=True, weights=df['weight'])
```

```python
df_male = sample.query('gender == 1')
df_female = sample.query('gender == 2')
len(df_male), len(df_female)
```

```python
def compute_diff(col, flag):
    male = df_male[col].dropna().value_counts()
    female = df_female[col].dropna().value_counts()
    if len(male) == 0 or len(female) == 0:
        return np.nan
    
    if flag:
        value = male.idxmax()
    else:
        value = female.idxmax()
        
    p_male = male.get(value, np.nan) / male.sum()
    p_female = female.get(value, np.nan) / female.sum()
    return p_male - p_female
```

```python
res = []
for col in df.columns:
    diff1 = compute_diff(col, True)
    diff2 = compute_diff(col, False)
    res.append((col, diff1, diff2))
```

```python
columns = ["varname", "diff1", 'diff2']
diff_df = pd.DataFrame(res, columns=columns).dropna()
```

```python
diff1 = diff_df['diff1']
diff2 = diff_df['diff2']
diff_df['absdiff'] = np.maximum(diff_df['diff1'].abs(), diff_df['diff2'].abs())
```

```python
candidates = (
    diff_df.sort_values(by="absdiff", ascending=False)
)
candidates.index = candidates['varname']
candidates = candidates.drop(columns=['varname']) * 100
candidates.head(50)
```

```python
candidates.to_csv('anes_2024_candidates_resampled.csv')
```

```python
def compare_responses(varname):
    d = dict(male=value_counts(df_male[varname], normalize=True)['counts'],
             female=value_counts(df_female[varname], normalize=True)['counts'])
    summary = pd.DataFrame(d)
    summary['diff'] = summary['male'] - summary['female']
    summary['absdiff'] = summary['diff'].abs()
    return summary
```

```python
compare_responses('pew_prayer') * 100
```

```python

```
