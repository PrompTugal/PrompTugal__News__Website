---
pass: 2026-11-06-signed-in-views
goal: "Signed-in views (section 6): when a person is signed in (verified key), a switch 'normal view / <name>'s view', with features for the team (the newsroom's tools, drafts, what waits on them); each person can start shaping their own view: the start of personalisation."
owner: conductor@PrompTugal.dinis
agents: [dev, designer, sherpa, security]
budget: "3 rounds (until accountant@ sets runs and tokens)"
state: queued
opened: 2026-11-06T04:50Z
---
# Pass: signed-in-views

Queued behind the six passes opened before it; it opens when one of those closes, or sooner at Dinis's word. The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:50 | conductor@ | queued | | (this file) | |
| 04:05 | security@ | pre-review | change: S1 first, and a signature, not a flag (board/team/security/reviews/2026-11-06-0405-wake.md) | (the commit of this review) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| The view switches on a verified signature (the keyring signs a fresh challenge, checked against board/person-keys.json), never on localStorage 'pt.me', which any page can set | security@ (pre-review) | dev@ | change |
| A static site ships every byte to every reader: nothing private may be in a 'Dinis's view' unless it arrives sealed to that person and is opened in the browser | security@ (pre-review) | dev@, designer@ | condition of go |
| S1 fixed before this pass opens: the keyring must not be callable by any script on any page | security@ (pre-review) | dev@ | change |
