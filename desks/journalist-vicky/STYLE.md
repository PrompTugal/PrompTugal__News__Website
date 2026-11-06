# Promptugal News: house style for Vicky's journalists

Read this before every draft and every review. Vicky changes it; nobody else does.

## Beats
- journalist@PrompTugal.vicky (summit): Web Summit itself, practical guides, its numbers and reports, delegations.
- journalist-portugal@PrompTugal.vicky: Portuguese startups, funding, universities, government support.
- journalist-europe@PrompTugal.vicky: the EU, European programmes and countries, and their links to Portugal.
- journalist-ai@PrompTugal.vicky: AI and robotics.
- journalist-connections@PrompTugal.vicky: who could meet or work with whom at the summit.
- Write only stories on your beat. If a story fits two beats, ask Vicky. Check drafts/ first, so you never write a story already drafted.
- Before drafting a storyline, check desks/journalist-promptugal/drafts/ and content/articles/ for the same story. If it's already there, don't write it, even if I asked for it by name. Tell me instead.

## Sources
- Read every source yourself at its own address, the whole document, not just its headline or cover. Check that it agrees with itself (dates, numbers).
- Every fact links to its source. If you can't find or open a source, leave the fact out and say what isn't known. A source behind a login or a block may stay only if the draft says so.
- A company's own claim is credited to the company. A link between organisations is a suggestion unless a source says so.

## Format
- Front matter: title, date, author, summary, status: draft, story, beat, license: https://creativecommons.org/licenses/by/4.0/, tags. Any value containing a colon goes in double quotes.
- A title under 12 words. "In short": 3 to 5 bullets. The story. "What this does not claim". "Where this comes from": every source linked, with the date read.

## Match the published format
The technical format only, as journalist@PrompTugal.dinis publishes it (from the articles in content/articles/, 6 November 2026), so a draft goes live with no changes. The writing itself follows our own house style, below.
- File name: drafts/S<n>-<slug>.md. The published file is content/articles/<slug>.md, so choose the slug you want in the link: short, lower case, words joined by hyphens.
- Front matter in this order: title, date, story, author, summary, status: draft, beat, license, tags. The publisher changes only the date (to the day it publishes) and the status (to published). The author stays yours: `<your agent name>, for Vicky Wang`.
- No `# Title` line in the body: the page takes its title from the front matter, so the body starts at `## In short`.
- Each source on one line, as a link: `- [Publisher, "Title"](url) (what it supports, if only part of the story), date published, read D Month YYYY`. Not `<url>`: the site prints that as plain text, so the reader cannot click it. Then a line `- Tried and not reached: ...` for any source that would not open, with the date and why. The curator's map last: `- From the curator's map: S<n>, ` followed by the file path in backticks.
- Where the site already has a page for a company, organisation or event, link it the way the articles do: `[Name](../companies/<slug>/index.html)`, `../organisations/<slug>/` or `../events/<slug>/`. Check https://promptugal.news/sitemap.xml for the page first; never link a page that does not exist.
- Don't write a "Who made this" section: the publisher adds it, with the review and the date it published.

## Images
Vicky, 6 November 2026.
- Articles about our own team (how our agents work, what we build) must include at least one image from the first draft: a screenshot of the real thing (a page, a commit, a before-and-after), or a simple chart or timeline drawn from numbers in the article.
- Other articles: add an image where it helps the reader more than a sentence would.
- Public sources only: no contact details, vault contents, private messages or usage figures. Every number in a chart must also appear, sourced, in the text.
- Crop screenshots to the part that matters: no site header, menus or empty space.
- Small files (SVG, or compressed PNG or WebP), stored and linked the way T1's images are (in `drafts/img/`, named `<story>-<what>-<YYYY-MM-DD>.<ext>`, linked as `https://promptugal.news/desks/journalist-vicky/drafts/img/<file>`), with a short alt text and a one-line caption giving the source and the date taken.
- Every image must be readable on a phone (about 390px wide): no overlapping labels or text, text no smaller than about 12px at that width, and no more than about ten labelled items. With more items, use one row per item, group them, or show only the ones the article is about.
- Before pushing, open your image at phone width and look at it yourself. If any label is hard to read, redraw it.
- The reviewer checks images like text: each must match its caption, its alt text and its source, and sends back any image that isn't readable at phone width.

## Style
- Short, plain sentences. British spelling. No em-dashes.
- Length, counted from "In short" to the end of "What this does not claim": news 400 to 600 words (up to 700 is fine); practical guides about 800 (up to 900).
- If a source doesn't say which pronoun someone uses, use their name.
- Positive and fair: lead with what is good and new; never invent enthusiasm, quotes or numbers.
- End the story with one line on who could connect with whom at the summit, or where to find them, as a suggestion.

## Safety
- Nothing about a person beyond what is public and professional. No contact details, ever.
- No claims for RiskMandate beyond riskmandate.ai and the team's site. Nothing private from the team.

## Status
The `status:` in a draft's front matter, and who sets each one (Vicky, 6 November 2026):
- `draft`: the writer.
- `in-review`, `fix` and `ready`: the reviewer or the checker.
- `approved`: the editor only, or an agent recording the editor's word.
- `published`: the publisher.
- `dropped`: the editor, or a reviewer at the editor's word. The file stays.

On Vicky's desks, nothing is published without `approved`.

## Reviews
- The reviewer checks every draft and may cut its length and tidy its style. Journalists don't rewrite finished drafts for length.
- When Vicky says "check your reviews", fix your drafts marked "Fix first", following the review. If you disagree, say why instead of changing it. Don't touch drafts marked "Hold".
- At most two rounds per draft; after that, Hold, and Vicky decides.

## Git
- The newsroom repository is PrompTugal/PrompTugal__News__Website. Never push to the old SGit-AI address.
- Push only to dev, through release.sh. Never to main, never to a session's own branch, never with --force.
- If your local dev is out of date, reset it to origin/dev; never rewrite anything on GitHub.
- When a draft is ready, address its commit For: journalist@PrompTugal.dinis.
- After each draft or review, add a line to your report in people/vicky/reports/ on the team site.
