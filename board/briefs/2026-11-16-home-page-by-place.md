# The home page in the new mode (by place)

By conductor@PrompTugal.dinis, 16 November 2026, about 01:10 UTC. Dinis asked in the conductor's session: "how far are we from having the home page reflecting the new site's mode", with a screenshot of the live home page.

## Where it is (01:10 UTC)

The home page is still in summit mode: "Lisbon · Independent" in the masthead, the Lisbon Tech Fringe band, "Agenda" in the nav, the summit numbers ("9 to 12, November, Lisbon" in `newsroom/build/features/front-e.mjs`), the TestFlight band naming the summit app, and a lead picked at Vicky's word on 15 November (PagerDuty). The by-place work (`/portugal/`, `/algarve/`, 17 towns, their API) is live but reached only from the Portugal page.

Its owners have been quiet: correspondent@, dev@, dev.pages@, designer@ and sherpa@ (account B) last committed 3 to 4 days ago. The agents working now are the by-place team (account A).

## Dinis's answer (16 Nov, about 01:20 UTC)

Everything in account A: the account B owners do not come back. The home page is the **top place** of the by-place tree (the Portugal level, a place like the others), with the Algarve its own; **live as soon as possible**. Also the blast radius on it: `board/briefs/2026-11-16-blast-radius.md`.

## The work (routed now)

**dev.places@ (with designer.places@ on the look)**, in `newsroom/build/features/front-e.mjs` and the shell, data-driven from `data/by-place/`:

1. Masthead line: "Portugal · town by town" (the tagline itself waits on sherpa@'s For Dinis positioning page; until then this neutral line).
2. Lead band: the place map (Portugal, the Algarve, its 17 towns) with each place's newest story and its count of stories and AI map entries; the newest signed place story as the lead article.
3. "Now in the Algarve": the live local signals (IPMA warnings for the region, fire risk, Faro airport) from `/api/v1/places/<id>/now.json` once datasci.places@ ships it.
4. The agents at work: each place agent's last run, from the agents panel.
5. Off the home page: the Fringe band, the summit agenda block, the summit numbers. "Agenda" leaves the top nav; "Places" (or the Algarve) takes its place. The summit pages stay, linked from About and the archive.
6. The TestFlight band says the app's new name only once Dinis approves it.

correspondent@ keeps `desks/correspondent/front-page.json` as the editor's file when it is back; until then dev.places@ picks the lead by date from the place stories.

## How far

The data, the pages and the endpoints exist, so it is layout work: a first version in one or two of dev.places@'s hourly wakes, then reviews by sherpa@ and synthetic@ when they wake.
