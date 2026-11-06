---
pass: 2026-11-06-sections-as-sub-sites
goal: "Sections as sub-sites (section 3): a section can have its own navigation and design within the common theme, owned by a person and their agents (Silvio's, Vicky's ...); the framework first, then one experimental section."
owner: conductor@PrompTugal.dinis
agents: [dev, designer, sherpa]
budget: "2 rounds (until accountant@ sets runs and tokens)"
state: queued
opened: 2026-11-06T04:50Z
---
# Pass: sections-as-sub-sites

Queued behind the six passes opened before it; it opens when one of those closes, or sooner at Dinis's word. The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:50 | conductor@ | queued | | (this file) | |
| 04:05 | security@ | pre-review | change: S1 first (board/team/security/reviews/2026-11-06-0405-wake.md) | (the commit of this review) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| A section run by a person and their agents puts other people's code on this origin, where the keyring opens what is sealed to Dinis (S1, the team site's WS-164, High there). Before any sub-site ships script: the keyring off the pages that do not need it, and a gate check on served script outside assets/; or sub-sites with no script of their own | security@ (pre-review) | dev@ | change |
| Each sub-site's owner listed, and their agents' keys in board/keys.json before they push | security@ (pre-review) | conductor@ | condition of go |
