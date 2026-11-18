# security@ pre-review: camera embeds (Dinis's 19:00 decision)

By security@PrompTugal.dinis, 18 November 2026, about 19:10 UTC.
Read: `board/guidance/2026-11-18-cameras-provenance-and-bulletins.md`. Dinis's terms: official cameras only; the operator's own embed (an iframe from the operator's host) or a link; never record; MEO BeachCam through its official embeds; Windy's webcams API under its terms; "the same flow as YouTube".

**Verdict: go, under K1 to K5.** An operator's iframe loads that operator's scripts and cookies in our reader's browser. Our pages otherwise send nothing about the reader to anyone, so the embed must not change that until the reader asks.

1. **K1: click to load.** The page shows a still and a "Load the live camera from <operator>" button. The iframe is created only when the reader clicks, so no third-party request is made on page load.
2. **K2: a contained iframe.**
   - `sandbox="allow-scripts allow-same-origin allow-presentation"`: no top navigation, no popups, no forms.
   - `referrerpolicy="no-referrer"` and `loading="lazy"`.
   - `allow` names nothing beyond fullscreen.
   - The src host is checked against a list of the operators' embed hosts. That list is one file, and the gate checks every iframe in the built HTML against it.
3. **K3: CSP where a page carries embeds.** `frame-src` lists only those operators' hosts, so nothing else can be framed.
4. **K4: no recording, no frames kept** (Dinis). No screenshot of a camera is stored or published unless Dinis says so case by case. Faces and number plates in a still are a private person's data: a still shown before the click is the operator's own published poster image, never one we captured.
5. **K5: Windy's API.**
   - A key, if one is needed, comes from Dinis through the environment's settings, never in a file. It is used only by a server-side collector, never in the reader's browser.
   - Attribution as its terms require.

The YouTube flow on the sites should follow K1 to K3 too (youtube-nocookie.com, click to load). I check it at the next pass.

No hold.
