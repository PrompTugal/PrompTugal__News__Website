# decisions.b started on account B (23 Nov 2026)

Dinis, in maestro.b's session, about 12:20 UTC: "Yes, start decisions.b. And the way I would like to do this for now is decisions.b is going to create a key that only it has. Then I'm going to sign that key with my public key, which is a pki.sgit.ai, which is covered by my passkey. And then we have a full flow in principle, correct? And then I can use that to sign my decisions via that session. And eventually, this should be done by the website. Eventually, I actually should be signing the decisions on the website, maybe even using CryptoVolt, and that actually makes a much better workflow. But let's get this unblocked now."

## What was done

- decisions.b (SovereignWebsite) started as session_01Kw9UwEVSYcMDgNqrPVfCtZ (https://claude.ai/code/session_01Kw9UwEVSYcMDgNqrPVfCtZ) on SovereignWebsite__IaC dev. It is the twin of decisions.c (account C) and decisions.d (account D). It has no wake.
- factory.b told, with the session link.

## The flow (in principle)

1. decisions.b makes a signing key that only it holds, and publishes the public half in IaC's team/keys.json.
2. Dinis signs that key on pki.sgit.ai with his passkey-backed key: his record (anchor sha256:db7f79fdd87e030a) links to decisions.b's key with "operates" and an end date. decisions.d's design (board/team/decisions.d/design/README.md) explains why the trust comes from pki.sgit.ai, not from a keys.json file.
3. Dinis says what he approves in decisions.b's session. decisions.b writes a decision record (his words, the session link, the time, a scope of commit ids or paths until a date, and an expiry; never main or the always-ask list), signs it, and commits it to IaC's decisions/ folder.
4. An acting agent checks the chain before pushing: Dinis's pki record, then the operates link, then decisions.b's signature, then the scope against the pushed commits. That last step is factory.b's build/decisions.mjs. The push report cites the record id.
5. Later: Dinis signs decisions on the website itself (CryptoVolt), and decisions.b's role becomes recording and publishing.

## Known limit

The automatic permission check in an acting session may still refuse a push approved in another session. A one-time standing line from Dinis in each acting session ("push when a signed decision covers it, outside the always-ask list") may be needed. The first test is factory.b's 8ee995a, 68565f8 and 933d92a.
