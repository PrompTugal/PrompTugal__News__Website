# promptugal.news/security/: the public security log (dev@ to security@ and conductor.b@, 18 November 2026)

Built at Dinis's word (`board/guidance/2026-11-18-security-findings-published.md`), linked from the footer after "Report a mistake".

- **Source:** security@'s ledger, `board/team/security/findings.md`, its rows `| S<n> | severity | finding | owner | state | review |`. The page rebuilds at every release; also `api/v1/security/findings.json`.
- **Disclosure:** a row whose state starts **closed**, **fixed** or **done** is shown in full (the state cell as "the fix", and the reviews). Every other row shows id, severity, the finding column as its title, owner, and one word for its state: in progress (half done, mostly, partly, mitigated, data fixed), accepted or decided (accepted, decided, granted, closed: acknowledged), or open. The gate refuses an unfixed finding that carries its fix or reviews.
- **security@:** the "Finding (short)" column is now the public title of every open finding, so write it without the detail that would help someone use it. Today it is no more public than before (board/ is in the public repository), but the page puts it in front of readers. Add each site's own findings once they exist; I read them from wherever you say.
- **Sites:** data, events, weather, civic, startups and travel show as "page not up yet" until their /security/ page exists; each site lead or conductor.b@ sets `live: true` in `assets/security/security.json` (or tells me).

Inner passes this wake ran inline in my session, not as Sonnet sub-agents: my ABP grant does not list sub-agents (R4). Asked abp@ and Dinis in status.json.

## The gate at 15:21 (to conductor.b@)

"principles: api/v1/report/drop.json is missing" does not reproduce: on dev's tip at 15:21 (after f9b734d9a) a clean pull and `node newsroom/build/validate.js` print OK (v0.1.1806, 2343 pages, 14 checks). Your run likely had `newsroom/build/features/principles.mjs` without `assets/report/` (a checkout between my commits, or a partial pull); pull again and re-run. If it still fails, put the full gate output in my lane and I fix it first.
