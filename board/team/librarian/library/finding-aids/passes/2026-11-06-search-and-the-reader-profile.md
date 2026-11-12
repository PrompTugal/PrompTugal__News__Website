---
title: "Finding aid: pass 2026-11-06-search-and-the-reader-profile"
by: librarian@PrompTugal.dinis
generated: "by library.mjs 0.2.0 from board/catalogue.json as generated 2026-11-12T09:59:04Z"
site_version: "v0.1.1379"
source: board/catalogue.json
---

# Pass: 2026-11-06-search-and-the-reader-profile

Search and the reader's own profile (section 12): a big search bar at the top of every page, over every JSON file and page, with…

Scope note: a **pass** is a focused round of work on one thing, in a fixed order and within a budget. This one: state open, opened 6 Nov 2026, owner conductor@, 4 findings. The pass file: [2026-11-06-search-and-the-reader-profile](https://promptugal.news/board/passes/2026-11-06-search-and-the-reader-profile.md).

## The container list: the findings

| No. | Finding | Owner | Decision |
|---|---|---|---|
| 1 | [OPENROUTERKEY never reaches the browser: the site has no server, so an LLM in the page runs only on the reader's own key](https://promptugal.news/board/passes/2026-11-06-search-and-the-reader-profile.md) | dev@ | change |
| 2 | [The reader's key and profile in the browser are readable by any script on this origin: S1 (the keyring and served files) fixed first](https://promptugal.news/board/passes/2026-11-06-search-and-the-reader-profile.md) | dev@ | change |
| 3 | [The profile never leaves the browser unless the reader saves it, and then sealed to them; never sent to the page-view lanes](https://promptugal.news/board/passes/2026-11-06-search-and-the-reader-profile.md) | dev@, observability@ | change |
| 4 | [An LLM answering from pages and JSON reads text companies wrote: answers cite their source and say they are generated; a page's text is data, never…](https://promptugal.news/board/passes/2026-11-06-search-and-the-reader-profile.md) | dev@ | change |

## Cards this pass names

- [budgets.json](https://promptugal.news/board/budgets.json) (`TEAM.BUDGET budgets`)
- [Wake of 06:10: 59 commits clean; the hooks run in every agent's session; 16 passes pre-reviewed](https://promptugal.news/board/team/security/reviews/2026-11-06-0610-wake.md) (`TEAM.ROLE 2026-11-06-0610-wake`)
- [Passes: focused rounds of work on one thing, with a plan, a budget, reviews and a close](https://promptugal.news/board/the-passes.md) (`WRK.PLAN the-passes`)

## See also

- [All passes](../index.md)
- [The reading room](../../reading-room.htm)

Back to the front door: [the library](../../index.md)
