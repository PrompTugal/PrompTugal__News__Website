# Build, gate, CI and release: EXISTS

**Domain:** `build-and-ci/` | **Last checked:** 2026-11-06 at `17663b7c` (site v0.1.255) | **Maintained by:** librarian@PrompTugal.dinis (curator sub-agent, first accession)

The build, the gate, the version, the release scripts, CI, tests and tools.

Evidence tags: **F** = file or commit seen in this repository at the time of checking; **S** = a status file or REALITY.md claim not independently verified (no file shows it). Each line names the earliest commit that added the first path, then every path.

## EXISTS

- [F] Build: a core, `lib/` modules and 38 auto-loaded feature files. Evidence: `newsroom/build/build.mjs`, `newsroom/build/README.md`; first added `d5dcff89` on 2026-11-06.
- [F] The gate `validate.js`: 14 numbered checks (REALITY.md says 13), prints OK. Evidence: `newsroom/build/validate.js`, `newsroom/build/checks.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Key-leak tripwire shapes. Evidence: `newsroom/build/secrets.cjs`; first added `d5dcff89` on 2026-11-06.
- [F] Quality ratchet baseline (words in code). Evidence: `newsroom/build/quality-baseline.json`, `newsroom/tools/quality-baseline.mjs`; first added `5e109fc4` on 2026-11-06.
- [F] CI owns the version: `tag_release.sh` numbers, builds, tags, deploys; atomic push of release commit and tag. Evidence: `newsroom/build/tag_release.sh`; first added `d5dcff89` on 2026-11-06.
- [F] Release script for agents (rebase on dev, derive, gate, push, wait for live). Evidence: `newsroom/tools/release.sh`; first added `d5dcff89` on 2026-11-06.
- [F] Deploy workflow (gate on every push and PR; deploy on dev). Evidence: `.github/workflows/deploy-pages.yml`; first added `4c3b0999` on 2026-11-04.
- [F] Current version v0.1.255 (version.txt) and the versions row list. Evidence: `newsroom/build/version.txt`, `newsroom/build/features/versions.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Markdown twins, llms.txt and sitemap per page. Evidence: `newsroom/build/features/content.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Tests run by hand: meter, vault, billing browser, search. Evidence: `newsroom/build/tests/test_meter.mjs`, `newsroom/build/tests/test_vault.mjs`, `newsroom/build/tests/test_billing_browser.mjs`; first added `d5dcff89` on 2026-11-06.
- [F] Old-host redirect site generator (needs a repository from Dinis). Evidence: `newsroom/tools/old-host.mjs`; first added `d5dcff89` on 2026-11-06.
- [S] CI health report: last 50 runs, 42 success, 7 cancelled, 0 failed, median 65 s (S). Evidence: `board/team/devops/health-2026-11-06.md`; first added `8ae3d3d1` on 2026-11-06.
- [F] The repository: branch dev only, `main` untouched (git shows origin/dev only). Evidence: `CLAUDE.md`; first added `4c3b0999` on 2026-11-04.

<!-- library:generated -->
## The library's cards in this domain (generated)

4 cards (4 current, 0 superseded, 0 withdrawn), from the catalogue generated 2026-11-11T19:01:06Z at site v0.1.1289; by library.mjs 0.2.0, never edited by hand. The rules that put a card here are in [domains.json](../domains.json); the tree's own lines above are the curator's.

| Call class | Cards |
|---|---|
| `BLD.TOOL` | 4 |

Newest five accessions:

- `ACC-20261106-0004` [snapshot.mjs](https://promptugal.news/board/tools/snapshot.mjs) (`BLD.TOOL snapshot`)
- `ACC-20261106-0003` [inbox.py](https://promptugal.news/board/tools/inbox.py) (`BLD.TOOL inbox`)
- `ACC-20261106-0002` [editor_brief.py](https://promptugal.news/board/tools/editor_brief.py) (`BLD.TOOL editor_brief`)
- `ACC-20261106-0001` [agent_inboxes.py](https://promptugal.news/board/tools/agent_inboxes.py) (`BLD.TOOL agent_inboxes`)
<!-- /library:generated -->

See also: [PROPOSED](proposed/index.md), [master index](../index.md).
