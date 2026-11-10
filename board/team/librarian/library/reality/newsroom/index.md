# Newsroom: the back end section: EXISTS

**Domain:** `newsroom/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

`/newsroom/` and everything under it: overview, dashboard, agents, desks, decisions, notes, runs, quality, security, design reviews, orders, customers, stories.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] The move from admin to newsroom (section, API, files, schemas) in one commit; note in board/the-newsroom-move.md. Evidence: `board/the-newsroom-move.md`, `newsroom/build/features/newsroom.mjs`; first added `42dd7e30` on 2026-11-06.
- [F] Overview and plan at a glance, drawn from data at every release. Evidence: `newsroom/build/features/newsroom-model.mjs`, `newsroom/build/features/newsroom-draw.mjs`, `data/newsroom/plan.json`; first added `d5dcff89` on 2026-11-06.
- [F] Dinis's dashboard `/newsroom/dashboard/`. Evidence: `newsroom/build/features/dashboard.mjs`, `content/newsroom/dashboard.md`; first added `54f1f3ef` on 2026-11-06.
- [F] Agents: an index and one page per agent (32 pages, including earlier newsroom-* agents), from data. Evidence: `data/newsroom/agents.json`; first added `d5dcff89` on 2026-11-06.
- [F] Decisions index `/newsroom/decisions/`, built from the pages' front matter; one decision page (naming people on Algarve Evolution). Evidence: `newsroom/build/features/decisions.mjs`, `content/newsroom/decisions/index.md`, `content/newsroom/decisions/naming-people-on-algarve-evolution.md`; first added `f75ebff4` on 2026-11-06.
- [F] Design decision pages for Dinis: the top of every page, the front page, the summit's days, the list pages. Evidence: `content/newsroom/design/decisions/the-front-page.md`, `content/newsroom/design/decisions/the-top-of-the-page.md`, `content/newsroom/design/decisions/the-summit-days.md`, `content/newsroom/design/decisions/the-list-pages.md`; first added `1a984029` on 2026-11-06.
- [F] Design reviews and rounds under `/newsroom/design/`. Evidence: `content/newsroom/design/index.md`, `content/newsroom/design/front-page-round-1.md`, `content/newsroom/design/home-review.md`; first added `5f10fb2f` on 2026-11-06.
- [F] Desks page: curator runs, captures by beat, story candidates. Evidence: `newsroom/build/features/desks.mjs`, `content/newsroom/desks.md`; first added `5e109fc4` on 2026-11-06.
- [F] Story board `/newsroom/stories/` (one page per story, AI1 to AI5 and others). Evidence: `newsroom/build/features/stories.mjs`, `content/newsroom/stories.md`; first added `dafd4d8c` on 2026-11-06.
- [F] Verification page (three models re-check each claim). Evidence: `newsroom/build/features/verification.mjs`, `content/newsroom/verification.md`; first added `9a83e80b` on 2026-11-06.
- [F] Quality page: where code holds words rather than data, with a gate ratchet. Evidence: `newsroom/build/features/quality.mjs`, `content/newsroom/quality.md`, `newsroom/build/quality-baseline.json`; first added `5e109fc4` on 2026-11-06.
- [F] Newsroom notes `/newsroom/notes/` and the first note (the sign-in). Evidence: `newsroom/build/features/notes.mjs`, `content/newsroom/notes/2026-11-06-the-sign-in.md`; first added `3157e73b` on 2026-11-06.
- [F] Runs ledger `/newsroom/runs/` (from data/newsroom/runs, by tool). Evidence: `newsroom/tools/runs.mjs`, `data/newsroom/runs`; first added `d5dcff89` on 2026-11-06.
- [F] Security page. Evidence: `content/newsroom/security/index.md`; first added `9ee82830` on 2026-11-06.
- [F] Synthetic readers page (personas, runs, findings). Evidence: `content/newsroom/synthetic.md`; first added `d5dcff89` on 2026-11-06.
- [F] Customers page and business-card orders page. Evidence: `content/newsroom/customers/index.md`, `content/newsroom/orders/business-cards.md`; first added `7d3ad035` on 2026-11-06.
- [F] Team-site snapshot (data, by tool). Evidence: `newsroom/tools/desks-snapshot.mjs`, `data/newsroom/team-site.json`; first added `d5dcff89` on 2026-11-06.
- [F] Newsroom API `/api/v1/newsroom/` (desks.json and others). Evidence: `newsroom/build/features/api.mjs`; first added `d5dcff89` on 2026-11-06.

<!-- library:generated -->
## The library's cards in this domain (generated)

151 cards (151 current, 0 superseded, 0 withdrawn), from the catalogue generated 2026-11-10T21:58:54Z at site v0.1.1085; by library.mjs 0.2.0, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.

| Call class | Cards |
|---|---|
| `PUB.NEWS` | 151 |

Newest five accessions:

- `ACC-20261110-0288` [How each piece is made](https://promptugal.news/newsroom/pieces/) (`PUB.NEWS pieces`)
- `ACC-20261110-0287` [The decision graph (Storm Charles)](https://promptugal.news/newsroom/decision-graph/) (`PUB.NEWS decision-graph`)
- `ACC-20261110-0286` [S45: Web Summit's cancelled Day 2: what is known about refunds](https://promptugal.news/newsroom/stories/S45/) (`PUB.NEWS S45`)
- `ACC-20261110-0285` [S44: Update: Web Summit's Wednesday will not take place; it aims to hold Thursday](https://promptugal.news/newsroom/stories/S44/) (`PUB.NEWS S44`)
- `ACC-20261110-0235` [S43: Wednesday's alert: what the government has closed across Portugal](https://promptugal.news/newsroom/stories/S43/) (`PUB.NEWS S43`)
<!-- /library:generated -->

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
