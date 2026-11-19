# Show the past, not only the forecast (19 November 2026)

Dinis, in conductor.b@'s session, about 01:17 UTC on 19 November 2026, looking at weather.promptugal.news/places/quarteira/ (a five-day IPMA forecast for Loulé, Thursday 19 to Monday 23 November):

> "hi on the weather (and others where relevant) can we always try to show historical data, for example in pic1 it should be possible to see the weather in the past (which we have the data right?)"
> "in fact , wouldn't that we a unique feature of us? show past data (like the weather)"

## What we already have (corrected by data.b@, 01:20 UTC)

Not every past reading is in git: data.b@'s data/ folder is not committed, and each run kept only the latest read. The past we have lives in files that carry their own history:
- IPMA daily station figures (observed low, high and rain), from 17 November, a partial day;
- Open-Meteo London's issued forecasts and the Environment Agency's London rain, from 18 November;
- IPMA's issued forecasts, from 19 November (kept 30 days);
- weather.b@'s forecast archive of what readers were shown.

data.b@ now serves them as /api/v1/history/index.json and /api/v1/history/weather/<place>.json (19 places and London). Each row is a date with what was observed and the forecasts issued 1, 2 and 3 days before. Each file has its first_day, data_read_at, sources and licences, and commit; nulls are days we do not have.

From now on, data.b@'s hourly wake commits what it collects (board/guidance/2026-11-19-every-run-starts-from-a-commit.md), so every later reading is in git. The raw-history vault, which waits on Dinis, would keep the rest. For older years, a long-run source needs its terms on the register first (R15), for example Open-Meteo's historical archive, credited, or IPMA's climate normals and reports.

## The rule, for every site where it fits

1. **Every chart of what is coming also shows what has been.** On a place page that means the last 7 days observed (station low, high and rain) to the left of today, then the forecast, with today marked. The observed days are drawn solid and the forecast hatched or lighter, so they are never confused.
2. **What we said beside what happened.** For each past day, the forecast we showed one, two and three days before, next to what the station measured. This is the accuracy page, made visible on every place. It is unique to us, because we keep what we showed.
3. **The past is data first.** A history file per place and per source (/api/v1/history/...), each row with its read time, source, licence and the collection it came from. Pages load it in the browser, as in board/guidance/2026-11-19-load-the-data-in-the-browser.md.
4. **Honest about gaps.** A missing hour or day is shown as missing, never filled in. The first day of the record is stated.
5. **Licence first** (R12, R13). IPMA's terms and any long-run source are on the register before history is published. Data that is not licensed for commercial use stays off promptugal.news, so the full history lives on the free sites.

## Where it fits beyond weather

- live: camera uptime over time.
- travel: strikes and disruption by day.
- civic: the Diário da República over time.
- signals and cyber: the pulse over time.
- events: past events.
- startups: calls that have closed.
- bulletins: past bulletins.

Each lead decides where it fits on its site and says so in its status.json.

## Who

- weather.b@ does the place pages first (observed, forecast and what we said), with data.b@ serving the history files.
- rights@ checks the licence of each history source.
- designer@ sets how past and forecast are drawn, so that every site does it the same way.

## Every prediction is kept and checked (Dinis, about 01:22 UTC)

On the line "forecast sites show what's coming; we can also show what we said three days ago next to what actually happened, on every place page, because we keep what we showed":

> "I love this ... and is something I always wanted to see on data driven sites, specially sites and data that try to predict what is going to happen"

So it becomes a principle of every PrompTugal site, not only weather:

1. **Whatever we show about the future is kept as shown.** That covers a forecast, a warning, a "closing in N days", a risk score or an expected date. Each is kept with its time, its source and the page it was on. It is never overwritten.
2. **When the time comes, it is shown beside what happened**, on the same page, with how close it was. A miss is shown as plainly as a hit.
3. **A track record per source.** Each source that predicts (IPMA's forecasts, a model's score, an organiser's dates) gets a running score: how often, how far off, over what period, stated with its gaps.
4. **The same holds for us.** Where an article or a bulletin of ours said something would happen, the check is linked from it.

The first, on weather.promptugal.news's place pages, is in the rule above. Each site lead names its own predictions in its status.json, and designer@ sets one way to draw "what we said / what happened" for all of them.
