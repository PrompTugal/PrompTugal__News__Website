// G, "The Magazine" (Silvio's mock G): a bold cover and colour sections. One of the home page's designs
// (board/team/conductor.b/briefs/2026-11-06-home-page-eight-designs.md); its component is assets/front-g/, its data the
// model every design shares (lib/home.mjs), its sections the correspondent's beats. Placed by <!-- front:g --> in
// content/index.md, before <!-- front:designs -->.
import { tmpl, model, pieces, homeAssets } from '../lib/home.mjs'
import { WORDMARK } from '../lib/shell.mjs'
export const order = 23
const t = tmpl('assets/front-g/front-g.tmpl'), { pill, picture, headline } = pieces(t)

export const fill = {
    'front:g': (page, ctx) => {
        const m = model(ctx), [first, second, third] = m.articles
        const pic = first && picture(first, 'card', false), used = new Set([first, second, third].filter(Boolean).map(x => x.slug))
        const shown = new Set()
        const sections = m.beats.slice(0, 3).map((b, n) => t.put(t.item('section'), { n, name: b.name,
            '#stories': b.articles.filter(x => !used.has(x.slug)).slice(0, 4).map(x => (shown.add(x.slug), x)).map(x => t.put(t.item('story'), { href: x.href, title: x.title,
                thumb: x.thumb ? t.put(t.item('thumb'), { picture: picture(x, 'thumb') }) : '' })).join('') }))
        const feat = m.articles.find(x => !used.has(x.slug) && !shown.has(x.slug) && x.card)
        page.before = (page.before || '') + t.put(t.part('page'), {
            name: ctx.md.esc(ctx.SITE.name), wordmark: WORDMARK(''), today: m.today, date: m.date, opening_at: m.openingAt, opening_in: m.openingIn,
            '#nav': t.many('nav', m.nav), '#asks': t.many('ask', m.asks), '#nums': t.many('num', m.nums),
            '#lines': [first, second, third].filter(Boolean).map((x, i) => t.put(t.item('line'), { href: x.href, kicker: i ? x.beat : 'Cover story', title: i ? x.title : headline(x) })).join(''),
            figure: pic ? t.put(t.item('figure'), { href: first.href, picture: pic }) : '',
            '#sections': sections.join(''),
            feature: feat ? t.put(t.item('feature'), { href: feat.href, beat: feat.beat, title: feat.title, dek: feat.dekShort, pill: pill(feat), picture: picture(feat, 'card') }) : '',
        })
        return ''
    },
}
export const decorate = p => homeAssets(p, 'g')
