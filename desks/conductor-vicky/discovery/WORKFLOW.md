# Temporary discovery workflow (until Vicky's researcher returns)

Approved by Vicky, 11 November 2026, about 00:30 UTC (conductor window). Coordinated by conductor.B@PrompTugal.vicky. Schedules unchanged. Tracker: `tracker.json` in this folder.

## Why

Vicky's researcher (proactive discovery: new companies, announcements, Portugal and Europe news, agent use cases, Web Summit participants for Connections, the curator's research gaps) is not running while its account is paused. Until it returns, the journalists' spare runs and social.watch's public findings cover discovery.

## Journalists (journalist, journalist-portugal, journalist-europe, journalist-ai, journalist-connections)

- **Only when you have no pending assignment and no open fixes** (reviews marked Fix first, corrections). Assigned articles and corrections always come first.
- **Bounded:** at most about 10 minutes and 5 leads a run; public pages that open without a login; no private material, no contact details.
- **Your beat** (so every main category has an owner):

| Journalist | Scan for | Main categories it feeds |
|---|---|---|
| journalist (summit desk) | Web Summit's own blog, newsroom, programme and announcements; practical news for attendees | Web Summit 2026 |
| journalist-portugal | Portugal's startups, ecosystem, programmes, government support; Portugal-Brazil links | Portugal, Brazil, Startups & Scaleups |
| journalist-europe | EU tech policy, funding and programmes; European companies at the summit | Europe |
| journalist-ai | documented examples of teams using AI agents in real work (primary sources first); enterprise adoption; established-company AI news | AI, Corporate |
| journalist-connections | companies and people a public Web Summit source confirms as taking part; startups and scaleups worth knowing | Startups & Scaleups, Web Summit 2026 |

- **Log each lead** in `desks/journalist-vicky/leads/<YYYY-MM-DD>-<desk>.md`, one block per lead:

```
## <short title>
- source: <public URL>
- published: <date on the page, or "not shown">
- checked: <YYYY-MM-DD HH:MM UTC>
- new: <what is new, one line>
- establishes: <what the source itself establishes, no more>
- categories: <one or more of the 8 main categories>
- web_summit_confirmation: <public Web Summit URL, for Connections leads; else "n/a">
- desk: <your desk>
```

- **Never write an unassigned story.** A lead is not an assignment; the curator commissions.
- Our own team's agents and behaviour policies stay out of scope (as before).

## Curator

- **At each wake:** read new leads in `desks/journalist-vicky/leads/` and social.watch's public findings (`board/team/social.watch/hourly/` newest file, `coverage.json`, `signals/`; social.watch@PrompTugal.dinis's desk, read-only material).
- Run the usual duplicate check (standing answer 20) and source checks; re-read the source before commissioning; commission as usual with categories in `desks/curator/categories.json`.
- **Connections** still needs a public Web Summit source confirming participation (standing answer 19).
- In each map, a `leads_reviewed` list: each lead's file, and commissioned (story id), held (why), or dropped (why). This is how usefulness is tracked.
- Research gaps you would have sent the researcher go to the beat journalist's leads request instead: add a line to `desks/journalist-vicky/leads/requests.md` (desk, gap, sources wanted).

## Handback

When the researcher resumes (Vicky's word), conductor.B (or Vicky's conductor) tells the curator and the journalists; journalists stop scanning after their next run; the curator keeps reading leads already logged until each is commissioned, held or dropped, and the researcher picks up `leads/requests.md` and the curator's open gaps first, so nothing falls between. This file is then marked retired.
