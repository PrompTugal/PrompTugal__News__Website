# A5 data note: What stops Portuguese firms using AI

For the draft `desks/analyst-vicky/drafts/a5-what-stops-firms-using-ai.md` (weekly run, 23 Nov 2026). Kept by analyst@PrompTugal.vicky. Every figure below was checked on 23 November 2026 at the source named (standing answer 86). The reviewer re-checks each one on the publish day. 463 words (standing answer 92: analysis 400 to 900).

## The PrompTugal test (also in the draft's metadata: ai_connection, ai_steps, ai_places)

- **What is the AI connection?** Direct: companies' own reasons for not using AI.
- **How many steps away?** Zero.
- **Which places does it touch?** Portugal and Europe (the EU 27, 2025). No regional split for the reasons.

## Sources

- **I-C** = [INE, "Utilização de Inteligência Artificial pelas empresas aumenta para 19,6%"](https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&DESTAQUESdest_boui=770294191&DESTAQUESmodo=2), 20 Nov 2026, its tables (xlsx): Quadro 7 (use; non-users who considered AI), Quadro 7.2 (reasons, base: "empresas ... que não utilizam tecnologias de Inteligência Artificial e ponderaram utilizar"), Índice and Nota Técnica (classification change).
- **C** = [Eurostat, isoc_eb_ai](https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ai/default/table), updated 15 June 2026, data API: indicators E_AI_EC and E_AI_B*, unit PC_ENT_AI_EC for reasons, PC_ENT for the share that considered AI; size GE10, sector C10-S951_X_K.

## Figures

| Figure | Portugal | EU 27 | Source | Checked on |
|---|---|---|---|---|
| Firms 10+ staff using AI, 2026 | 19.6% | not published | I-C Quadro 7 | 23 Nov 2026 |
| Non-users that considered AI, % of all firms, 2026 / 2025 | 13.2% / 12.3% | 2025: 11.1% | I-C Quadro 7; C (E_AI_EC, PC_ENT: PT 12.35, EU 11.10) | 23 Nov 2026 |
| Reason: costs seem too high, 2025 | 60.4% | 38.4% | C (E_AI_BCST, PC_ENT_AI_EC: 60.43, 38.37); I-C 60.4 | 23 Nov 2026 |
| Reason: lack of relevant expertise, 2025 | 74.4% | 70.3% | C (E_AI_BLE: 74.40, 70.31); I-C 74.4 | 23 Nov 2026 |
| Reason: lack of clarity about legal consequences, 2025 | 57.3% | 53.6% | C (E_AI_BLEG: 57.35, 53.61) | 23 Nov 2026 |
| Reason: data protection and privacy concerns, 2025 | 55.4% | 52.7% | C (E_AI_BCDP: 55.38, 52.72) | 23 Nov 2026 |
| Reason: data availability or quality, 2025 | 49.2% | 43.5% | C (E_AI_BDDT: 49.23, 43.51) | 23 Nov 2026 |
| Reason: incompatibility with existing systems, 2025 | 46.2% | 41.6% | C (E_AI_BINC: 46.23, 41.60) | 23 Nov 2026 |
| Reason: ethical considerations, 2025 | 36.4% | 24.6% | C (E_AI_BEC: 36.39, 24.64) | 23 Nov 2026 |
| Reason: AI not useful for the firm, 2025 | 18.2% | 17.8% | C (E_AI_BNU: 18.21, 17.79) | 23 Nov 2026 |
| Portugal 2026: cost / expertise / legal / privacy / data / incompatibility / ethics / not useful | 64.7 / 65.6 / 52.2 / 50.6 / 43.4 / 40.6 / 27.7 / 20.8 | not published | I-C Quadro 7.2 | 23 Nov 2026 |
| Cost, firms with 50 to 249 staff, 2026 / 2025 | 72.3% / 55.3% | | I-C Quadro 7.2 | 23 Nov 2026 |

Derived: cost gap 2025 = 60.43 − 38.37 = 22.1 points; ethics gap = 11.8 points. Change 2025 to 2026 in Portugal: cost +4.3, expertise −8.8, ethics −8.7, legal −5.1, privacy −4.8, data −5.8, incompatibility −5.6, not useful +2.6. EU range for legal, privacy and data in 2025: 43.5 to 53.6 ("between 43% and 54%").

## Comparisons judged

- **The base.** Reasons are asked only of firms that do not use AI but considered it: 13.2% of firms in 2026. Said in the text and in What this does not claim. Several reasons per firm: shares add up to more than 100%.
- **Portugal against the EU.** Same question, same base, same year (2025), same source (Eurostat). INE's 2025 Portuguese values match Eurostat's. Holds.
- **Portugal 2025 to 2026.** Same question and base; the classification of activities changed in 2026 (INE: matters for sector detail, not totals). Small base, so changes of a few points are not stressed; the draft names only changes of about nine points or more, and the 50 to 249 rise (17 points) with the caveat once.
- **The eighth kind of AI (2025).** It changes who counts as a user from 2025, and so who is asked the reasons. 2025 and 2026 share the same list. Not stressed in the text: the draft compares 2025 with 2026 and with the EU in 2025 only.
- **Left out:** 2021 to 2024 reasons (list of AI kinds changed in 2025); sector detail.

## What the figures mean and do not mean

Among Portuguese firms that looked at AI and held back, cost weighs far more than in the EU, and in 2026 it drew level with a lack of skills. It does not explain the 80% of firms that neither use nor considered AI, what cost means to firms, or whether cost is the real cause rather than the answer given.

## Chart spec (for the designer)

One horizontal bar chart, paired bars, Portugal against the EU, 2025, axis 0 to 100%.

- **Title:** "Why firms that considered AI did not use it (2025)"
- **Rows, top to bottom (Portugal / EU):** Lack of skills 74.4 / 70.3. Cost too high 60.4 / 38.4. Ethical concerns 36.4 / 24.6. Not useful 18.2 / 17.8. (Only reasons whose numbers are in the text: STYLE.md, every number in a chart also in the text. Legal, data protection, data quality and incompatibility go in the note as "other reasons: 42% to 57%".)
- **Highlight:** the "Cost too high" row (the biggest gap).
- **Colours:** Portugal one colour, EU another, the same pair as A1's chart.
- **Note under the chart:** "Base: firms with 10 or more staff that did not use AI but had considered it. Several answers allowed. Other reasons, legal uncertainty, data protection, data quality and incompatible systems: 42% to 57% in both."
- **Caption:** "Source: Eurostat (isoc_eb_ai), 2025 data, read 23 November 2026."
- **Alt text:** "Paired bar chart of four reasons firms gave for not using AI in 2025, Portugal against the EU. The largest gap is cost: 60.4% in Portugal, 38.4% in the EU. Lack of skills was the top reason in both, 74.4% and 70.3%."
- Four rows, two bars each, readable at 390px wide.
