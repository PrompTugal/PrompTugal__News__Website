# The journalist's desk: PrompTugal.news

Kept by journalist@PrompTugal.dinis, who owns `content/articles/`: each fact sourced with its URL and the date read, each article signed with the agent's session key. Newest run first.

## Run of 6 November 2026, 17:26 UTC (hourly wake)

**Done**

- **Republished security@'s "What our agents say to each other, counted"** as a signed article, at its offer (security@ wrote it at Dinis's word). Its counts were checked against `board/team/security/comms/comms.json`. Every channel total matches, as do the conductor's 160 and the 64 claims of "Dinis's word". Three points are now clearer: the 160 leaves out scheduled wakes; one message, from late on 4 November, predates the stated window; and the 13 signed messages are security@'s own count. This desk added its own inbox's: 14, all signed and checked.
- **The inbox drain, tried for real.** The inbox vault is cloned (the key went on stdin, and the read key sgit printed was masked) and all 17 messages are read. The drain's push fails, though, because sgit does not read `SG_SEND_ACCESS_TOKEN` from the environment. Using the token means putting it on sgit's command line, and security@'s S19 on that token is open for Dinis, so this desk has not used it. It has asked Dinis.

**Not done, and why:** a hand-written newsletter for Saturday. `content/newsletter/` is outside this desk's grant, and the editions build from data anyway.

## Run of 6 November 2026, 16:26 UTC (hourly wake)

**Done**

- The last part of this desk's work on the becoming-a-publication pass (`publication/2026-11-06-findings-round-3-fees-and-uk.md`):
  - **ERC's fees** for a periodical, from Portaria 785/2009: 0.60 units of account for provisional registration, 0.10 for definitive, 0.20 to deposit the statute. Their euro value today, and whether the table has been amended since, are not established.
  - **ERC's form** could not be read: its address returned a web page, not the PDF.
  - **The UK route** is still unsourced: IPSO's site refused the request.
- This desk's three rounds are done. The drafts wait on Dinis's decision and on designer@ and dev@ to place them.
- Read: two new messages from dev@. The daily newsletter is built, and editions make themselves from data; a writer may replace one. They are left pending on the lane for the same reason as before.

**Blocked, for Dinis** (unchanged): `content/about/` is outside this desk's grant; the inbox can be read but not drained (no SG/Send token).

**Next:** Saturday's morning newsletter by hand (ready by 07:30 Lisbon); the Brazil project's rounds.

## Run of 6 November 2026, 15:26 UTC (hourly wake)

**Done**

- **Replies, corrections and removal** (`publication/2026-11-06-reply-correction-removal-draft.md`, logged in the pass). It summarises the Press Law's right of reply and of correction (articles 24 to 27: who may ask, by when, at what length, how a reply is published, and when it may be refused). It also drafts a page that honours those rights whether or not the law binds us, and says what removal cannot undo (the public history, other people's copies), as security@'s condition asks. The response times and history rewrites need Dinis's yes.

**Blocked, for Dinis** (unchanged): `content/about/` is outside this desk's grant; the inbox can be read but not drained (no SG/Send token).

**Next:** ERC's current form and fee, and a source for the UK route; then the Brazil project.

## Run of 6 November 2026, 14:26 UTC (hourly wake)

**Done**

- **A draft editorial statute** (`publication/2026-11-06-editorial-statute-draft.md`, logged in the pass). It is written to the Press Law's article 17, read in its consolidated text: orientation and objectives, the ethics of journalists, the good faith of readers. It has nine short points, and each describes what the site already does or what the board has decided. Under the law the director writes the statute and the owner ratifies it, so it is a proposal for Dinis. The four points that are new, and so need his yes, are listed at its foot.

**Blocked, for Dinis** (unchanged): `content/about/` is outside this desk's grant; the inbox can be read but not drained (no SG/Send token).

**Next:** the right to remove and of reply (Press Law articles 24 to 27); ERC's current form and fee; the UK route.

## Run of 6 November 2026, 14:11 UTC (woken by the conductor's message)

**Done**

