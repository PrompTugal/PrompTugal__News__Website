---
title: "The newsroom: admin becomes the newsroom, everywhere, in one move"
by: conductor@PrompTugal.dinis
written: 2026-11-06T01:00Z
decided_by: Dinis Cruz, 6 November 2026, about 00:55 UTC
issue: WS-177
---
# The newsroom: admin becomes the newsroom

**Dinis's word (6 November 2026):** the back end of PrompTugal.news is **the newsroom**, and the word has that one meaning. The publication is PrompTugal.news. Everything called admin moves to newsroom: the section at `/newsroom/`, the API at `/api/v1/newsroom/` (for example `/api/v1/newsroom/status.json`), and the files. **No redirect stubs, no legacy paths:** there are no readers yet, so old links may break.

## Who does what

| Order | Agent | The work | Done looks like |
|---|---|---|---|
| 1 | `dev@PrompTugal.dinis` | **The move, in one commit at its next run, before anything else:** `git mv` of `admin/` to `newsroom/` (build, tools, tests, `versions.json`), `assets/admin/` to `assets/newsroom/`, `data/admin/` to `data/newsroom/` and the `admin-*` schemas to `newsroom-*` (tell ontologist@ in the commit), the feature files `admin/build/features/admin*.mjs` to `newsroom*.mjs`, the section's route `/admin/` to `/newsroom/`, the API `/api/v1/admin/` to `/api/v1/newsroom/`, the nav's utility link labelled **Newsroom**, `.github/workflows/deploy-pages.yml`, `.gitignore`, the release and tag scripts, and every path in CLAUDE.md, REALITY.md, `data/README.md` and the build's README. No redirect stubs. | The gate prints OK from `node newsroom/build/validate.js`; `AGENT=dev@PrompTugal.dinis newsroom/tools/release.sh` releases; `promptugal.news/newsroom/` and `/api/v1/newsroom/status.json` answer 200; `grep -rn "admin" --exclude-dir=.git` finds only words that mean something else (and `riskmandate`), listed in the commit |
| 2 | `ontologist@PrompTugal.dinis` | After the move: the `newsroom-*` schemas' ids and `about` texts, `data/newsroom/`'s descriptions, and "newsroom" in `data/` (companies, site words in `data/site/`) meaning only the back end | Check 11 OK; no data file calls the publication "the newsroom" |
| 2 | `journalist@PrompTugal.dinis` | After the move: "the newsroom" in public copy (`content/about/`, `content/brief/`, the front page, articles' own text where it means the publication) becomes PrompTugal.news or "we"; the story of the name goes in the newsroom section (`content/newsroom/the-name.md` or where dev@ routes it), from Dinis's words or `how-we-found-our-name.DRAFT.md` once he approves it | No public page calls the publication "the newsroom"; About's title is "About PrompTugal.news" |
| 2 | `designer@PrompTugal.dinis` | After the move: the newsroom section's header and label in the brand; the design reviews (now at `/newsroom/design/...`); "newsroom" in `design/` meaning only the back end | The section reads as PrompTugal.news's newsroom, in the brand guide's type and colour |
| 2 | `observability@PrompTugal.dinis` | After the move: its tools and reports at their new paths (`newsroom/tools/obs/`, `newsroom/observability/`); the hourly drain's command follows the move | The next hourly drain runs from the new path |
| 2 | `synthetic@PrompTugal.dinis` | After the move: its runs and screenshots refer to `/newsroom/` | Its next run reads the live site at the new paths |
| 2 | `outreach@PrompTugal.dinis` | After the move: drafts link only to public pages (company pages), never to the newsroom section | No draft links into `/newsroom/` |
| 3 | `conductor@PrompTugal.dinis` | Check the move against this table at each hourly run; REALITY.md and the board | Each row marked done, with its commit |

**Until dev@'s move lands, nobody else renames anything under `admin/`.** After it, pull before you work: every path in your instructions that starts with `admin/` now starts with `newsroom/`, and CLAUDE.md has the current ones.
