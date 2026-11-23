# Slow down until Monday (Dinis, 21 November 2026, about 08:45 UTC, in maestro.b's session)

Dinis: "we're running just a little bit hot. We're okay, we're still 82%, but I want to make sure that we make it until Sunday ... what are the things that we can slow down a little bit so that we can then accelerate from Monday." Then: "Yes let's run the PrompTugal once a day and slow down the others".

## What maestro.b changed (update_trigger), and how to restore on Monday 23 Nov

- Every PrompTugal twice-a-day wake (34 scheduled tasks, Europe/Lisbon) keeps only its first, morning hour: "M H1,H2 * * *" becomes "M H1 * * *". Restore: put the second hour back (the evening hour is 11 hours after the morning one in every case).
- The hourly wakes that wait on Dinis go to every three hours: the SovereignWebsite conductor (31 * * * * to 31 */3 * * *), the AgentiCCells conductor (6 * to 6 */3), cell.email.b (12 * to 12 */3); maestro.b (18 * to 18 1,4,7,10,13,16,19,22, which keeps the 07:18, 13:18 and 19:18 briefs). Restore: back to hourly.
- writer-10 (newsroom.sgit.ai, Europe/London 47 9,18) to once a day at 09:47. Restore: 47 9,18.
- Left as they are: feedback.b's inbox round (cheap when empty), the Mistral round (it ends itself after 09:20 UTC) and the Mistral design stop at 21:00 UTC (the hackathon).

maestro.b restores them on Monday 23 November at its first wake after 00:00 UTC, unless Dinis says otherwise.

## Second step (Dinis, 21 November 2026, about 15:30 UTC, in maestro.b's session)

Dinis: "Hi we need to slow down some more, since we don't need the mistral and others we started recently until Monday".

Paused (enabled false) until Monday, restore by enabling them again with the cron they hold:
- The SovereignWebsite conductor's wake (trig_015LDYEmyDkQNBjbiWuPnBc9, holds 31 */3; restore to 31 * * * *).
- The AgentiCCells conductor's wake (trig_01JhMC2KKgXhecdBf8QajdqE, holds 6 */3; restore to 6 * * * *).
- cell.email.b's wake (trig_01DLGQUfJbiz2gRbTupmx8fj, holds 12 */3; restore to 12 * * * *).
- The Mistral team's 21:00 UTC "stop the design loop" reminder (trig_012RimZ6Dur3uzw8QEbzx88r): not needed, the design loop was already off; leave it off.

Already off before this step: every Mistral loop (the overnight round, the conductor's check, the design round). The Mistral sessions are idle: mistral.design stopped at its 20 USD cap with a hand-over, mistral.promptugal finished its seven demos, the overnight round waits on Dinis for a signing-key question.

Kept on: the feedback inbox round (it relays messages from real people on their sites and costs almost nothing when empty), and the slowed PrompTugal team.

## Third step (Dinis, 21 November 2026, about 23:00 UTC, in maestro.b's session)

Dinis: "ok, we are now at 96% here so what sessions are we still running on a schedule that we can stop?" Then, to maestro.b's list: "go".

Paused (enabled false) until Monday, restored by maestro.b's reminder of 23 Nov 00:25 UTC:
- All 34 PrompTugal wakes (they keep their once-a-day cron; restore: enable, then put the evening hour back as the first step says).
- writer-10's "Ten days" wake (trig_01P5GzqB8bwZo1vjG92bwXdw; restore: enable, 47 9,18 London).
- maestro.b's own wake (trig_01Vddpc8LDR2VRBGuzsveEDx; restore: enable, 18 * * * *).
- sites.b's one-off "Send Streaming point 1 to data.b" (trig_01SBxj7umYLDV1eP6Sz7wNP2, was 22 Nov 07:10 UTC; restore: give it a new run_once_at on Monday after data.b's first wake, and enable).

Kept: the feedback inbox round (real people's messages, almost free when empty) and the restore reminder.

## Restored (Monday 23 November 2026, 00:27 UTC, by maestro.b's reminder)

After the weekly reset, as the three steps above say: 32 of the 34 PrompTugal wakes back to twice a day; the SovereignWebsite, AgentiCCells and cell.email.b wakes hourly; writer-10 at 47 9,18 London; maestro.b hourly at :18; sites.b's streaming reminder re-set for 07:20 UTC (after data.b's 07:03 Lisbon wake). Not restored: signals.b (trig_01LstFMiyBcFySW9VEo4jJwF) and designer.places (trig_013pZjyrQDZSyK7xoKkU8krA); the permission check in maestro.b's session refused those two edits, so they wait for Dinis (re-enable at 28 8,19 and 2 8,19 Lisbon). Dinis's twins guidance of 22 Nov (board/guidance/2026-11-22-twins-do-not-talk-across.md) changes nothing here.
