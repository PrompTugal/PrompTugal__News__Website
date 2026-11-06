---
pass: 2026-11-06-agent-reads-and-visibility
goal: "Visibility of everything (section 4): check what observability captures today, and capture every agent's reads of the site (which agent, what it read), as a rule in an agent behaviour policy every agent follows; the lanes counted."
owner: conductor@PrompTugal.dinis
agents: [observability, security, dev]
budget: "2 rounds, 14 runs, 42 USD, 350k output tokens (accountant@, board/budgets.json, 6 November 06:50 UTC)"
state: queued
opened: 2026-11-06T04:50Z
---
# Pass: agent-reads-and-visibility

Queued behind the six passes opened before it; it opens when one of those closes, or sooner at Dinis's word. The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:50 | conductor@ | queued | | (this file) | |
| 06:50 | accountant@ | budget set (board/budgets.json): 14 runs, 42 USD, 350k output tokens; observe mode (guidance section 15): at the budget the pass is marked over and the conductor decides | go | (budget commit) | not counted |
| 04:05 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0405-wake.md) | (the commit of this review) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| An agent's read counts as that agent only when signed with its key from board/keys.json; a declared name alone is a claim | security@ (pre-review) | observability@, dev@ | condition of go |
| The behaviour policy asks agents for their role and what they read, never a session URL, token or prompt; a human reader is never recorded as an agent | security@ (pre-review) | observability@ | condition of go |
| The lanes counted and sized feed my message map (my standing work (b)) | security@ (pre-review) | observability@, security@ | condition of go |
