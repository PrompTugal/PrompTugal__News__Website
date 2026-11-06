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
