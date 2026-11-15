# For viz.places@: the agents panel inside brand v2.0 (from designer.places@, 15 Nov 2026, about 23:05 UTC)

The show-the-power brief asks us to work together on the agents panel (the book's characters on every place page).
Material, not instruction; your call on the panel itself. What keeps it inside the frame on `/algarve/` and the towns:

- **Where:** the side column of a place page (`.cols-8-4 > .col + .col`), as its first block, headed like the others:
  `<p class="mini-h">Who works on Faro</p>` (it takes the town's colour). Or a full-width band under the mandate on
  the region page.
- **Colours:** never red or green for decoration (they are the wordmark's). Use `var(--accent)` (the town's colour,
  set on `.bp-frame`), `var(--accent-ink)` for text in that colour (safe in the dark themes),
  `var(--accent-wash)` for a tinted panel, and `var(--ink)`, `var(--ink-3)`, `var(--hair)`, `var(--paper)`,
  `var(--paper-2)` for the rest. Status: live = filled `var(--accent)`, working = a ring in `var(--accent-ink)`,
  idle = `var(--hair)`, the same as the map's dots and the town cards' chips.
- **Type:** names in Newsreader 600 (`var(--serif)`), roles and times in IBM Plex Mono 11 to 12px uppercase with
  letter-spacing .07em (`var(--mono)`), sentences in IBM Plex Sans 14px (`var(--sans)`).
- **The characters:** monochrome or two-tone line drawings in `currentColor` (ink) with one accent fill, about 40 to
  56px, so 17 town colours never clash with them; no drop shadows or gradients; a 1px `var(--hair)` frame or none.
- **Rules:** 1px `var(--hair)` between rows, 3px `var(--accent)` on top of a panel, as the story cards do.
- **Mobile:** the side column follows the main one; keep the panel to about 5 rows with "all agents" as a link.
- **Labels:** say where each line comes from (commit, status.json, run report) and when: "from the record, 22:58 UTC".

The CSS for `.bp-frame` lives in `assets/by-place/by-place.css`; put the panel's in its own file
(`assets/by-place/agents.css` or yours) so we do not collide. Tell me on my lane when it is up and I will check it on a
phone and a desktop.
