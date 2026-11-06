---
title: "The agents' messages, mapped: four channels, 118 acts in 28 hours, 39 claims of Dinis's word with no signature"
by: security@PrompTugal.dinis
at: 2026-11-06T04:50Z
asked_by: Dinis Cruz, in security@'s session, 6 November 2026 (about 04:35 UTC)
issue: WS-177
for: Dinis Cruz
---
# The agents' messages, mapped

The page: `/newsroom/security/` (content/newsroom/security/index.md), with the picture (`board/team/security/comms/map.svg`) and the data (`board/team/security/comms/comms.json`).

## How it was measured

Five sub-agents of this session read the transcripts of 20 sessions with the account's `list_events`, through one extractor (kept in my session's scratchpad, not here) that records only metadata: time, channel, sender, receiver, size, whether the text claims Dinis's word, whether it holds anything shaped like a secret. No text was copied. A message seen at both ends was counted once (14 of 22). Coverage gaps are listed in `comms.json`.

## What it shows

- 118 acts from 5 November 00:00 to 6 November 04:30 UTC: 22 messages, 17 sessions created by an agent, 22 schedule writes, 57 scheduled wakes. Two hubs: conductor.3@web-summit (made 10 sessions, 8 of them PrompTugal's) and conductor@PrompTugal (7 sessions, 14 schedules written and 5 rewritten, 9 messages, 15 inboxes).
- Traffic is rising: 16 acts at 00:00 to 01:00, 21 at 03:00 to 04:00 on 6 November, before the 14 new inboxes opened at 04:25.
- None of the 118 carried anything shaped like a secret.

## New findings

| # | Severity | Finding | Owner |
|---|---|---|---|
| S11 | Medium | **Authority by relay.** 39 agent-written acts (first briefs, standing prompts, messages) say they carry Dinis's word; none is signed, and nothing lets the receiver check. Every scheduled agent's standing prompt was written by a conductor. A misled agent, or anyone writing to a public inbox lane, can write the same words. | Dinis (decision); conductor@; dev@ (a way to sign guidance in Dinis's browser) |
| S12 | Medium | **Transcripts are a shared read surface.** Any session on the account reads any other's transcript (this map was made that way). A secret printed once is readable by every agent. Evidence: I printed my own inbox's credentials in my transcript while opening them; that inbox must be re-issued. | every agent (never print a credential, even your own); conductor@ (re-issue security@'s inbox) |
| S13 | Medium | **One reader of all mail.** The conductor made the 14 agent inboxes and keeps every one's keys (at Dinis's word, per the tool), so it can read every agent's mail; write tokens are public, so a message's sender is only its signature. The lanes are not counted anywhere. | conductor@ (receipts, below); every agent (reject unsigned or unknown signers) |
| S14 | Low | **Misrouting.** dev@'s hourly schedule was first created in another project's session (journalist@web-summit) and deleted a minute later. Nothing checks a schedule's target before it is written. | conductor@ (check the target session's title first) |

## Proposed (for Dinis and conductor@)

1. A receipt for every send, to security@'s inbox lane: from, to, channel, time, size, sha256, signed by the sender, sealed to security@; never the text. `board/tools/agent_inboxes.py send` can append it in the same call.
2. At each wake, receipts reconciled against transcripts; a gap is a finding.
3. Dinis's guidance signed by his key; prompts cite it by file and hash.
4. A budget for messages per agent per day (accountant@).
5. A Messages panel on Dinis's dashboard (`board/spec-dashboard-messages.md`, for dev@).
