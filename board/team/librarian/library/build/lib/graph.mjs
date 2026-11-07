// The library graphs (round 3): graph/library-graph.json and graph/reality-tree.json, in the exact shape of
// api/v1/graph/explorer.json (id, version, about, grammar, counts, worlds, types, verbs, views, sources, nodes[], edges[]),
// so the site's own explorer (assets/graph/explorer.js, Cytoscape) draws them unchanged.
//
// The ranks and the layout come from the engine's own functions, imported READ ONLY from
// newsroom/build/features/graph/{rank,layout}.mjs (dev@'s files). If an import fails the graph falls back to degree
// only and a grid layout, and says so in its "about". graph/presets.json is a hand file (named views with captions in the
// style of assets/graph/captions.json); this step validates it and never writes it.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { readJson, readText, cmp, noDash, GENERATOR } from './util.mjs'
import { LINK_TYPES } from './linktypes.mjs'
import { loadDomains, MARK_BEGIN } from './reality.mjs'

const BASE = 'https://promptugal.news/'
const r4 = (x) => Math.round(x * 1e4) / 1e4
const label = (s, n = 80) => { const t = noDash(s).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t }
const day = (iso) => (/^\d{4}-\d{2}-\d{2}/.test(iso || '') ? iso.slice(0, 10) : null)
const accDay = (acc) => { const m = /^ACC-(\d{4})(\d{2})(\d{2})-/.exec(acc || ''); return m ? `${m[1]}-${m[2]}-${m[3]}` : null }
const isFile = (p) => !!p && !p.endsWith('/')

// ---- the engine's own ranking and layout, imported read only, with a fallback
export async function loadEngine(root) {
  const out = { rank: null, layout: null, note: null }
  const dir = path.join(root, 'newsroom/build/features/graph')
  try { out.rank = (await import(pathToFileURL(path.join(dir, 'rank.mjs')).href)).rank } catch (e) { out.note = `rank.mjs could not be imported (${e.code || e.message}); degree only` }
  try { out.layout = (await import(pathToFileURL(path.join(dir, 'layout.mjs')).href)).forceLayout } catch (e) { out.note = (out.note ? out.note + '; ' : '') + `layout.mjs could not be imported (${e.code || e.message}); a grid` }
  if (typeof out.rank !== 'function') out.rank = null
  if (typeof out.layout !== 'function') out.layout = null
  return out
}
function fallbackRank(n, pairs) {
  const degree = new Array(n).fill(0)
  for (const [a, b] of pairs) if (a !== b) { degree[a]++; degree[b]++ }
  const sum = degree.reduce((x, y) => x + y, 0) || 1
  return { degree, betweenness: degree.map(() => 0), edgeBetweenness: pairs.map(() => 0), pagerank: degree.map((d) => d / sum) }
}
function fallbackLayout(n) {
  const cols = Math.ceil(Math.sqrt(n))
  return Array.from({ length: n }, (_, i) => [(i % cols) * 90, Math.floor(i / cols) * 70])
}

// ---- assemble the explorer's shape from plain nodes and edges
function assemble({ id, version, about, worlds, types, verbs, views, nodes, edges, sources }, engine) {
  const n = nodes.length
  const pairs = edges.map((e) => [e.a, e.b])
  const R = (engine.rank || fallbackRank)(n, pairs)
  const XY = (engine.layout || fallbackLayout)(n, pairs)
  const vIdx = new Map(verbs.map((v, i) => [v.verb, i]))
  const outNodes = nodes.map((nd, i) => {
    const o = {}
    for (const k of ['id', 'type', 'label', 'page', 'src', 'kind', 'by', 'status', 'category', 'date', 'what', 'call']) if (nd[k] !== undefined && nd[k] !== null && nd[k] !== '') o[k] = nd[k]
    if (o.src === undefined) o.src = -1
    o.deg = R.degree[i]; o.bc = r4(R.betweenness[i] * 1000); o.pr = r4(R.pagerank[i] * 1000)
    o.x = XY[i][0]; o.y = XY[i][1]
    return o
  })
  const outEdges = edges.map((e, i) => [e.a, e.b, vIdx.get(e.verb), e.src === undefined ? -1 : e.src, e.read || 0, Math.round(R.edgeBetweenness[i])])
  return {
    id, version,
    about: about + (engine.note ? ` Note: ${engine.note}.` : ''),
    grammar: `${BASE}board/team/librarian/library/vocabulary/links.json`,
    counts: { nodes: outNodes.length, edges: outEdges.length },
    worlds, types, verbs, views, sources, nodes: outNodes, edges: outEdges,
  }
}

