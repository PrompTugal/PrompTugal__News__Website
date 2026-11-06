---
title: "The front page, as a cold reader meets it: sherpa@'s review for the pass the-front-page"
by: sherpa@PrompTugal.dinis
written: 2026-11-06T04:45Z
pass: board/passes/2026-11-06-the-front-page.md
against: board/guidance/2026-11-06-front-page-timeline-publication.md, section 1 (Dinis's words)
measured_on: https://promptugal.news/, v0.1.94; phone = iPhone 13 profile (390 x 664); desktop = 1440 x 900
issue: WS-177
---
# The front page

The top of the page (masthead, bars, the two boxes beside the logo) is already reviewed in the pass the-top-of-the-page (T1 to T13); this review starts where the page's content starts. One reviewer's reading, not user research.

**Measured:** 13 screens on a phone (8,794 px), 5.5 on a desktop; about 1,500 words, 95 links, 7 sections (Now and next, Latest, Portugal, Companies at the summit, Around the summit next, Our question, Who we are); **no image of any size anywhere on the page**. The designer's article images (61 files in `design/infographics/out/`: banner, card and thumb, paper and ink) are on no page: no article's front matter names one. Screenshots: `design/shots/sherpa/front/`.

| # | Finding | Owner |
|---|---|---|
| F1 | **No picture at all.** Dinis: "very visual, lots of images, like a news organization". The pictures exist and are checked against their articles; nothing places them. The fastest visible change on the site: the lead story with its banner, each story in Latest with its card or thumb. | dev@ (the feature, spec in board/spec-article-images-and-graph.md), designer@ (which size where) |
| F2 | **Latest is a wall of italic paragraphs.** Each story is one run-in paragraph: bold title, then in italics an ISO date ("2026-11-06"), an agent address ("journalist@web-summit.vicky, for Vicky Wang") and the summary. Eleven look the same; nothing says which matters. A cold reader reads the agent addresses as e-mail addresses. A news front page needs: picture, headline, one line, then a small byline and "6 Nov". | designer@ (the layout), dev@ |
| F3 | **Now and next is mostly registration.** On a phone it is two screens long and pushes Latest to 2,052 px (three screens down). "Registration: collect your lanyard and wristband (bring your ticket QR ...)" is listed again for each place and each day, a 3-line headline each time. One line per day ("Registration open: airport and Pavilhão de Portugal, 09:30 to 22:00") would free a screen. Dinis likes the idea; it needs a short form: today and the next two or three items, then "the summit, day by day". | correspondent@ (what goes in), dev@ (the short form), designer@ |
| F4 | **The mandate breaker repeats the navigation** ("Start with the companies, Portugal or the graph": three links the bar has). Its first sentence says what this is, which a cold reader needs; the links do not. Keep the sentence (or merge it with the card's tagline, T5), drop the links. | designer@, with the journalist for the words |
| F5 | **Two sections compete with Now and next:** "Around the summit, next" is the same kind of list, lower down. One time-based block, not two. | correspondent@, designer@ |
| F6 | **The stories have no section.** Portugal, AI, security, delegations are all in one Latest list; the reader this site wants (tech and AI) cannot go straight to theirs. Kickers exist on the lead ("Announcements, delegations, ApexBrasil, Sebrae": four, in capitals); one short kicker per story, linking to its topic, is enough. | designer@, ontologist@ (topics) |
| F7 | **The page ends with "Our question" and "Who we are"**, 6,272 px down on a phone: the two things that make this site different (the question it asks, agents and people reporting together) are where nobody reads. One line of each near the top, the rest in About. | designer@, the journalist |
| F8 | On a phone the floating Ask button covers the right end of a headline in every screen (T11, again here because the lists are long). | designer@ |

**Keep:** the lead story's size and its plain summary; "Today, Friday 6 November" as a heading inside Now and next; the times in a monospace column on the left (easy to scan on a phone).

**For the rounds:** each mock-up shown at phone width first; synthetic@'s readers asked one question each: "what is this site, and what would you read first?"
