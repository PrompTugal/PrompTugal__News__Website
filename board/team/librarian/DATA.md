---
title: "The librarian's data: what each file holds, so an agent reads the JSON and not the pages"
by: librarian@PrompTugal.dinis
written: 2026-11-10T19:20Z
after: Dinis, 10 November 2026, 17:15 UTC (board/guidance/2026-11-10-agents-that-save-tokens.md): "keep writing JSON first ... with a small README per file saying what it holds, so other agents read the JSON and not the pages"
---
# The librarian's data

Every file below is generated at each librarian wake (every three hours at :56 UTC), never hand-edited, and says what it is in its own `about` field. Read the smallest file that answers your question; each is a pre-digested view of the whole repository, so an agent need not crawl pages or `git log` itself.

| File | Size (10 Nov) | What it holds | Read it to answer | Made by |
|---|---|---|---|---|
| `board/team/librarian/jump.json` | 90 KB | every rendered page: title, path, URL, one line | "which page is about X?" (the newsroom search's jump list) | `catalogue.mjs` |
| `board/team/librarian/waits-on-dinis.json` (and `.md`) | 66 KB | every block and question waiting on Dinis, from every `status.json`, the open decision pages and the ideas ledger | "what is Dinis the blocker on?" (CLAUDE.md, "Never blocked in silence") | `catalogue.mjs` |
| `board/team/librarian/life.json` (and `life.md`) | 40 KB | every agent: its keys (active, superseded), its last own commit, its state on account B, flags (silent, no key) | "who is on, who holds which key, who has gone quiet?" | `life.mjs` |
| `board/team/librarian/library/provenance/pieces.json` | 240 KB | every published piece's flow in time order: actor, stage, commit, trailers, story codes, the desk files that name it | "who touched this article, in what order, was it checked?" (the visual newsroom) | `provenance.mjs` |
| `board/catalogue.json` (and `catalogue.md`) | 3 MB | everything: pages, board files (bulk material per series), desks, passes, findings, ideas, questions, concepts, agents, with who made each and when | "where is X, and who made it?" when the smaller files do not say | `catalogue.mjs` |
| `board/team/librarian/library/cards.json` | 1.3 MB | the library's cards: a call number, an accession number, provenance and typed links per holding | "what links to X?" (cites, part_of, answers, supersedes, made_by) | `library/build/library.mjs` |
| `board/team/librarian/library/graph/library-graph.json` | 0.9 MB | the cards as a graph in the site explorer's shape | drawing the map | `library/build/library.mjs` |

Smaller views live beside them: `library/indexes/` (title, subject, agent, series), `library/authority/` (agents, companies, people, organisations, places, topics, concepts), `library/reality/` (the reality tree: what EXISTS with evidence, what is PROPOSED), `library/stocktake/` (what cannot be found, and the ledger audits).

Ask at the reference desk (my inbox, `board/inboxes/librarian.json`) when none of these answers your question; the answer goes on the record in `library/desk/`.
