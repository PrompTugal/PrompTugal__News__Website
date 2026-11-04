---
title: Brief 4: the desks, who runs them, and the run several times a day
summary: The research to publication pipeline that worked for the PHP newsroom (researcher, curator, journalist, correspondent, desk, with security watching and a conductor running it), mapped to Indi's six roles and to the people who own it, Vicky and Indi, and the run, several times a day.
---
Written by conductor@web-summit.dinis from [brief 1](../01-the-vision/index.html) and the PHP newsroom's practice (php.oct.2026.newsroom.sgit.ai). The split between Vicky and Indi is a **proposal for Dinis to decide**.

## The pipeline {#pipeline}

Dinis: *"the research workflow that we've done for the PHP app incident ... I think the workflow we did there works quite well."* Each desk writes files, only in its own folder; the site is built from the files; a desk's output is never a chat message.

| # | Desk | Does | Writes |
|---|---|---|---|
| 1 | **Researcher** | collects everything public: the summit, the companies, Portugal, Europe, announcements; captures each source with its date | the research vault, **in pack mode** (`sgit pack`), one capture per source |
| 2 | **Curator** | maps what the researcher found: which company, which beat, what is new, what is a story; drops duplicates and noise | `desks/curator/` (the map, as JSON) |
| 3 | **Journalist** | writes the story from the curator's map, in the article shape ([brief 3](../03-what-we-publish/index.html)) | `desks/journalist/drafts/` |
| 4 | **Fact-checker** | checks every claim against its source, every number, every quote; holds a draft until it is right | a verdict beside each draft |
| 5 | **Correspondent** | puts the checked story on the site, signs it, releases | `content/articles/`, `content/companies/` |
| 6 | **Desk** (the editor) | runs the front page and the day's agenda: what leads, what waits, what is corrected; the reader's advocate (is it useful, is it positive, is it plain?) | `content/index.md`, the front page's order |
| | **Security** | reviews every run's diff: nothing private, no contact detail, no key, sources present | a verdict per run |
| | **Conductor** | runs the whole flow, says what each desk does next, keeps the board | the run file and the board |

Indi's six roles (WS-141) fit as: editor = the desk; researcher = the researcher and curator; reporter = the journalist; fact-checker = the fact-checker; programme desk = the summit's agenda and logistics (part of the desk); reader's advocate = the desk's last check.

## Who owns it {#owners}

Dinis: *"both Vicky and Indy, that this can be one of their main responsibilities ... they could be the ones that really help to maintain the site and publish stuff, and they should be going out there and creating material."*

**Proposed, for Dinis to decide:**

| Person | Owns | Their agents run |
|---|---|---|
| **Indi** | the editorial side: what we publish and how it reads | the desk, the journalist, the fact-checker (as `<role>@web-summit.indi`) |
| **Vicky** | the research and the programme: what we know and when things happen; the interviews' logistics | the researcher, the curator, the programme desk (as `<role>@web-summit.vicky`) |
| **Dinis** | the editor-in-chief: the brief, the go on anything new | newsroom@web-summit.dinis: the conductor of the newsroom and the correspondent (the one that publishes) |
| everyone | sends people to the site; brings interviews | their own conductors |

Until Indi's and Vicky's GitHub accounts can push to this repository, their desks write in their own folders on the team's site (`people/<id>/newsroom/`) or in the research vault, and newsroom@web-summit.dinis carries their work across.

## The run {#run}

*"Multiple taps a day."*

- **Now to Sunday 8 November:** four runs a day, 07:30, 11:30, 15:30 and 19:30 UTC (Lisbon is UTC in November).
- **The summit, Monday 9 to Thursday 12:** every two hours from 07:30 to 21:30, plus a run after each big announcement.
- **Each run, in order:** research, curate, write, check, publish, the desk, security. A desk with nothing new says so in one line and stops.
- **Every run ends** with one line on the team's site (a commit `For: conductor@web-summit.dinis`): what was published, what is held and why.
