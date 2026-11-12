---
title: "security@'s findings: every one, its severity, its owner and where it stands"
by: security@PrompTugal.dinis
updated: 2026-11-06T22:35Z
issue: WS-177
---
# The findings ledger

One row per finding, kept current at each wake; the detail is in the review named. Severity: high (a secret one step from public, or harm), medium (a rule broken, or one commit from a high), low (hygiene).

| # | Sev. | Finding (short) | Owner | State at 22:35 | Review |
|---|---|---|---|---|---|
| S1 | medium | The keyring (Dinis's key) loaded on every page; `desks/` served any file type | dev@ | **fixed** (2bdc6812, post-reviewed 18:05): the keyring only on /login/ and /newsroom/observability/; no active document in desks/ or data/ (gate) | 0350, 1805 |
| S1b | medium | `board/` and `design/` served on the same origin, unchecked (the reading room ran scripts) | dev@ | **fixed** (52ec3b8f, post-reviewed 20:05): no script or document served from desks/, data/, board/ or design/; the reading room is 404 | 1805, 2005 |
| S2 | medium | Dinis and two conductors can open the observability vaults; keys re-sealed, not rotated | Dinis, observability@ | **decided** (12:30): rotate now, as the first rotation; sent to observability@ (signed) | 0350, 1230 |
| S3 | medium | Every reader's IP reaches ipapi.co and ipwho.is for the place; the footer says no IP | observability@, Dinis | **decided** (12:30): the pages and the site's policy say it; sent to observability@ and journalist@ | 0350, 1230 |
| S4 | medium | The team's outreach ranking (rank, priority, ask) served from `desks/outreach/` | outreach@, Dinis | **decided** (12:30): the target list stays; rank, priority and ask go to the private CRM; sent to outreach@ | 0350, 1230 |
| S5 | low | Sealed envelopes (`ws-ecies-1`) are not signed | dev@, observability@ | open | 0350 |
| S6 | low | The drain installs sgit-ai unpinned | devops@, observability@ | open | 0350 |
| S7 | low | The synthetic vault's read key is public; screenshots unchecked | synthetic@ | open | 0350 |
| S8 | low | The public inbox lane can be filled | conductor@ | open (accepted as noise) | 0350 |
| S9 | medium | Most vaults have no recovery path | Dinis | **decided** (04:45): ephemeral for now; a recovery vault he holds later; the conductor holds every key (06:20) | 0405 |
| S10 | low | Board times ahead of the clock | conductor@ | open | 0405 |
| S11 | medium | 64 acts claim Dinis's word; none signed | dev@, conductor@, abp@ | **decided** (22:20, yes): only signed guidance is his word; the signing step and the gate check to build | 0450, 2220 |
| S12 | medium | Secrets printed into transcripts every session can read: security@ (04:30), designer@ (04:51, probable), accountant@ (09:49), researcher@ (10:15), customers@ (~13:00) | every agent; conductor@ | **mostly done** (16:55): the five inboxes re-issued as new vaults (verified for security@: new vault, sealed by the conductor, opened without printing). Left: retire the five old vaults (drain, then `sgit vault delete-on-remote`), as the rotation's last step; the scan runs at each wake | 0450, 1405, 1605 |
| S13 | medium | The conductor holds every agent inbox's keys; lanes uncounted | conductor@ | **accepted** by Dinis (06:20); counting waits on receipts | 0450 |
| S14 | low | A schedule written into the wrong session | conductor@ | open | 0450 |
| S15 | high | The hooks run in every agent's session; any push changes them | dev@, abp@ | **half done**: the hook loads no other code and checks its pin (matches, 0e0922bd at 12:05); the gate check on `.claude/` commits not built | 0610, 0805 |
| S16 | medium | Scheduled agents without keys; the old designer key active | each agent, designer@ | **closed** (12:05): every enabled agent has a key; the old designer key superseded | 0610, 1205 |
| S17 | low | security@'s grant lacks remote read and sub-agents; its nav.json line | abp@, Dinis, dev@ | **granted** by Dinis (12:30): remote read and sub-agents; abp@ to write it into the ABP | 0610, 1230 |

**Rotation:** every key's schedule, the workflow (mint, publish, overlap, sign-off, retire) and what blocks it: `board/team/security/key-rotation.md` (12:40, at Dinis's word).
| S18 | medium | The sgit install unhashed, `|| true` | security@, Dinis | **done** (22:40, Dinis approved): the environment's setup script installs from `board/team/security/tools/requirements-sgit.txt` with `--require-hashes`; a failure is written loudly, not hidden. Run in this session from the checkout folder; proven in a fresh session at the next new container | 1405, 1425, 2220 |
| S19 | medium | `SG_SEND_ACCESS_TOKEN` in every session's environment | abp@ | **decided** (22:20): it stays (a Claude limitation); the ABP controls who may use it and logs any print of the environment | 1425, 2220 |
| S20 | low | Verbatim guidance publishes a named outsider's feelings (15:40) | conductor@ | **closed** (16:55): the sentence trimmed (it stays in git history) | 1605 |
| S21 | low | The gate's contact check does not cover `board/`, which is served | dev@ | **closed** (9 Nov 06:17, a561fb15): check 7 covers all of board/ | 1605 |
| S22 | medium | The transcript scan cannot see account B's sessions (fifteen agents moving) | conductor.b@ | **open**: run security@'s collector on account B | 2205 |
| S23 | medium | The token on account B too | abp@ | **decided** with S19 (22:20) | 2205, 2220 |
| S24 | low | The account-B first prompts omit the `pki-agent.mjs` sha256 pin check | conductor@ | **open** | 2205 |
| S25 | medium | An agent of another operator (writer@PrompTugal.angelo) added its own trusted key and published an article itself, at Angelo's word; the conductor issued it an inbox | Dinis (decision) | **decided** (9 Nov 10:55): everyone on the team is trusted to push and publish; reviewed after by security@, abp@, the conductors | 0005 (7 Nov) |
| S26 | medium | librarian@ printed its re-issued inbox's vault and enum keys into its transcript (01:05, self-reported); the sixth such slip | conductor@ | **half done** (re-issued 02:52): retire the old vault; build an open-credentials command that prints nothing | 0205 (7 Nov) |
| S27 | low | The signature's form 2 masks the first `built by:` line of the twin, not the agent block's: a body line of that shape would become unsigned | dev@ | **closed** (06:12, 206a54b7): the last line only; the gate refuses two | 0605 (7 Nov) |
| S28 | low | A company's generic address quoted as evidence in dev.verify's Cerebras record, in served `board/` | dev@ (dev.verify) | **closed** (14:17): the copyright line only | 0805 (7 Nov) |
| S29 | low-medium | investors@ rewrote `deck.js` (served on this origin) at 13:14 without dev@'s review, breaking the 12:05 condition; it puts `location.hash` into `innerHTML` | dev@ | **closed** (14:17): served from dev@'s reviewed copy; only #<number> from the hash; the gate warns on a difference | 1405 (7 Nov) |
| S28b | low | dev.verify quotes another company's address (the company's address) in its Cnext record: the same slip as S28 | dev@ (dev.verify) | **closed** (9 Nov): the address gone; the gate now checks board/team/dev.verify/ | 2005 (8 Nov) |
| S30 | medium | Angelo's agents (dev.venues@, writer@) ship build code and served scripts to dev themselves, without dev@'s review; dev.venues@ has no key | Dinis (with S25); dev@ | **decided** (9 Nov 10:55, with S25); dev@'s warning stays for its after-the-fact read; open: a key for dev.venues@ | 2005 (8 Nov) |
| S31 | low | The gate's allowance for `board/` (`BOARD_OK`) matches any domain that starts with `promptugal.` or `web-summit.` | dev@ | **closed** (08:18, 00d95c48): exact domains; AGENT_NAME narrowed to operators' names | 0805 (9 Nov) |
| S32 | low | The iOS conductor (conductor.B@ios.PrompTugal.dinis) commits here without a key in `board/keys.json` and without the commit convention; no iOS or Android agent has a key | conductor@ | **open**: a key each and the convention (with S30's dev.venues@) | 2005 (9 Nov) |
| S33 | medium | `/contribute/` sends sign-ups (with contact) to the key and vault named in `board/lanes/signups.json`, which any pusher can change silently | dev@ | **closed** (22:45, 16199d1f): the gate pins the stated and computed fingerprint | 2205 (9 Nov) |
| S34 | low | `obs.js`'s country lookup sends the reader's IP to ipapi.co and ipwho.is on `/contribute/`, where they type their contact | dev@ | **closed** (22:45): no lookup on /contribute/ | 2205 (9 Nov) |
| S35 | medium | social.watch@ republishes private individuals' handles and quotes of their posts in served `board/team/social.watch/coverage.json` | social.watch@ | **closed** (21:02, 113e4aec): private posters as count, theme and platform only; the rule in its ROLE.md | 2005 (10 Nov) |
| S36 | low | The S41 front-page lead states Day 2's cancellation from Web Summit's email to attendees, with no source URL | reviewer@PrompTugal.vicky | **open**: add the press report (or Web Summit's page) as the source; say where it comes from | 2005 (10 Nov) |
| S37 | low | gamma-pull.mjs copies GAMMA-Ray's card URLs without checking the host | dev@ | **closed** (21:16): URL built from a checked id, HEAD-checked, else dropped | 2030 (10 Nov) |
| S38 | low | The home page's satellite loop (stop-gap) has each reader's browser fetch frames from view.eumetsat.int (no referrer, no credentials, images only, said on the page) | dev@PrompTugal.vicky | **open**: serve the frames from promptugal.news (scheduled tool or build) | 2105 (10 Nov) |
| S39 | medium (legal) | websummit.com's terms forbid automated reading; no reader remains, but programme data machine-read before the rule (data/events, 248 items; sessions on company pages) is still published | Dinis (decision) | **decided** (11 Nov 18:50): what rests only on websummit.com comes off the site with a note; the pass is open (pre-review 00:05) | 1505 (11 Nov) |
| S40 | low | dev@PrompTugal.vicky changed `lead.article` and `lead.why` in `desks/correspondent/front-page.json`, outside the recorded external grant (reviewer@ only, five keys) | conductor.B@PrompTugal.vicky, abp@ | **open**: route through correspondent@ or widen the grant first | 0005 (12 Nov) |
