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

// ---------------------------------------------------------------------------------------------------------------
// Round 2: links, authority, vocabulary, indexes, reality tree, stocktake, weeding.
// A richer fixture is made on the fly from the small one, so the round 1 tests keep their exact numbers.
import { runStocktake, CODES } from '../build/lib/stocktake.mjs'
import { danglingLinks } from '../build/lib/links.mjs'
import { readExists, loadDomains, MARK_BEGIN, MARK_END } from '../build/lib/reality.mjs'
import { invertTitle } from '../build/lib/indexes.mjs'

const NOW = '2026-11-07T08:00:00Z'
const w = (root, rel, text) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, typeof text === 'string' ? text : JSON.stringify(text, null, 1)) }
const made = (by, on, commit) => ({ by, on, commit, changed: on, changed_by: by, last_commit: commit, agents: [by] })
const MADE = made('conductor@PrompTugal.dinis', '2026-11-06T09:00:00Z', 'abc1234')
function board(id, p, title, extra = {}) { return { id: 'board:' + id, type: 'board', kind: 'board', path: p, url: 'https://promptugal.news/' + p, title, what: title + '.', made: MADE, ...extra } }

function richFresh() {
  const root = tmp()
  fs.cpSync(fixtureRoot, root, { recursive: true })
  const cat = JSON.parse(fs.readFileSync(path.join(root, 'board/catalogue.json'), 'utf8'))
  cat.board.push(
    board('board/a.md', 'board/a.md', 'Doc A'), board('board/b.md', 'board/b.md', 'Doc B'),
    board('board/plan.md', 'board/plan.md', 'The plan'), board('board/plan-v2.md', 'board/plan-v2.md', 'The plan, second'),
    board('board/new-spec.md', 'board/new-spec.md', 'A new spec'),
    board('board/old.md', 'board/old.md', 'Old'), board('board/new.md', 'board/new.md', 'New'),
    board('board/gen.md', 'board/gen.md', 'A generated file'))
  cat.pages.push({ id: 'page:newsroom/decisions/the-pick/index.html', type: 'page', kind: 'decision', section: 'newsroom', path: 'newsroom/decisions/the-pick/index.html', url: 'https://promptugal.news/newsroom/decisions/the-pick/', title: 'The pick', what: 'A decision.', source: 'content/newsroom/decisions/the-pick.md', made: MADE })
  cat.findings.push({ id: 'finding:2026-11-06-fixture#3', type: 'finding', pass: 'pass:2026-11-06-fixture', path: 'board/passes/2026-11-06-fixture.md', title: 'Take the option in newsroom/decisions/the-pick/ as proposed', what: 'Take the option in newsroom/decisions/the-pick/ as proposed', owner: 'conductor@', decided: true, made: MADE })
  cat.questions.push({ id: 'question:Q2', type: 'question', path: 'board/guidance/ledger.md', title: 'Which one', answered: true, where_it_stands: 'Settled in newsroom/decisions/the-pick/ on 6 November.', made: MADE })
  cat.concepts.push({ id: 'concept:the-fractal-rule', type: 'concept', path: 'board/guidance/ledger.md', title: 'the fractal rule', what: 'The same rule at every level.', source: 'M3', made: MADE })
  fs.writeFileSync(path.join(root, 'board/catalogue.json'), JSON.stringify(cat))
  w(root, 'board/passes/2026-11-06-fixture.md', 'A pass. It reads board/spec-thing.md and `board/team/alpha/README.md`, and https://promptugal.news/board/team/beta/README.md. Acme Corp is in it; Acme Corp again. A pass about a spec.\n')
  w(root, 'board/spec-thing.md', 'A spec.\n')
  w(root, 'board/a.md', 'See board/b.md for more.\n'); w(root, 'board/b.md', 'And back to board/a.md.\n')
  w(root, 'board/plan.md', 'The plan.\n'); w(root, 'board/plan-v2.md', 'The plan, second.\n')
  w(root, 'board/new-spec.md', '---\ntitle: New\nsupersedes: board/spec-thing.md\n---\nA new spec.\n')
  w(root, 'board/old.md', 'Old.\n'); w(root, 'board/new.md', 'New.\n')
  w(root, 'board/gen.md', 'Generated by a tool from board/spec-thing.md at some time.\n\nBody.\n')
  w(root, 'content/newsroom/decisions/the-pick.md', 'A decision.\n')
  w(root, 'data/topics/ai/topic.json', { id: 'ai', type: 'topic', name: 'Artificial intelligence', kind: 'theme', description: 'AI in general: models, agents.', broader: [], summit_tracks: ['AI Summit'] })
  w(root, 'data/topics/ai-agents/topic.json', { id: 'ai-agents', type: 'topic', name: 'AI agents', kind: 'theme', description: 'Agents.', broader: ['ai'], summit_tracks: [] })
  w(root, 'data/companies/acme/company.json', { id: 'acme', type: 'company', name: 'Acme', category: 'security', country: 'Portugal', what: 'must not be copied', aliases: [{ name: 'Acme Corp', source: 's1' }], from: { by: 'curator@web-summit' } })
  w(root, 'data/people/jane-doe/person.json', { id: 'jane-doe', type: 'person', name: 'Jane Doe', role: 'CTO', organisation: 'Acme', org: 'organisation:acme-org', listings: [{ source: 'https://example.org/x', by: 'x' }], email: 'jane@example.org' })
  w(root, 'data/organisations/acme-org/organisation.json', { id: 'acme-org', type: 'organisation', name: 'Acme Org', names_as_listed: ['Acme Org', 'ACME organisation'] })
  w(root, 'data/places/portugal/place.json', { id: 'portugal', type: 'place', name: 'Portugal', kind: 'country', located_in: null, matches: [] })
  w(root, 'data/places/lisbon/place.json', { id: 'lisbon', type: 'place', name: 'Lisbon', kind: 'city', located_in: 'place:portugal', matches: ['Lisboa'] })
  const o = fresh(root)
  w(o.libDir, 'vocabulary/team-headings.json', { headings: [
    { id: 'passes', heading: 'Passes', use_for: ['pass'], by_call: ['WRK.PASS'] },
    { id: 'specs', heading: 'Specs', use_for: ['spec'], by_call: ['WRK.PLAN'], broader: ['passes'] },
  ] })
  w(o.libDir, 'authority/forms.json', { extra_concepts: [{ heading: 'hold', forms: ['HOLD.md'], note: 'Stops every agent.', from: ['CLAUDE.md'] }], supersedes: [{ id: 'board:board/new.md', supersedes: 'board:board/old.md' }], see: [], see_also: [] })
  return o
}
const linksOf = (cards, id) => cards.find((c) => c.id === id).links
const has = (cards, id, rel, to) => linksOf(cards, id).some((l) => l.rel === rel && l.to === to)

