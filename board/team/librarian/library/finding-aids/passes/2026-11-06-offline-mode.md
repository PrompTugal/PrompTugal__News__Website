---
title: "Finding aid: pass 2026-11-06-offline-mode"
by: librarian@PrompTugal.dinis
generated: "by library.mjs 0.2.0 from board/catalogue.json as generated 2026-11-07T21:58:27Z"
site_version: "v0.1.644"
source: board/catalogue.json
---

# Pass: 2026-11-06-offline-mode

PrompTugal.news works offline at the venue: the reader's schedule, the summit's days and agenda, the front page and the articles they saved (and the latest…

Scope note: a **pass** is a focused round of work on one thing, in a fixed order and within a budget. This one: state open, opened 6 Nov 2026, owner conductor@, 9 findings. The pass file: [2026-11-06-offline-mode](https://promptugal.news/board/passes/2026-11-06-offline-mode.md).

## The container list: the findings

| No. | Finding | Owner | Decision |
|---|---|---|---|
| 1 | [The service worker is the most powerful script the site can run: it stands in front of every request on promptugal.news and outlives the page. One file at the…](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | dev@ | condition of go |
| 2 | [It caches public, same-origin GET responses only: never /login/, /newsroom/observability/ or any page that loads the keyring, never a response from…](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | dev@ | condition of go |
| 3 | [A way out, built in from the start: a 'Clear offline data' control that unregisters it and deletes its caches, and a kill switch (a small file it checks; if…](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | dev@, designer@ | condition of go |
| 4 | [The reader's own schedule and saved articles stay on the device; nothing of them goes to the page-view lanes; syncing to the reader's vault only sealed,…](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | dev.pages@, observability@ | condition of go |
| 5 | [The offline badge says when the copy was made, so a stale page is never shown as current](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | designer@ | condition of go |
| 6 | [18:55](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | row 3: the offline badge and band (the copy's own time always shown), Save for offline on an article, the saved list under You with Clear offline data; phone first in C's top: board/spec-offline-mode-design.md, design/decisions/offline/ | open |
| 7 | [Row 4, the attendee with no Wi-Fi (09:35, v0.1.492, phone): the home page, /summit/ and a saved article open offline with a clear 'Offline. This copy was kept…](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | dev@, dev.pages@, designer@ | open (conductor) |
| 8 | [Row 4 re-measured after round 2 (12:35, v0.1.532): O2 (query addresses) and O3 (the offline page) done. O6 (rank 1): the tab pages and 80+ event pages are…](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | dev@ | open |
| 9 | [Row 4 re-measured (15:35, v0.1.572): O6 and O1 done (Agenda, its event pages, News, Companies open offline with the copy's time); O4 done ('kept' beside kept…](https://promptugal.news/board/passes/2026-11-06-offline-mode.md) | dev@, synthetic@ | done for sherpa@; WebKit open |

## Cards this pass names

- [budgets.json](https://promptugal.news/board/budgets.json) (`TEAM.BUDGET budgets`)
- [Dinis, 6 November 2026, about 18:05 UTC: an offline mode (Silvio's idea): the schedule and the articles always there, whatever the event Wi-Fi does](https://promptugal.news/board/guidance/2026-11-06-offline-mode.md) (`GDN.MEMO 2026-11-06-offline-mode`)
- [Pass: signed-in-views](https://promptugal.news/board/passes/2026-11-06-signed-in-views.md) (`GEN.BOARD 2026-11-06-signed-in-views`)
- [The offline mode: the badge, Save for offline, and the saved list (designer@, row 3 of the pass)](https://promptugal.news/board/spec-offline-mode-design.md) (`WRK.PLAN spec-offline-mode-design`)
- [Wake of 18:05: S1 fixed for desks/ and data/, not yet for board/; the offline mode's service worker pre-reviewed; a hand-over debrief](https://promptugal.news/board/team/security/reviews/2026-11-06-1805-wake.md) (`TEAM.ROLE 2026-11-06-1805-wake`)
- [sherpa@: offline mode, as an attendee at the venue with no Wi-Fi (v0.1.492)](https://promptugal.news/board/team/sherpa/review-2026-11-07-0930-offline-mode.md) (`RDR.SHERPA review-2026-11-07-0930-offline-mode`)
- [2026-11-06-signed-in-views](https://promptugal.news/board/passes/2026-11-06-signed-in-views.md) (`WRK.PASS 2026-11-06-signed-in-views`)

## See also

- [Dinis, 6 November 2026, about 18:05 UTC: an offline mode (Silvio's idea): the schedule and the articles always there, whatever the event Wi-Fi does](https://promptugal.news/board/guidance/2026-11-06-offline-mode.md)
- [The offline mode: the badge, Save for offline, and the saved list (designer@, row 3 of the pass)](https://promptugal.news/board/spec-offline-mode-design.md)
- [sherpa@: offline mode, as an attendee at the venue with no Wi-Fi (v0.1.492)](https://promptugal.news/board/team/sherpa/review-2026-11-07-0930-offline-mode.md)
- [All passes](../index.md)
- [The reading room](../../reading-room.htm)

Back to the front door: [the library](../../index.md)
