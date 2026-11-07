---
title: "The home page in eight designs: each in the brand, its checks, the picker's pictures"
by: designer@PrompTugal.dinis (session 3, account B)
written: 2026-11-07T00:05Z
for: dev@PrompTugal.dinis (the switcher), dev.pages@PrompTugal.dinis (the layouts); sherpa@ and synthetic@ after
brief: board/team/conductor.b/briefs/2026-11-06-home-page-eight-designs.md (Dinis, about 23:20 UTC, relayed by conductor.b@); my row is 3
model: board/spec-front-page-e.md (E's mapping and checks E1 to E13; E passed 10 of 13 at v0.1.379)
source: Silvio's lab, people/silvio/lab/mocks/{a..g}.htm and design.js in SGit-AI/SGit-AI__Website__Web-Summit at ea7f277 (23:43 UTC), read-only
pictures: design/home-designs/a-to-g--mock.jpg (as Silvio drew them), a-to-g--brand.jpg (the same in brand v2.0), shots/ (the picker's pictures)
issue: WS-177
---
# The home page in eight designs

![A, B, C, D, F, G as Silvio drew them (lab chrome removed)](../design/home-designs/a-to-g--mock.jpg)

![The same six in brand v2.0](../design/home-designs/a-to-g--brand.jpg)

## 1. The colours: one rule for all

Every design is drawn in the brand v2.0 tokens (`design/brand/brand-tokens.css`): paper `#f6f3ec`, ink `#121317`, red `#c52830`, green `#006600`, rule `#d8d4cb`, muted `#666860`; dark mode in the brand's dark tokens. **A to D need nothing new:** Silvio's own "classic" palette in the lab is exactly the brand, so build them with it. **F and G pin palettes of their own** (F violet `#6d4aff`, cyan, magenta; G coral `#ff6a4d`, yellow `#ffd23f`, a pink to violet gradient). Mapped to the brand, F keeps its layout and loses only its violet; G loses its identity (its hero is a hard-coded gradient), so G needs its hero redrawn:

- **G in the brand:** the hero band in ink `#121317` with paper text, "Portugal" highlighted in red `#c52830` with paper text (5.09:1); the image card as drawn; the numbers band in sand `#efe6d2` with the figures in green (as E's). I check the result, not a picture of it.

**For Dinis (the brand is his):** should a design keep its own palette as a lab option (F's violet, G's coral and gradient), or is every design in the brand? Until he answers: every design in the brand. If he says yes, each palette becomes one block of tokens behind its design id, never mixed into the others.

## 2. The checks for every design (D1 to D14; E1 to E13 made general)

| # | Pass when |
|---|---|
| D1 | no lab chrome (no "LAB MOCK" bar, palette switcher, "All options" or "The original" links); the only design control is the site's own pill |
| D2 | nothing from another site (the mocks load `design.js` and `assets/` from web-summit.sgit.ai and use `<base href="https://promptugal.news/">`) |
| D3 | the colours as section 1; no mock colour left in the CSS |
| D4 | the brand's wordmark SVG, whole and at least 240 px wide: **C, F and G clip it at the left in the mock** ("rompTugal") at 1280 px |
| D5 | every number from data, never typed: the mocks hard-code "30 AI agents on the desk", "about 30 agents, 3 editors", "120 companies", "218 events", "22 stories"; the build counts them (or drops the line) |
| D6 | the countdown computed, readable at 390 px, gone once Opening Night has started |
| D7 | on a phone, C's tab bar at the bottom (Dinis 13:20); a design's own section row hidden under 600 px (E6) |
| D8 | the pills only where true (E8); every image with alt text and its "AI-made" label |
| D9 | anything that moves (the tickers in B, E, F; the blinking cursor in every mock) pauses on hover and focus and stops under `prefers-reduced-motion` |
| D10 | no sideways scroll at 390 px: **B is 408 px wide on a phone in the mock** |
| D11 | on a phone, what is happening now comes within the first two screens (E10) |
| D12 | the Ask box, where a design has it, is the site's own search, one per page |
| D13 | the site's contract: the markdown twin, the version badge, the agent block, offline mode, no em-dashes, the gate green, the same page width as every other page, RiskMandate only as "Powered by RiskMandate" in the footer (Dinis 22:55) |
| D14 | credit: the agent block names Silvio's design and the mock's letter |

## 3. Each design: what to watch

| id | Silvio's name | In the brand | Watch |
|---|---|---|---|
| today | the page as it is | as live | the default; nothing changes for a reader who does not choose |
| a | The Edition | classic palette | the days strip in Now and next is tiny at 1280 px: day chips at least 44 px wide to tap |
| b | Summit Live | classic palette | D10 (408 px on a phone); the green live bar carries six facts: the counts from data (D5) |
| c | The Atlas | classic palette | D4 (wordmark clipped); the "AI radar" bars as the companies page's own counts |
| d | The Brief | classic palette | the drop cap "G" and "Good morning": the greeting follows the reader's clock (no "Good morning" at 23:00); "Get the daily" links to the newsletter page, not a form |
| e | The Front Page | live (v0.1.379) | E6, E10, and the band's green (with Dinis), board/spec-front-page-e.md |
| f | Signal | brand tokens over its own | D4; numbered "top signals" from the correspondent's order |
| g | The Magazine | hero redrawn (section 1) | D4; the gradient and yellow are not in the brand; the big numbers from data |

## 4. The picker's pictures

Silvio's switcher shows an 800 x 673 JPEG of each design's first screen at 1280 px. A first set is in `design/home-designs/shots/{today,a,b,c,d,e,f,g}-desktop.jpg` (about 70 KB each): `today` and `e` are the live site at v0.1.379 (`?front=a` and E); `a` to `g` but `e` are Silvio's mocks drawn in the brand, so the picker has a picture from the start. **dev@: point the switcher at these paths**; I replace each with the built design's own screenshot as it lands, so the picture always matches what the reader gets.
