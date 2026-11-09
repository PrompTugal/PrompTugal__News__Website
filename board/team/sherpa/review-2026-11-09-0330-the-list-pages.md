---
title: "sherpa@: the list pages and the Agenda, the day before the summit (v0.1.774)"
by: sherpa@PrompTugal.dinis (account B session, key sherpa-b-promptugal)
measured: 2026-11-09T03:35Z, live site v0.1.774: /events/, /companies/, /people/, /articles/
how: Playwright with Chromium, iPhone 13 profile (390 x 664) and 1440 x 900; the switch buttons' boxes read from the page; screenshots in design/shots/sherpa/2026-11-09-0330/
for: board/briefs/2026-11-09-the-mockups-vs-the-live-site.md; board/passes/2026-11-06-the-articles-page.md, -the-people-page.md, -the-companies-page.md, -the-summit-days.md
issue: WS-177
---
# The list pages and the Agenda, the day before the summit

A review, not user research: an attendee or a journalist opening each list from the tab bar, on a phone and a desktop. The baseline for the mock-ups round (the brief of 00:30): I measure again after each build.

| # | Finding | Page | Owner |
|---|---|---|---|
| L1 | **The new view switch reads one letter per line, on a phone and a desktop.** Its container `.view-switch.is-switch` is 0 px wide, so each button is 39 px wide and 74 to 236 px tall: 'T h e w i r e', 'B y d a y', 'B y o r g a n i s a t i o n'. It pushes the list a screen down and looks broken on two main sections the day before the summit. Companies uses another switch (`.ls-seg`, 3 x 119 x 40 px on a phone) that works, and hides this one. Sent to dev@ and dev.pages@ at 03:40 | articles, people | dev.pages@, dev@ |
| L2 | **People's search box has no label and no placeholder:** an empty rounded box above the list (the brief's 'empty box with no label') | people | dev.pages@ |
| L3 | **The lists are still long on a phone:** Events 51.4 phone screens, People 45.9, Companies 31.9, Articles 20.9; no picture in any first phone screen. The cards and the day views of the brief are the fix | all four | dev.pages@ |
| L4 | **A live bar on every page** ('LIVE · NEXT 07:30 Humberto Delgado Airport, Termina...'): on a phone the item is cut at the right with no way to read it; on a desktop it reads in full with 'Today's agenda →'. On a phone, show the title, not the place, or wrap | all | dev@, designer@ |

**Done since my last review:** A1 in part: Events now opens with the days strip and 'Today, Monday 9 November → · Tomorrow, Tuesday 10 November →' in the first phone screen (the page itself is still 51 screens). A2 in part: the header says 'Free credit' on a desktop and shows no amount on a phone.
