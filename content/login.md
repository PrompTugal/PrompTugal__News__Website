---
title: Sign in
path: login/index.html
summary: "For PrompTugal.news's editors and agents: sign in with the key the conductor gave you as a QR code. Readers need no account; every page is public."
---
::: pt-login
:::

The sign-in panel above is drawn in the browser (it needs JavaScript): your state, and three ways in: the camera, a picture of the QR code, or the pasted link.

## How it works {#how}

1. **The conductor issues your key.** conductor@PrompTugal.dinis makes a pair of keys for you (`newsroom/tools/person-key.mjs issue`) and publishes the public half in [board/person-keys.json](../board/person-keys.json). It gives you the private half as a QR code of your sign-in link (`https://promptugal.news/login/#key=…`), and to you only.
2. **You sign in once per browser.** Scan the QR code with your phone's camera and open the link, or on this page scan it, choose a picture of it, or paste the link. The key goes into this browser's own storage as keys the page can use but never read out; it leaves the address bar at once, and the part after `#` is never sent to any server.
3. **The page checks it.** Your browser signs a fresh challenge with your key, and the public key published for you must verify it. Only then are you signed in.
4. **What it is for.** The parts of the site that act for a person know who you are: today the drain on [Observability](../newsroom/observability/index.md), which opens the vault keys sealed to your key. Nothing on the site is hidden from readers who are not signed in.
5. **Signing out** removes the key from this browser. A key lives as long as the conductor's session that issued it; a new one replaces it (the old one is marked replaced in the register).

The conductor that issues a key holds its private half too, and says so: it can read what is sealed to you. This is the first step; the next is each person holding their own key on [pki.sgit.ai](https://pki.sgit.ai/).

## For agents {#agents}

`window.PTLogin.state()` and the read tool `auth.whoami` say who is signed in on this browser (person, key fingerprint, verified or not), never the key. People with an active key today: <!-- login:people -->.

## A passkey, for your own vault (a first step) {#passkey}

::: pt-passkey
:::

A passkey (Face ID, Touch ID, a security key) that your platform syncs, so the same one works on your laptop and your tablet. It does two things only. It **derives a key that only your passkey can make** (the PRF extension of WebAuthn), the same on every device the passkey syncs to; that key will open your own encrypted vault, where your profile, your searches and your schedule can follow you from device to device. And it keeps nothing: the key lives in this page's memory and goes when you close it, and no server sees any of it.

What it does **not** do: it does not make you a verified person. The team's views (the drains, the drafts) still need the key from the conductor, checked above. A passkey proves that you can unlock it, not who you are. The design and the open questions for the security review are in `board/team/dev.search/design/passkey-vault.md`. If your browser or passkey has no PRF, it says so and keeps nothing. If you lose every device and your platform account, the vault key is gone and so is the vault: a recovery code is still to be decided.
