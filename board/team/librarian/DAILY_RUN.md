---
title: "The librarian's daily run: the playbook and the work queue"
by: librarian@PrompTugal.dinis
started: 2026-11-06T13:20Z
after: the SG/Send librarian's DAILY_RUN.md (team/roles/librarian/ in the-cyber-boardroom/SGraph-AI__App__Send), gone beyond at Dinis's word (board/team/librarian/library/COMMISSION.md)
---
# The librarian's daily run

Start every wake by reading this file. End every wake by updating it (the queue below and the last line of the log).

## The routine (every wake)

1. **Open the library.** `git pull --rebase origin dev`; if `board/HOLD.md` exists, stop and say why. Read CLAUDE.md, `board/guidance/` (what is new since the last wake), my ABP (`board/abp/librarian.md`), this file.
2. **The reference desk.** Drain my inbox (the team site's `feedback_drain.py --creds ~/.sg-send/lanes/inbox.json`; needs `sgit-ai`, `pip install sgit-ai==0.27.0` if the session is new). Every question becomes a call slip in the register (`library/desk/`), answered on the record within the wake if it can be, and the answer sent back sealed to the asker. A question I cannot answer yet says so, and when.
3. **Accession.** What is new since the last wake (git log since my last commit): every new page, board file, desk, pass, finding, decision, idea, agent gets its card, its accession number and date, its provenance.
4. **Catalogue.** `node newsroom/build/build.mjs && node board/team/librarian/catalogue.mjs`: the catalogue, the jump list, what waits on Dinis.
5. **The reality tree.** Move what shipped from PROPOSED to EXISTS, with its evidence; add a pointer line to `library/reality/changelog.md`; where REALITY.md and the evidence disagree, tell the conductor.
6. **Stocktake.** The health scan: what cannot be found, agents with no row, key or ROLE.md, blocks nobody has put to Dinis. Each finding to its owner, never fixed by me in their paths.
7. **One task from the queue below**, if time is left.
8. **Close.** Rewrite `status.json`; `node board/abp/tools/abp.mjs run-report --role librarian`; commit with the convention; `AGENT=librarian@PrompTugal.dinis newsroom/tools/release.sh`.

## The sub-agent loop (inside the library, at Dinis's word)

The library is built the way the devs build: an **architect** designs (`library/ARCHITECTURE.md`), a **dev** builds in rounds, an **information designer** shapes the reading room (`library/design/`), **curators** keep the reality tree, and I review every round (the diff, the generator's output, the rules) before it is committed under my name. Sub-agents run on Sonnet or Haiku, write only under `board/team/librarian/`, and never commit or push. Other agents review on the record: each review asked on their inbox, answered in a call slip.

## The queue (important, not urgent)

| # | Task | State |
|---|---|---|
| Q1 | The architecture (architect sub-agent), reviewed by me, then by ontologist@, dev@, dev.graphs@, designer@, security@, sherpa@ | drafted (`library/ARCHITECTURE.md`); reviews asked 13:35 on their inboxes |
| Q2 | The reality tree, first draft (curator sub-agent) | drafted: 12 domains, 146 EXISTS, 258 PROPOSED; REALITY.md's gaps sent to conductor@ |
| Q3 | The reading room and the service desk (information designer) | drafted (`library/design/READING-ROOM.md`) |
| Q4 | The reference desk open: the register, the call slip, the first notice to every agent | open (13:50): 5 slips, all answered; the notice to every agent next |
| Q5 | The cards and the authority file (dev, round 1 of the architecture) | round 1 done (13:40): 2,417 cards in 10 classes, the accession register, the authority file for agents (48 records), the shelf list; 10 tests green; `library.mjs check` OK. Round 2 done (14:05): 8,192 typed links with inverses, authority for 120 companies, 264 people, 223 organisations, 80 places, 17 topics, 94 concepts; 75 subject headings (58 proposed to ontologist@); four indexes; the reality tree's generated blocks; the stocktake (ST codes) and weeding; 26 tests green |
| Q6 | The library graph in the existing explorer's shape (with dev.graphs@ and ontologist@) | round 3 done (14:15): library-graph.json (1,025 nodes, 6,289 edges) and reality-tree.json in explorer.json's shape, 9 presets, the reading room (`reading-room.htm`) drawn with the site's own engine; finding aids; Dinis's guidance as a special collection; signatures verified at the desk |
| Q7 | The site section `/library/`: asked of Dinis and abp@ (beyond my grant) | asked |
| Q8 | Every idea of the night memos checked against the memos themselves (conductor@'s ask: report any the ledger missed) | queued |
| Q9 | The Later list findable from `board/README.md` (conductor@'s ask; the README is the conductor's: a finding to it) | queued |

## The log (one line a wake)

- 2026-11-06 13:20: Dinis's commission; the playbook; round 1 of the library (architect, information designer, curator) started.
- 2026-11-06 13:35: round 1 drafts in (architecture, reading room, reality tree); reviews asked of ontologist@, dev@, dev.graphs@, designer@, security@, sherpa@; dev round 1 started.
- 2026-11-06 13:45: dev round 1 reviewed and released: cards, accession, provenance, authority for agents, shelf list.
- 2026-11-06 14:05: round 2 reviewed and released (links, authority, vocabulary, indexes, reality blocks, stocktake); 2,507 cards.
| Q10 | The reading room as `.html` and the explorer caption glitch at desktop width: for dev@ (the gate treats any .html as a site page) | asked |
| Q11 | The graph legible on a phone (fewer, larger nodes first; the picture higher on the first screen): designer@ and sherpa@ | asked |
- 2026-11-06 14:15: round 3 reviewed (screenshots read) and released: the library graph and the reality tree in the site's explorer, the reading room, finding aids, the guidance collection, verified signatures.
- 2026-11-06 15:56 (wake): 8 messages drained, 3 new reviews taken in (security@ go; dev.graphs@ data-driven explorer; ontologist@ concepts as data) and answered; round 4 released (data-driven looks and presets, phone view of 30 nodes on the first screen, concepts from data/concepts.json); dev@ asked to bring 5d2e3db (work/dev.graphs) onto dev.
