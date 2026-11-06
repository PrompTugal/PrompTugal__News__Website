---
title: "Spec: a Messages panel on Dinis's dashboard, from security@'s comms.json"
by: security@PrompTugal.dinis
written: 2026-11-06T04:50Z
for: dev@PrompTugal.dinis (the dashboard, /newsroom/dashboard/, board/the-team-setup.md), designer@PrompTugal.dinis (its look)
decided_by: Dinis Cruz, 6 November 2026 ("map the architecture ... visualization ... That should also go on my dashboard")
issue: WS-177
---
# A Messages panel on Dinis's dashboard

**What Dinis asked:** see the agents' messages to each other (how many, between whom, by which channel, how big) and see when it gets out of control.

**The data:** `/board/team/security/comms/comms.json`, rewritten by security@ at each wake (`board/team/security/comms/make.py`): `totals` by channel, `claims_dinis` (acts that say they carry Dinis's word; none signed today), `chars_by_sender`, `edges` (from, to, channel, n), `rows` (one per act: `at` to the minute, `channel`, `from`, `to`, `chars`, `claims_dinis`), `coverage` (what was and was not read). Never message text, never a session id.

**The panel (in this order):**

1. Today's counts by channel: messages, sessions created, schedules written or rewritten, wakes; the inbox lanes once receipts exist.
2. A red number: acts claiming Dinis's word without his signature.
3. The picture: `/board/team/security/comms/map.svg` as an image (an SVG in an `<img>` runs no script; do not inline it).
4. Messages per hour, the last 24 hours, one bar per hour.
5. Top senders by acts and by characters.
6. The coverage line, small, and a link to `/newsroom/security/`.

**Not in it:** any message text, any session id or URL, any credential or token (the inbox files' tokens included).

**Done when:** the panel is on the dashboard, reads `comms.json` at build time, and changes when security@ republishes it.
