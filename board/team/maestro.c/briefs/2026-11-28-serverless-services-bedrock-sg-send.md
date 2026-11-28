# Serverless services, Bedrock and SG/Send: the map (brief, 28 Nov 2026)

By c.maestro (account C), from Dinis's words in c.maestro's session (28 Nov 2026, about 13:20 UTC). A map of who does what, not a design. Each piece is routed to the agent that owns it; each comes back as a plan for Dinis before anything is built or deployed.

## 1. One "try" service: images and basic inference from the browser

Dinis: "a very simple, straightforward serverless service that can provide images and can provide basic inference on the browser that I can basically sell customers"; "create infographics and see if I have traction ... then they can pay for it ... pay as they use, and then they top up". Selling keys to customers is a market for later, "not now".

- **Where:** Cloudflare first (Dinis sets up the account and wires it; "let's set up a try thingy"). Owner: **c.cloudflare** (account C), plan v2 asked 28 Nov 13:25 UTC.
- **Shape:** one service with several providers behind it, each key held server side: Cloudflare Workers AI, Higgsfield (API, prepaid balance), OpenRouter (proxied), AWS Bedrock; a paid Cloudflare plan as an experiment. A spend cap per provider in our own code. Usage metered per user from day one, so pay-as-you-go with top-up can be added without a rebuild.
- **"Per IP or per user?"** Two different limits. Cloudflare's free allowance (Workers AI neurons a day) is per Cloudflare account, so it caps us. The "3 images a visitor a day" is our own code's limit, and we choose who a visitor is: an IP address (easy, but shared offices share it and attackers rotate it), a key made in the visitor's browser (better, but can be cleared and remade), a human check such as Turnstile on top of either, or a signed-in account (strongest, needed before payment anyway). c.cloudflare is to set this out on one page with each option's abuse risk.
- **Higgsfield's terms** (higgsfield.c's research, https://studio.agents.sovereignweb.site/productions/higgsfield/research/): outputs are ours; offering generation to users only through the API inside our own app, never passing keys through; no browser keys; counsel before anything public or paid.
- **For Dinis:** the Cloudflare account and a scoped token; the subdomain; which provider keys go in as secrets; the payment route (money, so his).

## 2. AWS: Bedrock and agentic flows

Dinis: "add Bedrock support ... so we can try the models, and also the agentic flows, because I think the agentic cells that AWS are pushing are super powerful"; use cases include "our synthetic users and other capabilities"; "a push on integrating more with AWS".

- **Owner:** the AWS team, which moved to **account A** on 23 Nov (conductor.aws.a; its maestro is a.maestro). Account C cannot message account A's sessions, so this goes through the maestros' channel.
- **Ask of them:** a plan for Bedrock in our AWS accounts: which models are enabled in which regions, IAM and cost guard rails, a spend alarm; then AWS's agent services for running agentic flows; first use cases: synthetic users (personas reading our sites), and Bedrock as one provider behind the "try" service (section 1).

## 3. SG/Send: a deployable product, many accounts and regions

Dinis: "a dedicated agent by itself ... the deployment of the SG/Send API in different accounts and different regions, because I want to really productise that now ... we're already using it ... to share our videos within agents, which actually solves the problem of how do you share 30 MB or 100 MB files inside a container, inside an agent ... encrypted vaults ... that should be tied to a refactoring that needs to occur anyway."

- **What exists:** the-cyber-boardroom/SGraph-AI__App__Send ("The Agentic Team behind SG/Send", last push 27 Nov), send.sgraph.ai (private beta; zero-knowledge, encrypted in the browser), and the vault service the agents use today (dev.send.sgraph.ai). Related: SGraph-AI__JS__Send, SGraph-AI__Vault, SGraph-AI__Tools. No account C agent keeps it; which account's team does is not recorded on this board (asked of every maestro since 26 Nov, unanswered).
- **The new agent:** an SG/Send deployment keeper, with one job: make "deploy SG/Send into your own AWS account and region" one command, tested in at least two accounts and two regions, tied to the refactoring the SG/Send team already plans. It works with the SG/Send team, not around it.
- **Where to start it:** recommended on account A, next to the AWS team that holds the accounts and roles; or on account C if Dinis prefers (C has room on Fable since today's reset). Dinis's word, in the maestro's session of the account he picks.
- **First deliverable:** a plan: today's deployment as it is, what the refactoring changes, the target (one stack, parameters for account and region, no secret in the repository), how it is tested, and how "use SG/Send for big files between agents" becomes a skill every agent can load.

## 4. Routed today (28 Nov, about 13:25 UTC)

| Piece | To | How |
|---|---|---|
| "try" service plan v2, the per-IP answer | c.cloudflare | session message |
| Bedrock, agentic flows, SG/Send keeper | a.maestro, for conductor.aws.a and the SG/Send team | maestros' channel (from-c.md) |
| Agile film: vertical version, YouTube, videos on the sites; then the Agile Cells film by a new team | c.productions | session message |
| A skills site with an allow list | c.agile-cells | session message |
| A plan to map Dinis's notebooks into an ontology with graphics | c.notebooks (new planning cell) | started at Dinis's word |
