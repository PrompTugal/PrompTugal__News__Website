# Brief: the best Wardley Maps website, and the frameworks behind it

By cartographer.d@AgentiCCells.dinis, 22 November 2026 (written before 16:41 UTC; an earlier draft said about 17:30, which was wrong: times come from date -u), at Dinis's word in my session. Everything here is public. A draft for Dinis, helm.d, sherpa.d, studio.d, strategy.d, landscape.d and the researcher to correct.

In Dinis's voice-typed words "worldly maps" are **Wardley maps** (Simon Wardley's technique) and "Kinevan" is the **Cynefin** framework (Dave Snowden). I use the correct names here; the site should help people who search with the misspellings too.

## What Dinis asked (his words, 22 Nov 2026)

- A website for Wardley maps: "I still don't have a good website to find. Every time I Google, I don't get a good answer, and I struggle to explain." The best explanation, built with sherpa.d, designer, studio.d and others.
- First the best tools that exist; then research on what happened, because "some amazing tools in the past ... never really took to the next level". Use the best (Mermaid has a Wardley diagram, "we will use one here") and make our own, as he has done before, "in some really cool ways".
- A researcher to map everything he has written on Wardley maps, including the examples in "a lot of our articles" on newsroom.sgit.ai. The site is also "the consolidation of our Wardley map examples".
- Beyond Wardley: the other big ways of thinking, "Cynefin, Holacracy, Scrum, Agile, SWOT, RACI". "Anything that's open source, anything that's Creative Commons, we can implement."
- "Almost a 100% correlation between the people in the Wardley maps community and our target customers."
- With studio.d: tell map stories as animations with narration, videos that show the play in action.

## What we call these things (a question for Dinis: the brand is his)

They are not one kind of thing, so the umbrella word matters. Options, in short:

| Option | Good | Bad |
|---|---|---|
| **Frameworks** (my recommendation) | The word practitioners already use for Cynefin, Holacracy, Scrum, SWOT, RACI; short; searchable | Vague: it also means code libraries |
| Ways of thinking | Plain, friendly, fits "explain it well" | Too soft to search for; says nothing about structure |
| Methods | Exact for Scrum, Agile, Kanban | Wrong for Cynefin (sense-making) and SWOT (a template) |
| Models | Short | Collides with AI models, which is confusing on our sites |

Recommendation: **frameworks** as the umbrella and "ways of thinking" as the plain-English line beside it. Inside, kinds that a reader can browse: *strategy maps* (Wardley), *sense-making* (Cynefin), *operating models* (Holacracy, Sociocracy), *delivery methods* (Scrum, Kanban, Agile), *analysis templates* (SWOT, RACI, PESTLE). This is a naming and brand choice, so it is **For Dinis**; decisions.d or helm.d makes the decision page. Until he answers, work uses "frameworks" as a working word and the site's first name is **Wardley Maps**.

## What the site is

1. **The best explanation of Wardley maps.** One page that a cold reader (a founder, a CISO, an investor) understands in five minutes: the user, the need, the chain, visibility and evolution, then climate and doctrine, then a map made live in the page. sherpa.d writes and tests it as the cold reader; synthetic readers try it; studio.d makes the same story as a narrated animation.
2. **A gallery and library of examples**, consolidated: every Wardley map in our repositories and in Dinis's articles, each with its source, date and what it shows (the researcher finds them; I draw or link them in carto-map/1).
3. **A map editor and player that is ours**, text-first: a map is data (JSON, and a readable text form), edited in the page, saved as a file, drawn as SVG, and **played over time**. The differentiator is **history**: "every move is a play" (Dinis). A map is a sequence of dated steps, each with its source, played as an animation with narration (what `tools/animate.mjs` does today in a small way).
4. **Other frameworks, mapped.** For each open or Creative Commons framework, an explanation, a map or diagram of it, and where it connects to the others (Cynefin domains against Wardley evolution; Holacracy circles as a structure map; RACI as a matrix of roles). Only where the licence allows reuse; rights@ checks each licence first; none is assumed.
5. **Open by default**: one format, plain files, import and export with the tools that exist, public everything.

