---
pass: 2026-11-06-reader-feedback-and-reading
goal: "Every page asks for and receives the reader's feedback (thumbs, more like this, a correction, a word to the editor, a comment), sealed to an append lane that an agent reads at every wake; every page shows and measures how much is read, with newsroom.sgit.ai's reading modes, its left-hand map and collapsible sections (board/guidance/2026-11-06-feedback-reading-and-vicky.md)"
owner: conductor@PrompTugal.dinis
agents: [security, observability, dev, dev.pages, designer, sherpa, synthetic, journalist]
budget: "16 runs, 48 API-equivalent USD, 400k output tokens: the plan's 9 steps, open, two security reviews, the note and the close, plus two (accountant@, board/budgets.json, 6 November 12:55 UTC); measured, never blocking (Dinis, 10:10)"
state: open
priority: "next after algarve-evolution (Dinis asked for it at 12:00)"
opened: 2026-11-06T12:05Z
---
# Pass: reader feedback and reading

## What exists today (read 12:05 UTC)

- **Reading is already counted:** `assets/obs/obs.js` (observability@) sends a `view` and a `read` per page (seconds visible, deepest scroll in percent), sealed to the drain key and written to the `site` append lane of the private vault; counts only on `/newsroom/observability/`. No IP, no cookie; Do Not Track and the footer's Pause stop it.
- **No feedback lane:** nothing on a page lets a reader say anything back.
- **No reading modes:** no progress bar, no "minutes left", no left-hand map of sections, no collapsible sections, no show/hide modes.

## The work, in order

| Order | Agent | Work | Done looks like |
|---|---|---|---|
| 1 | security@ | Pre-review: what a feedback box may receive (free text from strangers: spam, abuse, a contact detail someone types), how it is kept (sealed, never published as is), how much per tab | a go with conditions |
| 2 | observability@ | A `feedback` lane in `assets/obs/obs.json` beside `site` (same vault model: public append token, write-only, sealed to the drain key); the drain splits feedback from reads; counts per page (thumbs, more-like-this) on `/newsroom/observability/`; the reading depth per page (median scroll, median seconds, share who reach the end) on the same report | the lane configured, the drain reading it, the report showing both |
| 2 | dev@ (with dev.pages@) | On every page, at the end and as a small fixed control: **thumbs up and down**, a big **"more like this"**, **"suggest a correction"**, **"talk to the editor"**, and a short **comment** box; each a sealed event to the feedback lane (page, version, kind, text up to a limit, the tab's random id; nothing else). Says plainly: "comments are read by the editors and not published, for now" | live on every page, the gate checking each page carries it |
| 3 | dev@ (with dev.pages@) | **newsroom.sgit.ai's reading modes**, studied on that site and copied in shape: the reading progress, how much read and how much left (minutes), the map of sections on the left, every section collapsible, the modes to show or hide content (the "more modes" view); the progress feeds the `read` event's depth | an article and a company page with all of it, on a phone and a desktop |
| 3 | designer@ | The feedback controls and the reading modes in the brand; "more like this" big, as Dinis asked | screenshots, a decision page if there are options |
| 4 | sherpa@ | **Reads the feedback lane at every wake** (from the drain observability@ publishes to it): triages each item to its owner (a correction to journalist@, a page problem to designer@ or dev@, a data error to ontologist@), replies nothing outside; a weekly line of what readers said in `/newsroom/` | every item routed within the hour it arrives |
| 4 | journalist@ | Corrections from readers handled as the publication's corrections: checked at the source, fixed, noted at the foot of the article | the first correction published with its note |
| 5 | synthetic@ | Personas use the feedback box and the reading modes and say what they would do | findings to the owners |
| later | Dinis | Whether comments are ever published, or a social layer added (Dinis: "we need to start thinking if we're actually going to get to the point where we could actually publish the comments") | a decision page when the team has a proposal |

## Who reads the lane

observability@ drains it (it holds the drain key and already drains the reads hourly); **sherpa@**, the reader's voice, reads and routes every item at its wake. The conductor checks hourly that the lane is drained and items are routed.

| Time (UTC) | Agent | Step | Verdict | Commit |
|---|---|---|---|---|
| 12:05 | conductor@ | opened at Dinis's word | | (this file) |
| 12:55 | accountant@ | budget set: 16 runs, 48 API-equivalent USD, 400k output tokens; a measure, never a stop | go | (budget commit) |
