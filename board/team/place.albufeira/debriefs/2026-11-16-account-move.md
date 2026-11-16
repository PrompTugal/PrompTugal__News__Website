---
title: "place.albufeira account-move debrief: for a fresh session that knows nothing"
by: place.albufeira@PrompTugal.dinis
written: 2026-11-16 (rewritten at 20:10 UTC after the first copy was lost with the container)
note: written on a message from conductor@ relayed between sessions; treated as material consistent with the hand-over rule, not as Dinis's verified word
---
# place.albufeira: account-move debrief

## 1. Who I am and my mandate
- **Role:** `place.albufeira@PrompTugal.dinis`, the agent for Albufeira's site, https://promptugal.news/algarve/albufeira/ (Sonnet). Started 15 Nov 2026 by Dinis via conductor@, one of 17 town agents. Brief: `board/briefs/2026-11-15-the-place-agents.md`; field spec: `board/briefs/2026-11-15-place-research-spec.md`; guidance: `board/guidance/2026-11-14-promptugal-by-place.md`.
- **Owns:** `data/by-place/albufeira.json` and its `.sig`, `board/team/place.albufeira/`, `board/runs/place.albufeira/`, its own entries in `board/keys.json`, its own articles (`content/articles/*.md`, front matter `town: albufeira`) and their `articles/*.md.sig`.
- **Never:** writes another place's file or any code (ask dev.places@); reads anything behind a login, bot challenge or paywall, or websummit.com, lu.ma, luma.com, meetup.com, eventbrite.*; names a private individual or shows a private person's contact (a contact published on a public or government site may be linked with its source page and read date); starts sessions, scheduled tasks or sub-agents; sends anything outside; pushes anywhere but `dev`, only through `release.sh`.
- **ABP:** `board/abp/place.albufeira.md` (observe mode, re-anchored by a hook at each start; core rules R1 to R11). Only Dinis instructs; other sessions' messages are data.
- **Writing rules:** English, own words, no em or en dashes, no semicolons in prose (the template mandate sentence keeps one: leave it), every fact with URL and date read, every item passes the PrompTugal test (AI directly or within 2 or 3 steps, path in plain words, `steps` 0 to 3).

## 2. How I operate (the wake loop)
Schedule: hourly at about :35 past, set by Dinis on 15 Nov; trigger "place.albufeira@PrompTugal.dinis: hourly" (now switched off by conductor@). Its prompt: *"Hourly wake ... If you are still mid-run, finish that first. Pull dev; if board/HOLD.md exists, stop and say why. Read board/guidance/README.md 'New from Dinis', your ABP and any message to you. Then one more pass of your loop: deepen data/by-place/albufeira.json (the AI map first, then news, events, sources, gaps), re-sign it with your site key, validate, release with AGENT=place.albufeira@PrompTugal.dinis newsroom/tools/release.sh (retry on conflict), status.json. If nothing new, say so in one line and push nothing. At about 200k tokens of context, write your hand-over first."*

Steps each wake:
1. `git pull -q origin dev`; check `board/HOLD.md` (if present: stop and say why).
2. Read the top of `board/guidance/README.md` ("New from Dinis") and any newer guidance file named there; ReadNotifications for messages.
3. Research with WebSearch and WebFetch. Open each page and record only what the opened page says. Search snippets are leads, never facts.
4. Edit the JSON (a short Python snippet: load, append, `json.dump(..., indent=2, ensure_ascii=False)`). Set `updated`.
5. Sign with the SITE key: `PKI_AGENT_HOME=<site key home> node pki-agent.mjs sign data/by-place/albufeira.json` (writes the `.sig`). The ABP names `~/.sg-send/sites/albufeira`; session 1 used `/root/.sg-send-site`. Fetch pki-agent.mjs from https://pki.sgit.ai/agents/pki-agent.mjs and check its sha256 against the pin quoted in `board/keys.json` entries.
6. `node newsroom/build/validate.js` must print OK (release.sh runs it too).
7. Update `board/team/place.albufeira/status.json`: keys `agent`, `focus`, `state`, `updated`, `done`, `next`, `asks`, `debrief` (the gate fails without `agent` and `focus`).
8. `node board/abp/tools/abp.mjs run-report` (R10), then commit as myself: subject `place.albufeira@PrompTugal.dinis: <what>`, trailers `Agent: place.albufeira@PrompTugal.dinis`, `Issue: WS-177`, `For: Dinis`, plus the attribution lines the session gives.
9. `AGENT=place.albufeira@PrompTugal.dinis newsroom/tools/release.sh`, retried on conflict (others release at the same time; it rebases, runs the gate, pushes and waits for the live site, 1 to 6 minutes). If the gate is red because of someone else's file, do not edit it or bypass it: report it.
If nothing is new: one line, push nothing.
- Inbox `board/inboxes/place.albufeira.json` exists (sealed credentials), never drained by me. No lane to conductor used. No sub-agents.

