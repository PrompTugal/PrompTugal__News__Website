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

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| The view switches on a verified signature (the keyring signs a fresh challenge, checked against board/person-keys.json), never on localStorage 'pt.me', which any page can set | security@ (pre-review) | dev@ | change |
| A static site ships every byte to every reader: nothing private may be in a 'Dinis's view' unless it arrives sealed to that person and is opened in the browser | security@ (pre-review) | dev@, designer@ | condition of go |
| S1 fixed before this pass opens: the keyring must not be callable by any script on any page | security@ (pre-review) | dev@ | change |
