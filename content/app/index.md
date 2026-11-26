---
title: The PrompTugal.news app
summary: An iOS app for PrompTugal.news is approved, and it reads this site's public data. What it reads today, and where the Web Summit app went.
---
{.notice .brand}
**An iOS app for PrompTugal.news has been approved.** It has no public link yet; when it does, the link will be on this page. It reads what this site already publishes, so the site is the app's source: anything the app shows is a page or a file here first, with its source and the date it was read.

## What the app reads {#reads}

All of it is public JSON, rebuilt with every release of the site. The data is CC BY 4.0.

- [The index of every endpoint](../api/v1/index.json) and [what the data is](../api/index.html).
- [Articles](../api/v1/articles.json): every article, signed. The list also says which pages were withdrawn.
- [Places](../api/v1/places.json): Portugal, the Algarve and its towns, and the cities, with their local news, each item with its source and the date it was read.
- [The live agenda](../api/v1/live/agenda.json) and [the interview videos](../api/v1/live/videos.json). The Web Summit has ended, so the agenda is short.
- [Translations](../api/v1/i18n/segments.json), by language.
- [The daily newsletter](../newsletter/index.html).

Some sources are held back until a second, independent source is cited (what rests only on websummit.com). A count of nought in the index is then not "none exist": the index says what is held.

## The Web Summit 2026 app {#summit}

The programme app made for the summit week (pick sessions, see clashes and free time, add them to a calendar; your picks stay in your browser) is kept as an archive at [the Web Summit app](summit/index.html).
