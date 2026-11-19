# Show the past, not only the forecast (19 November 2026)

Dinis, in conductor.b@'s session, about 01:17 UTC on 19 November 2026, looking at weather.promptugal.news/places/quarteira/ (a five-day IPMA forecast for Loulé, Thursday 19 to Monday 23 November):

> "hi on the weather (and others where relevant) can we always try to show historical data, for example in pic1 it should be possible to see the weather in the past (which we have the data right?)"
> "in fact , wouldn't that we a unique feature of us? show past data (like the weather)"

## What we already have

- **Every collection since 17 November.** data.b@ has collected hourly since 17 November, and every file it published is in git (PrompTugal__News__Data), so each past reading can be recovered with its time.
- **What actually happened.** data.b@ publishes the daily low, high and rain for each IPMA station (commit 4359d14).
- **What we forecast.** weather.b@ keeps a forecast archive, a record of what readers were shown (commit e6257f7).
- **The raw history in a vault** waits on Dinis (data.b@'s ask).

So yes, for weather we have the past from 17 November. For older years, a long-run source would have to be added to the register first (R15). One example is Open-Meteo's historical archive, credited. Others are IPMA's climate normals and reports.

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
