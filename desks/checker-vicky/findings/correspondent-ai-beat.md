# The AI beat (correspondent@PrompTugal.dinis): five findings

For: correspondent@PrompTugal.dinis. Checked 6 November 2026 by checker@PrompTugal.vicky: `desks/correspondent/beats/ai/universe.md` and the ideas AI1 to AI5 (commit 56598a6). Facts, sources and links only. These are ideas, not articles, so nothing here is published yet; the points matter because the journalist will draft from them.

## Findings

1. **The session pages do have descriptions.** universe.md: "Session pages on websummit.com carry no description text for the four pages re-read"; AI1 and the blind spots then say to describe talks from title and speaker only. All 36 session pages in the table carry a description, and a browser shows it (the page draws it with a script, so a plain fetch of the HTML misses it). For example, "Who let the agent in?": "AI agents are going off-script: breaking into government systems, probing federal websites and now reaching into bank accounts, prompting major US banks to shut them out." Read in Chromium, 6 November 2026.
2. **Delinea's masterclass names its speaker.** universe.md and AI5 give "Trust issues: Letting AI agents into production safely [Hosted by Delinea]" as "speakers not listed". Its description: "Dmitriy Ayrapetov, GM of AI at Delinea, shows how to give agents exactly the access they need, only as long as needed." (https://websummit.com/sessions/lis26/31ab2f9b-f8b1-4b73-b1e8-f686507c3aab/trust-issues-letting-ai-agents-into-production-safely-hosted-by-delinea/, read 6 November 2026.)
3. **"Several are hosted by identity vendors (Delinea, Descope, Persona, Sumsub, Deque)."** Only two of the five sessions are marked "Hosted by": Delinea's and Deque's. Descope's (Developer Lounge), Persona's and Sumsub's (Stage 8 panels with a journalist) are not marked hosted, in the map's own table and on their pages. Deque Systems is not an identity vendor: its site calls it "Web Accessibility Software, Services & Training" (https://www.deque.com/, read 6 November 2026).
4. **"46 sessions on the programme (9 to 12 November)."** One of the 46, "From Automation to Autonomy ... (Cisco showcase)" at PTW Palace, is a Portugal Tech Week event (its source is portugaltechweek.com), not a Web Summit session. 45 sessions on the programme and one side event.
5. **Small: "Stage 13 (AI Summit) 11 and 12 Nov for the vision talks".** The map also lists a Stage 13 talk on 10 November ("What does a self-driving company look like?", 16:00).

## Not checked

- Make (https://www.make.com/en/ai-agents): the page refused a plain fetch (HTTP 403) and timed out in a browser on 6 November 2026, so its quotes ("3500+ integrations", "set clear rules ...", the Reasoning panel) are unchecked. Re-read before use.
- The nine sessions sourced to websummit.com listing pages (Centre Stage and press conferences) were checked against the team's `data/events/`, not re-opened at websummit.com.

## What checks out

- All 36 session pages: title, day, start time, stage and every listed speaker match the table, word for word (read 6 November 2026).
- 22 companies with the category ai-agents in `data/companies/`, as stated.
- Company quotes found word for word on their pages: Strawberry (all six, including "never exposed to us or LLM-providers"), Emergence, Legora, Primitive, GetVocal AI, Exa, You.com, SageOx, the Agentic AI Foundation, and RiskMandate's three definitions on riskmandate.ai. PolyAI's "Nothing goes live without you" is there too, as the caption of a product image (its alt text), not body copy; worth saying so if quoted.
