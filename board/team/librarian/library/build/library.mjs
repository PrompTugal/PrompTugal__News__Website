#!/usr/bin/env node
// The library's generator (rounds 1 and 2: cards, links, authority, vocabulary, indexes, reality tree, stocktake, weeding). Node 18+, no dependencies.
//   node board/team/librarian/library/build/library.mjs build|check|authority|cards|shelf [--root DIR] [--out DIR]
// It reads board/catalogue.json (written by board/team/librarian/catalogue.mjs; refresh that first), board/keys.json,
// data/newsroom/agents.json and CLAUDE.md, and writes only under the library directory.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readJson, readLines, writeIfChanged, cmp, stable } from './lib/util.mjs'
import { buildAuthority } from './lib/authority.mjs'
import { buildCards, cardFiles, compactCards } from './lib/cards.mjs'
import { readCards } from './lib/graph.mjs'
import { shelfPages } from './lib/shelf.mjs'
import { check } from './lib/check.mjs'
import { buildEntityAuthority } from './lib/entities.mjs'
import { buildVocabulary, linksVocabulary } from './lib/vocab.mjs'
import { buildLinks } from './lib/links.mjs'
import { buildIndexes } from './lib/indexes.mjs'
import { buildReality } from './lib/reality.mjs'
import { runStocktake, weedingPage } from './lib/stocktake.mjs'
import { buildGraphs } from './lib/graph.mjs'
import { buildAids, buildGuidance, buildFrontDoor } from './lib/aids.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const a = { cmd: argv[0] || 'build', root: null, out: null }
  for (let i = 1; i < argv.length; i++) {
    if (argv[i] === '--root') a.root = path.resolve(argv[++i])
    else if (argv[i] === '--out') a.out = path.resolve(argv[++i])
    else { console.error(`unknown argument ${argv[i]}`); process.exit(2) }
  }
  a.libDir = a.out || path.resolve(here, '..')
  a.root = a.root || path.resolve(here, '../../../../..')
  return a
}

export function build(opts) {
  const { root, libDir } = opts
  const now = opts.now || process.env.LIBRARY_NOW || new Date().toISOString().replace(/\.\d+Z$/, 'Z')
  const catalogue = readJson(path.join(root, 'board/catalogue.json'))
  const ctx = { root, libDir, catalogue, now }
  const changed = []
  const put = (rel, text) => { if (writeIfChanged(path.join(libDir, rel), text)) changed.push(rel) }

  const outputs = {} // every generated text of the run, for the stocktake's scan (ST16)
  const putOut = (rel, text) => { outputs[rel] = text; put(rel, text) }

  ctx.authority = buildAuthority(ctx)
  putOut('authority/agent.json', ctx.authority.text)
  const ent = buildEntityAuthority(ctx)
  ctx.entities = ent.records
  for (const [rel, text] of Object.entries(ent.files)) putOut(rel, text)
  const vocab = buildVocabulary(ctx, ctx.entities)
  ctx.subjects = vocab.subjects
  putOut('vocabulary/subjects.json', vocab.text)
  putOut('vocabulary/links.json', linksVocabulary(root))

  const { cards, lines, classification, retro } = buildCards(ctx)
  ctx.classification = classification
  const linkReport = buildLinks(ctx, cards)
  if (lines.length) {
    const regFile = path.join(libDir, 'accession-register.jsonl')
    fs.mkdirSync(libDir, { recursive: true })
    let cur = fs.existsSync(regFile) ? fs.readFileSync(regFile, 'utf8') : ''
    if (cur && !cur.endsWith('\n')) cur += '\n'
    fs.writeFileSync(regFile, cur + lines.map((l) => JSON.stringify(l)).join('\n') + '\n')
    changed.push('accession-register.jsonl')
  }
  const reg = readLines(path.join(libDir, 'accession-register.jsonl'))
  const last = reg.length ? JSON.parse(reg[reg.length - 1]).at : null

  const files = cardFiles(cards)
  for (const [rel, text] of Object.entries(files)) putOut(rel, text)
  putOut('cards.json', compactCards(cards, catalogue, last))

  const shelves = shelfPages(cards, ctx)
  for (const [rel, text] of Object.entries(shelves)) putOut(rel, text)
  // a shelf page that no longer exists (a class shrank) is generated output: remove it
  const sdir = path.join(libDir, 'shelf-list')
  if (fs.existsSync(sdir)) for (const f of fs.readdirSync(sdir)) if (!(`shelf-list/${f}` in shelves)) { fs.unlinkSync(path.join(sdir, f)); changed.push(`shelf-list/${f} (removed)`) }

  const idx = buildIndexes(ctx, cards)
  for (const [rel, text] of Object.entries(idx.files)) putOut(rel, text)

  // the reality tree: generated blocks and for-conductor.md; then the stocktake reads the tree as it now stands
  const reality = buildReality(ctx, cards)
  for (const [rel, text] of Object.entries(reality.files)) put(rel, text)
  const st = runStocktake(ctx, cards, { exists: reality.exists, unplaced: reality.unplaced, outputs, last })
  put('stocktake/latest.json', stable(st.latest, 1) + '\n')
  put(`stocktake/${st.stamp}.md`, st.text)
  put('weeding.md', weedingPage(ctx, cards))

  return { cards, appended: lines.length, retro, changed, ctx, linkReport, stocktake: st, reality, indexes: idx.counts }
}

