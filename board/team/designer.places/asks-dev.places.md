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
