PROMPTUGAL.NEWS - BUSINESS CARDS, PROOF 3 (GENERIC, WHITE, WITH THE AGENT)
designer@PrompTugal.dinis, 6 November 2026, WS-177. A proof for Dinis Cruz's yes: nothing is ordered.

At Dinis's word (6 November): white stock and no solid colours (cheaper and simpler to print: type, the QR and
hairlines in ink, the brand's red T and green "ugal", green bullets and rule; no flood, no panel, no tint); generic
(the masthead, not a person); variant A of proof 2 (no Web Summit line); the agent's address, agent@promptugal.news;
and a card that makes whoever gets it curious enough to take part and write to the agent. Proofs 1 and 2 are in the
history (commits 497e453 and b61b674).

Three fronts to choose from, one back (generic/<front>/, each with the same back):
  front-1-together  "People and AI agents, reporting together."   the designer's pick: it says what is unusual
  front-2-context   "Technology and AI, in context."              the brand guide's line
  front-3-ask       "Read it. Question it. Ask its agent."        an invitation
Front: the supplied outlined wordmark (assets/brand/promptugal-wordmark-light.svg, unchanged, 66 mm wide, above the
45 mm minimum), a short green rule, the tagline (Newsreader italic). "Newsroom" is not used: it means only the back end.
Back: HOW IT WORKS and four lines, each true of the live site: AI agents do the legwork, editors decide; every fact has
its source and the date we read it; every story is part of a graph you can explore (/graph/); pay as you read, only for
what you read (the reading meter). Then "Talk to our agent", agent@promptugal.news, "or scan to read promptugal.news",
"Powered by RiskMandate" (as every page of the site says; RiskMandate's own mark is a filled square, so type only),
and a QR to https://promptugal.news/.

To the print shop's rules (the team site's /cards/print/): 85 x 55 mm trimmed; 3 mm bleed (each PDF page 91 x 61 mm,
though nothing runs to the edge); all text at least 3 mm inside the trim; every letter outlined (the PDFs embed no
fonts); smallest text 7 pt; the QR in ink on the white stock with a four-module quiet zone (version 3, level Q,
0.53 mm modules; decoded and checked). Colours: ink #121317 (print as plain K, no rich black needed), red #C52830,
green #006600; ask the shop for a proof of the red and green.

Files per front: card.pdf (page 1 front, page 2 back), card-front.svg and card-back.svg (vector, outlined),
card-front.png and card-back.png (300 dpi, trimmed). overview.png: the three fronts and the back.

How they are made (design tools, not the site's build):
  python3 design/cards/make_cards.py   # needs: pip install fonttools brotli uharfbuzz segno
  node design/cards/render.mjs         # Chromium via Playwright: the PDFs, PNGs and the overview
