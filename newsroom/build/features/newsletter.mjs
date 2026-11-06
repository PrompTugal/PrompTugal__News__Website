// The daily newsletter (Dinis, 6 Nov 16:20 UTC): a morning and an evening edition from Saturday 7 November, each a public page
// (/newsletter/<date>-morning/ and -evening/) whose markdown twin is the short plain-text email, with links. Made from the same data
// as the day pages and the articles; the words are in data/site/list-views.json. Subscribers and sending are the Web Summit
// team's, not here. An edition exists once its day has come.
import fs from 'node:fs'
import { slotLine, slotList } from '../lib/present.mjs'
import { load, rank, KIND, STRIP_DAYS } from './agenda.mjs'
import { articlesOf } from './articles.mjs'
export const order = 62

const W = JSON.parse(fs.readFileSync(new URL('../../../data/site/list-views.json', import.meta.url), 'utf8')).newsletter
const byTime = (a, b) => (a.time || '').localeCompare(b.time || '')
const FIRST = '2026-11-07'

const five = (ctx, rel, d) => {
    const { itemsOn } = load(ctx), rk = e => e.kind === 'registration' && d >= '2026-11-10' ? 4 : rank(e)
    return slotList([...itemsOn(d)].sort((a, b) => rk(a) - rk(b) || byTime(a, b)).slice(0, 5).sort(byTime).map(e => slotLine(ctx, rel, e, { day: false, extra: [KIND[e.kind] || e.kind] })))
}
const dayLink = (ctx, rel, d) => `[${W.day_link}](${ctx.link(rel, `days/${d}/index.html`)})`
const next = d => STRIP_DAYS[STRIP_DAYS.indexOf(d) + 1]

function edition(ctx, d, kind) {
    const { TODAY, DAY } = load(ctx), rel = `newsletter/${d}-${kind}/index.html`
    const md = kind === 'morning'
        ? `## ${W.there_head}\n\n${W.there_text}\n\n${five(ctx, rel, d)}\n\n${dayLink(ctx, rel, d)}\n\n## ${W.remote_head}\n\n${W.remote_text}\n\n<!-- newsletter:latest -->`
        : `## ${W.today_head}\n\n<!-- newsletter:today -->\n\n## ${W.latest_head}\n\n<!-- newsletter:latest -->\n\n` +
          (next(d) ? `## ${W.next_head}\n\n${W.next_text}\n\n${five(ctx, rel, next(d))}\n\n${dayLink(ctx, rel, next(d))}\n\n` : '')
    return {
        src: 'data/events/', rel, type: 'site', date: d, section: 'news',
        crumbs: [['newsletter/index.html', W.index_title], [null, `${DAY(d)}, ${W[kind].toLowerCase()}`]],
        title: `${W[kind]} edition: ${DAY(d)}`, summary: W[kind + '_summary'],
        md: `${md}\n\n${W.by}`,
    }
}

// the article lines are filled once the articles exist (the pages above are made before them)
const line = (ctx, rel, a) => `- [${a.meta.title}](${ctx.link(rel, a.rel)}). ${a.meta.summary.replace(/[*`]/g, '').split(/(?<=[.!?])\s/)[0]}`
export const fill = {
    'newsletter:latest': (page, ctx) => articlesOf(ctx).slice(0, 5).map(a => line(ctx, page.rel, a)).join('\n'),
    'newsletter:today': (page, ctx) => {
        const d = page.rel.match(/(\d{4}-\d{2}-\d{2})/)[1]
        return articlesOf(ctx).filter(a => a.meta.date === d).map(a => line(ctx, page.rel, a)).join('\n') || W.today_none
    },
}

export function pages(ctx) {
    const { TODAY, DAY } = load(ctx)
    const eds = STRIP_DAYS.filter(d => d >= FIRST && d <= TODAY).flatMap(d => [edition(ctx, d, 'morning'), edition(ctx, d, 'evening')])
    const list = [...eds].reverse().map(p => `- [${p.title}](${ctx.link('newsletter/index.html', p.rel)})`).join('\n')
    return [{
        src: 'data/site/list-views.json', rel: 'newsletter/index.html', type: 'site', date: TODAY, section: 'news',
        crumbs: [[null, W.index_title]], title: W.index_title, summary: W.index_summary,
        md: `${W.index_intro}\n\n${list || W.none_yet}`,
    }, ...eds]
}
