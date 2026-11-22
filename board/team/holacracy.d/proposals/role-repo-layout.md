# Layout of a role repository, and of the index AgentiCCells__Roles

By holacracy.d@AgentiCCells.dinis, 22 November 2026. A proposal for Dinis to ratify. It supersedes proposals/team-repo-layout.md. Source: maestro.d (account-d) relayed Dinis's words in its session (not heard by me, not signed, so material until Dinis confirms): about 02:20 UTC, "should it be AgentiCCells/AgentiCCells__Role__Holacracy and ... __Role__Dev, __Role__Conductor, __Role__Maestro .... etc"; about 02:30 UTC, "let's go for all now ... a repo call, agentic sales __ roles [AgentiCCells__Roles], and then that is also the one that links for everyone that we have ... every agent here is then connected to one of those role repos". The requests (the index and 25 role repositories) are in AgentiCCells Factory PR #53 for Dinis to merge. My home becomes AgentiCCells__Role__Holacracy. Nothing exists yet; I work in board/team/holacracy.d/ until it does.

## What carries over from Dinis's earlier answers (my session, ~02:30 UTC)
I hold the pen on the role's own record; abp@ writes the policies; each account writes only to its own repository and the role's keeper reads from there; public. Applied to a role repository: its keeper is the role's agent (for ROLE.md it is the role's own agent, I only keep the circle-level record).

## The index: AgentiCCells__Roles
One row per role: role, purpose, circle, role repository, keeper, fillers per account (agent, session link, model), twin, status. I keep it current from org-chart.json; a script draws it (tools/draw.mjs gains a roles view). Every agent is linked to exactly one role repository, so a role with no repository, or an agent with no role, shows as a gap.

## A role repository (same shape for all 25)
```
AgentiCCells__Role__<Role>/
  README.md        what the role is, in two lines, and how to read this repository
  ROLE.md          purpose, domains, accountabilities, circle, lead (written once for every twin)
  policy/          the ABP grant for the role, as abp@ writes it (copied unchanged)
  accounts/<a|b|c|d>/
    filler.json    who fills it on that account: agent, session, model, key id (public half), status
    status.json    that filler's status, read from the account's own repository
    debriefs/      that filler's debriefs, copied with source and time read
  practice/        how it is done: playbooks, lessons, worked examples (the "great examples")
  claims.md        append-only claims for work two fillers could both take
```
Rules, from Dinis: each account's agents write only to their own repository; the role's keeper copies into accounts/<x>/ with the source and the time read, so twins never write to each other's files and never message. ROLE.md changes only by an accepted proposal. Public: public key halves only, no account emails, no private names, nothing from the private CRM or a transcript.

## The specialist homes
ABP, Code, Design, Security, UX and Writing already have repositories that PR #53 links as those roles' homes. For them: ROLE.md and accounts/ live in the Role repository; the specialist repository holds the work (code, designs, policies) and the Role repository links to it, so nothing is moved or duplicated.

## Questions for Dinis
1. Is the relayed wording right, and does it replace AgentiCCells__Team in full?
2. Who keeps each role repository: the role's agent (my recommendation) or me for all? Keeping it myself would break "each account writes its own".
3. Do the 25 roles include the account-specific names (conductor, maestro) as one role each with twins as fillers, as proposed?
4. The index is mine; do I also check each role repository weekly that its ROLE.md, policy and fillers agree (my Secretary duty)?

## Migration
When the repositories exist: move org-chart.json, proposals/, decisions/ and debriefs/ into AgentiCCells__Role__Holacracy, leave a pointer here, make the first commit from a key published there, and open the index.
