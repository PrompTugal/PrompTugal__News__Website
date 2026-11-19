# No IP lookup, one collection of predictions, and small decisions (19 November 2026)

Dinis, in conductor.b@'s session, about 03:15 UTC on 19 November 2026 (dictated; quoted as given):

> "Yeah, okay, remove the IP base. So we're going to keep the country still. I agree. The predictions are one collection, yeah. I'll add branch protection later. It's not a problem at the moment. I believe I've merged 35 already. For now, that's okay on cyber. Yeah, you should refuse commands, not the crew and writer, like on the journalists. We can't. We're not going to have a key. So for now, don't get the London observed temperature. Just make a list of the sources we could do later."

## 1. No IP-based location, anywhere; the country stays

- **Remove the town lookup.** obs.js no longer asks ipapi.co or ipwho.is (or any third party) where a reader is, on promptugal.news and on every site that carries a copy (data, civic, events and the rest). The reader's IP goes to no one but our own hosts' server, and we keep none of it.
- **Keep the country,** taken in the browser from the reader's own time zone (`Intl.DateTimeFormat().resolvedOptions().timeZone`, already sent as `tz`) through a fixed table of time zone to country, with no network call. For example, Europe/Lisbon and Atlantic/Madeira give PT, and Europe/London gives GB. A zone not in the table gives an empty country. Region, city and map position are dropped.
- **Update everything that mentions it,** in the same release: the page-view notice, the CSP (ipapi.co and ipwho.is out of connect-src), obs.json's `geo`, and each threat model and REALITY.md.
- **Who does it:** dev@ on promptugal.news, and each site lead on its own copy. observability@ reports country only from now on.

## 2. Predictions: one collection, in the library

library.b@'s proposal is agreed. library.promptugal.news keeps every site's predictions exactly as shown, as one catalogued collection. Each site still keeps and checks its own (board/guidance/2026-11-19-show-the-past.md). Each site sends its prediction files to the library in the form library.b@ sets.

## 3. Small decisions

- **Branch protection:** later, at Dinis's hand; not a problem for now.
- **AgentiCCells PR #35** (signed commits in the Factory): Dinis believes he has merged it. cells.b checks it and says so.
- **Cyber:** the known-exploited list (KEV) is enough for now; it does not track beyond KEV.
- **The newsroom's signing check:** refuse the commits that are neither the writer's nor CI's own version commits, recognised by their content as security@'s first control says, never by name. The newsroom's accountant will not get a key, so it does not commit to that repository. writer-10 takes this from Dinis in its own session; conductor.b@ passes it on as material.
- **London's observed temperature:** not now. The candidate sources are listed in board/briefs/2026-11-19-london-observed-temperature-sources.md for later, each to go on the register (R15) with rights@'s check before any first read.
