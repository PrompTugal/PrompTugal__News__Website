---
title: "The offline mode: the badge, Save for offline, and the saved list (designer@, row 3 of the pass)"
by: designer@PrompTugal.dinis
written: 2026-11-06T18:55Z
pass: board/passes/2026-11-06-offline-mode.md
for: dev@PrompTugal.dinis, dev.pages@PrompTugal.dinis, dev.search@PrompTugal.dinis (the reader's profile); security@ (its two conditions)
issue: WS-177
---
# The offline mode, designed (phone first, in C's top)

Pictures: `design/decisions/offline/{1-badge,2-save,3-saved}--phone.jpg`; made with `node design/mockups/offline/make.mjs` (self-contained pages to lift).

| # | Piece | Design |
|---|---|---|
| O1 | **The offline badge** | In the top row, before the credit: a pill "● Offline" in the warn colours (`--warn` text and dot on `--warn-soft`). Under the top, a band in the same colours: "**You are offline.** This is the copy saved on <day> at <time>; it may be out of date. Search and Ask need a connection." The time is always the copy's own (security@'s condition: a stale page is never shown as current). The band shows on every page while offline; the pill stays in the top. |
| O2 | **Save for offline** | On an article's byline row, after "signed": an outlined pill "⤓ Save for offline"; once saved it turns green, "✓ Saved for offline · <day> <time>". One tap keeps the article, its pictures and its sources. |
| O3 | **Saved for offline** (under You, from the More tab) | "Kept on this phone only. Nothing about it is sent anywhere." Two groups: "Always kept" (My day, the summit's days, each with when its copy was made) and "Articles you saved" (thumbnail, title, when saved, size). At the end a red outlined full-width button "Clear offline data" with one line under it: "Removes every saved copy from this phone and stops keeping new ones." (security@'s way out). |

The pill and band use the brand's warn tokens, not the live red (red means live news here); the saved state uses the brand green, as every other "done" state does.

## Round 2: sherpa@'s offline review (7 November, 09:30, `board/team/sherpa/review-2026-11-07-0930-offline-mode.md`)

Pictures: `design/decisions/offline/4-page--phone.jpg`, `5-kept--phone.jpg` (the same tool, `design/mockups/offline/make.mjs`, views 4 and 5).

| sherpa@'s # | Design | Owner |
|---|---|---|
| O3, the offline page looks broken | **The site's offline page in the site's own look** (picture 4): C's top with the Offline pill, the tab bar, and "This page is not on this phone yet. It opens next time you have a connection. Meanwhile, this is what this phone has kept:", then the kept pages ("Always kept": Now, the agenda and the summit's days, My day, each with its copy's time) and **the saved articles by title** (from the same store as "Saved for offline"); "Search and Ask need a connection." The service worker serves this page, cached with its CSS and fonts at install, for any page it does not hold (sherpa@'s O2 too: queries included) | dev@ (the page and the worker), from this picture |
| O4, which articles open is a guess | **A "✓ kept" mark on every link that will open** (picture 5), and "✓ saved" on the ones the reader saved; the others muted, with "needs a connection" in the warn colour in place of their meta line. Only offline: online, nothing changes. The band says it once: "Links marked ✓ kept open; the others need a connection." The page's script asks the cache which links it holds | dev@ |
| O5, the credit counts down | **Offline, the credit pill gives way to the Offline pill** (pictures 1, 4, 5): nothing can be bought or asked offline, so the balance is not shown; reading offline is not counted. Whether a reading counts at all, and pounds or euros, stays Dinis's | dev@; Dinis (the currency) |
| O1, four tabs fail offline | not design: keep the Agenda, News and Companies tabs' pages and the summit days' event pages at install (they are what the tab bar promises); picture 4 lists them as "Always kept" once they are | dev@ |

**Re-check of round 2 at 10:45 UTC, after dev@'s 8cdc96bae**, offline in a 390 px browser after one online visit: **pass** O1 (the Agenda and News tabs open offline, with the band "This copy was kept Sat 10:35"), O2 (`/?design=e` opens the kept copy, not the browser's error page), O5 (no credit pill offline). **O3 in part:** the offline page is in the site's type and lists what is kept, but has no top or tab bar (a reader has no way to the tabs from it), no copy times, no grouping into "Always kept" and "Articles you saved", and the days are out of order (Thursday 12 before Wednesday 11). **O4 not yet** (no "kept" mark on links).

**Re-check at v0.1.532 (12:40 UTC), after dev@'s ec82b95ec:** **O3 passes:** the offline page is a page of the site (C's top, the band, the tab bar), "Offline copies", grouped, each copy with the time it was kept. **O4 passes, with two refinements** (`design/decisions/offline/check-v0.1.532-kept--phone.jpg`): the "kept" mark shows twice per story (after the title and again under the thumbnail): keep the one after the title; and it marks the page's own section switches ("The wire", "By day", "By topic"), which never need the network: leave those unmarked. Not seen yet: the muted "needs a connection" on a link that is not kept (every link on the page was kept in this run).
