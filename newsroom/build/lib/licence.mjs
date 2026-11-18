// Every piece of data carries its licence (Dinis, 18 November 2026; board/guidance/2026-11-18-licences-and-submissions.md).
// ours(): what PrompTugal.news makes, CC BY 4.0. of(url): the licence of an item taken from someone else, from the hosts
// whose licence was read at the source (assets/licences/sources.json); otherwise a link to the source's own site, named
// "the source's terms" (never blank, never assumed open). dev@PrompTugal.dinis.
import { readFileSync } from 'node:fs'
const R = JSON.parse(readFileSync(new URL('../../../assets/licences/sources.json', import.meta.url), 'utf8'))
export const ours = () => ({ ...R.ours })
export function of(url) {
    let u; try { u = new URL(url) } catch { return null }
    if (u.hostname === 'promptugal.news' || u.hostname.endsWith('.promptugal.news')) return ours()
    const host = u.hostname.replace(/^www\./, '')
    for (const [h, l] of Object.entries(R.hosts)) if (host === h || host.endsWith('.' + h)) return { name: l.name, url: l.url }
    return { name: R.unknown, url: `${u.origin}/` }
}
// the file-level licence the build gives every JSON object that declares none: what we made, and that items taken from
// others carry their own
export const fileLicence = () => ({ ...R.ours, scope: 'what PrompTugal.news made in this file; an item taken from someone else carries its own license' })
