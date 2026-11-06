---
title: "Key rotation: every key rotated on a schedule, as a commit, with an overlap, an escrow and a sign-off"
by: security@PrompTugal.dinis
written: 2026-11-06T12:40Z
decided_by: Dinis Cruz, in security@'s session, 6 November 2026 (about 12:30 UTC)
state: the map; the tools and the first rotations follow (owners below)
issue: WS-177
---
# Key rotation

## What Dinis asked

"Map a key rotation schedule ... every single key that was used here, maybe with a minor exception for now, should be rotated every day or even multiple times a day ... make sure that we have no side effects ... rotate a key and then keep it in escrow for a little bit ... and then a day later, if there's no side effects, you delete it ... we shouldn't be waiting for an incident to rotate the keys ... understand which ones we can't rotate ... It should just be a commit ... the keys will stay operational for a couple of hours until you have that sign off."

## The workflow: five steps, one commit each

```
  1 MINT           2 PUBLISH            3 OVERLAP            4 SIGN-OFF             5 RETIRE
  new key made     commit: the new      both keys work;      security@ checks:      old private half
  where it is      public half active,  senders move to      every lane, seal and   deleted from escrow;
  held             the old one          the new one;         signature works on     commit: the old entry
                   "rotating", with     holders re-seal      the new key; no        "retired" (public half
                   retire_after         what they keep       errors in run reports  kept forever, so old
                                        (2 to 6 hours)       -> commit "signed off" signatures still verify)
                                                             else: roll back to old
             escrow: the old private half, sealed to the escrow holder, from step 2 until step 5 (24 hours)
```

- **Every step is a commit** and a row in `board/team/security/rotations.json` (who, what, which fingerprints, when, the sign-off, the retirement). The private halves never touch git.
- **Overlap:** for 2 to 6 hours, the old and new keys both work, so nothing in flight breaks. This is the "operational for a couple of hours until the sign-off".
- **Escrow:** the old private half, **sealed to the escrow holder**, kept for 24 hours after the sign-off, so a side effect found late can still be undone. The escrow holder is Dinis's recovery vault once it exists; until then security@, sealed to its own key. Never the agent that rotated.
- **Roll back** at any point before step 5: the old key goes back to `active`, and the new one is `abandoned`.
- **Retire:** the escrow copy is deleted. The public half stays in `board/keys.json` as `retired`, never deleted, so everything signed with it still verifies.

## Every key, its schedule, and whether it can rotate today

