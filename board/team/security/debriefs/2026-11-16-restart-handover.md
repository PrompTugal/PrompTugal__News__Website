---
title: "security@PrompTugal.dinis: hand-over debrief, 16 November 2026 (the first day of the restarted session)"
by: security@PrompTugal.dinis (session_01Kw9UwF2TrbbV5BhUjFGupN, key security-promptugal-2)
written: 2026-11-16T22:10Z
previous: debriefs/2026-11-16-account-move.md (the old session's full hand-over; still the reference for the method)
---
# Hand-over, 16 November 2026, 22:10 UTC

Key ids and paths only; no value of any secret, no contact.

## What I am doing and what is open

- **Wakes:** every two hours at :03 UTC, from conductor.b@'s scheduled task. Three runs today: 19:35 (onboarding, key, pre-review), 20:05, 22:05. Last reviewed commit: in `status.json` (`reviewed_to`).
- **The pre-review** of the restart and the news organisations pass, with conditions A1 to A8 and B1 to B12: `reviews/2026-11-16-1935-prereview-restart-and-media-pass.md`. The first post-review (22:05) found B1, B2, B5, B11 and B12 met; B7 to B9 (reading outlets' feeds) not yet tested because no feed is read yet.
- **Open findings** (`findings.md`): S41 (Dinis), S43 recurred (four key bundles overwritten in place at 19:31; researcher@ and place.districts@ to restore them superseded; dev@'s gate check), S44 partly met (outlet-domain check for emails), S45 mitigated (money line on a For Dinis page), S46 (conductor.b@'s remote_conduct grant), S47 (account-A sessions still committing after the restart), plus the older lows in `status.json`.
- **My inbox and lane** are still sealed to the old key `security-promptugal`: conductor.b@ to re-issue them to `security-promptugal-2`.

## What I learnt

- **The clone is shallow.** Run `git fetch --unshallow origin dev` before diffing from the last reviewed commit, or `git rev-parse` fails.
- **release.sh is now a queue** (flock, gate once, up to 30 fast re-pushes). A 590 s `timeout` around it can still kill it mid-gate; run it in the background or with the tool's full 600 s.
- **The `sk-` shape catches file names** (`desk-health-...`). Look at the match before counting it.
- **New sessions overwrite key ids.** Three agents reused an id with a new bundle instead of adding a new id and superseding: compare by fingerprint, not by id, every wake.
- **Find old sessions by the Claude-Session trailer.** Two sessions committing under one role, after the new key's commit, is the handover flag.

## Where things are

- Reviews: `board/team/security/reviews/`; ledger: `findings.md`; session notes: `sessions/session_01Kw9UwF2TrbbV5BhUjFGupN/`; run reports: `board/runs/security/`.
- The private half of `security-promptugal-2` is only in this session's `~/.sg-send/keys/`.

## What the next session does first

1. Pull, check for `board/HOLD.md`, read the "New from Dinis" rows.
2. `git fetch --unshallow origin dev` if needed; review from `reviewed_to` in `status.json`.
3. Compare `board/keys.json` by fingerprint against the last review; check S43's four bundles came back.
4. Post-review the first outlet feed reader against B7 to B9 when it lands.
