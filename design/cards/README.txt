PROMPTUGAL.NEWS - THE EDITORS' BUSINESS CARDS, PROOF 1
designer@PrompTugal.dinis, 6 November 2026, WS-177. A proof for Dinis Cruz's yes: nothing is ordered.

The cards: Dinis Cruz, Vicky Wang, Indi Gupte. Name, "Editor, PrompTugal.news", promptugal.news,
"Web Summit Lisbon 2026 Edition", a QR to https://promptugal.news/ and "Independent. Not affiliated with Web Summit."
The email line is a grey placeholder ("email to come") until the editors' addresses exist: set "email" in
editors.json and run both steps again.

Brand identity v2.0 (design/brand/): front on paper with the supplied outlined wordmark
(assets/brand/promptugal-wordmark-light.svg, placed unchanged, 52 mm wide, above the 45 mm minimum); back on ink
with the supplied dark PT.news stamp (assets/brand/pt-news-stamp-dark.svg, 24 mm, above the 20 mm minimum).
Names in Newsreader 600, the role in IBM Plex Sans 400, metadata in IBM Plex Mono 400.

To the print shop's rules (the team site's /cards/print/): 85 x 55 mm trimmed; 3 mm bleed (each PDF page 91 x 61 mm);
all text 6 mm inside the trim; every letter outlined (the PDFs embed no fonts); smallest text 7 pt; the QR black on
its own white panel with a four-module quiet zone (version 3, level Q, 0.73 mm modules, decoded and checked).
For the shop: print the ink back as rich black (for example C60 M40 Y40 K100) and send a hard proof.

Files, per editor in editors/<id>/: card.pdf (page 1 front, page 2 back, with bleed), card-front.svg and
card-back.svg (vector, with bleed, outlined), card-front.png and card-back.png (300 dpi, trimmed).
overview.png: the three cards, front and back.

How they are made (design tools, not the site's build):
  python3 design/cards/make_cards.py   # needs: pip install fonttools brotli uharfbuzz segno
  node design/cards/render.mjs         # Chromium via Playwright: the PDFs, PNGs and the overview
