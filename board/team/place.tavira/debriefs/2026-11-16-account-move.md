# place.tavira account-move debrief (16 November 2026)

For a fresh session of place.tavira@PrompTugal.dinis on another account that knows nothing. Written because the conductor relayed, as Dinis's word, that all PrompTugal agents pause while they move to other accounts. Only Dinis instructs: if his verified word differs, his word wins. This adds to `debriefs/2026-11-16-handover.md`, which holds the early lessons. It was rewritten at about 20:10 UTC after the first copy was lost when the container was recreated.

## 1. Who I am and my mandate

- **Role:** the place agent for Tavira, the page at https://promptugal.news/algarve/tavira/. One of 17 Algarve place agents, each in its own session (brief: `board/briefs/2026-11-15-the-place-agents.md`, spec: `board/briefs/2026-11-15-place-research-spec.md`, Dinis's by-place guidance: `board/guidance/2026-11-14-promptugal-by-place.md`).
- **I own:** `data/by-place/tavira.json` and its `.sig`, `board/team/place.tavira/`, `board/runs/place.tavira/`, my own entries in `board/keys.json`, and up to two articles a night once the page is live (`content/articles/*.md` with `town: tavira`, signed in `articles/*.md.sig`). Not yet used: no local AI story has passed the test.
- **I never:** write another place's file or any code (ask dev.places@ by inbox or a commit `For:`), read a source behind a login, bot challenge or paywall, read websummit.com, lu.ma, luma.com, meetup.com or eventbrite.*, publish a private individual's personal contact, start sessions, scheduled tasks or sub-agents, push anywhere but `dev`, or sign my file with any key but the site key.
- **ABP:** `board/abp/place.tavira.md`, mode observe, re-anchored at every start by a hook. A call outside the grant is logged and reviewed hourly, not blocked.
- **Contacts rule since 15 November 2026 (CLAUDE.md, Content):** a contact published on a public body's official site may be shown, linked to the page it came from with the date read. I used it conservatively: I linked the gov.pt Espaço Empresa page and copied no phone or email.

## 2. How I operate

**The hourly wake prompt (pasted):**
"Hourly wake (place.tavira@PrompTugal.dinis; scheduled at Dinis's word of 15 Nov 2026: 'turn your and all the other agents schedule on'). If you are still mid-run, finish that first. Pull dev; if board/HOLD.md exists, stop and say why. Read board/guidance/README.md 'New from Dinis', your ABP (board/abp/place.tavira.md) and any message to you. Then one more pass of your loop (board/briefs/2026-11-15-the-place-agents.md): deepen data/by-place/tavira.json (the AI map first, then news, events, sources, gaps), re-sign it with your site key, validate, release with AGENT=place.tavira@PrompTugal.dinis newsroom/tools/release.sh (retry on conflict), status.json. If nothing new, say so in one line and push nothing. At about 200k tokens of context, write your hand-over first."
It fired at about :19 each hour (trigger `trig_01Fcm6hudzjjhvFv8NHD28wD`). The conductor switched it off on 16 November at about 15:45 UTC. It is not mine to change.

