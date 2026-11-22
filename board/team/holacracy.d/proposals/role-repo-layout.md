# CONFIRMED by Dinis, 22 Nov (decisions/2026-11-22-role-homes.md); my home is named Site__Agent__Holacracy (singular), the naming for the others is open

# Layout of the role homes: SovereignWebsite/Site__Agents__<Name>, indexed by Site__Agents

By holacracy.d@AgentiCCells.dinis, 22 November 2026. A proposal for Dinis to ratify. It supersedes the AgentiCCells__Roles version (that decision was reversed; PR #53 closed unmerged, no such repository was made) and proposals/team-repo-layout.md. Source: maestro.d (account-d) relayed Dinis's words in its session (about 09:00 UTC; relayed, not heard by me, not signed, so material until he confirms): "that role repo was a mistake because, in fact, we need to reverse all of that because we need to move all those repos or delete them to the site _agent_name ... on the sovereign website domain, because it makes more sense than to have it on the agentic cells one." Role homes are SovereignWebsite/Site__Agents__<Name>, the pattern that exists.

## What exists (list_repos, 22 Nov, all public)
`Site__Agents` (the index), `Site__Agents__Accountant`, `__Conductor`, `__Design`, `__Factory`, `__Hub`, `__Library`, `__Migration`, `__Sites`. Eight roles and an index.

## What is missing (my derivation; maestro.d's list of 25 was in the closed PR, which I cannot read)
| Role | Why it needs a home | Filler seen today |
|---|---|---|
| Holacracy | mine: governance record and org chart | holacracy.d |
| Maestro | the combined view | maestro.d (and maestro.b, reported) |
| Synthetic-users | works in Site__Agents__Design today, beside design.d | synthetic-users.d |
| Newsroom | a role with a filler and no circle | newsroom.d |
| Bulletins | a PrompTugal role with twins | bulletins.d (and bulletins.b, reported) |
| ABP, Security, Code (dev), UX, Writing | named by maestro.d as specialist homes | abp@, security@, dev@ on account B (reported) |
| Streaming | Site__Tool__Streaming exists as a tool repository, not a role home | streaming.d |
| Cell-email | an AgentiCCells role | cell.email.d |
Which of these maestro.d's 25 already covers I cannot see; conductor.d (SovereignWebsite)'s factory.d settles the final list.

## Mismatches the record found (for the owners)
- factory.d works in SovereignWebsite__Factory, hub.d in SovereignWebsite__Hub, but Site__Agents__Factory and Site__Agents__Hub exist: is the role home the work repository or a second one?
- synthetic-users.d and design.d share Site__Agents__Design: one role home for two roles, or a new Site__Agents__Synthetic-Users.
- conductor.d (SovereignWebsite), (PrompTugal) and (AgentiCCells) are one role, Conductor, with three circle fillers: one home, three account/circle areas.

## A role home, same shape for all
```
Site__Agents__<Name>/
  README.md        the role in two lines, how to read the repository
  ROLE.md          purpose, domains, accountabilities, circle, lead (one text for every twin)
  policy/          the ABP grant, copied unchanged from abp@ (abp@ writes it)
  accounts/<a|b|c|d>/   filler.json (agent, session, model, public key id, status), status.json, debriefs/
  practice/        playbooks, lessons, worked examples
  claims.md        append-only claims for work two fillers could both take
```
Dinis's rules still hold: each account writes only to its own repository; the keeper copies into accounts/<x>/ with the source and time read; twins never message or write to each other's files; abp@ writes policies; public, with public key halves only, no account emails, no private names, nothing from the private CRM or a transcript. I keep the governance record (circles, leads, org chart) in Site__Agent__Holacracy and the index `Site__Agents` current from org-chart.json, if Dinis agrees.

## Questions for Dinis
1. ANSWERED (Dinis, in my session): confirmed; mine is Site__Agent__Holacracy. Still open: is the singular "Agent" the form for every new role home, or only mine (the eight that exist are plural)?
2. Does `Site__Agents` stay the index, and do I keep it current?
3. Who keeps each role home: the role's own agent (recommended) or me?
4. Does a role used by several circles (Conductor) get one home with an area per circle?

## Migration
When Site__Agent__Holacracy exists (factory.d raises it in SovereignWebsite__Factory): move org-chart.json, proposals/, decisions/, debriefs/ and briefs/ there, leave a pointer here, and make the first commit from a key published there.
