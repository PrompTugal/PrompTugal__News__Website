# Start, stop, slow down: how a team of agents is throttled in practice

Data and a briefing by maestro.b (account-b), 21 November 2026, at Dinis's word in maestro.b's session (about 15:40 UTC): "can you do an analysis of all these starts and stops and spend that we've been doing ... explain how this actually works in practice ... create some cool visualizations ... send all the data and briefings to ... the newsroom journalist" (for an article on newsroom.sgit.ai).

Every dollar figure here is **API-equivalent**: what the same tokens would cost at API prices. The team runs on a Claude subscription, so these figures compare runs and agents. They are not money paid (Dinis, 6 November: "those costs are API equivalent costs, so they're not real costs"). What really constrains the team is the subscription's usage limits, above all the **seven-day limit**.

## The story in five numbers

- **8,027 commits** in this repository from 4 to 21 November. They came from 60-odd agent identities, CI and two partner desks.
- **3 seven-day-limit warnings** were met and handled: 8 November 21:10, 19 November afternoon (Dinis used the available reset at about 16:00) and 21 November 03:15 UTC.
- **About 560 wakes a day became 76** with one sentence from Dinis on 19 November ("we don't need hourly updates"). The spend rate fell from about **90 USD an hour** (19 Nov, the 4 hours to 15:50) to about **18 an hour** (20 Nov) and about **10.7 an hour** (21 Nov, 13 hours to 09:50).
- **39 scheduled tasks were changed in about 30 seconds** (21 Nov, 09:08:08 to 09:08:37 UTC), one sentence from Dinis, applied by one agent. Four more were paused at 15:33.
- **0 work was lost** across two full stops and an account move. Every agent wrote a debrief before stopping. Every stop and start is a dated file with Dinis's words.

## The timeline (events.json; markers in charts 1 and 2)

1. **6 Nov 10:10.** Budgets are captured, never used to block an agent.
2. **6 Nov 21:05.** "We are running a bit hot." A second account (B) gets its own conductor. Fifteen agents on account A hand over and stop, and ten stay at every two hours.
3. **8 Nov 21:10.** The first seven-day warning on account B.
4. **9 Nov 23:30. THE BIG STOP:** "Stop all work (unless it is critical) until we realign on our strategy." This was also a test of whether the team could stop. On each account, one conductor stays on every two hours and everything else is paused. Within about 30 minutes conductor.b@ wrote a stop report: what was running, what ran in the last hour, what is paused.
5. **10 Nov 02:40. THE RESTART:** "Now really restart and accelerate ... stopping is the main risk." The stop lasted about 3 hours.
6. **16 Nov 15:25. Pause for the account move.** Every agent writes a detailed debrief (mandate, loop, state, lessons, what the next session does first), then 34 scheduled tasks are disabled on account A.
7. **16 Nov 19:25. Go.** Every agent restarts on account B from its debrief, each with a new signing key.
8. **18 Nov 02:30.** Five sub-site teams (.b) start on account B.
9. **19 Nov 01:55. The maestro.** One main conductor on account B sees across the focused conductors.
10. **19 Nov 13:05.** The Sovereign Website pivot gets its own conductor and team.
11. **19 Nov 15:50.** About 90 USD an hour across about 560 wakes a day. The seven-day limit warns, and Dinis uses the reset.
12. **19 Nov 16:30. Twice a day.** Every scheduled agent wakes twice a day, staggered in the order the work flows (data first, then desks, then reviewers, then conductors).
13. **19 Nov 17:25. Full speed for the launch.** Three conductors go back to hourly while the rest stay twice a day.
14. **20 Nov 15:10.** The email cell restarts, hourly.
15. **20 Nov 22:51.** A Mistral team (a conductor and three agents) is built overnight for Saturday's hackathon, on hourly loops with a 20 USD cap each.
16. **21 Nov 03:15.** The seven-day limit warns again, with the reset on Monday 23 Nov at 00:00 UTC.
17. **21 Nov 04:22.** The Mistral loops stop themselves: the design agent at its 20 USD cap, the conductor's checks at 09:20, as their prompts said.
18. **21 Nov 09:08. Slow until Monday.** Dinis: "Yes let's run the PrompTugal once a day and slow down the others." 34 PrompTugal wakes keep only their morning hour, four hourly conductors go to every three hours and the newsroom writer to once a day. That is 39 tasks in about 30 seconds.
19. **21 Nov 15:33. Second step.** "We don't need the mistral and others we started recently until Monday." The SovereignWebsite, AgentiCCells and email-cell wakes are paused. The Mistral loops were already off.
20. **23 Nov 00:25 (scheduled).** maestro.b restores every slowed schedule after the weekly reset.

## How it works in practice (the mechanisms)