**One wake, step by step:**
1. Read the notification with ReadNotifications first.
2. `git pull -q --rebase origin dev`. Check `board/HOLD.md` (if it exists, stop and say why). Read the top rows of `board/guidance/README.md`. Check `board/inboxes/place.tavira.json` (its `messages` list was always empty, so I never opened the sealed lane).
3. Research with WebSearch (use `blocked_domains` for postal.pt, lu.ma, luma.com, meetup.com, eventbrite) and WebFetch. Use only pages I opened. A search snippet is a lead, never a fact.
4. Edit the JSON with a short `python3 -I` script (load, change, `json.dump(..., indent=2, ensure_ascii=False)`). Check `grep -cP '[—–;]' data/by-place/tavira.json` prints 0: no em-dashes, en-dashes or semicolons anywhere in the file.
5. Sign with the site key: `HOME=<site-key-home> node pki-agent.mjs sign data/by-place/tavira.json`. This writes the `.sig`. The tool: https://pki.sgit.ai/agents/pki-agent.mjs, copy sha256 begins `fcb28a1cc40d`. The ABP prescribes `PKI_AGENT_HOME=~/.sg-send/sites/tavira` for the site key.
6. `node newsroom/build/validate.js` must end with `OK`.
7. Update `board/team/place.tavira/status.json` (state, done, next, asks starting "Dinis:").
8. Commit: subject `place.tavira@PrompTugal.dinis: <what>`, trailers `Agent: place.tavira@PrompTugal.dinis`, `Issue: WS-177`, `For: Dinis`, then the session's attribution lines.
9. `node board/abp/tools/abp.mjs run-report --role place.tavira`, commit `board/runs/place.tavira/` (R10: a run without its report is a breach).
10. `AGENT=place.tavira@PrompTugal.dinis newsroom/tools/release.sh`. It rebases, runs the gate, pushes, then waits for the live site.

**When release.sh loses the race:** it retries five times by itself. If it gives up and a rebase conflict is left in `board/keys.json` (others append there), take upstream (`git checkout --ours board/keys.json` while rebasing), re-add my two entries from the commit with a script, `git add`, `GIT_EDITOR=true git rebase --continue`, then run release.sh again. "No release contains it after 6 minutes" is only a queued deploy: the commit rides the next release. If the gate is red for a file that is not mine, I do not edit it: I wait for its owner and say so.

**No sub-agents, no connectors.** Tools used: Bash, Read, Edit, Write, WebSearch, WebFetch, ReadNotifications.

## 3. State

**Page (live, signed, gate OK at the last release):** 7 map entries, 4 news items, 8 sources with feeds, 8 extras, 12 gaps, no events. Last content commit `6d5292c98` (March 2026 Polo completion headlines as a lead in the gaps). Later commits were run reports only. Run reports: `board/runs/place.tavira/`.

- **Map:** Polo de Inovação de Tavira (2 steps), Câmara Municipal de Tavira, Tavira Works, Centro Ciência Viva de Tavira, Level Up business centre and incubator, LOFT Community, DRAP Algarve CEAT. None is an AI company.
- **News:** parking sensors (Barlavento, 15 April 2026), Algarve 6.0 urban data platform (council sheet, May 2025), CCDR Algarve notice on the Polo works (20 December 2024), Polo launch (Agricultura e Mar, 26 November 2021).
- **Centre of gravity:** public research and public data. The Polo is a PRR project, 1.36 million euros on the PRR page and 1.68 million euros eligible per CCDR, with sensor irrigation. The digital therapeutics centre planned at launch is unconfirmed.
- **Extras:** starting a company in Tavira (gov.pt Espaço Empresa at Level Up, Empresa na Hora counter), council entrepreneur support, Espaço Empresa services, Ideias à Maré, IAPMEI 2018 incubator accreditation, #ALGARVEMAISDIGITAL, Algarve Evolution link.
- **Half-done:** the March 2026 reports that the CEAT requalification was carried out (above 2 million euros). The Recuperar Portugal, Jornal do Algarve, Região Sul, Agroportal and rederural.gov.pt pages were blocked or unreachable on every try. Only the headlines from search are recorded, in the gaps.
- **Open, not started:** investors and startups founded in Tavira, local talent who have spoken publicly, dated events, council grants for tech firms, registry searches (Racius, Informa D&B), Tavira Works and LOFT social pages, an article.
- **Asks for Dinis (also in status.json):** (1) Postal do Algarve serves a bot check, so I did not use it. (2) Algarve Evolution naming its Tavira members would fill the map fastest. (3) Allow rederural.gov.pt and the blocked news hosts, or give a text route, for the March 2026 Polo reports.

## 4. Lessons learned

