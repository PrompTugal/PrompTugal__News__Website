---
title: "journalist@PrompTugal.vicky (summit desk): standing rules kept between sessions"
by: journalist@PrompTugal.vicky
---
# Standing rules for the summit journalist

Rules this desk keeps across sessions, each with where it came from. STYLE.md (Vicky's) comes first; these add to it.

## Article categories (from 10 November 2026)

Relayed by conductor.B@PrompTugal.vicky as Vicky's approval (about 23:55 UTC on 10 November 2026); to be confirmed with Vicky in person when she next speaks to this session.

- Articles have 8 main categories, the only ones in the articles dropdown: Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate. Definitions: `desks/conductor-vicky/taxonomy/categories.md`. The source the site reads: `desks/curator/categories.json` (the curator's).
- The curator assigns each article one or more main categories when commissioning it, by subject and angle (Corporate = established-company news and enterprise adoption; Startups & Scaleups = companies building or growing their own business; never by size, valuation, funding round or headcount). The reviewer checks them before publication.
- Writers do not put categories in an article's front matter and do not invent new ones. `tags:` stay secondary tags (subjects, companies, places, formats).
- A writer may suggest a category to the curator in the draft's notes.
- A new main category only with Vicky's approval, through the curator.

## Discovery while the researcher is away (TEMPORARY, from 11 November 2026)

Relayed by conductor.B@PrompTugal.vicky as Vicky's approval (about 00:30 UTC on 11 November 2026); to be confirmed with Vicky in person. Full workflow: `desks/conductor-vicky/discovery/WORKFLOW.md`. Stops when the conductor says Vicky's researcher has returned.

- Only when there is no pending assignment and no open fix or correction (those come first), and after the S41 watch while it runs.
- At most about 10 minutes and 5 leads a run, on this desk's beat: practical news for attendees and Web Summit news as reported by the press or a person's browser read (never a machine read of websummit.com, its subdomains or the app; see below). Feeds the category Web Summit 2026.
- Log each lead in `desks/journalist-vicky/leads/<YYYY-MM-DD>-summit.md`, one block per lead in the WORKFLOW's format (source, published, checked UTC, new, establishes, categories, web_summit_confirmation, desk).
- Also pick up any line for the summit desk in `desks/journalist-vicky/leads/requests.md` (the curator's research requests).
- A lead is not an assignment: write only what the curator commissions.
- Public pages without a login only; nothing private; no contact details; our own team's agents and behaviour policies stay out of scope.

## No automated reading of websummit.com (from 11 November 2026, about 12:47 UTC)

From `desks/conductor-vicky/sources/storm-charles.md` (conductor.B@PrompTugal.vicky, recording the finding of Dinis's incident team): websummit.com's terms forbid automated reading (its Terms 48.2 and 52.1). This desk does not fetch any websummit.com page by script, curl or headless browser, for the S41 watch, discovery or any draft.

- Web Summit's word comes from a person's browser read (Vicky, or another person), the press quoting Web Summit's public posts, or storm-charles.promptugal.news as a pointer. Existing citations of Web Summit's pages stay.
- Before reading any other site by machine, check its terms first (the conductor's lesson of 11 November).
- The S41 watch continues on IPMA's open data (api.ipma.pt) only; the Web Summit half of the watch is done by a person.

## Pointer sources: Lisbon Fringe and storm-charles (from 11 November 2026, about 13:20 UTC)

Relayed by conductor.B@PrompTugal.vicky as Vicky's word, at Dinis's suggestion; to be confirmed with Vicky in person.

- https://lisbontechfringe.com (side events and communities; its `/api/v1/events.json`) and https://storm-charles.promptugal.news (the storm) may be used as pointers in drafts and discovery scans.
- A pointer, never the citation: every fact is read and cited at its own source (for an event, the organiser's own page), with the read time, before anything is published.
- Their "unknown" or hypothesis rows are never stated as fact.
- They are built by our own wider team, so they are not independent confirmation of anything.
- The websummit.com rule above still holds: Web Summit's word comes from a person's browser read or the press.

## Sources whose terms were checked (11 November 2026)
- api.ipma.pt: automated use allowed (an API for applications); IPMA asks users to read its conditions and email it about their use (not done; a person's send).
- elevon.io: robots.txt allows automated readers.
- luma.com: terms ambiguous for scripted reading; held for Vicky's decision (14:10 UTC).
- websummit.com: no automated reading (see above).

## Web Summit: the full rule (11 November 2026, about 14:30 UTC)

Relayed by conductor.B@PrompTugal.vicky as Vicky's word, after Dinis's answer ("yes, dont use them"); to be confirmed with Vicky in person. It replaces the shorter websummit.com rule above where they differ.

1. No machine reads of websummit.com, any of its subdomains, or the Web Summit app: no curl, fetch, script, sub-agent, headless or automated browser, API or AI-agent access. Web Summit's word comes only from a person's own browser read, the organisers' own public posts, or the press.
2. This desk checked its tools, scripts, notes and wake prompt (11 Nov, 14:27 UTC): no script of its own reads websummit.com; the wake prompt has no such step; two note lines that described machine reads of Web Summit's channels were rewritten.
3. Do not use data copied from Web Summit's site for any new work: the programme agenda's sessions (`desks/programme/agenda.json`), the Web Summit-derived parts of `data/events`, `data/people`, `data/organisations`, `data/places`, the Web Summit links in `data/companies`, and the researcher's startup capture in the vault. Do not delete or change any of it until Dinis says what to do with it.

## Luma, Meetup and Eventbrite (from 11 November 2026, about 14:40 UTC)

Relayed by conductor.B@PrompTugal.vicky as Vicky's word; to be confirmed with Vicky in person.

- Until Dinis decides on Luma: no machine reads of luma.com, lu.ma or Luma's API.
- Until their terms are checked: no machine reads of meetup.com or eventbrite.com.
- For S57 this means option (b): Vicky reads the three Luma pages in her browser and gives this desk the wording and the time.
- This desk read luma.com/terms, lu.ma/terms and luma.com/robots.txt by machine once, at about 14:09 UTC, to check its terms before the rule; no event page was read; the copies are deleted. Checked 14:38 UTC: no script, note step or wake prompt step of this desk reads Luma, Meetup or Eventbrite.
