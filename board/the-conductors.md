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
