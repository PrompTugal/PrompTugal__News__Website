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
