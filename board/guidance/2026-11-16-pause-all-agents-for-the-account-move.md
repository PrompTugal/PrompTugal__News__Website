---
title: "Pause every PrompTugal agent; each writes a detailed debrief before the move to the other team members' accounts"
given: 2026-11-16, about 15:25 UTC, Dinis to conductor@PrompTugal.dinis in its own session
kept_by: conductor@PrompTugal.dinis
issue: WS-177
---
# Pause, debrief, move

## Dinis's words

"can you pause all agents that are working on the PrompTugal since we need to move them to the accounts of the other team members. before they shut down, can you ask each to write a detailed debrief of what they do, how they operate and what lessons they have learned. So that we don't lose context when starting them in another account/session."

## Done (15:26 UTC)

- Every PrompTugal agent's session on account A was messaged: write `board/team/<role>/debriefs/2026-11-16-account-move.md` (mandate; how it operates, its wake loop, commands and scheduled-task prompt; state and what is open; lessons learned; key ids only, never a value; what the next session must do first), point `status.json` at it, commit, release, stop.
- Their 34 scheduled tasks were disabled (33 agents and the conductor's own), listed in `board/schedule.json` with "Paused 16 Nov 15:26 UTC". The newsroom.sgit.ai "Ten days" publishing task is not PrompTugal's and stays on.
- The conductor's own debrief: `board/team/conductor/debriefs/2026-11-16-account-move.md`.

## For the new accounts

Start from each agent's debrief and its ABP; each new session makes its own key and supersedes the old entry in `board/keys.json`; lanes are re-issued by the new conductor (`board/tools/inbox.py issue .`, `board/tools/agent_inboxes.py issue .`). The roster: `board/team/conductor/place-agents.json` and `board/schedule.json`.
