# The build: a small core, a shell, and features

`node newsroom/build/build.mjs` turns the prose (`content/`) and the data (`data/`) into the site: every page as HTML
with a markdown twin, `llms.txt`, `sitemap.xml`, `robots.txt` and the JSON API under `/api/v1/`. Node 18+, no
dependencies. Everything it writes is gitignored and listed in `.generated.txt`; files an earlier build wrote and
this one did not are deleted. `node newsroom/build/validate.js` (the gate) builds once and checks the result; it must
print OK before every commit.

## The parts

| File | What it is | Who edits it |
|---|---|---|
| `build.mjs` | the core: loads content, data and features, runs the phases below, writes everything | rarely; a new feature never needs to |
| `lib/config.mjs` | paths, the version, the host, `data/site/site.json` and `data/site/nav.json`, `TODAY`, `DAY()`, `gitDate()` | rarely |
| `lib/markdown.mjs` | the markdown subset (headings with ids, paragraphs, lists, tables, quotes, code, links), the two layout hooks (below) and front matter | rarely |
| `lib/shell.mjs` | **the page shell**: the HTML head (with `page-type` and `page-date`), the dateline, the masthead, the nav, the mount points, the footer, the scripts, the agent block, and the twin's frame. Templates only: no data logic, no file access. See "The look" below | the design agent, with `assets/site.css` |
| `lib/content.mjs` | reads `content/**/*.md` into page objects (drafts skipped) | rarely |
| `lib/data.mjs` | reads `data/<type>/<slug>/` into the store (`ctx.store`), merging a company's five files | when a new entity type is added |
| `lib/derive.mjs` | the derivation: desks' files plus hand-edited data into the derived entity files (see `data/README.md`) | when the desks' formats change |
| `lib/companies-map.mjs` | the team's company map into a company folder (public fields only) | when the team's map changes shape |
| `lib/graph.mjs` | the whole graph in the ontology's grammar, and its views (company, event, person, industry, summit, people) | when a verb or a view is added |
| `lib/present.mjs` | markdown helpers for entity pages: links between entities, a source with its date, times, and `slotLine`/`slotList` (an event as an agenda line) | as needed |
| `lib/schema.mjs` | a small JSON Schema validator (the subset `data/schemas/` uses) | rarely |
| `lib/datacheck.mjs` | the data's checks: schemas, references, derived files fresh | when a new file kind is added (one line in `KINDS`) |
| `lib/writers.mjs`, `lib/versions.mjs`, `lib/features.mjs`, `lib/ids.mjs` | writing files, the release history, loading features, slugs and name keys | rarely |
| `checks.mjs` | the gate's module-based checks (data, and each feature's `validate`) | never for a feature |
| `validate.js` | the gate | when the estate's rules change |
| `features/*.mjs` | one module per section of the site | **this is where new work goes** |

## The phases

1. **Load**: the content (`ctx.content`), the store (`ctx.store`), every feature in `features/` (sorted by `order`,
   then by name).
2. **Pages**: every feature's `pages(ctx)`, in order. A page made twice is an error.
3. **Decorate**: every feature's `decorate(page, ctx)` runs on every page (the articles feature adds the byline).
4. **Defaults**: each page gets its `section` (the first `nav` entry in `data/site/nav.json` whose `match` fits its
   path), its `group` for llms.txt (the first `llms_groups` entry that fits), `type` (default `site`), `date` (front
   matter `date`, else the source file's last commit, else today) and crumbs (default: the title alone).
5. **Fill**: every `<!-- name -->` marker in a page's markdown is replaced by the feature that offers `fill[name]`.
   A marker nobody fills is an error.
6. **Write**: each page through the shell (`htmlPage`) and as its twin (`twinPage`).
7. **API**: every feature's `api(ctx)` files are written; then `api/v1/search-docs.json` (every feature's
   `searchDocs(ctx)`) and `api/v1/manifest.json` (every API file, its size, SHA-256 and schema).
