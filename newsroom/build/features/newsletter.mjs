// The daily newsletter (Dinis, 6 November 2026, board/guidance/2026-11-06-the-daily-newsletter.md): from Saturday 7
// November a morning and an evening edition, each a public page and a short plain-text email with links back here.
// Subscribers, consent and sending stay with the Web Summit team: nothing private on this side.
//   Load       content/newsletter/<YYYY-MM-DD>-<morning|evening>.md (front matter: title, date, edition, summary,
//              author, status), rendered at /newsletter/<YYYY-MM-DD>-<edition>/ by the content feature; the words of
//              the index and of the email's frame: newsroom/build/words/newsletter.json (to data/site/ once it has a schema)
//   Transform  each edition's filled markdown into plain text: hooks and markers dropped, every link made absolute
//   Save       api/v1/newsletter/<date>-<edition>.txt (the email); api/v1/newsletter.json (every edition, its page
//              and its email); the index /newsletter/ (content/newsletter/index.md if it exists, else made here)
// The gate: the file name, the front matter and the date agree; no contact detail in an edition; the email exists.
import path from 'node:path'
import { execFileSync } from 'node:child_process'
export const order = 76
const DIR = 'content/newsletter/', WORDS = 'newsroom/build/words/newsletter.json', INDEX = 'newsletter/index.html', API = 'api/v1/newsletter.json'
const NAME = /^(\d{4}-\d{2}-\d{2})-(morning|evening)\.md$/
const NEED = ['title', 'date', 'edition', 'summary', 'author', 'status']
const isEdition = p => p.src && p.src.startsWith(DIR) && NAME.test(path.basename(p.src))
const editionsOf = ctx => (ctx.pages || ctx.content).filter(isEdition).filter(p => p.meta?.status !== 'draft')
    .sort((a, b) => b.rel.localeCompare(a.rel))
const emailOf = rel => `api/v1/newsletter/${rel.split('/')[1]}.txt`   // under /api/: generated, never committed
const W = ctx => ctx.readJSON(WORDS)

export function pages(ctx) {
    if (ctx.exists(DIR + 'index.md')) return []
    const I = W(ctx).index
    return [{ rel: INDEX, title: I.title, summary: I.summary, src: WORDS,
        md: `${I.intro}\n\n${I.subscribe}\n\n## ${I.editions}\n\n<!-- newsletter:list -->\n\n## ${I.for_agents}\n\n<!-- newsletter:api -->\n` }]
}

export function decorate(p, ctx) {
    if (!isEdition(p)) return
    const [, date, ed] = path.basename(p.src).match(NAME)
    p.type = 'article'
    p.date = date
    p.crumbs = [[INDEX, W(ctx).index.title], [null, p.meta.title]]
    p.md = `{.byline}\n*${ctx.md.cell(W(ctx).editions[ed])} · ${ctx.md.cell(ctx.DAY(date))} · ${ctx.md.cell(p.meta.author)} · [email version](${ctx.link(p.rel, emailOf(p.rel))})*\n\n` + p.md
}

export const fill = {
    'newsletter:list': (p, ctx) => {
        const E = editionsOf(ctx), names = W(ctx).editions
        return E.length ? '{.rows}\n' + E.map(e => `- **[${ctx.md.cell(e.meta.title)}](${ctx.link(p.rel, e.rel)})** ${ctx.md.cell(e.meta.summary)}  \n  \`${ctx.md.cell(names[e.meta.edition] || e.meta.edition)} · ${ctx.md.cell(String(e.meta.date).slice(0, 10))}\``).join('\n') : W(ctx).index.none
    },
    'newsletter:api': (p, ctx) => `[${API}](${ctx.link(p.rel, API)})`,
}

// the email: the edition's markdown as plain text, every link absolute (the twin's .md links become the pages)
export function plain(md, pageUrl) {
    const abs = u => { try { return new URL(u, pageUrl).href.replace(/\.md(#|$)/, '.html$1').replace(/\/index\.html(#|$)/, '/$1') } catch { return u } }
    return md.replace(/<!--[\s\S]*?-->/g, '').split('\n').filter(l => !/^\s*(\{\.[^}]*\}|:::.*)\s*$/.test(l)).join('\n')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\(([^)\s]+)[^)]*\)/g, (m, t, u) => `${t} (${abs(u)})`)
        .replace(/^#{1,6}\s+(.*)$/gm, (m, h) => `${h}\n${'-'.repeat(Math.min(h.length, 60))}`)
        .replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1$2').replace(/`([^`]+)`/g, '$1')
        .replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim()
}

export const api = ctx => {
    const F = W(ctx).email, E = editionsOf(ctx)
    const mails = E.map(e => { const url = ctx.BASE + e.rel.replace(/index\.html$/, '')
        return { path: emailOf(e.rel), schema: null, data: `${e.meta.title}\n${'='.repeat(Math.min(e.meta.title.length, 60))}\n${e.meta.summary}\n\n${F.web}: ${url}\n\n${plain(e.md.replace(/^\{\.byline\}\n[^\n]*\n\n/, ''), url)}\n\n--\n${F.footer}${ctx.BASE}${INDEX.replace(/index\.html$/, '')}\n` } })
    const list = E.map(e => ({ date: String(e.meta.date).slice(0, 10), edition: e.meta.edition, title: e.meta.title, summary: e.meta.summary, author: e.meta.author,
        page: ctx.BASE + e.rel.replace(/index\.html$/, ''), email: ctx.BASE + emailOf(e.rel) }))
    return [...mails, { path: API, schema: null, data: { about: W(ctx).about, editions: list } }]
}

export const llms = ctx => `## The daily newsletter\n- [newsletter/](${ctx.BASE}newsletter/index.md): a morning and an evening edition through the summit, each a page and a plain-text email with links; as data: [${API}](${ctx.BASE}${API}).\n\n`

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
        if (/^status:\s*draft/m.test(fm)) continue
        const mail = `api/v1/newsletter/${m[1]}-${m[2]}.txt`
        if (!gate.generated.has(mail)) out.push(`${f}: no ${mail} was built`)
    }
    return out
}
export function warn(gate) {
    const max = gate.json(WORDS).words_warn
    return [...gate.generated].filter(f => /^api\/v1\/newsletter\/.*\.txt$/.test(f)).map(f => [f, gate.text(f).split(/\s+/).length]).filter(([, n]) => n > max).map(([f, n]) => `${f}: ${n} words; an email edition is short (under ${max}), the page carries the rest`)
}
