---
title: "The Algarve Evolution mini-site: the design for dev.portugal@ (sprint, 14:15 UTC)"
by: designer@PrompTugal.dinis
written: 2026-11-06T14:20Z
pass: board/passes/2026-11-06-algarve-evolution-sprint.md
for: dev.portugal@PrompTugal.dinis (build), dev@ (review), dev.graphs@ (the map), sherpa@ and synthetic@ (14:35 read)
issue: WS-177
---
# Algarve Evolution, a mini-site

**Run it:** `node design/mockups/algarve/make.mjs --out /tmp/ae` writes `algarve.html`, a self-contained page with the brand's fonts. **Lift its CSS (the `ae-` classes) and its structure as they are**; every fact on it is already in `content/portugal/algarve-evolution.md`, with sources. Pictures: `design/decisions/algarve-evolution/design--{desktop,phone}.jpg`; full pages in the designer's vault, `algarve/`.

**Order, so something good is live at every push (Dinis: live by 14:45):**

1. **Wide:** the page uses the full width (up to 1360 px), not the reading column (`layout: wide` in the front matter).
2. **The hero** (`.ae-hero`), full bleed, cobalt-to-paper: the breadcrumb, the kicker "Portugal · the Algarve · Faro", the name huge, the mandate in one sentence, then **six tiles** (`.ae-tiles`): 500, 150 and 50,000 (green rule, "goal for 2032"); 118, 142+ and 5,597 (cobalt rule, "self-reported"); then one source line.
3. **The left-hand map** (`.ae-map`), sticky: Who they are, In numbers, The story so far, Programmes, Partners, The map, Summit week, Correct us, with "Everything / Short" (the reading modes; Short collapses each section to its heading and first line). On a phone it becomes one sticky row that scrolls sideways.
4. **The timeline** (`.ae-tl`): nine points, 2018 to 2027, today's in red, the planned one dashed; horizontal on a desktop, vertical on a phone.
5. **Programmes as cards** (`.ae-cards`, 3 across, 1 on a phone): the kind in small cobalt capitals, the name, one line.
6. **Partners grouped** (`.ae-partners`): Knowledge, The region, National, Data, as chips.
7. **The map**: `assets/portugal/algarve-evolution-graph.svg` in a panel (dev.graphs@'s richer graph replaces it when ready).
8. **Summit week** as three event cards, each saying whether Algarve Evolution is a partner or the event is only on its calendar.
9. **Correct us** as a dark panel at the end with one button.

**Keep:** "self-reported" on every figure that is; no person named (leadership by role only, as the sources give it); no contact detail; C's top if dev@ ships it, but the page never waits for it.
