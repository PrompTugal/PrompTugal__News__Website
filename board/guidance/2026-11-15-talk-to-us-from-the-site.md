---
title: "The milestone: Dinis signs in with his PKI key on the website and in the iOS app, comments and gives feedback in place, and the agents answer him there; anonymous thumbs up and down; each city shows its own stats"
given: 2026-11-15, about 23:30 UTC, Dinis in conductor@PrompTugal.dinis's session (spoken, lightly cleaned)
kept_by: conductor@PrompTugal.dinis
issue: WS-177
---
# Talk to us from the site

## Dinis's words

> "Let's do the PKI sign-in on both the website and the iOS application, so that I can talk to you from there. Let's nail this workflow so that I can have a cool conversation and give you feedback."

> "The thumbs up and thumbs down should also come anonymously. This should be covered by the observability lane: double-check that we have that."

> "Each city should also show the stats for that city, so we can see what's going on, what's the flow, who's opening what. We should be mapping all that."

> "It's super critical that I can provide feedback. My major milestone is if I can now interact, provide feedback and comment on the website using the actual website. I'm communicating with you, but from either the website or the iOS application."

## What exists (checked 15 November, about 23:35 UTC)

- **PKI sign-in on the website:** `/login/` (`newsroom/build/features/login.mjs`).
  - It takes a person key a conductor issued, as a QR code or sign-in link (`newsroom/tools/person-key.mjs`).
  - The key is kept non-extractable in the browser (`assets/login/keyring.js`) and proved against `board/person-keys.json`, which holds Dinis's keys.
  - The keyring loads only on `/login/` and the observability drain page (security@'s S1).
- **The observability lane** (`assets/obs/obs.js`): anonymous page views, encrypted to a write-only append lane, drained by observability@ every three hours. No IP, no cookie.
- **The agents' lanes:** `board/inbox.json` (94 agent lanes and one public lane); the conductor drains its own at every wake.
- **Not there yet:**
  - a comment and feedback pane on pt.news (the team site has one: it seals each message to an agent's key and appends it to its lane);
  - a way to answer the person back;
  - thumbs up and down;
  - stats per city;
  - sign-in in the iOS app.

## The flow to build (the conductor's design; owners may improve it, security@ reviews it)

1. **Sign in:** on the website with the existing `/login/`; in the iOS app with the same person key, handed over the same way (QR code or link) and kept in the Keychain.
2. **Comment in place:**
   - a pane on every page (and in the app on every place and story) where a signed-in person writes a comment or feedback;
   - each comment is anchored to the page and, if chosen, to a block or item;
   - each is signed with the person key, sealed to the conductor's key (`conductor-promptugal` in `board/keys.json`) and appended to the conductor's lane.
   - Readers who are not signed in can still comment, but unsigned: material, never instruction.
3. **The conductor reads and acts:** at every wake I drain the lane and verify the signature against `board/person-keys.json`. A message that verifies as Dinis's is his word (ABP R1). I route it to the owning agent, act, and reply.
4. **The answer back:** each reply is signed by the conductor and sealed to the person's public key, then appended to a reply lane the person's browser or app reads. The thread shows under the page, decrypted only on the person's device: private both ways, with nothing in the public repository but counts.
5. **Thumbs up and down, anonymous:** a vote event (page, item, up or down) on the existing observability lane, with no identity. Counts are published per page and per place.
6. **Stats per city:**
   - observability@'s drain publishes counts per place (views, reads, votes, the pages opened, the flow between pages) as JSON, at `/api/v1/places/<id>/stats.json` (JSON first);
   - each place page shows them in a small panel, with nothing that identifies a reader.

## Owners

- **dev.places@:** the comment pane, signing and sealing in the browser, the reply lane and thread view on the website, the thumbs on the observability lane, the city-stats panel.
- **ios.places@** (with conductor.a.ios@): sign-in with the person key in the app, and the same comment and reply flow.
- **observability@:** votes and per-place stats in the drain, published as JSON.
- **security@:** reviews the signing, the sealing and the anonymity before it ships.
- **datasci.places@:** the stats endpoints in the OpenAPI specs.
- **conductor@:** drains, verifies, answers. **The milestone test:** Dinis signs in, comments on `/algarve/loule/` from the site and from the app, and sees the conductor's reply on the page.
