// What the site serves from folders no reviewer reads as site code (security@'s S1, 03:50, and S1b, 18:05): desks/,
// data/, board/ and design/. A person's key lives in this origin's browser storage, so a document or script served
// from promptugal.news could use it. Their scripts and documents (EXT) are left out of the deploy
// (.github/workflows/deploy-pages.yml, the artifact step), and the gate checks that rule is there; an SVG there (an
// image, still served) may have no script, event handler, javascript: or foreignObject.
// The deploy also leaves out the screenshots no page links to (design/shots/, about 35 of the site's 61 MB on
// 6 November; devops@: Pages takes 5 to 10 minutes per deploy at that size): the build lists them in DROP.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { sigsOf } from './withdrawn.mjs'
export const order = 97
export const DIRS = ['desks', 'data', 'board', 'design'], EXT = ['js', 'mjs', 'cjs', 'py', 'sh', 'htm', 'html', 'xhtml', 'wasm']
export const DROP = 'api/v1/deploy-exclude.txt'
const ACTIVE = /<script|\son[a-z]+\s*=|javascript:|<foreignObject/i, SHOTS = 'design/shots'

// made last (build.mjs, after the API is written), so it can see every path the pages and the API name
export function final(ctx) {
    const used = new Set()
    for (const p of ctx.pages) { const f = ctx.R(p.rel); if (!fs.existsSync(f)) continue
        for (const m of fs.readFileSync(f, 'utf8').matchAll(/(?:src|href)="([^"#?]*design\/shots\/[^"#?]+)"/g)) used.add(path.posix.normalize(path.posix.join(path.posix.dirname(p.rel), m[1]))) }
    const all = fs.existsSync(ctx.R(SHOTS)) ? fs.readdirSync(ctx.R(SHOTS)).map(f => `${SHOTS}/${f}`) : []
    // and every image or PDF under board/ that no page and no JSON of the API names (devops@, 7 November 06:14: the
    // published tree had grown to about 130 MB, 22 MB of it pictures and decks in board/). Conservative: a path named
    // anywhere in a built page or in api/ stays.
    const named = new Set(), BIN = /board\/[A-Za-z0-9_.@%+-]+(?:\/[A-Za-z0-9_.@%+-]+)*\.(?:png|jpe?g|gif|webp|pdf)/gi
    for (const f of ctx.pages.map(p => ctx.R(p.rel))) if (fs.existsSync(f)) for (const m of fs.readFileSync(f, 'utf8').matchAll(BIN)) named.add(decodeURI(m[0]))
    for (const a of ctx.api || []) for (const m of (typeof a.data === 'string' ? a.data : JSON.stringify(a.data)).matchAll(BIN)) named.add(decodeURI(m[0]))
    const board = execFileSync('git', ['ls-files', 'board/'], { cwd: ctx.ROOT }).toString().split('\n').filter(f => /\.(png|jpe?g|gif|webp|pdf)$/i.test(f) && !named.has(f))
    // and the signed twins of withdrawn articles (data/site/withdrawn.json; standing answer 47 on the team site)
    // and ontologist@'s websummit-only inventory: refs only, but it names every person and session that comes off (the
    // pass 2026-11-11-only-websummit-sourced-comes-off, step 2)
    const keep = ['data/websummit-only.json', DROP]   // and this list itself: with the switch on it names the files it keeps out
    // the switch on (lib/wsonly.mjs): the raw files of every entity that came off, the raw company files that still hold a
    // websummit-only fact, edge or source, and the story files dev.data@ found resting only on websummit.com
    const g = ctx.store.wsGone
    if (g) {
        const D = { companies: 'companies', people: 'people', events: 'events', organisations: 'organisations', places: 'places', evidence: 'evidence' }
        const files = execFileSync('git', ['ls-files', 'data/'], { cwd: ctx.ROOT }).toString().split('\n').filter(Boolean)
        const partial = new Set(ctx.store.companies.filter(c => c.ws_taken).map(c => c.id))
        let story = {}; try { story = JSON.parse(fs.readFileSync(ctx.R('board/team/dev.data/findings/2026-11-11-websummit-only-in-story-folders.json'), 'utf8')) } catch { }
        const whole = new Set(story.entirely_websummit || []), part = new Map(Object.entries(story.folders || {}).map(([k, v]) => [k, new Set((v.sources_on_websummit || []).map(x => String(x).replace(/\.json$/, '')))]))
        for (const f of files) { const m = f.match(/^data\/([a-z]+)\/([^/]+)\/(.+)$/); if (!m) continue
            if (D[m[1]] && g[D[m[1]]].has(m[2])) keep.push(f)
            else if (m[1] === 'companies' && partial.has(m[2]) && /^(facts|edges|sources)\.json$/.test(m[3])) keep.push(f)
            else if (m[1] === 'stories' && /websummit/.test(m[2])) keep.push(f)   // dev.data@'s <id>-websummit folders, always
            else if (m[1] === 'stories' && (whole.has(m[2]) || (part.get(m[2])?.has(m[3].replace(/^sources\//, '').replace(/\.json$/, '')) && m[3].startsWith('sources/')))) keep.push(f)
            // a story's claims.json while it still holds a claim resting only on websummit.com, and any file a story keeps
            // its websummit-only claims in (claims-websummit.json: dev.data@ moves them there to serve the rest)
            else if (m[1] === 'stories' && ((m[3] === 'claims.json' && (story.folders?.[m[2]]?.claims_resting_only_on_websummit || []).length) || /websummit/.test(m[3]))) keep.push(f) }
        // the desks' copies of websummit.com (security@'s pre-review, 12 November 00:05, condition 1): the programme, the
        // curator's reads and the beats' found lists
        for (const f of execFileSync('git', ['ls-files', 'desks/'], { cwd: ctx.ROOT }).toString().split('\n'))
            if (/^desks\/(programme|curator)\/.+\.json$|^desks\/correspondent\/beats\/[^/]+\/found\//.test(f)) keep.push(f)
    }
    return [{ path: DROP, data: [...all.filter(f => !used.has(f)), ...board, ...sigsOf(), ...keep].sort().map(f => '/' + f).join('\n') + '\n' }]
}

export function validate(gate) {
    const out = [], files = execFileSync('git', ['ls-files', ...DIRS.map(d => d + '/')], { cwd: gate.ROOT }).toString().split('\n').filter(Boolean)
    for (const f of files) if (/\.svg$/i.test(f) && ACTIVE.test(gate.text(f))) out.push(`${f}: an SVG with active content (script, an event handler, javascript: or foreignObject), served on this origin (S1)`)
    const wf = gate.text('.github/workflows/deploy-pages.yml')
    for (const d of DIRS) for (const e of EXT) if (!wf.includes(`--exclude '/${d}/**.${e}'`)) out.push(`.github/workflows/deploy-pages.yml: the artifact step must leave out /${d}/**.${e} (S1, S1b)`)
    if (!wf.includes(`--exclude-from=${DROP}`)) out.push(`.github/workflows/deploy-pages.yml: the artifact step must leave out what ${DROP} lists (the unlinked screenshots)`)
    // no merge conflict left in a served text file (a stray marker in site.css swallowed a rule on 6 November)
    for (const f of execFileSync('git', ['ls-files', 'assets/', 'content/', 'data/'], { cwd: gate.ROOT }).toString().split('\n').filter(f => /\.(css|js|mjs|json|md|tmpl)$/.test(f)))
        if (/^(<<<<<<< |>>>>>>> )/m.test(gate.text(f))) out.push(`${f}: a merge conflict marker is left in it`)
    // nothing the site links to is left out
    const drop = new Set(gate.text(DROP).split('\n').filter(Boolean).map(l => l.slice(1)))
    for (const f of gate.generated) if (f.endsWith('.html')) for (const m of gate.text(f).matchAll(/(?:src|href)="([^"#?]+)"/g)) {
        const t = path.posix.normalize(path.posix.join(path.posix.dirname(f), m[1]))
        if (drop.has(t) || (DIRS.some(d => t.startsWith(d + '/')) && EXT.includes(t.split('.').pop()))) { out.push(`${f}: links to ${t}, which the deploy leaves out`); break }
    }
    return out
}
