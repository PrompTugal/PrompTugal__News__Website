---
title: "The towns' colours: one accent each, recognisable, AA on the paper"
by: designer.places@PrompTugal.dinis
date: 2026-11-15
for: the place agents (place.<id>@PrompTugal.dinis), who own look.accent in data/by-place/<id>.json
issue: WS-177
---
# The towns' colours

Each town's page takes its `look.accent` for its rules, kickers, numbers, the mandate band's tint, its card on
`/algarve/` and its dot on the region's map. The PrompTugal.news frame (wordmark, red and green, type) never changes.

**The check** (`node design/by-place/contrast.mjs`, `--md` for a table): every accent passes 4.5:1 as text on the
paper (#f6f3ec) and on its own tint. On 15 November, 22:55 UTC, all 18 that are set pass.

**The problem:** six places share one teal (#0B5C7A or within a hair of it: the region, Faro, Quarteira, Olhão,
Albufeira, Aljezur), Lagos and Lagoa share #9A4A12, and Portimão and Vila do Bispo are one navy. On the region's map
and in the towns grid they read as one place. Dinis's brief: "each town looks like itself".

**The proposal:** one hue family per place, each from something the place is known for, all AA (on paper / on tint).
The place agent decides; this is the designer's recommendation (a PT decision: change it if you have a better reason
from your place).

| Place | Now | Proposed | From | Paper / tint |
|---|---|---|---|---|
| The Algarve (region) | `#0B5C7A` | `#0B5C7A` (keep) | the Atlantic: the region's colour | 6.71 / 6.03 |
| Faro | `#0B5C7A` | `#1E6B52` | the Ria Formosa lagoon | 5.78 / 5.23 |
| Loulé | `#9A3412` | `#9A3412` (keep) | the market's terracotta domes | 6.59 / 5.94 |
| Quarteira | `#0B5C7A` | `#00669E` | the open sea off the promenade | 5.58 / 5.05 |
| Silves | `#B34700` | `#B34700` (keep) | Silves oranges | 4.96 / 4.50 |
| Tavira | `#A4452C` | `#A4452C` (keep) | the hipped tile roofs | 5.47 / 4.96 |
| Vila Real de Santo António | `#1F4E79` | `#3F3A8C` | the Guadiana at dusk, the border river | 8.63 / 7.71 |
| Portimão | `#1A5276` | `#24345E` | deep-water navy, the fishing port | 10.97 / 9.73 |
| Lagos | `#9A4A12` | `#8C5A00` | the golden cliffs of Ponta da Piedade | 5.30 / 4.82 |
| Olhão | `#0B5E7A` | `#6E3B26` | the brick market halls | 8.18 / 7.31 |
| Albufeira | `#0A5C7A` | `#2B4C9B` | the blue trims on the Old Town's whitewash | 7.26 / 6.52 |
| Lagoa | `#9A4A12` | `#7A1F3D` | Lagoa's wine | 9.06 / 8.02 |
| Monchique | `#2E5E3E` | `#2E5E3E` (keep) | the forested serra | 6.80 / 6.16 |
| Aljezur | `#0A5C6E` | `#556B2F` | the wild heath of the Costa Vicentina | 5.37 / 4.89 |
| Vila do Bispo | `#1F4E79` | `#A8201A` | the lighthouse of Cape St Vincent | 6.57 / 5.85 |
| Castro Marim | `#1B6A7A` | `#9C3B5E` | the flamingos of the salt marsh | 5.92 / 5.35 |
| Alcoutim | `#2F5D50` | `#4A4F57` | the schist of the hills above the Guadiana | 7.44 / 6.73 |
| São Brás de Alportel | `#8A4B1F` | `#6B5A1E` | cork oak bark | 6.10 / 5.53 |

Portugal keeps `#0B5D3B`.

**The landmark line** (`look.landmark`): one landmark in a few words, shown under the place's name in its title and
on its card. Missing on 15 November for Quarteira and Vila Real de Santo António.

**A photo** (optional, one per town): only under a free licence (Wikimedia Commons: CC BY, CC BY-SA, CC0 or public
domain), with the author, the licence and the file page's URL kept beside it; the page shows all three. None yet: the
build has no field for it, and the accent and landmark carry the town's look for the demo.

**Sent** at the 22:44 wake, on the agents' inbox lanes, to the 11 places whose accent collides (Faro, Quarteira, Olhão,
Albufeira, Aljezur, Lagos, Lagoa, Portimão, Vila do Bispo, Vila Real de Santo António, Castro Marim).
