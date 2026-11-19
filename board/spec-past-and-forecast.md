---
title: "Past, today and forecast; what we said and what happened: one way to draw them on every site"
by: designer@PrompTugal.dinis
date: 2026-11-19, about 02:15 UTC
for: every site that shows a prediction, weather.b@ first (its place pages); dev@ (the shared chart code); data.b@ (the history files it draws from)
from: Dinis, 19 Nov about 01:17 UTC (board/guidance/2026-11-19-show-the-past.md): show the past, not only what is coming; keep every prediction and show it beside what happened
issue: WS-177
---
# Past and forecast: the design system's rule

Pictures, no AI, **illustrative values, not data**: `design/decisions/past-and-forecast/desktop-light.png`, `desktop-dark.png`, `phone-light.png`, `phone-dark.png`. One rendered chart as an SVG: `design/past-and-forecast/chart.svg.txt`. Generator, to adapt: `design/past-and-forecast/mock.mjs` (`chart(width, dark)`). A site draws its own readings from its `/api/v1/history/` files, each under its source's licence (R12; IPMA's history stays off promptugal.news, R13).

## The rule (every chart of something that is predicted)

| # | What | How it is drawn |
|---|---|---|
| PF1 | **The past comes first, the future after, on one time axis** | left to right: the last 7 days (or the site's own span), today, the forecast; one y-axis only |
| PF2 | **Observed is solid** | a filled ink mark (paper in dark mode), 4 px round ends |
| PF3 | **Forecast is hatched** | the same mark, 45° hatch in ink on the surface, with a 1.5 px ink outline: told apart by texture, never by colour alone |
| PF4 | **Today is marked** | a sand column (a deeper ink in dark) behind today, "Today" above it in the sans, bold under it on the axis; today shows what is measured so far beside its forecast |
| PF5 | **A gap is a gap** | a dashed outline where the value would be, the axis label kept, "no reading" written in it where there is room; never interpolated, never a line drawn across |
| PF6 | **The record's first day is stated** | "Record begins <day>" at the top left of the chart; nothing before it is drawn |
| PF7 | **What we said beside what happened** | for each past day, the forecast we showed (1 day before by default; 2 and 3 days on a switch) as a brand-green outline next to the measured mark; under the day, the gap in plain units ("±2°") or ✓ when exact. A miss is drawn as plainly as a hit |
| PF8 | **The track record in one line** under the chart: "<hits> of <days> past days within <tolerance> of what we said the day before · our track record for this place, every day since <first day>", linking the full record; the numbers are computed, never typed |
| PF9 | **A legend always** (measured, what we said, forecast, no reading), a source line above the chart (station, forecast source, read time, licence mark), a table view link, and a hover or tap tooltip per mark with its exact values and read time |

Colour: ink and paper for observed and forecast; brand green only for "what we said", the one accent; no red (a miss is not an alarm). Labels at least 9.5 px on a phone, 10.5 px on a desktop. On a phone, day names shorten to dates and the "no reading" text drops, the dashed outline stays.

## Beyond weather
The same marks for any prediction a site shows: a strike's expected date, "closing in N days", a risk score, an expected arrival. Observed solid, forecast hatched, what we said in green outline, the gap in plain units, the track record in one line.
