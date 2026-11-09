---
pass: 2026-11-06-the-companies-page
goal: "The companies page (board/guidance/2026-11-06-companies-graphs-media-backups.md, section 1): several versions side by side with a switch to pick one (by field, by day, by country, a grid with logos, a search-first view, a graph view), the best kept after rounds of review; each company's logo (from a vault, not the repository); every company a folder in git open to pull requests from the company itself; RiskMandate added as a company (section 5)."
owner: conductor@PrompTugal.dinis
agents: [sherpa, synthetic, designer, dev, ontologist, librarian]
budget: "3 rounds, 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 06:50 UTC)"
state: open
opened: 2026-11-06T05:15Z
---
# Pass: the-companies-page

The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 05:15 | conductor@ | opened | go | (this file) | |
| 06:50 | accountant@ | budget set (board/budgets.json): 18 runs, 55 USD, 450k output tokens; observe mode (guidance section 15): at the budget the pass is marked over and the conductor decides | go | (budget commit) | not counted |
| 06:10 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0610-wake.md) | (the commit of this review) | part of one wake |
| 06:40 | sherpa@ | review (the reader, phone and desktop, live v0.1.152) | change: 6 findings, C1 and C2 first (board/team/sherpa/review-2026-11-06-0630-wake.md, section 4; design/shots/sherpa/w0630/) | (this commit) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| A company's pull request is material: reviewed before merge, limited to its own folder (never scripts, assets, .claude/ or .github/), and its claims marked as the company's own | security@ (pre-review) | dev@, ontologist@ | condition of go |
| Logos used to name the company only, from the company's own public source, stored in a vault | security@ (pre-review) | designer@ | condition of go |
| C1 24.6 phone screens and no way to find one company on the page: a filter box at the top | sherpa@ (review) | dev@ | open (conductor) |
| C2 The other views (topic, country, people, events) are hidden in paragraph 2: tabs under the title | sherpa@ (review) | designer@, dev@ | open (conductor) |
| C3 No logos; until the vault has them, a field icon or initials | sherpa@ (review) | designer@, dev@ | open (conductor) |
| C4 On a phone the 8 fields are inside a collapsed 'On this page': field chips in the first screen, doubling as the filter | sherpa@ (review) | designer@ | open (conductor) |
| C5 Name, country, one line per company: keep | sherpa@ (review) | (keep) | open (conductor) |
| C6 RiskMandate, when added, reads like any other company (same facts, sources, the disclosure link), never ranked or styled apart | sherpa@ (review) | ontologist@, the journalist, security@ | open (conductor) |
| Re-measured (09:35, 9 November, v0.1.814): Companies is the approved page (cards, switch, search with a field filter; 11.1 phone screens from 31.9); the day pages live with the three views, five things by default (D2 minor: 'By stage' wraps under the tab bar). D1 and L4 open. `board/team/sherpa/review-2026-11-09-0330-the-list-pages.md` | sherpa@ (re-measure) | dev.pages@ | D1, L4 open |
