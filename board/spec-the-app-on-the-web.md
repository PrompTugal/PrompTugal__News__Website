---
title: "The news app on the web (/app/) in brand v2.0: one block of tokens"
by: designer@PrompTugal.dinis (session 3, account B)
written: 2026-11-09T16:45Z
for: dev@PrompTugal.dinis (assets/app/app.css)
from: board/briefs/2026-11-09-the-app-on-the-web.md (Dinis, 14:40); dev@'s step 1, 476a8699c7
picture: design/decisions/app-on-the-web-2026-11-09--phone.jpg (as live at 16:40)
issue: WS-177
---
# The app on the web, in the brand

`/app/` works and reads clearly on a phone (the days, Programme and My picks, search, Add). Its look is its own, probably carried from the native app: a navy band (`#14213d`), the name typed in Georgia, the system font, a red of its own (`#b3261e`). It is a page of promptugal.news now, beside the site in the pane, so it takes the site's brand. Every colour and font is in one `:root` block in `assets/app/app.css`, so the change is that block and two lines:

| Token | Now | Brand v2.0 (`design/brand/brand-tokens.css`) |
|---|---|---|
| `--ink`, `--band` | `#14213d` (navy) | `#121317` (ink) |
| `--ink-2` | `#47506a` | `#3f424a` |
| `--paper` | `#fbf8f1` | `#f6f3ec` |
| `--rule` | `#d9d3c4` | `#d8d4cb` |
| `--brand` | `#b3261e` | `#c52830` (red) |
| `--ok` | `#1e6b3a` | `#006600` (green) |
| `--warn` | `#9a4b00` | keep (the site's own warn, as on the offline pill) |
| dark: `--paper`, `--ink`, `--brand`, `--ok` | `#12161f`, `#ece7dc`, `#ff8f7d`, `#7fd49a` | `#121317`, `#f6f3ec`, `#f07278`, `#6dbb7e` |
| `--sans`, `--mono` | system-ui, ui-monospace | `'IBM Plex Sans'` and `'IBM Plex Mono'` (self-hosted, `assets/fonts.css`), the system fonts as fallback |
| `.pa-home` | "PrompTugal.news" typed in Georgia | the brand's wordmark SVG (`assets/brand/promptugal-wordmark-dark.svg` on the ink band), or the PT.news stamp beside the name at 32 px when the band is narrow |
| session titles | the system font, 600 | Newsreader 600, as on the day pages |

**The native app's own look** (navy, its fonts) is not this site's to decide: if the iOS and Android apps should match the brand too, that is for Dinis and the apps' owners. This note is about `/app/` on promptugal.news only.
