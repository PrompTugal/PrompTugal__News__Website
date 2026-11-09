---
title: "The news app on the web: a phone beside the news, resizable to an iPad, installable, with a beta list"
by: conductor@web-summit.dinis (the main conductor), from Dinis's words
written: 2026-11-09T14:45Z
decided_by: Dinis Cruz, 9 November 2026, about 14:40 UTC (spoken in the main conductor's session)
for: conductor@PrompTugal.dinis, conductor.b@PrompTugal.dinis (dev@ and its workers on account B), outreach@PrompTugal.dinis; reference: conductor.B@ios.PrompTugal.dinis
---
# The news app on the web

## Why

Dinis: *"We really have a problem with the Apple distribution, because even the external testers is taking like 48 hours, 24 hours at least, which is too slow for the speed of development that we're in."* And the app is good: *"the scheduling was already useful ... better than anything else I had."*

So: **"I want to run the iPhone app on the web, because it's really good and we can distribute it and we can get users there."** Anyone who reaches promptugal.news can use what the native app does, today, with no store in the way.

## What the reader sees

1. **On promptugal.news, the app opens in a pane on the right,** drawn as a phone. *"You shove everything to the left so you don't lose stuff on the side."* The news stays readable on the left.
2. **Resizable:** drag the pane wider, from phone size to iPad size, still inside the site.
3. **Full screen:** one button, and one to come back to the site.
4. **Installable** (*"that sort of shortcut thing that you can add to your iPhone"*): a web app manifest and service worker, so "Add to Home Screen" gives an icon that opens full screen like an app. It also works on Android.
5. **The same features as the native app,** as close as the web allows:
   - choose sessions, see clashes, busy and free picks, "split my time" (the same rules as the native fixes, `briefs/2026-11-09__news-app-clashes-and-the-map/` in the iOS repository);
   - **Add to Calendar:** an `.ics` per pick and one for the whole programme. Every calendar accepts these. A live calendar connection is not needed.
   - **Location,** asked only when the reader taps "show me on the map" (the browser asks with its own prompt), used only in the page, never sent;
   - **the venue map** and "where I need to be" in the next 10 and 20 minutes (from the event data's `place` and `where`, and later `shows_as`);
   - later: what happened at each session, for people who could not go, went only one day, or want to catch up. *"A really good application to see after the summit."*
6. **Storage:** the browser's local storage first; vaults later (the reader's own vault, as in the team's messaging plan).

## The beta list (a little FOMO)

- A **"Get the app first"** button in the pane: leave an email to join the TestFlight and Play testers when the app is approved.
- **It is private:** the email goes on an **append lane** that the Web Summit team drains into its private CRM (`channels/beta-testers/`), under the comms protocol. Nothing about the person lands in this public repository.
- **outreach@PrompTugal.dinis keeps an eye on the count** (the number only, no names) and the follow-up drafts. The main conductor drains the lane at its hourly wake and files each sign-up in the private CRM.
- When the app is approved, a person sends the invitations.

## How to build it

- **The web app is new code in this repository** (`assets/app/` and a page `/app/`), built from the same events and companies JSON the native app reads. Mirror the native app's screens; `ios.app.promptugal.news` shows them, from `website/screens.json` in the iOS repository.
- **Share the rules, not the Swift:** the clash and busy/free logic, the walking times and the calendar export are written once as plain JavaScript and JSON, in **PrompTugal/PrompTugal__App__Mobile** (mobile@promptugal.ai.dinis), so both native apps can check against them.
- **The pane** must not break the site on a phone. On a narrow screen, the "Open the app" button opens it full screen.

## Order

1. The pane and full screen, with the schedule: picks, clashes, busy and free, and Add to Calendar (.ics). **Today, while people plan the summit.**
2. "Add to Home Screen" (the manifest and service worker) and the beta-list lane.
3. Location and the venue map.
4. Resizing to iPad size; after the summit, the catch-up views.
