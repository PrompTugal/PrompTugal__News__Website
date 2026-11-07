---
title: "Brief for the dev team on account B: the home page in eight designs, today's as the default, with Silvio's design switcher"
by: conductor.b@PrompTugal.dinis
written: 2026-11-06T23:25Z
asked_by: Dinis Cruz, 6 November 2026, about 23:20 UTC, in conductor.b@'s session ("the idea is to actually implement all 6 designs, including the previous one ... https://web-summit.sgit.ai/people/silvio/lab/mocks/a.htm ... there's a little mock-up at the bottom right ... Can you actually add them all? with the previous one as a default ... you actually implement 7 new designs, like the one you have now, but the A is what we had before")
for: dev@PrompTugal.dinis (leads), dev.pages@PrompTugal.dinis, designer@PrompTugal.dinis; sherpa@ and synthetic@ read them cold once live
amends: board/briefs/2026-11-06-front-page-mock-e.md (mock E is no longer the only home page: it is one of the seven options; its quality fixes and the 22:55 items still apply)
issue: WS-177
---
# The home page in eight designs

## What Dinis asked

Every design in Silvio's lab becomes a real version of promptugal.news's home page, built from the site's data, and the reader chooses between them. **The default is today's home page** (what a reader who never chose sees). The seven new ones are Silvio's mocks:

| id | Name | Silvio's note | Source |
|---|---|---|---|
| (default) | Today | the live site as it is | promptugal.news today |
| a | The Edition | a classic front page | https://web-summit.sgit.ai/people/silvio/lab/mocks/a.htm |
| b | Summit Live | built for the four days | .../mocks/b.htm |
| c | The Atlas | AI in Portugal, mapped | .../mocks/c.htm |
| d | The Brief | read it in two minutes | .../mocks/d.htm |
| e | The Front Page | NYT authority, MIT Tech Review colour | .../mocks/e.htm (already in progress: dev@ and dev.pages@) |
| f | Signal | | .../mocks/f.htm |
| g | The Magazine | | .../mocks/g.htm |

## The switcher (the "little mock-up at the bottom right")

Silvio's lab has it already: `https://web-summit.sgit.ai/people/silvio/lab/design.js` (and `design.css`), a fixed pill at the bottom right ("✦ Design: The Edition") that opens a picker with a screenshot of each design; the choice is kept in the reader's browser (localStorage), nothing leaves it; one constant sets the default. Port it into this repository (`assets/`, no external script), with:

- the default `today`; ids `a` to `g` as above;
- `?design=<id>` in the URL also selects one (so a link can show a design, and so the team can A/B test, CLAUDE.md "Decisions are pages");
- localStorage wrapped in try/catch: the page works when storage is blocked;
- every design is the same page's data (the build renders each from `content/` and `data/`, never copied text from the mocks); one URL (`/`), the designs as alternative layouts of it;
- the palettes and light/dark of the mocks' lab bar are not part of this ask (the brand stays as designer@ keeps it); the lab bar itself ("LAB MOCK A ... not the live site") is not shipped.

## Order

1. **dev@:** the switcher and the build's support for several home layouts, with **today's page as the default**, so nothing changes for a reader who does not choose. Mock E, already in progress, lands as the first option, not as the default.
2. **dev.pages@:** the layouts from data, one at a time on `work/dev.pages`: E (in progress), then A, B, C, D, F, G; dev@ reviews and brings each onto dev as it passes the gate. Push and try live (CLAUDE.md, "When in doubt, push to production").
3. **designer@:** each design in the brand v2.0 and its quality fixes (as for E, the acceptance checks E1 to E13 are the model), and the picker's screenshots.
4. **sherpa@ and synthetic@:** read each design cold once live; findings to dev@ and designer@.

The 22:55 items in the mock E brief apply to every design: the same page width on every page as the home page, and RiskMandate only as "Powered by RiskMandate" in the footer.

## Done when

The home page at promptugal.news shows today's design by default, the pill at the bottom right switches between all eight, `?design=a` to `?design=g` work, each built from data and through the gate.
