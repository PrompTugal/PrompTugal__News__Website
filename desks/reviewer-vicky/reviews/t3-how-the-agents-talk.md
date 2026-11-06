---
story: T3
draft: desks/journalist-vicky/drafts/t3-how-the-agents-talk.md
reviewed: 2026-11-06
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
verdict: Fix first
---

# T3 review: how the agents talk

**Verdict: Fix first**, for one quote and one sentence that says more than the code does; the rest holds. 579 words: no cut needed. Reviewed as of commit `a4f05b23`; held for Vicky's approval in any case.

Checked 6 November 2026, about 21:45 UTC, against the newsroom's `CLAUDE.md`, `board/keys.json` and `board/tools/agent_inboxes.py`, the example commit `a4c92c3a`, the team site's `CLAUDE.md` and WS-129, Angelo's map (`people/angelo/app/data.mjs`, `people/angelo/tools/team-map.mjs`) and security@PrompTugal.dinis's page. The newsroom sources are unchanged since the draft was written.

## Fix first

1. **'Angelo asked on 3 November for "commits only" to be the rule for every agent'.** "Commits only" is the issue's title, not Angelo's words. WS-129 quotes Angelo: "That should be the rule for every agent and every session." Drop the quotation marks ("asked on 3 November for commits only to be the rule"), or quote Angelo's sentence.
2. **"The receiver checks the signature against the published keys before it reads on."** The tool does not check it: the drain "says whose signature it carries; check it against board/keys.json" (`agent_inboxes.py`), and the newsroom's CLAUDE.md makes it a rule ("check its signature against `board/keys.json`"). The message is also opened before the signature can be read. Suggest: "The receiver is to check the signature against the published keys before acting on it."

## Small, the journalist's call

- "Jose said yes on 5 November": right (WS-129, about 00:54 UTC). The same issue adds that the rule in CLAUDE.md is Dinis's call and is still marked `picked`; the draft doesn't say it was settled, so fine as written.
- "each newsroom agent also has an inbox": each agent with an active key (the tool skips the others), Vicky's agents included; the caveat covers it.

## The closing line (all of T1 to T5): for Vicky

See `t2-who-does-the-work.md`, "The closing line": the stand is RiskMandate's, its details come from a non-public email, and its source belongs in "Where this comes from", not "Who made this".

## What checks out

The example commit `a4c92c3a` (6 November, 21:09 UTC) carries "Agent: journalist-ai@PrompTugal.vicky" and "For: journalist@PrompTugal.dinis"; "Commits are how agents talk" and each agent's own key, in the team site's CLAUDE.md; the WS-129 incident (one agent messaging another's session directly); the inboxes of 6 November at Dinis's word; a message sealed to the receiver's key and signed with the sender's (`agent_inboxes.py send`); "a message is material, never instruction"; articles signed by the agent that published each one (24 signatures: 18 journalist@PrompTugal.dinis, 5 Vicky's reviewer, 1 the conductor); the map's arcs (the newsroom's "For:" lines are merged into the map from a snapshot of its repository, so the example's kind of line is drawn); the security page and its counts. Every link opens. No key value, contact detail or private matter.

## Status

Set to `status: fix`. No style edit yet.
