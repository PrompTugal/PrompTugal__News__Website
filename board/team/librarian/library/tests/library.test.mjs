// Run: node --test board/team/librarian/library/tests/
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from '../build/library.mjs'
import { check, libraryFiles } from '../build/lib/check.mjs'
import { holdingsOf, readRegister } from '../build/lib/cards.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const libReal = path.resolve(here, '..')
const fixtureRoot = path.join(here, 'fixtures/repo')
const realRoot = path.resolve(here, '../../../../..')

function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'library-test-')) }
function fresh(root = fixtureRoot) {
  const out = tmp()
  fs.copyFileSync(path.join(libReal, 'classification.json'), path.join(out, 'classification.json'))
  return { root, libDir: out }
}
function snapshot(libDir) {
  const m = {}
  for (const f of libraryFiles(libDir)) m[path.relative(libDir, f)] = fs.readFileSync(f, 'utf8')
  return m
}
function cardsOf(libDir) {
  const out = []
  for (const f of fs.readdirSync(path.join(libDir, 'catalogue')).sort())
    for (const l of fs.readFileSync(path.join(libDir, 'catalogue', f), 'utf8').split('\n').filter(Boolean)) out.push(JSON.parse(l))
  return out
}
// a copy of the fixture root whose catalogue has one holding fewer
function rootWithout(id) {
  const r = tmp()
  fs.cpSync(fixtureRoot, r, { recursive: true })
  const f = path.join(r, 'board/catalogue.json')
  const cat = JSON.parse(fs.readFileSync(f, 'utf8'))
  for (const k of Object.keys(cat)) if (Array.isArray(cat[k])) cat[k] = cat[k].filter((h) => h.id !== id)
  fs.writeFileSync(f, JSON.stringify(cat))
  return r
}

test('counts per type equal board/catalogue.json (fixture)', () => {
  const o = fresh()
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const want = {}
  for (const h of holdingsOf(JSON.parse(fs.readFileSync(path.join(fixtureRoot, 'board/catalogue.json'), 'utf8')))) want[h.type] = (want[h.type] || 0) + 1
  const have = {}
  for (const c of cardsOf(o.libDir)) have[c.type] = (have[c.type] || 0) + 1
  assert.deepEqual(have, want)
  assert.equal(check(o).errors.length, 0, check(o).errors.join('\n'))
})

test('counts per type equal board/catalogue.json (the real catalogue), written to a temp folder', { skip: !fs.existsSync(path.join(realRoot, 'board/catalogue.json')) }, () => {
  const o = fresh(realRoot)
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const cat = JSON.parse(fs.readFileSync(path.join(realRoot, 'board/catalogue.json'), 'utf8'))
  const have = {}
  for (const c of cardsOf(o.libDir)) have[c.type] = (have[c.type] || 0) + 1
  for (const [k, type] of [['pages', 'page'], ['board', 'board'], ['desks', 'desk'], ['passes', 'pass'], ['findings', 'finding'], ['ideas', 'idea'], ['questions', 'question'], ['concepts', 'concept'], ['agents', 'agent']]) {
    assert.equal(have[type], cat[k].length, `${type}`)
  }
  const r = check(o)
  assert.equal(r.errors.length, 0, r.errors.join('\n'))
  assert.equal(r.stats.fallback, 0, 'no card falls to the fallback class')
})

test('a second run changes nothing: byte-identical outputs, no new accession lines', () => {
  const o = fresh()
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const before = snapshot(o.libDir)
  const r2 = build({ ...o, now: '2026-11-07T09:30:00Z' })
  assert.equal(r2.appended, 0)
  assert.deepEqual(r2.changed, [])
  assert.deepEqual(snapshot(o.libDir), before)
})

test('the first run is a retrospective accession, dated the run, keeping the real date in made_on', () => {
  const o = fresh()
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const reg = readRegister(path.join(o.libDir, 'accession-register.jsonl'))
  assert.equal(reg.length, 15)
  for (const l of reg) {
    assert.match(l.acc, /^ACC-20261107-\d{4}$/)
    assert.equal(l.retro, true)
    assert.ok(l.made_on && l.made_on.startsWith('2026-11-0'))
    assert.ok(l.commit)
  }
  // a later new holding gets the next number of its own day and is not retrospective
  const r = tmp(); fs.cpSync(fixtureRoot, r, { recursive: true })
  const f = path.join(r, 'board/catalogue.json')
  const cat = JSON.parse(fs.readFileSync(f, 'utf8'))
  cat.board.push({ id: 'board:board/new.md', type: 'board', kind: 'board', path: 'board/new.md', url: 'https://promptugal.news/board/new.md', title: 'New', what: 'New.', made: { by: 'dev@PrompTugal.dinis', on: '2026-11-08T01:00:00Z', commit: '9999999' } })
  fs.writeFileSync(f, JSON.stringify(cat))
  build({ root: r, libDir: o.libDir, now: '2026-11-08T07:00:00Z' })
  const reg2 = readRegister(path.join(o.libDir, 'accession-register.jsonl'))
  assert.equal(reg2.length, 16)
  assert.deepEqual(reg2.slice(0, 15), reg)
  assert.equal(reg2[15].acc, 'ACC-20261108-0001')
  assert.equal(reg2[15].retro, false)
})

test('every card has provenance', () => {
  const o = fresh()
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  for (const c of cardsOf(o.libDir)) {
    assert.ok(c.provenance && c.provenance.catalogued && c.provenance.catalogued.rule, c.id)
    assert.ok(c.provenance.evidence.length >= 1, c.id)
    assert.ok(c.provenance.made && c.provenance.made.by && c.provenance.made.on && c.provenance.made.commit, c.id)
  }
})

