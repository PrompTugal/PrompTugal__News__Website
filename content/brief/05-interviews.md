---
title: Brief 5: interviews and podcasts, before and during the summit, with the subject's own key
summary: How we interview people at Web Summit and publish only what they approve: the invitation, the subject's key made in their own browser, the recording, the draft sealed to them, their signed approval, and the corrections lane. The workflow the PT newsroom never had.
---
Written by conductor@web-summit.dinis from [brief 1](../01-the-vision/index.html). The pieces exist on the team's site (keys, sealed messages, signed lanes); what is new is putting them together for people outside the team.

## Why {#why}

Dinis: *"lots and lots and lots of interviews. The problem that we had in the past when we tried to do this for the PT in Portugal is that we didn't have the thing nailed out ... Now it's possible."* And: *"give them ideally even a public and private key by just them going to the website, onboarding them, and then sending them the materials for approval."* An interview done this way is also the simplest demo of our stack: the subject experiences keys, sealing and signing without knowing the words.

## The workflow {#workflow}

1. **Find.** Someone on the team (anyone) proposes a person: who, why, what we would ask. Public and professional facts only. The programme desk keeps the list.
2. **Invite.** A short invitation from the person who knows them, with a link to the newsroom's interview page. No message is sent by an agent; a person sends it.
3. **Onboard, in one tap.** The interview page makes the subject's key **in their own browser** (the private half never leaves it; this is option 1 of WS-138 on the team's board, so no agent can sign as them). Their browser sends only the public half to the newsroom's lane, with their name as they want it shown.
4. **Record.** A video call, a podcast, a voice memo or written answers, whichever they prefer. The recording and its transcript go into the newsroom's **private** vault, never into this repository.
5. **Draft.** The journalist writes the interview in the article shape; the fact-checker checks it against the transcript.
6. **Approve.** The draft is **sealed to the subject's key** and they read it on the site (their browser opens it). They approve, or ask for changes, with a message **signed by their key**. Nothing is published without that signature.
7. **Publish.** The correspondent publishes it with a line saying it was approved by the subject, when, and with which key. Their quote is exactly what they approved.
8. **After.** They can ask for a correction at any time over the same lane; it is published as a dated correction.

## The rules {#rules}

- **Consent is recorded**, in their own signed words, before publishing; a person can withdraw before publishing for any reason.
- **No contact detail in this repository, ever**: invitations and addresses live in the team's private vaults.
- **The recording stays private** unless they say it can be published (a podcast).
- **Positive and fair**: we interview to show what they do well; we never edit a quote to mean something else.

## To build first {#build}

1. The interview page: key made in the browser, public half sent, a short form (name as shown, role, consent).
2. The draft view: a sealed draft opened by their key, with Approve and Ask for changes, signed.
3. The newsroom's private vault for recordings and transcripts, and its lane for approvals.

Dev on the team's site has built the parts (assets/keyring.js, admin/tools/person-key.mjs, the feedback pane's signed lane); the interview page reuses them, with the key made in the browser instead of issued.
