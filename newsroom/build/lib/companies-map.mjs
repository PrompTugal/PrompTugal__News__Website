// From the team's company map (or the newsroom's earlier data/companies.json, which has the same public fields) to
// this newsroom's folder per company. Pure functions, shared by newsroom/tools/companies.mjs (which writes the folders)
// and newsroom/tools/derive.mjs (which reads the people and the organisation names out of the sources).
import { ident } from './ids.mjs'

// the public fields of a company in the team's map; everything else (why_it_matters, decision, priority, owner,
// status, assets) is the team's own notes, not facts about the company, and is never read
export const PUBLIC = ['id', 'name', 'website', 'what', 'category', 'country', 'attending', 'attending_as', 'sources']

export const countrySlug = c => ident(String(c).replace(/\s*\(.*$/, ''))
export const countryName = c => String(c).replace(/\s*\(.*$/, '').trim()

export function sourceKind(url) {
    if (/websummit\.com\/appearances\//.test(url)) return 'summit-appearance'
    if (/websummit\.com\/sessions\//.test(url)) return 'summit-session'
    if (/websummit\.com\/attendees\//.test(url)) return 'summit-attendee'
    if (/websummit\.com\//.test(url)) return 'summit-list'
    return 'other'
}

// which identity fields a source supports, from its "supports" note (keyword match, published as such)
const FIELD_RULES = {
    name: s => /appearance page|attendee page/i.test(s.supports) || /\/appearances\//.test(s.url),
    website: s => /website|own site|own GitHub/i.test(s.supports),
    what: s => /elevator pitch|"what" field|what the [a-z ]+ (does|is)|description/i.test(s.supports),
    category: s => /industry/i.test(s.supports),
    country: s => /country/i.test(s.supports),
    attending: s => /websummit\.com\//.test(s.url),
    attending_as: s => /websummit\.com\//.test(s.url),
}
export const FIELD_SOURCES_METHOD = "Keyword match on each source's \"supports\" note (newsroom/build/lib/companies-map.mjs, FIELD_RULES); a field that no note names cites every source."

export function fieldSources(sources) {
    const out = {}
    for (const [field, rule] of Object.entries(FIELD_RULES)) {
        const ids = sources.filter(rule).map(s => s.id)
        out[field] = ids.length ? ids : sources.map(s => s.id)
    }
    return out
}

// "Name, Role, ..., Organisation" (a trailing legal form such as ", Inc." stays with the organisation)
export function splitListing(text) {
    const parts = text.split(/,\s+/)
    if (parts.length < 3) return null
    let org = parts.pop()
    if (/^(inc|ltd|llc|plc|gmbh|sa|corp)\.?$/i.test(org) && parts.length > 2) org = parts.pop() + ', ' + org
    const name = parts.shift()
    return { name: name.trim(), role: parts.join(', ').trim(), organisation: org.trim() }
}

// a person listed in a source's note, in the three shapes the team's curator wrote
export function listingOf(s) {
    let m
    if ((m = s.supports.match(/^LIS26 attendee page: ([^;]+);/))) return splitListing(m[1])
    if ((m = s.supports.match(/^public speaker listed by Web Summit for LIS26: (.+)$/))) return splitListing(m[1])
    if ((m = s.supports.match(/^(.+?): public speaker listed by Web Summit for LIS26$/))) return splitListing(m[1])
    return null
}

// the names the summit's pages use for the company, each with the source that uses it
export function aliasesOf(c, sources) {
    const out = [], add = (name, source, how) => { name = name.trim(); if (name && !out.some(a => a.name === name)) out.push({ name, source, how }) }
    add(c.name, sources[0]?.id || null, 'the name in the team\'s map')
    const m = c.name.match(/^(.+?)\s*\((.+)\)$/)
    if (m) { add(m[1], sources[0]?.id || null, 'the name in the team\'s map, before the brackets'); add(m[2], sources[0]?.id || null, 'the name in the team\'s map, in the brackets') }
    for (const s of sources) {
        let x
        if ((x = s.supports.match(/names (.+?) as the speaker's organisation/))) add(x[1], s.id, "the session page names it as the speaker's organisation")
        const l = listingOf(s)
        if (l && sourceKind(s.url) !== 'other') add(l.organisation, s.id, 'the organisation a summit page lists its speaker under')
        if ((x = s.supports.match(/^LIS26 appearance page: ([^,;]+), /)) && !/^name$/i.test(x[1])) add(x[1], s.id, 'the name on its summit appearance page')
    }
    return out
}

// is the company said to host this session?
export function hostsSession(s, sources) {
    if (/hosted by this company|\[Hosted by/i.test(s.supports)) return true
    const sessions = sources.filter(x => sourceKind(x.url) === 'summit-session')
    return sessions.length === 1 && sources.some(x => /hosts the session/i.test(x.supports))
}

// the folder for one company: { company, sources, facts, edges } (recheck is handled by the tool: it is a log)
export function companyFolder(c, read, by) {
    const sources = c.sources.map((s, i) => ({ id: `s${i + 1}`, url: s.url, read_on: s.read_on, read_by: read.by, supports: s.supports || s.what || '', kind: sourceKind(s.url) }))
    const fs_ = fieldSources(sources)
    const company = {
        id: c.id, type: 'company', name: c.name, website: c.website || null, what: c.what, category: c.category, country: c.country,
        attending: c.attending, attending_as: c.attending_as,
        field_sources: fs_, field_sources_method: FIELD_SOURCES_METHOD,
        aliases: aliasesOf(c, sources),
        from: { repository: read.repository, path: read.path, read_on: read.read_on, by: read.by },
    }
    const facts = sources.map(s => ({ id: `f-${s.id}`, claim: s.supports, source: s.id, read_on: s.read_on, by: read.by }))
    const edges = [
        { verb: 'filed_under', to: `topic:${c.category}`, source: fs_.category[0], by },
        { verb: 'based_in', to: `place:${countrySlug(c.country)}`, source: fs_.country[0], by, ...(countryName(c.country) !== c.country ? { note: c.country } : {}) },
        ...sources.filter(s => s.kind === 'summit-session').map(s => ({ verb: hostsSession(s, sources) ? 'hosts' : 'appears_in', to_url: s.url, source: s.id, by })),
    ]
    return { company, sources, facts, edges }
}
