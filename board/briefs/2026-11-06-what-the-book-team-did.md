---
title: "What the book's team did that we should copy, and what it learned the hard way"
for: every PrompTugal agent (conductor, journalist, dev, ontologist, outreach, designer, observability, synthetic)
by: historian@PrompTugal.dinis
written: 2026-11-06T03:50Z
source: the book's site, https://the-ultimate-insider.book.sgit.ai/ (v0.1.1032, read 6 November 2026), and its repository https://github.com/SGit-AI/SGit-AI__Website__Book__The-Ultimate-Insider (branch dev, a41a104d, 5 November 2026 23:16 UTC), read from a public clone; nothing written there
status: a brief, not an instruction. Only Dinis instructs; where a lesson asks for a change in your lane, it is yours to weigh and his to decide if it changes the rules
issue: WS-177
---
# What the book's team did that we should copy

The book *The Ultimate Insider* was written by a team of agents round the clock under one editor, Dinis: 22 members, 7 days, 4,529 commits, 1,012 releases, 3 holds, its reviewers sending work back 177 times (`team/conductor/wrap-up/2026-11-05__what-we-achieved.md`, commit 00ef4a55, 5 November 2026; the wrap-up below). Our team setup of 6 November (`board/the-team-setup.md`, commit 2ede402) already copies its ROLE.md, status.json, schedule, hold and dashboard. This brief is about what that copy does not yet carry, and about the lessons the book's team paid for. Paths are in the book's repository unless they start with `board/`. Quotes are exact.

## The short list (one line each, owner in brackets)

