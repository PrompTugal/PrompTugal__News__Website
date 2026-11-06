---
title: "security@'s findings: every one, its severity, its owner and where it stands"
by: security@PrompTugal.dinis
updated: 2026-11-06T12:10Z
issue: WS-177
---
# The findings ledger

One row per finding, kept current at each wake; the detail is in the review named. Severity: high (a secret one step from public, or harm), medium (a rule broken, or one commit from a high), low (hygiene).

| # | Sev. | Finding (short) | Owner | State at 12:10 | Review |
|---|---|---|---|---|---|
| S1 | medium | The keyring (Dinis's key) loads on every page and is callable by any script on the origin; `desks/` serves any file type | dev@ | **open**: keyring still on every page; no gate check on served script | 0350 |
| S2 | medium | Dinis and two conductors can open the observability vaults; keys re-sealed, not rotated | Dinis, observability@ | **open**, waits on Dinis | 0350 |
| S3 | medium | Every reader's IP reaches ipapi.co and ipwho.is for the place; the footer says no IP | observability@, Dinis | **open**: geo unchanged; no page says it yet (the privacy-first pass will) | 0350 |
| S4 | medium | The team's outreach ranking (rank, priority, ask) served from `desks/outreach/` | outreach@, Dinis | **open**: `targets.json` still public, 50 rows | 0350 |
| S5 | low | Sealed envelopes (`ws-ecies-1`) are not signed | dev@, observability@ | open | 0350 |
| S6 | low | The drain installs sgit-ai unpinned | devops@, observability@ | open | 0350 |
| S7 | low | The synthetic vault's read key is public; screenshots unchecked | synthetic@ | open | 0350 |
| S8 | low | The public inbox lane can be filled | conductor@ | open (accepted as noise) | 0350 |
| S9 | medium | Most vaults have no recovery path | Dinis | **decided** (04:45): ephemeral for now; a recovery vault he holds later; the conductor holds every key (06:20) | 0405 |
| S10 | low | Board times ahead of the clock | conductor@ | open | 0405 |
| S11 | medium | 39 acts claim Dinis's word; none signed | Dinis, conductor@, dev@ | **open**: no signed guidance yet | 0450 |
| S12 | medium | Transcripts readable by every session; security@'s inbox credentials exposed in its own | every agent; conductor@ | **open**: security@'s inbox not re-issued (still the 04:25 one) | 0450 |
| S13 | medium | The conductor holds every agent inbox's keys; lanes uncounted | conductor@ | **accepted** by Dinis (06:20); counting waits on receipts | 0450 |
| S14 | low | A schedule written into the wrong session | conductor@ | open | 0450 |
| S15 | high | The hooks run in every agent's session; any push changes them | dev@, abp@ | **half done**: the hook loads no other code and checks its pin (matches, 0e0922bd at 12:05); the gate check on `.claude/` commits not built | 0610, 0805 |
| S16 | medium | Scheduled agents without keys; the old designer key active | each agent, designer@ | **closed** (12:05): every enabled agent has a key; the old designer key superseded | 0610, 1205 |
| S17 | low | security@'s grant lacks remote read and sub-agents; its nav.json line | abp@, Dinis, dev@ | **open**: listed by the conductor among five relaxations for Dinis | 0610 |
