# The sources register: what we read, what we do not, and asking on the record

> conductor.b@PrompTugal.dinis, 18 November 2026, from Dinis's guidance `board/guidance/2026-11-18-sources-we-do-not-access.md`.

## Who does what

| Piece | Owner | Where |
|---|---|---|
| The register, one entry per source | data.b@ | data.promptugal.news `/api/v1/sources/index.json` (one file per source under `/api/v1/sources/`) |
| The pages: `/sources/` (what we read) and `/sources/not-read/` (what we do not, and why) | data.b@ | data.promptugal.news; the main site, the five sites and the place pages link to them |
| News publications per place, and every source a desk tried and could not read (Sul Informação and the like) | researcher@ and the place desks, through data.b@'s register | each entry with its evidence |
| The request on the record to each source we do not read | outreach@ drafts; a person (Dinis) sends | drafts in `board/team/outreach/`; answers on the register |
| The per-place query set | data.b@ | `/api/v1/queries/by-place/<place>.json`, run only on sources the register marks readable |

## An entry

- `id`, `name`, `kind` (public body, agenda, news publication, event platform, open-data API, feed, social network, search or AI service), `url`, `owner` (the organisation)
- `places` it covers, and `gives` (what it would add: events, notices, news, schedules)
- `status`: `read` | `not-read` | `asked` | `allowed` | `refused` | `no-answer`
- `why` for every status but `read`: the clause of the terms or the robots.txt line, quoted, with its link and the date read
- `how` for `read`: the supported interface we use (API, RSS, iCal, open data portal)
- `asked`: the date a person sent the request, through which public channel, and the answer quoted with its date (never a private person's contact; the channel is the organisation's own published one)

## The order

1. **Official and public bodies first**: câmaras municipais, CCDRs, Turismo de Portugal and the regional tourism boards, IPMA, ANA, ANSR, the ports, CP, universities, public venues.
2. **News publications** per place (each place page already lists its outlets).
3. **Platforms**: Eventbrite, Luma, Meetup, sideevents.guide (not read today: the Fringe hold, work/49, and the five-sites brief).
4. **Discovery services**: Google News, social networks, AI search (mapped, not used; below).

## The request on the record

A short, public question to the organisation's own published channel (a press, partnerships or developer contact on its site): we are PrompTugal.news, an agentic newsroom for Portugal's places; we would like to show your public X for place Y, linked back to you and credited; do your terms allow it, and if so through which interface. The answer, or none after 14 days, goes on the register as written. Outreach's rules hold: an agent drafts, a person sends.

## Discovery services: mapped, not used until Dinis decides

- **Google News**: its search RSS feeds (by query, in Portuguese) are a supported interface and a strong way to find what is said about a place. What we may do with it is in Google's terms; until checked, use it at most to discover a story and then read and cite the publisher's own page where the register allows. data.b@ records the terms on the register.
- **Social media**: public to look at, but most platforms' terms forbid automated collection outside their APIs (X, Instagram and Facebook, LinkedIn, TikTok). Open by design: Bluesky (the AT Protocol's public API) and Mastodon (public instance APIs); YouTube through its Data API with a key. Each goes on the register with its terms.
- **AI search (Perplexity and the like)**: asking a service does not change what we may republish; the terms and database rights of the original source still bind what we show. It can point us to a source; the fact is then read and cited at a source the register marks readable.
