# S41 home-page lead: verification of weather@'s draft

Draft: `desks/weather-vicky/s41-lead.json` (weather@PrompTugal.vicky, commit `0338ca74`). Checked by reviewer@PrompTugal.vicky on 10 November 2026 against its sources as read at 17:24 UTC (portugal.gov.pt's declaration and news note, IPMA's LSB warnings, Web Summit's homepage and news page).

**Verdict: verified, with two changes for when it is written.**

- Standfirst: matches the declaration (mainland, Wednesday 11 November) and IPMA (red wind 12:00 to 21:00, gusts 120 and up to 140 km/h); Wednesday is the summit's third day.
- Developments 1 to 3: match their sources (the measures, translated; IPMA's red and two orange warnings; the minister's appeal).
- Change 1: the "Web Summit, Wednesday" text gets its time, as Vicky asked for S41's programme line: "As of 17:24 UTC, no change to Wednesday's programme had been announced on Web Summit's homepage or news page. Whether the suspension of outdoor events applies to any part of the summit has not been announced."
- Change 2: the minister's appeal re-read at 17:24 UTC; its "checked" moves from 17:01 to 17:24.

**Not written to `desks/correspondent/front-page.json`:** that file is outside reviewer@'s write grant (board/abp/reviewer.md) and the request came through another session. It waits for Vicky's confirmation in the reviewer's own session and a grant from Dinis or abp@ (or Vicky's acceptance of a logged write outside the grant). The times will be refreshed to the check made when it is written.

## Written, 10 November 2026, 18:37 UTC

Dinis granted reviewer@ the five lead fields of front-page.json only (policies.json, external.by_agent, commit `2df8bfbb`); Vicky confirmed in the reviewer's session. weather@'s refreshed draft (`c0587177`, with the red rain) re-verified at 18:37 UTC against IPMA, portugal.gov.pt (both pages) and Web Summit's homepage and news page; all unchanged. Written: standfirst as drafted; the three developments with checked 18:37; the programme line timestamped ("As of 18:37 UTC on Tuesday, no change ..."); last_checked 18:37; live null. lead.article and lead.why untouched.

**Held at 18:40 UTC, not released:** the gate failed on the home page ("index.html: 4 link(s) to the outside world without target=\"_blank\"", first https://websummit.com/blog/news/). The lead's source links are drawn by `newsroom/build/features/front-e.mjs` (its `lsrc` item, dev@PrompTugal.vicky's code, commits `7568bb64` and `1b1e7e82`), which does not add `target="_blank"` to outside links. That file is outside reviewer@'s grant, and the fix belongs to dev@; the reviewer does not change the values to pass the gate. The verified write is kept as a local commit and goes in, re-checked, as soon as dev@'s fix is on dev.

**Released at about 18:55 UTC** after dev@'s fix (`3828b266`: outside links in the lead open in a new tab). Re-verified at 18:53 UTC (IPMA, both portugal.gov.pt pages, Web Summit's homepage and news page; all unchanged; weather@'s draft changed only its check times, `872717be`); written with checked 18:53 and the programme line "As of 18:53 UTC on Tuesday ...". The held local commit was not used.

**Shortened, 21:21 UTC (Vicky's word via conductor.B@: "the front page has too many words"):** standfirst one sentence; the "Web Summit, Wednesday" line "Day 2 cancelled; Day 3 planned for Thursday." (Web Summit's post); two developments (IPMA's red wind and rain; the government's alert: schools closed, outdoor events suspended); the cancellation no longer repeated. No new facts; all re-checked at source at 21:21 UTC.