8. **Agent surface**: `llms.txt` (pages by group, then every feature's `llms(ctx)` text), `sitemap.xml`,
   `robots.txt`. Then the old files are cleaned up and `.generated.txt` written.

## The feature contract

A feature is one file, `newsroom/build/features/<name>.mjs`, plus, if it needs them, its own `assets/<name>/` folder.
Every export is optional except that a feature must export at least one of them.

```js
export const order = 50                 // where it runs; ties by file name. content 10, articles 20, front 22,
                                         // agenda 25, companies 30, events 40, people 50, organisations 55,
                                         // topics 60, places 65, portugal 68, live 70, api 80, versions 90, 404 99
export const name = 'search'            // default: the file name

export function pages(ctx) { return [page, ...] }        // may be async
export function decorate(page, ctx) {}                   // runs on every page, after all pages exist
export const fill = { 'search:box': (page, ctx) => md }  // fills <!-- search:box --> in any page's markdown
export const assets = { css: ['assets/search/search.css'], js: ['assets/search/search.js'] }   // on every page
export function api(ctx) { return [{ path: 'api/v1/search/index.json', data: obj | string, schema: 'name' | null }] }
export function searchDocs(ctx) { return [{ id, url, title, type, date, text }] }
export function llms(ctx) { return '## Search\n- ...\n\n' }               // appended to llms.txt
export function validate(gate) { return ['problem', ...] }               // run by the gate after the build
```

**A page object:**

| Field | Required | Meaning |
|---|---|---|
| `rel` | yes | its path, e.g. `search/index.html` (the twin is the same path with `.md`) |
| `title`, `summary` | yes | the `<h1>` and the lead; both also go to `llms.txt` and the twin |
| `md` | yes | the body, in markdown; links to other pages point at their `.md` twins (`ctx.link(from, to)` makes one) |
| `type` | no | `article`, `company`, `event`, `person`, `organisation`, `topic`, `place`, `story`, `evidence`, `site`, `account` (default `site`): `<meta name="page-type">`, for the billing meter |
| `date` | no | `YYYY-MM-DD`, when its content last changed: `<meta name="page-date">` |
| `src` | no | the source file it comes from (its git date is the default `date`) |
| `section` | no | a nav `id`; default from `data/site/nav.json` |
| `group` | no | its heading in `llms.txt`; default from `data/site/nav.json` |
| `crumbs` | no | `[[href or null, text], ...]` |
| `assets` | no | `{ css: [], js: [] }` for this page only |
| `listed` | no | `false` keeps it out of `llms.txt` and `sitemap.xml` (the 404) |
| `layout` | no | `wide` uses the grid's full width instead of the reading column (prose pages: front matter `layout: wide`); company, organisation, topic and place pages and the front page are wide already |
| `toc`, `twinMd`, `postHtml`, `absolute` | no | a table of contents of its own; a different markdown for the twin; a function over the rendered body HTML; absolute links (the 404) |

Every page gets, from the core, without asking: the shell, a markdown twin, the version badge, the agent block, a
line in `llms.txt`, a `<url>` in `sitemap.xml`, and the gate's checks (links resolve, no orphan, canonical, twin,
agent block, page-type and page-date).

**`ctx`** holds: `ROOT`, `R(path)`, `readJSON`, `readText`, `exists`, `VERSION`, `HOST`, `BASE`, `REPO`, `AGENT`,
`OPERATOR`, `TEAM_SITE`, `SITE` (`data/site/site.json`), `NAV` (`data/site/nav.json`), `TODAY`, `DAY(date)`,
`gitDate(path)`, `md` (`esc`, `slug`, `cell`, `inline`, `render`, `frontMatter`), `link(fromRel, toRel)`,
`content` (the prose pages), `store` (the data: `companies`, `events`, `people`, `organisations`, `places`,
`topics`, `stories`, `evidence`, `ontology`, `matching`, and `get(ref)`, `has(ref)`, `eventOfUrl(url)`),
`graph()` (the whole graph, built once: `nodes`, `edges`, `node` map, `outOf(id, verb?)`, `inOf(id, verb?)`),
`features` (the names), and, from phase 4 on, `pages`; in `llms`, also `api`.

**`gate`** (in `validate`) holds the same paths and constants, plus `generated` (the set of files the build wrote),
`json(path)`, `text(path)` and `sha256(string)`.

## Search and link previews (`lib/seo.mjs`)

