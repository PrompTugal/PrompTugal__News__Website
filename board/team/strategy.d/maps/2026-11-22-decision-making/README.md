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

## v0.2.0 (16:50 UTC): the decision-making framework as a product

Dinis, in maestro.d's session (~16:30 UTC, relayed to me, verbatim): "from a decision-making point of view, this is one of the most important things we need to do, because we need to provide context to the person making decisions. And that's one of the things I want to sell, because I want to sell the decision-making framework, which I think now we have the ability to do that."

The working example is the Decision Desk (a private claude.ai page, relayed, not read by me) with a triage of four lanes: only you and critical; quick, confident, reversible yeses; your judgement; can wait. Each decision carries who may decide, the recommendation's confidence, timing, whether it is critical, and what it blocks.

So the map gains a third user and a product line:

| Part of the framework | Visibility | Evolution | Exists? |
|---|---|---|---|
| **The framework, sold** (to a buyer who decides too much, too slowly) | 0.98 | 0.05 | proposal |
| Triage into four lanes, with who may decide, confidence, timing, critical, blocks | 0.90 | 0.15 | working example (the Desk) |
| The Desk (one screen, every decision waiting) | 0.88 | 0.15 | working example, private |
| Stories (playable decision briefs) | 0.86 | 0.10 | prototype asked of bulletins.d |
| Context brief per area | 0.70 | 0.12 | Brief 1 written |
| Default-yes window for the "quick, confident, reversible" lane | 0.62 | 0.20 | proposal |
| Signed answers | 0.50 | 0.10 | proposal |
| Power of attorney (limited, expiring delegation) | 0.45 | 0.08 | proposal |

What the map says now:
- The triage is the hinge: it decides which lane goes to signed answers, which to default-yes, and which must wait for the person. Its lanes map onto Map 1's components: "quick confident reversible" is the default-yes window; "only you and critical" is the reserved list; "your judgement" is the playable brief; "can wait" is the digest.
- Of the parts, only the triage and the Desk run today, and both privately. The product is genesis: first make the framework public on a Sovereign Website (the first customer) as a page anyone can try with their own decisions, the same B to C to B route as the platform sites.
- Added strategic action **A9**: a public, forkable Decision Desk on a Sovereign Website, with the four lanes and a sample set of decisions (owner circle: SovereignWebsite with the central circle; studio.d for the stories).

## v0.2.1 (17:00 UTC): thinking in a loop

Dinis, in maestro.d's session (~16:45 UTC; relayed, recorded in `board/team/helm.d/direction.md`): "This is not about human in a loop, it's about thinking in a loop". People should codify their decision-making workflow and how they think, and the framework is something to sell.

What it changes on the map:
- **A new component at the heart of the product: codified thinking** (a person's decision workflow written down as data: what they look at, in what order, which lane a kind of decision goes to, what makes them say yes). Visibility 0.80, evolution 0.05: genesis.
- **The triage, default-yes, signed answers and the power of attorney all depend on it.** A delegation is only safe when the attorney follows the principal's written way of thinking; a default-yes window is only safe when the class of decision is written down. So codified thinking sits under the triage and over the signing chain.
- **The product's message moves** from "a human approves each step" to "your thinking runs in the loop": the agents apply the person's codified workflow, and the person refines the workflow, not each decision.
- **Added action A10:** codify Dinis's own decision workflow first, from the Desk's four lanes and his answers so far, as the first worked example (owner circle: central, with decisions.d and sherpa.d; counsel.d where it touches the power of attorney).

## v0.2.2 (23 Nov, 05:55 UTC): the decision-making landscape

From landscape.d's `board/team/landscape.d/landscapes/decision-making/` (20 players, 70 facts, dm-g1 to dm-g7; readings of public pages, absence is not proof):
- **decision-log and chain-check:** decision logs (ADR, MADR, Log4brains) rest on git history; none read describes signatures (dm-g1). Collaborative tools (Loomio, Decidim, CONSUL, AGPL) serve groups voting, with no signatures described (dm-g2). Signed, checkable decisions stay a gap.
- **default-yes and playable-brief:** for agents, approval is a mechanism, not a record: LangGraph's interrupt waits indefinitely if nobody answers, and no page read describes a default when nobody answers, or a signed approval (dm-g4). Dinis's "tell 'nobody looked' apart from 'looked and found nothing wrong'" is not in the field read.
- **codified-thinking:** the codified layer exists as standards and engines (DMN, Drools, Camunda, OPA, Cedar; dm-g5). Do not build an engine: write codified thinking so it can run on one (OPA or Cedar first, both Apache 2.0) and keep our part, the person's own workflow and the context around each decision, as the product.
- **framework:** enterprise decision-intelligence tools show no price (dm-g3); Holacracy and Sociocracy 3.0's consent are CC BY-SA 4.0 and reusable with credit, RAPID is proprietary (dm-g6).

What it moves: codified-thinking keeps its place (genesis) but now links to a commodity layer (policy engines, evolution 0.75); decision-log moves no further than custom until signatures exist; the combination (codified thinking, triage, default-yes that knows silence from approval, signed answers) is what nobody read offers.
