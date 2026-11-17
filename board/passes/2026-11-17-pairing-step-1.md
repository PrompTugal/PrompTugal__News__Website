# Pass: one reader across devices, step 1 (the device key and the pairing offer on the web)

By dev@PrompTugal.dinis, 17 November 2026, about 11:20 UTC. This follows Dinis's guidance of the morning: `board/guidance/README.md`, row "17 Nov, morning", and the spec `board/spec-one-reader-across-devices.md` ("The order of work", step 1). **For security@'s pre-review before anything ships**, as the spec asks. Then designer@ (the screens) and ontologist@ (profile v2, step 3).

## What step 1 builds

`assets/vault/pair.js`, an ES module loaded only by a new page `/account/pair.html`. The page is reached from the "You" pane and linked nowhere else until security@ passes it.

1. **The device key, made silently on the first visit to the page.**
   - Two WebCrypto keys: RSA-OAEP 4096 for sealing and ECDSA P-256 for signing. These are the algorithms of pki.sgit.ai's bundle.
   - Both are generated with `extractable: false` and kept as `CryptoKey` objects in IndexedDB (`nr.device.v1`). A script can use them but never read their bytes.
   - The public halves are exported (SPKI), written as a pki.sgit.ai `k1` key code, and fingerprinted (`sha256:` of the signing key).
2. **The pairing offer**, as in the spec: `promptugal.news/pair/v1` with the device fingerprint, a name, `k1`, the lane, a 16-byte nonce from `crypto.getRandomValues` and `expires` 10 minutes ahead.
   - Shown three ways: a QR code (the vendored `qrcode-generator-2.0.4.mjs`), a "Copy" button for the JSON, and a link `https://promptugal.news/pair/#<base64url>`. The offer rides only in the fragment, which never reaches a server.
   - If the QR code is too dense with the full `k1`, it carries the fingerprint, lane and nonce only, and the bundle is published to the lane's public part. That is the spec's fallback, decided by measuring and not guessed.
3. **Reading an offer:** paste, open the link, or scan with `BarcodeDetector` where the browser has it. No decoder is vendored in step 1; paste and link cover a laptop.
   - Checks before anything is shown: the kind, `v` 1, `expires` in the future, the nonce never seen before on this device, and a `k1` whose signing fingerprint equals `device`.
   - Then: "Pair with <name> (sha256:abcd…)?", with a short match code made from the first characters of both fingerprints.
4. **The hello (step 3 of the protocol):** sealed to A's key and signed by B's, with pki.sgit.ai's message format, written to A's lane with the append token. **This is the part blocked today** (below).

## What security@ should look at

- **The offer grants writing only.** The append token in the QR code can add to A's lane and nothing else. A stranger who photographs the code can send a hello. That hello still has to be accepted on A, and A shows the match code.
- **The nonce** is single use and checked on A when the hello arrives. Seen nonces are kept in IndexedDB until they expire, so a replayed hello is refused.
- **No key in clear, anywhere.**
  - The main vault key travels only sealed to B's public key (protocol step 5).
  - Nothing goes into localStorage. The device keys are non-extractable `CryptoKey`s, and the vault keys stay in page memory, as `assets/vault/README.md` already rules.
- **Third-party code.**
  - pki.sgit.ai's `message.js` and `keys.js` are vendored into `assets/vendor/pki/`, pinned by sha256 and recorded in a `VENDOR.md`, the same way as sg-vault.
  - Nothing is loaded from another origin at run time, so the page's CSP stays `script-src 'self'`.
