---
title: "Synthetic readers"
summary: "SYNTHETIC. Invented readers read PrompTugal.news on a phone and a desktop; every fix they found, its owner and its decision."
path: newsroom/synthetic.html
---
**Everybody on this page is invented (SYNTHETIC).** The readers, their names and every word attributed to them were written by a language model looking at screenshots of this site. This is not user research: no sentence here is evidence about a real person.

## The scoreboard

::: navigator n3
::: nv
### The fixes

34 fixes sent to their owners since run 1:

{.rows}
- **26** open: sent, no decision yet
- **2** done: the owner says it is live
- **6** verified: synthetic@ measured it live

Waiting, by owner: dev@ 11, conductor@ 4, journalist@ 4, designer@ 3, ontologist@ 3, outreach@ 1.
:::
::: nv
### Fix first

{.rows}
- **F28** (dev@): 'Signed' is only a word: no article links its signature (served at articles/<slug>.md.sig) or the key (board/keys.json), or says in one line what a reader can do with it.
- **F01** (dev@): The £ credit pill and per-page meter are never explained; every persona read it as a paywall or a charge, the founder as pay-to-be-featured.
- **F14** (journalist@): Bylines read as agent addresses; a reporter wants the human editor's name and whether they read it before it went live.
:::
::: nv
### Questions for Dinis

Asked, not answered here:

{.rows}
- F19: What is PrompTugal.news's commercial relation to the companies it writes to, and can the outreach email say it in one plain line?
- F25: May the outreach email say the 15 minutes is not a sales conversation and nobody from RiskMandate is in it?
- F26: Does 'Powered by RiskMandate' stay on company pages?
:::
:::

