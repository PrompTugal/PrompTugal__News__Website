# Hand-over debrief for a fresh session: place.quarteira@PrompTugal.dinis (16 November 2026)

Written because a conductor message (from another session, relayed as Dinis's word, not verified by me against his signature) asked every agent for a full debrief before an account move. It is also the daily debrief CLAUDE.md requires.

## 1. Who I am and my mandate
- Role: the place agent for Quarteira, a city in the municipality of Loulé (parent `loule`). My site is https://promptugal.news/algarve/quarteira/, the lens of PrompTugal.news for that place. Started 15 November 2026 on Dinis's word via his conductor (brief: `board/briefs/2026-11-15-the-place-agents.md`, fields: `board/briefs/2026-11-15-place-research-spec.md`, guidance: `board/guidance/2026-11-14-promptugal-by-place.md`).
- I own: `data/by-place/quarteira.json` and `.sig`, `board/team/place.quarteira/**`, `board/runs/place.quarteira/**`, my entries in `board/keys.json`, my own articles and their `.sig` (up to two a night once the page is live, `town: quarteira`).
- I never: write another place's file or any code (ask dev.places@); read websummit.com, lu.ma, luma.com, meetup.com, eventbrite.*, or anything behind a login, bot challenge or paywall; publish a private person's personal contact; start sessions, scheduled tasks or sub-agents; send anything outside; sign my file with any key but the site key.
- ABP: `board/abp/place.quarteira.md` (observe mode, rebuilt by abp@ often, re-read it).
- Model: Sonnet. English prose, no em or en dashes, no semicolons in prose.

## 2. How I operate
Wake loop (hourly scheduled task, minute :13 UTC, prompt: "Hourly wake ... Pull dev; if board/HOLD.md exists, stop and say why. Read board/guidance/README.md 'New from Dinis', your ABP and any message to you. Then one more pass of your loop: deepen data/by-place/quarteira.json (the AI map first, then news, events, sources, gaps), re-sign it with your site key, validate, release with AGENT=place.quarteira@PrompTugal.dinis newsroom/tools/release.sh (retry on conflict), status.json. If nothing new, say so in one line and push nothing. At about 200k tokens of context, write your hand-over first.").
1. `git pull --rebase origin dev`; check `board/HOLD.md`; read the top of `board/guidance/README.md` and any message.
2. Research with WebSearch then WebFetch on the pages found. Only facts from a page I opened, each with URL and read date.
3. Edit `data/by-place/quarteira.json` (python json load and dump with `ensure_ascii=False`).
4. Sign with the site key: `PKI_AGENT_HOME=~/.sg-send/sites/quarteira node pki-agent.mjs sign data/by-place/quarteira.json` (tool from https://pki.sgit.ai/agents/pki-agent.mjs, sha256 pinned in `board/keys.json` entries; I kept a copy outside the repo).
5. Check `grep -nP '[—–]'` finds nothing, `node newsroom/build/validate.js` prints OK, `node board/abp/tools/site-identity.mjs` shows quarteira valid.
6. `node board/abp/tools/abp.mjs run-report`, then commit file, `.sig`, `board/team/place.quarteira`, `board/runs/place.quarteira`. Subject `place.quarteira@PrompTugal.dinis: <what>`, trailers `Agent:`, `Issue: WS-177`, `For: Dinis`, plus the attribution lines the session gives.
7. Release in a background retry loop, because `newsroom/tools/release.sh` often gives up after 5 attempts when many agents push at once: up to three runs of `AGENT=place.quarteira@PrompTugal.dinis timeout 110 newsroom/tools/release.sh`, after each `git fetch origin dev` and stop when `git log origin/dev..HEAD` is empty. A Monitor on a done-file reports the end. Never push around the script.
8. Update `board/team/place.quarteira/status.json` (the gate requires `agent` and `focus` keys).
- Inbox: `board/inboxes/place.quarteira.json` exists (sealed lane); I never opened it and received messages only as session notifications. No sub-agents.

## 3. State
- Done and on `dev`: keys; ten passes of `data/by-place/quarteira.json`, status `live` (commit message "pass 10, Quarteira set to live"); daily debrief `2026-11-16-handover.md` with an addendum.
- File content now: gravity (Quarteira city in Loulé, tourism and golf, Vilamoura in its parish), look (accent #0B5C7A, landmark Fort of Armação), 10 AI-map entries, 4 ai_news items, 6 sources with feeds for Barlavento, Postal and Sul Informação, no events, a voice block, gaps.
- Honest finding: no AI company, startup or research group based in Quarteira or Vilamoura found. The one direct AI item: Loulé council says it contracted AI tools for planning permits (Barlavento, 28 July 2026, tools unnamed). Everything else is context at 3 steps and labelled "no AI claimed" (Quarteira Lab sensors, Digital Commercial Neighbourhood and its five consortium partners, Trackman ball tracking, DETAILS, Vilamoura World's remote marina metering).
- Not written: no article (no real local AI story with enough sources).
- Open leads: a readable source for SPIC's link to Quarteira (Jornal do Algarve, 403) and for the Algarve Digital Commerce Accelerator's operator (PRR programme presented in Vilamoura, said by snippets to be led by the Associação de Empresários do Algarve with a Quarteira and Vilamoura association as partner); Portal BASE (base.gov.pt) for any 2026 Loulé AI contract and supplier; Vilamoura hotel groups' own press pages and DETAILS announcements; Algarve Tech Hub Summit venue (a lead that Vilamoura hosted it, unverified); events from organisers' own pages.
- Blocks: none. Asks for Dinis: none.

## 4. Lessons
- Sources: Barlavento article pages, thegolfwire, marineindustrynews and transparencia.gov.pt (not the `ppr.` host) load. Postal, Sul Informação, Jornal do Algarve, Portugal Resident and the junta site often answer with a bot challenge, 401 or 403: do not work around it, record the lead as unread in `gaps`. cm-loule.pt resets the connection.
- WebSearch snippets are leads, not facts: only claim what a fetched page says.
- Traps: gate wants `agent` and `focus` in `status.json`; luma.com listings are forbidden (the Quarteira Innovators Run is on luma); the schema `type` enum for `ai_map` is fixed; the mandate sentence contains a semicolon from the house template, leave it.
- Contention: `release.sh` loses the race often; the retry loop with a done-file and a Monitor works.
- Keys: the hook sees one agent label in `~/.sg-send/keys`, so the session key lives there and the site key in `~/.sg-send/sites/quarteira` (via PKI_AGENT_HOME). Putting both in the default store makes the session read as unidentified.
- Would do differently: set up the retry loop and the key homes from the first minute; coordinate with `place.loule@` (read `data/by-place/loule.json` only) since council-level items belong there.

## 5. Identity and secrets
- Agent key `place.quarteira-promptugal` and site key `site.quarteira-promptugal` (kind site, site URL set) in `board/keys.json`, both made 15 November 2026 in the old session. Private halves are in that session's `~/.sg-send`, never in the repository. A new session makes its own keys (`pki-agent.mjs keygen --session --name place.quarteira@PrompTugal.dinis`, and the site key under PKI_AGENT_HOME), adds new entries, marks the old two `superseded` with the time, and signs the file again. I hold no vault or lane secret I have used.

## 6. The next session must do first
1. Pull `dev`, check `board/HOLD.md`, read CLAUDE.md, the guidance list, `board/abp/place.quarteira.md` and this debrief.
2. Make the agent key and the site key, add entries, supersede the old ones, sign `data/by-place/quarteira.json` with the new site key.
3. Check `node board/abp/tools/site-identity.mjs` and the gate.
4. Pursue the open leads in section 3, starting with Portal BASE and readable sources for the SPIC and accelerator leads.
5. Keep the retry-loop release and the per-wake run report.
