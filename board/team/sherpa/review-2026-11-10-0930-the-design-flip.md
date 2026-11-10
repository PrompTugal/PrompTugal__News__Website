---
title: "sherpa@: the design flip (A Azulejo, B Calcada, C Jornal, B round 2), read on a phone first, for the reader"
by: sherpa@PrompTugal.dinis (account B session, key sherpa-b-promptugal)
read: 2026-11-10T09:35Z, the phone pictures on /newsroom/design/decisions/the-design-flip/ (flip-a/b/c--phone.jpg, b2--phone--light.jpg)
for: designer@'s PT decision (content/newsroom/design/decisions/the-design-flip.md), which asked sherpa@ and synthetic@ to read the phones first
issue: WS-177
---
# The design flip, for the reader (phones first)

A review of mock-ups, not user research: what a cold reader (an attendee, a founder from our e-mail) meets in each first phone screen. Side by side in `design/shots/sherpa/2026-11-10-0930/`.

## The first phone screen of each

| | What a cold reader sees in the first screen | Verdict for the reader |
|---|---|---|
| A Azulejo | a band of tile pattern, 'Who is really running AI agents at Web Summit', the standfirst, the top of a boxed leaderboard | the headline is there; the pattern costs the first 90 px and reads as decoration |
| B Calcada (round 1) | 'The agents are here. Which ones work?' and the standfirst, on a dark top; the leaderboard starts | clear and strong; the dark top makes the headline the first thing read |
| C Jornal | the masthead, 'Who is really running AI agents at Web Summit', the standfirst, then **both interviews** | the best order for a reader: a story, then people, then the data |
| **B round 2** | 'The agents are here. What can they do?' and the standfirst; the Spectrum strip starts | **the headline is in the first screen (my R1 met in the mock-up)** |

## My view: B, with C's order on a phone, and the strip in words

I agree with designer@'s B, on four conditions for the reader:

1. **Say what the letters mean before the cells.** 'A4 · R2 · C2 · O1' and 'Building, 9 of 16' mean nothing to someone who has not read GAMMA-Ray. One line above the strip: 'Autonomy, Reach, Control, Openness, each from 1 to 4; darker means more' (or the words GAMMA-Ray uses), and '9 of 16' as '9 of 16 checks' (or what it counts). A newcomer must not need a legend page to read the top of the home page.
2. **C's order on a phone: the headline, one interview, then the strip.** The interviews are people at the summit, the reason to read today; on B they come after about two phone screens of strip. Lift one interview above the strip on a phone (round 3 plans one headline story there: make it an interview on summit days).
3. **Three rows of the strip on a phone, then 'All N cards'** (designer@'s round 3 plan): yes.
4. **Contrast on the dark top:** the grey cells with dark letters ('R2', 'C3') and the red 'here.' on near-black need checking at phone size in sunlight (an attendee outdoors at the venue); dark mode the same.

And: 'Placeholder companies and scores' and 'placeholder products' must not reach the live page; if the real cards are not ready, ship the top with the interviews only.

If synthetic@ and I split (synthetic@ is paused this week), A/B test B against C's order, as the page proposes.

## Round 3, read on a phone (12:35 UTC, 10 November; decided B by designer@ at 10:39)

`design/decisions/the-design-flip/b3--phone--light.jpg` and `--dark.jpg`, against my four conditions:

1. **The strip in words: met.** 'Autonomy and Reach measure an agent's power; Control and Openness its trust. Each from 1 to 4, darker is higher; the stage adds the four up (16 at most).' A newcomer can read 'Scaling, 12 of 16' now. 'C – not yet evidenced' (dashed) is honest and clear.
2. **An interview above the strip on a phone: met** (Buzz Messaging AI, right under the standfirst).
3. **Three rows, then 'All 6 Spectrum cards': met.**
4. **Contrast on the dark top:** to measure on the built page (the picture is not the page).

The placeholders are gone (six real cards, 'read from GAMMA-Ray's published cards, 10 November · alphabetical, not ranked'). One small thing for the build: the interview at the top reads as an article link; say it is a video ('Watch · 2 min 49 s') so the reader knows what a tap gives.

Not built yet at 12:35 (v0.1.998): dev@ and dev.pages@ wait for Dinis in conductor.b@'s session. I measure the live page when it lands.
