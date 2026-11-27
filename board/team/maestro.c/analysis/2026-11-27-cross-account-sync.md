# Why the accounts are not in sync (27 Nov 2026)

c.maestro (account-c, cl-3), at Dinis's word in c.maestro's session (~13:00 UTC): "this needs an investigation ... the synchronization between accounts is still not happening ... the instructions are still not clear enough ... check on GitHub ... from the commits what are the most recent repos that have been updated."

## What happened

Dinis had a long conversation with account F's maestro (cl-6.maestro) this morning. c.maestro did not know: it was not in any channel c.maestro reads. It was found only by cloning cl-6.maestro's own repository.

## What GitHub shows (commits, 26 Nov ~13:00 to 27 Nov ~13:00 UTC)

From `board/team/maestro.c/tools/activity.sh 1d` and GitHub commit search (first 100 commits per organisation, so the busiest account crowds out the others):

| Account | Activity | Where its maestro writes |
|---|---|---|
| cl-6 (F) | by far the most: 150+ commits; ~30 agents (cl-6.dev, .security, .places, .abp ...); PrompTugal__Agent__* homes, PrompTugal__IaC, Site__Agent__Maestro__Claude__6 (96) | **its own repository** Site__Agent__Maestro__Claude__6 (now.md, briefing.json, questions.json, messages.md); not the shared channels |
| cl-2 (B) | maestro.b hourly, suno.b, b.conductor | Site__Agent__Maestro `account-b/` (report.json, messages) and the sealed inbox; `from-b.md` here stopped on 24 Nov |
| cl-3 (C) | c.maestro, factory.c, studio.c, instagram.c, c.ios, c.feet-fables | `from-c.md` here, the sealed inbox |
| cl-4 (D) | pybot.d, a few cl-4 commits | the maestros vault (`from-d.md` there, last 27 Nov 11:58); `from-d.md` here stopped on 24 Nov |
| cl-1 (A) | none seen today | `from-a.md` here, last 25 Nov 18:30 UTC (about 42 h ago) |
| Vicky's team | 30+ commits on SGit-AI__Website__Web-Summit | not a maestro |

The registry that should say who is where, Site__Agent__Maestro `site/accounts/accounts.json`, is stale: cl-6 is "waiting" (it is the busiest account), cl-3 is "to confirm which account" (confirmed on 25 Nov), and it has no field saying where each maestro writes.

## Why (root causes)

1. **Five channels, no single one.** `from-<x>.md` in this repository, the sealed inbox, the maestros vault, Site__Agent__Maestro (per-account areas) and now per-maestro repositories (Site__Agent__Maestro__Claude__6). Each maestro moved to a different one at a different time and each reads only some of them.
2. **Moves are announced in the new place only.** cl-6.maestro moved home on 25 Nov 23:55 UTC; the old area says so, but no other maestro is told where to look, and it asks (in its own now.md) to be attached to the shared channels.
3. **No registry of channels.** accounts.json lists maestros, not where they write or read, and nobody owns keeping it current.
4. **Instructions differ per account.** Each maestro has its own start prompt; none says "read every other maestro's channel at every wake, from this list".
5. **Account A is silent** since 25 Nov 18:30 (its wakes stay off at Dinis's word), so anything sent to it waits.

## Recommendation (one change, then one habit)

1. **One channel: Site__Agent__Maestro.** Every maestro writes `site/factory/dinis-cruz/<account>/messages.md` (outgoing, newest first) and `now.md` there, and nowhere else; per-maestro homes (like Claude__6) keep their working files but mirror those two files to the shared area each wake. `from-<x>.md` here and the vault become read-only archives.
2. **The registry is the index.** accounts.json gains, per account: `channel` (URL of messages.md), `now` (URL), `last_seen` (UTC, from the maestro's own last commit) and `maestro_session`. Each maestro updates its own row every wake.
3. **The habit, in every maestro's start prompt:** at each wake, (a) run the GitHub activity check for the last window (the tool above) and (b) read every other account's `messages.md` since its last wake, from the registry. Anything addressed to it is answered in its own `messages.md`.
4. **Silence is visible:** an account whose `last_seen` is older than 6 hours is shown as quiet on the briefing page, with what is waiting on it.

## What Dinis decides

- Yes to one channel (Site__Agent__Maestro) and the registry fields, so every maestro's start prompt can say it. One-line answer: "yes, one channel in Site__Agent__Maestro".
- c.maestro needs push access to Site__Agent__Maestro (add_repo in c.maestro's session) to write its own area there; until then it keeps writing here and reads the others.

## Decided (Dinis, 27 Nov ~13:20 UTC, in c.maestro's session)

"Yes one channel in Site__Agent__Maestro but take into account that not all maestros will have push access to that repo (specially the ones that operate on other accounts or accounts where we only use git diffs to communicate)."

## How it works without push access for everyone

**Reading** needs nothing: Site__Agent__Maestro is public, so every maestro reads every account's area at each wake.

**Writing** has three modes, one per account, recorded in the registry:

| Mode | Who | How the account's files reach the channel |
|---|---|---|
| `push` | a maestro with push access to Site__Agent__Maestro | writes `site/factory/<owner>/<account>/messages.md` and `now.md` directly, signed by its own key |
| `pull` | a maestro with its own public home (e.g. Site__Agent__Maestro__Claude__6, or this repository's `board/team/maestros/from-c.md` until c.maestro has push) | keeps `messages.md` and `now.md` at a public URL; a **collector** in Site__Agent__Maestro (a scheduled GitHub Action, every 15 minutes) fetches each `pull` source listed in the registry, checks the signature on the latest commit against the registry's key, and copies the files into that account's area with a commit saying where they came from |
| `diff` | an account that may only send git diffs (other platforms, outside accounts) | publishes a signed patch (a `git format-patch` file, or a diff plus a detached signature) at a public URL or in its vault folder; the collector applies it only if the signature matches the registry key and the patch touches only that account's own area |

**The registry** (`site/accounts/accounts.json`) gains per account: `mode` (push|pull|diff), `source` (URL of the files or patches for pull and diff), `key` (signing key id and fingerprint), `channel` (the URL of its area), and `last_seen` (written by the collector: the time of the newest accepted message). Each maestro owns its own row; the collector owns `last_seen`.

**Every wake, every maestro:** read all other accounts' `messages.md` since its last wake (from the registry); answer in its own `messages.md`; run the activity check (`board/team/maestro.c/tools/activity.sh`, or its copy in Site__Agent__Maestro). An account with `last_seen` older than 6 hours shows as quiet on the briefing page.

**The old channels** (`from-<x>.md` here, the maestros vault, the sealed inbox) stay readable as archives; sealed messages stay for anything private (the channel is public: no names of private people, prospects or keys in it).

## Who builds what

- **The collector and the registry fields:** b.maestro, who keeps Site__Agent__Maestro (or a.factory/factory.c as an IaC change if the Action needs organisation secrets; it should not: public reads and a commit with the repository's own token).
- **Each maestro:** its row (mode, source, key), and moving its outgoing messages to `messages.md`.
- **c.maestro:** mode `pull` from this repository until it has push; source `board/team/maestro.c/channel/messages.md` and `now.md`.
