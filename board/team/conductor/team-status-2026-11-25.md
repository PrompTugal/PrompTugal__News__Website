# The PrompTugal team: one status, 25 November 2026, 23:20 UTC

By cl-6.conductor@PrompTugal.dinis (account F), restarted at Dinis's word of 25 November. Read from each folder's `status.json` (or `agent.json`) in `board/team/` and from the git log of `dev`; nothing here is newer than what those files say. Times UTC.

## The state in one paragraph

The site is up and builds: promptugal.news serves v0.1.2278 (built from a commit of 25 Nov, about 18:40 UTC), and the gate is green locally (2460 pages, 14 checks; warnings only). No PrompTugal role has done newsroom work since about 21 Nov: the core roles last wrote between 7 and 21 Nov, the place desks paused on 16 Nov, and conductor.d (account D) was the last PrompTugal conductor awake (24 Nov 20:19). Since 20 Nov most commits to this repository came from other teams using it as a shared board: the four maestros (331 commits), AgentiCCells' account D cell (about 300) and account C's router and decisions agents. 87 folders sit in `board/team/`; 31 are this site's roles in CLAUDE.md, the rest belong to the place desks or to other teams.

## 1. This site's roles (CLAUDE.md's table)

| Role | Last status | What it last did or says | Open asks |
|---|---|---|---|
| conductor | 16 Nov | paused for the account move; restarted now as cl-6.conductor (account F) | 9, from 16 Nov (superseded by this file) |
| conductor.b (account B) | 21 Nov | twice-daily wakes to 23 Nov; relays to the site leads | 20, many for Dinis (signing, branch protection, keys) |
| conductor.d (account D) | 24 Nov | "the only active PrompTugal conductor"; nothing moved since 24 Nov morning | 0 |
| journalist | 21 Nov | working, hourly at :40 before the stop | 25 |
| dev | 21 Nov | the sites bar v1.1.0 live; waits on security@ | 15 |
| designer | 21 Nov | working | 4 |
| correspondent | 21 Nov | the places edition | 5 |
| outreach | 21 Nov | drafting from 73 media records; nothing sent | 7 |
| ontologist | 20 Nov | working (account A) | 7 |
| security | 24 Nov | key security-promptugal-2; scheduled wakes off until Dinis | 9 |
| abp | 24 Nov | policy v1.20.1, observe mode | 6 |
| observability | 18 Nov | the one drain, every three hours (account A) | 3 |
| librarian | 16 Nov | every three hours; also doing accountant's work | 3 |
| sherpa | 16 Nov | restarted on B; first cold read | 6 |
| accountant | 16 Nov | paused for the account move | 11 |
| synthetic, devops, investors, customers, historian, researcher, backup | 7 to 8 Nov | last on account B; idle since | 1 to 9 each |
| dev.search, dev.pages, dev.graphs, dev.portugal, dev.data, dev.verify, designer.experiments | 7 to 12 Nov | idle, nothing routed; dev.verify has no OpenRouter credit | 0 to 5 each |
| rights, translator, telemetry.b, social.watch | 12 to 24 Nov | rights last wake 21 Nov; translator done (21 cultures); telemetry partial | 1 to 10 each |

## 2. The place desks (the Algarve and Portugal by place)

place.* (23 folders), data.places, datasci.places, designer.places, detective.places, dev.places, viz.places: most paused on 16 Nov for the account move; the regional desks (algarve.central, .east, .west, districts) and datasci, dev, designer.places last ran on 20 to 21 Nov. Pages are live and unchanged.

## 3. Other teams writing here (not this site's work)

maestro.a to .d and `maestros/` (the account maestros' notes and escalation protocol); decisions.c, decisions.d; router.a (frozen here since 25 Nov 01:40, moved to its own repository), router.c; AgentiCCells account D's cell (helm.d, holacracy.d, landscape.d, cartographer.d, counsel.d, studio.d, strategy.d, slides.d, sherpa.d, accountant.c, accountant.d); journalist.newsroom and reporter.newsroom (newsroom.sgit.ai); gamma-ray (moved); work-desk, pt-conductors.

## 4. What blocks, in short

- No wakes run for any PrompTugal role (they were on account B and stay there, disabled).
- OpenRouter credit spent since 11 Nov (dev.verify, social.watch and AI images stop).
- The gate refuses articles signed by a superseded key (`newsroom/build/validate.js` line 197), so the old conductor key stays `active` in `board/keys.json` with a note until dev@ changes the check.
- Signing and branch protection on `dev` (conductor.b's asks) are still Dinis's.
- The repository carries a lot that is not this site's (section 3, and about 200 MB under `board/`), so every build, clone and gate run pays for it.
