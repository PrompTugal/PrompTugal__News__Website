---
title: "For Dinis: do voice memos keep their audio?"
summary: "Dinis wants to send voice and text memos to the agents on every site. sherpa.d mapped what is missing. One question is his: is a memo's audio kept 7 days in a private vault, or deleted once transcribed? (sherpa.d's wake is decided: four times a day.)"
decision: open
asked_by: helm.d@AgentiCCells.dinis (for sherpa.d@AgentiCCells.dinis)
asked_of: Dinis Cruz (his own recordings)
since: 2026-11-22T14:10Z
blocks: "The memo flow's storage rule."
question_id: memo-audio
question: "When Dinis sends a voice memo, is its audio kept for 7 days in a private vault, or deleted once transcribed?"
ask_sha256: 6c936b175d1fc2a02c09f1454583069bdd21bdb5c62283a4f5544757741facdf
reserved: true
recommendation: B
answer: null
answered_at: null
answered_where: null
pictures_asked: board/team/studio.d/pictures/sherpa-memo-flow.svg
---
## In short {#short}

When Dinis sends a voice memo, is its audio kept for 7 days in a private vault, or deleted once transcribed? sherpa.d's file `board/team/sherpa.d/needs/feedback-everywhere.md` maps what is missing for Dinis to send memos from every site. helm.d decided, provisionally, that a site's feedback lands first at that site's lead agent's lane (`board/team/helm.d/decisions/2026-11-22-sherpa-feedback-everywhere.md`). It is For Dinis because it is his own voice. helm.d recommends **B**.

## Decided before this page: sherpa.d's wake {#wake}

Dinis, in maestro.d's session, about 13:58 UTC: "Yes, agree. You can actually run this 4 times a day for Sherpa, which is quite an important one". Decided: four times a day (07:37, 12:37, 17:37, 22:37 Lisbon), beyond the two options first put (twice a day, or no wake). maestro.d made the wake (`board/team/maestro.d/decisions/2026-11-22-the-helm-and-its-circle.md`).

## The flow {#picture}

![The path of a memo from Dinis to the site's lead agent, the agent it is for, and sherpa.d](../../../board/team/studio.d/pictures/sherpa-memo-flow.svg)

Drawn by studio.d@AgentiCCells.dinis for the record (its storyboard: `board/team/studio.d/pictures/sherpa-memo-flow.storyboard.json`). The same in text:

```
Dinis (voice or text, on any site)
  -> that site's lead agent's lane (first reader; until the site-to-agents map exists: the site's conductor)
     -> the agent the memo is for
  -> sherpa.d reads across all sites at its wakes: needs, patterns, gaps
```

## The options {#options}

| | What happens | Does well | Does badly |
|---|---|---|---|
| **A** | Transcript only; the audio deleted once transcribed | the least kept | a mis-heard word cannot be checked; gone for good |
| **B** (recommended) | Transcript kept; the audio kept 7 days in a private vault, then deleted | a wrong transcript can be checked within a week | a private vault to keep, and a deletion to run |
| **C** | Transcript and audio, both kept | the full record | Dinis's voice stored indefinitely |

## What the reviewers found {#reviews}

decisions.d (14:31 UTC) reviewed the page's form; its fixes are made here. Not yet reviewed by security@ (the vault in B and C) or synthetic@.

## The recommendation {#recommendation}

helm.d: **B.** Dinis's own message to the helm today shows why: "share connect number between" came through the transcript unclear, and a week of audio would let it be checked. No agent dissents so far.

## What follows each answer {#follows}

- **A:** sherpa.d writes into the memo flow's spec, within its next wake, that the transcriber deletes the audio on transcription and logs the deletion; security@ checks the log at its next review.
- **B:** the same, with the deletion after 7 days by the vault's owner, logged; security@ reviews the vault before the first memo is kept.
- **C:** sherpa.d writes the rule; security@ reviews the vault before the first memo is kept.

## Sources {#sources}

- sherpa.d's needs: `board/team/sherpa.d/needs/feedback-everywhere.md`
- helm.d's provisional calls: `board/team/helm.d/decisions/2026-11-22-sherpa-feedback-everywhere.md`
- Dinis on the wake: `board/team/maestro.d/decisions/2026-11-22-the-helm-and-its-circle.md`
- decisions.d's review: `board/team/decisions.d/reviews/2026-11-22-helm-d-two-pages.md`

## How to answer {#answer}

On the Decision Desk (https://claude.ai/artifact/333S1Xt9XMimGP2UhcwNRr), where maestro.d relays it, or in helm.d's session (https://claude.ai/code/session_015gaHdbUFC93JvpTQHrx8WV). The record is this page: helm.d, its owner, copies Dinis's words verbatim into `answer` with the UTC and where he said them; decisions.d checks it in its log (`board/team/decisions.d/log/`).
