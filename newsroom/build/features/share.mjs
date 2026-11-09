// The share row (spec: SGit-AI/SGit-AI__Website__Web-Summit people/angelo/proposals/share/spec-share.md, approved by
// Angelo on 9 November 2026: LinkedIn, X, WhatsApp, Email, Copy link; top of every public page and the end of each
// article). Built by dev.venues@PrompTugal.angelo, For: dev@PrompTugal.dinis.
//   decorate   sets page.share (the shell draws it under the lead) and, on an article, adds the row again at the end
//   assets     share.js (the phone's own share sheet, else the list; Copy link) and share.css
//   validate   every public page has the row; each link is one of four hosts or mailto:, carries the page's canonical
//              address and no utm_; no share script from another site
// The links are plain and built here: they work with no script. Nothing is loaded from another site, nothing is sent
// anywhere until the reader taps a link. Undo: delete this file, assets/share/, the share words in data/site/site.json
// and the one ${page.share} line in lib/shell.mjs.
import { noindex } from '../lib/seo.mjs'
export const order = 97
export const assets = { css: ['assets/share/share.css'], js: ['assets/share/share.js'] }
const HOSTS = ['www.linkedin.com', 'twitter.com', 'wa.me']
const NEVER = /^(login\/|account\/|profile\/|offline\/|404\.html$)/
export const wanted = p => !p.raw && p.listed !== false && !noindex(p) && p.type !== 'account' && !NEVER.test(p.rel)
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const plain = s => String(s ?? '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim()
const ICON = {
    share: '<path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7"/>',
    linkedin: '<path d="M5 9v10M5 5v.01M10 19v-6a3 3 0 0 1 6 0v6M10 9v10"/>',
    x: '<path d="M5 4l14 16M19 4L5 20"/>',
    whatsapp: '<path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z"/>',
    email: '<path d="M3 6h18v12H3zM3 6l9 7 9-7"/>',
    copy: '<path d="M9 9h11v11H9zM5 15H4V4h11v1"/>',
}
const svg = k => `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICON[k]}</svg>`
export function links(url, title, summary) {
    const u = encodeURIComponent(url), t = encodeURIComponent(title)
    return [
        ['linkedin', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
        ['x', `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
        ['whatsapp', `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`],
        ['email', `mailto:?subject=${t}&body=${encodeURIComponent((summary ? summary + '\n\n' : '') + url)}`],
    ]
}
export function row(page, ctx, where) {
    const W = ctx.SITE.share, url = ctx.BASE + page.rel, title = page.title, summary = plain(page.summary)
    const a = links(url, title, summary).map(([k, h]) => `<a class="share-to share-${k}" href="${esc(h)}" target="_blank" rel="noopener" data-share="${k}">${svg(k)}<span>${esc(W.targets[k])}</span></a>`).join('')
    return `<div class="share share-${where}" data-url="${esc(url)}" data-title="${esc(title)}" data-text="${esc(summary)}">` +
        (where === 'end' ? `<p class="share-head">${esc(W.end)}</p>` : '') +
        `<button type="button" class="share-open" aria-expanded="false" hidden>${svg('share')}<span>${esc(W.label)}</span></button>` +
        `<div class="share-list" role="group" aria-label="${esc(W.label)}"><span class="share-label">${esc(W.label)}</span>${a}` +
        `<button type="button" class="share-to share-copy" data-share="copy" data-copied="${esc(W.copied)}" hidden>${svg('copy')}<span>${esc(W.copy)}</span></button>` +
        `<span class="share-said visually-hidden" role="status" aria-live="polite"></span></div></div>`
}
export function decorate(page, ctx) {
    if (!ctx.SITE.share || !wanted(page)) return
    page.share = row(page, ctx, 'top')
    if (page.type === 'article') {
        const prev = page.postHtml, end = row(page, ctx, 'end')
        page.postHtml = html => (prev ? prev(html) : html) + '\n' + end
    }
}
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
        if (!/class="share share-top"/.test(html)) { out.push(`${rel}: no share row`); continue }
        for (const [, k, h] of html.matchAll(/<a class="share-to share-([a-z]+)" href="([^"]+)"/g)) {
            const href = h.replace(/&amp;/g, '&')
            if (/utm_/i.test(href)) out.push(`${rel}: share link ${k} carries utm_`)
            if (href.startsWith('mailto:')) { if (!decodeURIComponent(href).includes(canon)) out.push(`${rel}: email share without the canonical address`); continue }
            let u; try { u = new URL(href) } catch { out.push(`${rel}: share link ${k} is not a URL`); continue }
            if (!HOSTS.includes(u.host)) out.push(`${rel}: share link ${k} goes to ${u.host}`)
            if (!decodeURIComponent(u.search).includes(canon)) out.push(`${rel}: share link ${k} does not carry ${canon}`)
        }
        if (/<script[^>]+src="https?:\/\/[^"]*share/i.test(html)) out.push(`${rel}: loads a share script from another site`)
        if (/<meta name="page-type" content="article"/.test(html) && !/class="share share-end"/.test(html)) out.push(`${rel}: an article without the share row at its end`)
        if (out.length > 20) { out.push('share: more than 20 problems, stopping'); break }
    }
    return out
}
