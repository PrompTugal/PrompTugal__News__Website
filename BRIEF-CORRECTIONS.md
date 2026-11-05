# Corrections to the brief, and to the site

Newest first. A correction names the date, what was wrong, what was found, and what was done instead. The mistake stays visible where it was made.

## 2026-11-05: the key exists now, and the patch needed one line more

The correction of 4 November below said no key could be made from that session. On 5 November, at Dinis's word, this session made its key (`pki-agent.mjs keygen --session`, the copy whose sha256 matches the one pinned in the team site's `admin/tools/seal.mjs`) and published its public half as `newsroom-dinis` in the team site's `data/keys.json`. Articles can be signed from now on; that entry of 4 November stands as written.

Indi's patch (WS-141) said the gate prints OK once applied. On v0.1.5 it did not: the new `/summit/` page's markdown twin was not in `.gitignore`, so the gate's first check (the build changes no tracked file) failed. Done: `/summit/*.md` and the company pages' twins were added to `.gitignore` in the same release as the patch (v0.1.6). The patch itself was applied unchanged.

## 2026-11-04: two steps of the first run could not be done from this session

The brief asks the agent to attach the team's site with push access and to make a session key with `pki-agent.mjs keygen --session`, then publish its public half in the team site's `data/keys.json`. On the first run the session's permission checks refused both: attaching SGit-AI/SGit-AI__Website__Web-Summit for push, and running the downloaded `pki-agent.mjs`. Done instead: the team's site was read from a public clone (read only, as the brief asks for everything but the key); no key was made and nothing was written to the team's site. Articles cannot be signed until a key exists, so the gate's signature check stands and no article is published yet. Waiting on Dinis to allow both.

## 2026-11-04: names of two sites

The brief names php.oct.2026.newsroom.ai and pt.newsroom.ai; their repositories' CNAME files serve them at php.oct.2026.newsroom.sgit.ai and pt.newsroom.sgit.ai. The site uses the served names.