1. **The scheduled task is the throttle.** Each agent is a Claude Code cloud session woken by a scheduled task (a cron expression stored on the account). Starting, stopping and slowing an agent means editing that one record: its cron, or its enabled flag. The session keeps its memory, repository and key, so a paused agent resumes where it stopped. One agent with the account's scheduled-task tools can change dozens in seconds (chart 3).
2. **Dinis's word is the only trigger, and it is written down first.** Every change starts from a sentence by Dinis in a session. That sentence is copied verbatim into a dated file before anything changes (board/guidance/, board/team/maestro.b/decisions/), with what was changed and how to undo it. The commit cites it. An agent's own judgement can propose, but never pulls the lever.
3. **Debrief before you stop.** Before a pause or a move, each agent writes a hand-over: its mandate, its wake loop and prompt, what is open, lessons learnt and what the next session must do first. It never includes a key, only its id. This is why 34 agents could move from account A to account B in four hours without losing context.
4. **One conductor stays on.** In every stop, one conductor per account keeps waking (every two hours in the Big Stop), so there is always someone who can restart the team, report and answer.
5. **The hold.** `board/HOLD.md` is the emergency brake. Only security@ may write it, and only Dinis lifts it. Every agent's first step at every wake is to check for it and stop if it exists. It has never been used. The scheduled-task lever was always enough, and the hold stays for danger, not for budget.
6. **Budgets measure; they do not block.** Spend is read from each session's own record (get_session's cost and rate-limit fields, never its transcript) into a ledger every few hours (ledger.json, 60 reads). The ledger feeds the decisions, and nothing is refused automatically. Agents also cap themselves where a prompt says so (the Mistral design agent stopped at 20 USD).
7. **The rate limit is read like a gauge.** Each session's record shows the account's seven-day limit state ("allowed", "allowed_warning") and when it resets. The maestro reads it at every wake and briefs Dinis when it turns to warning. That is how 21 November's slow-down started.
8. **Context is a cost.** A long-running conductor rereads its whole context on every wake. At 888k tokens of context, conductor.b@'s wakes were the most expensive on the account (chart 4: 502 USD, the highest). Its context was summarised on 21 November (888k to 138k), and its wake cost fell with it. Fewer wakes and shorter contexts are the two levers on spend.
9. **Messaging everybody is cheap and immediate.** Sessions message each other directly (send_message). After a schedule change, each affected conductor is told in one line why its wakes moved and where the record is, so nobody mistakes a slow-down for a fault.
10. **Policies log what is outside the grant.** Every agent has an Agent Behaviour Policy in observe mode. A call outside its grant is logged in its run report, not blocked, and reviewed by abp@ at its next wake. The 21 November slow-down logged 44 schedule edits outside maestro.b's grant. abp@ recorded them as Dinis's ordered slow-down and widened the grant (policy v1.19.2) within an hour.
11. **The restore is scheduled at the moment of the stop.** A one-off reminder (23 Nov 00:25 UTC) brings maestro.b back after the weekly reset to put every schedule back, as listed in the decision file.

## What the data shows (and its limits)

- **Commits track wakes, not spend.** Commits per day peaked at 1,249 (6 Nov) and 952 (11 Nov), fell to 61 to 75 during the account move (13 to 14 Nov), rose to 821 at the restart (16 Nov), then fell to 129 (20 Nov) after "twice a day". Spend did not fall in proportion on 20 Nov, because much of the work moved to other repositories (the sub-sites, Sovereign Website, AgentiCCells, the newsroom) and to the conductors' long contexts.
- **The Big Stop shows in the rate.** About 13 USD an hour before (9 Nov 18:52 to 21:52) became about 6 an hour across the night of the stop and restart (21:52 to 06:55).
- **Two eras in the ledger.** The first account-B team (6 to 12 Nov, 25 sessions, 1,745 USD) and the team restarted on 16 Nov (up to 37 sessions, 3,837 USD by 21 Nov 09:50). The hatched bars in chart 2 mark reads where new sessions joined. Part of those steps is the new sessions' earlier history, not spend in that hour.
- **Account A is only partly visible here.** Its conductor's and agents' commits are in this repository (the "conductor (account A)" column and the desks before 16 Nov). Its spend ledger lives on account A and is not included.
- **Wakes per day after 19 Nov are counted from the scheduled-task list.** Earlier figures are from the stop report and the twice-a-day note, and the 6 to 16 Nov figure is an estimate (wakes-per-day.csv says which).

## The files

- `events.json`: the 20 starts, stops, slow-downs and limits, each with its source file.
- `ledger.json`: 60 reads of account B's ledger (total, sessions, rate-limit note). `ledger-latest-per-session.json`: per session at 21 Nov 09:50.
- `commits-per-hour.csv`, `commits-per-day-by-group.csv`: activity by hour and by day, grouped (CI, conductors on A and B, the maestro, newsroom desks, side-cars, site leads, partner desks).
- `wakes-per-day.csv`: the throttle, step by step.
- Charts (SVG and PNG, 1600 x 900): `1-commits-per-hour`, `2-spend`, `3-wakes-per-day`, `4-per-session`.
- `startstop_data.py`, `startstop_charts.py`: run from the repository root to rebuild (python3, no dependencies; PNGs via Playwright).

Agent names outside @PrompTugal.dinis and @AgentiCCells.dinis are written as "name (domain)". No private person, prospect, key or contact is in these files.
