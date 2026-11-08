---
story: JW1
title: "JW1: every fact of the one-door piece re-opened at its source"
checked: 2026-11-07T20:15Z
checker: writer@PrompTugal.jose
---
# JW1: the check

Each fact of the draft (`desks/writer-jose/drafts/jw1-one-door.md`) re-opened at its source on 7 November 2026, between 20:00 and 20:15 UTC, in the Web Summit team's site (SGit-AI/SGit-AI__Website__Web-Summit) at commit 1b143bb8 on `dev`, with its history to 3,053 commits. Where a first wording said more than the source, the draft follows the source. Jose's reviewer (reviewer@web-summit.jose, 20:13 UTC) re-opened every fact independently and found nine more; all nine are taken, and marked below.

## Corrected while drafting

| The first wording said | The source says | The draft now |
|---|---|---|
| Each agent had "its own schedule" | `people/jose/agents.json`: seven on a schedule; the designer and the sales coach on demand; the reviewer once per push and the accountant in the conductor's 07:20 wake | Seven on a schedule, two opened by Jose, two inside other runs (made exact after Jose's reviewer) |
| Jose had to read every agent's list and tell each agent separately | Not stated anywhere. The task files from 4 November (`2026-11-04-dev-ws74.md`, `2026-11-04-vault-lane.md`) were already written by the conductor; the protocol says older task files have no `status:` line | What waited on Jose was spread across the agents' files; task files existed from 4 November, but were not the only way in |
| Jose "added" the Agents board on 7 November | `people/jose/kit/README.md` describes it (C31); its task `2026-11-07-designer-agents-board.md` is `status: open`; Actions rows 3 and 4 say the designer waits to be started | Asked for, not built yet |
| Two agents used the direct log | `people/jose/tasks/direct/`: dev 3 lines, crm 5, writer 1 (this desk's own line of 7 November); dev's three lines (01:03, 01:14, 14:19 on 5 November) predate the rule, "added for the record" | Three agents, dev's lines said to predate the rule (the last part after Jose's reviewer) |
| No one measured the time Jose spent | No measure found; absence cannot be shown from the files | "This piece found no measure" |
| Dinis Cruz "leads the team" | `data/team.json`: "Operator: RiskMandate, the strategy, the senior meetings" (the same card also says `leads: the team, the briefs and the agents`, so the first wording was supported too) | "the team's operator" |
| The three questions summarised as two | Brief 10, ask 3, has three: (a) Dinis's direct work, (b) "tell the conductor" on a hold, (c) the command centre's list | "Among them", two named |

## Confirmed

