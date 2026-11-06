---
story: T4
draft: desks/journalist-vicky/drafts/t4-how-agents-avoid-collisions.md
reviewed: 2026-11-06
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
verdict: Fix first
---

# T4 review: how the agents avoid collisions

**Verdict: Fix first.** Two habits are stated more strongly than the rules say, and one sentence has no source. 619 words: no cut needed. Reviewed as of commit `a4f05b23`; held for Vicky's approval in any case.

Checked 6 November 2026, about 21:45 UTC, against /how-we-publish/ (`desks/checker-vicky/publish-workflow.md`), the newsroom's CLAUDE.md, `board/schedule.json` (as at 21:15 UTC), `newsroom/tools/release.sh`, STYLE.md, the team site's CLAUDE.md, `people/vicky/decisions.md` and `people/vicky/schedule.json`.

## Fix first

1. **"The agents also follow written behaviour policies; Angelo is writing a separate article on those."** Cut the sentence: neither half has a source in the list, and I found no record of such an article.
2. **"Two editors' teams check each other's articles"** (In short) and "a second team that checks the first" (summary). The checking runs one way: Vicky's reviewer checks Vicky's drafts before they go out, and Vicky's checker checks Dinis's journalist's articles after they are live; no agent of Dinis's checks Vicky's (/how-we-publish/). The story's own paragraph says this correctly. Suggest for In short: "On Vicky's desks a reviewer checks every draft first; Dinis's articles are checked by Vicky's checker after they go live."
3. **"Every change ... goes to one branch"** (In short) and **"Every agent pushes to one branch, `dev`"**. Not every agent: in the newsroom, the dotted workers push to their own branch, `work/<role>.<speciality>`, never to `dev`, and dev@ or designer@ brings their work over (CLAUDE.md, "Dotted names"). Suggest: "Everything that goes live goes through one branch, `dev`, and the same release script."
4. **"This writer met it on 6 November, when a draft's file name broke a check"**: true (the capital letter in T1's file name, fixed in about a minute, before any release), but not in the source list. Add journalist-ai's report (`people/vicky/reports/journalist-ai.md` on the team site) or cut the sentence.
5. **Pronouns.** "she" and "her" for Vicky: no source gives Vicky's pronouns (the team's `data/team.json` uses "they"), so STYLE.md says use the name. "his" for Dinis is fine.

## Small, the journalist's call

- "moved on 6 November from all waking at 08:00 to six minutes apart": they woke at 08:00 and 16:00; "from all waking at 08:00 and 16:00" is exact. The journalist itself stays at 08:00.
- The newsroom's schedule has changed since the draft was written: at 21:15 UTC dev woke at :08, observability at :18 and the ontologist at :21, as the draft says; since 21:23 most of Dinis's agents' tasks are paused for a move. The caveat that this describes 6 November covers it; re-check the three examples before publishing.

## The closing line (all of T1 to T5): for Vicky

See `t2-who-does-the-work.md`, "The closing line".

## What checks out

The quote "checking that no one has already written or published the same story" (/how-we-publish/); "A red gate is no release" and never pushing to `main` (the team site's CLAUDE.md); release.sh: fetch and rebase, stop on a hold, derive, the gate (a red gate stops the push), push, and on "someone pushed first" rebase and retry, up to five attempts; the hold (security sets it, only Dinis lifts it; Vicky's own, written only through her conductor); one role, one session; decisions as pages; Vicky's decide-or-ask list; not every agent on a schedule; "seven habits". Every link opens.

## Status

Set to `status: fix`. No style edit yet.

## Check again, 6 November 2026, about 22:10 UTC

journalist-ai's commit `bfecef10` changes only the closing line, which now names "the RiskMandate booth, A1-30 in Pavilion 1", as the source says. Still open: the Fix first points above, the booth details' non-public origin (Vicky's call), and moving the stand's source line from "Who made this" into "Where this comes from". Verdict unchanged: Fix first.

## Check again, 6 November 2026, about 22:25 UTC

**Verdict: Ready. Held for Vicky's approval.** journalist-ai's commit `d2586e1c` makes every Fix first change above, each checked at its source. The booth line stands with Dinis's yes (21:35 UTC, Vicky's word).

Style edit (mine, committed on its own): the stand's source line moved from "Who made this" into "Where this comes from", unchanged; and "for every agent Vicky runs" became "for all of Vicky's agents". Words: 660, unchanged; no cut needed.

Status: `ready`. Vicky sets `approved`.

Checked: The checking now runs one way, as on /how-we-publish/; the helper agents' own branches are named; the 08:00 and 16:00 times; the :52 example is in `board/schedule.json` as it stood at 21:15 UTC (a check every hour at :52); the file-name line now has its source. The sentence on behaviour policies now reads "which are a story of their own", sourced to CLAUDE.md, which names them: whether it stays is Vicky's call.

## Images, 6 November 2026, about 22:25 UTC

At Vicky's word, images only (journalist-ai's commits `732a07c3` and `7f1d77fd`), rendered at phone width (390 px screen, 358 px in the article column, as on the live T1 page). The chart of wake minutes: every row checked against its source: Vicky's journalists at :00, :06, :12, :18 and :24 (08:00 and 16:00 onward), the curator at :45 four times a day, the checker at :48 (09:48, 17:48) and the reviewer at :48 (08:48, 16:48), from the team site's `people/vicky/schedule.json`; Dinis's security at :03 every two hours, dev at :08, observability at :18 and the conductor at :52, every hour, from the newsroom's `board/schedule.json` as it stood at 21:15 UTC. Caption, alt text and the story's ":08, :18, :52" agree. Readable on a phone; the smallest labels (the times under each name, 10.5 in a 420-wide drawing) come out at about 9 px: legible, small; 12 would be easier, the journalist's call. **Images: pass.**

## Images again, 6 November 2026, about 22:40 UTC

The chart redrawn (journalist-ai's commit `450c8eb8`): ten of Dinis's newsroom agents, each at its own minute every hour: dev.search :04, dev :08, researcher :13, observability :18, ontologist :21, journalist :26, dev.data :31, outreach :38, synthetic :44, conductor :52. Every minute matches `board/schedule.json` at the linked commit `092caead`, and the window is exact: all ten were set at 05:36 UTC (`bbf48ba6`) and four of them moved to every two hours at 21:20 (`a169cc80`). Readable at phone width in light and dark (the smallest text, the axis and the footnote, about 9 px). Alt text and the source line match; the story no longer names minutes, so nothing in the text can disagree.

One small point, the journalist's call: the caption says "Dinis's newsroom agents each wake every hour at their own minute"; not all of them did (security every two hours; two agents shared :23). The chart's own "Ten of Dinis's newsroom agents" is exact; "Ten of Dinis's newsroom agents each wake ..." would match it. **Images: pass.**
