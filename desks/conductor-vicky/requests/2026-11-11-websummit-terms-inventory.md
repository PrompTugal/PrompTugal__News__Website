# For Dinis: what Web Summit's terms (sections 47 to 52) touch in PrompTugal.news

Prepared by conductor.B@PrompTugal.vicky at Vicky's request, 11 November 2026, about 14:05 UTC, from Vicky's own reading of the terms in her browser. Read-only inventory: **nothing has been changed, deleted or paused because of it; Dinis decides.** The terms are referred to by clause number only (their text is not copied here).

## The clauses, in short

- **47:** "Digital Platforms" means the conference websites and their subdomains, the conference apps and related online surveys; it applies to their visitors and users, including organisations such as startups, partners and investors.
- **48.1:** no manual or automated means to access, scrape or crawl them or their content; no copying or storing of any significant portion, unless the law allows or Web Summit authorises; no copying or distributing any part in any medium without prior written consent.
- **48.2 / 48.2.1:** no bots, scripts, scrapers or AI agents to access or act on them, or to extract or harvest data about other users.
- **48.2.2:** remedies include suspending access and **cancelling the user's conference ticket without refund**.
- **52.1:** no copying, republishing, storing, summarising, harvesting or making available of their content, except as expressly authorised.
- **52.2:** "Web Summit", "The Summit", "Lisbon Web Summit", "Night Summit" and others are trademarks; no licence to use them.

## What it touches (counts from `git grep websummit.com` on dev, 14:00 UTC)

| Where | What is there | Owner | Clauses |
|---|---|---|---|
| Machine reads by agents | Vicky's desks (dev@, weather@, reviewer@, programme@, journalist@, journalist-connections@, journalist-europe@, curator@) and Dinis's social.watch@ read websummit.com by script until about 13:50 UTC on 11 Nov; the incident team stopped at 05:27. All stopped. | both | 48.1, 48.2, 48.2.2 |
| `desks/programme/agenda.json` | about 225 programme items (sessions, times, stages, speakers) copied from Web Summit's schedule pages, published on the site | Vicky (programme@) | 48.1 (significant portion), 52.1 |
| `data/events`, `data/people`, `data/organisations`, `data/places` (about 740 files) | sessions, speakers' names and roles, organisations and places derived from the schedule and speaker pages (partly via the agenda), each with a websummit.com source link | Dinis (ontologist@, derive) and Vicky's agenda | 48.1, 48.2.1 (data about other users), 52.1 |
| `data/companies` (120 companies, about 290 files) | each company's Web Summit appearance page as a source and recheck link | Dinis (ontologist@, newsroom-dev@) | 48.1, 52.1 (links are lower risk than copied content) |
| Research vault 41j3e9s9 | the researcher's capture of the first page of Web Summit's featured-startups list (about 100 companies: name, country, stage, industry, pitch), and an earlier stopped attempt at the list's search API | Vicky (researcher@, paused) | 48.1 (storing a significant portion), 48.2, 52.1 |
| Articles from that list | S29/S30-type pieces grouping featured startups by their pitches (health startups by problem; who builds an AI agent's parts), S54 (Breakout startups), S48 and the speakers pieces | Vicky's desks | 52.1 (summarise) |
| Articles quoting Web Summit (34 content files) | statements (Day 2, Thursday), figures, speakers, session pages, quoted with links | both | 52.1 (news quotation; a legal question) |
| `desks/correspondent` (front page, about 680 references) | the front page's summit items and links | Dinis (correspondent@) | 52.1 |
| Names | the category "Web Summit 2026", the tag "the summit", "Web Summit" in headlines | both | 52.2 (naming an event in reporting is usually treated differently from using it as a brand) |
| Lisbon Fringe and the storm site | their briefs already forbid scraping websummit.com; Fringe avoids the name as its brand | Dinis | 48, 52.2 (already applied) |

## Questions for Dinis

1. Do the machine reads put anyone's **ticket** at risk (48.2.2(c)), and should we tell Web Summit, or ask its permission for the reads we need?
2. **Copied data:** keep, reduce to links, or remove: the agenda, the derived events/people/organisations, the company appearance links, the vault's startup capture?
3. **Quoting and summarising** Web Summit's statements and pages in our articles: carry on as news reporting, or get legal advice first?
4. **Trademarks:** keep "Web Summit 2026" as a category name and "the summit" as a tag, or rename?
5. Should we ask Web Summit for written permission (48.1 and 52.1 allow "expressly authorised" use), for example through the press office?
