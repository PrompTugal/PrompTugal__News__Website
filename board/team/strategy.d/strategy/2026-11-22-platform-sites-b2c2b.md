# Strategy: platform sites, B to C to B, and going to market through partners

By strategy.d@AgentiCCells.dinis, 22 November 2026 (16:15 UTC), from Dinis's words in this session (about 15:55 and 16:15 UTC). A strategy to advise the circles; the conductors run the work and Dinis decides what is his. Nothing here is built.

## Dinis's words (extracts, verbatim)

> "we now are going to create better UIs for a lot of these platforms. And it's all about traffic ... making sure that we create something that is very useful for people."

> "we should be monitoring every single of these websites ... We should have an observability lane. There should be an agent here that draws the observability lane."

> "the strategy here is to create multiple of these websites that fundamentally shows the power of what we're doing, shows the power of the agent behavior policies, but also should be able to generate a lot of organic traffic ... credibility and ... reputation ... the volume matters ... Everybody can create websites ... but to create with a level of quality that we can, with a level of data, with a level of integration, with a level of attention to detail, and more importantly, with an agentic team behind it, we are one of the few ones who can do it. And that's what we're selling."

> "people understand that what we do is behavior policies ... they see them in action, so they go, wow, you guys control this stuff ... What they don't know is ... how am I going to use it today, how am I going to use it tomorrow ... that's what these websites are about."

> "I want to go to everybody, and I want to give them something they can use, something they can edit, something that they can actually experiment ... you do a B to C to B ... the B customer experiencing technology as a C customer ... not only I think they are marketing itself, they are how we are going to market with risk mandate."

> "I really want to go to market using partners ... this is not about replacing them ... get them to work like this, adopt this concept, allow these workflows, and let them maintain it ... we can start small ... as a subsection ... just consuming the data from there, so they can still use the WordPress website as a data store in the short term."

## The argument in five lines

1. **We have the hard part:** a message, a working architecture, behaviour policies that get better with use, workflows that get better with use.
2. **The gap is the first use.** People who see the policies are impressed but cannot picture using them today. Nothing in their hands says "start here".
3. **The move: platform sites.** A site built on a platform people already use (Odoo, OpenRouter, Wikipedia, OWASP; Gmail through the email cell is the precedent), useful on day one, editable, forkable, each with its agent team and policies visible, each watched through its own observability lane.
4. **Why we win:** volume at quality. Anyone can make one site; few can make many, each with real data, real integration and a governed agent team. The volume is the proof.
5. **B to C to B:** we hand each organisation we have contacted something it can use and edit. The business buyer first meets the product as a consumer would: it uses the site, edits it, tries to make an agent do what it should not, and watches the policy catch it. Then it buys. That is how RiskMandate goes to market.

## The map (Map 3, in short; data to follow in maps/ once cartographer.d's format is on dev)

Users: a platform's user (wants a better way to do a job on a platform they already use), a business buyer (wants confidence that agents can be controlled before buying), a partner (wants to keep their client and their fee with less effort), Dinis (wants traffic, credibility and reputation he can measure).

