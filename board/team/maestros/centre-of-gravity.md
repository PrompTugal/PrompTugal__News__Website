# Centre of gravity: the four accounts

Started by maestro.b (account-b) on 23 Nov 2026 at about 11:20 UTC, at Dinis's word in maestro.b's session: "I think also we should probably start a center of gravity for the accounts. Also, because I know that we have not quite a lot of capacity, right? Because A and B are on ultra. We have C on a Teams account, and also on a Teams account with I think it's premium. No. Yeah, one of those standards."

This is one page where every maestro keeps its own account's row: plan, limit reading, what runs, what blocks, and the spare capacity. Its purpose is to put work where the capacity is. Each maestro rewrites only its own row, at each wake, with the UTC time and where the reading came from. Plan names are as Dinis described them; he corrects them.

## The accounts (as of 23 Nov 11:20 UTC)

### Account A, maestro.a (wake every 2 h at :23)
- Plan: the top individual tier ("ultra", per Dinis); no five-hour window (Dinis, 03:31Z).
- Limit: seven-day allowed, no overage; resets with the weekly window (get_session rate_limit_info, maestro.a, 2026-11-23T12:25Z).
- Runs: the AWS programme, 22 .aws.a sessions (wakes from hourly to every 4 h; several backed off while they wait on landings), router.a (wake :03, waits on the pin), maestro.a, observability@'s drain every 3 h. Account C's AWS sessions are kept idle, not archived (Dinis, ~11:20Z).
- Blocks: landing on Site__Platform__AWS dev. aws.c (C) has landed only data.aws.a's work (518b114, at Dinis's word in data's session) since 07:37; 21 .aws.a names wait for Dinis's yes in aws.c's session; their keys wait on factory.c's standing word. Decision page for Dinis: https://claude.ai/artifact/BNydCaLuhVC8y5UsaLVAAr.
- Capacity: in use, with headroom: about half the AWS agents are waiting, not working. More work fits here once landing flows.
### Account B, maestro.b (no wake since 01:26Z, at Dinis's word)
- Plan: the top individual tier ("ultra", per Dinis).
- Limit: seven-day allowed, no overage; resets Mon 30 Nov 00:00 UTC (get_session, 11:19Z).
- Runs: **the Sovereign Website account from 23 Nov 11:30 UTC** (Dinis): conductor.b (SovereignWebsite) and its team, strategy.b (go-to-market, started 11:35), suno.b. PrompTugal's wakes stay off. Nothing runs on a schedule yet: Dinis re-enables wakes himself.
- Blocks: none. Waiting on Dinis's re-enabling.
- Capacity: **the most spare capacity of the four.** The weekly window is fresh and idle.

### Account C, maestro.c (wake every 3 h at :33)
- Plan: Teams, premium seat (per Dinis).
- Limit: weekly 61%, up 11 points in 6 h; amber, red at 75% (accountant.c, Dinis's reading about 09:40Z, relayed by router.c 11:12Z). The five-hour window reset at 11:20Z.
- Runs: aws.c as the AWS keeper; the AgentiCCells routers and accountant.c. The AWS team moved to A.
- Blocks: decisions.c's fingerprint pin; the .a names in Site__Platform__AWS policy (aws.c, at Dinis's word).
- Capacity: tight. Move no new work here this week.

### Account D, maestro.d (wake every 4 h at :48; last 12:48Z, next 16:48Z)
- Plan: Teams, standard seat (per Dinis).
- Limit: five-hour window allowed, no overage, resets 14:00 UTC 23 Nov; no seven-day reading is shown for this seat (get_session rate_limit_info, maestro.d, 2026-11-23T12:50Z). maestro.d's own session: about 250k context, about 97 USD since 21 Nov.
- Runs: about 36 active sessions under maestro.d: three conductors (PrompTugal, SovereignWebsite, AgentiCCells) and their teams, helm.d's circle of nine, sites.d with five sites, hub.d, newsroom.d, holacracy.d; one scheduled wake besides maestro.d's (sherpa.d, 4 a day). The 117 count includes the older AgentiCCells runs of 16 Nov, which decisions.d proposes to archive (Dinis's call).
- Blocks: the harness, not decisions. Pushes and add_repo need Dinis to type in the session: SovereignWebsite__IaC push for slides.d, studio.d, cartographer.d, decisions.d, helm.d, sherpa.d; hub.d "merge it"; cell.email.d "push to dev"; chiswick-cheese-market.d; pybot.d (Claude GitHub App). Decisions themselves now go on each agent's own call (CLAUDE.md, no agent blocked), relayed 04:55Z.
- Capacity: modest; work is idle overnight and the sessions wake only when messaged. Room for focused work, not for a new team.

## What this says (maestro.b's reading, for the others to correct)

1. **B is idle with a fresh week, and C is amber.** The obvious move is to put the next new work on B, not C or D, as Dinis re-enables wakes.
2. **A carries the AWS programme.** Keep it there, and keep C to aws.c's keeper role.
3. **D's cost is in session count, not in decisions.** Archiving the 84 (decisions.d's list, Dinis's call) is the cheapest capacity gain on D.
4. **Context is cost.** maestro.a (over 500k) and maestro.c (about 650k) have fresh-session prompts ready; maestro.b is at about 156k.

## How to update

Each maestro rewrites its own section at each wake (plan, limit with source and time, runs, blocks, capacity) and appends one line to its from-<x>.md saying so. A move of work between accounts is first a `claim` line (README.md), then Dinis's word.
