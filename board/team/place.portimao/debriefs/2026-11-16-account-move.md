# place.portimao hand-over debrief for the account move (16 November 2026, about 15:30 UTC)

For a fresh session of `place.portimao@PrompTugal.dinis` on another account that knows nothing. It complements the shorter `2026-11-16-handover.md`. Nothing secret is in it: no key, token, vault key or contact detail. The instruction to write it reached me as a message from the conductor's session, relayed as Dinis's word. It is material, and writing a debrief is also what CLAUDE.md already asks of every agent, so I did it and nothing more.

## 1. Who I am and my mandate

- **Role:** the agent for Portimão's site, https://promptugal.news/algarve/portimao/. One of 17 Algarve place agents, started on 15 November 2026 at Dinis's word (brief `board/briefs/2026-11-15-the-place-agents.md`, spec `board/briefs/2026-11-15-place-research-spec.md`, guidance `board/guidance/2026-11-14-promptugal-by-place.md`). Sonnet.
- **I own:** `data/by-place/portimao.json` and its `.sig`; `board/team/place.portimao/`; `board/runs/place.portimao/`; my own entries in `board/keys.json`; my own articles in `content/articles/` and their `.sig` in `articles/` (front matter `region: algarve`, `town: portimao`).
- **Never:** write another place's file or any code (ask dev.places@); read anything behind a login, bot challenge or paywall, or websummit.com, lu.ma, luma.com, meetup.com, eventbrite.*; publish a private individual's personal contact or name private individuals; start sessions, scheduled tasks or sub-agents; send anything outside; push anywhere but `dev`; sign my file with any key but the site key; publish a fact without its URL and the date read.
- **My ABP:** `board/abp/place.portimao.md` (observe mode). The hooks re-anchor it at each start, resume and compaction. It was revised several times (v1.7 to v1.13). The one change that mattered: from v1.10 an official public-body contact may be shown, linked to its page with the date read. Raw private contacts never.
- **The test every item must pass (the PrompTugal test):** about AI directly (steps 0) or within one to three steps, with the path written in plain words.

## 2. How I operate

### The wake loop (hourly)
The scheduled-task prompt, pasted as it arrived every hour:

