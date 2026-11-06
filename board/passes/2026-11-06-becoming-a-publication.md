---
pass: 2026-11-06-becoming-a-publication
goal: "PrompTugal.news as an official publication (guidance section 3): everything newsroom.sgit.ai has (policies, contacts, references, comments and corrections, the right to remove), here and better; how to register as a publication in Portugal (and the UK); what Web Summit's press accreditation asks; a press-pass application ready for Dinis."
owner: conductor@PrompTugal.dinis
agents: [journalist, historian, librarian, security, designer, dev]
budget: "3 rounds, 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 06:50 UTC)"
state: open
opened: 2026-11-06T04:35Z
---
# Pass: becoming-a-publication

The shape: board/the-passes.md. Each step adds a line below: time, agent, step, verdict, commit, spend.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:35 | conductor@ | opened | go | (this file) | |
| 06:50 | accountant@ | budget set (board/budgets.json): 18 runs, 55 USD, 450k output tokens; observe mode (guidance section 15): at the budget the pass is marked over and the conductor decides | go | (budget commit) | not counted |
| 04:05 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0405-wake.md) | (the commit of this review) | part of one wake |
| 06:58 | librarian@ | the condition on me (security@, pre-review) noted: the catalogue (board/catalogue.json) carries only titles, paths, first lines and who made what; no form, identity or press-pass file is indexed, and I check it at each wake | go | (this commit) | part of one wake |
| 11:40 | journalist@ | round 1 findings: Web Summit's media accreditation policy for Lisbon 2026 (proof of published work; the brand-content exclusion is the risk to answer) and ERC registration in Portugal (Decreto Regulamentar 8/99: online included, an editorial statute and a director needed; whether it applies to a UK-owned publication is for Dinis and a lawyer); `desks/journalist-promptugal/publication/2026-11-06-findings-round-1.md`; no identity data | go, round 1 of 3 | (this commit) | one wake |
| 13:40 | journalist@ | round 2: newsroom.sgit.ai's publication materials against ours (charter, corrections, rights, disclosure, policies, contacts, the right to remove, privacy, who is in charge), each gap with its owner; a draft corrections policy describing what the site already does; the two questions for Dinis now pages at /newsroom/decisions/; `desks/journalist-promptugal/publication/2026-11-06-findings-round-2.md` | go, round 2 of 3 | (this commit) | one wake |
| 14:40 | journalist@ | round 3 (part 1): a draft editorial statute to the Press Law's article 17 (orientation and objectives; ethics; the readers' good faith), describing only what the site does or the board has decided, with what is new in it and needs Dinis's yes; `desks/journalist-promptugal/publication/2026-11-06-editorial-statute-draft.md`. Left: the right to remove and of reply (Press Law articles 24 to 27), ERC's current form and fee, the UK route | go, round 3 of 3 | (this commit) | one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| Contacts: role addresses on promptugal.news only, at Dinis's word; no person's own address, phone or postal address on any page | security@ (pre-review) | journalist@, designer@ | condition of go |
| The registration and the press-pass application need a person's identity (name, ID, address): that stays out of this repository and every public vault; the repository holds only what is asked and a checklist, the filled form lives with Dinis | security@ (pre-review) | journalist@, librarian@ | condition of go |
| The right to remove says what is true: a removal takes a thing off the pages, twins, API, search and the summit-days view, but git history and other people's copies keep it; say so | security@ (pre-review) | journalist@, dev@ | condition of go |
