// D, "The Brief" (Silvio's mock D): the home page to read in two minutes. One of the home page's designs
// (board/team/conductor.b/briefs/2026-11-06-home-page-eight-designs.md); its component is assets/front-d/, its data the
// model every design shares (lib/home.mjs). Placed by <!-- front:d --> in content/index.md, before <!-- front:designs -->.
import { tmpl, model, pieces, homeAssets } from '../lib/home.mjs'
import { WORDMARK } from '../lib/shell.mjs'
export const order = 23
const t = tmpl('assets/front-d/front-d.tmpl'), { pill, picture, headline } = pieces(t)

function lead(x) {
    if (!x) return ''
    const pic = picture(x, 'card', false)
    return t.put(t.part('lead'), { href: x.href, tags: x.tags, headline: headline(x), minutes: x.minutes, pill: pill(x),
        figure: pic ? t.put(t.item('figure'), { href: x.href, picture: pic }) : '',
        points: x.points.length ? t.put(t.item('points'), { '#list': t.many('point', x.points.slice(0, 3).map(text => ({ text }))) }) : t.put(t.item('dek'), { dek: x.dek }) })
}

export const fill = {
    'front:d': (page, ctx) => {
        const m = model(ctx), [first, ...rest] = m.articles
        page.before = (page.before || '') + t.put(t.part('page'), {
            name: ctx.md.esc(ctx.SITE.name), wordmark: WORDMARK(''), today: m.today, date: m.date, opening_at: m.openingAt, opening_in: m.openingIn,
            lead: lead(first), '#asks': t.many('ask', m.asks),
            '#also': rest.slice(0, 5).map(x => t.put(t.item('also'), { beat: x.beat, href: x.href, title: x.title, dek: x.dekShort,
                thumb: x.thumb ? t.put(t.item('thumb'), { href: x.href, picture: picture(x, 'thumb') }) : '' })).join(''),
            '#calendar': t.many('cal', m.next.slice(0, 5).map(e => ({ ...e, where: e.where ? ' · ' + e.where : '' }))),
        })
        return ''
    },
}
export const decorate = p => homeAssets(p, 'd')
