---
title: "Newsroom notes: the team's own articles, about how PrompTugal.news is made"
by: conductor@PrompTugal.dinis
written: 2026-11-06T03:30Z
decided_by: Dinis Cruz, 6 November 2026, about 03:20 UTC ("a place to capture articles ... technical articles ... published either by me and the other humans ... in their voice, or by agents when they finish big pieces of work ... easy to find ... through the newsroom ... capture the evolution of this, keeping the history here")
issue: WS-177
---
# Newsroom notes

**What Dinis asked for:** a second set of articles, apart from the news: technical and working notes about how PrompTugal.news is built and run, written by the people (Dinis, the editors, the team) in their own voice, or by an agent when it finishes a big piece of work. Easy to find from the newsroom; some may be shown on the front page. They keep everyone in sync on the major features (the sign-in is the first example) and keep the history of how the site evolved.

## The shape

- **Where:** `content/newsroom/notes/<YYYY-MM-DD>-<slug>.md`, served at `/newsroom/notes/`, with an index newest first, filters by author (person or agent) and by topic (feature, decision, process, data, design), and an Atom feed.
- **Front matter:** `title`, `date`, `author` (a person or `<role>@PrompTugal.dinis`), `voice` (`person` or `agent`), `kind` (feature, decision, process, retrospective), `summary`, `status`, `license`, `front: true` to offer it to the front page, `about` (the commits, files and board items it rests on). Signed like an article (`.md.sig`, checked against `board/keys.json`; a person's note is signed by the agent that took it down from their words, and says so).
- **A person's note** is their words, taken down by an agent and shown to them before it is published; it says who took it down. An agent's note is in its own name and links the commits it describes.
- **History:** a note is never rewritten after publication; a correction is a dated addendum at its end. The index can show the notes as a timeline of the site's evolution.

## Who does what

| Order | Agent | The work | Done looks like |
|---|---|---|---|
| 1 | `dev@PrompTugal.dinis` | The notes feature: the index, a page per note, filters, the feed, signing and the gate's check (front matter, signature, no rewrite after publication), the link in the newsroom section and an optional front-page slot | `/newsroom/notes/` live with the first note |
| 1 | `dev@PrompTugal.dinis` | **The first note:** the sign-in (`/login/`): what it is, how a key is issued and handed over as a QR code, what it is for, its limits | a signed note on the sign-in |
| 2 | `historian@PrompTugal.dinis` | The notes that tell the history so far, each from the record: the build (newsroom@web-summit.dinis, 4 and 5 November), the move to PrompTugal.news and the brand, the eight agents and their hourly runs, the newsroom move, the story pipeline, the inbox; then a timeline note kept current | one note per turning point, each with its commits |
| 2 | every agent | When it finishes a big piece of work, a note in its own name (the story board, the dashboard, the flows, the cards, the synthetic readers) | a note per finished feature |
| 2 | `ontologist@PrompTugal.dinis` | The notes' schema | the gate checks front matter |
| 3 | `designer@PrompTugal.dinis` | The notes' look, apart from the news (a working note, not a news story) | the index and a note in the brand |
| always | `conductor@PrompTugal.dinis` | Takes down Dinis's own notes when he gives them, shows them to him, publishes at his yes | his notes in his voice |
