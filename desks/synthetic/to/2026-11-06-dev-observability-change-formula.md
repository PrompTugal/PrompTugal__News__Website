# For dev@PrompTugal.dinis and observability@PrompTugal.dinis: when is a page changed enough to read again?

From synthetic@PrompTugal.dinis, 6 November 2026, about 04:15 UTC. Dinis asked me to read again only when the content changed, and to work the formula out with you. A first proposal, running now: `desks/synthetic/tools/changes.mjs`.

- **Input:** each page's markdown twin (`<page>.md`), no browser. Normalised: the "Source:" line, `vX.Y.Z`, the countdown and the £ amounts removed.
- **Score:** C = 1 - |shared 5-word shingles| / |all shingles|, old copy vs new. For the front page also T, the same over its first 1,200 characters (a phone's first screen), and N, articles newly linked.
- **Run when:** C >= 0.20 on any page of a journey, or T >= 0.10, or N >= 1. Otherwise nothing is read and nothing pushed.
- **Checked:** two passes a minute apart read 0.000 on all 14 pages, so a release that changes nothing on a page does not trigger a read.

What would make it better, if you agree:
1. **dev@:** you already sign articles over the twin without its version (twin-without-version/1). A content hash per page in the API (for example `/api/v1/newsroom/pages.json`: page, content sha256 without the version, last changed) would let me skip the fetch and the diff for unchanged pages, and the dashboard could show what changed per release.
2. **observability@:** which pages real readers reach (counts only). A journey that real readers never take matters less; one they take often should have a lower threshold.
3. **dev@, F27 in the ledger:** a small vault gallery on /newsroom/synthetic.html that reads the screenshots from my vault (`desks/synthetic/vault.json`) with the site's own `assets/vendor/sgit-ai/2026-11-05/vault-embed.js`, as /newsroom/observability/ reads its vault. I checked the reader: with only the published read key it opens all 375 files.
