---
title: "journalist-ai@PrompTugal.vicky: standing rules kept in the desk"
by: journalist-ai@PrompTugal.vicky
---
# Standing rules (journalist-ai), kept in this repository

Rules relayed while Vicky's own account covers the newsroom, saved here so a new session finds them. The full standing rules stay on the team site (people/vicky/decisions.md and this agent's prompts file); this file only adds what came after.

## Main categories for articles (Vicky approved, 10 November 2026, about 23:55 UTC; relayed by conductor.B@PrompTugal.vicky)

- Articles have eight main categories, the only ones in the articles dropdown: Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate. Definitions: `desks/conductor-vicky/taxonomy/categories.md`. The source the site reads: `desks/curator/categories.json` (the curator's).
- The curator assigns each article one or more main categories when commissioning it, by subject and angle. Corporate covers established-company news and enterprise adoption; Startups & Scaleups covers companies building or growing their own business. Never by size, valuation, funding round or headcount. The reviewer checks them before publication.
- Writers do not put categories in an article's front matter and do not invent new ones. Tags stay secondary tags (subjects, companies, places, formats). If a category seems to fit, suggest it to the curator in the draft's notes.
- A new main category only with Vicky's approval, through the curator.

## TEMPORARY: discovery while Vicky's researcher is away (Vicky approved, 11 November 2026, about 00:30 UTC; relayed by conductor.B@PrompTugal.vicky)

Full workflow: `desks/conductor-vicky/discovery/WORKFLOW.md`. It stops when conductor.B@ (or Vicky's conductor) says the researcher has returned; after that, stop scanning after the next run.

- Only when there is no pending assignment and no open fix or correction (those always come first).
- Scan this beat's public sources for at most about 10 minutes and 5 leads a run: documented examples of teams using AI agents in real work (primary sources first), enterprise adoption, established-company AI news. Feeds the main categories AI and Corporate.
- Log each lead in `desks/journalist-vicky/leads/<YYYY-MM-DD>-ai.md` in the WORKFLOW's block format: source (public URL), published, checked (UTC), new, establishes (no more than the source does), categories (of the 8), web_summit_confirmation (n/a unless a Connections lead), desk.
- Also pick up any line for this desk in `desks/journalist-vicky/leads/requests.md` (the curator's research requests).
- A lead is not an assignment: write only what the curator commissions.
- Public pages without a login only; nothing private, no contact details; our own team's agents and behaviour policies stay out of scope.

## Pointer sources, and no machine reads of websummit.com (Vicky's word, 11 November 2026, 13:20 UTC, at Dinis's suggestion; relayed by conductor.B@PrompTugal.vicky)

- Two pointer sources for drafts and discovery scans: https://lisbontechfringe.com (the Lisbon Fringe site: side events, including AI meetups and agent talks; `/api/v1/events.json`) and https://storm-charles.promptugal.news (the storm).
- A pointer, never the citation: every fact is read and cited at its own source (for an event, the organiser's own page), with the read time, before anything is published.
- Their "unknown" or hypothesis rows are never stated as fact.
- Both are built by our own wider team, so they are not independent confirmation.
- From 11 November 2026, 12:45 UTC: no machine reads of websummit.com (its terms forbid them). Web Summit's word comes from a person's browser read or the press. (S42 cited a websummit.com session page read by this desk on 10 November, before this rule.)

## Web Summit's site and data: not to be used (Vicky's word, 11 November 2026, about 14:30 UTC, after Dinis's "yes, dont use them"; relayed by conductor.B@PrompTugal.vicky). Replaces the websummit.com line above.

1. No machine reads of websummit.com, any of its subdomains, or the Web Summit app: no curl, fetch, script, sub-agent, headless or automated browser, API or AI-agent access. Web Summit's word comes only from a person's own browser read, the organisers' own public posts, or the press.
2. This desk's tools, scripts, notes and scheduled wake prompt were checked on 11 November at about 14:30 UTC: none reads websummit.com, its subdomains or the app by machine. A scratchpad copy of one websummit.com session page (read on 10 November for S42, before the rule) was deleted; S42, already published, is left as it is (rule 3).
3. No data copied from Web Summit's site in any new work: the programme agenda's sessions (`desks/programme/agenda.json`), the Web Summit-derived parts of `data/events`, `data/people`, `data/organisations`, `data/places`, the Web Summit links in `data/companies`, and the researcher's startup capture in the vault. Do not delete or change any of it until Dinis says what to do with it.

## Luma, Meetup and Eventbrite: no machine reads (Vicky's word, 11 November 2026, about 14:40 UTC; relayed by conductor.B@PrompTugal.vicky)

- Until Dinis decides on Luma: no machine reads of luma.com, lu.ma or Luma's API.
- Until their terms are checked: no machine reads of meetup.com or eventbrite.com.
- Checked on 11 November at about 14:40 UTC: no tool, note or wake-prompt step of this desk reads them. Before the rule, at 13:45 UTC, this desk read three luma.com event pages by script for the side-event leads in `desks/journalist-vicky/leads/2026-11-11-ai.md`; the scratchpad copies were deleted, and the leads are left as they are for the curator to weigh (they cite those pages).

## Sources for anything about Web Summit (Vicky's word, 11 November 2026, about 15:45 UTC; relayed by conductor.B@PrompTugal.vicky)

- Vicky: "Until Dinis decides, for anything about Web Summit: use press reports, the companies', speakers' and organisers' own posts and releases, official public bodies, and a person's browser check for single facts. Link to Web Summit's pages instead of copying or summarising them."
- Applies to new drafts, updates and leads from now; existing published text stays until Dinis decides.
