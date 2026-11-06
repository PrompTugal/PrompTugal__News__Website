---
title: "Images out of git: the designer's vault, a page that maps every vault, an image queue (OpenRouter and ChatGPT), and a before and after article for every design release"
by: designer@PrompTugal.dinis (session 2)
written: 2026-11-06T05:30Z
from: Dinis, in the designer's session, 6 November 2026 about 05:00 to 05:25 UTC (his words, close to verbatim, in section 0)
for: conductor@PrompTugal.dinis (the plan, the vault key), dev@PrompTugal.dinis (the vault map page, the before and after feature), security@PrompTugal.dinis (the vaults are public: watch them), accountant@PrompTugal.dinis (the image budget), librarian@PrompTugal.dinis (the map)
issue: WS-177
---
# Images out of git, the vault map, the image queue, before and after

## 0. Dinis's words (designer's session, about 05:00 to 05:25 UTC)

- OpenRouter: "you have access to the best currently frontier model for image creation ... you should be leveraging it ... have a process to create it ... great prompts ... take a story, create an infographic for it ... some of the Gemini models or the OpenRouter models work really well if you ... give the entire story." "Err on the side of more ... but find a way for it not to be overwhelming: a bunch of little infographics ... on the side ... click to see more ... or at the end of the article." "Work with the accountant to have a budget. I'm happy to spend quite a bit of money on infographics ... capture the stats ... everything you do should end up on the website, unless it's really bad ... even your experiments ... a section at the end: experiments I did here." "From cheaper to more expensive models ... good value for money ... you have an engine that can read and understand the picture: leverage that."
- Vaults: "instead of adding all these images to git ... put it all into a vault ... give the key to the conductor ... your vault is all public, so you can share the public key." "Ask the developer and the conductor, but also the designer, to create a page that maps all our vaults ... in the admin [newsroom] section for now ... see every single vault and what's in there and access them easily ... the security needs to keep an eye on it."
- ChatGPT: "the funny infographics that ChatGPT created ... we could also get ChatGPT to create a bunch of these ... what is the workflow ... a queue for ChatGPT, that ChatGPT picks up and puts on a vault, and then you pick it up, or ChatGPT just sends you an append lane."
- Before and after: "every time you do one of these design changes ... a really clear before and after, and then ... an article with that before and after ... a special type of article ... a slider that I can slide to the left and see before, slide to the right and see after ... buttons below, so I can just click ... or the multiple steps can play out ... every time you do one of these releases, you tag it with whatever version ... an article in our agents' articles ... and this goes into the daily debriefs."

## 1. The designer's vault (done this run)

`bar9wi87` on dev.send.sgraph.ai, listed in `board/team/designer/vaults.json` with its public read key. The vault key is in the designer's session and sealed to the conductor's key: `board/team/designer/sealed/pt-designer-vault-key.for-conductor.enc` (`sgit pki decrypt`). From now on the designer's images (mock-ups, before and after, AI images) go there, not into git; `design/` keeps only the tools that make them.

## 2. A page that maps every vault (ask: dev@ builds, conductor routes, designer designs, security@ reviews)

`/newsroom/vaults/`: one row per vault, read from a `vaults.json` that each owning agent keeps (the designer's is the first: `board/team/<role>/vaults.json`, same shape): name, id, owner, what it holds, made, the public read key, a link that opens it in the browser (the site's own vendored `vault-embed.js`, no new host), and the file tree on click. The design: a card per vault with its latest few images as thumbnails. Security@: no vault key, no write token beyond the public append tokens, ever on the page; a check in the gate that a `vaults.json` holds only `sgit_public_read_` keys.

## 3. The image queue (OpenRouter now; ChatGPT next)

- **OpenRouter (now, in the designer's session):** `design/ai-images/` (the tool and the prompts, in git; the images in the vault). For an article: the whole article goes in the prompt with the brand's colours and the rules (no word the article does not say, no real person's face, marked AI-made). The same prompt runs on models from cheap to expensive; every call is a line in the vault's `ai-images/log.jsonl` (model, prompt hash, cost, seconds, image size) and the designer reads each image back and scores it (facts right, legible, on brand). The best go on the site; the rest go in the article's "experiments" section and a newsroom page with the stats.
- **ChatGPT (proposal, Dinis's account):** a queue file per job in the designer's vault, `queue/<id>.json` (the article's URL and markdown twin, the brief, the size, the append lane to answer on). Dinis, or a ChatGPT agent with the queue's read key, takes a job, makes the images, and sends them to an append lane on the designer's vault (write-only token, public); the designer drains it at each wake, checks each image against the article, and places it. The lane is the only write path into the vault, so ChatGPT never holds the vault key. Needs: an append lane on `bar9wi87` (the conductor's tool already issues lanes), and Dinis's yes on how ChatGPT reads the queue (a pasted prompt per job is the simplest start).

## 4. Before and after, for every design release (the designer, at once; dev@ for a native feature)

- For each design release: screenshots before (the version live before) and after (the new version), phone and desktop, paper and ink, with the same viewport, into the vault under `before-after/<version>/`.
- A slider page per release: drag left for before, right for after; buttons under it for each step (before, after, and each mock-up), and a play button that walks the steps. Until the site's markdown can hold images (dev@'s, in `board/spec-article-images-and-graph.md`), the slider page is a small HTML app inside the vault, and the article on the site links to it.
- An article per release in the newsroom's design section (`/newsroom/design/`), titled with its version, what changed and why, with the link to the slider; and a line in the designer's daily debrief.
- For dev@: a `before-after` block for content (two or more images, a slider and step buttons, no new host or script beyond `assets/`), so the slider lives on the site itself.

## 5. Budget (ask: accountant@)

Dinis: "happy to spend quite a bit of money on infographics". Proposed: an image line for the designer of 40 USD a day on OpenRouter (beyond the session's own tokens), with a stop at 40, read from OpenRouter's own cost per call (the log), reported in each commit. Until accountant@ sets it, this run spends at most 10 USD.
