// The chrome for the features coming next: the chat pane, search (results and the instant dropdown),
// the graph explorer, the reading meter's account and top-up pages, and the vault pane.
import { esc, CO, COMPANIES, CATEGORY, AGENDA, find, start, linkOf, place, DAYS, ICON, page, speaker } from './lib.mjs'
import { companyPage } from './page-entities.mjs'
import { frontPage } from './page-front.mjs'
import { graphSvg, layout } from './svg.mjs'

const dayT = i => `${DAYS[i.date][0]} ${DAYS[i.date][1]} · ${start(i)}`

// ---------------------------------------------------------------- the chat pane, open over a company page
export function chatPage(file) {
    const s1 = find(/^Making useful intelligence/), s2 = find(/^Press conference with Replit/), s3 = find(/^What does a self-driving company/), vis = find(/^The knowledge your agents can't see/)
    const pane = `
<aside class="chat" id="chat" aria-label="Ask the newsroom">
<header class="chat-head"><div><h2>Ask the newsroom</h2><span class="scope">Answers from this site's pages only, with sources</span></div><span class="spacer"></span><button type="button" title="Model and key">${'Settings'}</button><a class="tool" href="company.html" aria-label="Close the chat" style="height:32px">Close</a></header>
<div class="chat-key"><span class="ok">● Connected</span><span>your OpenRouter key, kept in this browser</span><span class="model">anthropic/claude-sonnet-5</span><span>2,940 tokens so far</span></div>
<div class="chat-log" role="log" aria-live="polite">
<div class="msg user"><p>When can I see Replit's president speak, and what else on agents is on at the same time?</p></div>
<ol class="calls" aria-label="What the assistant did">
<li class="call"><span class="st">✓</span><code>get_page()</code><span class="out">Replit, company</span></li>
<li class="call"><span class="st">✓</span><code>search('Michele Catasta')</code><span class="out">1 person, 3 sessions</span></li>
<li class="call"><span class="st">✓</span><code>agenda.find({ person: 'Michele Catasta' })</code><span class="out">3 items</span></li>
<li class="call"><span class="st">✓</span><code>agenda.at({ day: '2026-11-10', time: '14:00', q: 'agent' })</code><span class="out">1 item</span></li>
<li class="call"><span class="st">✓</span><code>graph.focus('replit')</code><span class="out">11 nodes lit</span></li>
</ol>
<div class="msg bot"><p>Michele Catasta, Replit's president, is on three times, all on <strong>Tuesday 10 November</strong>:</p>
<ul style="margin:0 0 8px;padding-left:20px"><li><b>${start(s1)}</b> Centre Stage: <a href="${esc(linkOf(s1))}">${esc(s1.what)}</a>, with Sara Fischer of Axios.</li><li><b>${start(s2)}</b> a press conference on Stage 2.</li><li><b>${start(s3)}</b> Stage 13, AI Summit: <a href="${esc(linkOf(s3))}">${esc(s3.what)}</a></li></ul>
<p>At 14:00, on agents: <a href="${esc(linkOf(vis))}">${esc(vis.what)}</a>, in the Developer Lounge until 14:45. I have lit Replit up in the graph.</p>
<p class="cites">Sources: the summit's session pages, read 4 Nov by the programme desk · <a href="events.html">the agenda</a></p></div>
<div class="msg user"><p>Which other developer tools companies speak on Stage 10?</p></div>
<ol class="calls" aria-label="What the assistant is doing">
<li class="call"><span class="st">✓</span><code>topic.companies('devtools')</code><span class="out">18 companies</span></li>
<li class="call running"><span class="st">◌</span><code>agenda.find({ stage: 'Stage 10', companies: [18] })</code><span class="out">running</span></li>
</ol>
</div>
<form class="chat-input" onsubmit="return false"><label class="visually-hidden" for="cm">Your question</label><textarea id="cm" rows="1" placeholder="Ask about the summit"></textarea><button type="submit" aria-label="Send">${ICON.send}</button></form>
<p class="chat-foot">You bring the key and pay your provider for each answer; we never see it. The assistant's tool calls show above as they happen.</p>
</aside>`
    return companyPage('chat.html')
        .replace('<body class="">', '<body class="chat-open">')
        .replace('<footer>', pane + '\n<footer>')
        .replace(/<a class="ask-fab"[^]*?<\/a>/, '')
        .replace(/<p class="mock">[^]*?<\/p>/, '<p class="mock"><b>Mockup</b> · the right-hand chat pane, open over a company page. The reader brings their own OpenRouter key (kept in their browser); each tool call shows as it happens, then the answer with its sources. The agenda facts in the answer are real. On a phone the pane is a full-screen sheet.</p>')
}

// ---------------------------------------------------------------- search results for "security"
export function searchPage(file) {
    const sec = COMPANIES.filter(c => c.category === 'security')
    const sess = AGENDA.items.filter(i => /secur/i.test(i.what))
    const hi = s => esc(s).replace(/(secur\w*)/gi, '<mark>$1</mark>')
    const co = id => { const c = CO[id]; return `<li class="res"><span class="r-kind">Company · ${esc(CATEGORY[c.category])}</span><br><a class="r-title" href="company.html">${esc(c.name)}</a><p class="r-snip">${hi(c.what)}</p><p class="r-meta">${esc(c.country)} · ${esc(c.attending_as.split(';')[0])}</p></li>` }
    const se = i => `<li class="res"><span class="r-kind">Session · ${dayT(i)}</span><br><a class="r-title" href="${esc(linkOf(i))}">${hi(i.what)}</a>${i.speakers ? `<p class="r-snip">${esc(i.speakers.map(s => { const p = speaker(s); return `${p.name}, ${p.org}` }).join(' · '))}</p>` : ''}<p class="r-meta">${esc(place(i.where))}</p></li>`
    const list = [
        `<li class="res"><span class="r-kind">Field</span><br><a class="r-title" href="topic.html"><mark>Security</mark></a><p class="r-snip">30 companies we follow at the summit, from identity to email and fraud.</p></li>`,
        co('1password'), se(sess[0]), co('cloudflare'), se(sess[1]), co('crowdstrike'), se(sess.find(i => /^\(A\)Identity/.test(i.what))), co('delinea'),
    ].join('')
    const body = `
<div style="max-width:880px">
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / Search</nav>
<h1 class="visually-hidden">Search</h1>
<form class="search" role="search"><label class="visually-hidden" for="q">Search the newsroom</label>${ICON.search.replace('<svg', '<svg class="s-icon"')}<input id="q" type="search" value="security"><button>Search</button></form>
<div class="seg" role="tablist" aria-label="Kind"><a role="tab" aria-selected="true" href="#"><b>All</b>${30 + sess.length + 1}</a><a role="tab" aria-selected="false" href="#"><b>Companies</b>30</a><a role="tab" aria-selected="false" href="#"><b>Sessions</b>${sess.length}</a><a role="tab" aria-selected="false" href="#"><b>Fields</b>1</a><a role="tab" aria-selected="false" href="#"><b>People</b>0</a><a role="tab" aria-selected="false" href="#"><b>News</b>0</a></div>
<div class="filters" role="group" aria-label="Day"><span class="label">Day</span><button class="chip" aria-pressed="true">Any day</button><button class="chip" aria-pressed="false">Tue 10</button><button class="chip" aria-pressed="false">Wed 11</button><button class="chip" aria-pressed="false">Thu 12</button></div>
<p class="count-line">${30 + sess.length + 1} results for <b>security</b>, best first. Search runs in your browser over this site's own index: nothing you type leaves it.</p>
<ol class="results">${list}</ol>
<p style="margin-top:16px"><a class="btn quiet" href="#">Show 34 more</a> <a class="btn quiet" href="chat.html">${ICON.ask.replace('<svg', '<svg width="18" height="18"')}Ask about "security"</a></p>
</div>`
    return page({ file, title: 'Search: security', body, mock: 'the search results page, for "security": fields, companies and sessions mixed, best first, each with the line that matched. Real data.' })
}

// ---------------------------------------------------------------- the instant dropdown, over the front page
export function searchInstantPage(file) {
    const s1 = find(/^Making useful intelligence/), s2 = find(/^Press conference with Replit/), s3 = find(/^What does a self-driving company/)
    const pop = `<div class="search-pop" role="listbox" id="sp" aria-label="Suggestions">
<div class="sp-group"><h4>Companies</h4><a class="sp-item" role="option" aria-selected="true" href="company.html"><span class="t1"><mark>Rep</mark>lit</span><span class="t2">Developer tools · United States · on stage today</span><span class="k tag">Company</span></a></div>
<div class="sp-group"><h4>People</h4><a class="sp-item" role="option" href="person.html"><span class="t1">Michele Catasta</span><span class="t2">President, <mark>Rep</mark>lit</span><span class="k tag">Person</span></a></div>
<div class="sp-group"><h4>Sessions</h4>${[s1, s2, s3].map(i => `<a class="sp-item" role="option" href="${esc(linkOf(i))}"><span class="t1">${esc(i.what.replace(/Replit/, '\u0001'))}</span><span class="t2">${dayT(i)} · ${esc(place(i.where).replace(/ \(.*\)$/, ''))}${/Replit/.test(i.what) ? '' : ' · Michele Catasta, <mark>Rep</mark>lit'}</span><span class="k tag">${i.kind === 'announcement' ? 'Press' : 'Session'}</span></a>`).join('').replace(/\u0001/g, '<mark>Rep</mark>lit')}</div>
<div class="sp-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move · <kbd>Enter</kbd> open · <kbd>Esc</kbd> close</span><a href="search.html">All results for "rep"</a></div>
</div>`
    let html = frontPage('search-instant.html')
    html = html.replace(/<input id="q"[^>]*>/, '<input id="q" type="search" name="q" value="rep" role="combobox" aria-expanded="true" aria-controls="sp" aria-autocomplete="list" autocomplete="off" autofocus>')
        .replace('<button>Search</button></form>', '<button>Search</button>' + pop + '</form>')
        .replace(/<p class="mock">[^]*?<\/p>/, '<p class="mock"><b>Mockup</b> · the instant search dropdown: three letters typed, results grouped by kind, the first one selected, the keys shown. It opens under every search box, including the one behind the Search button in the top bar.</p>')
    return html
}

// ---------------------------------------------------------------- the graph explorer
export function graphPage(file) {
    const cos = ['replit', 'mastra', 'temporal', 'prisma', 'jetbrains', 'launchdarkly', 'neo4j', 'directus', 'testmu-ai', 'cloudflare', 'delinea', '1password', 'feedzai', 'crowdstrike', 'exa', 'emergence-ai', 'manus-ai', 'cisco-outshift']
    const topicOf = { devtools: 'Developer tools', security: 'Security', 'ai-agents': 'AI agents' }
    const nodes = [], edges = []
    const add = n => { if (!nodes.find(x => x.id === n.id)) nodes.push(n) }
    Object.entries(topicOf).forEach(([k, v]) => add({ id: 't-' + k, kind: 'topic', label: v, sub: COMPANIES.filter(c => c.category === k).length + ' companies' }))
    for (const id of cos) { add({ id, kind: 'co', label: CO[id].name.replace(/ \(.*\)$/, '') }); edges.push([id, 't-' + CO[id].category, 0, 110]) }
    const sess = [
        [/^Making useful intelligence/, 'replit'], [/^Press conference with Replit/, 'replit'], [/^What does a self-driving company/, 'replit'],
        [/^The agentic internet/, 'cloudflare'], [/^Who holds the kill switch/, 'launchdarkly'], [/^Give me a brake/, 'launchdarkly'], [/^Taming the agent swarm/, 'jetbrains'],
        [/^Why your AI agents don/, 'neo4j'], [/^Who let the agent in/, 'feedzai'], [/^The best offense/, 'crowdstrike'], [/^Don’t feed/, 'directus'], [/^When AI verifies AI/, 'testmu-ai'],
        [/^Trust issues/, 'delinea'], [/^Rebuilding open source with AI/, 'prisma'],
    ]
    const stageShort = w => place(w).replace(/ \(.*\)$/, '')
    for (const [re, co] of sess) {
        const i = find(re); if (!i) continue
        const sid = 's-' + i.what.slice(0, 18)
        add({ id: sid, kind: 'session', dot: true, label: i.what.length > 26 ? i.what.slice(0, 24).trim() + '…' : i.what, sub: dayT(i) })
        const sp = (i.speakers || []).map(speaker).find(p => p.org && CO[co].name.includes(p.org.split(' ')[0])) || (i.speakers ? speaker(i.speakers[0]) : null)
        if (sp) { const pid = 'p-' + sp.name; add({ id: pid, kind: 'person', label: sp.name }); edges.push([pid, co, 1, 60]); edges.push([pid, sid, 0, 70]) } else edges.push([co, sid, 0, 80])
        const st = stageShort(i.where); add({ id: 'pl-' + st, kind: 'place', dot: true, label: st }); edges.push([sid, 'pl-' + st, 0, 90])
    }
    layout(nodes, edges, { w: 1000, h: 700, iters: 700, seed: 11 })
    // keep the selection's own neighbourhood legible: Michele Catasta's three sessions stacked beside him
    { const mc = nodes.find(n => n.id === 'p-Michele Catasta'), rs = nodes.filter(n => n.kind === 'session' && edges.some(([a, b]) => a === 'p-Michele Catasta' && b === n.id))
      rs.forEach((n, j) => { n.x = Math.min(mc.x + 70, 760); n.y = mc.y - 40 + j * 46 }) }
    const focus = new Set(['replit'])
    edges.forEach(([a, b]) => { if (a === 'replit' || b === 'replit') { focus.add(a); focus.add(b) } })
    edges.forEach(([a, b]) => { if (focus.has(a) && a.startsWith('p-') || focus.has(b) && b.startsWith('p-')) { focus.add(a); focus.add(b) } })
    nodes.forEach(n => { if (n.id === 'replit') n.focus = true })
    let svg = graphSvg({ w: 1000, h: 700, nodes, edges, title: 'The newsroom\'s graph: 18 companies, their people, sessions, stages and fields, with Replit selected' })
    // dim what is not next to the selection
    svg = svg.replace(/<line class="g-edge([^"]*)" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"\/>/g, (m, c, x1, y1, x2, y2) => {
        const e = edges.find(([a, b]) => { const A = nodes.find(n => n.id === a), B = nodes.find(n => n.id === b); return A.x.toFixed(1) === x1 && A.y.toFixed(1) === y1 && B.x.toFixed(1) === x2 && B.y.toFixed(1) === y2 })
        return e && focus.has(e[0]) && focus.has(e[1]) ? `<line class="g-edge strong" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` : `<line class="g-edge dim" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`
    })
    let k = 0
    svg = svg.replace(/<g class="g-node ([^"]*)">([^]*?)<\/g>/g, (m, c, inner) => { const n = nodes[k++]; const on = focus.has(n.id)
        if (!on && !['co', 'topic'].includes(n.kind)) inner = inner.replace(/<text[^]*?<\/text>/g, '')
        if (!on && n.kind === 'topic') inner = inner.replace(/<text class="sub"[^]*?<\/text>/g, '')
        return `<g class="g-node ${c}${on ? '' : ' dim'}" tabindex="0">${inner}</g>` })
    const cnt = kind => nodes.filter(n => n.kind === kind).length
    const r = CO.replit
    const body = `
<h1 class="visually-hidden">The graph</h1>
<div class="gx">
<div class="gx-bar">
<form class="search" role="search" onsubmit="return false"><label class="visually-hidden" for="gq">Find in the graph</label>${ICON.search.replace('<svg', '<svg class="s-icon"')}<input id="gq" type="search" placeholder="Find a company, person, session" value="Replit"><button>Find</button></form>
<div class="filters" role="group" aria-label="Show" style="margin:0;padding:0"><button class="chip" aria-pressed="true">Companies <span class="n">${cnt('co')}</span></button><button class="chip" aria-pressed="true">People <span class="n">${cnt('person')}</span></button><button class="chip" aria-pressed="true">Sessions <span class="n">${cnt('session')}</span></button><button class="chip" aria-pressed="true">Stages <span class="n">${cnt('place')}</span></button><button class="chip" aria-pressed="true">Fields <span class="n">${cnt('topic')}</span></button></div>
<div class="filters" role="group" aria-label="Day" style="margin:0;padding:0"><span class="label">Day</span><button class="chip" aria-pressed="true">All</button><button class="chip" aria-pressed="false">Tue 10</button><button class="chip" aria-pressed="false">Wed 11</button><button class="chip" aria-pressed="false">Thu 12</button></div>
</div>
<div class="gx-canvas">${svg}<div class="gx-zoom"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button><button aria-label="Fit">⤢</button></div><span class="gx-hint">Drag to move · pinch or scroll to zoom · Enter on a node to select it</span></div>
<aside class="gx-side" aria-label="Selected: Replit">
<p class="kicker">Company · Developer tools</p>
<h2 style="font:600 28px/1.1 var(--serif);text-transform:none;letter-spacing:-.01em;border:0;padding:0;margin:0 0 6px">Replit</h2>
<p style="margin:0 0 12px;font-size:16px;line-height:1.45;color:var(--ink-2)">${esc(r.what)}</p>
<p><a class="btn primary" href="company.html">Open Replit's page</a> <a class="btn quiet" href="chat.html">Ask about it</a></p>
<h3 class="mini-h">Connections · 5</h3>
<ul class="results">
<li class="res"><span class="r-kind">Person</span><br><a class="r-title" href="person.html">Michele Catasta</a><p class="r-meta">President, Replit · 3 sessions</p></li>
<li class="res"><span class="r-kind">Field</span><br><a class="r-title" href="topic.html">Developer tools</a><p class="r-meta">18 companies</p></li>
<li class="res"><span class="r-kind">Sessions, through Michele Catasta</span><p class="r-meta" style="margin-top:4px">Tue 14:00 Centre Stage · Tue 15:00 Stage 2 · Tue 16:00 Stage 13</p></li>
</ul>
<h3 class="mini-h">A path from here</h3>
<p class="meta" style="font-size:14px">Replit → Developer tools → LaunchDarkly → Edith Harbaugh → <em>Who holds the kill switch?</em> (Thu 12, Stage 10)</p>
<p class="g-legend" style="margin-top:18px"><span><i class="l-co"></i>company</span><span><i class="l-person"></i>person</span><span><i class="l-session"></i>session</span><span><i class="l-place"></i>stage</span><span><i class="l-topic"></i>field</span></p>
</aside>
</div>`
    return page({ file, title: 'The graph', body, main: 'wide', fab: true, mock: 'the graph explorer: a full-width canvas of companies, people, sessions, stages and fields (real, from data/companies.json and the agenda; a seeded layout drawn as static SVG), filters on top, the selection\'s panel on the right (below the canvas on a phone).', head: '.frame:has(.gx){max-width:none;padding:0 0 24px} .gx-canvas svg .dim{opacity:.22}' })
}

