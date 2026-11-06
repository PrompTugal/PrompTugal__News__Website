// Round 3: the graphs in the explorer's shape, the finding aids, the guidance collection, the reading room, the desk's
// cryptographic check. Run: node --test board/team/librarian/library/tests/*.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { build, buildRound3 } from '../build/library.mjs'
import { check } from '../build/lib/check.mjs'
import { validateShape, checkPresets, readCards } from '../build/lib/graph.mjs'
import { verifySlips, intake, readRegister } from '../build/desk.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const lib = path.resolve(here, '..')
const root = path.resolve(here, '../../../../..')
const haveReal = fs.existsSync(path.join(root, 'board/catalogue.json'))
const NOW = '2026-11-07T08:00:00Z'
const readJ = (f) => JSON.parse(fs.readFileSync(f, 'utf8'))

// one real build into a temp folder, shared by the tests below
let cached
async function real() {
  if (cached) return cached
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'library-r3-'))
  for (const f of ['classification.json', 'vocabulary/team-headings.json', 'authority/forms.json', 'graph/presets.json', 'finding-aids/scope-notes.json', 'README.md', 'reading-room.htm']) {
    fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true }); fs.copyFileSync(path.join(lib, f), path.join(out, f))
  }
  fs.cpSync(path.join(lib, 'reality'), path.join(out, 'reality'), { recursive: true })
  const o = { root, libDir: out }
  const r = build({ ...o, now: NOW })
  const r3 = await buildRound3({ ...o, ctx: r.ctx })
  cached = { o, r, r3 }
  return cached
}

test('the graph files validate against the explorer shape: keys, index bounds, verbs, sources, counts, degrees', { skip: !haveReal }, async () => {
  const { o, r3 } = await real()
  assert.deepEqual(r3.graphs.errors, [])
  const lib_ = readJ(path.join(o.libDir, 'graph/library-graph.json'))
  const tree = readJ(path.join(o.libDir, 'graph/reality-tree.json'))
  assert.deepEqual(validateShape(lib_, 'library'), [])
  assert.deepEqual(validateShape(tree, 'tree'), [])
  assert.ok(lib_.counts.nodes > 800 && lib_.counts.nodes < 1600, `${lib_.counts.nodes} nodes`)
  assert.ok(tree.counts.nodes > 300)
  // the same top-level keys as the site's own explorer.json, when the site is built
  const ex = path.join(root, 'api/v1/graph/explorer.json')
  if (fs.existsSync(ex)) {
    const site = readJ(ex)
    assert.deepEqual(Object.keys(lib_), Object.keys(site))
    assert.deepEqual(Object.keys(lib_.verbs[0]), Object.keys(site.verbs[0]))
    assert.deepEqual(Object.keys(lib_.worlds[0]), Object.keys(site.worlds[0]))
    assert.deepEqual(Object.keys(lib_.types[0]), Object.keys(site.types[0]))
    assert.equal(lib_.edges[0].length, site.edges[0].length)
    // every node field is one the explorer's node has, or one of the library's own named extras
    const allowed = new Set([...site.nodes.flatMap((n) => Object.keys(n)), 'call', 'date', 'by', 'status', 'category', 'kind', 'what'])
    for (const n of lib_.nodes) for (const k of Object.keys(n)) assert.ok(allowed.has(k), `node field ${k}`)
  }
  // the facet fields the explorer reads are among the node fields it filters on
  const graphJs = fs.readFileSync(path.join(root, 'newsroom/build/features/graph.mjs'), 'utf8')
  const facet = /const FACET_FIELDS = \[(.*?)\]/.exec(graphJs)
  if (facet) for (const k of Object.keys(lib_.nodes.find((n) => n.type === 'pass'))) if (!['id', 'type', 'label', 'page', 'src', 'deg', 'bc', 'pr', 'x', 'y', 'call', 'what'].includes(k)) assert.ok(facet[1].includes(`'${k}'`), `${k} is not an explorer facet field`)
})

