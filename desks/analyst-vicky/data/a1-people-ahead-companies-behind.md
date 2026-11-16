# A1 data note: People ahead, companies behind

For the draft `desks/analyst-vicky/drafts/a1-people-ahead-companies-behind.md`. Kept by analyst@PrompTugal.vicky. Every figure below was checked on 16 November 2026 at the source named beside it (standing answer 86). The reviewer re-checks each one on the publish day.

## The PrompTugal test

- **What is the AI connection?** Both numbers measure AI use directly: people using generative AI tools, and companies using AI technologies.
- **How many steps away?** Zero.
- **Which places does it touch?** Portugal and Europe (the EU 27). Not the Algarve or any town: INE's regional figures were not read at INE's own pages, so none is used.

## Figures

Source P = [Eurostat, "Individuals - use of generative AI tools" (isoc_ai_iaiu)](https://ec.europa.eu/eurostat/databrowser/view/isoc_ai_iaiu/default/table), dataset updated 5 June 2026, read through Eurostat's data API.
Source C = [Eurostat, "Artificial intelligence by size class of enterprise" (isoc_eb_ai)](https://ec.europa.eu/eurostat/databrowser/view/isoc_eb_ai/default/table), dataset updated 15 June 2026, read through Eurostat's data API, sector code C10-S951_X_K (finance excluded).

| Figure | Portugal | EU 27 | Source | Checked on |
|---|---|---|---|---|
| People 16 to 74 who used generative AI tools in the last 3 months, 2025 (%) | 38.70 | 32.66 | P (I_IUAI, IND_TOTAL) | 16 Nov 2026 |
| Portugal's rank among the 27 on that figure | 13th | | P, computed from the 27 country values | 16 Nov 2026 |
| The five highest, 2025 | Denmark, Estonia, Malta, Finland, Ireland | | P, computed | 16 Nov 2026 |
| People 16 to 74 who used generative AI for work, 2025 (% of all people) | 19.93 | 15.36 | P (I_IUAIWP) | 16 Nov 2026 |
| Ages 16 to 24, generative AI use (%) | 76.54 | 63.81 | P (Y16_24) | 16 Nov 2026 |
| Ages 25 to 54 (%) | 47.70 | 38.55 | P (Y25_54) | 16 Nov 2026 |
| Ages 55 to 74 (%) | 12.13 | 11.98 | P (Y55_74) | 16 Nov 2026 |
| Companies 10+ staff using any AI technology, 2023 (%) | 7.86 | 8.06 | C (E_AI_TANY, GE10) | 16 Nov 2026 |
| The same, 2024 (%) | 8.63 | 13.48 | C | 16 Nov 2026 |
| The same, 2025 (%) | 11.54 | 19.95 | C | 16 Nov 2026 |
| Portugal's rank among the 27, companies 2025 | 21st | | C, computed | 16 Nov 2026 |
| 10 to 49 staff, 2025 (%) | 9.43 | 17.00 | C | 16 Nov 2026 |
| 50 to 249 staff, 2025 (%) | 18.21 | 30.36 | C | 16 Nov 2026 |
| 250+ staff, 2025 (%) | 49.15 | 55.03 | C | 16 Nov 2026 |
| INE's 2026 release date for both surveys | 20 Nov 2026 | | [INE, "Calendário: disponibilidade de informação estatística"](https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_dispinfest&xlang=pt) | 16 Nov 2026 |

Rounded in the draft to one decimal. Derived: the gap was 0.2 points in 2023 (8.06 − 7.86), 4.9 in 2024 and 8.4 in 2025 (19.95 − 11.54).

## Comparisons judged

- **People against companies.** Different units (people 16 to 74 against firms of 10+ staff, finance and micro-firms excluded). The draft sets them side by side and never subtracts one from the other. Holds as written.
- **"For work".** The share is of all people 16 to 74, not of people in work. The draft says so.
- **A trend for people.** Eurostat has only 2025. No trend is claimed.
- **Companies 2023 to 2025.** The same indicator and sector coverage in all three years in the table. 2021 (Portugal 7.20, EU 7.65) is left out of the draft: whether the list of technologies asked about changed between 2021 and 2023 is not yet checked in Eurostat's metadata.
- **Ties in ranks.** None at Portugal's place in either ranking.
- **Left out.** Private surveys ("two in three", "almost 90%"): not read at source. Press regional figures (Grande Lisboa 48.4%, Alentejo lowest, from ECO citing INE): not read at INE.

## What the trend means and does not mean

It means people in Portugal adopted generative AI faster than the EU average, led by people under 55, while Portuguese companies adopted AI more slowly than the EU's, most of all firms with 10 to 249 staff. It does not show why. It does not show that individuals' use happens at work with the employer's tools, or how often or how well anyone uses AI.

## Timing (for the conductor and Vicky)

INE publishes the 2026 results of both surveys on Friday 20 November 2026. The 2025 figures above will be a year old on that day. Recommended: Vicky reads and approves the framing now, and the piece is published after 20 November with the 2026 figures added (for people, the first two-year comparison). If it goes out before Friday, it must say that new figures come on 20 November (the draft already does).

## Chart spec (for the designer)

One chart, two panels side by side, same style, each with its own axis from 0 to 100%. No shared axis between panels.

- **Title:** "People ahead, companies behind (2025)"
- **Panel 1, "People who used generative AI":** two bars. Portugal 38.7%. EU 32.7%. Label under the panel: "People aged 16 to 74, last 3 months. Source: Eurostat, isoc_ai_iaiu."
- **Panel 2, "Companies using AI":** two bars. Portugal 11.5%. EU 20.0%. Label under the panel: "Companies with 10 or more staff, finance excluded. Source: Eurostat, isoc_eb_ai."
- **Colours:** Portugal one colour in both panels, EU another.
- **Caption under the chart:** "Source: Eurostat (isoc_ai_iaiu, isoc_eb_ai), 2025 data, read 16 November 2026."
- **Alt text:** "Bar chart. In 2025, 38.7% of people in Portugal used generative AI against 32.7% in the EU. 11.5% of Portuguese companies used AI against 20.0% in the EU."
- Four labelled bars only, readable at 390px wide. Every number also appears, sourced, in the text. If the piece is updated with INE's 2026 figures, the chart is redrawn with them.
