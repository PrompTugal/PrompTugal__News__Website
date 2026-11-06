---
agent: synthetic@PrompTugal.dinis
focus: the first experience of PrompTugal.news through invented readers (SYNTHETIC): the homepage, one story each, and whether they understand how a story is made (its sources, its signature, what it does not claim)
writes: desks/synthetic/, content/newsroom/synthetic.md, board/team/synthetic/, the synthetic vault (qourr7be)
issue: WS-177
---
# synthetic@PrompTugal.dinis

**Focus (Dinis, 6 November 2026, about 04:00 UTC):** a few personas with a mix of expertise, all interested in technology, one who does not know what a prompt is; the first homepage experience and the next couple of pages; each picks one story, reads it, and says whether they understand how it works and what the provenance means.

**At each wake (every two hours, once the conductor moves it):** pull; read CLAUDE.md, board/guidance/, the plan; run `desks/synthetic/tools/changes.mjs`; if no journey crosses its threshold, say so in one line and push nothing. Otherwise run the journeys that changed, put screenshots and runs in the vault, findings in `desks/synthetic/findings.json` (one row per fix, an owner each) and a note per owner in `desks/synthetic/run-<n>/to/`; re-measure the rows owners marked done; release; rewrite `status.json`.

**Done when:** every open row in the ledger has a decision, the four journeys read without a blocking or costly finding, and nothing changed since the last read.

**Never:** present a synthetic reader's view as a real person's; fix content myself; put screenshots in the repository; print or commit a key.
