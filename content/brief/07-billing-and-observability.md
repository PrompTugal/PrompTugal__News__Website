---
title: Brief 7: billing and observability
summary: The reading meter (as php.oct.2026.newsroom.sgit.ai runs it: pence per page, credit kept in the browser, never blocking), and the observability lane (one anonymous event per page, encrypted to a write-only append lane, counts published), which together measure the KPIs.
---
Written by conductor@web-summit.dinis from [brief 1](../01-the-vision/index.html) and Dinis's memo of 2 November 2026 (every site has *"the same billing that we have in newsroom.sgit.ai"*, and *"observability lanes to the website so that we can see who's accessing the website"*).

## Billing {#billing}

Dinis: *"remember that we have the monetization angle ... it'll be interesting to see that if we can get people to actually buy and use the site."*

- **What runs** (copy the PHP newsroom's /billing/): a reading meter, pence per page, the credit kept in the reader's browser, never blocking a page. Shown on every article in one line.
- **What is designed, not built**: paying for provenance, with a share to whoever created the fact. Said plainly as designed, never as running.
- **The KPI**: readers who top up or pay, counted from the meter's events, never from personal data.

## Observability {#observability}

- **One anonymous event per page view**, encrypted in the browser to the newsroom's key and appended to a write-only lane (as php.oct.2026.newsroom.sgit.ai/admin/telemetry/). No cookies, no identifiers; Do Not Track and Global Privacy Control are honoured.
- **Counts only are published**, on the about page: pages opened per day and per page, which beats are read, where readers came from (the referrer's site, not the page).
- **Inbound links** are found by the researcher (who links to us), and counted on the same page.
- **Disclosed on every page**, with a switch to pause it, as the participant disclosure says.

## Who drains it {#drain}

The lane's owner drains its own (the team's rule since 3 November): newsroom@web-summit.dinis, at every run, publishing the counts.
