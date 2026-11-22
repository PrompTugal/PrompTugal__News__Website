# The deck method (slides.d (account-d), v0, 22 November 2026)

Written once so no agent reinvents a deck. Dinis's ask (22 Nov 2026, through maestro.d): decks that are "super rich, super visual, lots of screenshots", that flow, are personalised to the one person they are for, play as HTML, publish on a site and export to a clean PDF.

## 1. Before a slide: the brief (one page)

- **Who** reads it, in role terms (never a private person's name in a repository): what they already know, what they fear, what they want, how they will see it (a meeting screen, a phone, a PDF in an email).
- **The one ask**: the single thing they should do after the last slide, with a date.
- **What they must believe** for the ask to make sense: three beliefs at most. Each becomes a section.
- **Evidence** for each belief: a live page, a screenshot, a number with its source, a quote with its link. A belief with no evidence is cut, not padded.
- **Format and length**: live talk (10 to 15 slides, notes carry the words) or sent ahead (the slides must read alone, still under 20).

## 2. The arc

Problem, then proof, then the ask. A tested order:

1. **Title**: for whom, and the promise in their words.
2. **Their world**: the problem as they see it (one number, sourced).
3. **What changes**: the insight, one line.
4. **Proof**: the real thing working: screenshots of live pages, a short screen recording, a diagram of how it fits their world.
5. **Why us / why now**: what exists already (dated, linked), who is behind it.
6. **What it means for them**: personalised: their organisation, their place, their market.
7. **The ask**: one thing, the next step, the date.
8. **Appendix**: sources, links, the long version. Never in the flow.

## 3. Rules for every slide

- **One message per slide**, written as the slide's headline: a sentence with a verb, not a label.
- **A picture carries the slide**: screenshot of the real thing first, then diagram, then data chart, then icon. Text is the caption.
- **Every claim sourced** on the slide: a footer line with the link and the date read. No source, no claim. No invented figure, quote or logo.
- **Builds** reveal in the order you speak; never more than four steps on a slide.
- **Never scroll**: 16:9, fixed 1600 by 900 canvas scaled to the screen; if it does not fit, it is two slides.
- **Readable at the back of the room**: headline 56px or more, body 32px or more, no more than about 30 words of body.
- **Notes** hold what you say; the slide holds what they see.
- **Personalised** where it counts (slides 1, 2, 6, 7), not by a name on every slide.
- Plain British English, no em dashes, the brand's colours and type (from design.d, or the publication's own).

## 4. Making it

- Start from `../template/deck.html.tpl`: one HTML file, no dependencies. Arrows, space, swipe; `F` full screen; `P` presenter window (notes, next slide, timer; keeps in step); `O` overview; a number then Enter to jump; `#/n` deep links.
- Screenshots: headless Chromium at 1600 by 900 (deviceScaleFactor 2 for the final), saved beside the deck in `shots/`, each with the URL and time taken in its source line.
- Motion: CSS transitions on builds; respects reduced motion. Narrated versions go to studio.d's storyboard format.

## 5. Review (one round, before it is sent)

A checklist, scored per slide: one message? headline is a sentence? picture carries it? every number sourced? fits without scroll at 1600 by 900 and on a phone? notes written? Then the whole: does the arc reach the ask? would the reader forward it? A synthetic reader of the target role (synthetic@, sherpa.d) reads the PDF cold and says where it lost them.

## 6. Shipping

- **HTML**: published on the owner's own site and repository; there are no private pages (Dinis, voice memo ~17:05 UTC 22 Nov 2026, "studio-publish"). slides.d's own decks and the template publish on SovereignWebsite/Site__Agent__Slides once it exists.
- **PDF**: `node board/team/slides.d/template/pdf.mjs deck.html deck.pdf [--notes] [--png shots-out/]` (one page per slide, builds shown, notes optional).
- **PPTX**: only if the reader needs to edit it: the claude.ai Slides artifact type (see `../library.md`, "HTML or Slides artifact").
