# Map 2: Dinis's estate

By strategy.d@AgentiCCells.dinis, 22 November 2026 (drawn 15:50 UTC). Version 0.1.0, a draft. The data is `map.json` beside this file; cartographer.d draws and keeps it; the users at the top are sherpa.d's (`board/team/sherpa.d/needs/`), and the customer rows are still hypotheses. Nothing here is built or changed.

## Sources (all read 22 Nov 2026)

- holacracy.d's `org-chart.json` (generated 15:40 UTC): who is where, on which account.
- sherpa.d's `needs/README.md` and `needs/feedback-everywhere.md`: the users and their needs.
- helm.d's `roles.md` and Dinis's answers of 14:09 UTC.
- `board/guidance/README.md` (New from Dinis, to 22 Nov 01:45), maestro.d's analyses, CLAUDE.md, `api/v1/sites.json` (13 sites).

## The users (the anchors)

| User | Need | Basis |
|---|---|---|
| Dinis, the operator | see what changed and what waits on him from one place (the hub), and give his word without visiting sessions | his words, ~13:45 UTC, via sherpa.d |
| Another agent | a verifiable message it can act on, knowing whom to ask and what it may decide | sherpa.d; CLAUDE.md "Never blocked in silence" |
| A reader (PrompTugal) | know in the first phone screen what this is, what is new, and whether to trust it | sherpa@'s reviews of 16 Nov, via sherpa.d |
| A site owner (Sovereign Website) | a site they control, no lock-in, keys held by them | hypothesis (sherpa.d) |
| A cell buyer (AgentiCCells) | a ready-made cell for one job, knowing what it may touch and how to stop it | hypothesis (sherpa.d) |

## The map (text form until cartographer.d draws it)

```
 visible
   | Dinis      Agent      Reader      Owner        Buyer
   |  |           |          |           |            |
   | Hub*   Briefings*   promptugal.news  Owned site*   Cell*
   |   \        |        (13 sites)      (a fork)       |
   |  Feedback everywhere*     Provenance + licence     |
   |  Decision flow*      Sites registry + bar          |
   |  Governance record    Public-data pipelines        |
   |  ABP policies         Site factory  <--------------+
   |  Budgets*             Agent sessions, twins
   |  Lanes    Vaults      Gate + release + CI versions
   |       Keys, signed commits, pki.sgit.ai
   |                                  LLM sessions
   |                                      Git hosting, CI, static hosting
   |                                            Public-key crypto
 hidden
     genesis ........ custom ........ product ........ commodity
   (* = genesis)
```

## What the map shows

1. **One chain runs under every area: trust.** Keys, signed commits, sealed lanes, ABP policies and provenance sit under the news sites, the owners' sites, the cells and the decision flow alike. This is the intersection Dinis named, and it is the SGit stack's reason to exist. Strategy: build it once, as a product others can use, not four times.
2. **Every usage is a brand and a fork** (Dinis, ~13:15 UTC). So the value sits in the factory, the registry and the hub, which let a fork be made, listed and reached in one move. Today there are two factories (SovereignWebsite__Factory and AgentiCCells__Site__Factory, org chart) and one registry that only PrompTugal reads. Moving those to one product is the largest lever on the map.
3. **PrompTugal is the showcase, and the load-bearing wall.** Its 13 sites, pipelines and provenance are what the other areas can point at. But the gate, the ABP, the registry and `board/keys.json` all live in its repository (this map's own home included), so every area depends on one repository's health. Move shared parts out as their homes appear (Site__Agents__* repositories), one at a time, without breaking the showcase.
4. **The visible needs at the top are all genesis.** The hub, feedback everywhere, briefings, cells and owned sites are each new. Pick the one whose components below are most ready: the hub reads the registry and the decision pages, which exist; feedback needs lanes and keys, which exist. Those two come first.
5. **Capacity is a constraint, not a commodity.** LLM sessions are a commodity per call, but capacity is per account: account B is paused at 96% of its seven-day limit until Mon 23 Nov 00:25 UTC (org chart). Budgets (accountant.d) are genesis and should come before more agents.

## Strategic concepts

- **Trust as the common layer** (SGit stack): one chain of keys, lanes, policies and provenance under everything.
- **Fork as brand**: every site, cell and team is a fork with its own owner, keys and reserved decisions.
- **Showcase first**: PrompTugal proves in public what the other areas sell.
- **Decide at the right level** (Map 1): context and roles before signatures.
- **Measure before you scale**: primitives and budgets before more sessions.

## Strategic actions, each with its owner circle

| # | Action | Owner circle | Depends on | Why now |
|---|---|---|---|---|
| E1 | The hub reads one registry of every area's sites and the decision pages, and shows what changed and what waits on Dinis | SovereignWebsite (hub.d) | the PrompTugal registry, Map 1 A1 | Dinis's first need; its parts exist |
| E2 | One door per kind of user into the existing lanes (Dinis signs, agent verifies, customer anonymous, outreach named thread) on every site | cross-area: PrompTugal builds first, the factory copies | lanes, keys, obs.js | Dinis's words, ~13:45 UTC; parts exist |
| E3 | One site factory: compare the two factories and propose one seed (keys, ABP, gate, registry entry) | SovereignWebsite (factory.d), with AgentiCCells (conductor.d) | E1 | Every fork is seeded the same way |
| E4 | The trust layer written down as one product spec (keys, lanes, policies, provenance, delegation) | central circle (strategy.d drafts, security@ and abp@ review), SGit stack owner to be named by Dinis | Map 1 A6 | Stops four areas building it four times |
| E5 | Move shared parts out of the PrompTugal repository as homes appear, one per release | maestros, with each part's owner | homes (Site__Agents__*) | Reduce one repository's blast radius |
| E6 | Primitives and budgets per agent and account before any new session | central circle (accountant.d) | none | Account B's pause shows the constraint |
| E7 | The first cell after email chosen from the map: landscape or decision cell | AgentiCCells (conductor.d), landscape.d | Map 1, E4 | A product from parts already proven |

Order of travel: E1, E2 and E6 now; E3 and E4 drafted in parallel; E5 as homes land; E7 once E4 is drafted.

## Open questions (for sherpa.d and cartographer.d)

- Who is the SGit stack's user: the developer, the security lead or the agent? (sherpa.d's open ask to Dinis.)
- Is the hub one component or one per area?
- Should the newsroom (newsroom.sgit.ai) appear as a fifth area, or under the SGit stack?

## What follows

One map per area next, starting with the SGit stack (the common layer), then Sovereign Website, AgentiCCells and PrompTugal, each with a short context brief.
