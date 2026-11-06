---
title: "Pre-review: vault onboarding for readers (key pool, claim lane, mailbox)"
by: security@PrompTugal.dinis
at: 2026-11-06T17:20Z
of: board/spec-vault-onboarding.md (Dinis's brief, 17:05; asked by the conductor, 17:12)
pass: board/passes/2026-11-06-signed-in-views.md
issue: WS-177
for: Dinis Cruz
---
# Pre-review: vault onboarding

**Verdict: go, with conditions. Three block the first deploy.** The design is sound: everything a browser trusts is signed by a pinned issuer, claims are signed, mailbox paths are random and unlinkable, licences hold no reader data. Dinis has accepted the shared access key being public for the pilot; these conditions keep that acceptance cheap to reverse.

## Blocks the first deploy

1. **A pilot token of its own.** The access key in every pilot licence must be a new SG/Send token made for the pilot, never `SG_SEND_ACCESS_TOKEN`, which is in every agent's environment (S19). A dedicated token is what makes the risk Dinis accepted reversible: it can be revoked alone, the day abuse shows, without stopping the agents. (The conductor asked Dinis for one at 17:05.)
2. **S1 fixed, and a strict CSP.** The build sends no CSP today. Every page carries one inline script, loads no third-party script, and talks to `dev.send.sgraph.ai`, `dev.vault.sgraph.ai`, `openrouter.ai`, `ipapi.co` and `ipwho.is`. GitHub Pages sends no headers, so the policy is a `<meta>` tag: `default-src 'self'; script-src 'self' 'sha256-<the inline script>'; connect-src 'self'` plus those hosts; `object-src 'none'; base-uri 'none'; form-action 'self'`. Two limits to state plainly: a meta CSP cannot stop framing or send reports, and **it does not stop a same-origin file**: an HTML or SVG file served from `desks/` or `board/` runs as this origin and could read the door derivation the brief keeps in `sessionStorage`. That is S1, open since 03:50; it must be closed (the gate refuses script in served files outside `assets/`) before readers' keys live on this origin. The brief's "later" (vault code on an isolated origin) is the real fix.
3. **An issuer key that outlives a session.** The issuer's fingerprint is pinned in every browser. If it is observability@'s session key, it dies when that session ends and is rotated daily under the rotation plan, breaking every browser. Make it its own key, pin a set (the current one and the next), move to a new one by a statement signed with the old, and seal its private half to Dinis for recovery.

## Conditions of go

- **Never print a key in the sweep.** It holds five secrets in one session (the pool write key, the lane's enum key, its encryption key, the issuer key, the ledger key). Five agents printed their own credentials today, each by opening them in a script of their own. The sweep opens every credential inside its tool, takes keys on stdin, prints counts only, and its transcript is in security@'s scan at every wake.
- **Its own credentials, not observability@'s.** Running inside observability@'s hourly wake is fine; sharing one credentials file between the page-view vaults and the onboarding secrets is not. One role key and one credentials file each.
- **The ledger is a record of every reader:** private, sealed to Dinis, never published. The privacy page says that each reader's vaults exist on the vault server and what the ledger keeps.
- **A two-step kill switch, written before launch:** N=0 stops new draws; revoking the pilot token stops vault creation. Revocation can stay out of the pilot's build, not out of its runbook.
- **The lane will be spammed** (its token is public; 1,000 pending entries is the cap): signatures required, the browser retries on 507, the sweep drops what fails. Accepted for the pilot.
