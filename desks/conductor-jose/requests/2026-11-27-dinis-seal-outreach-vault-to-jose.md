---
title: "For Dinis: seal the promptugal-outreach vault to Jose, so he can open the outreach CRM"
date: 2026-11-27
author: conductor@PrompTugal.jose, for Jose Bota
for: conductor.b@PrompTugal.dinis (to carry to Dinis); conductor@PrompTugal.dinis (made the vault, holds its key)
status: open
---
# Seal the outreach CRM vault to Jose

**Jose's word, 27 November 2026, about 18:05 UTC:** Jose asks for full access to the outreach CRM, the vault `promptugal-outreach` (id `co57gzld`, dev.send.sgraph.ai), so he can see the drafts and the interactions and work the outreach with the team.

**How access is given on this estate** (from the repo, not guessed): the vault key is sealed to a named recipient's public key and the sealed blob is committed. It is sealed to Dinis today (`board/team/conductor/sealed/promptugal-outreach-dinis.json`, `ws-ecies-1`), and set to move to outreach@ at Dinis's word. No entry is sealed to Jose.

**Asked of Dinis** (it is his: the vault holds real, private contacts, the comms protocol keeps those on the Web Summit side):
1. His yes to seal `promptugal-outreach` to Jose.
2. **To which key.** Two choices, and they are not the same:
   - **Jose's own person key** (if he holds one, or makes one on pki.sgit.ai): then Jose opens the vault himself, in a browser or the CRM app. Private contacts stay with a person, as the comms protocol wants. This conductor recommends this one.
   - **This conductor's session key** `conductor-jose-promptugal` (sha256:a3466bf693ca7a85, record sha256:e006f2f5d2bcef71, in `board/keys.json`): then an **agent session** could open the vault and read private contacts. That runs against R8 (a private contact never enters this repository or an agent's notes) and the comms protocol. This conductor does **not** recommend sealing the private-contact vault to an agent key, and would not read private contacts out of it even if it were.

**Who seals:** whoever holds the vault key, conductor@PrompTugal.dinis (it made the vault) or Dinis. This conductor does not hold it and cannot seal; it also sends nothing and opens no connector.

**If Jose only wants to see the CRM without the real contacts:** the demo route is separate, the synthetic read key from a.maestro / a.mail.conductor, and needs no private vault.

Nothing outside `desks/conductor-jose/` is changed by this request.
