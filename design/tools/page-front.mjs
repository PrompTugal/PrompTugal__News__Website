// The front page, as it would look on Tuesday 10 November 2026 at 11:52 (summit mode).
import { esc, find, items, slot, start, linkOf, place, NOW_DAY, COMPANIES, CO, CATEGORY, ICON, page } from './lib.mjs'

const IDEA = '<span class="badge-idea" title="A working title from the curator\'s story list (desks/curator), not a published article">◇ story idea</span>'

export function frontPage(file) {
    const today = items(NOW_DAY).filter(i => i.time)
    const pick = re => find(re, NOW_DAY)
    const rail = [
        pick(/^Has Europe/), pick(/^AI: your new news editor/), pick(/^The agentic internet/), pick(/^A guide to Portugal/),
        pick(/^Next generation banking/), pick(/^Press conference: RWS/), pick(/^Trust issues/), pick(/^Making useful intelligence/), pick(/^AI and the human at 300/),
    ]
    const tonight = [pick(/^AUSTRIA BUSINESS NIGHT/), pick(/^German-Brazilian/), pick(/^Night Summit: speed/), pick(/^An Evening with Elastic/), pick(/^Night Summit Downtown/)]
    const counts = Object.entries(CATEGORY).map(([k, v]) => [k, v, COMPANIES.filter(c => c.category === k).length]).filter(x => x[2]).sort((a, b) => b[2] - a[2])
    const onStage = [
        ['cloudflare', pick(/^The agentic internet/)], ['replit', pick(/^Making useful intelligence/)], ['atlassian', pick(/^AI and the human at 300/)],
        ['delinea', pick(/^Trust issues/)], ['elastic', pick(/^Dogfooding AI security/)], ['twilio', pick(/^How to break your AI phone agent/)],
    ]
    const pt = ['feedzai', 'vtex', 'meo', 'startup-portugal', 'aicep', 'sheerme', 'dig-in', 'chatplace', 'itrecruiter']
    const ptAgenda = [find(/^A guide to Portugal/), find(/^Who let the agent in/), find(/^Press conference: Road 2 Web Summit/), find(/^Portugal Tech Week Palace/)]
    const europe = pick(/^Has Europe/)

    const body = `
<h1 class="visually-hidden">${'PrompTugal.news'}: Web Summit Lisbon, now</h1>
<form class="search" role="search" action="search.html"><label class="visually-hidden" for="q">Search PrompTugal.news</label>${ICON.search.replace('<svg', '<svg class="s-icon"')}<input id="q" type="search" name="q" placeholder="Companies, people, sessions, news" autocomplete="off"><button>Search</button></form>

<div class="front-top">
<section class="a-lead" aria-labelledby="lead-h">
<article class="story lead">
<p class="kicker"><a href="topic.html">Europe</a><span class="sep">·</span>The summit</p>
<h3 id="lead-h"><a href="article.html">Europe arrives in Pavilion 4: the Commission's week at Web Summit</a></h3>
<p class="dek">A fireside chat on tech sovereignty on Centre Stage, masterclasses on AI, data spaces and supercomputer access, EU funding sessions, and three stands side by side. ${IDEA}</p>
<p class="meta">On the agenda: <time>${start(europe)}</time> <a href="${esc(linkOf(europe))}">${esc(europe.what)}</a>, with Henna Virkkunen (European Commission), Centre Stage</p>
</article>
<div class="grid g-2 under-lead">
<article class="story"><p class="kicker">Getting around</p><h3><a href="article.html">Your first day, from airport to arena</a></h3><p class="dek">Where to collect a wristband, the transport pass sold only at the airport, and Metro's extra trains on the Red and Green lines. ${IDEA}</p></article>
<article class="story"><p class="kicker">Announcements</p><h3><a href="article.html">About 200 Brazilian companies come to Lisbon for Web Summit</a></h3><p class="dek">A 324 square metre pavilion in the MEO Arena, and three days of investor meetings and debates. ${IDEA}</p></article>
</div>
</section>

<section class="a-agenda rail" aria-labelledby="nn-h">
<header class="sec-head" style="border-top:0;padding-top:0"><h2 id="nn-h">Now and next</h2><span class="note">Tue 10 · Day 1</span></header>
<div class="filters" role="group" aria-label="Show"><button class="chip" aria-pressed="true">All</button><button class="chip" aria-pressed="false">Centre Stage</button><button class="chip" aria-pressed="false">Our picks</button><button class="chip" aria-pressed="false">Around the summit</button></div>
<ol class="agenda">${rail.map(i => slot(i)).join('')}</ol>
<a class="more" href="events.html">All ${today.length} items today</a>
</section>

<section class="a-latest" id="latest" aria-labelledby="latest-h">
<header class="sec-head"><h2 id="latest-h">Latest</h2><a class="more" href="article.html">All news</a></header>
<ul class="stories">
<li><article class="story has-fig"><a class="fig" href="article.html" aria-hidden="true" tabindex="-1"><pre>+------------------------------------------------+
| The plan ...... [##########] the brief pack     |
| Agenda ........ [#########.] 210 items          |
| Companies ..... [######....] 109 profiles       |
| Articles ...... [#.........] 1 of 3             |
+------------------------------------------------+</pre></a><p class="kicker">How PrompTugal.news is made</p><h3><a href="article.html">The newsroom four days out, in pictures</a></h3><p class="dek">What is live, what the agent desks have found, what is next and what waits on a person. A status report drawn in plain text.</p><p class="meta"><time>5 Nov</time> · newsroom@web-summit.dinis · <span class="rt">4 min</span> · Signed</p></article></li>
<li><article class="story"><p class="kicker">The summit</p><h3><a href="article.html">Web Summit 2026 in numbers: 70,000 people, 10,000 startups</a></h3><p class="dek">The scale of the week, each number from its own source. ${IDEA}</p></article></li>
<li><article class="story"><p class="kicker">Announcements</p><h3><a href="article.html">Gender in Tech report: 84% see women in leadership</a></h3><p class="dek">Web Summit's seventh report, told as the report tells it. ${IDEA}</p></article></li>
</ul>
</section>
</div>

<section class="sec band-pt" id="portugal" aria-labelledby="pt-h">
<header class="sec-head"><h2 id="pt-h">Portugal</h2><a class="more" href="topic.html">The Portuguese tech scene</a></header>
<div class="grid g-8-4">
<div class="grid g-3">
<article class="story"><p class="kicker">Science</p><h3><a href="article.html">Técnico brings robots and six spin-offs to Web Summit</a></h3><p class="dek">Lisbon's engineering school at stand E272 in Pavilion 2, 10 to 12 November. ${IDEA}</p></article>
<article class="story"><p class="kicker">Startups</p><h3><a href="article.html">Road 2 Web Summit: Portugal's startups head for Lisbon</a></h3><p class="dek">The eleventh edition of the programme that brings up to 125 Portuguese startups. ${IDEA}</p></article>
<article class="story"><p class="kicker">Funding</p><h3><a href="article.html">From the PITCH stage to new markets</a></h3><p class="dek">Two past PITCH winners close rounds to grow abroad. ${IDEA}</p></article>
</div>
<div class="split">
<h3 class="mini-h">Portugal on the agenda</h3>
<ol class="agenda">${ptAgenda.map(i => slot(i, { day: true, state: false })).join('')}</ol>
<h3 class="mini-h">Portuguese companies we follow</h3>
<ul class="chips">${pt.map(id => `<li><a class="chip" href="company.html">${esc(CO[id].name.replace(/ - Portugal Trade & Invest/, ''))}</a></li>`).join('')}</ul>
</div>
</div>
</section>

<section class="sec" id="companies" aria-labelledby="co-h">
<header class="sec-head"><h2 id="co-h">Companies at the summit</h2><a class="more" href="topic.html">All 109, by field</a></header>
<div class="grid g-8-4">
<div>
<h3 class="mini-h">On stage today</h3>
<ul class="co-list cols">${onStage.map(([id, i]) => `<li class="co"><a class="co-name" href="company.html">${esc(CO[id].name)}</a><span class="co-meta">${esc(CATEGORY[CO[id].category])} · ${esc(CO[id].country)}</span><span class="on-stage"><time>${start(i)}</time> · ${esc(place(i.where).replace(/ \(.*\)$/, ''))}</span></li>`).join('')}</ul>
</div>
<div class="split">
<h3 class="mini-h">By field</h3>
<ul class="field-tiles two">${counts.map(([k, v, n]) => `<li><a href="topic.html">${esc(v === 'Governance, risk and compliance' ? 'Governance and risk' : v)}<span class="n">${n}</span></a></li>`).join('')}</ul>
</div>
</div>
</section>

<section class="sec" id="tonight" aria-labelledby="ev-h">
<header class="sec-head"><h2 id="ev-h">Tonight, around the summit</h2><a class="more" href="events.html">Every event</a></header>
<ol class="agenda cols">${tonight.map(i => slot(i, { state: false })).join('')}</ol>
</section>

<section class="sec" id="lens" aria-labelledby="lens-h">
<header class="sec-head"><h2 id="lens-h">Our question for every AI agent</h2><a class="more" href="riskmandate.html">Where it comes from</a></header>
<ol class="lens"><li><b>Reach</b>What can it actually do?</li><li><b>Mandate</b>What was it asked to do?</li><li><b>Gap</b>Who controls the difference?</li></ol>
<p class="meta">From RiskMandate: "a grant is what a credential technically permits, a mandate is what the holder is authorised and expected to do, and the gap between them is exposure nobody ever accepted" (<a href="https://riskmandate.ai/llms.txt">riskmandate.ai/llms.txt</a>, read 4 November 2026).</p>
</section>

<section class="sec" id="interviews" aria-labelledby="iv-h">
<header class="sec-head"><h2 id="iv-h">Interviews</h2></header>
<p class="empty">Our first interviews are being arranged. Each one is published only with the approval of the person interviewed.</p>
</section>
`
    return page({
        file, title: 'Now', section: 'Now', compact: false, live: true, ears: true, body,
        mock: 'the front page as it would look on <b>Tuesday 10 November at 11:52</b>, the first conference day. The agenda, the companies and the one article are real (desks/programme/agenda.json, data/companies.json). Headlines marked ◇ are working titles from the curator\'s story list (desks/curator), not published articles.',
    })
}
