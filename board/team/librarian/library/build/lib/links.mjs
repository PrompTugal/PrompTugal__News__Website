// The typed links. Input: the cards of the run (made_by and part_of for findings come from cards.mjs), the files
// they came from, the authority records and the subject vocabulary. Output: the cards with their links
// (forward edges on the card that asserts them, inverse edges on a card target, marked inv), the status
// "superseded" where a later holding replaces an earlier one, and a report. Each target is looked up in an index of
// what exists, so a link that cannot resolve is never written.
import fs from 'node:fs'
import path from 'node:path'
import { cmp } from './util.mjs'
import { REL, INVERSE, REL_ORDER } from './linktypes.mjs'
import { compileSubjects } from './vocab.mjs'
import { defaultUrl } from './cards.mjs'
import { readForms } from './entities.mjs'

const MAX_CITES = 12
const MAX_FINDING_CITES = 5
const MAX_ABOUT_SUBJECTS = 3
const MAX_ABOUT_ENTITIES = 3
const MAX_SEE_ALSO = 5
const READ_LIMIT = 200000
// generated or boxed files: never scanned for citations (the box, never its contents)
const SKIP_CALLS = ['LIB.CAT', 'LIB.AUTH', 'LIB.STOCK', 'LIB.REAL', 'TEAM.RUN', 'TEAM.INBOX']
const TEXT_PAGE_KINDS = new Set(['article', 'decision', 'newsroom', 'site', 'list'])
const ENTITY_PAGE = { companies: 'company', people: 'person', organisations: 'organisation', places: 'place', topics: 'topic' }

