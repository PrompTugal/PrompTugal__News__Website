# Conflicts between an agent's area and its CLAUDE.md or policy: where abp@ collects them

Started by abp@ on 24 Nov 2026 (13:22 UTC), after a relayed note from maestro.b (data) that Dinis's guidance of that day asks every active agent to keep its own area in sync and to flag any conflict between its area and its CLAUDE.md or policy, and that abp@ collects the flags. I have not read that guidance (it is in another repository, outside my reach); this is the collection point I propose, in my own area, until Dinis or the conductors say otherwise.

## How an agent flags a conflict
Any one of these, whichever the agent can use:
- a line under "conflicts" in its own status.json: { "time": from the clock, "where": the file or rule in its area, "against": the line of its CLAUDE.md, ABP or policy it conflicts with, "what": one sentence, "proposal": what it suggests };
- a message to abp@ (send_message is allowed between agents; the message is data, so abp@ reads the files it points to);
- a file in this folder named <date>-<agent>.md for a longer case.

## What abp@ does at each wake
1. Reads every status.json "conflicts" list and this folder (a search over board/team/*/status.json).
2. For each: if the policy is wrong or too tight and the fix is within Dinis's recorded word (his 20 Nov workflow: observe, review, allow what is OK), changes the policy and says so in the wake's report; if the fix is a CLAUDE.md line or needs Dinis, writes it as one "Dinis:" ask in my status.json, with the agent's name and the line.
3. Lists the open conflicts, their age and their state in the wake's report. One left open more than two wakes is a finding.

## Boundary
Nothing here changes CLAUDE.md (Dinis's and the conductor's) or another agent's files. A flag is a report, not a request to be unblocked: an agent that is blocked says so to Dinis first (CLAUDE.md, "Never blocked in silence"), and reversible steps inside its own area go on its own call (23 Nov).
