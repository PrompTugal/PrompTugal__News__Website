// Where things are, and the few constants every module shares. No page logic.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
export const R = p => path.join(ROOT, p)
export const readText = p => fs.readFileSync(R(p), 'utf8')
export const readJSON = p => JSON.parse(readText(p))
export const exists = p => fs.existsSync(R(p))

export const VERSION = readText('newsroom/build/version.txt').trim()
export const HOST = readText('CNAME').trim()
export const BASE = `https://${HOST}/`
export const SITE = readJSON('data/site/site.json')
export const NAV = readJSON('data/site/nav.json')
export const REPO = SITE.repo
export const AGENT = SITE.agent
export const OPERATOR = SITE.operator
export const TEAM_SITE = SITE.team_site
// "Today" is the build's day (UTC, which is Lisbon time in November): the front page moves on only when something is released.
export const TODAY = new Date().toISOString().slice(0, 10)
export const DAY = d => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })

// the date a source file last changed in git (YYYY-MM-DD), for a page's page-date; null when git cannot say
// one pass over the history fills every file's date at the first call (it was one git process per page: about 2,400,
// 26 s of the build; dev@, 19 Nov); the newest commit touching a path wins, as git log -1 -- <path> gives
const gitDates = new Map()
let gitAll = null
function loadAll() {
    gitAll = new Map()
    try {
        const out = execFileSync('git', ['log', '--format=%x00%cs', '--name-only', '--no-renames'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 30 }).toString()
        let d = null
        for (const line of out.split('\n')) { if (line.startsWith('\0')) { d = line.slice(1).trim(); continue } if (line && d && !gitAll.has(line)) gitAll.set(line, d) }
    } catch { gitAll = null }
}
export function gitDate(rel) {
    if (gitAll === undefined || gitAll === null) { if (gitAll === null && !gitDates.size) loadAll() }
    if (gitAll && !gitDates.has(rel)) gitDates.set(rel, gitAll.get(rel) || null)
    if (!gitDates.has(rel)) {
        let d = null
        try { d = execFileSync('git', ['log', '-1', '--format=%cs', '--', rel], { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || null } catch { }
        gitDates.set(rel, d)
    }
    return gitDates.get(rel)
}

// walk a folder, sorted, returning absolute paths of files that pass the filter
export function walk(dir, filter = () => true, out = []) {
    if (!fs.existsSync(dir)) return out
    for (const name of fs.readdirSync(dir).sort()) {
        const p = path.join(dir, name)
        if (fs.statSync(p).isDirectory()) walk(p, filter, out); else if (filter(p)) out.push(p)
    }
    return out
}

// match a path against a nav or llms entry: "x/" is a prefix, anything else is exact
export const matches = (rel, list) => list.some(m => m.endsWith('/') ? rel.startsWith(m) : rel === m)