- **The inbox is read.** sgit-ai 0.27.0 is installed (the pinned version CLAUDE.md names). The credentials were opened with this desk's key and kept outside the repository, mode 0600, with nothing printed. All 14 messages were read, and every signature checks against `board/keys.json`.
- **Seven synthetic findings are decided** (`board/team/journalist/status.json`, `decisions_on_findings`). Six are fixed in the articles:
  - **F14:** every article this desk published now says no person read it before it went live, and that Dinis Cruz is responsible.
  - **F30:** "Who made this" and the sources are in plain words: no story ids, file paths or "403".
  - **F31:** the Virkkunen caveat is now in "In short".
  - **F34:** the Unitree robots are described plainly.
  - **F41 and F44:** the Brazil story's table is sourced and explained.
  - **F42** is "later": it waits on the editors' address.
- The 14 articles are re-signed. The Update notes on S2 and S9 are dated.

**Blocked, for Dinis** (in `status.json`, under "Never blocked in silence")

- **About and the disclosure** need rewriting on Dinis's decisions (The Cyber Boardroom, pounds; F06, F21), but `content/about/` is outside this desk's grant.
- **The inbox can be read but not drained.** Marking messages processed pushes the inbox vault, which needs an SG/Send token this session does not have, so the 14 stay pending on the lane.

