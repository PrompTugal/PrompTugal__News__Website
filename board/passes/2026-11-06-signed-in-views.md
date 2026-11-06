---
pass: 2026-11-06-signed-in-views
goal: "Signed-in views (section 6): when a person is signed in (verified key), a switch 'normal view / <name>'s view', with features for the team (the newsroom's tools, drafts, what waits on them); each person can start shaping their own view: the start of personalisation."
owner: conductor@PrompTugal.dinis
agents: [dev, designer, sherpa, security]
budget: "3 rounds, 18 runs, 55 USD, 450k output tokens (accountant@, board/budgets.json, 6 November 06:50 UTC)"
state: open
priority: "now, at Dinis's word (13:05): the passkey and his vault first"
opened: 2026-11-06T04:50Z
---
# Pass: signed-in-views

## Opened now (Dinis, 13:05 UTC): sign in with a passkey, his vault, one experience on every device

His words: `board/guidance/2026-11-06-pt-decisions-passkey-and-the-platform.md`. Today the sign-in (`assets/login/keyring.js`, `/login/`) imports a person's key from a link into one browser's IndexedDB: each device needs its own link, and nothing he does on one device follows him to the next.

| Order | Agent | Work | Done looks like |
|---|---|---|---|
| 1 | security@ | Pre-review of the design below (what the vault holds, what the server never sees, recovery if a passkey is lost) | a go with conditions |
| 2 | dev.search@ (dev@ reviews) | **Passkey sign-in:** WebAuthn registration and sign-in on `/login/`, with the PRF extension to derive a wrapping key on the device (no server: the credential id and the wrapped vault key live in his vault's public metadata); the passkey syncs through his platform (iCloud Keychain between his Mac's browser and his iPad), so the same passkey opens the same vault everywhere. Falls back to today's key link where PRF is missing | Dinis registers a passkey on one device and signs in on another |
| 2 | dev.search@ with observability@ | **His vault:** an SG/Send vault per person (created at first passkey sign-in), holding his profile, his searches and reading history (the reader-profile pass, kept in his vault instead of one browser), and **his schedule** (the sessions and people he picks, the summit days) | what he adds on the laptop is on the iPad a moment later |
| 3 | dev.pages@ with designer@ | **His personal environment:** "Dinis's view" (the switch in this pass's goal), his schedule on the summit days, his saved companies and people, what waits on him | the best scheduling and personalisation at the event, on a phone first |
| 4 | sherpa@, synthetic@ | read it as an attendee who signs in on two devices | findings to the owners |

The same for every reader later (the reader-profile pass): a passkey and a vault of their own, nothing on our side but sealed bytes.

Queued behind the six passes opened before it; it opens when one of those closes, or sooner at Dinis's word. The shape: board/the-passes.md.

| Time (UTC) | Agent | Step | Verdict | Commit | Spend |
|---|---|---|---|---|---|
| 04:50 | conductor@ | queued | | (this file) | |
| 06:50 | accountant@ | budget set (board/budgets.json): 18 runs, 55 USD, 450k output tokens; observe mode (guidance section 15): at the budget the pass is marked over and the conductor decides | go | (budget commit) | not counted |
| 04:05 | security@ | pre-review | change: S1 first, and a signature, not a flag (board/team/security/reviews/2026-11-06-0405-wake.md) | (the commit of this review) | part of one wake |
| 14:10 | security@ | pre-review of the passkey design (Dinis, 13:05) | go, with conditions; two block the first deploy: S1 fixed, and no SG/Send token in the page (board/team/security/reviews/2026-11-06-1405-wake.md) | (the commit of this review) | part of one wake |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| The view switches on a verified signature (the keyring signs a fresh challenge, checked against board/person-keys.json), never on localStorage 'pt.me', which any page can set | security@ (pre-review) | dev@ | change |
| A static site ships every byte to every reader: nothing private may be in a 'Dinis's view' unless it arrives sealed to that person and is opened in the browser | security@ (pre-review) | dev@, designer@ | condition of go |
| S1 fixed before this pass opens: the keyring must not be callable by any script on any page | security@ (pre-review) | dev@ | change |
| Blocks the first deploy: once unlocked, the vault key lives in the page; any script on promptugal.news could read it (S1: the keyring on every page, desks/ serving any file type). The passkey page loads no script but its own, from assets/, and S1 is fixed first | security@ (pre-review) | dev@, dev.search@ | change |
| Blocks the first deploy: a static page cannot create an SG/Send vault without an access token, and that token must never ship in a page (it would let anyone create vaults and push). The design says how the vault is created (Dinis once, from a tool, or a server that only creates) | security@ (pre-review) | dev.search@, dev@ | change |
| Two ways in, always: the vault key is wrapped by the passkey's PRF and also by a second factor (a second passkey on a hardware key, or Dinis's person key, or a printed recovery code). Losing the platform account must not lose the vault | security@ (pre-review) | dev.search@ | condition of go |
| The wrap: a fixed random salt per vault for PRF, HKDF with a label, AES-GCM; the PRF output and the vault key never stored or logged; the wrapped key and credential id may be public | security@ (pre-review) | dev.search@ | condition of go |
| 'Dinis's view' switches on the vault opening (cryptographic), never on a flag; this answers my 04:05 change | security@ (pre-review) | dev.pages@ | condition of go |
| A device that leaves (lost, sold) has its wrapper removed and the vault re-keyed (sgit vault rekey), per key-rotation.md; the key link fallback is retired for Dinis once the passkey works on two devices | security@ (pre-review) | dev.search@, Dinis | condition of go |
| Readers later: one vault per reader on the vault server is a record of each reader there (id, size, times); the privacy page says so, and nothing links it to the page-view events | security@ (pre-review) | observability@, journalist@ | condition of go |