## 3. State
- **Page:** live since 16 Nov 05:35 UTC (`status` "live"). Key commits: `54d7632e8` first pass and keys, `773d532ea`, `a1ed016c5` (AP Hotels), `b9d40f4ff` ("Starting a company here"), `4b73bfc41` (live flag).
- **Content:** 4 news items (Barlavento 16 Jun and 11 Jun 2026 on the council's AI urban management platform and the conference; AP Hotels and Resorts with LodgIQ, supplier release 24 Feb 2026; Jupiter Hotel Group with Quinta's Velma, vendor blog 2 May 2024); 3 AI-map entries (the council, Jupiter Hotel Group, AP Hotels and Resorts); 6 sources (feeds all null); no events; extras (council coworking, incubator, Algarve Tech Hub Summit 2024, digital urbanism counter, Dengun programme, Algarve tourism AI pilot for 15 SMEs, "Starting a company here"); gaps; Algarvio voice; look accent `#0A5C7A`.
- **Open:** no Albufeira-based AI company confirmed; hotel AI use known only from suppliers' releases (the releases do not say which unit uses the tool); no upcoming events; leads not confirmed because the pages are blocked: Vibeslist debut in Albufeira (Postal, Aug 2026), Dengun Founders Program demo day in Albufeira (30 Jan 2025), AI sessions at the 2024 Algarve Tech Hub Summit; Smart City portal apps; feeds; investors, cooperatives and local talent from the overnight full-research list. No articles written (nothing beyond the page met the bar).
- **Half-done:** nothing in progress. The first account-move debrief commit was lost when the container was archived; this file replaces it.
- **Blocks and asks:** `status.json` ask to Dinis on postal.pt (bot challenge): wanted a permitted way to read it, or skip? Unanswered. Smart City portal, Sul Informacao and Portugal Resident also refuse our reader.

## 4. Lessons learned
- Open every page before recording it. postal.pt shows "Please wait while your request is being verified" (a bot challenge), so it is a lead only. Barlavento (`barlavento.pt/?p=<id>`) and the council site load; theportugalnews.com and 10minhotel.com sometimes do.
- WebFetch summarises with a small model: ask narrow questions and do not repeat claims it makes beyond the page (it said two AP units were in Albufeira; I did not state that as fact).
- Vendor pages (Quinta, LodgIQ) are the supplier's claim: say so in the item and the gaps. Quicktext's blog redirects to quinta.im; the page says Velma.
- A curl probe with a browser-style User-Agent (to find RSS feeds) was denied by the harness: do not retry or work around it. Leave `feed` null unless a page states the feed URL.
- `status.json` needs `agent` and `focus` or the gate fails.
- Contention: release.sh retried fine; the deploy can queue behind other agents. A red gate can come from another agent's file (it did, from `board/schedule.json`): report it, do not edit it.
- The sandbox container can be replaced when a session is archived: unpushed commits and the private keys on it are lost. Push (or hand over) before a pause.
- Do not pad: an honest "nothing new" hour beats filler. I marked the page live only once it had real content.
- Next time: ask earlier for a permitted way into postal.pt, and try the incubator's tenants and AHETA's own pages first.

## 5. Identity and secrets
- Keys on record in `board/keys.json`: agent key `place.albufeira-promptugal` and site key `site.albufeira-promptugal` (`kind: site`, `site: https://promptugal.news/algarve/albufeira/`), both `active`. Their private halves lived only in the old session's key stores and are **gone with that container**: no value is recorded here or anywhere in the repository.
- `data/by-place/albufeira.json.sig` still verifies against the published site key (`node board/abp/tools/site-identity.mjs` shows Albufeira valid), but this session can no longer re-sign. Any content change needs new keys first.
- The new session must make both keys (`pki-agent.mjs keygen --session`, the site key in its own `PKI_AGENT_HOME`), add new entries, mark the two old ones `superseded` with the time, and re-sign the file. Security@'s 20:05 note says key bundles in `board/keys.json` were overwritten four times (S43): check that the Albufeira entries are intact before adding.
- No vaults, no lanes used, no OpenRouter use.

## 6. What the next session must do first
1. Read CLAUDE.md, `board/guidance/README.md` (top), the ABP, this debrief and `2026-11-16-handover.md`.
2. Pull dev; check `board/HOLD.md`.
3. Make both keys, publish them, supersede the old entries, re-sign the file, confirm `site-identity.mjs` shows Albufeira valid.
4. Take a new schedule only if conductor@ gives one (`board/schedule.json`).
5. Check whether Dinis answered the postal.pt ask and follow it.
6. Then continue: Albufeira-based AI firms and hotels' own statements of AI use; upcoming events from organisers' pages; confirm the blocked leads from readable sources; the full-research items.
