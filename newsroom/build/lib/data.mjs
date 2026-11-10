// The data: one folder per entity under data/<type>/<slug>/, JSON, each file kind with a schema in data/schemas/.
// readFolder() reads one type's folders; derivationInputs() gathers what lib/derive.mjs needs; loadData() gives the
// build a store with every entity, merged from its files, and the links between them (computed here, so no file
// repeats another). The layout and its rules are in data/README.md.
import fs from 'node:fs'
import path from 'node:path'
import { R, readJSON, walk } from './config.mjs'

export const TYPES = {   // type -> its folder under data/ and its main file
    company: { dir: 'companies', file: 'company.json' },
    event: { dir: 'events', file: 'event.json' },
    person: { dir: 'people', file: 'person.json' },
    organisation: { dir: 'organisations', file: 'organisation.json' },
    place: { dir: 'places', file: 'place.json' },
    topic: { dir: 'topics', file: 'topic.json' },
    story: { dir: 'stories', file: 'story.json' },
    evidence: { dir: 'evidence', file: 'capture.json' },
}
const strip = ({ $schema, ...x }) => x

export function readFolder(type) {
    const { dir, file } = TYPES[type]
    const root = R(`data/${dir}`)
    if (!fs.existsSync(root)) return []
    return fs.readdirSync(root).sort().filter(d => fs.existsSync(path.join(root, d, file)))
        .map(d => strip(JSON.parse(fs.readFileSync(path.join(root, d, file), 'utf8'))))
}

// a company is five files, and a sixth when its flows are mapped; merged here (sources, facts, edges, the re-check log,
// the flows: data/companies/<id>/flows.json, kept by the ontologist, read by features/companies.mjs)
export function readCompanies() {
    return readFolder('company').map(c => {
        const f = n => { const p = R(`data/companies/${c.id}/${n}.json`); return fs.existsSync(p) ? strip(JSON.parse(fs.readFileSync(p, 'utf8'))) : {} }
        return { ...c, sources: f('sources').sources || [], facts: f('facts').facts || [], edges: f('edges').edges || [], recheck: f('recheck').log || [], flows: f('flows').flows || [], products: f('products').products || [] }
    })
}

// the story pipeline's evidence (board/the-story-pipeline.md): the desks' markdown files that move a story between
// columns, each with its front matter (a flat "key: value" block; quotes stripped), and the articles with their .sig
export function frontMatter(text) {
    const m = /^---\n([\s\S]*?)\n---/.exec(text.replace(/\r\n/g, '\n'))
    const fm = {}
    if (m) for (const line of m[1].split('\n')) { const k = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(line); if (k) fm[k[1]] = k[2].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1') }
    return fm
}
export function readPipeline() {
    const rel = p => path.relative(R(''), p).split(path.sep).join('/')
    const md = (dir, re) => fs.existsSync(R(dir)) ? walk(R(dir), p => p.endsWith('.md')).map(rel).filter(r => re.test(r)).sort().map(r => ({ path: r, fm: frontMatter(fs.readFileSync(R(r), 'utf8')) })) : []
    return {
        ideas: md('desks', /^desks\/[^/]+\/ideas\/[^/]+\.md$/),
        drafts: md('desks', /^desks\/[^/]+\/drafts\/[^/]+\.md$/),
        checks: md('desks', /^desks\/[^/]+\/checks\/[^/]+\.md$/),
        reviews: md('desks', /^desks\/[^/]+\/reviews\/[^/]+\.md$/),
        articles: md('content/articles', /^content\/articles\/(?!index\.md$)[^/]+\.md$/).map(a => ({ ...a, signed: fs.existsSync(R(`articles/${path.basename(a.path)}.sig`)) })),
    }
}

export function derivationInputs() {
    const isHand = x => !x.derived
    return {
        agenda: readJSON('desks/programme/agenda.json'),
        curator: walk(R('desks/curator'), p => p.endsWith('.json')).map(p => ({ path: path.relative(R(''), p).split(path.sep).join('/'), data: JSON.parse(fs.readFileSync(p, 'utf8')) })),
        companies: readCompanies(),
        places: readFolder('place'),
        topics: readFolder('topic'),
        handEvents: readFolder('event').filter(isHand),
        handOrgs: readFolder('organisation').filter(isHand),
        handPeople: readFolder('person').filter(isHand),
        pipeline: readPipeline(),
        curation: { organisations: readJSON('data/curation/organisations.json'), events: readJSON('data/curation/events.json'), speakers: readJSON('data/curation/speakers.json') },
    }
}

// every committed file that the derivation owns (it carries "derived"), by path
export function derivedOnDisk() {
    const out = []
    for (const { dir, file } of Object.values(TYPES)) {
        const root = R(`data/${dir}`)
        if (!fs.existsSync(root)) continue
        for (const d of fs.readdirSync(root)) {
            const p = path.join(root, d, file)
            if (fs.existsSync(p) && JSON.parse(fs.readFileSync(p, 'utf8')).derived) out.push(`data/${dir}/${d}/${file}`)
        }
    }
    if (fs.existsSync(R('data/matching.json'))) out.push('data/matching.json')
    return out.sort()
}

export function loadData() {
    const store = {
        ontology: readJSON('data/ontology.json'),
        matching: fs.existsSync(R('data/matching.json')) ? strip(readJSON('data/matching.json')) : null,
        companies: readCompanies(),
        events: readFolder('event'), people: readFolder('person'), organisations: readFolder('organisation'),
        places: readFolder('place'), topics: readFolder('topic'), stories: readFolder('story'), evidence: readFolder('evidence'),
    }
    store.topics.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
    const byRef = new Map()
    const plural = { company: 'companies', event: 'events', person: 'people', organisation: 'organisations', place: 'places', topic: 'topics', story: 'stories', evidence: 'evidence' }
    for (const [type, list] of Object.entries(plural)) for (const x of store[list]) byRef.set(`${type}:${x.id}`, x)
    store.get = ref => byRef.get(ref)
    store.has = ref => byRef.has(ref)
    // company session links (by URL) resolved to events
    const eventByUrl = new Map()
    for (const e of store.events) for (const u of [e.session_url, e.source_url]) if (u && /\/sessions\//.test(u)) eventByUrl.set(u.replace(/\/?$/, '/'), e.id)
    store.eventOfUrl = url => eventByUrl.get(String(url).replace(/\/?$/, '/')) || null
    return store
}
