---
title: "journalist-europe@PrompTugal.vicky: standing rules kept in this desk"
by: journalist-europe@PrompTugal.vicky
---
# Standing rules (persistent notes for this role)

## Article categories (Vicky's approval relayed by conductor.B@PrompTugal.vicky, 10 November 2026, about 23:55 UTC)
- Articles have 8 main categories, the only ones in the articles dropdown: Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate. Definitions: `desks/conductor-vicky/taxonomy/categories.md`. The site reads `desks/curator/categories.json` (the curator's; not yet in dev at 23:35 UTC).
- The curator assigns each article one or more main categories when commissioning it, by subject and angle (Corporate: established-company news and enterprise adoption; Startups & Scaleups: companies building or growing their own business; never by size, valuation, funding round or headcount). The reviewer checks them before publication.
- I do not put categories in an article's front matter and never invent new ones. My tags stay secondary tags (subjects, companies, places, formats). If I think a category fits, I suggest it to the curator in my draft notes.
- A new main category only with Vicky's approval, through the curator.

## Routing while Vicky's account covers (10 November 2026)
- Anything for Vicky (asks, blockers, decisions, questions) goes to conductor.B@PrompTugal.vicky, or in my desk note if it can wait for its :48 wake. Publication approvals go through reviewer@PrompTugal.vicky.
- Run summaries stay in this desk (brief, public-safe), not on the team site, until Vicky switches back.
- I write only storylines the curator has assigned me (Vicky's standing answers 19, 20 and 28).

## TEMPORARY: discovery while Vicky's researcher is paused (Vicky's approval relayed by conductor.B@PrompTugal.vicky, 11 November 2026, about 00:30 UTC)
Full workflow: `desks/conductor-vicky/discovery/WORKFLOW.md`. It ends when conductor.B@ (or Vicky's conductor) says the researcher is back; I stop scanning after my next run.
- Only when I have no pending assignment and no open fixes or corrections (those always come first).
- At most about 10 minutes and 5 leads a run, on my beat: EU tech policy, funding and programmes; European companies at the summit (feeds the Europe category).
- Each lead logged in `desks/journalist-vicky/leads/<YYYY-MM-DD>-europe.md` in the WORKFLOW's block format: source (public URL), published, checked (UTC), new, establishes (no more than the source says), categories (of the 8), web_summit_confirmation, desk.
- Also pick up any line for the Europe desk in `desks/journalist-vicky/leads/requests.md`.
- A lead is not an assignment: I still write only what the curator commissions. Public pages without a login only; nothing private, no contact details; our own team's agents and behaviour policies stay out of scope.

## No machine reads of websummit.com (Vicky, relayed by conductor.B@PrompTugal.vicky, 11 November 2026, 12:45 UTC; read in `desks/reviewer-vicky/README.md`)
- Web Summit's terms (48.2 and 52.1) forbid automated reading. No curl, fetch or headless browser on websummit.com, for anything. Web Summit's word comes from a person's read or the press. Existing citations stay.
- Before the rule, this desk made one machine read of websummit.com: Web Summit's "Important event update" page, by curl, on 11 November at about 02:22 UTC, for S49 (S50 cites the same read). Reported to conductor.B@ for Vicky on 11 November, 13:30 UTC. (A request to websummit.com on 10 November at about 11:56 UTC was refused by the proxy and returned nothing.)

## Two pointer sources (Vicky, at Dinis's suggestion, relayed by conductor.B@PrompTugal.vicky, 11 November 2026, 13:20 UTC)
- https://lisbontechfringe.com (the Lisbon Fringe site: side events, including European delegations' meetups; `/api/v1/events.json`) and https://storm-charles.promptugal.news (the storm).
- A pointer, never the citation: every fact is read and cited at its own source (for an event, the organiser's own page), with the read time, before anything is published.
- Their "unknown" or hypothesis rows are never stated as fact.
- Both are built by our own wider team, so they are not independent confirmation.
- The websummit.com rule above applies alongside: Web Summit's word comes from a person's browser read or the press.

## Web Summit's site and data: not to be used (Vicky's word, 11 November 2026, about 14:30 UTC, after Dinis's "yes, dont use them"; relayed by conductor.B@PrompTugal.vicky)
1. No machine reads of websummit.com, any of its subdomains, or the Web Summit app: no curl, fetch, script, sub-agent, headless or automated browser, API, or AI-agent access. Web Summit's word comes only from a person's own browser read, the organisers' own public posts, or the press.
2. Checked on 11 November at about 14:35 UTC: this desk's scripts (a page-to-text helper and a screenshot helper for cover cards, both in the session's scratchpad), its notes, hand-overs and leads, and its scheduled wake prompt carry no step that reads websummit.com, its subdomains or the app. Nothing removed. (The one earlier read, at 02:22 UTC, is recorded above.)
3. No data copied from Web Summit's site in any new work: the programme agenda's sessions (`desks/programme/agenda.json`), the Web Summit-derived parts of `data/events`, `data/people`, `data/organisations`, `data/places`, the Web Summit links in `data/companies`, and the researcher's startup capture in the vault. None of it is deleted or changed until Dinis says what to do with it.
