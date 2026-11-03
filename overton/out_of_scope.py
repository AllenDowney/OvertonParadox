"""Out-of-scope questions readers can add back in the Overtron (Allen, 2026-11-03).

The pool's scope rule (overton/scope.py) excludes religion and behaviors, as the
book did. The Overtron lets readers add two such groups back: religious belief
and practice, and guns and hunting. They aren't candidates for the decided pool;
they're coded and scored the same way as the 170 so a reader can see what
including them would do:

- coding: the best contiguous split of the response scale between conservatives
  and liberals (overton/coding.py, response_differences and best_cut), with
  volunteered non-answers (and owngun's "refused") as not conservative;
- strength: the book's find_questions model (overton/ranking.py, score), the
  polviews coefficient.

Only the respondent's own beliefs and practice are included: not denomination
codes (unordered), nor questions about the spouse or about age 16. `attend`
isn't in the candidate extract (it has 9 response codes, over the gate's 7), so
it comes from the full extract.

Usage: python -m overton.out_of_scope   (prints the codings, for review)
"""

import numpy as np
import pandas as pd

from overton.coding import NOT_A_POSITION, best_cut, parse_labels, response_differences
from overton.data import CANDIDATES_PRIMARY, EXTRACT, WEIGHT_COL
from overton.pipeline import FIG_DIR
from overton.ranking import code_responses, score

ADDED = {
    "Religious belief and practice": [
        "attend", "pray", "reliten", "fund", "bible", "god", "postlife", "reborn", "savesoul",
        "relpersn", "sprtprsn", "popespks", "mapa", "mastersp", "judgeluv", "frndking"],
    "Guns and hunting": ["owngun", "hunt"],
}
SCOPE_REASON = {"Religious belief and practice": "out of scope: religion", "Guns and hunting": "out of scope: behavior"}

# scale order where the codes aren't in order (low to high)
SCALE_ORDER = {
    "reliten": [4, 2, 3, 1],  # no religion, not very strong, somewhat strong, strong
    "hunt": [4, 2, 1, 3],  # neither, spouse, respondent, both
}
NOT_POSITION = NOT_A_POSITION + ["refused"]  # owngun codes "refused" as a valid answer

ATTEND = dict(
    description="how often r attends religious services", question="How often do you attend religious services?",
    value_labels="[0] never / [1] less than once a year / [2] about once or twice a year / [3] several times a year / "
                 "[4] about once a month / [5] 2-3 times a month / [6] nearly every week / [7] every week / "
                 "[8] several times a week",
)
MIN_PER_WAVE = 100  # as overton/candidates.py


def load():
    """The primary sample with attend merged in, the ranking's weights, and polviews3."""
    gss = pd.read_hdf(CANDIDATES_PRIMARY, "gss")
    attend = pd.read_hdf(EXTRACT, "gss")[["year", "id", "attend"]]
    gss = gss.merge(attend, on=["year", "id"], how="left", validate="one_to_one")
    gss["w"] = gss[WEIGHT_COL] / gss[WEIGHT_COL].mean()
    recode = {1: "Liberal", 2: "Liberal", 3: "Liberal", 4: "Moderate"}
    gss["polviews3"] = gss["polviews"].map(lambda x: recode.get(x, "Conservative") if pd.notna(x) else np.nan)
    return gss


def metadata():
    """Description and value labels from the candidate scope table (attend from the codebook)."""
    scope = pd.read_csv(FIG_DIR / "candidates_scope.csv", index_col=0)
    names = [v for names in ADDED.values() for v in names]
    out = {v: dict(description=scope.loc[v, "description"], question=scope.loc[v, "question"],
                   value_labels=scope.loc[v, "value_labels"])
           for v in names if v != "attend"}
    out["attend"] = ATTEND
    return out


def code_all(gss):
    meta = metadata()
    rows = []
    for category, names in ADDED.items():
        for v in names:
            labels = parse_labels(meta[v]["value_labels"])
            diff = response_differences(gss, v)
            not_position = sorted(c for c in diff.index if labels.get(c, "").lower() in NOT_POSITION)
            positions = diff.drop(not_position)
            order = [float(c) for c in SCALE_ORDER.get(v, sorted(positions.index))]
            conservative, separation = best_cut(positions, order)
            coded = code_responses(gss, {v: conservative})
            param, n = score(gss, coded, v)
            asked = gss[gss[v].notna() & gss["polviews"].notna()].groupby("year").size()
            waves = asked[asked >= MIN_PER_WAVE]
            rows.append(dict(
                variable=v, category=category, scope_reason=SCOPE_REASON[category], description=meta[v]["description"],
                question=meta[v]["question"],
                value_labels=meta[v]["value_labels"], conservative=[int(c) for c in sorted(conservative)],
                conservative_labels="; ".join(labels.get(c, f"{c:g}") for c in sorted(conservative)),
                separation=float(separation), polviews_param=float(param), n=int(n),
                waves=len(waves), first=int(waves.index.min()), last=int(waves.index.max()),
                differences=" ".join(f"{c:g}:{d:+.1f}" for c, d in diff.items())))
    return pd.DataFrame(rows).set_index("variable")


def main():
    table = code_all(load())
    pd.set_option("display.width", 250)
    print(table[["category", "description", "conservative_labels", "separation", "polviews_param", "waves", "first", "last"]]
          .to_string(max_colwidth=48))


if __name__ == "__main__":
    main()