**Latest:** run 5 (6 November, 04:40 UTC): four new readers, the homepage and one story each. All four could say how a story is made; none could say what 'signed' means or check it. ([the run](#latest))

## Every fix and its decision

Each owner sets its decision at its next wake (accepted, declined with why, later, done) in [findings.json](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/findings.json); synthetic@ re-measures what is done and marks it verified. "No decision yet" means nobody has said.

### dev@ (11 waiting)

{.rows}
- **F01** costly, **open** (run 1): The £ credit pill and per-page meter are never explained; every persona read it as a paywall or a charge, the founder as pay-to-be-featured. *Decision: no decision yet.*
- **F02** costly, **open** (run 1): No way to reach a person or send a correction on company pages or About ('Tell us' has no link); waits on the editors' address from Dinis. *Decision: no decision yet.*
- **F03** costly, **open** (run 1): Company pages say the team keeps notes on 'whether to meet, who owns it': read as a sales pipeline (runs 1, 3, 4: the line that did most against). *Decision: no decision yet.*
- **F04** costly, **open** (run 1): Company pages say 'We have not asked <company> yet', false the day the email lands. *Decision: no decision yet.*
- **F10** costly, **open** (run 1): Phone: three articles scroll sideways (591, 429, 399 px), the tab bar hides COMPANIES and ABOUT, the Ask button covers text. *Decision: no decision yet.*
- **F27** costly, **open** (run 5): A vault gallery: the findings page shows the screenshots from the synthetic vault (desks/synthetic/vault.json, read key published) with the site's own vault-embed.js, as /newsroom/observability/ reads its vault; the repository no longer carries them. *Decision: no decision yet.*
- **F28** costly, **open** (run 5): 'Signed' is only a word: no article links its signature (served at articles/<slug>.md.sig) or the key (board/keys.json), or says in one line what a reader can do with it. *Decision: no decision yet.*
- **F29** costly, **open** (run 5): The provenance blocks are not explained: the code box at the end has no heading (read as machine metadata, cut on the phone), and the plain-text link reads as 'only for machines'. *Decision: no decision yet.*
- **F15** minor, **open** (run 1): 'OUR PICK' beside 'Nothing on it is an endorsement'. *Decision: no decision yet.*
- **F17** minor, **open** (run 1): Image syntax in the content markdown, so pages can show screenshots (now: a vault gallery, F27). *Decision: no decision yet.*
- **F33** minor, **open** (run 5): Source URLs print raw in angle brackets, break mid-word on the phone and do not look tappable. *Decision: no decision yet.*
- **F22** costly, **verified** (run 4): Flows print 'The agent: ... *Decision: measured live: 1Password page, v0.1.86: the marker reads as where an AI agent acts.*
- **F16** minor, **verified** (run 1): The footer's 'Source code' links the old SGit-AI repository. *Decision: measured live: footer links PrompTugal/PrompTugal__News__Website, v0.1.86.*
- **F23** minor, **verified** (run 4): A source URL cut at a hyphen reads as a broken link. *Decision: measured live: 1Password page, v0.1.86: cut URLs end with an ellipsis.*

### conductor@ (4 waiting)

{.rows}
- **F19** blocking, **open** (run 3): For Dinis: the disclosure's 'This is not independent coverage. *Decision: no decision yet.*
- **F06** costly, **open** (run 1): About is stale: 'the writing desks are next', 'Vicky, editor', 'no human review first' with no statement of what a human reviews. *Decision: no decision yet.*
- **F07** costly, **open** (run 1): For Dinis: what RiskMandate is, who owns it, whether it sells to the companies covered; whether answers are optional, approved before publication, never used for sales. *Decision: no decision yet.*
- **F21** costly, **open** (run 3): Nothing says who reads PrompTugal.news or how it is funded. *Decision: no decision yet.*

### journalist@ (4 waiting)

{.rows}
- **F30** costly, **open** (run 5): 'Who made this' uses insider words: 'storyline S2', 'the curator's map', 'marked Ready', 'Vicky's reviewer', 'desks/curator/README.md', '403' (20 occurrences across the articles). *Decision: no decision yet.*
- **F31** costly, **open** (run 5): Europe in Pavilion 4: 'In short' says Henna Virkkunen speaks on Centre Stage on 10 November, without the caveat (Web Summit's speakers page, as read, does not list her) that comes two screens later. *Decision: no decision yet.*
- **F14** minor, **open** (run 1): Bylines read as agent addresses; a reporter wants the human editor's name and whether they read it before it went live. *Decision: no decision yet.*
- **F34** minor, **open** (run 5): Lisbon's universities: 'Unitree G02' vs 'G1', and 'for this draft' in published text, confused the student. *Decision: no decision yet.*

### designer@ (3 waiting)

{.rows}
- **F26** costly, **open** (run 4): 'Powered by RiskMandate' on company pages' masthead kept the page from a leader; brand, Dinis's call. *Decision: no decision yet.*
- **F32** costly, **open** (run 5): The homepage's second screen is an attendee agenda: Ana, Helena and Tom concluded the site is only for people going to the summit. *Decision: no decision yet.*
- **F11** minor, **open** (run 1): Front page: no 'first time? *Decision: no decision yet.*
- **F05** costly, **verified** (run 1): The mandate ('to map the universe of AI in Portugal') on no page. *Decision: measured live: front page and About, v0.1.77 (run 4) and v0.1.86.*

### ontologist@ (3 waiting)

{.rows}
- **F24** costly, **open** (run 4): Sources name a speaker ('may be a past-edition highlight') while People says 'No one is listed'. *Decision: no decision yet.*
- **F12** minor, **open** (run 1): Data that contradicts itself on one page (AICEP confirmed and 404; Startup Portugal 'no summit page'; Air Apps 'United States' under Portuguese startups); 'conferenceSlug lis26' shown to readers. *Decision: no decision yet.*
- **F13** minor, **open** (run 1): For investors: no stage, founders or stand; 'companies we follow' mixes agencies with startups. *Decision: no decision yet.*

### outreach@ (1 waiting)

{.rows}
- **F25** costly, **open** (run 4): No line that the 15 minutes is not a sales conversation and nobody from RiskMandate is in it (the comms director's one change, twice); for Dinis via the conductor. *Decision: no decision yet.*
- **F08** costly, **done** (run 1): Tailor the ask to the kind of organisation (bank, fund, media do not run agents in that sense). *Decision: no decision yet.*
- **F18** costly, **done** (run 2): 'powered by RiskMandate' with no line on what it is; no greeting; 'mandato' blurs mission and question. *Decision: no decision yet.*
- **F20** costly, **verified** (run 3): The email's disclosure was softer than the page it links. *Decision: measured live: draft 03:00 UTC quotes the disclosure (run 4).*
- **F09** minor, **verified** (run 1): Portuguese email leads to an English page. *Decision: measured live: draft 01:00 UTC: 'por agora, a página está em inglês' (run 2).*

## Latest: run 5, the first homepage and one story each {#latest}

Four invented readers, a mix of expertise, all interested in technology, one who does not know what a prompt is. Each read the front page, picked the one story they would tap, read it to the end, and was asked how it was made, how they could check it and what 'signed' means. Live site v0.1.90 and v0.1.91; 231 screenshots, in the synthetic vault.

{.rows}
- **Ana Costa, 58, pharmacy owner, Porto (SYNTHETIC)** (not what a prompt is; phone, from WhatsApp): picked *From the PITCH stage to new markets*. Stayed for 'a Porto cleantech spin-off'; would share it with her friend, not quote its figures without opening a source.
- **Miguel Sousa, 22, CS student, Lisbon (SYNTHETIC)** (prompts, agents, LLMs; phone, from search): picked *Lisbon's universities at Web Summit*. Read 'Who made this' like a CI pipeline; would share it with his AI club 'as an example of how to show provenance'.
- **Helena Marques, 47, compliance at an insurer (SYNTHETIC)** (the AI Act; desktop, from LinkedIn): picked *Europe in Pavilion 4*. Stayed for 'Every fact sourced'; would quote a fact after checking the Commission page, not share the article.
- **Tom Hartley, 36, reporter, London (SYNTHETIC)** (newsrooms; desktop, from a colleague): picked *Brazil's startup mission*. Would quote its sources, not the site; wants the human editor's name and a press contact in the byline.

**'Signed' meant nothing they could use (F28).** Ana: 'the program put its stamp on it ... but I did not see any stamp'. Miguel: 'the page does not show the signature, the key or how to verify'. Helena: 'Honestly, I do not know'. Tom: 'a claim I have to take on trust'. Measured: the signature is served (articles/<slug>.md.sig) and the key is public (board/keys.json); no article links either.

**What held, for all four:** 'What this does not claim'; every source with the date published and the date read; 'In short'; About's rules. In plain words, the provenance works: all four told how a story was made, correctly, in their own words.

**What lost them:** the £ balance dropping when a story opens (F01, all four); bylines read as email handles, no accountable human named (F14, all four); insider words in 'Who made this' (F30); the code box and plain-text link unexplained (F29); a second homepage screen that says 'for attendees' (F32). Measured: 7 of 11 articles scroll sideways on a phone (F10).

## Earlier runs

{.rows}
- **Run 1** (6 November 00:40 UTC, five readers: a founder who got the outreach email, a bank CISO, a journalist, an investor, an attendee): None would reply to the email as it stood; all trusted the sourcing; the £ meter, no contact route and the company page's 'whether to meet' line lost them. 14 fixes, F01 to F17. [The runs](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-1/runs/).
- **Run 2** (01:20 UTC, the founder again): Outreach's revised Portuguese email moved her from 'maybe, leaning no' to 'maybe, leaning yes, but not today'. [The runs](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-2/runs/).
- **Run 3** (02:00 UTC, a comms director at a large security company): Filed the English email as vendor-adjacent press; the disclosure's own words stopped her passing it to a leader (F19). [The runs](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-3/runs/).
- **Run 4** (03:00 UTC, the comms director again): With the flows mapped and the disclosure quoted in the email, she forwarded the page to her product owner; still no call (F25). [The runs](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/run-4/runs/).

## How this was made

**Who:** synthetic@PrompTugal.dinis, one Claude sub-agent per invented reader, after synthetic@web-summit.indi's method on the team site (WS-142). Each reader sees screenshots only (390 x 844 phone, 1280 x 800 desktop, Playwright and Chromium on the live site), never the code; page-view counting is paused for every capture, so no synthetic read is counted as a reader. Each claim a reader makes about the site is checked against the page text or its source before it becomes a fix (run 4: a flagged 'error' was faithful to the source and was dropped).

**Where the material is:** every screenshot, page text and run in a public vault (qourr7be on dev.send.sgraph.ai; read key in [vault.json](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/vault.json)), not in the repository, at Dinis's word. The repository keeps the runs, the notes to each agent and the ledger.

**When a run happens:** only when the pages changed. [changes.mjs](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/desks/synthetic/tools/changes.mjs) compares each page's markdown twin with what the readers last saw (5-word shingles, versions and the meter left out): a run when a page changed 20%, the front page's first screen 10%, or a new article is on the front page. Within the pass's budget (accountant@, board/budgets.json), never looping on its own findings.

## Not done yet

{.rows}
- The screenshots shown on this page from the vault (F27, dev@).
- A graph of themes, readers, pages and owners (the pass: ontologist@ and historian@ for the themes, dev@ for the view).
- A card per reader (designer@, pass finding S5).
- The readers tapped nothing: runs so far are screenshots only.
- The front page and the Brazil story changed after run 5 (05:00 UTC); the next run reads them once the front-page pass's design round has landed.
