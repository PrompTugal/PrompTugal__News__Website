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

## Dinis's decision on S9 (6 November 2026, about 04:45 UTC, in security@'s session)

"Yes ... we need to create a vault that I'm going to create, that I'm going to have the private key ... then we can have two modes. Either I give you the private key, or we set up an append lane that you can then just send files to ... we can do that a bit later ... most vaults here are ephemeral and they're okay to be lost."

So: today's vaults are ephemeral and may be lost. When the first vault we cannot afford to lose exists, Dinis creates a recovery vault and holds its key; agents either receive that key from him or write to it through an append lane. Not the conductor holding every key.

## The agents' inboxes (added 04:25 UTC by the conductor)

Fourteen more vaults, one per agent (`board/inboxes/<role>.json`): the write token public by design, the credentials sealed to the agent and **also kept by the conductor** (`~/.sg-send/agent-inboxes/`, the tool's docstring: "Dinis: the conductor holds the vault keys"). So the conductor can read every agent's mail. Ephemeral like the rest. security@'s own inbox credentials were exposed in its session's transcript on 6 November (its mistake) and should be re-issued.

## The recovery runbook: what to do when something is lost (08:10 UTC)

Each case: what is lost, what survives, the steps, and who does them. Dinis's rule (04:45): today's vaults are ephemeral; his recovery vault comes when one is not. His decision of 06:20: the conductor holds every vault key.

| Lost | What dies with it | What survives | Steps (owner) |
|---|---|---|---|
| **An agent's session** (container reclaimed, archived, replaced) | its private key; its inbox's undrained messages; anything sealed only to it | its public key in `board/keys.json`, so everything it signed stays verifiable; its commits; its inbox vault (the conductor holds a copy of its credentials) | the new session makes a key and adds it, the old entry marked `superseded` with the time, never deleted (new session); the conductor re-issues its lane in `board/inbox.json` and its `board/inboxes/<role>.json` to the new key (conductor@); whoever sealed something to the old key re-seals it (the holder) |
| **The conductor's session** | its key; **every vault key it holds**: the agents' 15 inbox copies, its own inbox `axmydi66` and its undrained messages, the snapshots vault's key, the synthetic vault's sealed copy, the research vault's read key; the private half of Dinis's sign-in key that it issued | each agent's own inbox credentials (agents keep theirs); the observability keys (sealed to Dinis); the published read keys (snapshots, synthetic: what was published stays readable); Dinis's sign-in key in his browser | the new conductor: a key; a new inbox vault and lanes for every agent (`board/tools/inbox.py issue`, `agent_inboxes.py issue`); new vaults for snapshots from then on; the research read key asked of Vicky's side again. Dinis: nothing, unless he needs a new sign-in link |
| **observability@'s session** | the drain's credentials | the lanes (write-only, public), the published counts, the keys sealed to Dinis | Dinis opens `newsroom/observability/sealed/dinis.json` on `/newsroom/observability/` and hands the credentials to the new session sealed to its key (Dinis, observability@) |
| **Dinis's browser data** (cleared, new device) | his sign-in key on this origin | his key's private half in the conductor's session (while it lives); the QR code, if he kept it | the conductor issues a new key; observability@ re-seals `sealed/dinis.json`; anything sealed only to the old key is lost. **His recovery vault's key must live outside the browser** (a password manager or paper), or one cleared browser loses it |
| **A key exposed** (printed in a transcript, committed, pasted) | trust in that key and in what it opens | everything else | treat it as lost now, not later: a new key, the old entry marked `compromised` with the time; if a vault key or enum key was exposed, a new vault and its lanes, the old one emptied (the holder); security@ records it (S12 is the first case: security@'s own inbox, waiting on the conductor) |
| **The repository** (GitHub) | nothing that a clone or bundle does not hold | every clone; backup@'s bundles (`board/team/backup/tools/backup.sh`) | restore from a clone or bundle to a new remote, at Dinis's word only (backup@, Dinis) |
| **dev.send.sgraph.ai** (down or wiped) | every inbox and vault's content not cloned elsewhere | git: the board, `For:` and `To:` trailers | agents fall back to the board and commit trailers; the conductor re-issues every vault when it is back (conductor@) |

**Never backed up:** the credentials tier (`~/.sg-send/`, `.credentials/`, lane files). A key worth keeping goes sealed to Dinis's key into his recovery vault, not into a backup.

**My review of backup@'s plan (`board/team/backup/plan.md`):** agreed. Two additions: a backup never reads `~/.sg-send/` or any lane file (it does not today); and the restore test runs the gate on the restored clone before anyone calls it good.

## Gaps (next steps)

1. No backup of any held key beyond its session: by design, but every vault except observability has **no recovery path** today (S9 below in my review).
2. No tool marks an agent key replaced or re-issues a lane after a new key (for dev@ or devops@).
3. The rows marked "the conductor's word" or "unverified" to be checked with each holder.
