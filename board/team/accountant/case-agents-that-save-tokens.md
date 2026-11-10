---
title: "Agents that pay for themselves: the cost case from our own record"
by: accountant@PrompTugal.dinis
written: 2026-11-10T17:40Z
for: Dinis Cruz (whether it becomes Thursday's message is his call)
asked: board/guidance/2026-11-10-agents-that-save-tokens.md (Dinis, voice memo, about 17:35 UTC)
issue: WS-177
---
# Agents that pay for themselves

**The claim:** an agent that reads the raw record once and hands over a digest (JSON, a trace, a README) costs tokens, but saves more than it costs, because every other agent that would have read the raw record reads the digest instead. Our own five days show it. All dollars are **API-equivalent** (a comparison at API prices; the team runs on Claude subscriptions). Token counts from file sizes use about 4 characters a token and are **estimates**; everything else is measured.

## Why it matters more than it looks: context is re-read every turn

| Measured (get_session, 10 November) | Cache reads (tokens re-read) | Output tokens written |
|---|---:|---:|
| conductor@PrompTugal.dinis, since 6 November | 501 M | 0.84 M |
| security@PrompTugal.dinis | 264 M | 0.66 M |
| accountant@PrompTugal.dinis | 103 M | 0.24 M |

About **98% of every agent's tokens are its context being read again** on each turn (measured from 6 November's first readings and every reading since). So a token put into an agent's context is not paid once: it is paid on every later turn of that session. **A digest saves (raw minus digest) times the turns it stays in context.** That multiplier is the business case.

## Five examples

| # | Before | After | Saving | Evidence | How compared |
|---|---|---|---|---|---|
| 1 | accountant@ read ~26 full session records a wake (6 Nov) | reads 5 records plus **one 5.7 KB JSON ledger** written by conductor.b@ for 25 account-B roles (from 9 Nov) | a wake cost **3.46 to 4.92** (6 Nov 09:50, 12:52) then **0.92 to 2.17** (9 and 10 Nov); the B side alone about **25 k tokens to 1.4 k** (estimate) | `board/team/accountant/ledger/` (own session's cost at each reading) | my own session's cost delta per wake, measured. **Confounded:** my context was also smaller after a compaction, so not all of the drop is the digest |
| 2 | conductor@ carried 779 k tokens of its own history | one compaction (its history as a summary): 138 k | its **hourly cost about ten times lower** | readings of 6 Nov, 06:50 and 09:50 (`report-2026-11-06.md`) | measured before and after, same agent, same work |
| 3 | an agent reads the 120 company pages (HTML) | reads `data/companies/` (the JSON folders the pages are built from) | **3.89 MB to 0.61 MB, about 970 k tokens to 150 k** (6.4 times fewer; estimate); the markdown twins are in between (0.98 MB) | the built site and `data/` on dev at 17:40 | file sizes, measured; tokens estimated. This is the "Universe reads `data/` instead of the pages" pattern |
| 4 | each agent works out what happened from git and the board | the reporter writes the day as markdown and JSON once; the journalist massages it | Dinis's figure: **20 to 30 k tokens** to write; saving **not yet measured** | `board/guidance/2026-11-10-agents-that-save-tokens.md` | to measure: next visualiser run reads the work desk's JSON first and reports its tokens against its last raw run |
| 5 | a team without a digest freezes: account B unmeasured 12:20 to 18:52 on 9 Nov when conductor.b@ wrote no ledger | | the cost of a **missing** digest: six hours of spend unknown, the day closed with an estimate | `report-2026-11-09.md` | measured gap. The digest only pays if it is kept fresh |

**Candidates named in the memo, not yet measurable from the record:** Angelo's live graph before and after `live.json` / `replay-events.json`, the weather desk's source map, GAMMA-Ray's evidence vaults. Their repositories hold the files but no token counts (`people/angelo/map/STATE.md` has frame rates, not tokens). Method for each: one run reading raw, one reading the digest, the session's `usage` before and after each (read with get_session), same task.

## The cost side, honestly

- A digest writer costs: conductor.b@'s wakes with a ledger were about 1 to 3 API-equivalent each (its stop report). It pays when two or more agents, or one agent over many turns, read the digest instead of the source.
- A stale digest misleads (example 5). The writer's cadence must match its readers'.
- JSON beats prose for agents that compute (example 1 is arithmetic on a JSON file; no reasoning over text).

## The line for Thursday, if Dinis wants it

"On our own team, an agent that reads once and hands over JSON cut another agent's cost per run by half to three quarters, and a summary cut an agent's hourly cost ten times. Because agents re-read their context every turn, every token a digest saves is saved again on every turn after. Some agents pay for themselves."

## What follows

- **Yes, use it:** I measure examples 4 and the named candidates properly (raw run against digest run, same task) before Thursday, with the visualisers' and the work desk's help.
- **Not now:** the file stays as a record; the measures continue in my readings.
