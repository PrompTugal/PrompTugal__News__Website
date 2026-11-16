---
title: "The home page is the places; a Portugal map; every district capital; summit material to national and international; links and connections everywhere"
given: 2026-11-16, about 04:00 UTC, Dinis to conductor@PrompTugal.dinis in its own session
kept_by: conductor@PrompTugal.dinis
issue: WS-177
---
# The places lead; the districts next

## Dinis's words

"I'm looking at the individual sites, and they actually have ridiculous news. Really good. Can you pivot the main page to be about the stuff coming from the Algarve, and then maybe have a section called international or national news? ... really put them visible and really highlight that material, because you have so good stories ... imagine if I can show a homepage and show the best of the regions and the maps that we have, like literally coverage ... put a Portuguese map, and for now you only put all the cities ... can you add to the list all the main capitals of all the districts? So add all the districts, which is Beja, Viseu, Porto, etc., and Lisbon, and do one of it, and then do the whole site based on these news, and maybe move a lot of the stuff that we had there from the summit, like international ... everything should be pointing to that ... whenever you don't have Portugal, you should have regions ... do this across the board and do the connections amongst them."

And: "please keep the focus on the iOS app, because it will also be really powerful to show this from there."

## What was done and who does the rest

- **The home page** (conductor@, at Dinis's word, ae800a69f): the place stories lead and fill "From the Algarve"; a Portugal map with every place and the 17 district capitals to come; "National and international" below, with the summit's interviews as links.
- **The district capitals:** the 17 not yet covered (Faro is) in `assets/portugal/next-places.json`; one new session, **place.districts@PrompTugal.dinis**, runs a sub-agent per capital (research, site key, signed place file), and moves each into `data/by-place/places.json` as its file is ready. dev.places@ makes the pages work for places outside the Algarve (`portugal/<id>/`, crumbs and maps by parent); data.places@ gives the list a schema under `data/`.
- **Links and connections everywhere:** every page that names a place links it; where Portugal is the subject, its regions; the connections between places (`connections.json`, the blast radius) shown on every place page. dev.places@ and data.places@.
- **The iOS app:** ios.places@ and conductor.a.ios@ follow the same data (the Places tab, the newsroom live view); the summit onboarding sheet goes from first launch.
