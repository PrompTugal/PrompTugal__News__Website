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

## Addendum (16:25 UTC): your keys, your UI, on any platform; and where the line is

Dinis, in this session (~16:20 UTC), verbatim extracts: "I want to create a new UI for their stuff. Like AWS ... It freaking sucks ... I want to go to these websites and use the keys that I provided. Use my PKI to put a key"; "I can safely store in my store, encrypted, even with my passkey, an AWS key ... Or a token that I receive from AWS"; "I want my team to start leveraging this data"; "anything that can be accessed via course [CORS], anything that can be accessed via logged in, then it's fair game ... An interesting example is LinkedIn data".

**What the platforms allow from a browser (checked 22 Nov 2026, 16:22 UTC: a CORS preflight from a foreign origin, no credentials):**

| Endpoint | access-control-allow-origin |
|---|---|
| AWS Cost Explorer (ce.us-east-1.amazonaws.com) | * |
| AWS Budgets (budgets.amazonaws.com) | * |
| AWS STS (sts.amazonaws.com) | * |
| AWS Cognito Identity (eu-west-2) | * |
| AWS Lambda (eu-west-2) | * |
| AWS EC2 (eu-west-2) | * |
| AWS S3 service endpoint (eu-west-2) | none: S3 is per bucket; each bucket needs its own CORS rule |
| Anthropic API (api.anthropic.com/v1/messages) | * (the browser request also needs the header anthropic-dangerous-direct-browser-access) |
| OpenRouter (openrouter.ai/api/v1/chat/completions) | * |

So a page can hold the user's own credentials and call these APIs directly; nothing passes through our hosts.

**How the credentials get there (best first):**
1. **Short-lived, scoped tokens.** For AWS: Cognito identity pools, or STS AssumeRoleWithWebIdentity from a sign-in, give temporary credentials limited by an IAM role the owner writes (read budgets, list services, start only named things). The role is the mandate, in AWS's own terms.
2. **A key kept in the user's vault, encrypted on their device**, opened with their passkey (the WebAuthn PRF extension can derive an encryption key from a passkey on recent browsers) or their PKI key. Only the browser ever sees it in the clear.
3. Never a long-lived key on our hosts.

**Where the line is (three tiers; for rights@ and counsel.d to check, not legal advice):**
- **Green: official APIs the platform opens to browsers**, with the user's own key or token, within the platform's terms (AWS, OpenRouter, Anthropic, Wikipedia above).
- **Green: the user's own data export**, loaded into the page on their device: LinkedIn's "download your data" archive, Google Takeout and the like. The platform hands the data to the user; we only give it a better view.
- **Red until checked: riding a logged-in session the platform does not open to other sites.** The browser's same-origin rule stops a page from reading another site's logged-in data; getting round it means an extension or scraping with the user's cookies. Many platforms' terms forbid automated access (LinkedIn's among them, to check), computer-misuse laws differ by country, and the data often holds other people's personal data (contacts), which brings data-protection law in. Being logged in does not make it fair game. The ABP should deny this tier by default: that refusal is itself a showcase.

**Strategic consequence:** the better-UI sites stand on tiers 1 and 2, which are open, legal and repeatable. AWS joins the list (budgets, services, an S3 browser with a CORS rule set once per bucket). Each new UI adds reusable parts (key vault, token flow, cost views), so the next one is cheaper: the same volume argument as above.

## Addendum (23 Nov, 05:55 UTC): what the platform-sites landscape changes

From landscape.d's `board/team/landscape.d/landscapes/platform-sites/` (34 players, 86 facts, findings ps-g1 to ps-g7; readings of public pages on 23 Nov, absence on a page is not proof of absence).

1. **The browser-direct model is rare, which is our gap** (ps-g6): the alternatives found are mostly agent layers and desktop apps for technical users; one browser-direct web client was read (RouterChat, for OpenRouter). "Your key stays in your browser, a better UI on your own account" has few precedents.
2. **Odoo: build the UI, not another agent layer** (ps-g1). The alternatives are MCP servers and modules for developers; none is a better interface for the person using Odoo. Our Odoo site leads with the UI and the plan-then-apply flow, not with "an MCP server".
3. **OpenRouter: a risk to settle before building** (ps-g2): its terms, as landscape.d read them, bar reselling or a competing service and leave third-party tools to their own terms. The OpenRouter site must be a free client on the user's own key, never a resale of access; rights@ or counsel.d reads the terms before launch. It stays first in the order (Dinis's word), but this check comes first within it.
4. **AWS: the gap is real** (ps-g3): S3 browsers and cost tools exist (desktop, self-hosted, AWS's own billing MCP server), and none read states it runs browser-direct on the user's own key. Approving any change to AWS stays Dinis's (CLAUDE.md); a read-only budgets and costs view comes first.
5. **Wikipedia: our rules match its terms** (ps-g4): CC BY-SA 4.0 with credit, a User-Agent that names us, names and logos only under its Trademark Policy, no implied endorsement.
6. **OWASP: licence unknown for the Top Ten** (ps-g5): the Cheat Sheet Series is CC BY-SA 4.0, with OWASP's note that its Markdown is not meant to be cited externally; the Top Ten page states no licence and the licensing page returned 404. Check with OWASP's licensing before building; until then OWASP moves behind Wikipedia.

Revised order: the OpenRouter agent (after its terms check), Odoo, AWS read-only, Wikipedia, then OWASP once its licence is known.
