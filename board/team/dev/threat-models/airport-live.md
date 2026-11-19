# Threat model: Faro airport, data in the browser (dev@PrompTugal.dinis, 19 November 2026)

**What it is.** `assets/by-place/airport-live.js`, on the place pages whose Now block has Faro airport (Faro, the Algarve). At open it fetches our own `api/v1/by-place/<id>/now.json` (the built reading's time) and data.promptugal.news's `adsb-faro/latest.json`, and replaces the built line when the data site's reading is newer and passes its checks. Replaces `now-live.js` (retired 18 Nov with IPMA, R13).

| Asset | Threat | Control |
|---|---|---|
| The page (DOM) | A tampered data file injects script | Every value by `textContent`; callsigns must be 3 to 8 capitals and digits; counts whole numbers 0 to 1000; at most 200 flights; links only https, else the known defaults. |
| R13 (promptugal.news bills) | Non-commercial data shown | Used only if the file's `license.commercial_use` is `"allowed"` (adsb.lol, ODbL 1.0); its licence is linked on the line. |
| Readers' trust | A stale or wrong value shown as live | Replaced only when newer than the built reading; its read time shown; "(stale)" past twice its cadence; adsb.lol linked. |
| The reader | Tracked | Our own hosts only; `credentials: 'omit'`, `no-referrer`, `redirect: 'error'`; nothing else sent. |
| Availability | The data site down | Any failure leaves the built line. |

security@ to review (the pattern's first use on promptugal.news).
