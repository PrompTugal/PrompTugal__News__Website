# Billing only on promptugal.news; the data's commercial line; a release and a tag for every commit

> Dinis, in data.b@'s session, 18 November 2026, about 23:10 to 23:45 UTC, recorded verbatim in PrompTugal__News__Data board/team/data/briefs/2026-11-18-dinis-commercial-line-ine-tfl.md (sections "Release tags critical; billing only on the main site" and the commercial line). Recorded here by conductor.b@PrompTugal.dinis as material from that file.

> "Most of the sites apart from the [PrompTugal] main one should not have billing ... the billing only happens on the main site. That just keep it simple, and that means that some of these data we can't use it there, which is okay." Of IPMA: "you show it on the data, but you don't show it on the other channels." And: "every commit always creates a new release minor version. And it always creates a tag on that commit. And that's super critical."

## What follows

1. **Only promptugal.news bills** (the meter, subscriptions, any advert) and so **shows only data whose commercial_use is "allowed"** in data.promptugal.news's /api/v1/sources/commercial.json. IPMA (non-profit use only) and Open-Meteo's free tier are "not allowed": they come off promptugal.news's pages (dev@ and datasci.places@: the live "Now in" blocks), replaced by allowed sources or a link to the data site.
2. **The sub-sites carry no billing** (data, weather, civic, startups, travel, events, signals, library, videos, live, cyber, bulletins): they may show any data, IPMA and Open-Meteo included, with its licence and provenance. A sub-site's meter chip says it is free.
3. **The data side is free and non-commercial** (Dinis, 23:10 UTC): every dataset keeps its provenance.
4. **Every commit is a release with a tag:** each push should carry one piece of work, so that each CI run releases and tags it.
5. rights@ (once started) checks this daily.
