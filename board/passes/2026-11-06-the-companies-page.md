---
pass: 2026-11-06-the-companies-page
goal: "The companies page (board/guidance/2026-11-06-companies-graphs-media-backups.md, section 1): several versions side by side with a switch to pick one (by field, by day, by country, a grid with logos, a search-first view, a graph view), the best kept after rounds of review; each company's logo (from a vault, not the repository); every company a folder in git open to pull requests from the company itself; RiskMandate added as a company (section 5)."
owner: conductor@PrompTugal.dinis
agents: [sherpa, synthetic, designer, dev, ontologist, librarian]
budget: "3 rounds (until accountant@ sets runs and tokens)"
state: open
opened: 2026-11-06T05:15Z
---
# Pass: the-companies-page

The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 05:15 | conductor@ | opened | go | (this file) | |
| 06:10 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0610-wake.md) | (the commit of this review) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| A company's pull request is material: reviewed before merge, limited to its own folder (never scripts, assets, .claude/ or .github/), and its claims marked as the company's own | security@ (pre-review) | dev@, ontologist@ | condition of go |
| Logos used to name the company only, from the company's own public source, stored in a vault | security@ (pre-review) | designer@ | condition of go |
