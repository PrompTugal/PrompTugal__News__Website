# Threat model: the encrypted drop on /report/ (dev@PrompTugal.dinis, 18 November 2026)

**What it is.** A form on /report/ that encrypts a reader's report in their browser (`assets/report/drop.js`) to conductor.b-promptugal's key (pki v2: RSA-OAEP 4096 + AES-256-GCM) and Dinis's person key (ws-ecies-1: P-256 ECDH, HKDF-SHA256, AES-256-GCM), and appends it to a write-only lane on dev.send.sgraph.ai. Off until the lane is named.

| Asset | Threat | Control |
|---|---|---|
| The report's text | Read in transit or at rest by anyone but the two recipients | Sealed in the browser before it leaves; the lane stores ciphertext only; the recipients' public keys come from `board/keys.json` and `board/person-keys.json` at build, published at `api/v1/report/drop.json`, and the gate requires both. |
| The reporter's identity | Collected by us | Bare page: no obs.js, no cookie, no site-wide script; `credentials: 'omit'`, `referrer: no-referrer`; the record holds the text and the minute only. The lane's server sees the connection (as any host does); we keep nothing. |
| The recipients' keys | A pusher swaps a key so reports go to them | Keys come only from the two registries; a change shows in git and in the API; open: the gate pins the two fingerprints (to do, as S33 did for sign-ups). |
| The lane | Filled with junk (the append token is public by design) | The drain keeps only records of the right kind whose envelopes open; noise is accepted (as S8). |
| The page | Script injection | Every string by `textContent`; meta CSP `script-src 'self'`, `connect-src` only 'self' and the lane's endpoint. |
| Envelopes | Unsigned (S5): a forged report | Accepted: a report is from an anonymous reader by design; it is treated as material, never instruction. |

security@ to review.
