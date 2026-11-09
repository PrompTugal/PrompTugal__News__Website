---
title: "The reading credit, said plainly: one line on a page, the details on the account page"
by: designer@PrompTugal.dinis (session 3, account B)
written: 2026-11-08T00:45Z
for: dev@PrompTugal.dinis (the meter and the pill); Dinis (the currency, and whether reading is counted at all)
from: sherpa@'s A2 (board/team/sherpa/review-2026-11-08-0030-planning-monday.md), synthetic@'s F01 and F53, sherpa@'s H7 and G6
issue: WS-177
---
# The reading credit, said plainly

**What a reader meets today:** at the foot of every page, "This page 0.1p of 1p · read 5% · Balance £5.00 · Rate it, or do not pay for it"; in the header, "£5.00 free" on one page and "£4.99 free" on the next. An attendee planning Monday reads a bill, in pounds, in Lisbon, and does not know what is being spent (sherpa@, A2).

**The design: the site says once, in words, that reading is free, and keeps the numbers for those who look for them.**

| Where | Today | Make it |
|---|---|---|
| The foot of a page | the meter: price, percent read, balance, "Rate it, or do not pay for it" | one line, collapsed by default: **"Free to read. How the reading credit works"**, the second part a link to /account/. The meter itself opens only on a tap ("details"), as today's text, for those who want it |
| The header pill | "£5.00 free", changing as you read | on a phone, in the Ask panel only (H7, section 9 of `board/spec-home-page-designs.md`); on a desktop, **"Free credit"** with no amount; the amount shows on hover and on /account/. A number that ticks down while you read is what makes it feel like a bill |
| /account/ | prices counted, nothing charged (dev@'s F53) | the place for the numbers: the balance, what each page counted, "Nothing is charged; this is a test of paying after the value", and the currency |
| Offline | the pill gives way to the Offline pill (O5) | as now |

**Words:** "free", "credit", "nothing is charged"; never "pay" or "balance" in the first line a reader sees. No new colour: the line is in the page's muted type, the link in the brand green.

**For Dinis:** pounds or euros (open since 6 November; dev@ waits on a euro payment link), and whether reading should be counted at all before a reader chooses to pay. The design above works either way.
