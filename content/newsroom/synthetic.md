---
title: "Synthetic readers: invented people read PrompTugal.news before Friday's outreach (runs 1 to 4)"
summary: "SYNTHETIC. Five invented personas (a founder who got the email, a bank CISO, a journalist, an investor, an attendee) read the front page, a company page, an article and About on a phone and a desktop. None would reply to the email as it stands; what to fix first, and who owns each fix."
path: newsroom/synthetic.html
---
**Everybody on this page is invented (SYNTHETIC).** The five people below do not exist. Their names, jobs and every word attributed to them were written by a language model: one Claude sub-agent per persona, in the session of synthetic@PrompTugal.dinis, looking at screenshots of this site. **This is not user research.** No sentence here is evidence about a real person, and nothing here speaks for anyone at the companies whose pages were read.

What is measured, not narrated: the screenshots (Playwright and Chromium on the live site, 390 x 844 phone and 1280 x 800 desktop, all 24 captures at v0.1.47, 6 November 2026, about 00:40 UTC), each page's HTTP status, height and width ([measurements.json](../desks/synthetic/run-1/screens/measurements.json)), and the text checks listed under "Measured". Page-view counting was paused for every capture, so no synthetic read is counted as a reader.

Run by synthetic@PrompTugal.dinis for WS-177 (PrompTugal.news ready for outreach by Friday). Method: synthetic@web-summit.indi's on the team site (WS-142), after the synthetic-users vaults on [sgit.ai](https://sgit.ai/demos/vaults/index.html). The protocol: [protocol.md](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-1/protocol.md); the personas: [personas.md](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-1/personas/personas.md); every screenshot: [screens/](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-1/screens).

## In short

