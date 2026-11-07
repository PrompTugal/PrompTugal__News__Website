---
title: "sherpa@: the graph pages, read cold on a phone and a desktop (v0.1.606)"
by: sherpa@PrompTugal.dinis (account B session, key sherpa-b-promptugal)
measured: 2026-11-07T18:35Z, live site v0.1.606: /graph/ and its seven pictures (industry, gravity, world, riskmandate, cloud-centres, algarve-evolution, past-summits)
how: Playwright with Chromium; phone = iPhone 13 profile (390 x 664), desktop = 1440 x 900; full-page phone shots; tap reach by elementFromPoint; screenshots in design/shots/sherpa/1830/
for: board/passes/2026-11-06-the-big-graphs.md (first sherpa@ review), board/passes/2026-11-06-the-graph-explorer-next.md
issue: WS-177
---
# The graph pages, read cold

A review, not user research: a founder or a journalist who follows a link to one picture, on a phone.

## What works (keep)

- **Every picture is explained in words, right under it:** one sentence with the numbers ('120 companies in 8 fields ... The largest fields: security (30), ai agents (22), other (18)'), a 'Tap a company to see ...' box, and a 'How to read it' list. A reader who cannot read the picture still gets the point. This is the best pattern on the site; other pictures should copy it.
- **Honest marks:** the cloud centres' filled / dashed / empty circles ('searched and nothing found' is not 'absent'); RiskMandate's ring says 'none is public yet'; the past summits mark read-at-source against Wikipedia's figures.
- **No page wider than the phone** (390 px on all eight); 5.5 to 8.4 phone screens per picture; nothing hidden under the top or the tab bar; 'Save as PNG' and 'Brief me on this page' on each.

## Findings, ranked

| # | Finding | Page | Owner |
|---|---|---|---|
| G1 | **Names cut at both edges of the Algarve Evolution network on a phone:** 've Tech Hub Summit 2024', 'Executive c...', 'INOVA ALGARVE 3.0' with its dot on the frame; the canvas is wider than the screen. Fit the drawing to the frame on a phone, or wrap and shorten the labels | algarve-evolution | dev.graphs@ |
| G2 | **The industry map's labels overlap and are cut on a phone:** 'PORTUGAL STARTUP' cut at the left edge and on top of 'INVESTOR · 3'; the wheel is drawn in the upper half of the frame, 'OTHER · 18' floats in an empty lower half | industry | dev.graphs@ |
| G3 | **The past summits' years run together on a phone:** '2019202020212022 20232024 2025' under the bars; label every other year, or turn them | past-summits | dev.graphs@ |
| G4 | **Centres of gravity: labels sit on the dots** ('PORTUGAL STARTUP · 6' across the blue well; 'GRC · 15' cut by the frame); a label beside each well, not over it | gravity | dev.graphs@ |
| G5 | **The world map is small on a phone:** most bubbles crowd Europe in about 60 px; 'Zoom to Europe' is there but a reader does not know to press it: open zoomed to Europe on a phone, the world one tap away | world | dev.graphs@ |
| G6 | **The header still shows '£5.00 free'** on the graph pages (the currency question is with Dinis) | all | designer@, Dinis |

Not measured yet: the explorer's interactions (tap a node, the panel that opens) on a phone, and the animations under `prefers-reduced-motion`.
