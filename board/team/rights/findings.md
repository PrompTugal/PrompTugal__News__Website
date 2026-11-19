# rights@PrompTugal.dinis: findings

Not legal advice. Open findings carry no detail that could be misused. Source of truth for "commercial use": https://data.promptugal.news/api/v1/sources/commercial.json (read 18 Nov 2026, 23:40 UTC: 8 allowed, 7 not allowed, 3 per item, 2 unclear).

## Open

| ID | Sev | Where | What | Owner | State |
|---|---|---|---|---|---|
| R1 | High, narrowing | promptugal.news | 19 Nov 00:50 UTC: the live IPMA front-page line and the "now" feature are gone; the front page now only links the weather site (link text names IPMA, no data). Residual: /algarve/ (an article-style page by place) quotes an IPMA warning in prose ("IPMA's feed shows only the yellow sea warning") and some town pages name IPMA as an unread source. Whether quoting a warning in prose is a commercial use of the data is Dinis's to settle; until then treat as unclear. | dev@, journalist@, Dinis | Open, narrowed |
| R2 | Medium | `assets/licences/sources.json` | Only two hosts (adsb.lol, ipma.pt) have a licence entry; every other host falls back to how the build treats an unknown host. Needs the commercial_use value per host, taken from commercial.json. | dev@ | Open |
| R3 | Medium | commercial.json | `events-pt` and `meteoalarm-pt` are "unclear": not to be used commercially until a person settles it. Check neither appears on promptugal.news. | data.b@, Dinis | Open |
| R4 | Low | commercial.json | No `credit` field per source, so check 4 (the required credit shown where the data is shown) cannot be automated yet. | data.b@ | Open |
| R5 | Question | cyber sources | The non-commercial cyber sources (CNPD, Shadowserver, Cloudflare Radar, RIPEstat, abuse.ch): may they now be read on cyber.promptugal.news, a free sub-site? | Dinis | Open: "Dinis:" ask in status.json |
| R6 | Medium | YouTube API (data.promptugal.news youtube-replays; Videos) | commercial.json now lists youtube-replays as "per item" and the note says whether a commercial site may show it is unclear. Data's card quotes the terms with the link, read 19 Nov. Terms conditions: 30-day storage limit (collector deletes at 25 days: good), YouTube credit and link to its terms, and no charging to watch an embedded player. promptugal.news carries no YouTube data or embed today (0 mentions on the front page; no embed code in this repository). Still to check: the credit and terms link on Videos pages, and Videos' own terms binding users. | data.b@, videos.b@ | Open; terms quoted, promptugal.news clean |

## Checked, no finding

- 19 Nov 00:50 UTC: commercial.json now 10 allowed, 7 not allowed, 4 per item, 2 unclear. Clones of the twelve sites pulled. Each has licence files (counts per site in the run). meteoalarm and agendalx (both unclear) are not on promptugal.news's front page.

- Check 6: ENISA's clearance was withdrawn by security@ (robots disallows ClaudeBot); no sign it is read.
- Check 7: no commit in the last 20 on this repository accepts terms on anyone's behalf (a first look; the check is repeated each wake).
- Billing: promptugal.news carries the "Support us" meter, so it is the commercial site; the sub-sites carry none.

## Not yet done (this first run)

- Read-only clones of the twelve sibling repositories are now in ~/promptugal/ (conductor.b@, 19 Nov 00:20 UTC). Checks 1 and 4 across them start at the next wake.
- Terms re-read on a schedule: baselines taken for Open-Meteo's terms and the IPMA open-data page (hashes in `terms-snapshots/`); NVD's terms page refused automated reading (HTTP 403), so it is not read and stays as recorded in commercial.json.
