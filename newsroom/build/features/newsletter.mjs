// The daily newsletter (Dinis, 6 Nov 16:20 UTC, board/guidance/2026-11-06-the-daily-newsletter.md): a morning and an
// evening edition from Saturday 7 November, each a public page (/newsletter/<date>-morning/ and -evening/) and a short
// plain-text email with links. Subscribers, consent and sending are the Web Summit team's: nothing private here.
// dev.pages@ made the editions from data; dev@ added the authored edition, the email and the gate.
//   Load       the day pages' data and the articles (agenda.mjs, articles.mjs); an authored edition, if a writer made
//              one: content/newsletter/<YYYY-MM-DD>-<morning|evening>.md (front matter: title, date, edition,
//              summary, author, status), which takes that edition's place; the words: data/site/list-views.json
//   Extract    every summit day from FIRST up to today, two editions each
//   Transform  an edition made from data (five things to plan around, the latest articles, tomorrow), unless authored;
//              each edition's filled markdown into plain text: hooks and markers dropped, every link absolute
//   Save       the pages; api/v1/newsletter/<date>-<edition>.txt (the email); api/v1/newsletter.json (every edition,
//              its page and its email); /newsletter/ lists them all
// The gate: an authored edition's name, front matter and date agree; no contact detail in it; every email built.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { slotLine, slotList } from '../lib/present.mjs'
import { load, rank, KIND, STRIP_DAYS } from './agenda.mjs'
import { articlesOf } from './articles.mjs'
export const order = 62

const WORDS = 'data/site/list-views.json'
const W = JSON.parse(fs.readFileSync(new URL('../../../' + WORDS, import.meta.url), 'utf8')).newsletter
const byTime = (a, b) => (a.time || '').localeCompare(b.time || '')
const FIRST = '2026-11-07', DIR = 'content/newsletter/', INDEX = 'newsletter/index.html', API = 'api/v1/newsletter.json'
const NAME = /^(\d{4}-\d{2}-\d{2})-(morning|evening)\.md$/, REL = /^newsletter\/(\d{4}-\d{2}-\d{2})-(morning|evening)\/index\.html$/
const NEED = ['title', 'date', 'edition', 'summary', 'author', 'status']
const isAuthored = p => p.src && p.src.startsWith(DIR) && NAME.test(path.basename(p.src))
const editionsOf = ctx => (ctx.pages || []).filter(p => REL.test(p.rel) && p.meta?.status !== 'draft').sort((a, b) => b.rel.localeCompare(a.rel))
const emailOf = rel => `api/v1/newsletter/${rel.split('/')[1]}.txt`   // under /api/: generated, never committed

