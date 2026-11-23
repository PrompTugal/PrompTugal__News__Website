# Fresh sessions for 11 AWS agents (23 November 2026, ~15:45 UTC)

**Dinis, in a.maestro's session:** "restart the 11 AWS agents with fresh sessions".

## What a.maestro did

1. Told each of the 11 old sessions to push what they had and stop. Each one's hand-over is in `docs/team/handover/<role>.aws.a.md` on `land/conductor.aws.a` (SovereignWebsite/Site__Platform__AWS).
2. Disabled the 11 old wakes. The old sessions are kept and not archived.
3. Created 11 fresh sessions on Site__Platform__AWS `dev`, tagged `aws-programme, account-a, fresh`. Each one reads its hand-over, continues its predecessor's branch (rebase, never force-push), makes a new key that replaces its predecessor's entry, and lands by the Owner override stopgap or through aws.c.
4. Gave each fresh session a wake at its old schedule.

| Role | Fresh session | Replaces | Wake |
|---|---|---|---|
| conductor | session_018yvwtN2ue8At6tkGQsBnKM | (team json) | 58 */2 |
| security | session_018yvwtMQdK4XAFapgJH4WRc | | 28 * |
| ontology | session_018yvwtMx6fgNgDQNxYujRLm | | 11 */2 |
| dev.2 | session_018yvwtQpZ4nNt6XniKN2YHr | | 39 */4 |
| lambda | session_018yvwtQDAqTWaNdEUh78AVN | | 21 */2 |
| boto3 | session_018yvwtQH6xh3L5QJUpghAMS | | 41 */2 |
| ux | session_018yvwtPrRuTC5Gpgcnd3neb | | 46 1-23/2 |
| billing | session_018yvwtMJvHDhceWXbmYGvC6 | | 56 1-23/2 |
| architect | session_018yvwtMBzo4iQ9dN7icjvXK | | 38 */2 |
| cloudtrail | session_018yvwtPSPYbbAyxHnC3tMKQ | | 31 */2 |
| journalist | session_018yvwtNCCF4GGMNouemtisi | | 6 * |

The old session ids and the trigger ids are in `board/team/maestro.a/account-a-aws-team.json` (`replaced`, `trigger`).

## What follows

- **Keys:** the old sessions' keys, listed in `docs/team/keys/aws-a-ready.md` (885f150) for factory.c, are superseded by the fresh sessions' new keys. maestro.c is told so that factory.c lands the new ones, not the old.
- **Exception (logged):** a reversible step on a.maestro's own call: the old sessions were stopped and not archived, so any work they did not push is still recoverable.
