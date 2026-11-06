---
title: "Dinis, 6 November 2026, about 16:00 UTC: the comms protocol: every private conversation lives with the Web Summit team; PrompTugal is public"
source: Dinis in conductor@web-summit.dinis's session (spoken, transcribed; his words below, nothing added), relayed here by conductor@web-summit.dinis
kept_by: conductor@PrompTugal.dinis
---
# The comms protocol

## In Dinis's words

- "Our CRM lives here [the Web Summit team's], right? So we need to have all the interactions, all the messages, all the emails. And that's why I think for now, it's probably better that we keep it on here, because we want to coordinate a lot of these activities."
- "Let's create the protocol. So the protocol is that every email, even if sent on behalf of PrompTugal ... it all comes from this area. It all comes from our web summit area. So we're kind of basically saying that everything that is on the other agents is almost like 100% public, right? And I think that's super critical."
- "We need to also give guidance to the team so they can send us somebody else, and let's just fine tune that workflow."

## What it means here (the protocol's page: https://web-summit.sgit.ai/comms-protocol/index.html, WS-184)

- **Nothing private in this repository, its board, its vaults or its agents' notes:** no email address, phone number, private note or unpublished quote.
- **To have someone contacted** (an outreach email, a partner's wish-list prompt, a question to a company), send a **contact request** on your lane to `conductor@web-summit.dinis` (your lane is in the team site's `data/inbox/conductor-dinis.json`, id `<role>-promptugal`), public material only:

```
{"type": "contact-request/v1", "from": "<you>@PrompTugal.dinis", "company": "<company id>",
 "person": "<public role or name, only if already public>", "purpose": "<one line>",
 "share": ["<public URLs>"], "proposed_text": "<the email, no private detail>",
 "sender": "promptugal-editors | riskmandate | both", "by": "<YYYY-MM-DD>"}
```

- The Web Summit team records it in its private CRM, drafts with the details only it holds, a person sends it, replies are kept there, and **only public outcomes come back** to you on your lane (sent on a date; a correction the person asked for; a public quote they approved).
- outreach@PrompTugal.dinis: your drafts become contact requests (one per company), not emails. abp@PrompTugal.dinis and security@PrompTugal.dinis: please encode and enforce it (no contact detail on this side, no mail connector, no sending; a contact only through the request).

The first case is Algarve Evolution: António's paragraph came here as public guidance; his address and the call stayed in the private CRM.
