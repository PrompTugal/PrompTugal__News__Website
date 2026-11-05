/* site.js: what every interactive feature needs from the page, in one place (window.NRSite).
 *   NRSite.root              the site's root URL, from this script's own address (works at any depth, and on file://)
 *   NRSite.url(rel)          a path from the root (api/v1/companies.json) as a URL
 *   NRSite.local(url)        a canonical https://<host>/... address as this copy's URL (so links work on a preview)
 *   NRSite.fetchJSON(rel)    the parsed JSON, fetched once per page
 *   NRSite.mount(id)         #nr-tools, #nr-pane or #nr-live: the designer's mount point, made if the shell has none
 *   NRSite.now()             the time, as a Date; ?now=2026-11-10T11:52Z or window.__nrNow simulate another moment
 *   NRSite.canonical         this page's canonical URL; NRSite.base its site root (https://<host>/)
 */
(function (w) {
    'use strict'
    if (w.NRSite) return
    const me = document.currentScript && document.currentScript.src
    const canonical = (document.querySelector('link[rel="canonical"]') || {}).href || ''
    let root = me ? me.replace(/assets\/core\/site\.js(\?.*)?$/, '') : ''
    let base = ''
    try { const c = new URL(canonical); base = c.origin + '/' } catch (e) { /* no canonical */ }
    if (!root && canonical && base) {
        const rel = canonical.slice(base.length)
        root = location.href.split(/[?#]/)[0].replace(new RegExp(rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), '')
    }
    const cache = new Map()
    const url = rel => new URL(String(rel).replace(/^\//, ''), root).href
    const local = u => {
        const s = String(u || '')
        if (base && s.startsWith(base)) return url(s.slice(base.length))
        if (/^(https?:|mailto:|#)/.test(s)) return s
        return url(s)
    }
    function fetchJSON(rel) {
        const u = url(rel)
        if (!cache.has(u)) cache.set(u, fetch(u, { credentials: 'same-origin' }).then(r => { if (!r.ok) throw new Error(`${rel}: HTTP ${r.status}`); return r.json() }).catch(e => { cache.delete(u); throw e }))
        return cache.get(u)
    }
    function mount(id) {
        let el = document.getElementById(id)
        if (el) return el
        if (id === 'nr-tools') {
            el = document.createElement('div')
            el.id = id
            el.className = 'tools'
            const row = document.querySelector('nav.site .row') || document.querySelector('nav.site')
            if (row) row.appendChild(el)
            else document.body.insertBefore(el, document.body.firstChild)
        } else {
            el = document.createElement('div')
            el.id = id
            document.body.appendChild(el)
        }
        return el
    }
    function now() {
        let o = w.__nrNow
        if (o === undefined) { try { o = new URLSearchParams(location.search).get('now') || undefined } catch (e) { /* fine */ } }
        if (o !== undefined && o !== null) {
            let s = o
            if (typeof s === 'string') {
                if (/^\d{4}-\d\d-\d\d$/.test(s)) s += 'T09:00:00Z'
                else if (!/([zZ]|[+-]\d\d:?\d\d)$/.test(s)) s += 'Z'
            }
            const d = new Date(s)
            if (!isNaN(d)) return d
        }
        return new Date()
    }
    w.NRSite = { root, base, canonical, url, local, fetchJSON, mount, now, rel: base && canonical ? canonical.slice(base.length) : '' }
})(window)
