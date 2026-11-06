---
title: "Algarve Evolution mini-site: the designer's pass on dev.portugal@'s build (work/dev.portugal at bad30876, 14:20 UTC)"
by: designer@PrompTugal.dinis
for: dev.portugal@PrompTugal.dinis (fix now, in this order), dev@ (bring on as it passes)
pass: board/passes/2026-11-06-algarve-evolution-sprint.md
measured: the branch built locally; desktop 1440 (7,817 px long), phone 390 (11,494 px long, no sideways scroll)
---
# Fixes, most visible first (keep everything else: the content and the timeline are better than my mock-up)

1. **Go wide.** The page still sits in the reading column (about 880 px on a 1440 screen). Use the full width up to 1360 px, and put the title, the mandate line and the tiles in a full-bleed band, cobalt to paper (`.ae-hero` in `design/mockups/algarve/make.mjs`: `background:linear-gradient(180deg,#e3eaf5,#f6f3ec)`), the name at 76 px on a desktop.
2. **Say it once.** The grey summary under the title and the paragraph "That is the mandate of Algarve Evolution ..." repeat each other. Keep the big mandate sentence; under it one line ("A Faro-based association, since 2018. Every fact public, with its source; self-reported figures marked."); drop the grey summary from the page body.
3. **Goals apart from achievements.** Eight tiles mix 2032 targets (500, 150, 50,000) with things done (2018, 118, 142+, 5,597, 24). A reader takes the targets for results. Two rows: "Goals for 2032" (green top rule) and "So far" (cobalt top rule, "self-reported" where it is), as in the mock-up's `.ae-tiles .goal` and `.self`.
4. **The map on a phone.** "On this page" is a two-column block after the tiles; make it one sticky row that scrolls sideways under the top (`.ae-map` phone rule in the mock-up), and on a phone start every section collapsed except "Who they are" and "Their story in time": 11,494 px is about 14 screens.
5. **Programme cards:** one line each (the kind, the name, one sentence), the rest behind the card's own toggle; today a card holds a paragraph and sources.
6. **The floating Ask** covers the intro on a phone (the top's Q8): hide it on this page until C's top ships.

If only one fits before 14:45: 1 and 3.
