# Routers: one per account, sharing vaults, no single router (draft design, maestro.c, 22 November 2026)

From Dinis's words in maestro.c's session, about 17:45 UTC 22 Nov (voice memo, summarised faithfully; not yet a decision): no single router; a distributed, fail-safe set of routers, one on every account (and every other platform that can act), swapping messages through shared vaults, so that version control gives determinism and shows at once if someone overrides. More compute arrives tomorrow, and seven more accounts (standard, premium if needed) are coming online: each needs a router he can send tasks to, so every account's tokens get used, all under an Agent Behaviour Policy. Also: is what we call the Factory really a factory?

This is a draft for Dinis to correct. Nothing here is built.

## The pieces

- **One router per account**, named `router.<account>` (router.a, router.b, router.c, router.d, and the seven new ones). Peers: none is the master. With the maestro, it is the first agent on any new account.
- **Two shared vaults for the routers**, besides each agent's own:
  - the **comms vault**: router-to-router messages (append, signed by the sender, sealed where needed);
  - the **task ledger vault**: every request and who holds it. Version control is the arbiter: a claim is a commit on the latest version; if someone else committed first, the push fails, the router pulls and sees who won. No two owners, no silent override.
- **Policy at the door (ABP):** who may ask (Dinis, the maestros, the conductors; others through their conductor), what must come with a request (a budget, the model class, the repository, a deadline), and what a router may start on its account.

## The life of a task

1. A conductor (or maestro, or Dinis) writes a **request** to the task ledger: what, budget, model class, who asked, signed.
2. Routers see it, by a nudge on the comms vault or at their scheduled wake (fine either way).
3. A router with **headroom** on its account (its own rate_limit_info, the accountant's thresholds) **claims** it by writing to the ledger. That commit is the moment of ownership.
4. It starts or wakes the agent on its account; from then on, anyone talks to that agent directly (its inbox, its repository). The ledger keeps the state.
5. The owner writes **done** (with what was spent) or **released** (back to the pool).

## Fail-safe

- A claim is a **lease**: it carries an expiry and is renewed at each wake. A router that dies or whose account hits its limit stops renewing; after the expiry any other router may take the task. No task stays stuck on a dead account.
- A router never claims work its account cannot carry: the accountant's guard is the claim rule, which is how no account is ever maxed out again.
- If the ledger vault is unreachable, routers keep working what they hold and claim nothing new.

## What each platform can do (to map)

| Platform | Start a session from a session | Wake on a schedule | Message another session | So the router there is |
|---|---|---|---|---|
| Claude Code (cloud), each account | yes (create_session) | yes (scheduled tasks) | same account only (send_message) | full: claims and starts agents itself |
| Claude Code across accounts | no | n/a | no: only through repositories and vaults | hence the shared vaults |
| ChatGPT and others | not known; maybe sub-agents inside one session | to check | to check | maybe sub-agents only, or manual: a router that writes the start prompt and Dinis pastes it |
| OpenRouter, Mistral, Qwen (APIs) | n/a: they run jobs, not agents | via a caller | n/a | workers a router sends payloads to, within a budget |

## Open questions for Dinis

1. Maestro and router on one account: two agents, or one agent with both roles on the small accounts?
2. Who may ask a router: conductors only at first, or any agent with a budget?
3. Where the two vaults live and who issues their keys (the maestros' vault pattern, board/team/maestros/vault/).
4. The lease length (one wake? two hours?).
5. First routers: router.c here now, the others as each account starts?

## The Factory's name (maestro.c's view)

What the SovereignWebsite repository called the Factory does today is infrastructure as code and a pipeline: organisation, DNS, repositories, policy, keys, CI. That is a platform, not a factory. A factory is the whole of what we have built here: a set of agents (router, maestro, conductors, site agents), vaults, policies and the platform, that can stand up another of itself. So for a customer who says "set one of these up for me", the first agent in is the factory agent, and what it builds is a factory like ours, spread over several sessions and accounts.

Proposal (first draft, 19:10 UTC): rename it the Platform. Superseded by Dinis's word below.

## Dinis's word (about 19:20 UTC, maestro.c's session)

"I think it should be called IaC (for Infrastructure as Code), and we should split it per target. AWS, GitHub, {next one we add}."

So today's Factory becomes IaC, one repository per target, for example:
- SovereignWebsite__IaC__GitHub: the organisation, repositories, rulesets, team access, external collaborators, the org-apply workflow;
- SovereignWebsite__IaC__AWS: DNS (Route 53) and anything else on AWS, the DNS-apply workflow;
- the next target gets its own when it is added.

What the Factory holds that is not infrastructure for a target (policy/abp.json and its checks, team/keys.json, requests/, seed/, the board) needs a home of its own; to settle in the decision page (maestro.c's view: keys and policy in one repository every IaC repository reads, requests and seed with the factory agent, which keeps the name "factory" for the agent and recipe that builds a whole new operation). Agent names follow the targets (iac.github, iac.aws, with the account letter). A one-way door: a decision page, then one move, after account B is back.

## Dinis's word (about 19:30 UTC): IaC.<area>, one repository for now

"I agree, and what about splitting those into IaC.PKI for example. For now all going to the same repo."

So the parts that are not a target become areas of the same IaC, named the same way, and everything stays in one repository for now (the split into repositories comes later, area by area):
- IaC.GitHub: the organisation, repositories, rulesets, team access, external collaborators, org apply (today org/repos.json, org/external-collaborators.json, the org workflows)
- IaC.AWS: DNS on Route 53 and anything else on AWS, DNS apply (today org/dns.json and its workflow)
- IaC.PKI: the agents' public keys and the signature checks (today team/keys.json, build/check-signatures.mjs)
- IaC.Policy: the Agent Behaviour Policies and their checks (today policy/, build/abp.mjs)
- IaC.Requests and IaC.Seed: new-site requests and the starter files (today requests/, seed/), unless the factory agent takes them
- the next target or area gets its own IaC.<name>

Agents follow the areas: iac.github, iac.aws, iac.pki, with the account letter (iac.pki.c). Open for the decision page: the repository's new name (SovereignWebsite__IaC), whether the areas become folders now (one move) or only names on the board first, and whether requests and seed stay in IaC.

## Dinis's word (about 20:40 UTC): the names

"I think it should be renamed to Sovereign Website. Yes, correct. That's the website to rename to that. Although you should also have the Site__Agents__IaC. But this is the one that has the automation, correct."

Read by maestro.c as: the repository SovereignWebsite__Factory becomes **SovereignWebsite__IaC** (it holds the automation); the agents' home site Site__Agents__Factory becomes **Site__Agents__IaC**. factory.c (SovereignWebsite) writes the move plan and does the rename in one move at Dinis's go in its session, telling account D through conductor.c's channel.
