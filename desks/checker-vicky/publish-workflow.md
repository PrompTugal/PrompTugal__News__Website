---
title: "PrompTugal.news: Vicky's desks, daily timeline and publish workflow (draft v0.1)"
date: 2026-11-06
author: Vicky Wang, editor
committed_by: checker@PrompTugal.vicky
status: draft for comments
for: conductor@PrompTugal.dinis, journalist@PrompTugal.dinis
---

# Vicky's desks: daily timeline and publish workflow

Draft for both sides to work from. Comments welcome in a commit back, For: checker@PrompTugal.vicky. Times are UTC, which is Lisbon time in November.

## 1. Who is on Vicky's side

| Agent | Job |
|---|---|
| curator@PrompTugal.vicky | Turns research into storylines: `desks/curator/README.md` |
| programme@PrompTugal.vicky | Agenda: `desks/programme/agenda.json` |
| journalist@PrompTugal.vicky | Beat: the summit (Web Summit itself, practical guides, its numbers and reports, delegations) |
| journalist-portugal@PrompTugal.vicky | Beat: Portugal (startups, funding, universities, government) |
| journalist-europe@PrompTugal.vicky | Beat: Europe (EU, European programmes and countries) |
| journalist-ai@PrompTugal.vicky | Beat: AI and robotics |
| journalist-connections@PrompTugal.vicky | Beat: who at the summit could meet and work with whom |
| reviewer@PrompTugal.vicky | Fact-checks and edits Vicky's drafts; publishes when Vicky asks |
| checker@PrompTugal.vicky | Fact-checks the @PrompTugal.dinis agents' articles and drafts; talks to them |
| designer@PrompTugal.vicky | Design proposals in `desks/designer-vicky/` (paused) |

Research comes from researcher@web-summit.vicky (team site, research vault 41j3e9s9). Vicky's journalists write their drafts in `desks/journalist-vicky/drafts/`.

## 2. Daily timeline

### Vicky's side

| Time (UTC) | Who | What |
|---|---|---|
| 07:30, 11:30, 15:30, 19:30 | researcher | New captures into the research vault |
| 07:45, 11:45, 15:45, 19:45 | curator | Updates the storylines in `desks/curator/README.md` |
| 08:00, 16:00 | five journalists | Each writes at most two new storylines in its beat |
| 08:15 | programme | Refreshes the agenda |
| 08:48, 16:48 | reviewer | Reviews every new draft from Vicky's desks |
| 09:48, 17:48 | checker | Fact-checks new articles and drafts by the @PrompTugal.dinis agents |
| 12:00, 18:00 | people | Stand-ups |
| when Vicky is in | Vicky | Sends Fix-first drafts back, approves, asks for publishing |

### Dinis's side

From `board/schedule.json` (kept by conductor@PrompTugal.dinis, last updated 6 November 2026, 05:40 UTC). At Dinis's word the agents are woken "every hour, tonight and into Friday morning" (CLAUDE.md); the times below are minutes past the hour.

| When (UTC) | Who |
|---|---|
| every hour at :08 | dev@PrompTugal.dinis |
| every hour at :18 | observability@PrompTugal.dinis |
| every hour at :21 | ontologist@PrompTugal.dinis |
| every hour at :26 | journalist@PrompTugal.dinis (writes and publishes) |
| every hour at :38 | outreach@PrompTugal.dinis |
| every hour at :44 | synthetic@PrompTugal.dinis |
| every hour at :52 | conductor@PrompTugal.dinis (reports to Dinis every three hours, 05:52, 08:52, ...) |
| every two hours at :03 (00:03, 02:03, ...) | security@PrompTugal.dinis |
| every two hours at :14 | devops@PrompTugal.dinis |
| every two hours at :41 | correspondent@PrompTugal.dinis (the front page and the beats; ideas in `desks/correspondent/ideas/`) |
| every three hours at :29 (00:29, 03:29, ...) | sherpa@PrompTugal.dinis |
| every three hours at :47 | accountant@PrompTugal.dinis |
| every three hours at :56 | librarian@PrompTugal.dinis |

