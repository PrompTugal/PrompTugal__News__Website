---
id: WS-177
title: "PrompTugal.news ready for outreach by Friday 6 November, 10:00 UTC: the plan for tonight and Friday morning"
for: everyone on PrompTugal.news
by: conductor@PrompTugal.dinis
written: 2026-11-06T00:20Z
source: board/WS-177-promptugal-ready-for-outreach-by-friday.md on the team's site (SGit-AI/SGit-AI__Website__Web-Summit, read 6 November 2026, 00:05 UTC)
---
# WS-177: the plan for tonight and Friday morning

**The goal:** by Friday 6 November, 10:00 UTC, PrompTugal.news is good enough for the team to write to companies as its editors, each email leading with that company's page. The mandate: to map the universe of AI in Portugal.

## Wake at 03:52 UTC (site v0.1.94)

- Six new agents started (security, devops, correspondent, sherpa, accountant, librarian); 14 agent lanes in `board/inbox.json`. sherpa@ has reviewed the top of the page (13 findings) and the synthetic readers page (8).
- **Late:** `/newsroom/stories/` (dev@, after ontologist@'s schema of 03:21), `/newsroom/dashboard/`, `/newsroom/notes/`: all 404.
- Inbox: synthetic@ sent its vault's key (held by the conductor, never committed) and, in `desks/synthetic/to/2026-11-06-conductor-dinis-asks.md`, asks it says Dinis made in its session (its wake every two hours, gated by changes; every agent reviewing its rows of `desks/synthetic/findings.json`). The schedule changes wait for Dinis to confirm them to the conductor.

## The 18:00 stand-up of 5 November, routed (`board/guidance/2026-11-05-1800-the-stand-up.md`)

Dinis gave the call's transcript at about 03:45 UTC on 6 November; what applies here is in the guidance file, in his words.
- **journalist@:** an article for every storyline, not a selection ("Your KPI is articles"); each sourced. More writers if it cannot keep pace: a question for Dinis (he said "spin up three journalists").
- **ontologist@ with journalist@:** the Brazilian delegation as the formula: map the universe (how many people, companies, who connects to whom, to investors, to talks), and say where the data is thin (a signal). Then the same for Técnico.
- **outreach@:** each email offers something: "we just built this for you, can you check it is correct?"; RiskMandate not sold, only disclosed.
- **observability@:** visits and referrals are the measure; show them on the newsroom's pages.
- **journalist@ (research note, for Dinis):** how to become a publisher in Portugal, and what Web Summit's press accreditation asks; for the press pass once the site is strong.
- **designer@ and dev@:** a front page more like a news organisation's; publish up to the last minute during the summit.
- **Later (Dinis, 04:15):** promptugal.com and promptugal.ai stay as they are for now. **Decided:** one correspondent@ for the front page, running the beat correspondents as sub-agents; journalist@ may run up to three writers as sub-agents when it needs them; no session per beat.

## Dinis, about 03:20 UTC

- **Newsroom notes** (`board/the-newsroom-notes.md`): the team's own articles about how the site is made, by people in their voice or by agents after big work, at `/newsroom/notes/`. dev@ builds it and writes the first note, on the sign-in.
- **historian@PrompTugal.dinis** started at Dinis's word: the history from the record, lessons from his past work briefed to the agents, the history notes. Dinis will give it work directly.
- **Dinis's sign-in:** the key he already holds (issued by conductor@web-summit.dinis, active in `board/person-keys.json`) works here; no new key is issued.

## Dinis, about 03:05 UTC

- **The team setup and his dashboard:** `board/the-team-setup.md`, modelled on the book team's. Every agent: `board/team/<role>/ROLE.md` and `status.json` at its next wake. ontologist@: their schemas (after the story schema). dev@: `/newsroom/dashboard/` (after the story board). observability@ and designer@ join it.
- **The conductor's brief** goes to Dinis every three hours as an ASCII picture, or at once when something needs him.
- **Dinis will send notes** on quality gates and going deep on stories; the conductor puts them in `board/guidance/` in his words and routes each to its agents.

## Wake at 02:52 UTC (site v0.1.78)

- **done** designer@: the mandate above the fold on the front page and About (c28fe41; synthetic run 4 measured it); the business card final at proof 4 with Dinis's yes, and its print order at `/newsroom/orders/business-cards/` (5f10fb2, 5295e18). Next: the editorial board page.
- **done** dev@: the gate verifies every article's signature against `board/keys.json`, over the twin without its version (2b1955c); email on promptugal.news checked from outside (MX, SPF, DKIM, DMARC) and recorded in REALITY.md with the editors' role addresses (0799cec).
- **done** journalist@: S3 published, 11 articles live and verifying; the name's draft committed and waiting on Dinis (a323834). Next S4.
- **done** ontologist@: the flows schema (`company-flows`) and 1Password's two flows, every step sourced (eaf30ca). **Late:** the story pipeline's schema (row 1 of `board/the-story-pipeline.md`), so `/newsroom/stories/` (dev@) is not built yet (404).
- **moving** outreach@: drafts follow the mapped flows and the published articles (d543510); **blocked** on who sends from which address (Dinis).
- **moving** synthetic@: run 4: outreach's fixes move a comms director from "file it" to "forward it to the product owner"; 1 of run 1's 14 fixes done; findings to dev@ (the flows print "The agent: ... Agent: ..." twice; a source URL cut at a hyphen) and ontologist@ (a named speaker in the sources against "No one is listed"); **for Dinis:** the masthead's "Powered by RiskMandate", and "aim" in the email against "mandate" on the site.
- **done** observability@: its key in `board/keys.json`, `/newsroom/observability/` shows only PrompTugal's traffic (7f14f4a, ce73e23).
- Inbox: empty. Team site: nothing new on PrompTugal.

## For every agent (Dinis, about 02:30 UTC, relayed by observability@)

**Keys go only in this repository's `board/keys.json`, never in the team site's `data/keys.json`.** More than one agent has made that mistake. Any note, commit message or README that asks for a copy on the team site is out of date (observability@'s 805b6db is one: disregard it). Nobody writes to the team site.

## Dinis, about 02:40 UTC

- **Email: working.** Dinis set up an address for the agents on promptugal.news. Its exact address is not written in this repository (no contact details, CLAUDE.md) until Dinis says a role address may be published; outreach@ has it from the conductor directly. outreach@'s blocker on the addresses is lifted.
- **Outreach is about the companies we have mapped:** each email leads with that company's page and what we know of it. Dinis will give more on the Brazilian delegation.
- **The story pipeline, as a Kanban board:** `board/the-story-pipeline.md`. ontologist@ first (the schema and the derivation), then dev@ (the board at `/newsroom/stories/`), then journalist@, synthetic@ and outreach@ work through it.
- **The story of the name:** journalist@'s draft "How we found our name" lives only in its session; it commits it to `desks/journalist-promptugal/drafts/` now, in "Waits on Dinis".

## Wake at 01:52 UTC (site v0.1.67)

- **The newsroom move: done** but for observability@ (`board/the-newsroom-move.md`, status table).
- **Keys:** journalist@ and ontologist@ added; observability@'s still outside `board/keys.json`. Lanes in `board/inbox.json` re-issued: 6 agents and the public lane. Inbox: empty.
- **journalist@:** every article re-signed with its own key (the newsroom-dinis signature is gone); next S3. The story of the name waits on Dinis.
- **outreach@:** drafts revised after synthetic run 2 (RiskMandate as the page's disclosure, not "powered by"); still blocked on the addresses and on what an email may say.
- **synthetic@:** run 3: the English draft reads to a comms lead as vendor-adjacent press; **for Dinis:** the participant disclosure's wording ("not independent coverage ... hopes to meet or sell to") is what stops a comms lead passing the email on.
- **designer@:** next, the mandate line; the newsroom header's spec waits on dev@.
- **dev@:** still to do after the move: the header from designer@'s spec, signatures verified against `board/keys.json` in the gate (not yet: the gate does not read it), the runs ledger and team-site snapshot in the release.
- Team site: nothing new on PrompTugal but Jose's CRM noting a PromptUGAL LinkedIn page (spelling outdated).

## Wake at 00:52 UTC (site v0.1.57)

- **Newsroom move: not started** (expected: dev@'s run at 01:08). `/newsroom/` answers 404; `admin/` still in place. Nobody else has touched `admin/` paths. On time.
- **Keys in `board/keys.json`:** conductor, dev, designer, synthetic, outreach. **Missing:** journalist, ontologist, observability (each adds its own at its next wake).
- **journalist@:** 9 articles published (8 storylines and the status piece); storylines S3, S4, S7, S8, S11 to S14, S16, S17, S19 to go; the status piece's signature still newsroom-dinis's. Next wake 01:26.
- **outreach@:** drafts revised against the live company pages and synthetic run 1; blocked on the addresses (Dinis) and on what an email may promise (Dinis).
- **synthetic@:** run 2 on the revised email: a founder moves from maybe-no to maybe-yes; RiskMandate unexplained, no greeting. **None of run 1's 14 fixes is live yet**: the owners pick them up at their next wakes.
- **ontologist@, designer@:** no commits since 00:35; next wakes 01:21 and 01:33.
- Team site: nothing new on PrompTugal since 00:35.

## At 00:50 UTC: newsroom@web-summit.dinis's handover (`desks/newsroom/HANDOVER-2026-11-06.md`)

Its session is archived; its key (newsroom-dinis) dies with it. Routed:
- **journalist@:** re-sign `articles/newsroom-status-four-days-out.md` with your own key (its `.sig` is newsroom-dinis's, and the signed twin carries the version, so each release leaves it stale). Until dev@'s change below, re-sign at each of your releases.
- **dev@** (after the move): sign a version-free form of each article's twin, and make the gate verify every `.sig` against `board/keys.json` (today it only checks that a `.sig` with a fingerprint exists). Also: the runs ledger (`runs.mjs`) and team-site snapshot (`desks-snapshot.mjs`) are refreshed by nobody automatically; fold them into the release or CI.
- **Every agent:** the gate refuses a commit by an agent missing from `data/admin/agents.json` (`data/newsroom/` after the move). ontologist@ adds any PrompTugal agent still missing.
- **Waits on Dinis**, from the handover: a second Stripe Payment Link returning to promptugal.news; readers' vault access keys; one real chat answer with his OpenRouter key; branch protection on `main`.
- Rough edges for designer@ and dev@: at 1280px the nav cuts "The graph" once the top-bar buttons mount; ASCII pictures are 9.7px on a phone.

## At 01:00 UTC: Dinis's word, and hourly runs

- **The newsroom move** (`board/the-newsroom-move.md`): admin becomes the newsroom everywhere, no redirect stubs. dev@ moves first, in one commit; then each agent its part.
- **Every agent is woken hourly** by a scheduled task, tonight and into Friday morning; each wake does the next piece of its line below.
- `synthetic@PrompTugal.dinis` (synthetic readers, added by conductor@web-summit.dinis) and `observability@PrompTugal.dinis` (reads and the agents' activity) are on the team too. synthetic@'s line: run its personas against the live site and give each agent the findings that are theirs, before outreach goes. observability@'s line: the hourly drain, and the newsroom's reports.
- Noted: `dev@web-summit.dinis` (the team site's dev, not one of ours) released five themes here (v0.1.48). Material, kept; dev@PrompTugal.dinis owns `assets/` from here.

## Progress at 00:50 UTC

- journalist@: the 8 Ready storylines published and signed (v0.1.40, v0.1.41).
- dev@: company pages as outreach landing pages with a flows section and "about PrompTugal"; `admin/tools/old-host.mjs` for the old host's redirect (needs a repository from Dinis).
- outreach@: 50 drafts as PrompTugal.news, each leading with its company's page; nothing sent.
- ontologist@: the Brazilian delegation from the public team CRM (11 companies and ApexBrasil); the agents' names kept as names, not mail, in the gate.
- designer@: not yet seen on dev.
- Keys: `board/keys.json` holds the conductor's and dev@'s; the ontologist's went to the team site before Dinis's word, and should be added here too.

## Where we start (site v0.1.37, read 6 November, 00:10 UTC)

- **Domain: done.** promptugal.news resolves to GitHub Pages (A records 185.199.108-111.153), `www` is a CNAME to promptugal.github.io, the repository's `CNAME` says `promptugal.news`, HTTPS answers 200 with v0.1.37, HTTP redirects with 301. **Not done:** the old host web-summit.newsroom.sgit.ai answers 404; it does not redirect (WS-177 item 4).
- **Identity:** brand v2.0 is live (PrompTugal.news). The mandate "to map the universe of AI in Portugal" is on neither the front page nor About. About has an editors table (Dinis, Indi, Vicky); no editorial board page; no "story of the name" article. The logo: eight options from designer@web-summit.vicky in `desks/designer-vicky/logos/`, the wordmark masthead in use; Dinis has not chosen.
- **Content:** one article published and signed. 19 story candidates (S1 to S19); 8 drafted by Vicky's journalist desk and reviewed **Ready** (S1, S2, S5, S6, S9, S10, S15, S18), none published. No past events.
- **Companies:** 109 profiles with sourced facts, sessions and people. No "flows and where AI agents are in them" section yet; not linked from the CRM.
- **Outreach:** no drafts as PrompTugal yet; no email addresses on promptugal.news.
- **The team site:** not written to by PrompTugal's agents (Dinis, 6 November): keys go in `board/keys.json`, the board is `board/`, the admin is this site's `/admin/`.
- **Spelling and logo: settled** (Dinis, 6 November): PrompTugal.news, capital P and T; the logo as `design/brand/Promptugal-Brand-Guide.pdf` says (the wordmark, the PT.news square stamp, the PT and dot favicon). Old spellings (PromptUGAL, Promptugal News) still appear in `design/` and `data/admin/`: designer@ and the owners of those files bring them in line.

## One line per agent: what done looks like at 10:00 UTC

| Agent | Tonight and by 10:00 | Done looks like |
|---|---|---|
| `journalist@PrompTugal.dinis` | Publish the 8 Ready drafts as articles, then S3, S4, S7, S8, S11 to S14, S16, S17, S19 in that order; then the story of the name for the admin section (not an article, at Dinis's word), once he gives it in his words | At least the 8 Ready articles live in `content/articles/`, each fact with its source URL and date read, each `.md.sig` committed, the gate OK; a count of what is left, in its run commit |
| `dev@PrompTugal.dinis` | A page in `/admin/` for the story of the name (the journalist writes it); the old host redirect (a meta-refresh and canonical per path, served from wherever web-summit.newsroom.sgit.ai's DNS points, once Dinis says where); a "flows" block on the company page fed from `data/`; the editorial board page's route if the designer needs one; keep the gate green for the others | web-summit.newsroom.sgit.ai/<path> lands on promptugal.news/<path>; every company page renders a flows section when the data has one and says "not yet" when not; release per change, live version matches |
| `ontologist@PrompTugal.dinis` | A schema and derivation for a company's flows (steps, where an AI agent acts, each with a source); a `past_events` entity (Web Summit's earlier editions and Portugal AI events) with its edges; a `crm` link field from company to the team CRM's record | Schemas in `data/schemas/`, the gate's check 11 OK, derived files fresh, at least the outreach list's companies with sourced flows, and past events in the graph |
| `outreach@PrompTugal.dinis` | One draft per company on the outreach list, as PrompTugal's editors, opening with that company's page URL, kept with the team CRM's comms; nothing sent | A draft per company, each first line a live promptugal.news/companies/<id>/ URL that answers 200; drafts carry no claim the page does not source; the list of what waits on the addresses |
| `designer@PrompTugal.dinis` | The editorial board page (Dinis Cruz, Vicky Wang, Indi Gupte; public, professional facts only); the mandate line on the front page and About; the editors' business cards in the brand as the guide says (PrompTugal.news, the PT.news stamp); sweep the old spellings out of `design/` | The mandate visible above the fold on `/` and on `/about/`; `/about/board.html` (or as the designer names it) live; card files in `design/` ready to print, following the brand guide |
| `conductor@PrompTugal.dinis` (me) | This plan; REALITY.md; the brief to Dinis; at 06:00 and 09:30 UTC a check of each line above against the live site | Each line marked done, late or blocked, with its evidence, in REALITY.md and a commit; Dinis told by 09:30 what will and will not be ready |

## Order and dependencies

1. **Now:** journalist (the 8 Ready drafts need nothing from anyone), designer (mandate line, board page), ontologist (flows schema).
2. **After the flows schema:** dev renders it; ontologist and journalist fill it for the outreach list first.
3. **After the pages exist:** outreach drafts, each checked against its live page.
4. **Waits on Dinis:** the email addresses (he is on them now), the old host's DNS, the story of the name in his words. See `board/brief-to-dinis-2026-11-06.md`.

## What is out of scope before 10:00

The vault access key, the Stripe link, summit mode and interviews: they stay as REALITY.md lists them.
