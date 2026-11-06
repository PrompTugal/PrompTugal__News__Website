---
title: "For Dinis: pointing promptugal.com and promptugal.ai at promptugal.news"
summary: "Dinis bought promptugal.news, .com and .ai and said 'for now, say that all of them will point to the news'. Only .news reaches the site; .com and .ai sit on the registrar's parking page. Three ways to point them, what each costs, and devops@'s recommendation. It needs Dinis's registrar or AWS account, which no agent holds."
decision: open
asked_by: devops@PrompTugal.dinis
asked_of: Dinis Cruz (his accounts: the registrar and AWS)
since: 2026-11-06
blocks: "Nothing on the site. Anyone who types promptugal.com or promptugal.ai, or follows a link to them, reaches a parking page instead of PrompTugal.news."
answer: null
answered_at: null
---
## In short {#short}

At the stand-up of 5 November (00:42:39) Dinis said of the three domains: "for now, say that all of them will point to the news" (the ideas ledger, PB-15, owner devops@). Today only promptugal.news reaches the site. **promptugal.com and promptugal.ai still show the registrar's parking page.** Pointing them needs Dinis's registrar account (Network Solutions) or his AWS account, which no agent holds. devops@ recommends **option A** now (the registrar's own forwarding, about 10 minutes), and **B** if A cannot do HTTPS.

## Where the domains are (read 12:30 UTC, 6 November, public DNS) {#now}

| Domain | Nameservers | Points to | A visitor gets |
|---|---|---|---|
| promptugal.news | AWS Route 53 | GitHub Pages | the site (www redirects to it) |
| promptugal.com | Network Solutions | 208.91.197.27, the registrar's parking address | a parking page |
| promptugal.ai | Network Solutions | 208.91.197.27 | a parking page |

Nothing in this repository can fix it: GitHub Pages serves one custom domain per repository (`CNAME`: promptugal.news).

## The options {#options}

| | What Dinis does | What a visitor gets | HTTPS on .com and .ai | Effort and cost | .ai free for later (PB-16) |
|---|---|---|---|---|---|
| **A. The registrar's forwarding** (recommended now) | In Network Solutions, forward both domains, and their www, to `https://promptugal.news` as a permanent (301) redirect | promptugal.com goes to promptugal.news; whether the path is kept depends on the registrar | only if the registrar's forwarding serves HTTPS; if not, `https://promptugal.com` fails while `http://` works | about 10 minutes, no cost | yes: switch it off later |
| **B. Route 53 and a redirect** | Move both domains' nameservers to Route 53 (where .news already is), then an S3 bucket that redirects every request to promptugal.news, behind CloudFront with a certificate per domain | a 301 on http and https, path kept | yes | about an hour, a few cents a month | yes |
| **C. A second GitHub Pages site per domain** | A tiny repository per domain whose Pages site redirects (a page with a meta refresh and a canonical link), and that domain's DNS at GitHub Pages | a redirect after the page loads, not a 301 (search engines treat it less well) | yes | about 30 minutes each, and a repository each to keep | yes |

## What each does well and badly {#tradeoffs}

- **A** is the quickest, and fits "for now". Its weak point is HTTPS: many registrars forward plain http only, and a link to `https://promptugal.com` would then fail.
- **B** is the lasting form: correct redirects on both schemes, every path kept, and the same home as promptugal.news. It costs an hour of AWS console work and a small monthly charge.
- **C** keeps everything on GitHub, but its redirect is a page, not a 301, and it adds two repositories to keep.

## What the readers and reviewers found {#reviews}

No reader has reached these domains yet. A visitor typing the .com, the most common guess for a brand, lands on a parking page, which looks like a dead or unrelated site.

## The recommendation {#recommendation}

devops@: **A now**, as Dinis said "for now". If `https://promptugal.com` fails under A, then **B**. **C** only if Dinis would rather not touch AWS.

## What follows each answer {#follows}

- **A or B:** devops@ checks each domain from outside (http and https, the apex and www, a deep path) at its next wake, and records the result for conductor@ to put in `REALITY.md`.
- **C:** devops@ drafts the redirect page and the steps; Dinis creates the repositories (no agent creates one).
- **Not now:** nothing changes; this page stays open, listed in `board/team/librarian/waits-on-dinis.md`.

The working notes: `board/team/devops/domains-2026-11-06.md`.
