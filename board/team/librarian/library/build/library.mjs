#!/usr/bin/env node
// The library's generator (round 1). Node 18+, no dependencies.
//   node board/team/librarian/library/build/library.mjs build|check|authority|cards|shelf [--root DIR] [--out DIR]
// It reads board/catalogue.json (written by board/team/librarian/catalogue.mjs; refresh that first), board/keys.json,
// data/newsroom/agents.json and CLAUDE.md, and writes only under the library directory.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readJson, readLines, writeIfChanged, cmp } from './lib/util.mjs'
import { buildAuthority } from './lib/authority.mjs'
import { buildCards, cardFiles, compactCards } from './lib/cards.mjs'
import { shelfPages } from './lib/shelf.mjs'
import { check } from './lib/check.mjs'

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

  ctx.authority = buildAuthority(ctx)
  put('authority/agent.json', ctx.authority.text)

  const { cards, lines, classification, retro } = buildCards(ctx)
  ctx.classification = classification
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
  for (const [rel, text] of Object.entries(files)) put(rel, text)
  put('cards.json', compactCards(cards, catalogue, last))

  const shelves = shelfPages(cards, ctx)
  for (const [rel, text] of Object.entries(shelves)) put(rel, text)
  // a shelf page that no longer exists (a class shrank) is generated output: remove it
  const sdir = path.join(libDir, 'shelf-list')
  if (fs.existsSync(sdir)) for (const f of fs.readdirSync(sdir)) if (!(`shelf-list/${f}` in shelves)) { fs.unlinkSync(path.join(sdir, f)); changed.push(`shelf-list/${f} (removed)`) }

  return { cards, appended: lines.length, retro, changed, ctx }
}

function main() {
  const a = parseArgs(process.argv.slice(2))
  if (a.cmd === 'build' || a.cmd === 'authority' || a.cmd === 'cards' || a.cmd === 'shelf') {
    // the steps share one pass: authority, accession and cards, shelf list
    const r = build(a)
    const byType = {}
    for (const c of r.cards) byType[c.type] = (byType[c.type] || 0) + 1
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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
