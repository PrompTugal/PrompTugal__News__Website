---
title: "Main categories for the articles dropdown: consolidated recommendation"
by: conductor.B@PrompTugal.vicky, 10 Nov 2026, about 23:40 UTC, for Vicky
status: APPROVED by Vicky, 10 Nov 2026, about 23:55 UTC; being applied (tracker: acks.json)
---
# Main categories: approved

**Approved by Vicky (10 Nov, about 23:55 UTC):** the 8 main categories below; The newsroom stays separate, for articles about our own team, its work and how PrompTugal.news operates; Teamworks is Corporate and AI. New main categories need Vicky's approval; routine mapping corrections do not. The machine-readable source is `desks/curator/categories.json` (the curator's).

Built on the curator's classification of all 56 articles (`desks/curator/taxonomy-proposal.md`), with the checks below and Vicky's changes of 23:30 UTC (Startups renamed Startups & Scaleups; Corporate defined by established-company news and enterprise adoption; no classification by size, valuation, funding round or headcount; each article by its subject and angle, several categories allowed). Supersedes `proposal.md` in this folder.

## Categories

| Category | Scope | Articles |
|---|---|---|
| Web Summit 2026 | The summit itself this year: programme, speakers, announcements, venue, passes, practical help, the storm and the cancelled Day 2, and the past editions that explain this one. Not every story that merely happens at the summit. | 27 |
| Startups & Scaleups | Young companies and companies growing their business: launches, products, pilots, new markets, raising money to grow, and the programmes, competitions and investors around them. | 20 |
| AI | AI as the subject: agents at work, models, research, robots, and the security of AI systems. | 18 |
| Portugal | Portugal's tech ecosystem: its companies, institutions, regions, universities and programmes, wherever the event. | 14 |
| The newsroom | Articles about our own team, its work and how PrompTugal.news operates: the agents, the tools, the rules, the mistakes, the newsletter. | 13 |
| Brazil | Brazil at Web Summit and its links with Portugal and Europe: delegations, states, startup missions. | 7 |
| Europe | The EU and its programmes and funding, and other European countries and their links with Portugal. | 5 |
| Corporate | Established-company news and enterprise adoption: what established companies do, and how organisations put technology such as AI agents into real work, including when a younger vendor tells the story. | 5 |

Several categories per article are allowed (most carry one or two; none carries more than four).

## Corporate versus Startups & Scaleups

Decided by the story's subject and angle, never by size, valuation, funding round or employee count.

- **Startups & Scaleups** when the story is about a company building, launching or growing its own business (a product, a pilot, a new market, a raise, a programme it is in).
- **Corporate** when the story is about an established company's own news, or about an organisation adopting a technology in its work.
- **Both** when both angles are in the story (IBM running a startup challenge).
- **Neither** for public bodies and programmes (European Commission, Startup Portugal, AICEP): Europe or Portugal.

| Article | Categories | Why |
|---|---|---|
| glovo-restaurant-agents-getvocal | Corporate, AI | Glovo's use of agents with its restaurant partners (enterprise adoption), though GetVocal tells it |
| wpp-call-transcripts-to-jira | Corporate, AI | WPP's internal platform (enterprise adoption) |
| gravitee-agent-security-survey | Corporate, AI | how organisations adopt agents and secure them (survey) |
| ibm-sports-tech-challenge | Corporate, Startups & Scaleups, Web Summit 2026 | IBM's programme and the startups in it |
| teamworks-coaches-agent | Corporate, AI | an agent put into its customers' work (approved) |
| what-lovable-deleted | AI, Startups & Scaleups | a company rebuilding its own product as it grows |
| five-ai-builders-to-know | AI, Startups & Scaleups, Web Summit 2026 | builders growing their companies |
| from-pitch-to-new-markets | Portugal, Startups & Scaleups | raising money to grow abroad |

The other 48 articles keep the curator's assignments (table in `desks/curator/taxonomy-proposal.md`, "Every article"), with "Startups" read as "Startups & Scaleups" and "Newsroom" as "The newsroom".

## QA: checks and corrections

From dev@PrompTugal.vicky's build check (23:03), the curator's review (23:25) and my check of the curator's proposal (23:40):

1. **Counts verified:** all 56 articles classified, none missing or extra; the per-category counts reproduce exactly.
2. **Corrected in this file:**
   - The curator's table shows The newsroom with 0 articles: it has 13.
   - The category is named "The newsroom" in one table and "Newsroom" in the other: one name, "The newsroom".
   - The curator's definitions used "venture-backed", "founded in the last ten years" and "large, listed": removed, as Vicky asked.
   - "road closures" is practical, not weather; "Web Summit 2026" applies only when the story is about the summit, not merely at it. Both are already reflected.
3. **Signatures safe:** an article's signature covers its title, summary, byline, date, licence and body, not its tags (dev@ checked the signing code; I tested a tag change locally: gate OK). No article text, URL or signature changes.
4. **Bracket bug confirmed:** one article's tags written as `[Portugal, ..., practical]` show as "[Portugal" and "practical]" in today's dropdown; fixed by the change below.
5. **Front-page labels:** the front pages print an article's raw tags above its headline. Rewriting tags in articles would change those labels (S41's included). The recommended way below leaves them unchanged.

## How it would be applied (after approval)

- **One file:** `desks/curator/categories.json`, owned by the curator: the 8 categories with their scopes, each article's categories, and the old-tag map for secondary tags.
- **The build reads it** for the articles dropdown and the lists page (dev@PrompTugal.vicky, about 30 lines, committed For: dev@PrompTugal.dinis, who owns the build). If the file is missing, the site behaves as today. A gate warning (not a failure) for an article with no category, so a new article is never left out.
- **No article file is touched**: front matter, text, URLs, signatures and front-page labels stay exactly as they are. Old tags remain as secondary tags (case-normalised in the display), out of the dropdown.
- **From then on:** the curator assigns each new article its categories when commissioning it; the reviewer checks them before publication; a new category only through the curator, with Vicky's yes.
- **Verified live** by me: the dropdown shows the 8 categories with the counts above, and every article still opens at its URL with a valid signature.
