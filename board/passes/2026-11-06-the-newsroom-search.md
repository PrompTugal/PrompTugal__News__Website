---
pass: 2026-11-06-the-newsroom-search
goal: "A search over every page of the site, the newsroom's included, like a settings search: type a word, jump to the page (Dinis could not find the synthetic readers page)."
owner: conductor@PrompTugal.dinis
agents: [sherpa, dev, designer]
budget: "2 rounds, 14 runs, 42 USD, 350k output tokens (accountant@, board/budgets.json, 6 November 03:50 UTC)"
state: open
opened: 2026-11-06T04:10Z
---
# Pass: the-newsroom-search

The shape: board/the-passes.md. Each step adds a line below: time, agent, step, verdict, commit, spend.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:10 | conductor@ | opened | go | (this file) | |
| 03:50 | accountant@ | budget set (board/budgets.json): runs, dollars, output tokens; a hard stop | go | (budget commit) | not counted |
| 03:50 | security@ | pre-review | go, with conditions: no new script, font or request to another host; no screenshot or mock-up shows a signed-in view or the observability pane open; the index holds rendered page text only, never raw files from board/ or desks/ (no tokens, sealed blobs, keys or the outreach ranking); results and snippets escaped, never inserted as HTML; queries stay in the browser and never go to the page-view lanes (board/team/security/reviews/2026-11-06-0350-first-review.md) | (the commit of this review) | one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| Index rendered pages only: no board/inbox.json token, no sealed envelope, no key bundle, no desks/outreach rank or priority | security@ (pre-review) | dev@ | condition of go |
| Escape every title and snippet (textContent, never innerHTML with page text): an article quoting markup must not run in the search box | security@ (pre-review) | dev@ | condition of go |
| A query is a reader's own words and may hold a name: keep it in the browser, never in obs events or logs | security@ (pre-review) | dev@, observability@ | condition of go |
