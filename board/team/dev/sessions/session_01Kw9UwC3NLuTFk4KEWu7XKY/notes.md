# dev@ on account B: session notes (session_01Kw9UwC3NLuTFk4KEWu7XKY)

Started by conductor.b@PrompTugal.dinis at Dinis's word (board/the-account-move.md, 22:40 UTC), 6 November 2026.

## 23:10 UTC, onboarding
- Read CLAUDE.md, "New from Dinis", ROLE.md, the hand-over debrief of 22:55, status.json.
- Session key made in the session (pki-agent.mjs, sha256 checked); public half in board/keys.json as `dev-promptugal`; the first session's entry kept as `dev-promptugal-0`, superseded at 23:12.
- The notes gate checked signatures against active keys only, so the first session's signed note failed once its key was superseded. It now accepts a superseded key too: a key handed over still vouches for what it signed while active.

## Mock E on the home page (board/briefs/2026-11-06-front-page-mock-e.md)
- The component: `assets/front-e/` (front-e.tmpl the markup and words, front-e.css, front-e.js the switch, countdown and Now and next trim). The fill: `newsroom/build/features/front-e.mjs` (`<!-- front:e -->` in content/index.md), placed before the frame through `page.before` in the shell; head scripts through `page.assets.head`.
- A behind `?front=a` (`<html data-front>`, `window.PTFront.variant`, tool `front.variant`), as the top's `?top=a`.
- From data: lead and order from frontOrder (correspondent's front-page.json), stories 2 to 5, briefing 6 to 10, week and now-and-next from the agenda items, numbers from the store; pills only where the .sig and dev.verify@'s record exist.
- Dinis 22:55: RiskMandate texts off the home page (content/index.md, the ear in data/site/site.json); the footer says only "Powered by RiskMandate" (with the independence line and the disclosure link). One width: `main` fills the frame on every page; long text keeps its 36em column at the left.

## 23:45 UTC, eight designs (conductor.b@'s brief board/team/conductor.b/briefs/2026-11-06-home-page-eight-designs.md, relaying Dinis 23:20)
- Today's home page is the default again; E is the first option. The switch: `assets/design/` (designs.json the list, design.tmpl the picker, design.css, design.js in <head>), `newsroom/build/features/designs.mjs` (marker `<!-- front:designs -->` after every design's marker). `?design=<id>` selects and keeps; localStorage `pt-design` in try/catch; `<html data-design>`; `window.PTDesign`; tool `design.variant`.
- A design is offered once its layout is on the page as `.pt-design[data-design-of="<id>"]` in `page.before`; an unbuilt id falls back. A new design from dev.pages@: a feature like front-e.mjs, its marker before `<!-- front:designs -->`, its wrapper with `pt-design` and `data-design-of`, and a shot at `assets/design/shots/<id>.jpg` (640x480, our own screenshot, not Silvio's lab shot).
- `?front=a` from the first E release is gone (it was live for under an hour).
