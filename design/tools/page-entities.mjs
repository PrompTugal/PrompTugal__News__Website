// The company, person and topic (field) pages, with their navigators.
import { esc, CO, COMPANIES, CATEGORY, find, start, linkOf, place, DAYS, LONGDAY, slot, AGENDA, page } from './lib.mjs'
import { graphSvg } from './svg.mjs'

const short = u => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')
const srcChip = (u, d) => `<a class="chip src" href="${esc(u)}">${esc(short(u))} · read ${d}</a>`
const dayLabel = i => `${DAYS[i.date][0]} ${DAYS[i.date][1]}`
const nvSession = i => `<li><a class="nv-item" href="${esc(linkOf(i))}"><span class="nv-kind">${i.kind === 'announcement' ? 'Press conference' : 'Session'}</span><span class="nv-title">${esc(i.what)}</span><span class="nv-meta">${dayLabel(i)} · ${start(i)} · ${esc(place(i.where).replace(/ \(.*\)$/, ''))}</span><span class="nv-go" aria-hidden="true">→</span></a></li>`
const nvCo = (id, extra) => { const c = CO[id]; return `<li><a class="nv-item" href="company.html"><span class="nv-kind">${esc(CATEGORY[c.category])}</span><span class="nv-title">${esc(c.name)}</span><span class="nv-meta">${esc(extra || c.country)}</span><span class="nv-go" aria-hidden="true">→</span></a></li>` }
const nvPerson = (name, role, href = 'person.html') => `<li><a class="nv-item" href="${href}"><span class="nv-kind">Person</span><span class="nv-title">${esc(name)}</span><span class="nv-meta">${esc(role)}</span><span class="nv-go" aria-hidden="true">→</span></a></li>`
const nvTopic = (name, n) => `<li><a class="nv-item" href="topic.html"><span class="nv-kind">Field</span><span class="nv-title">${esc(name)}</span><span class="nv-meta">${n} companies we follow</span><span class="nv-go" aria-hidden="true">→</span></a></li>`

const S1 = () => find(/^Making useful intelligence/), S2 = () => find(/^Press conference with Replit/), S3 = () => find(/^What does a self-driving company/)

function replitGraph() {
    return graphSvg({
        w: 480, h: 350, title: 'Replit in the graph: its president, his three sessions, and the developer tools field',
        nodes: [
            { id: 's1', kind: 'session', x: 78, y: 28, label: 'Centre Stage', sub: 'Tue 14:00', w: 138 },
            { id: 's2', kind: 'session', x: 240, y: 28, label: 'Press, Stage 2', sub: 'Tue 15:00', w: 138 },
            { id: 's3', kind: 'session', x: 402, y: 28, label: 'Stage 13', sub: 'Tue 16:00', w: 138 },
            { id: 'sf', kind: 'person', x: 58, y: 118, label: 'Sara Fischer', sub: 'Axios' },
            { id: 'mc', kind: 'person', x: 240, y: 112, label: 'Michele Catasta', sub: 'President', labelPos: 'right' },
            { id: 'rp', kind: 'co', x: 240, y: 196, label: 'Replit', focus: true, labelPos: 'right' },
            { id: 'dt', kind: 'topic', x: 240, y: 260, label: 'Developer tools', sub: '18 companies', w: 158 },
            { id: 'ma', kind: 'co', x: 48, y: 300, label: 'Mastra' }, { id: 'te', kind: 'co', x: 160, y: 306, label: 'Temporal' },
            { id: 'pr', kind: 'co', x: 320, y: 306, label: 'Prisma' }, { id: 'jb', kind: 'co', x: 428, y: 300, label: 'JetBrains' },
        ],
        edges: [['s1', 'mc'], ['s2', 'mc'], ['s3', 'mc'], ['s1', 'sf'], ['mc', 'rp', 1], ['rp', 'dt', 1], ['dt', 'ma'], ['dt', 'te'], ['dt', 'pr'], ['dt', 'jb']],
    })
}

