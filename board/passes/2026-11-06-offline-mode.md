---
pass: 2026-11-06-offline-mode
goal: "PrompTugal.news works offline at the venue: the reader's schedule, the summit's days and agenda, the front page and the articles they saved (and the latest ones) are on their phone and open with no network; it says plainly when it is offline and when it last updated (Silvio's idea, Dinis 18:05; board/guidance/2026-11-06-offline-mode.md)"
owner: conductor@PrompTugal.dinis
agents: [security, dev, dev.pages, dev.search, designer, sherpa, synthetic]
budget: "2 rounds, 14 runs, 42 API-equivalent USD, 350k output tokens (accountant@, board/budgets.json, 6 November 18:55 UTC); measured, never blocking"
state: open
priority: "before Monday 9 November (Opening Night): the Wi-Fi at the venue"
opened: 2026-11-06T18:08Z
---
# Pass: offline mode

| Order | Agent | Work | Done looks like |
|---|---|---|---|
| 1 | security@ | Pre-review: what is cached on the device (public pages only; nothing from a vault in the clear), the service worker's scope, and clearing it | a go with conditions |
| 2 | dev@ | A **service worker** (no dependency): the shell, the stylesheets and scripts, the front page, `/summit/` and its days, the agenda data, and the newest articles cached on first visit; network first with the cache as the fallback; a **"Save for offline"** button on every article (Cache Storage, not localStorage, so pages and images keep together); a web app manifest so it can be added to the home screen | airplane mode on a phone: the front page, the agenda and the saved articles open |
| 2 | dev.pages@ | The schedule and the summit's days as offline-first data (one JSON per day, cached); the reader's own schedule kept on the device and, once signed in, synced with their vault (`board/passes/2026-11-06-signed-in-views.md`) | the reader's schedule opens offline |
| 3 | designer@ | An offline badge ("offline, updated 14:32"), the "Save for offline" control, the list of saved articles under the reader's profile | in the brand, phone first |
| 4 | sherpa@, synthetic@ | An attendee at the venue with no Wi-Fi: what opens, what fails, what confuses | findings to the owners |

| Time (UTC) | Agent | Step |
|---|---|---|
| 18:08 | conductor@ | opened at Dinis's word |
| 18:55 | accountant@ | budget set: 14 runs, 42 API-equivalent USD, 350k output tokens; a measure, never a stop | go | (budget commit) |
| 18:15 | security@ | pre-review | go, with conditions (board/team/security/reviews/2026-11-06-1805-wake.md) | (the commit of this review) |

## Findings and decisions

| Finding | From | Owner | Decision |
|---|---|---|---|
| The service worker is the most powerful script the site can run: it stands in front of every request on promptugal.news and outlives the page. One file at the root, first-party, no import from another host; post-reviewed by security@ before its first deploy and after every change, and the gate fails a commit to it that is not dev@'s (as asked for .claude/, S15) | security@ (pre-review) | dev@ | condition of go |
| It caches public, same-origin GET responses only: never /login/, /newsroom/observability/ or any page that loads the keyring, never a response from dev.send.sgraph.ai or any vault, never anything decrypted; it serves those from the network or not at all | security@ (pre-review) | dev@ | condition of go |
| A way out, built in from the start: a 'Clear offline data' control that unregisters it and deletes its caches, and a kill switch (a small file it checks; if it says stop, it unregisters itself on every device at the next visit) | security@ (pre-review) | dev@, designer@ | condition of go |
| The reader's own schedule and saved articles stay on the device; nothing of them goes to the page-view lanes; syncing to the reader's vault only sealed, through the vault-onboarding design | security@ (pre-review) | dev.pages@, observability@ | condition of go |
| The offline badge says when the copy was made, so a stale page is never shown as current | security@ (pre-review) | designer@ | condition of go |
| 18:55 | designer@ | row 3: the offline badge and band (the copy's own time always shown), Save for offline on an article, the saved list under You with Clear offline data; phone first in C's top: board/spec-offline-mode-design.md, design/decisions/offline/ |
| Row 4, the attendee with no Wi-Fi (09:35, v0.1.492, phone): the home page, /summit/ and a saved article open offline with a clear 'Offline. This copy was kept ...' band; 'Save for offline' works. **O1 (rank 1): four of the five tabs fail offline** (Agenda, News, Companies show 'not kept'; the Agenda tab, the pass's first promise, among them); O2 any address with a query (home designs, search) gets the browser's own error page; O3 the offline page is unstyled and does not list saved articles; O4 which articles open offline is a guess; O5 the reading credit changes. `board/team/sherpa/review-2026-11-07-0930-offline-mode.md` | sherpa@ (review) | dev@, dev.pages@, designer@ | open (conductor) |
| Row 4 re-measured after round 2 (12:35, v0.1.532): O2 (query addresses) and O3 (the offline page) done. **O6 (rank 1): the tab pages and 80+ event pages are kept as `/events/`, `/articles/`, `/events/<slug>/`, but every link and the tab bar ask for `.../index.html`, which the cache does not match**: Agenda, News and Companies still land on 'Offline copies'. Match `<path>/index.html` and `<path>/` as one page in the service worker. O4 open; O5 with Dinis. `board/team/sherpa/review-2026-11-07-0930-offline-mode.md` | sherpa@ (re-measure) | dev@ | open |
| Row 4 re-measured (15:35, v0.1.572): **O6 and O1 done** (Agenda, its event pages, News, Companies open offline with the copy's time); **O4 done** ('kept' beside kept headlines and under the tabs that work offline; Search unmarked). For the reader, the pass's promise is met on Chromium; Safari (WebKit) left for synthetic@. `board/team/sherpa/review-2026-11-07-0930-offline-mode.md` | sherpa@ (re-measure) | dev@, synthetic@ | done for sherpa@; WebKit open |
