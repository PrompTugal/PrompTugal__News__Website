# Publication: brand, about, policies, articles, SEO and feeds: EXISTS

**Domain:** `publication/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

The brand identity v2.0, the about pages, the brief, the domain, the articles and their signatures, link previews, feeds and sitemaps.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] Brand identity v2.0 guide (the one spelling PrompTugal.news; wordmark, PT.news stamp, PT favicon). Evidence: `design/brand/Promptugal-Brand-Guide.pdf`, `design/brand/brand-tokens.css`; first added `fe1d2012` on 2026-11-06.
- [F] Brand assets in use: wordmarks (light, dark), PT.news stamps, favicons, touch icons, 1200x630 social card. Evidence: `assets/brand/social-card.png`, `assets/brand/mark.svg`, `assets/brand/pt-news-stamp-light.svg`; first added `fe9f4989` on 2026-11-06.
- [F] Site identity data (name, tagline, mandate fields). Evidence: `data/site/site.json`; first added `6b9d41fb` on 2026-11-05.
- [F] About page. Evidence: `content/about/index.md`; first added `4c3b0999` on 2026-11-04.
- [F] Editorial board page (REALITY.md 'Not yet' still says there is none: see changelog). Evidence: `content/about/board.md`; first added `d6177a06` on 2026-11-06.
- [F] Participant disclosure (`/about/participant.html`, the estate's standard). Evidence: `content/about/participant.md`; first added `4c3b0999` on 2026-11-04.
- [F] RiskMandate page (claims limited to riskmandate.ai and the team's site). Evidence: `content/riskmandate.md`; first added `c10e1f1f` on 2026-11-05.
- [F] The brief in full, as 10 pages plus index, and its corrections. Evidence: `BRIEF.md`, `BRIEF-CORRECTIONS.md`, `content/brief/index.md`; first added `4c3b0999` on 2026-11-04.
- [S] Domain promptugal.news (CNAME in the repository; DNS and HTTPS checks recorded by conductor@ and dev@, S). Evidence: `CNAME`; first added `4c3b0999` on 2026-11-04.
- [F] Link previews and search-engine markup: robots, Open Graph, Twitter card, JSON-LD (NewsMediaOrganization, WebSite, NewsArticle, BreadcrumbList). Evidence: `newsroom/build/lib/seo.mjs`; first added `fe9f4989` on 2026-11-06.
- [F] Feeds and sitemaps generated at every build: `sitemap.xml` (lastmod), `news-sitemap.xml`, `feed.xml` (RSS, latest 50), `robots.txt`. Evidence: `newsroom/build/lib/seo.mjs`; first added `fe9f4989` on 2026-11-06.
- [F] Articles: 20 signed articles, 20 `.sig` files under `articles/` (a 21st `.sig` signs the newsroom note on the sign-in), each with front matter title, date, author, summary, status, license. Evidence: `content/articles/index.md`, `content/articles/the-first-night-of-promptugal-news.md`, `content/articles/web-summit-before-2026.md`; first added `4c3b0999` on 2026-11-04.
- [F] Article signing tool (form twin-without-version/1, survives releases) and the gate's signature check against board/keys.json. Evidence: `newsroom/tools/sign-article.mjs`, `newsroom/build/signed-form.cjs`; first added `2b1955c9` on 2026-11-06.
- [F] Articles listing page `/articles/`. Evidence: `newsroom/build/features/articles.mjs`; first added `d5dcff89` on 2026-11-06.
- [S] Legal company (The Cyber Boardroom, UK) and prices in pounds: recorded as Dinis's decision (S). Evidence: `REALITY.md`; first added `4c3b0999` on 2026-11-04.

<!-- library:generated -->
## The library's cards in this domain (generated)

42 cards (42 current, 0 superseded, 0 withdrawn), from the catalogue generated 2026-11-07T07:00:34Z at site v0.1.464; by library.mjs 0.2.0, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.

| Call class | Cards |
|---|---|
| `GEN.BRIEF` | 11 |
| `PUB.ART` | 31 |

Newest five accessions:

- `ACC-20261107-0011` [Who does the work: six people and their 93 agents](https://promptugal.news/articles/who-does-the-work.html) (`PUB.ART who-does-the-work`)
- `ACC-20261107-0010` [Rio sends ten startups to Lisbon, with Gol paying the tickets](https://promptugal.news/articles/rio-ten-startups-to-lisbon.html) (`PUB.ART rio-ten-startups-to-lisbon`)
- `ACC-20261107-0009` [Three mistakes our agents made, and the rules they left](https://promptugal.news/articles/mistakes-we-made.html) (`PUB.ART mistakes-we-made`)
- `ACC-20261107-0008` [How our agents talk: commits, inboxes and signed keys](https://promptugal.news/articles/how-the-agents-talk.html) (`PUB.ART how-the-agents-talk`)
- `ACC-20261107-0007` [Many agents, one newsroom: how they avoid collisions](https://promptugal.news/articles/how-agents-avoid-collisions.html) (`PUB.ART how-agents-avoid-collisions`)
<!-- /library:generated -->

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