export function companyPage(file) {
    const c = CO.replit
    const body = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="topic.html">Companies</a> / <a href="topic.html">Developer tools</a> / Replit</nav>
<div class="grid g-8-4 co-top">
<header>
<p class="kicker"><a href="topic.html">Developer tools</a><span class="sep">·</span>United States</p>
<h1>Replit</h1>
<p class="lead">${esc(c.what)}</p>
<ul class="chips"><li><span class="chip ok">✓ Confirmed for 2026</span></li><li><span class="chip">Event partner</span></li><li><span class="chip">Speaker's company</span></li><li><span class="chip live">On Centre Stage today, 14:00</span></li></ul>
</header>
<figure class="minigraph">${replitGraph()}<figcaption><span class="g-legend"><span><i class="l-co"></i>company</span><span><i class="l-person"></i>person</span><span><i class="l-session"></i>session</span><span><i class="l-topic"></i>field</span></span><a class="more" href="graph.html">Open in the graph</a></figcaption></figure>
</div>

<nav class="navigator" aria-label="Go from Replit">
<div class="nv"><h3>At the summit<span class="n">3</span></h3><ul>${[S1(), S2(), S3()].map(nvSession).join('')}</ul></div>
<div class="nv"><h3>People<span class="n">1</span></h3><ul>${nvPerson('Michele Catasta', 'President, Replit, as Web Summit lists him')}</ul><p class="meta">Only people Web Summit lists publicly, with the role it gives them.</p></div>
<div class="nv"><h3>Same field<span class="n">17</span></h3><ul>${nvCo('mastra')}${nvCo('temporal', 'On Stage 13, Tue 10')}${nvCo('prisma', 'On Stage 10, Thu 12')}${nvCo('jetbrains', 'On Stage 10, Thu 12')}</ul><a class="more" href="topic.html">All developer tools</a></div>
<div class="nv"><h3>Fields</h3><ul>${nvTopic('Developer tools', 18)}${nvTopic('AI agents', 22)}</ul></div>
</nav>

<div class="grid g-8-4">
<div>
<section class="sec" id="facts" aria-labelledby="facts-h">
<header class="sec-head"><h2 id="facts-h">The record</h2><span class="note">Public facts only, each with its source</span></header>
<dl class="facts">
<div><dt>What they do</dt><dd>${esc(c.what)}<span class="src">Web Summit's event partners page, read 1 Nov 2026</span></dd></div>
<div><dt>Based in</dt><dd>United States<span class="src">Replit's Web Summit appearance page, read 1 Nov 2026</span></dd></div>
<div><dt>At Web Summit as</dt><dd>An event partner, and a speaker's company<span class="src">websummit.com, read 1 Nov 2026</span></dd></div>
<div><dt>Re-checked</dt><dd><span class="chip ok">✓ Summit page live</span> <span class="chip ok">✓ Website live</span><span class="src">by newsroom@web-summit.dinis, 5 Nov 2026 at 01:46 UTC</span></dd></div>
<div><dt>Website</dt><dd><a href="${esc(c.website)}">replit.com</a></dd></div>
</dl>
</section>
<section class="sec" id="question" aria-labelledby="q-h">
<header class="sec-head"><h2 id="q-h">Our question for Replit</h2><a class="more" href="riskmandate.html">Why we ask</a></header>
<ol class="lens"><li><b>Reach</b>What can Replit's agents, or its customers' agents, actually do?</li><li><b>Mandate</b>What were they authorised to do?</li><li><b>Gap</b>Who controls the difference?</li></ol>
<p class="empty">We have not asked Replit yet. When they answer, it goes here.</p>
</section>
<section class="sec" id="sources" aria-labelledby="src-h">
<header class="sec-head"><h2 id="src-h">Where this comes from</h2></header>
<ul class="chips">${c.sources.map(s => `<li>${srcChip(s.url, s.read_on.slice(8).replace(/^0/, '') + ' Nov')}</li>`).join('')}</ul>
<p class="meta">From the team's company map (web-summit.sgit.ai, data/companies.json), public facts only; the team's own notes are not published. Something wrong? <a href="about.html#corrections">Tell us</a> and we correct it here, dated.</p>
</section>
</div>
<aside class="split">
<section class="sec" aria-labelledby="art-h"><header class="sec-head"><h2 id="art-h">In our news</h2></header><p class="empty">No article names Replit yet.</p></section>
<section class="sec" aria-labelledby="day-h"><header class="sec-head"><h2 id="day-h">Replit's Tuesday</h2></header><ol class="agenda">${[S1(), S2(), S3()].map(i => slot(i, { state: false })).join('')}</ol></section>
</aside>
</div>`
    return page({ file, title: 'Replit', section: 'Companies', body, mock: 'a company page with its navigators (at the summit, people, same field, fields) and its graph, from data/companies.json and the agenda. Shown on Tuesday 10 November.', live: true })
}

export function personPage(file) {
    const sessions = [S1(), S2(), S3()]
    const g = graphSvg({
        w: 480, h: 290, title: 'Michele Catasta: his organisation and his three sessions',
        nodes: [
            { id: 'mc', kind: 'person', x: 240, y: 140, label: 'Michele Catasta', sub: 'President, Replit', focus: true, r: 13, labelPos: 'right' },
            { id: 'rp', kind: 'co', x: 240, y: 240, label: 'Replit', labelPos: 'right' },
            { id: 's1', kind: 'session', x: 78, y: 30, label: 'Centre Stage', sub: 'Tue 14:00', w: 138 },
            { id: 's2', kind: 'session', x: 240, y: 30, label: 'Press, Stage 2', sub: 'Tue 15:00', w: 138 },
            { id: 's3', kind: 'session', x: 402, y: 30, label: 'Stage 13', sub: 'Tue 16:00', w: 138 },
            { id: 'sf', kind: 'person', x: 70, y: 150, label: 'Sara Fischer', sub: 'Axios' },
        ],
        edges: [['mc', 'rp', 1], ['mc', 's1', 1], ['mc', 's2', 1], ['mc', 's3', 1], ['s1', 'sf']],
    })
    const body = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="person.html">People</a> / Michele Catasta</nav>
<div class="grid g-8-4">
<div>
<p class="kicker">Speaker · Developer tools</p>
<div class="person-head"><span class="initials" aria-hidden="true">MC</span><div><h1>Michele Catasta</h1><p class="role">President, <a href="company.html">Replit</a></p></div></div>
<p class="notice"><strong>What we publish about people:</strong> the name, role and organisation as Web Summit lists them, and their public sessions. Nothing private, no photo unless they give us one, and never contact details.</p>
<dl class="facts">
<div><dt>Role</dt><dd>President, Replit<span class="src">Web Summit's attendee page, read 1 Nov 2026</span></dd></div>
<div><dt>Also described as</dt><dd>President and Head of AI at Replit<span class="src">Lusa, 25 June 2026, as republished by aman-alliance.org, read 1 Nov 2026</span></dd></div>
<div><dt>Organisation</dt><dd><a href="company.html">Replit</a>, developer tools, United States</dd></div>
<div><dt>Sessions</dt><dd>3, all on Tuesday 10 November</dd></div>
</dl>
</div>
<figure class="minigraph">${g}<figcaption><span>His organisation, sessions, and who shares a stage with him</span><a class="more" href="graph.html">Open in the graph</a></figcaption></figure>
</div>
<nav class="navigator three" aria-label="Go from Michele Catasta">
<div class="nv"><h3>Speaking<span class="n">3</span></h3><ul>${sessions.map(nvSession).join('')}</ul></div>
<div class="nv"><h3>On stage with<span class="n">1</span></h3><ul>${nvPerson('Sara Fischer', 'Media Correspondent, Axios')}</ul><p class="meta">Making useful intelligence accessible to everyone, Centre Stage</p></div>
<div class="nv"><h3>Organisation and field</h3><ul>${nvCo('replit', 'Event partner')}${nvTopic('Developer tools', 18)}</ul></div>
</nav>
<section class="sec" aria-labelledby="ps-h"><header class="sec-head"><h2 id="ps-h">Where this comes from</h2></header>
<ul class="chips">${srcChip('https://websummit.com/attendees/lis26/61c0eea9-7ec4-408d-b94f-26d5d48845d2/michele-catasta', '1 Nov')}${srcChip('https://aman-alliance.org/Home/ContentDetail/104496', '1 Nov')}${srcChip(linkOf(S1()), '4 Nov')}</ul>
<p class="meta">Is this you, and is something wrong or missing? <a href="about.html#corrections">Tell us</a>: we correct it on this page, dated, and we leave out anything you ask us to.</p></section>`
    return page({ file, title: 'Michele Catasta', section: 'People', body, mock: 'a person page. Only what is public and professional: the name and role as Web Summit lists them, the sessions, and the sources. Real data from data/companies.json and the agenda.', live: true })
}

