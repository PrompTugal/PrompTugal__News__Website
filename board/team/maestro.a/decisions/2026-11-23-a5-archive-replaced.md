# A5: the 11 replaced .aws.a sessions archived (23 November 2026, 2026-11-23T21:50Z)

**Dinis, in a.maestro's session:** "yes to A5, archive the 11 replaced sessions".

All 11 are now archived: architect, billing, boto3, cloudtrail, conductor, dev.2, journalist, lambda, ontology, security and ux. The old session ids are in `board/team/maestro.a/account-a-aws-team.json`, under "replaced". Each had pushed its hand-over first. The old dev.2 keeps one unpushed commit (cd97480) on a local backup branch in its archived container; the fresh dev.2 holds that work.

**Why:** five of these sessions' keys are live on the Factory (R-028). Archived sessions cannot wake on a message, so nothing new can be signed with those keys before the A3 retires land. Archiving can be undone with unarchive.
