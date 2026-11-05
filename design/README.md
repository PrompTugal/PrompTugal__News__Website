# The design: an independent newsroom at Web Summit Lisbon 2026

By `newsroom-designer@web-summit.dinis`, 5 November 2026, for `newsroom@web-summit.dinis` (WS-14). Dinis's brief: *"Really improve the design. We need to make this way more consumable, and it needs to look like a very official-looking organisation."* Positioning, his decision: **the independent newsroom at Web Summit Lisbon 2026, powered by RiskMandate, with no affiliation to Web Summit.**

**On the site since 5 November (phase 2):** Dinis approved the direction (the name stays a working name, set only in `data/site/site.json`; RiskMandate's own mark is used). The shell (`admin/build/lib/shell.mjs`), `assets/site.css` and `assets/tokens.css` now carry it; the markdown asks for components through layout hooks, and the shell has three mount points for the browser features. How it fits the build: `admin/build/README.md`, "The look". Screenshots of the real pages: `shots/live-*.png`. The mockups below remain the reference for the features still to come (search, chat, graph explorer, billing, vault).

| File | What it is |
|---|---|
| `tokens.css` | every colour, face, size and space, light and dark |
| `site.css` | the complete stylesheet for the real site: the build's current classes plus the new components below; imports `fonts.css` and `tokens.css` |
| `fonts.css`, `fonts/` | the three faces for the mockups (Newsreader and Plex Mono from `assets/fonts/`; IBM Plex Sans, new, in `fonts/` with its licence) |
| `mockups/*.html` | 15 static mockups, real data from the repository; open any in a browser |
| `shots/*.png` | each mockup at 390x844 (phone) and 1280 wide (desktop); four in dark mode; `dropin-*` is today's built site with `site.css` swapped in |
| `tools/` | how the mockups and shots were made: `node design/tools/mockups.mjs`, then `node design/tools/shoot.cjs [--dark]` (Playwright) |

---

## 1. The direction, in one page

**An official news organisation, not a project page.** The look of a national paper's front page and a wire service's discipline: a nameplate between rules, a dateline that says where and when, sections in small capitals, a thick rule over every section, a masthead box of editors. Paper and ink stay (brief 6); colour is rationed.

**Our own brand, never Web Summit's.** Web Summit's site is magenta, teal and purple on a dark navy gradient, in a geometric sans. We are cream paper, black ink and **azulejo cobalt**, the blue of Lisbon's tiles, in a serif. The old teal accent (`#0c5f59`) sat close to Web Summit's teal (`#00aca8`), so it goes. RiskMandate's green (`#1A7F5A`) is RiskMandate's: we never use it as ours.

**Name lockup.** The current name, "Web Summit Newsroom", reads as Web Summit's own newsroom, which is exactly what Dinis said we must never suggest. The mockups use a working name, **The Lisbon Wire** (a wire: live, sourced, fast, from the city), as one string (`NAME` in `tools/lib.mjs`, one `<span class="name-text">` in the shell), so his choice is one edit. Under it, the descriptor in his words, set in spaced mono capitals: THE INDEPENDENT NEWSROOM AT WEB SUMMIT LISBON 2026. Then the endorsement, small and italic: *Powered by* **RiskMandate**, linking to our RiskMandate page. The mark is ours: a square cobalt tile with a glazed diamond and four corner quarter-circles, drawn after an azulejo, deliberately unlike RiskMandate's round seal.

```
Lisbon · Tuesday 10 November 2026, 11:52        Day 1 of 3 · Edition v0.1.7     ○ Your vault
┌──────────────┐                                                       ┌──────────────┐
│EVERY FACT    │        [tile]  The Lisbon Wire                         │POWERED BY    │
│SOURCED       │   THE INDEPENDENT NEWSROOM AT WEB SUMMIT LISBON 2026   │RISKMANDATE   │
└──────────────┘                Powered by RiskMandate                  └──────────────┘
══════════════════════════════════════════════════════════════════════════════════════
NOW  ● AGENDA  NEWS  COMPANIES  PEOPLE  PORTUGAL  ABOUT          (Search /) (£5.00 credit) (Ask)
● LIVE  NOW 11:50 The agentic internet: Who controls the web? Centre Stage   NEXT 12:10 ...
```

The ears (boxes either side) show on the front page from 1000px. Inner pages use `.mast.compact`: the same lockup one size down, so a phone reader reaches the content in one screen.

**"Now" leads.** Most readers are at the venue on a phone. During the summit a black **live strip** under the sections says what is on now and next; the front page's **Now and next** rail and the agenda page fold everything that is over into one line ("Earlier today: 18 items, over"), so the top of the page is always the present. **Navigators** on every company, person and field page move the reader company to session, session to person, person to field, field to companies, with the small graph beside them and the full **graph explorer** behind it.

**Independent, and honest about it.** The footer and about page carry **"Independent. Not affiliated with Web Summit."**, then, in the same breath, that the team also works on RiskMandate. Independent of Web Summit, not of RiskMandate (see decision 2).

## 2. Typography

| Face | Role | Where from |
|---|---|---|
| **Newsreader** (variable 400 to 600, italic 400) | reading: the nameplate, headlines, body, deks | already self-hosted, `assets/fonts/` |
| **IBM Plex Mono** (400, 500) | times, dates, numbers, the dateline, data, ASCII pictures | already self-hosted, `assets/fonts/` |
| **IBM Plex Sans** (variable 100 to 700, Latin) | the interface: section labels, kickers, chips, buttons, meta lines, tables, the chat | **new**, `design/fonts/plex-sans-variable.woff2` (45 KB), SIL OFL 1.1, from Google Fonts' copy of [IBM/plex](https://github.com/IBM/plex) |

Why a sans: at 11 to 14px on a phone, a serif in capitals (today's nav and h2) is harder to scan than Plex Sans, and Plex Sans is Plex Mono's own family, so the two read as one voice. To ship it: copy the woff2 to `assets/fonts/`, add the last `@font-face` in `fonts.css` to `assets/fonts.css` with `url(fonts/plex-sans-variable.woff2)`, and add a row to `assets/fonts/LICENSE.md`. Without it, the stack falls back to the system sans and nothing breaks.

Scale (phone, growing with `clamp()` to desktop): nameplate 38 to 78px; article title 31 to 50px; lead headline 27 to 40px; headline 20 to 23px; body 17.5px (18.5px from 768px), line height 1.6, measure 36em; dek 18px; UI 14px; labels 12px capitals, tracked .09em; meta 12.5px.

## 3. Colour tokens (`tokens.css`)

| Token | Light | Dark | Use, contrast on paper |
|---|---|---|---|
| `--paper` / `--paper-2` / `--panel` | `#f6f3ec` / `#ece7db` / `#fffdf8` | `#111214` / `#1a1b1e` / `#1e1f23` | page / sunk (code, inputs) / raised (panes) |
| `--ink` / `--ink-2` / `--ink-3` | `#121317` / `#3f424a` / `#595c64` | `#eceae4` / `#c3c0b7` / `#a6a39a` | text 16.8:1 / secondary 9.1:1 / meta 6.0:1 (dark: 15.6, 10.3, 7.4) |
| `--rule` / `--rule-2` / `--hair` | ink / `#9d9580` / `#d9d2c1` | ink / `#5f5b51` / `#2e2f34` | section rule / nav and cards / list hairlines (decorative) |
| `--brand` / `--brand-2` / `--brand-soft` | `#1b4597` / `#10306d` / `#e3e9f5` | `#93b1ff` / `#bccfff` / `#1a2440` | azulejo cobalt: links, mark, selection, 8.1:1 (dark 8.9:1) |
| `--live` / `--live-soft` | `#b42318` / `#f8e4df` | `#ff8f7d` / `#3a1b16` | live now, 5.9:1 (dark 8.5:1); `--live-on-band` `#ff8f7d` on the black strip, 8.4:1 |
| `--ok` / `--warn` (+ `-soft`) | `#2b6a3c` / `#8a5200` | `#84cf9c` / `#e9b55e` | re-checked and live / moved, not re-confirmed, both above 5.2:1 on their tints |
| `--band` / `--on-band` | `#121317` / `#f6f3ec` | `#1e1f23` / `#eceae4` | the live strip |
| `--focus` / `--focus-ink` | `#ffbf1f` / `#121317` | `#ffcf4d` / `#111214` | the focus ring |

Every pair used for text passes WCAG AA (4.5:1) in both themes; checked with the WCAG formula. Signals never rely on colour alone: "On now", "Confirmed", "Our pick" are always words.

## 4. Grid and spacing

- **Phone first.** One column, a 16px gutter (24px from 768px), nothing wider than the screen: every mockup was checked at 390px for elements past the right edge, and the 64-column pictures at 320, 360, 390, 600 and 1280px.
- **The page** is 1200px at most (`--page`). From 768px the front page is 2:1 (stories, then the Now and next rail with a hairline between); lists of companies run in 2 or 3 columns; navigators in 2, then 4.
- **The reading column** is 36em (`--measure`), about 70 characters. From 1100px an article gets a contents rail on the left and an "about this article" rail on the right, both sticky.
- **Space** on a 4px base: `--s1` 4 to `--s8` 64. Sections are 40px apart; a section opens with a 2px ink rule, its label and an "All of it →" link.
- **Rules, not boxes** (brief 6): cards are hairline-separated rows; a box appears only for something that floats (panes, the dropdown) or is a record (the balance, the RiskMandate quote). Corners are 3px.

## 5. Components: the classes `site.css` styles, and the HTML each expects

**Existing classes, restyled** (they work with today's build output, unchanged: see `shots/dropin-*`): `.skip`, `.row`, `.dateline` (+ `.countdown`, `.ver`), `.mast` (+ `.name`, `.motto`), `nav.site` (+ `.links`, `a[aria-current]`), `.frame`, `main`, `.crumbs`, `h1`, `h2`, `h3`, `.lead`, `.toc`, `.body`, `blockquote`, `code`, `pre`, `.table`/`table`, `.twin`, `footer` (+ `.small`), `.agent-block`.

**Content hooks**, styled from the build's own ids, no build change: `.body #in-short + ul` (the article's "In short" as square-bulleted lines), `.body pre` (64 columns fit: edge to edge on a phone, type follows the screen width, 9.7px at 390px, 14.5px in the column), `#limits + ul` and `#sources ~ ul` (set in the sans, smaller).

**New, for the shell** (the templates module should emit these):

```html
<div class="dateline"><div class="row">
  <span class="dl-where"><span class="dl-long">Lisbon · Tuesday 10 November 2026, </span><span class="dl-short">Tue 10 Nov · </span>11:52</span>
  <span class="dl-right"><span class="countdown">Day 1<span class="dl-long"> of 3</span></span><span class="dl-long"> · Edition</span> <a class="ver" href="admin/versions.html">v0.1.7</a></span>
  <span class="dl-account"><a href="vault/">Your vault</a></span>            <!-- a.is-open when the vault is open -->
</div></div>
<header class="mast">                                                     <!-- .mast.compact on every page but the front -->
  <div class="ear l"><b>Every fact sourced</b>Each one links to a public page, with the date we read it.</div>  <!-- front page only -->
  <a class="name" href="index.html"><svg class="mark" viewBox="0 0 32 32" aria-hidden="true">…</svg><span class="name-text">The Lisbon Wire</span></a>
  <p class="motto">The independent newsroom at Web Summit Lisbon 2026</p>
  <p class="endorse"><a href="riskmandate/">Powered by <b>RiskMandate</b></a></p>
  <div class="ear r"><b>Powered by RiskMandate</b>Our lens on AI agents: <a href="riskmandate/">reach, mandate, gap</a>.</div>
</header>
<nav class="site" aria-label="Sections"><div class="row">
  <div class="links"><a href="index.html" aria-current="page">Now</a><a class="is-live" href="agenda/">Agenda</a>…</div>
  <div class="tools">
    <a class="tool" href="search/" aria-label="Search"><svg…/><span class="tool-label">Search</span><kbd>/</kbd></a>
    <a class="tool meter" href="account/">£5.00<span class="meter-label">&nbsp;credit</span></a>   <!-- .is-low below £1 -->
    <a class="tool ask" href="#chat">…Ask</a>                                                       <!-- hidden on a phone -->
  </div></div></nav>
<aside class="live-strip" aria-label="Live from the summit"><div class="row">   <!-- only 9 to 12 November -->
  <span class="live-tag"><span class="pulse" aria-hidden="true"></span>Live</span>
  <span class="live-now"><b>Now</b><time>11:50</time><a href="…">The agentic internet: Who controls the web?</a><span class="where">Centre Stage</span></span>
  <span class="live-next"><b>Next</b><time>12:10</time><a href="…">…</a></span>
  <a class="more" href="agenda/">Today's agenda</a></div></aside>
<a class="ask-fab" href="#chat"><svg…/>Ask</a>                                  <!-- phone only; opens the chat pane -->
```

`main.wide` lifts the 36em measure for wide pages (front, agenda, company, field, graph). `.dl-long` shows from 768px, `.dl-short` below it.

**The footer:**

```html
<footer><div class="row">
  <div class="foot-brand"><span class="name"><svg class="mark">…</svg>The Lisbon Wire</span><span>…descriptor…</span>
    <span class="independence">Independent. Not affiliated with Web Summit.</span><span>Powered by <a>RiskMandate</a>. …disclosure link…</span></div>
  <div class="foot-cols"><div><h3>Sections</h3><ul><li><a>…</a></li></ul></div> …4 columns… </div>
  <p class="small">…licence… <a class="ver">v0.1.7</a></p></div></footer>
```

**New, for content:**

| Class | HTML it expects | Notes |
|---|---|---|
| `.sec`, `.sec-head` | `<section class="sec"><header class="sec-head"><h2>Latest</h2><a class="more" href>All news</a></header>…</section>` | thick rule, label, "→" link; `.note` for a count |
| `.kicker` | `<p class="kicker"><a>Europe</a><span class="sep">·</span>The summit</p>` | beat above a headline; `.kicker.live` in red |
| `.story`, `.story.lead`, `.stories` | `<article class="story"><p class="kicker">…</p><h3><a>Headline</a></h3><p class="dek">…</p><p class="meta"><time>5 Nov</time> · author · <span class="rt">4 min</span></p></article>`; lists: `<ul class="stories"><li><article class="story">…` | `.story.has-fig` + `<a class="fig"><pre>…</pre></a>` uses an article's own ASCII picture as its image |
| `.front-top` | children `.a-lead`, `.a-agenda` (+ `.rail`), `.a-latest` | phone order: lead, now and next, latest; desktop: 2:1 with the rail spanning |
| `.agenda`, `.slot` | `<ol class="agenda"><li class="slot is-now"><time class="t">11:50<small>12:10</small></time><div><a class="s-what">…</a><span class="s-who">Name, Org · …</span><span class="s-where">Centre Stage</span></div><div class="tags"><span class="tag k-now">On now</span><span class="tag">Centre Stage</span></div></li></ol>` | `.is-past` greys; `.agenda.cols` runs in columns; `<li class="hour">10:00</li>` marks the hour; `<li class="earlier"><details><summary>Earlier today: 18 items, over</summary><ol class="agenda">…</ol></details></li>` folds the past |
| `.tag` | `<span class="tag k-pick">Our pick</span>` | kinds: none (programme), `k-pick`, `k-side` (dashed: around the summit), `k-press`, `k-now` |
| `.day-head` | `<div class="day-head"><h3>Web Summit's programme</h3><span class="note">60 items</span></div>` | |
| `.seg` | `<div class="seg" role="tablist"><button role="tab" aria-selected="true"><b>Tue · today</b>10 Nov</button>…</div>` (or `<a role="tab">`) | days, fields, result kinds; scrolls sideways on a phone |
| `.filters`, `.chip` | `<div class="filters" role="group"><span class="label">Show</span><button class="chip" aria-pressed="true">All <span class="n">18</span></button>…</div>` | `.chip.src` (a source: `domain · read 1 Nov`), `.chip.ok`, `.chip.warn`, `.chip.live`, `.chip.topic`; `.chips` is a wrapping `ul` |
| `.facts` | `<dl class="facts"><div><dt>Based in</dt><dd>United States<span class="src">…page, read 1 Nov 2026</span></dd></div></dl>` | a company's or person's record, each fact with its source under it |
| `.navigator`, `.nv`, `.nv-item` | `<nav class="navigator" aria-label="Go from Replit"><div class="nv"><h3>At the summit<span class="n">3</span></h3><ul><li><a class="nv-item" href><span class="nv-kind">Session</span><span class="nv-title">…</span><span class="nv-meta">Tue 10 · 14:00 · Centre Stage</span><span class="nv-go" aria-hidden="true">→</span></a></li></ul></div>…</nav>` | 1, 2, then 4 columns (`.navigator.three` for 3) |
| `.co-list`, `.co` | `<ul class="co-list cols"><li class="co"><a class="co-name">Replit</a><span class="co-meta">Developer tools · United States</span><p class="co-what">…</p><span class="on-stage">14:00 · Centre Stage</span></li></ul>` | `.cols` 2 then 3 columns, `.cols.two` stops at 2; `.co-what` clamps to 3 lines |
| `.field-tiles` | `<ul class="field-tiles"><li><a href>Security<span class="n">30</span></a></li></ul>` | `.two` keeps 2 columns in a rail |
| `.person-head`, `.initials` | `<div class="person-head"><span class="initials" aria-hidden="true">MC</span><div><h1>…</h1><p class="role">President, <a>Replit</a></p></div></div>` | initials, never a photo unless the person gives one |
| `.minigraph`, `.g-*`, `.n-*` | `<figure class="minigraph"><svg viewBox="0 0 480 350">…<line class="g-edge strong"/><g class="g-node n-co focus"><circle/><text/><text class="sub"/></g>…</svg><figcaption><span class="g-legend">…</span><a class="more">Open in the graph</a></figcaption></figure>` | node kinds: `n-co`, `n-person`, `n-session`, `n-topic`, `n-place`, `n-article`; `.dim` for what is not selected |
| `.lens` | `<ol class="lens"><li><b>Reach</b>What can it actually do?</li>…</ol>` | the RiskMandate question, numbered |
| `.notice` | `<p class="notice"><strong>…</strong> …</p>` | a rule-left aside; `.notice.brand` in cobalt |
| `.staffbox` | `<section class="staffbox"><h2>The masthead</h2><dl><div class="wide"><dt>Editor-in-chief</dt><dd>Dinis Cruz<small>role line</small></dd></div>…<div class="wide agents">…</div></dl></section>` | the newspaper's editors box, between double rules |
| `.endorse-card` | `<div class="endorse-card"><div><img class="lockup on-light" src="…lockup-light.svg"><img class="lockup on-dark" src="…lockup-dark.svg"></div><div><blockquote>…</blockquote></div></div>` | the right lockup for the reader's theme |
| `.independence` | `<span class="independence">Independent. Not affiliated with Web Summit.</span>` | |
| `.btn` | `<a class="btn primary">Top up £5.00</a>`, `.btn.quiet` | 44px tall |
| `.field`, `.input` | `<div class="field"><label>…</label><input><span class="hint">…</span></div>` | 16px text, so a phone does not zoom |
| `.search`, `.s-icon` | `<form class="search" role="search"><label class="visually-hidden" for="q">…</label><svg class="s-icon"/><input id="q" type="search"><button>Search</button></form>` | |
| `.search-pop`, `.sp-*` | inside `.search`: `<div class="search-pop" role="listbox"><div class="sp-group"><h4>Companies</h4><a class="sp-item" role="option" aria-selected="true"><span class="t1"><mark>Rep</mark>lit</span><span class="t2">…</span><span class="k tag">Company</span></a></div><div class="sp-foot">…</div></div>` | the input carries `role="combobox" aria-expanded aria-controls` |
| `.results`, `.res` | `<ol class="results"><li class="res"><span class="r-kind">Session · Tue 10 · 11:30</span><br><a class="r-title">…</a><p class="r-snip">…<mark>security</mark>…</p><p class="r-meta">…</p></li></ol>` | |
| `.chat` (the pane) | `<aside class="chat" id="chat" aria-label="Ask the newsroom"><header class="chat-head"><div><h2>…</h2><span class="scope">…</span></div><span class="spacer"></span><button>Settings</button>…</header><div class="chat-key"><span class="ok">● Connected</span>…<span class="model">anthropic/claude-sonnet-5</span></div><div class="chat-log" role="log" aria-live="polite"><div class="msg user"><p>…</p></div><ol class="calls"><li class="call"><span class="st">✓</span><code>search('Michele Catasta')</code><span class="out">1 person, 3 sessions</span></li><li class="call running">…</li></ol><div class="msg bot"><p>…</p><p class="cites">Sources: …</p></div></div><form class="chat-input"><textarea></textarea><button>…</button></form><p class="chat-foot">…</p></aside>` | full-screen sheet on a phone; 400px on the right from 768px; from 1000px `body.chat-open` makes room instead of covering the page |
| `.gx` (graph explorer) | `<div class="gx"><div class="gx-bar">search + filters</div><div class="gx-canvas"><svg>…</svg><div class="gx-zoom"><button>+</button>…</div><span class="gx-hint">…</span></div><aside class="gx-side">the selection</aside></div>` | on a phone the canvas keeps a readable scale and pans; the panel moves below |
| `.balance-card`, `.ledger`, `.meter-line` | `<div class="balance-card"><div><p class="label">Balance</p><p class="amount">£5.00</p><p class="sub">…</p></div><div class="actions">…</div></div>`; `<table class="ledger">` with `td.num`; on an article `<div class="meter-line" role="note"><span>Reading credit <b>£5.00</b></span><span class="meter-bar"><i style="width:38%"></i></span><span>…</span></div>` | brief 7's one line on every article |
| `.pane` (vault) | `<aside class="pane" aria-label="Your vault"><header class="pane-head"><h2>…</h2><span class="spacer"></span>…</header><div class="pane-tabs" role="tablist"><button role="tab" aria-selected="true">Vault</button>…</div><div class="pane-body"><ol class="steps"><li class="done">…</li></ol><dl class="kv">…</dl></div></aside>` | same geometry as the chat |
| `.art`, `.art-head`, `.art-body`, `.art-side` | `<div class="art"><header class="art-head">…</header><details class="toc" open><summary>On this page</summary><ol>…</ol></details><div class="art-body body">…</div><aside class="art-side"><div class="box"><h2>…</h2>…</div></aside></div>` | from 1100px: contents left, notes right; below, the contents fold |
| `.byline`, `.sig` | `<div class="byline"><span>By <span class="by">…</span></span><time>Thu 5 Nov 2026</time><span class="rt">4 min read</span><a class="sig" href="….md.sig">✓ Signed</a></div>` | |
| `.ascii` | `<figure class="ascii"><pre><code>…</code></pre><figcaption><span>caption</span><button class="zoom" aria-pressed="false">Enlarge</button></figcaption></figure>` | optional: Enlarge sets 13px and lets it scroll (a 6-line script in `mockups/article.html`) |
| `.corrections`, `.empty`, `.mini-h`, `.split`, `.rail`, `.grid` (`.g-2`, `.g-3`, `.g-4`, `.g-8-4`), `.count-line`, `.badge-idea`, `.visually-hidden` | small helpers, see `site.css` | `.badge-idea` is for the mockups' story ideas only |

## 6. The voice of interface labels

Short, plain, British, in the reader's words; no em-dashes. Sections are nouns: **Now, Agenda, News, Companies, People, Portugal, About**. Buttons say what happens: **Search, Ask, Top up £5.00, Use a passkey, Enlarge**. Links that lead on end in an arrow: **All news →, Today's agenda →, Open in the graph →**. States are words, never only colour: **On now, Our pick, Around the summit, Confirmed for 2026, Summit page live**. Sources always read `domain · read 1 Nov`. Empty states say what will be there: *No article names Replit yet.* Never "click here", never "Web Summit's newsroom", never a claim for RiskMandate in our own words.

## 7. Accessibility

- **Contrast** AA for every text pair in both themes (table in section 3); `forced-colors` keeps borders on chips, tags and buttons.
- **Focus**: a yellow ring with an ink edge on every control (`:focus-visible`), and links turn yellow with an ink underline, as public-service sites do; visible on paper, on ink and on cobalt.
- **Reduced motion**: the only animation is the live dot's pulse, and `prefers-reduced-motion` stops it (and any transition).
- **Structure**: one `h1` per page, sections labelled, a skip link, breadcrumbs as `nav`, the agenda as ordered lists with `<time>`, the chat log `role="log" aria-live="polite"`, the dropdown a `combobox`/`listbox` pair, tabs with `aria-selected`, filters with `aria-pressed`.
- **Touch**: buttons and chips at least 30 to 44px tall, the Ask button at the thumb, inputs at 16px so iOS does not zoom.
- **No horizontal scroll at 390px** on any mockup, and the plain-text pictures fit at 320px.
- **Print** drops the chrome, keeps the article and its pictures.

## 8. The screens, and a self-review

| Mockup | What it is for | What I would still improve |
|---|---|---|
| `index.html` (front, summit mode, Tue 10 Nov 11:52) | the present first: live strip, search, the lead, Now and next, latest, Portugal, companies on stage today, tonight's events, our question, interviews | the lead and three latest are the curator's story ideas (marked ◇), as only one article exists; a pre-summit version (countdown, "this week") needs the same treatment; the rail is long on a phone, so cap it at five and "All 70" |
| `article.html` | the real first article: byline, signed, In short, contents, every picture fitting a phone, the meter line, corrections | pictures at 9.7px on a 390px phone are legible but small: Enlarge helps; a long-press zoom or a landscape hint would help more |
| `company.html` (Replit) | the record with its sources, and navigators: sessions, people, same field, fields, plus the small graph | "Same field" should rank by shared sessions or stage, not alphabetically; the graph should be clickable |
| `person.html` (Michele Catasta) | only what is public and professional, the sessions, who shares a stage | a "this is me" correction route needs a real form or address |
| `topic.html` (Developer tools) | every company in a field, filterable, with the field's sessions by day | the filters are drawn, not wired; sort by "on stage soonest" |
| `events.html` | Web Summit's programme beside the events around it, by day, filterable; the past folds away (this one works: all 210 items are in the file) | a "my agenda" (save a session) once the vault exists; a map link per venue |
| `riskmandate.html` | what "Powered by RiskMandate" means, RiskMandate in its own words, the lens we borrow | the lockup loads from riskmandate.ai (decision 5) |
| `about.html` | the masthead box of editors, independence, our interest, rules, corrections, our own agent's reach/mandate/gap | the KPIs from brief 2 belong here once the counts exist |
| `chat.html` | the right-hand chat pane: the reader's own OpenRouter key, each tool call shown as it runs, the answer with sources | key setup (first open) is not drawn; it should follow graphs.sgit.ai's panel (provider tabs, key, model) |
| `search.html`, `search-instant.html` | results mixed by kind, best first, the matching line highlighted; the instant dropdown grouped by kind with keyboard hints | People results need a people index; a "did you mean" for spelling |
| `graph.html` | the explorer: filters on top, a full-width canvas, the selection's panel with its connections and a path | a real explorer needs a live layout (pan, zoom, drag), label collision handling and a "path between two nodes" tool |
| `account.html`, `topup.html` | the reading credit: balance, what was read, how it works; a one-amount top-up in three steps | the price per page and the payment provider are not decided (decision 8) |
| `vault.html` | sign in with a passkey, carry reading between devices, after newsroom.sgit.ai's pane | the Keys and Reading tabs are not drawn |
| `dropin-*` shots | today's built site with `site.css` swapped in: it works on the current markup (no overflow at 390px) | the shell still says "Web Summit Newsroom": the new shell markup above is what makes it ours |

## 9. What Dinis needs to decide

1. **The name.** "Web Summit Newsroom" reads as Web Summit's own. Proposed: *The Lisbon Wire* (a quick web search found no newspaper of that name; not a trademark search). Alternatives: *SGit Newsroom, Lisbon*, or a name of his choosing. It is one string.
2. **"Independent".** Today the site says "Not independent coverage: we also work on RiskMandate." The new line is "Independent. Not affiliated with Web Summit." beside "Powered by RiskMandate" and the disclosure, and the about page says "independent of Web Summit, not of RiskMandate". Is that wording right?
3. **Navigation.** Proposed: Now, Agenda, News, Companies, People, Portugal, About (brief 6 had Latest, Companies, The summit, Portugal, Interviews, About; Interviews would sit under News until they exist).
4. **The editors' box.** Dinis Cruz, Editor-in-chief; Indi, Editor (what we publish and how it reads); Vicky, Editor (research and the programme), after brief 4's proposal; first names only, as the team writes them.
5. **RiskMandate's lockup** on our RiskMandate page: loaded from riskmandate.ai as published (as now), copied into `assets/` with RiskMandate's say-so, or text only. The masthead uses text only either way.
6. **A third face**, IBM Plex Sans (45 KB, OFL), for the interface.
7. **The colour**: azulejo cobalt instead of today's teal, which sits near Web Summit's.
8. **The meter**: the price per page, and the card provider for top-ups (brief 7).
9. **The chat**: the default model (the mockup shows graphs.sgit.ai's default, `anthropic/claude-sonnet-5`), and whether it answers only from this site.
