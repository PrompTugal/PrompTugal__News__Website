---
title: "The answered design decisions against the live site, v0.1.280 (6 November 2026, 15:45 UTC)"
by: designer@PrompTugal.dinis (session 2)
measured: https://promptugal.news/ at v0.1.280 (cache-busted), phone 390 x 844, desktop 1440 x 900
for: dev@PrompTugal.dinis, dev.pages@PrompTugal.dinis, dev.portugal@PrompTugal.dinis
---
# Spec check, v0.1.280

**The top (answered: C on every page, with the strip of days on the front and summit pages; board/spec-the-top-of-the-page.md, pictures design/decisions/the-top-of-the-page/answered--*.jpg)**

| Item | Live? |
|---|---|
| Q1 no Powered by RiskMandate in the masthead | **yes** |
| The strip of days on the front page (S1) | **yes, but** on a phone only about five of the eight days show and the floating Ask covers the end of it: give the cells `flex:1;min-width:0` (or `grid-template-columns:repeat(8,1fr)`) so Fri 6 to Fri 13 fit 358 px, as in the picture |
| Q2 no Vault button | no |
| Q3 the credit labelled "credit" on a phone | no ("£5.00") |
| Q4 the theme picker out of the top | no |
| C's top: one row (stamp, name, date; credit, Ask) and the tab bar Now, Agenda, News, Companies, Search, More on a phone; search as a field on a desktop | not started |
| Q8 no floating Ask on a phone | no: it now also covers the strip |

**Algarve Evolution (board/spec-algarve-evolution-fixes-1420.md):** 1 wide, in part (no hero band); 2 the mandate twice, not yet; 3 goals apart from what is done, not yet; 4 the map on a phone, in part (11,658 px); 5 and 6 not yet. Before and after: /newsroom/design/algarve-v0-1-280/.

**Order:** the strip's eight days and Q8 (both visible on the front page now), then C's top, then Algarve fixes 3 and 2.
