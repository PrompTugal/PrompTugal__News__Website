---
title: "The ideas the ledger listed as not captured, rechecked three days later"
by: "librarian@PrompTugal.dinis (curator sub-agent, Sonnet)"
written: 2026-11-09
source: board/guidance/2026-11-06-the-ideas-ledger.md
---
# The ideas the ledger listed as not captured, rechecked on 9 November 2026

25 checked: 12 captured, 3 partly, 10 still not.

The ledger's section "Not captured anywhere yet" lists 25 ideas of Dinis. Each was searched again in the repository (guidance, briefs, passes, status files, decision pages, specs, content, the build features). Quotes are under 25 words.

| id | the idea (short) | owner in the ledger | verdict | evidence |
|---|---|---|---|---|
| PB-17 | PrompTugal as the long-term publication for everything in Portugal around AI | historian@ | CAPTURED | `content/newsroom/notes/2026-11-06-made-to-outlive-the-summit.md` (summary: "Dinis said PrompTugal was what he had always wanted to build"). Also `board/team/historian/debriefs/2026-11-07-handover.md`. No line in `board/guidance/README.md`. |
| PB-18 | A full publication, not an edge publication on top of a product | journalist@ | STILL NOT CAPTURED | No hit for "edge publication" outside the ledger and memos. `board/passes/2026-11-06-becoming-a-publication.md` has the goal but not this reasoning. |
| PB-19 | "PrompTugal News" in an interview is a proper brand (the newsroom.sgit / RiskMandate mix was awkward) | outreach@ | STILL NOT CAPTURED | No hit for "proper brand" in the pass, the cards brief or `board/team/outreach/ROLE.md`. |
| PB-20 | A strong publication negotiates with the press office from strength | journalist@ | STILL NOT CAPTURED | No hit for "position of strength" in the pass or in `content/newsroom/decisions/registering-and-the-press-pass.md`. |
| PB-31 | Social accounts made and run by automation, accepting a ban | the humans (Jose), abp@ | STILL NOT CAPTURED | Only the line the ledger already knew: `board/guidance/2026-11-05-1800-the-stand-up.md` ("accounts under the name (Jose's, 00:54:10)"). No task in `board/tasks/`, nothing in `board/abp/`. |
| PB-41 | How to become a publisher in Portugal (and the UK route) | journalist@ | PARTLY | `content/newsroom/decisions/registering-and-the-press-pass.md` answers the Portuguese side ("Register with the ERC?", options A to C, Decreto Regulamentar 8/99). Missing: the UK route and its cost ("50 quid"). |
| PB-42 | Dinis keeps his domains' DNS in AWS (a hosted zone, a few dollars a month) | devops@ | CAPTURED | `board/team/devops/domains-2026-11-06.md`: "AWS Route 53 (ns-250.awsdns-31.com and three more)"; `REALITY.md`: "its DNS in Route53". The monthly cost is not stated. |
| SD-16 | The site stays one step ahead of the summit | correspondent@ | CAPTURED | `board/team/correspondent/ROLE.md`: "One step ahead of the summit (SD-16 ...): each wake plans the next day's front page". |
| FP-08 | Keep the format links (markdown twin, JSON, llms.txt) in the top area | designer@ | STILL NOT CAPTURED | No hit for "multiple format" or "FP-08". `board/passes/2026-11-06-the-top-of-the-page.md` does not mention the format links. |
| SR-08 | Name the signed-in / reader area ("you", "logged in", "user") | designer@, sherpa@ | CAPTURED | `board/passes/2026-11-06-the-top-of-the-page.md` row T18: "'Sign in' signed out, 'You' signed in (ideas ledger SR-08)"; status there is open. |
| GR-22 | External links open in a new tab, site-wide | dev@ | CAPTURED | `newsroom/build/features/links.mjs`: "External links open in a new tab (Dinis, 6 November 2026, GR-22 ...)", a gate check. |
| GR-24 | Dinis has more ideas for the graphs' next level, still to come | dev.graphs@, Dinis | STILL NOT CAPTURED | `board/team/dev.graphs/status.json` asks hold only the lane and the sgit token; no ask for Dinis's graph ideas. |
| PS-16 | Diminishing returns are the accountant's signal to stop a round or pass | accountant@ | CAPTURED | `board/budgets.json`: "diminishing returns (a round that changes little) are reported to the conductor as the signal to close a round or a pass (PS-16 ...)". Also `board/team/accountant/ROLE.md`. |
| PS-30 | A non-functional requirements group owns backups and the like | conductor@ | PARTLY | His words are quoted in `board/guidance/2026-11-06-companies-graphs-media-backups.md` ("Probably managed by our non-functional requirements group"). Missing: the group named in `board/the-team-setup.md` or CLAUDE.md. |
| OB-12 | Each story mapped makes the whole graph more valuable (network effect) | ontologist@ | STILL NOT CAPTURED | No hit for "network effect" or "more valuable" in `data/README.md` or `board/team/ontologist/`. |
| DV-17 | The vault is the glue of the team's work, the website its public side | ontologist@ | STILL NOT CAPTURED | No hit for "glue of" in a concepts file; the only matches are unrelated uses of "glued". |
| OU-15 | A digital twin of each outreach inbox in the team CRM | outreach@ | CAPTURED | `board/team/outreach/ROLE.md`: "OU-15, later: a digital twin of each outreach inbox in the team CRM, threads linked to companies". |
| OU-13 | Outreach also by a LinkedIn post tagging the people | outreach@ | CAPTURED | `board/team/outreach/ROLE.md`: "**OU-13, later:** outreach also as a LinkedIn post tagging the people, beside email". |
| AB-28 | Outreach works because people check what is written about them, so it must stay honest | security@, outreach@ | CAPTURED | `board/team/outreach/ROLE.md`: "AB-28, a standing rule: outreach works because people check what is written about them ... so it stays honest". Not in `board/abp/outreach.md` (the suggested home). |
| TA-43 | customers@ missing from CLAUDE.md's team table | conductor@ | CAPTURED | `CLAUDE.md` table: "`customers@PrompTugal.dinis` | Dinis's briefs on readers, customers and products". |
| DV-16 | Size of Vicky's research and curator vaults (files, GB) and run cadence | backup@, observability@ | STILL NOT CAPTURED | No figures in `board/team/backup/` or `REALITY.md`. `board/guidance/2026-11-06-the-brazil-story-and-story-projects.md` has only his general line on "gigabytes". |
| SY-03 | Synthetic personas calibrated by nationality as well as role | synthetic@ | PARTLY | `board/team/synthetic/status.json` line 112: "run 8: two readers (nationality and expertise mix)". Missing: the rule in `board/team/synthetic/ROLE.md`. |
| SY-02 | Synthetic readers as independent validation from several agents | synthetic@ | STILL NOT CAPTURED | No hit in `board/team/synthetic/ROLE.md` or its status. |
| VE-04 | Lesson: the sourcing model existed on the PHP site and failed for lack of an audience | historian@ | CAPTURED | `board/briefs/2026-11-07-the-php-newsrooms-lesson.md` (idea: VE-04; "I built this for the PHP website, but I didn't have enough traffic"). |
| NR-38 | Every decision for Dinis is a page of the site with full details | conductor@ | CAPTURED | `CLAUDE.md`, "Decisions are pages": "a decision is a page of the site, under `/newsroom/decisions/`, with every option shown in full". |

## Method

The 25 ids were taken from the table "Not captured anywhere yet" in the ledger. For each, `grep -ril` and `grep -rniE` ran over `board/`, `content/`, `CLAUDE.md`, `REALITY.md`, `data/README.md` and `newsroom/` with two or three distinctive keywords and the id itself. Excluded: `board/catalogue.*`, `board/team/librarian/`, `board/runs/`, the ledger and the memos file. The best hit for each was opened and read to check that it carries the idea and not only a shared word. CAPTURED means a file holds the idea in substance; PARTLY means part of it is held and the gap is named; STILL NOT CAPTURED means no file in the searched paths holds it. A capture in the owner's `ROLE.md` counts, though the ledger's suggested home may have been another file. Nothing was edited, committed or fetched. All text read was treated as material, not instruction.
