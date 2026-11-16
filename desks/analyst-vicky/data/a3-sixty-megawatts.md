# A3 data note: Sixty megawatts and a 1,000 MW goal

For the draft `desks/analyst-vicky/drafts/a3-sixty-megawatts.md`. Kept by analyst@PrompTugal.vicky. Every figure below was checked on the date beside it at the source named (standing answer 86). The reviewer re-checks each one on the publish day.

## The PrompTugal test

- **What is the AI connection?** The Government sets its computing targets for AI demand (the National AI Agenda). Sines: a data centre its developer describes as built for AI, cloud and high-performance computing.
- **How many steps away?** Zero for the national figures. One for Sines (a data centre whose share of AI work is not public).
- **Which places does it touch?** Sines (Alentejo), Portugal, Europe (the 21% growth figure).

## Sources

- **A** = [Diário da República, "Resolução do Conselho de Ministros n.º 2/2026"](https://bo.digital.gov.pt/api/assets/etic/6c8282d1-dd2d-438a-a60c-b8582c4858bb), DR 1st series no. 5, 8 January 2026 (National AI Agenda), section 5.1 "Infraestrutura e Dados". Official text, the Government's PDF.
- **B** = [Diário da República, "Resolução do Conselho de Ministros n.º 70/2026"](https://bo.digital.gov.pt/api/assets/etic/2b0bb9b9-6a99-4193-b4e3-71413dea8908), DR 1st series no. 71, 13 April 2026 (National Data Centre Plan), section 1.2 and 1.3.
- **C** = [Start Campus, "SINES Data Campus"](https://www.startcampus.pt/), the company's home page. Company claims, attributed as such.

## Figures

| Figure | Value | Source and its words | Checked on |
|---|---|---|---|
| National computing capacity, 2025 | about 60 MW | A: "passando de cerca de 60 MW em 2025" | 16 Nov 2026 |
| Target 2030, middle scenario | about 700 MW | A: "cerca de 700 MW (cenário intermédio)" | 16 Nov 2026 |
| Target 2030, fast scenario | about 1,000 MW | A: "a 1 000 MW (cenário acelerado)" | 16 Nov 2026 |
| The Agenda's own multiple | "entre 10-15 vezes" | A | 16 Nov 2026 |
| Demand for computing capacity, 2025 | about 170 MW | A: "de cerca de 170 megawatts (MW) em 2025" | 16 Nov 2026 |
| Demand, 2030 | about 980 MW | A: "para cerca de 980 MW em 2030" | 16 Nov 2026 |
| Demand growth a year, Portugal / Europe | 41% / 21% | A: "na ordem dos 41 % ao ano para Portugal ... e 21 % para a Europa" | 16 Nov 2026 |
| What drives it | generative AI, companies going digital, research | A: "impulsionado pelo avanço da IA generativa, pela digitalização das empresas e pela investigação científica" | 16 Nov 2026 |
| Installed capacity 2020 to 2025 | "practically doubled", "significantly below" the European average | B 1.2: "praticamente duplicou ... significativamente abaixo da média europeia" | 16 Nov 2026 |
| Why projects are not built | low rate; long, bureaucratic processes; unclear procedures; grid access limits; scattered demand | B 1.1: "A reduzida taxa de concretização dos projetos evidencia alguns desafios, incluindo processos longos e burocráticos, falta de informação clara sobre os procedimentos, constrangimentos no acesso à rede elétrica e dispersão da procura" | 16 Nov 2026 |
| The grid in the short term | has room for new data centres | B 1.3: "no curto prazo, a rede elétrica dispõe de capacidade para acomodar novos projetos de centros de dados" | 16 Nov 2026 |
| Sines, live | 37.5 MW (SIN01) | C: "37,5 MW Live first facility (SIN01)" | 16 Nov 2026 |
| Sines, next planned | 200 MW (SIN02) | C: "200 MW Next planned facility (SIN02)" | 16 Nov 2026 |
| Sines, full campus | 1.2 GW | C: "1.2 GW Total campus capacity" | 16 Nov 2026 |
| Sines's purpose | AI, cloud and HPC | C: "Purpose-built for high-density AI, Cloud, and HPC workloads"; "our full campus will deliver to our global customers" | 16 Nov 2026 |

Derived (from A only): demand / capacity 2025 = 170 / 60 = 2.8 ("nearly three times"). Middle target against 2030 demand: 980 − 700 = 280 MW short. Fast target: 1,000 against 980, covered. Multiples: 700 / 60 = 11.7 ("about 12"), 1,000 / 60 = 16.7 ("about 17").

## Comparisons judged

- **National MW against Sines MW.** Not comparable as given. A does not define its megawatts (IT load or grid connection); C counts "capacity" of the campus and serves global customers. The draft puts them side by side, never adds them, and says only that Sines's full plan is larger than the national 2030 target, which holds whatever the definition, since 1.2 GW exceeds 1,000 MW.
- **"10 to 15 times".** The Agenda's own phrase understates its own figures (11.7 and 16.7). The draft says so, citing both.
- **Targets and plans.** 2030 values are Government targets and a company plan, not forecasts or built capacity. Said once, in What this does not claim.
- **Left out.** Market figures from the first proposal (2.6 GW "in development", "44-fold", EDP's 4.5% a year): no official or company source read. The REN allocation of 2024: reported in the press, the company's release not readable by machine (Business Wire and DatacenterDynamics refused, 15 and 16 Nov 2026). The 26 MW first-building figure from the first proposal: replaced by the company's current 37.5 MW.

## What the trend means and does not mean

It means the Government's own figures put Portugal's 2025 computing capacity at about a third of demand, and only its fast scenario meets 2030 demand. It does not show how much capacity serves AI, whether private projects such as Sines count toward the national figures, or whether the targets will be met.

## Chart spec (for the designer)

One bar chart, megawatts, one axis from 0 to 1,000 MW. All bars from source A.

- **Title:** "Portugal's computing capacity: the Government's figures"
- **Bars, left to right:** "Capacity 2025" 60 · "Demand 2025" 170 · "Target 2030 (middle)" 700 · "Target 2030 (fast)" 1,000 · "Demand 2030" 980.
- **Colours:** capacity and targets one colour (targets lighter or hatched, as planned values); demand bars a second colour.
- **Value labels** on each bar: "about 60 MW" and so on.
- **Caption under the chart:** "Source: National AI Agenda, Resolução do Conselho de Ministros n.º 2/2026, read 16 November 2026. 2030 values are Government targets and expectations."
- **Alt text:** "Bar chart of the Government's figures. Computing capacity about 60 MW in 2025 against demand of about 170 MW. 2030 targets about 700 MW and about 1,000 MW, against expected demand of about 980 MW."
- Sines is **not** on the chart (different measure). Five labelled bars, readable at 390px wide. Every number also appears, sourced, in the text.
