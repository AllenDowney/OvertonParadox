"""Subject categories for the Overtron's question picker (docs/overtron_plan.md, milestone 5).

For browsing only: the picker groups the 170 candidates, and the out-of-scope
questions readers can add back (overton/out_of_scope.py), by subject, with a
select-all box per category. The categories don't enter any analysis (topics,
in overton/topics.py, are what the pool's redundancy rule uses). Assigned by
hand, 2026-11-03; draft for Allen's review (docs/overtron_categories.md).

    python -m overton.question_categories   # writes docs/overtron_categories.md
"""

CATEGORIES = {
    "Sex and sexuality": [
        "homosex", "premarsx", "teensex", "xmarsex", "pillok", "sexeduc",
        "pornlaw", "pornmorl", "pornrape", "pornout", "porninf"],
    "Abortion": ["abany", "abdefect", "abnomore", "abpoor", "abrape", "absingle", "abhlth"],
    "Gender and family": [
        "fefam", "fehelp", "fehome", "fework", "fechld", "fepresch", "fepol", "fepres",
        "fejobaff", "fehire", "discaffw", "discaffm", "meovrwrk", "divlaw", "aged"],
    "Child-rearing": ["spanking", "obey", "popular", "thnkself", "workhard", "helpoth"],
    "Race": [
        "helpblk", "natrace", "natracey", "wrkwayup", "racdif1", "racdif2", "racdif3", "racdif4",
        "affrmact", "discaff", "busing", "racopen", "racseg", "racpush", "racchng", "racfew",
        "racmar", "racpres", "marblk", "marhisp", "marasian", "marwht", "liveblks", "livewhts",
        "workblks", "workwhts", "wlthblks", "wlthwhts", "intlblks", "intlwhts"],
    "Government and the economy": [
        "helppoor", "helpnot", "helpsick", "eqwlth", "goveqinc", "jobsall", "getahead", "tax"],
    "Government spending": [
        "natarms", "natarmsy", "natenvir", "natenviy", "natfare", "natfarey", "natheal", "nathealy",
        "nateduc", "nateducy", "natcity", "natcityy", "natcrime", "natcrimy", "natdrug", "natdrugy",
        "nataid", "nataidy", "natspac", "natspacy", "natchld", "natsci", "natmass", "natpark",
        "natsoc", "natroad"],
    "Crime, police, and violence": [
        "cappun", "courts", "gunlaw", "grass", "wirtap", "polescap", "polhitok", "polabuse",
        "polattak", "polmurdr", "hitok", "hitrobbr", "hitbeatr", "hitchild", "hitmarch", "hitdrunk"],
    "Civil liberties": [
        "colhomo", "spkhomo", "libhomo", "colcom", "spkcom", "libcom", "colath", "spkath", "libath",
        "colmil", "spkmil", "libmil", "colrac", "spkrac", "librac", "colmslm", "spkmslm", "libmslm"],
    "End of life": ["letdie1", "suicide1", "suicide2", "suicide3", "suicide4"],
    "Science": ["advfront", "toofast", "nextgen"],
    "Immigration and world affairs": ["letin1a", "usun", "usintl", "commun"],
    # out of scope for the pool, addable in the Overtron (overton/out_of_scope.py); prayer is in scope
    "Religious belief and practice": [
        "prayer", "attend", "pray", "reliten", "fund", "bible", "god", "postlife", "reborn", "savesoul",
        "relpersn", "sprtprsn", "popespks", "mapa", "mastersp", "judgeluv", "frndking"],
    "Guns and hunting": ["owngun", "hunt"],
    "Trust and confidence": [
        "trust", "fair", "helpful", "anomia5", "anomia6", "anomia7", "world1",
        "conpress", "contv", "conlabor", "conbus", "confinan", "conclerg", "coneduc",
        "conarmy", "conlegis", "confed", "conjudge", "consci", "conmedic"],
}

CATEGORY_OF = {v: name for name, names in CATEGORIES.items() for v in names}


def check(candidates):
    """Every candidate in exactly one category, and nothing else."""
    listed = [v for names in CATEGORIES.values() for v in names]
    duplicates = sorted({v for v in listed if listed.count(v) > 1})
    missing = sorted(set(candidates) - set(listed))
    extra = sorted(set(listed) - set(candidates))
    assert not (duplicates or missing or extra), dict(duplicates=duplicates, missing=missing, extra=extra)


def main():
    import json

    from overton import paths

    table = json.loads((paths.ROOT / "overtron/public/data/v1/questions.json").read_text())["questions"]
    check(table)
    lines = [
        "# Overtron question categories (draft for review)",
        "",
        "Subject categories for the Overtron's question picker, assigned by hand (2026-11-03), from "
        "`overton/question_categories.py`. They're for browsing only and don't enter any analysis. "
        "Status: **primary** if the question is one of the primary questions, otherwise the reasons it was excluded. "
        "In each category, the primary questions come first, as in the picker.",
        "",
    ]
    for name, names in CATEGORIES.items():
        n_primary = sum(table[v]["in_primary"] for v in names)
        lines += [f"## {name} ({len(names)} questions, {n_primary} primary)", "", "| Question | Description | Status |", "|---|---|---|"]
        for v in sorted(names, key=lambda v: not table[v]["in_primary"]):  # primary first, as the picker shows them
            q = table[v]
            status = "**primary**" if q["in_primary"] else ", ".join(q["excluded_because"])
            lines.append(f"| `{v}` | {q['description']} | {status} |")
        lines.append("")
    out = paths.ROOT / "docs/overtron_categories.md"
    out.write_text("\n".join(lines))
    print(out, sum(map(len, CATEGORIES.values())), "questions in", len(CATEGORIES), "categories")


if __name__ == "__main__":
    main()
