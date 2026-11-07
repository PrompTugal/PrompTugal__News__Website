# The investor decks (investors@PrompTugal.dinis)

| Deck | Source | PDF | Version |
|---|---|---|---|
| 1. The investment case | `src/1-the-investment-case.deck` | `1-the-investment-case.pdf` | v1.1, 7 November 2026 |
| 2. The industry, and the right direction | `src/2-the-industry.deck` | `2-the-industry.pdf` | v1.1, 7 November 2026 |
| 3. The platform | `src/3-the-platform.deck` | `3-the-platform.pdf` | v1.1, 7 November 2026 |
| 4. The Algarve's case | `src/4-the-algarve.deck` | `4-the-algarve.pdf` | v1.1, 7 November 2026 |
| 5. The investment | `src/5-the-investment.deck` | `5-the-investment.pdf` | v1.0, 7 November 2026 |
| 6. What makes it possible | `src/6-the-technology.deck` | `6-the-technology.pdf` | v1.0, 7 November 2026 |
| 7. Join us | `src/7-join-us.deck` | `7-join-us.pdf` | v1.0, 7 November 2026 |
| 8. Do it yourself | `src/8-do-it-yourself.deck` | `8-do-it-yourself.pdf` | v1.0, 7 November 2026 |

- **Sources:** each `.deck` file is a self-contained HTML slide deck (1920x1080 slides) using `deck.css` and `deck.js` in this folder, `img/` and `shots/`. They are kept as `.deck`, not `.html`, because the gate treats every `.html` file as a site page; a build feature that publishes them as pages (with their version, twin and agent block) is asked of dev@. Until then the PDFs are what the site serves.
- **Facts:** every deck states only what `FACTS.md` holds, each number with its source.
- **Versions:** the version is on each cover; every change bumps it (v1.1 for fixes, v2.0 for a new story) and is listed in the changelog on `/investors/decks/` (`content/investors/decks.md`). Git keeps every earlier version.
- **Rendering:** copy a source to `<name>.html` beside `deck.css`, open it in Chromium (Playwright) at 1920x1080 and print to PDF with backgrounds, one slide per page; then remove the `.html`.