// ---------------------------------------------------------------- the reading meter: account, top-up, vault
const accountBody = () => `
<div style="max-width:var(--measure);margin:0 auto">
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / Your reading credit</nav>
<h1>Your reading credit</h1>
<p class="lead">Every page has a price of a few pence, and you pay for the share of it you read. It never blocks a page, and your balance and history stay in this browser.</p>
<div class="balance-card"><div><p class="label">Balance</p><p class="amount" style="margin:8px 0 6px">£5.00</p><p class="sub" style="margin:0">3 pages opened in this browser · nothing charged yet</p></div><div class="actions"><a class="btn primary" href="topup.html">Top up £5.00</a><a class="btn quiet" href="vault.html">Carry it to another device</a></div></div>
<div class="body">
<h2 id="history">What you have read</h2>
<div class="table"><table class="ledger"><thead><tr><th>Page</th><th class="num">Read</th><th class="num">Charged</th></tr></thead><tbody>
<tr><td><a href="article.html">The newsroom four days out, in pictures</a><br><span class="meta">Tue 10 Nov, 11:40</span></td><td class="num">38%</td><td class="num">·</td></tr>
<tr><td><a href="company.html">Replit</a><br><span class="meta">Tue 10 Nov, 11:31</span></td><td class="num">100%</td><td class="num">·</td></tr>
<tr><td><a href="events.html">The agenda</a><br><span class="meta">Tue 10 Nov, 11:22</span></td><td class="num">64%</td><td class="num">·</td></tr>
</tbody></table></div>
<p class="meta">The price per page is not set yet: the "Charged" column fills in when it is.</p>
<h2 id="how">How it works</h2>
<ul><li><strong>You start with £5.00</strong> of credit in this browser.</li><li><strong>You pay for what you read</strong>, measured section by section on this device. Opening a page and leaving costs the minimum.</li><li><strong>It never blocks.</strong> Credit can go below zero and every page still opens.</li><li><strong>Nothing leaves this browser</strong> unless you choose: a top-up, or your vault.</li></ul>
<p><a class="btn quiet" href="#">Pause the meter</a> <a class="btn quiet" href="#">Export as JSON</a></p>
</div>
</div>`

