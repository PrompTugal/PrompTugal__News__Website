---
title: "Plan: your own agentic cell, end to end (intake by vault and PKI, the factory, the hand-over to your own Claude)"
by: Dinis Cruz (the brief, 17 November 2026, in the conductor@PrompTugal.dinis session), written up by conductor@PrompTugal.dinis
for: Dinis; then cells@AgentiCCells.dinis (the cell factory) and its factory@ and hub@ agents
builds_on: "AgentiCCells/AgentiCCells__Site__Factory (requests/ and its apply workflow, the board, REALITY.md); pki.sgit.ai (keys in the browser, k1 key codes, sealed m1 messages, qr/key/v1); SG/Send vaults and append lanes; the vault app guide (SGraph-AI__App__Send library/guides/vault-html/AUTHORING.md); the outbox app built 16 November (promptugal-outreach vault, the same pattern)"
status: proposal, for Dinis to decide
---
# Your own agentic cell, end to end

## Why now

People who see the sites made for Gabriel, Silvio and Vicky ask for one. Each site is cheap in tokens; what costs is the workflow: collecting the person's details and photos, the first round of designs, and handing it over. After the hand-over, the person does most of the work in their own Claude session. So the product is the **workflow**: a secure, guided intake, Dinis in the loop at two or three points, and a clean hand-over. It also teaches every new person to use PKI and encrypted vaults from their first minute.

## The flow in one picture

```
 Person (browser)                    Factory (agents)                         Dinis
 ───────────────                     ────────────────                         ─────
 1 /start: makes a key pair,
   drafts details locally
 2 sends public key + a short  ──▶  intake lane (append only)  ──▶  notified
   note (no secrets)                                                3 APPROVE the request
                               ◀──  4 sealed to their key: the
                                      template vault, their own
                                      lane, a scoped access key
 5 makes their vault from the
   template, adds photos and
   text, guided by its app
 6 "Send to the factory": seals ──▶ 7 opens the vault, checks it,
   the vault key to the factory       writes requests/<name>.json  ──▶ 8 MERGE the request
                                      (a pull request)
                                    9 apply workflow: repo, URL,
                                      site; 5 designs round
                               ◀── 10 results written back into
                                      their vault (previews, links)
 11 picks a design, comments
    in the vault
                                   12 invite to the GitHub repo  ──▶ 13 APPROVE the invite
 14 accepts; continues in their
    own Claude with the repo's
    CLAUDE.md
```

Three human gates, all Dinis's: **approve the request** (3), **merge the factory request** (8), **approve the GitHub invite** (13). Everything between them is automated, signed and encrypted.

## The steps

### 1. The start page (agenticcells.site/start/)

- "Create your own agentic cell": what it is, three live examples, what you will be asked for, what happens to your data.
- **A key pair in the browser**, made on arrival with pki.sgit.ai's own module (RSA-OAEP 4096 to receive, ECDSA P-256 to sign; private halves non-extractable in IndexedDB). Shown as its k1 code and a QR code, with "this is you".
- **A local draft:** name, what they do, links, what they want the site to say, style likes and dislikes. Kept in localStorage only; editable throughout.

### 2. The request (no secrets)

- One button: **"Ask for a cell"**. It writes to the factory's **intake append lane**: their public bundle (k1), a signed one-paragraph note, the draft's headline fields, and how to reach them (an email address they choose to give). An append lane accepts writes with a token and returns nothing, so the page can carry that token in the open: the worst anyone can do is send a request.
- The intake agent drains the lane on its wake, checks each signature against the key inside, and lists the requests for Dinis (a page in a private vault, the same pattern as the outbox app: Approve, Not now, with a note).

### 3. Dinis approves

- One tap per request. This is the cost control and the abuse control: nothing that costs tokens or storage happens before it.

### 4. The welcome pack, sealed to their key

The intake agent sends one pki.sgit.ai message, **sealed to their public key and signed by the factory's key**, with an expiry, by email as a link (`https://pki.sgit.ai/m/#m1…`) or on a lane their page polls. It holds:

- the **template vault** to start from (its read key: the template holds no secrets);
- **their own append lane** to the factory (token), for "send" and for comments later;
- a **scoped access key** to create one vault (a grant `{service: "sg-send", endpoint, token}`, the shape the email cell's page already accepts). Today a pilot token; later per-person keys from the key pool (PrompTugal.news's `spec-vault-onboarding.md` already designs the pool and the licence format), which is also where payment attaches;
- the factory's public key (also published at a stable URL, so they can check it).

Their page opens it with their private key. No key ever travels in clear.

### 5. Their vault, made from the template

