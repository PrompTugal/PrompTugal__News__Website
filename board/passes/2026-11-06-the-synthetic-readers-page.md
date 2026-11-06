---
pass: 2026-11-06-the-synthetic-readers-page
goal: "/newsroom/synthetic.html readable: an infographic view first, a graph of its findings (themes, personas, pages, owners), and every finding with an owner and a decision (fix, later, no and why)."
owner: conductor@PrompTugal.dinis
agents: [sherpa, ontologist, historian, synthetic, designer, dev]
budget: "3 rounds, 20 runs, 60 USD, 500k output tokens (accountant@, board/budgets.json, 6 November 03:50 UTC)"
state: open
opened: 2026-11-06T04:10Z
---
# Pass: the-synthetic-readers-page

The shape: board/the-passes.md. Each step adds a line below: time, agent, step, verdict, commit, spend.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:10 | conductor@ | opened | go | (this file) | |
| 03:50 | accountant@ | budget set (board/budgets.json): runs, dollars, output tokens; a hard stop | go | (budget commit) | not counted |
| 03:50 | security@ | pre-review | go, with conditions: no new script, font or request to another host; no screenshot or mock-up shows a signed-in view or the observability pane open; every reader stays marked SYNTHETIC on the page, in the infographic and in the graph; the themes publish no team notes (priority, owner, the asks to Dinis about the commercial relation: S4 of board/team/security/reviews/2026-11-06-0350-first-review.md) | (the commit of this review) | one wake |
| 04:05 | sherpa@ | review (brief: the reader, phone and desktop, live v0.1.93) | change: 8 findings, S1 and S2 first (board/team/sherpa/review-2026-11-06-the-synthetic-readers-page.md, design/shots/sherpa/synthetic/) | (this commit) | one wake |
| 05:10 | synthetic@ | round 1 on its page: S1 (the scoreboard first: fixes by state and owner, fix first, questions for Dinis), S2 (every fix with its decision, by owner), S3 (latest run first, earlier runs one line each), S4 (the method at the end), S8 (title 'Synthetic readers'), T9 for its own tables (lists, not tables). Measured: phone 390 px wide (was 438), 10,985 px tall (was 47,770), 2,270 words (was ~10,000). Security's conditions kept: SYNTHETIC on every reader; F19, F25, F26 as questions only; no screenshot linked. S5 (cards), S6 (graph), S7 (dev) not mine | change made, for sherpa@ to re-read | (this commit) | one wake, no sub-agents |
| 06:40 | sherpa@ | re-read after synthetic@'s round 1 (live v0.1.152) | done for S1 to S4, S7, S8's title: 64 to 18 phone screens, ~10,000 to ~2,500 words; S5, S6 open; two small new rows (board/team/sherpa/review-2026-11-06-0630-wake.md, section 2) | (this commit) | part of one wake |
| 09:55 | designer@ | round 1 (designer): S9 the scoreboard as five tiles, a bar and owners as bars; S5 a card per reader (SYNTHETIC, no face); spec board/spec-the-synthetic-readers-page.md; before and after /newsroom/design/synthetic-round-1/ | change: dev@ builds Y1 to Y4; synthetic@ keeps the words | (designer's commit of this run) | 1 run, no images |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| Every synthetic reader, quote and theme marked SYNTHETIC wherever it appears, never presented as a real person's view | security@ (pre-review) | synthetic@, designer@ | condition of go |
| The graph and the themes publish findings about the site, not the team's notes or Dinis's open decisions (F19, F25, F26 as questions only, no answers guessed) | security@ (pre-review) | historian@, ontologist@ | condition of go |
| Screenshots linked from the page come from the synthetic vault, whose read key is public: none may show a signed-in view, an open observability pane or a draft's addresses (S7) | security@ (pre-review) | synthetic@ | condition of go |
| S1 The fixes ranked with owners are section 14 of 15; put a scoreboard first (findings by state and owner, top three, what waits for Dinis): the infographic view | sherpa@ (review) | synthetic@ (page), designer@ (view) | open (conductor) |
| S2 No decision (fix in round n, later, no and why) is visible per finding | sherpa@ (review) | synthetic@, with the conductor | open (conductor) |
| S3 Ordered by when, not by what matters; latest summary first, earlier runs collapsed | sherpa@ (review) | synthetic@ | open (conductor) |
| S4 The method (vault, megabytes, git history) takes the second screen: keep the SYNTHETIC line on top, move the method to the end, collapsed | sherpa@ (review) | synthetic@ | open (conductor) |
| S5 Each persona is a wall of prose: a card each (who, tried, stopped, one line, findings) | sherpa@ (review) | designer@ | open (conductor) |
| S6 No graph of themes, personas, pages and owners (64 phone screens, 10,000 words, no image) | sherpa@ (review) | ontologist@, historian@, dev@ | open (conductor) |
| S7 On a phone the page lays out 438 px wide on 390 (a table at 594 px): tables scroll inside or become cards | sherpa@ (review) | dev@ | open (conductor) |
| S8 Linked from /newsroom/ only, 7,628 px down; the 18-word title makes a poor link: 'Synthetic readers' and a subtitle | sherpa@ (review) | dev@, the search pass; synthetic@ (title) | open (conductor) |
| S9 The scoreboard is four numbers in sentences: a bar or four tiles (the infographic view) | sherpa@ (re-read) | designer@ | open (conductor) |
| S10 The SYNTHETIC paragraph takes most of the first phone screen above the scoreboard: one line on top, the rest in 'How this was made' (security@'s SYNTHETIC condition kept) | sherpa@ (re-read) | synthetic@ | open (conductor) |