| Key | How many | Held by | Schedule | Rotate today? | Side effects to handle | Owner of the rotation |
|---|---|---|---|---|---|---|
| **Agents' session keys** (`board/keys.json`) | 36 active | each agent's session (`~/.sg-send/keys/`) | **daily**, staggered by the agent's wake minute | yes, by hand; no `rotate` tool yet | its lanes in `board/inbox.json` and its inbox credentials in `board/inboxes/<role>.json` are sealed to the old key: the conductor re-seals them in the overlap; articles it signed stay verifiable through the retired public half | each agent (mint, publish); conductor@ (re-seal); security@ (sign-off) |
| **Agents' inbox vaults** (`board/inboxes/*.json`: vault key, enum key, append token) | 36 vaults | the agent and the conductor | **daily** | yes: `sgit vault rekey` for the vault key; a new append token and enum key through the lane's configure call | senders must re-read `board/inboxes/<role>.json`; messages appended in the overlap go to the old lane, so the agent drains both until sign-off | conductor@ (`agent_inboxes.py` needs a `rotate` command); each agent (drain both) |
| **The conductor's inbox** (`axmydi66`, `board/inbox.json`, 36 lanes and a public lane) | 1 vault, 37 tokens | the conductor | **daily** | yes, as above | every agent's lane token is re-issued at once; the public lane's token changes (good: it cuts any spam) | conductor@ |
| **Observability vaults** (`o0x20qag` and its data vaults; lanes in `assets/obs/obs.json`; drain credentials; sealed to Dinis) | 1 lane vault + data vaults | observability@, sealed to Dinis | **daily**, the first one **now** (Dinis's yes, 12:30) | yes: new lane tokens in `assets/obs/obs.json` (a release), `sgit vault rekey` for the data vaults, re-sealed to Dinis's current key | browsers that loaded the old `obs.json` send to the old lanes until they reload: drain both for the overlap; the published read key changes with a rekey, so the observability page must ship the new one in the same release | observability@ |
| **Snapshots vault** (`6yn1j9wf`, `board/snapshots.json`, public read key) | 1 | the conductor | **weekly** | yes | the read key is public on purpose: a rekey changes it for everyone, and old links break | conductor@ |
| **Synthetic vault** (`qourr7be`, public read key) | 1 | synthetic@, sealed to the conductor | **weekly** | yes | as above | synthetic@ |
| **Researcher's and other desk vaults** (`34jzubyc`, `bar9wi87` and those to come) | 2+ | their agent | **daily** if private, **weekly** if published | yes | each vault's README names its holders: all re-sealed in the overlap | each holder |
| **Dinis's sign-in key** (`board/person-keys.json`) | 1 active | Dinis's browser; the conductor (it issued it) | **weekly** (exception: needs Dinis to scan a QR code) | yes, by hand: `person-key.mjs issue`, a new QR for Dinis | `newsroom/observability/sealed/dinis.json` re-sealed; anything else sealed to him re-sealed | conductor@ (issue), observability@ (re-seal), Dinis (scan) |
| **OPEN_ROUTER_KEY** (environment) | 1 | the cloud environment (Dinis) | **weekly** (exception: only Dinis can mint one and set it, and sessions see it only after a restart) | no, not by an agent | every session that uses it restarts; its spend history stays at OpenRouter | Dinis |
| **SG/Send access token** (`SG_SEND_ACCESS_TOKEN`, used to create vaults) | 1 | the conductor's environment | **weekly** | ask Dinis | vault creation stops until the new one is set | Dinis |
| **GitHub credentials** | per session | the platform (each cloud session) | not ours to rotate | n/a | n/a | the platform |
| **The operator key** (sha256:db7f79fdd87e030a, pki.sgit.ai) | 1 | Dinis | **not rotated** (exception: the root of trust every agent key links to; rotating it re-links all of them) | no | every agent key re-linked | Dinis, only on a compromise |

**Public by design, so rotation changes nothing for secrecy:** the read keys published for the snapshots, the synthetic vault and the observability counts; the public write-only lane tokens. They are rotated with their vault to cut spam and stale links, not to keep a secret.

## What blocks a rotation today, and who fixes it

1. **A `rotate` command for agent keys** (mint, add the new entry, mark the old `rotating` with `retire_after`, seal the old private half to escrow): devops@, in `newsroom/tools/` (every tool there is devops@'s).
2. **A `rotate` command for inboxes and lanes** in `board/tools/agent_inboxes.py` and `board/tools/inbox.py` (rekey, new tokens, re-seal, keep the old lane open until sign-off): conductor@.
3. **Key statuses in the gate:** `active`, `rotating` (with `retire_after`), `retired`, `superseded`, `compromised`, `abandoned`; at most one active and one rotating key per agent: ontologist@ (the schema), dev@ (the gate).
4. **The sign-off check:** security@ reads every agent's run report and status since the rotation, sends a test message to every rotated inbox, and commits the sign-off: security@ (at each wake).
5. **Escrow:** sealed to security@ until Dinis's recovery vault exists: security@.

## The order

1. **Today:** observability's vaults (Dinis's yes); security@'s own key and inbox as the pilot (S12: its inbox credentials were exposed at 04:30), with the five steps done by hand and written up.
2. **When the tools exist:** every agent's session key and inbox, daily, staggered; the conductor's inbox, daily.
3. **Weekly:** Dinis's sign-in key, the published vaults, and the two environment secrets with Dinis.
4. **Measured:** each rotation's side effects in `rotations.json`. A key that breaks something twice gets a slower schedule and a note why.
