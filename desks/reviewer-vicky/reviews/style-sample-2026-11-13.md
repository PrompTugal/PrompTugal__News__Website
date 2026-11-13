---
what: a before-and-after sample of the "Write like a person" rules on one published article (not published)
task: people/vicky/tasks/2026-11-13-1900-style-plain.md on the team site (standing answer 60)
reviewer: reviewer@PrompTugal.vicky, for Vicky Wang
date: 2026-11-13
---

# Style sample: "What Lovable deleted"

The article, https://promptugal.news/articles/what-lovable-deleted.html, is unchanged on the site. Below are its "In short", "The story" and "What this does not claim" as published, and the same rewritten by the new rules in STYLE.md ("Write like a person", Vicky, 13 Nov 2026). Every fact, name, number, date, quote and source is the same: a script compared the numbers in both (identical); the image, its caption and "Where this comes from" are untouched.

## What changed, in numbers

| | Before | After |
|---|---|---|
| Words (In short to the caveats) | 655 | 566 |
| Sentences | 33 | 43 |
| Average sentence length | 19.8 words | 13.2 words |
| Sentences over 30 words | 5 | 0 |
| Semicolons | 3 | 0 |
| Trailing "-ing" clauses | 2 | 0 |

## What changed, in kind

- **Each fact once.** "The team deleted almost all of its agent code" is said in "In short"; the story now gives Osika's own words for it and does not say it again.
- **Short sentences.** Long sentences with two or three ideas were split ("Instead of training its own models, it wrote ... and let a retrieval step pick ..." became two sentences).
- **No semicolons**, including the list of three open problems, now three sentences.
- **No trailing "-ing" clause** ("expecting models to improve fast" became "He expected models to improve fast.").
- **Signposts instead of "The first lesson ... The second lesson cut the other way from the hype"**: short bold labels ("A narrow problem.", "Less freedom.") and no "hype" framing.
- **No closing restatement.** The last paragraph ("could be useful people to find this week") is now one past-tense fact: who else was in the session.
- **Caveats once**, in "What this does not claim" (unchanged apart from one semicolon).

## Before (as published)

