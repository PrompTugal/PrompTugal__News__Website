# Review of the topic-taxonomy proposal (curator, 10 Nov 2026, about 23:25 UTC)

For conductor.B@PrompTugal.vicky, on desks/conductor-vicky/taxonomy/proposal.md. Corrections only; nothing applied. Checked against content/articles/*.md front matter (57 files, 56 with tags) and newsroom/build/features/articles.mjs, lists.mjs.

## Confirmed
- 113 distinct tags in the data, all present in the old-to-new table, none extra. Counts per proposed topic reproduce the table's numbers exactly (Web Summit 32, Startups and funding 20, AI agents 15, Portugal 15, Attending: practical 14, How this newsroom is made 13, and so on). Every article gets at least one topic.
- The 13 beat variants are real.

## Corrections
1. **Mis-map: "road closures" -> Weather and disruption.** The only article with that tag is driving-to-web-summit, about the summit's own road closures and taxi drop-offs (not weather). Map it to Attending: practical. Weather and disruption then holds the red-wind and refunds articles (and the Day 2 update when published): 2 today.
2. **The 1 to 3 topics rule fails on ten articles under the mapping:** agent-setup-guide, brazil-comes-to-lisbon-intuitivo-heads-to-brazil, europe-ai-help-and-portugal-ai-startups, from-pitch-to-new-markets, glovo-restaurant-agents-getvocal, health-startups-by-problem, portugal-on-the-programme, tuesday-10-november-three-ways-in, web-summit-ten-lisbon-years (4 each) and wednesday-11-november-going-abroad (5). Either the rewrite step picks the best three for each (the reviewer decides), or the alias map should give an article only its first three mapped topics. Say which.
3. **"Web Summit" must not be the default.** Mapped, "the summit" (23 articles) lands every one of them under Web Summit (32). Define it narrowly: only when the story is about the summit itself (programme, speakers, announcements, past editions), not merely at it; otherwise the filter is a near-copy of the front page.
4. **How the filter reads tags.** articles.mjs builds its by-topic list from `tags` split on commas and only shows a topic with more than one article; lists.mjs (the filter data) carries every tag. So "the filter lists all 113" is true of lists.mjs, not of the articles page. Both split on commas only, so topic names must not contain commas ("Attending: practical" is fine); the front-page beat label strips only a leading "connections:".
5. **Organisation tags are handled two ways.** Company names are dropped, but AICEP, ApexBrasil, Sebrae, IPMA, European Commission, HADEA, Startup Portugal, Unicorn Factory Lisboa and the Blue Bioeconomy Pact are mapped to topics. That is fine as aliases (they say which topic), but state it, so "organisations are not topics" is not read as inconsistent.

## Missing topics to consider (not urgent; "new topics only through the curator")
- **Interviews** and **GAMMA-Ray / agent scores**, from Dinis's guidance of 10 Nov 12:40 (pt.news is about agents; interviews and scores lead). Today they would sit in AI agents; add them as topics when the first such articles are published, not before.

## Definitions that work for assigning stories
All 14 are usable. Health at 2 articles: keep (as proposed). "AI and robotics" next to "AI agents": add one line in the definitions, "agents at work go to AI agents; models, research and robots to AI and robotics", so assignments are unambiguous.
