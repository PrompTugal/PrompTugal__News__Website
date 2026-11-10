# Pages: the reader-facing site: EXISTS

**Domain:** `pages/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

Every reader-facing section: front page, summit and agenda, events, companies, people, organisations, places, topics, Portugal, profile, sign-in, themes, navigation.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] Front page, following the correspondent's choices (lead, order). Evidence: `newsroom/build/features/front.mjs`, `desks/correspondent/front-page.json`; first added `d5dcff89` on 2026-11-06.
- [F] Navigation and footer from data (Now, Agenda, News, Companies, People, Portugal, About; Newsroom as utility link). Evidence: `data/site/nav.json`; first added `6b9d41fb` on 2026-11-05.
- [F] Summit page and full agenda (`/summit/`, `/summit/agenda.html`). Evidence: `content/summit/index.md`, `content/summit/agenda.md`, `newsroom/build/features/agenda.mjs`; first added `dcdac37f` on 2026-11-05.
- [F] Events index and 235 event pages (211 listed in REALITY.md; now 235 folders). Evidence: `newsroom/build/features/events.mjs`, `data/events`; first added `d5dcff89` on 2026-11-06.
- [F] Companies index and 120 company profiles (REALITY.md says 109). Evidence: `newsroom/build/features/companies.mjs`, `content/companies/index.md`; first added `d5dcff89` on 2026-11-06.
- [F] People pages: 264 person entities. Evidence: `newsroom/build/features/people.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Organisations pages: 223 organisation entities. Evidence: `newsroom/build/features/organisations.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Places pages (80) and topics pages (17). Evidence: `newsroom/build/features/places.mjs`, `newsroom/build/features/topics.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Portugal section with an Algarve Evolution page and an organisations page. Evidence: `newsroom/build/features/portugal.mjs`, `content/portugal/algarve-evolution.md`, `content/portugal/organisations.md`; first added `d5dcff89` on 2026-11-06.
- [F] Algarve Evolution graph drawn as SVG on its page. Evidence: `assets/portugal/algarve-evolution-graph.svg`; first added `66f36dbd` on 2026-11-06.
- [F] Live strip on the summit days (9 to 12 November, fills from a JSON file in the browser). Evidence: `newsroom/build/features/live.mjs`, `assets/live/live.js`; first added `d5dcff89` on 2026-11-06.
- [F] 'Brief me on this page': slideshows made from a page's own data. Evidence: `newsroom/build/features/briefing.mjs`, `assets/briefing`; first added `f1b19d75` on 2026-11-06.
- [F] The reader's own profile page `/profile/` (tool profile.summary). Evidence: `newsroom/build/features/profile.mjs`, `assets/profile/profile.js`; first added `0af0e45d` on 2026-11-06.
- [F] Sign-in page `/login/` (key handed over as a QR link; noindex). Evidence: `newsroom/build/features/login.mjs`, `content/login.md`; first added `9734bfeb` on 2026-11-06.
- [F] Five colour themes with a picker; the gate checks every theme sets every token. Evidence: `assets/themes.js`, `assets/tokens.css`; first added `e22e1588` on 2026-11-06.
- [F] 404 page. Evidence: `newsroom/build/features/notfound.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Every page carries page-type and page-date meta, a version badge, a markdown twin and an agent block. Evidence: `newsroom/build/features/content.mjs`; first added `d5dcff89` on 2026-11-06.

<!-- library:generated -->
## The library's cards in this domain (generated)

1283 cards (1252 current, 0 superseded, 31 withdrawn), from the catalogue generated 2026-11-10T13:02:20Z at site v0.1.1002; by library.mjs 0.2.0, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.

| Call class | Cards |
|---|---|
| `DAT.CO` | 120 |
| `DAT.EV` | 259 |
| `DAT.ORG` | 272 |
| `DAT.PE` | 295 |
| `DAT.PL` | 85 |
| `DAT.TOP` | 17 |
| `PUB.FRONT` | 2 |
| `PUB.LIST` | 6 |
| `PUB.SITE` | 227 |

Newest five accessions:

- `ACC-20261110-0104` [Morning edition: Tuesday 10 November](https://promptugal.news/newsletter/2026-11-10-morning/) (`PUB.SITE 2026-11-10-morning`)
- `ACC-20261110-0036` [Leo Tashev and Fraser Lloyd, Student Property Network: interview at Night Summit](https://promptugal.news/interviews/student-property-network/leo-tashev-and-fraser-lloyd/) (`PUB.SITE leo-tashev-and-fraser-lloyd`)
- `ACC-20261110-0035` [Guy Ben Zvi, Buzz Messaging AI: interview at Web Summit's opening night](https://promptugal.news/interviews/buzz-messaging-ai/guy-ben-zvi/) (`PUB.SITE guy-ben-zvi`)
- `ACC-20261110-0016` [Steve Clemons](https://promptugal.news/people/steve-clemons/) (`DAT.PE steve-clemons`)
- `ACC-20261110-0015` [Sarakshi Rai](https://promptugal.news/people/sarakshi-rai/) (`DAT.PE sarakshi-rai`)
<!-- /library:generated -->

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