export function topicPage(file) {
    const dv = COMPANIES.filter(c => c.category === 'devtools').sort((a, b) => a.name.localeCompare(b.name))
    const role = c => c.attending_as.startsWith('partner') ? 'Partner' : c.attending_as.startsWith('startup') ? 'Startup' : "Speaker's company"
    const ids = ['replit', 'temporal', 'neo4j', 'directus', 'testmu-ai', 'launchdarkly', 'jetbrains', 'deque', 'prisma']
    const sess = AGENDA.items.filter(i => /Replit|Temporal|Neo4j|Directus|TestMu|LaunchDarkly|JetBrains|Deque|Prisma|Open VSX|Twilio|Elastic/.test(JSON.stringify(i)) && i.kind !== 'side-event')
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    const byDay = {}; sess.forEach(i => (byDay[i.date] = byDay[i.date] || []).push(i))
    const counts = { Partner: 0, Startup: 0, "Speaker's company": 0 }; dv.forEach(c => counts[role(c)]++)
    const body = `
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="topic.html">Companies</a> / Developer tools</nav>
<p class="kicker">Field</p>
<h1>Developer tools</h1>
<p class="lead">18 of the 109 companies we follow at the summit make tools for people who build software, and more and more for the AI agents that now build it with them.</p>
<div class="seg" role="tablist" aria-label="Fields">${[['Security', 30], ['AI agents', 22], ['Developer tools', 18], ['Governance and risk', 15], ['Portuguese startups', 8], ['Platforms', 8], ['Other', 5], ['Investors', 3]].map(([n, k]) => `<a href="topic.html" role="tab" aria-selected="${n === 'Developer tools'}"><b>${k}</b>${n}</a>`).join('')}</div>
<div class="filters" role="group" aria-label="Filter"><span class="label">Show</span><button class="chip" aria-pressed="true">All <span class="n">18</span></button>${Object.entries(counts).map(([k, v]) => `<button class="chip" aria-pressed="false">${k}s <span class="n">${v}</span></button>`).join('').replace("Speaker's companys", "Speakers' companies")}<button class="chip" aria-pressed="false">On stage <span class="n">${ids.length}</span></button></div>
<div class="grid g-8-4">
<section aria-labelledby="cos-h"><h2 id="cos-h" class="visually-hidden">The companies</h2>
<ul class="co-list cols two">${dv.map(c => `<li class="co"><a class="co-name" href="company.html">${esc(c.name)}</a><span class="co-meta">${esc(c.country)} · ${role(c)}</span><p class="co-what">${esc(c.what)}</p>${ids.includes(c.id) ? `<span class="on-stage" style="color:var(--brand)">On the agenda</span>` : ''}</li>`).join('')}</ul>
</section>
<aside class="split">
<section class="sec" aria-labelledby="ag-h"><header class="sec-head"><h2 id="ag-h">On the agenda</h2><span class="note">${sess.length} sessions</span></header>
${Object.entries(byDay).map(([d, list]) => `<h3 class="mini-h">${LONGDAY[DAYS[d][0]]} ${DAYS[d][1]}</h3><ol class="agenda">${list.map(i => slot(i, { state: false })).join('')}</ol>`).join('')}
</section>
<section class="sec" aria-labelledby="rel-h"><header class="sec-head"><h2 id="rel-h">Next to this field</h2></header><ul class="chips"><li><a class="chip topic" href="topic.html">AI agents <span class="n">22</span></a></li><li><a class="chip topic" href="topic.html">Security <span class="n">30</span></a></li><li><a class="chip topic" href="topic.html">Platforms <span class="n">8</span></a></li></ul></section>
<section class="sec"><header class="sec-head"><h2>In our news</h2></header><p class="empty">No article on this field yet.</p></section>
</aside>
</div>`
    return page({ file, title: 'Developer tools', section: 'Companies', body, mock: 'a topic (field) page: every company in the field, filterable, with the field\'s sessions by day. Real data from data/companies.json and the agenda.' })
}
