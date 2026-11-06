---
title: "The backup and recovery plan (first version)"
by: backup@PrompTugal.dinis
written: 2026-11-06T05:40Z
state: draft; to be agreed with security@ (recovery) and accountant@ (budget)
issue: WS-177
---
# Backup and recovery plan

## What exists to protect (from security@'s board/team/security/keys-and-vaults.md)

| Asset | Where | Loss if gone |
|---|---|---|
| The repository (all branches, tags, history) | GitHub | low: every clone is a full copy; a bundle makes it portable |
| Vaults on dev.send.sgraph.ai (inbox, observability, screenshots, agent inboxes; later images, logos, Silvio's videos) | encrypted vaults; keys held in one session each | high for media, low for ephemeral inboxes (Dinis: "most vaults here are ephemeral and they're okay to be lost") |
| Agent session keys | `~/.sg-send/` in each container | replaceable; public halves are in `board/keys.json` |
| Dinis's person key | his browser | his to protect; never backed up by an agent |

## Tiers

1. **Repository, full:** `board/team/backup/tools/backup.sh` makes a verified git bundle (all refs) plus a manifest (head, sha256, size). Works now. Cadence proposed: every 6 hours and after each release of a major change.
2. **Vaults that matter (media):** from the moment media moves to vaults, a full clone of each vault (`sgit clone`) as an archive, with the vault key sealed, never in the clear. Needs the vault's read access from its holder; I cannot read a key I was not given. Ephemeral vaults are not backed up.
3. **Deltas (later):** sgit vaults are content-addressed, so a backup after the first need only copy new objects; a git bundle can be incremental (`git bundle create --since`). Proposed once tier 1 and 2 run.
4. **Destination:** Google Drive, as Dinis asked, after he grants the connector in my ABP (R3). Until then the bundle stays in the container, which is not durable. Alternative needing no connector: Dinis (or any person) runs the script on a laptop; the repository clone on his laptop is itself a full copy.

## Encryption

A bundle holds only public repository content, so it needs no encryption. A vault archive contains whatever the vault holds: encrypted at rest by the vault itself (the archive keeps ciphertext); the vault key is never stored beside it. Dinis's decision of 6 November: he holds the recovery vault key, or opens an append lane for agents to write into.

## Verification and restore

- Each backup: `git bundle verify`, sha256 in the manifest; a restore test (`git clone <bundle>`, then the gate) monthly or after a format change.
- Restore the repository: `git clone promptugal-news-website-<ts>.bundle restored && cd restored && git checkout dev`, then push to a fresh remote only on Dinis's word.
- Restore a vault: re-create from the archive with the key Dinis holds; agents re-read `board/inbox.json` for new lanes.

## Asks

- Dinis: grant the Google Drive connector in my ABP (folder and cadence), or tell me another destination; confirm which vaults count as "cannot afford to lose".
- security@: the recovery steps per vault and the laptop copy; review of this plan.
- accountant@: a budget for runs and tokens per backup.
- conductor@: an entry in board/schedule.json; a lane and inbox for this role.
- abp@: a grant for board/team/backup/ and the backup.sh path.

## Amendments (12:25 UTC)

- **Verification means a restore, not `git bundle verify`.** In a shallow clone `verify` passes on an incomplete bundle (found at the 12:12 wake). `backup.sh` now makes the history full, clones the bundle, compares heads and runs `fsck`; the gate runs on a restored clone at each wake that time allows. The 06:10 bundle was void.
- security@'s two additions are adopted: a backup never reads `~/.sg-send/` or any lane file; the restore test runs the gate.
- Deltas: an incremental bundle was 4.9 MB against about 78 MB for a full one.
