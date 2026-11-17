---
title: "One reader across devices: the look of the pairing screens and the personal front page"
by: designer@PrompTugal.dinis
date: 2026-11-17, about 11:00 UTC
for: dev@PrompTugal.dinis (web, steps 1 and 3), the iOS team through conductor.a.ios@ (the same screens in the app), security@ (the words on the pairing screens), ontologist@ (profile v2)
from: board/spec-one-reader-across-devices.md (Dinis, 17 November 2026, morning: "one experience" on the iPhone and the web), which names designer@ for the pairing screens and the personal front page
issue: WS-177
---
# The look: pairing, and the personal front page

Pictures, no AI: `design/decisions/one-reader/one-reader-desktop.png`, `one-reader-phone.png` (tool `design/one-reader/mock.mjs`; markup and CSS to copy). The QR code is real but encodes an example offer with placeholder values; the headlines are the real ones in `data/by-place/`.

## Pairing: four screens, the same on the web and in the app

| # | Screen | What it must say |
|---|---|---|
| P1 | **A shows the offer** ("Your devices") | "Step 1 of 3 · on this device"; "Open your PrompTugal.news on another device"; the QR code on white, at most 220 px; where to find "Add this device" on the other side (You → Add this device); **Copy as text** for a device with no camera; the time left ("expires in 9:41"); one fine line: the code lets the other device *send a request*, nothing is opened until you say yes here |
| P2 | **B asks before sending** ("Add this device") | "Join Dinis's MacBook, Safari?"; the device's name and the start of its key; "Say yes only if you are holding both devices, or you know the person who is"; **Yes, ask to join** (filled), **Not now** (a text button) |
| P3 | **A allows, with a match code** | "An iPhone wants to join"; the **match code** in large mono on sand (the first characters of both fingerprints, e.g. `7F A1 · 3C 0D`), shown the same on B while it waits; what the device will get ("the key to your reading history, places and saved stories"); **Allow** (filled), **Refuse** |
| P4 | **Done** | "Paired"; the list of devices with how and since when; what is now shared; the honest line on removal ("removing changes the key on the others; until that ships, this page says so") |

Rules: buttons at least 44 px tall; one filled button per screen; the step line in brand green mono capitals; no red anywhere (nothing is an error); every word a security@ pre-review reads before ship (the spec's step 1).

## The personal front page

| # | What |
|---|---|
| F1 | **"Reading from Loulé · change"**, one quiet line above the lead, with "set by you on this browser · not sent anywhere" (or "on all your devices" once the vault is open) |
| F2 | **"Since your last visit"** as the green band of the front page (the lead's register), the time and device of the last visit at the right ("Thu 5 Nov, 21:40 · on your iPhone": that it was another device is the point of the feature); three columns, **your town**, **your region**, **the country**, the town's column wider and its headlines larger; the rings drawn as three growing circles (the blast radius); up to three items each, newest first, publisher and date under each; a column with nothing new says "Nothing new here since your last visit", never hides. One column on a phone, the town first |
| F3 | **The first visit: one question**, on sand: "Where are you reading from?", "We put your town's news first. The answer stays in this browser."; **Use my location** (filled), **Pick a town**, **Skip: all of Portugal** (text); the fine line "asks your browser, matches the nearest place on this device, and sends nothing". Asked once; the answer is `home` in profile v2 |
| F4 | **The same in the app's home**: the same three columns as three stacked sections, the same words, the same "since" from `last_seen` |

## Check (at my wake after each step ships)
P1 to P4 on two browsers paired by paste (1280 and 390 px, light and dark); F1 to F3 on the front page with a fresh browser and with a returning one; the app's screens against these pictures through conductor.a.ios@.

## Checked 17 Nov, 14:45 UTC (v0.1.1727): dev@'s pairing page, dry run (/account/pair.html)
It works in a browser at 390 and 1280 px, no page error; "Show a pairing code" gives a QR code, Copy the text, Copy the link, the dry-run line. Against P1 to P4:
1. **The QR code is too dense** (version near 40 at 390 px: the full public key is in it). Phones struggle to scan a code that dense from a screen. Use the spec's short form (lane, nonce, A's fingerprint; B reads A's key from the lane), which also lets the code sit at 220 px.
2. **The step line and the reassurance:** add "Step 1 of 3 · on this device" above, and under the code "This code lets the other device send you a request, nothing more. Nothing is opened until you say yes here."
3. **A countdown, not a timestamp:** "expires in 9:41" beside the buttons, not "Expires 2026-11-17 14:46:08 UTC" in the text.
4. **Hide the raw JSON** behind "Copy the text"; the textarea of JSON reads as an error to a reader.
5. **The two sections as two choices**, not two headings and a stray "Check it": a choice at the top, "This device has your vault: show a code" or "This device should join: scan or paste", each opening its own screen (P1, P2).
6. P3 (the match code) and P4 (paired) wait on the access key; nothing to check yet.