const VERB_META = {
  made_by: ['team', true, '{from} was made by {to}', '{to} made {from}'],
  part_of: ['team', false, '{from} is part of {to}', '{to} includes {from}'],
  cites: ['record', false, '{from} cites {to}', '{from} is cited by {to}'],
  about: ['reference', false, '{from} is about {to}', '{to} is the subject of {from}'],
  answers: ['team', false, '{from} answers {to}', '{to} is answered by {from}'],
  supersedes: ['record', false, '{from} supersedes {to}', '{to} is superseded by {from}'],
  derived_from: ['record', false, '{from} is derived from {to}', '{to} is the source of {from}'],
  see: ['record', false, '{from} is replaced by {to}', '{to} replaces {from}'],
  see_also: ['record', false, '{from} is related to {to}', '{to} is related to {from}'],
  owned_by: ['team', true, '{from} is owned by {to}', '{to} owns {from}'],
  evidenced_by: ['reality', false, '{from} is evidenced by {to}', '{to} is the evidence for {from}'],
  proposed_in: ['reality', false, '{from} is proposed in {to}', '{to} proposes {from}'],
}
const INV = { made_by: 'made', part_of: 'includes', cites: 'cited_by', about: 'subject_of', answers: 'answered_by', supersedes: 'superseded_by', derived_from: 'source_of', see: 'see_from', see_also: 'also_seen_from', owned_by: 'owns', evidenced_by: 'evidences', proposed_in: 'proposes' }
for (const t of LINK_TYPES) if (INV[t.rel] !== t.inverse) throw new Error(`graph.mjs: inverse of ${t.rel} is ${t.inverse}, not ${INV[t.rel]}`)
const verbList = (names) => names.map((v) => ({ verb: v, inverse: INV[v], world: VERB_META[v][0], bridge: VERB_META[v][1], reads: VERB_META[v][2], reads_inverse: VERB_META[v][3] }))

// each type's look is data (round 4): a Cytoscape shape and a hex colour the explorer applies per type (types[].shape, types[].color)
const LIB_TYPES = [
  ['agent', 'Agent', 'team', 'ellipse', '#2b6cb0'], ['pass', 'Pass', 'team', 'round-rectangle', '#b7791f'], ['finding', 'Finding', 'team', 'ellipse', '#a0aec0'],
  ['decision', 'Decision', 'team', 'diamond', '#1f7a3a'], ['idea', 'Idea of Dinis', 'team', 'ellipse', '#dd6b20'], ['question', 'Open question', 'team', 'triangle', '#c52830'],
  ['desk', 'Desk', 'team', 'hexagon', '#805ad5'],
  ['article', 'Article', 'record', 'rectangle', '#4a5568'], ['board', 'Board file', 'record', 'rectangle', '#718096'], ['page', 'Site page', 'record', 'tag', '#8a94a6'],
  ['collection', 'Collection', 'reference', 'round-rectangle', '#2f855a'], ['subject', 'Subject', 'reference', 'tag', '#319795'],
]
const REALITY_TYPES = [
  ['root', 'Root', 'reality', 'star', '#1f7a3a'], ['domain', 'Domain', 'reality', 'round-rectangle', '#2f855a'],
  ['exists', 'EXISTS', 'reality', 'ellipse', '#38a169'], ['proposed', 'PROPOSED', 'reality', 'ellipse', '#dd6b20'],
  ['card', 'Card (evidence)', 'evidence', 'rectangle', '#a0aec0'],
]
const typeList = (list) => list.map(([id, lab, world, shape, color]) => ({ id, label: lab, world, shape, color }))
const LIB_WORLDS = [
  { id: 'team', label: "The newsroom's work", types: ['agent', 'pass', 'finding', 'decision', 'idea', 'question', 'desk'] },
  { id: 'record', label: 'The record', types: ['article', 'board', 'page'] },
  { id: 'reference', label: 'Reference: collections and subjects', types: ['collection', 'subject'] },
]
const LIB_VERBS = ['made_by', 'part_of', 'cites', 'about', 'answers', 'supersedes', 'derived_from', 'see_also', 'owned_by']
const SHAPE_ABOUT = 'The library graph of PrompTugal.news in the explorer\'s own shape (the same as api/v1/graph/explorer.json, so /assets/graph/explorer.js draws it unchanged). nodes[i]: {id, type, label, page?, src (index into sources, -1 for none), kind (the call class and subclass), by (the maker), status, category (the first subject), date, what, call, deg, bc (betweenness x1000), pr (PageRank x1000), x, y (a force layout)}. edges[j]: [from node index, to node index, verb index, source index or -1, read date or 0, edge betweenness]. Each connection is stored once, in the direction the card asserts it; the explorer reads it either way with the verb and its inverse. types[] may carry shape and color (the explorer draws each type with them) and presets[] is the graph\'s own list of named views, in the shape of PRESETS in assets/graph/engine.js (the explorer opens on the first). '

