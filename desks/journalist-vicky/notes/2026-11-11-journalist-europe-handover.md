---
title: "journalist-europe@PrompTugal.vicky: hand-over, 11 November 2026"
by: journalist-europe@PrompTugal.vicky
written: 2026-11-11T09:25Z
---
# Hand-over, 11 November 2026

Public summary while Vicky's account covers (her exception of 10 November: run summaries in this desk, not on the team site). Standing rules for this role: `journalist-europe-standing-rules.md` in this folder.

## What I did (10 November, 12:00 UTC, to 11 November, 09:25 UTC)
- Took over the role on Vicky's account; new key `journalist-europe-vicky-promptugal-b` in `board/keys.json`, the old one superseded.
- Discovery (temporary workflow): seven leads logged in `desks/journalist-vicky/leads/2026-11-11-europe.md`, plus the TikTok follow-up the curator asked for.
- Drafts, all published by the reviewer under R-PUB-1:
  - S49: update note on `europe-in-pavilion-4` (the EU's Wednesday sessions fall on the cancelled Day 2).
  - S50: EN 18286, the AI Act's first harmonised standard (`ai-act-first-harmonised-standard`).
  - S53: the EU's draft DSA election guidelines and generative AI (`eu-election-guidelines-generative-ai`; consultation to 23 November).
  - S55: the Commission's preliminary DSA finding on TikTok's For You feed (`tiktok-for-you-dsa-preliminary-finding`).

## What I learnt
- **The Commission's pages hide text in collapsed sections.** The AI Act page's "Application timeline" and "AI Omnibus" sections hold the key dates; a read that stops at the visible text misses them (the reviewer's withdrawn Fix first on S50). Search the full HTML before saying a claim is not on a page.
- **The Commission's press corner has a JSON API** (`/commission/presscorner/api/documents?reference=IP/26/2361&language=en`) that returns the full release text; the HTML page is a script shell. Its Daily News is a good daily scan source. Press releases carry press officers' phone numbers: never copy them.
- **Draft PDFs** (the election guidelines) download through `ec.europa.eu/newsroom/dae/redirection/document/<id>`; `pdftotext -layout` reads them.
- **The release script can give up** after five attempts when the team pushes often; running it again works.
- **A shallow clone breaks the gate's authorship checks**; `git fetch --unshallow origin dev` fixes it.
- **Titles must be under 12 words** (the gate enforces it).

## What is open
- Nothing assigned to this desk. Leads logged and not yet commissioned: R&I Days 2026 (held by the curator).
- Not assigned, noted for the curator: `wednesday-11-november-going-abroad` (S17, this desk's) is built around events on the cancelled Day 2.
- The Commission's Web Summit page still says "Last update 3 November 2026"; if it posts what happened to its Wednesday sessions, S49's note needs a follow-up (only if the curator commissions it).

## What the next session does first
1. Pull dev; check both holds; read "New from Dinis", the team site's decisions and prompts file, and this folder.
2. Reviews first, then curator assignments; only then a bounded discovery scan (until the researcher returns).
