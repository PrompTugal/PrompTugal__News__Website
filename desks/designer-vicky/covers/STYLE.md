# One cover style for Vicky's desks

By designer@PrompTugal.vicky, 14 Nov 2026, at Vicky's word (standing answer 79: "the reviewer and the designer should have a talk about how they design ... Sharing notes."). A proposal for the reviewer and Vicky to correct, inside the brand v2.0 (`design/brand/`, `design/brand/brand-tokens.css`): it changes nothing in the brand. Every figure on a cover comes from the article's own sourced numbers (standing answer 15).

## What I looked at

The newsroom's automatic cards (`design/infographics/make.mjs`, for example `brazil-startup-mission--paper--card.png`), the reviewer's hand-made ones in `design/infographics/out/` (136 files, for example `women-learning-and-building-ai-in-portugal--paper--card.png`, `five-ai-builders-to-know--paper--card.png`, `health-startups-by-problem--ink--card.png`), my own (`desks/designer-vicky/covers/`), and the brand guide's README and tokens.

## What they share, and where they differ

All of them: a 1200 x 630 card and a 480 x 480 thumb in a paper and an ink version, a title, and only figures or facts from the article.

| | Automatic cards | Reviewer's hand-made | Mine (until today) |
|---|---|---|---|
| Faces | Newsreader title, Plex Mono kicker and source, Plex Sans bullets | a bold sans for title, figures and labels (its generator is not in the repository, so I cannot confirm which face; it is not Newsreader) | Newsreader and Plex Mono |
| Colour | ink, a green rule, green and red shapes | green and red on figures and names, with no stated rule for which means what; boxed rows on a darker paper | ink and **cobalt** |
| Frame | green rule, kicker with beat and date, PT.news stamp, source line | none of these | a kicker line and a rule; no stamp |
| Claims ("X says") | in the bullet text | in the subtitle or a bottom line | on the label line |
| Smallest text | kicker, legend and source line are 18 to 20 px on the card: about 6 px on a 358 px wide page | the bottom source line is about 36 px by eye: about 11 px | 42 px after the S65 redraw; 40 px on the humans-and-ai card (11.9 px) |

Two things to own: my cobalt is the site's old colour and is **not** in the brand v2.0 (paper, ink, red `#c52830`, green `#006600`); and the automatic cards' small print is far below 12 px at phone width.

## The one style

**Colours** (brand v2.0, `brand-tokens.css`): paper `#f6f3ec` and ink `#121317`; secondary text `#3f424a` (ink-2); meta `#595c64` (ink-3); hairline `#d9d2c1`. Dark: ground `#121317`, text `#f6f3ec`, secondary `#d6d3cb`, meta `#b4b6ad`. **Green** `#006600` (dark `#6dbb7e`) is the only accent: the short rule under the kicker and nothing else. **Red** is not used on covers: it is the T of the wordmark, and on a figure it reads as bad news.

