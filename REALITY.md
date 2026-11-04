# Reality: what exists (site v0.1.1)

A thing that is not in this file does not exist, whatever a brief says. Kept current by whoever ships; CI updates the version above on every release.

## Exists (4 November 2026)

- The repository SGit-AI/SGit-AI__Website__Newsroom__Web-Summit, branch `dev`, served at https://web-summit.newsroom.sgit.ai (CNAME in the repository; DNS already pointed at GitHub Pages).
- The build (`admin/build/build.mjs`, no dependencies) and the gate (`admin/build/validate.js`, 10 checks, prints OK), with the key-leak shapes in `admin/build/secrets.cjs` (copied from the team's site).
- Pages: the home page, about (who runs it, how it is made, the agent's reach, mandate and gap), the participant disclosure, the articles index (no article yet), the release history, a 404. Each with a markdown twin, a version badge at the top and an agent block at the end; `llms.txt`, `sitemap.xml`, `robots.txt`.
- CI: `.github/workflows/deploy-pages.yml` runs the gate on every push and pull request; on a push to `dev`, `admin/build/tag_release.sh` numbers, commits, tags and deploys the release. `admin/tools/release.sh` is the release script for agents. Both copied from the team's site.
- `CLAUDE.md`, `BRIEF.md` (the brief in full), `BRIEF-CORRECTIONS.md`.

## Not yet

- A page per company (MVP step 2): not started.
- Articles (MVP step 3): none. Signing needs the agent's session key, which does not exist yet (see BRIEF-CORRECTIONS.md, 4 November).
- The agent's key on the team site's `data/keys.json`: not made, not published.
- From the estate's standard: `review/`, the Agent Contact file, a row on nfrs.sgit.ai, branch protection on `main`.
