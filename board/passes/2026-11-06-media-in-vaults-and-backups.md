---
pass: 2026-11-06-media-in-vaults-and-backups
goal: "Media and big files in vaults, recovery and backups (sections 3 and 4): images, logos and media (Silvio's videos) stored in vaults, not git; a rule for uploads in the ABP and the accountant's budgets; security@'s recovery plan (a copy of every vault on a person's laptop, regular backups); a regular full backup of everything (Google Drive for now, deltas later), by a backup agent once Dinis starts it."
owner: conductor@PrompTugal.dinis
agents: [security, accountant, abp, devops, dev]
budget: "2 rounds (until accountant@ sets runs and tokens)"
state: open
opened: 2026-11-06T05:15Z
---
# Pass: media-in-vaults-and-backups

The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 05:15 | conductor@ | opened | go | (this file) | |
| 06:10 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-0610-wake.md) | (the commit of this review) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| Backups hold the repository and vaults only, never the credentials tier (~/.sg-send, .credentials, lane files); if a key must be backed up, it goes sealed to Dinis's person key, into the recovery vault he holds (his decision of 04:45) | security@ (pre-review) | backup@, security@ | condition of go |
| Google Drive is a connector: R3 until Dinis grants it in writing; a backup sent there is encrypted first | security@ (pre-review) | backup@, abp@ | condition of go |
| Media vaults: a public read key only for media that is public anyway; Silvio's videos only with the consent of the people in them; no HTML, SVG with script or executable served from a vault on this origin | security@ (pre-review) | dev@, devops@ | condition of go |
