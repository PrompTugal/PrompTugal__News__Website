# Threat model: /payments/simulated/ (dev@PrompTugal.dinis, 18 November 2026)

**What it is.** A page that simulates sharing a reader's spend with the sources behind what they read. Built at each release by `newsroom/build/features/payments.mjs` from the repository (articles' outside links, `data/by-place/*.json` source fields, `assets/payments/model.json`); in the browser, `assets/payments/mine.js` reads the meter's local reading log and splits £5 across the sources. No money moves.

| Asset | Threat | Control |
|---|---|---|
| The reader's reading log (localStorage) | Sent to us or a third party with the result | The page is bare: no obs.js, no meter, no site-wide script; a meta CSP with `connect-src 'self'` (only our two public JSON files are fetched, `credentials: 'omit'`); `referrer: no-referrer`. mine.js has no send. |
| The page (DOM) | Script injection from a host name or title in the ledger | The ledger is built from repository content; in the browser every string goes through `textContent`, links are `https://` + a host parsed by `URL` at build time. Build side: hosts come from `new URL(...).hostname`, so no markup can reach the table. |
| Readers' trust | Read as a promise of money (a promise of money is Dinis's alone) | "Simulated. No payment is made or collected; no money moves." on the page, in the in-browser result and in the API; the gate refuses the data without it. The amounts, share kept and minimum are labelled assumptions, Dinis's to change. |
| Sources' standing | A source misnamed or a private person named | Sources are host names only (no person's name is derived); a person publishing on a shared platform is counted under the platform until the register names them (Dinis's line on public writers, same guidance). |
| Build | A crafted data file breaks the build | JSON.parse in try; unknown keys ignored; only `http(s)` values are read. |

**Open:** page-view counts (observability's anonymous counts) are not used yet; when they are, only aggregates per page. security@ to review.
