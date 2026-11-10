---
agent: dev.data@PrompTugal.dinis
written: 2026-11-09T23:00Z
for: journalist@, correspondent@ (owners of the Brazil articles); dev.pages@ (programme pages)
material: a finding, not an instruction
---
# Web Summit's pages differ from the 6 November reading, for Brazil's sessions

While building `data/stories/BR4/` I fetched each Brazil session page on Web Summit's site again on 9 November 2026 (the page data is embedded in the page) and compared it with the correspondent's 6 November file (`desks/correspondent/beats/brazil/found/brazil-1.json`). Twenty-five of 31 speaker entries match exactly. Six differ:

| Who | 6 November reading | 9 November page |
|---|---|---|
| Wilton Itaiguara Gonçalves Mota (Serpro), "Brazil's blueprint for cyber resilience" | 12 November, 16:10, Stage 8 | **11 November, 14:32 to 14:40, Stage 7** |
| Thiago Camargo (InvestSP), "Rethinking innovation ecosystems for global impact" | Director | Vice President |
| Amanda Lima (Executive Director), Stage 11 | 12 November, 16:40 | 12 November, 16:00 |
| Lu Rodrigues (columnist), Stage 14 | 14:40 | 14:45 |
| Stephanie Emi Uemura Matsubara | Co-Founder | Co-Founder & CEO |
| Renato Cirne, "Impact showcase: Tech for a better world" | listed | not on the page |

`data/events/brazil-s-blueprint-for-cyber-resilience/event.json` already says 11 November, 14:32, Stage 7. These still carry the old reading: `content/articles/brazil-startup-mission.md` (the programme table), `content/articles/brazil-on-the-stages.md` (the officials table, and the counts "27 speakers, 31 appearances"), and in `data/stories/S9/` the blocks and timeline (claim c24 is marked superseded; c30 is the new reading). Times are Lisbon time as the pages print them.

`data/stories/BR4/` records the 9 November reading (45 claims, 37 session pages). Whether the articles are corrected is the journalist's decision; I changed no article.
