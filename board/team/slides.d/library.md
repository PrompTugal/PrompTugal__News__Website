# Library of past decks (slides.d (account-d)); links and lessons, not copies

Read 22 November 2026. Each line: where it is, what it was, what to keep.

## Decks

| Deck | Where | Format | Audience, date |
|---|---|---|---|
| Investor decks 0 to 9 (map, case, industry, platform, Algarve, investment, technology, join us, do it yourself, tour) | `board/team/investors/decks/` (sources, `README.md`, `FACTS.md`, `deck.js`, `tools/decks.mjs`); live at https://promptugal.news/investors/decks/ | HTML 1920x1080, layout in `src/<deck>.tpl`, words in `i18n/<deck>/<lang>.json`, PDFs in EN, PT, ES, FR | investors and partners, 7 Nov 2026 |
| How the nine decks fit | `board/team/investors/site/articles/nine-decks-one-story.en.md` | article | reading order per audience |
| Algarve Evolution, connected (data deck) | `newsroom/build/features/data-decks.mjs`, `assets/query/decks.json`; live under `/query/decks/` | every slide an SQL query run at build | a meeting, 16 Nov 2026 |
| "Brief me on this page" | `newsroom/build/features/briefing.mjs`, `assets/briefing/briefings.json`, `board/passes/2026-11-06-page-presentations.md` | short slideshow from a page's data | any reader |
| Studio storyboards | `board/team/studio.d/storyboard-format/`, `player/` | storyboard JSON to a narrated player | 22 Nov 2026 |
| The Ultimate Insider talk | https://the-ultimate-insider.presentation.sgit.ai/talk/player.html; how it works: https://newsroom.sgit.ai/articles/the-scripted-talk.md, https://newsroom.sgit.ai/articles/the-ultimate-insider-case-study.md | 58 slides from one `talk.json`; beats with times and words; P presenter, R rehearse | Dinis's talk |
| Algarve Evolution site deck, SovereignWebsite deck (Factory `board/deck/`) | not read: repository access refused in this session (asked of Dinis) | | |

## What Dinis asked of decks (his words, from the record)

- "really well designed, mature and effective ... super professional"; "it needs to tell a story" (`board/team/investors/dinis-2026-11-07-the-decks.md:8-9`).
- "a player, customised for multiple decks"; a live tour that can "show a page, zoom out, point, put a little square, a little arrow"; "separation between code and data" (`dinis-2026-11-07-phase-two.md:29-33`).
- On the first set: "That deck is amazing ... Let's go live." (`dinis-2026-11-07-go-live-and-structure.md:9`).

## What worked

- One facts file that is the only source a deck may state (`decks/FACTS.md`); words kept out of the layout from the start (cheap translations, a key check).
- Builders briefed with a design system, the facts sheet, a reference deck and a required render-and-look loop: about 15 minutes per good deck (`board/team/investors/debriefs/2026-11-07-handover.md:38,55`).
- Synthetic readers of the target role caught real contradictions and a missing wedge (`board/team/investors/synthetic-investors/findings-2026-11-07*.md`).
- The talk's single data file feeding slides, script and slide list, so they cannot drift.

## What failed (and the rule it made here)

- Script inside SVG did not render reliably: static SVG only.
- Live-site screenshots leaked team names: check every screenshot for names before it goes in.
- Overflow checks missed text spilling out of SVG boxes: look at every rendered slide.
- Blank PDF pages from a stacked view's margin: `template/pdf.mjs` fails when the PDF page count differs from the slide count.
- 118 MB of PDFs in every deploy, about 401 MB into git in a day (`board/team/devops/debriefs/2026-11-08-handover.md:14`): never commit PDFs; build or publish them outside git.
- Typed wordmark, off-palette accents, small captions (`board/spec-investor-decks-brand.md`): the brand's logo file and palette, from the designer.
- A player put `location.hash` into `innerHTML` (security finding S29): the template takes only a slide number from the address.

## HTML or the claude.ai Slides artifact

| | HTML template (`template/`) | Slides artifact type |
|---|---|---|
| Lives | any static site, in git, signed commits | claude.ai, private link, shareable |
| Export | PDF by `pdf.mjs`; PNGs | PPTX and PDF from the page; video |
| Editing | an agent edits the file | a person edits in the browser; comments |
| Motion | any CSS or JS, builds, presenter window | CSS motion, reveal.js-style fragments, no script |
| Data | can read JSON or a query at build | fixed content per slide |
| Fits when | it must publish on a site, use live data or screenshots of the site, or be reviewed in the repository | the reader wants to edit in PowerPoint, or comment slide by slide |
