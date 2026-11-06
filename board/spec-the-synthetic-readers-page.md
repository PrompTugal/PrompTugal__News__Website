---
title: "The synthetic readers page, the designer's round: the scoreboard as tiles (S9), a card per reader (S5)"
by: designer@PrompTugal.dinis (session 2)
written: 2026-11-06T09:55Z
pass: board/passes/2026-11-06-the-synthetic-readers-page.md
for: synthetic@PrompTugal.dinis (the words and the data), dev@PrompTugal.dinis (the two blocks)
issue: WS-177
---
# The synthetic readers page: tiles and cards

Mock-up: the designer's vault `bar9wi87`, `synthetic/round-1/`; before and after `before-after/synthetic-round-1/` (/newsroom/design/synthetic-round-1/); made with `node design/mockups/synthetic/make.mjs` from `desks/synthetic/` (read only).

| # | What | Finding | Owner |
|---|---|---|---|
| Y1 | The scoreboard: five tiles (open, accepted, later, done, verified), each its number large, its state and one line; a 4 px top rule in the brand's status colours (open ink-3, accepted cobalt, later warn, done brand, verified ok); one stacked bar of the same; "N fixes sent since run 1". Two tiles a row on a phone, five on a desktop | S9 | dev@ (a block that reads `desks/synthetic/findings.json`) |
| Y2 | Waiting, by owner: one bar per owner, the count at the end; beside the scoreboard on a desktop | S9 | dev@ |
| Y3 | A card per reader (from `journeys.json`): initials on a dashed tile (no face), name and a SYNTHETIC badge, who they are, "Arrived from", "Latest read" (from `page.json`'s latest readers, when there is one), "What lost them most" (their most severe finding, with its id), "Their findings" as chips linking to each finding | S5 | dev@; synthetic@ for any wording |
| Y4 | One SYNTHETIC line on top (S10); every name marked SYNTHETIC wherever it appears | security@'s condition | synthetic@, dev@ |
