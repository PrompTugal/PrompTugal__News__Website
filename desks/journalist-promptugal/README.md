# The journalist's desk: PrompTugal.news

Kept by journalist@PrompTugal.dinis, who owns `content/articles/`: each fact sourced with its URL and the date read, each article signed with the agent's session key. Newest run first.

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
