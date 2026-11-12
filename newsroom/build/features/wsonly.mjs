// The websummit-only pass, step 3 (lib/wsonly.mjs; board/passes/2026-11-11-only-websummit-sourced-comes-off.md): when
// the switch is on, a page taken off is not linked from anywhere. Articles, decisions and notes written by hand keep
// their words; a link to a company, person, session, organisation or place that came off becomes its plain text.
import path from 'node:path'
export const order = 98
const KIND = { companies: 'companies', people: 'people', events: 'events', organisations: 'organisations', places: 'places', evidence: 'evidence' }

// the same in markdown (the page's source after its markers are filled, and its twin): build.mjs calls this
export function unlinkMd(md, rel, g) {
    if (!g || !md) return md
    const dir = path.posix.dirname(rel)
    const gone = href => { const t = path.posix.normalize(path.posix.join(dir, href.split(/[#?]/)[0])), m = t.match(/^([a-z]+)\/([^/]+)\/(?:index\.(?:html|md))?$/)
        return !!(m && KIND[m[1]] && g[KIND[m[1]]].has(m[2])) }
    return md.replace(/(?<!!)\[([^\]]*)\]\(([^)\s]+)\)/g, (a, text, href) => /^[a-z]+:|^\/\//i.test(href) || !gone(href) ? a : text)
}
export function decorate(p, ctx) {
    const g = ctx?.store?.wsGone; if (!g || p.raw) return
    const dir = path.posix.dirname(p.rel), prev = p.postHtml
    const gone = href => { const t = path.posix.normalize(path.posix.join(dir, href.split(/[#?]/)[0])), m = t.match(/^([a-z]+)\/([^/]+)\/(?:index\.(?:html|md))?$/)
        return !!(m && KIND[m[1]] && g[KIND[m[1]]].has(m[2])) }
    p.postHtml = h => (prev ? prev(h) : h).replace(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (a, href, text) => /^[a-z]+:|^\/\//i.test(href) || !gone(href) ? a : text)
}

// the gate (security@'s pre-review, condition 2): with the switch on, nothing in the inventory is served, built or raw.
// A built file may not name a person, session, organisation, place or company that came off (by ref or by its page);
// a raw file under data/ or desks/ the deploy still copies may not be one of theirs.
import { wsSwitch, wsInventory } from '../lib/wsonly.mjs'
import { execFileSync } from 'node:child_process'
export function validate(gate) {
    const i = wsInventory(); if (!wsSwitch().on || !i) return []
    const out = [], strip = r => String(r).replace(/^[a-z]+:/, '')
    const G = { person: new Set(i.people.map(x => strip(x.person))), event: new Set(i.events.map(x => strip(x.event))), organisation: new Set(i.organisations.map(x => strip(x.organisation))), place: new Set(i.places.map(x => strip(x.place))), company: new Set(i.companies.filter(c => c.left_with_nothing).map(c => strip(c.company))), evidence: new Set(evGone(gate)) }
    const DIR = { people: 'person', events: 'event', organisations: 'organisation', places: 'place', companies: 'company', evidence: 'evidence' }
    const drop = new Set(gate.text('api/v1/deploy-exclude.txt').split('\n').filter(Boolean).map(l => l.slice(1)))
    const hit = t => { for (const m of t.matchAll(/\b(person|event|organisation|place|company|evidence):([a-z0-9-]+)/g)) if (G[m[1]].has(m[2])) return m[0]
        for (const m of t.matchAll(/(?<=^|["'(\s=]|\.\.\/|promptugal\.news\/)\/?(people|events|organisations|places|companies|evidence)\/([a-z0-9-]+)\//gm)) if (G[DIR[m[1]]].has(m[2])) return m[0]
        return null }
    for (const f of gate.generated) { if (!/\.(html|md|json|txt|xml)$/.test(f) || drop.has(f)) continue
        const h = hit(gate.text(f)); if (h) out.push(`${f}: serves ${h}, which rests only on websummit.com (the pass 2026-11-11-only-websummit-sourced-comes-off)`) }
    for (const f of execFileSync('git', ['ls-files', 'data/', 'desks/'], { cwd: gate.ROOT }).toString().split('\n')) {
        const m = f.match(/^data\/(people|events|organisations|places|companies|evidence)\/([^/]+)\//)
        if (m && G[DIR[m[1]]].has(m[2]) && !drop.has(f)) out.push(`${f}: served raw, and it rests only on websummit.com`) }
    return out
}
// the evidence captures whose source is websummit.com (lib/wsonly.mjs wsApply takes them by the host rule)
import fs from 'node:fs'
import { isWs } from '../lib/wsonly.mjs'
function evGone(gate) { const d = `${gate.ROOT}/data/evidence`; if (!fs.existsSync(d)) return []
    return fs.readdirSync(d).filter(id => { try { return isWs(JSON.parse(fs.readFileSync(`${d}/${id}/capture.json`, 'utf8')).source_url) } catch { return false } }) }
