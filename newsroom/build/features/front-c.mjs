// C, the home page (Silvio's mock C, "The Atlas"): AI in Portugal, mapped. A hero that asks, the numbers and the field
// radar beside it, a grid of stories, then Now and next; from data. Placed before the frame by <!-- front:c -->; one of
// the home page's designs (?design=c). The kit: lib/design-kit.mjs.
import { template, put, data, pill, picture, beatOf, cut, radar, asks, nextItems } from '../lib/design-kit.mjs'
import { WORDMARK } from '../lib/shell.mjs'
export const order = 23.3
const T = template('assets/front-abc/front-c.tmpl')

export const fill = {
    'front:c': (page, ctx) => {
        const esc = ctx.md.esc, D = data(ctx)
        page.before = (page.before || '') + put(T.part('page'), {
            name: esc(ctx.SITE.name), wordmark: WORDMARK(''), opening_at: D.openingAt, opening_in: D.openingIn, n_stories: D.all.length,
            '#nav': T.many('nav', ctx.NAV.nav.map(n => ({ href: n.href, label: esc(n.label), cur: n.id === 'now' ? ' aria-current="page"' : '' }))),
            '#asks': asks(T), '#radar': radar(ctx, T, D, 7), '#next': nextItems(ctx, T, D, 8),
            '#nums': T.many('num', [[D.companies, 'companies followed'], [D.weekEvents, 'events this week'], [D.signed, 'stories, signed'], ['9 to 12', 'November, Lisbon']].map(([value, label]) => ({ value, label }))),
            '#cards': T.many('card', D.all.slice(0, 9).map((b, i) => ({ big: i ? '' : ' big', href: b.rel, beat: esc(beatOf(b)), title: esc(b.meta.title), dek: esc(cut(b.meta.summary || '', i ? 130 : 220)), pill: pill(ctx, T, b), picture: picture(ctx, T, b, i ? 'thumb' : 'card') }))),
        })
        return ''
    },
}
