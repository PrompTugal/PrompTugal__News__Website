# security@ pre-review: one reader across devices, step 1 (device key and pairing offer on the web)

By security@PrompTugal.dinis (`security-promptugal-2`), 17 November 2026, about 12:10 UTC.
Read: `board/spec-one-reader-across-devices.md` (Dinis's brief this morning) and dev@'s pass `board/passes/2026-11-17-pairing-step-1.md`.

**Verdict: go for step 1 as dev@ scopes it.** That scope is the device key, the offer, the checks, and a dry-run hello that is sealed and signed but not sent. It goes under P1 to P8 below. Steps 4 and 5 (the hello sent, the main vault key and the access key passed to another device) need P9 and P10, and my pass on the real send, before they ship. No hold.

What is already right:
- The device keys are non-extractable `CryptoKey`s in IndexedDB.
- The offer rides only in a URL fragment.
- The nonce is single use, and the offer has a 10-minute expiry.
- The `k1`'s signing fingerprint is checked against `device`.
- The vendored pki.sgit.ai modules are pinned, with no outside script at run time.
- Nothing goes into localStorage. There is no telemetry on the page.
- The page says plainly that unpairing waits on key rotation.

## Conditions for step 1

1. **The match code is a real comparison, not a glance.**
   - Fingerprint prefixes can be ground: an attacker who photographs A's code can make keys until one shares B's first characters.
   - Derive the code from `SHA-256(nonce || fpA || fpB)`, at least 6 decimal digits, and show it on **both** screens. A's "Allow" stays disabled until the reader confirms the two codes match; better still, A asks the reader to type the code shown on B.
   - The test file checks that a key whose fingerprint shares B's prefix does not produce B's code.
2. **First hello wins, then the offer is closed.** A accepts at most one hello per nonce. A second hello, or a declined one, ends the offer, and the reader makes a new one. The page says "someone else answered this code" when a second hello arrives.
3. **The fragment is cleared once read.** On `/pair/#…`, read the offer, then `history.replaceState` to drop the fragment, so the append token does not stay in the address bar, history or a shared screenshot. The offer is also not put in the page title.
4. **No other script reads the pairing pages.** `obs.js`, search and anything that reads `location` are not loaded on `/account/pair.html` or `/pair/`. The pages get a `<meta http-equiv="Content-Security-Policy">` with `default-src 'self'; script-src 'self'; connect-src 'self' https://dev.send.sgraph.ai; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'none'`, because GitHub Pages sends no CSP header of its own. The pages also send `referrer: no-referrer`.
5. **The offer holds nothing but what the spec lists.** That is: kind, v, device fingerprint, the name the reader typed or the browser's name (never the full user agent), k1, the lane (vault id, the append-only token, endpoint), nonce and expires. No reader id, profile, place or history.
6. **The pinned vendor files are checked by the gate.** `VENDOR.md` names each file's sha256, and the gate refuses a changed file, the same way as for sg-vault (S15's lesson: pins in prose drift).
7. **Messages are checked before they are acted on.** For the hello, verify the signature with the key inside it, check that the key's fingerprint equals `device`, check the nonce against A's open offer, and check `expires` against A's own clock with a small skew allowance. Show any failure to the reader; never act on it silently.
8. **Tests as dev@ lists them**, plus P1's prefix case and P2's second-hello case.

## Before the real send (steps 4 and 5)

9. **The origin is the trust boundary.**
   - Every page on promptugal.news can use the device keys and read a vault key held in page memory.
   - That origin now renders outside text: outlets' headlines, place files and translations. So one cross-site scripting slip anywhere would reach the keys.
   - Before the main vault key and the access key flow, either put the account and pairing pages on their own origin (for example `account.promptugal.news`, served from the same repository) or show me that every outside string on the site goes through `esc()` or `textContent`. The first is safer; dev@ decides and records it on a PT decision page.
10. **The keys sent in step 5** are sealed to B and signed by A, and only after P1's confirmation on both sides. The access key is a grant B can use but A can revoke (rotation, step 7 of the protocol). Nothing is written to the main vault's device list until B's record is checked.

## Personal data (for steps 3 and 4)

- The profile v2 (home place, follows, reads, searches) is personal data. It stays in the browser or in the encrypted vault. It is never sent to observability, never in a URL, never in a log. The "reader" id never leaves the device in clear.
- "Use my location" is matched to the nearest place in the browser and never sent, as the spec says. Keep it that way in the app too.
- "Another account" sharing is a later review of its own.

## Who

- dev@: P1 to P9.
- designer@: P1's screens (both codes visible, "Allow" disabled until confirmed).
- The iOS team (step 2): the same P1, P2, P5 and P7.
- Dinis: the pilot access key (the spec's question 1). Issue it as a token for reader vaults only, never the agents' token.
