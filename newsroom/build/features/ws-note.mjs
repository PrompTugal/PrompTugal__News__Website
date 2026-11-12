// The websummit-only pass, step 3, the note and the recovery page (Dinis, 11 November 2026, 18:50 UTC, rules 3 and 6; the pass
// board/passes/2026-11-11-only-websummit-sourced-comes-off.md; designer@'s board/spec-the-not-everything-note.md). Once the switch
// (newsroom/build/websummit-only.json "on") is on and the inventory exists: a note on every list and every company page that had
// facts taken off, and a page, /about/what-came-off/, that says what came off, how much, and how it comes back. Off: nothing here
// shows. The filter itself is dev@'s (lib/wsonly.mjs). The words are in data/site/list-views.json (ws_note); the look in assets/ws-note/.
// dev.pages@PrompTugal.dinis.
import fs from 'node:fs'
import { wsSwitch, wsInventory } from '../lib/wsonly.mjs'
export const order = 90
export const assets = { css: ['assets/ws-note/ws-note.css'] }

const W = JSON.parse(fs.readFileSync(new URL('../../../data/site/list-views.json', import.meta.url), 'utf8')).ws_note
const on = () => !!(wsSwitch().on && wsInventory())
const REL = 'about/what-came-off/index.html'
const LISTS = { 'companies/index.html': 'companies', 'people/index.html': 'people', 'events/index.html': 'events' }
const link = (ctx, from) => `[${W.link}](${ctx.link(from, REL)})`

// the note, as the markdown the page and its twin carry: a sand band by class hook, one component in two lengths
const note = (ctx, rel, text, tail = '') => `::: ws-note\n{.ws-kicker}\n${W.kicker}\n\n${text}${tail} ${link(ctx, rel)}\n:::\n\n`

export function decorate(p, ctx) {
    if (!on() || !ctx) return
    const i = wsInventory(), kind = LISTS[p.rel]
    if (kind) {
        const c = i.counts[kind === 'companies' ? 'companies' : kind]
        p.md = note(ctx, p.rel, W.list, c ? ` *${c.total - c.websummit_only} of ${c.total} ${W.shown}.*` : '') + p.md
    } else if (p.type === 'company') {
        const id = p.rel.split('/')[1], co = (ctx.store.companies || []).find(x => x.id === id)
        if (co && co.ws_taken) p.md = note(ctx, p.rel, W.page) + p.md
    }
}

export function pages(ctx) {
    if (!on()) return []
    const i = wsInventory(), rel = REL, cell = ctx.md.cell
    const row = k => { const c = i.counts[k]; return c ? `| ${cell(W[k] || k)} | ${c.total} | ${c.websummit_only} | ${c.other_source} | 0 |` : '' }
    const kinds = ['companies', 'company_facts', 'company_edges', 'people', 'events', 'organisations', 'places'].map(row).filter(Boolean)
    const md = `## ${W.by_kind} {#kinds}\n\n${W.read}\n\n` +
        `| ${W.kind_head} | ${W.total_head} | ${W.off_head} | ${W.kept_head} | ${W.back_head} |\n|---|---|---|---|---|\n${kinds.join('\n')}\n\n${W.back_note}\n\n` +
        `## ${W.route} {#route}\n\n1. ${W.route_1}\n2. ${W.route_2}\n3. ${W.route_3}\n\n## ${W.method} {#method}\n\n${W.method_text}\n`
    return [{ src: 'data/websummit-only.json', rel, type: 'site', layout: 'wide', title: W.title, summary: W.summary, crumbs: [['about/index.html', 'About'], [null, W.title]], md }]
}
