---
title: "sherpa@: the restart read, 16 November 2026 (v0.1.1647)"
by: sherpa@PrompTugal.dinis (session_01Kw9UwFbJYpQ44VurDMAQJr)
written: 2026-11-16T19:45Z
---
# The cold read at restart

A reader who arrives cold, on a phone at 390 px and a desktop at 1366 px, on the live site at v0.1.1647. Screenshots: `design/shots/sherpa/restart/`. These are sherpa@'s own reading; the personas (journalist, local editor, local reader) have not yet read these pages. Owner of each fix in brackets.

| # | Finding | Owner |
|---|---|---|
| R1 (rank 1) | **`/contribute/` is still the Summit page.** Opens "starting with Web Summit Lisbon, 10 to 12 November 2026"; the seven tasks are summit tasks (write up a session, interview someone at a stand); "Your contact details are kept privately by the Web Summit team". There is no "write for your town", no place picker, nothing for a local journalist, editor or blogger. | journalist@ (words), dev.places@ (place picker) |
| R2 | **Rule 7 says "No payment, for now."** Dinis's 15 Nov word is paid from day one and the values premise is "making journalism pay". The page that recruits the partners tells them the opposite. Cannot be fixed until the price and the meter wording are settled (`api/v1/billing/meter.json`). | journalist@ with accountant@ |
| R3 | **`/values/` does not exist (404).** Plan section 3. Nothing on the site yet says "not replacing journalism". The first-screen test for it is below. | journalist@ (draft), sherpa@ tests |
| R4 | **Three positionings on one visit** (app "Lisbon Summit"; top bar "town by town"; front page "People and AI agents, reporting together"). The For Dinis page: `content/newsroom/decisions/the-positioning-subtitle-and-description.md`. | Dinis, then designer@ and dev@ |
| R5 | **Front page, phone:** the headline and a story are in the first screen (keep). But the first story is the agents' own announcement ("goes local: an AI agent for every Algarve town"), written by "the conductor, an AI agent": the reader meets the newsroom's machinery before any local news. 12.6 phone screens. | correspondent@ |
| R6 | **Place pages are very long on a phone:** `/algarve/faro/` 27.6 and `/algarve/` 29.2 phone screens (desktop 14.4 and 16.0). The first phone screen is only the mandate sentence and share buttons; the live "Now in Faro" data sits below it. Dinis's 16 Nov 10:40 word was live data up front. | designer.places@, dev.places@ |
| R7 | **Place page, jargon in the first screen:** "site identity site.faro-promptugal", "7 agents work on this page · 0 at work now", "Say it in Algarvio". A local reader does not know what a site identity is; "0 at work now" reads as broken. | designer.places@ |
| R8 | **The nav on a phone** cuts "Portugal" ("Por") and the sixth item is off-screen; the app banner takes the top bar. Minor, familiar. | dev@ |

## What to keep
- The home phone first screen: brand, one headline, one story, a button (12.6 screens against 61 in the early weeks).
- Place pages' mandate sentence: plain, says what the page is for.

## The values page test (for when the draft exists)
A journalist reads the first phone screen only and must be able to answer: do they take my work? do they send readers to me? do they pay me? A local editor must see their own outlet named as a source, not a target. Both fail if the first screen talks about agents before it talks about them. Tested on the journalist and local-editor personas as soon as journalist@ ships a draft; nothing for me to test today.

## Sent / open
- Findings R1 to R8 go to journalist@, dev.places@, designer.places@, correspondent@ and dev@ (inbox lanes; see status.json for what could be sent).
- Next three-hourly wake: persona read of R1's replacement and of `/values/` if it exists; the place pages' first phone screen after designer.places@'s round; the media pages when they ship.

## 21:30 update
- R4 done: Dinis chose "Portugal's news, town by town" (20:25); the positioning page is marked decided.
- /values/ still 404; journalist@'s draft read by two synthetic personas (journalist, local editor): readings and ranked changes are on /newsroom/decisions/the-values-page-wording/ ("What two synthetic readers said"). Not a real person's view.
- /contribute/ still the Summit copy with "No payment, for now" (R1, R2 open).

## 00:30 (17 Nov) re-measure at v0.1.1674
- **R1, R2 unchanged:** `/contribute/` still opens "starting with Web Summit Lisbon, 10 to 12 November" and rule 7 still says "No payment, for now." `/values/` still 404 (journalist@'s draft and its For Dinis page wait on Dinis; my synthetic readings are on that page).
- **R6 worse:** `/algarve/faro/` 27.6 -> 35.8 phone screens; `/algarve/loule/` 31.2. The first phone screen is still the mandate sentence and share buttons, no live data. R7's "site identity site.faro-promptugal" still shows ("0 at work now" no longer does: done). Owner: designer.places@, dev.places@.
- **New: `/media/` (Local media), 200.** First read (as a local editor would; my own reading, not a persona's): keep "Go to them first: we link, they report" and that each outlet page shows its feed and contact with the date read. M1 the list is one run of names in alphabetical order, with no place beside any outlet and no filter by town or region, so a reader from Loulé cannot find Barlavento's neighbours; M2 it carries 110 outlets (nationals and regionals mixed) with no sign of which cover the Algarve; M3 the first screen has no count or "how to be listed or corrected" line. Owner: dev.places@ (grouping by place), journalist@ (the lines). There are no per-town media pages yet (`/algarve/loule/media/` 404).
- Not re-read: whether the `/media/` outlet pages follow the first-contact rule (a published contact only, with its source page and date): security@'s.
