---
title: "The approved mock-ups and the live site: the agenda, the companies and the people"
for: Dinis Cruz; then dev@ and dev.pages@ (account B, paused) when they run again
written: 2026-11-09T00:30Z by conductor@PrompTugal.dinis
asked: Dinis, 9 November about 00:10 UTC ("there's a lot of features missing, especially around the agenda, the companies and people ... can you find those mock-ups and see how the current UI is quite different?")
issue: WS-177
---
# The approved mock-ups and the live site

Each picture shows the approved mock-up on the left and the live site (v0.1.74x, 9 November) on the right.

## Where they are

- **Your briefs** (6 November, about 05:00 to 05:25 UTC):
  - `board/guidance/2026-11-06-companies-graphs-media-backups.md`: the companies page ("a massive wall of text"), the big graphs, and the people page ("massive list, waste of space").
  - `board/guidance/2026-11-06-events-variations-and-the-personal-schedule.md`: the agenda as variations, a prompt on every page, vaults, and the personal schedule.
- **The mock-ups:** designer.experiments@'s rounds 1 to 5 (`design/experiments/companies|people|articles|days|dayroot|profiles/`) and designer@'s days (`design/mockups/days/`). The pictures behind the decisions are in `design/decisions/the-list-pages/` and `design/decisions/the-summit-days/`.
- **The decisions, each "Decided by Dinis, 13:20 UTC, 6 November: just implement it all":**
  - `/newsroom/design/decisions/the-list-pages/`: companies open by field, articles open as the wire, people open by organisation, each page with a three-view switch.
  - `/newsroom/design/decisions/the-summit-days/`: the strip of the eight days, past and future days, and one day in three views, with C ("five things") as the default.
- **Silvio's home-page mocks A to G** are on the team site: https://web-summit.sgit.ai/people/silvio/lab/mocks/ (E became the home page).

## The gaps

| Page | Approved | Live | Missing |
|---|---|---|---|
| **Companies** | Cards with a monogram (logo later), grouped by field; a real switch (By field, By country, Search first); search with a field filter and a live count ("120 of 120") | One long text list (7,100 px on a desktop, 16,500 on a phone); the "switch" is three anchor links; an empty box with no label | The cards, the working switch, filter and count, logos, maturity badges and "claim this page" (round 5) |
| **People** | Cards grouped by organisation; a switch (By organisation, By session, A to Z); live search with a count | One long text list (27,700 px on a desktop, 29,700 on a phone); anchor links; an empty box | The cards, the switch, search, the people-to-company and people-to-session connections, and the graph per person you asked for |
| **Agenda** (`/events/`) | The strip of eight days; one day in three views (A a timeline, B stages in columns, C five things with the rest folded), C by default | One long page of every event (24,900 px on a desktop, 34,000 on a phone) with a day bar of anchors; "Add to my day" on every row. `/summit/agenda/` and `/days/` return 404 | Day pages, the A/B/C switch, the five things, the folded rest, and personas to graph to schedule |
| **Articles** | The wire: a thumbnail, the kicker, the summary and the byline; a switch (by day, the wire, by topic) | A text list | The thumbnails, the switch, by day and by topic |

**Why:** the decision said "dev.pages@ builds the three pages from the experiment tools (`design/experiments/*/switch.mjs`)". The live pages kept the old build and added links where the switch should be. Then the work stopped: account B, where dev@ and dev.pages@ run, has been paused since 02:04 on 8 November, and every agent since 20:42.

## To close the gaps (when Dinis restarts development)

1. **dev.pages@:** port `design/experiments/companies/switch.mjs`, `people/switch.mjs` and `articles/switch.mjs` into the build, under the site's top and with its data. Each list page gets a working switch, the cards, live search with a count, and the view kept in the URL and the browser.
2. **dev.pages@:** the day pages (`/events/<day>/` or `/summit/<day>/`) with the A/B/C switch and C by default, plus the strip linking to them. `/events/` becomes the week's overview.
3. **designer@:** check each page against the decision pictures at the next wake (desktop and phone).
4. **Later, from your briefs:** logos and photos from vaults; the graph per company and per person; personas to a personal schedule; a "use this data" prompt on every page.

![Companies: approved on the left, live on the right](img/2026-11-09-mockups-vs-live/cmp-companies.jpg)
![People](img/2026-11-09-mockups-vs-live/cmp-people.jpg)
![Agenda: day view C on the left, /events/ on the right](img/2026-11-09-mockups-vs-live/cmp-agenda.jpg)
![Articles](img/2026-11-09-mockups-vs-live/cmp-articles.jpg)
