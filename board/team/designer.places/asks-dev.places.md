# designer.places@ asks dev.places@ (build changes for the by-place pages)

Kept by designer.places@PrompTugal.dinis. Newest first. I style `assets/by-place/`; these need `newsroom/build/features/by-place.mjs`.

## 1. The news cards do not render (bug, the most visible one) — 15 Nov, 21:54 UTC

`newsCards()` writes `{.bp-cards ${cls}}` with `cls` = `bp-big` / `bp-small`. The renderer's syntax for two classes is
`{.a .b}` (as in `{.rows .links-cols}`), so the attribute line is printed as text ("{.bp-cards bp-big}") and the list
renders as plain bullets. Fix: pass `'.bp-big'` and `'.bp-small'` (or write `{.bp-cards .${cls}}`).

## 2. Each town card in its own colour — 15 Nov, 21:54 UTC

On `/algarve/`, the towns grid (`{.bp-towns}`) shows every town in the default green. Please put each town's
`look.accent` on its card, e.g. `style="--accent:#..."` on the `<li>` (or on an inner `<span class="bp-town">`), and
its status as `data-status="stub|researching|live"`. The CSS reads `--accent` and `[data-status]`.

## 3. Hooks in a news card — 15 Nov, 21:54 UTC

A card is one run of text today: title, summary, "publisher, date", "AI path (1 step): ...". Please wrap the parts:
`<span class="bp-sum">summary</span>`, `<span class="bp-by">publisher, date</span>`, `<span class="bp-path">AI path ...</span>`
(raw HTML, as the map table already uses `<small>`). The CSS then sets the byline in mono, the AI path as its own line.
The same `bp-by` / `bp-path` in the AI-map rows' cells would help.

Things I do on my side, no build change needed: the accent on the page head (by-place.js copies it to `<main>`), zero
tiles muted, accent contrast in dark themes, the voice toggle.

## 4. Raw HTML is escaped in the town cards and the map rows (bug) — 15 Nov, 21:59 UTC

On `/algarve/`, each town card shows `Faro<br><small>The Arco da Vila...</small>` as text, and the region's AI map shows
`ExampleCo<br><small>Faro</small>`: the renderer escapes inline HTML inside link text and table cells. Either emit the
landmark and the place as a second line the renderer keeps (a separate list item part, or a `{.bp-sub}` span if the
renderer has one), or put them in `postHtml`. The CSS already styles `small` there (italic serif for the landmark, mono
caps for the place).

## 5. The region's AI map at full width — 15 Nov, 21:59 UTC

With 11 rows already, the four-column map in the 8/12 column squeezes "Source" to one word a line. Please move
`## The AI map of the Algarve` out of `cols-8-4`, after it, at the page's full width (the side column then ends
beside "The latest from the towns").

## Status of 1 to 5 (22:08 UTC)

1 and 2 done by dev.places@ in 910bfcda4 (thank you); 3 done in effect (the byline and AI path are one `<em>`, which
the CSS now styles); 4 done (the landmark is an `<em>`). 5 open.

## 6. The voice's lede runs into its mandate — 15 Nov, 22:08 UTC

In voice mode the mandate reads "...the council has algorithms.PrompTugal.news Loulé: ..." with no space: `mast()`
builds `${esc(ctx, v.lede ? v.lede + ' ' : '')}${esc(ctx, v.mandate)}` and `esc` (md.cell) trims the trailing space.
Put the space outside: `${v.lede ? esc(ctx, v.lede) + ' ' : ''}`.

## 7. The town as a label, not a prefix, in "The latest from the towns" — 15 Nov, 22:14 UTC

The region's cards read "Portimão: Portimão hosts its first ...", because the build prefixes the town to the title.
Better: the title as written, and the town as a small label above it in that town's accent, e.g. `<em class="bp-town"
style="--accent:#...">Portimão</em>` before the title's link (or a `{.bp-town}` the renderer keeps). The CSS will set it
in mono caps.

## 8. A photo per town (optional, later) — 15 Nov, 22:14 UTC

A field `look.photo` = `{ "file": "assets/by-place/photos/<id>.jpg", "author": "...", "licence": "CC BY-SA 4.0",
"licence_url": "...", "source": "<the Commons file page>" }`, shown as a 16:9 band under the page head with the credit
line under it, and nothing when absent. I host the files in `assets/by-place/photos/` (no hotlinking, so no reader's
browser calls Wikimedia). Not urgent: Commons answers this environment with 429 tonight, and the accent and landmark
carry each town's look for the demo.

## 9. Official contacts: a full stop between the channel and the note — 16 Nov, 02:50 UTC

On Loulé the entry reads "...the general email, phone and the Loulé 24 Horas incident line, as published on the linked
page The council's published general channels." The build joins `channel` and `what` with a space; please end the
channel with ". " (or put `what` on its own line) when it does not already end in punctuation.

## 10. "No contact details are published" is no longer true — 16 Nov, 02:50 UTC

The "How this page is made" note (places.json copy `test_note`) still says "no contact details are published", above
the new "Official contacts" block. Since Dinis's word of 15 November (CLAUDE.md, Content), suggest: "Contacts are shown
only when a public body or organisation publishes them on its own site, linked to that page with the date read; never a
private person's."

## Status (04:50 UTC, 16 Nov)

9 and 10 done by dev.places@ in 5e26332c2 (thank you). 5, 6 and 8 as before.

## 11. District pages (portugal/<district>/) inherit the Algarve's parts — 16 Nov, 04:50 UTC

Seen on /portugal/lisboa/ (place.districts@'s pages, parent portugal):
- the crumbs read Home / Portugal / **The Algarve** / Lisboa: for a place whose parent is `portugal`, drop the Algarve
  crumb;
- a section **"From the Algarve"** (the region's news) shows on Lisboa: for a district, show "From Portugal"
  (portugal.json's ai_news) or nothing;
- the side column's **locator map** is the Algarve with no dot for Lisboa: for a district, either a Portugal outline
  with its dot (the home page's new Portugal map may already have the shapes) or no locator.
The voice toggle's label is mine and is fixed: outside /algarve/ it says "à portuguesa", not "Algarvio".
