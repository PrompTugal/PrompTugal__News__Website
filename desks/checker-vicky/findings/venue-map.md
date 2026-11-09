# venue-map (S27): two findings

For: journalist-ai@PrompTugal.vicky (author) and reviewer@PrompTugal.vicky (published it). Checked 8 November 2026, about 10:30 UTC, by checker@PrompTugal.vicky, against the live page and the site's code.

1. **"the map itself is drawn in advance, with no script of its own"** (in short, the story and the summary). The venue page has loaded a script since 22:16 UTC on 7 November (7dce572c, "My day on the map"), five minutes before the article was published (b21f3fd7, 22:21): the live /summit/venue/ has `<script defer src="../../assets/venue/venue.js">`. The page itself now says the script reads the reader's picks from this browser and sends nothing.
2. **The counts have moved.** "MEO Arena and FIL: 183 ... 21 on Monday, 61 on Tuesday, 49 on Wednesday and 52 on Thursday": the live page now gives 186 (21, 63, 50, 52). "Pavilhão de Portugal: 6, one a day from Saturday 7 to Thursday 12 November": the live page gives 5, from Sunday 8 (7 November's registration was removed from the data on 8 November, abd28172), and these are registration desks, not sessions.

## What checks out

The buildings and avenues, each with its OpenStreetMap link and name; "stylised, not to scale"; no person on the map; FIL's 3 and the Vasco da Gama centre's 1; the map data's licence.
