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
| G2 | **The industry map's labels overlap and are cut on a phone:** 'PORTUGAL STARTUP' cut at the left edge and on top of 'INVESTOR · 3' (correction, 21:35: the 'empty lower half' I saw was the wheel still being drawn by its animation in a full-page shot; once drawn, the wheel fills the frame) | industry | dev.graphs@ |
| G3 | **The past summits' years run together on a phone:** '2019202020212022 20232024 2025' under the bars; label every other year, or turn them | past-summits | dev.graphs@ |
| G4 | **Centres of gravity: labels sit on the dots** ('PORTUGAL STARTUP · 6' across the blue well; 'GRC · 15' cut by the frame); a label beside each well, not over it | gravity | dev.graphs@ |
| G5 | **The world map is small on a phone:** most bubbles crowd Europe in about 60 px; 'Zoom to Europe' is there but a reader does not know to press it: open zoomed to Europe on a phone, the world one tap away | world | dev.graphs@ |
| G6 | **The header still shows '£5.00 free'** on the graph pages (the currency question is with Dinis) | all | designer@, Dinis |

Not measured yet: the explorer's interactions (tap a node, the panel that opens) on a phone, and the animations under `prefers-reduced-motion`.

## Taps and motion on a phone (21:35 UTC, v0.1.640)

Tested: a tap on the drawing of the explorer and four pictures, and each with `prefers-reduced-motion: reduce` (two shots 1.2 s apart). Screenshots: `design/shots/sherpa/2130/`.

- **Reduced motion is respected:** centres of gravity moves by default and is still under reduced motion; the others are still once drawn. Keep.
- **The explorer says how to use it** under the drawing ('drag, pinch or scroll to move; tap to select, double-tap to expand') with + / - / full-screen buttons. Keep.

| # | Finding | Page | Owner |
|---|---|---|---|
| X1 | **On a phone, a tap answers below the screen.** Tapping a company on centres of gravity or the industry map fills a good card ('Firefox Enterprise by Mozilla · security · Netherlands · 4 connections ...'), but the card sits at 635 to 665 px, under the tab bar (which starts at 605), and the page does not move: the reader sees only a ring on the dot and thinks nothing happened. On a phone, scroll the card into view after a tap, or show it as a sheet over the bottom of the drawing | gravity, industry (and the others with the same box) | dev.graphs@, designer@ |
| X2 | **The explorer's 60 labels are about 4 px on a phone** before zooming: a dotted map with no readable word. Open it zoomed on the centre (the summit and its days), the rest a pinch away | /graph/ | dev.graphs@ |
| X3 | **'Open the page (new tab)'** on a phone opens another tab for every company; the back button then does not return to the picture. Open in the same tab on a phone | gravity, industry | dev.graphs@ |

## Re-measured (12:35 UTC, 12 November, v0.1.1394)

- **G1, changed:** the Algarve Evolution network is no longer cut at the frame: it is drawn 940 px wide (the timeline 2,540 px) inside a 358 px frame that scrolls sideways on a phone. Nothing says so: add 'Swipe to see the whole network' (or start it fitted, with a pinch to zoom). Better than cut, not yet obvious.
- **X1, still open:** a tap on centres of gravity or the industry map fills the card ('TRENT AI security ... 3 connections', 'PROOFPOINT security ...') at 635 to 645 px, under the tab bar (from 605); the page moves a little but not enough. New small thing: 'TRENT AI security · · 3 connections' has an empty field between the dots (no country).
