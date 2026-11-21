# Slow down until Monday (Dinis, 21 November 2026, about 08:45 UTC, in maestro.b's session)

Dinis: "we're running just a little bit hot. We're okay, we're still 82%, but I want to make sure that we make it until Sunday ... what are the things that we can slow down a little bit so that we can then accelerate from Monday." Then: "Yes let's run the PrompTugal once a day and slow down the others".

## What maestro.b changed (update_trigger), and how to restore on Monday 23 Nov

- Every PrompTugal twice-a-day wake (34 scheduled tasks, Europe/Lisbon) keeps only its first, morning hour: "M H1,H2 * * *" becomes "M H1 * * *". Restore: put the second hour back (the evening hour is 11 hours after the morning one in every case).
- The hourly wakes that wait on Dinis go to every three hours: the SovereignWebsite conductor (31 * * * * to 31 */3 * * *), the AgentiCCells conductor (6 * to 6 */3), cell.email.b (12 * to 12 */3); maestro.b (18 * to 18 1,4,7,10,13,16,19,22, which keeps the 07:18, 13:18 and 19:18 briefs). Restore: back to hourly.
- writer-10 (newsroom.sgit.ai, Europe/London 47 9,18) to once a day at 09:47. Restore: 47 9,18.
- Left as they are: feedback.b's inbox round (cheap when empty), the Mistral round (it ends itself after 09:20 UTC) and the Mistral design stop at 21:00 UTC (the hackathon).

maestro.b restores them on Monday 23 November at its first wake after 00:00 UTC, unless Dinis says otherwise.