**Worked:**
- Official public sources load: gov.pt, cm-tavira.pt, transparencia.gov.pt, ccdr-alg.pt, IAPMEI lists, agriculturaemar.com, tavira.works, loftcommunity.pt, the Algarve Biomedical Center's own About page.
- The PRR project page (transparencia.gov.pt) gave the centre of gravity. Starting from public funding records beats searching for companies.
- The council feed `cm-tavira.pt/site/feed/` loads but has held no items. Barlavento, Sul Informação, Portugal Resident and Postal have feeds.
- Honest AI paths: every entry says "2 or 3 steps" and "the source mentions no AI" where true. Never write a path stronger than the source.

**Failed or trapped:**
- WebFetch cannot read PDFs. Save the file from the tool-results path and use `pdftotext -layout`. Tavira Works, the Algarve 6.0 sheet and the IAPMEI list were all found that way.
- Postal do Algarve articles show a bot check. Sul Informação, Barlavento's archive, the ABC press pages, Portugal Resident, Agroportal, Jornal do Algarve, Região Sul and Recuperar Portugal often return 403 or 503. rederural.gov.pt does not resolve from the agent network.
- Searching "Tavira" finds companies elsewhere (London, India, Belgium, Miami). Never map them.
- Search snippets repeat contact details (phone, email, a named board member). Do not copy them.
- `board/keys.json` conflicts on release when others append at once (section 2).
- The gate is picky: dates must be strings, `steps` an integer 0 to 3, entry types from the schema list (`company, startup, organisation, institution, community, public body, investor`). `identity.key_id` is `site.tavira-promptugal`.
- The gate also checks other agents' files. On 16 November a bad entry in `board/schedule.json` turned it red for about five hours and my commits could not be pushed. Meanwhile the container was recreated and the local commits were lost. Lesson: write the debrief and push it first, and when the gate is red for someone else's file, tell the conductor at once instead of waiting.
- The deploy often lags: "no release contains it" is normal.

**Do differently:** start from official funding and registry pages on day one, not company searches. Ask Dinis for host access in the first hour, not the fifth.

## 5. Identity and secrets

- **Keys (public halves, in `board/keys.json`):** `place.tavira-promptugal` (me) and `site.tavira-promptugal` (the Tavira site, `kind: site`, `site: https://promptugal.news/algarve/tavira/`). Both made on 15 November 2026 with `pki-agent.mjs keygen --session`. Neither is linked to an operator or confirmed on pki.sgit.ai.
- **The private halves are gone:** they lived only in the old container's key store, which was not kept when the container was recreated. They were never in this repository. I print no value of any key, token or vault.
- **The new session must:** make its own keys (`node pki-agent.mjs keygen --session --name place.tavira@PrompTugal.dinis`, and the site key `--name site.tavira-promptugal` in its own home), add new entries to `board/keys.json`, mark the two old entries `superseded` with the time and `superseded_by`, then sign `data/by-place/tavira.json` again with the new site key and commit the `.sig`. The current `.sig` will no longer be checkable by a key anyone holds. Same flow as CLAUDE.md "Handing a role to a new session".
- **Inbox and lanes:** `board/inboxes/place.tavira.json` and `board/inboxes/site.tavira.json` exist. I never opened their sealed credentials, since no messages arrived through them. Cross-session notices arrive through the harness as notifications.
- **Vaults and tokens:** none held. No OpenRouter key used.

## 6. The next session must do first (in order)

1. Pull `dev`. Read `CLAUDE.md`, this file, `debriefs/2026-11-16-handover.md`, `board/abp/place.tavira.md`, the top of `board/guidance/README.md`, and `status.json`.
2. Check `board/HOLD.md` and Dinis's current word on whether place agents resume and on which account.
3. Make the two keys and supersede the old entries (section 5). Re-sign the file. Run `node board/abp/tools/site-identity.mjs` if it exists.
4. Retry the blocked Polo pages once. If still blocked, leave the gap as it is.
5. Search first-hand for investors, startups founded in Tavira, Tavira Works and LOFT events, registries and council grants.
6. Write an article only if a real local AI story passes the test, with every fact sourced, signed with the session key.
7. Run the wake loop (section 2) and file the run report each time.
