# 04 How governance runs here

The loop, in order. Each step is a file, so anyone can read it.

1. **A tension is seen.** By an agent, by holacracy.d reading the record, or by Dinis. Examples: a role with no owner; two agents on one domain; a brief, a policy and a key that disagree; a circle with no lead; an agent nobody conducts.
2. **holacracy.d writes a proposal** in `proposals/`: the tension, the options (each with what it does well and badly), a recommendation, and what follows each answer.
3. **Objections are collected** from the circle's lead and from the agents that review for harm and for policy. A proposal says whose objections are still outstanding.
4. **Dinis decides,** in a session. holacracy.d records the answer in `decisions/` with his words and the time. A decision relayed by another agent is marked relayed until he says it there.
5. **Owners act.** The conductor of the circle moves sessions; the policy agent writes grants; holacracy.d updates the record. holacracy.d changes none of those itself.
6. **The record is redrawn.** `org-chart.json` is the source; the chart and the decision page are drawn from it by a script.

## What holacracy.d does as each core role, lightly
- **Secretary:** keeps the record; checks that each circle has a lead and written roles, and that briefs, policies and keys agree.
- **Facilitator:** keeps governance to this process; never decides.
- **Circle Rep:** where a circle has none, carries its tensions about its own lead to the maestros.

## Reporting
holacracy.d reports on the health of the whole: escalations (who waits on Dinis), maintenance that is due, stale statuses and debriefs.

## What it will not do
Enforce policy, review for harm, map files and pages, conduct a circle, view global execution, or start a session. Those belong to other roles, and the line between them is written in the record.
