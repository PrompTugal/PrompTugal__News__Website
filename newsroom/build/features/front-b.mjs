// B, the home page (Silvio's mock B, "Summit Live"): built for the four days. A live strip (the countdown, the numbers),
// the ask bar, the days, a timeline of today and next with the field radar, and the latest stories; from data. Placed
// before the frame by <!-- front:b -->; one of the home page's designs (?design=b). The kit: lib/design-kit.mjs.
import { template, put, data, pill, picture, beatOf, cut, radar, asks, dayCells, nextItems } from '../lib/design-kit.mjs'
import { byline, minutes } from './front.mjs'
import { WORDMARK } from '../lib/shell.mjs'
export const order = 23.2
const T = template('assets/front-abc/front-b.tmpl')

export const fill = {
    'front:b': (page, ctx) => {
        const esc = ctx.md.esc, D = data(ctx), a = D.all[0]
        const lead = a ? put(T.part('lead'), { href: a.rel, kicker: esc(a.meta.tags || beatOf(a)), title: esc(a.meta.title), dek: esc(cut(a.meta.summary || '', 240)), byline: esc(byline(a.meta.author)), minutes: minutes(a.md),
            pill: pill(ctx, T, a), picture: picture(ctx, T, a, 'card', false) }) : T.part('none')
        page.before = (page.before || '') + put(T.part('page'), {
            name: esc(ctx.SITE.name), wordmark: WORDMARK(''), opening_at: D.openingAt, opening_in: D.openingIn, signed: D.signed, events: D.weekEvents, companies: D.companies,
            '#asks': asks(T), '#days': dayCells(ctx, T, D), '#next': nextItems(ctx, T, D, 8), '#radar': radar(ctx, T, D), lead,
            '#cards': T.many('card', D.all.slice(1, 8).map(b => ({ href: b.rel, beat: esc(beatOf(b)), title: esc(b.meta.title), day: esc(ctx.DAY(b.meta.date)), pill: pill(ctx, T, b), picture: picture(ctx, T, b, 'thumb') }))),
        })
        return ''
    },
}
