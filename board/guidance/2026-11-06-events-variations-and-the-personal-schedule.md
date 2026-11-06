---
title: "Dinis, 6 November 2026, about 05:00 UTC: the events and the agenda as experiments, a prompt on every page, vaults that consume the data, and a personal schedule"
source: Dinis in conductor@web-summit.dinis's session (spoken, transcribed; his words below, lightly cut for length, nothing added), with a screenshot of /events/; relayed here unchanged by conductor@web-summit.dinis
kept_by: conductor@PrompTugal.dinis
---
# The events and the agenda: variations, prompts, vaults, a personal schedule

## 1. Experiment on the page itself: variations

- "Within agenda, this is another good example of we need to now do a lot of experimentations ... some of these pages we can even do the experimentation on the page, where we can even say variations. Imagine I go to a page and say, hey, you can see this in multiple variations of it, right? Which changed the design."
- "That's why I think that it's important that there's a chunk of the page, maybe the top page, that never changes, right? And then we allow the rest of the pages to change and to be massively innovative. And even do some crazy stuff here."
- "The events, but also the agenda is a good example of there's probably a lot of great creativity ways that we can do this. And this is where you then involve the synthetic users, who involve the Sherpa, involve the designer, and then the developer can figure out the best way to implement it ... reinvent and to learn, even do a research, right? Go out there, figure out what are good event pages ... This is a perfect example of a massive pile of information."

## 2. A prompt on every page: the page's own llms.txt

- "We probably already have the JSON file that will make other agents a lot more productive ... We should have lots of places on the website where we put the prompt in there for them to give that prompt to their Claude or ChatGPT, for them to consume the data on this page. So for example, this page is almost like a LLMs.txt for the page, but we need to find a good way to show that here. Maybe one of those side panes or something that appears."
- "I should be able to take a prompt, go to Claude, paste it in there, and then, for example, create my own event thing, create my own event app."

## 3. Vaults that consume the data, and personalisation

- "This is where actually we should have vaults here ... we can actually put this data and then consumed by a bunch of vaults, and then we can do a bunch of experiments, because the vaults actually allow us to go crazy on design ... if they have a vault key, they can actually write to the vault ... save their own data in a vault."
- "How do you create a personalized experience? Guess what? We can create a vault that consumes the data from here ... or maybe we can put the data, because in principle, the event is not going to change ... multiple versions of the UI that can be displayed in different ways. And then somebody can then choose ... Or maybe you have the append lane ... I can then send stuff to my vault from here, right? Or my graph."
- "Let's start small. Let's start with having different ways to visualize this data that we show here, but also have vaults that then can consume this information."
- "Ask some agents to really go deep on sgit.ai to see a lot of the stuff that we have there ... a briefing for the agents to go, hey, look at that vault, look at that vault, look at what I've done here. Because some of the vaults we have there look really, really good ... a lot of this stuff is also about showing the power of the vaults ... the more vaults we can sprinkle across this website, the better ... we will then add a way to buy credits to use the vaults."

## 4. From events to a personal schedule

- "Focus then now on the summit, focus on the best way to, for example, if I'm a particular company, what are the pages that I should go? If I'm a CISO ... maybe have a mapping of personas where we can show the graph ... can we create UIs that as you create a different graph, the schedule starts to change. So ultimately, the idea here is to create a personalized schedule. So we should go from events to personalized schedule. And that's the power ... of our technology."
- "You can also store a lot of this data initially in local storage. And you tell, hey, this is on a local storage, so it's only on this browser ... and then we could always put it on a vault if they have one, or if they pay for one."

## What it asks of the team (conductor@web-summit.dinis's reading, for conductor@PrompTugal.dinis to plan; not Dinis's words)

A pass, "events to a personal schedule", in the usual order (conductor, security, reviews: sherpa, synthetic, ontologist; two or three rounds of designer and dev; security; a note; conductor), within accountant@'s budget:
1. Research: good event and agenda pages elsewhere (sherpa, designer), and a briefing on sgit.ai's vault apps worth copying (historian or librarian: sgit.ai demos, the vault-app gallery, the vault-html-app pattern).
2. A fixed top band on /events/ and /agenda/, and below it a variation switcher: two or three different views of the same data (by day, by stage, by topic or graph, a timeline), each a variation the reader picks.
3. A "use this data" pane on every data page: the page's JSON (the /api/v1/ files) and a ready prompt to paste into Claude or ChatGPT to build one's own view.
4. A vault with the events data and two or three vault apps that render it differently (the vault-html-app contract); a reader with a key can save their own selections there; the append lane to send picks to one's own vault later.
5. Personas to graph to schedule: pick who you are (a CISO, a founder, an investor, a company), see the part of the graph that matters, and get a personal schedule; kept in the browser's local storage (said plainly on the page), to a vault later.
