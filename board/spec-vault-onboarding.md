---
title: "Spec: vault onboarding for PrompTugal.news readers (key pool, claim lane, mailbox)"
by: Dinis Cruz (the brief, 6 November 2026), kept by conductor@PrompTugal.dinis
received: 2026-11-06T17:05Z
pass: board/passes/2026-11-06-signed-in-views.md (this brief is its build plan for every reader, Dinis first)
owners: "dev.search@ (browser: onboard.js, draw, verify, create, claim, mailbox; reuses assets/vault/door.js), observability@ (claims_setup.py, the sweep inside its hourly wake, pool_mint.py, the ledger, counts on the dashboard), security@ (pre-review, CSP), dev@ (review)"
issue: WS-177
---
# Conductor's notes (17:05 UTC)

- **Already here:** `assets/vault/door.js` (passkey PRF to the door, ported from newsroom.sgit.ai), `assets/vault/vault.js`, `vault-core.js`, `assets/vendor/sg-vault/local/sg-vault--create-with-id.js`; `newsroom/tools/obs/obs_setup.py` and `obs_drain.py` (the lane pattern the sweep copies); `board/team/customers/interest/interest.js` (the unsigned seal). Not here: `message.js`'s signed seal (pki.sgit.ai), a strict CSP in the build.
- **Asks for Dinis:** (1) the pilot's shared access key: a new SG/Send access token made for the pilot, not the token the agents already use; (2) the sweep runs inside observability@'s hourly wake, not as a new scheduled task; (3) the API-key prefix (`sgk_` is the brief's placeholder).

---

# Vault onboarding for PrompTugal.news readers: key pool, claim lane and mailbox

Nov 6, 2026 · @Dinis Cruz

## Summary

Any PrompTugal.news reader can get their own encrypted vaults in the browser, with no account and no backend of ours. The browser draws an API key from a public **pool vault** and uses it to open a signed **licence file** holding the SG/Send access key. It then builds the reader's door, master and book vaults with code that already runs on pki.sgit.ai.

The browser records what it took as a signed claim on an **append lane**. An hourly **sweep agent** drains the claims, refills the pool, writes the ledger, and answers through a sealed, signed **mailbox**.

Nearly all of it runs on code already in production. The new parts are the pool and licence format, the claim message, the sweep agent and the mailbox. Paid per-user keys later use the same licence format, so the browser flow does not change when Stripe arrives.

Everything below marked *proposed* is design. Everything marked *shipped* was checked in the code on 6 November 2026.

## Goals, constraints and risk posture

The goal is the first 50 to 100 real users creating vaults in the browser. Vault usage is the metric, and the pilot is free.

**Requirements**

- **Everyone on PKI.** Every reader gets a key pair made in the browser: RSA-OAEP 4096 to encrypt, ECDSA P-256 to sign. Every claim they post is signed with it.
- **Two ways to open the door.**
  - A passkey with PRF derives the door, as on pki.sgit.ai today.
  - Without PRF, the browser generates a vault key or sign-in code and shows it once. It goes into a password-manager form and, optionally, a downloaded file.
- **Everyone through the API-key flow.** No reader gets the access key by hand. Each one draws an API key and opens a licence file, so the plumbing for paid keys is exercised from day one.
- **No backend of ours.** Only the SG/Send server (`dev.send.sgraph.ai`), static hosting and a scheduled agent.

**Risk posture (set by Dinis on 6 November 2026)**

- Abuse is cheap. Today's traffic already includes pack-mode clones of the 50,000-file vault several times an hour, at about £1 to £1.50 of S3 cost over the period.
- Vault-count protection is not built yet, by choice. CloudFront logs are captured by a firehose if abuse ever needs investigating.
- The audience is not adversarial. So best effort is fine: one shared access key is acceptable for the pilot, and the pool's scarcity is a pacing tool, not a security control.

**Out of scope for the pilot:** rate limiting, enforced quotas, payments, and revoking the shared key.

## What already exists

Every building block is shipped except a browser-side cache reader, and the pilot can work without one.

| Capability | Where it lives | Status and the details that matter |
| --- | --- | --- |
| Append lanes | `dev.send.sgraph.ai`, `POST /api/vault/append/{configure,write,list,fetch,mark-processed,purge}/{vault_id}` | **Shipped, in production use** by promptugal.news: `newsroom/tools/obs/obs_setup.py`, `obs_drain.py`, `board/team/customers/interest/interest.js`, `board/inboxes/*.json`. A write needs only a hex `append_token` in the body, no account. The response is a blind `{"ok": true}`. Entry names are server-assigned (`{epoch_ms}_{24 hex}.enc`), so a writer cannot pick or check a filename. Limits: 5 MB per write, 1,000 pending per token, 100 ids per batch. |
| Cache layer (deterministic lookups) | sgit CLI: \`sgit cache add | rm |
| Browser cache reader | none | **Missing** from the sg-vault v0.2.3 bundled on pki.sgit.ai. `sg-send.js` already batch-reads and returns `not_found` per id, so a port is small (HMAC in WebCrypto). Pilot workaround: open the small pool vault whole. |
| Browser vault creation | `assets/vendor/newsroom/newsroom-vault.js` (`createVault`, `createVaultWithId`), pki `assets/people/account.js` | **Shipped.** Writes send the access key as `x-sgraph-access-token`. |
| Passkey PRF to door, master and book | pki.sgit.ai `/login/` | **Shipped.** HKDF over the 32-byte PRF output gives the door's id and passphrase. Includes the sign-in code for passkeys without PRF and a recovery code. |
| Seal and sign | pki `lib/latest/keys.js`, `assets/people/message.js` (`seal(toBundle, msg, signer)`); `interest.js` (`seal`, unsigned) | **Shipped.** sgit hybrid envelope v2: RSA-OAEP-SHA256 wraps an AES-256-GCM key, and the payload is base64 of base64 of `{v, w, i, c}`. The signed variant is in `message.js`. |
| Sealed access-key handover and ledger | pki.sgit.ai `/send/`, `/vault/` | **Phases 0–1 shipped.** Minting and revoking through `api.sgit.ai` are only proposed. |

Observability already runs the same loop this plan needs: a browser writes sealed records to a public-token lane, and a scheduled drain verifies, saves, pushes and then marks them processed. The claim lane and sweep agent are that pattern again.

## Architecture

There are five parts plus the reader's own vaults. Everything runs on SG/Send (`dev.send.sgraph.ai`), and the only process we run is a scheduled agent.

&#91;embedded content: architecture · 6 parts, 8 numbered steps\]

Steps 1 to 3 run in the reader's browser at sign-up. Steps 4 to 7 run in the hourly sweep, and step 8 runs whenever the reader's browser opens. The pool and the mailbox can share one public vault; the ledger stays private.

**Who holds which credential**

| Credential | Held by | Grants | Public? |
| --- | --- | --- | --- |
| Pool vault read key | Site config, so every browser | Read the pool and the mailbox | Yes, on purpose |
| Pool vault key (write) | Sweep agent | Rewrite the pool, licences and mailbox | No |
| Claim lane `append_token` | Site config | Append a claim | Yes, on purpose |
| Lane enum key | Sweep agent | List, fetch and mark claims processed | No |
| Agent encryption key (private) | Sweep agent | Open claims | No; public half in `board/keys.json` |
| Issuer signing key | Sweep agent | Sign the pool, licences and mailbox messages | No; fingerprint pinned in site config |
| Ledger vault key | Sweep agent, sealed to Dinis | Read and write the ledger | No |
| API key | Pilot: anyone (listed in the pool). Paid: the buyer | Find and decrypt one licence | Pilot yes, paid no |
| SG/Send access key | Every pilot licence, then each reader's master vault | Create vaults and push | Pilot: effectively yes |
| Reader's key pair, door secret | The reader only | Their identity and vaults | No |

## End-to-end flow

The reader waits only for steps 0 to 3. The browser never waits for the agent: the claim is a record, not a lock. The numbers match the architecture diagram.

0. **Identity.** The browser makes the reader's key pair. It then checks for a PRF-capable passkey:
   - PRF available: the door id and passphrase come from HKDF over the PRF output, as on pki.sgit.ai.
   - No PRF: the browser generates a door secret (the sign-in code construction, 128 random bits) and keeps it in memory.
1. **Draw.**
   - The browser opens the pool vault with its read key, published in the site config next to `assets/obs/obs.json`.
   - It reads `pool/available.json`, checks the issuer signature, and picks one entry at random.
   - From that API key it derives the licence lookup id and decryption key (format section).
   - It fetches `licences/<lookup>.json`, decrypts it, checks the issuer signature and `not_after`, and reads the access key.
   - Pool empty: say so, and offer to post an "I'm interested" note to the existing customers lane.
2. **Create.**
   - Using the access key, the browser creates the door, master and book vaults (`createVaultWithId` for the door).
   - The master stores the private keys, the API key, the access key and a copy of the licence.
   - Passkey users then see their recovery code. Everyone else sees the door secret once, in a password-manager form, with an optional download.
3. **Claim.** The browser posts one claim to the claim lane, sealed to the sweep agent's encryption key and signed with the reader's signing key. It includes a fresh random mailbox id, which the browser also stores in the master vault.
4. **Drain.** Every hour the sweep agent lists the lane with the enum key, fetches the claims, decrypts them, and verifies each signature.
5. **Refill.**
   - The agent moves claimed keys out of `pool/available.json`.
   - It mints new API keys and licence files back up to the target size, N.
   - It signs, commits and pushes.
6. **Record.**
   - The agent writes each claim to the private ledger vault: lookup id, reader fingerprints, mailbox id, time and door mode.
   - Only after the push succeeds does it mark the claims processed, as `obs_drain.py` already does.
7. **Reply.** Where needed, the agent writes a sealed, signed message to `mailbox/<mailbox id>/<n>.json`. Uses: a duplicate draw, welcome text, a rekey.
8. **Check.** Each time the reader's browser opens, it reads `mailbox/<id>/<last+1>.json` and keeps going until one is missing. It verifies the issuer signature and acts on each message.

## File and message formats (proposed)

There are four formats. All are `v: 1` JSON, signed by the issuer as ECDSA P-256 over SHA-256 of canonical JSON, the same signing pki.sgit.ai uses for delegations. The browser pins the issuer's signing fingerprint in its config and rejects anything signed by another key.

### API key and the two values derived from it

- API key = `sgk_` + 32 hex characters (128 random bits) from a CSPRNG. The prefix is a placeholder for the team to decide.
- `lookup` = first 32 hex of HKDF-SHA256(api\_key, info `pt.news/licence/lookup/v1`). This is the licence's path.
- `kenc` = HKDF-SHA256(api\_key, info `pt.news/licence/enc/v1`), 32 bytes, used as an AES-256-GCM key.

With two separate labels, knowing a licence's path tells you nothing about its key. A reader who lists the pool vault sees only lookups and ciphertext. In the pilot the API keys are listed openly anyway. For paid keys, which are never listed, this split is what keeps them private.

### `pool/available.json` (pool vault, agent-written, public)

```json
{"v":1, "kind":"pool", "issuer":"<issuer sign fp>", "updated":"2026-11-06T17:00:00Z",
 "entries":[{"api_key":"sgk_3f9c...", "added":"2026-11-06T17:00:00Z"}],
 "sig":"<b64 ECDSA>"}
```

The agent is the only writer, so it can be cached as a single-writer value (`sgit cache add --value pool/available.json`) once browsers have a cache reader.

### `licences/<lookup>.json` (pool vault, agent-written)

The file is `{"v":1, "iv":"<b64 12 bytes>", "c":"<b64 AES-256-GCM(kenc)>"}`. Its plaintext is a signed object:

```json
{"v":1, "kind":"licence", "lookup":"<lookup>",
 "access_key":"<SG/Send access token>", "access_key_name":"pilot-shared-2026-11",
 "plan":"pilot", "limits":{"vaults":5, "bytes":104857600},
 "issued":"2026-11-06T17:00:00Z", "not_after":"2027-02-06T00:00:00Z",
 "issuer":"<issuer sign fp>", "sig":"<b64 ECDSA>"}
```

- `limits` only declares the limits; nothing enforces them yet. The fields are here now so that paid licences need no format change. The values shown are examples.
- In the pilot every licence carries the same `access_key`. After the paid launch each licence carries its own.
- Binding `lookup` inside the signature stops a valid licence being copied to another path.

### Claim (lane payload)

The claim is sealed to the agent's encryption key with envelope v2 and signed with the reader's signing key, using `message.js`'s signed `seal`. It is not the unsigned `interest.js` seal.

```json
{"v":1, "kind":"claim", "lookup":"<lookup>", "site":"promptugal.news",
 "reader":{"sign_pub":"<PEM>", "encrypt_pub":"<PEM>"},
 "mailbox":"<32 hex random>", "door_mode":"passkey-prf" | "door-secret",
 "at":"2026-11-06T17:03:12Z"}
```

It never contains the API key, the access key or any door secret. A random `mailbox` id rather than a hash of the fingerprint means the public mailbox paths cannot be linked to a public key.

### Mailbox message `mailbox/<mailbox>/<n>.json` (public vault, agent-written)

The message is sealed to `reader.encrypt_pub`, and the inner object is signed by the issuer:

```json
{"v":1, "kind":"welcome" | "duplicate" | "rekey" | "notice", "n":1,
 "in_reply_to":"<sha256 of the claim ciphertext>",
 "body":{"api_key":"sgk_..."},
 "at":"...", "issuer":"<issuer sign fp>", "sig":"..."}
```

`n` counts up from 1. The browser keeps `last_read` in the master vault and checks that `n` inside the message matches the path, so a message cannot be replayed at a later number.

### Door-secret download (no-PRF readers only)

The file is `promptugal-vault-key.txt` and holds only the door's vault key (`sgit_private_vault_...`) plus two lines on how to use it. It never contains the access key or the API key: those live in the master vault, so the reader keeps exactly one secret.

## The sweep agent (proposed)

The sweep agent is `obs_drain.py` adapted for claims. It runs hourly as a scheduled agent, with credentials kept outside the repo in `~/.sg-send/claims-promptugal/creds.json` (mode 0600), sealed to Dinis's key for recovery as `obs_setup.py` does.

**It holds:** the pool vault key (write), the lane's enum key, its own encryption private key (to open claims), the issuer signing key, and the ledger vault key.

**Each run:**

1. **List and fetch** pending claims, in batches of up to 100 ids.
2. **Open and verify.** Decrypt each claim and verify the reader's signature against the `sign_pub` it carries. That proves the claimant holds the key, not who they are.
   - Failures are kept and marked, never dropped.
   - Claims whose `lookup` is not in the pool, or was retired more than one sweep ago, are ignored.
3. **Resolve duplicates.** The first claim per `lookup` wins, by the `epoch_ms` prefix of its server-assigned filename. Each later claimant is queued a `duplicate` mailbox message carrying a fresh API key. Their vaults keep working, because in the pilot the access key is the same.
4. **Retire and refill.**
   - Remove claimed keys from `pool/available.json`.
   - Mint new API keys and `licences/<lookup>.json` files back up to N.
   - Set N in the agent's config: 10 to 20 for the pilot, and 0 works as a kill switch.
   - Licences that are retired stay in place, so readers who already drew them keep working.
5. **Write the ledger** (private vault): one JSON line per claim with lookup, fingerprints, mailbox id, door mode, lane filename and time.
6. **Write mailbox replies.** Optionally run `sgit cache add` per new message path.
7. **Commit and push** the pool and ledger vaults. **Only then** mark the claims processed, so a failed push loses nothing.
8. **Purge** the lane's `processed` folder weekly. The 1,000-file limit applies to pending files only, but there's no reason to keep processed ones.

**Pacing.** Release speed is N per hour at most. For a hard daily cap, the agent stops refilling after D licences per UTC day.

**Output.** Print counts only, never keys. Publish daily claim counts to the observability public vault so the dashboard can show vault sign-ups.

## Security model and threats

The pilot knowingly gives the shared access key to anyone who looks. That is acceptable at this scale. The design keeps four protections from day one:

- Everything the browser trusts is signed by a pinned issuer key.
- Every reader secret stays in that reader's vaults.
- Claims are signed.
- Every public path is unlinkable to a person.

| Threat | Who can do it | Impact | Pilot mitigation | Later |
| --- | --- | --- | --- | --- |
| Take the shared access key | Anyone (it is in every pilot licence, and pilot API keys are listed) | Unlimited vault creation on our SG/Send account | Accepted. Cost is negligible, and CloudFront logs are captured. | Per-user minted keys with server-side quotas; revoke the shared key |
| Forge a licence or a pool file | Whoever holds the pool vault's write key | Point readers at a hostile access key or server | Issuer signature checked in the browser against a pinned fingerprint | Short-lived issuer keys, withdrawal recorded (as in the access-key handover article) |
| Fake a rekey in a mailbox | Whoever holds the pool or mailbox write key | Swap a reader's API key or access key | Issuer signature, sealed to the reader, `n` bound inside the signature | Same |
| Spam the claim lane | Anyone (the token is public by design) | Fills the 1,000 pending cap, so real claims get 507 | Signatures required; the sweep drains hourly; the browser retries on 507 | Server-side rate limits; token rotation |
| False claims | Anyone with a key pair | Ledger noise; one key drawn twice | The first claim wins and others are reissued. A claim proves key possession only. | Strong identity through the pki.sgit.ai register and anchor |
| Stolen door secret or recovery code | Whoever gets the file, password manager or code | Full read and write of that reader's vaults; not revocable after the fact | PRF preferred; shown once; download is opt-in and labelled | Rotation runbook; withdrawable codes (open in pki.sgit.ai) |
| XSS on promptugal.news | Any injected script | Reads in-memory keys and the door derivation kept in `sessionStorage` | Strict CSP, no third-party scripts, non-extractable WebCrypto keys where possible | Move vault code to an isolated origin |
| Server sees metadata | SG/Send server operator | Vault ids, sizes, timing, lane volume, number of mailbox messages | Random mailbox ids; nothing readable in paths | Batching or padding if it ever matters |
| Server withholds or rolls back | SG/Send server operator | Stale pool or mailbox | Monotonic `n` and `updated` checked in the browser | Signed refs (history-integrity work in the CLI) |

Three things to keep in mind while building:

- **A key is the identity, not the person.** A claim shows that someone holds a key pair. Linking that key to a person is the pki.sgit.ai anchor and register flow, which is out of scope for the pilot.
- **Revocation is never retroactive.** sgit's credentials doc says anyone who already fetched objects keeps them. Deleting a licence stops new draws only.
- **Open items in the underlying stack** carry over: the structure-key split is not active yet, IV handling is under review, and the pki.sgit.ai code has had no outside review.

## Path to paid, per-user keys

A purchase writes one new licence file. The browser flow stays the same except for where the API key comes from.

1. **Purchase.** A Stripe webhook, or Dinis by hand at first, triggers the issuer.
2. **Mint.** The issuer mints a per-user SG/Send access key with quotas and expiry. This needs the admin-side mint API, which `api.sgit.ai` phase 2 proposes.
3. **Write.** The issuer writes `licences/<lookup>.json` under a new random API key. The key is **not** added to `pool/available.json`.
4. **Deliver.** The buyer gets the API key as a link with the key in the URL fragment, a QR code, or a message sealed to their public key. Step 1 of the flow takes the key from there instead of from the pool.
5. **Migrate pilot users.** The agent sends each ledger entry a `rekey` message with a personal API key. Once all are moved, revoke the shared key on the server.
6. **Enforce.** The `limits` in the licence become what the server enforces per key, not just what the licence declares.

To revoke a paid key, revoke the access key on the server, which stops writes, and delete its licence, which stops new devices. Existing vault contents stay readable by their owner, as they should.

## Gaps and asks for the sgit CLI team

None of these blocks the pilot. Items 3 and 4 block the paid launch.

| # | Ask | Why it matters here | Blocks |
| --- | --- | --- | --- |
| 1 | A browser cache reader in sg-vault JS, mirroring `Vault__Cache_Reader` | Licence and mailbox reads in one request, instead of opening the pool vault | Nothing; it's an optimisation |
| 2 | When is the lane folder rename, from the raw token to `sha256(token)`? | It is a breaking migration, and our observability lanes and agent inboxes use lanes too | Nothing, but it's better done before more lanes ship |
| 3 | An admin API to mint, revoke and set quotas and expiry on access keys, or confirmation that one exists | Per-user keys and Stripe | Paid launch |
| 4 | Production guarantees for `dev.send.sgraph.ai` (uptime, retention, backups), or a date for lane routes on `send.sgraph.ai` | Every lane and every reader vault depends on it | Paid launch |
| 5 | The cost of push reconcile with hundreds of declared cache paths | One cache path per mailbox message | Nothing |
| 6 | Status of the open security items: IV determinism, the structure-key split, the unpublished findings | They sit underneath every reader vault | Nothing |
| 7 | Can a client detect a server rollback of refs, using signed refs or history integrity? | Pool and mailbox freshness | Nothing |

Confirmed, so no ask needed: append-lane entry names are server-assigned and the write response is blind. The design does not depend on deterministic lane filenames.

## Build plan

The build is mostly copying patterns that already exist. The browser module is the largest new piece.

- [ ] **Issuer and agent keys.** Generate signing and encryption pairs for the sweep agent with `sgit pki keygen`. Publish the public halves in `board/keys.json`, and pin the issuer signing fingerprint in the site config.
- [ ] **Pool vault.** Create it with sgit and publish its read key in the site config. Write `pool_mint.py`, which mints N API keys and their licence files, signs them, then commits and pushes.
- [ ] **Claim lane.** Copy `obs_setup.py` to `claims_setup.py`: it configures one lane, publishes the token and the agent's encryption key, and seals the credentials to Dinis.
- [ ] **Browser module `onboard.js`.** Covers draw, verify, create (reusing `newsroom-vault.js`), claim (the signed seal from `message.js`), and mailbox check. Nothing runs on import; it starts from a user's press, as `interest.js` does.
- [ ] **No-PRF path.** Reuse the sign-in-code UI for the password-manager form and add the optional download.
- [ ] **Sweep agent.** Copy `obs_drain.py` to `claims_sweep.py` and schedule it hourly.
- [ ] **Mailbox writer**, including the `duplicate` and `rekey` messages.
- [ ] **Tests.**
  - End-to-end in Chromium with a virtual PRF authenticator, as pki.sgit.ai does.
  - A duplicate draw.
  - A forged licence and a forged mailbox message, both rejected.
  - An empty pool.
  - A lane returning 507.
  - A failed push leaves the claims pending.
- [ ] **Dashboard.** Daily claims, by door mode, into the observability public vault.
- [ ] **Send the gaps table** to the sgit CLI team.

## Sources

All opened on 6 November 2026.

- [Append lanes: HTTP API](https://cli.sgit.ai/api/append-lanes.html), cli.sgit.ai
- [sgit security model](https://sgit.ai/security/index.html) and [credentials](https://sgit.ai/docs/credentials.html), sgit.ai
- [A login made of a passkey](https://pki.sgit.ai/articles/a-login-made-of-a-passkey.html), pki.sgit.ai
- [Handing out access keys](https://pki.sgit.ai/articles/handing-out-access-keys.html), pki.sgit.ai
- [Sign in with pki.sgit.ai for sites](https://pki.sgit.ai/articles/sign-in-with-pki-sgit-ai-for-sites.html) and [soft and strong sign-in](https://pki.sgit.ai/articles/sign-in-with-a-key-soft-and-strong.html), pki.sgit.ai
- [PrompTugal.news newsroom security](https://promptugal.news/newsroom/security/index.html)
- Code:
  - [SGit-AI\_\_CLI](https://github.com/SGit-AI/SGit-AI__CLI): `sgit_ai/cli/CLI__Cache.py`, `sgit_ai/storage/Vault__Cache_Manager.py`, `sgit_ai/core/actions/cache/Vault__Cache_Reader.py`
  - [SGit-AI\_\_Website\_\_PKI](https://github.com/SGit-AI/SGit-AI__Website__PKI): `assets/people/account.js`, `assets/people/message.js`, `lib/latest/keys.js`, `assets/vendor/newsroom/newsroom-vault.js`
  - [PrompTugal\_\_News\_\_Website](https://github.com/PrompTugal/PrompTugal__News__Website): `newsroom/tools/obs/obs_setup.py`, `obs_drain.py`, `board/team/customers/interest/interest.js`, `board/inboxes/`
