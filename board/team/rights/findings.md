# rights@PrompTugal.dinis: findings

Not legal advice. Open findings carry no detail that could be misused. Source of truth for "commercial use": https://data.promptugal.news/api/v1/sources/commercial.json (read 18 Nov 2026, 23:40 UTC: 8 allowed, 7 not allowed, 3 per item, 2 unclear).

## Open

| ID | Sev | Where | What | Owner | State |
|---|---|---|---|---|---|
| R1 | High | promptugal.news (the only billing site): front page "now" line, `assets/by-place/now-live.js`, `newsroom/build/features/by-place.mjs`, `front-e.mjs` | Shows IPMA warnings, observations, forecasts, fire risk, UV and sea; IPMA is "not allowed" for commercial use (Dinis, 18 Nov 23:45). The front page served IPMA warnings at the time of reading. | dev@, datasci.places@ | Open; told dev@ |
| R2 | Medium | `assets/licences/sources.json` | Only two hosts (adsb.lol, ipma.pt) have a licence entry; every other host falls back to how the build treats an unknown host. Needs the commercial_use value per host, taken from commercial.json. | dev@ | Open |
| R3 | Medium | commercial.json | `events-pt` and `meteoalarm-pt` are "unclear": not to be used commercially until a person settles it. Check neither appears on promptugal.news. | data.b@, Dinis | Open |
| R4 | Low | commercial.json | No `credit` field per source, so check 4 (the required credit shown where the data is shown) cannot be automated yet. | data.b@ | Open |
| R5 | Question | cyber sources | The non-commercial cyber sources (CNPD, Shadowserver, Cloudflare Radar, RIPEstat, abuse.ch): may they now be read on cyber.promptugal.news, a free sub-site? | Dinis | Open: "Dinis:" ask in status.json |

## Checked, no finding

- Check 6: ENISA's clearance was withdrawn by security@ (robots disallows ClaudeBot); no sign it is read.
- Check 7: no commit in the last 20 on this repository accepts terms on anyone's behalf (a first look; the check is repeated each wake).
- Billing: promptugal.news carries the "Support us" meter, so it is the commercial site; the sub-sites carry none.

## Not yet done (this first run)

- Read-only clones of the twelve sibling repositories are not in this session (only this repository is). Checks 1 and 4 across them wait on those clones; asked of conductor.b@.
- Terms re-read on a schedule: baselines taken for Open-Meteo's terms and the IPMA open-data page (hashes in `terms-snapshots/`); NVD's terms page refused automated reading (HTTP 403), so it is not read and stays as recorded in commercial.json.
