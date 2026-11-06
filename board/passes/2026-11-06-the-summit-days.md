---
pass: 2026-11-06-the-summit-days
goal: "The summit's days in time (guidance section 2): a block of the days (6 to 13 November: before, the summit 9 to 12, after) with today highlighted; a past day shows the site as it was then and what to know then; a future day shows what will happen (the talks), as that day's front page; explore and propose before building; personalisation later."
owner: conductor@PrompTugal.dinis
agents: [sherpa, designer, dev, ontologist, correspondent, historian]
budget: "3 rounds (first round: proposals only) (until accountant@ sets runs and tokens)"
state: open
opened: 2026-11-06T04:35Z
---
# Pass: the-summit-days

The shape: board/the-passes.md. Each step adds a line below: time, agent, step, verdict, commit, spend.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:35 | conductor@ | opened | go | (this file) | |
| 04:05 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0405-wake.md) | (the commit of this review) | part of one wake |
| 04:50 | sherpa@ | review (round 1, proposals: what exists and seven needs a proposal must meet; live v0.1.94; waits on security@'s go) | change: 7 needs (board/team/sherpa/review-2026-11-06-the-summit-days.md, design/shots/sherpa/days/) | (this commit) | part of one wake |
| 06:55 | designer@ | round 1 (proposals): the strip of eight days, a past day (v0.1.37 rebuilt from its tag, clock frozen), a future day (Tue 10, five things, the rest collapsed); spec board/spec-the-summit-days.md; before and after /newsroom/design/summit-days-round-1/ | change: Dinis go or change; dev@ S1 to S5; correspondent@ the five a day; historian@ the day-to-release map | (designer's commit of this run) | 1 run, no images |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| D1 The days 6 to 13 November as one strip, all eight visible on a phone, before/summit/after told apart, today filled | sherpa@ (review) | designer@ | open (conductor) |
| D2 A past day says loudly that it is the past, with today's date and a way back | sherpa@ (review) | designer@, dev@ | open (conductor) |
| D3 A future day says it is planned, as listed on a date, each item sourced | sherpa@ (review) | correspondent@, dev@ | open (conductor) |
| D4 Each day short: three to five things, the full list collapsed (Tuesday is 20 phone screens of agenda today) | sherpa@ (review) | correspondent@, designer@ | open (conductor) |
| D5 The same strip in the same place everywhere: the block on the right on a desktop, under the top bar on a phone | sherpa@ (review) | designer@ | open (conductor) |
| D6 A past day shows the release that was live at its end, not today's site filtered | sherpa@ (review) | historian@, dev@ | open (conductor) |
| D7 Personalisation, later: why it is shown, a way off, nothing that identifies the reader | sherpa@ (review) | observability@ (later) | open (conductor) |
| A past day rebuilt from an old release must honour every correction and removal made since: a removed fact or name never comes back through the time view | security@ (pre-review) | dev@, historian@ | condition of go |
| D7 stands: no personalisation from what a reader read until a pass with security@ designs it; nothing kept that identifies a reader | security@ (pre-review) | observability@, dev@ | condition of go |
