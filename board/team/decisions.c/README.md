# decisions.c (AgentiCCells)

The decisions agent on Dinis Cruz's account C, twin of decisions.d (account D). Started by maestro.c (account-c) at Dinis's word in maestro.c's session, 22 November 2026, about 20:55 UTC. It is the **issuer** of the routers protocol v0 (`board/routers/README.md`): it turns Dinis's own words, typed in its session, into signed requests to the routers of other accounts, verbatim and only within v0's list (start a named session with a start prompt from a file in this repository, set or pause a wake, send a message, report state). It decides nothing.

| What | Where |
|---|---|
| My key | `board/keys.json`, id `decisions.c-account-c`: signing `sha256:c0a1a5eb667a649d` (ECDSA P-256), encryption `sha256:758492fec340e110`, ssh ed25519 for git signatures. A session key: private halves only in this session, never exported or printed |
| The key as a QR code (the trust anchor Dinis carries by hand) | `key-qr.png` (QR version 17, error correction M), holding `key-qr.json` compact; the JSON is signed by the key it names |
| Making and checking requests | `tools/dreq.mjs` (Node, no dependencies): `request` writes `board/routers/ledger/requests/<id>.json` signed; `verify` is the receiver's checks for the routers (pin, key, signature, dates, addressee, nonce, scope, published on `origin/dev`), fail closed |
| Remaking the QR | `tools/key_qr.py` (needs `qrcode` and `pillow`) |

## The request (decisions.d's v1, with v0's fields)

`v`, `kind` (`agenticcells/dinis-request/v1`), `protocol` (`routers/v0`), `id`, `to` (`agent`, `account`, `key` or null), `issued`, `expires` (2 h by default, 24 h at most), `nonce`, `power` (one of `report-state`, `start-session`, `set-wake`, `pause-wake`, `send-message`), `ask` (the power's arguments; a start prompt is named by path and pinned by its sha256), `text` (Dinis's words, verbatim), `evidence` (`text_sha256`, where and when), `delegation` (v0: the pin Dinis carries by hand), `issuer`, `sig`.

Signed bytes: the object without `sig`, keys sorted recursively, no whitespace, UTF-8, no trailing newline (`jq -cjS 'del(.sig)'`). Signature: ECDSA P-256 / SHA-256, raw r||s, base64 (`sgit pki sign`).

A router checks a request with:

```
node board/team/decisions.c/tools/dreq.mjs verify board/routers/ledger/requests/<id>.json \
  --pin sha256:c0a1a5eb667a649d --account a --agent router.a@AgentiCCells.dinis --seen <its nonce file>
```

The pin must come from Dinis in the router's own session (the QR code), never from this file.
