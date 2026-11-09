# Hand-over to the reviewer: the checker's findings on Vicky's desks

From checker@PrompTugal.vicky to reviewer@PrompTugal.vicky, 8 November 2026, about 18:30 UTC, at Vicky's word (standing answer 25 and update SA25 in `people/vicky/decisions.md` on the team site, 8 November, about 17:58 UTC).

From now on the checker checks only articles whose `author:` is not one of Vicky's desks. The findings below are on articles whose author is one of Vicky's desks. They stay in `desks/checker-vicky/findings/` (never deleted) and are **handed over, not resolved**: none of the 12 articles has changed since its finding was written (each article's last change is given below), so every item is still open. The checker will not re-check these articles. Please reconcile them in your normal runs, as standing answer 25 says, and record each outcome with its evidence in `desks/reviewer-vicky/`, For: checker@PrompTugal.vicky.

Each finding was verified at its source on the date in its file; the file has the exact quotes and links.

| # | Findings file | Article (author) | Open items | Article last changed |
|---|---|---|---|---|
| 1 | [daily-newsletter](findings/daily-newsletter.md) | S26 (journalist-ai@PrompTugal.vicky) | 1. "PrompTugal.news now sends the week to its readers twice a day": the site publishes the editions; sending is the Web Summit team's (`newsroom/build/features/newsletter.mjs`). | ae74900c, 7 Nov 21:46 |
| 2 | [driving-to-web-summit](findings/driving-to-web-summit.md) | S24 (journalist@PrompTugal.vicky) | 1. "In short": Rua do Bojador "until Thursday night" and "other streets" closed, where the council gives "00h de 12/11" and "alguns locais". 2 (smaller). The chart's "close daily": the council says "diários" only for Alameda dos Oceanos. | df79e275, 7 Nov 11:11 |
| 3 | [europe-ai-help-and-portugal-ai-startups](findings/europe-ai-help-and-portugal-ai-startups.md) | S16 (journalist-connections@PrompTugal.vicky) | 1. Lola: Técnico's page (updated 6 Nov, 09:43 UTC) no longer names her; the source line's "updated 3 November" is out of date. | 8fcfb9ff, 6 Nov 11:07 |
| 4 | [following-robotics-at-web-summit](findings/following-robotics-at-web-summit.md) | S15 (journalist-ai@web-summit.vicky; published by journalist@PrompTugal.dinis) | 1. The same Lola point, and the same "updated 3 November". | 5c25bc86, 6 Nov 14:19 |
| 5 | [how-agents-avoid-collisions](findings/how-agents-avoid-collisions.md) | T4 (journalist-ai@PrompTugal.vicky) | 1. The chart's "Ten of Dinis's newsroom agents each wake every hour": `board/schedule.json` at 092caea has 17 hourly; the chart is a selection it does not call one. | 347ed119, 6 Nov 22:51 |
| 6 | [lisbon-universities-at-web-summit](findings/lisbon-universities-at-web-summit.md) | S10 (journalist-portugal@web-summit.vicky; published by journalist@PrompTugal.dinis) | 1. The same Lola point, and the same "updated 3 November". | 5c25bc86, 6 Nov 14:19 |
| 7 | [mistakes-we-made](findings/mistakes-we-made.md) | T5 (journalist-ai@PrompTugal.vicky) | 1. "moved to a new home on GitHub on 6 November": the record dates it 5 November (649209c9, 6627ff5c). | 347ed119, 6 Nov 22:51 |
| 8 | [octo-health-launches](findings/octo-health-launches.md) | S20 (journalist-portugal@PrompTugal.vicky) | 1 (small). "announced ... on 4 November": 4 November is the report's date, not the announcement's. | 8fcfb9ff, 6 Nov 11:07 |
| 9 | [the-sign-in](findings/the-sign-in.md) | S25 (journalist-ai@PrompTugal.vicky) | 1. The name chip "at the top of every page" (text and diagram step 6): since 2bdc6812 the key loads only on /login/ and /newsroom/observability/. | 9ce5c5af, 7 Nov 13:36 |
| 10 | [venue-map](findings/venue-map.md) | S27 (journalist-ai@PrompTugal.vicky) | 1. "no script of its own": the page loads `assets/venue/venue.js` since 7dce572c, before publication. 2. The counts have moved (MEO Arena and FIL 186, not 183; Pavilhão de Portugal 5, not 6, and registration desks, not sessions). | b21f3fd7, 7 Nov 22:21 |
| 11 | [web-summit-before-2026](findings/web-summit-before-2026.md) | WS177 (journalist@PrompTugal.vicky) | 1. "as reported by AICEP": AICEP's page reposts Jornal Económico's report. | 8fcfb9ff, 6 Nov 11:07 |
| 12 | [who-does-the-work](findings/who-does-the-work.md) | T2 (journalist-ai@PrompTugal.vicky) | 1. "Nimay works without them": Daniela and Sarah, on the team's roster, run no agents either. | 347ed119, 6 Nov 22:51 |

S10 and S15 were published by journalist@PrompTugal.dinis but written by Vicky's desks, so under standing answer 25 they are the reviewer's now; the checker's findings on them were also sent For: journalist@PrompTugal.dinis on 7 November.
