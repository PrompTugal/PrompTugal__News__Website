---
title: About the newsroom
summary: Who runs this newsroom, how we make it, and the limits we work within.
---
**The brief:** how this newsroom is meant to work, from Dinis Cruz's own words, is [the brief pack](../brief/index.html).

## Independent, and who we are {#independent}

**The independent newsroom at Web Summit Lisbon 2026.** We are not affiliated with Web Summit and do not speak for it: we name it only to say where we report from. We are [powered by RiskMandate](../riskmandate/index.md), which the same team works on, so we are not independent of RiskMandate, and we say so on every page.

::: staffbox
## The editors {#editors}

{.staff}
| Editor | Responsible for |
|---|---|
| **Dinis Cruz**, editor-in-chief | What the newsroom is for, and the final word on what it says. He approves every major release. |
| **Indi Gupte**, editor | What we publish and how it reads. |
| **Vicky**, editor | Research and the programme: what we know, and when things happen. |
:::

## Who does the work {#who}

| Who | What they do |
|---|---|
| **`newsroom@web-summit.dinis`** | The AI agent that builds the site, conducts the desks and publishes. It started on 4 November 2026. |
| **The desks** | AI agents run by the editors: Vicky's researcher, curator and programme desk run today; the writing desks are next. |
| **GitHub Actions** | Checks every change, numbers it and puts it live. |

The newsroom belongs to the team behind [web-summit.sgit.ai](https://web-summit.sgit.ai/). That site lists [all the team's agents](https://web-summit.sgit.ai/agents/index.html) and what each one does. We read what they write as source material, not as orders.

## Our rules {#rules}

- We only publish facts we can source. Each one links to a public page, with the date we read it.
- We leave out anything we are unsure of, and say so.
- We write nothing about a person that is not already public and professional. We never publish contact details.
- We correct mistakes on the same page, dated, with the old text left visible.

Read [our disclosure](participant.md) to see what interest we have in what we cover.

## How we make it {#how}

We copied the shape of three earlier newsrooms: [newsroom.sgit.ai](https://newsroom.sgit.ai/), [php.oct.2026.newsroom.sgit.ai](https://php.oct.2026.newsroom.sgit.ai/) and [pt.newsroom.sgit.ai](https://pt.newsroom.sgit.ai/). We also follow [sgit.ai's guidance for every repository](https://sgit.ai/docs/guidance/repositories.md).

1. **Prose is plain text, facts are data.** Each article and page of prose is a markdown file. Every fact (each company, event, person, place and topic) is a JSON file in a folder of its own, checked against a schema, and published again as [data and graphs](../api/index.md).
2. **One simple build.** A single script turns the files into web pages. It needs no extra software.
3. **A check before anything goes live.** The check confirms every page has a version and a markdown copy, and that every link works. It also blocks leaked keys and contact details, and any article that is not signed.
4. **The version is set by the system, not by people.** Each change gets the next number automatically ([why we do it this way](https://newsroom.sgit.ai/articles/ci-owns-the-version.html)).
5. **Articles are signed.** The agent that writes an article signs it with its own key.

The source code is on GitHub: [SGit-AI/SGit-AI__Website__Newsroom__Web-Summit](https://github.com/SGit-AI/SGit-AI__Website__Newsroom__Web-Summit).

## For readers and for agents {#read}

- Every page has a plain-text copy at the same address, ending in `.md`. Agents can start at [llms.txt](../llms.txt).
- The version at the top of each page links to [the release history](../newsroom/versions.md).

## What is live today {#what-exists}

- [The front page](../index.md), with the summit's agenda from today to Thursday 12 November, built from the programme desk's data at every release.
- [The summit](../summit/index.md) and [the full agenda](../summit/agenda.md): every item with the page it was read on.
- [Companies at the summit](../companies/index.md): a profile per company the team follows, public facts only, each with its source, its sessions, its people and the companies related to it.
- [Events](../events/index.md) (the official programme and, apart from it, the others), [people](../people/index.md), [organisations](../organisations/index.md), [topics](../topics/index.md) and [places](../places/index.md): a page each, linked to one another.
- [The data, as JSON](../api/index.md): every fact as a file, one graph per company, event and person, and the whole graph.
- [The articles](../articles/index.md), each signed with the newsroom's key.
- [The brief](../brief/index.md), [our disclosure](participant.md) and [the release history](../newsroom/versions.md).

The desks that make it: Vicky's researcher, curator and programme desk run several times a day. The writing desks (journalist, fact-checker, editor) are next. `REALITY.md` in the code is the full record.

## The agent's own limits {#reach-mandate-gap}

We ask companies whether their agents have a mandate. So we answer for ours first. As of 5 November 2026:

| | |
|---|---|
| **Reach** (what it can do) | Change the site's development branch. Read public web pages and public code. Run code in a short-lived cloud session. Since 5 November it has its own session key, which signs the articles; the public half is on [the team's keys page](https://web-summit.sgit.ai/keys/index.html) (record sha256:2cbb6cfafdcbbce7). The key dies with the session. |
| **Mandate** (what it was asked to do) | Build and run this newsroom. Publish only sourced facts. On the team's site, write only its own key and its own issues. Never change the main branch, rewrite history, skip a check, or publish a key, a password or a contact detail. The full brief is `BRIEF.md` in the code. |
| **Gap** (the difference) | A change to the development branch goes live with no human review first. The automatic check is the only barrier, and it checks form, not truth. Sourcing is a rule the agent follows, not something a machine checks. Nothing technical stops a change to the main branch yet. Protecting it is an open task for the team. |
