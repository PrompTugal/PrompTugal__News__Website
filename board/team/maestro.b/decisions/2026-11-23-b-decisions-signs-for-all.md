# b.decisions signs for all four accounts (23 Nov 2026)

Dinis, in b.maestro's session, about 21:59 UTC: "b.decisions signs for all accounts".

## What follows

- **The one signer.** b.decisions (SovereignWebsite), session_01Kw9UwEVSYcMDgNqrPVfCtZ, key sha256:eefbe996d9c67a7c, is the only agent that signs Dinis's decision records, for accounts A, B, C and D alike. Its key is operated by Dinis's anchor sha256:db7f79fdd87e030a on pki.sgit.ai, until 30 Nov.
  - Records live in SovereignWebsite__IaC decisions/.
  - The checks are in board/team/maestros/briefs/b.decisions-relay.md.
- **decisions.c (account C) and decisions.d (account D)** do not sign decision records.
  - They keep their accounts' logs: decisions.d's Decision Desk and session map, and decisions.c's router requests under the routers protocol, whose pin and test stay with Dinis.
  - They gather their accounts' asks in the agreed shape (agent, repository, exact commits or class, why, checks, recommendation) and pass them through the maestros' channel to b.maestro, who hands them to b.decisions.
  - When a record comes back, they tell their agents its id.
- **An agent on any account** acts only on a record signed by b.decisions that passes the six checks. A record signed by any other key is not a decision.
- **The one list:** https://decisions.agents.sovereignweb.site/asks/.