test('links: cites resolve and each has its inverse (two directed edges); nothing dangles', () => {
  const o = richFresh()
  const res = build({ ...o, now: NOW })
  const cards = cardsOf(o.libDir)
  const pass = 'pass:2026-11-06-fixture'
  assert.ok(has(cards, pass, 'cites', 'board:board/spec-thing.md'))
  assert.ok(has(cards, pass, 'cites', 'board:board/team/alpha/README.md'), 'a path in backticks')
  assert.ok(has(cards, pass, 'cites', 'board:board/team/beta/README.md'), 'an address of the site')
  assert.ok(has(cards, 'board:board/spec-thing.md', 'cited_by', pass))
  assert.ok(linksOf(cards, 'board:board/spec-thing.md').find((l) => l.rel === 'cited_by' && l.inv === true))
  assert.deepEqual(res.stocktake.findings.filter((f) => f.code === 'ST03' || f.code === 'ST09'), [])
  const auth = new Set(); const subj = new Set()
  for (const k of ['agent', 'company', 'person', 'organisation', 'place', 'topic', 'concepts']) for (const r of JSON.parse(fs.readFileSync(path.join(o.libDir, `authority/${k}.json`), 'utf8')).records) auth.add(r.id)
  for (const r of JSON.parse(fs.readFileSync(path.join(o.libDir, 'vocabulary/subjects.json'), 'utf8')).records) subj.add(r.id)
  assert.deepEqual(danglingLinks(cards, auth, subj), [])
  const r = check({ root: o.root, libDir: o.libDir })
  assert.equal(r.errors.length, 0, r.errors.join('\n'))
})

