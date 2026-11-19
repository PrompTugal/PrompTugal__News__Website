/*! The PrompTugal sites bar v1.2.0, the build-time renderer (dev@PrompTugal.dinis, from designer@'s board/spec-the-sites-bar.md).
 * Each site vendors this file (pinned by version and sha256, as listed in promptugal.news/api/v1/sites.json `bar`), reads the
 * registry at build time and calls render(registry, { here }) to get the bar's HTML for every page. Safety (the spec's):
 * at most 32 sites, every field at most 200 characters; each url parsed with new URL: https only, no user info, no port,
 * the hostname exactly promptugal.news or ending .promptugal.news; accent #rrggbb or ink; every value HTML-escaped where it
 * lands. One bad entry and the whole registry is refused (render returns ''). No dependencies. */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
export function okUrl(u) {
    let x; try { x = new URL(String(u)) } catch { return false }
    return x.protocol === 'https:' && !x.username && !x.password && !x.port && (x.hostname === 'promptugal.news' || x.hostname.endsWith('.promptugal.news')) && x.pathname === '/' && !x.search && !x.hash
}
const field = v => typeof v === 'string' && v.length > 0 && v.length <= 200
export function check(reg) {
    const s = reg && Array.isArray(reg.sites) ? reg.sites : null
    if (!s || !s.length || s.length > 32) return null
    for (const e of s) {
        if (!e || !field(e.id) || !/^[a-z0-9.-]+$/.test(e.id) || !field(e.name) || !field(e.line) || !okUrl(e.url)) return null
        for (const k of ['preview', 'version_url']) if (e[k] != null && !(field(e[k]) && (() => { try { const u = new URL(e[k]); return u.protocol === 'https:' && u.hostname === new URL(e.url).hostname && !u.port && !u.username && !u.password } catch { return false } })())) return null
        if (e.accent != null && !/^#[0-9a-f]{6}$/i.test(e.accent)) return null
    }
    return s
}
// h(name, attrs, inner): one element, every attribute value escaped (inner is already safe HTML)
const h = (n, a, inner = '') => '<' + n + Object.entries(a || {}).filter(([, v]) => v != null && v !== false).map(([k, v]) => ` ${k}="${esc(v)}"`).join('') + '>' + inner + '</' + n + '>'
// here: this site's hostname (e.g. 'promptugal.news'); the bar marks it with aria-current="page". newTab: open the other
// sites in a new tab (promptugal.news's rule for every link off the site, GR-22)
export function render(reg, { here = '', newTab = false } = {}) {
    const s = check(reg); if (!s) return ''
    const link = e => {
        const host = new URL(e.url).hostname, cur = host === here
        return h('li', null, h('a', { href: e.url, target: newTab && !cur ? '_blank' : null, rel: 'noopener noreferrer', 'aria-current': cur ? 'page' : null,             'data-name': e.name, 'data-host': host, 'data-line': e.line, 'data-preview': e.preview || new URL('preview.svg', e.url).href, 'data-version': e.version_url || new URL('version.json', e.url).href }, esc(e.name)))
    }
    const mark = h('span', { class: 'ptsb-mark' }, 'Promp' + h('b', null, 'T') + h('i', null, 'ugal') + '.news sites')
    return h('nav', { class: 'ptsb', 'aria-label': 'The PrompTugal.news sites' }, h('div', { class: 'ptsb-w' },
        mark + h('ul', null, s.map(link).join(''))))
}