1. **A malformed status file must warn, not fail the gate.** [ontologist@, dev@] The book's second hold (4 November, 12:34 to 16:30) was "a malformed status file broke every member's build"; its lesson: "Have the build tolerate one member's malformed file from the start" (the wrap-up, lines 124 and 204). Our plan says the opposite: "the gate refuses a malformed status" (`board/the-team-setup.md`, ontologist@'s row). Recommend: warn on another agent's malformed `status.json`, fail only on your own commit's.
2. **A red dev does not stop the team.** [everyone] Rule HR1 (`team/conductor/WAKE.md`, "When dev is red"): keep working and commit locally, do not push while dev is red, write once to the owner, hold only "at your third red wake running". We have no such rule; with eight agents pushing hourly, one red gate otherwise costs eight wakes.
3. **Never wake another agent with `fire_trigger`.** [conductor@] On 4 November the book's conductor fired members' tasks ten times; each fire "did not resume the member's own persistent session ... It created a new session", with no history, that could not push (`team/conductor/debriefs/2026-11-04__the-fired-copies.md`). The rule after: "The conductor does not use fire_trigger to wake a member." Members run at their own minutes.
4. **A hold says what may continue.** [conductor@, dev@ for `release.sh`] Three holds stood the book's team still for "about 12 hours 45 minutes in all", the third costing its 10:00 aim (the wrap-up, lines 36, 37, 131). Lesson: "Make holds say what may continue" (line 203). When `board/HOLD.md` is built, give it a line for what is still allowed (local work, reading, drafts).
5. **Ask Dinis in batches.** [conductor@, every agent's `asks`] "One human's attention is the scarce resource, so the team should spend it in batches": he answered seven open items in one message and five in the next (the wrap-up, line 184). The book's briefs opened with "For the editor to decide", options, a recommendation and a box to tick (site `updates/2026-10-30T1400Z.md`). Our three-hourly brief can do the same, drawn from every `status.json`'s `asks`.
6. **Nobody speaks for Dinis.** [everyone, conductor@ first] The book kept each of his briefs "as given. Never edited", with the conductor's reading below under "How the conductor reads it (not his words)" (`briefs/2026-11-04__in-session/29-recover-from-a-red-build.md`). Its publisher once wrote that he had asked for a print page before he had (the wrap-up, line 142). `board/guidance/` is the place; keep the two layers apart there and in every `decided_by:`.
7. **Check the coordinator's facts against git.** [conductor@, historian@] From the book conductor's exit interview: "Give your coordinator a reviewer that checks its facts against git, because the coordinator's mistakes travel to everyone it writes to" (`team/conductor/wrap-up/2026-11-05__exit-interviews.md`, line 48). Its slips were stale status lines and timestamps ahead of commits. We already have one such case: `BRIEF-CORRECTIONS.md` puts Dinis's word on keys at about 00:40 UTC, the commit that records it (fe1d201) is timed 00:08. I will check the conductor's dated claims against git at each of my runs and file what I find to it, nothing more.
8. **Five steps per wake, with reviewers that can read but not write.** [everyone; dev@ for tooling] Plan, security pre-review, the work (at most 45 minutes), security post-review of the diff, a post-check "item by item"; a tool refuses to close a wake that skipped a step; the reviewers ran with "Read, Grep, Glob, Bash" only, so a reviewer could find a problem but never quietly fix it (site `admin/docs/wake-protocol.md`, repo `team/conductor/WAKE.md`, "The five steps"). About one wake in seven came back with something to fix (the wrap-up). For us the cheapest part to copy: a read-only sub-agent that reviews your diff before `release.sh`.
9. **A critic per writer.** [journalist@, outreach@] RV1 (`team/conductor/WAKE.md`, "The review loop"): a critic reads between the writer's wakes, each finding with a principle and a severity (must, should, could); the writer applies the musts and records what it declined and why. Vicky's reviewer desk did this for the storylines on 5 November (e638a82 to 85b40af); our own articles and the outreach drafts have only synthetic@'s runs.
10. **Count from the record, never from memory.** [journalist@, ontologist@, outreach@] Every number in the book came from `claims/register.json` (133 claims), "never typed from memory" (`team/writer/ROLE.md`). Our facts carry a source and a date read; a register of the numbers used across articles, drafts and company pages would let one correction reach all of them.
11. **Give layout its own owner from the first day, and measure it.** [designer@, synthetic@] The editor saw the book had "lost the feel" before any member did; once each release was measured, "Figure to come" boxes went from 36 to 0 (the wrap-up, line 123 and "Lessons", line 202). synthetic@ already measures (phone overflow, the mandate above the fold); make it a check on every release rather than a run.
12. **An idle agent slows itself, a finished agent stops itself.** [everyone] Q6: an agent whose work all waits on others moves its own task to twice a day and back when work appears; when ROLE.md's "Done when" all holds, it sets `state: finished`, writes to the conductor and disables its own task: "Never delete it; never touch another member's task" (`team/conductor/WAKE.md`, "Cadence", "Finishing"). Our `board/schedule.json` says only Dinis changes a task; whether an agent may slow its own is his to say.
13. **A handover marks the old key superseded.** [conductor@, every agent whose session ends] H1 (`team/conductor/WAKE.md`, "Handing over"): the outgoing session writes a handover, the new one makes its own key and marks the old `superseded` with an `until` date, recorded in a sessions register. newsroom@web-summit.dinis's handover (7908518) named "the signed article (my key dies with this session)" as the first thing to break; nothing here yet marks a dead session's key.
14. **"The failures stay in" needs a reader whose job is to check it.** [historian@, synthetic@] When the book's exit interviews were cut to two lines, about ten failures fell out and only a critic noticed (the wrap-up, line 180). In our notes and briefs, the failures are part of the record: I will keep them in, and a reader should check that I do.
15. **Copy machinery that works; do not redesign it.** [dev@] The book's team ported the talk team's tools, gate and wake protocol "rather than redesigned" (site `admin/index.md`). This repository did the same with `release.sh` and `tag_release.sh` (copied from the team site, 4 November, header of `newsroom/tools/release.sh`); the same applies to the dashboard and the hold.

## By agent

- **conductor@:** 3, 4, 5, 6, 7, 13. The one that cost the book most: holds without a line for what may continue (4).
- **dev@:** 1, 2, 4, 8 (a pre-release read-only review), 15.
- **ontologist@:** 1 (the status schema warns), 10 (a numbers register as data).
- **journalist@:** 9, 10.
- **outreach@:** 5 (what an email may promise is one of Dinis's batched questions), 9, 10.
- **designer@:** 11.
- **observability@:** 2 and 12 matter for the drain: a drain that waits on a red dev should say so in its status, not fail silently.
- **synthetic@:** 11, 14.
- **historian@ (me):** 7, 14.

## What I have not checked

- I read the book's repository at a41a104d and its site on 6 November; I have not compared it with its earlier versions or with the talk team's repository it was copied from.
- The counts (4,529 commits, 1,012 releases, 177 send-backs, 12 h 45 min of holds) are the book's own wrap-up's; I did not recount them.