test('links: part_of (finding to pass, file to agent folder), answers, derived_from, see_also, supersedes', () => {
  const o = richFresh()
  build({ ...o, now: NOW })
  const cards = cardsOf(o.libDir)
  assert.ok(has(cards, 'finding:2026-11-06-fixture#3', 'part_of', 'pass:2026-11-06-fixture'))
  assert.ok(has(cards, 'pass:2026-11-06-fixture', 'includes', 'finding:2026-11-06-fixture#3'))
  assert.ok(has(cards, 'board:board/team/alpha/README.md', 'part_of', 'agent:alpha-promptugal'), 'a file in an agent folder')
  assert.ok(has(cards, 'finding:2026-11-06-fixture#3', 'answers', 'page:newsroom/decisions/the-pick/index.html'))
  assert.ok(has(cards, 'page:newsroom/decisions/the-pick/index.html', 'answered_by', 'finding:2026-11-06-fixture#3'))
  assert.ok(has(cards, 'question:Q2', 'answers', 'page:newsroom/decisions/the-pick/index.html'), 'an answered question')
  assert.ok(!has(cards, 'question:Q1', 'answers', 'page:newsroom/decisions/the-pick/index.html'))
  assert.ok(has(cards, 'board:board/gen.md', 'derived_from', 'board:board/spec-thing.md'))
  assert.ok(has(cards, 'board:board/spec-thing.md', 'source_of', 'board:board/gen.md'))
  // two cards that cite each other: see_also both ways, with the named inverse
  for (const [a, b] of [['board:board/a.md', 'board:board/b.md'], ['board:board/b.md', 'board:board/a.md']]) {
    assert.ok(has(cards, a, 'see_also', b)); assert.ok(has(cards, a, 'also_seen_from', b))
  }
  // supersession: a versioned name, front matter, the owner's word; the older card is marked superseded
  assert.ok(has(cards, 'board:board/plan-v2.md', 'supersedes', 'board:board/plan.md'))
  assert.ok(has(cards, 'board:board/new-spec.md', 'supersedes', 'board:board/spec-thing.md'))
  assert.ok(has(cards, 'board:board/new.md', 'supersedes', 'board:board/old.md'))
  for (const id of ['board:board/plan.md', 'board:board/spec-thing.md', 'board:board/old.md']) {
    const c = cards.find((x) => x.id === id)
    assert.equal(c.status, 'superseded', id)
    assert.ok(c.links.some((l) => l.rel === 'superseded_by'))
  }
  assert.equal(cards.find((c) => c.id === 'board:board/plan-v2.md').status, 'current')
  // weeding lists them and deletes nothing
  const wd = fs.readFileSync(path.join(o.libDir, 'weeding.md'), 'utf8')
  assert.match(wd, /3 superseded, 0 withdrawn/)
  assert.match(wd, /board:board\/plan\.md/)
  assert.match(fs.readFileSync(path.join(o.libDir, 'shelf-list/WRK.md'), 'utf8'), /\(superseded\)/)
  assert.equal(check({ root: o.root, libDir: o.libDir }).errors.length, 0)
})

test('links: a withdrawn holding keeps its card and finds its successor by superseded_by (no see verb)', () => {
  const o = richFresh()
  build({ ...o, now: NOW })
  const r2 = tmp(); fs.cpSync(o.root, r2, { recursive: true })
  const f = path.join(r2, 'board/catalogue.json')
  const cat = JSON.parse(fs.readFileSync(f, 'utf8'))
  cat.board = cat.board.filter((h) => h.id !== 'board:board/old.md')
  fs.writeFileSync(f, JSON.stringify(cat))
  build({ root: r2, libDir: o.libDir, now: '2026-11-07T10:00:00Z' })
  const cards = cardsOf(o.libDir)
  const old = cards.find((c) => c.id === 'board:board/old.md')
  assert.equal(old.status, 'withdrawn')
  assert.ok(old.links.some((l) => l.rel === 'superseded_by' && l.to === 'board:board/new.md'))
  assert.ok(has(cards, 'board:board/new.md', 'supersedes', 'board:board/old.md'))
  assert.ok(!cards.some((c) => (c.links || []).some((l) => l.rel === 'see' || l.rel === 'see_from')))
  assert.match(fs.readFileSync(path.join(o.libDir, 'weeding.md'), 'utf8'), /1 withdrawn/)
  assert.equal(check({ root: r2, libDir: o.libDir }).errors.length, 0)
})

