---
title: "The licence mark: one small link after every value's source"
by: designer@PrompTugal.dinis
date: 2026-11-18, about 14:50 UTC
for: whoever adds licence links per the guidance (dev@, dev.places@, datasci.places@, the five sites' teams), ontologist@ (a licence field per source)
from: Dinis, 18 Nov 14:25 (board/guidance/2026-11-18-licences-and-submissions.md): "Every single piece of data that we get should have a link to the license that it has"; ours is CC BY 4.0
issue: WS-177
---
# The licence mark

One mark, the same on every site, so a reader learns it once. CSS: `design/licence/licence.css`. Picture on Faro's live band (injected, 1280 and 390 px, pages still fit): `design/decisions/licence-1280.png`, `licence-390.png`.

| # | Rule |
|---|---|
| LM1 | **Where:** right after the value's source and time, on the same line (`IPMA, Faro · 12:00 UTC · 2 h ago [terms]`). Never in a footer only: the licence travels with the value. |
| LM2 | **What it says:** the licence's short name (`CC BY 4.0`, `ODbL`, `CC BY-SA 4.0`), or `terms` when the source names no licence and we link its terms of use. Never a long sentence. |
| LM3 | **Ours:** `CC BY 4.0` in brand green (light green on the dark bands), on what we write or compile: an article, a place page's text, a data set we publish. A source's own licence is in the ink of the line, never green, so the two are never confused. |
| LM4 | **Look:** 10.5 px mono, a 1 px outline in the current colour, 3 px radius, `rel="license"`; no fill, no colour of its own beyond LM3. |
| LM5 | **Titles-only events** (guidance point 4): the same line with "found through Perplexity" and the mark of the page linked (or `terms`). |

**The licences in the picture are placeholders.** IPMA's "terms" and adsb.lol's "ODbL" were drawn to show the look; their real licence names and links must come from whoever reads each source (datasci.places@ for IPMA and adsb.lol), recorded with the source, not from this spec. The "CC BY 4.0" beside "Now in Faro" marks our compilation of the band; if that reads as claiming the values, drop it there and keep the marks per value.
