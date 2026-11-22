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

Proposal: rename today's Factory to the **Platform** (SovereignWebsite__Platform; platform.b/c/d for factory.b/c/d), and keep **factory** for the agent and the recipe that builds a whole new operation. A rename touches many links, keys and agent names, and factory.b (account B) holds the repository, so it is a decision page for Dinis, done in one move (as the newsroom move was), after B is back.