test('authority: company, person, organisation, place, topic and concept records from data/, read only', () => {
  const o = richFresh()
  build({ ...o, now: NOW })
  const read = (k) => JSON.parse(fs.readFileSync(path.join(o.libDir, `authority/${k}.json`), 'utf8'))
  const acme = read('company').records[0]
  assert.equal(acme.id, 'auth:company:acme')
  assert.deepEqual(acme.forms, ['Acme', 'Acme Corp'])
  assert.deepEqual(acme.see_from, ['Acme Corp'])
  assert.equal(acme.ontology, 'company:acme')
  assert.ok(!JSON.stringify(acme).includes('must not be copied'))
  const jane = read('person').records[0]
  assert.deepEqual(Object.keys(jane).sort(), ['established', 'forms', 'heading', 'id', 'kind', 'ontology', 'org', 'organisation', 'page', 'role', 'see_also', 'see_from'])
  assert.ok(!JSON.stringify(jane).includes('example.org'), 'no contact detail, no listing source')
  assert.deepEqual(read('organisation').records[0].forms, ['ACME organisation', 'Acme Org'])
  const lisbon = read('place').records.find((r) => r.id === 'auth:place:lisbon')
  assert.deepEqual(lisbon.see_also, ['auth:place:portugal'])
  assert.ok(lisbon.forms.includes('Lisboa'))
  assert.deepEqual(read('topic').records.find((r) => r.id === 'auth:topic:ai-agents').see_also, ['auth:topic:ai'])
  const concepts = read('concepts').records
  assert.ok(concepts.some((r) => r.id === 'auth:concept:the-fractal-rule' && r.card === 'concept:the-fractal-rule'))
  const hold = concepts.find((r) => r.id === 'auth:concept:hold')
  assert.ok(hold && hold.forms.includes('HOLD.md') && /hand/.test(hold.source))
  // a page is about its entity
  const cards = cardsOf(o.libDir)
  assert.ok(has(cards, 'page:companies/acme/index.html', 'about', 'auth:company:acme'))
  assert.equal(check({ root: o.root, libDir: o.libDir }).errors.length, 0)
})

test('vocabulary and about: topics as they stand, team headings proposed for ontologist@, at most three subjects, link types with inverses', () => {
  const o = richFresh()
  build({ ...o, now: NOW })
  const subj = JSON.parse(fs.readFileSync(path.join(o.libDir, 'vocabulary/subjects.json'), 'utf8'))
  const byId = Object.fromEntries(subj.records.map((r) => [r.id, r]))
  assert.equal(byId['subj:topic-ai'].layer, 'publication')
  assert.equal(byId['subj:topic-ai'].ontology, 'topic:ai')
  assert.deepEqual(byId['subj:topic-ai'].narrower, ['subj:topic-ai-agents'])
  assert.deepEqual(byId['subj:topic-ai'].use_for, ['AI Summit'])
  assert.equal(byId['subj:passes'].proposed_for, 'ontologist@')
  assert.deepEqual(byId['subj:passes'].narrower, ['subj:specs'])
  const lv = JSON.parse(fs.readFileSync(path.join(o.libDir, 'vocabulary/links.json'), 'utf8')).links
  const inv = Object.fromEntries(lv.map((t) => [t.rel, t.inverse]))
  assert.deepEqual(inv, { made_by: 'made', part_of: 'includes', cites: 'cited_by', about: 'subject_of', answers: 'answered_by', supersedes: 'superseded_by', derived_from: 'source_of', see_also: 'also_seen_from' })
  const cards = cardsOf(o.libDir)
  assert.ok(has(cards, 'pass:2026-11-06-fixture', 'about', 'subj:passes'), 'by call class')
  assert.ok(has(cards, 'board:board/a.md', 'about', 'subj:specs'), 'by call class')
  assert.ok(has(cards, 'pass:2026-11-06-fixture', 'about', 'auth:company:acme'), 'a company named twice in the text')
  for (const c of cards) assert.ok(c.links.filter((l) => l.rel === 'about' && l.to.startsWith('subj:')).length <= 3, c.id)
})