// the day's five (designer@'s check of Saturday's edition): one line per thing (a second registration desk joins the
// first line, "also at"), an event outside Lisbon says where it is, and the count is the real one (fiveCount)
const rootOf = e => String(e.what).split(/:\s|\s\(/)[0]
const fiveOf = (ctx, d) => {
    const { itemsOn } = load(ctx), rk = e => e.kind === 'registration' && d >= '2026-11-10' ? 4 : rank(e), seen = new Map(), out = []
    for (const e of [...itemsOn(d)].sort((a, b) => rk(a) - rk(b) || byTime(a, b))) {
        if (seen.has(rootOf(e))) { seen.get(rootOf(e)).also.push(e); continue }
        if (out.length === 5) continue
        const x = { e, also: [] }; seen.set(rootOf(e), x); out.push(x)
    }
    return out.sort((a, b) => byTime(a.e, b.e))
}
const placeName = (ctx, e) => (ctx.store.places || []).find(p => p.id === String(e.place || '').replace(/^place:/, ''))?.name || ''
const five = (ctx, rel, d) => slotList(fiveOf(ctx, d).map(({ e, also }) => slotLine(ctx, rel, e, { day: false, extra: [KIND[e.kind] || e.kind,
    ...(/algarve/i.test(e.where || '') ? ['in the Algarve, not Lisbon'] : []),
    ...also.map(a => `also at ${placeName(ctx, a) || a.where || ''}${a.start ? ', ' + a.start : ''}`)] })))
const NUM = ['No', 'One', 'Two', 'Three', 'Four', 'Five']
const fiveText = (ctx, d) => W.there_text.replace(/^Five things/, `${NUM[fiveOf(ctx, d).length]} thing${fiveOf(ctx, d).length === 1 ? '' : 's'}`)
const dayLink = (ctx, rel, d) => `[${W.day_link}](${ctx.link(rel, `days/${d}/index.html`)})`
const next = d => STRIP_DAYS[STRIP_DAYS.indexOf(d) + 1]
const mailLink = (ctx, rel) => `[${W.email_link}](${ctx.link(rel, emailOf(rel))})`

function edition(ctx, d, kind) {
    const { DAY } = load(ctx), rel = `newsletter/${d}-${kind}/index.html`
    const md = kind === 'morning'
        ? `## ${W.there_head}\n\n${fiveText(ctx, d)}\n\n${five(ctx, rel, d)}\n\n${dayLink(ctx, rel, d)}\n\n## ${W.remote_head}\n\n${W.remote_text}\n\n<!-- newsletter:latest -->`
        : `## ${W.today_head}\n\n<!-- newsletter:today -->\n\n## ${W.latest_head}\n\n<!-- newsletter:latest -->\n\n` +
          (next(d) ? `## ${W.next_head}\n\n${W.next_text}\n\n${five(ctx, rel, next(d))}\n\n${dayLink(ctx, rel, next(d))}\n\n` : '')
    return {
        src: 'data/events/', rel, type: 'site', date: d, section: 'news',
        crumbs: [[INDEX, W.index_title], [null, `${DAY(d)}, ${W[kind].toLowerCase()}`]],
        title: `${W[kind]} edition: ${DAY(d)}`, summary: W[kind + '_summary'],
        md: `${md}\n\n${W.by} ${mailLink(ctx, rel)}.`,
    }
}

export function pages(ctx) {
    const { TODAY } = load(ctx)
    const authored = new Set(ctx.content.filter(isAuthored).map(p => path.basename(p.src, '.md')))
    // an edition exists once its time has come (designer@'s P6: the evening one was listed in the morning): 07:30 and
    // 19:30 Lisbon (UTC in November), the times the guidance gives; the build at or after that time makes it
    const due = (d, k) => Date.parse(`${d}T${k === 'morning' ? '07:30' : '19:30'}:00Z`) <= Date.now()
    const eds = STRIP_DAYS.filter(d => d >= FIRST && d <= TODAY).flatMap(d => ['morning', 'evening'].filter(k => !authored.has(`${d}-${k}`) && due(d, k)).map(k => edition(ctx, d, k)))
    return [{
        src: WORDS, rel: INDEX, type: 'site', date: TODAY, section: 'news',
        crumbs: [[null, W.index_title]], title: W.index_title, summary: W.index_summary,
        md: `${W.index_intro}\n\n<!-- newsletter:list -->\n\n${W.as_data} <!-- newsletter:api -->`,
    }, ...eds]
}

export function decorate(p, ctx) {
    if (!isAuthored(p)) return
    const [, d, kind] = path.basename(p.src).match(NAME)
    p.type = 'site'; p.date = d; p.section = 'news'
    p.crumbs = [[INDEX, W.index_title], [null, `${ctx.DAY(d)}, ${W[kind].toLowerCase()}`]]
    p.md = `${p.md}\n\n${W.by} ${mailLink(ctx, p.rel)}.`
}

// the article lines are filled once the articles exist (the pages above are made before them)
const short = t => t.length > 110 ? t.slice(0, 109).replace(/\s+\S*$/, '') + '…' : t
const line = (ctx, rel, a) => `- [${a.meta.title}](${ctx.link(rel, a.rel)}). ${short(a.meta.summary.replace(/[*`]/g, '').split(/(?<=[.!?])\s/)[0])}`
export const fill = {
    // three stories, one short line each, then every article (designer@'s E7: three is read, five is skipped)
    'newsletter:latest': (page, ctx) => articlesOf(ctx).slice(0, 3).map((a, i) => line(ctx, page.rel, a).replace(/^- /, `${i + 1}. `)).join('\n') + `\n\n[Every article](${ctx.link(page.rel, 'articles/index.html')})`,
    'newsletter:today': (page, ctx) => {
        const d = page.rel.match(/(\d{4}-\d{2}-\d{2})/)[1]
        return articlesOf(ctx).filter(a => a.meta.date === d).map(a => line(ctx, page.rel, a)).join('\n') || W.today_none
    },
    'newsletter:list': (page, ctx) => editionsOf(ctx).map(p => `- [${p.title}](${ctx.link(page.rel, p.rel)})`).join('\n') || W.none_yet,
    'newsletter:api': (page, ctx) => `[${API}](${ctx.link(page.rel, API)})`,
}

// the email: the edition's filled markdown as plain text (designer@'s E3, E4: links as numbered references listed at the
// end, never inline; lines wrapped at 50 characters, a list item's lines indented under its first)
const WIDTH = 50
const wrap = line => {
    const lead = (line.match(/^(\s*(?:- |\d+\. )?)/) || ['', ''])[1], words = line.slice(lead.length).split(/ +/), out = []
    let cur = lead
    for (const w of words) { if (cur.trim() && (cur + w).length > WIDTH) { out.push(cur.replace(/ +$/, '')); cur = ' '.repeat(lead.length) } cur += w + ' ' }
    out.push(cur.replace(/ +$/, ''))
    return out.join('\n')
}
export function plain(md, pageUrl) {
    const abs = u => { try { return new URL(u, pageUrl).href.replace(/\.md(#|$)/, '.html$1').replace(/\/index\.html(#|$)/, '/$1') } catch { return u } }
    const refs = [], ref = u => { const a = abs(u), i = refs.indexOf(a); return (i < 0 ? refs.push(a) : i + 1) }
    const text = md.replace(/<!--[\s\S]*?-->/g, '').split('\n').filter(l => !/^\s*(\{\.[^}]*\}|:::.*)\s*$/.test(l)).join('\n')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, (m, t, u) => `${t} [${ref(u)}]`)
        .replace(/^#{1,6}\s+(.*)$/gm, (m, h) => `${h}\n${'-'.repeat(Math.min(h.length, WIDTH))}`)
        .replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1$2').replace(/`([^`]+)`/g, '$1')
        .replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim()
    return text.split('\n').map(l => l.length > WIDTH ? wrap(l) : l).join('\n') + (refs.length ? '\n\n' + refs.map((u, i) => `[${i + 1}] ${u}`).join('\n') : '')
}