The designer's hourly task (:33) is disabled. The other agents in CLAUDE.md's table have no entry in `board/schedule.json`.

## 3. The workflow, step by step

| Step | Owner | Status after | Where |
|---|---|---|---|
| 1. Assign | curator picks storylines | (storyline listed) | `desks/curator/README.md` |
| 2. Write | any journalist, either side, after checking the story isn't already in `desks/journalist-vicky/drafts/`, `desks/journalist-promptugal/drafts/` or `content/articles/` | `draft` | Vicky's journalists: `desks/journalist-vicky/drafts/`; Dinis's: `desks/journalist-promptugal/drafts/` |
| 3. Fact-check | a reviewer or checker: every claim in its source, numbers, names, dates, links | `in-review`, then `fix` or `ready` | `desks/reviewer-vicky/reviews/`, `desks/checker-vicky/findings/` |
| 4. Fix | the writer, then the reviewer checks again (two rounds at most, then the editor decides) | `ready` | the writer's drafts folder |
| 5. Editor approval | Vicky for her desks; Dinis for his | `approved` | front matter |
| 6. Publish | journalist@PrompTugal.dinis, or reviewer@PrompTugal.vicky when Vicky asks | `published` | `content/articles/<slug>.md`, signed (`articles/<slug>.md.sig`) |
| 7. Corrections | the writer fixes, a reviewer re-checks, the article shows a dated correction note | `published` (corrected) | `content/articles/` |

A storyline that duplicates another is set to `dropped`; the file stays.

## 4. Status field

Every draft's front matter carries `status:`. The values and who may set them:

- `draft`: the writer
- `in-review`, `fix`, `ready`: the reviewer or checker
- `approved`: the editor only (Vicky or Dinis, or an agent on their word)
- `published`: the publisher
- `dropped`: the editor or the reviewer, on the editor's word

Nothing is published without `approved`.

## 5. Rules both sides keep

- Check before writing (step 2). If the story exists, don't write it; tell your editor.
- Never edit another agent's files. Leave a finding in your own folder with `For: <agent>` in the commit.
- Technical format matches the published articles; each desk keeps its own writing style.
- Sources are written `[Publisher, "Title"](url), date published, read D Month YYYY`, so they are clickable.
- Push only to `dev` (through `newsroom/tools/release.sh`), never `--force`, never `main`.
- Hand-offs happen in commits: `For: <agent>` names who should act.

## 6. Open questions for Dinis's side

1. The times above are from `board/schedule.json` and run "into Friday morning": what are the @PrompTugal.dinis agents' times after that, so the two timelines keep lining up?
2. Step 5: today Ready drafts are published without an approval step. Should `approved` be required from now on, or only for some desks?
3. Who fact-checks Vicky's drafts on Dinis's side, or is reviewer@PrompTugal.vicky enough for now?
4. Does journalist@PrompTugal.dinis read the `status:` field, or the reviewer's verdict, to know what to publish?
5. What should a correction note on a published article look like?
6. The checker never edits another agent's files, so it cannot set `in-review`, `fix` or `ready` on a Dinis draft. Should the writer set them from the checker's findings?

## What the checker changed from Vicky's draft

- Section 1: journalist@PrompTugal.vicky's beat worded as in `desks/journalist-vicky/STYLE.md` ("past editions" is not in it); added designer@PrompTugal.vicky (paused), and where Vicky's journalists write.
- Section 2: the checker runs at 09:48 and 17:48, not 10:00 and 18:00 (set a few minutes early, as runs on the hour are often delayed); "new work" narrowed to articles and drafts, as Vicky asked on 6 November. Added Dinis's side, from `board/schedule.json`. The other times match the desks' saved prompts.
- Section 3: step 2's "the writer's own desk folder" named (Vicky's journalists share `desks/journalist-vicky/drafts/`); step 6 says the article is signed, as CLAUDE.md requires.
- Section 5: the source line adds "date published", as STYLE.md has it; pushes go through `newsroom/tools/release.sh`.
- Section 6: question 1 reworded now that the times are known; question 6 added.
- Kept as Vicky wrote them: editor approval, cross fact-checking, the status values and who sets them, who publishes.
