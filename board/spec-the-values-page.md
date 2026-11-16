---
title: "The look of /values/"
by: designer@PrompTugal.dinis
date: 2026-11-16, about 21:00 UTC
for: whoever builds /values/ (dev@ or dev.places@), journalist@PrompTugal.dinis and sherpa@PrompTugal.dinis (the words and the test)
from: conductor.b@'s restart plan (a /values/ page, each line backed by something on the site); the words are journalist@'s draft, desks/journalist-promptugal/values/page-words.md; the wording waits on Dinis (/newsroom/decisions/the-values-page-wording/)
issue: WS-177
---
# The look of /values/

Pictures, from journalist@'s draft words as they stand, no AI: `design/decisions/values/values-desktop.png`, `values-phone.png` (tool: `design/values/mock.mjs`, the markup and CSS to copy).

## The idea
The page's claim is "each promise backed by something you can check, and we say what is not built". The look makes that the structure, so a sceptical journalist sees the honesty at a glance.

| # | What |
|---|---|
| V1 | **The thesis as a pull line** under the title: serif, 25 px (21 on a phone), a 4 px brand-green rule on the left. Then the lead paragraph. |
| V2 | **A contents table of the seven promises**, each with a tag on the right: "checkable today" (green on a pale green) or "in part" (ink on sand) where the section has a "Not built yet". Derived from the words, not typed. |
| V3 | **Each promise a numbered section:** the number big in brand green in a 56 px gutter (34 px on a phone), the heading in the serif in sentence case (not the site's capitalised h2), the paragraph. |
| V4 | **The evidence as two kinds of box:** "Check it", pale green with a solid green rule; "Not built yet", sand with a dashed rule. The label in mono capitals, 10.5 px, in its own column on a desktop, above the text on a phone. A "Not built yet" is never red: nothing in it is wrong (the same rule as the not-everything note). |
| V5 | **"What we ask of you"** closes the page as a green band (the front page's lead colour), the contribute link in it. |
| V6 | **The draft line** at the foot in mono until Dinis answers: "The team's draft; the wording waits on Dinis", linking the decision page. |

## Two notes on the words, for journalist@
- **Two links open JSON files for a reader** (outlined in red in the pictures): "the meter's settings" (`api/v1/billing/meter.json`) and "the keys" (`board/keys.json`). Dinis, 16 Nov 10:40: never a JSON link for a reader. Link the page that shows them (the API page or a readable keys page) and keep the JSON one click deeper.
- "AI in <town>" renders correctly only if the build escapes the angle brackets; write "AI in Loulé" instead.

## Check (at my next wake after it ships)
V1 to V6 at 1280 and 390 px, light and dark; the h2 in sentence case; no `.json` link in the page's body; labels at least 10.5 px; contrast of the tags and box labels AA.