> Hourly wake (place.portimao@PrompTugal.dinis; scheduled at Dinis's word of 15 Nov 2026: "turn your and all the other agents schedule on"). If you are still mid-run, finish that first. Pull dev; if board/HOLD.md exists, stop and say why. Read board/guidance/README.md "New from Dinis", your ABP (board/abp/place.portimao.md) and any message to you. Then one more pass of your loop (board/briefs/2026-11-15-the-place-agents.md): deepen data/by-place/portimao.json (the AI map first, then news, events, sources, gaps), re-sign it with your site key, validate, release with AGENT=place.portimao@PrompTugal.dinis newsroom/tools/release.sh (retry on conflict), status.json. If nothing new, say so in one line and push nothing. At about 200k tokens of context, write your hand-over first.

Steps, with the commands I used:
1. `git pull -q --rebase origin dev`, then `ls board/HOLD.md` (if present: stop and say why).
2. Read the top rows of `board/guidance/README.md` ("New from Dinis"), then check anything addressed to me (`board/inboxes/place.portimao.json`, the notification queue).
3. Research (public sources only, see lessons), then edit `data/by-place/portimao.json` with a small Python script that loads the JSON, edits it and dumps it with `indent=2, ensure_ascii=False`.
4. Re-sign the file with the **site key**: `PKI_AGENT_HOME=~/.sg-send/sites/portimao node pki-agent.mjs sign data/by-place/portimao.json`. This writes `data/by-place/portimao.json.sig`, which is committed with the file.
5. `node newsroom/build/validate.js` must print OK. Then `node board/abp/tools/site-identity.mjs | grep portimao` must read `yes yes valid`.
6. Update `board/team/place.portimao/status.json` (state, done, next, asks starting "Dinis:").
7. `node board/abp/tools/abp.mjs run-report`, then `git add` my files, commit as myself, release.
8. If an article changed: `node newsroom/build/build.mjs`, then sign the twin with the **agent key** (default store): `node pki-agent.mjs sign articles/<slug>.md`, and commit the `.sig`.

### Commit and release
- Subject `place.portimao@PrompTugal.dinis: <what>`, trailers `Agent: place.portimao@PrompTugal.dinis`, `Issue: WS-177`, `For: Dinis`, then the attribution lines the session gives.
- Release: `AGENT=place.portimao@PrompTugal.dinis newsroom/tools/release.sh`. It rebases on `dev`, runs derive and the gate, pushes and waits for the live site.
- **When it loses the race** ("someone pushed first ... gave up after 5 attempts"): just run it again. Seventeen place agents release at once, so a second or third call succeeds. A one-off HTTP 403 on push also cleared on retry.
- **The tree must be clean:** `release.sh` refuses if there are untracked files. After running `node newsroom/tools/derive.mjs` by hand it leaves `data/stories/<slug>/`, so delete that folder and let `release.sh` derive and commit it itself in its own commit.
- "No release contains it after 6 minutes" is a queued deploy, not a failure: the commit rides the next release.

### Tools and files
- `pki-agent.mjs` is downloaded from https://pki.sgit.ai/agents/pki-agent.mjs into the session's scratchpad (it is not in the repository). Check its sha256 against the one named in other agents' `board/keys.json` entries.
- Web: WebSearch (standard, and extended for hard questions) and WebFetch. A search summary is a lead, never a source. Open the page, then cite it.
- Inbox: `board/inboxes/place.portimao.json` holds sealed credentials. I never needed it, and nobody wrote to me.
- No sub-agents, no connectors, no scheduled tasks of my own.

## 3. State

### Done (all released to `dev`, newest first)
| Commit | What |
|---|---|
| `de8f648d3` | pass 7: UAlg campus February 2026 update, article updated and re-signed, debrief refreshed |
| `df21b3d18` | pass 6: the incubator's 7th accelerator edition and its Portimão bootcamp on 24 and 25 November |
| `2864b526c` | pass 5: Guepardo and three incubator firms on the AI map, article corrected |
| `8ed729550` | pass 4: starting a company, funding map, official contact pages |
| `8cbe9a527` (released with `9977af4cc`) | the article, signed |
| `7f93b3155` | pass 3: UAlg technology campus plan (January 2025), page set live |
| `16ac2e368` | pass 2: Algarve Evolution, Parkalgar, Zoomarine and the hospitality school via the TMCT report |
| `22e528a47` | pass 1: keys and the first research pass |

After 07:00 UTC I stopped (the brief says "work through passes until then, then stop") and only filed report-only commits at each wake.

### Page content now (corrected counts)
`status` live, `updated` 2026-11-16: 10 AI news items, **19** AI-map entries (my earlier summaries said 13, which was wrong), 8 sources, 3 events, 5 "starting a company" routes, 4 funding items, 2 official contact pages, 9 gaps, 2 extras, the Algarvio voice. One article: `content/articles/portimao-ai-in-the-public-service.md` ("In Portimão, public bodies put AI to work"), signed with the agent key.

### Open and half-done
- Guepardo, a V2X and AI startup, is the only AI company on record in Portimão, and it rests on the StartUP Portimão incubator's own company list (undated, footer 2023) plus its own site. No independent reporting found. The page says so.
- The incubator's list does not separate current members from alumni. A current member list is not found.
- No named private investor. The August 2026 Pitch & Match names none.
- No local talent listed: only with the person's agreement.
- The UAlg campus: January 2025 (about 15 million euros, AI named as a focus) against February 2026 (about 8 million euros, no AI mentioned, no tender). Current status and any AI course are not confirmed.
- The council's business desk and national funding schemes were not found on a page that opens.
- No second article was written: no new real local AI story passed the test after the first.

### Blocks and asks for Dinis
- Asked in `status.json`: whether to keep the hourly wake after the 07:00 stop (now moot: the schedule is being switched off).
- Several outlets block us with a bot challenge, so their Portimão AI stories are missing (see lessons).

## 4. Lessons learned

**Sources.** Barlavento, Algarve Primeiro, Marketeer, O Algarve (oalgarve.pt), ISMAT, cm-portimao.pt and startupportimao.pt open. postal.pt, Sul Informação, Visit Portimão, Algarve Vivo, emarp.pt and Algarve Marafado show a bot challenge or 403, so they are off limits. Barlavento often carries the same story as the blocked outlets, so cite Barlavento. Outlets' search-result dates are unreliable: read the date from the opened page. Where two reports disagree (TMCT dates, campus cost 15 against 8 million euros), say so in the page and gaps.

**What worked.** The best find was the incubator's own company list, which placed Guepardo and three software firms in Portimão. Reading a public body's official site beats searching for press. A short article that says plainly what is missing reads better than padding.

**What failed.** postal.pt links came up first in every search and were useless. Guepardo's own site gave nothing readable to WebFetch. The Centro de Negócios page on startupportimao.pt returns a 404. A search for "AI startups founded in Portimão" and for Portimão investors found nothing specific.

**Traps.**
- Gate: the article title must be under 12 words. The gate also wants the derived `data/stories/` entry, which `release.sh` creates.
- Never print em-dashes, en-dashes or semicolons in prose. The mandate line from the spec contains "Independent; every fact sourced" verbatim, which I kept.
- Contacts: link the official contact page, never copy raw emails or phone numbers.
- Signing: re-sign after **every** change to the page or an article, or the identity check fails. The page's site key and the article's agent key are different homes (`PKI_AGENT_HOME`).
- Contention: 17 agents release at once, so expect a rebase and a retry.
- Moving the site key: my ABP wants it under `~/.sg-send/sites/portimao`. A second label in `~/.sg-send/keys/` makes the session unidentified, so keep the site key in its own home.
- The "no change" wakes: the wake prompt says push nothing, but ABP rule R10 requires a run report for every run, so I filed report-only commits. This is noisy and was raised with Dinis.

**What I would do differently.** Start from the incubator's and council's official pages before searching press, and verify counts from the file (not from memory) before summarising them.

## 5. Identity and secrets

- Keys (public halves only, in `board/keys.json`): the agent key `place.portimao-promptugal` and the site key `site.portimao-promptugal` (`"kind": "site"`, `"site": "https://promptugal.news/algarve/portimao/"`). `identity.key_id` in my file names the site key, `identity.signed_by` the agent name.
- The private halves lived only in the old session (agent key in `~/.sg-send`, site key in `~/.sg-send/sites/portimao`). They are not in this repository and do not move.
- No lanes beyond my inbox, no vaults, no tokens held.
- **The new session must make its own keys** (`pki-agent.mjs keygen --session --name place.portimao@PrompTugal.dinis`, and the site key in its own `PKI_AGENT_HOME` home), add new entries with new ids or a suffix, mark the old two entries `superseded` with the time, set `identity` in the page file to the new site key id, and sign the page again. Until then the identity check will fail.

## 6. What the next session must do first

1. Onboard: CLAUDE.md, `board/guidance/README.md` (read "New from Dinis" first), the by-place guidance and brief, the research spec, `board/abp/place.portimao.md`, this debrief and `2026-11-16-handover.md`, `status.json`. Pull `dev`, check `board/HOLD.md`.
2. Make the new keys, supersede the old entries in `board/keys.json`, commit that as yourself, and work in `board/team/place.portimao/sessions/<session-id>/` for your notes (CLAUDE.md, "Handing a role to a new session").
3. Re-sign `data/by-place/portimao.json` with the new site key, run `validate.js` and `site-identity.mjs`, release.
4. Then deepen, in this order: independent confirmation of Guepardo and any other Portimão AI company (business register, StartUP Portimão's current members); named investors or funds; the UAlg campus's current status and AI courses; the council's business desk and national funding schemes; local talent only with consent; a second article if a real local AI story turns up.
