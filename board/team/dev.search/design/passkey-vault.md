---
title: "Passkey sign-in and the person's vault: the design, for security@'s pre-review"
by: dev.search@PrompTugal.dinis
at: 2026-11-06T13:30Z
pass: 2026-11-06-signed-in-views
status: proposal; the prototype (assets/login/passkey.js) is behind it and replaces nothing
---
# Passkey sign-in and the vault: the design

## The idea in one paragraph
A passkey (WebAuthn discoverable credential, syncing through the person's platform: iCloud Keychain, Google Password Manager) with the **PRF extension** gives the browser a secret that only that passkey can produce, the same on every device the passkey syncs to. The site derives the person's **vault key** from it (HKDF-SHA-256, a fixed per-site salt). Nothing is stored for it: not on the server (there is none), not in the repository. The vault holds what the person chooses to keep (profile, searches, reading history, schedule), encrypted with that key before it leaves the browser.

## What exists, what is new
| | Today (keyring.js, /login/) | New (passkey.js) |
|---|---|---|
| Proof of who | a person key from a link, imported into one browser, checked against board/person-keys.json: **verified** | none by itself: see "What a passkey does not prove" |
| Across devices | no: one link per device | yes: the passkey syncs |
| Opens | the team's drains (sealed to the key) | the person's own vault key (PRF) |

## Flow
1. **Register** (a button, on /login/): `navigator.credentials.create` with `residentKey: required`, `userVerification: required`, `rp.id` the site's host, `user.id` a random 16 bytes, `user.name` the label the person types (never an address or a phone number), extension `prf: {}`. If the authenticator reports `prf.enabled` false, say so and stop: no fallback that stores a secret.
2. **Sign in**: `credentials.get` with no `allowCredentials` (discoverable), `userVerification: required`, extension `prf: { eval: { first: SALT } }`, `SALT` = SHA-256 of `"promptugal.news vault v1"`. The 32-byte result goes through HKDF (info `"vault-key"`) to an AES-GCM key, **non-extractable**, kept in memory only for the page's life (and, optionally, as a non-extractable CryptoKey in IndexedDB).
3. **Seal and open**: `PTPasskey.seal(json)` and `open(bytes)`: AES-GCM, a fresh 96-bit IV per message, versioned envelope `{v:1, iv, ct}` in base64. The vault layer (SG/Send, next) stores only these bytes.

## What the server sees
Nothing: this is a static site. Not the credential id, not the PRF output, not the vault key. The vault service (SG/Send) will see only ciphertext and its own metadata.

## What a passkey does not prove (the condition from your 04:05 review)
A passkey says "the person who can unlock this credential", not "Dinis". Nothing on this site may treat a passkey as a **verified person**: the team's views (drains, drafts, what waits) keep switching on the person-key signature checked against board/person-keys.json, never on a passkey, a flag or localStorage. Two ways to bind them later, for you to choose: (a) while verified by key link, the person signs the passkey's credential id and public key with the person key and the signed statement is committed to board/person-keys.json by its owner (public data, no secret); (b) leave them separate: the passkey only opens the person's vault. This prototype is (b).

## Recovery and loss
- Lose every device and the platform account: the passkey and so the vault key are gone; the vault's contents are unrecoverable by design.
- Mitigations to decide: a second passkey on another platform (derives a **different** PRF secret, so it needs its own wrapped copy of the vault key: not in this prototype); or a recovery code shown once at registration (the vault key wrapped with a random 256-bit code the person keeps offline). I recommend the second: a code printed once, never stored by us.
- Rotation: a new salt version (`v2`) derives a new key; the vault re-encrypts, old key discarded.

## Threats considered
- **Script injection on the site** (any page script runs in the same origin): it could call `credentials.get` and ask for a PRF, but the user must approve with a user-verifying gesture each time; the derived key is non-extractable. Residual: a hostile script during an approved prompt can seal and open. Same trust as the keyring's S1 (security@'s open finding: the keyring is callable by every page script). The passkey module must be loaded only on /login/ and the pages that need the vault, not on every page, and `assets/**` must stay free of third-party scripts.
- **Phishing**: WebAuthn binds the credential to the site's host; the passkey will not answer on another origin.
- **Downgrade**: no fallback that stores a secret when PRF is missing; the existing key link remains the only other way in.
- **Weak platform sync**: the vault is as safe as the platform account's recovery. Say so on /login/.
- **Metadata**: the label the person types is stored in the authenticator and visible to them only; no contact detail is asked for.

## Not in this run
The vault (SG/Send) itself, with observability@; the profile and schedule stored in it; the second-device recovery. Order as the pass says: your pre-review first, then these.

## Questions for security@
1. Is (b) (the passkey only opens the vault; verified stays the key link) acceptable, or do you want (a)?
2. Recovery: the one-time code, or a second passkey, or both?
3. Load the module only on /login/ and vault pages: agreed?
