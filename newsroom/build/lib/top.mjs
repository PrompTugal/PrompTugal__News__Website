// C, the top of every page (Dinis, 6 November 2026, about 13:20 UTC; board/spec-the-top-of-the-page.md; the pictures
// design/decisions/the-top-of-the-page/answered--{phone,desktop}.jpg). The shell puts both tops in every page; the
// switch (assets/top/top.js, in <head>) shows C, or A for the A/B test (?top=a). The component is assets/top/: its
// markup and words top.tmpl (filled here), its look top.css, its behaviour top.js. The values come from
// data/site/nav.json (the sections) and data/site/site.json (the name, the motto, the summit's start).
import fs from 'node:fs'
const T = fs.readFileSync(new URL('../../../assets/top/top.tmpl', import.meta.url), 'utf8')
const part = n => (T.split(`<!-- part:${n} -->\n`)[1] || '').split('\n<!-- ')[0]
const item = n => (T.split(`<!-- item:${n} -->`)[1] || '').split('\n')[0]
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const fill = (t, v) => t.replace(/\{\{(#?[a-z_]+)\}\}/g, (m, k) => v[k] ?? '')
const cur = on => on ? ' aria-current="page"' : ''
const links = (list, href, section) => list.map(n => fill(item('link'), { href: href(n.href), cur: cur(section === n.id), label: esc(n.label) })).join('')

function daysToGo(today, start) {
    const n = Math.round((Date.parse(String(start).slice(0, 10)) - Date.parse(today)) / 864e5)
    return n > 1 ? `${n} days to go` : n === 1 ? 'tomorrow' : ''
}

// the top row and the sections, right after the skip link
export function ctopHead({ up, href, site, section, shortDate, WORDMARK }) {
    const S = site.SITE, go = daysToGo(site.TODAY, S.countdown.start)
    return fill(part('head'), { up, name: esc(S.name), motto: esc(S.motto), today: site.TODAY, date: esc(shortDate), wordmark: WORDMARK(up),
        go: go ? fill(item('go'), { text: go }) : '', '#util': links(site.utility || [], href, section).replace(/<\/a><a/g, '</a> · <a'), '#nav': links(site.nav, href, section) })
}

// the tab bar (Now, Agenda, News, Companies, Search, More) and the More sheet, at the end of the body
// in the summit's week the Agenda tab opens today's day page (sherpa@'s A1: Events is 51 phone screens; the day page is
// what a reader planning the day needs); after the 13th it opens Events again. Built hourly, so "today" stays true.
const WEEK = ['2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13']
const agendaHref = (site, fallback) => WEEK.includes(site.TODAY) ? `days/${site.TODAY}/index.html` : fallback
export function ctabs({ up, href, site, section }) {
    const tabs = ['now', 'agenda', 'news', 'companies'].map(k => site.nav.find(n => n.id === k)).filter(Boolean)
        .map(n => fill(item('tab-' + n.id), { href: href(n.id === 'agenda' ? agendaHref(site, n.href) : n.href), cur: cur(section === n.id), label: esc(n.label) })).join('')
    return fill(part('tabs'), { up, '#tabs': tabs, search_cur: cur(section === 'search'), '#all': links([...site.nav, ...(site.utility || [])], href, section) })
}