- **Unpairing** is not in step 1. The page says so plainly: removing a device for real needs key rotation, which comes in step 4.
- **What I will not do:**
  - log, print or send a key, a token or an offer anywhere but the lane;
  - name a device after anything but what the reader types (the default is the browser's name, never the user agent string in full);
  - add telemetry to the page.

## The blocker (for Dinis)

The lane is an append lane on a **device vault** at dev.send.sgraph.ai. The vault server creates a vault only with an **access key**, and `data/billing/vault.json` still says `access_key.status: "not-issued"`. The spec says the same: "This is the only blocker for vaults on the website today."

Until a pilot key exists, step 1 ships:
- the device key;
- the offer: built, shown as a QR code, copied and opened by paste or link;
- all the checks on the receiving side;
- a dry run that seals and signs the hello and shows it, without sending it.

Two browsers on one laptop can then be tested up to the hello. The send and the reply wait for the key.

## The order inside step 1

1. Vendor pki.sgit.ai's two modules (pinned), and write `pair.js` with the device key and the offer.
2. Add `/account/pair.html` behind the "You" pane, with a test in `newsroom/tests/pair.test.mjs` that parses offers, refuses expired, replayed and mismatched ones, and round-trips the seal and signature.
3. security@'s pass, then the link from the "You" pane.
4. The lane send and the reply, once the access key exists.

## security@ pre-review (17 November 2026, 12:10 UTC)

**Go for step 1 as scoped:** the device key, the offer, the checks and a dry run, with nothing sent. It goes under conditions P1 to P8:
- **P1:** a 6-digit match code from SHA-256(nonce, fpA, fpB), confirmed on both screens. Not fingerprint prefixes, which can be ground.
- **P2:** the first hello wins and closes the offer.
- **P3:** the fragment is cleared once read.
- **P4:** no obs.js or other location readers on the pairing pages, plus a meta CSP.
- **P5:** the offer holds only the spec's fields.
- **P6:** the gate checks the vendor pins.
- **P7:** signature, fingerprint, nonce and expiry are checked before acting.
- **P8:** the tests.

**Before steps 4 and 5** (the hello sent, the vault and access keys passed on):
- **P9:** the account and pairing pages on their own origin, or proof that every outside string on promptugal.news is escaped.
- **P10:** keys sent only after P1's confirmation, sealed and signed.

In full: `board/team/security/reviews/2026-11-17-1210-prereview-pairing-step-1.md`.

## dev@'s progress (17 November 2026, about 12:50 UTC)

Built under security@'s go, with nothing sent and no page yet:
- **`assets/vault/pair-core.js`**: the protocol, with no DOM and no network. It covers:
  - the device key: non-extractable RSA-OAEP 4096 and ECDSA P-256, with the bundle written by pki.sgit.ai's own `bundleOf`;
  - the offer (P5: exactly the spec's fields, and nothing else is accepted);
  - the reading checks (P7: kind, version, expiry, at most ten minutes, nonce unseen, a `k1` whose fingerprint is the device named, the lane only on dev.send.sgraph.ai);
  - the match code (P1: six digits from SHA-256 over a domain tag, the nonce and both fingerprints);
  - the hello, sealed to A and signed by B in keys.js's v2 envelope, and opened on A with every P7 check.

  The private operations use the `CryptoKey`s directly. Everything public is the vendored pki.sgit.ai code, which was already in `assets/vendor/pki/2026-11-06/` and is byte-identical to the live files today.
- **`newsroom/tests/pair.test.mjs` (P8):** 25 checks, all pass. Among them:
  - expired, replayed, padded and mismatched offers are refused, as is a lane elsewhere;
  - the match code agrees on both sides and changes with the other device;
  - the hello opens only on A, and is refused when it is for another offer, signed by another key, carries a bad signature or is unsigned;
  - keys.js's `verifyBytes` checks the hello's signature, which shows it interoperates with `sgit pki`.
- **P6:** the gate checks every vendored file against its `VENDOR.md` pin (`newsroom/build/features/vendor-pins.mjs`, 19 files). A one-byte change to keys.js is caught.

Next:
- `/account/pair.html`, with no obs.js and a meta CSP (P4), the fragment cleared once read (P3), IndexedDB for the keys and seen nonces, and P2 (the first hello closes the offer);
- the dry-run hello shown on screen;
- then security@'s post-review before the "You" pane links it.

The send waits on the access key.

## dev@'s progress: the page, ready for security@'s post-review (17 November 2026, about 13:50 UTC)

The page code is on dev and **switched off**: `ENABLED = false` in `newsroom/build/features/pair.mjs`. The gate asks every page to be linked from the site, and in the sitemap and `llms.txt`. The pass keeps this page linked from nowhere until the post-review. So the code ships and the page is not built. security@'s review turns it on, and then the "You" pane links it.

- **P4:**
  - `page.bare` (in `lib/shell.mjs`) drops every site-wide script, obs.js included, and the inline script.
  - The page carries its own meta CSP: `default-src 'self'`, `script-src 'self'`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`. Plus `referrer: no-referrer`.
  - Its words and CSP live in `assets/vault/pair-page.json`.
  - It loads three scripts: `themes.js`, `top/top.js` (which reads only the query string, never the fragment, and sends nothing) and the module `vault/pair.js`.
- **P3:** the fragment is read, then cleared at once with `history.replaceState`.
- **P2 (on B):** a code is spent on this device as soon as it is read. Replay is refused, which the browser test confirms. The "first hello closes the offer" half is on A, and arrives with the lane send (step 4), since no hello reaches A in the dry run.
- **The answer is never sent.** After the match code is confirmed, the hello is sealed and signed and its length shown. Nothing leaves the browser: `connect-src 'self'`, and there is no `fetch` in `pair.js`.
- **Every outside string is written with `textContent`.** No `innerHTML` is used anywhere in `pair.js`.
- **The QR code:** qrcode-generator 2.0.4 is vendored into `assets/vendor/qrcode-generator/2.0.4/`, pinned and checked by the gate (P6).

**Tested in Chromium (Playwright, two contexts, the page switched on locally and not committed):**
- the offer (1068 characters) is drawn as a QR code;
- B pastes it and gets the match code; A and B compute the same code;
- the answer is sealed and signed (3124 characters) and not sent;
- the link form is read, and `location.hash` is empty afterwards;
- the same code pasted again on B is refused ("used already");
- only the three scripts above load, with no console or CSP errors.

`newsroom/tests/pair.test.mjs`: 25 of 25 pass.

**For the post-review:** to try it, set `ENABLED = true`, build, and serve the site root. Then open `/account/pair.html` in two browser profiles.
