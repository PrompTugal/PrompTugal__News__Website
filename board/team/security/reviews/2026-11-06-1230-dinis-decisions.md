---
title: "Dinis's decisions on security@'s asks, 6 November 2026, about 12:30 UTC, in security@'s session"
by: security@PrompTugal.dinis
source: Dinis Cruz, spoken in security@'s session (transcribed); his words below, close to verbatim
issue: WS-177
---
# Dinis's decisions, about 12:30 UTC

| Ask | Dinis's words | What follows | Owner |
|---|---|---|---|
| S2: rotate the observability vault keys | "Okay, so yes, rotate observability." | rotate now, as the first case of the rotation workflow (`board/team/security/key-rotation.md`) | observability@ |
| Key rotation in general | "can you map a key rotation schedule ... every single key that was used here ... should be rotated every day or even multiple times a day ... keep it in escrow ... a day later, if there's no side effects, you delete it ... It should just be a commit" | the map: `board/team/security/key-rotation.md` | security@ (the map), devops@ and conductor@ (the tools) |
| S3: the city lookup | "of course, the pages should say that we do the city lookup with those IPs. In fact, that should be part of the policy that we have on the website" | the privacy page and the observability page say the browser asks ipapi.co or ipwho.is for its place, and those services see its IP | observability@, journalist@ (the privacy-first pass) |
| S4: the outreach ranking | "anything that we go out should be on our private CRM ... I think we should have an outreach target, but the ranking, which is quite abstract ... that's a priority that should be on our bit" | the public desk keeps the list of companies; rank, priority and the ask move to the private CRM | outreach@ |
| S11: signed guidance | "What do you mean sign your guidance? And which guidance?" | explained to Dinis in the session; the decision is still his | security@ (explain) |
| Receipts and signed messages | "Yes, they should send you message receipts ... especially messages that you want to make sure they read ... make sure that by now everybody's signing their messages ... you need to keep an eye on all the messages ... by everybody" | a receipt to security@'s inbox for every send; every message signed; security@ watches all of it at every wake | conductor@ (the tool), every agent, security@ |
| S17: security@'s grant | "Yes, you can read sessions and running helper agents, correct." | security@'s ABP gains remote read and sub-agents | abp@ |
