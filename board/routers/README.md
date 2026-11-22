# Routers: controlling one account from another (v0, first test: account C to account A)

At Dinis's word, maestro.c's session, about 20:55 UTC 22 November 2026: "account A has already come online ... I would like to see if we can now do the whole flow of controlling that account directly from here ... we need a router ... on both ... decisions that are signed by me are then accepted on the other side ... make it so that the decision agent here creates a key, and then it gives me ... a QR code of its public key and signature, and then I'll give that to the router on the other side ... So let's use this one as an example ... because we have a couple of others coming online that we need to wire up."

Builds on decisions.d's design (board/team/decisions.d/design/README.md: the request format, the receiver's checks, the logs, revocation). The one simplification for v0: **the trust anchor is carried by Dinis by hand.** Instead of a pki.sgit.ai `operates` link, Dinis scans or pastes decisions.c's signing key fingerprint into the receiving session on the other account. A word Dinis types in a session is his word, so the pin is his.

## Who

| Agent | Account | Does |
|---|---|---|
| decisions.c (AgentiCCells) | C | holds the signing key (made in its session, never leaves it); turns Dinis's words in its session into signed requests; publishes each in the ledger before it is sent; shows Dinis its key as a QR code |
| router.c (AgentiCCells) | C | keeps the ledger here tidy; receives requests addressed to account C; reports account C's headroom |
| router.a (AgentiCCells) | A | started by Dinis on account A with board/routers/router-a-start-prompt.md; pins decisions.c's key from Dinis's own hand; at each wake pulls the ledger, verifies, claims, acts on account A within its grant, writes a receipt |

Next accounts (B, D and the seven new ones) get a router the same way.

## The channel: this repository (the vault later)

Sessions on different accounts cannot message each other (tested 22 Nov: send_message from C to D returns not found), but every account's sessions can pull and push this repository. Version control is the arbiter Dinis asked for: one writer wins each commit, and everyone sees the latest by pulling.

```
board/routers/ledger/requests/<id>.json   written by decisions.c: the signed request (decisions.d's v1 format; to.account names the account)
board/routers/ledger/claims/<id>.json     written by the receiving router: the claim (its name, key, lease until); first commit wins
board/routers/ledger/receipts/<id>.json   written by the receiving router: what it did (sessions started, commits, cost) or the refusal and the step that failed, signed
```

A claim is a lease: it carries `lease_until` and is renewed at each wake; an expired lease may be taken by another router named in the request. The shared vaults (a comms vault and a task-ledger vault) replace these folders once the flow works.

## What the receiver runs (fail closed)

decisions.d's section 4, with step 4 replaced: the request's `issuer.signing` equals the fingerprint Dinis pinned in this session, and `sig` verifies with the public key whose fingerprint that is (taken from board/keys.json and checked against the pin). Then: in date (2 h default, 24 h at most), addressed to me (`to.agent`, `to.account`), nonce not seen, the request file is on `dev` (published before acted on), the ask is inside my grant and not on the never list (keys and secrets, money, the law, the brand, people, deleting anything, connectors, relaxing a policy). Anything else: refuse and write the refusal as a receipt.

## What a request may ask in v0

Start a named session on the receiving account with a given start prompt (from a file in this repository), set or pause its wake, send it a message, report the account's state. Nothing else until Dinis widens it.

## Revocation

Dinis tells the receiving router in its session to drop the pin (immediate); or decisions.c's key is marked revoked in board/keys.json (at the next wake); or board/HOLD.md (everything stops).

## Tools (router.c (AgentiCCells), 22 Nov 2026)

`node board/routers/ledger/tools/ledger.mjs open|claims|receipts [--account x]` lists open requests, claims with live and expired leases, and receipts; `index` writes `board/routers/ledger/index.json` (run it at each change; `index --check` says if it is stale); `check <id> --pin <fp> --me <agent> --account <x>` runs the receiver's mechanical checks, fail closed (the scope stays the router's judgement); `selftest` proves the checks on a throwaway key. Headroom per account: `board/routers/capacity/<account>.json`. The vaults that replace the folders: `board/routers/vaults-plan.md` (for Dinis's yes).
