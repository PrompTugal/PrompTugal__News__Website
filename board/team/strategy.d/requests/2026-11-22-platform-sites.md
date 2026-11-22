# Request: four platform sites, and an observability agent

From strategy.d@AgentiCCells.dinis, 22 November 2026 (16:15 UTC), at Dinis's word in this session ("create and ask the creation of websites ... dedicated for these platforms"). Routed through helm.d (the circle's lead) to whoever creates sites on account D. The strategy behind it: `../strategy/2026-11-22-platform-sites-b2c2b.md`.

Repository names below follow the existing pattern (Site__Organisation__*, Site__Tool__*) and are proposals; domains are Dinis's.

## 1. Odoo: SovereignWebsite/Site__Platform__Odoo (proposed)
- **For:** anyone running Odoo who wants agents to work with it under control.
- **Content to port (public parts only)**, from AgentiCCells/AgentiCCells__Site__Algarve-Evolution (a749130):
  - running Odoo 19 Community inside a Claude Code session: `scripts/odoo/RUN.md`, `setup-local.sh` (nightly.odoo.com, Postgres, Python venv, no Docker; "restarting an existing install took 25 seconds");
  - reading data with the JSON-2 API: `scripts/odoo/export-feeds.mjs`, `sync-public.mjs`;
  - public and encrypted private feeds: `docs/v2/CONTRACT.md`, `src/feeds/README.md`;
  - writing back by plan-then-apply with a signed approval: `docs/v2/PLAN.md`, `scripts/odoo/apply-plan.mjs`, `src/hub/plan-policy.js`;
  - Odoo 19 against 20, hosting and plan caveats ("Odoo Online includes the external API only on custom plans"): `scripts/v2/odoo.mjs`;
  - the explained example: `src/decks/odoo-briefing/` (14 slides).
- **Leave behind:** the private feed, simulated private records, anything about Algarve Evolution not already public, and every secret (kept outside that repository, under the session's own folder).
- **Screenshots:** the record has none of Odoo itself; take them from the local Odoo.

## 2. OpenRouter: SovereignWebsite/Site__Platform__OpenRouter (proposed)
- **For:** anyone using OpenRouter who wants a better view of models, cost and usage, and a safe agent.
- **Content to port**, from the-cyber-boardroom/SGraph-AI__Tools (a905a5c), static HTML and Web Components, no build step:
  - the account dashboard: `tools/.../v0.1.23/en-gb/openrouter/` and `components/openrouter/*` (balance, models, usage, spending, generation cost, key manager, CSV log analysis);
  - the shared LLM layer: `components/llm/*` (key kept in the browser: "Keys are NEVER sent to any *.sgraph.ai domain");
  - chat, llm-dev, model-compatibility, agentic (tool loop with a Pyodide sandbox, human approval, a cost budget);
  - the agent: `tools/.../v0.1.58/en-gb/agent-with-tools/` (its local bridge is a separate service; show it, do not host it).
- **Note:** the tools' own debriefs say parts of the agent were not fully tested; the site says what is tested.

## 3. Wikipedia: SovereignWebsite/Site__Platform__Wikipedia (proposed)
- Five homepage designs over live data from Wikipedia's APIs (Action API with origin=*, REST feed: both answer browsers, checked 22 Nov 16:12 UTC): one familiar, four new.
- Unofficial, no Wikipedia logo, "inspired by"; every article credited (CC BY-SA) and linked; a User-Agent naming us; caching. rights@ or counsel.d checks Wikimedia's trademark policy before launch.

## 4. OWASP: SovereignWebsite/Site__Platform__OWASP (proposed)
- The same five-design treatment for OWASP's projects, Top Ten first, from its pages on GitHub (raw.githubusercontent.com answers browsers, checked 22 Nov). Unofficial, credited, licence checked first.

## Every site
- Its own owner and ABP, seeded by the factory; a "try to break it" policy demo; an observability lane from day one (no IP, no cookie); listed in the sites registry and on the hub.

## 5. An observability agent for these sites
- Dinis: "There should be an agent here that draws the observability lane." A new session is Dinis's (ABP R4). Proposed: observability.d on account D, starting from observability@'s debriefs (account A), one lane per site and one report.

## Update (16:30 UTC), from Dinis in my session

Verbatim: "Yes, let's start with the agent ... I'll check with the other agent what we are going to, how it's going there, because I think that's already running, and I think you need a case where you need to be given the vault via the conductor of how is going to work here."

As I read it (for Dinis to correct):
- **Order: the agent first.** The OpenRouter agent (agent-with-tools, from SGraph-AI__Tools) is the first piece to port, ahead of the rest of section 2 and the other sites.
- **AWS joins the list (yes to my question):**

## 6. AWS: SovereignWebsite/Site__Platform__AWS (proposed)
- A better UI on the owner's own AWS account: budgets and costs, services, start only named things, an S3 browser.
- Browser-direct: Cost Explorer, Budgets, STS, Cognito Identity, Lambda and EC2 allow any origin (CORS preflight checked 22 Nov 16:22 UTC); S3 needs a CORS rule per bucket.
- Credentials: short-lived tokens (Cognito identity pool or STS web identity) limited by an IAM role the owner writes; or a key in the owner's vault, encrypted on the device with a passkey or PKI key. Never a long-lived key on our hosts. Unofficial, not AWS's logo.
- **Dinis is checking with an agent already running** how this work stands; nothing here starts until he or that agent's conductor says so.
- **The vault:** strategy.d needs to be given access to the vault by its conductor, to see how keys and tokens are kept, before writing more of this design. Asked in status.json.
