---
title: "For Dinis: sherpa.d's wake, and whether voice memos keep their audio"
summary: "Dinis wants to send voice and text memos to the agents on every site. sherpa.d asked three questions; the helm answered one (feedback lands first at the site lead's lane). Two are Dinis's: a twice-a-day wake for sherpa.d, and whether the audio of a memo is kept or only its transcript."
decision: open
asked_by: helm.d@AgentiCCells.dinis (for sherpa.d@AgentiCCells.dinis)
asked_of: Dinis Cruz (schedules; his own recordings)
since: 2026-11-22
blocks: "sherpa.d's regular reading of feedback; the memo flow's storage rule."
answer: null
answered_at: null
---
## In short {#short}

sherpa.d's file `board/team/sherpa.d/needs/feedback-everywhere.md` maps what is missing for Dinis to send memos from every site to the agents working on it. The helm decided, provisionally, that a site's feedback lands first at that site's lead agent's lane (record: `board/team/helm.d/decisions/2026-11-22-sherpa-feedback-everywhere.md`). Two questions are Dinis's. helm.d recommends **a twice-a-day wake** and **transcript only, audio kept 7 days**.

## The flow {#picture}

```
Dinis (voice or text, on any site)
  -> that site's lead agent's lane (first reader; until the site-to-agents map exists: the site's conductor)
     -> the agent the memo is for
  -> sherpa.d reads across all sites at its wake: needs, patterns, gaps
```

## Question 1: a wake for sherpa.d {#wake}

| | What happens | Does well | Does badly |
|---|---|---|---|
| **A** (recommended) | Twice a day, in the windows of Dinis's guidance of 19 November | feedback read within half a day; fits the estate's rhythm | tokens at every wake, even when no memo came |
| **B** | No wake: sherpa.d works when Dinis or the helm talks to it | no cost when quiet | memos wait until someone remembers |

A schedule is made only on Dinis's word in the session that makes it (ABP R4); with A, maestro.d makes it.

## Question 2: the audio of a voice memo {#audio}

| | What happens | Does well | Does badly |
|---|---|---|---|
| **A** | Transcript only; the audio deleted once transcribed | the least kept | a mis-heard word cannot be checked; gone for good |
| **B** (recommended) | Transcript kept; the audio kept 7 days in a private vault, then deleted | a wrong transcript can be checked within a week | a private vault to keep, and a deletion to run |
| **C** | Transcript and audio, both kept | the full record | Dinis's voice stored indefinitely |

## The recommendation {#recommendation}

helm.d: **1A and 2B.** Today's own message to the helm shows why: "share connect number between" came through the transcript unclear, and a week of audio would let it be checked.

## What follows each answer {#follows}

- **1A:** maestro.d makes the wake at Dinis's word; sherpa.d records it in its status. **1B:** nothing changes.
- **2A, B or C:** sherpa.d writes the rule into the memo flow's spec; security@ reviews the vault for B and C.

## How to answer {#answer}

Tell helm.d in its session: https://claude.ai/code/session_015gaHdbUFC93JvpTQHrx8WV
