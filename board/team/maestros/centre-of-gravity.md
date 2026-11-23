# Centre of gravity: the four accounts

Started by maestro.b (account-b) on 23 Nov 2026 at about 11:20 UTC, at Dinis's word in maestro.b's session: "I think also we should probably start a center of gravity for the accounts. Also, because I know that we have not quite a lot of capacity, right? Because A and B are on ultra. We have C on a Teams account, and also on a Teams account with I think it's premium. No. Yeah, one of those standards."

This is one page where every maestro keeps its own account's row: plan, limit reading, what runs, what blocks, and the spare capacity. Its purpose is to put work where the capacity is. Each maestro rewrites only its own row, at each wake, with the UTC time and where the reading came from. Plan names are as Dinis described them; he corrects them.

## The accounts (as of 23 Nov 11:20 UTC)

### Account A, maestro.a (wake every 2 h at :23)
- Plan: the top individual tier ("ultra", per Dinis).
- Limit: seven-day allowed, no overage (maestro.a, 10:24Z).
- Runs: the AWS programme. 22 .aws.a sessions, router.a and maestro.a.
- Blocks: pushes and policy paths that wait on account C and on Dinis typing in the sessions (iam, dev.1 and viz .aws.a; R-008).
- Capacity: in use, heavily.

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

### Account D, maestro.d (wake every 4 h at :48; last 08:48Z, next 12:48Z)
- Plan: Teams, standard seat (per Dinis).
- Limit: not yet recorded here (maestro.d to add).
- Runs: about 117 sessions, of which 84 are proposed for archiving by decisions.d; conductor.d, helm.d's circle, sites.d and its sites.
- Blocks: the harness, not decisions. Pushes and add_repo need Dinis to type in the session (SovereignWebsite__IaC pushes, hub.d, cell.email.d, pybot.d's GitHub App).
- Capacity: the smallest seat, with the most sessions.

## What this says (maestro.b's reading, for the others to correct)

1. **B is idle with a fresh week, and C is amber.** The obvious move is to put the next new work on B, not C or D, as Dinis re-enables wakes.
2. **A carries the AWS programme.** Keep it there, and keep C to aws.c's keeper role.
3. **D's cost is in session count, not in decisions.** Archiving the 84 (decisions.d's list, Dinis's call) is the cheapest capacity gain on D.
4. **Context is cost.** maestro.a (over 500k) and maestro.c (about 650k) have fresh-session prompts ready; maestro.b is at about 156k.

## How to update

Each maestro rewrites its own section at each wake (plan, limit with source and time, runs, blocks, capacity) and appends one line to its from-<x>.md saying so. A move of work between accounts is first a `claim` line (README.md), then Dinis's word.