The shell calls `seoHead(page, site)` in every page's `<head>`: robots, Open Graph, the Twitter/X card, the RSS link, and JSON-LD (the organisation and the site on the front page, `NewsArticle` on an article, `BreadcrumbList` from the page's `crumbs`). The build writes `sitemap.xml` (with `lastmod` from each page's date), `news-sitemap.xml`, `feed.xml` and `robots.txt` from the same module.

- **An article's image** (its mini infographic, its link preview, its Google Discover image): front matter `image:` (a repository path such as `assets/articles/<slug>.png`, or an absolute URL; 1200x630 is best, at least 1200 wide for Discover), `image_alt:`, and optionally `image_width:` and `image_height:`. Without one: `assets/brand/social-card.png`.
- **Out of search:** `noindex: true` in a page's front matter, or `page.noindex` from a feature; `/login/` and the 404 by default. Such a page is left out of `sitemap.xml`, and the gate allows that.

## The page tool API (`window.__tool`)

Every page publishes its commands on `window.__tool` (`assets/core/tool-api.js`, loaded first by the `tools` feature), for the chat, for agents driving a browser and for the reader's console. A feature adds a tool without caring about load order, by pushing to a queue that works before and after the registry has loaded:

```js
(window.__toolQueue = window.__toolQueue || []).push(['register', 'graph.focus', {
    level: 'view',                     // read (data, no side effects) | view (moves the page) | author
    description: 'Select a node and centre it.',
    params: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },   // JSON Schema
    run: async (args, ctx) => ({ focused: args.id }),
}])
```

`__tool.list()`, `__tool.call(name, args)` (checks the level and the arguments, and logs), `__tool.log()`, `__tool.schemas({ levels })`. The chat offers the model every tool registered at the moment of each request, at the levels the reader allows. The core tools, the contract in full and the helpers (`window.NRSite`: the site root, `fetchJSON`, the mount points `#nr-tools`, `#nr-pane`, `#nr-live`) are in `assets/core/README.md`. A tool's result should be compact (refs, labels, a few fields, the page and API addresses): it goes into a model's context.

## Adding a feature, step by step

1. Write `newsroom/build/features/<name>.mjs` with `pages` (and whatever else it needs). Put its CSS and JS in
   `assets/<name>/`.
2. If it has a section in the navigation, add **one line** to `nav` in `data/site/nav.json` (`id`, `label`, `href`,
   `match`); if its pages need their own heading in `llms.txt`, one line to `llms_groups`. A page that is not
   linked from anywhere is an orphan and the gate refuses it: the nav line, a `fill` marker placed in the prose, or a
   link from another page is how it is reached.
3. If it writes JSON, return it from `api`; give it a schema in `data/schemas/` if other agents will rely on it.
4. If it has rules of its own, return their failures from `validate`.
5. `node newsroom/build/validate.js` must print OK.

Nothing else is edited: the generated HTML, twins and `/api/` are already ignored by `.gitignore` (all HTML and all
markdown outside the source folders), and the gate's first check refuses any ignored file the build did not write.
A throwaway feature (a page, a stylesheet, an API file, a search document, a check and one nav line) was built and
passed the gate this way on 5 November 2026.

## Data features and entity pages

The entity features (`companies`, `events`, `people`, `organisations`, `topics`, `places`) read `ctx.store` and
`ctx.graph()`; they never read `desks/` (the derivation does, see `data/README.md`). An entity's page path is fixed
by the ontology (`data/ontology.json`, `types[].page`), and the `api` feature checks that every entity with a page
has it, and has its API file. The navigators on a page are paths in the graph: a company's "Related companies"
says, on each line, the event or the field that joins the two.

## The look: the shell, the stylesheet, the layout hooks

The design is `design/README.md` (newsroom-designer@web-summit.dinis, 5 November 2026): the direction, the tokens, every
component with the HTML it expects. On the site it is:

| File | What it holds |
|---|---|
| `lib/shell.mjs` | the dateline (place, date, countdown, edition, utility links), the nameplate (our tile mark, the name, the motto, "Powered by" with RiskMandate's mark), the sections, the three mount points, the footer columns, the independence line |
| `data/site/site.json` | the words: `name` (**the one place the name is set**), `motto`, `place`, `countdown` (with `day1`), `endorse` (label, name, link, mark), `promise`, `independence`, `disclosure`, `ears` (the front page's two boxes), `footer_note` |
| `data/site/nav.json` | `nav` (the sections), `utility` (Newsroom: shown in the dateline and the footer only once its page exists), `footer` (links with a `column`), `llms_groups` |
| `assets/site.css`, `assets/tokens.css`, `assets/fonts.css` | the stylesheet (one file), the tokens (light and dark), the three faces (Newsreader, IBM Plex Mono, IBM Plex Sans, all SIL OFL, in `assets/fonts/`) |
| `assets/brand/` | `mark.svg` (our tile, the favicon) and `riskmandate-mark.svg` (RiskMandate's mark, copied unchanged from riskmandate.ai; never redrawn or recoloured) |

The shell gives `<body>` the classes `type-<page-type>` and, on the front page, `page-front`, so a page type can be
styled without new markup.

### Layout hooks (markdown in, components out)

The markdown has no HTML, so a feature asks for a component with two hooks. Both are removed from the markdown twin
(`stripHooks` in `lib/markdown.mjs`), so the twin stays plain text.

- `::: name other` on its own line opens `<div class="name other">`; a line `:::` closes it. They nest.
- `{.name .other}` on its own line gives the next block (list, table, paragraph, quote, code) those classes.

| Hook | Use | Where it is used now |
|---|---|---|
| `{.agenda}` before a list of `- **14:00** [Title](event) *Tue 10 Nov, until 14:20 · Place · extra* \`Our pick\`` | an agenda: a time column, the title, a meta line, tags. `slotLine(ctx, rel, event, { day, place, extra, tags })` and `slotList(lines)` in `lib/present.mjs` write it | front page, events, every entity page's sessions |
| `{.agenda .cols}` | the same, in two columns on a wide screen | front page, around the summit |
| `{.facts}` before a `\| \| \|` table | a record: labels in small capitals, values in the serif | company, person, organisation, place, topic, event |
| `{.rows}`, `{.rows .links-cols}` | a list as hairline rows; in 2 or 3 columns for long lists of names | people, organisations, places, companies by field |
| `{.sources}` | the sources list: each line with a ↗, in the sans | every "Where this comes from" |
| `::: navigator n3` (or `n2`) with `::: nv` around each section | the navigator: sections side by side, each a small-capitals label and rows | company (at the summit, people, related), event (speakers, companies) |
| `::: cols-8-4` or `::: cols-2` with `::: col` around each column | two columns, main and rail or equal | events (official, other), Portugal, the front page's Portugal band |
| `::: front-top` with `::: a-lead`, `::: a-agenda`, `::: a-latest` | the front page's top: lead, now and next, latest (phone order: lead, now and next, latest) | `content/index.md` |
| `::: seg-links` around a paragraph of links | a segmented bar (days) | events |
| `::: staffbox` around a heading and a `{.staff}` table | the editors' masthead box | `content/about/index.md` |
| `{.lens}` before a numbered list | the reach, mandate, gap questions | front page, company pages |
| `{.kicker}`, `{.lead-hed}`, `{.dek}`, `{.meta-line}`, `{.fig-thumb}` (on a code block) | a lead story | `front:lead` |
| `{.field-list}`, `{.chip-list}`, `{.more-line}`, `{.mini-h}`, `{.rm-lockup}` | field tiles with counts, chips, a "more →" link, a small label, RiskMandate's mark beside its name | front page, Portugal, RiskMandate |

### Mount points (for the features that run in the browser)

The shell renders these on every page, empty. A feature fills them from its own `assets/<name>/` script (listed in its
`assets.js`, which the shell loads on every page with `<script defer>`; `assets.css` the same with `<link>`):

```html
<!-- in the top bar, right of the sections (inside nav.site .row) -->
<div class="tools" id="nr-tools"></div>
<!-- under the sections; assets/live/live.js fills it from 9 to 12 November only -->
<div id="nr-live" data-start="2026-11-09T09:00:00Z" data-end="2026-11-12T18:00:00Z"></div>
<!-- after the page frame, before the footer: the right-hand pane root -->
<div id="nr-pane" hidden></div>
```

What goes in them, already styled in `assets/site.css` (the HTML for each is in `design/README.md`, section 5):

- **`#nr-tools`**: each feature appends its own button, in this order: search `<a class="tool" href="…search/" aria-label="Search">svg<span class="tool-label">Search</span><kbd>/</kbd></a>`; the credit `<a class="tool meter" href="…account/">£5.00<span class="meter-label">&nbsp;credit</span></a>` (`.is-low` below £1); Ask `<a class="tool ask" href="#chat">svg Ask</a>` (hidden on a phone: the chat feature also appends `<a class="ask-fab" href="#chat">svg Ask</a>` to `<body>`); Vault `<a class="tool" href="…">Vault</a>`. The container is hidden while empty.
- **`#nr-pane`**: the chat puts `<aside class="chat" aria-label="Ask the newsroom">…</aside>` in it, removes `hidden`, and adds `chat-open` to `<body>` (from 1000px the page makes room for the 400px pane; below 768px it is a full-screen sheet). The vault pane is `<aside class="pane">…</aside>` in the same root. One pane at a time.
- **`#nr-live`**: filled by `features/live.mjs` + `assets/live/live.js` from `api/v1/live/agenda.json`; `?now=2026-11-10T11:52` on any page shows a given moment.
- **Search**: `.search` (the box), `.search-pop` with `.sp-group`/`.sp-item` (the instant dropdown), `.results`/`.res` (the results page).
- **The graph explorer**: `.gx` with `.gx-bar`, `.gx-canvas`, `.gx-side`; graph marks `.g-edge`, `.g-node` with `.n-co`, `.n-person`, `.n-session`, `.n-topic`, `.n-place`; `.dim` for what is not selected.
- **Billing and the vault**: `.balance-card`, `.ledger`, `.meter-line` (one line on every article), `.pane` with `.pane-tabs`, `.pane-body`, `.steps`, `.kv`.
- **Newsroom views**: `<dl class="stats">` (figure tiles), `{.dense}` tables, `.chip.ok`, `.chip.warn`, `.chip.fail` for states; the page joins the nav through the `utility` line in `data/site/nav.json` (`newsroom/index.html`), which shows "Admin" in the dateline and the footer once that page exists.