// Round 3: the graphs, the finding aids, the guidance collection and the front door. They read the cards the first
// pass wrote (the catalogue files), so they run after build(); the engine's rank and layout are imported, hence async.
export async function buildRound3(opts) {
  const { root, libDir } = opts
  const ctx = opts.ctx || { root, libDir, catalogue: readJson(path.join(root, 'board/catalogue.json')) }
  ctx.classification = ctx.classification || readJson(path.join(libDir, 'classification.json'))
  const cards = readCards(libDir)
  const changed = []
  const put = (rel, text) => { if (writeIfChanged(path.join(libDir, rel), text)) changed.push(rel) }
  const g = await buildGraphs(ctx, cards, put)
  const aids = buildAids(ctx, cards)
  const guid = buildGuidance(ctx, cards)
  const door = buildFrontDoor(ctx, cards)
  const out = { ...aids.files, ...guid.files, ...door.files }
  for (const [rel, text] of Object.entries(out)) put(rel, text)
  // generated pages that no longer exist (a pass or a guidance part that went) are removed
  for (const [dir, re] of [['finding-aids/passes', /\.md$/], ['finding-aids', /^[A-Z]+\.md$/], ['special', /^guidance-\d+\.md$/]]) {
    const d = path.join(libDir, dir)
    if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (re.test(f) && !(`${dir}/${f}` in out)) { fs.unlinkSync(path.join(d, f)); changed.push(`${dir}/${f} (removed)`) }
  }
  return { cards, graphs: g, aids, guidance: guid, changed, files: Object.keys(out) }
}

async function main() {
  const a = parseArgs(process.argv.slice(2))
  if (a.cmd === 'build' || a.cmd === 'authority' || a.cmd === 'cards' || a.cmd === 'shelf') {
    // the steps share one pass: authority, accession and cards, shelf list
    const r = build(a)
    const r3 = await buildRound3({ ...a, ctx: r.ctx })
    for (const e of r3.graphs.errors) console.error(`graph: ${e}`)
    r.changed.push(...r3.changed)
    if (r3.graphs.errors.length) process.exitCode = 1
    const byType = {}
    for (const c of r.cards) byType[c.type] = (byType[c.type] || 0) + 1
    console.log(`links: ${r.linkReport.forward} forward and ${r.linkReport.inverse} inverse edges (${Object.entries(r.linkReport.byRel).sort((x, y) => cmp(x[0], y[0])).map(([k, v]) => `${k} ${v}`).join(', ')}); ${r.linkReport.superseded.length} superseded`)
    console.log(`stocktake: ${Object.entries(r.stocktake.counts).filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(', ') || 'no findings'}; indexes: ${Object.entries(r.indexes).map(([k, v]) => `${k} ${v}`).join(', ')}; reality: ${r.reality.conductor.differ} differences still differ, ${r.reality.unplaced.length} cards in no domain`)
    console.log(`round 3: library graph ${r3.graphs.library.data.counts.nodes} nodes and ${r3.graphs.library.data.counts.edges} edges; reality tree ${r3.graphs.reality.data.counts.nodes} nodes and ${r3.graphs.reality.data.counts.edges} edges (${r3.graphs.engine.rank ? 'ranks from rank.mjs' : 'degree only'}, ${r3.graphs.engine.layout ? 'layout from layout.mjs' : 'grid'}); ${r3.aids.classes} class finding aids, ${r3.aids.passes} pass finding aids, guidance in ${r3.guidance.parts} parts (${r3.guidance.ideas} ideas, ${r3.guidance.later} Later)`)
    console.log(`library: ${r.cards.length} cards (${Object.entries(byType).sort((x, y) => cmp(x[0], y[0])).map(([k, v]) => `${k} ${v}`).join(', ')}); ${r.appended} register lines appended${r.retro ? ' (retrospective accession)' : ''}; ${r.changed.length} files written`)
    return
  }
  if (a.cmd === 'check') {
    const r = check({ root: a.root, libDir: a.libDir })
    for (const w of r.warnings.slice(0, 20)) console.log(`warning: ${w}`)
    if (r.warnings.length > 20) console.log(`warning: ... and ${r.warnings.length - 20} more`)
    for (const e of r.errors.slice(0, 50)) console.error(`error: ${e}`)
    if (r.errors.length > 50) console.error(`error: ... and ${r.errors.length - 50} more`)
    console.log(`library check: ${r.errors.length ? 'FAILED' : 'OK'} (${r.stats.cards} cards, ${r.stats.files} files, ${r.stats.bytes} bytes, ${r.stats.register} register lines, ${r.errors.length} errors, ${r.warnings.length} warnings)`)
    process.exit(r.errors.length ? 1 : 0)
  }
  console.error('usage: library.mjs build|check [--root DIR] [--out DIR]')
  process.exit(2)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1) })
