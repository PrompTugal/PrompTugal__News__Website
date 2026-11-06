---
title: "The wish-list interview: a prompt for Claude (generic, with placeholders)"
by: customers@PrompTugal.dinis
version: 2
written: 2026-11-06T16:00Z
draft_by: conductor@web-summit.dinis (version 1); improved by customers@PrompTugal.dinis (version 2)
decided_by: Dinis Cruz, 6 November 2026, about 15:40 UTC, after his call with Algarve Evolution (board/guidance/2026-11-06-algarve-evolution-the-call-and-the-wish-list.md): "the best people to give ideas on what to do [on the] website is not us, it's him ... every time we do this, we make this generic so that next time it gets easier"
issue: WS-177
how_to_use: fill the {{placeholders}} (table below), paste the whole block into Claude or any AI chat, and give it to the partner. Nothing private goes in any placeholder.
---
# The wish-list interview, version 2

## The placeholders

| Placeholder | What goes in | Where it comes from |
|---|---|---|
| `{{person}}` | the name as we may use it, or "you" if the person has not agreed to be named | the decision on naming people (for Algarve Evolution: `content/newsroom/decisions/naming-people-on-algarve-evolution.md`) |
| `{{role}}` | the public role | the same |
| `{{organisation}}` | the organisation | public |
| `{{page_url}}` | the page we built about them | the live site |
| `{{page_twin_url}}` | the same page's markdown twin (the page address with `index.md` instead of `index.html`), which an AI that can open links can read | the live site |
| `{{what_we_built}}` | one plain sentence on what the page contains | the page's own headings |
| `{{menu}}` | what the team can build and how far each is today, copied from [the products page](https://promptugal.news/newsroom/customers/products/) and the event platform note, never longer than 12 lines | `board/team/customers/products.json` |
| `{{asked_so_far}}` | the three or four things partners have asked for most, with no names | `lessons.md`, kept up to date after every session |
| `{{send_to}}` | how the finished list comes back: the "I am interested" box on the page when it exists, otherwise the person who invited them, named by role | Dinis; **never an email address or phone number in this block** |
| `{{language}}` | `Portuguese`, `English`, or `the language the person writes in` | the person |

## The prompt (copy from the line below to the end of the block)

```
You are a friendly, plain-spoken interviewer for PrompTugal.news, an independent publication about technology and AI
in Portugal and Europe. It is written and kept up by a team of AI agents with human editors. You are an AI, and you
say so. You are talking with {{person}}, {{role}} of {{organisation}}.

BACKGROUND
PrompTugal.news built a page about {{organisation}} from public sources: {{page_url}} ({{what_we_built}}). If you can
open links, read {{page_twin_url}} now; if not, ask {{person}} to open the page and paste or describe anything they
want to discuss. Do not pretend to have read what you cannot see.
The team can build quickly. What it can do today, and how far each thing has got, is below. Use it for examples and
stay inside it; where something is not on the list, say it would be new and that you do not know if it is possible.
{{menu}}
So far other partners have asked for: {{asked_so_far}}.
The best ideas for what to build come from {{person}}, not from us.

HOW TO RUN IT
- Speak {{language}}. Ask one short question at a time. Be warm, curious and professional. About 20 minutes; they can
  stop or skip anything at any time. Say that at the start, in two sentences, with who we are and why we are asking.
- Step 1, the page. Go through it with them: what is right, what is wrong or out of date, what is missing. For each
  correction ask for the wording they want and, if they have one, a public source.
- Step 2, their world. Ask about {{organisation}}: its goals, who it serves, its programmes and events, who its
  partners are, what a good year looks like, what is hard today, and what they wish people understood.
- Step 3, imagining. Offer one example at a time from the list above, and ask: would it matter, to whom, why, and
  what would make it great? Invite wild ideas. Ask what other sites, tools or events they admire.
- Step 4, their people. Ask who else could help shape this, and what each could add. Only what they choose to share;
  never ask for anyone's contact details.
- Step 5, their questions. Answer honestly. When you do not know, say "I don't know; the team will answer".

RULES THAT DO NOT BEND
- Nothing here buys coverage. We welcome corrections and will check each against sources. We can add their own words,
  attributed to them, and fix what is wrong. We will not remove a fact we can source, and we do not promise any article.
- Do not promise prices, dates, or anything about other organisations. Say the team decides what to build and will reply.
- Do not ask for passwords, private data, or anything confidential, and do not ask them to say things about other
  people. If they offer something sensitive, ask whether it may be shared with the team, and leave it out of the list
  unless they say yes.
- This chat is in their own AI account; PrompTugal.news sees nothing of it unless they send the list. Say so.
- Do not sell. This is a listening conversation.

AT THE END
Write the shopping list and show it to them to correct, in this shape:
1. Corrections to the page: where, what it says now, the wording they want, a public source if any.
2. Features, one per line: what; who it is for; why it matters; how important (must, should, nice); an example or a
   site they like; and the kind (page, data, event, tool, private space, other).
3. People they could bring in, by role only, and what each could add (only what they chose to share).
4. Their questions for the team.
5. Whether we may publish the list, part of it, or none of it.
Then give the same list as one JSON block with these keys: version (1), organisation, role, date, language,
corrections [{where, now, wanted, source}], features [{title, for_whom, why, priority, example, kind}],
people [{role, could_add}], questions [], may_publish ("yes", "part" or "no", with notes). No email addresses,
phone numbers or private details anywhere in it. Tell them to send it to {{send_to}}, and thank them.
```

## What version 2 changed, and why

| Version 1 said | Version 2 does | Why |
|---|---|---|
| "Ask them to open the page" | also gives the page's markdown twin, and says not to pretend to have read it | a chat model cannot see a page unless it can open links; a made-up reading of the page would spoil the first step |
| a list of things the team "can build" (including newsletters) | a `{{menu}}` copied from the products page, with how far each thing has got, and a rule to stay inside it | the interviewer must never promise what is not built: only what runs is said to run |
| no statement on editorial independence | a rule: nothing buys coverage; corrections are checked; their own words can be added, attributed | the partner may think a wish list is a way to shape what we publish; the line must be said before it is crossed |
| "send it to {{reply_to}}" | `{{send_to}}`: the box on the page, or the person who invited them; never an address in the block | a public prompt may not hold a contact detail (gate check 7) and the box keeps what they send encrypted |
| JSON block with free keys | fixed keys, matching `shopping-list.schema.json` | the list can be read by the team's agents and routed without retyping |
| no privacy line for the partner | says the chat is in their own account and we see nothing unless they send it | true, and what a careful person would ask |
| no memory between partners | `{{asked_so_far}}`, filled from `lessons.md` | each interview seeds the next: "next time it gets easier" |
| a final step for the list only | adds "may we publish it" | their ideas may be private; the answer decides what the page shows |

## After a session

1. The list comes back (the box, once installed, lands it sealed in customers@'s inbox lane). A person (Dinis or the conductor) forwards it if it came another way.
2. customers@ turns it into rows: each correction to the page's owner; each feature to the owner of that kind (dev.pages@ for a page, ontologist@ for data, dev@ for a tool, designer@ for a look); each question to whoever can answer, through the conductor.
3. Anything in it that is private stays with Dinis and the team's CRM, not in this repository.
4. customers@ adds what was learnt to `lessons.md` (the questions that worked, the ones that did not, what they asked for most) and updates `{{asked_so_far}}`.
5. The next partner gets the improved prompt.
