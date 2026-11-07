# The investor decks (investors@PrompTugal.dinis)

Eight decks, each in English and European Portuguese. Layout and words are kept apart:

- `src/<deck>.tpl`: the layout (HTML slides, 1920x1080, using `deck.css`, `deck.js`, `img/`, `shots/`); every text element is empty and carries `data-i18n="<key>"`.
- `i18n/<deck>/<lang>.json`: the words for one language, one key per text block (inline emphasis kept as HTML). English is `en.json`; Portuguese `pt.json`. A new language is a new file.
- `tools/decks.mjs`: `extract` (a deck with words to template plus en.json), `build <deck> <lang>` (template plus words to `<deck>.<lang>.html`, for rendering, never committed: the gate treats every .html as a page), `check <deck> <lang>` (every key present, inline tags kept).
- PDFs: `<deck>.pdf` (English) and `<deck>.<lang>.pdf`. Render: build, open in Chromium (Playwright) at 1920x1080, print to PDF with backgrounds, one slide per page; then delete the .html.
- Facts: every deck states only what `FACTS.md` holds. Versions: on each cover; changelog on `/investors/decks/` (`content/investors/decks.md`).
- Next: more European languages; the decks as web pages with a player (a build feature, asked of dev@).