The template vault ships with an **intake app** (index.html, app.json: the vault app guide's contract, like the outbox app):

| Step | What it asks | Stored as |
|---|---|---|
| About you | name as it should appear, one-line role, a short bio | `about.json` |
| Photos | portrait, work, places; the app explains sizes and rights | `photos/` (originals kept, web sizes made in the browser) |
| Your words | "How I work", achievements, quotes | `words/*.md` |
| Links | site, LinkedIn, GitHub, talks, press | `links.json` |
| Style | three sites you like and why, colours, what to avoid | `style.json` |
| Consent | what may be public; that agents will read this vault | `consent.json`, signed with their key |

They can fill it over days; the vault is theirs, encrypted, and they can share it with others who help them.

### 6. Send to the factory

- **"Send to the factory"** seals the vault's read key (not the write key) to the factory's public key, signs it, and writes it to their lane.

### 7. The factory reads and writes the request

- The intake agent opens the vault, checks completeness against the template (photos present, consent signed), and writes **`requests/<name>.json`** in the factory repo as a pull request, the format the apply workflow already reads. What the site needs (copy, photo list, style notes) goes in; the person's private notes stay in the vault.

### 8. Dinis merges the request

- The second gate: the merge runs the factory's apply workflow.

### 9. The site and the five designs

- The apply workflow creates the repo and the URL (`<name>.agenticcells.site`), as for the first sites.
- **One factory session runs the first round of five designs**, from the vault's photos and words, instead of one new Claude session per person. Today each person has a site session waiting for "drop the photos here"; with the vault, the photos are already there, so that per-person session is not needed until the hand-over. (Dinis: "we might need to remove that Claude Code session from the pipeline".)

### 10. Results back into their vault

- `designs/1..5/` with a screenshot, a preview link and a note on each; a short message on their lane. Their intake app shows them side by side.

### 11. They choose

- They pick one and comment in the vault (the app writes `choice.json`); the factory applies it.

### 12–14. The hand-over: their own GitHub access and their own Claude

- The factory proposes inviting their GitHub account to the site's repo; **Dinis approves**; they accept the invitation.
- The repo carries a **CLAUDE.md for the owner**: what the site is, how to change copy and photos, the gate, how to release, what not to touch. With it, they continue in their own Claude Code session.

## Adding a person to a GitHub repo: what is needed (research)

| Way | How | Good | Watch |
|---|---|---|---|
| **Invite as a collaborator (recommended)** | REST: `PUT /repos/{owner}/{repo}/collaborators/{username}` with `{"permission": "push"}` (or `maintain`). GitHub sends an invitation; access starts when they accept. | One call; we keep the repo; revocable (`DELETE` the same path) | Needs a token with admin rights on the repo (a fine-grained token or a GitHub App with the repository "Administration: write" permission). For an organisation repo they become an **outside collaborator**: the org's settings must allow members to invite outside collaborators. |
| Make them a member of the AgentiCCells organisation | `PUT /orgs/{org}/memberships/{username}` | Simple for many repos | Gives org-wide visibility; heavier than needed |
| Transfer the repo to them | `POST /repos/{owner}/{repo}/transfer` | They own it fully | We lose the factory's hold on updates and the hub's link may break |
| They make their own copy | "Use this template" from a template repo | No admin token on our side | The factory cannot update or support it |

**For their Claude session:** Claude Code on the web reaches GitHub through the Claude GitHub App, installed per account or organisation. For a repo owned by AgentiCCells, the App must be installed on that repo (it is, for the factory's own sessions), and the person's own GitHub account must have access to the repo (the collaborator invite). To verify with the first person before promising it: whether their Claude session can push to an AgentiCCells repo with only collaborator access, and whether they need to install the App themselves.

**Who calls the API:** not an agent session holding an admin token. A small GitHub Actions workflow in the factory repo, triggered by a merged `invites/<name>.json` (the third gate is that merge), with the admin token as an Actions secret. Auditable, and the token never enters a conversation.

## Security, in short

- Keys only travel sealed to a public key; templates hold no secrets; every request and send is signed.
- Append lanes accept writes only; the factory reads only what a person seals to it, and only the read key.
- Three human gates: approve, merge, invite.
- The access key is scoped to creating one vault (pilot) and later per person from the pool.
- Consent is a signed file in the person's vault; what is public is their choice.
- security@ (AgentiCCells' specialist.security@) pre-reviews the intake page and the lane protocol before the first outside person.

## Commercial

- **Free:** the first ten cells, to learn the workflow (Dinis's call on the number).
- **Then:** a price per cell that covers the five-design round and the hand-over; the vault and its storage paid like PrompTugal.news's reader vaults (paying for memory). The access key carries the payment (the licence format).
- **Measure first:** accountant-style counting of tokens per cell over the free ten, before any price.

## The order of work

1. The template vault with its intake app (one evening: the outbox app is the pattern).
2. The start page: key, local draft, the request on the intake lane.
3. The intake agent: drain, list for Dinis, send the welcome pack.
4. Vault to `requests/<name>.json` (a pull request) and the five-design round in one factory session.
5. The invite workflow and the owner's CLAUDE.md; try it with one friendly person.
6. Pricing after the free ten.

## Questions for Dinis

1. **The number of free cells,** and whether the first outside people are named by you.
2. **The access key:** a pilot SG/Send token for cell vaults (separate from the agents' token), until the key pool exists?
3. **GitHub:** collaborator invites on AgentiCCells repos (recommended), or transfer to the person?
4. **Who builds it:** cells@ and factory@ in the AgentiCCells project, with this plan as their brief?
