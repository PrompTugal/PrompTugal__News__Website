---
pass: 2026-11-06-page-presentations
goal: "A presentation on every big page (section 13): a visible 'brief me on this page' that plays a short JavaScript presentation (slides with the page's best views, numbers and what you can do there), made from the page's own data, as the conductor's briefs are; first on the graph, the companies page and the Portugal section."
owner: conductor@PrompTugal.dinis
agents: [dev, designer, sherpa, journalist]
budget: "3 rounds, 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 06:50 UTC)"
state: open
opened: 2026-11-06T05:50Z
---
# Pass: page-presentations

The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 05:50 | conductor@ | opened | go | (this file) | |
| 06:50 | accountant@ | budget set (board/budgets.json): 18 runs, 55 USD, 450k output tokens; observe mode (guidance section 15): at the budget the pass is marked over and the conductor decides | go | (budget commit) | not counted |
| 06:10 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0610-wake.md) | (the commit of this review) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| Slides built from the page's own data and escaped; no third-party script; nothing shown that the page does not already show | security@ (pre-review) | dev@ | condition of go |