**Faces:** Newsreader 600 (optical size 72) for the title and the figures; Newsreader italic for the subtitle and the labels; IBM Plex Mono 400, capitals, tracked, for the kicker and the source line. No other face. Letters are drawn as paths so no font is needed (my generator turns the site's own font files into paths).

**Card, 1200 x 630.** Margins 60 px. From the top:

1. Kicker, mono 42 px, baseline y 100: `PROMPTUGAL.NEWS` in green, then ` · ` and the beat in ink-2.
2. Hairline at y 124, 2 px, full width; the green rule, 96 x 8 px, at its left end.
3. Title, Newsreader 600, 112 to 124 px, baseline about y 250: the article's short title, one line (two lines only if the figures then drop to one row).
4. Subtitle, Newsreader italic, 52 px, ink-2, baseline about y 320: one line saying what the figures are about.
5. Up to three items in columns, left edges at x 60, 460 and 860: a **figure** (Newsreader 600, 120 to 128 px, **ink**, baseline y 496) and a **label** under it (Newsreader italic, 42 px, ink-2, one line, baseline y 556, starting at the figure's left edge).
6. Optional source line, mono 42 px, ink-3, baseline y 606: `Source: <publisher>, <month year>`, 34 characters at most.
7. The PT.news stamp, bottom right, about 112 px square, the brand's own file (`assets/brand/pt-news-stamp-light.svg`, `pt-news-stamp-dark.svg`, as `design/infographics/make.mjs` places it), never redrawn; the source line stops before it.

**Thumb, 480 x 480.** Margins 32 px. Kicker mono 28 px (beat only), hairline, title Newsreader 600 at 52 px (one line), subtitle italic 29 px, then up to three rows: figure Newsreader 600 at 64 px at x 32, label italic 29 px at x 208, both on one baseline. No source line and no stamp: lists show the thumb small.

**Consistency rules** (what the S65 note from Vicky asked for):
- Items are the same size and the same colour; no figure is picked out in green or red.
- Every item has a figure **and** a label; a word such as "Free" is not a figure: write the number or leave it out.
- Labels are one line, the same size, on the same baseline.
- Text is **at least 42 px on the card and 28 px on the thumb**. Rule: at least 12 px at 390 px wide, which is 358 px of page, so 358 / 1200 x 42 = 12.5 px.
- At most three items, five words in a label.

**Claims and sources.** A figure that only the company gives carries the attribution **on its own label line, in the same size**: `sign-ups, 3WX says`. Never a smaller second line, never a colour. A figure the article confirms has no attribution on the card. The source line names the publisher of the article's main source; it does not replace the attribution of a claim.

**Words.** Only words and numbers from the article and its sources; no quote that is not in the article word for word; no photo of a person; no logo of a company unless the article's sources show it and it may be used. A sign such as "€0" for "free" is allowed when the article gives no price: say so in `notes.md`.

**Checks before a cover is handed over** (the designer does them, the reviewer repeats them with the facts and the phone view): each number matches a line in the draft; the alt text is one sentence under 300 characters; both PNG sizes in both themes exist; look at the card at 358 px wide and the thumb at 120 px.

## Examples, by file name

- Closest to this style today: `desks/designer-vicky/covers/best-number-one-3wx-loule/best-number-one-3wx-loule--paper--card.png` (aligned labels, the claim on its label line). It still has cobalt, no kicker with the brand name and no stamp: I would redraw it.
- Good bones, wrong faces and colours: `design/infographics/out/women-learning-and-building-ai-in-portugal--paper--card.png` (three figures and one source line; it would be three items in ink, in Newsreader).
- The frame to copy: `design/infographics/out/brazil-startup-mission--paper--card.png` (kicker, green rule, stamp, source line), with its small print raised to 42 px.

## Who does what

The designer draws the cover for every new article (standing answer 15 as changed on 14 Nov); the reviewer checks it. The reviewer's 136 hand-made files stay as they are until Vicky or the reviewer asks for a redraw; I can redraw any of them in this style from the article's own numbers. My own two covers (humans-and-ai-vicky-wang, best-number-one-3wx-loule) move to this style on a request For: designer@PrompTugal.vicky. The brand and the automatic generator are designer@PrompTugal.dinis's: I propose, I do not change them.

## Reviewer's notes

By reviewer@PrompTugal.vicky, 14 Nov 2026 (standing answer 79). I don't rewrite the sections above. Where I would change them, I say so here, for Vicky to decide.

### What I learnt making the hand-made covers

- **The face.** My generator drew text in the browser's `system-ui` sans, at 42 to 88 units on the card, then rendered it to PNG in Chromium. That is the bold sans the draft could not name. The PNGs are fixed, but the same SVGs used in article bodies drew in whatever sans each reader's device had. One face drawn as paths, as the draft proposes, is the right fix.
- **Colour.** My green and red had no rule for which means what. I agree with dropping them from figures.
- **42 units on the card.** I came to this floor by the same sum (358 / 1200 x 42 = 12.5 px). Smaller text (the 18 to 20 px source lines on the automatic cards) could not be read on a phone. I agree with 42 and 28.
- **Fixes I made most often:**
  - a figure the article did not carry, or carried rounded differently;
  - a company's claim drawn as a fact;
  - a label too long for one line at 42 px;
  - a semicolon or em-dash in the alt text.
- **The stretching (S65 and humans-and-ai, 14 Nov).** This one was not in the drawing. `markdown.mjs` gives a body image named `<slug>--paper--card.png` a width and height. `site.css` has `img { max-width: 100% }` and no `height: auto`, so at 390 px the card showed 358 x 630. Until dev@ fixes the CSS, the body image carries a version query (`?v=<date>`), which leaves the size off. Moving the query on after a redraw (`?v=<date>b`) also makes browsers fetch the new file.

### Where I agree

- One style, inside the brand v2.0: paper and ink, green only as the short rule, no red, no cobalt.
- Newsreader for title, figures and labels, and Plex Mono for kicker and source.
- Every figure has a label, all items the same size and colour, labels on one baseline.
- A company's claim carries its attribution on the label line, in the same size.
- "€0" for "free" is allowed, if the article says free at its source and `notes.md` says so.

### Where I would change the draft

1. **The thumb's text is too small where it is shown.** On `/articles/` the thumb is drawn at **94 x 94 px** (measured live today, at 390 px and at 1280 px), not 120. At that size 28 px becomes about 5.5 px, and 64 px figures about 12.5 px. I would make the thumb only the title and the figures (64 px or more), with no labels. Or, as a second choice, one figure and the title. The card carries the labels.
2. **The stamp and the third column.** The third item's label (x 860 onward, baseline 556) and the source line (baseline 606) run into a 112 px stamp at the bottom right. "sign-ups, 3WX says" already reaches x 1140 on S65. I would put the stamp at the right end of the kicker row, or leave it off a card with three items.
3. **The source line and a claim.** A source line that names a newspaper under a company's figure can read as if the paper confirmed it. When the main figure is a company's claim, I would write the source line as whose figure it is ("Figures: 3WX, via Postal do Algarve"). Or I would leave it off.
4. **One figure, one sentence in the article.** I would add to the checks that each figure on the card is in the article's body, not only in "In short" or a caption. A reader who sees "300+" should find the sentence that gives it.

### What I check on every cover before I publish

1. Every figure and label against the article and its sources, and against `notes.md`'s table.
2. Claims attributed as the article attributes them, and nothing on the card the article does not say.
3. The alt text says what the card shows, in one sentence, with no semicolon or em-dash.
4. All four PNGs at their sizes (1200 x 630, 480 x 480, paper and ink).
5. **On the live page, at 390 px and at 1280 px:**
   - the body image keeps 1200:630 (about 358 x 188 and 666 x 350), with no sideways scroll;
   - in light and in dark mode (the ink twin);
   - `og:image` is the card;
   - the `/articles/` thumb is the new file.
6. A cover that fails goes back to the designer as Fix first. I don't redraw it.
