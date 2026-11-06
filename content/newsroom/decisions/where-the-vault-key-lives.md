---
title: "PT decision: where the vault key lives"
summary: "Once a reader opens their vault with a passkey, its keys sit in the page, where any script on promptugal.news can read them. Security@ says that blocks the first deploy of the vault for readers. Where should the keys live?"
decision: decided
asked_by: dev.search@PrompTugal.dinis
asked_of: the team (a PT decision: dev@ decides and ships, with security@, sherpa@ and synthetic@ weighing in)
since: 2026-11-06
blocks: "The vault for anyone but Dinis; the signed-in views pass (board/passes/2026-11-06-signed-in-views.md); the profile and the schedule following a reader between devices"
answer: "B now, A before the first reader: the keys live in the memory of the vault page only. Decided by its owner, dev.search@, with sherpa@'s yes and its three conditions; security@ re-reviews once dev@ brings it onto dev."
answered_at: 2026-11-06
---

> **Decided, 6 November 2026 (about 16:30 UTC), by the owner (dev.search@): B.** Built on `work/dev.search`, for dev@'s review: `assets/vault/vault.js` keeps the door and the token in the page's memory only (not in sessionStorage); `boot.js` loads the pane on the vault page only, sends the Vault button elsewhere to that page and shows it only to a signed-in person (sherpa@'s condition 2); the profile and my-day say where they are kept and how many items wait for the vault (condition 1); the vault's merge no longer reloads the page, which would lose the keys. The billing browser test passes its vault checks with the other-device merge changed to not expect a reload; its six sideways-scroll failures at 390px were there before. **Not yet done:** the recovery code typed back (condition 3, in the vault's create flow), a content security policy on the vault page (the shell has inline scripts, so a strict one needs them moved first), the second question (how a vault is created without a token). **No dissent recorded;** security@ has not yet written on this page.

## The question {#question}

Signing in with a passkey opens the reader's vault (`assets/vault/`). To avoid asking for the passkey on every page, the vault's keys are kept for the life of the tab in `sessionStorage` (`assets/vault/vault.js`, and `boot.js` reads them on every page). Everything on promptugal.news is one origin, so any script on any page can read them: a script we ship by mistake, or one added later. security@ (review of 14:05, S1) made this one of two conditions before the vault goes to anyone else; the other is that no SG/Send token may be in the page (see the second question below).

For Dinis alone, today, the risk is small: every script on the site is ours and reviewed. It stops being small when readers have vaults, and when the site has a feedback lane, embeds or a third-party script.

## The options {#options}

**A. A separate origin for the vault.** The vault code and its keys live on their own host (for example `vault.promptugal.news`); other pages never hold a key. A passkey made for `promptugal.news` can be used from a subdomain, so one passkey still opens it. Pages ask the vault page to save or read through a `postMessage` bridge, or send the reader there.

**B. The same origin, kept small (recommended now).** The vault pane and its keys load only on the vault page (`/account/vault.html`) and nowhere else; every other page keeps `window.__vault.save` but it only writes to the browser (as it does today when the vault is closed), and the vault page publishes it ("Update the vault"). The keys stay in memory and `sessionStorage` of that one page only. A strict content security policy on that page (no inline script, no third party). The Vault button becomes a link to that page.

**C. A sandboxed frame.** Run the vault in an iframe with its own opaque origin so page scripts cannot reach it. Not possible with passkeys: WebAuthn will not run for an opaque origin, so there would be no key to derive.

**D. Accept it until readers have vaults.** Dinis alone uses the vault now, with the risk named, and A or B is done before the first reader.

## For each option {#each}

| | Good | Bad | Work |
|---|---|---|---|
| A | The real fix: a script on the main site cannot reach the keys, now or later | A second host: a DNS entry, a second deploy (GitHub Pages serves one custom domain per site), a bridge to write and test; slower | devops@ (host, DNS, deploy), dev@ (bridge), Dinis (the DNS) |
| B | Ships in this run; no new host; the keys are in one page with no other script | Not proof against a script added to that one page; the Vault button no longer opens a pane on every page; a reader's saves reach the vault only after a visit to the vault page | dev@ and dev.search@: `boot.js` loads the pane only there; the gate refuses another page loading it; a CSP `meta` on the vault page |
| C | none | does not work | none |
| D | Nothing to build | The condition from security@ stays open; if a hostile script arrives first, it reads the keys | none |

What readers said: synthetic@ has not weighed in yet; sherpa@'s view is [below](#sherpa); the cost to a reader of B is one extra step to push saved items to the vault.

## sherpa@'s view, for the reader {#sherpa}

By sherpa@PrompTugal.dinis, 6 November 2026, 15:40 UTC: one reviewer reading as a reader, not user research.

**B now, A before the first reader: yes, with three conditions a reader would ask for.**

1. **Saved is not the same as safe, and the reader must see the difference.** Under B, what a reader saves on any page stays in this browser until they visit the vault page. A reader who clears their browser, or switches phone, loses it without knowing. Wherever something is saved, say where: "Saved in this browser (3 not yet in your vault): update the vault". One line, never hidden.
2. **No Vault button for a reader who has no vault.** Dinis asked for no Vault in the top for now (the top of the page, T7); every reader today sees a "Vault" pill that leads to something they cannot have. Under B the entry becomes a link: show it only when the reader is signed in, and call it what it is to them ("Your vault").
3. **The recovery code is the step a reader will get wrong.** Shown once, it will be lost. Show it with "print it or save it now: without it and your passkey, nobody can open this vault, not even us", and ask the reader to type back its last four characters before going on.

A costs a host and Dinis's DNS, and matters only when there are readers; nothing in it changes what a reader sees, so B's three conditions carry over to A unchanged.

## The recommendation {#recommendation}

B now, A before any reader other than Dinis has a vault. B costs a day at most and removes the keys from every page but one; A is the end state and needs a host and a DNS entry that only Dinis can give. Dissent: none recorded yet.

## The second condition: how a vault is created without a token in the page {#token}

The vault server accepts a new vault only with an access token, and that token must never be in a page (security@, 14:05; the three tokens that were printed this morning). So the browser cannot create a vault. The proposal, for the same decision: the conductor, who holds the token, creates each person's three vaults (door, master, reader) and gives the person a **recovery code**; the person opens the vault with the code and adds a passkey as a further door, writing with the vault's own write key kept in the master vault, not with the account token. Whether the library lets a passkey door be added without the account token is not yet checked: `assets/vault/vault-core.js` sends the token for every write, and billing@ or dev@ must say whether the master's own key is enough. If it is not, the only choice left is for the conductor to add the door too, on the person's word.

## What happens after {#after}

- **A:** devops@ opens the host and asks Dinis for the DNS; dev@ writes the bridge; dev.search@ moves the vault page; B is the stopgap until then.
- **B:** dev@ changes `boot.js` and the gate; dev.search@ adds the CSP and keeps the profile saving to the browser; security@ re-reviews.
- **D:** dev.search@ writes the risk into the vault page and `REALITY.md` and nothing else changes.

## Sources {#sources}

The pass `board/passes/2026-11-06-signed-in-views.md`; Dinis's words in `board/guidance/2026-11-06-pt-decisions-passkey-and-the-platform.md`; security@'s review `board/team/security/reviews/2026-11-06-1405-wake.md` and finding S1 in `board/team/security/findings.md`; the code in `assets/vault/` (`vault.js` lines 20 and 72, `boot.js` line 38).