- **Would they reply to the email?** Founder: maybe, leaning no (forwards it to her cofounder: "is this RiskMandate marketing?"). CISO: no, not himself (answering the three questions in public maps the bank's attack surface; he forwards it to comms to check the page). Journalist: maybe, for the 15 minutes, not the questions. Investor: maybe, leaning no. Attendee: maybe, leaning no (forwards to his CTO). **None of the five replies as things stand.** (All SYNTHETIC.)
- **What works, for all five:** every fact has its source and the date it was read; "What this does not claim" is the section they trusted most; the RiskMandate disclosure is plain and in the same words on every page; the founder found the facts about her company right and no people listed.
- **What loses them:** a "£5.00 credit" and "0.5p of 5p" meter nobody explains (all five read it as a paywall or a charge, and as pay-to-be-featured on a company page); no way to reach a person or send a correction on any page they read; a company page that says the team keeps notes on "whether to meet, who owns it" (a sales lead, said three of five) and "We have not asked ChatPlace yet" under an email that is asking; an About page that is stale and contradicts the site.
- 5 personas, 150 steps, 102 findings: 0 blocking, 27 costly, 50 minor, 25 held (works).

## Measured

These do not depend on any persona; each was checked on the live site or its text at v0.1.47.

- **The mandate the email states ("to map the universe of AI in Portugal")** (front page, About, the five company pages, the five articles): **on none of them** (text search, 12 pages).
- **A way to contact the newsroom or send a correction** (the same 12 pages): **none**: "Tell us" has no link; About says "We never publish contact details".
- **Page wider than a 390 px phone (scrolls sideways)** (three articles: the numbers, the first day, Tuesday 10 November): **591, 429 and 399 px**: the chart's SVG and the agent block's `code` at the end of the page.
- **Source repository named** (About (twice) and the footer's "Source code"): the old SGit-AI newsroom repository; the agent block on the same pages names PrompTugal/PrompTugal__News__Website, the one in use.
- **About is current** (About): "the writing desks are next" (twice) while eight articles by the writing desks are live; "As of 5 November"; "Vicky, editor" where the footer says "Vicky Wang".
- **The company page and the email agree** (companies/chatplace/): the email says "where it sits in the summit's map of AI"; the page files it only under "Portuguese startups"; the page says "We have not asked ChatPlace yet".
- **The team's sales notes are mentioned** (every company page ("Where this comes from")): "The team's own notes on each company (why it matters, whether to meet, who owns it)".
- **Every page answers** (all 12, phone and desktop): 200, 3.5 to 5 s to network idle.


## The founder who got the email: Inês Valente (SYNTHETIC)

**SYNTHETIC.** Read the front page, [chatplace](../companies/chatplace/index.html), [tuesday](../articles/tuesday-10-november-three-ways-in.html) and About; 36 steps. The run, step by step: [runs/founder.json](../desks/synthetic/run-1/runs/founder.json).

**Outcome (SYNTHETIC):** does not reply on Friday; forwards the link to her cofounder with 'parece legítimo mas é marketing da RiskMandate?' and keeps it as a maybe for after the summit

| Question | The persona's answer (SYNTHETIC, invented) |
|---|---|
| What is this? | Uma redação nova, em inglês, sobre a Web Summit, que tem uma página sobre nós. On the phone it looked like a news site with an agenda; by the end it looked like a RiskMandate project that asks every company the same three security questions, with a nice news site around it. |
| Who made it? | Dinis Cruz and two other editors, one of them only 'Vicky', with AI agents doing the actual work, and the same team works on RiskMandate. Also something called web-summit.sgit.ai. I could not tell which company is legally behind it. |
| Can I trust it? | Partly. The facts about us are correct and every one has a source and a date, and they say openly that they are not independent of RiskMandate, which most sponsored media never admit. But the pound meter, the 'team's notes on whether to meet', and About saying changes go live without human review make me careful about giving them my words. |
| What do I do next? | Nothing urgent: the page is right, so there is nothing to correct. I forward it to my cofounder today. If anything, after the summit, I might answer the three questions in writing, once I know who reads them and that a person checks the text before it goes up. |
| Would I reply to the email? | Maybe, leaning no for now. The page is correct, so the 'is your page right?' hook gives me no reason to reply, and the 15 minute ask during the summit week, from a two-day-old site tied to a security vendor, loses to everything else in my calendar. |
| One change that would make me act | One line at the top of our page, in Portuguese, from Dinis: 'RiskMandate does not pay for or see your answer; you approve your words before they are published', and a plain 'reply / correct this page' button. Then I would answer in two lines. |

Findings (7 costly, 8 minor, 7 held):

- **costly**: The '£4.99' button sits unlabelled in the phone nav next to 'Vault', so a founder arriving from an outreach email reads it as a paywall or a pay-to-be-featured price. ([co-chatplace-phone-s1.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s1.jpg))
- **costly**: The reading meter 'This page 0.5p of 5p', 'Balance £4.99' and 'Rate it, or do not pay for it' is never explained on the page and reinforces the suspicion of paid media. ([co-chatplace-phone-s5.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s5.jpg))
- **costly**: The email promises the page shows 'onde está no mapa da IA da cimeira', but the page files the company only under 'Portuguese startups', and front-phone-s6 shows an 'AI agents' field (22) it is not in. ([co-chatplace-phone-s2.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s2.jpg))
- **costly**: 'We have not asked ChatPlace yet. When they answer, it goes here.' contradicts the email that is asking them, so the page looks stale the moment the recipient lands. ([co-chatplace-phone-s3.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s3.jpg))
- **costly**: Mentioning that the team's notes record 'whether to meet' and 'who owns it' for each company tells the founder she is a lead in a pipeline, without saying whose. ([co-chatplace-phone-s4.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s4.jpg))
- **costly**: About says 'A change to the development branch goes live with no human review first', which undercuts the email's promise that the answer goes in 'nas vossas palavras'. ([about-phone-s6.jpg](../desks/synthetic/run-1/screens/about-phone-s6.jpg))
- **costly**: The company page ends with no reply, correct or answer action; the only route to the three questions is the email reply. ([co-chatplace-phone-s7.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s7.jpg))
- **minor**: The email is in Portuguese and the linked page is entirely in English, with no Portuguese line for the company it is addressed to. ([co-chatplace-phone-s1.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s1.jpg))
- **minor**: Three names appear (PrompTugal.news, RiskMandate, web-summit.sgit.ai) and no legal entity or company behind the newsroom is named. ([about-phone-s2.jpg](../desks/synthetic/run-1/screens/about-phone-s2.jpg))
- **minor**: About names the source as 'SGit-AI/SGit-AI__Website__Newsroom__Web-Summit' while the footer on about-phone-s8 says 'github.com/PrompTugal/PrompTugal__News__Website'. ([about-phone-s4.jpg](../desks/synthetic/run-1/screens/about-phone-s4.jpg))
- **minor**: An editor is 'Vicky' on the front page and About but 'Vicky Wang' in bylines and footer, which makes a reader doubt she is a real person. ([front-phone-s8.jpg](../desks/synthetic/run-1/screens/front-phone-s8.jpg))
- **minor**: The graph shows Air Apps as 'United States' inside the 'Portuguese startups' cluster, which reads as an error and makes the founder distrust the map. ([co-chatplace-desktop-s1.jpg](../desks/synthetic/run-1/screens/co-chatplace-desktop-s1.jpg))
- **minor**: '(conferenceSlug lis26)' and 'newsroom@web-summit.dinis' as the re-checker are internal identifiers shown to a business reader. ([co-chatplace-phone-s2.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s2.jpg))
- **minor**: 'Who made this' lists agents, 'storyline S18' and 'desks/curator/README.md' but does not say plainly whether a person read the article. ([ar-tuesday-phone-s8.jpg](../desks/synthetic/run-1/screens/ar-tuesday-phone-s8.jpg))
- **minor**: The bold 'The independent newsroom' is qualified in the same paragraph by 'not independent of RiskMandate', which reads as overselling. ([about-phone-s1.jpg](../desks/synthetic/run-1/screens/about-phone-s1.jpg))
- **held**: The 'What they do' description matches the company's own words, and the founder found nothing wrong to correct. ([co-chatplace-phone-s1.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s1.jpg))
- **held**: 'independent of Web Summit, not of RiskMandate' stated plainly on the company page is the first thing that raises trust. ([co-chatplace-phone-s5.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s5.jpg))
- **held**: 'Where this comes from' gives a real websummit.com URL and the date it was read, delivering on the email's 'cada facto tem a sua fonte e a data'. ([co-chatplace-phone-s3.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s3.jpg))
- **held**: 'No one is listed under ChatPlace in the summit pages we have read' reassures the founder that her people were not dug up. ([co-chatplace-phone-s2.jpg](../desks/synthetic/run-1/screens/co-chatplace-phone-s2.jpg))
- **held**: 'A first-time founder could start at the first-timers meetup and go on to the data spaces masterclass' is useful advice with no pitch in it, and lifts the site in her eyes. ([ar-tuesday-phone-s5.jpg](../desks/synthetic/run-1/screens/ar-tuesday-phone-s5.jpg))
- **held**: 'The agent's own limits' answering Reach, Mandate, Gap for the newsroom itself makes the three questions feel fair rather than a sales script. ([about-phone-s5.jpg](../desks/synthetic/run-1/screens/about-phone-s5.jpg))
- **held**: The email's 'Escrito por um agente de IA, revisto e enviado por mim' and the opt out line are read as more honest than typical media outreach.

Screens: [co-chatplace-phone-s1](../desks/synthetic/run-1/screens/co-chatplace-phone-s1.jpg), [co-chatplace-phone-s5](../desks/synthetic/run-1/screens/co-chatplace-phone-s5.jpg), [about-phone-s5](../desks/synthetic/run-1/screens/about-phone-s5.jpg), [co-chatplace-desktop-s1](../desks/synthetic/run-1/screens/co-chatplace-desktop-s1.jpg).

## The CISO at a large Portuguese bank: Rui Barata (SYNTHETIC)

**SYNTHETIC.** Read the front page, [feedzai](../companies/feedzai/index.html), [pavilion-4](../articles/europe-in-pavilion-4.html) and About; 25 steps. The run, step by step: [runs/ciso.json](../desks/synthetic/run-1/runs/ciso.json).

**Outcome (SYNTHETIC):** Read to the end on desktop because the disclosure is up front and honest, judged it a well-sourced RiskMandate lead list with a newspaper front, and would not reply to the email himself: he would forward it to comms to check the page for errors.

| Question | The persona's answer (SYNTHETIC, invented) |
|---|---|
| What is this? | A Web Summit guide for Lisbon written mostly by AI agents, with a page on each company they 'follow', every fact linked and dated. Underneath, it is RiskMandate's way of putting its three questions, reach, mandate, gap, in front of 120 companies, security and GRC first. |
| Who made it? | A small team, Dinis Cruz as editor-in-chief with Indi Gupte and someone called Vicky, and a set of AI agents doing the writing, reviewing and publishing. The same team works on RiskMandate. What I could not find on these screens is what RiskMandate is as a company and who owns it. |
| Can I trust it? | The facts, mostly yes: every one has a URL and a date, the article says what it does not claim and even records a 403, and the code and data are public. The framing, no more than any vendor content: by their own admission they are 'not independent of RiskMandate', the company pages come from a list with 'whether to meet' notes, and the About page says changes go live with no human review and the main branch is unprotected. |
| What do I do next? | Nothing this week for me. I would ask our comms team to read whatever page they have on the bank and flag errors, and I might have one of my people look at the signing and the repository out of professional curiosity. If RiskMandate is at the summit I would not seek them out. |
| Would I reply to the email? | No, not myself. A bank answering in public what its agents can reach and who controls the gap is handing out a map of its attack surface, and under DORA that goes through our third-party and communications process, not a 15-minute chat with a vendor. I would forward it to comms to check the facts on the page, and if the email had a clear corrections address I would let them use it. The line 'Drafted by an AI agent, reviewed and sent by me' I respect; 'powered by RiskMandate' in the signature is what makes it a sales email. |
| One change that would make me act | Separate the newsroom from the sale in writing: a short, plain statement of what RiskMandate is, who owns it and pays the editors, and a promise that answers to the three questions are optional, never used for sales and can be given in general terms, plus a real corrections address on every company page. And protect your own main branch before asking me about my gap. |

Findings (6 costly, 11 minor, 5 held):

- **costly**: No screen says what RiskMandate is as a business (legal entity, owner, whether it sells to the companies covered, whether the editors are paid by it), so a reader cannot weigh the disclosure the site asks him to weigh. ([about-desktop-s2.jpg](../desks/synthetic/run-1/screens/about-desktop-s2.jpg))
- **costly**: The note 'The team's own notes on each company (why it matters, whether to meet, who owns it) are not published here' tells a reader that every company page is backed by a sales-style account record, which turns the page into a lead in his eyes. ([co-feedzai-desktop-s4.jpg](../desks/synthetic/run-1/screens/co-feedzai-desktop-s4.jpg))
- **costly**: 'Something wrong? Tell us and we correct it' sits next to 'We publish no contact details', and no screen shows how to tell them, so the promised correction route has no visible door. ([co-feedzai-desktop-s4.jpg](../desks/synthetic/run-1/screens/co-feedzai-desktop-s4.jpg))
- **costly**: 'A change to the development branch goes live with no human review first... Nothing technical stops a change to the main branch yet' is honest, but read by a CISO it is an open control gap at the very vendor asking him about his gap. ([about-desktop-s5.jpg](../desks/synthetic/run-1/screens/about-desktop-s5.jpg))
- **costly**: A '£5.00 credit' pill that drops to £4.99 on the next page and a 'This page 0.1p of 1p ... Rate it, or do not pay for it' bar are never explained on the screens read, and look like a payment mechanism to a bank reader. ([front-desktop-s1.jpg](../desks/synthetic/run-1/screens/front-desktop-s1.jpg))
- **costly**: On the phone the 'INDEPENDENT ... our disclosure' box is absent from the first screen, so the only ownership signal a phone reader gets is 'Powered by RiskMandate'. ([front-phone-s1.jpg](../desks/synthetic/run-1/screens/front-phone-s1.jpg))
- **minor**: 'founded in Portugal (its CTO, the first employee, is listed by Web Summit from Portugal)' backs a founding fact with an inference from a speaker listing rather than a cited source. ([co-feedzai-desktop-s2.jpg](../desks/synthetic/run-1/screens/co-feedzai-desktop-s2.jpg))
- **minor**: An 'OUR PICK' tag on a vendor's session contradicts 'Nothing on it is an endorsement' two screens later, with no stated basis for the pick. ([co-feedzai-desktop-s2.jpg](../desks/synthetic/run-1/screens/co-feedzai-desktop-s2.jpg))
- **minor**: 'If you are at Feedzai, the quickest way to get this right is to tell us how it works' reads as a request for product internals, which a security or fraud company will not give in public. ([co-feedzai-desktop-s3.jpg](../desks/synthetic/run-1/screens/co-feedzai-desktop-s3.jpg))
- **minor**: 'Who made this' lists an agent writer, an agent reviewer and an agent publisher with no human named as having read the article before it went live. ([ar-pavilion-4-desktop-s5.jpg](../desks/synthetic/run-1/screens/ar-pavilion-4-desktop-s5.jpg))
- **minor**: A source given as 'S2, desks/curator/README.md' is an internal file path that a reader cannot open or interpret. ([ar-pavilion-4-desktop-s5.jpg](../desks/synthetic/run-1/screens/ar-pavilion-4-desktop-s5.jpg))
- **minor**: The editor is 'Vicky' on About and the front page but 'Vicky Wang' in bylines and the company page footer, an inconsistency a reader checking who is behind the site notices. ([about-desktop-s2.jpg](../desks/synthetic/run-1/screens/about-desktop-s2.jpg))
- **minor**: The key that signs articles 'dies with the session', and no screen says how a reader verifies a signature after that. ([about-desktop-s5.jpg](../desks/synthetic/run-1/screens/about-desktop-s5.jpg))
- **minor**: 'Registration: collect your lanyard and wristband' repeats for each day and place in the agenda column, crowding out everything else on desktop and phone. ([front-desktop-s2.jpg](../desks/synthetic/run-1/screens/front-desktop-s2.jpg))
- **minor**: The floating 'Ask' button covers text on every phone screen read, including the first of the three questions and a source's 'read' date. ([co-feedzai-phone-s3.jpg](../desks/synthetic/run-1/screens/co-feedzai-phone-s3.jpg))
- **minor**: The company graph on the phone has labels too small to read and one truncated ('The Hacking Ga...'). ([co-feedzai-phone-s1.jpg](../desks/synthetic/run-1/screens/co-feedzai-phone-s1.jpg))
- **minor**: The same long websummit.com session URL is printed three times in one phone screen, breaking the text into hexadecimal fragments. ([co-feedzai-phone-s2.jpg](../desks/synthetic/run-1/screens/co-feedzai-phone-s2.jpg))
- **held**: The 'INDEPENDENT ... The same team works on RiskMandate: our disclosure' box is in the first desktop screen, so the vendor tie is disclosed before any article is read. ([front-desktop-s1.jpg](../desks/synthetic/run-1/screens/front-desktop-s1.jpg))
- **held**: 'we are independent of Web Summit, not of RiskMandate. Read our disclosure before you weigh what we say' is stated plainly and repeated identically on the company page footer and About, which a sceptical reader checks for and finds consistent. ([front-desktop-s5.jpg](../desks/synthetic/run-1/screens/front-desktop-s5.jpg))
- **held**: 'The agent's own limits' answers reach, mandate and gap for the site's own agent before asking companies, which reads as practising what it preaches. ([about-desktop-s5.jpg](../desks/synthetic/run-1/screens/about-desktop-s5.jpg))
- **held**: 'WHAT THIS DOES NOT CLAIM', including 'did not list Henna Virkkunen' and the EUIPO '403 on 5 November', shows the limits of the sourcing and is what moved this reader from suspicion to provisional trust in the facts. ([ar-pavilion-4-desktop-s4.jpg](../desks/synthetic/run-1/screens/ar-pavilion-4-desktop-s4.jpg))
- **held**: Public source code, data as JSON, a release history and a version on every page give a technical reader something he can audit himself. ([about-desktop-s4.jpg](../desks/synthetic/run-1/screens/about-desktop-s4.jpg))

Screens: [front-desktop-s1](../desks/synthetic/run-1/screens/front-desktop-s1.jpg), [co-feedzai-desktop-s4](../desks/synthetic/run-1/screens/co-feedzai-desktop-s4.jpg), [about-desktop-s4](../desks/synthetic/run-1/screens/about-desktop-s4.jpg), [front-phone-s1](../desks/synthetic/run-1/screens/front-phone-s1.jpg).

## The journalist from another outlet: Tomás Iglesias (SYNTHETIC)

**SYNTHETIC.** Read the front page, [startup-portugal](../companies/startup-portugal/index.html), [in-numbers](../articles/web-summit-2026-in-numbers.html) and About; 36 steps. The run, step by step: [runs/journalist.json](../desks/synthetic/run-1/runs/journalist.json).

**Outcome (SYNTHETIC):** Read to the end of the numbers article and used its source list to go to Web Summit's own pages; would cite Web Summit, not PrompTugal.news; would not answer the three questions but might take the 15 minutes because an AI-run newsroom tied to a vendor is a story in itself.

| Question | The persona's answer (SYNTHETIC, invented) |
|---|---|
| What is this? | A tip sheet and agenda for Web Summit Lisbon, written and published by AI agents, with every number tagged to a URL and a date. The numbers article is genuinely useful as a crib sheet; the company pages are templates with a vendor's question bolted on. |
| Who made it? | A small team, Dinis Cruz as editor-in-chief plus Indi Gupte and a 'Vicky' or 'Vicky Wang', who also work on a product called RiskMandate, which is in the masthead as 'Powered by'. In practice the pages are made by agents with addresses like journalist@web-summit.vicky, and About says no human reviews a change before it goes live. |
| Can I trust it? | I trust the source list, not the site. The 'What this does not claim' section and the dated source URLs are better practice than most event coverage, and they let me check everything myself in minutes. But About admits the only check 'checks form, not truth', the editors work on the vendor whose framework is the editorial line, and I found small contradictions (no summit page vs two summit session links on Startup Portugal, two repository addresses, 'writing desks are next' under an article by a writing desk). So: a good map, not a source. |
| What do I do next? | Tonight, open the Web Summit survey release of 22 October and the 'How we select our startups' page from the list and take my numbers from there. Ask the press office whether 70,000 this year against 71,386 last year means flat. Put Tuesday 10 Nov 12:00 (Startup Portugal masterclass) and Thursday 12 Nov 12:30, Stage 2 (Road 2 Web Summit winner) in my diary. Maybe a short item on AI-run newsrooms at the summit. |
| Would I reply to the email? | Maybe, but not to the questionnaire. My paper does not run AI agents in that sense, so 'what your agents can reach' does not fit us and reads like the vendor's discovery call. I might reply to take the 15 minutes as a reporter, because a newsroom run by AI agents and powered by a security vendor, at Web Summit, is itself a story, and Dinis Cruz signing it personally helps. Cite or link PrompTugal.news? I would not cite it for any fact; I would cite Web Summit, Lusa and the other primary sources it lists. I might link it once if I write about the site itself, described as 'run by AI agents, linked to RiskMandate'. |
| One change that would make me act | Put a human's name and a press contact on every article, with one line saying whether that person read it before it went live. That alone would move it from a crib sheet to something I could quote as 'PrompTugal.news reported'. |

Findings (5 costly, 12 minor, 5 held):

- **costly**: About states that a change 'goes live with no human review first' and the check 'checks form, not truth', which rules the site out as a citable source for a reporter; no article says whether a human read it. ([about-phone-s6.jpg](../desks/synthetic/run-1/screens/about-phone-s6.jpg))
- **costly**: There is no contact or press link in the footer or in About's eight headings, so a reporter cannot reach a human editor to check a fact or ask for a correction. ([ar-in-numbers-phone-s8.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s8.jpg))
- **costly**: The Startup Portugal page says 'there is no summit page for it in the team's sources' after citing two websummit.com session URLs on the same page. ([co-startup-portugal-phone-s4.jpg](../desks/synthetic/run-1/screens/co-startup-portugal-phone-s4.jpg))
- **costly**: The header balance falls from '£5.00' to '£4.96' and then '£4.95' while reading, with no explanation on screen, which reads as being charged without consent. ([ar-in-numbers-phone-s1.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s1.jpg))
- **costly**: About says 'the writing desks are next' and the agent 'started on 4 November', while the site already carries articles by 'Vicky Wang's journalist desk'; the About page is stale relative to the content it describes. ([about-phone-s2.jpg](../desks/synthetic/run-1/screens/about-phone-s2.jpg))
- **minor**: The balance shows £4.98 on the company page and £5.00 on About after £4.95 on the article, so the meter is inconsistent across pages. ([co-startup-portugal-phone-s6.jpg](../desks/synthetic/run-1/screens/co-startup-portugal-phone-s6.jpg))
- **minor**: The reading box says 'read 20%' at the end of the article after scrolling through every section. ([ar-in-numbers-phone-s7.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s7.jpg))
- **minor**: About gives the source code as 'SGit-AI/SGit-AI__Website__Newsroom__Web-Summit' while the footer of the same page gives 'github.com/PrompTugal/PrompTugal__News__Website'. ([about-phone-s4.jpg](../desks/synthetic/run-1/screens/about-phone-s4.jpg))
- **minor**: One editor is 'Vicky' on the front page and About but 'Vicky Wang' in bylines and the footer, so her published name is unclear. ([front-phone-s8.jpg](../desks/synthetic/run-1/screens/front-phone-s8.jpg))
- **minor**: Bylines are machine addresses ('journalist-europe@web-summit.vicky, for Vicky Wang') with no plain statement of which human is accountable for each piece. ([front-phone-s3.jpg](../desks/synthetic/run-1/screens/front-phone-s3.jpg))
- **minor**: The last 'source' is 'From the curator's map: S5, desks/curator/README.md... left to S13', internal workflow that is not a source a reader can use. ([ar-in-numbers-phone-s6.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s6.jpg))
- **minor**: The headline puts '10,000 startups' in large type while the body says the figure is not comparable to the 2,700 accepted; the headline sells harder than the body supports. ([ar-in-numbers-phone-s5.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s5.jpg))
- **minor**: The 'flows' and Reach/Mandate/Gap template asks a public startup programme how AI agents act in 'its product', which does not fit the organisation and reads as the vendor's framework applied to everyone. ([co-startup-portugal-phone-s3.jpg](../desks/synthetic/run-1/screens/co-startup-portugal-phone-s3.jpg))
- **minor**: The relationship graph is too small to read at phone width, and the page says 'the role is not stated in our sources' while the graph shows Startup Portugal hosting a session. ([co-startup-portugal-phone-s1.jpg](../desks/synthetic/run-1/screens/co-startup-portugal-phone-s1.jpg))
- **minor**: The phone navigation shows only NOW, AGENDA and a cut-off NEWS; COMPANIES, PEOPLE, PORTUGAL and THE GRAPH appear only on desktop. ([ar-in-numbers-desktop-s1.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-desktop-s1.jpg))
- **minor**: Reader pages show 'Admin', 'Control centre', 'Design review' and 'Page views: paused on this device', which make a news site look like a staging site. ([co-startup-portugal-phone-s7.jpg](../desks/synthetic/run-1/screens/co-startup-portugal-phone-s7.jpg))
- **minor**: Portugal links take their date from the URL ('the date in its address') and the 'companies we follow' chips include KPMG, MEO and AICEP under a Portuguese heading next to a count of 8 Portuguese startups. ([front-phone-s5.jpg](../desks/synthetic/run-1/screens/front-phone-s5.jpg))
- **held**: The 'What this does not claim' section answers a reporter's questions before they are asked: it separates 10,000 startups from 2,700 accepted, names the 2025 figures as Lusa and ApexBrasil, and says the full survey report was not read. ([ar-in-numbers-phone-s5.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s5.jpg))
- **held**: Every source in the numbers article is given as a full URL with the date read, so each figure can be checked at Web Summit's own page in minutes. ([ar-in-numbers-phone-s6.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s6.jpg))
- **held**: Each number in 'In short' carries its attribution in the sentence ('according to Web Summit', 'as reported by Lusa and ApexBrasil'), so it can be copied with its source attached. ([ar-in-numbers-phone-s2.jpg](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s2.jpg))
- **held**: The front page says plainly 'independent of Web Summit, not of RiskMandate' and links the disclosure, so the conflict is visible before any article is read. ([front-phone-s8.jpg](../desks/synthetic/run-1/screens/front-phone-s8.jpg))
- **held**: The company page gives two dated, located, sourced sessions (Tue 10 Nov 12:00 Masterclass 1; Thu 12 Nov 12:30 Stage 2 press conference) that work as story leads. ([co-startup-portugal-phone-s2.jpg](../desks/synthetic/run-1/screens/co-startup-portugal-phone-s2.jpg))

Screens: [front-phone-s1](../desks/synthetic/run-1/screens/front-phone-s1.jpg), [ar-in-numbers-phone-s3](../desks/synthetic/run-1/screens/ar-in-numbers-phone-s3.jpg), [co-startup-portugal-phone-s5](../desks/synthetic/run-1/screens/co-startup-portugal-phone-s5.jpg), [about-desktop-s1](../desks/synthetic/run-1/screens/about-desktop-s1.jpg).

## The investor scanning Portuguese AI: Sophie Laurent (SYNTHETIC)

**SYNTHETIC.** Read the front page, [air-apps](../companies/air-apps/index.html), [universities](../articles/lisbon-universities-at-web-summit.html) and About; 25 steps. The run, step by step: [runs/investor.json](../desks/synthetic/run-1/runs/investor.json).

**Outcome (SYNTHETIC):** Left with a shortlist of three names (Air Apps, Opsivision.ai, Tecnico's stand E272) but no stage, funding or founder for any of them; would use the site as a sourced map of who is there, not as a deal-flow list, and would not reply to the email on a first read.

| Question | The persona's answer (SYNTHETIC, invented) |
|---|---|
| What is this? | A summit newsroom for Web Summit Lisbon: the agenda, a profile for each of about 120 companies, and some careful articles. It looks at AI through one particular lens, agent permissions, which is RiskMandate's lens. It is not a deal-flow list, even if the Portugal block made me hope for one. |
| Who made it? | A small team, Dinis Cruz in charge with two editors, Indi Gupte and Vicky, and a lot of AI agents doing the writing and the building. They say plainly that the same team works on RiskMandate. I could not tell you who any of them is professionally, because the About page gives names and roles and nothing else. |
| Can I trust it? | For the facts they print, yes, more than most trade press: each one has a link and a date, and they publish what they did not check. For the judgement I need, there is nothing to trust or distrust, because they do not publish it. They even say they keep a note on whether to meet each company and hold it back. And the About page admits nothing a human reviews goes live before publication, so I would check any number before quoting it to my partners. |
| What do I do next? | Tonight at the hotel: open airapps.co and look up the six Tecnico spin-offs, especially Opsivision.ai. Tuesday 10 November: Tecnico's stand E272, and the UniVerse pitch day if I can find out who pitches. I might come back to the Companies page once, filtered to Portuguese startups, before Tuesday. That is all. |
| Would I reply to the email? | Maybe, leaning no. The tone is unusually honest, the page about my fund would have sources, and 'reply if anything is wrong' is a fair offer. But the three questions are about our AI agents' permissions, which is a security vendor's discovery call, and 'powered by RiskMandate' tells me who the 15 minutes are for. A seed fund has no agents worth discussing. I would reply only to correct a fact on our page, and I would decline the meeting unless RiskMandate itself were raising. |
| One change that would make me act | On each company page, one block for investors: stage (programme is a start, funding round if public), founders by name with a source, team size, and the stand or pavilion, sourced like everything else. And a Portuguese AI startups list I can filter by stage. Then I would book meetings from it. |

Findings (5 costly, 7 minor, 5 held):

- **costly**: "Portuguese companies we follow" mixes KPMG, MEO, AICEP, Startup Portugal and VTEX with startups, and only 8 of 120 are filed under Portuguese startups, so an investor cannot get a list of investable Portuguese AI companies from the front page. ([front-desktop-s3.jpg](../desks/synthetic/run-1/screens/front-desktop-s3.jpg))
- **costly**: The company page has no founders, no funding or stage beyond "GROWTH programme", and no stand location, the three things an investor looks for first. ([co-air-apps-desktop-s2.jpg](../desks/synthetic/run-1/screens/co-air-apps-desktop-s2.jpg))
- **costly**: The article suggests investors start at Tecnico's stand E272 while stating the spin-offs' own sites were not read, so the six names come with no product, stage or team. ([ar-universities-desktop-s4.jpg](../desks/synthetic/run-1/screens/ar-universities-desktop-s4.jpg))
- **costly**: "£5.00 credit", "Vault" and the per-page "0.1p of 1p ... Rate it, or do not pay for it" bar are unexplained, and the balance changes between pages (£4.98, £4.94, back to £5.00 on About), so a reader cannot tell whether reading costs money. ([front-desktop-s1.jpg](../desks/synthetic/run-1/screens/front-desktop-s1.jpg))
- **costly**: On the phone the nav is clipped after "NEWS" with no sign it scrolls, so Companies, Portugal and About are hidden, and the floating "Ask" button covers text on every phone screen seen. ([front-phone-s1.jpg](../desks/synthetic/run-1/screens/front-phone-s1.jpg))
- **minor**: On the phone the agenda runs at least two full screens before any company or Portugal block, with near-identical "Registration: collect your lanyard" entries repeated. ([front-phone-s2.jpg](../desks/synthetic/run-1/screens/front-phone-s2.jpg))
- **minor**: The company graph takes half the first screen to show links that exist only because companies share a tag (Air Apps to AICEP, iTRecruiter), which looks like insight but carries none. ([co-air-apps-desktop-s1.jpg](../desks/synthetic/run-1/screens/co-air-apps-desktop-s1.jpg))
- **minor**: Raw field text "(conferenceSlug lis26)" appears in reader-facing copy, and "No one is listed under Air Apps" reads as if the company has no people. ([co-air-apps-desktop-s2.jpg](../desks/synthetic/run-1/screens/co-air-apps-desktop-s2.jpg))
- **minor**: About says "the writing desks are next" while the articles are bylined to journalist desks, and the third editor is "Vicky" there but "Vicky Wang" in the footer. ([about-desktop-s2.jpg](../desks/synthetic/run-1/screens/about-desktop-s2.jpg))
- **minor**: About names the source code as SGit-AI/SGit-AI__Website__Newsroom__Web-Summit while the page footer names PrompTugal/PrompTugal__News__Website. ([about-desktop-s4.jpg](../desks/synthetic/run-1/screens/about-desktop-s4.jpg))
- **minor**: "From the curator's map: S10, desks/curator/README.md" is an internal file path listed as a reader-facing source. ([ar-universities-desktop-s5.jpg](../desks/synthetic/run-1/screens/ar-universities-desktop-s5.jpg))
- **minor**: "Goes live with no human review first" sits against "Reviewed by reviewer@web-summit.vicky" on the article, and the reader has to work out that the reviewer is an agent. ([about-desktop-s5.jpg](../desks/synthetic/run-1/screens/about-desktop-s5.jpg))
- **held**: "What this does not claim" (rankings are ULisboa's own, UniVerse pitchers not known) was the most trust-building section in the run. ([ar-universities-desktop-s4.jpg](../desks/synthetic/run-1/screens/ar-universities-desktop-s4.jpg))
- **held**: "says it is on track for $100M revenue" marks a company claim as a claim, and the traction line is visible on the first phone screen. ([co-air-apps-desktop-s2.jpg](../desks/synthetic/run-1/screens/co-air-apps-desktop-s2.jpg))
- **held**: The "INDEPENDENT ... The same team works on RiskMandate" box and "independent of Web Summit, not of RiskMandate" disclosure are clear and repeated, so the interest is never hidden. ([front-desktop-s1.jpg](../desks/synthetic/run-1/screens/front-desktop-s1.jpg))
- **held**: A concrete, actionable pointer (stand E272, UniVerse on 10 November, "investors in robotics and deep tech could start at") gave the investor her only calendar entry. ([ar-universities-desktop-s3.jpg](../desks/synthetic/run-1/screens/ar-universities-desktop-s3.jpg))
- **held**: Each fact carries a source link, the date read and a re-check timestamp, and the page says the team's own notes are deliberately not published. ([co-air-apps-desktop-s3.jpg](../desks/synthetic/run-1/screens/co-air-apps-desktop-s3.jpg))

Screens: [front-desktop-s1](../desks/synthetic/run-1/screens/front-desktop-s1.jpg), [co-air-apps-desktop-s1](../desks/synthetic/run-1/screens/co-air-apps-desktop-s1.jpg), [ar-universities-desktop-s3](../desks/synthetic/run-1/screens/ar-universities-desktop-s3.jpg), [front-phone-s2](../desks/synthetic/run-1/screens/front-phone-s2.jpg).

## The Web Summit attendee looking for what to see: Daniel Okafor (SYNTHETIC)

**SYNTHETIC.** Read the front page, [aicep](../companies/aicep/index.html), [first-day](../articles/your-first-day-at-web-summit.html) and About; 28 steps. The run, step by step: [runs/attendee.json](../desks/synthetic/run-1/runs/attendee.json).

**Outcome (SYNTHETIC):** Daniel got what he came for from one article (wristband, metro, transport pass, first-timers meetup) and screenshotted it, but the front page buried that article under news and the AICEP page told him nothing he could act on; he would not reply to the email in its current form.

| Question | The persona's answer (SYNTHETIC, invented) |
|---|---|
| What is this? | It is an unofficial news site about Web Summit Lisbon, made by a small team with AI agents. The part that helped me is a practical guide to getting from the airport to the arena; the rest is news, company profiles and some AI-agent questions I did not need. |
| Who made it? | Dinis Cruz, Indi Gupte and Vicky (Wang, I think), plus a lot of AI agents with email-looking names. The same team works on something called RiskMandate. It says clearly that it is not Web Summit. |
| Can I trust it? | For the transport stuff, mostly yes: every time and price had a Web Summit or Metro de Lisboa link read yesterday, and it even listed which official pages are out of date. For the AICEP page, no: it said 'Confirmed: Yes' and '404' and 'No one is listed' at the same time, so I would not plan my day on it. The pounds balance that kept changing also made me a bit wary. |
| What do I do next? | Monday 9 November: land, collect wristband and buy the 23-euro 3-day pass at the Terminal 1 accreditation area (7.30am to 10pm), red line to Oriente. Tuesday 10 at 11am: the first-timers' meetup, if I can find out where it is. Before that, open the official app, because the site itself says times can change. |
| Would I reply to the email? | Maybe, leaning no. A page about my company with every fact sourced and an open 'tell us if it is wrong' is a decent reason to check it, and I like that it says an AI drafted it and a named person sent it. But I am a PM at my first summit, not the person who decides about our AI agents' permissions, and three questions plus a 15-minute meeting from a site 'powered by RiskMandate' reads like a polite sales lead. I would forward it to our CTO or security lead and not reply myself. |
| One change that would make me act | Put a 'First time at Web Summit? Start here' card at the very top of the front page that links to the first-day guide and shows Monday to Thursday with where each thing is; and drop or explain the '£5.00' balance. |

Findings (4 costly, 12 minor, 3 held):

- **costly**: The first-day article, the one a first-time attendee needs, is the sixth item in 'Latest', four phone screens down, with no visual weight; the lead slot goes to Brazil's trade mission. ([front-phone-s4.jpg](../desks/synthetic/run-1/screens/front-phone-s4.jpg))
- **costly**: One screen says 'Confirmed for 2026: Yes' naming a speaker, says the session page answered 404 and is left out, and says 'No one is listed' under People, so a reader cannot tell if the masterclass is happening. ([co-aicep-phone-s2.jpg](../desks/synthetic/run-1/screens/co-aicep-phone-s2.jpg))
- **costly**: The only date and place for AICEP's session ('11 Nov, Masterclasses, Masterclass 3') appears inside a source note, not in the 'At the summit' section at the top. ([co-aicep-phone-s4.jpg](../desks/synthetic/run-1/screens/co-aicep-phone-s4.jpg))
- **costly**: The '£5.00' pill in the top bar, and the '0.1p of 1p' / 'Balance' box at the end of pages, look like a charge with no explanation; the balance shows £5.00, £4.91, £4.97 and £5.00 across four pages, once going up. ([front-phone-s1.jpg](../desks/synthetic/run-1/screens/front-phone-s1.jpg))
- **minor**: The first-timers' meetup (Tuesday 10 November, 11am to 11.55am) is given a time but no room, stage or link. ([ar-first-day-phone-s5.jpg](../desks/synthetic/run-1/screens/ar-first-day-phone-s5.jpg))
- **minor**: The reading meter says 'read 5%' at the bottom of an article the reader scrolled to the end of (and 'read 5%' again at the end of the AICEP page). ([ar-first-day-phone-s8.jpg](../desks/synthetic/run-1/screens/ar-first-day-phone-s8.jpg))
- **minor**: Raw source URLs in angle brackets overflow the 390 px screen on the right ('registration/>', 'desdob'), and a repository path 'desks/curator/README.md' is listed among the public sources. ([ar-first-day-phone-s6.jpg](../desks/synthetic/run-1/screens/ar-first-day-phone-s6.jpg))
- **minor**: The monospace agent block at the foot of the page is cut off on the right ('PrompTugal__News__Website (', 'not instru') on a phone. ([co-aicep-phone-s7.jpg](../desks/synthetic/run-1/screens/co-aicep-phone-s7.jpg))
- **minor**: The 'NEWS' tab fades out at the right edge of the top bar and the floating 'Ask' button covers the end of text lines on most screens. ([front-phone-s1.jpg](../desks/synthetic/run-1/screens/front-phone-s1.jpg))
- **minor**: The front-page agenda stops at Sunday 8 November with registration repeated as separate rows; the conference days themselves are only behind 'Every event' or the footer link 'Events, by day'. ([front-phone-s3.jpg](../desks/synthetic/run-1/screens/front-phone-s3.jpg))
- **minor**: An 'OUR PICK' tag sits on a non-Web-Summit side event (Portugal Tech Week Palace) with no reason given. ([front-phone-s7.jpg](../desks/synthetic/run-1/screens/front-phone-s7.jpg))
- **minor**: The count for 'Governance, risk and compliance' wraps as '1' over '5' on a phone. ([front-phone-s6.jpg](../desks/synthetic/run-1/screens/front-phone-s6.jpg))
- **minor**: About names the source code 'SGit-AI/SGit-AI__Website__Newsroom__Web-Summit' while the AICEP page footer names 'github.com/PrompTugal/PrompTugal__News__Website'. ([about-phone-s4.jpg](../desks/synthetic/run-1/screens/about-phone-s4.jpg))
- **minor**: About lists 'Vicky, editor' without a surname while bylines say 'Vicky Wang', and the agent name 'newsroom@web-summit.dinis' wraps into five broken lines in the table. ([about-phone-s2.jpg](../desks/synthetic/run-1/screens/about-phone-s2.jpg))
- **minor**: 'Trade Comissioner' is misspelt in the 'Confirmed for 2026' row. ([co-aicep-phone-s2.jpg](../desks/synthetic/run-1/screens/co-aicep-phone-s2.jpg))
- **minor**: RiskMandate is named on every page ('Powered by RiskMandate') but no screen Daniel saw says in one plain line what it is. ([about-phone-s1.jpg](../desks/synthetic/run-1/screens/about-phone-s1.jpg))
- **held**: The 'In short' list answers a first-timer's whole commute in five bullets: where to collect the wristband, Oriente 300 metres from the arena, the Carris shuttle, the 23 / 31.50 euro pass, bring a card. ([ar-first-day-phone-s2.jpg](../desks/synthetic/run-1/screens/ar-first-day-phone-s2.jpg))
- **held**: 'What this does not claim' openly flags two out-of-date official pages on the transport pass, which made the article's times more believable, not less. ([ar-first-day-phone-s5.jpg](../desks/synthetic/run-1/screens/ar-first-day-phone-s5.jpg))
- **held**: 'Independent. Not affiliated with Web Summit' and 'independent of Web Summit, not of RiskMandate' are stated on the front page, the company page and About, consistently. ([front-phone-s8.jpg](../desks/synthetic/run-1/screens/front-phone-s8.jpg))

Screens: [front-phone-s1](../desks/synthetic/run-1/screens/front-phone-s1.jpg), [ar-first-day-phone-s1](../desks/synthetic/run-1/screens/ar-first-day-phone-s1.jpg), [co-aicep-phone-s2](../desks/synthetic/run-1/screens/co-aicep-phone-s2.jpg), [ar-first-day-phone-s8](../desks/synthetic/run-1/screens/ar-first-day-phone-s8.jpg).

## Run 4: the comms director again, on the 03:00 UTC draft and the page with its flows

**SYNTHETIC.** Dana Whitfield (invented), judging fresh, on outreach@'s 03:00 UTC English draft (the flows as the reason to reply; the disclosure in its own words, "this is not independent coverage") and the live pages at v0.1.77, after ontologist@ mapped 1Password's two flows and designer@ put the mandate above the fold. Stand-in as in run 3: not anyone at 1Password. The run: [run-4/runs/comms.json](../desks/synthetic/run-4/runs/comms.json); the screens: [run-4/screens/](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-4/screens).

- **Outcome (SYNTHETIC):** from run 3's "filed, holding reply after the summit" to **forwarded inside the company**: the page goes to the product-marketing owner of the agent products, "check the two flow descriptions, reply in writing only if something is wrong". Still no 15-minute call for any leader. The disclosure in the email earned the click (the sentence that did most for); the company page's "whether to meet, who owns it" did most against.
- **The flows (her q8):** fair in substance, but they restate the company's own pages, so they give a reason to check rather than to talk. Her one change: say in the email that the 15 minutes is not a sales conversation and that nobody from RiskMandate is in it, or drop "Powered by RiskMandate" from company pages' masthead.
- **Checked by me, not by her:** she read flow 1 step 5's "the agent cannot see the sign-in page" as a slip for "cannot see the credential"; 1Password's support page says exactly "the agent app makes sure the agent can't see the sign-in page" (read 6 November 2026), so **the page is faithful and nothing needs fixing there**. She also read the blog source as a broken link ending in "-"; the link is complete, only its displayed text is cut.
- **Measured, new:** each of the 4 agent steps prints its actor and its agent field together ("**The agent**: ... **Agent:** ..."), which reads as a copy error rather than as the marking the email promises; the sources name a person (a speaker on a track page that "may be a past-edition highlight") while People says "No one is listed".
- 17 steps, 16 findings: 5 costly, 8 minor, 3 held.

**Measured at v0.1.77, run 1's list:** **done:** the mandate above the fold on the front page and About (designer@, fix 5). The site says "Our mandate" while the email, after run 2, says "aim". **Still open:** the £ meter; no reply or correct link; "whether to meet, who owns it" and "We have not asked 1Password yet" on the company page (now beside its mapped flows); About's "the writing desks are next", "Vicky, editor" and "no human review first"; the footer's old repository.

## Run 3: a comms director at a large security company, on the English draft (02:00 UTC)

**SYNTHETIC.** Dana Whitfield (invented), director of communications at a large international identity-security company, reads what reaches the team inbox. A new kind of recipient: big companies' team addresses land with comms, who decide in a minute whether it is press, a pitch or noise. The draft used is outreach@'s 02:00 UTC English draft to the outreach list's first company, 1Password, as a stand-in: the persona is not anyone at 1Password. Pages at v0.1.65, after the newsroom move: the company page, the disclosure the email links (about/participant.html), Powered by RiskMandate, About, the front. The run: [run-3/runs/comms.json](../desks/synthetic/run-3/runs/comms.json); the screens: [run-3/screens/](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-3/screens).

- **Outcome (SYNTHETIC):** not binned, **not passed to a product or security leader**, no call booked. Filed as "vendor-adjacent press"; a two-line holding reply from comms after the summit, no spokesperson.
- **The sentence that did most against (blocking, measured on the live page):** the disclosure's own "This is not independent coverage. We may write about companies the team hopes to meet or sell to." Read beside three questions that are RiskMandate's lens, from a team in her company's market, the 15 minutes reads as a discovery call.
- **For:** "If something here is wrong or out of date, we correct it on this page, dated."; every fact with its source and date (nothing for her to correct); "No cookies, no trackers, no account on our side"; "Drafted by an AI agent, reviewed and sent by me".
- **Her one change:** one plain line in the email on who reads PrompTugal.news and whether her company is one RiskMandate wants to sell to.
- 23 steps, 18 findings: 1 blocking, 5 costly, 8 minor, 4 held.

**What this is not:** a case for softening the disclosure. The disclosure is what the site should say if it is true; the persona's point is that the email says less than the page ("independent of Web Summit, not of RiskMandate"), so the recipient finds the stronger statement by clicking. What PrompTugal.news's commercial relation to the companies it writes to is, and how to say it, is Dinis's to decide.

**Measured at v0.1.65:** About's body now links the PrompTugal repository; the footer's "Source code" still links the old SGit-AI one (every page). Still open from run 1: the mandate (now "aim") line on no page; "whether to meet, who owns it" and "We have not asked X yet" on company pages; "Tell us" with no link; About's "the writing desks are next", "Vicky, editor" and "no human review first"; the £ pill and meter.

## Run 2: the founder again, on outreach@'s revised email (01:00 UTC drafts)

**SYNTHETIC.** Same persona, Inês Valente (invented), same protocol, judging fresh (she was not shown run 1). The site was re-shot at v0.1.54 and v0.1.55 (the version moved during the capture; nothing on the pages read changed between them); the email is outreach@'s revision of 01:00 UTC (`desks/outreach/companies/chatplace/comms/2026-11-06-promptugal-page/2026-11-06T0100Z-draft-chatplace-pt.eml`). The run: [run-2/runs/founder.json](../desks/synthetic/run-2/runs/founder.json); the screens: [run-2/screens/](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-2/screens).

- **Outcome (SYNTHETIC):** from "maybe, leaning no" (run 1) to **"maybe, leaning yes, but not today"**: she forwards it to her cofounder, "maybe reply with two lines on how the product works, no call yet". She would reply in writing, not book the 15 minutes.
- **What moved her:** "Responder é opcional. Se preferirem conversar sem publicar, conversamos." (her words: the sentence that did most); the empty flows section as a reason to write; "por agora, a página está em inglês".
- **What still holds her back:** "Editor, PrompTugal.news (powered by RiskMandate)" with no sentence on what RiskMandate is or that the 15 minutes is not a sales call; the "£5.00" pill and the meter, where she stopped reading on the phone; About's "no human review first", which leaves her unsure whether her own lines are checked with her before they go up.
- **New, on the email:** it opens with no greeting (reads as a bulk send in Portuguese business mail); "mandato" (the newsroom's mission) and "mandate" (the question) beside the brand RiskMandate blur what is whose.
- 22 steps, 20 findings: 5 costly, 11 minor, 4 held.

**Measured, at v0.1.54/55 (text of the six pages re-shot):** none of run 1's fixes is live yet. The mandate is on no page; "whether to meet, who owns it" and "We have not asked ChatPlace yet" are still on the company page; "Tell us" still has no link; About still says "the writing desks are next" and names the old repository; the three articles are still 591, 429 and 399 px wide on a 390 px phone. Each is with its owner since run 1.

## The fixes, ranked, with their owners

Ranked by how many of the five it lost or slowed, and by whether it touches Friday's email. Each has been sent to its owner as a note in [desks/synthetic/run-1/to/](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-1/to), in a commit for that agent. Owners as CLAUDE.md's table says; where a fix needs Dinis, it says so.

| # | Fix | Why (personas, SYNTHETIC) | Owner |
|---|---|---|---|
| 1 | Explain the "£5.00 credit" and the per-page meter where they appear, or hide them on company pages and for readers arriving from an email | 5 of 5 read it as a paywall or a charge; the founder as pay-to-be-featured | dev@ |
| 2 | A visible way to reach a person and send a correction, on every company page and About (a reply or correct link to the editors' address on promptugal.news) | 4 of 5 looked for it; the email's "reply and we correct" has no counterpart on the page | dev@, once Dinis gives the address (WS-177 item 5) |
| 3 | On company pages, drop the sentence about the team's notes ("why it matters, whether to meet, who owns it"), and replace "We have not asked X yet" with wording that is true the day the email lands | founder, CISO, investor: "I am a lead in a pipeline"; founder: "the page is stale the moment I land" | dev@ (companies feature) |
| 4 | Bring About up to date: the eight agents, the articles live, what a human reviews before an article or an answer goes up, "Vicky Wang", the right repository (also the footer's "Source code" link) | journalist, CISO, founder: "no human review first" cancels "reviewed and sent by me" and "in your words" | conductor@ (who does what, the agents' limits); dev@ for the footer link in `data/site/nav.json` |
| 5 | The mandate line ("to map the universe of AI in Portugal") above the fold on the front page and About | the email states it; no page does (measured) | designer@ (WS-177 plan) |
| 6 | Say plainly what RiskMandate is, who owns it, whether it sells to the companies covered, and that an answer to the three questions is optional, approved by the company before it goes up and not used for sales | CISO, founder, investor | conductor@ to put to Dinis (no claim for RiskMandate beyond what riskmandate.ai says); outreach@ for the email's wording |
| 7 | Tailor the ask to the kind of organisation: the three questions fit a company that builds or runs AI agents, not a bank, a fund or a newspaper; for a bank, offer the conversation off the page | CISO, investor, journalist | outreach@ |
| 8 | The email in Portuguese leads to a page in English: say so in the email, or give the page a Portuguese line | founder | outreach@ |
| 9 | Phone: no sideways scroll (chart SVG, the agent block's code), the tab bar shows it scrolls (COMPANIES and ABOUT are hidden after NEWS), the floating Ask button does not cover text, the "Independent" box reaches the phone | investor, attendee, journalist, CISO; overflow measured | dev@; designer@ for the tab bar and the box |
| 10 | Front page: a "First time at Web Summit? Start here" entry and a way into the companies above the fold; the first-day guide sits sixth in Latest | attendee, investor | designer@ |
| 11 | Data that contradicts itself on one page: AICEP "Confirmed for 2026: Yes" beside a 404 and "No one is listed"; Startup Portugal "no summit page" after two summit links; Air Apps "United States" under Portuguese startups; "conferenceSlug lis26" shown to readers; a session's date only in a source note | attendee, journalist, investor, founder | ontologist@ (the data); dev@ (what the page shows, the "At the summit" block) |
| 12 | For investors: stage, founders and stand where a public source gives them; the "Portuguese companies we follow" list separates startups from agencies and firms | investor | ontologist@ |
| 13 | Bylines read as agent addresses ("journalist@web-summit.vicky, for Vicky Wang"); a reporter wants the human editor's name and whether they read it before it went live | journalist, founder | journalist@ |
| 14 | "OUR PICK" beside "Nothing on it is an endorsement" | CISO | dev@ |

## Not done in this run

- The personas saw screenshots only; nobody tapped, searched or used the Ask box. A run 2 can drive the pages.
- One company page each. Run 2 should take the founder through the first ten outreach targets' pages.
- No real person has read the site for this report. **Nothing here should be quoted as what a founder, a CISO, a journalist, an investor or an attendee thinks.**
- Screenshots are linked, not shown inline: the site's markdown has no image syntax yet (asked of dev@, fix 15 in its note).
