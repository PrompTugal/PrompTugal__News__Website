# datasci.places@PrompTugal.dinis: debrief for the account move, 16 November 2026

Written at the conductor's relay of Dinis's word (16 Nov, about 15:30 UTC: pause every PrompTugal agent for the move to
other team members' accounts, each writing a detailed debrief first). This session stops after this commit. Everything
here is public: no key, token, vault key or credential, no contact detail.

## 1. Who I am and my mandate

- **Role:** `datasci.places@PrompTugal.dinis`, the data scientist of PrompTugal.news. Started 15 November 2026 at Dinis's
  word through the conductor: "everything here very data science driven, and everything accessed from JSON. There's
  nothing in HTML"; "add a REST API and a Swagger ... every locality should have a Swagger for that locality ... these GET
  calls are what the visualizations should be using". His words: `board/guidance/2026-11-15-json-first-rest-api-and-swagger.md`.
- **ABP:** `board/abp/datasci.places.md` (v1.13.0 when I stopped; abp@ owns it). Observe mode. Grant (writes):
  `board/team/datasci.places/**`, `board/runs/datasci.places/**`, `board/keys.json`, `data/newsroom/agents.json`,
  `board/passes/**`, `content/newsroom/decisions/**`, `newsroom/build/features/openapi*.mjs`,
  `newsroom/build/features/datasci-*.mjs`, `assets/swagger/**`, `assets/vendor/swagger-ui/**`, `assets/datasci/**`,
  `data/schemas/datasci-*.schema.json`, `content/datasci/**`. Sends: `dev.send.sgraph.ai` only (agents' inboxes).
- **I own:** the JSON-first audit; every place as GET endpoints; the OpenAPI 3.1 specs (site and one per place) and the
  Swagger pages; two gate checks; the data quality numbers and the dashboard; the blast radius endpoints.
- **I never:** write another agent's paths, load a CDN at runtime, vendor a library without a pinned version, its hashes
  and security@'s pass, change a schema I did not create, push anywhere but dev, or send outside my grant.

## 2. What exists (all live on promptugal.news)

| What | Where | Code |
|---|---|---|
| Per place REST root and resources | `api/v1/places/<id>/{index,page,stories,ai-map,events,sources,agents,provenance,quality,nearby}.json` | `newsroom/build/features/datasci-places.mjs` (order 84) |
| All places' quality, the tree of significance | `api/v1/places/quality.json`, `api/v1/places/tree.json` | same |
| Every article as data | `api/v1/articles.json`, `api/v1/articles/<slug>.json` | same |
| The site spec and one per place | `api/v1/openapi.json`, `api/v1/places/<id>/openapi.json` | `newsroom/build/features/openapi.mjs` (order 98, in `final`) |
| The JSON-first audit | `api/v1/datasci/audit.json` | `newsroom/build/features/datasci-audit.mjs` (called from openapi's `final`) |
| Swagger pages | `/api/swagger/`, `<place path>api/` (36 places) | openapi.mjs `pages()`; UI `assets/vendor/swagger-ui/5.33.3/` (unedited npm `swagger-ui-dist@5.33.3`, integrity and hashes in its VENDOR.md); loader `assets/datasci/swagger-page.js`, style `swagger-page.css` |
| Quality dashboard | `/datasci/` | openapi.mjs `dashboard()` |
| A note on every place page linking its API page | decorate in openapi.mjs | words in `assets/datasci/words.json` |
| Schemas | `data/schemas/datasci-place-index`, `datasci-quality`, `datasci-quality-all` | |
| Words (kept out of code for the quality gate) | `assets/datasci/words.json` | read via `words(ctx)`, filled with `fillW` |

How the pieces work:
- **datasci-places.mjs** reuses by-place.mjs's own `api()` records (imported), so the page and the JSON cannot drift. It
  derives everything from `data/by-place/places.json` and each place's `data/by-place/<id>.json`; a new place gets all
  endpoints, a spec and a Swagger page with no work (19 places at start, 36 at the end).
- **page.json** mirrors the sections by-place.mjs draws (gravity, local, ours, region, map, events, weather, figures,
  sources, gaps, how). If dev.places@ changes the page composition, page.json may fall behind; the gate rule below catches
  new outside links that no JSON holds.
- **nearby.json** reads data.places@'s `board/team/data.places/neighbours.json` (borders from pt.wikipedia at a named
  revision, km between seats; CAOP check owed by data.places@) and each story's `significance` (local, neighbours,
  region, country, beyond) as the place agents mark it, applying the rule in `board/briefs/2026-11-16-blast-radius.md`.
  Each item: from, km, adjacent, distance in words ("Faro, 15 km"), significance, shown, why.
- **openapi.mjs** groups every file in `ctx.api` into paths: a directory that repeats (`a/<id>/c.json`, three or more)
  becomes `{id}`, a name that repeats in one directory becomes `{slug}`; each parameter lists every value as an enum (so
  Swagger shows a dropdown). Response schema: `data/schemas/<name>` when the file names one (refs rewritten to
  `#/components/schemas/...`), otherwise inferred from up to 60 files and marked `x-inferred`. A real example cut to size.
  data.places@'s own summaries come from `api/v1/data/openapi.json` (`x-words`, `x-values`). Files made in other
  features' `final` (sw.js, deploy-exclude.txt, manifest.json) are listed by hand in `FINALS`; static assets in `STATIC`
  (the Algarve outline, for ios.places@).
- **Swagger UI** runs with `validatorUrl: null` (no call to validator.swagger.io), GET and HEAD only, servers rewritten to
  the page's own origin.

## 3. The gate checks I added

1. **openapi `validate`:** the vendored files' SHA-256 match VENDOR.md; `api/v1/openapi.json` is OpenAPI 3.1; every file
   in the manifest matches a path (templated values must be in the enum); every concrete path in a place spec was built.
2. **datasci-audit `validate`:** a by-place page (the `bp-frame` div only) may link out only to URLs some JSON for that
   place holds: any `api/v1/` file with a segment `<id>` or named `<id>.json`, plus the shared list `SHARED`
   (`api/v1/by-place/index.json`, `api/v1/viz/agents.json`, `assets/viz/cast.json`). URLs are folded (trailing slash,
   http/https, commit links to nine hex digits and lower-case repo, URLs inside prose count). A new panel on place pages
   that links out from a new file fails the gate until the file is named for the place or added to `SHARED`.

## 4. How I operate (the wake loop)

The scheduled task (paused now; trigger `trig_01M7ivjYcXoAzoCpgZS1DSBY`, hourly at about :08) sent:

> Hourly wake (datasci.places@PrompTugal.dinis; looped at Dinis's word of 15 Nov 2026). If you are still mid-run, finish
> that first. Pull dev; if board/HOLD.md exists, stop and say why. Read board/guidance/README.md "New from Dinis" and your
> ABP. Then one more pass: the JSON-first audit (fix gaps with dev.places@), the OpenAPI specs and Swagger (site and every
> locality) in step with what is served, the gate checks, data quality per place; the gate must print OK; release with
> AGENT=datasci.places@PrompTugal.dinis newsroom/tools/release.sh; status.json. If nothing changed, say so in one line and
> push nothing. At about 200k tokens of context, write your hand-over first.

Step by step:
1. `git pull --rebase origin dev`; stop if `board/HOLD.md` exists.
2. Read the whole "New from Dinis" table in `board/guidance/README.md`, and `grep -l datasci` over guidance and briefs
   changed since the last wake (assignments arrive in briefs: I missed the live collector for twelve hours by reading only
   the top rows). Re-read my ABP's write paths before moving any file.
3. `node newsroom/build/validate.js` (two to four minutes now; run in the background and wait on the process).
4. Read `api/v1/datasci/audit.json` summary and `api/v1/places/quality.json` summary.
5. If something is mine to do: edit in my paths, rebuild, gate, update `board/team/datasci.places/status.json`,
   `node board/abp/tools/abp.mjs run-report --role datasci.places`, commit as myself
   (`git -c user.name="datasci.places@PrompTugal.dinis" ...`, subject `datasci.places@PrompTugal.dinis: <what>`, trailers
   Agent, Issue: WS-177, For), then release.
6. **Releasing:** `AGENT=datasci.places@PrompTugal.dinis newsroom/tools/release.sh` gives up after five push attempts
   when dev is busy (each attempt reruns the gate). I loop it up to eight rounds in the background, checking
   `git merge-base --is-ancestor HEAD origin/dev` after each, and never push any other way (R5). Its "your commit is in
   vX" line can be wrong (it matches the number): check a new URL with curl after the next deploy.
7. Nothing changed: say so in one line, push nothing.

Inbox: `board/inboxes/datasci.places.json` exists; I could not drain it (the drain, the team site's
`admin/tools/feedback_drain.py`, is in a repository this session could not reach). Messages reached me through the
conductor's session (send_message); my two replies by send_message were outside my grant (recorded, see asks).
No sub-agents.

## 5. State

- **Done (commits on dev):** key `c18b24f7f`; first release `0f8bc436a` (endpoints, specs, Swagger, audit, gate checks,
  quality); grant moves `9c059e842`, `5f7c8c04f`; blast radius `8f1fe610b`; distance label and debrief `3c5b3b0e3`; no
  JSON links for readers `e7394bd06`.
- **Half-done / open:**
  - The live collector (`board/tools/local-now.mjs`: IPMA and adsb.lol around Faro, writing `data/by-place/now/<place>.json`,
    served by someone else's feature at `api/v1/by-place/<id>/now.json`, already in my spec): given to me by Dinis's
    guidance of 16 Nov 00:55 and `board/briefs/2026-11-16-live-data-up-front.md`, but outside my grant (write paths and
    hosts). The conductor runs it until the grant changes. More keyless sources per place wait on the same grant.
  - viz.places@'s `/agentic-system/` had links no JSON held (358 at 01:20); the site-wide share rose to 95% by 15:00.
  - security@'s pass on the vendored Swagger UI: asked in commits, not seen.
  - page.json follows by-place.mjs's composition by hand: re-check when dev.places@ changes the place page.
- **Asks for Dinis (status.json):** the grant for the collector; a way to drain my inbox; whether send_message replies
  to the conductor are acceptable (two were sent on 15/16 Nov).
- **Numbers at the end:** 36 places, 1,018 facts, median quality score 93.5; 95% of outside links site-wide held in JSON;
  by-place pages 0 missing.

## 6. Lessons

- **JSON first works best when the feature reuses the page's own data function.** Never re-implement another feature's
  cleaning.
- **The build's phases matter:** pages are written before `api()`, and `final` sees `ctx.api`. Anything that needs every
  API file (the spec, the audit) goes in `final`, and other features' `final` outputs must be listed by hand.
- **The quality gate** (features/quality.mjs) refuses prose and HTML tags in code strings above a baseline; vendored code
  is skipped only under a folder named `vendor/`. Words go in a JSON file; keep tags in code to four or fewer.
- **piece-flows needs git history:** a shallow clone fails the gate; `git fetch --unshallow origin dev` first.
- **The grant changed three times overnight** (assets/swagger, assets/vendor/swagger-ui, assets/datasci). Check it
  before moving files; I moved them twice into paths that were not (or no longer) granted.
- **Comparing URLs is subtle:** slashes, schemes, short commit hashes and URLs inside prose all differ between pages and
  JSON; the audit folds them, and the gate is only as good as that folding.
- **The release race:** with a long gate and twenty-plus agents, release.sh loses often. Loop it; never bypass it.
- **Don't trust "your commit is in vX":** the CI number may belong to the commit before yours. Check a URL that only
  your commit creates.
- **Swagger UI:** `value` and `externalValue` in one example are mutually exclusive (it shows a resolver error); turn the
  validator off; rewrite servers to the page's origin so "Try it out" works on any host.

## 7. Identity and secrets

- My key: `datasci.places-promptugal` in `board/keys.json` (encryption fingerprint `sha256:75d5acf723332fb2`, signing
  `sha256:943b31bbe841bc1a`), made with `pki-agent.mjs keygen --session` (the copy with sha256
  `fcb28a1cc40d05bf8ccc8fc61a2a907c934840cac7aa41d9d8283c1d461002ab`). The private halves live only in this session's
  `~/.sg-send/keys` and end with it. No site keys, lanes or vaults of mine.
- **The new session must make its own key** and add a new entry to `board/keys.json`, marking this one `superseded` with
  the time (CLAUDE.md, "Handing a role to a new session").

## 8. What the next session must do first

1. Read CLAUDE.md, `board/abp/datasci.places.md` (its grant today), this debrief and `status.json`.
2. Clone, then `git fetch --unshallow origin dev` (the gate needs history).
3. Make its key (`pki-agent.mjs keygen --session --name datasci.places@PrompTugal.dinis`), add it to `board/keys.json`,
   supersede `datasci.places-promptugal`, commit as the role; work notes in `board/team/datasci.places/sessions/<id>/`.
4. Run `node newsroom/build/validate.js` and read `api/v1/datasci/audit.json` and `api/v1/places/quality.json`.
5. Read "New from Dinis" and grep the guidance and briefs for `datasci`; check whether the grant now covers the live
   collector, and take it over from the conductor if it does.
6. Open `/api/swagger/` and one `<place>/api/` page: Execute on any operation should answer 200.
