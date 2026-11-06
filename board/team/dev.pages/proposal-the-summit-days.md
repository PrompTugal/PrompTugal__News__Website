---
title: "Proposal: the summit's days in time (round 1, proposals only)"
by: dev.pages@PrompTugal.dinis
for: Dinis Cruz (to choose), dev@, designer@, correspondent@, historian@
written: 2026-11-06
issue: WS-177
pass: 2026-11-06-the-summit-days
---
# Proposal: the summit's days in time

From Dinis's words (board/guidance/2026-11-06-front-page-timeline-publication.md, section 2): a block of days Friday 6 to Friday 13 November, today highlighted; a past day shows the site as it was; a future day shows what will happen, as that day's front page.

## The data we already have

Every event in `data/events/` has a `date`; the agenda already groups by day (`agenda:full`, anchors `#d-YYYY-MM-DD`). Articles have a `date`. Snapshots of the front page are taken hourly into the vault `promptugal-snapshots` (board/snapshots.json). That is enough for a first version without new data.

## Option A: a day strip (smallest, ships today)

An eight-cell strip (Fri 6 ... Fri 13) at the top of the front page's Now and next column. Each cell: weekday, date, a count of events and articles that day; today filled; summit days (9 to 12) marked. A cell links to `/summit/day/<date>/`. Pure build-time HTML, no script.

## Option B: a page per day, `/summit/day/<date>/` (the real feature)

One generated page per day, from data, with a fixed shape:
- **Future day:** the programme of that day (the top items by rank, as `agenda:front` ranks them), the companies and people with sessions that day, and "what to know" (registration, logistics) from the existing your-first-day article.
- **Today:** the same, plus what published today.
- **Past day:** what was on, the articles published that day, and "the site as it was": a link to the vault snapshot of the front page for that day (when the snapshot exists), with the hour.
Previous and next day links on every page. Page layout is mine; what to know and what leads each day belongs to correspondent@; the snapshot link needs historian@/conductor@ to say how snapshots are served (vault, not repository).

## Option C: the front page as of a day (`?day=`)

The front page re-rendered for a chosen day from the same data. Most faithful to "go back in time and forward", but it needs the build to render the front page N times and a way to hide later articles; heavier, and past days are better served by real snapshots. Not proposed for round 1.

## Recommendation

Build A and B together: A on the front page, B behind it; skip C. Personalisation later reads the same day pages. First build in my next wake once Dinis or conductor@ says go (this pass's round 1 is proposals only).

## Questions

1. Where do snapshot images/pages live and what URL can a day page link to?
2. Should future days show the programme only, or also our planned coverage (correspondent@)?
3. Do days outside 6 to 13 November exist as pages (the past summits are a separate pass)?
