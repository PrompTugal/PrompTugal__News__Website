#!/usr/bin/env node
// drop-ws-sources.mjs: removes every websummit.com source from the company pages (task
// people/vicky/tasks/2026-11-13-1715-company-pages-no-ws-links.md on the team site; standing answers 48 and 57).
// By dev@PrompTugal.vicky, 13 Nov 2026. Node only, no network; it reads and rewrites desks/journalist-vicky/companies/*.md.
//
//   node desks/dev-vicky/tools/drop-ws-sources.mjs [--check]     (run from the newsroom repository's root)
//
// In each file's "## About": every numbered line of "Sources for this section:" whose links are all websummit.com pages
// (any subdomain) is removed, the remaining sources are renumbered 1, 2, 3 in their order, and every marker in the About
// text ((2), (1, 3)) is rewritten to match. A file where a sentence would be left with no marker is not changed: the
// sentence is listed instead (no guessing). A source line that mixes a Web Summit link with another link is listed, not
// changed. Nothing outside the About section is touched. --check reports and writes nothing.
import fs from 'node:fs'
import path from 'node:path'

const DIR = 'desks/journalist-vicky/companies'
const isWS = u => /^https?:\/\/([a-z0-9-]+\.)*websummit\.com(\/|$)/i.test(u)
const links = s => [...s.matchAll(/\]\((https?:[^)\s]+)\)/g)].map(m => m[1])

export function rewrite(md) {
    const head = /^## About\s*\n/m.exec(md)
    if (!head) return { md, removed: 0, listed: [] }
    const start = head.index + head[0].length, next = md.slice(start).search(/^## /m), end = next < 0 ? md.length : start + next
    const about = md.slice(start, end), cut = /^Sources for this section:\s*$/m.exec(about)
    if (!cut) return { md, removed: 0, listed: [] }
    const prose = about.slice(0, cut.index), list = about.slice(cut.index)
    const map = {}, all_ = {}, listed = []
    let n = 0, removed = 0
    const newList = list.replace(/^(\d+)\.(\s+)(.*)$/gm, (all, num, sp, rest) => {
        all_[num] = true; const urls = links(rest)
        if (urls.length && urls.every(isWS)) { removed++; return '\u0000' }
        if (urls.some(isWS)) listed.push({ why: 'a source line mixes a Web Summit link with another link', text: all })
        map[num] = String(++n); return `${n}.${sp}${rest}`
    }).replace(/^\u0000\n?/gm, '')
    if (!removed) return { md, removed: 0, listed }
    const newProse = prose.replace(/\((\d+(?:\s*,\s*\d+)*)\)/g, (all, inner) => {
        const nums = inner.split(/\s*,\s*/)
        if (!nums.every(x => x in all_)) return all // not a marker: a number that is not a source, e.g. (403)
        const kept = [...new Set(nums.filter(x => x in map).map(x => map[x]))]
        if (!kept.length) { listed.push({ why: 'its only marker was a Web Summit source', text: all }); return all }
        return `(${kept.join(', ')})`
    })
    if (listed.some(l => l.why.startsWith('its only'))) return { md, removed: 0, listed }
    return { md: md.slice(0, start) + newProse + newList + md.slice(end), removed, listed }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
    const check = process.argv.includes('--check'), out = { files_changed: 0, links_removed: 0, listed: [] }
    for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.md')).sort()) {
        const p = path.join(DIR, f), md = fs.readFileSync(p, 'utf8'), r = rewrite(md)
        for (const l of r.listed) out.listed.push({ file: p, ...l })
        if (r.md !== md) { out.files_changed++; out.links_removed += r.removed; if (!check) fs.writeFileSync(p, r.md) }
    }
    console.log(JSON.stringify(out, null, 1))
}
