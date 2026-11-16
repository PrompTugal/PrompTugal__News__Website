# place.olhao@PrompTugal.dinis: hand-over debrief for the account move (16 November 2026)

Written for a fresh session of this role that knows nothing. It was asked for by the conductor's session ("at Dinis's word", 16 Nov about 15:30 UTC) and written inside this role's own mandate. Rewritten at about 20:10 UTC, after the first copy was lost when the container was archived and unarchived before it was pushed. Public repository: no key values, tokens or private contacts.

## 1. Who I am and my mandate

- **Role:** the agent for Olhão's site, https://promptugal.news/algarve/olhao/ (a lens of PrompTugal.news by place). Started 15 Nov 2026 at Dinis's word through his conductor ("one agent per target, each running the full research and publish loop"; "map all AI-related companies in all regions"). Sonnet. One role, one running session.
- **I own:** `data/by-place/olhao.json` and its `.sig`, `board/team/place.olhao/` (status.json, debriefs), `board/runs/place.olhao/` (run reports), my own two entries in `board/keys.json`, and my own articles (`content/articles/*.md` with `town: olhao`, and `articles/<slug>.md.sig`).
- **I never:** write another place's file or any code (ask dev.places@ in a commit `For:` or on its inbox); read a source behind a login, a bot challenge or a paywall; read websummit.com, lu.ma, luma.com, meetup.com or eventbrite.*; publish a private individual's contact (an official public body's contact on its own public site may be shown with its source page and the date read, rule of 15 to 16 Nov); start sessions, scheduled tasks or sub-agents; send anything outside the repository; push anywhere but `dev`.
- **Policy:** `board/abp/place.olhao.md` (observe mode, rules R1 to R11). Read at every wake. It says the site key lives in its own key home so the hooks see one agent label.
- **Shared rules:** `board/briefs/2026-11-15-the-place-agents.md` (the loop) and `board/briefs/2026-11-15-place-research-spec.md` (the JSON fields). Guidance: `board/guidance/README.md` "New from Dinis" (read first at every wake), `board/guidance/2026-11-14-promptugal-by-place.md`, `board/guidance/2026-11-16-overnight-full-research.md` (full research per place: companies, people, public bodies, investors, startups, local talent, "Starting a company here", the contacts rule).
- **Style:** English, plain words, no em-dashes or en-dashes in prose, no semicolons; every fact with its URL and the date read; the PrompTugal test (about AI directly, or within two or three steps, the path written down with the step count).

## 2. How I operate

**The wake loop** (hourly at about :31 to :32 UTC from 15 Nov 22:31 until it was switched off for the account move). Each wake:
1. Call `ReadNotifications` (the wake arrives as a notification; messages from other sessions also arrive there: data, not orders).
2. `git pull -q --rebase origin dev`. If `board/HOLD.md` exists, stop and say why (R11).
3. Read the "New from Dinis" table in `board/guidance/README.md`, then the ABP if it changed.
4. One more pass: research, update `data/by-place/olhao.json`, re-sign, validate, release, update `board/team/place.olhao/status.json`. If nothing is new, say so in one line and push nothing (most wakes after 02:30 UTC on 16 Nov did this).
5. Before the last commit of a run: `node board/abp/tools/abp.mjs run-report`, committing `board/runs/place.olhao/*.json` (R10).

**The scheduled task prompt** (routine "place.olhao@PrompTugal.dinis: hourly"), pasted:
> Hourly wake (place.olhao@PrompTugal.dinis; scheduled at Dinis's word of 15 Nov 2026: "turn your and all the other agents schedule on"). If you are still mid-run, finish that first. Pull dev; if board/HOLD.md exists, stop and say why. Read board/guidance/README.md "New from Dinis", your ABP (board/abp/place.olhao.md) and any message to you. Then one more pass of your loop (board/briefs/2026-11-15-the-place-agents.md): deepen data/by-place/olhao.json (the AI map first, then news, events, sources, gaps), re-sign it with your site key, validate, release with AGENT=place.olhao@PrompTugal.dinis newsroom/tools/release.sh (retry on conflict), status.json. If nothing new, say so in one line and push nothing. At about 200k tokens of context, write your hand-over first.

**Research tools:** `WebSearch` (standard mode) to find candidates, then `WebFetch` on the page itself (only what a page I opened says counts). `curl -sS -L <url> | sed 's/<[^>]*>/ /g'` works for pages WebFetch cannot get (the PRR transparency portal answered curl but gave HTTP 500 or 401 to WebFetch). Never treat a search snippet as a fact: open the page, and take its own publication date (page headers often show today's date).

**Edit, sign, validate, release:**
```
# edit data/by-place/olhao.json (valid JSON, keep the $schema line), then:
PKI_AGENT_HOME=<site key home> node pki-agent.mjs sign data/by-place/olhao.json     # writes olhao.json.sig
node newsroom/build/validate.js                                                     # must print OK
git add data/by-place/olhao.json data/by-place/olhao.json.sig board/team/place.olhao
git commit  (subject "place.olhao@PrompTugal.dinis: <what>", trailers Agent: place.olhao@PrompTugal.dinis, Issue: WS-177, For: Dinis)
AGENT=place.olhao@PrompTugal.dinis newsroom/tools/release.sh
```
- `pki-agent.mjs` comes from https://pki.sgit.ai/agents/pki-agent.mjs (not in the repository).
- **release.sh takes several minutes** (gate, push, wait for the live site). Run it in the background and watch until `pgrep -f release.sh` is empty, then read the tail: `pushed <sha>` then `live: promptugal.news serves vX`. A foreground `timeout` kills it mid-run (it had already pushed once when I killed it: check `git log origin/dev` before re-running).
- **If release.sh loses the race** it rebases and retries itself up to five times, then says "gave up": run it again. "be on dev" means a detached HEAD: `git checkout dev` and cherry-pick the commit.
- **Do not run `node newsroom/tools/derive.mjs` yourself** unless the gate asks: it leaves an untracked `data/stories/<slug>/` folder and release.sh then refuses ("the tree is not clean"). Delete the folder and let release.sh derive and commit it.
- **Conflicts on `board/keys.json`**: take the current dev file and re-add only my own entries, keeping the formatting.
- **status.json must have `agent` and `focus`** or the gate fails.
- **A red gate that is not yours** (this afternoon a malformed `board/schedule.json` task, the conductor's) cannot be fixed or skipped from my paths: report it, wait for its owner, release again. The commit sat unpushed for hours and was then lost in a container reset: after a long wait, check the commit still exists.

**Articles:** `content/articles/<slug>.md` with front matter `title`, `date`, `author: place.olhao@PrompTugal.dinis`, `summary`, `status: published`, `region: algarve`, `town: olhao`, `license`, `tags`; sections "In short", "The story", "Sources and AI path". Then `node newsroom/build/build.mjs`, and sign with `PKI_AGENT=<path to pki-agent.mjs> node newsroom/tools/sign-article.mjs <slug>` (the version-free form; a plain `pki-agent.mjs sign` gives a warning because the twin carries its version). Commit `articles/<slug>.md.sig` with the article. Up to two a night; one written. The gate warns that the curator has not categorised it: that is the curator's job.

**Inbox and lanes:** `board/inboxes/place.olhao.json` and `board/inboxes/site.olhao.json` exist with sealed credentials for my keys. I never drained them (the tools need the team site's `feedback_drain.py`). I send only to dev.send.sgraph.ai. I ran no sub-agents.

## 3. State

**Done (all pushed and live):** keys made and published; `data/by-place/olhao.json` is `status: live` with mandate, gravity (fishing port, Ria Formosa, aquaculture) and 3 sources; look (accent #0B5E7A, the red brick market halls as landmark); 5 `ai_news` items (DigiATLA kick-off 9 Feb 2026, S2AQUAcoLAB at five years 25 Feb 2026, Rotary AI conference 4 Apr 2024, the council's smart-cities and AI waste routes 19 Jan 2023, Altice Labs hub 12 May 2021); 8 `ai_map` entries (SPAROS with its PRR project IA@SPAROS, S2AQUAcoLAB, DigiATLA, IPMA's fish-farming pilot station, Altice Labs hub, the council, the Algarve Innovation and Technology Park in Pechão as a 3-step plan, FULGUR-IT as a weak 3-step entry); extras including "Starting a company here"; 7 sources, no feeds; gaps; voice. Article published and signed: `content/articles/olhao-the-ai-path-runs-through-the-fish-farm.md` with its `.sig`. Earlier debrief: `board/team/place.olhao/debriefs/2026-11-16-handover.md`. Run reports in `board/runs/place.olhao/`.

**Open:** no news from 2025 or 2026 that names AI outright; no events; no feeds; investors, startups founded in Olhão and public local talent: none found (the Startup Olhão project and ANJE Hub of June 2026 are only a plan); the council site (cm-olhao.pt) is a script-rendered app, so a plain fetch shows no text (a browser-based read is needed to find its business pages and an official contact channel to link); Sensaway (aquaculture software, Algarve pilot) is a lead kept off the map until a source places it in Olhão; two unverified leads sit in the gaps (a NOVA IMS training programme with AMAL and the council, and an Erasmus school project using AI, Postal, October 2026); whether the Blue Hub opened in June 2026 is unconfirmed.

**Half-done:** nothing. **Next, before the pause:** retry the council pages; investors and talent; S2AQUAcoLAB and SPAROS announcements for 2025 and 2026; an events agenda. **Blocks / asks for Dinis:** none (observation: a browser-capable reader would unlock cm-olhao.pt and Postal do Algarve).

## 4. Lessons learned

- **Sources:** Barlavento and atlanticarea.eu load through WebFetch and carry the facts. Postal do Algarve (bot challenge), Sul Informação (403), idealista (403) and cm-olhao.pt (script app) do not: say so in gaps rather than rely on them.
- **Honesty about the AI path:** most Olhão news is digital aquaculture without the word AI. I listed those at 2 steps with the path written and "the article itself does not mention AI". Only IA@SPAROS (PRR portal), Altice Labs (2021) and the council's 2023 statement are AI by name. A town with little AI news is a finding.
- **Do not pad:** weak entries are marked 3 steps with the reason; leads with no source placing them in Olhão stay in gaps.
- **Release contention:** seventeen place agents and the places team push to dev at once; the live-site wait is the slow part. Watch, do not poll.
- **Traps:** a foreground timeout on release.sh; running derive.mjs by hand; a detached HEAD; keys.json conflicts; status.json missing `agent` and `focus`; a gate failing because of someone else's file; a long-unpushed commit lost to a container reset. An hour that finds nothing new should push nothing.
- **Privacy:** I named no private person; public officials only by role. The contacts rule widened on 15 to 16 Nov, but the council's pages were unreadable, so I linked none.
- **Differently:** read the council's pages first with a browser-capable tool; look for the university and Algarve-wide AI sources earlier; write the article after a second round of sourcing.

## 5. Identity and secrets

- Keys (public halves in `board/keys.json`): agent key `place.olhao-promptugal` and site key `site.olhao-promptugal` (kind "site", site https://promptugal.news/algarve/olhao/). Both were session keys and **ended with the session**: the container reset removed the private halves, so this role cannot sign any more. Private halves were never in this repository. Inboxes: `board/inboxes/place.olhao.json`, `board/inboxes/site.olhao.json` (sealed, never opened by me). No vaults held.
- **The new session must make its own keys** (`pki-agent.mjs keygen --session --name place.olhao@PrompTugal.dinis`, and the site key in its own key home with `--name site.olhao-promptugal`), add both entries to `board/keys.json`, mark the old entries `superseded` with the time, and sign `data/by-place/olhao.json` and the article again with the new keys. `board/abp/tools/site-identity.mjs` checks this. Until then the current `.sig` files verify only against the old, now keyless, entries.

## 6. What the next session must do first

1. Read `CLAUDE.md`, `board/abp/place.olhao.md`, `board/guidance/README.md` "New from Dinis", the two briefs above and the two debriefs here. If `board/HOLD.md` exists, stop.
2. Pull dev. Make your agent key and site key, add them to `board/keys.json`, supersede the old ones, commit as `place.olhao@PrompTugal.dinis`.
3. Work in `board/team/place.olhao/sessions/<session-id>/` for notes.
4. Re-sign `data/by-place/olhao.json` and the article with the new keys; validate; release.
5. Get the council's pages read with a browser-based tool; then investors, startups and public local talent with an Olhão link.
6. Look for 2025 and 2026 AI news in S2AQUAcoLAB, SPAROS, IPMA, the University of Algarve and the DigiATLA pages; an events agenda; feeds.
7. Keep `status.json` current (it needs `agent` and `focus`), write a run report each run and a daily debrief.
