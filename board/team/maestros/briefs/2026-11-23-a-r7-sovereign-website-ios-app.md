# R7 expanded: the Sovereign Website app for iOS (Dinis, 23 Nov 2026 ~19:00 UTC, in a.maestro's session)

Recorded by a.maestro (account-a) from Dinis's words (a voice brief; quotes are his). It expands R7 of `2026-11-23-a-any-agent-routing-chain-of-evidence-ios.md`. Owner: a.ios (account A).

## Why
"A, I think it's going to be quite a powerful capability. B, solves a ton of problems from usability point of view. C, there's also the whole thing of running models locally, so you have proper sovereignty."
- **Hosted models still fit:** even with a hosted model such as Grok, the websites stay properly sovereign.
- **Local hardware:** the Kickstarter idea runs on a Raspberry Pi and local devices.
- **iOS first:** "A, I'm on iOS, B, we could always move it to Android, C ... a lot of the target audience that I want to go for is already there", and it has Apple Intelligence.

## The scope, in three tiers
1. **Feedback on a site that exists: this works now.** Send someone the QR code of a vault. They open it, load the vault locally and see the website, then send comments by voice or text to our agent, which makes the changes. They keep an eye on it, and the app pops up when something has changed. "all we have to do is an append lane, and we already have that append lane done ... voice debrief already has that on steroids."
2. **Edits made locally with Apple Intelligence.** There are two modes:
   - (a) the app sends the changed HTML and we push it to GitHub;
   - (b) the user connects their own GitHub and the app walks them through it.
3. **A website from scratch:** upload photos and pick one of our themes ("depends how good the templates are"), helped by a frontier model where it is worth it.

**Across all three:**
- storage in iCloud as a zip, and how that is shared and published;
- publishing integrations (Netlify and other hosts);
- everything voice-driven;
- public testing through TestFlight.

## The first demo: Thursday 26 November, the Chiswick Cheese Market team
"Imagine demo saying, do you want to make a change to the website? Just speak here, and then the agent will come back to you, right, in a couple of minutes." Dinis can replay past examples if it is not live.

What exists now:
- **The site's lane:** Site__Organisation__Chiswick-Cheese-Market already has `/send/` (inbox.json, the site's recipient key) and `/send/edit/` ("the site on the right, the conversation with the keeper on the left").
- **The keeper:** chiswick-cheese-market.c on account C (session_01Kw9UwCvCX638VWVq9UPXsN).
- **The app:** VoiceDebrief already records, transcribes on the device, seals and sends, and shows replies.

The shortest path to Thursday is tier 1 inside VoiceDebrief:
1. scan the site's QR code;
2. show the site;
3. hold to speak;
4. seal the request to the site's `/send/` recipient (the Grace Farrell format);
5. show the keeper's reply and a "site changed" notice.

It reaches the device through TestFlight, which waits on Dinis's yes (A4). The keeper must be awake on Thursday; c.conductor is asked.
