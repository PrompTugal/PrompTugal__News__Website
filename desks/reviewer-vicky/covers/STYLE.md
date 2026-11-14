# Cover style: Vicky's desks (the reviewer draws the covers)

Started by conductor@web-summit.vicky at Vicky's word (14 November 2026, evening, standing answer 82 on the team site): "option A for covers: the reviewer draws them again in its own style, and redraws my interview and S65 covers. Two conditions: 1. The designer stops drawing covers but keeps charts and infographics inside articles, including the analyst's pieces. 2. The reviewer's covers must use one fixed typeface, so they look the same on every device. Write that into the style file."

From now on reviewer@PrompTugal.vicky draws every cover for Vicky's desks, in its own style, and keeps this file. It replaces `desks/designer-vicky/covers/STYLE.md` for covers. The designer draws only the charts and infographics inside articles.

## The fixed typeface (Vicky's condition; not to be changed without her word)

- **One typeface on every cover**, the same on every cover and every device. The reviewer picks it once from the site's own licensed font files in `assets/fonts/` (see `assets/fonts/LICENSE.md`), names it here, and keeps it.
- **No system or fallback fonts.** No cover depends on fonts installed on the reader's device or on the machine that renders it: letters are drawn as paths, or the font file is embedded when the cover is rendered. A cover whose text falls back to another face is not published.
- **Checked before publishing:** the PNGs (paper and ink, card 1200x630 and thumb 480x480) and the SVG show the same face at 390 px and 1280 px, light and dark.

## The reviewer's look

**The typeface: IBM Plex Sans** (`assets/fonts/plex-sans-variable.woff2`, variable weight 100 to 700, SIL Open Font License 1.1, see `assets/fonts/LICENSE.md`). It is the nearest of the site's own faces to the bold sans of the covers I drew before 14 November. Those used the device's `system-ui`, which is why they could differ from machine to machine. The whole font file is embedded in each SVG as a base64 `@font-face` under its own name ("PT Cover Plex Sans"), with no fallback in the stack. The PNGs are rendered from that SVG, so the PNGs and the SVG show the same letters everywhere. The generator checks that the face has loaded and stops if it has not. Weights: 700 for title and figure, 500 for the line in the box, 400 for subtitle and source line.

### Layout, card 1200 x 630 (margins 60)

1. A green rule, 96 x 8, at the top left (y 52).
2. **Title**, 72 px, weight 700, ink, baseline y 140, one line: the story's short name.
3. **Subtitle**, 42 px, weight 400, ink-3, baseline y 200, one line: what the figures are about.
4. **The box**, x 60 to 1140, y 236 to 506, radius 16, a darker paper (`#ece7db`, stroke `#9d9580`). Inside it:
   - the **figure line**, 96 px, weight 700, **green**, baseline y 350, at most 1000 px wide;
   - the **line under it**, 48 px, weight 500, ink, baseline y 452, saying what the figures count.
5. **Source line**, 42 px, weight 400, ink-3, baseline y 578: whose figures they are. When the main figure is a company's claim, it says so ("Figures: 3WX, via Postal do Algarve").

### Thumb 480 x 480 (margins 40)

The thumb is shown 94 px wide on `/articles/`, so it carries the title and one figure only, nothing under 64 px. The green rule (80 x 8 at y 40), then the title in one or two lines (64 to 68 px, weight 700), then the box (x 40 to 440, y 292 to 440) with one figure in green (64 to 80 px). A company's claim never goes on the thumb, because its attribution would not fit.

### Colours (brand v2.0)

- **Light:** paper `#f6f3ec`, ink `#121317`, ink-3 `#595c64`, green `#006600`, box `#ece7db`.
- **Dark (the ink twin, from `prefers-color-scheme`):** ground `#111214`, text `#eceae4`, ink-3 `#a6a39a`, green `#6dbb7e`, box `#1a1b1e`.
- **Green** marks the one figure line and the top rule. No red. No other accent.

### Words

- **Sources:** only figures and words from the article and its sources. Every figure is in a sentence of the article's body.
- **Claims:** a company's claim carries its attribution in the same line ("300+ sign-ups in the first hours, 3WX says"), never in smaller type.
- **Banned:** no quote, no photo of a person, no company logo.
- **Text size:** at least 42 px on the card (12.5 px at 390 px wide) and 64 px on the thumb.
- **Alt text:** one sentence of what the card shows, with any attribution kept. No semicolon or em-dash. The same text goes in `image_alt` and the body image.

### Files and where they go

- **The generator:** `desks/reviewer-vicky/covers/tools/make-cover.js`, reading `covers.json`. It writes each SVG and renders the four PNGs in Chromium. It also measures every line and refuses a line that runs past its limit.
- **SVG sources:** `desks/reviewer-vicky/covers/<slug>/<slug>--card.svg` and `--thumb.svg`.
- **PNGs:** `design/infographics/out/<slug>--{paper,ink}--{card,thumb}.png`, with four `index.json` rows. Each row has `"auto": false` and a `hand` block (by, made, source, checked).
- **Wiring:** in the article, `image:` points to the paper card. The body image goes directly under "The story" (an interview: under its first heading), with a version query (`?v=<date><letter>`). The query is moved on at every redraw, and it also keeps the page from stretching the image until site.css has `height: auto`.

### Checks before publishing

1. Figures, labels and attribution against the article and its sources.
2. The face is IBM Plex Sans in all four PNGs and the SVG.
3. On the live page, at 390 px and 1280 px, light and dark:
   - the body image keeps 1200:630 (358 x 188, 666 x 350);
   - `og:image` is the card;
   - the `/articles/` thumb is the new file.

