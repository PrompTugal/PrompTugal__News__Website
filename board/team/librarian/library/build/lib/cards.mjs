// Accession and cards. Input: the catalogue (board/catalogue.json), classification.json, the authority records.
// Output: catalogue/<CLASS>.jsonl (one card per line, sorted), cards.json (compact), accession-register.jsonl (append only).
import path from 'node:path'
import fs from 'node:fs'
import { readJson, readLines, stable, cmp, words, noDash, GENERATOR } from './util.mjs'
import { classify, cutter, baseCall } from './classify.mjs'
import { formIndex } from './authority.mjs'

export const DEFAULT_BASE = 'https://promptugal.news/'
export const defaultUrl = (p) => (p ? DEFAULT_BASE + String(p).replace(/(^|\/)index\.html$/, '$1') : null)
export const cardUrl = (c) => c.where.url || defaultUrl(c.where.path)

export const TYPE_KEYS = [
  ['pages', 'page'], ['board', 'board'], ['desks', 'desk'], ['passes', 'pass'], ['findings', 'finding'],
  ['ideas', 'idea'], ['questions', 'question'], ['concepts', 'concept'], ['agents', 'agent'],
]
const FACT_KEYS = ['state', 'owner', 'opened', 'decision', 'decided', 'from', 'theme', 'memo', 'when', 'captured_in',
  'later', 'trigger', 'not_captured', 'where_it_stands', 'answered', 'files', 'lands', 'key', 'role_file', 'status_file', 'findings', 'steps_logged']

export function holdingsOf(catalogue) {
  const out = []
  for (const [k, type] of TYPE_KEYS) for (const h of catalogue[k] || []) out.push({ ...h, type: h.type || type })
  return out
}

export function readRegister(file) {
  return readLines(file).map((l, i) => {
    try { return JSON.parse(l) } catch { throw new Error(`${file} line ${i + 1} is not JSON`) }
  })
}
export function readPrevCards(libDir) {
  const dir = path.join(libDir, 'catalogue')
  const m = new Map()
  if (!fs.existsSync(dir)) return m
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.jsonl')).sort()) {
    for (const l of readLines(path.join(dir, f))) { const c = JSON.parse(l); m.set(c.id, c) }
  }
  return m
}

