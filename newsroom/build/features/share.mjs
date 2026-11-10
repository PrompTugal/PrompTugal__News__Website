// The share row (spec: SGit-AI/SGit-AI__Website__Web-Summit people/angelo/proposals/share/spec-share.md, approved by
// Angelo on 9 November 2026: LinkedIn, X, WhatsApp, Email, Copy link; top of every public page and the end of each
// article). Built by dev.venues@PrompTugal.angelo; markup moved into markdown by writer@PrompTugal.angelo (the
// quality gate: no markup in code), For: dev@PrompTugal.dinis.
//   decorate   sets page.share (the shell draws it under the lead) and, on an article, adds the row again at the end;
//              the row is markdown (a `::: share` layout hook around plain links), rendered by lib/markdown.mjs
//   assets     share.js (Copy link; the phone's own share sheet where the browser has one) and share.css
//   validate   every public page has the row; each link is one of four hosts or mailto:, carries the page's canonical
//              address and no utm_; no share script from another site
// The links are plain and work with no script. Nothing is loaded from another site, nothing is sent anywhere until the
// reader taps a link. Undo: delete this file, assets/share/, the share words in data/site/site.json (and its schema
// entry) and the one ${page.share} line in lib/shell.mjs.
import { noindex } from '../lib/seo.mjs'
import { render } from '../lib/markdown.mjs'
export const order = 97
export const assets = { css: ['assets/share/share.css'], js: ['assets/share/share.js'] }
const HOSTS = ['www.linkedin.com', 'twitter.com', 'wa.me']
const NEVER = /^(login\/|account\/|profile\/|offline\/|404\.html$)/
export const wanted = p => !p.raw && p.listed !== false && !noindex(p) && p.type !== 'account' && !NEVER.test(p.rel)
const plain = s => String(s ?? '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim()
// encodeURIComponent leaves ( ) ! ' * as they are; a markdown link needs the brackets encoded too
const enc = s => encodeURIComponent(s).replace(/[()!'*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
export function links(url, title, summary) {
    const u = enc(url), t = enc(title)
    return [
        ['linkedin', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
        ['x', `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
        ['whatsapp', `https://wa.me/?text=${enc(title + ' ' + url)}`],
        ['email', `mailto:?subject=${t}&body=${enc((summary ? summary + '\n\n' : '') + url)}`],
    ]
}
export function row(page, ctx, where) {
    const W = ctx.SITE.share, url = ctx.BASE + page.rel, summary = plain(page.summary)
    const items = links(url, page.title, summary).map(([k, h]) => `[${W.targets[k]}](${h})`).join(' ')
    const md = `::: share share-${where}\n` + (where === 'end' ? `**${W.end}**\n\n` : '') + `${W.label}: ${items}\n:::\n`
    return render(md).html
}
export function decorate(page, ctx) {
    if (!ctx.SITE.share || !wanted(page)) return
    page.share = row(page, ctx, 'top')
    if (page.type === 'article') {
        const prev = page.postHtml, end = row(page, ctx, 'end')
        page.postHtml = html => (prev ? prev(html) : html) + '\n' + end
    }
}
const block = (html, cls) => { const i = html.indexOf(`class="share ${cls}"`); if (i < 0) return ''; const j = html.indexOf('</div>', i); return html.slice(i, j < 0 ? undefined : j) }
export function validate(gate) {
    const out = [], sitemap = gate.generated.has('sitemap.xml') ? gate.text('sitemap.xml') : ''
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].slice(gate.BASE.length)).filter(r => r.endsWith('.html') && !NEVER.test(r))
    if (!locs.length) return ['share: no pages in sitemap.xml to check']
    for (const rel of locs) {
        if (!gate.generated.has(rel)) continue
        const html = gate.text(rel)
        if (/<meta name="page-type" content="account"/.test(html)) continue
        if (!/<p class="twin">/.test(html)) continue                         // a raw page with its own markup (the investors' site)
        const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1]
        const top = block(html, 'share-top')
        if (!top) { out.push(`${rel}: no share row`); continue }
        const hrefs = [...top.matchAll(/<a href="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&'))
        if (hrefs.length !== 4) out.push(`${rel}: the share row has ${hrefs.length} links, not 4`)
        for (const href of hrefs) {
            if (/utm_/i.test(href)) out.push(`${rel}: a share link carries utm_`)
            if (href.startsWith('mailto:')) { if (!decodeURIComponent(href).includes(canon)) out.push(`${rel}: email share without the canonical address`); continue }
            let u; try { u = new URL(href) } catch { out.push(`${rel}: a share link is not a URL`); continue }
            if (!HOSTS.includes(u.host)) out.push(`${rel}: a share link goes to ${u.host}`)
            if (!decodeURIComponent(u.search).includes(canon)) out.push(`${rel}: a share link to ${u.host} does not carry ${canon}`)
        }
        if (/<script[^>]+src="https?:\/\/[^"]*share/i.test(html)) out.push(`${rel}: loads a share script from another site`)
        if (/<meta name="page-type" content="article"/.test(html) && !block(html, 'share-end')) out.push(`${rel}: an article without the share row at its end`)
        if (out.length > 20) { out.push('share: more than 20 problems, stopping'); break }
    }
    return out
}
