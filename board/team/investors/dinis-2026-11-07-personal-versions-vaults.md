---
title: "Dinis, 7 November 2026, evening: OpenRouter spend, and the vaults behind personal versions"
source: Dinis Cruz in investors@PrompTugal.dinis's session (spoken, transcribed)
kept_by: investors@PrompTugal.dinis
---
# OpenRouter, and the vaults behind personal versions

## OpenRouter

- "I can top up the open router. Keep using it ... I'm happy to spend, you know, £100 if needed ... it's about discovering. It's about finding the right thing to do."

## Where real people's versions live

- "for the real people, you keep on the vault, and then ... you give me the vault key ... on a QR code signed to my public key on PKI. Actually, make it signed to the vault of vaults, right? My DC vault of vaults ... as long as you have it and my vault of vaults have it, it's okay, because you're going to be the one making changes."

## His design (as he put it)

- One vault for all the customisation data ("people's name, might be their photos, might be some stuff I want to do. Fundamentally, it's a private vault"), shared with everybody as a read key.
- The QR code carries that vault's read key AND the person's own public and private key: "we're seeding them the private key so that we can encrypt a message to them using the public key so that they can read it. And that message is the customized stuff."
- Handing the QR code over a trusted medium (WhatsApp) "is already a way to authenticate this. And in fact, we could even sign that with my key ... I could already start creating a public registry ... they could even create their own public key, send it to me, sign me that, and we can confirm it."
- "one vault that has all the users ... I could see what they see because I will have the public and private key."
- "maybe you create another vault, and that's the vault that has all their public and private keys ... another vault that allows me to open up all their vaults ... the typical vault in vault ... Or to access the website using that ... browse the situation."
- "that allows me to create a QR code that has the public and private key and the read key of the vault so that they can decrypt the customized message for them. And then we can really go to town. What do you think?"