export function buildCards(ctx) {
  const { catalogue, libDir, now } = ctx
  const cls = readJson(path.join(libDir, 'classification.json'))
  const regFile = path.join(libDir, 'accession-register.jsonl')
  const register = readRegister(regFile)
  const wake = now.slice(0, 16)
  const today = now.slice(0, 10).replace(/-/g, '')
  const holdings = holdingsOf(catalogue)
  const currentIds = new Set(holdings.map((h) => h.id))
  const fidx = formIndex(ctx.authority.records)
  const authIds = new Set(ctx.authority.records.map((r) => r.id))

  // the register: accession lines (no event) and events (withdrawn, restored)
  const accOf = new Map()
  const lastEvent = new Map()
  const seqs = new Map()
  for (const l of register) {
    if (l.event) { lastEvent.set(l.id, l.event); continue }
    accOf.set(l.id, l)
    const m = /^ACC-(\d{8})-(\d+)$/.exec(l.acc)
    if (m) seqs.set(m[1], Math.max(seqs.get(m[1]) || 0, Number(m[2])))
  }
  const retro = register.length === 0

  // classify every current holding
  const meta = new Map()
  for (const h of holdings) {
    const c = classify(h, cls)
    meta.set(h.id, { c, base: baseCall(c, cutter(h)) })
  }

  // new accessions, in shelf order (base call, then id)
  const fresh = holdings.filter((h) => !accOf.has(h.id)).sort((a, b) => cmp(meta.get(a.id).base, meta.get(b.id).base) || cmp(a.id, b.id))
  const newAcc = new Map()
  for (const h of fresh) {
    const n = (seqs.get(today) || 0) + 1
    seqs.set(today, n)
    newAcc.set(h.id, `ACC-${today}-${String(n).padStart(4, '0')}`)
  }
  const accNo = (id) => (accOf.get(id) ? accOf.get(id).acc : newAcc.get(id))

  // calls: withdrawn holdings keep theirs; current ones in order of accession, :2 :3 on a collision
  const used = new Set()
  const withdrawnIds = [...accOf.keys()].filter((id) => !currentIds.has(id)).sort(cmp)
  for (const id of withdrawnIds) used.add(accOf.get(id).call)
  const calls = new Map()
  for (const h of [...holdings].sort((a, b) => cmp(accNo(a.id), accNo(b.id)))) {
    const base = meta.get(h.id).base
    let call = base
    for (let n = 2; used.has(call); n++) call = `${base}:${n}`
    used.add(call)
    calls.set(h.id, call)
  }

  // register lines to append
  const lines = []
  for (const h of fresh) {
    lines.push({
      acc: newAcc.get(h.id), id: h.id, call: calls.get(h.id), at: now, wake, retro,
      made_on: (h.made && h.made.on) || null, commit: (h.made && h.made.commit) || null,
    })
  }
  for (const id of withdrawnIds) {
    if (lastEvent.get(id) !== 'withdrawn') lines.push({ event: 'withdrawn', id, acc: accOf.get(id).acc, at: now, wake })
  }
  for (const h of holdings) {
    if (lastEvent.get(h.id) === 'withdrawn') lines.push({ event: 'restored', id: h.id, acc: accOf.get(h.id).acc, at: now, wake })
  }

  // cards
  const cards = []
  for (const h of holdings) {
    const { c } = meta.get(h.id)
    const made = h.made || {}
    const links = []
    const added = []
    const makerAuth = made.by ? fidx.get(String(made.by).toLowerCase()) : null
    if (makerAuth) links.push({ rel: 'made_by', to: makerAuth })
    if (h.type === 'finding' && h.pass && currentIds.has(h.pass)) {
      links.push({ rel: 'part_of', to: h.pass })
      added.push({ kind: 'series', heading: h.pass })
    }
    const facts = {}
    for (const k of FACT_KEYS) {
      const v = h[k]
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) continue
      facts[k] = typeof v === 'string' ? noDash(v) : v
    }
    const anchor = h.type === 'finding' ? '#' + h.id.split('#')[1] : ''
    const where = { path: h.path }
    if (h.url && h.url !== defaultUrl(h.path)) where.url = h.url
    if (h.twin && h.twin !== DEFAULT_BASE + String(h.path).replace(/\.html$/, '.md')) where.twin = h.twin
    const madeP = made.by ? { by: made.by, on: made.on || null, commit: made.commit || null } : null
    const changedP = made.changed_by ? { by: made.changed_by, on: made.changed || null, commit: made.last_commit || null } : null
    const provenance = {
      evidence: [{ kind: 'file', ref: (h.source || h.path) + anchor }],
      catalogued: { rule: c.rule === 'override' ? 'override' : c.rule },
    }
    if (madeP) provenance.made = madeP
    if (changedP && !(madeP && changedP.by === madeP.by && changedP.on === madeP.on && changedP.commit === madeP.commit)) provenance.changed = changedP
    const card = {
      id: h.id, acc: accNo(h.id), call: calls.get(h.id), type: h.type, status: 'current',
      title: noDash(h.title || h.id),
      what: words(h.what || h.title || '', 25),
      where, links, provenance,
    }
    if (h.kind) card.kind = h.kind
    if (added.length) card.added = added
    if (Object.keys(facts).length) card.facts = facts
    if (c.special) card.special = c.special
    if (h.words) card.words = noDash(h.words)
    const reg = accOf.get(h.id)
    if (reg && reg.call !== card.call) card.former_calls = [reg.call]
    cards.push(card)
  }

  // withdrawn: kept, never deleted
  const prev = readPrevCards(libDir)
  for (const id of withdrawnIds) {
    const reg = accOf.get(id)
    const old = prev.get(id)
    const card = old ? { ...old } : {
      id, acc: reg.acc, call: reg.call, type: id.split(':')[0], title: id, what: '', where: { path: null }, links: [],
      provenance: {
        evidence: [{ kind: 'register', ref: 'accession-register.jsonl', at: reg.at || null }],
        catalogued: { rule: 'withdrawn' },
      },
    }
    if (!old && (reg.commit || reg.made_on)) card.provenance.made = { by: null, on: reg.made_on, commit: reg.commit }
    card.status = 'withdrawn'
    card.call = reg.call
    cards.push(card)
  }

  cards.sort((a, b) => cmp(a.call, b.call) || cmp(a.id, b.id))
  return { cards, lines, classification: cls, retro }
}

export function cardFiles(cards) {
  const byClass = new Map()
  for (const c of cards) {
    const k = c.call.split('.')[0]
    if (!byClass.has(k)) byClass.set(k, [])
    byClass.get(k).push(c)
  }
  const files = {}
  for (const [k, list] of byClass) files[`catalogue/${k}.jsonl`] = list.map((c) => stable(c)).join('\n') + '\n'
  return files
}

export function compactCards(cards, catalogue, registerLast) {
  const columns = ['call', 'id', 'acc', 'type', 'kind', 'status', 'title', 'path', 'made_by', 'made_on']
  const rows = cards.map((c) => [c.call, c.id, c.acc, c.type, c.kind || null, c.status, c.title, (c.id.slice(c.id.indexOf(':') + 1) === c.where.path ? 0 : c.where.path),
    c.provenance.made ? c.provenance.made.by : null, c.provenance.made ? c.provenance.made.on : null])
  const counts = {}
  for (const c of cards) counts[c.type] = (counts[c.type] || 0) + 1
  const about = 'All cards of the library of PrompTugal.news, compact: one row per card, the columns named in "columns"; the address of a card is url_base plus its path (without a trailing index.html) unless the full card says otherwise; a path of 0 means the part of the id after the colon; evidence was read on the catalogue_generated date. The full cards are in catalogue/<CLASS>.jsonl. Generated by ' + GENERATOR + ' from board/catalogue.json; never edited by hand.'
  return JSON.stringify({ about, source: 'board/catalogue.json', url_base: DEFAULT_BASE, site_version: catalogue.site_version || null, catalogue_generated: catalogue.generated || null, last_accession_run: registerLast, counts, columns, rows }) + '\n'
}