| Fact in the draft | Source (team site, at 1b143bb8 unless a commit is named) |
|---|---|
| Jose's role: technical, automation, messaging and the agents | `data/team.json`, member `jose`: "Technical: automation, messaging, the agents" |
| About a dozen agents; the eleven named by 5 November | `people/jose/agents.json`: 13 entries today; crm@web-summit.jose started 5 November at 23:17 UTC and writer@PrompTugal.jose on 7 November, after the rule; the other eleven before it (the sales coach's key at 12:53 UTC on 5 November) |
| Their own lists: "Waiting on Jose", "Decisions for Jose", the enum-key decision, the broadcast look | `people/jose/tasks/2026-11-05-all-one-door.md`, the last bullet |
| Jose's words, "I stop being the middleman ... what needs me" | `people/jose/tasks/README.md`, the opening (recorded by conductor@web-summit.jose); the first two sentences also in commit 2191c0b2 |
| Released at 15:23 UTC on 5 November, after review | commit 2191c0b2: written 14:35:41, committed 15:22:33 with the reviewer's record `2026-11-05-1446-conductor.md` inside; released as the team site's v0.2.586 (cba0d10b) at 15:23:27. First wording said "pushed at 14:35": corrected after Jose's reviewer |
| Work through the conductor only, in its session or the daily interview; voice mode | `people/jose/tasks/README.md` step 1; brief 15, ask 1 ("In Claude Chat voice mode") |
| Task file name and header fields; the status values | `people/jose/tasks/README.md` step 2 |
| Picked, Report, done or blocked | `people/jose/tasks/README.md` step 3 |
| Commits to the conductor; the direct log | `people/jose/tasks/README.md` step 4; kit, "one door" |
| One list, the Actions section of Jose's dashboard, with due and duration | `people/jose/tasks/README.md` step 5; `people/jose/dashboard.md`, Actions is the first section |
| Work from anyone else goes through the conductor; Dinis's word reaches them as a task file | kit, "one door", last bullet; commit 2191c0b2, "Affects everyone" |
| Seven agents; the watcher already reported; reviewer and accountant are sub-agents | kit, "one door", first paragraph; the task file's `for:` line |
| The five Reports, their times and what each handed over | `people/jose/tasks/2026-11-05-all-one-door.md`, the five Report headings and bodies; commits 7b73d241, 562918f9, 5923d4e2, 5c6ddde3, ce6c8ab6 |
| At each agent's next scheduled run | `agents.json` schedules (dev 09:30 and 15:30, automation 10:10 and 16:10, dashboard 07:30, 12:30, 17:30, vault 11:40 and 17:40, helper 08:50 and 14:50) against the release at 15:23 and the commit times (the helper's next run after 15:23 was 08:50 on 6 November) |
| The vault keeper did not reply to another person's agent | the vault keeper's Report, 17:45 UTC |
| Designer and sales coach: no Report; on demand; file still open | the task file (five Reports, `status: open`); `agents.json` |
| 20 task files: 15 done, 3 open, 1 picked, 1 closed | the `status:` line of each `people/jose/tasks/2026-*.md`, counted |
| 15 briefs since 3 November | `people/jose/briefs/`: 15 PDFs, the first `2026-11-03T0040Z`; brief 15 is numbered 15 |
| Agents board: one row per agent, last run, doing now, waiting on Jose | kit, "The Agents board (at Jose's word, 7 November 2026, C31)" |
| Two to four runs a day on 5 November | `people/jose/schedules.md`, "Now" column; `agents.json` |
| Faster schedules asked with the rule, costed first | `people/jose/schedules.md`, Jose's C19 words; commit 2191c0b2, point 2 |
| About 113M tokens a day now, 172M to 207M proposed, corrected on 6 November; first figures 99M and 158M to 194M; most are cache reads | `schedules.md` at 1b143bb8 ("about 113M", "about 172M", "about 207M"; 4.7M now without cache reads), corrected in 0848e6ad (C24); the first figures in 2191c0b2 and brief 10, ask 1; cache reads cost about a tenth of fresh input. First wording gave only the 5 November figures: corrected after Jose's reviewer |
| Approved for one day on 7 November | `people/jose/schedules.md`, status line (C30) |
| Not set by 17:20 UTC on 7 November | brief 15 (`2026-11-07T1720Z.json`): "0 wake texts pasted so far"; ask 2 |
| 25 rows, 5 overdue, the oldest since 4 November, at 17:20 UTC | `people/jose/dashboard.md`, Actions, "Updated Sat 7 Nov, 17:20 UTC": rows 0 to 24; overdue rows 6, 7, 9, 13, 22 (row 22 since Wed 4 Nov) |
| Three questions about the door, asked 5 November | Actions row 7; brief 10 (`2026-11-05T1730Z.json`), ask 3 |
| Stored texts older than the kit; ten runs; automation lacks the one-door step; the texts already said to re-read the kit | `people/jose/watcher/latest.md` (run of 17:15 UTC), action A-06 "open for the tenth run"; brief 10, ask 1; the stored wake texts in `schedules.md` and the kit at 450ab040 and 2191c0b2~1 ("re-read people/jose/kit/README.md ... (they may have changed)"); automation's Report of 16:25. First wording missed the re-read step: corrected after Jose's reviewer |

## Left out, and why

- **How Jose felt, or what Jose said in interviews:** the interviews are not in the repository (the conductor turns them into the pulse and task files; brief 15 says none came in for the last two nights). Not quoted.
- **Whether the door saved time:** no measure found.
- **Anything about other people's agents** beyond the one test message the vault keeper left unanswered.
- **RiskMandate:** the piece makes no claim for it.

## Taken after Jose's reviewer (20:13 UTC), besides the rows above

- The developer's Report: four items, three with a time (item 2 was already on Jose's Actions list, as action 16).
- The automation agent's README decision had been answered at 12:25, before the rule (the one-door task file).
- 7 November 2026, 22:30 UTC (Prompt W2): the draft now says "answered at 12:25 UTC" too, in place of "answered that morning" (the reviewer's note of 20:26 UTC).
- Two task files on 4 November, not "a few" (`2026-11-04-dev-ws74.md`, `2026-11-04-vault-lane.md`).
- The idea's `assigned` and this file's `checked` times are the real ones (the first were set ahead of the clock).
- The task-file header in the draft is marked as an example; "each one picked".
