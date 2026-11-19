# One navigation bar across every *.promptugal.news site, with a preview of each

> Dinis, in conductor.b@'s session, 18 November 2026, about 22:00 UTC: "can you add a request so that all *.promptugal.news sites link to each other? I should have a way to go from one website to another easily on a sort of common navigation bar ... a common sort of little pop-up that shows a preview of each website ... a screenshot or maybe an infographic or something for each one, and then I can click on it and navigate between them."

## What follows

1. **One registry of the sites**, `promptugal.news/api/v1/sites.json` (dev@): for each site its name, URL, one line on what it is, its colour or mark, its preview, its version and when it last changed. Today: promptugal.news, data, weather, civic, startups, travel, events, signals, library, videos, live, cyber, bulletins.
2. **The sites bar** (designer@ designs it, dev@ builds it): one bar on every page of every site, the same look everywhere, the current site marked; on hover or tap, a small pop-up per site with its preview, its one line and its last update; one click to go. Works on a phone (a sheet that slides up) and with a keyboard.
3. **A preview per site, made by the site itself at each build:** `/preview.svg` (an infographic of its own live numbers: e.g. events this week, cameras up, contracts in 90 days, the pulse), plus `/preview.png` for social cards; with provenance and licence like everything else.
4. **Safe across sites:** the registry is data, not code. Each site keeps its own copy of the bar's code, pinned by version and hash, and renders the registry with escaping and only https links to *.promptugal.news; no site loads another site's scripts. security@ reviews the bar before it spreads.
5. **Every site lead installs it** at its next wake once designer@ and dev@ publish it, and keeps its preview current.

## One way to move between the sites (Dinis, 19 November 2026, about 03:18 UTC)

Looking at promptugal.news's front page on a phone, where the sites bar ("Sites ▾") sits above an older block, "The PrompTugal.news sites", in assets/top/top.tmpl (`em-net`). That block hard-codes 5 of the 13 sites and opens each in a new tab. Dinis, dictated:

> "can you fix this homepage? ... this the same homepage on every single site to link to every site. So maybe you keep in like this one, you keep the one that's selected, but you should be able to see as smooth as possible ... move between these 10 sites. Although many exist, there might be more now."
> "from every website, I should be able to find the other websites, right? Because again, this is a good way for us to show the depth of the flow, including ... the other sites finding the PrompTugal website."

So:
1. **One switcher, on every site, from the registry.** The hard-coded `em-net` block goes. Every site, promptugal.news included, shows every site in api/v1/sites.json (13 today, more later), never a hand-kept list.
2. **The current site is shown as selected**, and moving to another is as smooth as possible:
   - one tap, opening in the same tab;
   - on a phone, a single row that scrolls sideways, with the current site in view;
   - on a desktop, all of them at a glance.
3. **promptugal.news is always first** in the switcher on every sub-site, so each site leads back to the newsroom.
4. **Who does it:** designer@ sets the look, keeping the current site visible and selected. dev@ builds it, as the sites bar's next version or in place of em-net. security@ reviews the version, and the site leads upgrade as before.
