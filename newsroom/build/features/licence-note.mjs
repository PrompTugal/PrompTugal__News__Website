// "Licences on this page": every page that shows items taken from others names their licences (Dinis, 18 November 2026:
// board/guidance/2026-11-18-licences-and-submissions.md, "every piece of data carries its licence link", on the pages
// too). From the outside links in the page's own markdown: the hosts whose licence was read (assets/licences/sources.json)
// by name, the rest counted and sent to each source's terms. Not on articles (their twins are signed; they carry their
// licence in front matter) nor on translated pages (the translator's text). Words in assets/licences/page.json.
// dev@PrompTugal.dinis.
import { readFileSync } from 'node:fs'
import { of as licenceOf, ours } from '../lib/licence.mjs'
export const order = 990
const W = JSON.parse(readFileSync(new URL('../../../assets/licences/page.json', import.meta.url), 'utf8'))
const OWN = /(^|\.)(promptugal\.news|creativecommons\.org|opendatacommons\.org)$/i
const LOCALE = /^[a-z]{2}(-[A-Za-z]{2,4})?\//

export function decorate(p) {
    if (!p.md || p.raw || p.licenceNote || /^articles\//.test(p.rel || '') || LOCALE.test(p.rel || '') || /^(newsroom|board)\//.test(p.rel || '')) return
    const hosts = new Map()
    for (const m of p.md.matchAll(/\]\((https?:\/\/[^)\s]+)\)|<(https?:\/\/[^>\s]+)>/g)) {
        let h; try { h = new URL(m[1] || m[2]).hostname.replace(/^www\./, '') } catch { continue }
        if (OWN.test(h)) continue
        if (!hosts.has(h)) hosts.set(h, licenceOf(m[1] || m[2]))
    }
    if (!hosts.size) return
    p.licenceNote = true
    const o = ours(), known = new Map()
    for (const [h, l] of hosts) if (l && l.name !== W_UNKNOWN()) known.set(h, l)
    const rest = hosts.size - known.size
    p.md += `\n\n## ${W.heading} {#licences}\n\n` + [
        W.ours.replace('{ours}', `[${o.name}](${o.url})`),
        known.size ? W.known + '\n\n' + [...known].map(([h, l]) => `- ${h}: [${l.name}](${l.url})`).join('\n') : '',
        rest ? W.rest.replace('{n}', rest) : '',
        W.how.replace('{principle}', `${'../'.repeat((p.rel.match(/\//g) || []).length)}principles/licences/index.html`),
    ].filter(Boolean).join('\n\n') + '\n'
}
const W_UNKNOWN = () => JSON.parse(readFileSync(new URL('../../../assets/licences/sources.json', import.meta.url), 'utf8')).unknown
