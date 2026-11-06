// The story board (board/the-story-pipeline.md, row 2): every story in one column of a Kanban board, from idea to
// published, at /newsroom/stories/ (its words: content/newsroom/stories.md), a page per story with its whole trail
// (/newsroom/stories/<id>/), and api/v1/newsroom/stories.json. A LETS cycle: load data/stories/ (derived by the
// ontologist's derivation from the desks' files, so a story's column follows its files), extract each card, transform
// to columns with counts, save the model; the board, the pages and the API are drawn from that one model.
// The board needs no script; assets/newsroom/stories.js adds filters by desk, beat and assignee from the API.
export const order = 73
const REL = 'newsroom/stories/index.html', API = 'api/v1/newsroom/stories.json', GH = 'https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/'
export const COLUMNS = [['idea', 'Idea'], ['drafting', 'Drafting'], ['draft', 'Draft'], ['fact-check', 'Fact-check'], ['review', 'Review'], ['waits-on-dinis', 'Waits on Dinis'], ['ready', 'Ready'], ['published', 'Published'], ['held', 'Held']]
const label = id => (COLUMNS.find(c => c[0] === id) || [id, id])[1]
const relOf = id => `newsroom/stories/${id}/index.html`
const deskOf = s => { const f = s.draft || s.check || (s.reviews || [])[0]?.file || (s.desk_files || [])[0] || ''; const m = /^desks\/([^/]+)\//.exec(typeof f === 'string' ? f : f.file || ''); return m ? m[1] : null }
const idKey = id => { const m = /^([A-Z]+)(\d+)$/.exec(id); return m ? [m[1], +m[2]] : ['~', 0] }
const byId = (a, b) => { const x = idKey(a.id), y = idKey(b.id); return x[0].localeCompare(y[0]) || y[1] - x[1] || a.id.localeCompare(b.id) }

let cached = null
function model(ctx) {
    if (cached) return cached
    const articles = new Map(ctx.content.filter(p => p.rel.startsWith('articles/')).map(p => [p.src, p]))
    const stories = ctx.store.stories.map(s => {
        const art = s.article && articles.get(s.article.path)
        const sources = (s.rests_on || []).length
        return {
            id: s.id, title: s.title, column: s.status, beat: s.beat || null, desk: deskOf(s), assignee: s.assignee || null,
            needs: s.needs || null, held: s.held || null, next: s.next || null, sources,
            draft: s.draft || null, check: s.check || null, reviews: s.reviews || [],
            article: art ? { rel: art.rel, title: art.meta.title, signed: !!s.article.signed } : null,
            history: s.history || [], page: relOf(s.id),
        }
    }).sort(byId)
    const columns = COLUMNS.map(([id, name]) => ({ id, name, count: stories.filter(s => s.column === id).length }))
    cached = { about: (ctx.content.find(p => p.rel === REL) || { meta: {} }).meta.summary || '', built: ctx.VERSION, columns, stories }
    return cached
}

// a file a story rests on, on GitHub (the renderer turns a .md link into its page, and desks' files are not pages)
const fileLink = (ctx, from, f) => `[\`${f.split('/').pop()}\`](${GH}${f})`
const who = a => a ? `\`${a}\`` : 'nobody yet'

function card(ctx, s) {
    const bits = [s.beat, s.desk, s.assignee ? s.assignee.split('@')[0] : null].filter(Boolean).join(' · ')
    const extra = s.column === 'waits-on-dinis' && s.needs ? ` Asks: ${ctx.md.cell(s.needs.question || '')}` : s.column === 'held' && s.held ? ` Held: ${ctx.md.cell(s.held)}` : s.article ? ` [Read it](${ctx.link(REL, s.article.rel)}).` : ''
    return `- **[${s.id}](${ctx.link(REL, s.page)})** ${ctx.md.cell(s.title)}  \n  ${bits || 'no desk yet'} · ${s.sources} sources.${extra}`
}

export function pages(ctx) {
    const M = model(ctx)
    return M.stories.map(s => {
        const rel = s.page
        const files = [s.draft && `- Draft: ${fileLink(ctx, rel, s.draft)}`, s.check && `- Fact-check: ${fileLink(ctx, rel, s.check)}`,
            ...s.reviews.map(r => `- Review: ${fileLink(ctx, rel, r.file)}${r.verdict ? `, ${ctx.md.cell(r.verdict)}` : ''}${r.by ? ` by \`${r.by}\`` : ''}`),
            s.article && `- Article: [${ctx.md.cell(s.article.title)}](${ctx.link(rel, s.article.rel)})${s.article.signed ? ', signed' : ''}`].filter(Boolean)
        const trail = s.history.map(h => `| ${ctx.md.cell(String(h.at || '').replace('T', ' '))} | ${label(h.column)} | ${who(h.by)} | ${h.file ? fileLink(ctx, rel, h.file) : ''} |`)
        return {
            rel, type: 'story', src: `data/stories/${s.id}/story.json`, title: `${s.id}: ${s.title}`, crumbs: [['newsroom/index.html', 'Newsroom'], [REL, 'Stories'], [null, s.id]],
            summary: `${label(s.column)}. Next: ${s.next || 'not set'}.`,
            md: `{.facts}\n| | |\n|---|---|\n| **Column** | ${label(s.column)} |\n| **Beat** | ${ctx.md.cell(s.beat || '')} |\n| **Desk** | ${s.desk ? `\`${s.desk}\`` : ''} |\n| **Who has it** | ${who(s.assignee)} |\n| **Sources** | ${s.sources} |\n` +
                (s.needs ? `| **Waits on** | ${ctx.md.cell(s.needs.who || '')}: ${ctx.md.cell(s.needs.question || '')} |\n` : '') + (s.held ? `| **Held** | ${ctx.md.cell(s.held)} |\n` : '') +
                `\n## Its files {#files}\n\n${files.length ? files.join('\n') : 'Only the idea, in the curator\'s map.'}\n\n## Its trail {#trail}\n\n| When | Column | Who | File |\n|---|---|---|---|\n${trail.join('\n')}\n\n` +
                `[The board](${ctx.link(rel, REL)}) · [as data](${ctx.link(rel, `api/v1/stories/${s.id}.json`)})`,
        }
    })
}

export const fill = {
    'stories:counts': (p, ctx) => '| ' + model(ctx).columns.map(c => c.name).join(' | ') + ' |\n|' + model(ctx).columns.map(() => '---:').join('|') + '|\n| ' + model(ctx).columns.map(c => c.count).join(' | ') + ' |',
    'stories:board': (p, ctx) => {
        const M = model(ctx)
        return '::: kb\n' + M.columns.map(c => `::: kb-col kb-${c.id}\n### ${c.name} (${c.count}) {#col-${c.id}}\n\n${M.stories.filter(s => s.column === c.id).map(s => card(ctx, s)).join('\n') || 'None.'}\n:::`).join('\n') + '\n:::'
    },
    'stories:dinis': (p, ctx) => {
        const W = model(ctx).stories.filter(s => s.column === 'waits-on-dinis')
        return W.length ? '{.rows}\n' + W.map(s => `- **[${s.id}](${ctx.link(REL, s.page)})** ${ctx.md.cell(s.title)}: ${ctx.md.cell(s.needs?.question || '')}`).join('\n') : 'Nothing waits on Dinis.'
    },
    'stories:api': (p, ctx) => `[${API}](${ctx.link(REL, API)})`,
}

export function decorate(p) {
    if (p.rel === REL) p.assets = { css: [...(p.assets?.css || []), 'assets/newsroom/stories.css'], js: [...(p.assets?.js || []), 'assets/newsroom/stories.js'] }
    else if (p.rel.startsWith('newsroom/stories/')) p.assets = { css: [...(p.assets?.css || [])], js: [...(p.assets?.js || [])] }
}
export const api = ctx => [{ path: API, data: model(ctx), schema: null }]
export const llms = ctx => `## The story board\n- [newsroom/stories/](${ctx.BASE}newsroom/stories/index.md): every story in one column, idea to published, with who has it and what is next; as data: [${API}](${ctx.BASE}${API}).\n\n`

export function validate(gate) {
    const out = [], M = gate.json(API)
    const total = M.columns.reduce((n, c) => n + c.count, 0)
    if (total !== M.stories.length) out.push(`${API}: the columns count ${total} stories, the list has ${M.stories.length}`)
    for (const s of M.stories) if (!COLUMNS.some(c => c[0] === s.column)) out.push(`${API}: ${s.id} is in no column (${s.column})`)
    return out
}
