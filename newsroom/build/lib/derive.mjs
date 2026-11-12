// The derivation: from what the desks write (desks/programme/agenda.json, desks/curator/*.json) and the hand-edited
// data (data/companies/, data/places/, data/topics/, data/curation/, hand-written entities), the derived entity files:
//   data/events/<slug>/event.json           every agenda item (organiser web-summit or other)
//   data/people/<slug>/person.json          every person a summit page lists, as listed (name, role, organisation)
//   data/organisations/<slug>/organisation.json   every organisation named that is not one of our companies
//   data/evidence/<id>/capture.json         the curator's captures (source, beat, names)
//   data/stories/<id>/story.json            every story and its column on the board (the curator's candidates, the
//                                           desks' drafts, checks, reviews and the articles: storyPipeline() below)
//   data/matching.json                      the report: what matched, what did not, and the near misses
// Pure: derive(readers) returns { files: { path: object } }. newsroom/tools/derive.mjs writes them; the gate re-derives
// in memory and fails if a committed derived file differs. A derived file carries "derived"; a hand-written entity
// (no "derived") in the same folder always wins over a derived one with the same slug.
import { ident, nameKey } from './ids.mjs'
import { listingOf, sourceKind } from './companies-map.mjs'

export const BY = 'newsroom/tools/derive.mjs'
const HANDLE = /(^|[\s(,;])@[A-Za-z0-9_]{2,}/g
const SUMMIT_VENUE = /^(.*?)(?: \(([^()]+)\))?, (MEO Arena and FIL|FIL)$/
const LEGAL_TAIL = /^(inc|ltd|llc|plc|gmbh|sa|corp)\.?$/i

// "Name (Role, Organisation)": the last top-level bracket is the listing; inside it, the organisation is after the
// last top-level comma (a trailing legal form such as ", Inc." stays with it). A bare name has no role or organisation.
export function parseSpeaker(s) {
    s = s.trim()
    if (!s.endsWith(')')) return { name: s, role: null, organisation: null }
    let depth = 0, open = -1
    for (let k = s.length - 1; k >= 0; k--) {
        if (s[k] === ')') depth++
        else if (s[k] === '(') { depth--; if (depth === 0) { open = k; break } }
    }
    if (open <= 0) return { name: s, role: null, organisation: null }
    const name = s.slice(0, open).trim(), inside = s.slice(open + 1, -1)
    const cuts = []
    depth = 0
    for (let k = 0; k < inside.length; k++) {
        if (inside[k] === '(') depth++
        else if (inside[k] === ')') depth--
        else if (depth === 0 && inside.startsWith(', ', k)) cuts.push(k)
    }
    if (!cuts.length) return { name, role: inside.trim(), organisation: null }
    let cut = cuts[cuts.length - 1]
    if (LEGAL_TAIL.test(inside.slice(cut + 2).trim()) && cuts.length > 1) cut = cuts[cuts.length - 2]
    return { name, role: inside.slice(0, cut).trim(), organisation: inside.slice(cut + 2).trim() }
}

// shows_as (the iOS app's request via conductor@, 9 November): "free" for presence events, which a calendar must not
// count as a clash; "busy" for the rest (talks, panels, workshops). Agrees with the apps' shared schedule rules
// (PrompTugal/PrompTugal__App__Mobile formats/schedule-rules/rules.json at 7433286: the free title patterns and the
// 180-minute threshold), plus what our data knows and a title cannot: the kind (registration, the summit and its
// opening nights, festivals, programmes, competitions, conferences), all_day and a multi-day span.
const FREE_KINDS = new Set(['registration', 'summit', 'festival', 'programme', 'competition', 'conference'])
const FREE_TITLE = ['registration', 'badge pick', 'opening night', 'opening party', 'start of the show', 'start-of-the-show', 'doors open', 'venue open', 'venue hours', 'all day', 'all-day']
const FREE_MIN_MINUTES = 180
export function showsAs(e) {
    if (FREE_KINDS.has(e.kind) || e.all_day === true || (e.end_date && e.end_date !== e.date)) return 'free'
    const title = String(e.title || '').toLowerCase()
    if (FREE_TITLE.some(p => title.includes(p))) return 'free'
    const m = String(e.time || '').match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/)
    if (m) { let d = (+m[3] * 60 + +m[4]) - (+m[1] * 60 + +m[2]); if (d < 0) d += 1440; if (d >= FREE_MIN_MINUTES) return 'free' }
    return 'busy'
}
const timeParts = t => { const m = String(t || '').match(/^(\d{2}:\d{2})-(\d{2}:\d{2})$/); return m ? { start: m[1], end: m[2] } : { start: null, end: null } }
const sessionSlug = url => { const m = String(url || '').match(/websummit\.com\/sessions\/lis26\/([0-9a-f]{8})[0-9a-f-]*\/([^/]+)\/?$/); return m ? { slug: ident(m[2]), uuid8: m[1] } : null }
const titleBase = what => ident(String(what).replace(/\s*[:(].*$/, '').trim() || what, 48)
const byKey = (a, b) => a < b ? -1 : a > b ? 1 : 0

export function derive({ agenda, curator, companies, places, topics, handEvents, handOrgs, handPeople, curation, pipeline = { ideas: [], drafts: [], checks: [], reviews: [], articles: [] } }) {
    const files = {}
    const report = { speaker_organisations: { matched: [], unmatched: [], near_misses: [] }, places: { unmatched_where: [] }, tracks: { mapped: [], unmapped: [] }, company_sessions: { resolved: [], unresolved: [] }, people: { merged_listings: [] }, evidence_names: { matched: [], unmatched: [] }, hosted_by: [], handles_dropped: 0 }

    // ---- organisation names -> companies (aliases, each from a company source) or curated organisations
    const aliasIndex = new Map()   // nameKey -> { ref, how }
    for (const c of companies) for (const a of c.aliases || []) {
        const k = nameKey(a.name)
        if (k && !aliasIndex.has(k)) aliasIndex.set(k, { ref: `company:${c.id}`, how: `alias "${a.name}" (${a.how}${a.source ? `, source ${a.source}` : ''})` })
    }
    for (const s of curation.organisations.same_as || []) aliasIndex.set(nameKey(s.as_listed), { ref: `company:${s.company}`, how: `same_as in data/curation/organisations.json: ${s.why}` })
    for (const o of handOrgs) for (const n of [o.name, ...(o.names_as_listed || [])]) {
        const k = nameKey(n)
        if (k && !aliasIndex.has(k)) aliasIndex.set(k, { ref: `organisation:${o.id}`, how: 'a hand-written organisation' })
    }
    const markers = new Set((curation.organisations.markers || []).map(nameKey))
    const notSame = new Set((curation.organisations.not_same || []).map(x => `${nameKey(x.as_listed)}|${x.company}`))
    const orgs = new Map()   // slug -> organisation being built
    const orgSlugOfKey = new Map()
    // resolve a name as listed: a company, a hand-written organisation, or a derived organisation (created here)
    function resolveOrg(asListed, src) {
        const k = nameKey(asListed)
        if (!k) return null
        const hit = aliasIndex.get(k)
        if (hit) return hit.ref
        let slug = orgSlugOfKey.get(k)
        if (!slug) {
            slug = ident(k)   // from the name's key, so the slug does not depend on which spelling was read first
            while (orgs.has(slug) && orgs.get(slug).key !== k) slug += '-2'
            orgSlugOfKey.set(k, slug)
        }
        if (!orgs.has(slug)) orgs.set(slug, { key: k, id: slug, names: new Set(), sources: new Map() })
        const o = orgs.get(slug)
        o.names.add(asListed)
        if (src && !o.sources.has(src.url)) o.sources.set(src.url, src)
        return `organisation:${slug}`
    }

    // ---- places: the summit's "Stage (Track), Venue" form, else an exact match of the whole "where"
    const placeByMatch = new Map()
    for (const p of places) for (const m of p.matches || []) placeByMatch.set(m, p.id)
    const tracks = new Map()
    const topicOfTrack = new Map()
    for (const t of topics) for (const tr of t.summit_tracks || []) topicOfTrack.set(tr, t.id)
    function placeOf(where) {
        if (!where) return { place: null, track: null }
        const m = where.match(SUMMIT_VENUE)
        if (m) {
            const stage = m[1].trim(), track = m[2] ? m[2].trim() : (stage === 'Centre Stage' ? 'Centre Stage' : null)
            const id = placeByMatch.get(stage) || placeByMatch.get(where)
            if (!id) report.places.unmatched_where.push(where)
            return { place: id ? `place:${id}` : null, track }
        }
        const id = placeByMatch.get(where)
        if (!id) report.places.unmatched_where.push(where)
        return { place: id ? `place:${id}` : null, track: null }
    }

    // ---- events
    const handEventIds = new Set(handEvents.map(e => e.id))
    const items = agenda.items.map((it, index) => ({ it, index }))
    const baseOf = ({ it }) => (sessionSlug(it.session_url || it.source_url) || {}).slug || titleBase(it.what)
    const counts = new Map()
    for (const x of items) counts.set(baseOf(x), (counts.get(baseOf(x)) || 0) + 1)
    const used = new Set(handEventIds)
    const events = []
    const people = new Map()
    const splits = new Map((curation.speakers?.splits || []).map(x => [x.as_listed, x]))
    const ruleKind = new Map((curation.events.kind || []).map(r => [r.source_url, r.kind]))
    for (const x of items) {
        const { it } = x
        let slug = baseOf(x)
        const ss = sessionSlug(it.session_url || it.source_url)
        if (counts.get(slug) > 1) slug = ss ? `${slug}-${ss.uuid8}` : `${slug}-${it.date}`
        if (used.has(slug) && it.where) slug = `${slug}-${ident(it.where, 24)}`
        let n = 2, base = slug
        while (used.has(slug)) slug = `${base}-${n++}`
        used.add(slug)
        const { place, track } = placeOf(it.where)
        if (track) {
            if (!tracks.has(track)) tracks.set(track, { name: track, source: it.source_url })
        }
        const organiser = it.kind === 'side-event' ? 'other' : 'web-summit'
        let kind = { registration: 'registration', announcement: 'announcement', pitch: 'pitch', 'night-summit': 'night-summit', 'side-event': 'side-event' }[it.kind]
        if (it.kind === 'summit') kind = /opening night/i.test(it.what) ? 'summit' : 'session'
        if (it.kind === 'team-pick') kind = track === 'Press Conference' ? 'announcement' : track === 'PITCH' ? 'pitch' : track === 'Night Summit' ? 'night-summit' : 'session'
        if (ruleKind.has(it.source_url)) kind = ruleKind.get(it.source_url)
        const src = { url: it.session_url || it.source_url, read_at: it.read_at, by: agenda.agent }
        const speakers = (it.speakers || []).map(raw => {
            // a social handle in a listing is not published (house rules: no social links, no contact details)
            const s = raw.replace(HANDLE, '').replace(/,\s*,/g, ',').replace(/\s+\)/g, ')').replace(/,\s*\)/g, ')').replace(/\s{2,}/g, ' ').trim()
            if (s !== raw) report.handles_dropped++
            const split = splits.get(raw)
            const p = split ? { name: parseSpeaker(s).name, role: split.role, organisation: split.organisation } : parseSpeaker(s)
            const org = p.organisation ? resolveOrg(p.organisation, { ...src, how: 'a speaker card on the event page' }) : null
            if (p.organisation) (org.startsWith('company:') ? report.speaker_organisations.matched : report.speaker_organisations.unmatched).push({ as_listed: p.organisation, ref: org, event: `event:${slug}` })
            const pid = ident(p.name)
            if (!people.has(pid)) people.set(pid, { id: pid, name: p.name, listings: [] })
            people.get(pid).listings.push({ role: p.role, organisation: p.organisation, org, event: `event:${slug}`, as_listed: s, source: src.url, read_at: it.read_at, by: agenda.agent })
            return { person: `person:${pid}`, as_listed: s, role: p.role, organisation: p.organisation, org }
        })
        const hosted = []
        const hm = it.what.match(/\[?hosted by ([^\]]+?)\]?\s*$/i)
        if (hm) {
            const org = resolveOrg(hm[1].trim(), { ...src, how: 'the session title names it as host' })
            hosted.push({ org, as_listed: hm[1].trim(), source: src.url })
            report.hosted_by.push({ event: `event:${slug}`, as_listed: hm[1].trim(), ref: org })
        }
        const { start, end } = timeParts(it.time)
        events.push({
            id: slug, type: 'event', title: it.what, kind, listed_as: it.kind, organiser,
            our_pick: it.kind === 'team-pick' || /team's data\/events\.json/.test(it.via || ''),
            date: it.date, time: it.time || null, start, end,
            ...(it.all_day === true ? { all_day: true } : {}),
            shows_as: showsAs({ kind, title: it.what, all_day: it.all_day, date: it.date, end_date: it.end_date, time: it.time }),  // only when the agenda says so; a null time without it is 'time to be confirmed' (synthetic@'s F60)
            where: it.where || null, place, track,
            part_of: null,
            organised_by: organiser === 'web-summit' ? 'organisation:web-summit' : null,
            speakers, hosted_by: hosted,
            ...(it.note ? { note: it.note } : {}),
            session_url: it.session_url || null, source_url: it.source_url, read_at: it.read_at, read_by: agenda.agent,
            ...(it.via ? { via: it.via } : {}),
            derived: { by: BY, from: ['desks/programme/agenda.json', 'data/places/', 'data/curation/events.json', 'data/curation/speakers.json'], item: x.index },
        })
    }
    // umbrellas
    const allEvents = [...handEvents, ...events]
    for (const rule of curation.events.part_of || []) {
        const parent = rule.parent || (() => { const e = allEvents.find(e => e.source_url === rule.parent_source_url); return e ? `event:${e.id}` : null })()
        if (!parent) continue
        for (const e of events) {
            if (`event:${e.id}` === parent || e.part_of) continue
            if (rule.when.organiser && e.organiser !== rule.when.organiser) continue
            if (rule.when.source_prefix && !String(e.source_url).startsWith(rule.when.source_prefix)) continue
            e.part_of = parent
        }
    }
    // company sessions (edges by URL in data/companies/<id>/edges.json) resolved to events
    const eventByUrl = new Map()
    for (const e of allEvents) for (const u of [e.session_url, e.source_url]) if (u && /\/sessions\//.test(u)) eventByUrl.set(u.replace(/\/?$/, '/'), e.id)
    for (const c of companies) for (const ed of c.edges || []) if (ed.to_url) {
        const id = eventByUrl.get(ed.to_url.replace(/\/?$/, '/'))
        ;(id ? report.company_sessions.resolved : report.company_sessions.unresolved).push({ company: `company:${c.id}`, verb: ed.verb, url: ed.to_url, ...(id ? { event: `event:${id}` } : { why: 'no event in the programme has this page: the programme desk found it answering 404 on 4 November, or has not read it' }) })
    }

    // ---- people listed in the companies' own sources (attendee pages): linked to that company by provenance
    for (const c of companies) for (const s of c.sources || []) {
        const l = listingOf(s)
        if (!l || sourceKind(s.url) === 'other') continue
        const pid = ident(l.name)
        if (!people.has(pid)) people.set(pid, { id: pid, name: l.name, listings: [] })
        people.get(pid).listings.push({ role: l.role, organisation: l.organisation, org: `company:${c.id}`, event: null, as_listed: s.supports, source: s.url, read_at: `${s.read_on}T00:00Z`, by: s.read_by })
    }

    // ---- the curator's captures and story candidates (later runs revise earlier ones)
    const evidence = new Map(), stories = new Map()
    for (const f of curator) {
        for (const c of f.data.captures || []) {
            const names = (c.names || []).map(n => {
                const ref = resolveOrg(n, { url: c.source_url, read_at: (String(f.data.run).match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z/) || [null])[0], by: f.data.agent, how: "named in a research capture, as the curator mapped it" })
                ;(ref.startsWith('company:') ? report.evidence_names.matched : report.evidence_names.unmatched).push({ as_listed: n, ref, evidence: `evidence:${c.id}` })
                return { as_listed: n, ref }
            })
            evidence.set(c.id, {
                id: c.id, type: 'evidence', source_url: c.source_url, beat: c.beat, group: c.group && c.group !== 'none' ? c.group : null,
                names, desk_file: f.path, run: f.data.run, by: f.data.agent,
                derived: { by: BY, from: [f.path] },
            })
        }
        for (const s of f.data.story_candidates || []) {
            const was = stories.get(s.id)
            const topic = topics.find(t => t.beat === s.beat)
            stories.set(s.id, {
                id: s.id, type: 'story', title: s.title, beat: s.beat, topic: topic ? `topic:${topic.id}` : null, status: 'idea',
                rests_on: s.rests_on.map(r => `evidence:${r}`),
                desk_files: [...(was ? was.desk_files : []), f.path],
                derived: { by: BY, from: [...(was ? was.derived.from : []), f.path] },
            })
        }
    }

    storyPipeline(stories, pipeline, topics, curator)

    // ---- assemble the files (sorted, so the output is stable)
    const handOrgIds = new Set(handOrgs.map(o => o.id)), handPeopleIds = new Set(handPeople.map(p => p.id))
    for (const e of events.sort((a, b) => byKey(a.id, b.id))) files[`data/events/${e.id}/event.json`] = { $schema: '../../schemas/event.schema.json', ...e }
    for (const p of [...people.values()].sort((a, b) => byKey(a.id, b.id))) {
        if (handPeopleIds.has(p.id)) continue
        const listings = p.listings.sort((a, b) => byKey(b.read_at, a.read_at) || byKey(a.source, b.source))
        const orgsListed = [...new Set(listings.map(l => l.org).filter(Boolean))]
        if (orgsListed.length > 1) report.people.merged_listings.push({ person: `person:${p.id}`, organisations: orgsListed })
        const first = listings[0]
        files[`data/people/${p.id}/person.json`] = {
            $schema: '../../schemas/person.schema.json', id: p.id, type: 'person', name: p.name,
            role: first.role, organisation: first.organisation, org: first.org,
            listings: listings.map(l => ({ role: l.role, organisation: l.organisation, org: l.org, event: l.event, source: l.source, read_at: l.read_at, by: l.by })),
            derived: { by: BY, from: ['desks/programme/agenda.json', 'data/companies/'] },
        }
    }
    for (const o of [...orgs.values()].sort((a, b) => byKey(a.id, b.id))) {
        if (handOrgIds.has(o.id)) continue
        const names = [...o.names].sort()
        const srcs = [...o.sources.values()].sort((a, b) => byKey(a.url, b.url))
        files[`data/organisations/${o.id}/organisation.json`] = {
            $schema: '../../schemas/organisation.schema.json', id: o.id, type: 'organisation',
            name: names.slice().sort((a, b) => a.length - b.length || byKey(a, b))[0], names_as_listed: names,
            ...(names.some(n => markers.has(nameKey(n))) ? { marker: true, marker_note: 'A listing placeholder (the card names no organisation), flagged and kept as listed.' } : {}),
            sources: srcs.map(s => ({ url: s.url, ...(s.read_at ? { read_at: s.read_at } : {}), by: s.by, how: s.how })),
            derived: { by: BY, from: ['desks/programme/agenda.json', 'desks/curator/', 'data/companies/'] },
        }
    }
    for (const e of [...evidence.values()].sort((a, b) => byKey(a.id, b.id))) files[`data/evidence/${e.id}/capture.json`] = { $schema: '../../schemas/evidence.schema.json', ...e }
    for (const s of [...stories.values()].sort((a, b) => byKey(a.id, b.id))) files[`data/stories/${s.id}/story.json`] = { $schema: '../../schemas/story.schema.json', ...s }

    // ---- the report
    const uniq = (list, key) => { const m = new Map(); for (const x of list) { const k = key(x); const y = m.get(k) || { ...x, count: 0 }; y.count++; m.set(k, y) } return [...m.values()] }
    const R = report.speaker_organisations
    R.matched = uniq(R.matched, x => x.as_listed).map(({ event, ...x }) => ({ ...x, how: aliasIndex.get(nameKey(x.as_listed))?.how })).sort((a, b) => byKey(a.as_listed, b.as_listed))
    R.unmatched = uniq(R.unmatched, x => x.as_listed).map(({ event, ...x }) => x).sort((a, b) => byKey(a.as_listed, b.as_listed))
    // near misses: an organisation (not one of our companies) whose name contains, or is contained in, one of our
    // companies' names, word for word; left unlinked for a person to decide in data/curation/organisations.json
    const companyKeys = [...aliasIndex.entries()].filter(([, v]) => v.ref.startsWith('company:'))
    for (const o of [...orgs.values()].sort((a, b) => byKey(a.id, b.id))) {
        const words = ` ${o.key} `
        for (const [ak, v] of companyKeys) {
            if (ak.length < 3 || notSame.has(`${o.key}|${v.ref.slice(8)}`)) continue
            if (words.includes(` ${ak} `) || ` ${ak} `.includes(words)) R.near_misses.push({ organisation: `organisation:${o.id}`, names_as_listed: [...o.names].sort(), company: v.ref, why_not_linked: `the names share "${o.key.length < ak.length ? o.key : ak}" but are not the same name; confirm in data/curation/organisations.json (same_as or not_same)` })
        }
    }
    report.not_same = (curation.organisations.not_same || []).map(x => ({ as_listed: x.as_listed, company: `company:${x.company}`, why: x.why }))
    report.evidence_names.matched = uniq(report.evidence_names.matched, x => x.as_listed).map(({ evidence, ...x }) => x).sort((a, b) => byKey(a.as_listed, b.as_listed))
    report.evidence_names.unmatched = uniq(report.evidence_names.unmatched, x => x.as_listed).map(({ evidence, ...x }) => x).sort((a, b) => byKey(a.as_listed, b.as_listed))
    report.places.unmatched_where = [...new Set(report.places.unmatched_where)].sort()
    report.tracks.mapped = [...tracks.keys()].filter(t => topicOfTrack.has(t)).sort().map(t => ({ track: t, topic: `topic:${topicOfTrack.get(t)}` }))
    report.tracks.unmapped = [...tracks.keys()].filter(t => !topicOfTrack.has(t)).sort()
    files['data/matching.json'] = {
        $schema: 'schemas/matching.schema.json',
        about: 'The derivation\'s report (newsroom/tools/derive.mjs): which organisation names as listed matched one of our companies and how, which did not (each is an organisation of its own), the near misses left unlinked for a person to decide, the "where" strings no place matches, the summit tracks bridged to a topic or not, and the company session links that resolve to no event. Derived, never hand-edited.',
        counts: {
            speaker_organisations_matched: R.matched.length, speaker_organisations_unmatched: R.unmatched.length, near_misses: R.near_misses.length,
            places_unmatched: report.places.unmatched_where.length, tracks_mapped: report.tracks.mapped.length, tracks_unmapped: report.tracks.unmapped.length,
            company_sessions_resolved: report.company_sessions.resolved.length, company_sessions_unresolved: report.company_sessions.unresolved.length,
        },
        ...report,
        derived: { by: BY, from: ['desks/', 'data/companies/', 'data/places/', 'data/topics/', 'data/curation/'] },
    }
    files['data/websummit-only.json'] = websummitOnly({ files, companies, places, handEvents, handOrgs, handPeople })
    return { files }
}

