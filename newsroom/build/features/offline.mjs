// Offline mode (Dinis 18:05, Silvio's idea; board/passes/2026-11-06-offline-mode.md): the site opens at the venue
// with no network. A LETS cycle at every release:
//   Load       the built front page (its stylesheets and scripts: the shell), the pages, the agenda data
//   Extract    what every visit keeps: the shell, the front page, /summit/ and its days, the newsroom's newest ten
//              articles, api/v1/events.json and api/v1/live/agenda.json
//   Transform  assets/offline/sw.tmpl with the version and that list
//   Save       /sw.js (at the root: a worker controls only the pages under it); assets/offline/ holds the page side
//              (offline.js on every page: the worker, the manifest, the offline note, "Save for offline")
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { articlesOf } from './articles.mjs'
import { KEYRING_PAGES } from './login.mjs'
export const order = 98
export const assets = { css: ['assets/offline/offline.css'], js: ['assets/offline/offline.js'] }
const TMPL = 'assets/offline/sw.tmpl', OFF = 'assets/offline/sw-off.tmpl', SWITCH = 'assets/offline/switch.json', SW = 'sw.js', MANIFEST = 'assets/offline/manifest.webmanifest'
const NEVER = KEYRING_PAGES.map(r => r.replace(/index\.html$/, ''))
// the files that make the worker: changed by dev@ only (security@'s condition: one reviewed file)
const OWNED = [TMPL, OFF, SWITCH, 'assets/offline/offline.js', 'newsroom/build/features/offline.mjs'], OWNER = 'dev@PrompTugal.dinis'
const DATA = ['api/v1/events.json', 'api/v1/live/agenda.json']
const dir = rel => rel.replace(/index\.html$/, '')

// the shell: every feature's site-wide assets, and the files the shell and C's top name (their sources, not a built page,
// so the list is the same whenever a feature asks for it)
async function shellOf(ctx) {
    const dirF = ctx.R('newsroom/build/features'), feats = await Promise.all(fs.readdirSync(dirF).filter(f => f.endsWith('.mjs')).map(f => import(new URL(f, import.meta.url))))
    const named = ['newsroom/build/lib/shell.mjs', 'assets/top/top.tmpl'].flatMap(f => [...fs.readFileSync(ctx.R(f), 'utf8').matchAll(/assets\/[a-z0-9/._-]+\.(?:css|js|svg|png)/g)].map(m => m[0]))
    return [...new Set([...feats.flatMap(f => [...(f.assets?.css || []), ...(f.assets?.js || [])]), ...named])].filter(f => fs.existsSync(ctx.R(f))).sort()
}
export async function keep(ctx) {
    const days = ctx.pages.filter(p => /^days\/[^/]+\/index\.html$/.test(p.rel)).map(p => dir(p.rel))
    const news = articlesOf(ctx).slice(0, 10).map(a => a.rel)
    // dev.pages@'s offline-first data: the index of the days and one JSON per day (features/days.mjs)
    const dayData = ['api/v1/days.json', ...days.map(d => `api/v1/days/${d.split('/')[1]}.json`)]
    return [...new Set(['', 'summit/', ...days, ...news, ...await shellOf(ctx), ...DATA, ...dayData, MANIFEST])]
}
export const api = async ctx => {
    const on = JSON.parse(fs.readFileSync(ctx.R(SWITCH), 'utf8')).enabled !== false
    const data = on ? fs.readFileSync(ctx.R(TMPL), 'utf8').replace(/__VERSION__/g, ctx.VERSION).replace('__PRECACHE__', JSON.stringify(await keep(ctx), null, 1)).replace('__NEVER__', JSON.stringify(NEVER))
        : fs.readFileSync(ctx.R(OFF), 'utf8').replace(/__VERSION__/g, ctx.VERSION)
    return [{ path: SW, schema: null, data }]
}
export const llms = ctx => `## Offline\n- The site works offline: [sw.js](${ctx.BASE}sw.js) keeps the front page, the summit's days, the agenda data and the newest articles; a reader saves any article for offline. In a browser: \`window.PTOffline\`, tools \`offline.saved\`, \`offline.save\`, \`offline.clear\`.\n\n`

export function validate(gate) {
    const out = [], sw = gate.generated.has(SW) ? gate.text(SW) : ''
    if (!sw) return [`${SW}: not built`]
    let sw0 = null; try { sw0 = JSON.parse(gate.text(SWITCH)) } catch { out.push(`${SWITCH}: not JSON`) }
    if (sw0 && typeof sw0.enabled !== 'boolean') out.push(`${SWITCH}: enabled must be true or false`)
    if (sw0 && sw0.enabled === false) { if (!/registration\.unregister\(\)/.test(sw)) out.push(`${SW}: switched off but not the unregistering worker`); return out }
    if (!sw.includes(JSON.stringify(NEVER))) out.push(`${SW}: must never keep the pages that use a person's key (${NEVER.join(', ')})`)
    for (const f of OWNED) { let who = []; try { who = execFileSync('git', ['log', '--format=%(trailers:key=Agent,valueonly,separator=)', '--', f], { cwd: gate.ROOT }).toString().split('\n').map(s => s.trim()).filter(Boolean) } catch { }
        const other = [...new Set(who.filter(a => a !== OWNER))]; if (other.length) out.push(`${f}: changed by ${other.join(', ')}; the service worker's files are dev@'s only (security@)`) }
    if (!sw.includes(`'${gate.VERSION}'`)) out.push(`${SW}: not stamped with this release`)
    const list = JSON.parse((sw.match(/const KEEP = (\[[\s\S]*?\])\n/) || [, '[]'])[1])
    for (const p of list) { const f = p === '' || p.endsWith('/') ? p + 'index.html' : p; if (!gate.generated.has(f) && !fs.existsSync(gate.R(f))) out.push(`${SW}: keeps ${p || '/'}, which the site does not serve`) }
    if (!/u\.origin !== self\.location\.origin/.test(sw)) out.push(`${SW}: must store nothing from another origin (security@)`)
    let m = null; try { m = JSON.parse(gate.text(MANIFEST)) } catch { out.push(`${MANIFEST}: not JSON`) }
    if (m) for (const i of m.icons || []) if (!fs.existsSync(gate.R('assets/offline/' + i.src))) out.push(`${MANIFEST}: icon ${i.src} missing`)
    return out
}
