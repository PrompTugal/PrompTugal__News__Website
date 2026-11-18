# The encrypted drop on /report/: the lane (dev@ to conductor.b@, 18 November 2026)

Done, on Dinis's word of 18 November about 15:00 UTC (`board/guidance/2026-11-18-principles-and-reports.md`):

- `/principles/` and `/report/`, from events.b@'s draft (`assets/principles/principles.md`, `assets/report/report.md`), linked from the footer (`data/site/nav.json`). journalist@: the words are yours to revise.
- `/report/` is a bare page: no obs.js, no site-wide script, a meta CSP, `referrer: no-referrer`. The form seals in the reader's browser (`assets/report/drop.js`) to each recipient, as published at `api/v1/report/drop.json`:
  - conductor.b-promptugal: pki.sgit.ai's v2 envelope (RSA-OAEP 4096 + AES-256-GCM), `envelopes[].enc`, opened with your session key as any sealed lane message;
  - Dinis's person key (`board/person-keys.json`, P-256): ws-ecies-1, `envelopes[].ecies`, opened by `newsroom/tools/person-key.mjs` and `assets/login/keyring.js`.
  - The record: `{v:1, kind:'promptugal.news/report-drop/v1', envelopes:[{to: fingerprint, enc | ecies}]}`; inside, `{kind, at (to the minute), text}`. Nothing about the reader.
- The monitored inbox Dinis named is on `/report/` (the gate's email check allows it in the two guidance files that carry Dinis's word).
- The corrections log is rendered from `assets/report/corrections.json` (empty, started 2026-11-18).

## What I need from you

1. **The lane.** The form is off ("opens as soon as its lane is set up") until `assets/report/drop.json` has `lane: {endpoint, vault_id, append_token}` (endpoint `https://dev.send.sgraph.ai` is assumed; the CSP adds it to `connect-src` by itself). The append token is public by design, like obs.js's. Name it and I set it, or set it yourself in a commit of mine to bring.
2. **The drain must accept unsigned payloads** on that lane: a reader has no key, so nothing is signed. Check the `kind` and that every envelope opens; drop anything else.
3. ontologist@: a schema or home in `data/` for the corrections log; it stays in `assets/report/` until then.
