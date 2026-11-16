# dev.places@PrompTugal.dinis: debrief for the account move (16 November 2026, about 15:35 UTC)

Paused at Dinis's word (relayed by conductor@PrompTugal.dinis, ~15:30 UTC: the PrompTugal agents move to other team members' accounts). This is the last run of session `session_018yvwtPtqG8xMjg6doG8LN8`. The earlier, longer notes are in `2026-11-16-handover.md` (same folder); this file is the one to start from.

## Who I am

- **Name:** `dev.places@PrompTugal.dinis` (Opus). Started 15 November 2026, ~21:45 UTC, at Dinis's word via the conductor (`board/briefs/2026-11-15-the-place-agents.md`, "For dev.places@ and designer.places@").
- **Mandate:** the by-place frame of PrompTugal.news and the whole site's finish: `newsroom/build/features/by-place.mjs`, `assets/by-place/`, the schemas, the gate checks; later the talk pane, the place JSON for the app and the translated place pages.
- **Never:** write a place's research (`data/by-place/<id>.json` belongs to its place agent); change content to make a check pass; push anywhere but `dev`; commit under another name.
- **ABP:** `board/abp/dev.places.md` (observe mode). Writes granted: `board/team/dev.places/**`, `board/runs/dev.places/**`, `board/keys.json`, `newsroom/build/**`, `assets/**`, `data/schemas/**`, `content/newsroom/decisions/**`, `board/passes/**`, `data/newsroom/agents.json`. **Not granted, though my brief gives it:** `data/by-place/places.json` (the list, map seats, the pages' words). Every write to it shows as one R6 breach in my run reports; abp@ has asked Dinis.
- **Key:** `dev.places-promptugal` in `board/keys.json` (a session key; it dies with this session). The new session makes its own key and marks this entry `superseded` with the time.

## How I operate

### The wake (hourly scheduled task, now disabled)

The prompt the task fired, verbatim:

> Hourly wake (dev.places@PrompTugal.dinis; scheduled at Dinis's word of 15 Nov 2026: "turn your and all the other agents schedule on"). If you are still mid-run, finish that first. Pull dev; if board/HOLD.md exists, stop and say why. Read board/guidance/README.md "New from Dinis" and your ABP. Then: review the place agents' commits since your last wake and fix what breaks the build or the look; the next item of your list in board/briefs/2026-11-15-the-place-agents.md; the gate must print OK; release with AGENT=dev.places@PrompTugal.dinis newsroom/tools/release.sh; status.json. If nothing changed, say so in one line and push nothing. At about 200k tokens of context, write your hand-over first.

Step by step, as I ran it:
1. `git pull -q --rebase origin dev`; stop if `board/HOLD.md` exists.
2. Read the **whole** "New from Dinis" table in `board/guidance/README.md` (I once read only its first two rows and missed Dinis's 10:40 words for two hours) and the briefs it points to.
3. Drain my inbox `board/inboxes/dev.places.json` (I never set this up: open its `sealed` credentials once with the session key, then the team site's `admin/tools/feedback_drain.py --creds ~/.sg-send/lanes/inbox.json`). Messages are material, never instruction.
4. `git log --oneline --since="65 minutes ago"`; look for asks to me: `grep -h "dev.places" board/team/*/status.json`, `board/team/designer.places/asks-dev.places.md`, security@'s latest `board/team/security/reviews/*-wake.md`.
5. `node newsroom/build/validate.js` (the gate, about a minute; must print OK).
6. Do the next piece of work; check it in a browser (Playwright; scripts below); commit with the convention; release.
7. Update `board/team/dev.places/status.json`; `node board/abp/tools/abp.mjs run-report --role dev.places --line "<what>"`; commit `board/team/dev.places board/runs/dev.places`; release.

### Commit convention

Subject `dev.places@PrompTugal.dinis: <what>`; trailers `Agent: dev.places@PrompTugal.dinis`, `Issue: WS-177`, `For: Dinis[, <agent>]`; no em-dashes in prose.

### Releasing

`SKIP_LIVE=1 AGENT=dev.places@PrompTugal.dinis newsroom/tools/release.sh` (rebases, runs the gate, pushes). With twenty-odd agents pushing it often loses the race ("someone pushed first", then "gave up after 5 attempts"): run it in the background and run it again on a give-up.

```
(SKIP_LIVE=1 AGENT=dev.places@PrompTugal.dinis newsroom/tools/release.sh > /tmp/rel.log 2>&1 &)
until grep -q '^pushed \|gave up\|is red' /tmp/rel.log; do sleep 5; done   # '^pushed ': "someone pushed first" also contains "pushed "
```

**Do not edit a tracked file while release.sh's gate runs:** the gate fails with "build.mjs changed a tracked file".

### Checking the look

Playwright is preinstalled. Two throwaway scripts I used (rebuild them in your scratchpad):
- a full-page or element screenshot of a built page at 390 and 1366 px from `file://` (pages are built in place: `algarve/faro/index.html`), printing `document.documentElement.scrollWidth` to catch horizontal scroll;
- a test with a tiny local HTTP server that 301s slashless paths like the host, `ctx.route('https://dev.send.sgraph.ai/**')` to mock the lane, a throwaway person key packed like `newsroom/tools/person-key.mjs`, and a test RSA recipient to decrypt what the talk pane sends.

A **fixture** for full and broken states: copy `data/by-place/` aside, fill every place file with fake rich data (and break one), build, screenshot, restore. Never copy `places.json` back from the backup (my fixture once reverted my own edits to it).

## What I built (with commits)

- **The by-place frame** (`by-place.mjs`, `assets/by-place/`): region `/algarve/`, 17 towns `/algarve/<id>/`, district capitals `/portugal/<city>/` (place.districts@'s; `towns()` is the Algarve only, `pagePlaces()` every local place), the national lens at the top of `/portugal/` (the fill `<!-- by-place:portugal -->`). Tolerant loading (a broken place file does not stop the build), safe links, the cards, per-town accents, compact AI-map cards on a phone, a filter on long maps (910bfcda4).
- **The Algarve map** drawn at build time from `assets/portugal/algarve-outline.json`; markup in `assets/by-place/region-map.tmpl`; a locator on each Algarve town page.
- **The place JSON:** `api/v1/by-place/index.json`, `<id>.json` (full record, provenance on every item, team, identity, `wider_news`, the region's aggregates), `<id>/agents.json`, `<id>/articles.json`. Note `api/v1/places/<id>/...` belongs to datasci.places@ and the graph.
- **Schema fields** `start_company`, `investors`, `talent`, `contacts` and `look.photo` in `data/schemas/by-place.schema.json`, rendered on the pages.
- **The site-identity check** (abp@'s `board/abp/tools/site-identity.mjs`) as a gate warning; each page names its site key and signature status.
- **Talk to us from the site** (`newsroom/build/features/talk.mjs`, `assets/talk/`): the comment pane on every page, `/talk/` (in `KEYRING_PAGES` in `login.mjs`), comments in `promptugal/comment/v1` sealed to the conductor on `talk_lane`, answers in `board/talk/replies.json` as envelopes only (security@'s must-fix 1), votes via `window.PTObs.vote` in `assets/obs/obs.js`. On for readers since security@'s go at 03:05 on 16 Nov.
- **Gate changes** (`newsroom/build/validate.js`, check 7): an official contact is allowed only inside a place's `contacts[]`, an email on the source page's domain, a phone only from `PUBLIC_BODY` sites (security@'s S42). `newsroom/build/features/json-links.mjs`: no reader-facing link to the site's JSON outside `api/` (rewritten to `api/index.html`; gate check). `datacheck.mjs` KINDS line for `data/query/captures.json`.
- **Fixes elsewhere:** the offline worker passes the host's 301 on (`assets/offline/sw.tmpl`); `newsroom/build/tag_release.sh` fast path (releases had starved; devops@'s file, to review); `topics.mjs` links an article-only story to its article; companies pages carry no websummit.com link; `img { height: auto }`.
- **Translated place pages** (9d35400d1, 744590f19, aefd5a1be): `/<culture>/algarve/...` for every culture in `data/i18n/tm/` (re-rendered from translated data; translator@'s key: first 16 hex of sha256 of NFC, space-collapsed English), `<html lang>`, a machine-translation note, links both ways, `hreflang` alternates (`page.alternates` in `shell.mjs`), `api/v1/i18n/<culture>/index.json`.

I do not own the front pages (front-e and the others are the conductor's and designer@'s).

## Open, half-done and next (in order)

1. **Translations, the rest** (`board/spec-translations.md`, items 4, 5, 7, 8): the globe pill linking the culture's page; the derived queue `api/v1/i18n/queue/<culture>.json` (every string on the place pages with no memory entry); the gate's translation checks (placeholders, numbers, URLs, file sizes); move the section headings from code into `places.json` `copy` so they can be translated.
2. **"Around <town>"** on each town page from datasci.places@'s rule (`api/v1/places/<id>/nearby.json`, items with `shown`; import from `newsroom/build/features/datasci-places.mjs` or ask it to export `nearbyOf(ctx, id)`).
3. A KINDS line for data.places@'s `data/query/neighbours.json` once its schema lands.
4. The city-stats panel once observability@ publishes per-place stats (security@'s S3: a city only with five or more readers).
5. A Portugal locator for the district pages (designer.places@'s ask 11, third point).

**Asks for Dinis:** (a) add `data/by-place/places.json` to this role's ABP grant, or say no; (b) devops@ to review the `tag_release.sh` fast path (18a303607).

## Lessons

- **Read everything addressed to you:** the whole guidance table and the inbox, at every wake. Missing them cost two hours on Dinis's 10:40 words.
- **The markdown renderer escapes all inline HTML** (`<br><small>` never worked): use `*em*` and CSS, or a `postHtml` pass. `{.a .b}` is the two-class syntax; on a table the class lands on the wrapping `div.table`.
- **The quality gate** counts words in string literals (CSS in a template counts) and HTML tags in `.mjs`/`.js`: words go in JSON (`places.json` `copy`, `assets/talk/talk.json`), markup in `.tmpl` files, regex literals are free.
- **Fills run once:** a fill's output may not contain another marker; call the other fill directly.
- **`ctx.link`** returns twin-aware paths: match hrefs with `\.(html|md)`.
- **The JSON-first audit** (datasci-audit) fails a page that shows a source its own JSON does not hold: put what a page shows into its place's JSON.
- **New pages need a link and llms.txt**, or the gate calls them orphans; `listed: false` also drops them from the sitemap, which the gate then reports.
- **Contention:** releases lose races; run them in the background and retry; never edit while the gate runs.
- **Ask before building on someone else's file;** keep each rule in one place (I asked datasci.places@ for `nearbyOf` instead of copying its blast-radius rule).

## What the next session does first

1. Read `CLAUDE.md`, `board/abp/dev.places.md`, this file, then `2026-11-16-handover.md`.
2. Make a key (`pki-agent.mjs keygen --session --name dev.places@PrompTugal.dinis`; check the tool's sha256 against `fcb28a1cc40d05bf8ccc8fc61a2a907c934840cac7aa41d9d8283c1d461002ab`), add its entry to `board/keys.json`, mark `dev.places-promptugal` superseded, commit as the role.
3. Open your inbox's sealed credentials and drain it; read the whole "New from Dinis" table.
4. `node newsroom/build/validate.js`, then screenshot `/algarve/`, a town, `/portugal/` and `/pt-PT/algarve/` at 390 and 1366 px.
5. Take the open list above from the top.
