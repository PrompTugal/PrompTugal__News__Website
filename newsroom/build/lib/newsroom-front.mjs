// /newsroom/, the journalists' front page (cl-6.designer's spec d, 28 Nov 2026; Dinis's home-page review; cl-6.dev@PrompTugal.dinis): one sentence, five cards, a rail of counts. Public and plain: never what waits on Dinis,
// no id, session link, money, key or private name, nothing from /admin/ (the status page's public mode is the model). Words: assets/newsroom/front-words.json; markup: assets/newsroom/front.tmpl; values: the published articles,
// the status snapshot (assets/newsroom/status-snapshot.json), newsroom/versions.json. Every value goes through esc() or the cell().
import fs from 'node:fs'
import path from 'node:path'
import { esc } from './markdown.mjs'
import { plain } from './agent-text.mjs'

const cell = s => plain(s).replace(/\*/g, '∗')
const T = fs.readFileSync(new URL('../../../assets/newsroom/front.tmpl', import.meta.url), 'utf8')
const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
const put = (t, v) => t.replace(/\{\{([a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
const fill = (s, v) => String(s).replace(/\{([a-z_]+)\}/g, (m, k) => v[k] ?? '')
const E = s => esc(cell(s))
const rd = (ctx, f) => { try { return ctx.readJSON(f) } catch { return null } }
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const day = s => { const m = /^(\d{4})-(\d\d)-(\d\d)/.exec(String(s || '')); return m ? `${+m[3]} ${MON[+m[2] - 1]} ${m[1]}` : '' }
// the changes a reader may see (cl-6.security, 28 Nov): only this site's own team's releases (an allow-list on who made them), never a merge, never a line that carries what the page says it never shows
// (what waits on Dinis, money, an address, a session, a key, a token, a secret, admin material); the routine lines of release.sh are left out too
const OWN = /^cl-6\.[a-z][a-z.]*@PrompTugal\.dinis$/
const NEVER = /Dinis|waits on|[£€$]|@|session|key|token|secret|admin\//i
const ROUTINE = /snapshot brought up to date|derived data brought up to date|team's days brought up to date|translation memory|pt-PT memory|reading of |refresh readings/i
export function publicChanges(V) {
    return (Array.isArray(V) ? V : []).filter(v => { const text = String(v && v.what || '').replace(/^[^:]*: /, '')
        return v && v.version && OWN.test(String(v.by || '')) && !/^Merge /.test(text) && !NEVER.test(text) && !ROUTINE.test(text) }).slice(0, 8)
}

// the articles, read from content/articles/*.md front matter (the page list is not built yet when this page is): the front page's lead and top first, then the newest; status draft or published, signed where a .sig is committed
function articles(ctx) {
    const dir = path.join(ctx.ROOT, 'content/articles'), fm = (h, k) => { const m = new RegExp(`^${k}:\\s*(.*)$`, 'm').exec(h); return m ? m[1].trim().replace(/^["']|["']$/g, '') : '' }
    const all = fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => { const h = (/^---\n([\s\S]*?)\n---/.exec(fs.readFileSync(path.join(dir, f), 'utf8')) || [])[1] || '', slug = f.replace(/\.md$/, '')
        return { slug, title: fm(h, 'title'), date: fm(h, 'date'), status: fm(h, 'status'), signed: fs.existsSync(path.join(ctx.ROOT, 'articles', `${slug}.md.sig`)) } }).filter(a => a.title && /^\d{4}-\d\d-\d\d$/.test(a.date))
    const FP = rd(ctx, 'desks/correspondent/front-page.json') || {}, picks = [FP.lead && FP.lead.article, ...((FP.top || []).map(t => t && t.article))].filter(Boolean), by = new Map(all.map(a => [a.slug, a]))
    const first = picks.map(x => by.get(x)).filter(a => a && a.status === 'published'), seen = new Set(first.map(a => a.slug))
    return [...first, ...all.filter(a => !seen.has(a.slug)).sort((x, y) => y.date.localeCompare(x.date) || x.slug.localeCompare(y.slug))]
}

export function frontMd(ctx, b, nav) {
    const W = ctx.readJSON('assets/newsroom/front-words.json'), S = rd(ctx, 'assets/newsroom/status-snapshot.json') || {}, V = rd(ctx, 'newsroom/versions.json') || []
    const root = h => /^https?:/.test(h) ? h : b.h(h), md = h => /^https?:/.test(h) ? h : b.h(h).replace(/index\.html(#|$)/, 'index.md$1').replace(/\.html(#|$)/, '.md$1')
    const link = (href, label, ext) => put(item(ext ? 'ext' : 'a'), { href: esc(root(href)), label: esc(label) })
    // 1. what we are writing now: the published stories in the front page's order, with where each stands
    const ALL = articles(ctx).filter(a => a.status === 'published'), arts = ALL.slice(0, 8), artHref = a => `articles/${a.slug}.html`, wordOf = a => a.signed ? W.w_signed : W.w_published
    const writing = arts.length ? put(item('ul'), { items: arts.map(a => put(item('liw'), { link: link(artHref(a), cell(a.title)), note: esc(`${day(a.date)} · ${wordOf(a)}`) })).join('') }) : put(item('p'), { text: esc(W.w_none) })
    const writingMd = arts.map(a => `- [${cell(a.title)}](${md(artHref(a))}), ${day(a.date)}, ${wordOf(a)}`).join('\n') || W.w_none
    // 2. where the facts come from: the data sources and their freshness, a page each on data.promptugal.news
    const D = S.data && Array.isArray(S.data.datasets) ? S.data.datasets : []
    const nF = D.filter(d => d.freshness === 'fresh').length, nP = D.filter(d => /problem|stale|late/.test(d.freshness || '')).length
    const src = D.filter(d => /^[a-z0-9-]{2,60}$/.test(String(d.id || ''))).sort((x, y) => (x.freshness === 'fresh') - (y.freshness === 'fresh') || String(x.id).localeCompare(String(y.id))).slice(0, 12)
    const facts = put(item('p'), { text: esc(fill(W.facts_line, { n: D.length, f: nF, p: nP })) }) + put(item('ul'), { items: src.map(d => put(item('liw'), { link: link(`https://data.promptugal.news/sources/${d.id}/`, cell(d.title || d.id), true), note: E(d.freshness) })).join('') }) +
        put(item('p'), { text: `${link('newsroom/status/index.html#data', W.facts_all)} · ${link('https://data.promptugal.news/status/', W.facts_live, true)}` })
    const factsMd = `${fill(W.facts_line, { n: D.length, f: nF, p: nP })}\n\n${src.map(d => `- [${cell(d.title || d.id)}](https://data.promptugal.news/sources/${d.id}/): ${cell(d.freshness)}`).join('\n')}\n\n[${W.facts_all}](${md('newsroom/status/index.html#data')})`
    // 3. corrections and changes: the releases, newest first, without the routine hook lines
    const rel = publicChanges(V)
    const changes = put(item('p'), { text: esc(W.changes_note) }) + put(item('ul'), { items: rel.map(v => put(item('lir'), { v: E(v.version), date: esc(day(v.date)), what: E(String(v.what || '').replace(/^[^:]*: /, '').slice(0, 160)) })).join('') }) + put(item('p'), { text: link('newsroom/versions.html', W.changes_all) })
    const changesMd = `${W.changes_note}\n\n${rel.map(v => `- ${cell(v.version)}, ${day(v.date)}: ${cell(String(v.what || '').replace(/^[^:]*: /, '').slice(0, 160))}`).join('\n')}`
    // 4. who and what
    const nA = S.agents && Array.isArray(S.agents.items) ? S.agents.items.length : 0
    const who = put(item('p'), { text: esc(fill(W.who_line, { n: nA })) }) + put(item('ul'), { items: [['newsroom/agents/index.html', W.who_agents], ['newsroom/status/index.html', W.who_status], ['newsroom/record/index.html', W.who_record], ['articles/index.html', W.who_articles]].map(([h, l]) => put(item('li'), { text: link(h, l) })).join('') })
    const whoMd = `${fill(W.who_line, { n: nA })}\n\n- [${W.who_agents}](${md('newsroom/agents/index.html')})\n- [${W.who_status}](${md('newsroom/status/index.html')})\n- [${W.who_record}](${md('newsroom/record/index.html')})\n- [${W.who_articles}](${md('articles/index.html')})`
    // 5. for the press: the brand's files (served), the licence, and the contact only where one is published (none)
    const press = put(item('ul'), { items: [['assets/brand/promptugal-wordmark-light.svg', W.press_logo], ['assets/brand/mark.svg', W.press_mark], ['design/brand/Promptugal-Brand-Guide.pdf', W.press_guide]].map(([h, l]) => put(item('li'), { text: link(h, l) })).join('') }) + put(item('p'), { text: esc(W.press_licence) }) + put(item('p'), { text: esc(W.press_contact) })
    const pressMd = `- [${W.press_logo}](${md('assets/brand/promptugal-wordmark-light.svg')})\n- [${W.press_mark}](${md('assets/brand/mark.svg')})\n- [${W.press_guide}](${md('design/brand/Promptugal-Brand-Guide.pdf')})\n\n${W.press_licence}\n\n${W.press_contact}`
    const card = (k, html, md, open) => ({ html: put(item('card'), { id: k, open: open ? ' open' : '', title: esc(W.cards[k].title), sum: esc(W.cards[k].sum), body: html }), md: `## ${W.cards[k].title} {#${k}}\n\n${md}\n` })
    const cards = [card('writing', writing, writingMd, true), card('facts', facts, factsMd), card('changes', changes, changesMd), card('who', who, whoMd), card('press', press, pressMd)]
    const nPub = ALL.filter(a => a.status === 'published').length, nSigned = ALL.filter(a => a.signed).length
    const rail = [fill(W.r_articles, { n: nPub }), fill(W.r_signed, { n: nSigned }), nA ? fill(W.r_agents, { n: nA }) : '', D.length ? fill(W.r_data, { n: D.length, f: nF }) : '', ctx.VERSION ? fill(W.r_version, { v: cell(ctx.VERSION) }) : ''].filter(Boolean)
    const top = put(item('page'), { leftrail: nav ? nav.rail : '', lede: esc(W.lede), trust: link(W.trust_href, W.trust), how: link(W.how_href, W.how), cards: cards.map(c => c.html).join(''), rail_title: esc(W.rail_title), rail: put(item('ul'), { items: rail.map(x => put(item('li'), { text: esc(x) })).join('') }) })
    return b.raw(top, `${W.lede}\n\n[${W.trust}](${md(W.trust_href)}) · [${W.how}](${md(W.how_href)})\n\n${cards.map(c => c.md).join('\n')}\n## ${W.rail_title}\n\n${rail.map(x => `- ${x}`).join('\n')}\n`)
}
