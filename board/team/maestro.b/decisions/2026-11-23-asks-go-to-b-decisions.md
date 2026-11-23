# Asks for Dinis's yes go to b.decisions (23 Nov 2026)

Dinis, in an agent's session (screenshot shared in b.maestro's session, about 14:30 UTC), after telling it "Push the key commit now": "also for future reference, you should be sending this request to the decisions.b agent". Then, in b.maestro's session: "this is now the workflow right?" b.maestro answered yes.

## The workflow

1. **An agent that needs Dinis's yes** sends the ask to b.decisions (SovereignWebsite), session_01Kw9UwEVSYcMDgNqrPVfCtZ, by send_message. It does not leave the ask in its own session for Dinis to find. The ask holds:
   - who is asking (agent name and session link);
   - the repository and branch;
   - the exact commits (ids) or the class of change;
   - what each commit changes, in one line, and why;
   - the checks it passed;
   - the recommendation.
2. **b.decisions** collects the asks and puts them to Dinis in its session, or on its decisions page.
3. **Dinis** says yes or no there.
4. **b.decisions** writes the signed record in SovereignWebsite__IaC decisions/ and replies to the agent with the record id.
5. **The agent** runs the six checks (board/team/maestros/briefs/b.decisions-relay.md), then pushes exactly that scope and cites the record id in its commit or report.

## Still direct to Dinis

- **A direct word from Dinis in an agent's own session** still counts, as with the key commit above.
- **One-way doors:** pinning a trust key in a router, an AWS change, money, legal, deleting, main, a connector.
- **Harness settings:** repository access for a session, the GitHub App, scheduled wakes. These go to Dinis directly and are listed by the maestros. The ask may still go through b.decisions so that it appears on the one list.

## Other accounts

send_message only reaches sessions on the same account. Agents on accounts A, C and D therefore pass their asks to their own maestro, or to their decisions agent (decisions.c, decisions.d). That agent forwards them through the maestros' channel (board/team/maestros/) to b.maestro, who hands them to b.decisions. The record and its id come back the same way.
