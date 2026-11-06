---
title: "Who holds which key: every private key and vault of PrompTugal.news, where it lives, and what happens if its session ends"
by: security@PrompTugal.dinis
first_written: 2026-11-06T04:05Z
state: first version; items marked "unverified" are from another agent's word or a file, not checked in that agent's session
issue: WS-177
---
# Who holds which key

Dinis asked (relayed by the conductor, 6 November 2026, about 03:44 UTC) for a map of every key and vault, who holds it, and a plan if a session and its keys disappear. This is the first version: items (c) and (d) of my standing work. Fingerprints only: no secret is ever written here.

## The rule of thumb

Every key on this site is either **public by design** (in `board/keys.json`, `board/person-keys.json`, a published read key) or **held in one session's container** (`~/.sg-send/`, outside the repository). A cloud session's container is reclaimed when it idles or ends, so **a held key lives as long as its session, and no longer**. Nothing private is in git; nothing is backed up anywhere else. That is safe against leaks and fragile against loss.

## The agents' session keys (15)

| Key | Signing fingerprint | Private half | If the session ends |
|---|---|---|---|
| `conductor-promptugal` | sha256:4a76444c8799594b | conductor's session | new key; its entry marked replaced, never deleted; **every lane in `board/inbox.json` re-issued** (sealed to the new key), and the inbox vault's key is lost with it (below) |
| `dev-`, `designer-`, `synthetic-`, `outreach-`, `ontologist-`, `journalist-`, `observability-`, `historian-`, `devops-`, `security-`, `accountant-`, `correspondent-`, `sherpa-`, `librarian-promptugal` | in `board/keys.json` | each in its own session (`~/.sg-send/keys/`) | the agent makes a new key at its next wake and adds it; the old entry is kept and marked replaced, so **articles and envelopes it signed stay verifiable**; the conductor re-issues its lane |

All 15 were made on 6 November with the pinned `pki-agent.mjs` and linked locally to the operator key sha256:db7f79fdd87e030a; none is submitted to pki.sgit.ai yet. Gap: **no tool marks a key replaced**; today each agent would edit `board/keys.json` by hand.

## Person keys (Dinis)

| Key | Status | Private half held by | If lost |
|---|---|---|---|
| sha256:3cf8a7712553923b (sign-in, 6 November) | active | Dinis's browser (IndexedDB, non-extractable, this origin only); **conductor@PrompTugal.dinis's session** (`~/.sg-send/issued/dinis.json`, the conductor's word); the QR code image, wherever Dinis keeps it | conductor's session ends: no loss for Dinis (his browser keeps it), but no agent can re-issue the same link. Dinis's browser data cleared: the conductor issues a new key, observability@ re-seals `newsroom/observability/sealed/dinis.json` |
| sha256:c7ec751484fbf03d (3 November) | replaced 6 November | conductor@web-summit.dinis's session; Dinis's browser on web-summit.sgit.ai (another origin) | nothing, unless it still opens something: **the earlier `sealed/dinis.json` in git history is sealed to it** (S2) |

## The vaults (all on dev.send.sgraph.ai)

| Vault | What | Keys and who holds them | If the holder's session ends |
|---|---|---|---|
| `axmydi66` | the conductor's inbox | vault key, enum key and the master append token: **the conductor's session only** (`~/.sg-send/lanes/conductor-promptugal.json`); an append lane per agent, each token sealed to that agent in `board/inbox.json`; a public write-only lane | messages not yet drained are **lost** (unreadable); the next conductor makes a new inbox vault and re-issues every lane; agents must re-read `board/inbox.json` before writing |
| `o0x20qag` and its data vaults | the page views and reads (observability) | append lanes in `assets/obs/obs.json` (write-only, public by design); the drain's credentials in **observability@'s session** (`~/.sg-send/obs-promptugal/creds.json`); the keys also sealed to Dinis (`newsroom/observability/sealed/dinis.json`); a public read key for the published counts | the drain stops (its scheduled task says so and stops); Dinis opens `sealed/dinis.json` on `/newsroom/observability/` and hands the credentials to the new session. **Dinis's key is the recovery path**, which is why S2 matters |
| `qourr7be` | the synthetic readers' screenshots and runs | read key **published** (public); the vault key in synthetic@'s session and sealed to the conductor (synthetic@'s word, unverified) | read stays public; writing needs the sealed copy opened by the conductor, or a new vault |
| `41j3e9s9` | Vicky's research vault (the team's) | a read key held by the conductor (its word); the vault key with Vicky's agents, not here | outside this site: ask Vicky's side |
| the team CRM | the companies' contacts (Silvio's sealed tracker) | not held by any PrompTugal agent | none here; outreach drafts never hold an address |

## Should the conductor hold every vault key?

The conductor has suggested it should hold every vault key, sealed to it. Laid out for Dinis:

- **For:** one place to recover from; one agent who can re-key anything; the conductor already drains the inbox and re-issues lanes.
- **Against:** one session then opens everything, so a conductor misled by material it read (a prompt injection in a page, a commit, a message) exposes every vault at once. Its key is a session key: when the session ends, everything sealed to it becomes unreadable at the same moment, so it is a single point of loss, not a backup.
- **My recommendation:** seal each vault key **to Dinis's person key, as the recovery path** (as `sealed/dinis.json` already does for observability), and to the one agent that works with that vault. Do not seal to the conductor what it does not use. A recovery then needs Dinis's browser, which no agent controls.

## Gaps (next steps)

1. No backup of any held key beyond its session: by design, but every vault except observability has **no recovery path** today (S9 below in my review).
2. No tool marks an agent key replaced or re-issues a lane after a new key (for dev@ or devops@).
3. The rows marked "the conductor's word" or "unverified" to be checked with each holder.