export function accountPage(file) {
    return page({ file, title: 'Your reading credit', body: accountBody(), mock: 'the reading meter\'s account page (after newsroom.sgit.ai/account/): the balance, what was read, how it works. The chip "£5.00 credit" in the top bar opens it. The price per page waits on Dinis (brief 7).' })
}

export function topupPage(file) {
    const body = `
<div style="max-width:30em;margin:0 auto">
<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="account.html">Your reading credit</a> / Top up</nav>
<h1>Top up £5.00</h1>
<p class="lead">Pay by card on the payment provider's own page, then come back here with £5.00 more to read with.</p>
<ol class="steps"><li class="done"><strong>Your balance now</strong><br><span class="meta">£5.00, in this browser</span></li><li><strong>Pay £5.00 by card</strong><br><span class="meta">On the payment provider's page. We never see your card.</span></li><li><strong>Come back, with £10.00</strong><br><span class="meta">The receipt is kept in this browser, and in your vault if you have one.</span></li></ol>
<p><a class="btn primary" href="#" style="width:100%">Continue to pay £5.00</a></p>
<p><a class="btn quiet" href="account.html" style="width:100%">Not now</a></p>
<p class="notice">Topping up is a choice, never a wall: every page opens whatever your balance. What a top-up pays for, and who it pays, is on <a href="about.html">the about page</a>.</p>
</div>`
    return page({ file, title: 'Top up', body, mock: 'the top-up page: one amount, three plain steps, the card handled on the provider\'s page. The provider and what a top-up funds are for Dinis to confirm.' })
}

