PROMPTUGAL.NEWS - THE BUSINESS CARD, PROOF 4
designer@PrompTugal.dinis, 6 November 2026, WS-177. FINAL: Dinis Cruz said yes to proof 4 on 6 November 2026.
The order: 100 cards, ProntaPrint Chiswick, placed by Dinis (a person places it; nothing is sent from here).
The shop's page: https://promptugal.news/newsroom/design/cards-print/ (content/newsroom/design/cards-print.md).

At Dinis's word (6 November): white stock and no solid colours (cheaper and simpler to print: type, the QR, hairlines
and small bullets only, in ink with the brand's red and green); generic (the masthead, not a person); no Web Summit
line; the agent's address, agent@promptugal.news; tagline 1 of proof 3; and on the back, HOW IT WORKS nearer the top,
the four lines kept with provenance and explainability in the second, "Talk to our agent" with the agent's address and
the site's address in the front's colours, the QR as it was, and no "Powered by RiskMandate". Earlier proofs are in
the history (497e453, b61b674, 45e47b0).

Front (card/card-front.svg): the supplied outlined wordmark (assets/brand/promptugal-wordmark-light.svg, unchanged,
66 mm wide, above the 45 mm minimum), a short green rule, "People and AI agents, reporting together." (Newsreader
italic). "Newsroom" is not used: it means only the back end.
Back (card/card-back.svg): HOW IT WORKS, then: AI agents do the legwork. Editors decide. / Provenance for every fact:
sourced and explainable. / Every story is part of a graph you can explore. / Pay as you read, only for what you read.
Then "Talk to our agent", agent@promptugal.news, https://PrompTugal.news (Promp ink, T red, ugal green, .news ink,
the wordmark's colours) and a QR to https://promptugal.news/.

To the print shop's rules (the team site's /cards/print/): 85 x 55 mm trimmed; 3 mm bleed (each PDF page 91 x 61 mm,
though nothing runs to the edge); all text at least 3 mm inside the trim; every letter outlined (the PDFs embed no
fonts); smallest text 7 pt; the QR in ink on the white stock with a four-module quiet zone (version 3, level Q,
0.53 mm modules; decoded and checked). Colours: ink #121317 (print as plain K, no rich black needed), red #C52830,
green #006600; ask the shop for a proof of the red and green.

Files in card/: card.pdf (page 1 front, page 2 back), card-front.svg and card-back.svg (vector, outlined),
card-front.png and card-back.png (300 dpi, trimmed). overview.png: front and back.

How they are made (design tools, not the site's build):
  python3 design/cards/make_cards.py   # needs: pip install fonttools brotli uharfbuzz segno
  node design/cards/render.mjs         # Chromium via Playwright: the PDFs, PNGs and the overview
