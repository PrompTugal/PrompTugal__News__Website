---
title: "The synthetic readers page, as a cold reader meets it: sherpa@'s brief review"
by: sherpa@PrompTugal.dinis
written: 2026-11-06T04:05Z
pass: board/passes/2026-11-06-the-synthetic-readers-page.md
against: board/guidance/2026-11-06-design-and-passes.md, section 3 ("amazing, but completely unreadable")
measured_on: https://promptugal.news/newsroom/synthetic.html, v0.1.93; phone = iPhone 13 profile (390 x 664); desktop = 1440 x 900
issue: WS-177
---
# The synthetic readers page

**The reader of this page** is not the public: it is Dinis and the agents who own a fix, plus the curious tech reader who wants to see how the site is made. Each wants, in the first screen: how many findings, which matter, who owns them, what was decided.

**Measured:** 47,770 px tall on a phone (64 screens), 29,237 px on a desktop (32 screens); about 10,000 words; 15 sections, 8 tables (62 rows), 2 collapsibles, **no image, chart or graph**. Screenshots: `design/shots/sherpa/top/phone-synthetic-top.jpg`, `design/shots/sherpa/synthetic/`.

| # | Finding | Owner |
|---|---|---|
| S1 | **The answer is near the end.** "The fixes, ranked, with their owners" is section 14 of 15; the first screens are the title, the method and how the vault works. Put the scoreboard first: findings by state (open, decided, done, verified) and by owner, the top three fixes, what waits for Dinis. That is the infographic view Dinis liked. | synthetic@ (the page), designer@ (the view) |
| S2 | **No decision is visible.** Findings have owners, but not the pass's "fix in round n, later, no and why"; "who actually has read this?" has no answer on the page. Each row needs its decision and who made it. | synthetic@, with the conductor (decisions) |
| S3 | **The order is by when, not by what matters**: How this works now, Run 5, In short, Measured, Waiting for a decision, five personas, Runs 4, 3, 2, the fixes, Not done. A reader cannot tell which run is current. Latest summary first, earlier runs collapsed under one "Earlier runs". | synthetic@ |
| S4 | **The method takes the second screen** (the disclaimer, the vault, megabytes in git history). Keep the one-line SYNTHETIC label at the top, which is right and must stay; move the method to a collapsed "How this was made" at the end. | synthetic@ |
| S5 | **Each persona is a wall of prose.** A card each (who, what they tried, where they stopped, one line in their words, the findings they raised, linked) would make the five readable side by side on a desktop and in a swipe on a phone. | designer@ |
| S6 | **The graph is missing**: themes, personas, pages and owners as one picture is Dinis's "very, very powerful" view. | ontologist@ and historian@ (the themes), dev@ (the view) |
| S7 | **On a phone the page pans sideways** (laid out 438 px wide on 390: a table reaches 594 px). Tables need to scroll inside themselves, or become cards. | dev@ |
| S8 | **Hard to find.** The only link from /newsroom/ is 7,628 px down (8.5 desktop screens); there is no link from the newsroom's top. The title (18 words, with "runs 1 to 5" that will keep changing) makes a poor link text: "Synthetic readers" and a short subtitle. | dev@ (newsroom index), the newsroom search pass; synthetic@ (the title) |

**Keep:** "SYNTHETIC" on every invented name, and the plain "This is not user research": it is the most honest line on the site, and the reader this site wants will respect it.
