# Reality: what exists (site v0.1.6)

A thing that is not in this file does not exist, whatever a brief says. Kept current by whoever ships; CI updates the version above on every release.

## Exists (5 November 2026)

- The repository SGit-AI/SGit-AI__Website__Newsroom__Web-Summit, branch `dev`, served at https://web-summit.newsroom.sgit.ai (CNAME in the repository; DNS pointed at GitHub Pages). `main` holds only the initial commit and is not protected.
- The build (`admin/build/build.mjs`, no dependencies) and the gate (`admin/build/validate.js`, 10 checks, prints OK), with the key-leak shapes in `admin/build/secrets.cjs` (copied from the team's site). Check 7 (no contact details) covers `content/`, `data/` and `desks/` (since 5 November: `desks/` is served as is). Check 8 refuses an article title of 12 words or more.
- CI: `.github/workflows/deploy-pages.yml` runs the gate on every push and pull request; on a push to `dev`, `admin/build/tag_release.sh` numbers, commits, tags and deploys the release. `admin/tools/release.sh` is the release script for agents.
- The look (v0.1.6, Indi's patch, WS-141): a publication after pt.newsroom.sgit.ai, paper and ink with a dark mode, Newsreader and IBM Plex Mono self-hosted in `assets/fonts/` (SIL OFL, copied from SGit-AI/SGit-AI__Website__Newsroom__PT), a masthead, a dateline with a countdown, navigation Latest, Companies, The summit, About.
- Pages: the front page (the agenda from the build's day to 12 November, at most six highlights a day; the latest articles; the companies), the summit (`/summit/`), the full agenda (`/summit/agenda.html`, every item with its source), the companies index and a profile per company (`/companies/<id>/`), the articles index and one article, about, the participant disclosure, the brief pack (`/brief/`, ten pages), the release history, a 404. Each with a markdown twin, a version at the top and an agent block at the end; `llms.txt`, `sitemap.xml`, `robots.txt`.
- The agenda: `desks/programme/agenda.json` (210 items, 5 to 12 November, read 4 November by programme@web-summit.vicky), rendered by the build at every release. "Today" is the build's day, so the front page moves on only when something is released.
- The companies: `data/companies.json` (109 companies), made by `admin/tools/companies.py` from the team's `data/companies.json` (read 1 November by the team's curator): public fields only, the team's notes left out, and this newsroom's re-check of each company's summit page and website on 5 November.
- Articles: `content/articles/newsroom-status-four-days-out.md` (5 November), signed with the newsroom's session key (`articles/newsroom-status-four-days-out.md.sig`).
- The newsroom's session key: made 5 November 2026 (`pki-agent.mjs keygen --session`), record sha256:2cbb6cfafdcbbce7, encryption sha256:aea91e7f8f429363, linked locally to the operator's key sha256:db7f79fdd87e030a; the public half is the entry `newsroom-dinis` in the team site's `data/keys.json` (team site v0.2.429). It dies with the session; the next session makes a new one.
- The desks (brief 4): Vicky's researcher (into the research vault, in pack mode, four runs a day), curator (`desks/curator/`, two maps, nine story candidates) and programme desk (`desks/programme/`, and the interview shortlist in its confidential vault, never in this repository). Their reports are on the team's site, `people/vicky/reports/`.
- `CLAUDE.md`, `BRIEF.md` (the brief in full), `BRIEF-CORRECTIONS.md`.

## Not yet

- The writing desks (journalist, fact-checker, editor), which brief 4 proposes for Indi: they wait on Indi's write access to this repository (WS-145, only Dinis can give it) and on Dinis's decision on who owns which desks (brief 9, decision 3). No full run, research to front page, has happened yet.
- Articles two and three (brief 9, step 6).
- The Portugal banner (step 7), the reader meter and the traffic counts (step 8), the interview page and its approval lane (step 9), summit mode (step 10).
- The company profiles' "what is new" and "what they will show": no research capture names any of the companies yet.
- The key's confirmation on pki.sgit.ai (submitted by the agent, confirmed by Dinis).
- From the estate's standard: `review/`, the Agent Contact file, a row on nfrs.sgit.ai, branch protection on `main`.
