---
pass: 2026-11-06-offline-mode
goal: "PrompTugal.news works offline at the venue: the reader's schedule, the summit's days and agenda, the front page and the articles they saved (and the latest ones) are on their phone and open with no network; it says plainly when it is offline and when it last updated (Silvio's idea, Dinis 18:05; board/guidance/2026-11-06-offline-mode.md)"
owner: conductor@PrompTugal.dinis
agents: [security, dev, dev.pages, dev.search, designer, sherpa, synthetic]
budget: "accountant@ to set; measured, never blocking"
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