export function vaultPage(file) {
    const pane = `
<aside class="pane" aria-label="Your vault">
<header class="pane-head"><h2>Your vault</h2><span class="spacer"></span><a class="tool" href="account.html" style="height:32px">Close</a></header>
<div class="pane-tabs" role="tablist"><button role="tab" aria-selected="false">This page</button><button role="tab" aria-selected="false">Reading</button><button role="tab" aria-selected="true">Vault</button><button role="tab" aria-selected="false">Keys</button></div>
<div class="pane-body">
<h3>Carry your reading between devices</h3>
<p class="meta" style="font-size:14px">Your credit and history live in this browser. A vault is their second home: an encrypted folder only you can open, with no password and no email.</p>
<ol class="steps">
<li><strong>Sign in with a passkey</strong><br><span class="meta">Your phone or laptop unlocks it, the way it unlocks your apps.</span><p style="margin:10px 0 0"><button class="btn primary" type="button">${ICON.key.replace('<svg', '<svg width="18" height="18"')}Use a passkey</button></p></li>
<li><strong>Make your vault, once</strong><br><span class="meta">This browser makes its key; the vault keeps it, sealed to your passkey.</span></li>
<li><strong>Update it from each device</strong><br><span class="meta">One encrypted file per device; your totals are worked out from them.</span></li>
</ol>
<dl class="kv"><dt>In this browser only</dt><dd>3 pages · £5.00</dd><dt>Vault</dt><dd>not set up</dd><dt>Leaves this browser</dt><dd>only what you choose, encrypted before it goes</dd></dl>
<p class="notice" style="font-size:13.5px">This works like the reading vault on newsroom.sgit.ai, where it is a beta. Nothing about the vault is needed to read this site.</p>
</div>
</aside>`
    return page({ file, title: 'Your reading credit', body: accountBody(), after: pane, fab: false, mock: 'the login / your vault pane (after newsroom.sgit.ai\'s Vault pane): opened from "Your vault" in the dateline. A passkey, no password, no email. On a phone it is a full-screen sheet.' })
}
