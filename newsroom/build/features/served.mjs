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
export const order = 97
export const DIRS = ['desks', 'data', 'board', 'design'], EXT = ['js', 'mjs', 'cjs', 'py', 'sh', 'htm', 'html', 'xhtml', 'wasm']
export const DROP = 'api/v1/deploy-exclude.txt'
const ACTIVE = /<script|\son[a-z]+\s*=|javascript:|<foreignObject/i, SHOTS = 'design/shots'

export function api(ctx) {
    const used = new Set()
    for (const p of ctx.pages) { const f = ctx.R(p.rel); if (!fs.existsSync(f)) continue
        for (const m of fs.readFileSync(f, 'utf8').matchAll(/(?:src|href)="([^"#?]*design\/shots\/[^"#?]+)"/g)) used.add(path.posix.normalize(path.posix.join(path.posix.dirname(p.rel), m[1]))) }
    const all = fs.existsSync(ctx.R(SHOTS)) ? fs.readdirSync(ctx.R(SHOTS)).map(f => `${SHOTS}/${f}`) : []
    return [{ path: DROP, schema: null, data: all.filter(f => !used.has(f)).sort().map(f => '/' + f).join('\n') + '\n' }]
}

export function validate(gate) {
    const out = [], files = execFileSync('git', ['ls-files', ...DIRS.map(d => d + '/')], { cwd: gate.ROOT }).toString().split('\n').filter(Boolean)
    for (const f of files) if (/\.svg$/i.test(f) && ACTIVE.test(gate.text(f))) out.push(`${f}: an SVG with active content (script, an event handler, javascript: or foreignObject), served on this origin (S1)`)
    const wf = gate.text('.github/workflows/deploy-pages.yml')
    for (const d of DIRS) for (const e of EXT) if (!wf.includes(`--exclude '/${d}/**.${e}'`)) out.push(`.github/workflows/deploy-pages.yml: the artifact step must leave out /${d}/**.${e} (S1, S1b)`)
    if (!wf.includes(`--exclude-from=${DROP}`)) out.push(`.github/workflows/deploy-pages.yml: the artifact step must leave out what ${DROP} lists (the unlinked screenshots)`)
    // nothing the site links to is left out
    const drop = new Set(gate.text(DROP).split('\n').filter(Boolean).map(l => l.slice(1)))
    for (const f of gate.generated) if (f.endsWith('.html')) for (const m of gate.text(f).matchAll(/(?:src|href)="([^"#?]+)"/g)) {
        const t = path.posix.normalize(path.posix.join(path.posix.dirname(f), m[1]))
        if (drop.has(t) || (DIRS.some(d => t.startsWith(d + '/')) && EXT.includes(t.split('.').pop()))) { out.push(`${f}: links to ${t}, which the deploy leaves out`); break }
    }
    return out
}
