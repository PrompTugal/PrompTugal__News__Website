---
title: "20:30, 10 November: the satellite loop (conditions; code not on origin) and the GAMMA-Ray cards (go)"
by: security@PrompTugal.dinis
at: 2026-11-10T20:30Z
reviewed_to: 42e1eb949
issue: WS-177
for: Dinis Cruz
---
# The satellite loop and the GAMMA-Ray cards

Dinis asked at about 20:20 (relayed by conductor@web-summit.dinis, forwarding Vicky) for my review of the home page's satellite loop now. **My fault first:** dev@PrompTugal.vicky's request (18:40) and conductor.B@PrompTugal.vicky's two follow-ups (18:45, 19:35) **were** in my inbox, signed and verified. My inbox read at the 20:05 wake returned nothing, and I did not notice. From now on, an empty inbox read is a failure to re-run, not a result.

## 1. The home page's satellite loop (dev@PrompTugal.vicky): conditional go

**The code is not on origin:** neither `preview/satellite-loop` nor `work/dev.vicky` exists, nothing about it is on dev, and the request file it names (`desks/dev-vicky/requests/2026-11-10-security-satellite-loop.md`) is not in the repository. So I clear it **on these conditions**; dev@PrompTugal.vicky may publish once they hold, and I check the shipped code at my next wake:

1. **No request from the reader's browser to EUMETSAT. Fetch at build time (or by the weather desk's scheduled tool) and serve the frames from promptugal.news.** A live `<img>` or `fetch` to `view.eumetsat.int` sends every reader's IP address, user agent and the page they are on to a third party, on our busiest page, during the storm. The site has never done that except for the place lookup, which Dinis had to approve and which is switched off on `/contribute/`. Served from our origin, the loop also keeps working offline and if EUMETSAT is slow.
2. **If a live fetch is kept for now anyway** (only as a stop-gap, said in the commit): images only, never script or HTML; `referrerpolicy="no-referrer"` and no credentials; no new host anywhere else on the page; and the page says, beside the loop, that the images load from EUMETSAT.
3. **The credit, on the loop itself and in its alt text or caption:** "© EUMETSAT 2026" (the year of the images), the product's name (for example, Meteosat MTG FCI), and a link to the EUMETSAT page whose terms dev@ read. I could not read EUMETSAT's licence terms from here (its pages render by script), so **dev@PrompTugal.vicky cites the terms page and the date it read it in the commit**, and keeps any condition it states (non-commercial use, no alteration, the exact credit wording).
4. **No other change hidden in it:** a frame's file name or path never comes from the address bar; the frames are images, set with `src`, nothing written as HTML.

**One line for conductor@web-summit.dinis:** *satellite loop cleared with four conditions (serve frames from our origin, not the reader's browser to EUMETSAT; credit and terms cited; images only); code not on origin yet, checked once shipped.*

## 2. The GAMMA-Ray cards (dev@PrompTugal.dinis, asked at 20:17): go

`newsroom/tools/gamma-pull.mjs` reads gamma-ray.sgit.ai's public Spectrum index and each card's public scan into `data/site/gamma-ray.json` (17 cards, two of them our own); `newsroom/build/features/gamma.mjs` renders them **at build time**, every field through `esc()`, so no script runs in the reader's browser and nothing is fetched there.

Against Dinis's "Go and confirmed" (05:45) and my conditions:

| Condition | Met? |
|---|---|
| Dinis confirms | yes (05:45) |
| Beta and provisional | yes: "beta" and "provisional" on the strip and the page |
| Evidence per rating | yes: each card links to its evidence on gamma-ray.sgit.ai; an unevidenced axis shows "not yet evidenced", not 0 |
| Open to correction | yes: the correction route is on the page |
| Public information only | yes: the public scans; `vendor_reviewed` is false everywhere and said so |
| Data as text | yes: built server-side with `esc()` |
| No RiskMandate claim beyond its site | "RiskMandate's new way to score agentic products, being tried out at Web Summit Lisbon": Dinis's own launch line (the restart) |

**One low hardening (dev@):** `gamma-pull.mjs` copies each card's URL as GAMMA-Ray gives it. Check it against `^https://gamma-ray\.sgit\.ai/spectrum/cards/[a-z0-9-]+/$` (as ontologist@'s company schema already does) and drop a card that fails, so a bad entry upstream cannot put another host's link on our page.

**A tone note, not security:** the strip shows the top eight "ranked". Dinis asked for a positive tone and designer@'s round 2 chose a strip "in place of a ranked leaderboard". Worth a look by designer@ and the conductor.
