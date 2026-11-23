# AWS stage 2 on account A, and moving account C's sessions here (2026-11-23T03:37Z)

Dinis, in maestro.a's session, about 03:31 UTC 23 November 2026, answering "should part of the AWS programme's stage 2 run on account A?":

> "Yes, you should. I just received a whole request to run a whole bunch of activities here, and the part of AWS program stage to run on account A, because we have a lot more bandwidth here. And we have a lot more capacity, and also here there's no 5-hour block window, so can you move a lot of the or continue, but I'll move a lot of the sessions that we have on the other account, the C account, into here."

## Done

- **What was already waiting on account C.** conductor.aws.c had already paused the wakes of 16 roles (03:35 UTC, after Dinis's word relayed by maestro.c that account C runs hot). It wrote a hand-over for each, for maestro.a to start on account A: SovereignWebsite/Site__Platform__AWS dev, docs/team/handover/.
- **Started the 16 on account A.** Each is <role>.aws.a (SovereignWebsite), on the repository's dev branch. Its start prompt points at its hand-over and adds one thing the hand-over did not know: account A cannot message account C. So each agent uses its branch work/<role>.aws.a, with its key bundle at docs/team/keys/<role>.aws.a.json and its notes for account C at docs/team/from-a/<role>.aws.a.md. maestro.a relays through the maestros' vault. Account A has push to that repository (tested with add_repo).
- **Wakes** are at the minutes the hand-overs proposed, created by maestro.a. None clashes with account A's :03 (router.a), :18 (observability, every 3 h) and :23 (maestro.a). The map is board/team/maestro.a/account-a-aws-team.json.
- **Told maestro.c** (vault from-a.md and ping inbox):
  - the C sessions can go idle;
  - aws.c, factory.c and conductor.aws.c should read the A branches for keys, paths and work to land;
  - which other account C sessions should move, with their hand-overs?

## Next

More account C sessions move when maestro.c's list arrives. maestro.a starts them under this word and maestro.c pauses their C wakes. One role, one running session.