// What rests only on websummit.com (Dinis, 11 Nov 2026 ~18:50; board/passes/2026-11-11-only-websummit-sourced-comes-off.md):
// every fact, edge, flow, product, listing and entity whose sources are all on Web Summit's hosts. Refs and ids only,
// never the facts themselves. An entity is "left with nothing" when none of its items has another public source.
export const WS_HOSTS = ['websummit.com', 'websummit.net']
export function isWebSummit(url) {
    let h; try { h = new URL(url).hostname.toLowerCase() } catch { return false }
    return WS_HOSTS.some(d => h === d || h.endsWith('.' + d))
}
// 'websummit' (all its sources are Web Summit's), 'other' (at least one is not), or 'none' (no source)
const restsOn = urls => { const u = urls.filter(Boolean); return !u.length ? 'none' : u.every(isWebSummit) ? 'websummit' : 'other' }
export function websummitOnly({ files, companies, places, handEvents, handOrgs, handPeople }) {
    const of = dir => Object.entries(files).filter(([k]) => k.startsWith(`data/${dir}/`) && !k.endsWith('/capture.json')).map(([, v]) => v)
    const tally = () => ({ total: 0, websummit_only: 0, other_source: 0, no_source: 0 })
    const add = (t, r) => { t.total++; t[{ websummit: 'websummit_only', other: 'other_source', none: 'no_source' }[r]]++ }
    const counts = { evidence: tally(), companies: tally(), company_facts: tally(), company_edges: tally(), company_flows: tally(), company_products: tally(), people: tally(), person_listings: tally(), events: tally(), organisations: tally(), places: tally() }
    const out = { evidence: [], companies: [], company_fields: [], company_items: [], people: [], person_listings: [], events: [], organisations: [], places: [] }
    for (const c of [...companies].sort((a, b) => byKey(a.id, b.id))) {
        const url = new Map(c.sources.map(s => [s.id, s.url]))
        const items = [['fact', 'facts', c.facts, x => x.id], ['edge', 'edges', c.edges, x => `${x.verb}>${x.to}`], ['flow', 'flows', c.flows, x => x.id], ['product', 'products', c.products, x => x.id]]
        let kept = 0, any = 0, factsLeft = 0
        for (const [kind, plural, list, idOf] of items) for (const x of list) {
            const r = restsOn([].concat(x.source).map(id => url.get(id) || null)); add(counts[`company_${plural}`], r); any++
            if (r === 'other') { kept++; if (kind === 'fact') factsLeft++ }
            if (r === 'websummit') out.company_items.push({ company: `company:${c.id}`, kind, id: idOf(x), source: x.source })
        }
        const shadows = c.sources.filter(s => s.url && !isWebSummit(s.url)).map(s => s.id).sort()
        const wsFields = Object.entries(c.field_sources || {}).filter(([, ids]) => restsOn([].concat(ids).map(id => url.get(id) || null)) === 'websummit').map(([f]) => f).sort()
        if (wsFields.length) out.company_fields.push({ company: `company:${c.id}`, fields: wsFields })
        const r = !any ? 'none' : kept ? 'other' : 'websummit'; add(counts.companies, r)
        if (r !== 'other' || !factsLeft) out.companies.push({ company: `company:${c.id}`, left_with_nothing: r !== 'other', facts_left: factsLeft, items: any, other_sources_on_file: shadows })
    }
    const handP = new Set(handPeople.map(p => p.id))
    for (const p of [...of('people'), ...handPeople].sort((a, b) => byKey(a.id, b.id))) {
        const ls = p.listings || []
        for (const l of ls) { const r = restsOn([l.source]); add(counts.person_listings, r); if (r === 'websummit') out.person_listings.push({ person: `person:${p.id}`, event: l.event || null }) }
        const r = restsOn([...ls.map(l => l.source), ...(p.sources || []).map(s => s.url || s), p.source].filter(x => typeof x === 'string')); add(counts.people, r)
        if (r === 'websummit') out.people.push({ person: `person:${p.id}`, ...(handP.has(p.id) ? { hand: true } : {}) })
    }
    for (const e of [...of('events'), ...handEvents].sort((a, b) => byKey(a.id, b.id))) {
        const r = restsOn([e.source_url, e.session_url, ...(e.hosted_by || []).map(h => h.source), ...(e.sources || []).map(s => s.url || s)].filter(x => typeof x === 'string')); add(counts.events, r)
        if (r === 'websummit') out.events.push({ event: `event:${e.id}`, kind: e.kind || null, ...(e.derived ? {} : { hand: true }) })
    }
    for (const o of [...of('organisations'), ...handOrgs].sort((a, b) => byKey(a.id, b.id))) {
        const r = restsOn((o.sources || []).map(s => s.url)); add(counts.organisations, r)
        if (r === 'websummit') out.organisations.push({ organisation: `organisation:${o.id}`, ...(o.derived ? {} : { hand: true }) })
    }
    for (const e of Object.entries(files).filter(([k]) => k.endsWith('/capture.json')).map(([, v]) => v).sort((a, b) => byKey(a.id, b.id))) {
        const r = restsOn([e.source_url].filter(x => typeof x === 'string')); add(counts.evidence, r)
        if (r === 'websummit') out.evidence.push({ evidence: `evidence:${e.id}` })
    }
    for (const pl of [...places].sort((a, b) => byKey(a.id, b.id))) {
        const r = restsOn([pl.source, ...(pl.sources || []).map(s => s.url || s)].filter(x => typeof x === 'string')); add(counts.places, r)
        if (r === 'websummit') out.places.push({ place: `place:${pl.id}` })
    }
    return {
        $schema: 'schemas/websummit-only.schema.json',
        about: 'What rests only on websummit.com, by ref; kept off the site until another source is cited.',
        hosts: WS_HOSTS, rule: 'board/guidance/2026-11-11-only-websummit-sourced-comes-off.md', counts, ...out,
        derived: { by: BY, from: ['desks/programme/agenda.json', 'data/companies/', 'data/events/', 'data/people/', 'data/organisations/', 'data/places/'] },
    }
}