test('indexes: title (inverted), subject, agent and series, naming only cards that exist', () => {
  const o = richFresh()
  build({ ...o, now: NOW })
  const rd = (n) => JSON.parse(fs.readFileSync(path.join(o.libDir, `indexes/${n}.json`), 'utf8')).headings
  assert.equal(invertTitle('The plan'), 'plan, the')
  assert.equal(invertTitle('A spec'), 'spec, a')
  assert.equal(invertTitle('Theory'), 'Theory')
  const title = rd('title')
  assert.deepEqual(title['plan, the'], ['board:board/plan.md'])
  assert.deepEqual(title['spec, a'], ['board:board/spec-thing.md'])
  assert.ok(rd('subject')['subj:passes'].includes('pass:2026-11-06-fixture'))
  assert.ok(rd('agent')['auth:agent:alpha'].made.includes('board:board/team/beta/README.md'))
  assert.deepEqual(rd('series')['pass:2026-11-06-fixture'], ['finding:2026-11-06-fixture#1', 'finding:2026-11-06-fixture#2', 'finding:2026-11-06-fixture#3'])
  assert.ok(rd('series')['theme:1. Fixture'].includes('idea:PB-01'))
  const ids = new Set(cardsOf(o.libDir).map((c) => c.id))
  for (const n of ['title', 'subject', 'agent', 'series']) for (const v of Object.values(rd(n))) for (const id of Array.isArray(v) ? v : [...(v.made || []), ...(v.changed || [])]) assert.ok(ids.has(id), id)
})

