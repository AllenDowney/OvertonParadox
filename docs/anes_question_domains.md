# Classifying the ANES pool as social or economic

*Reviewed by Allen, 2026-11-06: accepted as written, except immigration (`VCF0879`), which is "neither"; the fourth core economic question is `VCF0839`. Board Task 5; plan `docs/anes_plan.md`.*

The ANES replication should test the GSS domain result: social questions move liberal within cohorts, and core economic questions polarize and move conservative. This classifies the 32 questions in the ANES pool by the rules already reviewed for the GSS (`docs/question_domains.md`, review of 2026-10-31), before any domain fits are run.

## Rules carried over from the GSS

- **Economic:** the role of government in the economy, redistribution and the welfare state, taxes, trade, and spending on domestic programs; also beliefs about economic opportunity and equality.
- **Social:** sexuality, reproduction, family and gender roles, religion and morality, crime and punishment, civil liberties, and race relations (beliefs about race, discrimination, civil rights).
- **Both:** government economic help for a particular racial group (as `helpblk`), and spending on a social problem (as `natdrug`).
- **Neither:** foreign and defense policy.

## Classification

Questions are in rank order (ranking coefficient on `VCF0803`, `scripts/anes_ranking.py`). "Lower confidence" marks the calls to look at.

| # | Question | Topic | Coef | Domain | Notes |
|---|---|---|---|---|---|
| 1 | `VCF0842` | Environmental regulation (tougher vs too much burden on business) | 0.85 | Economic | Lower confidence: environment is sometimes its own dimension (as `natenvir` in the GSS, also economic) |
| 2 | `VCF0806` | Government health insurance vs private plans | 0.65 | Economic | **Core** (≈ `helpsick`) |
| 3 | `VCF9040` | Blacks should work their way up without special favors (racial resentment) | 0.64 | Social | Race relations |
| 4 | `VCF0853` | More emphasis on traditional values (moral traditionalism) | 0.62 | Social | |
| 5 | `VCF0830` | Government should help Blacks and minorities vs they should help themselves | 0.61 | Both | Same rule as `helpblk` |
| 6 | `VCF0878` | Gays and lesbians should be able to adopt | 0.59 | Social | |
| 7 | `VCF0838` | Abortion law | 0.58 | Social | |
| 8 | `VCF0839` | Government services and spending (fewer services vs more) | 0.58 | Economic | **Core** (role of government; the closest match to `eqwlth`'s place, see below) |
| 9 | `VCF0809` | Government should see to jobs and a good standard of living | 0.57 | Economic | **Core** (≈ `helppoor`) |
| 10 | `VCF9017` | We should worry less about how equal people are (egalitarianism) | 0.55 | Economic | Lower confidence: a value about equality; the GSS counts beliefs about opportunity (`getahead`) as economic, but in the broad set, not the core |
| 11 | `VCF0894` | Federal spending: welfare programs | 0.54 | Economic | Domestic program (the GSS `natfare` would be economic) |
| 12 | `VCF9047` | Federal spending: environment | 0.53 | Economic | As `natenvir` |
| 13 | `VCF0867` | Affirmative action in hiring and promotion | 0.52 | Social | Race relations, as `discaff` and `affrmact`. Lower confidence: about jobs |
| 14 | `VCF0843` | Defense spending scale | 0.51 | Neither | Defense, as `natarms` |
| 15 | `VCF0876` | Laws to protect gays against job discrimination | 0.49 | Social | |
| 16 | `VCF9131` | The less government the better vs government should do more | 0.47 | Economic | **Core** (≈ `helpnot`) |
| 17 | `VCF9274` | Blacks have too much / too little influence | 0.47 | Social | Race relations |
| 18 | `VCF9236` | Death penalty | 0.44 | Social | As `cappun` |
| 19 | `VCF0877` | Gays in the military | 0.44 | Social | |
| 20 | `VCF0811` | Urban unrest: solve poverty vs use force | 0.43 | Social | Lower confidence: crime and order, but one side is an economic remedy; could be both |
| 21 | `VCF9249` | Child should have independence vs respect for elders | 0.42 | Social | Child-rearing, as `popular` |
| 22 | `VCF0890` | Federal spending: public schools | 0.42 | Economic | As `nateduc` |
| 23 | `VCF0816` | Government should ensure school integration | 0.34 | Social | Civil rights |
| 24 | `VCF0879` | Number of immigrants: increase or decrease | 0.33 | Neither | No GSS precedent in the pool; cultural or economic depending on framing. Neither (Allen, 2026-11-06) |
| 25 | `VCF0834` | Women's equal role vs place in the home | 0.31 | Social | As `fefam` |
| 26 | `VCF0814` | Civil rights pushes too fast or not fast enough | 0.31 | Social | Civil rights |
| 27 | `VCF9231` | Limits on imports to protect jobs | 0.28 | Economic | Lower confidence: trade; the conservative side (favor limits) doesn't fit a left–right economic reading |
| 28 | `VCF9019` | Most important national goal (order, say, prices, free speech) | 0.20 | Neither | Lower confidence: a value battery (materialism / postmaterialism), not a policy; could be social |
| 29 | `VCF0888` | Federal spending: crime | 0.19 | Both | Spending on a social problem, as `natdrug`. Lower confidence: could be social |
| 30 | `VCF9049` | Federal spending: Social Security | 0.17 | Economic | As `natsoc` |
| 31 | `VCF9048` | Federal spending: science and technology | 0.15 | Economic | As `natspac` (which the GSS item-drift review excluded) |
| 32 | `VCF0892` | Federal spending: foreign aid | 0.14 | Neither | As `nataid` |

**Counts:** economic 12, social 14, both 2, neither 4.

## Proposed sets (to mirror the GSS's)

- **Core economic (A):** `VCF0809` (jobs and standard of living), `VCF9131` (less government vs more), `VCF0806` (health insurance), `VCF0839` (services and spending). These are the four general role-of-government scales. The GSS core is `helppoor`, `helpnot`, `helpsick`, `eqwlth`. The ANES pool has no direct counterpart to `eqwlth` (reduce income differences), and services–spending is the closest general redistribution item. Egalitarianism (`VCF9017`) is the alternative fourth.
- **Broad economic (B):** A plus the other economic questions: `VCF0842`, `VCF9017`, `VCF0894`, `VCF9047`, `VCF0890`, `VCF9049`, `VCF9048`, `VCF9231`.
- **Inclusive economic (C):** B plus the "both" questions, `VCF0830` and `VCF0888`.
- **Social:** the 14 social questions, without "both" and "neither", as for the GSS.

The minimum number of answers for these sets would be 2, as for the GSS domain sets.

## Coverage to watch

Of the core four, `VCF0809` runs 1972–2024 (21 years) and `VCF0806` 1972–2024 (15), but `VCF0839` starts in 1982 and `VCF9131` in 1990. So the core set rests on two questions in the 1970s. The social set has more 1970s coverage (`VCF0834`, `VCF0814`, `VCF0816`, `VCF0811`, `VCF9274`).
