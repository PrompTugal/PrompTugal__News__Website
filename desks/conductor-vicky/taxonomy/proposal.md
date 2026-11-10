---
title: "Proposal: one topic taxonomy for PrompTugal.news articles"
by: conductor.B@PrompTugal.vicky (audit of content/articles/*.md front matter, 57 files, 10 Nov 2026 about 23:10 UTC)
status: PROPOSAL, not applied; waits for Vicky's approval
---
# Proposal: one topic taxonomy

## What the audit found

- **113 distinct tags** across 56 articles (`tags:` in each article's front matter); the site's topic filter lists them all.
- **Duplicate spellings and case:** AI agents / ai agents / agents; AI / ai; Brazil / brazil; Europe / europe; Portugal / portugal; ApexBrasil / apexbrasil; Sebrae / sebrae; practical / practical guide / guides.
- **Company and organisation names as topics (20):** Discord, IBM, Glovo, GetVocal, WPP, Lovable, Replit, Mastra, MiniMax, ModelBest, Manus AI, You.com, Jira, WhatsApp, Intuitivo, Granter, Octo Health, 3xP Global, AgroGrINTech, Pep4Fish. Companies already have their own pages and graph; they are not topics.
- **Places as topics:** Lisbon, Porto, Braga, Aveiro, Maia, Azores, Madeira, Algarve, Rio de Janeiro, Italy, Pavilion 1.
- **Formats as topics:** practical guide, guides, survey, counts, newsletter, history, announcements, press conferences.
- **A bug:** tags written as a bracketed list (`[Portugal, ..., practical]`) show as "[Portugal" and "practical]" in the filter: the build splits on commas without removing the brackets (5 articles).
- **Beats** (the kicker above a headline, `beat:`) have 13 variants for about 7 desks (e.g. "AI and robotics (the team's own work)", "AI and robotics (a team topic)", "Connections: the summit"). Proposed separately below.

## The proposed topics (14)

| Topic | Definition | Articles after mapping |
|---|---|---|
| Web Summit | The summit itself: its programme, speakers, announcements, press conferences, delegations and past editions. | 32 |
| Attending: practical | What an attendee needs to get there and get around: registration, tickets, transport, maps, venue, planning, refunds. | 14 |
| Weather and disruption | Weather warnings and the disruption they cause: IPMA, civil protection, closures, Storm Charles. | 3 |
| AI agents | AI agents at work: how teams build, deploy, secure and use agents. | 15 |
| AI and robotics | AI and robotics beyond agents: models, research, robots. | 7 |
| Security | Cybersecurity and the security of AI systems. | 5 |
| Startups and funding | Startups and the money and programmes behind them: funding, investment, incubators, scale-up programmes. | 20 |
| Health | Health and healthtech. | 2 |
| Other industries | Other sectors: sport, education, ocean and circular economy, delivery and the rest. | 6 |
| Portugal | Portugal's ecosystem, institutions, universities and regions. | 15 |
| Brazil | Brazil at Web Summit and its links with Portugal. | 7 |
| Europe | The EU, European programmes and other European countries. | 5 |
| Connections | Who could meet or work with whom: people and companies worth knowing. | 6 |
| How this newsroom is made | How PrompTugal.news and its agents work: the team's own work, the newsletter, the tools. | 13 |

Rules: one to three topics per article, from this list only; places, companies and formats are not topics (companies link to their own pages; the format shows in the kicker). New topics only through the curator.

## Old tag to new topic (complete, 113 tags)

| Old tag | Articles | New topic(s) |
|---|---|---|
| the summit | 23 | Web Summit |
| how this newsroom is made | 13 | How this newsroom is made |
| Portugal | 13 | Portugal |
| startups | 13 | Startups and funding |
| agents | 9 | AI agents |
| Web Summit | 8 | Web Summit |
| Brazil | 6 | Brazil |
| connections | 6 | Connections |
| Lisbon | 6 | **needs judgment** |
| practical | 6 | Attending: practical |
| practical guide | 5 | Attending: practical |
| security | 5 | Security |
| AI | 4 | AI and robotics |
| Europe | 4 | Europe |
| funding | 4 | Startups and funding |
| agents at work | 3 | AI agents |
| ai agents | 3 | AI agents |
| AI agents | 3 | AI agents |
| announcements | 3 | Web Summit |
| Road 2 Web Summit | 3 | Startups and funding, Portugal |
| schedule | 3 | Web Summit |
| Startup Portugal | 3 | Startups and funding, Portugal |
| survey | 3 | **needs judgment** |
| ai | 2 | AI and robotics |
| delegations | 2 | Web Summit |
| healthtech | 2 | Health |
| press conferences | 2 | Web Summit |
| transport | 2 | Attending: practical |
| Unicorn Factory Lisboa | 2 | Startups and funding, Portugal |
| 3xP Global | 1 | (dropped: company or organisation) |
| agents in real work | 1 | AI agents |
| AgroGrINTech | 1 | (dropped: company or organisation) |
| ai and robotics | 1 | AI and robotics |
| AICEP | 1 | Portugal |
| Algarve | 1 | Portugal |
| apexbrasil | 1 | Brazil |
| ApexBrasil | 1 | Brazil |
| aquaculture | 1 | Other industries |
| Aveiro | 1 | Portugal |
| Azores | 1 | Portugal |
| Blue Bioeconomy Pact | 1 | Other industries |
| Braga | 1 | Portugal |
| brazil | 1 | Brazil |
| circular economy | 1 | Other industries |
| coding agents | 1 | AI agents |
| counts | 1 | **needs judgment** |
| delivery | 1 | Other industries |
| diagnostics | 1 | Health |
| Discord | 1 | (dropped: company or organisation) |
| economy | 1 | Other industries |
| edtech | 1 | Other industries |
| eu-funding | 1 | Europe |
| eurohpc | 1 | Europe |
| europe | 1 | Europe |
| European Commission | 1 | Europe |
| getting there | 1 | Attending: practical |
| getvocal | 1 | (dropped: company or organisation) |
| glovo | 1 | (dropped: company or organisation) |
| granter | 1 | (dropped: company or organisation) |
| guides | 1 | Attending: practical |
| hadea | 1 | Europe |
| health | 1 | Health |
| history | 1 | Web Summit |
| IBM | 1 | (dropped: company or organisation) |
| incubation | 1 | Startups and funding |
| intuitivo | 1 | (dropped: company or organisation) |
| investment | 1 | Startups and funding |
| IPMA | 1 | Weather and disruption |
| Italy | 1 | Europe |
| jira | 1 | (dropped: company or organisation) |
| lovable | 1 | (dropped: company or organisation) |
| Madeira | 1 | Portugal |
| Maia | 1 | Portugal |
| manus ai | 1 | (dropped: company or organisation) |
| maps | 1 | Attending: practical |
| mastra | 1 | (dropped: company or organisation) |
| minimax | 1 | (dropped: company or organisation) |
| modelbest | 1 | (dropped: company or organisation) |
| newsletter | 1 | How this newsroom is made |
| Octo Health | 1 | (dropped: company or organisation) |
| past events | 1 | Web Summit |
| Pavilion 1 | 1 | Attending: practical |
| Pep4Fish | 1 | (dropped: company or organisation) |
| PITCH | 1 | Web Summit |
| planning | 1 | Attending: practical |
| Porto | 1 | Portugal |
| portugal | 1 | Portugal |
| Portugal Stand | 1 | Portugal |
| refunds | 1 | Attending: practical |
| regions | 1 | Portugal |
| registration | 1 | Attending: practical |
| replit | 1 | (dropped: company or organisation) |
| Rio de Janeiro | 1 | Brazil |
| road closures | 1 | Weather and disruption |
| robotics | 1 | AI and robotics |
| scaling | 1 | Startups and funding |
| sebrae | 1 | Brazil |
| Sebrae | 1 | Brazil |
| software delivery | 1 | AI agents |
| speakers | 1 | Web Summit |
| sport | 1 | Other industries |
| sports tech | 1 | Other industries |
| Storm Charles | 1 | Weather and disruption |
| tecnico | 1 | Portugal |
| telemedicine | 1 | Health |
| tickets | 1 | Attending: practical |
| universities | 1 | Portugal |
| weather | 1 | Weather and disruption |
| web summit speakers | 1 | Web Summit |
| whatsapp | 1 | (dropped: company or organisation) |
| women in tech | 1 | Startups and funding |
| wpp | 1 | (dropped: company or organisation) |
| you.com | 1 | (dropped: company or organisation) |

## Needs editorial judgment (my recommendation in brackets)

1. **Lisbon** (6 articles: Brazil's doors into Europe, Brazil's startup house in Lisbon, Lisbon awards and the Algarve plan, Octo Health launches, the red wind warning, Rio's ten startups to Lisbon). [Drop it as a topic: the summit is in Lisbon, so it says nothing; each article keeps its other topics, and Portugal where the story is Portuguese.]
2. **survey** (Gender in tech report, Gravitee's agent security survey, Web Summit 2026 in numbers) and **counts** (Brazil last year, counts). [Drop: they are formats; the articles keep their subject topics.]
3. **Health** has only 2 articles. [Keep it: health is a standing Web Summit track and more is coming; otherwise fold into Other industries.]
4. **Refunds and Pavilion 1** under Attending: practical, **software delivery** under AI agents (the WPP story is about agents turning calls into Jira plans), **delegations** under Web Summit. [As mapped; say if you see it differently.]

## Beats (proposed, separate from topics)

The Summit · Portugal · Brazil · Europe · AI and robotics · Connections · How this newsroom is made. The 13 current variants map onto these; "the team's own work" and "a team topic" become How this newsroom is made.

## How it would be applied (after approval)

- **No article URL, body or signature changes.** Tested: changing an article's `tags` line leaves its signed twin unchanged and the gate passes.
- **Shared reference:** `desks/curator/topics.json` (the 14 topics, definitions, and the alias map above), owned by the curator (data/ is the ontologist's); the build's topic filter reads it, so every old tag shows under its new topic at once, on every article, whichever desk wrote it.
- **Front matter:** Vicky's desks' articles rewritten to the new topics by their reviewer; other desks' articles (journalist@PrompTugal.dinis, Angelo's writer and others) keep their tags, mapped by the alias file, unless their owners choose to rewrite.
- **The bracket bug** fixed in the build (dev@, with dev@PrompTugal.dinis as owner of the build).
- **From then on:** the curator assigns topics from the list; the reviewer checks them before publication; a new topic only through the curator.

## Checks (23:03 UTC, 10 Nov)

dev@PrompTugal.vicky checked this against the build at origin/dev (read-only, nothing changed):

- **Bracket bug confirmed**, and the same raw comma split is in three places: the articles page filter (`features/articles.mjs:43`), the lists page filter (`features/lists.mjs:47`) and the graph (`lib/graph.mjs:94`, already case-insensitive).
- **Signatures confirmed safe:** the signed twin holds title, summary, byline, date, licence and body; `tags` and `beat` are not in it. Changing title, summary, date, author or body would break a signature; tags will not.
- **Kickers:** the front pages show the raw tags string (or its first tag) as the kicker above a story, so rewriting an article's tags also changes its visible kicker (the S41 lead's kicker is its full tags string). The alias map does not touch kickers; front matter rewrites do.
- **Plan:** one helper `newsroom/build/lib/topics.mjs` (`topicsOf(article)`: strip brackets and quotes, split, trim, look up case-insensitively in `desks/curator/topics.json`; if that file is missing it behaves as today). The three filters call it; kickers stay on raw tags for now. A gate WARN (not FAIL) for a tag with no topic, so the curator sees drift. About 30 lines. Build files are dev@PrompTugal.dinis's: dev@PrompTugal.vicky writes it only at Vicky's word, committed For: dev@PrompTugal.dinis.

Curator's check: awaited.
