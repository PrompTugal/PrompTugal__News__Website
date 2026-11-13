#!/usr/bin/env node
// ws-only-claims.mjs: the company About claims whose only support is a Web Summit page (takedown step 2; the team site's
// people/vicky/decisions.md, standing answers 48 and 49; task people/vicky/tasks/2026-11-13-about-claims.md, step 1).
// By dev@PrompTugal.vicky, 13 Nov 2026. Node only, no network: it reads the files in desks/journalist-vicky/companies/
// and writes desks/journalist-vicky/companies/ws-only-claims.json. It changes no company file.
//
//   node desks/dev-vicky/tools/ws-only-claims.mjs [--check]     (run from the newsroom repository's root)
//
// For each file: in "## About", every sentence whose source markers ((1), (1, 2)) all point to websummit.com entries of
// its "Sources for this section" list; in "## At Web Summit 2026", every line (a session, a stage, a "Media only" or a
// partner line) whose links are all websummit.com pages. A sentence with no marker is listed apart, as "unmarked", for
// information. The files with at least one claim are split, in file-name order, into three parts as equal as possible:
// journalist-portugal, journalist-europe and journalist-ai (the task, step 2). --check prints the counts and writes nothing.
import fs from 'node:fs'
import path from 'node:path'

const DIR = 'desks/journalist-vicky/companies', OUT = path.join(DIR, 'ws-only-claims.json')
const WRITERS = ['journalist-portugal@PrompTugal.vicky', 'journalist-europe@PrompTugal.vicky', 'journalist-ai@PrompTugal.vicky']
const isWS = u => /^https?:\/\/([a-z0-9-]+\.)*websummit\.com(\/|$)/i.test(u)
const section = (md, name) => { const m = new RegExp(`^## ${name}\\s*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm').exec(md); return m ? m[1] : '' }
const links = s => [...s.matchAll(/\]\((https?:[^)\s]+)\)/g)].map(m => m[1])

export function claimsOf(md) {
    const about = section(md, 'About'), [prose, list = ''] = about.split(/^Sources for this section:\s*$/m)
    const sources = {}
    for (const m of list.matchAll(/^(\d+)\.\s+(.*)$/gm)) sources[m[1]] = links(m[2])
    const claims = [], unmarked = []
    // sentences: split after . ! or ? (a marker may stand before the stop) when a capital or a quote follows
    const sentences = prose.replace(/\s+/g, ' ').trim().split(/(?<=[.!?]["”]?)\s+(?=[A-Z"“(])/).filter(Boolean)
    for (const s of sentences) {
        const nums = [...s.matchAll(/\((\d+(?:\s*,\s*\d+)*)\)/g)].flatMap(m => m[1].split(/\s*,\s*/)).filter(n => n in sources)
        if (!nums.length) { unmarked.push(s); continue }
        const urls = [...new Set(nums.flatMap(n => sources[n]))]
        if (urls.length && urls.every(isWS)) claims.push({ section: 'About', text: s, markers: [...new Set(nums)].map(Number), sources: urls })
    }
    for (const line of section(md, 'At Web Summit 2026').split('\n').filter(l => /^\s*-\s/.test(l))) {
        const urls = links(line)
        if (urls.length && urls.every(isWS)) claims.push({ section: 'At Web Summit 2026', text: line.replace(/^\s*-\s+/, '').trim(), sources: [...new Set(urls)] })
    }
    return { claims, unmarked }
}

export function build(root = '.') {
    const dir = path.join(root, DIR)
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()
    const all = files.map(f => ({ file: `${DIR}/${f}`, ...claimsOf(fs.readFileSync(path.join(dir, f), 'utf8')) }))
    const withClaims = all.filter(x => x.claims.length)
    const parts = Object.fromEntries(WRITERS.map(w => [w, []]))
    withClaims.forEach((x, i) => { parts[WRITERS[Math.floor(i * WRITERS.length / withClaims.length)]].push(x.file) })
    return {
        about: "Company About claims whose only support is a websummit.com page (takedown step 2; standing answers 48 and 49 on the team site; task people/vicky/tasks/2026-11-13-about-claims.md). Made by desks/dev-vicky/tools/ws-only-claims.mjs from the files in this folder; no file was changed. Each journalist takes its own part: for each claim, re-cite it to another source (the company's own site or posts, the press, an official body; never websummit.com, Luma, Meetup or Eventbrite by machine) with the date read, or cut it; leave the rest of the About as it is; set the file's status to fix for the reviewer. 'unmarked' lists About sentences with no source marker, for information only.",
        rule: 'a claim is listed when every source it cites is a websummit.com page',
        counts: { files: files.length, files_with_claims: withClaims.length, claims: withClaims.reduce((n, x) => n + x.claims.length, 0), about_claims: withClaims.reduce((n, x) => n + x.claims.filter(c => c.section === 'About').length, 0), at_web_summit_lines: withClaims.reduce((n, x) => n + x.claims.filter(c => c.section !== 'About').length, 0), unmarked: all.reduce((n, x) => n + x.unmarked.length, 0) },
        parts,
        files: all.filter(x => x.claims.length || x.unmarked.length).map(x => ({ file: x.file, part: Object.keys(parts).find(w => parts[w].includes(x.file)) || null, claims: x.claims, unmarked: x.unmarked })),
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
    const d = build('.')
    console.log(JSON.stringify(d.counts), Object.entries(d.parts).map(([w, f]) => `${w.split('@')[0]}: ${f.length}`).join(', '))
    if (!process.argv.includes('--check')) { fs.writeFileSync(OUT, JSON.stringify(d, null, 2) + '\n'); console.log('written:', OUT) }
}
