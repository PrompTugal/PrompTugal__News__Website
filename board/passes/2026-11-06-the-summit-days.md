---
pass: 2026-11-06-the-summit-days
goal: "The summit's days in time (guidance section 2): a block of the days (6 to 13 November: before, the summit 9 to 12, after) with today highlighted; a past day shows the site as it was then and what to know then; a future day shows what will happen (the talks), as that day's front page; explore and propose before building; personalisation later."
owner: conductor@PrompTugal.dinis
agents: [sherpa, designer, dev, ontologist, correspondent, historian]
budget: "3 rounds (first round: proposals only), 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 06:50 UTC)"
state: open
opened: 2026-11-06T04:35Z
---
# Pass: the-summit-days

The shape: board/the-passes.md. Each step adds a line below: time, agent, step, verdict, commit, spend.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:35 | conductor@ | opened | go | (this file) | |
| 06:50 | accountant@ | budget set (board/budgets.json): 18 runs, 55 USD, 450k output tokens; observe mode (guidance section 15): at the budget the pass is marked over and the conductor decides | go | (budget commit) | not counted |
| 04:05 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0405-wake.md) | (the commit of this review) | part of one wake |
| 04:50 | sherpa@ | review (round 1, proposals: what exists and seven needs a proposal must meet; live v0.1.94; waits on security@'s go) | change: 7 needs (board/team/sherpa/review-2026-11-06-the-summit-days.md, design/shots/sherpa/days/) | (this commit) | part of one wake |
| 06:55 | designer@ | round 1 (proposals): the strip of eight days, a past day (v0.1.37 rebuilt from its tag, clock frozen), a future day (Tue 10, five things, the rest collapsed); spec board/spec-the-summit-days.md; before and after /newsroom/design/summit-days-round-1/ | change: Dinis go or change; dev@ S1 to S5; correspondent@ the five a day; historian@ the day-to-release map | (designer's commit of this run) | 1 run, no images |
| 09:50 | sherpa@ | review of designer@'s round 1 proposals (rendered from design/mockups/days/make.mjs) | go for the reader: D1 to D6 met; four small rows, D8 and D9 first (board/team/sherpa/review-2026-11-06-0930-wake.md, section 1; design/shots/sherpa/w0930/) | (this commit) | part of one wake |
| 12:55 | designer@ | the decision page for Dinis: /newsroom/design/decisions/the-summit-days/ (the strip, a past day, a future day; three views of one day from designer.experiments@; recommendation: go, C as a day's default) | waiting: Dinis's answer | (designer's commit of this run) | part of 1 run |
| 14:05 | designer@ | Dinis's answer recorded (13:20): the recommendation, go on all three views, five things as a day's default; the decision page marked decided | decided: dev@ builds S1 to S5 | (designer's commit of this run) | part of 1 run |

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
| D8 (rank 1) On a phone the past day you are on is not on the strip (it starts at Fri 6): 'Earlier days' as on the desktop, or the strip scrolls to the day, ringed | sherpa@ (round 1) | designer@ | open (conductor) |
| D9 (rank 2) The chips' second line ('Opening', 'Day 1') is about 8 px on a phone: 11 px at least, or the tint alone | sherpa@ (round 1) | designer@ | open (conductor) |
| D10 (rank 3) 'What changed since: 116 releases' is the team's word: 'the site has changed 116 times since' | sherpa@ (round 1) | designer@ | open (conductor) |
| D11 (rank 4) The proposals are only in a vault: the before-and-after page needs its images inline | sherpa@ (round 1) | designer@, dev@ | open (conductor) |
| The attendee on Sunday night planning Monday (00:35 on 8 November, v0.1.677, phone): keep Monday's day page (five things with time, place, Add to my day; a dated 'planned' note) and Opening Night's first sentence. **A1 (rank 1): the Agenda tab opens 'Events', 51.5 phone screens with an introduction first and no days strip; from now to Thursday it should open today's (or tomorrow's) day page.** A2 the reading meter and its pounds read as a bill; A3 the default home page does not say 'Tomorrow: Opening Night'. `board/team/sherpa/review-2026-11-08-0030-planning-monday.md` | sherpa@ (review) | dev.pages@, dev@, designer@ | open (before Monday) |
| Re-measured (03:35, 9 November, v0.1.774): A1 in part, Events opens with the days strip and Today / Tomorrow links (still 51 phone screens); the live bar's item is cut on a phone (L4). `board/team/sherpa/review-2026-11-09-0330-the-list-pages.md` | sherpa@ (re-measure) | dev.pages@, dev@ | open |
| D1 (06:35, 9 November, v0.1.796): /days/ opens on Friday 6, a past day, with Thu 12 and Fri 13 off the strip on a phone; during the summit open on today, past days after. `board/team/sherpa/review-2026-11-09-0330-the-list-pages.md` | sherpa@ (review) | dev.pages@ | open |
| Re-measured (09:35, 9 November, v0.1.814): Companies is the approved page (cards, switch, search with a field filter; 11.1 phone screens from 31.9); the day pages live with the three views, five things by default (D2 minor: 'By stage' wraps under the tab bar). D1 and L4 open. `board/team/sherpa/review-2026-11-09-0330-the-list-pages.md` | sherpa@ (re-measure) | dev.pages@ | D1, L4 open |
