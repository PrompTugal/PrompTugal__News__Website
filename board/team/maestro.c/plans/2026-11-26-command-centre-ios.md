# The Command Centre: seeing the whole company on a phone

c.maestro (account-c), 26 Nov 2026, at Dinis's word in c.maestro's session: "we really need a much better UX and environment, not just me, anybody making decisions, to understand the complexity of this ... since we have access to iOS and we can easily push new versions, can you create a plan and let's have a session about using one of our iOS applications? And I'm thinking the SGit-AI [app] ... because a lot of these will be based on top of Vaults."

## The problem

Five or more accounts (cl-1 to cl-6), each with a maestro, dozens of agents, scheduled wakes, request files, sealed inboxes and decision records. Today the only way to see it is to read `from-<a|b|c|d>.md`, ask a maestro, or open sessions one by one. Dinis is the bottleneck for every "yes", and nobody else can see the whole picture. Every maestro brief ends with a list of "waiting on you" that is retyped, scattered and goes stale.

## What the app answers, in order

1. **What needs me now?** One list of every decision waiting on a person, across all accounts: what, who asks, why, the recommendation, the link; answer with one tap.
2. **Is anything on fire?** Accounts near their limits, agents blocked or errored, gates red, deploys stuck.
3. **What happened?** The wire: every cross-agent message, decision and release, newest first, filterable by account, agent, site.
4. **Who is who?** Accounts, maestros, agents, their sites and repositories, their keys, their state, as a map.

## Built on vaults, not on sessions

Everything the app shows already exists or nearly exists as data:

| Feed | Source today | Shape |
|---|---|---|
| Accounts | Site__Agent__Maestro `site/accounts/accounts.json` | id (cl-N), maestro, room, status |
| Agents' state | `now-<a>.jsonl` (A, D), `status.json` per agent | state, working_on, stuck_on, waiting_on, as_of |
| Asks for a person | maestros' "waiting on" lines, request files `site/decisions/requests/*.json` | one record per ask |
| Decisions | Site__Agent__Decisions `site/records/` (signed) | record, signer, scope |
| The wire | `from-*.md`, the maestros-channel vault, sealed inbox metadata | one event per line |
| Owner view | a.ios's `owner.feed/v1` (VoiceDebrief) | agents, sites, briefs, decisions |

The plan: each maestro publishes one **owner feed** per account (owner.feed/v1, extended with `asks` and `capacity`) into a **sgit vault** that the app reads with a read key: public parts in clear, private parts (people, prospects, connectors) sealed to the reader's key. The SGit-AI app already holds vault keys and reads vaults, so it becomes the reader; no new server.

Answers go the other way: the app signs "yes / no / later + note" with the device's key (passkey where possible) and appends it to the asker's lane; b.decisions (and each account's decisions agent) turns a signed answer into a record. Nothing in the app starts, stops or steers an agent by itself: it answers asks.

## Slices (each a TestFlight build Dinis can try)

1. **Read-only board (1 to 2 days).** Accounts, agents by state, the wire, from public JSON (accounts.json, now-*.jsonl, from-*.md parsed). Maestros start writing `now-<acct>.jsonl` every wake (A and D do; B and C to start).
2. **The asks inbox (2 to 3 days).** A shared `asks.jsonl` schema; every maestro writes its "waiting on Dinis" items there instead of chat; the app shows them grouped by urgency with the recommendation first.
3. **Answer with a tap (3 to 5 days).** Signed answers from the device key into the asker's lane; b.decisions records them. security@ reviews before it ships.
4. **Vault-backed private view (next week).** Owner feed in a vault, sealed parts readable only by named people; other decision makers (Angela and the team) get their own read keys and see their part.

## Who does what

- **App:** the SGit-AI iOS app's team (an iOS conductor on one account, workers as sub-agents); c.ios (PrompTugal app, account C) shares the shell and TestFlight pipeline.
- **Feeds:** each maestro (a, b, c, d, f) writes `now` and `asks` each wake; c.maestro drafts the schemas.
- **Answers and records:** b.decisions with each account's decisions agent; b.security reviews slice 3.
- **Design:** one designer pass on the board and the asks inbox before slice 2.

## Open for Dinis

- Which repository is the SGit-AI iOS app, and which account builds it (C has room this week)?
- Slice 3: is a tap on a phone, signed by the device key, enough for a "yes" on a one-way door, or only for routine asks?
- Who else gets a read key in slice 4?
