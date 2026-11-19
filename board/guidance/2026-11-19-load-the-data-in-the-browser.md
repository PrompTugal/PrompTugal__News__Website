# Load the data in the browser (19 November 2026)

Dinis, in conductor.b@'s session, about 01:15 UTC on 19 November 2026:

> "yes, option 1, load the data in the browser"
> "since that is also the most scalable way"

## Why

GitHub's scheduled runs fire far less often than their cron asks. Weather's Pages workflow asked for about 14 runs between 17:55 and 01:10 UTC, and GitHub fired 2: #32 at 22:42 and #35 at 00:15, both green (Dinis's screenshot of the Actions tab). A page whose figures are baked in at build is only as fresh as its last rebuild. A page that reads the latest file when it opens is always as fresh as the collection, needs no token, and costs nothing whatever the number of sites and readers.

## The rule, for every site with figures that change

1. **The page loads its changing figures in the browser**, from the latest published file on our own data host (data.promptugal.news, or the site's own /api/). It fetches when the page opens and, where it matters, on a modest interval of no less than five minutes.
2. **Only our own hosts.** The browser fetches from https://promptugal.news and *.promptugal.news only, never from a third party (IPMA, TfL, Open-Meteo and the rest are read by our collectors, not by the reader's browser). The request sends no cookie and no referrer (`credentials: 'omit'`, `referrerPolicy: 'no-referrer'`), so nothing about the reader goes anywhere (CLAUDE.md, observability: no IP, no cookie).
3. **The built page still works.** The build writes the last known figures into the HTML, for search engines, the markdown twin, llms.txt and readers without JavaScript. The browser replaces them only with a file that passes its checks: the expected schema, a newer read time, and values within bounds. If anything fails, the built figures stay.
4. **Every figure says when it was read**, from the file's own read time (data_read_at), and the page says whether it shows the live file or the built copy. A file older than its expected cadence is shown as stale, never as now.
5. **Licence and provenance travel with the data** (R12). The file carries its licence and source, and the page shows them next to the figures it loads. On promptugal.news, only data marked commercial_use allowed is loaded (R13).
6. **Safe by construction.** Values are written with textContent, never innerHTML. The CSP's connect-src lists the exact hosts read, and script-src stays 'self'. data.promptugal.news's files are served by GitHub Pages with Access-Control-Allow-Origin: *, which allows the read.
7. **The schedule stays as a backup** for rebuilds. It is no longer what keeps a page fresh, and no token is made for triggering rebuilds.

## Who

Each site lead applies it to its own pages (weather, live and travel first, then civic, events, startups, signals, cyber, bulletins, videos and library where they show changing figures). dev@ does the same for promptugal.news's live-now and place pages. data.b@ keeps each latest file at a stable URL, with data_read_at, its licence and a schema. security@ reviews the pattern once, on the first site to ship it.
