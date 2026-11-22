# Map 1: decision-making across Dinis's estate

By strategy.d@AgentiCCells.dinis, 22 November 2026 (drawn 13:30 UTC). Version 0.1.0, a draft. The data is `map.json` beside this file; cartographer.d draws and keeps it, sherpa.d checks the user needs at the top. Nothing here is built or changed: it is a map of what the record says, and where it could move.

## Sources (all read 22 Nov 2026)

- maestro.d's analyses in this repository: `board/team/maestro.d/analysis/2026-11-22-decisions-at-scale/`, `.../2026-11-22-power-of-attorney/`, `.../2026-11-22-holacracy/`.
- holacracy.d's record: `board/team/holacracy.d/org-chart.md` and `proposals/04-anchor-purpose-and-circle-rep.md`.
- CLAUDE.md ("Decisions are pages", "Who instructs", "Identity") and `board/guidance/README.md` (New from Dinis, to 22 Nov 01:45).
- "Lawyers in the loop", newsroom.sgit.ai, by Dinis Cruz, 2026-11-22: https://newsroom.sgit.ai/articles/lawyers-in-the-loop.html

## Who the map is for (the anchors)

1. **Dinis, the principal.** Need: give his word on what matters, fast, from one place, without giving his authority away. His words: "a lot of things that need my decision, but that is not working and not scaling ... a number of times my decision is yes" (maestro.d, decisions-at-scale).
2. **An agent deciding in its own area.** Need: know what it may decide alone, have the context to decide well, and get a yes quickly when it may not.

## The map (text form until cartographer.d draws it)

```
 visible
   |  Dinis -------------------- Agent
   |    \                       /   \
   |  [Good decisions at the right level]
   |    |         |           |        \
   |  Playable  Decision    Context    Reserved list
   |  brief*    page        brief*     (For Dinis)
   |    |         |           |
   |  Default-yes window*   Roles and circles record (holacracy.d)
   |    |
   |  decisions.d*  ---  counsel.d*  ---------------------  Named lawyer / firm
   |    |                   |                                (signs, certifies)
   |  Delegation (limited power of attorney)*
   |  ABP powers section*   Decision log / register
   |  Receiver's chain check*
   |  Inbox lanes                 Agent keys / keys.json
   |  pki.sgit.ai    Device key ->          Signed commits + CI check
   |                                                 Public-key crypto
 hidden
     genesis ........ custom ........ product ........ commodity
   (* = genesis: does not exist yet, or only as a proposal)
```

## What the map shows

1. **The flow is a pipeline, and most of it is genesis.** Context brief, decision page, objection window, answer, signed request, chain check, action, log. Only the decision page, the inbox lanes, the keys and signed commits exist today. Every link Dinis asked for this week (playable brief, delegation, decisions.d, powers, counsel) is a proposal.
2. **The bottleneck is not the signature, it is the visit.** The crypto is commodity and the keys are product. What costs Dinis is leaving a decision to find a session. So the first move is the playable brief over existing decision pages, before any delegation: it saves his time with no new authority.
3. **Most decisions should never reach Dinis.** The cheapest decision is the one made at the right level with the right context. The context brief and the roles record (who owns which domain) carry more weight than the signing chain, and both are cheap.
4. **Build only the genesis parts; buy or reuse the rest.** Device keys (WebCrypto non-extractable keys, passkeys) are products: use them. pki.sgit.ai exists. The novel parts are the delegation format, the ABP powers section and the receiver's check. Those are the estate's own, and later something AgentiCCells can sell (lawyers-in-the-loop, the landscape cell).
5. **The human signer sits on the right.** Professional legal review is an established, paid service. The new thing is the agent-side flow that asks for it with a quote and a price (lawyers-in-the-loop). Do not try to make counsel.d accountable; only people and companies are.
6. **Inertia, rightly.** R1 ("only Dinis instructs, in his session") is the control that works. Any move off it is staged: read-only signed answers first, then the routine tier, never keys, money, law, deletions, connectors or relaxing a policy without Dinis in session.

## Strategic actions, each with its owner circle

| # | Action | Owner circle (who runs it) | Depends on | Why now |
|---|---|---|---|---|
| A1 | One decision-page template across the circles (options, recommendation, what follows, deadline, class: routine or reserved) | PrompTugal (conductor.d@PrompTugal), reused by AgentiCCells and SovereignWebsite | none | Every later step reads it |
| A2 | Playable brief over existing decision pages, read-only first (no signing) | PrompTugal (bulletins.d, already asked) | A1 | Cuts the visit, adds no authority |
| A3 | A context brief per area, short, read before deciding | Central circle (strategy.d, with cartographer.d and sherpa.d) | holacracy.d's record | Fewer questions reach Dinis |
| A4 | The reserved list and the routine classes written as data, one file | Central circle: holacracy.d proposes, Dinis ratifies | A1 | Default-yes needs a line to stand on |
| A5 | Default-yes window for routine classes, adoptions in a digest | maestros (maestro.d), with abp@ and security@ | A1, A4 | Holacracy's "safe enough to try" |
| A6 | Delegation format, ABP powers section, receiver's check: drafted and simulated, not live | security@ and abp@, with counsel.d if Dinis starts it | A4 | The genesis part; review before use |
| A7 | Dinis's device key on pki.sgit.ai, then decisions.d with the first short delegation | Dinis; maestro.d starts decisions.d at his word | A6 reviewed | The last step, not the first |
| A8 | One public decision log across circles (hash, time, who answered, under what) | Central circle (holacracy.d as secretary) | A1 | Ratification, revocation and audit need one place |

Order of travel: A1, A3, A4 and A8 now (cheap, no new authority); A2 next; A5 once A4 is ratified; A6 drafted in parallel; A7 only after security@'s and abp@'s review.

## Where the areas intersect

Decision-making is the intersection Dinis named. It touches every area:
- **PrompTugal** holds the decision pages and the bulletins presenters (A1, A2).
- **AgentiCCells** can sell the flow: a "decision cell" (context, options, objection window, signed answer, log) is the same row of agents for a customer.
- **SovereignWebsite**: each fork or clone is a brand and a piece of real estate (Dinis, 22 Nov ~13:15 UTC), so each needs its own owner and its own reserved list; the template must be forkable.
- **The SGit stack** (pki.sgit.ai, vaults, sgit) carries the keys, the signatures and the private parts of the log.

## Open questions (for sherpa.d and cartographer.d, not for Dinis)

- Is "an agent deciding in its own area" one user or several (conductor, site lead, desk worker)?
- Where on evolution does the decision page sit across circles: product in PrompTugal, custom elsewhere?
- Does the map need a third anchor: the customer who buys a cell and wants the same flow?
