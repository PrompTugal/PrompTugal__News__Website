---
title: "The budgets after the first day: what to measure, and the one real limit"
summary: "What 6 November's budgets measured (all in API-equivalent dollars, not money spent), where they were wrong, and five adjustments for Dinis to take, change or refuse: releases as a count, higher lines for four agents and the team, and a top-up of the OpenRouter credit, which is the only real money."
decision: open
asked_by: accountant@PrompTugal.dinis
asked_of: Dinis Cruz
since: 2026-11-06
blocks: "Choices 1 to 4 are decided (a PT decision, 15:55 UTC). Choice 5 is For Dinis: the OpenRouter credit, exhausted at -0.20 USD at 12:50 UTC, blocks dev.verify@'s fact re-checks and designer@'s AI images until it is topped up. And the subscription's seven-day limit reads allowed_warning since 12:52."
answer: null
answered_at: null
---
## In short {#short}

The budgets in `board/budgets.json` are a measure, confirmed by Dinis at about 10:15 UTC, and never a stop (about 10:10). Every dollar on this page is **API-equivalent**: the team runs on a Claude subscription, so a dollar compares runs and agents at API prices and is not money anyone pays. Two things are real: the subscription's usage limits (every session reads `allowed`, no overage, at 12:52 UTC) and the **OpenRouter credit**, which is exhausted.

Five choices, each independent. The accountant's recommendation is yes to all five.

## Decided, 15:55 UTC {#decided}

Under "Decisions are pages" (CLAUDE.md, 6 November), choices 1 to 4 are a PT decision, the accountant's as the owner; choice 5 is money, so it is **For Dinis**.

| # | Decision | Why |
|---|---|---|
| 1 | **Applied:** releases are a count to watch, not a budget; they no longer count towards `used` | as recommended above |
| 2 to 4 | **Not now:** the lines stay as they are, OVER is recorded, nothing stops | at 15:52 UTC every session's seven-day subscription limit reads **allowed_warning** (it read allowed at 12:52). That is the one real limit on the team's work, and higher lines would point the wrong way |
| 5 | **For Dinis:** the OpenRouter top-up | real money |

**What the real limit asks instead** (recorded in `board/budgets.json`, `proposals.new`): every Opus agent compacts its context at the start of each wake (one compaction cut conductor@'s hourly cost about ten times); an agent with nothing to do pushes nothing; the dotted workers stay on Sonnet. The accountant reads only the Opus sessions at each wake, and every session once a day: reading all 26 into one long context cost it about 9 API-equivalent this wake.

The day so far, at 15:52 UTC: **582.84 API-equivalent**, about 53 an hour since 12:52 (`board/team/accountant/ledger/2026-11-06T1552Z.json`).

## What the first day measured {#measured}

Read from every PrompTugal session (claude-code-remote `get_session`) and from git, 6 November UTC. The ledger: `board/team/accountant/ledger/`.

| Reading (UTC) | API-equivalent today | Rate since the reading before | Note |
|---|---:|---:|---|
| 03:45 | 122.18 | | nine sessions |
| 06:50 | 277.55 | about 50 an hour | 26 sessions, ten of them Sonnet workers (11.02 together) |
| 09:50 | 339.72 | about 21 an hour | conductor@ compacted: 779 k to 138 k tokens of context, its cost a tenth |
| 12:52 | 423.84 | about 28 an hour | |

What it showed:

1. **Context is the cost.** About 98% of the tokens processed are a session re-reading its own history. One compaction cut an agent's hourly cost about ten times.
2. **The Sonnet workers are the cheap work:** 0.54 to 4.63 a session for a day's work, against 10 to 52 for the Opus sessions. Their quality is not measured here.
3. **The release caps bind first:** nine agents went over on releases while under or near their dollars. A release costs a CI run, not tokens, and "when in doubt, push to production" asks for more of them.
4. **A budget that stops does harm:** ontologist@ stopped for the day on its budget before the 10:10 word, and the conductor had to nudge it back.
5. **More work is opened than a day holds:** 27 passes, 1,000 and more of API-equivalent budget open, against a team line of 500. The conductor's order (Algarve Evolution, the Portugal section, the companies page, the front page, the top of the page, the people page, the verification pipeline) says what goes first.

## The choices {#choices}

| # | Now | Proposed | What it does well | What it does badly |
|---|---|---|---|---|
| 1 | each agent has a releases-per-day budget | **releases a count to watch, no budget** | matches "push to production"; nine false overs go away | a runaway release loop shows only as a number, not a flag |
| 2 | conductor@ 50 a day | **70** | it carries the board, the passes and every relay; 51.77 by 12:52 | a higher line hides waste if its context grows again |
| 3 | security@ 30, journalist@ 35 | **45 and 45** | security@ pre-reviews 27 passes; journalist@ is the publication's output | as 2 |
| 4 | accountant@ 10 | **15** | reading 26 sessions costs about 5 a wake; 11.99 by 12:52 | the accountant spends more to measure; the alternative is fewer readings a wake |
| 5 | OpenRouter credit -0.20 USD (exhausted) | **a top-up, and keep the lines** (designer@ 10, designer.experiments@ 2, dev.verify@ 1 a day) | unblocks dev.verify@ (about 0.5 USD for 7 re-checks) and designer@'s images | real money: the only cost on this page anyone pays |

The team's line would follow 2 to 4: from 500 to **650** API-equivalent a day (the agents' lines add up to about 615).

## What follows each answer {#follows}

- **Yes:** the accountant writes the new numbers into `board/budgets.json` with the time and your word, and measures the next day against them; for 5, the agents that wait on OpenRouter carry on.
- **No:** the numbers stay; the over rows keep saying OVER, nothing stops.
- **A different number:** written as you say it.

## Who reviewed {#reviewed}

The numbers are the accountant's own readings; the pass order is the conductor's; the OpenRouter balance is as dev.verify@ and designer@ report it (the accountant does not use the key).
