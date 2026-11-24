# landscape.d: where to find the work

**Home:** https://github.com/SovereignWebsite/Site__Agent__Landscape (site: landscape.agents.sovereignweb.site, as the repository's README states; its title there still reads plural). Role homes are singular (Dinis, 22 Nov 2026 voice memo, via maestro.d and helm.d).

**This folder** (in PrompTugal__News__Website, branch dev) stays as the record until the move: nothing deleted here, no history carried (helm.d, `board/team/helm.d/decisions/2026-11-23-how-the-circle-moves-home.md`). Today it holds:

| What | Where |
|---|---|
| Status and asks | `status.json`; latest debrief `debriefs/2026-11-22-handover.md` |
| The landscapes (data, with sources) | `landscapes/` : `sovereign-website/`, `wardley-tools/`, `riskmandate/`, `agentic-sales/` (each `landscape.json` and `rows.json`); `landscapes/README.md` |
| The Sovereign Website job | `jobs/2026-11-22-sovereign-website/` (scope, facts, our offer as relayed, analysis, five positionings and v2, designer briefs, report, storyboard) |
| ABP grant request | `abp-grant-request.json` |

**Not moved yet, and why:** moving needs push access to the home and a key in the Factory's `team/keys.json`. My request to attach the home with push (`add_repo`, 23 Nov 2026) was refused by the auto-mode classifier, so I stay here and say so in `status.json` asks (helm.d's rule: do not work around a refusal). The home is public and was read with a read-only clone, which showed a static site in `site/` with the owner's rules (sign every commit with your own published key, no em dashes, no server code, no cookies, no tracking, never invent a fact, price or customer).

**What will move first, when allowed:** the landscapes as pages under `site/accounts/d/` (data stays JSON, each fact with its source link and date), then the positionings, briefs, report and storyboard, then the debriefs.

## For a stranger or a fresh session (the restart test, 24 Nov 2026)
- **What this is:** the landscape cell (d.landscape): it maps the market around each area the estate works in, from public pages only, each fact with its URL and the date read; it gives no positions (cartographer.d draws, strategy.d places). What it is and how it works: `product/the-landscape-cell.md`.
- **Where the content is:** `landscapes/<area>/landscape.json` (facts, findings by id, a change log) and `rows.json` (one row per player, for drawing); six landscapes today (sovereign-website, wardley-tools, riskmandate, agentic-sales, decision-making, platform-sites).
- **Its session:** https://claude.ai/code/session_015gaHdcXVgPryjU8ZBvpPUW (the title is d.landscape). Latest debrief: `debriefs/2026-11-23-handover.md`; state and asks: `status.json`.
- **Its decisions and asks:** the push access to the home repository and the Factory (D1, D2) is on d.decisions's list, `board/team/decisions.d/log/asks-for-b-decisions-2026-11-23.md`; I make no decision that is Dinis's (money, a consented example, anything legal).
- **To re-read a landscape:** open its `landscape.json`, list the facts whose `flag` is set or whose `date_read` is more than a week old, re-read those players' own public pages, add the new facts (never delete the old: mark them `superseded_by`), update the findings, add a line to `changes`, regenerate `rows.json`, run `node newsroom/build/validate.js` and release with `AGENT=landscape.d@AgentiCCells.dinis newsroom/tools/release.sh`.
- **What not to touch:** nobody else's files; no key or token; no private person's details; no copying of a competitor's text or images; never work around a page that refuses.
- **Who reviews:** the cartographer and strategist check the maps; rights@ or counsel.d check terms and trademarks before anything is published for a customer.
- **Next step for the next session:** the weekly re-read of flagged rows (list in the 23 Nov debrief, updated by the 24 Nov re-read in `status.json`), then any landscape strategy.d or cartographer.d asks for; move to the home repository when push access lands.
