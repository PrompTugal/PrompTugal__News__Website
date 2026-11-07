// A, the home page (Silvio's mock A, "The Edition"): a classic front page. The briefing and the field radar on the
// left, the lead and two second stories in the middle, Now and next on the right, six more stories below; all from
// data (the correspondent's order, the agenda, the store). Placed before the frame by <!-- front:a -->
// (content/index.md); one of the home page's designs (features/designs.mjs, ?design=a). The kit shared with B and C:
// lib/design-kit.mjs. The common look and script of A, B and C are loaded here, once.
import { template, put, data, pill, picture, beatOf, cut, radar, asks, dayCells, nextItems } from '../lib/design-kit.mjs'
import { byline, minutes, imageFile } from './front.mjs'
import { WORDMARK } from '../lib/shell.mjs'
export const order = 23.1
const T = template('assets/front-abc/front-a.tmpl')

export const fill = {
    'front:a': (page, ctx) => {
        const esc = ctx.md.esc, D = data(ctx), a = D.all[0]
        const story = (b, kind) => ({ href: b.rel, beat: esc(beatOf(b)), title: esc(b.meta.title), dek: esc(cut(b.meta.summary || '', 150)), picture: picture(ctx, T, b, 'thumb') })
        const lead = a ? put(T.part('lead'), { href: a.rel, kicker: esc(a.meta.tags || beatOf(a)), title: esc(a.meta.title), dek: esc(a.meta.summary || ''), byline: esc(byline(a.meta.author)), minutes: minutes(a.md),
            pill: pill(ctx, T, a), figure: picture(ctx, T, a, 'card', false) ? put(T.item('fig'), { href: a.rel, picture: picture(ctx, T, a, 'card', false) }) : '', '#duo': T.many('duo', D.all.slice(1, 3).map(story)) }) : T.part('none')
        page.before = (page.before || '') + put(T.part('page'), {
            today: ctx.TODAY, date: D.date, opening_at: D.openingAt, opening_in: D.openingIn, name: esc(ctx.SITE.name), wordmark: WORDMARK(''),
            '#nav': T.many('nav', ctx.NAV.nav.map(n => ({ href: n.href, label: esc(n.label), cur: n.id === 'now' ? ' aria-current="page"' : '' }))),
            '#asks': asks(T), '#briefing': T.many('brief', D.briefing.map(b => ({ href: b.rel, title: esc(b.meta.title), beat: esc(beatOf(b)) }))),
            '#radar': radar(ctx, T, D), lead, '#days': dayCells(ctx, T, D), '#next': nextItems(ctx, T, D, 7),
            '#more': T.many('more', D.all.slice(3, 9).map(story)),
        })
        return ''
    },
}
// the look and the script of A, B and C (the same file for the three)
export function decorate(p) {
    if (p.rel !== 'index.html') return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/front-abc/front-abc.css'], js: [...(p.assets?.js || []), 'assets/front-abc/front-abc.js'] }
}
