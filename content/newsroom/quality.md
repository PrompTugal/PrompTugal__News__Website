---
title: Code and data
path: newsroom/quality/index.html
summary: "Where PrompTugal.news mixes code with its words and its data, measured at every release, and the plan to separate them: every word a reader reads in markdown, every fact, label and list in JSON, and code that only loads, extracts, transforms and saves."
---
## Why {#why}

Dinis Cruz, 6 November 2026: "we really need to move to a point where all of the content is either in JSON or markdown files. So they are easy to maintain, and you have a mode where the website can be maintained quite nicely." This page is the map of where we are not there yet, the rule the gate now holds us to, and the order of the work. It is kept by dev@PrompTugal.dinis.

## What the estate already does {#estate}

- **One press, several sites, data apart** ([php.oct.2026.newsroom.sgit.ai](https://php.oct.2026.newsroom.sgit.ai/llms.txt), its split of 25 October 2026): the site's words are markdown in each site's `content/`; every data file is JSON in its own repository's `files/`, each with a schema and immutable versions; the build, the gate and the assets live in a "press" that holds neither words nor facts, and `sites.json` says which site owns which pages. Each repository has its own gate, in seconds.
- **Single source of truth, by structure** ([coding.sgit.ai](https://coding.sgit.ai/llms.txt)): a figure on a page is written in by a generator from the data file that holds it, and the release fails if one has drifted; the rule pages are generated from `rules.json`.
- **Generate or date every number** ([nfrs.sgit.ai](https://nfrs.sgit.ai/llms.txt)): no figure is typed by hand; each is computed, or carries the date it was measured.
- **LETS** ([sgit.ai](https://sgit.ai/llms.txt)): Load, Extract, Transform, Save. State is files; each pass loads what it needs, extracts a slice, transforms it in a disposable engine and saves the answer as new files that the next pass, or the reader's browser, starts from.

## Where we are {#now}

<!-- quality:totals -->

Our build already has the right shape in places. The prose pages (`content/*.md`) carry fill markers (an HTML comment naming a feature's filler) that features fill with what only the data can say: the front page, the companies index and the agenda work this way. The data is JSON with a schema for every kind of file (`data/schemas/`, checked by the gate), and derived files are made by one tool. What is left is the prose and the lookup tables that grew inside the code.

### The files that hold the most prose {#files}

<!-- quality:files -->

### What kinds of mixing there are {#kinds}

1. **Page prose inside build features.** Whole sections of text are template strings in `newsroom/build/features/`: the newsroom section, the graph explorer's page, the account and billing pages, the API page, the chat and search pages, observability, and the fixed blocks of every company page (our questions for them, about PrompTugal.news). These belong in `content/` as markdown, with a fill marker where a number or a list goes.
2. **Lookup tables inside code, some of them twice.** Labels for kinds of event (in the agenda, events and search features, three times), organisers (twice), the plural of each entity type (once for the build, once for the browser), the newsroom's tabs, pipeline stages and people, beats, topic kinds, the chat's models and suggested questions, the search's hand list of synonyms, and the summit's four days in the live strip, which `data/site/site.json` already knows. These belong in one data file each, with a schema, read by the build and served to the browser from the same place.
3. **Words of the browser components.** The observability view, the chat, the vault and the sign-in panel carry their messages in their scripts. Their markup is the component's job; their words can be a JSON file beside the data the component reads.
4. **Who-made-this as prose.** Each article ends with a paragraph naming its desk, its reviewer, its storyline and its checks. Those are facts about the article: as front matter (`story`, `desk`, `reviewed_by`, `review`, `draft`), the build can write the paragraph and the graph can use them.
5. **The shell's markup** (`newsroom/build/lib/shell.mjs`) is the template, and markup is what a template is for; its words already come from `data/site/site.json`. It stays.

## The target {#target}

| Where | What it holds | What it never holds |
|---|---|---|
| `content/` | every word a reader reads, as markdown with front matter; fill markers where the data speaks; layout hooks (`::: name`) where the design needs a box | numbers typed by hand, lists that the data already has |
| `data/` | every fact, label, list and setting, as JSON with a schema in `data/schemas/` | prose a reader reads as a page |
| `newsroom/build/`, `newsroom/tools/` | code that loads, extracts, transforms and saves; the gate | sentences longer than a label; facts |
| `assets/` | components: behaviour and markup | words a reader reads, beyond a button's label |
| generated (`api/`, the pages, their twins) | what the build saved, never committed | anything a person edits |

Every feature becomes a LETS cycle: load its data and content, extract what it needs, transform it into one model, save the model as an API file, and render the page from that same model, so the page and the API cannot disagree. [What the desks are doing](../desks/index.md) is the first feature written this way from the start (its words are `content/newsroom/desks.md`; `newsroom/build/features/desks.mjs` only fills the markers and saves the model). The sign-in page is the first moved: its words left `login.mjs` for `content/login.md`.

The day the site splits the way the PHP site did (one press, a site per audience, a data repository), this separation is what makes it a move of folders, not a rewrite.

## The rule the gate now holds {#ratchet}

The gate measures every code file at every release (`newsroom/build/lib/codedata.mjs`: the string literals of eight words or more, and the HTML tags in strings) and refuses a file that holds more than its line in `newsroom/build/quality-baseline.json`. A new file may hold almost none. The lines only go down: after moving words out of a file, `node newsroom/tools/quality-baseline.mjs` lowers them to what the files hold now. Raising one is possible, in the open: `--accept <file> --why "<reason>"` keeps the reason in the baseline, for a reviewer to read in the commit.

## The order of the work {#plan}

| # | Work | Who |
|---|---|---|
| 1 | The newsroom section's words to `content/newsroom/` (the largest builder of pages), each page a markdown file with markers | dev@ |
| 2 | The graph, account, billing, API, chat and search pages' words to `content/`; the company page's fixed blocks to `content/companies/` | dev@ |
| 3 | One labels file (`data/site/labels.json`, with its schema): kinds, organisers, plurals, beats, stages, tabs; the build and the browser's tools read it, and the copies go | ontologist@ (the schema), dev@ (the readers) |
| 4 | The browser components' words to JSON beside their data; who may drain from the key register (a role on the person's key), not a list in the script | dev@, observability@ |
| 5 | The live strip's days from `data/site/site.json` | dev@ |
| 6 | Who made each article as front matter, the paragraph written by the build | journalist@ (the fields), dev@ (the paragraph) |
| 7 | Each feature as a LETS cycle with its model saved under `api/v1/` | dev@ |
| 8 | When Dinis says so: the split into a press, the sites and a data repository | Dinis, then dev@ |

Progress shows above at every release: the totals fall as the work lands, and the gate keeps them from rising again.
