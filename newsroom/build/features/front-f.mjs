// F, "Signal" (Silvio's mock F): dense, ranked, AI-native. One of the home page's designs
// (board/team/conductor.b/briefs/2026-11-06-home-page-eight-designs.md); its component is assets/front-f/, its data the
// model every design shares (lib/home.mjs). Placed by <!-- front:f --> in content/index.md, before <!-- front:designs -->.
import { tmpl, model, pieces, homeAssets } from '../lib/home.mjs'
import { WORDMARK } from '../lib/shell.mjs'
export const order = 23
const t = tmpl('assets/front-f/front-f.tmpl'), { pill, picture, headline } = pieces(t)
const thumb = x => x.thumb ? t.put(t.item('thumb'), { href: x.href, picture: picture(x, 'thumb') }) : ''

export const fill = {
    'front:f': (page, ctx) => {
        const m = model(ctx), [first, ...rest] = m.articles
        const pic = first && picture(first, 'card', false)
        const week = m.week.map(w => ({ ...w, what: w.what.length > 90 ? w.what.slice(0, 89) + '…' : w.what }))
        page.before = (page.before || '') + t.put(t.part('page'), {
            name: ctx.md.esc(ctx.SITE.name), wordmark: WORDMARK(''), opening_at: m.openingAt, opening_in: m.openingIn, count: m.articles.length,
            '#nav': t.many('nav', m.nav), '#asks': t.many('ask', m.asks),
            '#stats': t.many('stat', m.nums.slice(0, 3).map(n => ({ value: n.value, label: n.label.split(/[ ,]/)[0] }))),
            '#week': t.many('week', week), '#week_again': t.many('week', week.map(w => ({ ...w, tab: ' tabindex="-1"' }))),
            lead: first ? t.put(t.part('lead'), { href: first.href, headline: headline(first), dek: first.dekShort, pill: pill(first), figure: pic ? t.put(t.item('figure'), { href: first.href, picture: pic }) : '' }) : '',
            '#ranked': rest.slice(0, 8).map(x => t.put(t.item('rank'), { beat: x.beat, href: x.href, title: x.title, thumb: thumb(x) })).join(''),
            '#cards': rest.slice(8, 14).map(x => t.put(t.item('card'), { beat: x.beat, href: x.href, title: x.title, thumb: thumb(x) })).join(''),
            '#radar': t.many('radar', m.fields.slice(0, 7)),
            '#next': t.many('next', m.next),
        })
        return ''
    },
}
export const decorate = p => homeAssets(p, 'f')
