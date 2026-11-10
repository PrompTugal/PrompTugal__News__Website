// The visual newsroom: one workflow graph per piece, built from the record (this repository's history), drawn on the piece's own page and
// for the whole newsroom at /newsroom/pieces/. A piece is an article (content/articles/<slug>.md, its story id such as S13) or an interview
// (desks/*/interviews/<slug>--...md). Every commit that touched a file of the piece is a step: who (the Agent: trailer, or the subject's
// prefix), when, which stage (draft, review, verify, design, data, publish, sign), and the hand-off from one actor to the next is the line
// between two steps of different actors. Only what the commits say in public; nothing is read from a sealed inbox.
// Brief: board/guidance/2026-11-10-pt-news-is-about-agents.md ("the workflow is the picture", Dinis, 10 November 2026, about 12:40 UTC).
// By dev.graphs@PrompTugal.dinis (WS-177). Drawn by assets/newsroom/flow.js; reuses live.mjs's idea (agents-live.mjs) of reading the history.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
export const order = 94
const API = 'api/v1/newsroom/piece-flows.json', PAGE = 'newsroom/pieces/index.html', REPO = 'https://github.com/promptugal/promptugal__news__website'
const ID = /^[a-z][a-z0-9.\-]*@[a-z][a-z0-9\-]*(\.[a-z][a-z0-9\-]*)+$/i
const STAGES = [
    ['sign', p => /^articles\/[^/]+\.md\.sig$/.test(p)],
    ['publish', p => /^content\/articles\//.test(p)],
    ['verify', p => /^board\/team\/dev\.verify\/records\//.test(p)],
    ['review', p => /^desks\/(reviewer|checker|security|synthetic|sherpa)[^/]*\//.test(p) || /\/reviews\//.test(p)],
    ['design', p => /^design\//.test(p) || /^assets\/(img|infographics)\//.test(p)],
    ['brief', p => /^board\/(guidance|briefs)\//.test(p)],
    ['draft', p => /^desks\/[^/]+\/(drafts|interviews|briefs|notes)\//.test(p)],
    ['data', p => /^data\//.test(p)],
    ['notes', p => /^board\/(team|runs|abp|inboxes)\//.test(p)],
    ['build', p => /^(newsroom|assets|\.github)\//.test(p)],
]
const stageOf = p => (STAGES.find(([, f]) => f(p)) || ['other'])[0]
const clean = s => String(s || '').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g, m => (/@(promptugal|web-summit)\.[a-z]+$/i.test(m) ? m : '[address removed]')).replace(/\b[A-Za-z0-9+/_-]{40,}\b/g, '[removed]')

const front = file => {
    const t = fs.readFileSync(file, 'utf8'), m = t.match(/^---\n([\s\S]*?)\n---/), o = {}
    if (m) for (const l of m[1].split('\n')) { const k = l.match(/^([a-z_]+):\s*(.*)$/i); if (k) o[k[1]] = k[2].replace(/^["']|["']$/g, '') }
    return o
}
function pieces(root) {
    const out = []
    const dir = path.join(root, 'content/articles')
    for (const f of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
        if (!f.endsWith('.md') || f === 'index.md') continue
        const slug = f.replace(/\.md$/, ''), fm = front(path.join(dir, f))
        out.push({ id: slug, kind: 'article', slug, story: /^[A-Za-z]+\d+$/.test(fm.story || '') ? fm.story : null, title: fm.title || slug, date: fm.date || '' })
    }
    for (const d of fs.existsSync(path.join(root, 'desks')) ? fs.readdirSync(path.join(root, 'desks')) : []) {
        const idir = path.join(root, 'desks', d, 'interviews')
        for (const f of fs.existsSync(idir) ? fs.readdirSync(idir) : []) {
            if (!f.endsWith('.md') || /^readme/i.test(f)) continue
            const slug = f.split('--')[0].replace(/\.md$/, ''), fm = front(path.join(idir, f))
            out.push({ id: `interview-${slug}`, kind: 'interview', slug, story: null, title: fm.title || slug.replace(/-/g, ' '), date: (f.match(/\d{4}-\d{2}-\d{2}/) || [''])[0], match: `desks/${d}/interviews/${f}` })
        }
    }
    return out
}
function history(root) {
    try {
        const out = execFileSync('git', ['log', '--no-merges', '--name-only', '--format=%x1e%H%x1f%cI%x1f%s%x1f%B%x1f'], { cwd: root, maxBuffer: 1 << 28, encoding: 'utf8' })
        return out.split('\x1e').filter(r => r.trim()).map(r => { const [sha, at, subject, body, files] = r.split('\x1f'); return { sha: sha.trim(), at, subject, body: body || '', files: (files || '').split('\n').map(f => f.trim()).filter(Boolean) } }).reverse()
    } catch { return [] }
}
const actorOf = c => {
    const t = c.body.match(/^Agent:\s*(.+)$/m), a = t && t[1].split(/[;,]/)[0].trim()
    if (a && ID.test(a)) return a.toLowerCase()
    const p = c.subject.match(/^([a-z][a-z0-9.\-]*@[A-Za-z][A-Za-z0-9\-]*(?:\.[A-Za-z0-9\-]+)+):/)
    return p ? p[1].toLowerCase() : null
}
const trailer = (c, k) => { const m = c.body.match(new RegExp(`^${k}:\\s*(.+)$`, 'm')); return m ? clean(m[1]).slice(0, 120) : null }

export function build(root) {
    const list = pieces(root), commits = history(root)
    const keyOf = p => {
        const rx = [p.kind === 'article' ? new RegExp(`(^|/)${p.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([-./]|$)`) : null, p.story ? new RegExp(`(^|[/-])${p.story}([-./]|$)`) : null].filter(Boolean)
        return f => p.match ? f === p.match || f.includes(p.slug) : rx.some(r => r.test(f))
    }
    const flows = list.map(p => {
        const hit = keyOf(p), steps = []
        for (const c of commits) {
            if (/^site v\d/.test(c.subject)) continue
            const actor = actorOf(c); if (!actor) continue
            const files = c.files.filter(hit); if (!files.length) continue
            const st = [...new Set(files.map(stageOf))], stage = ['sign', 'publish', 'verify', 'review', 'design', 'draft', 'data', 'notes', 'other'].find(s => st.includes(s))
            steps.push({ t: c.at, a: actor, st: stage, sha: c.sha.slice(0, 7), s: clean(c.subject.replace(/^[a-z][a-z0-9.\-]*@[A-Za-z][A-Za-z0-9\-]*(?:\.[A-Za-z0-9\-]+)+:\s*/, '')).slice(0, 140), n: files.length, brief: trailer(c, 'Brief'), unit: trailer(c, 'Unit'), forr: trailer(c, 'For') })
        }
        return { id: p.id, kind: p.kind, title: p.title, story: p.story, date: p.date, steps }
    }).filter(f => f.steps.length)
    // the briefs: every commit that carries the same Brief: trailer is one trail, rooted at Dinis's voice brief (its id carries the moment)
    const byBrief = new Map()
    for (const c of commits) {
        if (/^site v\d/.test(c.subject)) continue
        const actor = actorOf(c), m = c.body.match(/^Brief:\s*(.+)$/m); if (!actor || !m) continue
        for (const id of m[1].split(/[;,]/).map(x => x.trim()).filter(x => /^brief:/.test(x))) {
            const st = [...new Set(c.files.map(stageOf))], stage = ['sign', 'publish', 'verify', 'review', 'design', 'brief', 'draft', 'data', 'build', 'notes', 'other'].find(x => st.includes(x)) || 'other'
            if (!byBrief.has(id)) byBrief.set(id, [])
            byBrief.get(id).push({ t: c.at, a: actor, st: stage, sha: c.sha.slice(0, 7), s: clean(c.subject.replace(/^[a-z][a-z0-9.\-]*@[A-Za-z][A-Za-z0-9\-]*(?:\.[A-Za-z0-9\-]+)+:\s*/, '')).slice(0, 140), n: c.files.length, brief: id, unit: trailer(c, 'Unit'), forr: trailer(c, 'For') })
        }
    }
    for (const [id, steps] of byBrief) {
        const m = id.match(/^brief:(\d{4})-?(\d{2})-?(\d{2})T(\d{2})(\d{2})Z-?(.*)$/)
        if (steps.length < 2) continue
        const root = m ? { t: `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00.000Z`, a: 'dinis (voice)', st: 'voice', sha: steps[0].sha, s: "Dinis's voice brief, recorded by the conductor who wrote it down", n: 0, brief: id, unit: null, forr: null } : null
        if (root) { const first = Date.parse(steps[0].t), at = Date.parse(root.t); root.t = new Date(Math.min(at, first - 60000)).toISOString() }
        const all = (root ? [root] : []).concat(steps)
        flows.push({ id: id.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase(), kind: 'brief', title: m && m[6] ? m[6].replace(/-/g, ' ') : id, story: null, date: m ? `${m[1]}-${m[2]}-${m[3]}` : '', steps: all })
    }
    return { flows, stages: STAGES.map(s => s[0]).concat(['voice', 'other']) }
}

export function api(ctx) {
    const b = build(ctx.ROOT || process.cwd())
    return [{ path: API, schema: null, data: { id: 'newsroom-piece-flows', about: 'One workflow per piece (article or interview): each commit that touched a file of the piece is a step with its actor, stage and time, in time order; a hand-off is two steps in a row by different actors. Built from the repository history at each release. The sealed inboxes are never read.', built_at: new Date().toISOString(), repo: REPO, stages: b.stages, flows: b.flows } }]
}

const isArticle = rel => /^articles\/[^/]+\.html$/.test(rel) && rel !== 'articles/index.html'
export function decorate(page, ctx) {
    let html = null
    if (isArticle(page.rel)) html = `<section class="pf-wrap"><h2>How this piece was made</h2><div class="pf" data-piece="${page.rel.replace(/^articles\/|\.html$/g, '')}" data-data="${'../'.repeat(page.rel.split('/').length - 1)}${API}"></div></section>`
    else if (page.rel === PAGE) html = `<div class="pf" data-all="1" data-data="../../${API}"></div>`
    if (!html) return
    page.assets = { css: [...(page.assets && page.assets.css || []), 'assets/newsroom/flow.css'], js: [...(page.assets && page.assets.js || []), 'assets/newsroom/flow.js'] }
    const prev = page.postHtml
    page.postHtml = h => (prev ? prev(h) : h) + '\n' + html
}

export function validate(gate) {
    const out = []
    for (const f of ['assets/newsroom/flow.js', 'assets/newsroom/flow.css']) { try { gate.text(f) } catch { out.push(`missing ${f}`) } }
    try {
        const d = gate.json(API)
        if (!d.flows.length) out.push('piece-flows.json: no flows')
        for (const f of d.flows) for (const s of f.steps) if (!/^[0-9a-f]{7}$/.test(s.sha) || !s.a) out.push(`piece-flows.json: a step of ${f.id} has no commit or actor`)
        if (/[A-Za-z0-9._%+-]+@(?!(promptugal|web-summit)\.)[A-Za-z0-9-]+\.[A-Za-z]{2,}/i.test(JSON.stringify(d))) out.push('piece-flows.json: an address that is not an agent id')
    } catch (e) { out.push(`cannot check piece-flows.json: ${e.message}`) }
    try { if (!gate.text(PAGE).includes('data-all')) out.push(`${PAGE} does not carry the piece flows`) } catch { out.push(`missing ${PAGE}`) }
    return out
}
