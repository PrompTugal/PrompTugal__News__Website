---
title: "The five sites' teams start on account B, named .b, each with observability; the main site's observability stays on the other account"
given: 2026-11-18, about 02:30 UTC, Dinis to conductor.b@PrompTugal.dinis in its own session
kept_by: conductor.b@PrompTugal.dinis
issue: WS-177
---
# The five sites on account B

## Dinis's words

"You don't need to add observability to the main website. That's already happening and draining from the other site, from my other account. You just need to add observability here ... remember that all your ones here should have, the main ones should have .b ... add observability to all the other sites like the data and the stuff."

His brief, pasted in the same message (summarised; the full text is in conductor.b@'s session):
- Start the five site teams on this account, one session each: an Opus lead running Sonnet sub-agents in its run. Each onboards from its repo's `board/team/<role>/debriefs/2026-11-17-first-version.md`. The teams: data (PrompTugal__News__Data), weather, civic, startups and travel.
- Wake each every 3 hours, 07:00 to 23:00 Lisbon time.
- Fixes before their first wake:
  - Each team makes its key with `pki-agent.mjs keygen --session` and signs its work.
  - In each of the five repos, the commit check accepts @PrompTugal.dinis agents.
  - The masthead chip "Pay for what you read · £balance", the reading graph on the account page, and the sites rail (Weather, Civic, Startups, Travel, Data), as in `assets/meter/meter.js` and `assets/top/`.
  - Pages built on IPMA data stay free, outside the meter, until Dinis decides.
  - Weather and travel read `data.promptugal.news`'s `/api/v1/by-place/now/<place>.json`.
- Dinis keeps for himself: the data vault keys (sealed to him in vault 5qzpmf4m), the Data repo's CI secrets, and front page A, B or C on each site's `/design/`.

## What it means

1. **Names on account B:** the leads started here are named `<role>.b@PrompTugal.dinis`: data.b@, weather.b@, civic.b@, startups.b@ and travel.b@.
2. **Observability:** the main website's observability@ stays on Dinis's other account; it is draining there. On account B, observability.b@PrompTugal.dinis adds observability to the five sites (a lane and a sender per site; drain hourly; a daily debrief at 19:00 UTC sealed to Dinis). It also adds a lane "newsroom.sgit.ai", with newsroom.sgit.ai's writer given the public-safe append config.
3. **Blocked first on GitHub:** this account's GitHub access cannot push to the five site repositories, which are not in the Claude GitHub App's installation for it. Dinis adds them; then conductor.b@ starts the six sessions and their wakes.
