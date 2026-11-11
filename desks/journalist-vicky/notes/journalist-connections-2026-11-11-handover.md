---
title: "journalist-connections@PrompTugal.vicky: hand-over, 11 November 2026"
by: journalist-connections@PrompTugal.vicky
written: 2026-11-11T07:15Z
---
# Hand-over, 11 November 2026

## What this session did (since the 10 November note)
- Two stories commissioned by the curator from this desk's own discovery leads, both published by the reviewer under R-PUB-1:
  - S48, "Manus 2.0 gives each agent its own email, phone and wallet" (published about 03:00 UTC).
  - S54, "Four startups pitch on Thursday's Centre Stage: what each does" (Breakout startups; published about 06:45 UTC).
- Leads logged in `desks/journalist-vicky/leads/2026-11-11-connections.md` (Manus 2.0; Breakout startups and its follow-up), under the temporary discovery workflow.
- Standing rules kept in `desks/journalist-vicky/notes/journalist-connections-rules.md`: the eight article categories, and the TEMPORARY discovery workflow.

## What is open
- Nothing assigned to Connections and no open review findings at 07:15 UTC.
- RWS and Persona company intros stay in `status: fix`, held for Vicky's own company-page batch (standing answer 24: never in a scheduled run).
- S54 depends on Web Summit holding Day 3 on Thursday; if Web Summit cancels it, the article needs an update (the reviewer's call, with Vicky's approval).
- No ABP policy file for this role yet (asked by the conductor).

## What I learnt
- Check a company's identity before quoting its site: Web Summit's "Kamino" is kamino.com.br (Brazil, finance automation), not kamino.com (a Solana DeFi protocol). The speakers' Web Summit profiles (linked from each session page) carry a one-line company description that settles it.
- (Withdrawn 11 November, 14:30 UTC: a note here on reading Web Summit's pages by machine. Its terms forbid automated reading; never do it. See the rules file.)
- `release.sh` can give up after five attempts when many agents push at once; a short retry loop around it works.
- The curator's commission notes (in its map JSON, `story_candidates[].note`) carry conditions the README does not; read them before drafting.

## Where things live
- Drafts: `desks/journalist-vicky/drafts/` (S48, S54 and their images in `img/`).
- Leads: `desks/journalist-vicky/leads/`; the curator's requests: `leads/requests.md`.
- Run reports: `board/runs/journalist-connections.vicky/`.
- The session key's private half stays in this session, outside the repository; its public half is `journalist-connections-vicky-promptugal-b` in `board/keys.json`.

## What the next session does first
1. Pull dev; check both holds, "New from Dinis", Vicky's decisions and prompts file on the team site (read-only), this desk.
2. Fix any of this desk's drafts with open review findings; then write only what the curator assigns to Connections.
3. In spare runs, while the discovery workflow lasts: the curator's requests first, then up to 5 Connections leads, participation confirmed under the rules file's participation rule (never a machine read of websummit.com, its subdomains or the app).

## Update, 19:15 UTC: for the session that takes this role over on the team account
- This session pauses when the team account's journalist-connections session starts (`desks/conductor-vicky/HANDOVER-to-team-conductor-2026-11-11.md`, section 5). Its wake is disabled, never deleted, by the conductor.
- Afternoon rules, all in `journalist-connections-rules.md` and to be read first:
  - **No machine access to Web Summit** (websummit.com, its subdomains, the app): no curl, fetch, script, sub-agent, headless browser or API. This desk read it by machine until 13:16 UTC on 11 November, before the rule reached it; every read is listed in `journalist-connections-2026-11-11-websummit-reads.md`.
  - **No Web Summit-derived data for new work** (the programme agenda, the Web Summit parts of `data/`, the vault capture); nothing deleted or changed until Dinis decides.
  - **Sources for anything about Web Summit:** press reports; the companies', speakers' and organisers' own posts; official public bodies; a person's browser check for single facts. Link to Web Summit's pages, never copy or summarise them.
  - **Connections proof of participation:** the person's or company's own public page or post, a press report, or Vicky's own browser read of their Web Summit page (ask the conductor, with the URL).
  - **No machine reads of Luma, Meetup or Eventbrite.** Lisbon Fringe and the storm site are pointers only, never citations.
- State at 19:15 UTC: nothing assigned to Connections; no open review findings; no Connections lead open. S48 and S54 published and kept as they are (Vicky's word). RWS and Persona held for Vicky's company-page batch.
- Lesson: check a source's terms before any machine read; the participation rule (standing answer 19) and the discovery workflow had both assumed Web Summit's pages could be read by machine.
