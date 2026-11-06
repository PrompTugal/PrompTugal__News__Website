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

## Where we start (site v0.1.37, read 6 November, 00:10 UTC)

- **Domain: done.** promptugal.news resolves to GitHub Pages (A records 185.199.108-111.153), `www` is a CNAME to promptugal.github.io, the repository's `CNAME` says `promptugal.news`, HTTPS answers 200 with v0.1.37, HTTP redirects with 301. **Not done:** the old host web-summit.newsroom.sgit.ai answers 404; it does not redirect (WS-177 item 4).
- **Identity:** brand v2.0 is live (PrompTugal.news). The mandate "to map the universe of AI in Portugal" is on neither the front page nor About. About has an editors table (Dinis, Indi, Vicky); no editorial board page; no "story of the name" article. The logo: eight options from designer@web-summit.vicky in `desks/designer-vicky/logos/`, the wordmark masthead in use; Dinis has not chosen.
- **Content:** one article published and signed. 19 story candidates (S1 to S19); 8 drafted by Vicky's journalist desk and reviewed **Ready** (S1, S2, S5, S6, S9, S10, S15, S18), none published. No past events.
- **Companies:** 109 profiles with sourced facts, sessions and people. No "flows and where AI agents are in them" section yet; not linked from the CRM.
- **Outreach:** no drafts as PrompTugal yet; no email addresses on promptugal.news.
- **The team site:** this session could not attach it for push (refused by the session's permission check, as on newsroom@'s first run), so this conductor's key and its peer note are not there yet. See the brief to Dinis.

## One line per agent: what done looks like at 10:00 UTC

| Agent | Tonight and by 10:00 | Done looks like |
|---|---|---|
| `journalist@PrompTugal.dinis` | Publish the 8 Ready drafts as articles, then S3, S4, S7, S8, S11 to S14, S16, S17, S19 in that order; then "the story of the name" once Dinis gives the name's story in his words | At least the 8 Ready articles live in `content/articles/`, each fact with its source URL and date read, each `.md.sig` committed, the gate OK; a count of what is left, in its run commit |
| `dev@PrompTugal.dinis` | The old host redirect (a meta-refresh and canonical per path, served from wherever web-summit.newsroom.sgit.ai's DNS points, once Dinis says where); a "flows" block on the company page fed from `data/`; the editorial board page's route if the designer needs one; keep the gate green for the others | web-summit.newsroom.sgit.ai/<path> lands on promptugal.news/<path>; every company page renders a flows section when the data has one and says "not yet" when not; release per change, live version matches |
| `ontologist@PrompTugal.dinis` | A schema and derivation for a company's flows (steps, where an AI agent acts, each with a source); a `past_events` entity (Web Summit's earlier editions and Portugal AI events) with its edges; a `crm` link field from company to the team CRM's record | Schemas in `data/schemas/`, the gate's check 11 OK, derived files fresh, at least the outreach list's companies with sourced flows, and past events in the graph |
| `outreach@PrompTugal.dinis` | One draft per company on the outreach list, as PrompTugal's editors, opening with that company's page URL, kept with the team CRM's comms; nothing sent | A draft per company, each first line a live promptugal.news/companies/<id>/ URL that answers 200; drafts carry no claim the page does not source; the list of what waits on the addresses |
| `designer@PrompTugal.dinis` | The editorial board page (Dinis Cruz, Vicky Wang, Indi Gupte; public, professional facts only); the mandate line on the front page and About; the editors' business cards in the brand, with the name spelled as Dinis decides; apply the logo Dinis picks | The mandate visible above the fold on `/` and on `/about/`; `/about/board.html` (or as the designer names it) live; card files in `design/` ready to print, waiting only on Dinis's spelling and logo |
| `conductor@PrompTugal.dinis` (me) | This plan; REALITY.md; the brief to Dinis; at 06:00 and 09:30 UTC a check of each line above against the live site | Each line marked done, late or blocked, with its evidence, in REALITY.md and a commit; Dinis told by 09:30 what will and will not be ready |

## Order and dependencies

1. **Now:** journalist (the 8 Ready drafts need nothing from anyone), designer (mandate line, board page), ontologist (flows schema).
2. **After the flows schema:** dev renders it; ontologist and journalist fill it for the outreach list first.
3. **After the pages exist:** outreach drafts, each checked against its live page.
4. **Waits on Dinis:** the logo, the name's spelling on the cards, the email addresses, the old host's DNS, access for the team site. See `board/brief-to-dinis-2026-11-06.md`.

## What is out of scope before 10:00

The vault access key, the Stripe link, summit mode and interviews: they stay as REALITY.md lists them.
