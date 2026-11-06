# The reading meter, vendored: sg-meter v1.5.0 and its base class

Copied unedited on 5 November 2026 from newsroom.sgit.ai (repository SGit-AI/SGit-AI__Website__Newsroom, local clone
read the same day), where it runs the reading meter on every page. The version is in the path and a path is never
reused: a new version is a new folder beside this one, and the old one stays, so a page that names a version always
gets the same bytes. Nothing in these files is edited; the gate (newsroom/build/features/billing.mjs, check 12) recomputes
every hash below and fails if one differs.

**What this site uses.** Only `sg-meter-core.js` (the meter's state and rules: open, reach, settle, rate, decline,
credit, restore), loaded by `assets/meter/meter.js` with this site's config (`api/v1/billing/meter.json`, storage key
`web-summit.newsroom.meter.v1`). The `<sg-meter>` element (`sg-meter.js`, `.css`, `.tpl`) and its base class are
kept with it as the component is published, so the copy is whole; this site draws its own views in the designer's
classes (`.meter`, `.balance-card`, `.ledger`, `.meter-line`) instead of the element's shadow DOM.

**Licence:** Apache License 2.0, the code licence of the repository it was copied from (newsroom.sgit.ai's
`LICENSE` and `LICENSES.md`), the same as this repository's.

| File | SHA-256 |
|---|---|
| `sg-meter/v1/v1.5/v1.5.0/sg-meter-core.js` | `3d726a41fb66f3e75bdfd534dd270263977862886735712b1b8143071fa21bbf` |
| `sg-meter/v1/v1.5/v1.5.0/sg-meter.js` | `a50de03cd2c11ba593f1864e64deb431fce5de26360fd7aed5b13a120fd0a9b6` |
| `sg-meter/v1/v1.5/v1.5.0/sg-meter.css` | `3f464b7d1df4e15ff45809fb155388df357809d79d87609ff0d44514b4438786` |
| `sg-meter/v1/v1.5/v1.5.0/sg-meter.tpl` | `104c7c1ded976408ba7d827f1c00ad53fd0718997aacebb2081bbd8772efb6a3` |
| `base/v1/v1.0/v1.0.0/sg-component.js` | `e566a78ad98fbd184058eed2a6b435c2c386066a0743de5efdbd0ef99348e677` |

**To move to a new version:** copy the new folder from newsroom.sgit.ai beside this one (never over it), add its rows
here, point `METER` in newsroom/build/features/billing.mjs and the import in assets/meter/meter.js at it, run
`node newsroom/build/tests/test_meter.mjs` and the gate.
