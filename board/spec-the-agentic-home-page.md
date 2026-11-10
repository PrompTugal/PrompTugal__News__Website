---
title: "The agentic edition's home page: direction B (Calcada), what to build"
by: designer@PrompTugal.dinis (session 3, account B)
written: 2026-11-10T11:05Z
for: dev.pages@PrompTugal.dinis (builds), dev@PrompTugal.dinis (reviews); security@ (the GAMMA-Ray data: read, never copied by hand); correspondent@ (what leads)
from: THE RESTART (board/guidance/2026-11-10-the-restart.md); the decision content/newsroom/design/decisions/the-design-flip.md (B, round 3); sherpa@'s review 09:35
pictures: design/decisions/the-design-flip/b3--{phone,desktop}--{light,dark}.jpg; the mock's code design/home-designs/flip/round3.mjs (copy its CSS)
issue: WS-177
---
# The agentic edition's home page

> **Since 14:35 UTC, the theme is The Front Page (E)** (Dinis): build H1 to H12's content and order inside E's look, as in `board/spec-the-front-page-theme.md`. B's dark top and wave give way to E's masthead and green lead band.

| # | Build | Pass when |
|---|---|---|
| H1 | **The dark top:** `--top` #121317 in light mode, #000 in dark mode; the kicker "State of agentic · <day>" in green-on-dark; the headline in Newsreader 500, clamp(38px, 7vw, 70px), the italic word in #f07278; the standfirst | the headline and standfirst are in the first phone screen |
| H2 | **On a phone only:** one interview inside the top, under the standfirst (correspondent@ picks which; on summit days an interview), and dropped from the list below | the first phone screen holds a headline and a story (sherpa@'s R1); a video interview says so on its card: "Watch · <its length>" from the interview's own data (sherpa@, 12:35) |
| H3 | **The Spectrum strip**, read at build from GAMMA-Ray's published card data (the JSON GAMMA-Ray publishes, or the vault; never typed), with the date read: the legend line, then per card the product, its company, four chips (A, R, C, O with the level; dashed "– not yet evidenced" where there is none; the level's word as title), the stage bar and "<Stage>, n of 16", the row linking to its card on gamma-ray.sgit.ai | three rows on a phone, six on a desktop, then "All N Spectrum cards"; alphabetical; no number typed by hand; no card's text copied (security@'s link rule) |
| H4 | **Chip fills:** level 1 none, 2 ink 15%, 3 paper 72% with dark text, 4 paper with dark text; never red or green | contrast as measured on the decision page (all AA or better) |
| H5 | **The wave** (an SVG path, `round3.mjs`'s `wave()`): from the dark top to paper, and from paper into the dark footer | no gap or hairline at 390, 768 and 1440 px, light and dark |
| H6 | **Our interviews:** the articles' own titles and summaries, a red left rule, Newsreader 25px | two columns from 760 px |
| H7 | **GAMMA-Ray in one minute:** GAMMA-Ray's own questions and level names (from its standard page), the four-level scale, "Nothing on a card is a judgement", a link to "How a rating is made" | its words match gamma-ray.sgit.ai |
| H8 | **The footer** dark, "Powered by RiskMandate" (the footer rule of 6 November) | |
| H9 | **If GAMMA-Ray's data cannot be read at build**, the strip is left out (not shown empty, never with placeholders) | sherpa@'s condition |
| H10 | **The Spectrum block on a company page** (`design/decisions/the-design-flip/company-spectrum--{phone,desktop}--{light,dark}.jpg`, CSS in `design/home-designs/flip/company.mjs`): for each product the company has a `gamma_ray` link for, under the company's own lead: "GAMMA-Ray Spectrum · beta", the product, "read <date>", one line of legend, four tiles (power or trust, the code, the dimension, GAMMA-Ray's word for the level; ink fill grows with the level; dashed for not yet evidenced), the stage bar, "The full card and its evidence, on gamma-ray.sgit.ai", and "corrections go to GAMMA-Ray, not here" | two tiles a row on a phone, four on a desktop; nothing shown when the company has no link (today none has: the six cards are products) |
| H11 | **Round 4's order** (Dinis 12:40; `design/decisions/the-design-flip/b4--*`, CSS in `design/home-designs/flip/round4.mjs`): the dark top holds the headline and the interviews as video cards (all of them, newest first, "Watch · <length>"); then, under the wave, **the summit now** (sessions about agents today from data/events, "On now" with a red dot and "Next", the place, "All N") beside **the scores** (H3's strip, four rows on a desktop, three on a phone); this replaces H2 | sherpa@ (15:35): each video card shows a real frame from the interview, not a grey box; "4 done" reads as "4 already over"; on a phone: headline, the interviews, the summit now, the scores; the clock is the page's build time, refreshed with each release or in the browser |
| H12 | **The newsroom, at work:** a swimlane per piece (lanes: a person, tools, agents, readers; one box per step in time order with its time; a red "hand-off" wherever the work changes lane), from the record (commit trailers, the interview pipeline's stages; dev.graphs@); on a phone a vertical timeline with "to <lane>" at each hand-off; on the home page the latest interview's, and on every piece's own page its own | one line atop the block on why a reader cares (sherpa@: say that you can see who and what made each piece, and where a person checked it); no person named unless the record names them publicly; no sideways scroll on a phone |

Then the rest of today's home page continues below (the briefing, the stories, the calendar) in its present order, under the wave. I check H1 to H9 at the first wake after it ships.
