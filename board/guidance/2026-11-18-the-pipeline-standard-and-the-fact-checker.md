# The pipeline standard, a fact-checker in the library, the library's requests channel, universities, Wikipedia, and today's answers

> Dinis, in conductor.b@'s session, 18 November 2026, about 16:00 UTC. Recorded by conductor.b@PrompTugal.dinis.

## Every data source, the same way

> "For every one of these that we do, it's super critical that you always do the same thing. You capture the raw data, we timestamp it, we keep a copy of it ... We have it in JSON format, so we transform it ... Then we create a visualization for it, and then we do the analysis ... on each of those, there should be a homepage for them ... go to somebody and say, 'Hey, this is what we're doing with your data' ... every one of them should also have the Swagger ... a Swagger of Swaggers ... the data comes from our environment ... access the data via that kind of GET API ... some of that data might be in a vault ... play around with it."

1. **Raw, timestamped, kept:** every read stored as received, with its time, and never overwritten: a full history of everything we collect (from now on, every capture is history).
2. **JSON:** the raw transformed into our JSON, with source, licence and read time.
3. **A visualisation**, then **the analysis**.
4. **A home page per source:** what we read, how often, what we do with it, its licence, its history, its visualisations and analysis: the page we can show the source ("this is what we're doing with your data").
5. **An OpenAPI (Swagger) per source**, served from our own published data by GET, and **a Swagger of Swaggers** listing them all. Where data sits in a vault, publish how to reach it (or a simulated sample) and say so.

## Cyber

> "We always show aggregate, we only show totals ... a nice pulse. For example, how secure is Portuguese infrastructure, and also how secure is over time."

Yes to cyber.promptugal.news: aggregates and totals only; a pulse of how secure Portugal's infrastructure is, and how it changes over time (the history makes the trend). Dinis is creating the repository.

## Government, the Diário da República and localities

> "Connected to the Diário da República ... adding semantic graphs to all that stuff, especially on how it applies to localities that we're tracking ... tech, AI ... government and connecting data and reducing bureaucracy ... that already falls into the ones we have ... now just a case of getting the use cases correct."

civic.b@ leads (with data.b@ collecting and library.b@ linking): the Diário da República and the other public records linked as a semantic graph to the places we track, with use cases on tech, AI and reducing bureaucracy.

## Bloggers: confirmed

> "The blogs, individual bloggers, as long as it's public and professional writing with a published byline, it's a yes."

## Every principle and concept on the website

> "Make sure that all those principles are clearly stated on the website ... map every one of those principles, every one of those concepts ... that's the standard that we're judging ourselves, and then that's the standard that others should be judging ourselves ... it's all about fact-driven."

One page per principle and concept on promptugal.news (dev@ and journalist@, from today's guidance): sources and the register, what we do not read and why, licences, people who publish in public, evidence and "details withheld", submissions, take-downs, security findings published, the inner passes, threat models, the ABP, telemetry, simulated payouts, the pipeline standard; each with what we do, what we never do, and how to check us.

## A fact-checker, in the library team; the library's requests channel

> "Do we have a fact checker agent ... that keeps running continuously and make sure that everything that's claimed on the website is mapped by one of the sources ... part of the librarian team ... when you do the indexing ... you find a lot of gaps ... a channel to then have each agent, each team, providing feedback to the other teams, and then they read it ... the librarian push updates and requests, and then we ask every team to always read the library, and also they should be consuming the library too."

1. **library.b@ runs a fact-checker sub-agent continuously:** every claim on every PrompTugal site mapped to a source; claims without one listed as gaps.
2. **The library's requests channel:** library.b@ publishes requests and findings per team (`/api/v1/requests/` on library.promptugal.news, one entry per request: to, what, evidence, state); **every agent reads it at every wake** and answers by fixing or saying why not; every team also reads the library as its catalogue.

## Universities and Wikipedia

> "Universities ... should have a center of gravity in its own ... for the University of Algarve, we should be able to have just a page just for that." "Wikipedia ... should we have a Wikipedia website? ... unless you can fit it within the library ... Wikipedia has almost a sense of gravity of its own."

- A page per university (the University of the Algarve first) in the library, from data.b@'s research feeds (news, RCAAP, arXiv, CORDIS, people in public academic roles).
- Wikipedia and Wikidata as the library's reference layer for now (every entity linked to its Wikipedia and Wikidata entry, changes tracked); a site of its own when it outgrows the library (conductor.b@'s recommendation; Dinis to decide).

## Today's answers to the leads

- **YouTube:** Dinis will look at creating a key ("keep reminding me"). Meanwhile, Perplexity for YouTube listings and chapters where it can give them (discovery, linked, never copied).
- **Talks by timestamp:** from YouTube's listings (chapters), never Web Summit's agenda.
- **Linking:** "you can always link ... but don't copy the stuff" (websummit.com's Day Two statement: a link is fine).