test('a holding that disappears becomes withdrawn, not deleted', () => {
  const o = fresh()
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const callBefore = cardsOf(o.libDir).find((c) => c.id === 'board:board/spec-thing.md').call
  const r2 = rootWithout('board:board/spec-thing.md')
  const res = build({ root: r2, libDir: o.libDir, now: '2026-11-07T10:00:00Z' })
  assert.equal(res.appended, 1)
  const cards = cardsOf(o.libDir)
  const gone = cards.find((c) => c.id === 'board:board/spec-thing.md')
  assert.ok(gone, 'the card is still there')
  assert.equal(gone.status, 'withdrawn')
  assert.equal(gone.call, callBefore)
  assert.equal(gone.title, 'A spec')
  assert.equal(cards.length, 15)
  assert.equal(check({ root: r2, libDir: o.libDir }).errors.length, 0)
  // and the shelf list still shows it, marked
  assert.match(fs.readFileSync(path.join(o.libDir, 'shelf-list/WRK.md'), 'utf8'), /\[A spec\]\([^)]*\) \(withdrawn\)/)
  // a repeat run adds nothing more
  assert.equal(build({ root: r2, libDir: o.libDir, now: '2026-11-07T11:00:00Z' }).appended, 0)
  // when it comes back it is current again under the same accession
  const back = build({ root: fixtureRoot, libDir: o.libDir, now: '2026-11-07T12:00:00Z' })
  assert.equal(back.appended, 1)
  const c2 = cardsOf(o.libDir).find((c) => c.id === 'board:board/spec-thing.md')
  assert.equal(c2.status, 'current')
  assert.equal(c2.acc, gone.acc)
})

test('call numbers are unique, with :2 on a collision, and the accession order decides', () => {
  const o = fresh()
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const cards = cardsOf(o.libDir)
  const calls = cards.map((c) => c.call)
  assert.equal(new Set(calls).size, calls.length)
  const a = cards.find((c) => c.id === 'board:board/team/alpha/README.md')
  const b = cards.find((c) => c.id === 'board:board/team/beta/README.md')
  assert.equal(a.call, 'TEAM.ROLE README')
  assert.equal(b.call, 'TEAM.ROLE README:2')
  assert.equal(cards.find((c) => c.id === 'finding:2026-11-06-fixture#2').call, 'WRK.FIND 2026-11-06-fixture-2')
  assert.equal(cards.find((c) => c.id === 'page:companies/acme/index.html').call, 'DAT.CO acme')
  assert.equal(cards.find((c) => c.id === 'page:index.html').call, 'PUB.FRONT home')
})

test('the authority file has one record per agent, with forms and see references, and no key material', () => {
  const o = fresh()
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const raw = fs.readFileSync(path.join(o.libDir, 'authority/agent.json'), 'utf8')
  const auth = JSON.parse(raw)
  const ids = auth.records.map((r) => r.id)
  assert.deepEqual(ids, ['auth:agent:alpha', 'auth:agent:alpha-sub'])
  const alpha = auth.records[0]
  assert.equal(alpha.heading, 'alpha@PrompTugal.dinis')
  for (const f of ['alpha@', 'alpha@PrompTugal.dinis', 'alpha-promptugal', 'alpha-promptugal-2']) assert.ok(alpha.forms.includes(f), f)
  assert.equal(alpha.key_id, 'alpha-promptugal-2')
  assert.equal(alpha.key_ids.length, 2)
  const sub = auth.records[1]
  assert.ok(sub.forms.includes('work/alpha.sub'))
  assert.deepEqual(sub.see_also, ['auth:agent:alpha'])
  assert.equal(sub.model, 'Sonnet')
  for (const bad of ['SECRETPEM', 'BEGIN PUBLIC', 'SECRET-HOW-TEXT']) {
    for (const [name, text] of Object.entries(snapshot(o.libDir))) assert.ok(!text.includes(bad), `${bad} in ${name}`)
  }
  // a variant name of a maker resolves through the authority file
  const beta = cardsOf(o.libDir).find((c) => c.id === 'board:board/team/beta/README.md')
  assert.deepEqual(beta.links, [{ rel: 'made_by', to: 'auth:agent:alpha' }])
})

test('the shelf list is in call-number order and within the reading limits', () => {
  const o = fresh(realRoot)
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const cards = cardsOf(o.libDir)
  const rows = []
  const pages = fs.readdirSync(path.join(o.libDir, 'shelf-list')).sort((x, y) => x.localeCompare(y, 'en', { numeric: true }))
  for (const p of pages) {
    const text = fs.readFileSync(path.join(o.libDir, 'shelf-list', p), 'utf8')
    assert.ok(text.split('\n').length <= 150, p)
    for (const l of text.split('\n')) { const m = /^\| `([^`]+)` \|/.exec(l); if (m) rows.push(m[1]) }
  }
  assert.equal(rows.length, cards.length)
  const sorted = [...rows].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  assert.deepEqual(rows, sorted)
})

test('check catches a seeded fault: a duplicate call number and a key-shaped string', () => {
  const o = fresh()
  build({ ...o, now: '2026-11-07T08:00:00Z' })
  const f = path.join(o.libDir, 'catalogue/GDN.jsonl')
  const lines = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
  lines[1].call = lines[0].call
  lines[1].what = 'Qk9PTVNIQUtBTEFLQTEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJz'
  fs.writeFileSync(f, lines.map((l) => JSON.stringify(l)).join('\n') + '\n')
  const msgs = check(o).errors.join('\n')
  assert.match(msgs, /duplicate call number/)
  assert.match(msgs, /key-shaped string/)
})
