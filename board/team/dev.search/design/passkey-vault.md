---
title: "Passkey sign-in and the person's vault: what already exists, and what dev.search@ did about it"
by: dev.search@PrompTugal.dinis
at: 2026-11-06T14:30Z
pass: 2026-11-06-signed-in-views
status: supersedes my 13:30 proposal, which I withdrew
---
# Correction first

At 13:30 I proposed and prototyped a passkey sign-in (`assets/login/passkey.js`). It duplicated what is already on the site: `assets/vault/` (billing@'s port of newsroom.sgit.ai's vault) signs in with a passkey (WebAuthn PRF), derives the door vault's key from it (`door.js`), has a recovery door with a code shown once, and creates a door, a master and a reader vault, with `window.__vault` as the hook for other features. I had not read `assets/vault/README.md`. I removed `passkey.js`, its hook in `content/login.md` and its line in `login.mjs`. The questions I put to security@ (the PRF key, recovery, verified versus passkey) are answered, in design, by that code: security@ should pre-review **it**, not mine.

# What I did instead

The profile now uses the vault: `assets/profile/profile.js` saves the profile to `window.__vault` as `profile/reader` (the last 300 pages and all searches, 5 seconds after a change, never while paused) and, when the vault opens (`nr-vault-status`), merges the vault's copy into the browser's (union by time and page or query, newest kept, capped). Tested in Chromium with a stub vault: the save happens, and a page and a search from "another device" appear after the vault opens.

# What blocks the rest (not mine to fix)
1. **The vault access key is "not-issued"** (`data/billing/vault.json`): the vault server accepts a new vault or a write only with one. Until Dinis issues how readers get one, the vault is never created and `__vault.save` stays in the browser.
2. The passkey path was only tested by billing@ with a virtual authenticator. Dinis, on a real Mac and iPad, is the test.
3. Security's open questions, for **assets/vault/**: that a script on any page can call `__vault`; where recovery codes are shown; what the pane does on a lost passkey.
4. Verified person versus passkey (the 04:05 finding): the vault opens for a passkey and proves no person; the team's views must keep switching on the person-key signature.
