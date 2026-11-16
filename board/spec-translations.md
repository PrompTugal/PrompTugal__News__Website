# Translations: every page in the languages we support, never translating the same text twice

By conductor@PrompTugal.dinis, 16 November 2026, at Dinis's word in the conductor's session (`board/guidance/2026-11-16-translators-and-a-translation-memory.md`).

## What exists

The site's own words (menus, labels) are in 21 cultures (`assets/i18n/site.json`, dev@, 11 Nov); the content (the place pages, the articles, the home page) is English only, and the page says so ("Menus em tradução automática; os artigos estão em inglês").

## The design: a translation memory keyed by the text itself

1. **Segments.** The build cuts each translatable page into segments: a heading, a paragraph, a list item, a table cell, a place file's prose field (`voice.*`, `mandate`, `gravity`, each `ai_news[].title` and `summary`, `places.json` `copy`). Code, URLs, names in `data/i18n/glossary.json`, numbers and dates are not segments' text to translate (kept as placeholders).
2. **The key is the text.** Each segment's id is `sha256(normalised English text)`, first 16 hex. Same text anywhere on the site = one id = one translation.
3. **The memory:** `data/i18n/tm/<culture>/<first 2 hex>.json`, entries `{ id: { "t": translation, "by": agent, "model": ..., "at": date, "src": first 60 chars of the English, "ok": true|false } }`. Small JSON, sharded, in git (each file under the repository's size limit).
4. **The queue is derived, never hand-written:** the build lists, per culture, the segment ids on the site with no entry in the memory: `data/i18n/queue/<culture>.json` (generated; gitignored) and `api/v1/i18n/queue/<culture>.json`. A translator takes only from the queue: **nothing already translated is ever sent again.** A changed English text has a new id and joins the queue; the old entry stays until the gate's sweep drops ids no page uses for 30 days.
5. **The pages:** `/<culture>/<path>` (e.g. `/pt-PT/algarve/monchique/`), built from the English page with each segment replaced by its translation where the memory has it; a segment still missing stays in English, marked `lang="en"`. Each translated page links its English original and says it is a machine translation by named agents ("Traduzido por agentes de IA; o original em inglês"), with `hreflang` alternates for every culture that has the page. The globe pill opens the same page in the chosen culture when it exists.
6. **The glossary** (`data/i18n/glossary.json`): never translated (PrompTugal.news, RiskMandate, agent addresses, organisation names) and fixed choices per culture (place names: Lisbon/Lisboa/Lissabon, the Algarve/o Algarve).
7. **Quality:** a second pass by another translator sub-agent marks `ok: true` on a sample per culture; the gate refuses a translation that drops a placeholder, a number or a URL from its English.
8. **The API:** every JSON endpoint stays English; `api/v1/i18n/<culture>/index.json` lists which pages exist in that culture, and the memory itself is readable at `data/i18n/tm/` for the iOS app (the same ids, so the app translates its own text from the same memory).

## Order

1. pt-PT first (the Algarve's readers), then es-ES, fr-FR, de-DE, nl-NL (the Algarve's largest resident and visitor communities), then pt-BR and the rest of the 21.
2. Pages first: the home page, `/portugal/`, `/algarve/`, the 17 town pages, then the place articles, then the rest of the site.

## Who does what

- **dev.places@:** the segmenter, the ids, the memory's reader, the queue, the `/<culture>/` pages, `hreflang`, the globe pill's link, the gate checks (placeholders, numbers, URLs, file sizes). Its first deliverable: the queue for pt-PT over the by-place pages.
- **translator@PrompTugal.dinis** (a new session at Dinis's word, Sonnet): runs one translator sub-agent per culture inside its own run (not a session per language), each taking only its culture's queue, writing to `data/i18n/tm/<culture>/`; keeps the glossary with the place agents; reports counts per culture and per run. Until the queue exists, it starts the glossary and translates the by-place prose (places.json `copy`, each place file's `voice` and `mandate`) straight into the memory format above.
- **accountant@'s budget applies:** translators run as Claude sub-agents, not OpenRouter; no paid API unless Dinis says so.
