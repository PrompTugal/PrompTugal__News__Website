---
title: "The masthead on a phone: every page scrolls sideways since 'Pay for what you read'"
by: designer@PrompTugal.dinis
date: 2026-11-17, about 16:50 UTC
for: conductor@PrompTugal.dinis (69dc40999, assets/top/), or dev@ (assets/top/ is the build's)
issue: WS-177
---
# The masthead on a phone

**Found at 16:45 UTC (v0.1.1733), at 390 px:** every page is 434 px wide, so it scrolls sideways; the Ask button is cut at the edge and the date wraps onto three lines ("Tue / 17 / Nov"). Checked on `/`, `/algarve/faro/`, `/articles/`, `/about/`, `/media/barlavento/` and an article: all 434. The cause is 69dc40999 (the reading credit as a statement, Dinis's word): "Pay for what you read" (`.em-pay`) sits in the masthead line `.em-dl` beside the date, the place line and the tools, and the line does not wrap.

Pictures: `design/decisions/masthead-phone/before-390.png`, `after-390.png`.

**The fix, tested by injection at 390, 360 and 320 px** (page width back to the viewport; every tool inside it; the date on one line; the statement on its own line under the tools, in full):

```css
@media (max-width: 480px) {
  .em-dl { flex-wrap: wrap; row-gap: 6px; }
  .em-dl .em-pay { order: 3; flex-basis: 100%; margin: 0 !important; }
  .em-dl time .em-short { white-space: nowrap; }
}
```

The words and the link stay as Dinis asked; only where they sit on a phone changes. A gate check would keep it from coming back: no built page wider than 390 px at 390 (the place sweep does this for `.bp-frame`; it could cover the masthead).

## The provenance strip (892f81928), read at 390 and 1280 px
Compact and clear ("NEWS · written by an AI agent from its mandate · researched by AI agents on their own · P2 Sourced"). One note for later: show the ladder as a position (P2 of P0 to P5, five small steps, the reached ones filled) so a reader sees how far a piece has climbed, not only its label.

## 18:45 UTC
Still 434 px at 390 on `/`, `/algarve/faro/`, `/media/` (v0.1.1740). Sent to dev@ and conductor.b@ on their lanes.

## 20:45 UTC
Still 434 px at 390 (v0.1.1745).

## 22:45 UTC
Still 434 px at 390 (v0.1.1753), seven and a half hours after it began.

## Closed, 18 Nov 00:45 UTC
Pages fit again at 390 and 360 px (v0.1.1762), after conductor@'s top-bar rework (d6c05dc20, 0c73a03ad). The date reads on one line; Search, EN, App and Ask fit. Keep a check: no built page wider than the viewport at 390.
