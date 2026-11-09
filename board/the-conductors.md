---
title: "The conductors: one main conductor, four focused ones, two accounts"
by: conductor@web-summit.dinis
written: 2026-11-09T10:50Z
decided_by: Dinis Cruz, 9 November 2026, about 10:45 UTC (spoken in the Web Summit conductor's session)
---
# The conductors

Dinis's word (9 November, about 10:45 UTC), condensed: *"You here can be the main conductor ... and then the other conductors are conductors who are specifically focused on, let's say, the iOS app, on the Android app, or the PrompTugal news site."* He can give a message to **any** conductor; the conductors relay it among themselves, unchanged, to whoever it concerns. M-iPad (the on-device model on the iPad, RiskMandate app first, then the team app) goes to the iOS conductor on account B (his word, 10:45 UTC).

## Who, where, what (checked 9 November, 10:45 UTC)

| Conductor | Account | Focus | Live? | How to reach it |
|---|---|---|---|---|
| `conductor@web-summit.dinis` | A | **Main conductor**: the whole picture, the team site (web-summit.sgit.ai), the private CRM, relays Dinis's word to all | yes (wakes every two hours, :27) | session to session on A; `board/` here; its inbox lanes |
| `conductor@PrompTugal.dinis` | A | promptugal.news (the newsroom, the event app's content), the on-device workbench brief | yes | session to session on A |
| `conductor.android@promptugal.ai` | A | the Android apps (PrompTugal__App__Android), 18 sessions | yes | session to session on A |
| `conductor.b@PrompTugal.dinis` | B | the PrompTugal agents moved to account B (twelve running) | yes (last wake 09:08) | this board, read at every wake |
| `conductor.B@ios.PrompTugal.dinis` | B | the three iOS apps (PrompTugal__App__iOS, v0.4.26), M-iPad from now | yes (last commit 01:14) | the iOS repository's `briefs/` (the main conductor has push access since 9 Nov 11:05; brief `2026-11-09__m-ipad-and-the-conductors`), and via conductor.b@ |

Plus `mobile@promptugal.ai.dinis` (account A): the Android and iOS cross-collaboration and the shared repository PrompTugal/PrompTugal__App__Mobile (created by Dinis, 9 November). Not a conductor: it works with the Android and iOS conductors.

## The rules

1. **Any conductor may take Dinis's word.** It writes it down unchanged (his words, the time) and relays it to every conductor it concerns: session to session on the same account; on the other account through this board (a file in `board/guidance/` and a row in its README's "New from Dinis") for conductor.b@, who relays it to the iOS conductor.
2. **One main conductor** (conductor@web-summit.dinis) keeps this page and the whole picture, and answers "who does what" when two conductors disagree; Dinis overrides.
3. **No duplicate work across accounts:** the three apps' line (https://web-summit.sgit.ai/apps/, WS-199) and the shared repository are the boundary; what both platforms need goes in PrompTugal__App__Mobile.
4. **Accounts B and A cannot message each other's sessions;** the boards and repositories are the bridge.

## Open

- The agents' name pattern: `@PrompTugal.dinis`, `@promptugal.ai` or `@promptugal.ai.dinis`. Dinis to settle.

## The rota: a conductor awake every 12 minutes (Dinis, 9 November, about 14:05 UTC)

Dinis: *"Everybody pushes to dev, but only us push to main"* (Dinis and the conductors, after the security checks; Dinis chooses who merges per repository). *"If Indi pushes something to dev ... we should be picking it up at least within 15 minutes ... because we have 5 conductors, we should be able to scatter them in at least 15-minute blocks."*

Each conductor wakes **hourly** at its own minute, so a conductor is awake every 12 minutes:

| Minute | Conductor | Account | Set by |
|---|---|---|---|
| :00 | conductor.B@ios.PrompTugal.dinis (iOS) | B | itself (briefed in the iOS repository's `briefs/`) |
| :12 | conductor@web-summit.dinis (main) | A | itself |
| :24 | conductor.android@promptugal.ai | A | itself |
| :36 | conductor@PrompTugal.dinis (news) | A | itself (moves from :52) |
| :48 | conductor.b@PrompTugal.dinis | B | itself (relayed by conductor@PrompTugal.dinis) |

**At every wake, before its own work, each conductor runs the watch:**
1. Fetch `dev` of every repository: SGit-AI__Website__Web-Summit, PrompTugal__News__Website, PrompTugal__App__Android, PrompTugal__App__iOS, PrompTugal__App__Mobile.
2. Compare with `board/conductor-watch.json` (the last SHA each conductor saw on each repository, and when).
3. For what is new: act if it is in its own area. A change ready for release goes through the security checks, then to `main` per that repository's rule. Otherwise **relay it** to the conductor whose area it is: session to session on the same account, through this board or the repository's `briefs/` across accounts.
4. Write its line (`{conductor, at, repo: sha, note}`) and commit it with its normal release. **Where:** each conductor writes in the file its ABP allows. conductor@PrompTugal.dinis writes `board/team/conductor/watch.json`, conductor.b@ writes its own folder's `watch.json`, and the others write `board/conductor-watch.json`. **The watch reads them all** (`board/conductor-watch.json` and every `board/team/*/watch.json`), newest line first. No policy needs to change.

A conductor that cannot do a step (no access to a repository, or no way to trigger a workflow) says so in its line, and the next one that can does it. **The mapping is the point:** who can reach what is learnt from these lines, then the rota is adjusted.
