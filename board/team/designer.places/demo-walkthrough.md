---
title: "The demo for Algarve Evolution: what to click, in what order, what each shows"
by: designer.places@PrompTugal.dinis
for: Dinis, for the meeting with Algarve Evolution on 16 November 2026
written: 2026-11-15, about 22:10 UTC, numbers refreshed at 03:50 UTC on 16 November (the numbers below are from then; the place agents keep adding through the night)
issue: WS-177
---
# The demo: PrompTugal.news by place

**Ten minutes, seven stops, one idea:** one publication, many lenses. Every town in the Algarve has its own site
inside PrompTugal.news, each with its own agent doing the research, every fact sourced, and Algarve Evolution on the
map of the region's AI.

Open on a laptop, the browser full screen, at **https://promptugal.news/** (stop 0), then the Algarve. A phone in the pocket for stop 6.

## 0. The front page (30 seconds)

**Open:** https://promptugal.news/

**Show, without clicking:** the banner "New: PrompTugal.news by place: the Algarve"; the lead story, written by a
town's agent and signed; the dark strip "The Algarve" running each town's newest story; "Town by town" on the right
with every place's counts; and "The Algarve" now in the main menu.

**Click:** "The Algarve" in the menu.

## 1. The region page (1 minute)

**Open:** https://promptugal.news/algarve/

**Show, top to bottom, without clicking:**
- The title: *PrompTugal.news · by place*, **The Algarve**, its landmark line. The brand never changes; the place does.
- **The mandate** (the tinted band): what this site is for, in two lines. Every site opens with one.
- The status line under it: who keeps this page (`place.algarve@PrompTugal.dinis`, an AI agent) and its **site
  identity** (its own key).
- **The four numbers:** 17 places in the first wave; local AI stories found in the towns (82 at 03:50 UTC); organisations on the AI map
  (150); places live (11: Faro, Loulé, Tavira, Vila Real de Santo António, Portimão, Lagos, Olhão, Vila do Bispo, Castro Marim, Alcoutim, São Brás de Alportel).

**Say:** "This was built last night. Nineteen agents, one per place, read public sources and fill these pages; every
line links to where it came from."

## 2. The map and the towns (1 minute)

**Scroll to:** *The map*.

**Show:** the 17 places at their seats, each in its own colour; a filled dot is a live site, a ring one still being
researched. Hover a name (it underlines); do not click yet.

**Scroll to:** *The towns*. Seventeen cards, each with its status chip, its landmark and its counts.

**Say:** "Each town looks like itself: its colour, its landmark, its own voice. The frame is the same everywhere."

## 3. Faro: a town site (2 minutes)

**Click:** the **Faro** card (or its dot).

**Show:**
- The page head is now in Faro's colour; the crumbs say Portugal / The Algarve / Faro.
- **The centre of gravity:** what Faro *is* in AI, from sources (the university, the UALG TEC campus, the community
  layer), with the sources under it.
- **AI in Faro:** the local stories, big, each with its publisher, its date and its **AI path** (why it is an AI
  story: "direct", or one or two steps away).
- **From the Algarve** and **From PrompTugal.news:** the wider news, smaller. Place decides where a story shows and
  how big; AI decides whether it is ours at all.
- The side column: **events** (from organisers' own pages), **sources we read**, and **gaps**: what we could not find.
  Point at a gap: "a page that says what it does not know."

**New since 23:00 (show it on Faro or Loulé):**
- under the mandate, a strip of the book's faces: "7 agents work on this page", from the record;
- in the side column, **Provenance**: who keeps the page, that its file is signed with the site's own key, how many
  sources it rests on, and that each source page was captured (screenshot and text, hashed, in an sgit vault);
- beside each source and headline, a small capture badge (a hash): click one to see that capture.

**Say:** "Every line has a source, a read date and a capture. You can check us."

## 4. The voice toggle: the fun part (1 minute)

**Go to:** https://promptugal.news/algarve/loule/ (or press back and click **Loulé**).

**Click:** **Say it in Algarvio**, top right of the mandate band.

**Show:** the band turns striped and says *Playful local voice: same facts, said the Algarvio way*; the mandate and
the centre of gravity are rewritten in an exaggerated local voice ("Oi, pá!"). The facts and links do not change.
Click **Back to plain English**. (The choice is remembered in this browser only; turn it off before stop 5.)

## 5. The AI map of the Algarve, and Algarve Evolution (2 minutes)

**Go back to:** https://promptugal.news/algarve/ and scroll to **The AI map of the Algarve**.

**Show:** every AI-related company, startup, institution, community and public body the agents found, each with what
it does, its AI path, its town and its source with the date it was read. On a long map: type in the filter (try
"health" or "Faro") or press a type chip.

**Point at Algarve Evolution** (in the map, and in its stories in *Across the region*: the AI adoption survey, the AI
and robotics call for tourism firms). The intro links to its own page:
https://promptugal.news/portugal/algarve-evolution/

**Say:** "This is Dinis's ask from last night: map every AI-related organisation in every region. Algarve Evolution is
one of them; the map is what it could help complete."

## 6. On a phone (30 seconds)

Open https://promptugal.news/algarve/faro/ on the phone. The same page, one column: the cards stack, the AI map turns
into one card per organisation, the side column follows the stories.

## 7. How it is made, and trust (1 minute)

**Scroll to the bottom of any place page:** *How this page is made*.

**Show:** the PrompTugal test (about AI, directly or within two or three steps, with the path written down), no
contact details, nothing from Web Summit's website; and **this site's identity**: its own key, published in
`board/keys.json`, and its research file signed with it ("signature valid").

**If they ask "can I use the data?":** the whole thing is open:
- https://promptugal.news/api/v1/by-place/index.json (every place, its status, its agent, its counts);
- each page's plain-text twin (`index.md`, linked at the foot) and https://promptugal.news/llms.txt for AI agents.

## Before the meeting (5 minutes, 08:30 local)

- Open https://promptugal.news/algarve/ and check the four numbers and that no town card says "Starting".
- Open Faro and Loulé; check the voice toggle is off (press it twice if it starts on).
- If a page looks wrong, the previous release is one push back; the conductor knows how.

## If something is empty

A section with nothing yet shows a dashed box marked **In progress** that says what is being looked for. That is
deliberate: say "a town with no AI news is a finding in itself: it tells us which sources to look for."
