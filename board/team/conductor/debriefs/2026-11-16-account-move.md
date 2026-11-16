# conductor@PrompTugal.dinis: debrief for the account move

By conductor@PrompTugal.dinis (session session_018yvwtMe4xXJFw1aRGHvua4, account A), 16 November 2026, about 15:35 UTC, at Dinis's word: "pause all agents that are working on the PrompTugal since we need to move them to the accounts of the other team members ... a detailed debrief of what they do, how they operate and what lessons they have learned." Public: no key, token, vault key or private contact detail here; where a secret matters, this says it exists and who holds it.

## 1. Who I am and my mandate

- The conductor of PrompTugal.news (`CLAUDE.md`, "The PrompTugal team"): the plan, the board for this site, `REALITY.md`, who does what, the brief to Dinis; I route work to the others and do not write their content.
- My policy: `board/abp/conductor.md` (observe mode; R1 to R11). My grant: the board paths (`board/team/conductor/**`, `board/guidance/**`, `board/briefs/**`, `board/schedule.json`, `board/inbox.json`, `board/inboxes/**`, `board/tools/**`, `board/spec-*.md`, `board/editor-briefs/**`, `REALITY.md`, `CLAUDE.md`, ...). Starting sessions and scheduled tasks needs Dinis in his own session (R4).
- **Today I acted outside my grant at Dinis's explicit word, every time recorded in the commit:** the home page code (`newsroom/build/features/front-e.mjs`, `front.mjs`, `assets/front-e/`, `data/site/nav.json`, `assets/sources/sources.json`), the Algarve map pin fix (`by-place.mjs`), "Now in <place>" (`by-place.mjs`, `assets/by-place/by-place.css`), the per-place live data collector (`board/tools/local-now.mjs`, `data/by-place/now/`, its schema and kind), the meta article (`content/articles/promptugal-news-local-news-town-by-town.md`, signed with my key), the `data/i18n/` schemas, and three new sessions with their tasks (translator@, place.districts@; earlier the by-place team). abp@'s run reports count them as breaches; each was at Dinis's word in this session.

## 2. How I operate

### The hourly wake (scheduled task trig_01X8SF35DkefoBeVgKyWYbWx, cron `36 * * * *`, now disabled)

The prompt, verbatim in substance:

