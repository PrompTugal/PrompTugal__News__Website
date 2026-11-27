# The video production pipeline (brief, 27 Nov 2026)

From Dinis, in c.maestro's session (~17:55 UTC, 27 Nov 2026). Summary, with his words quoted where it matters.

## Why

"A large chunk of our problem ... it's not that it's not interesting or advanced, is that I don't have a good workflow to tell the story." The stories have many moving parts and need a visual way to be told. The latest Instagram posts and "the workflow with WebGL" show it working: "the first time that I start to see interesting ways to actually tell the story". The sweet spot, for RiskMandate too: how to manage agents, large numbers of them and their workflows, recreating what industry learnt about structuring companies, and showing "the swarms and the agents and everything working together".

## What to build

A **production pipeline and a production timeline**: "I can go to a website, see a bunch of videos being created, and then take it from there."

1. **Browser-rendered videos:** WebGL scenes, audio and timing, rendered on the viewer's GPU ("just render it on the browser"); no render farm. A file is captured from the browser only when a platform needs one.
2. **Review, comments and sign-off on the page:** "you have a web page and then somebody can go, they can sign it ... review it ... add comments, get a new version." This is the approval workflow for social media and for clients: nothing is published without a signed review of that exact version.
3. **Delivery through SG/Send and vaults:** files, versions and signatures move through vaults ("we're using SGSend to then send the emails around, the files around").
4. **Teleprompter mode (experiment):** "the whole video is created and the audio is mapped, but then I just record kind of the voice and the face on top of it. So almost like I'm just reading from a teleprompt." The page plays the scenes with the script scrolling; the browser records camera and microphone; the take is laid over the animation.
5. **Voices:** synthetic voices (the ElevenLabs workflow, labelled "voice made by AI") or the animated presenters, or Dinis as narrator.
6. **A product:** "we can actually create some really powerful videos to explain people's technology and products, which I think is a product in itself to be sold" (part of the website package).

## First productions

1. The history of Agile (c.history's browser story, https://agile.history.sovereignweb.site/story/), redone with the WebGL workflow.
2. The Web Summit galaxy (the summit's galaxy visual), rendered in the browser.
3. The Web Summit explainer animations, "even if they're a little bit crude", e.g. how LLMs work: find them first (SGit-AI/SGit-AI__Website__Web-Summit: board WS-69 visual language, WS-81 meet the team animated, WS-171 infographics, people/* pipelines; and the presenters library in PrompTugal__News__Bulletins).
4. A teleprompter take by Dinis over one of them.

## Rules

b.security's presenter-stills ruling for anything public (label inside every frame, "synthetic presenter" and "voice made by AI", no real person's likeness or voice except Dinis's own takes, metadata stripped); a public source for every factual beat; nothing published without a signed review of that version.
