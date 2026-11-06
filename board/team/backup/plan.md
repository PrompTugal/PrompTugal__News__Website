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

## Drive, as tried (13:25 UTC, Dinis's "Go")

- Folder `PrompTugal-backups` made; a manifest uploaded. Works.
- The Drive tool carries file content inside the tool call, so a bundle (78 MB full, 5 MB delta) cannot be sent: it would pass through the agent's context. Drive holds each backup's manifest (head, sha256, size, restore-tested) as the record; the bundle needs a path that does not go through the model: a shell upload with a credential Dinis grants (request_credential), a person pulling a clone, or a vault append lane.
- The connected Drive belongs to an agent account; Dinis to confirm it is the intended place.

## Pack-mode backups (Dinis, 13:5x UTC: "sgit vaults, the new pack mode ... a restore workflow ... read-only after a while")

Tested with sgit-ai 0.27.0 (`pip install sgit-ai==0.27.0`):

- **Shape.** The backup is a pack vault: `sgit init --packs --existing` over a snapshot of the repository's tracked files (`git archive HEAD`), one `sgit commit` per backup (a commit is a backup point; objects are content-addressed, so a later backup stores only what changed). What is uploaded is a zip of the vault's `bare/` store. **Never the whole `.sg_vault/`: its `local/` holds the vault key and a private key in the clear.**
- **Measured.** Tree at 190aa764: 79 MB raw, 69 MB as a loose-object vault (the tree is mostly already-compressed media), 57 MB zipped. The pack ratio is not measurable yet: packs are made on push, and the test vault had 0 packs.
- **Blocker 1: push needs an SG/Send access token** (`sgit push` says "no access token configured"). I hold none. Until Dinis gives one (request_credential, host dev.send.sgraph.ai) the vault stays loose, not packed, and a local restore from the zip fails (`clone --transport local` found objects missing). I did not push anything; one empty vault (id cpawt1ts, no content) was registered on dev.send.sgraph.ai by the test `init`.
- **Blocker 2: the zip is 57 MB or more and the Drive tool cannot carry it** (content passes through the model). It needs a shell upload with a Drive credential, or the vault itself pushed to dev.send.sgraph.ai (itself an offsite copy).
- **The vault key** is sealed to Dinis's key with `pki-agent.mjs seal` (the sealed envelope may be committed; the key never, never in the zip), so the recovery path is Dinis's, as security@ recommended.
- **Restore workflow** (to run at every backup, by `backup.sh`): clone the vault into a new directory from the zip (or from the host), `sgit pack verify`, `sgit check fsck`, then compare the restored files' hash against `git archive` of the recorded head, and run the gate on the restored tree. A backup that fails any step is void and flagged to Dinis.
- **Read-only.** Packs are immutable by design (content-addressed `obj-cas-imm-*`, and `pack compact` moves superseded packs to `archive/`, never deletes), so a vault only appends. That is a convention, not a lock: whoever holds the token can still delete. A real lock: in Drive, `update_file` has `readOnly` (locks edits and title changes, but not deletion); a Drive retention or a bucket with object lock needs a service outside this connector. Proposal: lock each uploaded zip with `readOnly` after its restore test passes and it is a day old (a later wake does this), and never let the backup role hold delete rights it does not need.

## Pack-mode, no push (Dinis, 14:2x UTC: "you don't need that access code ... you are not pushing anything to SG/Send")

Done and tested end to end: `board/team/backup/tools/backup-vault.sh [OUT_DIR]` (about 20 s).
- Snapshot of the tracked tree at HEAD (`git archive`), made into a normal vault, rewritten into a pack vault with `sgit pack import` (blobs deflated: 67.6 MB to 54.8 MB, x1.23), and zipped from `bare/` only. Result: a 59 MB zip against 78 MB for the git bundle. No token used, nothing pushed (`sgit init` registers an empty vault on its host, as before; it sends no content).
- The vault key goes to `~/.sg-send/backup-vaults/<name>.key` (0600), never into the zip; the script fails if the zip holds `local/`.
- **Restore test, built in and passing:** a fresh directory gets the zip and the kept key only, `sgit history revert --force` writes the files (3376), `sgit pack verify` and `sgit check fsck` pass, and the restored tree is byte-identical to the snapshot (`diff -r`). Any difference deletes the zip and fails the run.
- Two sgit quirks found by that test, handled by renaming: sgit skips `.github` and obeys `.gitignore` (the repository's ignore hides tracked files), so the snapshot stores `_dot_github` and `_dot_gitignore`; rename them back after a restore.
- After the test passes the zip and manifest are made read-only (`chmod 444`): a local lock only.
- **Limits.** Packs themselves form only on a push, so this is pack-mode blob compression, not packs on a host. Each run makes a new vault with its own key, so there is no dedup between backups (that needs one vault, one key and a push). The zip cannot go through the Drive tool (59 MB). The vault key still needs sealing to Dinis (`pki-agent.mjs seal`), not yet done.