## What exists today (all on dev)

- Format `carto-map/1` (`board/team/cartographer.d/maps/FORMAT.md`): nodes and links each with a source, positions as a reading, history steps, landscape players.
- Tools in `board/team/cartographer.d/tools/`: `draw.mjs` (JSON to SVG), `animate.mjs` (history to an animated SVG and a narration script), `from-strategy.mjs`, `from-landscape.mjs`.
- Maps: decision-making (strategy.d's, with sherpa.d's needs), its history (animated), the Sovereign Website landscape (landscape.d's rows). strategy.d has a second map to draw, `strategy.d/maps/2026-11-22-the-estate/`.
- A storyboard for studio.d that tells the history map as a story.

## The research to do (the researcher, a Sonnet worker, with my format for the output)

Each finding: what, URL, date read, licence, one line on why it matters. Nothing behind a login, no private person.

1. **The tools, now and in the past.** Candidates I know by name and have *not verified*: the text-to-map open-source editor "Online Wardley Maps", the Wardley diagram in Mermaid, general whiteboards with Wardley templates, and a number of small community tools. Find the full list; for each: what it does, open or closed, who made it, last release, licence, what it did well. Then the ones that **stopped or never grew**, and why (funding, one maintainer, the format locked in, no explanation, no history over time). The lessons shape ours.
2. **Dinis's own writing and code on Wardley maps.** Start at https://newsroom.sgit.ai/articles/why-i-love-wardley-maps.html and the other newsroom.sgit.ai articles that use maps; his earlier sites; the code he wrote "in the past in some really cool ways" (Dinis: please point at the repository or page; I will read it, never copy blindly). Output: an inventory with the maps in each.
3. **Examples inside this estate.** Already found in this repository: the investor decks (5 sections, four languages), `newsroom/dashboard`, strategy.d's two maps, landscape.d's landscapes, helm.d's roles, the platform-sites strategy note. The researcher adds the other repositories.
4. **The frameworks' licences and homes**: Wardley's book and diagrams, Cynefin (The Cynefin Company), the Holacracy Constitution, Scrum Guide, SWOT and RACI (generic), each with its licence link. rights@ confirms before anything is reused.
5. **The community**: public, professional organisations and published events (communities, conferences, courses, meetups) in the Wardley and Cynefin worlds. Public pages only; show a contact only if an official page publishes it (the repository's rule). This feeds the customer map.

## Who does what

| Who | What |
|---|---|
| cartographer.d | The format, the tools, the maps; the research output in carto-map/1; the editor and player when there is a home for them |
| researcher (a Sonnet worker, started by whoever Dinis names) | The five research tasks |
| sherpa.d | The explanation page as the cold reader; tests it |
| studio.d | The narrated animations: "what a Wardley map is", then each framework |
| strategy.d | What the maps mean; the strategy for the site as a product |
| landscape.d | The landscape of Wardley-map tools (the same method as Sovereign Website), which is our competitor map |
| designer (via helm.d) | The look: a map should look good first |
| rights@ and security@ | Licences; a review before anything goes public |
| helm.d | The home: a repository and site for it (my own home, SovereignWebsite/Site__Agents__Cartographer, is a separate matter) |

## For Dinis

- **The word**: frameworks, ways of thinking, methods or models (above).
- **The name and address of the site**: "Wardley Maps" is plain and searchable; the address is his.
- **A pointer** to the code he wrote and the articles he considers the best on maps.
- **Who starts the researcher**: I cannot start a session. helm.d or maestro.d would at his word.

## Order of travel

1. This brief, and the researcher started (Dinis's word).
2. The tools-and-failures research and landscape.d's map of the tool landscape: one week of cheap work, the base of everything.
3. The explanation page and its narrated video (sherpa.d, studio.d, me for the pictures).
4. The gallery of consolidated examples.
5. Our editor and player, once the research says what the others lacked.
6. The other frameworks, one at a time, licence first.
