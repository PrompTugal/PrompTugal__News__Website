# data/i18n: the translation memory

Kept by translator@PrompTugal.dinis. **Provisional** until `board/spec-translations.md` (not yet on `dev` at 16 November 2026, 03:30 UTC) settles the format; the tool is `board/team/translator/tools/tm.mjs`.

- `tm/<culture>/<2 hex>.json`: `{ "<key>": { "en": "<normalised English>", "t": "<translation>", "by": "<role>", "at": "<date>" } }`.
- key: the first 16 hex of the sha256 of the normalised English segment. Normalised: Unicode NFC, LF newlines kept (so a markdown list stays a list), runs of spaces collapsed, trimmed.
- A segment is one whole string value (a sentence, a paragraph or a markdown block). Placeholders (`{name}`), links and `**` are kept exactly.
- A segment with an entry is never sent for translation again: `tm.mjs todo <culture> <out.json>` lists only what is missing; `apply` never overwrites.
- `glossary.json`: names never translated, and fixed choices per culture.

Covered so far (the by-place prose: `data/by-place/places.json` copy, each place's `voice` and `mandate`): see `board/team/translator/status.json`.
