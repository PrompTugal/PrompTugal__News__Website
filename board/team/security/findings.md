---
title: "security@'s findings: every one, its severity, its owner and where it stands"
by: security@PrompTugal.dinis
updated: 2026-11-06T14:10Z
issue: WS-177
---
# The findings ledger

One row per finding, kept current at each wake; the detail is in the review named. Severity: high (a secret one step from public, or harm), medium (a rule broken, or one commit from a high), low (hygiene).

| # | Sev. | Finding (short) | Owner | State at 14:10 | Review |
|---|---|---|---|---|---|
| S1 | medium | The keyring (Dinis's key) loads on every page and is callable by any script on the origin; `desks/` serves any file type | dev@ | **open**: keyring still on every page; no gate check on served script | 0350 |
| S2 | medium | Dinis and two conductors can open the observability vaults; keys re-sealed, not rotated | Dinis, observability@ | **decided** (12:30): rotate now, as the first rotation; sent to observability@ (signed) | 0350, 1230 |
| S3 | medium | Every reader's IP reaches ipapi.co and ipwho.is for the place; the footer says no IP | observability@, Dinis | **decided** (12:30): the pages and the site's policy say it; sent to observability@ and journalist@ | 0350, 1230 |
| S4 | medium | The team's outreach ranking (rank, priority, ask) served from `desks/outreach/` | outreach@, Dinis | **decided** (12:30): the target list stays; rank, priority and ask go to the private CRM; sent to outreach@ | 0350, 1230 |
| S5 | low | Sealed envelopes (`ws-ecies-1`) are not signed | dev@, observability@ | open | 0350 |
| S6 | low | The drain installs sgit-ai unpinned | devops@, observability@ | open | 0350 |
| S7 | low | The synthetic vault's read key is public; screenshots unchecked | synthetic@ | open | 0350 |
| S8 | low | The public inbox lane can be filled | conductor@ | open (accepted as noise) | 0350 |
| S9 | medium | Most vaults have no recovery path | Dinis | **decided** (04:45): ephemeral for now; a recovery vault he holds later; the conductor holds every key (06:20) | 0405 |
| S10 | low | Board times ahead of the clock | conductor@ | open | 0405 |
| S11 | medium | 39 acts claim Dinis's word; none signed | Dinis, conductor@, dev@ | **open**: explained to Dinis (12:45); his decision | 0450 |
| S12 | medium | Transcripts readable by every session; secrets printed into them: security@ (04:30), accountant@ (09:50), customers@ (~13:00) | every agent; conductor@ | **open**: three re-issues to do; security@'s transcript scan from 16:03; the decision page | 0450, 1405 |
| S13 | medium | The conductor holds every agent inbox's keys; lanes uncounted | conductor@ | **accepted** by Dinis (06:20); counting waits on receipts | 0450 |
| S14 | low | A schedule written into the wrong session | conductor@ | open | 0450 |
| S15 | high | The hooks run in every agent's session; any push changes them | dev@, abp@ | **half done**: the hook loads no other code and checks its pin (matches, 0e0922bd at 12:05); the gate check on `.claude/` commits not built | 0610, 0805 |
| S16 | medium | Scheduled agents without keys; the old designer key active | each agent, designer@ | **closed** (12:05): every enabled agent has a key; the old designer key superseded | 0610, 1205 |
| S17 | low | security@'s grant lacks remote read and sub-agents; its nav.json line | abp@, Dinis, dev@ | **granted** by Dinis (12:30): remote read and sub-agents; abp@ to write it into the ABP | 0610, 1230 |

**Rotation:** every key's schedule, the workflow (mint, publish, overlap, sign-off, retire) and what blocks it: `board/team/security/key-rotation.md` (12:40, at Dinis's word).
| S18 | medium | Agents blocked on their tools (no sgit-ai, no drain tool, no token), per-session installs from PyPI unpinned | Dinis (the environment), devops@, conductor@ | **open**: pinned and hashed install in the environment; the drain in this repository; no token in every session | 1405 |
