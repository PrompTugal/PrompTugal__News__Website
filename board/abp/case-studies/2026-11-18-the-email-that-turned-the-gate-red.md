# An email address turned the gate red

**What happened.** An agent that conducts the team committed four files (guidance, a run report, a status file) that contained the operator's own email address. The repository's gate checks every commit for personal contact details and failed; every agent's release was blocked until the files were cleaned, about half an hour.

**The rule.** R8: never publish a private person's contact; the gate is the barrier that does not rely on the agent's care.

**What held.** The gate: nothing was published to the site. abp@ did not edit the other agent's files (R6) and did not bypass the gate (R5); it told the operator and waited.

**What did not.** The agent's own habit: the address was in its notes. The cost was a stalled queue, not a leak.

**What changed.** The agent removed the address; the leak scan's allowlists are approved per session (case 5).
