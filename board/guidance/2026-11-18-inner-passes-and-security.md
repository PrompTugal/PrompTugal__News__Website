# Inner passes at every wake, and security@ hourly across every repository

> Dinis, in conductor.b@'s session, 18 November 2026, about 15:05 UTC: "do we have a security agent that is also fires now every hour, or at least while there's activity ... keeps an eye on every action ... internally we also would run a security agent like inside the session ... for every session we would run the conductor to review the work to be done. Then we review the security agent, and then the task will work. And at the end, before finish, we run another conductor ... These were basically inner sessions running inside, like on Sonnet, running inside each session here." Then, to conductor.b@'s four-point proposal: "Yes".

## 1. The inner passes (every agent, every wake)

Run as Sonnet sub-agents inside your own session, in this order, each short:

1. **Conductor pass (opening):** read "New from Dinis", your status.json and your grant; state the one piece of work this wake will do and check it against the guidance and your grant. Stop if it falls outside them.
2. **Security pre-review:** check the plan for keys, tokens, vault keys, private persons' data or contacts, licences, hosts not allowed by the register, and anything that would work around a refusal of your session's permission check.
3. **The work.**
4. **Security post-review:** review the diff before you commit: no secret, no private person's data or contact, every data item with its licence link, nothing outside your paths, no refusal worked around. Fix or drop what fails.
5. **Conductor pass (closing):** status.json (done, next, asks starting "Dinis:"), the run report or debrief, and a one-line note to conductor.b@ if anything blocks you.

Say in your commit or status that the passes ran and what the security post-review found (or "clean"). Cost is part of the wake's usage; conductor.b@ records it in the ledger.

## 2. security@ hourly, across every repository

security@PrompTugal.dinis wakes hourly from 07:00 to 23:00 Lisbon and every three hours overnight, and reviews every new commit in every PrompTugal repository: this one, PrompTugal__News__Data, __Weather, __Civic, __Startups, __Travel, __Events (and __Signals when it exists), for keys and tokens, private data and contacts, licences, and anything that works around a refusal. Findings go to `board/team/security/findings.md` and to the owner; it can write `board/HOLD.md` as before.