const ENTITY_COLL = { company: 'DAT.CO', person: 'DAT.PE', organisation: 'DAT.ORG', place: 'DAT.PL', topic: 'DAT.TOP', concept: 'GDN.CONC' }

export function readCards(libDir) {
  const out = []
  const dir = path.join(libDir, 'catalogue')
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl')).sort()) {
    for (const l of readText(path.join(dir, f)).split('\n')) if (l.trim()) out.push(JSON.parse(l))
  }
  return out
}

// ---------------------------------------------------------------- the library graph
export function libraryGraphInput(ctx, cards) {
  const { libDir } = ctx
  const cls = readJson(path.join(libDir, 'classification.json'))
  const auth = readJson(path.join(libDir, 'authority/agent.json'), { records: [] }).records
  const subjects = new Map(readJson(path.join(libDir, 'vocabulary/subjects.json'), { records: [] }).records.map((r) => [r.id, r]))
  const authById = new Map(auth.map((r) => [r.id, r]))
  const formIdx = new Map()
  for (const r of auth) for (const f of r.forms || []) formIdx.set(String(f).toLowerCase(), r.id)
  const byId = new Map(cards.map((c) => [c.id, c]))
  const callOf = (c) => c.call.split(' ')[0]
  const live = cards.filter((c) => c.status !== 'withdrawn')

  // an agent card folds into its authority record
  const agentCardAuth = new Map()
  for (const c of live.filter((x) => x.type === 'agent')) {
    const key = c.id.slice(c.id.indexOf(':') + 1).replace(/-promptugal(-\d+)?$/, '').replace(/\./g, '-')
    const id = `auth:agent:${key}`
    if (authById.has(id)) agentCardAuth.set(c.id, id)
  }

  // links, forward only (the inverse is read backwards by the explorer)
  const forward = []
  for (const c of live) for (const l of c.links || []) if (!l.inv) forward.push([c, l])
  const strength = new Map()
  for (const [c, l] of forward) {
    if (l.rel === 'about' || l.rel === 'made_by' || l.to.startsWith('auth:') || l.to.startsWith('subj:')) continue
    strength.set(c.id, (strength.get(c.id) || 0) + 1)
    strength.set(l.to, (strength.get(l.to) || 0) + 1)
  }

  // which cards are single nodes: the work (passes, findings, decisions, ideas, questions, desks, articles) always;
  // board files and site pages only when they are connected enough or are what an idea or a pass cites
  const always = new Set(['pass', 'finding', 'idea', 'question', 'desk'])
  const citedByWork = new Set()
  for (const [c, l] of forward) if ((c.type === 'idea' || c.type === 'pass') && l.rel === 'cites' && byId.has(l.to)) citedByWork.add(l.to)
  const included = new Map() // card id -> node id (same)
  for (const c of live) {
    if (always.has(c.type)) included.set(c.id, c.id)
    else if (c.type === 'page' && (c.kind === 'decision' || c.kind === 'article')) included.set(c.id, c.id)
  }
  const pick = (type, kinds, cap, min) => {
    const cand = live.filter((c) => c.type === type && !included.has(c.id) && (kinds ? kinds.includes(c.kind) : true))
      .map((c) => ({ c, s: (strength.get(c.id) || 0) + (citedByWork.has(c.id) ? 3 : 0) }))
      .filter((x) => x.s >= min).sort((a, b) => b.s - a.s || cmp(a.c.id, b.c.id)).slice(0, cap)
    for (const x of cand) included.set(x.c.id, x.c.id)
  }
  pick('board', null, 260, 4)
  pick('page', ['newsroom', 'site'], 40, 4)

  // collections: CLASS.SUB
  const collOf = (c) => `coll:${callOf(c)}`
  const collIds = new Map()
  for (const c of live) {
    const k = callOf(c)
    if (!collIds.has(k)) collIds.set(k, `coll:${k}`)
  }
  // an entity page or concept is reached by its collection, not by itself
  const nodes = []
  const nodeIdx = new Map()
  const sources = []
  const srcIdx = new Map()
  const src = (p) => { if (!p) return -1; if (!srcIdx.has(p)) { srcIdx.set(p, sources.length); sources.push(p) } return srcIdx.get(p) }
  const addNode = (n) => { if (nodeIdx.has(n.id)) return; nodeIdx.set(n.id, nodes.length); nodes.push(n) }

  const subjCount = new Map()
  const authUsed = new Set()
  for (const [c, l] of forward) {
    if (l.to.startsWith('subj:')) subjCount.set(l.to, (subjCount.get(l.to) || 0) + 1)
    if (l.rel === 'made_by' && l.to.startsWith('auth:agent:')) authUsed.add(l.to)
  }
  // owners named on ideas
  const ownerAuth = (c) => {
    const owner = (c.facts && c.facts.owner) || ''
    const out = []
    for (const m of String(owner).matchAll(/([A-Za-z0-9.-]+)@/g)) {
      const id = formIdx.get(`${m[1]}@`.toLowerCase()) || formIdx.get(`${m[1]}@promptugal.dinis`.toLowerCase())
      if (id && !out.includes(id)) out.push(id)
    }
    return out
  }
  for (const c of live) if (c.type === 'idea') for (const a of ownerAuth(c)) authUsed.add(a)
  for (const id of agentCardAuth.values()) authUsed.add(id)

  for (const [k, id] of [...collIds].sort((a, b) => cmp(a[0], b[0]))) {
    const [klass, sub] = k.split('.')
    const cl = cls.classes[klass] || { name: klass, subs: {} }
    const n = live.filter((c) => callOf(c) === k).length
    addNode({ id, type: 'collection', label: label(`${cl.name}: ${cl.subs[sub] || sub}`), page: `board/team/librarian/library/finding-aids/${klass}.md`, src: -1, kind: k, status: 'current', what: `${n} cards in ${cl.name}, subclass ${sub} (${cl.subs[sub] || sub}). Entity pages and files that are not single nodes here are reached through this collection.`, call: k })
  }
  for (const id of [...authUsed].sort(cmp)) {
    const r = authById.get(id)
    if (!r) continue
    addNode({ id, type: 'agent', label: r.heading, page: isFile(r.role_file) ? r.role_file : undefined, src: src(r.role_file), kind: 'agent', status: 'current', what: r.note || undefined, category: undefined })
  }
  for (const id of [...subjCount.keys()].sort(cmp)) {
    const s = subjects.get(id)
    if (!s) continue
    addNode({ id, type: 'subject', label: label(s.heading), src: -1, kind: s.layer, status: 'current', what: s.scope ? label(s.scope, 200) : undefined })
  }
  const firstSubject = (c) => { const l = (c.links || []).find((x) => x.rel === 'about' && x.to.startsWith('subj:')); const s = l && subjects.get(l.to); return s ? s.heading : undefined }
  const nodeType = (c) => (c.type === 'page' ? (c.kind === 'decision' ? 'decision' : c.kind === 'article' ? 'article' : 'page') : c.type)
  for (const c of live) {
    if (!included.has(c.id) || c.type === 'agent') continue
    const p = c.where && c.where.path
    const made = c.provenance && c.provenance.made
    addNode({
      id: c.id, type: nodeType(c), label: label(c.title), page: isFile(p) ? p : undefined, src: src(isFile(p) ? p : null),
      kind: callOf(c), by: made && made.by ? made.by : undefined, status: c.status, category: firstSubject(c),
      date: day(made && made.on) || accDay(c.acc), what: c.what ? label(c.what, 200) : undefined, call: c.call,
    })
  }

  // where a link ends: a node, or the collection that holds what it ends at
  const target = (to) => {
    if (to.startsWith('auth:agent:')) return nodeIdx.has(to) ? to : null
    if (to.startsWith('subj:')) return nodeIdx.has(to) ? to : null
    if (to.startsWith('auth:')) { const m = /^auth:([a-z]+):/.exec(to); const k = m && ENTITY_COLL[m[1]]; return k && collIds.has(k) ? collIds.get(k) : null }
    if (agentCardAuth.has(to)) return agentCardAuth.get(to)
    if (included.has(to)) return to
    const c = byId.get(to)
    return c && c.status !== 'withdrawn' ? collOf(c) : null
  }
  const source = (c) => {
    if (c.type === 'agent') return agentCardAuth.get(c.id) || null
    return included.has(c.id) ? c.id : collOf(c)
  }
  const edges = []
  const seen = new Set()
  const add = (a, b, verb, srcPath, readDay) => {
    if (a == null || b == null || a === b) return
    const k = `${a}\u0000${b}\u0000${verb}`
    if (seen.has(k)) return
    seen.add(k)
    edges.push({ a: nodeIdx.get(a), b: nodeIdx.get(b), verb, src: src(srcPath), read: readDay })
  }
  // every single node sits in its collection; an agent sits in the collection of agent cards
  for (const c of live) if (included.has(c.id) && c.type !== 'agent') add(c.id, collOf(c), 'part_of', null, 0)
  for (const [cardId, authId] of agentCardAuth) add(authId, collOf(byId.get(cardId)), 'part_of', null, 0)
  for (const [c, l] of forward) {
    if (!LIB_VERBS.includes(l.rel)) continue
    const a = source(c)
    const b = target(l.to)
    if (!a || !b || !nodeIdx.has(a) || !nodeIdx.has(b)) continue
    const single = included.has(c.id) && !a.startsWith('coll:')
    const ev = c.provenance && c.provenance.evidence && c.provenance.evidence[0]
    const p = single && ev && ev.kind === 'file' ? String(ev.ref).replace(/#.*$/, '') : null
    add(a, b, l.rel, p, single ? accDay(c.acc) || 0 : 0)
  }
  // the owner of an idea (its owner field, read as an edge so the graph can show where each idea went)
  for (const c of live) {
    if (c.type !== 'idea') continue
    for (const a of ownerAuth(c)) if (nodeIdx.has(a)) add(c.id, a, 'owned_by', c.where.path, accDay(c.acc) || 0)
  }
  edges.sort((x, y) => x.a - y.a || x.b - y.b || LIB_VERBS.indexOf(x.verb) - LIB_VERBS.indexOf(y.verb))
  return { nodes, edges, sources, stats: { cards: live.length, single: included.size, collections: collIds.size } }
}

export async function buildLibraryGraph(ctx, cards, engine) {
  const g = libraryGraphInput(ctx, cards)
  const data = assemble({
    id: 'library-graph', version: ctx.catalogue.site_version || null,
    about: SHAPE_ABOUT + `The nodes are the library's cards, grouped to stay legible: ${g.stats.collections} collections (one per call class and subclass), the agents, the subjects, every pass, finding, idea, question, desk, decision and article, and the board files and pages with the most connections; the other ${g.stats.cards - g.stats.single} cards (the entity pages among them) are not single nodes: a connection to one ends at its collection. Owner edges (owned_by) are read from the owner field of an idea. Generated by ${GENERATOR} from the cards and their typed links; never edited by hand.`,
    worlds: LIB_WORLDS,
    types: typeList(LIB_TYPES),
    verbs: verbList(LIB_VERBS),
    views: [{ id: 'whole', label: 'The library graph', file: 'board/team/librarian/library/graph/library-graph.json' }],
    nodes: g.nodes, edges: g.edges, sources: g.sources,
  }, engine)
  return { data, stats: g.stats }
}

// ---------------------------------------------------------------- the reality tree
function bullets(text, headRe) {
  const out = []
  let on = false
  for (const l of text.split('\n')) {
    if (/^## /.test(l)) on = headRe.test(l)
    if (l.startsWith(MARK_BEGIN)) on = false
    if (on && /^\s*- /.test(l)) out.push(l.replace(/^\s*- /, ''))
  }
  return out
}
const evidencePaths = (line) => {
  const ev = /[Ee]vidence:\s*(.*)$/.exec(line)
  const scope = ev ? ev[1] : line
  return [...scope.matchAll(/`([^`\s]+)`/g)].map((m) => m[1].replace(/[.,;:]+$/, '')).filter((p) => /\//.test(p) || /\.[a-z]{2,4}$/.test(p))
}
const stripTag = (s) => s.replace(/^\[[A-Z]\]\s*/, '')

export function realityGraphInput(ctx, cards) {
  const { libDir } = ctx
  const { spec } = loadDomains(libDir)
  const byPath = new Map()
  for (const c of cards) {
    if (c.status === 'withdrawn' || !c.where || !c.where.path) continue
    if (['idea', 'concept', 'finding', 'question'].includes(c.type)) continue   // these share the ledger's or the pass's file
    const p = c.where.path.replace(/\/+$/, '')
    if (!byPath.has(p)) byPath.set(p, c)
  }
  const nodes = []
  const nodeIdx = new Map()
  const sources = []
  const srcIdx = new Map()
  const src = (p) => { if (!p) return -1; if (!srcIdx.has(p)) { srcIdx.set(p, sources.length); sources.push(p) } return srcIdx.get(p) }
  const addNode = (n) => { if (nodeIdx.has(n.id)) return; nodeIdx.set(n.id, nodes.length); nodes.push(n) }
  const edges = []
  const seen = new Set()
  const add = (a, b, verb, srcPath, read) => {
    const k = `${a}\u0000${b}\u0000${verb}`
    if (a === b || seen.has(k) || !nodeIdx.has(a) || !nodeIdx.has(b)) return
    seen.add(k)
    edges.push({ a: nodeIdx.get(a), b: nodeIdx.get(b), verb, src: src(srcPath), read: read || 0 })
  }
  const stamp = (() => { const m = /checked.*?(\d{4}-\d{2}-\d{2})/i.exec(readText(path.join(libDir, 'reality/index.md'))); return m ? m[1] : null })()
  addNode({ id: 'reality', type: 'root', label: 'Reality: the holdings by subject', page: 'board/team/librarian/library/reality/index.md', src: src('board/team/librarian/library/reality/index.md'), status: 'current', what: 'The root of the reality tree: one branch per domain, each with what EXISTS (with its evidence) and what is PROPOSED. It feeds REALITY.md and never replaces it.', date: stamp || undefined })
  const entries = []
  for (const d of spec.domains) {
    const dir = d.dir
    const exFile = `reality/${dir}/index.md`
    const prFile = `reality/${dir}/proposed/index.md`
    const ex = bullets(readText(path.join(libDir, exFile)), /^## EXISTS\b/)
    const pr = bullets(readText(path.join(libDir, prFile)), /^## PROPOSED\b/)
    if (!ex.length && !pr.length && d.id === 'misc') continue
    const did = `domain:${d.id}`
    addNode({ id: did, type: 'domain', label: label(d.name, 60), page: `board/team/librarian/library/${exFile}`, src: src(`board/team/librarian/library/${exFile}`), by: d.owner, status: 'current', kind: d.id, what: label(`${d.takes_in}. ${ex.length} EXISTS, ${pr.length} PROPOSED. Kept by ${d.owner}.`, 300) })
    entries.push({ d, did, ex, pr, exFile, prFile })
  }
  for (const e of entries) add(e.did, 'reality', 'part_of', null, 0)
  for (const e of entries) {
    e.ex.forEach((line, i) => {
      const id = `exists:${e.d.id}:${i + 1}`
      const tag = /^\[([A-Z])\]/.exec(line)
      const text = noDash(stripTag(line).replace(/\s*Evidence:.*$/i, '')).trim()
      addNode({ id, type: 'exists', label: label(text.split(/(?<=[.:;])\s/)[0] || text, 76), page: `board/team/librarian/library/${e.exFile}`, src: src(`board/team/librarian/library/${e.exFile}`), by: e.d.owner, status: 'exists', kind: tag ? (tag[1] === 'F' ? 'file' : 'claim') : 'item', category: e.d.id, what: label(noDash(stripTag(line)), 420) })
      add(id, e.did, 'part_of', `board/team/librarian/library/${e.exFile}`, 0)
      for (const p of evidencePaths(line)) {
        const c = byPath.get(p.replace(/\/+$/, ''))
        if (!c) continue
        if (!nodeIdx.has(c.id)) addNode({ id: c.id, type: 'card', label: label(c.title, 60), page: isFile(c.where.path) ? c.where.path : undefined, src: src(isFile(c.where.path) ? c.where.path : null), kind: c.call.split(' ')[0], status: 'current', call: c.call })
        add(id, c.id, 'evidenced_by', `board/team/librarian/library/${e.exFile}`, 0)
      }
    })
    e.pr.forEach((line, i) => {
      const id = `proposed:${e.d.id}:${i + 1}`
      const lead = /^(idea|spec|question|pass|finding|task|plan|decision|brief)\b[:\s]/.exec(line)
      const text = noDash(line.replace(/^(idea|question):[A-Za-z0-9-]+:\s*/, '$1 ')).trim()
      addNode({ id, type: 'proposed', label: label(text.split(/(?<=[.:;])\s/)[0] || text, 76), page: `board/team/librarian/library/${e.prFile}`, src: src(`board/team/librarian/library/${e.prFile}`), by: e.d.owner, status: 'proposed', kind: lead ? lead[1] : 'item', category: e.d.id, what: label(noDash(line), 420) })
      add(id, e.did, 'part_of', `board/team/librarian/library/${e.prFile}`, 0)
      for (const p of evidencePaths(line)) {
        const c = byPath.get(p.replace(/\/+$/, ''))
        if (!c) continue
        if (!nodeIdx.has(c.id)) addNode({ id: c.id, type: 'card', label: label(c.title, 60), page: isFile(c.where.path) ? c.where.path : undefined, src: src(isFile(c.where.path) ? c.where.path : null), kind: c.call.split(' ')[0], status: 'current', call: c.call })
        add(id, c.id, 'proposed_in', `board/team/librarian/library/${e.prFile}`, 0)
      }
    })
  }
  edges.sort((x, y) => x.a - y.a || x.b - y.b)
  return { nodes, edges, sources, stats: { domains: entries.length, exists: entries.reduce((n, e) => n + e.ex.length, 0), proposed: entries.reduce((n, e) => n + e.pr.length, 0) } }
}

export async function buildRealityGraph(ctx, cards, engine) {
  const g = realityGraphInput(ctx, cards)
  const verbs = ['part_of', 'evidenced_by', 'proposed_in']
  const data = assemble({
    id: 'reality-tree', version: ctx.catalogue.site_version || null,
    about: SHAPE_ABOUT + `The reality tree: a root, ${g.stats.domains} domains, ${g.stats.exists} EXISTS entries and ${g.stats.proposed} PROPOSED entries (each a line of reality/<domain>/index.md or proposed/index.md), and the cards that evidence them. part_of runs entry to domain to root; evidenced_by joins an EXISTS entry to the card its evidence path names; proposed_in joins a PROPOSED entry to the card it names. status is exists or proposed. A domain with few entries is where the tree is thin. Generated by ${GENERATOR}; never edited by hand.`,
    worlds: [{ id: 'reality', label: 'The reality tree', types: ['root', 'domain', 'exists', 'proposed'] }, { id: 'evidence', label: 'The evidence', types: ['card'] }],
    types: typeList(REALITY_TYPES),
    verbs: verbList(verbs),
    views: [{ id: 'whole', label: 'The reality tree', file: 'board/team/librarian/library/graph/reality-tree.json' }],
    nodes: g.nodes, edges: g.edges, sources: g.sources,
  }, engine)
  return { data, stats: g.stats }
}

// ---------------------------------------------------------------- presets (a hand file: validated, never written)
export function checkPresets(presets, graphs) {
  const errors = []
  if (!presets || typeof presets !== 'object' || !presets.presets) return ['presets.json: no "presets" object']
  const keys = Object.keys(presets.presets)
  for (const k of keys) {
    const p = presets.presets[k]
    if (!p.title || !p.caption || !p.label) errors.push(`presets.json: ${k} needs title, caption and label`)
    if (!p.state || p.state.view !== 'whole') errors.push(`presets.json: ${k} must have state.view "whole" (the explorer loads one file)`)
    const g = graphs[p.data]
    if (!g) { errors.push(`presets.json: ${k} has data ${p.data}, which is not a graph`); continue }
    const types = new Set(g.types.map((t) => t.id)), verbs = new Set(g.verbs.map((v) => v.verb)), worlds = new Set(g.worlds.map((w) => w.id))
    const ids = new Set(g.nodes.map((n) => n.id))
    for (const t of p.state.types || []) if (!types.has(t)) errors.push(`presets.json: ${k} names type ${t}, not in ${p.data}`)
    for (const v of p.state.verbs || []) if (!verbs.has(v)) errors.push(`presets.json: ${k} names verb ${v}, not in ${p.data}`)
    for (const w of p.state.worlds || []) if (!worlds.has(w)) errors.push(`presets.json: ${k} names world ${w}, not in ${p.data}`)
    for (const a of p.state.anchors || []) if (!ids.has(a)) errors.push(`presets.json: ${k} anchors ${a}, not a node of ${p.data}`)
  }
  return errors
}

// ---------------------------------------------------------------- shape validation (the tests and the check use it)
export function validateShape(g, name = 'graph') {
  const errs = []
  const top = ['id', 'version', 'about', 'grammar', 'counts', 'worlds', 'types', 'verbs', 'views', 'sources', 'nodes', 'edges']
  for (const k of top) if (!(k in g)) errs.push(`${name}: missing top-level key ${k}`)
  for (const k of Object.keys(g)) if (!top.includes(k) && k !== 'presets') errs.push(`${name}: extra top-level key ${k}`)
  if (errs.length) return errs
  if (g.counts.nodes !== g.nodes.length || g.counts.edges !== g.edges.length) errs.push(`${name}: counts ${JSON.stringify(g.counts)} for ${g.nodes.length} nodes and ${g.edges.length} edges`)
  const types = new Set(g.types.map((t) => t.id))
  const worlds = new Set(g.worlds.map((w) => w.id))
  for (const t of g.types) {
    if (!worlds.has(t.world)) errs.push(`${name}: type ${t.id} is in an unknown world ${t.world}`)
    if (t.shape !== undefined && !/^[a-z-]+$/.test(t.shape)) errs.push(`${name}: type ${t.id} has a shape the explorer would refuse: ${t.shape}`)
    if (t.color !== undefined && !/^#[0-9a-fA-F]{3,8}$/.test(t.color)) errs.push(`${name}: type ${t.id} has a colour the explorer would refuse: ${t.color}`)
  }
  for (const p of g.presets || []) {
    if (!p.key || !p.label || !p.state || p.state.view !== 'whole') errs.push(`${name}: preset ${p.key} needs key, label and a state with view "whole"`)
  }
  for (const w of g.worlds) for (const t of w.types) if (!types.has(t)) errs.push(`${name}: world ${w.id} lists unknown type ${t}`)
  for (const v of g.verbs) for (const k of ['verb', 'inverse', 'world', 'bridge', 'reads', 'reads_inverse']) if (!(k in v)) errs.push(`${name}: verb ${v.verb} lacks ${k}`)
  const ids = new Set()
  g.nodes.forEach((n, i) => {
    if (ids.has(n.id)) errs.push(`${name}: duplicate node id ${n.id}`)
    ids.add(n.id)
    if (!types.has(n.type)) errs.push(`${name}: node ${n.id} has unknown type ${n.type}`)
    if (!(Number.isInteger(n.src) && n.src >= -1 && n.src < g.sources.length)) errs.push(`${name}: node ${n.id} has source index ${n.src} out of bounds`)
    for (const k of ['deg', 'bc', 'pr', 'x', 'y']) if (typeof n[k] !== 'number' || !Number.isFinite(n[k])) errs.push(`${name}: node ${n.id} lacks numeric ${k}`)
    if (n.label === undefined || n.label === '') errs.push(`${name}: node ${n.id} has no label`)
  })
  const deg = new Array(g.nodes.length).fill(0)
  g.edges.forEach((e, j) => {
    if (!Array.isArray(e) || e.length !== 6) { errs.push(`${name}: edge ${j} is not a 6-tuple`); return }
    const [a, b, v, s, read, eb] = e
    if (!(Number.isInteger(a) && a >= 0 && a < g.nodes.length && Number.isInteger(b) && b >= 0 && b < g.nodes.length)) errs.push(`${name}: edge ${j} endpoint out of bounds`)
    else { if (a !== b) { deg[a]++; deg[b]++ } }
    if (!(Number.isInteger(v) && v >= 0 && v < g.verbs.length)) errs.push(`${name}: edge ${j} verb index ${v} out of bounds`)
    if (!(Number.isInteger(s) && s >= -1 && s < g.sources.length)) errs.push(`${name}: edge ${j} source index ${s} out of bounds`)
    if (!(read === 0 || /^\d{4}-\d{2}-\d{2}$/.test(read))) errs.push(`${name}: edge ${j} read ${read} is neither 0 nor a date`)
    if (typeof eb !== 'number') errs.push(`${name}: edge ${j} has no betweenness`)
  })
  g.nodes.forEach((n, i) => { if (n.deg !== deg[i] && !errs.length) errs.push(`${name}: node ${n.id} has deg ${n.deg}, its edges give ${deg[i]}`) })
  return errs
}

// the presets of one graph, in the shape of PRESETS in assets/graph/engine.js ({key, label, state}), in the order of
// graph/presets.json; the captions stay in presets.json (the page's data-captions file)
export function presetsFor(presets, which) {
  return Object.entries((presets && presets.presets) || {}).filter(([, p]) => p.data === which).map(([key, p]) => ({ key, label: p.label, state: p.state }))
}

export async function buildGraphs(ctx, cards, put) {
  const engine = await loadEngine(ctx.root)
  const lib = await buildLibraryGraph(ctx, cards, engine)
  const tree = await buildRealityGraph(ctx, cards, engine)
  const presetsFile = path.join(ctx.libDir, 'graph/presets.json')
  const presets = readJson(presetsFile, null)
  const presetErrors = presets ? checkPresets(presets, { library: lib.data, reality: tree.data }) : ['graph/presets.json is missing']
  if (!presetErrors.length) { lib.data.presets = presetsFor(presets, 'library'); tree.data.presets = presetsFor(presets, 'reality') }
  const text = (d) => JSON.stringify(d) + '\n'
  put('graph/library-graph.json', text(lib.data))
  put('graph/reality-tree.json', text(tree.data))
  const errors = [...validateShape(lib.data, 'library-graph.json'), ...validateShape(tree.data, 'reality-tree.json'), ...presetErrors]
  return { library: lib, reality: tree, engine, errors, presets }
}
