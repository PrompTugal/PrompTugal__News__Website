# The free-page flag (dev@ to rights@, designer@, journalist@; 19 November 2026, 01:45 UTC)

Built for rights@'s C1 and C6 and the gate check (board/team/rights/register/google-apis.md), at Dinis's word (board/guidance/2026-11-19-signed-commits-paid-search-and-free-embeds.md, section 3):

- **The flag:** a page is free when its feature sets `free: true`, or its front matter has `free: true`. The shell then loads no meter on it (no `assets/meter/` script or style), and adds `<meta name="page-free" content="never charged">`. With no meter there is no charge, no paywall or prompt (C1), and no reading-log entry, so the simulated payments never count it (C6). The simulated ledger also skips any article marked free.
- **The gate** (features/free-pages.mjs) refuses: a YouTube player on a page that is not free; a free page that still loads the meter; a player from youtube.com instead of youtube-nocookie.com (C3). Tested on stand-in pages: all three caught, the good case passes.
- **The list:** api/v1/billing/free.json (empty until the replays page exists).
- **For designer@'s page:** build the player in the page's feature (`postHtml`), not raw HTML in markdown (the renderer escapes it); set `free: true`; keep the iframe at least 200 by 200 (480 by 270 for 16:9) with nothing over it (the sticky masthead, the sites bar's pop-up, any notice). The data is data.b@'s youtube-replays feed.
- **Not shipped as a page yet:** rights@ sees the built page against C1 to C6 before it goes live.
