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

## Re-measured (06:35 UTC, 9 November, v0.1.796)

| # | 03:35 | 06:35 |
|---|---|---|
| L1 the switch one letter per line | open (urgent) | **done:** Articles, People and Companies all use the working switch (3 x 119 px on a phone), the broken one hidden |
| L2 People's search unlabelled | open | **done:** 'Search a name, role, organisation' with '285 of 285' |
| L3 the lists long on a phone | open | Articles now opens as the approved wire (picture, kicker, headline, summary; search, a topic filter, '41 of 41'), 20.1 phone screens; People 57.1 (longer: one card each), Companies unchanged |
| L4 the live bar cut on a phone | open | open |

**Search, tested on a phone:** typing filters as you type and the count follows (People 'founder': 78 of 285; Articles 'Brazil': 6 of 41; Companies 'security': 20 of 120); the view and the query stay in the address (`#v=org&q=founder`), so a link shares it; no match says so and how to clear it ('No one matches. Clear the search.'). Keep.

**New, D1:** the days index (`/days/`) on Monday opens with Friday 6 November, a past day, and its strip shows Fri 6 to Wed 11 with Thu 12 and Fri 13 off screen; during the summit, open on today and keep the past days below (the summit days decision: past days as they were, after the coming ones). Owner: dev.pages@.

## Re-measured (09:35 UTC, 9 November, v0.1.814)

- **Companies is the approved page now:** cards by field, the switch (By field, By country, Search first), search with a field filter and '120 of 120'; **11.1 phone screens, down from 31.9**; 5.0 on a desktop. Keep.
- **The day pages are live:** Tuesday 10 November opens with 'Planned: Tuesday 10 November, as listed on Monday 9 November. Times and rooms can move', 76 items, and the three views (Five things, Every session by time, By stage), five things by default: as decided. 5.0 phone screens. On a phone 'By stage' wraps to a second row exactly under the tab bar in the first screen (it shows on the first scroll): minor, D2.
- **Still open:** D1 (`/days/` opens on Friday 6, a past day, during the summit), L4 (the live bar's item cut on a phone: it now says 'NOW 07:30 Humberto Delgado Airport, Termina...', the registration that runs to 22:00), and on the graphs G1 (the Algarve network's names cut at both edges on a phone; dev.graphs@ is back on).

## Re-measured (12:35 UTC, 9 November, v0.1.838), the day of Opening Night

- **The default home page answers 'what is on today' in its first phone screen:** the days strip with Mon 9 'Today', then 'Today at Web Summit: Monday 9 November. Five things to plan around, then the whole day.' Keep. It is 18.1 phone screens long (15.8 on 8 November), with no picture in the first screen; Opening Night (18:00) is in the five things but not in the first screen.
- **L4, in part:** the live bar now shows the time and the place ('NOW 12:00 Registrati... Pavilhão de Portugal'), but the title is cut to one word on a phone. Show the title and drop the place on a phone, or let it scroll once.
- **D1 open:** `/days/` still lists Friday 6 first; today is the fourth heading ('Monday 9 November (today)').
