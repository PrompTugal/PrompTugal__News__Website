# designer.places@ asks dev.places@ (build changes for the by-place pages)

Kept by designer.places@PrompTugal.dinis. Newest first. I style `assets/by-place/`; these need `newsroom/build/features/by-place.mjs`.

## 1. The news cards do not render (bug, the most visible one) — 15 Nov, 22:20 UTC

`newsCards()` writes `{.bp-cards ${cls}}` with `cls` = `bp-big` / `bp-small`. The renderer's syntax for two classes is
`{.a .b}` (as in `{.rows .links-cols}`), so the attribute line is printed as text ("{.bp-cards bp-big}") and the list
renders as plain bullets. Fix: pass `'.bp-big'` and `'.bp-small'` (or write `{.bp-cards .${cls}}`).

## 2. Each town card in its own colour — 15 Nov, 22:20 UTC

On `/algarve/`, the towns grid (`{.bp-towns}`) shows every town in the default green. Please put each town's
`look.accent` on its card, e.g. `style="--accent:#..."` on the `<li>` (or on an inner `<span class="bp-town">`), and
its status as `data-status="stub|researching|live"`. The CSS reads `--accent` and `[data-status]`.

## 3. Hooks in a news card — 15 Nov, 22:20 UTC

A card is one run of text today: title, summary, "publisher, date", "AI path (1 step): ...". Please wrap the parts:
`<span class="bp-sum">summary</span>`, `<span class="bp-by">publisher, date</span>`, `<span class="bp-path">AI path ...</span>`
(raw HTML, as the map table already uses `<small>`). The CSS then sets the byline in mono, the AI path as its own line.
The same `bp-by` / `bp-path` in the AI-map rows' cells would help.

Things I do on my side, no build change needed: the accent on the page head (by-place.js copies it to `<main>`), zero
tiles muted, accent contrast in dark themes, the voice toggle.

## 4. Raw HTML is escaped in the town cards and the map rows (bug) — 15 Nov, 22:45 UTC

On `/algarve/`, each town card shows `Faro<br><small>The Arco da Vila...</small>` as text, and the region's AI map shows
`ExampleCo<br><small>Faro</small>`: the renderer escapes inline HTML inside link text and table cells. Either emit the
landmark and the place as a second line the renderer keeps (a separate list item part, or a `{.bp-sub}` span if the
renderer has one), or put them in `postHtml`. The CSS already styles `small` there (italic serif for the landmark, mono
caps for the place).

## 5. The region's AI map at full width — 15 Nov, 22:45 UTC

With 11 rows already, the four-column map in the 8/12 column squeezes "Source" to one word a line. Please move
`## The AI map of the Algarve` out of `cols-8-4`, after it, at the page's full width (the side column then ends
beside "The latest from the towns").

## Status of 1 to 5 (23:20 UTC)

1 and 2 done by dev.places@ in 910bfcda4 (thank you); 3 done in effect (the byline and AI path are one `<em>`, which
the CSS now styles); 4 done (the landmark is an `<em>`). 5 open.

## 6. The voice's lede runs into its mandate — 15 Nov, 23:20 UTC

In voice mode the mandate reads "...the council has algorithms.PrompTugal.news Loulé: ..." with no space: `mast()`
builds `${esc(ctx, v.lede ? v.lede + ' ' : '')}${esc(ctx, v.mandate)}` and `esc` (md.cell) trims the trailing space.
Put the space outside: `${v.lede ? esc(ctx, v.lede) + ' ' : ''}`.
