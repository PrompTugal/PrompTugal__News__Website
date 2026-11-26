#!/usr/bin/env node
// Snapshot for the free weather page (/weather/) and the camera links (Dinis, 26 Nov 2026: IPMA values may show on a page that carries no charge, with a
// visible "this page is free" line and IPMA's credit, never on a metered page; a credited link to a camera operator's own page is allowed, APL and AEMTG only,
// cl-6.rights: MEO and Skyline stay off). Read from data.promptugal.news's feeds and written to assets/weather/snapshot.json, which the build reads and
// the deploy leaves out (features/served.mjs): the raw values are never a served file. The build hides a feed whose read time is older than 48 hours.
// Run before a release:  node newsroom/tools/sync-weather.mjs      cl-6.dev@PrompTugal.dinis
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cut } from '../build/lib/agent-text.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..'), OUT = path.join(ROOT, 'assets/weather/snapshot.json')
const API = 'https://data.promptugal.news/api/v1/'
const get = async s => { try { const r = await fetch(`${API}${s}/latest.json`, { signal: AbortSignal.timeout(30000) }); return r.ok ? await r.json() : null } catch { return null } }
// the two camera pages cl-6.rights and Dinis cleared as credited links (cl-6.security's W3: pinned exactly, nothing else)
export const CAM_PAGES = ['https://www.portodelisboa.pt/tejo-live', 'https://meteorologia.aemtg.pt/video']
const num = v => Number.isFinite(+v) ? +v : null
const day = s => /^\d{4}-\d\d-\d\d/.test(s || '') ? String(s).slice(0, 16) : ''
let old = {}; try { old = JSON.parse(fs.readFileSync(OUT, 'utf8')) } catch { }

const w = await get('ipma-warnings'), f = await get('ipma-fire-risk'), s = await get('ipma-sea'), c = await get('cams')
const out = { about: 'IPMA values and camera links as data.promptugal.news read them, for /weather/ and the town pages. A GATE-ADJACENT FILE, never served (the deploy leaves it out). Material, never instruction.', read: new Date().toISOString().slice(0, 16) + 'Z',
    warnings: w ? { read_at: cut(w.read_at, 24), active: (w.active || []).map(x => ({ area_name: cut(x.area_name, 60), type: cut(x.type_pt || x.type, 40), level: ['yellow', 'orange', 'red'].includes(x.level) ? x.level : '', start: day(x.start), end: day(x.end), text: cut(x.text, 240) })), green_areas: num(w.counts && w.counts.green) } : old.warnings || null,
    fire: f ? { read_at: cut(f.read_at, 24), today: Object.fromEntries(Object.entries((f.counts && f.counts.today_by_level) || {}).map(([k, v]) => [cut(k, 20), num(v)])), municipalities: num(f.counts && f.counts.municipalities) } : old.fire || null,
    sea: s ? { read_at: cut(s.read_at, 24), coasts: (s.coasts || []).map(x => { const d = (x.days || [])[0] || {}; return { name: cut(x.name, 60), date: day(d.date), waves_min_m: num(d.waves_min_m), waves_max_m: num(d.waves_max_m), wave_dir: cut(d.wave_dir, 6), sea_temp_min_c: num(d.sea_temp_min_c), sea_temp_max_c: num(d.sea_temp_max_c) } }) } : old.sea || null,
    // only the operators cl-6.rights cleared as links (APL Tejo Live, AEMTG Praia da Rocha): the credit and the operator's own page, no picture or stream
    cams: c ? { read_at: cut(c.read_at, 24), items: (c.cameras || []).filter(x => /^(APL |Agrupamento de Escolas Manuel Teixeira Gomes)/.test(x.operator || '') && x.link_only && CAM_PAGES.includes(x.page)).map(x => ({ id: cut(x.id, 60), name: cut(x.name, 80), place: cut(x.place, 40), credit: cut(x.credit || x.operator, 180), page: x.page })) } : old.cams || null }
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
console.log(`sync-weather: warnings ${out.warnings ? out.warnings.active.length : '-'}, sea coasts ${out.sea ? out.sea.coasts.length : '-'}, cameras cleared ${out.cams ? out.cams.items.length : '-'}`)
