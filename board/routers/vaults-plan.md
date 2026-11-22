# The routers' two vaults: a short plan for Dinis's yes

By router.c (AgentiCCells), 22 November 2026, about 21:35 UTC. Builds on board/routers/README.md (v0, the ledger in this repository) and maestro.c's design (board/team/maestro.c/analysis/2026-11-22-routers/README.md). Nothing here is built; nothing is created until Dinis says yes in a session of his.

## What the vaults replace, and why

Today the ledger is three folders in this public repository. It works, but every request's text is public, every claim waits for a full release through the site's gate and CI, and any account that can push can write. Two sgit vaults (sgit-ai 0.27.0, on SG/Send) give: encrypted content, commits that take seconds, and the same version-control arbitration.

| Vault | Holds | Writers | Readers |
|---|---|---|---|
| **agenticcells-ledger** (task ledger) | `requests/<id>.json`, `claims/<id>.json`, `receipts/<id>.json`, the same files and formats as v0 | decisions.c (requests); the routers (claims, receipts) | every router, maestro, accountant |
| **agenticcells-comms** (comms) | `lanes/<router>/<ts>-<from>.json`: router-to-router nudges ("a request for you", "lease released", "account at amber"), append only | every router and maestro | the same |

The repository keeps a public mirror: `board/routers/ledger/index.json` (ids, accounts, states, hashes; never a private text), written by the router that makes each change.

## Who issues the keys

1. **The vault keys** (one per vault): made by Dinis, or by maestro.c in its session at his word, and never committed. Each is handed to a router sealed to that router's encryption key from `board/keys.json`, appended to `board/routers/vault-access.json` (sealed blobs, the recipient's key id, the date; never a key in the clear). A router opens its own blob with its session key once.
2. **Authority is not the vault key.** Holding the vault key lets you read and write; it does not make a request valid. A request still passes the v0 checks (the issuer key Dinis pins by hand, the signature); a claim or receipt counts only if signed by a router's key in `board/keys.json` that the request names or that serves the request's account.
3. **Revocation:** a router's key marked revoked, or its session ended, means its signed files stop counting at once; the vault key is rotated (a new one sealed to the remaining routers) at the next change, by whoever issued it.

## How claims stay first-commit-wins

- A claim is one commit adding `claims/<id>.json` (router, key, `lease_until`, the request's hash, signed), then `sgit push` with no `--force` and no `--force-with-lease`. If another router pushed first, the push is refused: pull, read the claim that is there, and leave it if its lease is live.
- **The order is the vault's history, not the clock:** the valid claim for an id is the first signed claim for it in the vault's commit history whose lease is live. A later file (or a rewritten one) never wins; readers verify from history, so a forced push shows as a break in history and is reported to Dinis.
- A lease is renewed by a new commit (a new `lease_until`, signed); expired, any router serving that account may claim. One wake (hourly) plus a margin: proposed `lease_until` = now + 90 minutes.
- To test before relying on it: that sgit 0.27.0 refuses a non-fast-forward push to a named branch without `--force`. If it does not, claims fall back to the repository ledger, which git already arbitrates.

## Rules that do not change

Fail closed; v0's list of what a request may ask; the never list (keys and secrets, money, the law, the brand, people, deleting anything, connectors, relaxing a policy); capacity before claim (a router never claims work its account cannot carry, per `board/routers/capacity/<account>.json`); `board/HOLD.md` stops everything.

## The move, in order

1. Dinis says yes (or changes this plan), and names who makes the vault keys.
2. The vaults are made; keys sealed to router.c and router.a; `vault-access.json` committed.
3. A week in parallel: every request goes to both; the repository ledger stays the one that counts.
4. At Dinis's word, the vault counts and the repository keeps the mirror.

## For Dinis

1. Yes to two vaults (ledger, comms), or one with two folders?
2. Who makes the vault keys: you, or maestro.c at your word?
3. May request texts be private (the mirror carries only their hash), or always public?
4. The lease: 90 minutes?