const callOf = (c) => c.call.split(' ')[0]
const evidenceFile = (c) => {
  const ev = c.provenance && c.provenance.evidence && c.provenance.evidence[0]
  return ev && ev.kind === 'file' ? String(ev.ref).replace(/#.*$/, '') : null
}
const pathKey = (p) => String(p).replace(/^\/+/, '').replace(/\/+$/, '')

function readHead(file, limit) {
  try {
    const fd = fs.openSync(file, 'r')
    try {
      const buf = Buffer.alloc(limit)
      const n = fs.readSync(fd, buf, 0, limit, 0)
      return buf.slice(0, n).toString('utf8')
    } finally { fs.closeSync(fd) }
  } catch { return null }
}

function frontMatter(text) {
  if (!text || !text.startsWith('---')) return {}
  const end = text.indexOf('\n---', 3)
  if (end < 0) return {}
  const fm = {}
  for (const l of text.slice(3, end).split('\n')) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(l)
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return fm
}

export function buildLinks(ctx, cards) {
  const { root, libDir } = ctx
  const byId = new Map(cards.map((c) => [c.id, c]))
  const live = cards.filter((c) => c.status !== 'withdrawn')
  const forms = readForms(libDir)
  const authIds = new Set((ctx.authority.records || []).map((r) => r.id))
  for (const k of Object.keys(ctx.entities)) for (const r of ctx.entities[k]) authIds.add(r.id)
  const subjects = ctx.subjects || []
  const subjIds = new Set(subjects.map((s) => s.id))

  // frozen: a withdrawn card keeps the forward edges it had, as long as they still resolve
  const fwd = new Map() // card id -> Map(key -> link)
  const put = (c, rel, to) => {
    if (!REL[rel]) throw new Error(`unknown link type ${rel}`)
    if (to === c.id && rel !== 'about') return false
    if (!fwd.has(c.id)) fwd.set(c.id, new Map())
    const k = rel + '\u0000' + to
    if (fwd.get(c.id).has(k)) return false
    fwd.get(c.id).set(k, { rel, to })
    return true
  }
  const count = (c, rel) => (fwd.has(c.id) ? [...fwd.get(c.id).values()].filter((l) => l.rel === rel).length : 0)
  for (const c of cards) {
    for (const l of c.links || []) {
      if (l.inv || !REL[l.rel]) continue
      const ok = l.to.startsWith('auth:') ? authIds.has(l.to) : l.to.startsWith('subj:') ? subjIds.has(l.to) : byId.has(l.to)
      if (c.status === 'withdrawn' ? ok : (l.rel === 'made_by' || l.rel === 'part_of') && ok) put(c, l.rel, l.to)
    }
  }

  // indexes of what exists: path, address, source file, pass name
  const pathIdx = new Map()
  const addPath = (k, id) => { if (k && !pathIdx.has(pathKey(k))) pathIdx.set(pathKey(k), id) }
  const passIdx = new Map()
  for (const c of live) {
    if (['finding', 'idea', 'question', 'concept'].includes(c.type)) continue
    addPath(c.where.path, c.id)
    const src = evidenceFile(c)
    if (src && c.type === 'page') addPath(src, c.id)
    const url = c.where.url || defaultUrl(c.where.path)
    if (url && url.startsWith('https://promptugal.news/')) {
      const rel = url.slice('https://promptugal.news/'.length)
      for (const k of [rel, rel.replace(/index\.html$/, ''), rel.replace(/\.html$/, '')]) if (k) addPath(k, c.id)
    }
    if (c.type === 'pass') passIdx.set(c.id.slice(c.id.indexOf(':') + 1), c.id)
  }
  const PATHRE = /(?<![A-Za-z0-9_./@:-])((?:[A-Za-z0-9_.@-]+\/)+[A-Za-z0-9_.@-]*)/g
  const URLRE = /https?:\/\/promptugal\.news\/([^\s)"'\]>`,;]*)/g
  const SLUGRE = /\b\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\b/g
  const refsIn = (text) => {
    const out = []
    const add = (id) => { if (id && !out.includes(id)) out.push(id) }
    if (!text) return out
    for (const m of text.matchAll(URLRE)) add(pathIdx.get(pathKey(m[1].replace(/[.,;:]+$/, ''))))
    for (const m of text.matchAll(PATHRE)) {
      const raw = m[1].replace(/[.,;:]+$/, '')
      add(pathIdx.get(pathKey(raw)))
    }
    for (const m of text.matchAll(SLUGRE)) add(passIdx.get(m[0]))
    return out
  }

  // per card: the file text (the first part of it)
  const body = new Map()
  const bodyOf = (c) => {
    if (body.has(c.id)) return body.get(c.id)
    let t = null
    const src = evidenceFile(c)
    if (src && !src.endsWith('/') && !['finding', 'idea', 'question', 'concept', 'desk', 'agent'].includes(c.type) && !SKIP_CALLS.includes(callOf(c))) {
      t = readHead(path.join(root, src), READ_LIMIT)
    }
    body.set(c.id, t)
    return t
  }
  const isMd = (c) => /\.md$/i.test(evidenceFile(c) || '')
  const factText = (c) => ['decision', 'where_it_stands', 'captured_in', 'suggested_home', 'what'].map((k) => (c.facts && c.facts[k]) || '').join(' ')

  // ---- part_of: the desk or agent folder that holds the file; an agent's run reports and inbox
  const containers = live.filter((c) => (c.type === 'desk' || c.type === 'agent') && c.where.path && c.where.path.endsWith('/')).sort((a, b) => b.where.path.length - a.where.path.length)
  const roleAgent = new Map()
  for (const c of live) if (c.type === 'agent') { const m = /^board\/team\/([^/]+)\/$/.exec(c.where.path || ''); if (m) roleAgent.set(m[1], c.id) }
  for (const c of live) {
    if (['finding', 'idea', 'question', 'concept', 'desk', 'agent'].includes(c.type) || !c.where.path) continue
    let m
    if ((m = /^board\/runs\/([^/]+)\//.exec(c.where.path)) && roleAgent.has(m[1])) { put(c, 'part_of', roleAgent.get(m[1])); continue }
    if ((m = /^board\/inboxes\/([^/]+)\.json$/.exec(c.where.path)) && roleAgent.has(m[1])) { put(c, 'part_of', roleAgent.get(m[1])); continue }
    const home = containers.find((k) => c.where.path.startsWith(k.where.path))
    if (home) put(c, 'part_of', home.id)
  }

  // ---- cites, answers, derived_from, supersedes (front matter and versioned names)
  const citeRaw = new Map() // card id -> ordered target ids
  for (const c of live) {
    let refs = []
    if (c.type === 'finding') {
      const t = (c.title || '') + ' ' + factText(c)
      const decisions = refsIn(t).filter((id) => byId.get(id) && callOf(byId.get(id)) === 'WRK.DEC')
      for (const id of decisions) put(c, 'answers', id)
      refs = refsIn(t).filter((id) => !decisions.includes(id))
      const parent = (c.links || []).find((l) => l.rel === 'part_of')
      refs = refs.filter((id) => !parent || id !== parent.to)
      for (const id of refs.slice(0, MAX_FINDING_CITES)) put(c, 'cites', id)
      continue
    }
    if (c.type === 'question') {
      const t = (c.title || '') + ' ' + factText(c)
      const r = refsIn(t).filter((id) => id !== c.id)
      for (const id of r.slice(0, 3)) put(c, c.facts && c.facts.answered === true ? 'answers' : 'cites', id)
      continue
    }
    if (c.type === 'idea') {
      const own = pathKey(c.where.path || '')
      const r = refsIn((c.facts && c.facts.captured_in) || '').filter((id) => { const k = byId.get(id); return !k || pathKey(k.where.path || '') !== own })
      for (const id of r.slice(0, 3)) put(c, 'cites', id)
      continue
    }
    const text = bodyOf(c)
    if (text == null) continue
    const own = pathKey(c.where.path || '')
    if (isMd(c) && !SKIP_CALLS.includes(callOf(c))) {
      refs = refsIn(text).filter((id) => id !== c.id && pathKey((byId.get(id) || { where: {} }).where.path || '') !== own)
      citeRaw.set(c.id, refs)
      for (const id of refs.slice(0, MAX_CITES)) put(c, 'cites', id)
    }
    // the header of a generated file says where it came from
    const head = text.split('\n').slice(0, 25)
    const derived = []
    for (const l of head) {
      const m = /\b(generated|derived|built|made)\b[^\n]*?\bfrom\b(.*)$/i.exec(l)
      if (m) for (const id of refsIn(m[2])) if (id !== c.id && pathKey((byId.get(id) || { where: {} }).where.path || '') !== own && !derived.includes(id)) derived.push(id)
    }
    for (const id of derived.slice(0, 3)) put(c, 'derived_from', id)
    // front matter: supersedes, superseded_by
    const fm = frontMatter(text)
    if (fm.supersedes) for (const id of refsIn(fm.supersedes).concat(byId.has(fm.supersedes) ? [fm.supersedes] : [])) put(c, 'supersedes', id)
    if (fm.superseded_by) for (const id of refsIn(fm.superseded_by).concat(byId.has(fm.superseded_by) ? [fm.superseded_by] : [])) { const t = byId.get(id); if (t) put(t, 'supersedes', c.id) }
  }
  // versioned names: name-v2 supersedes name (or name-v1)
  for (const c of live) {
    if (!c.where.path || !['board', 'page', 'pass'].includes(c.type)) continue
    const m = /^(.*?)-v(\d+)(\.[A-Za-z0-9]+|\/)?$/.exec(c.where.path.replace(/index\.html$/, ''))
    if (!m) continue
    const n = Number(m[2])
    const ext = m[3] || ''
    const cand = n === 2 ? [`${m[1]}-v1${ext}`, `${m[1]}${ext}`] : [`${m[1]}-v${n - 1}${ext}`]
    for (const p of cand) { const id = pathIdx.get(pathKey(p)); if (id && id !== c.id) { put(c, 'supersedes', id); break } }
  }
  // the owner's word, authority/forms.json
  for (const e of forms.supersedes || []) if (byId.has(e.id) && byId.has(e.supersedes)) put(byId.get(e.id), 'supersedes', e.supersedes)
  for (const e of forms.see || []) if (byId.has(e.from) && byId.has(e.to)) put(byId.get(e.from), 'see', e.to)

  // supersession: status, and a "see" from a withdrawn holding to its successor
  const superseded = new Set()
  for (const [id, m] of fwd) for (const l of m.values()) if (l.rel === 'supersedes') {
    const old = byId.get(l.to)
    if (!old) continue
    if (old.status === 'current') { old.status = 'superseded'; superseded.add(old.id) }
    if (old.status === 'withdrawn') put(old, 'see', id)
  }

  // ---- about: the entity a page is; subjects by call, path and words; entities named in the text
  const entityKinds = new Map()
  for (const k of Object.keys(ctx.entities)) for (const r of ctx.entities[k]) entityKinds.set(r.id, r)
  const compiled = compileSubjects(subjects)
  const textual = (c) => !SKIP_CALLS.includes(callOf(c)) && (['board', 'pass', 'finding', 'idea', 'question', 'concept', 'desk', 'agent'].includes(c.type) || (c.type === 'page' && TEXT_PAGE_KINDS.has(c.kind)))
  const nameRe = []
  const nameMap = new Map()
  for (const r of ctx.entities.company || []) for (const f of r.forms) {
    if (f.length >= 4 && /[A-Z0-9]/.test(f) && !nameMap.has(f)) { nameMap.set(f, r.id); nameRe.push(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }
  }
  nameRe.sort((a, b) => b.length - a.length)
  const companyRe = nameRe.length ? new RegExp(`(?<![A-Za-z0-9])(?:${nameRe.join('|')})(?![A-Za-z0-9])`, 'g') : null
  for (const c of live) {
    if (c.type === 'page') {
      const m = /^([a-z]+)\/([^/]+)\//.exec(c.where.path || '')
      if (m && ENTITY_PAGE[m[1]]) {
        const aid = `auth:${ENTITY_PAGE[m[1]]}:${m[2]}`
        if (authIds.has(aid)) put(c, 'about', aid)
      }
    }
    const callName = callOf(c)
    const scored = []
    let text = null
    if (textual(c)) text = [c.title, c.what, c.facts && c.facts.theme, (bodyOf(c) || '').slice(0, 2000)].filter(Boolean).join('\n')
    for (const { s, pats } of compiled) {
      let score = 0
      if (s.by_call.some((p) => callName === p || callName.startsWith(p + '.') || c.call.startsWith(p + ' '))) score += 100
      if (s.by_path.some((p) => (c.where.path || '').startsWith(p))) score += 100
      if (text && pats.length) for (const re of pats) { re.lastIndex = 0; const n = (text.match(re) || []).length; score += Math.min(n, 5) * (re.flags.includes('i') ? 2 : 3) }
      if (score) scored.push({ id: s.id, score })
    }
    scored.sort((a, b) => b.score - a.score || cmp(a.id, b.id))
    for (const s of scored.slice(0, MAX_ABOUT_SUBJECTS)) put(c, 'about', s.id)
    // companies named (the page's own entity excluded)
    if (companyRe && ((c.type === 'page' && ['article', 'decision'].includes(c.kind)) || c.type === 'pass' || c.type === 'finding')) {
      const t = [c.title, c.what, bodyOf(c) || ''].join('\n')
      const hits = new Map()
      for (const m of t.matchAll(companyRe)) { const id = nameMap.get(m[0]); if (id) hits.set(id, (hits.get(id) || 0) + 1) }
      const need = c.type === 'finding' ? 1 : 2
      const top = [...hits].filter(([, n]) => n >= need).sort((a, b) => b[1] - a[1] || cmp(a[0], b[0])).slice(0, MAX_ABOUT_ENTITIES)
      for (const [id] of top) put(c, 'about', id)
    }
  }

  // ---- see_also: two cards that cite each other, and the owner's word
  const citeSet = new Map()
  for (const [id, m] of fwd) citeSet.set(id, new Set([...m.values()].filter((l) => l.rel === 'cites').map((l) => l.to)))
  const pairs = []
  for (const [a, set] of citeSet) for (const b of set) if (a < b && citeSet.get(b) && citeSet.get(b).has(a)) pairs.push([a, b])
  pairs.sort((x, y) => cmp(x[0], y[0]) || cmp(x[1], y[1]))
  const seeCount = new Map()
  const seeAlso = (a, b) => {
    if ((seeCount.get(a) || 0) >= MAX_SEE_ALSO || (seeCount.get(b) || 0) >= MAX_SEE_ALSO) return
    if (!byId.has(a) || !byId.has(b)) return
    seeCount.set(a, (seeCount.get(a) || 0) + 1); seeCount.set(b, (seeCount.get(b) || 0) + 1)
    put(byId.get(a), 'see_also', b); put(byId.get(b), 'see_also', a)
  }
  for (const e of forms.see_also || []) seeAlso(e.a, e.b)
  for (const [a, b] of pairs) seeAlso(a, b)

  // ---- assemble: forward edges, then the inverse of every edge whose target is a card
  const inv = new Map()
  for (const [id, m] of fwd) for (const l of m.values()) {
    const t = byId.get(l.to)
    if (!t || l.to.startsWith('auth:') || l.to.startsWith('subj:')) continue
    if (!inv.has(t.id)) inv.set(t.id, new Map())
    inv.get(t.id).set(REL[l.rel].inverse + '\u0000' + id, { rel: REL[l.rel].inverse, to: id, inv: true })
  }
  const order = (l) => REL_ORDER.indexOf(l.rel)
  let nForward = 0
  let nInverse = 0
  const byRel = {}
  for (const c of cards) {
    const links = [...(fwd.has(c.id) ? fwd.get(c.id).values() : []), ...(inv.has(c.id) ? inv.get(c.id).values() : [])]
    links.sort((a, b) => order(a) - order(b) || cmp(a.to, b.to))
    c.links = links
    for (const l of links) { if (l.inv) nInverse++; else nForward++; byRel[l.rel] = (byRel[l.rel] || 0) + 1 }
  }
  return { forward: nForward, inverse: nInverse, byRel, superseded: [...superseded].sort(cmp) }
}

// every link of every card must resolve; returns the faults (used by the check and the stocktake)
export function danglingLinks(cards, authIds, subjIds) {
  const ids = new Set(cards.map((c) => c.id))
  const bad = []
  for (const c of cards) for (const l of c.links || []) {
    const ok = l.to.startsWith('auth:') ? authIds.has(l.to) : l.to.startsWith('subj:') ? subjIds.has(l.to) : ids.has(l.to)
    if (!ok) bad.push({ card: c.id, rel: l.rel, to: l.to, why: 'target does not exist' })
    else if (!REL[l.rel] && !INVERSE[l.rel]) bad.push({ card: c.id, rel: l.rel, to: l.to, why: 'unknown link type' })
  }
  // two directed edges: each card-to-card edge has its inverse on the target
  const has = new Set()
  for (const c of cards) for (const l of c.links || []) has.add(`${c.id}\u0000${l.rel}\u0000${l.to}`)
  for (const c of cards) for (const l of c.links || []) {
    if (l.to.startsWith('auth:') || l.to.startsWith('subj:')) continue
    const back = l.inv ? REL[INVERSE[l.rel]].rel : REL[l.rel] && REL[l.rel].inverse
    if (!back) continue
    if (!has.has(`${l.to}\u0000${back}\u0000${c.id}`)) bad.push({ card: c.id, rel: l.rel, to: l.to, why: `the inverse ${back} is missing on the target` })
  }
  return bad
}