// ---- the story pipeline (board/the-story-pipeline.md): each story's column follows its files, never a hand edit.
// Evidence, by story id (front matter `story:`, else the file name: drafts `<id>-<slug>.md`, checks and reviews `<id>.md`):
//   idea         a curator's candidate (desks/curator/*.json) or desks/<desk>/ideas/<id>.md
//   drafting     an idea whose file names an `assignee`
//   draft        desks/<desk>/drafts/<id>-<slug>.md
//   fact-check   desks/<desk>/checks/<id>.md
//   review       desks/<desk>/reviews/<id>.md (a reviewer desk's, or synthetic@'s on tone) with a verdict other than Ready
//   ready        a review from a reviewer desk with verdict Ready
//   waits-on-dinis  `needs: dinis` on the idea or the draft (with its `question`)
//   published    content/articles/<slug>.md with status published and its articles/<slug>.md.sig
//   held         `held: <why>` on the idea or the draft
// Precedence, strongest first: held, published, waits-on-dinis, ready, review, fact-check, draft, drafting, idea.
// An article with no `story:` is a story of its own, id = its slug. history: one move per evidence file, dated by
// the file's own date field (curator run, draft date, check date, review date, article date) and its agent.
const COLUMNS = ['idea', 'drafting', 'draft', 'fact-check', 'review', 'waits-on-dinis', 'ready', 'published', 'held']
const NEXT = { idea: 'someone takes it (assignee)', drafting: 'the draft, as a file in the desk', draft: 'the fact-check: every fact re-opened at its source', 'fact-check': 'a review', review: 'the writer answers the review', 'waits-on-dinis': "Dinis's word", ready: 'publish and sign', published: 'nothing: live and signed', held: 'whatever the hold names' }
function storyPipeline(stories, P, topics, curator) {
    const agentOf = v => v ? String(v).split(',')[0].trim() : null
    const day = v => (String(v || '').match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}Z)?/) || [null])[0]
    const base = p => p.split('/').pop().replace(/\.md$/, '')
    const idOf = (f, kind) => f.fm.story || (kind === 'draft' ? (base(f.path).match(/^([A-Za-z0-9]+)-/) || [])[1] : base(f.path))
    const ev = new Map()   // id -> what the files say
    const of = id => { if (!ev.has(id)) ev.set(id, { history: [], reviews: [] }); return ev.get(id) }
    const ensure = (id, f) => {
        if (!stories.has(id)) {
            const topic = f.fm.beat ? topics.find(t => t.beat === f.fm.beat || t.name === f.fm.beat) : null
            stories.set(id, { id, type: 'story', title: f.fm.title || id, beat: f.fm.beat || null, topic: topic ? `topic:${topic.id}` : null, status: 'idea', rests_on: [], desk_files: [f.path], derived: { by: BY, from: [] } })   // the file it was first seen in
        }
        const s = stories.get(id)
        if (!s.derived.from.includes(f.path)) s.derived.from.push(f.path)
        return s
    }
    // the curator's candidates: an idea, dated by the run that first proposed it
    for (const f of curator) for (const c of f.data.story_candidates || []) {
        const e = of(c.id)
        if (!e.history.some(h => h.column === 'idea')) e.history.push({ column: 'idea', at: day(f.data.run), by: f.data.agent || null, file: f.path })
    }
    for (const f of P.ideas) {
        const id = idOf(f, 'idea'); if (!id) continue
        ensure(id, f); const e = of(id)
        e.idea = f
        e.history.push({ column: 'idea', at: day(f.fm.date), by: agentOf(f.fm.author), file: f.path })
        if (f.fm.assignee) e.history.push({ column: 'drafting', at: day(f.fm.assigned || f.fm.date), by: agentOf(f.fm.assignee), file: f.path })
    }
    for (const f of P.drafts) {
        const id = idOf(f, 'draft'); if (!id) continue
        ensure(id, f); const e = of(id)
        e.draft = f
        e.history.push({ column: 'draft', at: day(f.fm.date), by: agentOf(f.fm.author), file: f.path })
        if (f.fm.needs === 'dinis') e.history.push({ column: 'waits-on-dinis', at: day(f.fm.date), by: agentOf(f.fm.author), file: f.path })
    }
    for (const f of P.checks) {
        const id = idOf(f, 'check'); if (!id || !stories.has(id)) continue
        const e = of(id); e.check = f; stories.get(id).derived.from.push(f.path)
        e.history.push({ column: 'fact-check', at: day(f.fm.checked || f.fm.date), by: agentOf(f.fm.checker || f.fm.author), file: f.path })
    }
    for (const f of P.reviews) {
        const id = idOf(f, 'review'); if (!id || !stories.has(id)) continue
        const e = of(id); stories.get(id).derived.from.push(f.path)
        const desk = f.path.split('/')[1], ready = /^reviewer-/.test(desk) && /^ready\b/i.test(f.fm.verdict || '')
        e.reviews.push({ file: f.path, verdict: f.fm.verdict || null, by: agentOf(f.fm.reviewer || f.fm.author), at: day(f.fm.reviewed || f.fm.date) })
        e.history.push({ column: ready ? 'ready' : 'review', at: day(f.fm.reviewed || f.fm.date), by: agentOf(f.fm.reviewer || f.fm.author), file: f.path })
        if (ready) e.ready = true
    }
    for (const f of P.articles) {
        const id = f.fm.story || base(f.path)
        ensure(id, f); const e = of(id)
        e.article = f
        if (f.fm.status === 'published' && f.signed) { e.published = true; e.history.push({ column: 'published', at: day(f.fm.date), by: agentOf(f.fm.author), file: f.path }) }
    }
    for (const [id, s] of stories) {
        const e = of(id), held = (e.draft && e.draft.fm.held) || (e.idea && e.idea.fm.held)
        const needs = (e.draft && e.draft.fm.needs === 'dinis') ? e.draft : (e.idea && e.idea.fm.needs === 'dinis') ? e.idea : null
        const assignee = (e.idea && agentOf(e.idea.fm.assignee)) || (e.draft && agentOf(e.draft.fm.author)) || (e.article && agentOf(e.article.fm.author)) || null
        s.status = held ? 'held' : e.published ? 'published' : needs ? 'waits-on-dinis' : e.ready ? 'ready' : e.reviews.length ? 'review' : e.check ? 'fact-check' : e.draft ? 'draft' : assignee ? 'drafting' : 'idea'
        s.assignee = assignee
        s.needs = needs ? { who: 'dinis', question: needs.fm.question || null } : null
        s.held = held || null
        s.draft = e.draft ? e.draft.path : null
        s.check = e.check ? e.check.path : null
        s.reviews = e.reviews.sort((a, b) => byKey(a.file, b.file))
        s.article = e.article ? { path: e.article.path, status: e.article.fm.status || null, signed: !!e.article.signed } : null
        s.next = NEXT[s.status]
        if (held) e.history.push({ column: 'held', at: day((e.draft || e.idea).fm.date), by: null, file: (e.draft && e.draft.fm.held ? e.draft : e.idea).path })
        s.history = e.history.sort((a, b) => byKey((a.at || '').slice(0, 10), (b.at || '').slice(0, 10)) || COLUMNS.indexOf(a.column) - COLUMNS.indexOf(b.column) || byKey(a.at || '', b.at || ''))   // by day, then by column
        s.derived.from = [...new Set(s.derived.from)]
    }
}
