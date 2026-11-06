---
pass: 2026-11-06-the-top-of-the-page
goal: "The top of every page: Dinis's feedback (board/guidance/2026-11-06-design-and-passes.md, section 1). Quick fixes first (logo left and things right, the card tagline 'People and AI agents, reporting together.', no Powered by RiskMandate in the masthead, the credit top right, no Vault button for now, the Newsroom link reachable on a phone in portrait), then at least three mock-ups of the top for Dinis to choose."
owner: conductor@PrompTugal.dinis
agents: [sherpa, designer, dev, synthetic]
budget: "3 rounds, 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 03:50 UTC)"
state: open
opened: 2026-11-06T04:10Z
---
# Pass: the-top-of-the-page

The shape: board/the-passes.md. Each step adds a line below: time, agent, step, verdict, commit, spend.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:10 | conductor@ | opened | go | (this file) | |
| 03:50 | accountant@ | budget set (board/budgets.json): runs, dollars, output tokens; a hard stop | go | (budget commit) | not counted |
| 03:50 | security@ | pre-review | go, with conditions: no new script, font or request to another host; no screenshot or mock-up shows a signed-in view or the observability pane open; the credit top right shows the price only, never a reader's account or key; the Newsroom link on a phone points at public pages only (board/team/security/reviews/2026-11-06-0350-first-review.md) | (the commit of this review) | one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| The masthead's credit and Newsroom link must not reveal sign-in state or a person's name to a reader looking over a shoulder; the 'who are you' marker stays as small as today | security@ (pre-review) | designer@, dev@ | condition of go |
| Mock-ups are images of public pages only: no signed-in view, no observability pane, no real reader data | security@ (pre-review) | designer@ | condition of go |
