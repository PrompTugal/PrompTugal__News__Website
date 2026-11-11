#!/usr/bin/env node
// The provenance of every published piece, in time order: who (human or agent) touched it, at which stage, in which
// commit, with its trailers. Dinis, 10 November 2026, 12:40 UTC (board/guidance/2026-11-10-pt-news-is-about-agents.md):
// "the workflow and its visualisation are one and the same"; a visual newsroom, one graph per piece, built from the record.
// This is that record as data, for dev.graphs@ and dev.pages@ to draw; the library describes, it draws nothing.
// Writes board/team/librarian/library/provenance/pieces.json. Node 18+, no dependencies. Run from the repository root.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const git = (args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 << 20 })
const OUT = 'board/team/librarian/library/provenance/pieces.json'
const tracked = git(['ls-files']).split('\n').filter(Boolean)

// the stage a path stands for, read from where it lives
function stage(p) {
  if (/^content\/articles\//.test(p)) return 'publish'
  if (/^articles\/.+\.sig$/.test(p)) return 'sign'
  if (/^desks\/[^/]+\/.*(check|fact|verif)/i.test(p) || /^desks\/checker/.test(p)) return 'check'
  if (/^desks\/[^/]+\/.*review/i.test(p) || /^desks\/reviewer/.test(p)) return 'review'
  if (/^board\/team\/dev\.verify\/records/.test(p)) return 'verify'
  if (/^design\/infographics\//.test(p) || /^design\/.*\.(png|jpe?g|svg|webp)$/.test(p)) return 'image'
  if (/^desks\//.test(p)) return 'draft'
  if (/^data\//.test(p)) return 'data'
  if (/^assets\//.test(p)) return 'media'
  return 'other'
}
const handleOf = (subject) => (/^([A-Za-z0-9][A-Za-z0-9.-]*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+):/.exec(subject || '') || [])[1] || null
const TRAILERS = ['Agent', 'Brief', 'Unit', 'Issue', 'For']

const slugs = tracked.filter((f) => /^content\/articles\/[^/]+\.md$/.test(f) && !/\/index\.md$/.test(f)).map((f) => path.basename(f, '.md')).sort()
const pieces = []
for (const slug of slugs) {
  const src = `content/articles/${slug}.md`
  const fm = (fs.readFileSync(src, 'utf8').match(/^---\n([\s\S]*?)\n---/) || [])[1] || ''
  const field = (k) => ((fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm')) || [])[1] || null)
  // every tracked path that carries the slug: the desks' drafts and checks, the article, its signature, its media
  const named = tracked.filter((f) => f === src || f.includes(`/${slug}.`) || f.includes(`/${slug}/`) || f.includes(`/${slug}-`))
  // and the desks' and verifiers' files whose text names the piece (Vicky's desk files reviews and checks under story
  // codes, S29.md, and one findings file names many pieces): a check recorded there is part of the piece's flow
  let mentions = []
  try { mentions = git(['grep', '-l', '-F', slug, '--', 'desks', 'board/team/dev.verify']).split('\n').filter(Boolean) } catch { mentions = [] }
  // and by the piece's story codes (Vicky's desk: S41; the team's: WS125), read from its own commits' subjects: her
  // desk files a review as reviews/S41.md, which names the code, not the slug
  const subjects = git(['log', '--format=%s', '--', ...named])
  const codes = [...new Set([...subjects.matchAll(/\b(S\d{1,3}|WS\d{2,4})\b/g)].map((m) => m[1]))]
  for (const code of codes) {
    mentions.push(...tracked.filter((f) => /^desks\//.test(f) && path.basename(f).replace(/\.[a-z]+$/, '') === code))
    try { mentions.push(...git(['grep', '-l', '-w', '-F', code, '--', 'desks/checker-vicky', 'desks/reviewer-vicky', 'board/team/dev.verify']).split('\n').filter(Boolean)) } catch { }
  }
  mentions = [...new Set(mentions)].filter((f) => !named.includes(f))
  const paths = named
  if (!paths.length) continue
  const log = git(['log', '--format=%x1e%H%x1f%aI%x1f%an%x1f%s%x1f%(trailers:only,unfold)', '--name-only', '--', ...paths])
  const events = []
  for (const rec of log.split('\x1e').slice(1)) {
    const [head, ...files] = rec.split('\n')
    const [hash, at, author, subject, trailerLine] = head.split('\x1f')
    if (author === 'GitHub Actions' || /^site v\d/.test(subject)) continue // CI's release commit repeats an agent's
    const tr = {}
    // trailers come unfolded on the header line and the lines after it
    const trailerText = [trailerLine || '', ...files.filter((l) => /^[A-Za-z-]+: /.test(l))].join('\n')
    for (const k of TRAILERS) { const m = new RegExp(`^${k}: (.+)$`, 'm').exec(trailerText); if (m) tr[k.toLowerCase()] = m[1].trim().slice(0, 120) }
    const touched = files.filter((l) => l && paths.includes(l))
    events.push({
      at: at.replace(/:\d\d([+-]\d\d:\d\d|Z)$/, 'Z').replace(/\+00:00Z$/, 'Z'), commit: hash.slice(0, 10),
      actor: handleOf(subject) || tr.agent || author, human: !handleOf(subject) && !tr.agent ? true : undefined,
      did: subject.replace(/^[^:]+:\s*/, '').slice(0, 140),
      stages: [...new Set(touched.map(stage))], ...tr,
    })
  }
  events.sort((a, b) => a.at.localeCompare(b.at))
  const actors = [...new Set(events.map((e) => e.actor))]
  pieces.push({
    slug, title: field('title'), author: field('author'), date: field('date'), status: field('status'),
    url: `https://promptugal.news/articles/${slug}/`, source: src,
    events: events.length, actors, handoffs: events.reduce((n, e, i) => n + (i && e.actor !== events[i - 1].actor ? 1 : 0), 0),
    flow: events,
    // the desks' and verifiers' files that name the piece (listed once each, not as events: a shared findings file is
    // touched by every check of every piece), with the stage each stands for
    codes,
    named_in: mentions.sort().map((f) => ({ path: f, stage: stage(f) })),
    on_record: [...new Set([...events.flatMap((e) => e.stages), ...mentions.map(stage)])].sort(),
  })
}
const out = {
  about: "The provenance of every published piece in time order, from the record (git commits touching the piece's own paths, and the desks' and verifiers' files whose text names it, with their trailers), for the visual newsroom (Dinis, 10 November 2026, 12:40 UTC). Each event: when, the commit, the actor (the handle that opens the subject, else the Agent trailer, else the commit author, marked human), what it did, the stages its paths stand for (draft, check, review, verify, image, publish, sign, data, media). CI's release commits are left out. Generated by board/team/librarian/provenance.mjs at each librarian wake; never hand-edited.",
  generated: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
  pieces: pieces.length, events: pieces.reduce((n, p) => n + p.events, 0),
  items: pieces,
}
fs.mkdirSync(path.dirname(OUT), { recursive: true })
const text = JSON.stringify(out) + '\n' // compact: it counts against the library's size cap
const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/"generated": "[^"]*"/, '') : null
if (prev !== text.replace(/"generated": "[^"]*"/, '')) fs.writeFileSync(OUT, text)
console.log(`provenance: ${out.pieces} pieces, ${out.events} events`)
