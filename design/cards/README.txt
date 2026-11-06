PROMPTUGAL.NEWS - BUSINESS CARDS, PROOF 2 (GENERIC)
designer@PrompTugal.dinis, 6 November 2026, WS-177. A proof for Dinis Cruz's yes: nothing is ordered.

At Dinis's word (6 November): no solid colours, so the card is cheap to print (white stock; only type, the QR and
hairlines in ink, with the brand's red T and green "ugal" and rule; no flood, no panel, no tint); generic (the
masthead, not a person: no name, no role, no email); a tagline; and a link to RiskMandate. Proof 1 (the editors'
named cards on paper and ink grounds) is superseded and removed; it is in the history at commit 497e453.

Two variants, the same but for one line on each side:
  generic/a-generic/     no Web Summit mention: lasts beyond 12 November (the designer's recommendation)
  generic/b-web-summit/  front adds "The Web Summit Lisbon 2026 edition"; back adds
                         "Independent. Not affiliated with Web Summit." (the site's own footer line)
Front: the supplied outlined wordmark (assets/brand/promptugal-wordmark-light.svg, unchanged, 66 mm wide, above the
45 mm minimum), a short green rule, "Technology and AI, in context." (Newsreader italic, the brand guide's line).
Back: the PT.news stamp (assets/brand/pt-news-stamp-light.svg, 22 mm, its paper square left unprinted so the white
stock shows through; nothing else changed), a QR to https://promptugal.news/, "A Portuguese perspective. A European
conversation." (the brand guide's line), "Powered by RiskMandate" and riskmandate.ai (as every page of the site says;
RiskMandate's own mark is a dark square, a flood, so it is left off: text only).

To the print shop's rules (the team site's /cards/print/): 85 x 55 mm trimmed; 3 mm bleed (each PDF page 91 x 61 mm,
though nothing runs to the edge); all text at least 3 mm inside the trim; every letter outlined (the PDFs embed no
fonts); smallest text 7 pt; the QR in ink on the white stock with a four-module quiet zone (version 3, level Q,
0.65 mm modules; decoded and checked). Colours: ink #121317 (print as plain K, no rich black needed), red #C52830,
green #006600; ask the shop for a proof of the red and green.

Files per variant: card.pdf (page 1 front, page 2 back), card-front.svg and card-back.svg (vector, outlined),
card-front.png and card-back.png (300 dpi, trimmed). overview.png: both variants, front and back.

How they are made (design tools, not the site's build):
  python3 design/cards/make_cards.py   # needs: pip install fonttools brotli uharfbuzz segno
  node design/cards/render.mjs         # Chromium via Playwright: the PDFs, PNGs and the overview
