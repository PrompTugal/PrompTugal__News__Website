---
title: "journalist-portugal@PrompTugal.vicky: standing notes"
by: journalist-portugal@PrompTugal.vicky
updated: 2026-11-11T15:50Z
---
# Standing notes for the Portugal desk

Rules this desk carries from run to run. Public: nothing private here.

## Main categories (Vicky approved, 10 November 2026, about 23:55 UTC)

Relayed by conductor.B@PrompTugal.vicky; the approval is recorded in `desks/conductor-vicky/taxonomy/categories.md`.

- Articles have 8 main categories, the only ones in the articles dropdown: Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate. Definitions: `desks/conductor-vicky/taxonomy/categories.md`. The source the site reads: `desks/curator/categories.json` (the curator's).
- The curator assigns each article one or more main categories when commissioning it, by subject and angle. Corporate is established-company news and enterprise adoption. Startups & Scaleups is companies building or growing their own business. Never by size, valuation, funding round or headcount. The reviewer checks them before publication.
- Writers (this desk) put no categories in article front matter and invent none. `tags:` stay secondary tags: subjects, companies, places, formats. Where a category seems to fit, suggest it to the curator in the draft's notes.
- A new main category only with Vicky's approval, through the curator.

## Sources for anything about Web Summit (Vicky, 11 November 2026, about 15:45 UTC; relayed by conductor.B@PrompTugal.vicky)

> "Until Dinis decides, for anything about Web Summit: use press reports, the companies', speakers' and organisers' own posts and releases, official public bodies, and a person's browser check for single facts. Link to Web Summit's pages instead of copying or summarising them."

Applies to new drafts, updates and leads from now; existing published text stays until Dinis decides.

## Web Summit: no machine reads, no copied data (Vicky, 11 November 2026, about 14:30 UTC, after Dinis's "yes, dont use them"; relayed by conductor.B@PrompTugal.vicky)

1. No machine reads of websummit.com, any of its subdomains, or the Web Summit app: no curl, fetch, script, sub-agent, headless or automated browser, API, or AI-agent access. Web Summit's word comes only from a person's own browser read, the organisers' own public posts, or the press.
2. Checked at 14:30 UTC: this desk's tools and scripts (scratchpad), notes, hand-overs, leads and the scheduled wake prompt carry no step that reads websummit.com, its subdomains or the app. Nothing to remove.
3. No data copied from Web Summit's site in new work: the programme agenda's sessions (`desks/programme/agenda.json`), the Web Summit-derived parts of `data/events`, `data/people`, `data/organisations`, `data/places`, the Web Summit links in `data/companies`, and the researcher's startup capture in the vault. Do not delete or change any of it until Dinis says what to do with it.
   - Note: S52 (published) links the site's page `../organisations/konecta/`; whether that page is Web Summit-derived is not checked here. New drafts link no organisation, company, event or place page until this desk has checked where the page's data comes from.

## Luma, Meetup and Eventbrite: no machine reads (Vicky, 11 November 2026, about 14:40 UTC; relayed by conductor.B@PrompTugal.vicky)

- Until Dinis decides on Luma: no machine reads of luma.com, lu.ma or Luma's API.
- Until their terms are checked: no machine reads of meetup.com or eventbrite.com.
- Checked at 14:40 UTC: this desk's tools, scripts, notes, leads and wake prompt carry no such step. Nothing to remove. (A downloaded Unicorn Factory Lisboa page in the scratchpad contains a link to one of them; it was never followed.)

## No automated reading of websummit.com (from 11 November 2026, about 12:47 UTC)

From `desks/conductor-vicky/sources/storm-charles.md`: websummit.com's terms forbid automated reading (its Terms 48.2 and 52.1). This desk does not fetch any websummit.com page by script, curl or headless browser, for discovery, a lead or a draft. Web Summit's word comes from a person's browser read, the press quoting Web Summit's public posts, or storm-charles.promptugal.news as a pointer. Existing citations stay.

- This session (from 10 November, 12:00 UTC) made no reads of websummit.com: its scans read ECO, Observador, AICEP, Startup Portugal, Unicorn Factory Lisboa, Konecta, Invelon and byAR only.
- For the record: the earlier session of this role read Web Summit session pages by machine on 9 November for S36 (its sources list them, read 9 November). That was before the rule; the published citations stay.

## Pointer sources: the Lisbon Fringe site and the storm site (Vicky, 11 November 2026, 13:20 UTC, at Dinis's suggestion)

Relayed by conductor.B@PrompTugal.vicky.

- https://lisbontechfringe.com (side events and communities in Lisbon; `/api/v1/events.json`) and https://storm-charles.promptugal.news (the storm) may be used for work and discovery scans, **as pointers only, never as the citation**.
- Every fact is read and cited at its own source (for an event, the organiser's own page), with the read time, before anything is published.
- Their "unknown" or hypothesis rows are never stated as fact.
- Both are built by our own wider team, so they are not independent confirmation.

## TEMPORARY: discovery while Vicky's researcher is away (Vicky approved, 11 November 2026, about 00:30 UTC)

Relayed by conductor.B@PrompTugal.vicky; the workflow is `desks/conductor-vicky/discovery/WORKFLOW.md`. It stops when Vicky's researcher returns (conductor.B says when; stop scanning after the next run).

- Only when there is no pending assignment and no open fix or correction: those always come first.
- Scan this desk's beat: Portugal's startups, ecosystem, programmes, government support, and Portugal-Brazil links (feeds Portugal, Brazil, Startups & Scaleups). At most about 10 minutes and 5 leads a run.
- Log each lead in `desks/journalist-vicky/leads/<YYYY-MM-DD>-portugal.md` in the WORKFLOW's block format: source (public URL), published, checked (UTC), new, establishes (no more than the source says), categories (of the 8), web_summit_confirmation, desk.
- Also pick up any line for this desk in `desks/journalist-vicky/leads/requests.md` (the curator's research requests).
- A lead is not an assignment: write only what the curator assigns. Public pages without a login only; nothing private, no contact details; our own team's agents and behaviour policies stay out of scope.

## Where things go while Vicky's account covers (10 November 2026)

- Run summaries: in this desk, not on the team site (Vicky's exception, relayed by conductor.B@PrompTugal.vicky).
- Asks, blockers and questions for Vicky: to conductor.B@PrompTugal.vicky. Publication approvals: through reviewer@PrompTugal.vicky.

## Open for the hand-over

- SA26 (Wikipedia as support only for company About sections): read and followed. The confirmation in the prompts file on the team site waits, because this desk does not write to the team site.
