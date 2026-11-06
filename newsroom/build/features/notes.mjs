// Newsroom notes (board/the-newsroom-notes.md): the team's own articles about how PrompTugal.news is made. A note is
// content/newsroom/notes/<YYYY-MM-DD>-<slug>.md (front matter: title, date, author, voice, kind, summary, status,
// license, front, about), served at /newsroom/notes/<YYYY-MM-DD>-<slug>/; the index is content/newsroom/notes/index.md
// (its words), filled here with the list by date, by kind and by author; the Atom feed is api/v1/newsroom/notes.xml.
// The gate: front matter complete, the twin signed by a key in board/keys.json (newsroom/build/signed-form.cjs, as for
// articles; sign with newsroom/tools/sign-article.mjs --twin <path>), and a published note never rewritten: its text
// at the commit that first published it must still open the note (a correction is an addendum at the end).
import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
export const order = 75
const DIR = 'content/newsroom/notes/', INDEX = 'newsroom/notes/index.html', FEED = 'api/v1/newsroom/notes.xml'
const NEED = ['title', 'date', 'author', 'voice', 'kind', 'summary', 'status', 'license']
const isNote = p => p.src && p.src.startsWith(DIR) && !p.src.endsWith('/index.md')
const notesOf = ctx => ctx.content.filter(isNote).filter(p => p.meta.status !== 'draft').sort((a, b) => String(b.meta.date).localeCompare(String(a.meta.date)) || a.rel.localeCompare(b.rel))
const cell = (ctx, s) => ctx.md.cell(String(s ?? ''))

export function decorate(p, ctx) {
    if (!isNote(p)) return
    p.type = 'article'
    p.date = String(p.meta.date).slice(0, 10)
    p.crumbs = [['newsroom/index.html', 'Newsroom'], [INDEX, 'Notes'], [null, p.meta.title]]
    const by = `{.byline}\n*${cell(ctx, p.meta.date)} · ${cell(ctx, p.meta.author)}${p.meta.voice === 'person' ? ' (in their own words)' : ''} · ${cell(ctx, p.meta.kind)} · [${cell(ctx, p.meta.license)}](https://creativecommons.org/licenses/by/4.0/)*\n\n`
    p.md = by + p.md
}

const row = (ctx, n) => `- **[${cell(ctx, n.meta.title)}](${ctx.link(INDEX, n.rel)})** ${cell(ctx, n.meta.summary)}  \n  \`${cell(ctx, String(n.meta.date).slice(0, 10))} · ${cell(ctx, n.meta.author)} · ${cell(ctx, n.meta.kind)}\``
const group = (ctx, key) => { const g = {}; for (const n of notesOf(ctx)) (g[n.meta[key]] = g[n.meta[key]] || []).push(n); return Object.entries(g).sort((a, b) => a[0].localeCompare(b[0])).map(([k, ns]) => `### ${cell(ctx, k)} (${ns.length})\n\n{.rows}\n${ns.map(n => row(ctx, n)).join('\n')}`).join('\n\n') }
export const fill = {
    'notes:list': (p, ctx) => { const N = notesOf(ctx); return N.length ? '{.rows}\n' + N.map(n => row(ctx, n)).join('\n') : 'None yet.' },
    'notes:by-kind': (p, ctx) => group(ctx, 'kind') || 'None yet.',
    'notes:by-author': (p, ctx) => group(ctx, 'author') || 'None yet.',
    'notes:feed': (p, ctx) => `[${FEED}](${ctx.link(INDEX, FEED)})`,
}

const x = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
export const api = ctx => {
    const N = notesOf(ctx), updated = N[0] ? `${String(N[0].meta.date).slice(0, 10)}T00:00:00Z` : `${ctx.TODAY}T00:00:00Z`
    const entries = N.map(n => `<entry><id>${x(ctx.BASE + n.rel)}</id><title>${x(n.meta.title)}</title><updated>${x(String(n.meta.date).slice(0, 10))}T00:00:00Z</updated><author><name>${x(n.meta.author)}</name></author><link href="${x(ctx.BASE + n.rel)}"/><summary>${x(n.meta.summary)}</summary></entry>`).join('\n')
    return [{ path: FEED, data: `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom"><id>${x(ctx.BASE + INDEX)}</id><title>PrompTugal.news: newsroom notes</title><updated>${updated}</updated><link href="${x(ctx.BASE + INDEX)}"/>\n${entries}\n</feed>\n`, schema: null }]
}
export const llms = ctx => `## Newsroom notes\n- [newsroom/notes/](${ctx.BASE}newsroom/notes/index.md): the team's own notes on how the site is made, signed; feed: [${FEED}](${ctx.BASE}${FEED}).\n\n`

export function validate(gate) {
    const out = [], SIGNED = createRequire(import.meta.url)('../signed-form.cjs')
    const keys = gate.json('board/keys.json').keys
    const files = execFileSync('git', ['ls-files', DIR], { cwd: gate.ROOT }).toString().split('\n').filter(f => f.endsWith('.md') && !f.endsWith('/index.md'))
    for (const f of files) {
        const src = gate.text(f), fm = (src.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1]
        for (const k of NEED) if (!new RegExp(`^${k}:\\s*\\S`, 'm').test(fm)) out.push(`${f}: front matter has no ${k}`)
        if (/^status:\s*draft/m.test(fm)) continue
        const twin = f.replace(/^content\//, '').replace(/\.md$/, '/index.md'), sig = twin + '.sig'
        let s = null; try { s = JSON.parse(gate.text(sig)) } catch { out.push(`${twin}: not signed (no ${sig}; sign it with newsroom/tools/sign-article.mjs --twin ${twin})`); continue }
        const k = keys.find(k => k.bundle && k.bundle.signing_fingerprint === s.fingerprint && k.status === 'active')
        if (!k) { out.push(`${sig}: signed by ${s.fingerprint}, not an active key in board/keys.json`); continue }
        let ok = false; try { ok = crypto.verify('sha256', Buffer.from(SIGNED.signedForm(gate.text(twin))), { key: k.bundle.sign, dsaEncoding: 'ieee-p1363' }, Buffer.from(s.signature, 'base64')) } catch { }
        if (!ok) out.push(`${sig}: the signature by ${k.id} does not verify against ${twin} (sign it again after a change)`)
        // never rewritten: the body as first published still opens the note
        try {
            const first = execFileSync('git', ['log', '--reverse', '--format=%H', '-S', 'status: published', '--', f], { cwd: gate.ROOT }).toString().split('\n').filter(Boolean)[0]
            if (first) { const then = execFileSync('git', ['show', `${first}:${f}`], { cwd: gate.ROOT }).toString().replace(/^---\n[\s\S]*?\n---\n/, '').trimEnd(), now = src.replace(/^---\n[\s\S]*?\n---\n/, '')
                if (!now.startsWith(then)) out.push(`${f}: rewritten after it was published (${first.slice(0, 7)}); add a dated correction at the end instead`) }
        } catch { }
    }
    return out
}
