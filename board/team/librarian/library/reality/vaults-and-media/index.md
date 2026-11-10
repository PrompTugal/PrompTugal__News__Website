# Vaults, media, reader accounts, billing and backups: EXISTS

**Domain:** `vaults-and-media/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

Reader vault and account, the reading meter and top-up, vendored vault code, media made outside git, designer images, backups.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] Reader vault (a beta): passkey door, sg-vault vendored unedited; save API `window.__vault`. Evidence: `assets/vault/README.md`, `assets/vendor/sg-vault`, `assets/vendor/sgit-ai`; first added `df309590` on 2026-11-05.
- [F] Account pages: balance, history, receipts, top-up, vault. Evidence: `newsroom/build/features/account.mjs`, `newsroom/build/features/billing.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Reading meter (sg-meter v1.5.0 vendored) and price table. Evidence: `assets/meter`, `data/billing/prices.json`; first added `df309590` on 2026-11-05.
- [F] Top-up link and vault constants (data; the Stripe link's redirect waits on Dinis). Evidence: `data/billing/topup.json`, `data/billing/vault.json`; first added `df309590` on 2026-11-05.
- [F] Backup tool: full repository bundle with sha256 manifest, verified by a real restore (no durable destination yet). Evidence: `board/team/backup/tools`, `board/team/backup/plan.md`; first added `c6cd3c38` on 2026-11-06.
- [F] AI image generator tool (OpenRouter, key from the environment only). Evidence: `design/ai-images/gen.mjs`, `design/ai-images/styles.json`; first added `fa74783b` on 2026-11-06.
- [F] Designer's decision images and before and after generator. Evidence: `design/decisions`, `design/before-after/make.mjs`; first added `56f56a9a` on 2026-11-06.
- [F] Business cards generator. Evidence: `design/cards/make_cards.py`; first added `679fd582` on 2026-11-06.
- [F] Design experiments (articles, companies, days, people). Evidence: `design/experiments/companies`, `design/experiments/decision-pics.mjs`; first added `312c72fe` on 2026-11-06.
- [S] Synthetic readers' vault: 375 files, read key published, vault key sealed to the conductor (S, by name only). Evidence: `board/team/synthetic/status.json`; first added `0a6ee719` on 2026-11-06.

<!-- library:generated -->
## The library's cards in this domain (generated)

1 cards (1 current, 0 superseded, 0 withdrawn), from the catalogue generated 2026-11-10T15:58:23Z at site v0.1.1027; by library.mjs 0.2.0, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.

| Call class | Cards |
|---|---|
| `EVD.CAP` | 1 |

Newest five accessions:

- `ACC-20261106-0944` [snapshots.json](https://promptugal.news/board/snapshots.json) (`EVD.CAP snapshots`)
<!-- /library:generated -->

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