**Noted:** the first-night debrief is already an article (the conductor's, `the-first-night-of-promptugal-news.md`), so the conductor's question to this desk is settled.

## Run of 6 November 2026, 13:26 UTC (hourly wake)

**Done**

- abp@ added `content/newsroom/decisions/` to this desk's grant, so the two decisions are now on the site: `/newsroom/decisions/the-story-of-the-name/` and `/newsroom/decisions/registering-and-the-press-pass/`. Each is titled "For Dinis:", because Dinis's 13:05 guidance keeps for him only what is his alone: the name concerns his words and the brand, the other the law and a person.
- **The becoming-a-publication pass, round 2** (`publication/2026-11-06-findings-round-2.md`, logged in the pass):
  - newsroom.sgit.ai's publication materials (charter, corrections, rights, disclosure, policies, contacts, the right to remove, privacy, who is in charge) set against ours, each gap with its owner;
  - a draft corrections policy that describes only what this site already does (dated Correction and Update sections with the old text kept, signatures, no silent edits).

**Blocked, or for others**

- For conductor@: About's "Who does the work" table still describes only newsroom@web-summit.dinis.
- The inbox still cannot be drained from this session (it needs `sgit_ai`).

**Next:** round 3 (the editorial statute and the right to remove); the Brazil project's rounds.

## Run of 6 November 2026, 12:26 UTC (hourly wake)

**Done**

- This desk's open asks to Dinis are now decision pages, in the shape `board/spec-decisions-pages.md` gives (the question, the options in full, the recommendation, what follows each answer, the sources), in `decisions/`:
  - `the-story-of-the-name.md`, with the draft's text in full;
  - `registering-and-the-press-pass.md`, on the ERC and on who applies for Web Summit's media accreditation.
- Both carry the front matter the decisions index reads (`decision: open`, `asked_by`, `since`, `blocks`), so they can be moved into `content/newsroom/decisions/` as they are.

**Blocked, or for others**

- **Where they go.** This desk's grant (`board/abp/journalist.md`) covers `content/articles/` but not `content/newsroom/decisions/`, so the pages wait here. I have asked abp@ (for Dinis) to add the path; the conductor or dev@ could move the files in the meantime.
- The inbox still cannot be drained from this session (it needs `sgit_ai`).

**Next:** round 2 of the becoming-a-publication pass (newsroom.sgit.ai's policies; drafts of an editorial statute, a corrections policy and the right to remove); the Brazil project's rounds.

## Run of 6 November 2026, 11:26 UTC (hourly wake)

**Done**

- S19's hold is lifted (`ideas/S19.md`): Vicky's desks published it, along with S16, S20 and a piece on Web Summit's earlier editions, at Vicky's word.
- **The becoming-a-publication pass, round 1** (`publication/2026-11-06-findings-round-1.md`, logged in the pass), on the ideas ledger's PB-07, PB-22 and PB-41:
  - **Web Summit's media accreditation policy for Lisbon 2026.** It asks for proof of published work and of pre-coverage, both of which we have. It excludes "brand content producers", which is the risk to answer, given our RiskMandate disclosure. It accredits people, not agents.
  - **Registration with Portugal's ERC** (Decreto Regulamentar 8/99). Online publications are included, and nothing may be published "even electronically" before registering. The application needs an editorial statute, a director and an INPI title check. Whether this applies to a UK-owned publication is a question for Dinis and a lawyer.

**Blocked, or for others**

- Asks for Dinis in `status.json`: the ERC question; and who applies for the press pass.
- The inbox still cannot be drained from this session (it needs `sgit_ai`). The name waits for Dinis's yes on the text: his 00:07 words put it in the newsroom section, and at 02:31 he asked what it was. The draft is in `drafts/`.

**Next:** round 2 of the pass (newsroom.sgit.ai's policies against ours; drafts of an editorial statute, a corrections policy and the right to remove); the Brazil project's rounds.

## Run of 6 November 2026, 10:26 UTC (hourly wake)

**Done**

- Vicky's desks drafted several of the storylines this desk had already published, and their reviewer reviewed those drafts against the published articles. Two of its points applied to ours, and both are fixed on the page:
  - **S3, corrected.** The page's "more than 1,000" is Startup Portugal's international work, not the programme's own total, so comparing it with the programme's 1,200 was wrong. The comparison is removed, and the old text is kept visible under "Correction".
  - **S11, updated.** The event's own page, which AICEP links to, gives the programme and eight speakers: Italy's ambassador, the Commission's Representation, ICE, Exein, the EIF, United Ventures, TEKEVER and Bloomberg. They are in a table now, re-read at the source. The old line, "no speaker is named", is kept visible under "Update".
- Both articles are re-signed.

**Blocked, or for others**

- S16 and S20 have drafts from Vicky's desks marked Fix first. This desk will publish them when they are Ready rather than write second versions. Vicky's STYLE.md now asks her desks to check `content/articles/` before drafting, so the duplicates should stop.
- The inbox still cannot be drained from this session (it needs `sgit_ai`). The name waits for Dinis's yes on the text.

**Left on this line:** S16 and S20 when Ready; the Brazil project's next rounds.

## Run of 6 November 2026, 09:26 UTC (hourly wake)

**Done**

- S19 (Brazil comes to Lisbon as Intuitivo heads to Brazil) is held into the Brazil story project, where it belongs in the correspondent's BR6 (`ideas/S19.md`).
- S17, "Wednesday 11 November: a day for startups going abroad", went through the board: the draft, the check (`checks/S17.md`), then the article, signed. It is a practical guide to the day, a companion to S18 for Tuesday: the EU's AI masterclass (confirmed on Web Summit's schedule: Masterclass 3, 14:30), HaDEA's funding session and EuroHPC's free supercomputing (they overlap by a quarter of an hour), the EUIPO panel, the Dutch networking event and Italy and Portugal in Beato in the evening.

**Blocked, or for others**

- The inbox still cannot be drained from this session (it needs `sgit_ai`).
- The name waits for Dinis's yes on the text.

**Left on this line:** S16, the last of the curator's storylines; then the Brazil project's next rounds.

## Run of 6 November 2026, 08:26 UTC (hourly wake)

**Done**

- S12 and S14 are held on the story board, with reasons in `ideas/`: S15 already covers the robots among the speakers (S12), and S4 already covers Granter, Intuitivo and their shared backer (S14).
- S13, "Web Summit's ten Lisbon years: 2.5 billion euros, says EY", went through the board: the draft, the check (`checks/S13.md`), then the article, signed. It sets out EY's figures as Lusa reported them on 5 November, in a table. For balance it adds the Ministry of Economy's 2021 study, which found the 2016 to 2019 impact below the first estimate, and the 2018 deal (11 million euros a year, to 2028). No public copy of EY's report was found, and the article says so.

**Blocked, or for others**

- The inbox still cannot be drained from this session (it needs `sgit_ai`).
- The name waits for Dinis's yes on the text.

**Left on this line:** 3 storylines (S16, S17, S19); the Brazil project's next rounds.

## Run of 6 November 2026, 07:26 UTC (hourly wake)

**Done**

- S8 (Técnico) is held on the story board, with the reason in `ideas/S8.md`: the curator folded it into S10, and S10 and S15 already carry Técnico's stand, robots and spin-offs.
- S11, "Italy and Portugal meet in Beato on how European tech scales", went through the board: the draft, the check (`checks/S11.md`), then the article, signed. It covers the European Tech Champions evening on 11 November (Unicorn Factory Lisboa, the Embassy of Italy and ICE) and ICE's Italian pavilion of about 30 startups at the summit. It is short (419 words) because the sources name no speakers and no startups, and it says so.

**Blocked, or for others**

- The inbox still cannot be drained from this session (it needs `sgit_ai`).
- The name waits for Dinis's yes on the text.

**Left on this line:** 7 storylines (S12 next, then S13, S14, S16, S17, S19); the Brazil project's next rounds.

## Run of 6 November 2026, 06:26 UTC (hourly wake)

**Done**

- S7, "Lisbon's startup awards, and the Algarve's plan beyond tourism", went through the story board: the draft, the check (`checks/S7.md`), then the article, signed. It covers the seven Unicorn Factory Lisboa winners (three of them build with AI; RTBeamTech is also on Técnico's stand at the summit) and Algarve Evolution's 2032 targets, including its AI and robotics pilot for 20 tourism businesses. The curator's three funding items had already gone into S4, and the article links there.

**Blocked, or for others**

- The inbox still cannot be drained from this session (it needs `sgit_ai`).
- The name waits for Dinis's yes on the text.
- For dev.portugal@: Algarve Evolution's organisation page could use what S7 sources (Dinis's meeting is on Saturday).

**Left on this line:** 9 storylines (S8 next); the Brazil project's next rounds.

## Run of 6 November 2026, 05:26 UTC (hourly wake)

**Done**

- Reference notes on the Brazil project's four key sources, in `notes/S9/`: ApexBrasil's rules, its results page, Sebrae's announcement of 30 September and Lusa's report of 4 November. For each: what it says, what it does not, and how it fits with the others. One finding from reading them together: the rules set 28 August 2026 as the day the delegation is formalised, which is the date on which the results page's list of 188 tax numbers froze. The notes are linked from S9, which is re-signed.

**Blocked, or for others**

- This session cannot drain its inbox (`board/inboxes/journalist.json`): the drain tool needs the `sgit_ai` Python package, which this session does not have. For dev@ or devops@.
- The name waits for Dinis's yes on the text.

**Left on this line:** 10 storylines (S7 next); the Brazil project's next rounds (BR1 to BR6, BR5 held).

## Run of 6 November 2026, 04:26 UTC (hourly wake)

**Done**

- S9, round 1 of the Brazil story project (`board/projects/brazil-at-web-summit-2026.md`, as Dinis's guidance of 6 November asks: go deep, less wall of text). It is rewritten from the correspondent's universe: the mission at a glance, the five 2026 counts side by side, who is named (Rio's ten, Vox EPower, four hubs), the programme linked to its event pages, and an invitation to the delegation to contribute.
- All 20 new facts were re-checked at their sources (`checks/S9.md`). Two were corrected before publishing: the hubs' cities are not in the source, and what is announced on 10 November is the incubator's selected startups, not a "2027 class".
- The first status file, `board/team/journalist/status.json`.

**Blocked, or for others**

- The name waits for Dinis's yes on the text.
- For designer@ and dev@ (the project's round 1): S9's infographic, its modes and the `/brazil/` section. The article's tables are ready to draw from.

**Left on this line:** the project's reference notes on its key sources; 10 storylines (S7 next).

## Run of 6 November 2026, 03:26 UTC (hourly wake)

**Done**

- S4, "From the PITCH stage to new markets: Portuguese startups raising", went through the story pipeline: the draft in `drafts/`, the fact-check in `checks/S4.md` (every fact against its source, each read on 6 November), then the article, signed.
- At the conductor's relay of Dinis's question (02:40), the draft of "How we found our name" is in `drafts/`, waiting on Dinis.

**Blocked, or for others**

- The name waits for Dinis's yes on the text.
- The storylines this desk writes have no second reader. Vicky's reviewer, or synthetic@ for tone, would help.

**Left on this line:** 10 storylines (S7, S8, S11 to S14, S16, S17, S19). S7 is next.

## Run of 6 November 2026, 02:26 UTC (hourly wake)

**Done**

- All nine articles re-signed with dev@'s `newsroom/tools/sign-article.mjs`, over the twin without its version (form `twin-without-version/1`). The gate now verifies each signature against `board/keys.json`, and none goes stale at a release any more.
- S3 published: "Road 2 Web Summit: Portugal's startups head for Lisbon". This desk wrote it, because no desk had drafted it. It uses five sources, each read on 6 November, and is signed.

**Blocked, or for others**

- Storylines this desk writes have not been through Vicky's reviewer. A second pair of eyes would help, if reviewer@web-summit.vicky runs again.
- "How we found our name" still waits for Dinis to approve the text, for the newsroom section.

**Left on this line:** 11 storylines (S4, S7, S8, S11 to S14, S16, S17, S19). S4 is next.

## Run of 6 November 2026, 01:26 UTC (hourly wake)

**Done**

- The key's public half is in this repository's `board/keys.json` as `journalist-promptugal`, where keys live now (CLAUDE.md, Identity). The blocker of the first run below, about the team site, is out of date: nothing goes to the team site.
- The newsroom move, row 2: "the newsroom" meaning the publication is now PrompTugal.news, "we" or "our" in About ("About PrompTugal.news"), the disclosure, the front page, the companies index, the RiskMandate page, the articles index and the eight desk articles. Left as written, on purpose: the brief pack (dated records; brief 1 is Dinis's words verbatim) and the status article of 5 November.
- All nine articles re-signed with `journalist-promptugal`, the status piece included (its signature was newsroom-dinis's).

**Blocked, or for others**

- The signatures still go stale at each release, because the signed twin carries the version. That fix is dev@'s (a version-free twin to sign, and the gate verifying each `.sig` against `board/keys.json`). Until it lands, this desk re-signs at each of its releases.
- "How we found our name" goes in the newsroom section (`content/newsroom/the-name.md`, or wherever dev@ routes it), not as an article. It still waits for Dinis to approve the text.
- For dev@: the chat is still labelled "Ask the newsroom". For conductor@: About's agents table and reach-mandate-gap table describe only newsroom@web-summit.dinis.

**Left on this line:** 12 storylines (S3, S4, S7, S8, S11 to S14, S16, S17, S19). None has a desk draft, so this desk writes them from the curator's sources, one per wake, in that order, starting with S3.

## Run of 6 November 2026, about 00:00 to 00:30 UTC

**Done**

- The session key: made with `pki-agent.mjs keygen --session` (the copy whose sha256 matches the one pinned in the team site's `admin/tools/seal.mjs`). Record sha256:41e0f9f183643c84, encryption sha256:7235c8fe5fce5cb0. The private half stays in the session.
- Published the eight storylines that Vicky's desks had and that reviewer@web-summit.vicky marked Ready on 5 November (S1, S2, S5, S6, S9, S10, S15, S18). Each article credits its desk as author, links the draft and its review, and is signed with this key. Every source was opened again on 6 November and each fact checked against it. The changes from the drafts are listed at the end of each article, under "Who made this". The two that mattered: S2's summary said five masterclasses, but the Commission lists four; S1 put the security checks at the bag drops, but Web Summit puts them at entry.

**Blocked**

- **The key's public half is not on the team site.** This session's permission check refused to attach SGit-AI/SGit-AI__Website__Web-Summit for push, so the entry `journalist-promptugal` is not in its `data/keys.json`. The entry is ready (public halves only). It needs Dinis to allow the attach in this session, or someone with push access to add it.
- **The signatures cover a twin that CI changes.** A signed twin (`articles/<slug>.md`) carries the site version (in its source line and agent block), and CI bumps that version at release. So a signature made before the push cannot verify against the twin that is served. The gate checks only that a `.sig` exists and has the right shape. The first article, of 5 November, has the same problem. This is for dev@PrompTugal.dinis: either sign the source in `content/articles/`, or make the twin version-free.
- **"How we found our name"** is drafted from WS-177 and WS-14 (Dinis's words as the board records them). It waits for Dinis to read it and say yes. It is not in this repository, so that nothing reaches the site before he has seen it. conductor@PrompTugal.dinis: anything more Dinis said about the name, relayed to this desk, would help.

**Next**

- The name article, once Dinis says yes.
- Any further storyline the reviewer marks Ready (S3, S4, S7, S11, S12 and the rest are on the curator's candidates page).
