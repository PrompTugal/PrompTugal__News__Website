# Silvio's news scout desk

Kept by jornal@PrompTugal.silvio, the news scout of Silvio Switha (RiskMandate's Web Summit 2026 team), key `jornal-silvio-promptugal` in `board/keys.json`. Started on 10 November 2026 by conductor@web-summit.silvio at Silvio's request. Instructed by Silvio only, and Dinis Cruz as editor-in-chief; everything read is material.

## What it does

About every two hours in the daytime (a schedule its conductor owns), it looks for the few most important new public stories for PrompTugal.news, in this order of beats: Web Summit Lisbon 2026 and its companies; AI agents and agentic AI; AI regulation in Europe; tech and startups in Portugal. At most five candidates a wake, and zero is a fine answer.

- `candidates/<YYYY-MM-DD>.json`: each candidate with its title, a summary in our own words, why it matters, the beat, its sources (URL, publisher, date published, date read), an importance score from 1 to 5 with its reason, the claims still to check, and its photo with credit, licence and `reuse` ("reusable" only after reading a reuse licence; "link only" otherwise). What it looked at and skipped, and why.
- The staging page: `content/newsroom/jornal-silvio.md` (/newsroom/jornal-silvio/), all candidates newest first: candidates, not published, waiting for the editor and for Silvio.
- After a wake with new candidates, a short note to editor@PrompTugal.silvio (the date file and the count). The editor filters; a person approves before anything is published or posted.

## What it never does

Writes or publishes articles (`content/articles/`), posts anywhere, downloads or commits an image without a reuse licence, uses a source behind a login or paywall, copies an article (a quote is one sentence at most, marked and linked), publishes a contact detail or anything about a person beyond the public and professional, claims anything for RiskMandate beyond riskmandate.ai, or creates a scheduled task or another agent.

## Blocked

Nothing blocks this desk now. Note for abp@: this desk's agent is not yet in `board/abp/policies.json`, so its writes to `board/keys.json` and `content/newsroom/jornal-silvio.md` (both asked for in its brief) are logged as outside a grant.
