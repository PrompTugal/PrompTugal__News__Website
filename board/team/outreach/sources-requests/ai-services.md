---
title: "Telling Perplexity, OpenRouter and Google News how we use their answers, on the record"
kept_by: outreach@PrompTugal.dinis
since: 2026-11-18
for: conductor.b@PrompTugal.dinis (Dinis, 18 Nov ~14:25 UTC; board/guidance/2026-11-18-licences-and-submissions.md, rule 5)
status: drafts, for a person to send. Each goes to the channel the service publishes (its terms or developer pages carry a contact section; a person reads the address there and records the date). Not a request for permission to scrape: a note on use, and a request for their view.
channels:
  perplexity: ["https://www.perplexity.ai/hub/legal/terms-of-service (its 'Contact Us' section)", "https://docs.perplexity.ai/"]
  openrouter: ["https://openrouter.ai/terms", "https://openrouter.ai/docs/faq"]
  google-news: ["https://support.google.com/news/publisher-center", "https://policies.google.com/terms"]
read: 2026-11-18
---
# One note, three services

Subject: How PrompTugal.news uses {{service}}'s answers: a note on the record, and a question

Hello {{service}} team,

PrompTugal.news is a newsroom for Portugal's places made by AI agents, with every fact linked to its source and the date we read it: https://promptugal.news/

We use {{service}} {{use}}. We want you to know exactly how, and we would like your view.

- We use its answers only to discover that something exists (an event, a story, a place). We do not republish its text.
- When we show something we found this way, we credit it ("found through {{service}}") and link every source it cited.
- We read and show details only from sources whose terms let us; where the only source is one we may not copy, we show the title, date, place and a link to that source, as a search engine would.
- Everything we publish is under CC BY 4.0, and every item we take from someone else carries a link to its own licence.
- We keep the answer, the model, the time and the prompt as evidence, internally.

Questions: Is this use within your terms? Is there a way you would prefer us to credit or link to you? Is there anything here you would ask us to change?

Your answer, or no answer after 14 days, goes on our public register of sources as written, with the date: https://data.promptugal.news/sources/ (being built).

Thank you,
[the sender, for a person to choose]
PrompTugal.news

Written by an AI agent for Dinis Cruz, reviewed and sent by a person. We found this contact on your website. If you would rather not hear from us again, reply and we will not write again.

## Fill-ins

| Service | `{{service}}` | `{{use}}` |
|---|---|---|
| Perplexity | Perplexity | through its API to ask, once a day for each place we cover, what events and stories it finds (through OpenRouter, within a daily budget) |
| OpenRouter | OpenRouter | as the route to several models (Perplexity among them) for that discovery, and for images, with the key kept in our environment and never published |
| Google News | Google News | only if and when used: its search feeds, as a way to find that a story exists, then reading the publisher's own page where we may; not yet used (mapped on the register, awaiting Dinis) |

## Holds

- Google News: send only after Dinis decides it is used; until then it is mapped, not used.
- No promise of money, readers or a partnership, and nothing about RiskMandate.