test('the library graph keeps its promises: single nodes are cards, entity pages stay out, ranks come from the engine', { skip: !haveReal }, async () => {
  const { o } = await real()
  const g = readJ(path.join(o.libDir, 'graph/library-graph.json'))
  const cards = new Map(readCards(o.libDir).map((c) => [c.id, c]))
  for (const n of g.nodes) {
    if (['collection', 'subject', 'agent'].includes(n.type)) continue
    assert.ok(cards.has(n.id), `${n.id} is not a card`)
    assert.ok(!/^companies\/|^people\/|^events\/|^organisations\/|^places\//.test(n.page || ''), `${n.id} is an entity page as a single node`)
  }
  assert.equal(g.nodes.filter((n) => n.type === 'pass').length, [...cards.values()].filter((c) => c.type === 'pass').length)
  assert.equal(g.nodes.filter((n) => n.type === 'idea').length, [...cards.values()].filter((c) => c.type === 'idea').length)
  assert.ok(g.nodes.filter((n) => n.type === 'collection').length >= 40)
  // the ranks are the engine's: recompute with rank.mjs over the same edges
  const { rank } = await import(path.join(root, 'newsroom/build/features/graph/rank.mjs'))
  const R = rank(g.nodes.length, g.edges.map((e) => [e[0], e[1]]))
  assert.deepEqual(g.nodes.map((n) => n.deg), R.degree)
  assert.equal(g.nodes[5].pr, Math.round(R.pagerank[5] * 1e7) / 1e4)
  // edges name the maker of a pass, and every verb used is in the table
  const verbs = new Set(g.edges.map((e) => g.verbs[e[2]].verb))
  for (const v of ['made_by', 'part_of', 'cites', 'about', 'owned_by']) assert.ok(verbs.has(v), v)
})

test('the explorer engine reads the library graph: a path from an agent to a finding reads as a sentence', { skip: !haveReal }, async () => {
  const { o } = await real()
  const g = readJ(path.join(o.libDir, 'graph/library-graph.json'))
  const win = {}
  new Function('window', fs.readFileSync(path.join(root, 'assets/graph/engine.js'), 'utf8'))(win)
  const E = win.NRGraphEngine
  const G = E.index(g)
  const fid = g.nodes.find((n) => n.type === 'finding').id
  const paths = E.shortestPaths(G, E.resolve(G, 'auth:agent:conductor'), E.resolve(G, fid), {})
  assert.ok(paths.length >= 1, 'no path')
  assert.match(paths[0].sentence, /conductor@PrompTugal\.dinis.*\.$/)
  // a preset state computes to a drawable view
  const presets = readJ(path.join(o.libDir, 'graph/presets.json')).presets
  for (const [k, p] of Object.entries(presets)) {
    const gg = E.index(readJ(path.join(o.libDir, p.data === 'reality' ? 'graph/reality-tree.json' : 'graph/library-graph.json')))
    const st = Object.assign(E.defaultState(), JSON.parse(JSON.stringify(p.state)))
    st.top = Object.assign({ n: 0, by: 'pagerank', what: 'nodes' }, st.top)
    const res = E.compute(gg, st, null)
    assert.ok(res.nodes.size >= 8, `preset ${k} draws ${res.nodes.size} nodes`)
    assert.ok(res.nodes.size <= 700, `preset ${k} draws ${res.nodes.size} nodes`)
  }
  // the four named views of the commission are there, each with a caption
  for (const k of ['who-made-what', 'guidance', 'passes', 'reality-tree']) assert.ok(presets[k] && presets[k].caption.length > 60, k)
})

test('shape validation catches an out-of-bounds edge, a wrong count, a missing key and an unknown type', () => {
  const base = { id: 'x', version: 'v', about: 'a', grammar: 'g', counts: { nodes: 2, edges: 1 }, worlds: [{ id: 'w', label: 'W', types: ['t'] }], types: [{ id: 't', label: 'T', world: 'w' }],
    verbs: [{ verb: 'v', inverse: 'i', world: 'w', bridge: false, reads: 'a', reads_inverse: 'b' }], views: [], sources: ['s'],
    nodes: [{ id: 'a', type: 't', label: 'A', src: 0, deg: 1, bc: 0, pr: 1, x: 0, y: 0 }, { id: 'b', type: 't', label: 'B', src: -1, deg: 1, bc: 0, pr: 1, x: 0, y: 0 }], edges: [[0, 1, 0, -1, 0, 0]] }
  assert.deepEqual(validateShape(base), [])
  const bad = (f) => { const c = JSON.parse(JSON.stringify(base)); f(c); return validateShape(c).join('\n') }
  assert.match(bad((c) => { c.edges[0][1] = 9 }), /endpoint out of bounds/)
  assert.match(bad((c) => { c.edges[0][2] = 3 }), /verb index/)
  assert.match(bad((c) => { c.edges[0][3] = 5 }), /source index/)
  assert.match(bad((c) => { c.counts.nodes = 3 }), /counts/)
  assert.match(bad((c) => { delete c.sources }), /missing top-level key sources/)
  assert.match(bad((c) => { c.nodes[0].type = 'zzz' }), /unknown type/)
  assert.match(bad((c) => { c.nodes[0].src = 4 }), /source index/)
  assert.match(bad((c) => { c.edges[0][4] = 'yesterday' }), /read/)
  // a preset that names a type the graph lacks
  assert.match(checkPresets({ presets: { k: { title: 't', caption: 'c', label: 'l', data: 'g', state: { view: 'whole', types: ['nope'] } } } }, { g: base }).join('\n'), /type nope/)
  assert.match(checkPresets({ presets: { k: { title: 't', caption: 'c', label: 'l', data: 'g', state: { view: 'industry' } } } }, { g: base }).join('\n'), /state\.view/)
})

test('the finding aids: one per class and per pass, within the reading limits, with the container list and see also', { skip: !haveReal }, async () => {
  const { o, r3 } = await real()
  const cards = readCards(o.libDir)
  const classes = [...new Set(cards.map((c) => c.call.split('.')[0]))]
  for (const k of classes) {
    const f = path.join(o.libDir, `finding-aids/${k}.md`)
    assert.ok(fs.existsSync(f), `${k}.md`)
    const t = fs.readFileSync(f, 'utf8')
    assert.match(t, /## The container list/)
    assert.match(t, /## Start here/)
    assert.match(t, /## See also/)
    assert.ok(t.split('\n').length <= 150, `${k}: ${t.split('\n').length} lines`)
  }
  const passes = cards.filter((c) => c.type === 'pass')
  assert.equal(r3.aids.passes, passes.length)
  for (const p of passes) {
    const f = path.join(o.libDir, `finding-aids/passes/${p.id.slice(5)}.md`)
    const t = fs.readFileSync(f, 'utf8')
    assert.match(t, /Scope note/)
    const nf = cards.filter((c) => c.type === 'finding' && c.links.some((l) => l.rel === 'part_of' && l.to === p.id)).length
    const rows = t.split('\n').filter((l) => /^\| \d+ \|/.test(l)).length
    assert.equal(rows, nf, `${p.id}: ${rows} rows for ${nf} findings`)
  }
  // no em-dash, no table of more than 25 rows, in any aid
  assert.equal(check(o).errors.filter((e) => /finding-aids|special/.test(e)).length, 0)
})

test("Dinis's guidance: every idea with his words verbatim, state and owner; the Later ones first; split into parts", { skip: !haveReal }, async () => {
  const { o, r3 } = await real()
  const cards = readCards(o.libDir)
  const ideas = cards.filter((c) => c.type === 'idea')
  const files = fs.readdirSync(path.join(o.libDir, 'special')).filter((f) => /^guidance-\d+\.md$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)))
  assert.equal(files.length, r3.guidance.parts)
  const text = files.map((f) => fs.readFileSync(path.join(o.libDir, 'special', f), 'utf8'))
  const all = text.join('\n')
  for (const f of text) assert.ok(f.split('\n').length <= 170, 'a part is too long')
  for (const c of ideas) {
    const id = c.id.slice(5)
    assert.ok(all.includes(`**${id}**`), `${id} is missing`)
    if (c.words) assert.ok(all.includes(c.words.replace(/\s+/g, ' ')), `the words of ${id} are not verbatim`)
    if (c.facts.owner) assert.ok(all.includes(`owner ${c.facts.owner.replace(/\|/g, '/')}`), `owner of ${id}`)
  }
  // the Later ones come first: every idea of part 1 is Later, and no Later idea is after the last Later part
  const isLater = (c) => c.facts.later === true || /^later/.test(String(c.facts.when || ''))
  const laterIds = new Set(ideas.filter(isLater).map((c) => c.id.slice(5)))
  const nLaterParts = Math.ceil(laterIds.size / 50)
  for (let i = 0; i < files.length; i++) {
    const ids = [...text[i].matchAll(/^- \*\*([^*]+)\*\*/gm)].map((m) => m[1])
    for (const id of ids) assert.equal(laterIds.has(id), i < nLaterParts, `${id} is in part ${i + 1}`)
  }
  assert.match(fs.readFileSync(path.join(o.libDir, 'special/guidance.md'), 'utf8'), /The Later ones come first/)
})

test('the front door and the readme exist and keep to the plain-words rules', { skip: !haveReal }, async () => {
  const { o } = await real()
  const idx = fs.readFileSync(path.join(o.libDir, 'index.md'), 'utf8')
  for (const w of ['New this hour', 'The collections', 'Agents: ask here', 'reading-room.htm']) assert.ok(idx.includes(w), w)
  assert.ok(idx.split('\n').length <= 150)
  for (const f of ['index.md', 'README.md']) assert.ok(!fs.readFileSync(f === 'index.md' ? path.join(o.libDir, f) : path.join(lib, f), 'utf8').includes('—'), `${f} has an em-dash`)
  assert.match(fs.readFileSync(path.join(lib, 'README.md'), 'utf8'), /If you are an agent/)
})

test('a second run of the whole build changes nothing (graphs, aids, guidance, front door)', { skip: !haveReal }, async () => {
  const { o, r } = await real()
  const r2 = build({ ...o, now: '2026-11-08T09:00:00Z' })
  const r3 = await buildRound3({ ...o, ctx: r2.ctx })
  assert.deepEqual(r2.changed, [])
  assert.deepEqual(r3.changed, [])
  assert.equal(check(o).errors.length, 0, check(o).errors.join('\n'))
  assert.ok(check(o).stats.bytes < 7 * 1024 * 1024)
})

test('reading-room.htm: absolute site assets only, no other host, no font, titles as text, the ids the explorer reads', () => {
  const html = fs.readFileSync(path.join(lib, 'reading-room.htm'), 'utf8')
  // no request to another host: every src and href that is absolute is a path of this site
  for (const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) assert.ok(!/^(https?:)?\/\//.test(m[1]), `an external address: ${m[1]}`)
  assert.ok(!/@import|@font-face|fonts\.googleapis|\burl\(\s*['"]?https?:/.test(html), 'a font or an import')
  assert.ok(!/fetch\(\s*['"`]https?:/.test(html))
  for (const need of ['/assets/vendor/cytoscape/cytoscape.min.js', '/assets/graph/engine.js', '/assets/graph/explorer.js', './graph/library-graph.json', './graph/presets.json']) assert.ok(html.includes(need), need)
  assert.ok(html.includes("json('cards.json')"))
  // data goes in as text, never as markup: the page's own script has no innerHTML or insertAdjacentHTML or document.write
  const script = html.slice(html.lastIndexOf('<script>'))
  assert.ok(!/innerHTML|insertAdjacentHTML|document\.write|outerHTML/.test(script), 'markup from data')
  assert.ok(script.includes('textContent'))
  // every id the explorer script reads is in the page, or made by the explorer itself
  const ex = fs.readFileSync(path.join(root, 'assets/graph/explorer.js'), 'utf8')
  const ids = new Set([...ex.matchAll(/\$\('#([\w-]+)'\)/g)].map((m) => m[1]))
  for (const m of ex.matchAll(/\$\('\[?(?:data-[\w-]+)/g)) void m
  const madeByExplorer = new Set(['gx-caption', 'gx-png'])
  const dynamic = new Set(['gx-days'])
  for (const id of ids) if (!madeByExplorer.has(id) && !dynamic.has(id)) assert.ok(html.includes(`id="${id}"`), `the page lacks #${id}, which the explorer reads`)
  assert.ok(html.includes('id="gx-days"') && html.includes('id="gx-topic"') && html.includes('id="gx-country"'))
  assert.ok(html.includes('name="viewport"'))
})

test('reading-room.htm draws the graph in headless Chromium (two sizes), with no console error and no request to another host', { skip: !haveReal || spawnSync('node', ['-e', "require('playwright')"], { cwd: root }).status !== 0, timeout: 180000 }, () => {
  const shots = fs.mkdtempSync(path.join(os.tmpdir(), 'rr-shots-'))
  const r = spawnSync('node', [path.join(here, 'reading-room.check.cjs'), '--shots', shots], { cwd: root, encoding: 'utf8', timeout: 170000 })
  assert.equal(r.status, 0, (r.stdout || '').slice(-1500) + (r.stderr || ''))
  const rep = JSON.parse(r.stdout)
  assert.deepEqual(rep.errors, [])
  assert.deepEqual(rep.external, [])
  assert.ok(rep.shots.length >= 2)
})

// ---------------------------------------------------------------- the desk: cryptographic verification
const py = spawnSync('python3', ['-c', 'import sgit_ai.crypto.PKI__Crypto, cryptography'], { encoding: 'utf8' })
const havePy = py.status === 0
function sealFixture(dir) {
  // two agents' keys; a message signed by the first, one tampered after signing, one signed by an unknown key, one unsigned
  const script = `
import json, sys, base64, os
from sgit_ai.crypto.PKI__Crypto import PKI__Crypto
from cryptography.hazmat.primitives.asymmetric import rsa
c = PKI__Crypto()
def gen_enc():
    k = rsa.generate_private_key(public_exponent=65537, key_size=2048)   # 2048 for speed; the code under test never sees this key
    return k, k.public_key()
d = sys.argv[1]
def mk(label):
    enc = gen_enc(); sig = c.generate_signing_key_pair()
    return dict(enc=enc, sig=sig, bundle=dict(v='1', encrypt=c.export_public_key_pem(enc['public_key'] if isinstance(enc, dict) else enc[1]), sign=c.export_public_key_pem(sig['public_key'] if isinstance(sig, dict) else sig[1]), label=label))
def pair(x): return (x['private_key'], x['public_key']) if isinstance(x, dict) else x
a = mk('alice@PrompTugal.dinis'); b = mk('mallory@PrompTugal.dinis'); r = mk('librarian@PrompTugal.dinis')
def fp(x): return c.compute_fingerprint(pair(x)[1])
keys = []
for who, k in (('alice@PrompTugal.dinis', a),):
    bd = dict(k['bundle']); bd['fingerprint'] = fp(k['enc']); bd['signing_fingerprint'] = fp(k['sig'])
    keys.append(dict(id='alice-promptugal', agent=who, status='active', bundle=bd))
json.dump(dict(keys=keys), open(os.path.join(d, 'keys.json'), 'w'))
rpub = pair(r['enc'])[1]
def seal(text, signer):
    return c.hybrid_encrypt(rpub, text, signing_private_key=pair(signer['sig'])[0], signing_fingerprint=fp(signer['sig'])) if signer else c.hybrid_encrypt(rpub, text)
msgs = {'m-good': seal('QUESTION\\nWhere is X?', a), 'm-unknown': seal('QUESTION\\nWho am I?', b), 'm-none': seal('hello', None)}
good = json.loads(base64.b64decode(msgs['m-good']))
ct = bytearray(base64.b64decode(good['c'])); ct[0] ^= 1; good['c'] = base64.b64encode(bytes(ct)).decode()
msgs['m-tampered'] = base64.b64encode(json.dumps(good).encode()).decode()
for k, v in msgs.items(): open(os.path.join(d, k + '.txt'), 'w').write(v)
`
  const r = spawnSync('python3', ['-c', script, dir], { encoding: 'utf8' })
  assert.equal(r.status, 0, r.stderr)
}
test('verify_envelope.py checks the ECDSA signature against board/keys.json: true, false for a tampered or unknown signer, null if unsigned', { skip: !havePy }, () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'seal-'))
  sealFixture(d)
  const run = (name) => JSON.parse(spawnSync('python3', ['-I', path.join(lib, 'build/verify_envelope.py'), 'check', '--keys', path.join(d, 'keys.json'), '--envelope', path.join(d, name + '.txt')], { encoding: 'utf8' }).stdout)[name + '.txt']
  const good = run('m-good')
  assert.equal(good.verified, true); assert.equal(good.signer, 'alice@PrompTugal.dinis'); assert.equal(good.key, 'alice-promptugal')
  const bad = run('m-tampered')
  assert.equal(bad.verified, false); assert.match(bad.reason, /does not match/)
  const unk = run('m-unknown')
  assert.equal(unk.verified, false); assert.match(unk.reason, /no key in board\/keys\.json/)
  const none = run('m-none')
  assert.equal(none.verified, null); assert.match(none.reason, /no signature/)
})

test('desk: new slips carry verified true or false from the check; old register lines are never rewritten; a verified event is appended', { skip: !havePy }, () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'deskv-'))
  sealFixture(d)
  const libDir = path.join(d, 'board/team/librarian/library'); fs.mkdirSync(libDir, { recursive: true })
  const keys = path.join(d, 'keys.json')
  const from = path.join(d, 'msgs/2026-11-06'); fs.mkdirSync(from, { recursive: true })
  const msg = (id, sent, who) => fs.writeFileSync(path.join(from, id + '.json'), JSON.stringify({ from: who, to: 'librarian@PrompTugal.dinis', sent, subject: 'a question?', text: 'QUESTION\nWhere is X?', sealed_by: 'sha256:' + 'a'.repeat(16) }))
  msg('m-good', '2026-11-06T08:00Z', 'alice@PrompTugal.dinis'); msg('m-tampered', '2026-11-06T08:01Z', 'alice@PrompTugal.dinis')
  const results = path.join(d, 'results.json')
  const res = {}
  for (const n of ['m-good', 'm-tampered']) res[n] = JSON.parse(spawnSync('python3', ['-I', path.join(lib, 'build/verify_envelope.py'), 'check', '--keys', keys, '--envelope', path.join(d, n + '.txt')], { encoding: 'utf8' }).stdout)[n + '.txt']
  fs.writeFileSync(results, JSON.stringify(res))
  const o = { lib: libDir, now: '2026-11-06T10:00:00Z', keys, cards: path.join(d, 'cards.json'), catalogue: path.join(d, 'cat.json'), waits: path.join(d, 'w.json'), accessions: path.join(d, 'a.jsonl') }
  // an old slip, taken before the check existed
  const taken = intake({ ...o, from: path.join(d, 'msgs') })
  assert.equal(taken.taken.length, 2)
  const regFile = path.join(libDir, 'desk/register.jsonl')
  const before = fs.readFileSync(regFile, 'utf8')
  assert.ok(!/"verified"/.test(before))
  const v = verifySlips({ ...o, results })
  assert.deepEqual(v.done.map((x) => x.verified), [true, false])
  const after = fs.readFileSync(regFile, 'utf8')
  assert.ok(after.startsWith(before), 'an old register line was rewritten')
  const events = after.slice(before.length).trim().split('\n').map((l) => JSON.parse(l))
  assert.deepEqual(events.map((e) => [e.event, e.verified]), [['verified', true], ['verified', false]])
  assert.equal(readRegister(path.join(libDir, 'desk')).slips[0].verified, true)
  assert.match(fs.readFileSync(path.join(libDir, 'desk/slips', events[0].id + '.md'), 'utf8'), /verified: true/)
  assert.match(fs.readFileSync(path.join(libDir, 'desk/slips', events[1].id + '.md'), 'utf8'), /verified: false/)
  // run again: nothing new
  assert.equal(verifySlips({ ...o, results }).done.length, 0)
  // a new slip taken with the check in hand carries it from the start
  msg('m-new', '2026-11-06T09:00Z', 'alice@PrompTugal.dinis')
  fs.writeFileSync(results, JSON.stringify({ ...res, 'm-new': res['m-good'] }))
  const t2 = intake({ ...o, from: path.join(d, 'msgs'), verified: results })
  assert.equal(t2.taken[0].verified, true)
  assert.match(fs.readFileSync(regFile, 'utf8').trim().split('\n').pop(), /"verified":true/)
})