export const api = ctx => {
    const E = editionsOf(ctx), url = p => ctx.BASE + p.rel.replace(/index\.html$/, '')
    const tail = `\n\n${W.by} `, body = p => { const i = p.md.lastIndexOf(tail); return i < 0 ? p.md : p.md.slice(0, i) }
    const mails = E.map(p => ({ path: emailOf(p.rel), schema: null,
        data: `${p.title}\n${'='.repeat(Math.min(p.title.length, WIDTH))}\n${wrap(p.summary)}\n\n${W.email_web}:\n${url(p)}\n\n${plain(body(p), url(p))}\n\n--\n${wrap(W.email_footer)}\n${ctx.BASE}newsletter/\n` }))
    const list = E.map(p => { const [, date, edition] = p.rel.match(REL)
        return { date, edition, title: p.title, summary: p.summary, authored: isAuthored(p), page: url(p), email: ctx.BASE + emailOf(p.rel) } })
    return [...mails, { path: API, schema: null, data: { about: W.index_summary, editions: list } }]
}

export const llms = ctx => `## The daily newsletter\n- [newsletter/](${ctx.BASE}newsletter/index.md): a morning and an evening edition in summit week, each a page and a plain-text email with links; as data: [${API}](${ctx.BASE}${API}).\n\n`

const CONTACT = [/mailto:/i, /\+\d{1,3}[\d ()-]{7,}\d/, /[\w.%+-]+@(?![\w-]*\.(dinis|vicky)\b)(?!PrompTugal\.)[\w-]+(\.[\w-]+)*\.[a-z]{2,}\b/i]
export function validate(gate) {
    const out = []
    const files = execFileSync('git', ['ls-files', DIR], { cwd: gate.ROOT }).toString().split('\n').filter(f => f.endsWith('.md') && !f.endsWith('/index.md'))
    for (const f of files) {
        const m = path.basename(f).match(NAME)
        if (!m) { out.push(`${f}: an edition is named <YYYY-MM-DD>-morning.md or <YYYY-MM-DD>-evening.md`); continue }
        const src = gate.text(f), fm = (src.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1]
        for (const k of NEED) if (!new RegExp(`^${k}:\\s*\\S`, 'm').test(fm)) out.push(`${f}: front matter has no ${k}`)
        if (!new RegExp(`^date:\\s*['"]?${m[1]}`, 'm').test(fm)) out.push(`${f}: its date is not ${m[1]}, the date in its name`)
        if (!new RegExp(`^edition:\\s*['"]?${m[2]}\\b`, 'm').test(fm)) out.push(`${f}: its edition is not ${m[2]}, the edition in its name`)
        for (const re of CONTACT) { const hit = src.match(re); if (hit) out.push(`${f}: looks like a contact detail ("${hit[0].slice(0, 3)}..."): nothing private in an edition (the comms protocol)`) }
    }
    for (const e of gate.json(API).editions) { const p = e.email.replace(/^https?:\/\/[^/]+\//, ''); if (!gate.generated.has(p)) out.push(`${p}: the email of ${e.page} was not built`) }
    return out
}
export function warn(gate) {
    const max = 350
    return [...gate.generated].filter(f => /^api\/v1\/newsletter\/.*\.txt$/.test(f)).map(f => [f, gate.text(f).split(/\s+/).length]).filter(([, n]) => n > max).map(([f, n]) => `${f}: ${n} words; an email edition is short (under ${max}), the page carries the rest`)
}
