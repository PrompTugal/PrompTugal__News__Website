# The build: a small core, a shell, and features

`node admin/build/build.mjs` turns the prose (`content/`) and the data (`data/`) into the site: every page as HTML
with a markdown twin, `llms.txt`, `sitemap.xml`, `robots.txt` and the JSON API under `/api/v1/`. Node 18+, no
dependencies. Everything it writes is gitignored and listed in `.generated.txt`; files an earlier build wrote and
this one did not are deleted. `node admin/build/validate.js` (the gate) builds once and checks the result; it must
print OK before every commit.

## The parts

| File | What it is | Who edits it |
|---|---|---|
| `build.mjs` | the core: loads content, data and features, runs the phases below, writes everything | rarely; a new feature never needs to |
| `lib/config.mjs` | paths, the version, the host, `data/site/site.json` and `data/site/nav.json`, `TODAY`, `DAY()`, `gitDate()` | rarely |
| `lib/markdown.mjs` | the markdown subset (headings with ids, paragraphs, lists, tables, quotes, code, links) and front matter | rarely |
| `lib/shell.mjs` | **the page shell**: the HTML head (with `page-type` and `page-date`), the dateline, the masthead, the nav, the footer, the scripts, the agent block, and the twin's frame. Templates only: no data logic, no file access | the design agent, with `assets/site.css` |
| `lib/content.mjs` | reads `content/**/*.md` into page objects (drafts skipped) | rarely |
| `lib/data.mjs` | reads `data/<type>/<slug>/` into the store (`ctx.store`), merging a company's five files | when a new entity type is added |
| `lib/derive.mjs` | the derivation: desks' files plus hand-edited data into the derived entity files (see `data/README.md`) | when the desks' formats change |
| `lib/companies-map.mjs` | the team's company map into a company folder (public fields only) | when the team's map changes shape |
| `lib/graph.mjs` | the whole graph in the ontology's grammar, and its views (company, event, person, industry, summit, people) | when a verb or a view is added |
| `lib/present.mjs` | markdown helpers for entity pages: links between entities, a source with its date, times | as needed |
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

A feature is one file, `admin/build/features/<name>.mjs`, plus, if it needs them, its own `assets/<name>/` folder.
Every export is optional except that a feature must export at least one of them.

```js
export const order = 50                 // where it runs; ties by file name. content 10, articles 20, agenda 25,
                                         // companies 30, events 40, people 50, organisations 55, topics 60,
                                         // places 65, api 80, versions 90, 404 99
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

## Adding a feature, step by step

1. Write `admin/build/features/<name>.mjs` with `pages` (and whatever else it needs). Put its CSS and JS in
   `assets/<name>/`.
2. If it has a section in the navigation, add **one line** to `nav` in `data/site/nav.json` (`id`, `label`, `href`,
   `match`); if its pages need their own heading in `llms.txt`, one line to `llms_groups`. A page that is not
   linked from anywhere is an orphan and the gate refuses it: the nav line, a `fill` marker placed in the prose, or a
   link from another page is how it is reached.
3. If it writes JSON, return it from `api`; give it a schema in `data/schemas/` if other agents will rely on it.
4. If it has rules of its own, return their failures from `validate`.
5. `node admin/build/validate.js` must print OK.

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