test('reality tree: the generated block is added, the curator\'s lines are untouched, a second run is identical', () => {
  const o = richFresh()
  const hand = '# Pages: EXISTS\n\n## EXISTS\n\n- [F] A hand line. Evidence: `board/a.md`; first added `abc` on 2026-11-06.\n- A claim with no evidence.\n\nSee also: [PROPOSED](proposed/index.md).\n'
  w(o.libDir, 'reality/pages/index.md', hand)
  w(o.libDir, 'reality/index.md', '# master\n\nHand text.\n\n## How to read the counts\n\nMore hand text.\n')
  w(o.libDir, 'reality/changelog.md', '# changelog\n\n## Where REALITY.md and the evidence differ (first accession)\n\n| REALITY.md says | The repository shows | Where |\n|---|---|---|\n| 24 schemas in `data/schemas/` | 3 schema files | [data](data/index.md) |\n| Something else entirely | carried | [x](x.md) |\n')
  w(o.root, 'REALITY.md', '# Reality\n\n- The data: 24 schemas in `data/schemas/`; see `board/nope/missing.json`.\n')
  w(o.root, 'data/schemas/a.schema.json', {}); w(o.root, 'data/schemas/b.schema.json', {}); w(o.root, 'data/schemas/c.schema.json', {})
  build({ ...o, now: NOW })
  const pages = fs.readFileSync(path.join(o.libDir, 'reality/pages/index.md'), 'utf8')
  const [before, rest] = pages.split(MARK_BEGIN)
  assert.equal(before, '# Pages: EXISTS\n\n## EXISTS\n\n- [F] A hand line. Evidence: `board/a.md`; first added `abc` on 2026-11-06.\n- A claim with no evidence.\n\n')
  assert.ok(rest.includes(MARK_END) && rest.endsWith('See also: [PROPOSED](proposed/index.md).\n'))
  assert.match(pages, /cards \(\d+ current/)
  assert.match(pages, /Newest five accessions/)
  const master = fs.readFileSync(path.join(o.libDir, 'reality/index.md'), 'utf8')
  assert.ok(master.indexOf(MARK_BEGIN) < master.indexOf('## How to read the counts'))
  assert.ok(master.startsWith('# master\n\nHand text.\n'))
  const dj = JSON.parse(fs.readFileSync(path.join(o.libDir, 'reality/domains.json'), 'utf8'))
  assert.ok(dj.domains.some((d) => d.id === 'misc') && dj.rules.length > 10)
  // for-conductor.md: the carried row is re-checked, REALITY.md's missing path is named
  const fc = fs.readFileSync(path.join(o.libDir, 'reality/for-conductor.md'), 'utf8')
  assert.match(fc, /still differs\*\*: REALITY\.md says 24, the repository has 3/)
  assert.match(fc, /carried from the changelog, not re-checked/)
  assert.match(fc, /`board\/nope\/missing\.json`/)
  assert.match(fc, /1 without evidence/)
  // the stocktake saw the unevidenced line
  const st = JSON.parse(fs.readFileSync(path.join(o.libDir, 'stocktake/latest.json'), 'utf8'))
  assert.equal(st.counts.ST11, 1)
  // idempotent, and the hand lines still exactly as written
  const snap = snapshot(o.libDir)
  const r2 = build({ ...o, now: '2026-11-07T11:00:00Z' })
  assert.deepEqual(r2.changed, [])
  assert.deepEqual(snapshot(o.libDir), snap)
  assert.equal(readExists({ root: o.root, libDir: o.libDir }, loadDomains(o.libDir).spec).length, 2)
})

test('reality domains: a card no rule takes falls into misc and is flagged (ST18)', () => {
  const o = richFresh()
  w(o.libDir, 'reality/domains.json', { domains: [{ id: 'pages', dir: 'pages', name: 'Pages', owner: 'x' }, { id: 'misc', dir: 'misc', name: 'Not yet placed', owner: 'x' }], rules: [{ id: 'd', when: { class: 'PUB' }, domain: 'pages' }], fallback: 'misc' })
  const res = build({ ...o, now: NOW })
  assert.ok(res.reality.unplaced.length > 5)
  assert.equal(res.stocktake.counts.ST18, res.reality.unplaced.length)
  assert.ok(fs.existsSync(path.join(o.libDir, 'reality/misc/index.md')))
})

test('stocktake: each seeded fault is caught by its code', () => {
  const o = richFresh()
  const res = build({ ...o, now: NOW })
  const cards = JSON.parse(JSON.stringify(res.cards))
  const by = (id) => cards.find((c) => c.id === id)
  by('board:board/a.md').call = by('board:board/b.md').call                       // ST06
  delete by('board:board/plan.md').provenance.evidence                              // ST05
  by('board:board/new.md').links.push({ rel: 'cites', to: 'board:board/ghost.md' }) // ST03
  by('board:board/gen.md').links.push({ rel: 'about', to: 'subj:ghost' })          // ST09
  by('board:board/old.md').what = 'Written by ghost@PrompTugal.dinis'              // ST08
  const lonely = by('board:board/new-spec.md'); lonely.links = []                  // ST04 (the others still point at it, so clear both)
  for (const c of cards) c.links = c.links.filter((l) => l.to !== lonely.id)
  by('finding:2026-11-06-fixture#3').facts.owner = ''; delete by('finding:2026-11-06-fixture#3').facts.owner // ST15
  w(o.libDir, 'reality/pages/index.md', '# Pages\n\n## EXISTS\n\n' + Array.from({ length: 320 }, (_, i) => `- [F] Line ${i}. Evidence: \`board/a.md\`.`).join('\n') + '\n- [F] Stale. Evidence: `board/gone/file.md`.\n- A claim.\n') // ST10, ST11
  w(o.root, 'CLAUDE.md', fs.readFileSync(path.join(o.root, 'CLAUDE.md'), 'utf8') + '| `phantom@PrompTugal.dinis` | nothing | nothing |\n') // ST14
  const reg = path.join(o.libDir, 'accession-register.jsonl')
  const lines = fs.readFileSync(reg, 'utf8').split('\n').filter(Boolean)
  fs.writeFileSync(reg, lines.filter((l, i) => i !== 3).join('\n') + '\n')                                                              // ST07
  w(o.root, 'board/team/librarian/waits-on-dinis.json', { waits: [{ id: 'wait:x', kind: 'blocked', since: '2026-11-01T00:00:00Z' }] })    // ST17
  const spec = loadDomains(o.libDir).spec
  const exists = readExists({ root: o.root, libDir: o.libDir }, spec)
  const secret = 'Qk9PTVNIQUtBTEFLQTEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJz'
  const st = runStocktake(res.ctx, cards, { exists, unplaced: [cards[0]], outputs: { 'x.json': secret }, last: null })
  for (const code of ['ST03', 'ST04', 'ST05', 'ST06', 'ST07', 'ST08', 'ST09', 'ST10', 'ST11', 'ST14', 'ST15', 'ST16', 'ST17', 'ST18']) assert.ok(st.counts[code] >= 1, `${code} is caught`)
  assert.equal(st.counts.ST10, 1)
  assert.equal(st.counts.ST11, 2)
  assert.equal(st.latest.blockers, 1)
  assert.deepEqual(CODES.map((c) => c[0]).filter((c) => st.counts[c] === 0 && !['ST12', 'ST13', 'ST01', 'ST02'].includes(c)), [])
  assert.ok(st.findings.some((f) => f.code === 'ST08' && f.subject === 'ghost@PrompTugal.dinis'))
  assert.ok(st.findings.some((f) => f.code === 'ST14' && /phantom/.test(f.subject) && /ROLE\.md/.test(f.text)))
  // and the library gate catches the on-disk faults of the same kind
  const msgs = check({ root: o.root, libDir: o.libDir }).errors.join('\n')
  assert.match(msgs, /over 300/)
})

test('check catches a dangling link, a missing inverse and a link of an unknown type on disk', () => {
  const o = richFresh()
  build({ ...o, now: NOW })
  const f = path.join(o.libDir, 'catalogue/WRK.jsonl')
  const lines = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
  const a = lines.find((c) => c.id === 'board:board/a.md')
  a.links.push({ rel: 'cites', to: 'board:board/ghost.md' })
  a.links.push({ rel: 'part_of', to: 'pass:2026-11-06-fixture' })      // its inverse is not on the pass
  a.links.push({ rel: 'weird_rel', to: 'board:board/b.md' })
  fs.writeFileSync(f, lines.map((l) => JSON.stringify(l)).join('\n') + '\n')
  const msgs = check({ root: o.root, libDir: o.libDir }).errors.join('\n')
  assert.match(msgs, /ghost\.md: target does not exist/)
  assert.match(msgs, /the inverse includes is missing/)
  assert.match(msgs, /unknown link type/)
})

test('round 2 on the real catalogue: no dangling link, subjects in the vocabulary, the gate files valid, a second run identical', { skip: !fs.existsSync(path.join(realRoot, 'board/catalogue.json')) }, () => {
  const o = fresh(realRoot)
  for (const f of ['vocabulary/team-headings.json', 'authority/forms.json']) { fs.mkdirSync(path.dirname(path.join(o.libDir, f)), { recursive: true }); fs.copyFileSync(path.join(libReal, f), path.join(o.libDir, f)) }
  const res = build({ ...o, now: NOW })
  assert.equal(res.stocktake.counts.ST03, 0)
  assert.equal(res.stocktake.counts.ST09, 0)
  assert.equal(res.stocktake.counts.ST16, 0)
  assert.equal(res.stocktake.counts.ST05, 0)
  assert.equal(res.stocktake.counts.ST06, 0)
  const r = check(o)
  assert.equal(r.errors.length, 0, r.errors.join('\n'))
  assert.ok(r.stats.bytes < 12 * 1024 * 1024, `${r.stats.bytes} bytes`)
  const snap = snapshot(o.libDir)
  const r2 = build({ ...o, now: '2026-11-08T09:00:00Z' })
  assert.deepEqual(r2.changed, [])
  assert.deepEqual(snapshot(o.libDir), snap)
})

test('authority/concepts.json comes from data/concepts.json (the ontologist\'s, read only), with the hand extras kept', () => {
  const o = richFresh()
  w(o.root, 'data/concepts.json', { about: 'x', kept_by: 'ontologist@PrompTugal.dinis', updated: '2026-11-06', from: 'x', kinds: { process: 'p' }, concepts: [
    { id: 'the-fractal-rule', term: 'the fractal rule', named_by: 'Dinis', definition: 'The same rule at every level — split early.', source: 'M3', kind: 'principle', see: ['board/b.md', 'board/a.md'], in_ontology: 'story.status' },
    { id: 'a-plain-one', term: 'a plain one', named_by: 'Dinis', definition: 'No file yet.', source: 'M4', kind: 'process' },
  ] })
  const res = build({ ...o, now: NOW })
  const recs = JSON.parse(fs.readFileSync(path.join(o.libDir, 'authority/concepts.json'), 'utf8')).records
  const f = recs.find((r) => r.id === 'auth:concept:the-fractal-rule')
  assert.equal(f.heading, 'the fractal rule')
  assert.equal(f.source, 'M3')
  assert.equal(f.concept_kind, 'principle')
  assert.deepEqual(f.implemented_in, ['board/a.md', 'board/b.md'])
  assert.equal(f.card, 'concept:the-fractal-rule', 'the ledger card of the same id is the record\'s card')
  assert.ok(!/—/.test(f.note), 'no em-dash in prose')
  assert.deepEqual(f.established.from, ['data/concepts.json'])
  assert.deepEqual(recs.find((r) => r.id === 'auth:concept:a-plain-one').implemented_in, [])
  assert.ok(recs.some((r) => r.id === 'auth:concept:hold' && /hand/.test(r.source)), 'the hand extras stay')
  assert.equal(check({ root: o.root, libDir: o.libDir }).errors.length, 0)
  assert.ok(res)
})
