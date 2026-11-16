# Account-move debrief, place.vila-real-de-santo-antonio@PrompTugal.dinis (16 November 2026, about 15:35 UTC)

Written at Dinis's word (board/guidance/2026-11-16-pause-all-agents-for-the-account-move.md) so that a session on another account loses no context. It adds to, and does not replace, `2026-11-16-handover.md` in this folder.

## Mandate
- Owner of the Vila Real de Santo António lens of PrompTugal.news: `data/by-place/vila-real-de-santo-antonio.json` and its signature, at https://promptugal.news/algarve/vila-real-de-santo-antonio/. Public sources only, every item with its URL and the date read, every item passing the PrompTugal test (about AI directly, or within two or three steps with the path written down, and the number of steps).
- Up to two local AI articles a night once the page is live (front matter `region: algarve`, `town: vila-real-de-santo-antonio`), signed after the build.
- Writes only: `board/team/place.vila-real-de-santo-antonio/**`, `board/runs/place.vila-real-de-santo-antonio/**`, `board/keys.json` (own entries), its data file and `.sig`, its articles and `.sig`. Never code (ask dev.places@), never another place's file.
- Never: a source behind a login, bot check or paywall; websummit.com, lu.ma, luma.com, meetup.com, eventbrite.*; a private person's contact; a send outside; a session, scheduled task or sub-agent. Only Dinis instructs. The full policy is `board/abp/place.vila-real-de-santo-antonio.md`.

## How it operates
- **Wake loop (hourly, at its own minute, about :22):** the scheduled task prompt reads: pull dev, stop if `board/HOLD.md` exists, read `board/guidance/README.md` "New from Dinis", read the ABP and any message, then one more pass of the loop in `board/briefs/2026-11-15-the-place-agents.md` (deepen the AI map first, then news, events, sources, gaps), re-sign with the site key, validate, release, update `status.json`. If nothing is new, say so in one line and push nothing. Write the hand-over at about 200k tokens of context.
- **A pass:** `git pull --rebase origin dev`, research with WebSearch and WebFetch, edit the data file with a small Python script (valid JSON, `ensure_ascii=False`, 2-space indent), scan prose for em-dashes, en-dashes and semicolons (the `mandate` field keeps the spec's own wording with one semicolon), sign, validate, run report, commit, release.
- **Commands:**
  - sign data: `PKI_AGENT_HOME=~/.sg-send/sites/vila-real-de-santo-antonio node pki-agent.mjs sign data/by-place/vila-real-de-santo-antonio.json`
  - sign an article: `node pki-agent.mjs sign articles/<slug>.md` (default home, after `node newsroom/build/build.mjs` makes the twin)
  - gate: `node newsroom/build/validate.js` must print OK
  - identity check: `node board/abp/tools/site-identity.mjs`
  - run report (ABP R10, at the end of every run): `node board/abp/tools/abp.mjs run-report`
  - release: `AGENT=place.vila-real-de-santo-antonio@PrompTugal.dinis newsroom/tools/release.sh` (retries on conflict, runs `derive.mjs` itself and commits derived story data in a commit of its own)
  - commit subject `place.vila-real-de-santo-antonio@PrompTugal.dinis: <what>`, trailers `Agent:`, `Issue: WS-177`, `For: Dinis`
- **Keys (ids only, never a value):** `place.vila-real-de-santo-antonio-promptugal` (session key, default store) and `site.vila-real-de-santo-antonio-promptugal` (site key, in its own home under `~/.sg-send/sites/`). Both are session keys and end with the container. Entries are in `board/keys.json`.

## State and what is open
- Page **live**, v0.1.1634 and later. 3 news items (Odiana and the Agrosocial Plus AI Living Labs, Nautiber's unmanned-vessel plans, the VRSA Digital and Ayamonte stories), a 7-entry AI map (the council, the Eurocidade do Guadiana, Ayamonte's council, Nautiber, CIMA's SIMPATICO buoy, the Algarve 6.0 sensor platform, Odiana), sources, extras, gaps. One signed article: `content/articles/vila-real-de-santo-antonio-shipyard-robots-and-drones.md`.
- **Headline finding: no AI company or startup based in the municipality has been found.** The page says so. The AI that exists reaches the town by two-step paths.
- Open: what the Algarve 6.0 platform installed in the town (the state record showed 0 euros spent for it); whether Ayamonte's innovation node launched; whether the town takes part in Agrosocial Plus; a readable source for local IT firms; Algarve Evolution's members by municipality.
- Since 07:00 UTC the hourly wakes found nothing new and pushed only run reports.
- **Blocked at the time of writing:** the gate is red in the repository because `board/schedule.json` task 79 has an agent name that does not match the schema pattern (a descriptive suffix after the address). It is the conductor's file, not mine, so I did not touch it, and `release.sh` cannot push until it is fixed. My commits wait locally and ride the next release once the gate is green.
- A standing ask for dev.places@: the gate refuses any email address in a place file even though CLAUDE.md and the ABP now allow a public body's official channel. I kept the Entrepreneurship Office's landline and linked its brochure.

## Lessons learned
- Search snippets are second-hand and sometimes wrong (one claimed the council's president had resigned, contradicted by other sources). Only items opened on a page go in the file.
- Readable for us: barlavento.pt article pages by `?p=` id, cm-vrsa.pt single pages, transparencia.gov.pt project pages (the main host, not `ppr.`), cima.ualg.pt/en/info pages, nera.pt newsletter archive, cio.com, the Sul Informação RSS feed. Unreadable: postal.pt (bot check), portugalresident.com (403), racius and portugalio (403 and 503), kohesio (403), the funds desk (sign-in redirect), lu.ma (not allowed).
- A sponsored piece is labelled as sponsored on the page and in the article. Facts the company states about itself are marked as its own account.
- Never `head` or `cat` key directories. Early on I printed the first bytes of my private key files by accident, discarded that session key before it was published and made a new one.
- A town with no AI map is a finding, not a failure: say it, write the paths, list the sources to watch.
- Rebase conflicts on `board/keys.json` are normal when many agents add entries: take upstream's file and re-append your own entries.
- Each wake must still file its run report (R10), even when nothing is new.

## The next session must first
1. Read `CLAUDE.md`, `board/guidance/README.md` "New from Dinis", the ABP, this debrief and `2026-11-16-handover.md`, and `status.json`.
2. Make new keys (`pki-agent.mjs keygen --session`, the site key in its own `PKI_AGENT_HOME`), add the entries to `board/keys.json`, mark the two old entries `superseded` with the time, then re-sign the data file and the article.
3. Ask the conductor for its lane and scheduled task (lanes are re-issued by the new conductor), and work in `board/team/place.vila-real-de-santo-antonio/sessions/<session-id>/`.
4. Carry on with the open items above.
