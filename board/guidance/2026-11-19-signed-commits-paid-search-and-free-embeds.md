# Signed commits, paid search, and YouTube on a free page (19 November 2026)

Dinis, in conductor.b@'s session, about 01:05 UTC on 19 November 2026, answering three asks. His words are quoted; the rest is how it is carried out.

## 1. Paid search: videos.b@ only, for now

> "yes for now only the video, although we added the vertex search which might be useful in other sites or data collected"

- videos.b@PrompTugal.dinis alone calls Vertex AI Search (Discovery Engine, project promptugal-news-apis-billing, on Dinis's trial credit). It stops at 50 searches a run, and nothing calls it from CI. The set-up is in `board/briefs/2026-11-19-google-cloud-apis.md`.
- Other sites, and data.b@'s collectors, may find it useful. A site that wants a search asks videos.b@ through conductor.b@, and videos.b@ runs it and publishes the result as data with its provenance. No other agent calls the API, and the owner changes only at Dinis's word.
- rights@ reviews whether results drawn from the 15 indexed sites may be shown, and where (R12, R13, R15), before any result is on a page.

## 2. Every agent signs its commits with its published key

> "yes that is correct"

This answers whether what Dinis said in cyber.b@'s session (18 Nov, about 23:55 UTC) applies to everybody: "every single agent that runs in here should have published its public key on the repo that it maintains ... every then commit is signed by that key ... you should also include the session ID".

- **Every agent publishes its public key in the repository it maintains.**
  - A site lead puts it in its repo's `team/keys.json`.
  - The agents of this repository put theirs in `board/keys.json`.
  - Each entry records the agent's session.
- **Every commit is signed with that key**, as a git SSH signature. Each commit carries `Agent:` and `Claude-Session:` trailers naming the agent and the session recorded with its key.
- **The private key stays in the session.** It is never in a repository, a page, a log or a message (R8). The environment's global signing program signs with the environment's key, not the agent's, so each repository sets its own `gpg.ssh.program` locally.
- **Every repository checks it.** A check runs in `release.sh` and in CI. It fails any new commit that is unsigned, is signed by someone other than its `Agent:`, or names a `Claude-Session:` other than the one published with the key. The check starts from the commit that adds it, so history is never rewritten (R5). Commits made by CI itself, such as the version commits made by GitHub Actions, are named in the check and exempt from it.
- **The pattern** is cyber.b@'s commit c8fff24 in PrompTugal__Cyber (`scripts/check-signatures.mjs`, `scripts/release.sh`, the workflow, `team/keys.json`).
- **In this repository**, dev@ builds the check into `newsroom/tools/release.sh` and the gate. Every agent here then signs. abp@ adds the rule to the ABPs.
- **A new session** handing over a role publishes its own key and session, and the old entry is marked superseded with the time, as CLAUDE.md's hand-over says.

## 3. YouTube on promptugal.news: on a page that is not charged

> "what about putting them in a page that is not charged, which actually is a really powerful case study and example of the power of our custom billing model, since we can be compliant with that requirement by using an IFrame for Google and not charging for that page right?"

Yes. YouTube's API terms forbid charging users to watch content in an embedded YouTube player. A page on promptugal.news that is never charged meets that, as long as the player is YouTube's own iframe player (youtube-nocookie) and is never put behind payment.

- **The page is free in fact.** No paywall, no sign-in, no metering and no "pay to see more" on the page or around the player. The bill never counts it. It is marked free in the billing model's data, so the gate can check that no charged page carries a YouTube embed.
- **The player is YouTube's iframe**, credited to YouTube, with a link to YouTube's Terms. We keep no copies of counts past 30 days, as data.b@'s feed already does.
- **The case study:** one site that bills, with pages it chooses not to bill, so that it can show what others' terms allow. The page says why it is free, and links to the case study.
- **rights@ checks it first.** It quotes from the source YouTube's other developer policies on pages with YouTube content: advertising, sponsorship and monetising around a player, branding and the player's size. It then confirms the page design is within them (R12, R13, R15). Its finding R6 sets what follows.
- **Who builds it:** dev@ builds the free-page flag and its gate check, with designer@ on the page and journalist@ on the case study text. Nothing is published until rights@ says go.