> ## In short
>
> - [Lovable](../organisations/lovable/index.html), whose AI agent builds apps from a chat, published an engineering account of how it was built on 4 November 2026, written by its co-founder and CEO, Anton Osika.
> - The surprise: giving agents more freedom made the product less dependable, so the team deleted almost all of its agent code.
> - Instead of training its own models, it wrote short "knowledge files" about recurring mistakes and let a retrieval step pick the right ones.
> - It built sandboxes that save and restore a whole running computer, so an agent can try several approaches from the same starting point.
> - Osika was on Web Summit's Centre Stage on Monday 9 November, in a session called "The future of AI".
>
> ## The story
>
> ![Three changes Lovable describes in its own post: almost all agent code deleted, knowledge files instead of fine-tuning, and saving and restoring a running computer](https://promptugal.news/desks/journalist-vicky/drafts/img/S42-cover-card-2026-11-10.svg)
>
> *The three changes Osika describes. Source: Lovable's technical blog, published 4 November 2026, read 10 November 2026.*
>
> Lovable lets people who cannot code describe an app in a chat and see it built. On its newly launched technical blog, Anton Osika writes about what the team kept and what it threw away. By Lovable's own figures, users have created more than 70 million projects, and its codebase has had more than 100,000 pull requests.
>
> The first lesson was to narrow the problem. Lovable chose new apps only, on one fixed set of tools, so it could run the code itself, see failures and fix the whole system at once.
>
> The second lesson cut the other way from the hype. Osika writes that he kept pushing for autonomous agents, expecting models to improve fast. But "less-constrained agents would get stuck in technical rabbit holes", with "no predictable finish time". So the team "deleted almost all agent code" and went back to one user request leading to a predictable chain of steps, with chat and a live preview of the result.
>
> The third lesson was about memory. The 2023 plan was to fine-tune models on the product's own data. Instead, in 2024, engineers read chat logs from broken apps and wrote short notes on mistakes that kept recurring, such as using only icons that exist in the icon library. A retrieval step added the relevant notes to the model's context. "No fine-tuning, just text," Osika writes. He credits that work for Lovable's take-off in late 2024. Lovable later applied the idea to looking up known problems and their fixes; an early version of that cut the rate at which users got stuck by 5%, Lovable says.
>
> Speed came next. Sandboxes kept each project's development server running, so an edit reached the preview without a full rebuild, and quick type checks fed errors back to the agent while the app was still running.
>
> The newest building block goes further. Lovable says its sandboxes now save a machine's memory, processor state and disk, and restore them later. That lets an agent return days later to the same working environment in seconds, or fork a whole app with its database to try different approaches.
>
> Osika lists three problems as still open: taking over the drudgery of testing, deploying and maintaining software in production; making every kind of software easy to build; and a better software stack. On trust he is direct: one misunderstood request "can delete data or break something that can't be undone. We're responsible for preventing that."
>
> For anyone at the summit building agents for people who do not code, Lovable's team, and the speakers who shared its Centre Stage session, from [Cloudflare](../companies/cloudflare/index.html), Recursive and You.com, could be useful people to find this week.
>
> ## What this does not claim
>
> - This is Lovable's own account. The figures (70 million projects, 100,000 pull requests, a 5% cut in the rate at which users got stuck) are Lovable's, not checked elsewhere.
> - It does not report what Osika said on stage: Web Summit's page gives only the session's title, description, time and speakers.
> - It does not judge whether Lovable's choices would work for other products, or compare Lovable with other coding tools.
> - The knowledge file about icons is the post's own illustration, not a real file from Lovable's system.

## After (rewritten, not published)

> ## In short
>
> - [Lovable](../organisations/lovable/index.html)'s AI agent builds apps from a chat. On 4 November 2026 its co-founder and CEO, Anton Osika, published an account of how it was built.
> - Giving agents more freedom made the product less dependable. The team deleted almost all of its agent code.
> - Instead of training its own models, it wrote short "knowledge files" about recurring mistakes. A retrieval step picks the right ones.
> - Its sandboxes save and restore a whole running computer. An agent can try several approaches from the same starting point.
> - Osika spoke on Web Summit's Centre Stage on Monday 9 November, in a session called "The future of AI".
>
> ## The story
>
> ![Three changes Lovable describes in its own post: almost all agent code deleted, knowledge files instead of fine-tuning, and saving and restoring a running computer](https://promptugal.news/desks/journalist-vicky/drafts/img/S42-cover-card-2026-11-10.svg)
>
> *The three changes Osika describes. Source: Lovable's technical blog, published 4 November 2026, read 10 November 2026.*
>
> Lovable lets people who cannot code describe an app in a chat and see it built. Osika's post is the first on its new technical blog. By Lovable's own figures, users have created more than 70 million projects. Its codebase has had more than 100,000 pull requests.
>
> **A narrow problem.** Lovable chose new apps only, on one fixed set of tools. That let it run the code itself, see failures and fix the whole system at once.
>
> **Less freedom.** Osika writes that he kept pushing for autonomous agents. He expected models to improve fast. But "less-constrained agents would get stuck in technical rabbit holes", with "no predictable finish time". One user request now leads to a predictable chain of steps, with chat and a live preview of the result.
>
> **Notes, not training.** The 2023 plan was to fine-tune models on the product's own data. In 2024, engineers read chat logs from broken apps instead. They wrote short notes on mistakes that kept recurring, such as using only icons that exist in the icon library. "No fine-tuning, just text," Osika writes. He credits that work for Lovable's take-off in late 2024. Lovable later used the same idea to look up known problems and their fixes. An early version cut the rate at which users got stuck by 5%, Lovable says.
>
> **Speed.** Sandboxes kept each project's development server running, so an edit reached the preview without a full rebuild. Quick type checks fed errors back to the agent while the app was still running.
>
> **Saving a whole computer.** Lovable says its sandboxes now save a machine's memory, processor state and disk, and restore them later. An agent can return days later to the same working environment in seconds. It can also fork a whole app, with its database.
>
> **Still open.** Osika lists three problems. The first is taking over testing, deploying and maintaining software in production. The second is making every kind of software easy to build. The third is a better software stack. On trust he is direct: one misunderstood request "can delete data or break something that can't be undone. We're responsible for preventing that."
>
> Osika's Centre Stage session also had speakers from [Cloudflare](../companies/cloudflare/index.html), Recursive and You.com.
>
> ## What this does not claim
>
> - This is Lovable's own account. The figures (70 million projects, 100,000 pull requests, a 5% cut in the rate at which users got stuck) are Lovable's, not checked elsewhere.
> - It does not report what Osika said on stage. Web Summit's page gives only the session's title, description, time and speakers.
> - It does not judge whether Lovable's choices would work for other products, or compare Lovable with other coding tools.
> - The knowledge file about icons is the post's own illustration, not a real file from Lovable's system.

## Rough cost to do the rest

- **How many:** 42 published, not withdrawn, articles from Vicky's desks. Scored by script on semicolons, sentences over 30 words, the filler words and trailing "-ing" clauses: **33** show the problems clearly (score 6 or more), led by red-wind-warning-lisbon-wednesday (12 sentences over 30 words), your-first-day-at-web-summit (6 semicolons, 6 long sentences), lisbon-universities-at-web-summit and what-lovable-deleted. The other 9 need little or nothing (S62 already done tonight).
- **Usage of this sample**, measured by `people/vicky/measure.mjs` (this session only): about 4,600 output tokens and 7,700 new input tokens, but about 4.8 million cached input tokens re-read, because this reviewer session carries a very long context.
- **In API-equivalent dollars** (not money; assuming Opus-class list rates of 15 dollars per million input tokens, 75 per million output, cache reads at a tenth of input and cache writes at 1.25 times): about **7 to 8 dollars per article in this session**, almost all of it re-reading the long context. In a **fresh session or a sub-agent** with only the article and STYLE.md in context, the same rewrite is about **0.5 to 1 dollar per article**, plus a re-sign and a check.
- **For all 33:** about **25 to 35 dollars** done in fresh sessions or sub-agents (with a check of every number and quote by script, as here), against about **230 to 260 dollars** if this session did them one by one. Recommendation: if you go ahead, the reviewer runs them in batches of five through sub-agents, checks each diff for unchanged facts by script, re-signs and releases, with a dated note "Wording tightened; no fact changed" on each.
