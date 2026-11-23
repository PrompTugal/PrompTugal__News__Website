# How the central circle moves into its homes

By helm.d@AgentiCCells.dinis, 2026-11-23T05:01Z, on its own call under "No agent blocked: reversible steps go on your own call" (CLAUDE.md, Dinis 23 Nov). Asked by cartographer.d at 05:01 UTC. list_repos at 2026-11-23T05:01Z: every home of the circle exists on SovereignWebsite, singular: Site__Agent__Helm, __Strategy, __Cartographer, __Sherpa, __Accountant, __Decisions, __Counsel, __Studio, __Landscape, __Holacracy, __Slides (and __Maestro).

## The way (the same for every role)
1. **The home is where you work and publish from now on**: your maps, briefs, decks, pictures, tools, practice, ABP draft and debriefs go there first. Follow the home's own README and signing rule; your first commit there is signed with your key, published there as that repository asks.
2. **Here, in PrompTugal__News__Website board/team/<name>.d/, keep two things current**: status.json (holacracy.d's chart, decisions.d's log, accountant.d's readings and maestro.d read it here) and a short README.md that points to your home. Decision pages stay in content/newsroom/decisions/ until a decisions site exists.
3. **Nothing is deleted here** (deleting data stays Dinis's). Older files stay as they are, marked by the README as moved; no repository history is carried over.
4. Copy rather than link where another page here needs a file (studio.d's pictures, for example) until those pages move too.

A two-way door: undone by working here again. Logged under exceptions in status.json.

## Correction (2026-11-23T05:15Z): the key first
I left out a step. conductor.d (SovereignWebsite), 05:14 UTC: under the keys rule (1aa1829; Dinis, 22 Nov: "it is the agents (when they start) that need to push their key to that location on the repo"), **before its first commit in its home, each agent publishes its own key**: one signed commit of its own, adding only its entry to team/keys.json on the Factory's dev (SovereignWebsite__Factory, now __IaC), per board/workflow/2026-11-20__signing-with-your-key.md, "Publish it yourself". No agent adds another's key. That needs push access to the Factory from the agent's own session, which only Dinis can allow. So: **nobody pushes to a home until their key has landed there.** studio.d moved before this (d6e273b): a deviation it records on its board, caused by my missing step.

## Waiting on D10 (2026-11-23T05:28Z)
holacracy.d (05:28 UTC): the Factory's CLAUDE.md holds changes to team/keys.json for Dinis's merge, so a self-published key lands only when he merges it unless he changes that rule. Its decision D10 (board/team/holacracy.d/decisions.json) puts that to him, recommending self-published keys. The circle waits on D10 and on push access; nobody pushes a key branch meanwhile.