| Component | Visibility | Evolution | Note |
|---|---|---|---|
| A platform site (better UI on a known platform) | high | genesis to custom | the thing people touch |
| "Try to break it" policy demo | high | genesis | the moment a visitor sees ABP stop an action |
| Edit and fork (your own copy) | high | custom | the Sovereign Website promise in one click |
| Observability lane per site | medium | custom | exists for promptugal.news (obs.js, no IP, no cookie); not yet per platform site |
| Agent team and its ABP per site | medium | custom | exists across the estate |
| Site factory | low | custom, moving to product | Map 2's E3 |
| Platform APIs (Odoo JSON-2, OpenRouter, Wikimedia, OWASP's GitHub) | low | product | someone else's; we read them well |
| Browser-direct access (CORS, the user's own key) | low | product | checked 22 Nov 16:12 UTC: Wikipedia's Action API (origin=*) and REST feed, api.wikimedia.org and raw.githubusercontent.com (OWASP's pages) all answer with access-control-allow-origin: * |
| Outreach (email cell, drafts approved by a person) | medium | custom | exists in the email cell and spec-outreach-outbox.md; a person sends |

What the map says: the platform APIs and browser access are product, and the agent teams, policies and factory are ours and already custom. The only genesis parts are the sites themselves and the policy demo. So the cost of each new site falls with every site, which is the volume argument in Wardley terms.

## The first sites (requests in `../requests/`)

| Site | What it gives a visitor | What we already have | Source read |
|---|---|---|---|
| **Odoo** | how to run Odoo 19 with agents: start it in a session, read data through the JSON-2 API, two feeds (public, encrypted private), write back by plan-then-apply with a signed approval, the policy at every step | all of it, in the Algarve Evolution prototype: `scripts/odoo/RUN.md` and `setup-local.sh` (Odoo 19 Community nightly, Postgres, no Docker), `export-feeds.mjs` (JSON-2), `apply-plan.mjs` (the broker), `docs/v2/PLAN.md`, the 14-slide briefing deck | AgentiCCells/AgentiCCells__Site__Algarve-Evolution (a749130), read 22 Nov |
| **OpenRouter** | a better OpenRouter: your key in your browser only, the model explorer, exact cost per call, usage and spending, chat with files and audio, the agent with tools, the model compatibility matrix | the tools on tools.sgraph.ai: the openrouter dashboard, chat, llm-dev, model-compatibility, agentic, agent-with-tools; key stored in the browser, "Keys are NEVER sent to any *.sgraph.ai domain" | the-cyber-boardroom/SGraph-AI__Tools (a905a5c), read 22 Nov |
| **Wikipedia** (Dinis's idea, 16:15 UTC) | five designs of a homepage over live Wikipedia data: one familiar, four that show what it could look like | nothing yet; the APIs answer browsers (checked) | Wikipedia APIs, checked 22 Nov 16:12 UTC |
| **OWASP** | the same for OWASP's projects (Top Ten first): five designs over its own pages | nothing yet; its pages are markdown on GitHub, readable from a browser | raw.githubusercontent.com, checked 22 Nov |

Rules for every platform site (from the record, for the site owners to adopt):
- Its own repository, owner and ABP; seeded by the factory.
- **Unofficial and labelled so.** Not the platform's logo or a page that could be taken for the platform's own (Wikipedia, Odoo, OpenRouter and OWASP are their owners' marks). The look-alike design is "inspired by", with an "unofficial" line. rights@ or counsel.d checks each platform's trademark and content terms before launch; I have not read them.
- Content credited under its licence (Wikipedia's text is CC BY-SA; check each), linked back on every item.
- Polite to the platform: a User-Agent that names us, caching, rate limits respected.
- The user's own key stays in the user's browser (the tools' rule), never on our hosts.
- An observability lane from day one: what is read, never who (no IP, no cookie).
- Nothing private: the Algarve Evolution prototype holds simulated private records and real organisation names; only public material moves to a public site.

## Observability across all of them

Every platform site gets its own lane, drained into one report: visits and reads per site and page, where traffic comes from (referrer only), what is used, which policy demos are tried and caught. The lane and the drain exist for promptugal.news (observability@, account A, every 3 hours). Dinis asked for an agent that draws the lanes; that is a session to start, which only Dinis or a conductor in its own domain can do (ABP R4). Proposed: observability.d on account D, in the central circle or under sites.d, from observability@'s debriefs.

## Partners: maintain, do not replace

What sovereignwebsite.ai says today (https://sovereignwebsite.ai/partners.html, read 22 Nov 2026): "Partners sell. We build."; "The way to market is not to compete with the people who already sell websites, workflows and IT to small businesses."; marked "A first draft. No partner has signed yet"; subscriptions are the partner's ("no part and no share for us").

The position Dinis described, for the partner page and for outreach:
- **To the customer:** do not replace your maintainer. Ask them to work this way.
- **To the maintainer (a WordPress agency, for instance):** keep your client and your monthly fee, sometimes more. Your problem is that clients rarely change their site, so there is little you can add. With this workflow you maintain an owned site with an agent team; the workflow and the code are free and open, and we need not be involved.
- **Start small, never a big switch:**
  1. a subsection of the existing site, built this way;
  2. reading data from the existing WordPress (it stays the data store for now);
  3. then more pages, as the client sees value;
  4. the move-out path is always there (landscape.d's first finding: no European hosted builder it read documents one).
- **What we gain:** reach through people who already hold the clients; every partner site is one more in the volume.

Who owns it: the partner page is SovereignWebsite's (conductor.d, SovereignWebsite); outreach drafts are the email cell's, and a person sends. The first customer and its maintainer are a private prospect: they are not named on the board.

## Strategic actions, each with its owner circle

| # | Action | Owner circle | Why now |
|---|---|---|---|
| P1 | Odoo site from the Algarve Evolution material, public parts only | SovereignWebsite (sites.d), with AgentiCCells (the prototype's owner) | the material exists and is unpublished |
| P2 | OpenRouter site by porting the tools.sgraph.ai OpenRouter tools and the agent | SovereignWebsite (sites.d) | "amazing ... kind of buried" (Dinis) |
| P3 | Wikipedia and OWASP five-design sites | SovereignWebsite (sites.d, design.d for the five designs) | traffic; data is open and browser-readable |
| P4 | A "try to break it" policy demo on every platform site | abp@ writes the policy, the site owner shows it | the B to C to B moment |
| P5 | One observability lane per site and an agent who draws them | Dinis starts it; observability@'s pattern | "we really know who's visiting what" |
| P6 | Partner position on the partner page: maintain, do not replace; start small | SovereignWebsite (conductor.d) | the go-to-market Dinis wants |
| P7 | Outreach: one usable site per organisation contacted, drafted by the email cell, sent by a person | AgentiCCells (email cell) | "give them something they can use" |
| P8 | A landscape per platform (who already offers a better UI on it) | central (landscape.d) | find the gap before building |

Order: P1 and P2 first (material exists), P5 alongside (measure from day one), P3 next, P4 on each as it ships, P6 and P7 once two sites are live, P8 before P3.
