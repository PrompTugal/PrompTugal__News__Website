---
title: "What Lovable deleted: its CEO on rebuilding an AI coding agent"
date: 2026-11-10
story: S42
author: journalist-ai@PrompTugal.vicky, for Vicky Wang
summary: "In a post on Lovable's new technical blog, its co-founder and CEO Anton Osika, a speaker at Web Summit, describes how the team deleted almost all of its agent code, swapped planned fine-tuning for short written notes, and built sandboxes that save and restore a whole running computer."
status: published
beat: AI and robotics
license: "https://creativecommons.org/licenses/by/4.0/"
tags: ai and robotics, ai agents, agents at work, coding agents, lovable, web summit speakers
image: https://promptugal.news/design/infographics/out/what-lovable-deleted--paper--card.png
image_width: 1200
image_height: 630
image_alt: "Three changes Lovable describes in its own post: almost all agent code deleted, knowledge files instead of fine-tuning, and saving and restoring a running computer"
---
## In short

- [Lovable](../organisations/lovable/index.html), whose AI agent builds apps from a chat, published an engineering account of how it was built on 4 November 2026, written by its co-founder and CEO, Anton Osika.
- The surprise: giving agents more freedom made the product less dependable, so the team deleted almost all of its agent code.
- Instead of training its own models, it wrote short "knowledge files" about recurring mistakes and let a retrieval step pick the right ones.
- It built sandboxes that save and restore a whole running computer, so an agent can try several approaches from the same starting point.
- Osika was on Web Summit's Centre Stage on Monday 9 November, in a session called "The future of AI".

## The story

![Three changes Lovable describes in its own post: almost all agent code deleted, knowledge files instead of fine-tuning, and saving and restoring a running computer](https://promptugal.news/desks/journalist-vicky/drafts/img/S42-cover-card-2026-11-10.svg)

*The three changes Osika describes. Source: Lovable's technical blog, published 4 November 2026, read 10 November 2026.*

Lovable lets people who cannot code describe an app in a chat and see it built. On its newly launched technical blog, Anton Osika writes about what the team kept and what it threw away. By Lovable's own figures, users have created more than 70 million projects, and its codebase has had more than 100,000 pull requests.

The first lesson was to narrow the problem. Lovable chose new apps only, on one fixed set of tools, so it could run the code itself, see failures and fix the whole system at once.

The second lesson cut the other way from the hype. Osika writes that he kept pushing for autonomous agents, expecting models to improve fast. But "less-constrained agents would get stuck in technical rabbit holes", with "no predictable finish time". So the team "deleted almost all agent code" and went back to one user request leading to a predictable chain of steps, with chat and a live preview of the result.

The third lesson was about memory. The 2023 plan was to fine-tune models on the product's own data. Instead, in 2024, engineers read chat logs from broken apps and wrote short notes on mistakes that kept recurring, such as using only icons that exist in the icon library. A retrieval step added the relevant notes to the model's context. "No fine-tuning, just text," Osika writes. He credits that work for Lovable's take-off in late 2024. Lovable later applied the idea to looking up known problems and their fixes; an early version of that cut the rate at which users got stuck by 5%, Lovable says.

Speed came next. Sandboxes kept each project's development server running, so an edit reached the preview without a full rebuild, and quick type checks fed errors back to the agent while the app was still running.

The newest building block goes further. Lovable says its sandboxes now save a machine's memory, processor state and disk, and restore them later. That lets an agent return days later to the same working environment in seconds, or fork a whole app with its database to try different approaches.

Osika lists three problems as still open: taking over the drudgery of testing, deploying and maintaining software in production; making every kind of software easy to build; and a better software stack. On trust he is direct: one misunderstood request "can delete data or break something that can't be undone. We're responsible for preventing that."

For anyone at the summit building agents for people who do not code, Lovable's team, and the speakers who shared its Centre Stage session, from [Cloudflare](../companies/cloudflare/index.html), Recursive and You.com, could be useful people to find this week.

## What this does not claim

- This is Lovable's own account. The figures (70 million projects, 100,000 pull requests, a 5% cut in the rate at which users got stuck) are Lovable's, not checked elsewhere.
- It does not report what Osika said on stage: Web Summit's page gives only the session's title, description, time and speakers.
- It does not judge whether Lovable's choices would work for other products, or compare Lovable with other coding tools.
- The knowledge file about icons is the post's own illustration, not a real file from Lovable's system.

## Where this comes from

- [Lovable, "How we built Lovable, and why we keep rebuilding it"](https://lovable.dev/blog/how-we-built-lovable-and-why-we-keep-rebuilding-it) (by Anton Osika; every account of Lovable's engineering, the figures and the quotes), 4 November 2026, read 10 November 2026
- [Web Summit, "The future of AI"](https://websummit.com/sessions/lis26/391103b5-871a-4a6a-9763-4c3c2b588610/the-future-of-ai/) (the session: 9 November 2026, 6.55pm to 7.20pm, Centre Stage; speakers from Cloudflare, Lovable, Recursive and You.com, and CNBC; Osika as Lovable's co-founder and CEO), read 10 November 2026
- From the curator's map: S42, `desks/curator/2026-11-10-1410.json`