1. `git pull --rebase origin dev` here; `git pull` the read-only team-site clone (`/home/user/SGit-AI__Website__Web-Summit`). If `board/HOLD.md` exists, stop and say why.
2. The site over time: `NODE_PATH=$(npm root -g) node board/tools/snapshot.mjs --sheet <scratchpad>/then-and-now.png` (screenshots into the vault promptugal-snapshots; index `board/snapshots.json`).
3. Drain my inbox: `python3 -I /home/user/SGit-AI__Website__Web-Summit/admin/tools/feedback_drain.py --creds ~/.sg-send/lanes/conductor-promptugal.json`. Default mode is signed-only: an unsigned message is written as id, time and length only (a stranger's words never reach me). Vault keys agents send go to `~/.sg-send/vault-keys/`, never the repository.
4. New keys in `board/keys.json`: re-issue lanes, `python3 -I board/tools/inbox.py issue .` (my lanes, the public lane and, since 16 Nov 02:50, the `talk_lane`) and `python3 -I board/tools/agent_inboxes.py issue .` (every agent's own inbox).
5. Since 16 Nov 04:30: `timeout 200 node board/tools/local-now.mjs` (IPMA and adsb.lol around Faro, no key, no model) refreshes `data/by-place/now/*.json`; datasci.places@ was to take it over.
6. Check the plan (`board/WS-177-plan.md`), the agents' commits since the last wake (`git log origin/dev --since=... --format=%s | sed 's/:.*//' | sort | uniq -c`), their `status.json`, the live site (`curl`); mark done, late, blocked; append a section to the plan; append a line to `board/team/conductor/watch.json` (indent=1, append to `lines`, never re-dump in another format).
7. At the 10:52 and 16:52 wakes (the 12:00 and 18:00 London stand-ups): the stand-up brief, `board/editor-briefs/<stamp>.json` (fields: number, date, kicker, title, when, by, headline, stats, for_you, you_asked, team, sections, images, next, sources; image as a jpg in `board/editor-briefs/img/`), `python3 -I board/tools/editor_brief.py <json>`, delete the HTML, commit, send the PDF to Dinis. The last: No. 11, `2026-11-16T1050Z.pdf`.
8. Run report (`node board/abp/tools/abp.mjs run-report --role conductor`), commit as myself (subject `conductor@PrompTugal.dinis: ...`, trailers `Agent:`, `Issue: WS-177`, `For: Dinis`), release.
9. Reply to Dinis every three hours (05:52, 08:52, 11:52 ...) with the then-and-now image, an ASCII infographic and at most three lines; otherwise one line, or at once when something needs him.

### Releasing under contention (the most important practical lesson)

About thirty agents push to `dev`. `newsroom/tools/release.sh` rebases, runs the gate (over two minutes) and pushes; it lost the race almost every time from 01:00 and gives up after 5 attempts. What worked, from 05:15, disclosed in the plan: `git pull --rebase origin dev && node newsroom/build/validate.js` (must print OK), then at once `git pull --rebase origin dev && git push origin dev` in a short loop. Never leave untracked or modified files while a release runs: release.sh refuses a dirty tree, and a snapshot or a JSON write mid-release breaks it. Run the gate yourself before committing a board JSON: `board/schedule.json` has a schema and an extra property turned the gate red for an hour.

### Talking to the agents

- Their inboxes (`python3 -I board/tools/agent_inboxes.py send . --from conductor --to <role> --text '...'`) are **not read by most agents**: they read `board/guidance/README.md`'s "New from Dinis" list at each wake and little else. **Every word of Dinis's must go into the guidance list (a file in `board/guidance/` and a row at the top of the README table) the same hour**, not only into a brief. When an agent must act now, `send_message` to its session (the claude-code-remote tool) wakes it at once.
- The roster of the sessions I started: `board/team/conductor/place-agents.json`; every scheduled task: `board/schedule.json`.

## 3. State at the pause (16 Nov, 15:30 UTC)

**Live on promptugal.news (about v0.1.1634):**
- The home page leads with the places: a signed article on PrompTugal.news going local, the Algarve ticker, "Now in the Algarve", a Portugal map with every place and the district capitals still to come (`assets/portugal/next-places.json`), the 17 Algarve towns with a line each, "By the numbers", "National and international" below.
- 36 places (`data/by-place/places.json`): the Algarve's 17 towns, the region, the country and 17 district capitals (place.districts@); about 282 local AI stories, 548 organisations on the maps, 123 publishers.
- "Now in <place>" at the top of every Algarve page (IPMA station, forecast, warnings, fire risk, sea; Faro airport traffic on Faro, Olhão, Loulé), links to human pages, JSON at `api/v1/by-place/<id>/now.json`.
- Translated place pages (`/pt-PT/...`, with es-ES, fr-FR, de-DE, nl-NL in the memory `data/i18n/tm/`; `board/spec-translations.md`), hreflang.
- The talk pane: built by dev.places@; its must-fix 2 (how I drain comments) recorded in `board/team/conductor/talk-drain.md` and a `talk_lane`; waits on security@'s post-review before `enabled` goes true.

**Open, by owner (the briefs hold the detail):**
- dev.places@: its session is nearly full and asked for a fresh one (Dinis's yes pending); next: the rest of `board/briefs/2026-11-16-every-story-has-an-address.md` (address and climb, story rail, distance to the beat, altitude navigation, organisation pages).
- datasci.places@: take over `board/tools/local-now.mjs`; more keyless sources; significance in `nearby.json` (`board/briefs/2026-11-16-blast-radius.md`).
- designer.places@: the live-data loop (`board/briefs/2026-11-16-live-data-up-front.md`).
- data.places@: the locality layer from DGT's CAOP (parishes, adjacency checked); the blast-radius adjacency in `board/briefs/2026-11-16-blast-radius-draft.json` is mine, unchecked.
- ios.places@ / conductor.a.ios@: the summit onboarding sheet off first launch; the app on TestFlight (v0.4.112).
- devops@ (not run since 8 Nov): a release queue or lock.

**Waiting on Dinis:** the account B tasks (off?); the App Store name and subtitle (proposed: PrompTugal.news; "Portugal's news, town by town" or "Every story has an address"); a fresh dev.places@ session; whether to wake devops@.

## 4. Lessons learned

1. **The guidance list is the agents' only reliable channel.** dev.places@ and datasci.places@ idled for hours on "nothing new from Dinis" because his words were in a brief. Write guidance first, brief second.
2. **Contention is the bottleneck, not the work.** One gate run per push across thirty agents does not scale; ask for a queue early. Until then: gate, then pull-and-push at once.
3. **Run the gate before committing anything with a schema** (board JSON, data files). A new data folder needs a kind in `newsroom/build/lib/datacheck.mjs` and a schema, or every write to it is refused: translator@ was blocked three hours on a folder my own spec created.
4. **New agents without a key have no lane:** they cannot reach the conductor's drained inbox. Check their `status.json` asks directly (and `list_events` on their session) in their first hours.
5. **Raw SVG in a markdown page is never rewritten:** `ctx.link()` returns the `.md` twin; in SVG use `.html` (the Algarve pins opened the markdown files).
6. **The quality gate counts prose bytes and HTML tags in feature code:** put markup in `assets/<feature>/*.tmpl` items and words in data (`places.json` copy).
7. **Removing a section can orphan a page** (the GAMMA-Ray band was the only link to `/agentic/`): the gate's orphan check catches it; link it elsewhere.
8. **Readers must never land on JSON:** every data value carries `page` (a human page) and `source` (the JSON).
9. **Keep my own replies short and decisions explicit;** say what is live and what is not, and mark what waits on Dinis.

## 5. Identity and secrets (ids only)

- My session key: `conductor-promptugal` in `board/keys.json`; private half in this session's key store (`~/.sg-send/keys/`), never in the repository. The next conductor makes its own key (`pki-agent.mjs keygen --session`) and marks this entry `superseded` with the time.
- My inbox vault and lanes: credentials at `~/.sg-send/lanes/conductor-promptugal.json` (append tokens, enum key) on this machine only; `board/inbox.json` holds only sealed tokens and the public and talk lanes' append tokens (public by design). A new conductor re-issues all lanes with its own key (`board/tools/inbox.py issue .`), which re-seals every agent's lane.
- The agents' inbox credentials: sealed to each agent's key in `board/inboxes/<role>.json`; re-issued by `board/tools/agent_inboxes.py issue .` when keys change.
- Vault keys agents sent me: `~/.sg-send/vault-keys/` on this machine; they do not move with this debrief.
- The snapshot vault (promptugal-snapshots): its key on this machine; the index `board/snapshots.json` is public.
- OPEN_ROUTER_KEY: environment only, never printed; budget with accountant@.

## 6. What the next conductor must do first

1. Read `CLAUDE.md`, `board/abp/conductor.md`, this debrief, `board/guidance/README.md` (top rows) and the last sections of `board/WS-177-plan.md`.
2. Make your session key; add it to `board/keys.json` as `conductor-promptugal` and mark this one superseded; commit as yourself.
3. Re-issue every lane (`python3 -I board/tools/inbox.py issue .`, `python3 -I board/tools/agent_inboxes.py issue .`) once the moved agents have their new keys.
4. With Dinis, restart the agents in their new accounts from their debriefs (`board/team/<role>/debriefs/2026-11-16-account-move.md`) and their ABPs; one session per role; new scheduled tasks; update `board/schedule.json` and the roster.
5. Your own hourly wake (the prompt above), and `board/tools/local-now.mjs` until datasci.places@ runs it.
6. Ask Dinis the four waiting questions (section 3).

## 7. Where the iOS team's debriefs are (in PrompTugal/PrompTugal__App__iOS, not this repository)

- **conductor.a.ios@** (the iOS conductor, its hourly round trig_01A2aPmNYVb7aoXDfvYfE5wj disabled): `briefs/2026-11-15__going-local/2026-11-16-account-move.md` on `dev` (ac9279e), with the lane 2 situation by key id only. Its six workers (live, ai, talk, status, credit, wire) write theirs to `briefs/2026-11-15__going-local/debriefs/<name>.md` on their `work/` branches. Latest TestFlight at the pause: build 667 (0.4.120).
- **ios.places@**: `briefs/2026-11-16__ios-places/debrief-2026-11-16-account-move.md` on branch `work/ios-places` (55828d7); its work is all on `dev` (the last, the Now panel, 9387f4b). It could not copy the debrief here (no push access to this repository, no key): a person or the next conductor copies it to `board/team/ios.places/debriefs/`.
