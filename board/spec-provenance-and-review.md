---
title: "Spec: who wrote it, who checked it, who signs it (the provenance and review model, and the newspaper's sections)"
by: Dinis Cruz (the brief, 17 November 2026, about 13:00 UTC, in the conductor's session), written up by conductor@PrompTugal.dinis
owners: "journalist@ (classify every article, the sections, the daily editorial), ontologist@ (the provenance and claims schema), dev@ (the provenance strip, the filters, the radar, the response page), dev.verify@ (the multi-model verification), outreach@ (asking for responses), security@ and abp@ (signatures, keys, what may be published), designer@ (how it looks)"
issue: WS-177
---
# Who wrote it, who checked it, who signs it

## What Dinis asked

- **A standard**, as we adopted Wikipedia's review standard: for every piece, **who wrote it** (provenance), **how much review** it had, and **how much verification** of its facts and their sources. A formula of several elements, shown to readers as a gradient or a radar, and usable as a filter ("only human-written", "human with research", "human with research and peer review").
- **The prompt is provenance.** An LLM can write five different articles from the same facts; the human's judgement picks one. So the prompt, the mandate and who steered it are recorded like any source.
- **Signatures.** The author signs their version with their key ("I'm behind this article"); reviewers sign their reviews; corrections are signed and linked to what they correct.
- **Facts, opinions stated as facts, and opinions stated as opinions** are told apart in every piece, and every fact links to its evidence, and the evidence is followed to where it says it.
- **Voices on the record:** signed responses from those affected (a right of reply), signed reviews from experts and readers, several points of view on one article, civil and on the record; some paid.
- **Organise like a newspaper:** news is not opinion. Dinis is an author here. A daily editorial at the top.

## What others do (research, 17 November 2026)

| Who | What | What we take |
|---|---|---|
| **The Trust Project** (Trust Indicators) | eight indicators, among them **Type of Work**: labels that tell news from opinion, analysis and sponsored content; used by Google and Bing | our type labels, with the same names |
| **Journalism Trust Initiative** (RSF; CEN Workshop Agreement CWA 17493, 2019) | a certifiable standard for how a newsroom works (transparency of ownership, editorial process, corrections); over 2,600 outlets take part | the editorial process published; a later certification |
| **Paris Charter on AI and Journalism** (RSF and partners, 2023) | ten principles: human decision central; **content origin and traceability** (principle 6); a public record of the AI systems used | the prompt and model recorded per piece; our agents' list and policies are already public |
| **C2PA / Content Credentials**, **IPTC Origin** verified publishers list | signed provenance manifests, so far mostly for images and video; a trust list of publishers' certificates; BBC Verify trials | signing is right; we already sign every article's text with an agent key (pki.sgit.ai); add the human's signature and the reviewers' |
| **Reuters Institute, Nieman Lab, academic studies (2025–2026)** | no shared standard for AI labels; a bare "AI-generated" label lowers trust without informing; readers tell "AI-assisted" from "AI-written"; detailed disclosure changes behaviour more than trust | not one label but a **profile**: what the AI did, what the human did, who checked |
| **Wikipedia** | an assessment ladder (Stub to Featured), talk pages, every edit in a public history | a ladder for verification, the diff of every change, the talk page as signed responses |
| **Letters to the editor; the right of reply** | the subject of a story may answer; some answers are printed | the signed response, published on the article itself |

Sources: Trust Project https://thetrustproject.org/ and Google on Type of Work https://blog.google/outreach-initiatives/google-news-initiative/sorting-through-information-help-trust-project/; JTI https://journalismtrustinitiative.org/jti-the-standard/; Paris Charter https://rsf.org/sites/default/files/medias/file/2023/11/Paris%20charter on AI in Journalism.pdf and ICIJ https://www.icij.org/inside-icij/2023/12/news-outlets-join-forces-to-create-ai-charter/; IPTC https://www.iptc.org/origin-trust-list/ and https://iptc.org/news/c2pa-implementation-guide/; Reuters Institute https://reutersinstitute.politics.ox.ac.uk/key-ai-concepts-grasp-new-hybrid-journalism-era-transparency-autonomy-and-authorship; Nieman Lab https://niemanlab.org/2026/06/how-should-news-organizations-label-their-ai-use-for-audiences-new-studies-suggest-some-answers; "Full Disclosure, Less Trust?" https://arxiv.org/html/2601.09620v1. Read 17 November 2026.

## The model: one label, five axes, one ladder

### 1. Type of work (a label)

| Type | What it is | Example |
|---|---|---|
| **News** | something happened: an event, a decision, a number | "I went to an ATM and was offered a 13.6% mark-up" |
| **Local** | news from a place, by the place's agent | the town pages' stories |
| **Data** | made by code from data, no prose judgement | the live data band, the place counts |
| **Explainer** | how something works | how dynamic currency conversion works |
| **Analysis** | evidence put together to reach a view | the ATM piece |
| **Opinion** | a named author's view, labelled as such | the payment desk piece; this conversation |
| **Editorial** | the publication's own view, daily, signed by the editor | a daily editorial at the top |
| **Interview** | someone's words, on the record | |
| **On the record** | a signed response, review or letter attached to a piece | a bank's answer to the ATM piece |
| **Correction** | a signed change, linked to what it corrects | |

### 2. The five axes

| Axis | Values (each recorded with who and when) |
|---|---|
| **O · Origin**: who originated the piece | `written` (a human wrote it) · `dictated` (a human spoke it; an LLM transcribed and shaped it) · `briefed` (a human gave the brief and the material; an LLM drafted) · `agent` (an agent from its mandate, no human brief; the mandate and prompt linked) · `code` (generated from data by code) |
| **R · Research**: where the facts came from | `none` (testimony or argument only) · `author` (the human researched) · `directed` (an LLM researched, steered by the human) · `autonomous` (agents researched on their own) · `pipeline` (data collected by code) |
| **C · Claims**: what the piece asserts | counts of `fact+evidence` (each linked, and the evidence followed: the link resolves and says what we say), `fact-unsourced` (an opinion stated as a fact: flagged), `opinion` (stated as opinion), `testimony` (a named person's first-hand account) |
| **V · Review**: who checked it | `agent` reviewers (which agents, which models), `models` (n independent models re-checked the claims: agree, disagree, open), `editor` (a named human editor; their edits diffed), `author-signed` (the author signed this version with their key) |
| **E · External**: voices on the record | signed `responses` from those affected, signed `expert` reviews, signed `reader` reviews, signed `corrections` |

The prompt, the model and the agent are recorded on O and R; every human action on V and E is a signature, not a claim.

**Inside origin, off the ladder: steering and background** (proposed by newsroom.sgit.ai's writer and endorsed by Dinis, 17 November 2026: "briefed" hides a big difference, and readers can feel it; [who steered this](https://newsroom.sgit.ai/articles/who-steered-this.html)):

| Measure | Values |
|---|---|
| **Steering**: how much the author directed the piece | one line · a brief with material · a brief, material and a conversation · corrections after reading (each a diff, counted) |
| **Background**: how much context the writer carried | a fresh session · a handbook · standing instructions and a corpus · a long-lived writer with months of instructions, corpus and repositories (recorded as the instruction set used) |


### 3. The ladder (like Wikipedia's assessment scale)

| Level | Name | What it takes |
|---|---|---|
| P0 | **Draft** | not published |
| P1 | **Published by an agent** | an agent wrote and signed it; its mandate and prompt are linked |
| P2 | **Sourced** | every fact has evidence; the evidence check passed (links resolve and say it); unsourced claims are flagged as opinion |
| P3 | **Verified** | at least two independent models re-checked every claim; disagreements resolved or shown |
| P4 | **Signed** | a human author or editor signed this exact version with their key; every edit since is a signed diff |
| P5 | **On the record** | the people or organisations it is about were asked for a response, and any response is published signed; corrections are signed and linked |

Origin is not on the ladder: a dictated opinion and a data page can both be P4. **Different, not better.**

### 4. How readers see it

- **A provenance strip** under every headline, in words: *Analysis · From Dinis Cruz's own withdrawal, written up by an AI agent · 18 facts, all with evidence · checked by 1 model · signed by the agent, not yet by the author · no responses yet · P2*.
- **A radar** (O, R, C, V, E) on the page and in the "How this was made" block at the end (the agent block that exists today).
- **Filters** on the articles page: by type; "human-written or dictated"; "with research"; "verified (P3+)"; "signed by a human (P4+)"; "with responses".
- **Claims in the text:** facts underlined to their evidence; opinions in their own style; unsourced claims marked. The list of facts, opinions and evidence is the article's data (`data/stories/<slug>/claims.json`), part of the semantic graph.

### 5. On the record: responses, reviews, corrections

1. **Ask:** outreach@ writes to the organisation's published contact (the outbox, approved by Dinis): "PrompTugal.news wrote this. Would you like to respond? Here is how."
2. **Respond:** a page where they write their response and sign it with a key made in their browser (pki.sgit.ai, as in the cells intake), or an emailed response we publish as received, marked unsigned.
3. **Publish:** below the article, signed, unedited except for the law (no contact details, no harm); civil, on the record, and the reason for any refusal published.
4. **Correct:** a correction is a signed diff linked to the response that prompted it.
5. **Several views:** an article can carry two, three or more signed views, even opposing; an agent can collate them into a summary, itself labelled.
6. **Paid contributions** (experts asked to review) are labelled as paid.

## Rated: three pieces

| | ATM piece (analysis) | Payment desk (opinion) | Town by town (agent article) |
|---|---|---|---|
| Type | Analysis (with the news inside it) | Opinion | News |
| O · Origin | `briefed`: Dinis's withdrawal, photos and argument; drafted by conductor@ (Claude) | `dictated`: Dinis's voice memo; shaped by conductor@ | `agent`: conductor@'s mandate, from the place files |
| R · Research | `directed`: ECB rate, the regulation, studies, Portuguese press, found by conductor@ at Dinis's request | `author` and minimal: two sources on Multibanco | `autonomous`: 19 place agents' files |
| C · Claims | about 18 facts with evidence (amounts, rates, the regulation, studies); 2 stated as not checked (an earlier screen; who runs the conversion); the six levers as analysis | 2 facts with evidence; Dinis's testimony; opinions as opinions; quotes verbatim | counts from the place files with their dates; no opinion |
| V · Review | none beyond the writing agent; Dinis read it in this session | none | none |
| Signed by | conductor@ (agent key); not yet by Dinis | conductor@; not yet by Dinis | conductor@ |
| E · External | none; **the bank has not been asked** | none (no company named) | none |
| Level | **P2** | **P1** (testimony and opinion; the two facts sourced) | **P2** |
| Next step up | multi-model check (P3); Dinis signs (P4); ask the bank and the conversion company for a response (P5) | Dinis signs (P4) | multi-model check (P3) |

## The newspaper's sections

| Section | Types | Who | On the front page |
|---|---|---|---|
| **News** | News, Local, Interview | journalist@ and the place agents | the lead and the town lines |
| **Data** | Data | code; datasci.places@ | the live band |
| **Analysis and explainers** | Analysis, Explainer | journalist@, with named humans | a slot |
| **Opinion** | Opinion | named authors: Dinis first; guests on the record | a slot, labelled |
| **Editorial** | Editorial, daily | journalist@ (editor-in-chief), signed by Dinis when he signs | at the top, short |
| **On the record** | responses, reviews, letters, corrections | signed by their authors | under each article; a page of the latest |

## The order of work

1. **journalist@:** add `type:` (and the five axes as `provenance_*` front-matter keys, flat) to every article, starting with the three above; the ATM piece and the payment desk piece are re-labelled now as `analysis` and `opinion`.
2. **ontologist@:** the schema for `provenance.json` and `claims.json` per story (derived where it can be), and **people as authors**: today `story.schema.json` accepts only an agent as `assignee` and `history[].by`, so Dinis's opinion piece carries `author: conductor@PrompTugal.dinis` with `byline: Dinis Cruz` until a person (with a key in `board/person-keys.json`) can be an author.
3. **dev@:** the provenance strip and the filters from those fields; then the radar.
4. **dev.verify@:** the multi-model check for P3, with its record per piece.
5. **dev@ and security@:** the human signature, **from the website**: Dinis reads a piece on its page and signs that exact version there with his pki.sgit.ai key in the browser (a "sign this version" control on every article page); his signature sits beside the agent's (P4); every change after it is a signed diff. He signs only from the website (Dinis, as relayed by newsroom.sgit.ai's writer, 17 November 2026).
6. **outreach@ and dev@:** the response page and the first request: the ATM piece's bank.
7. **journalist@:** the Opinion and Editorial sections, and the daily editorial.

## Questions for Dinis

1. Is the ladder (P0 to P5) the right shape, or would you rather a score per axis only?
2. May outreach@ ask the bank and its conversion provider for a response to the ATM piece (first P5 test)?
3. The daily editorial: written by journalist@ for you to sign, or only on days you dictate one?
