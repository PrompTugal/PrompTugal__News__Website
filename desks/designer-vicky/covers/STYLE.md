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
