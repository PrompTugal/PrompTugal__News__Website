---
title: "journalist-connections@PrompTugal.vicky: standing rules kept in this desk"
by: journalist-connections@PrompTugal.vicky
---
# Standing rules (persistent notes)

## Article categories (Vicky's approval, about 23:55 UTC, 10 November 2026, relayed by conductor.B@PrompTugal.vicky)
- Articles have eight main categories, the only ones in the articles dropdown: Web Summit 2026, Startups & Scaleups, AI, Portugal, The newsroom, Brazil, Europe, Corporate. Definitions: `desks/conductor-vicky/taxonomy/categories.md`. The file the site reads: `desks/curator/categories.json` (the curator's).
- The curator assigns each article one or more main categories when commissioning it; the reviewer checks them before publication.
- This desk never puts categories in a draft's front matter and never invents one. Tags stay secondary (subjects, companies, places, formats).
- If a category seems to fit, suggest it to the curator in the draft's notes.
- A new main category only with Vicky's approval, through the curator.

## TEMPORARY: discovery while Vicky's researcher is away (Vicky's approval, about 00:30 UTC, 11 November 2026, relayed by conductor.B@PrompTugal.vicky)
Ends when conductor.B (or Vicky's conductor) says the researcher is back; stop scanning after the next run then. The workflow in full: `desks/conductor-vicky/discovery/WORKFLOW.md`.
- Only when there is no pending assignment and no open fix or correction (those always come first).
- Scan this beat's public sources: companies and people a public Web Summit source confirms as attending, speaking, exhibiting or otherwise taking part; startups and scaleups worth knowing. Feeds Startups & Scaleups and Web Summit 2026.
- At most about 10 minutes and 5 leads a run; public pages without a login only; nothing private, no contact details; our own team's agents and behaviour policies out of scope.
- Log each lead in `desks/journalist-vicky/leads/<YYYY-MM-DD>-connections.md` in the WORKFLOW's block format (source, published, checked UTC, new, establishes, categories, web_summit_confirmation, desk). Every Connections lead needs a public Web Summit URL confirming participation.
- Also pick up any line for this desk in `desks/journalist-vicky/leads/requests.md` (the curator's research requests).
- A lead is not an assignment: write only what the curator commissions.

## websummit.com: no automated reading (rule from 11 November 2026, about 12:47 UTC; reached this desk at 13:16 UTC)
- websummit.com's terms forbid automated reading (`desks/conductor-vicky/sources/storm-charles.md`). This desk makes no machine read of websummit.com at all: no curl, no fetch tool, no headless browser.
- Web Summit's word comes only from a person's browser read, the press quoting the organisers' public posts, or what is already cited.
- Superseded at 13:45 UTC by the participation rule below.

## Pointer sources: Lisbon Fringe and the storm site (Vicky's word, about 13:20 UTC, 11 November 2026, at Dinis's suggestion; relayed by conductor.B@PrompTugal.vicky)
- https://lisbontechfringe.com (side events, communities, who meets where; `/api/v1/events.json`, `/api/v1/graph.json`) and https://storm-charles.promptugal.news (the storm), for this desk's work and discovery scans.
- A pointer, never the citation: every fact is read and cited at its own source (for an event, the organiser's own page), with the time read, before anything is published.
- Their "unknown" or hypothesis rows are never stated as fact. Both are built by our own wider team, so they are not independent confirmation.
- Connections leads still need public confirmation of participation, and websummit.com is never read by machine (above).

## Participation rule for Connections (Vicky, about 13:45 UTC, 11 November 2026, relayed by conductor.B@PrompTugal.vicky; updates standing answer 19's "a public Web Summit source confirms participation")
- Participation at Web Summit may be confirmed by: the person's or company's own public page or post; a press report; or Vicky's own browser read of their Web Summit page.
- Never a machine read of websummit.com.
- A lead that needs Vicky's browser read is listed for conductor.B@PrompTugal.vicky, with the Web Summit page URL, so it can ask her.
- S48 and S54 stay as published (Vicky's word).
- In each lead, `web_summit_confirmation` names which of the three confirms it, with its link and read time.

## Web Summit: no machine access at all, and no Web Summit-derived data for new work (Vicky's word, about 14:30 UTC, 11 November 2026, after Dinis's "yes, dont use them"; relayed by conductor.B@PrompTugal.vicky)
1. No machine reads of websummit.com, any of its subdomains, or the Web Summit app: no curl, fetch, script, sub-agent, headless or automated browser, API, or AI-agent access. Web Summit's word comes only from a person's own browser read, the organisers' own public posts, or the press.
2. This desk keeps no tool, script, note or wake step that reads them by machine (checked 14:35 UTC: the wake prompt has none; a how-to line in the 11 November hand-over was withdrawn; this session's scratchpad copies of Web Summit pages deleted).
3. No data copied from Web Summit's site is used for new work: the programme agenda's sessions (`desks/programme/agenda.json`), the Web Summit-derived parts of `data/events`, `data/people`, `data/organisations`, `data/places`, the Web Summit links in `data/companies`, and the researcher's startup capture in the vault. None of it is deleted or changed until Dinis says what to do with it.

## Luma, Meetup and Eventbrite: no machine reads (Vicky's word, about 14:40 UTC, 11 November 2026; relayed by conductor.B@PrompTugal.vicky)
- Until Dinis decides on Luma: no machine reads of luma.com, lu.ma or Luma's API.
- Until their terms are checked: no machine reads of meetup.com or eventbrite.com.
- Most of Lisbon Fringe's event links point to Luma: the Fringe stays a pointer only, and an event on these platforms is confirmed only by a person's browser read, the organiser's own site, or the press.
- Checked 14:40 UTC: this desk has never read them by machine; no tool, note or wake step of its own does.
- Lesson (11 November): check a source's terms before any machine read.

## Sources for anything about Web Summit (Vicky, about 15:45 UTC, 11 November 2026; relayed by conductor.B@PrompTugal.vicky; until Dinis decides)
- Use press reports; the companies', speakers' and organisers' own posts and releases; official public bodies; and a person's browser check for single facts.
- Link to Web Summit's pages instead of copying or summarising them.
- Applies to new drafts, updates and leads from now on; existing published text stays until Dinis decides.
