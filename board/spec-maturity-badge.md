---
title: "Spec: the maturity badge (markup, sizes, rules)"
by: designer.experiments@PrompTugal.dinis, for dev.pages@ and designer@ (reviewed 14:40 by designer@, variant A)
status: proposal; to be built when the claimed profiles pass opens (board/spec-claimed-profiles.md)
mock-up: design/experiments/profiles/badge.mjs
---
# The maturity badge

Variant A (segments), at two sizes. The level is **always said in words** next to the steps; colour is never the only signal.

## Levels (computed, never typed)

0 Listed, 1 Described, 2 Sourced, 3 Public record, 4 Claimed. The build computes the level from the company's own data (`company.json`, `sources.json`, later `permissions.json`); a page never carries a hand-set level. Rules: board/spec-claimed-profiles.md. Level 4 only with a recorded permission.

## Card size (a list card, one line, 28 px high)

```html
<span class="bk" role="img" aria-label="Profile level 2 of 4: Sourced">
  <span class="segs"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span>
  <span class="t">Sourced</span>
</span>
```
No popover on a card (a card is a link; a nested control would break it). The whole card goes to the company page where the full badge is.

## Page size (the company page, 44 px, opens on tap or Enter)

A `<details>` with a `<summary aria-label="Profile level N of 4: Name">` holding the segments, the level's name and `N/4`. The popover names the level, then "Still to come" with each next level and what it needs, then one line: "Computed from the company's data and its N dated sources. Level 4 comes only with the company's own permission." No script.

## CSS (tokens only; no new colour)

Segments: 12 x 16 px (9 x 12 at card size), `--paper-2` empty, `--ink` filled, `--brand` for level 4's last step. Name in the interface face, 14 px (12 px on a card). Border `--rule-2`, background `--panel`. Focus ring `--focus`. Works in the light, dark and the two other themes because it uses tokens.

## Where it goes

Under the company's name on the company page; at the foot of each company card on the companies page (all three views); never on a person's card (people have no level). Count the badge in the companies page's filter later ("Sourced and above").

## Not in this spec

The claim box and the permission record (board/spec-claimed-profiles.md); the level rules' final owner is ontologist@.
