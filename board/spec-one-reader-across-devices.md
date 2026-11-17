---
title: "Spec: one reader across devices (pairing by QR code and append lane), and the personal PrompTugal.news"
by: Dinis Cruz (the brief, 17 November 2026, morning, in the conductor's session), kept by conductor@PrompTugal.dinis
received: 2026-11-17
owners: "dev@ (web: assets/vault, assets/profile, the personal front page; reviews dev.search@), the iOS team (the same flows in the app: conductor.a.ios@'s debrief names the code), designer@ (the pairing screens, the personal front page), security@ (pre-review of the pairing protocol), abp@ (grants), ontologist@ (the profile schema), accountant@ when billing starts"
builds_on: board/spec-vault-onboarding.md (door, master, reader vaults; key pool and licence; append lanes), assets/vault/README.md (shipped), content/profile.md and assets/profile/profile.js (the browser-only profile, nr.profile.v1), pki.sgit.ai (k1 key codes, sealed m1 messages, qr/key/v1 and qr/sealed/v1)
issue: WS-177
---
# One reader across devices, and the personal PrompTugal.news

## What Dinis asked (17 November 2026, morning)

- **One experience** on the iPhone app and the website: the same logic, the same data, the same feel.
- **The primitives:** each device (the iPhone app, a browser) has its own identity, from a passkey where one is available, otherwise from the session; with it, a **device vault**. The reader has a **main vault** (they may have more, but one is the default) that every paired device opens.
- **Pairing by QR code, then append lanes.** One device shows a QR code with its public key and an append lane. Taking a photo of it (or pasting it) is the moment of authorisation, and only to *send*: no data is opened by it. The other device then sends its public key down the lane; the first checks it and sends back, sealed, the main vault's key. Both ways round work. It could even be another person's account.
- **The access key** (the vault server's write key) is needed once and should be shared across devices if that keeps it smooth.
- **Personalisation, independent of storage:** what is new since my last visit, in the country, my region and my town; what is relevant to me. The same data kept in local storage (this browser only) or in the vault (every device).
- **Billing as memory:** people pay to keep their history across devices; the vault (and later its access key) is what they pay for. The first vault must be smooth.
- **Register who the reader is from the very first visit.**

## The model: three vaults and a local mirror

| Thing | Where it lives | Holds | Made when |
|---|---|---|---|
| **Device key** | the device: a non-extractable WebCrypto key in IndexedDB (web), the Keychain / Secure Enclave (iOS) | RSA-OAEP 4096 + ECDSA P-256, the pki.sgit.ai bundle; its k1 code | the first visit, silently |
| **Device vault** | dev.send.sgraph.ai | this device's own records (reads, searches, settings), written only by this device; its append lane's token | when the reader first keeps anything beyond this browser |
| **Main vault** (default) | dev.send.sgraph.ai | the profile (below), the merged history, the list of paired devices with their public keys, the access key (sealed per device) | with the first device vault, or received from a paired device |
| **Door** (optional) | derived from a passkey's PRF (`assets/vault/door.js`, shipped) | the main vault's key, so a passkey alone reopens it on any device that has the passkey | when a passkey with PRF is available |
| **Local mirror** | localStorage `nr.profile.v1` (shipped) and its iOS equivalent | the same profile JSON | always, from the first page |

The local mirror is the floor: personalisation works with no vault and no network, in this browser only. The vault is what makes it follow the reader (and what is paid for). The shipped door/master/reader account maps onto this: the master is the main vault; the reader vault's records become the device files (`activity/devices/<device>.json`, already the layout in `sync.js`).

## Pairing: the protocol

Built only from shipped parts: pki.sgit.ai's key code and sealed message (`lib/v0/v0.2`, message.js and keys.js, pinned by SRI), and SG/Send append lanes (`POST /api/vault/append/*`; a write needs only the append token).

**The QR code (pairing offer)**, shown by device A, valid 10 minutes:

```json
{ "v": 1, "kind": "promptugal.news/pair/v1",
  "device": "sha256:<A's signing fingerprint>", "name": "Dinis's MacBook, Safari",
  "key": "k1.…",                                  // A's public bundle (pki.sgit.ai key code)
  "lane": { "vault": "<A's device vault id>", "token": "<append token>", "endpoint": "https://dev.send.sgraph.ai" },
  "nonce": "<16 random bytes, base64url>", "expires": "2026-11-17T09:10:00Z" }
```

Too long for a comfortable QR code with the full key: if needed, the code carries the lane, the nonce and A's fingerprint only, and A's bundle is the first file B reads from the lane's public part (A publishes it there when it shows the code). The same JSON can be pasted as text (the "Copy" button beside the code) or opened as a link (`https://promptugal.news/pair/#<base64url>`), so a laptop with no camera works.

**The steps:**

1. **A shows the offer.** It is a grant to *write* to A's lane, nothing more.
2. **B scans or pastes it.** B shows "Pair with Dinis's MacBook (sha256:…)?": the reader's tap is the authorisation.
3. **B writes its hello to A's lane:** a pki.sgit.ai message sealed to A's key and signed by B's key: `{ kind: "promptugal.news/pair-hello/v1", nonce, device: B's fingerprint, key: B's k1, name, lane: B's own lane (vault, token) }`.
4. **A drains its lane** (polling every 3 seconds while the offer is on screen), opens the hello, checks the nonce and B's signature against the key inside, and shows "iPhone (sha256:…) wants to join. Allow?" with both fingerprints' first characters (a short match code, like Bluetooth pairing).
5. **A sends the keys to B's lane:** sealed to B, signed by A: the main vault's key, the access key as a grant (`grant: { service: "sg-send", endpoint, token }`, the same shape cell.email's page already accepts), and A's device record.
6. **Both write the pairing into the main vault:** `devices/<fingerprint>.json` (name, public bundle, paired_at, paired_by). From then on any device can seal to any other, and the lanes carry nudges ("new reads, pull").
7. **Unpairing:** remove the device record and rotate the main vault's key (a new key sealed to the remaining devices). Rotation is the honest revoke; until it ships, say so on the page.

**Either side can start.** If the iPhone shows the code and the browser scans (camera or paste), the roles swap. If B has a main vault and A does not, A receives; if both have one, B is asked which to keep as the default and the other stays listed.

**Another account.** The same flow, with a different main vault: what is shared is chosen (a folder, a list of places), not the whole vault. Later.

**Rules:** the offer expires and its nonce is single use; every message is signed and checked against `board/keys.json`-style bundles held in the main vault; no key ever travels in clear (not in a QR code, not in a URL that reaches a server; the `#fragment` never does); the lane token in the QR code grants writing only.

## The access key: three options (PT decision, the owner's default first)

| Option | How | Good | Bad |
|---|---|---|---|
| **A. Travels with pairing (default)** | the first device gets it (below); every pairing passes it on, sealed, as a grant | one step for the reader after the first device | the first device still needs it |
| B. The key pool (`spec-vault-onboarding.md`) | the browser draws an API key from the pool and opens the licence | no human step at all; the plumbing for paid keys | the pool, the sweep and the mailbox are still to build |
| C. Typed or scanned once per device | the reader pastes it | nothing to build | friction on every device |

The first device gets it from B when the pool exists; until then from a pilot key that Dinis issues (`data/billing/vault.json`, `access_key.status` is still "not-issued"). This is the only blocker for vaults on the website today.

## The profile: one schema, two homes

`promptugal.news/profile/v2` (ontologist@ owns the schema; it extends `nr.profile.v1`):

```json
{ "schema": "promptugal.news/profile/v2", "reader": "sha256:<main vault's first device or the passkey's door id>",
  "created": "…", "home": { "place": "loule", "set_by": "reader | location | first visit" },
  "follows": { "places": ["loule", "faro", "algarve", "portugal"], "topics": ["ai-in-councils"], "organisations": ["nera"] },
  "last_seen": { "web:<device>": "2026-11-17T08:55:00Z", "ios:<device>": "…" },
  "read": [{ "id": "articles/…", "at": "…", "device": "…" }],
  "saved": [], "searches": [], "settings": { "language": "en", "theme": "auto" } }
```

- **Web:** localStorage (as today) and, when the vault is open, `profile.json` in the main vault, merged by `sync.js`'s rules (per-device files, consolidated).
- **iOS:** the app's own store (the same JSON) and the same vault file. The same merge.

## The personal PrompTugal.news (what the reader sees)

From the first visit, with no sign-in:

1. **"Where are you?"** once, at the top of the front page: pick a town on the map, or "use my location" (the browser's, matched to the nearest place, never sent). Skip keeps Portugal. The answer is `home`.
2. **"Since your last visit"** at the top of the front page and of the app's home: what is new, in three rings: **your town**, **your region**, **the country** (the blast radius already on the place pages: `board/briefs/2026-11-16-blast-radius.md`). New = articles and place-file items (`ai_news`, `events`, the live data's warnings) dated after `last_seen` for this reader, on any device.
3. **Your places** first everywhere: the Algarve list, the map and the stories put followed places first; a star on every place page follows it.
4. **What others read** (later, from observability's counts, no reader identified): "most read in your region today".
5. **The app and the website say the same thing**: the same three rings, the same order, the same "since" moment, because `last_seen` is shared through the main vault.

## Billing: paying for memory (For Dinis: the decision is his)

- **Free:** this browser only (the local mirror). Everything above works.
- **The vault:** history across devices, kept. The pilot is free; later a price per month, or reading credit (`spec-the-reading-credit.md`) spent on storage.
- **Retention:** free vaults keep 30 days of history; paid keep everything (proposal).
- **The access key** carries the payment (the licence format in `spec-vault-onboarding.md` is already shaped for it).

## The order of work

1. **Device key and the pairing offer on the web** (dev@): `assets/vault/pair.js`, the QR code (vendored qrcode-generator, already in `newsroom/tools/vendor/`), scan by camera (BarcodeDetector where available, otherwise a vendored decoder) and paste. Test: two browsers on one laptop pair by paste.
2. **The same in the iOS app** (the iOS team): show and scan the same JSON. Test: the iPhone scans the laptop's code and receives the main vault key in under 30 seconds.
3. **Profile v2 and "Since your last visit"** on the web front page and the app's home (dev@, designer@, the iOS team), working from localStorage first.
4. **The vault behind it:** the main vault file, merge, `last_seen` shared.
5. **The access key** by option A, then B.
6. **Billing** after Dinis's decision.

Security@ pre-reviews steps 1 and 2 before they ship (the protocol, the CSP, what the QR code holds). Each step is shipped behind the "You" button first, then on the front page.

## Questions for Dinis (only his)

1. **The pilot access key:** issue one for reader vaults (a new SG/Send token, not the agents' token), so step 4 can ship?
2. **The iOS team:** it was not restarted on account B. Who builds the app's side (step 2)?
3. **Billing:** is "free in this browser, paid to keep it across devices" the line?
