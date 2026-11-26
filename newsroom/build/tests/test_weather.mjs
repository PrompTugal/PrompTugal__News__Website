#!/usr/bin/env node
/* test_weather.mjs: the free weather page's fillers and the camera links (Dinis, 26 Nov 2026): a feed older than 48 hours is not shown; a fresh one is, with its
 * credit; only cleared camera links are listed.   node newsroom/build/tests/test_weather.mjs */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fill, fresh, camLines } from '../features/weather.mjs'
const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'weather-test-')); fs.mkdirSync(path.join(tmp, 'assets/weather'), { recursive: true })
fs.copyFileSync(path.join(here, 'assets/weather/weather.json'), path.join(tmp, 'assets/weather/weather.json'))
const W = JSON.parse(fs.readFileSync(path.join(tmp, 'assets/weather/weather.json'), 'utf8'))
const ctx = { ROOT: tmp }
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const hoursAgo = h => new Date(Date.now() - h * 36e5).toISOString().slice(0, 19) + 'Z'
const snap = h => ({ read: hoursAgo(0), warnings: { read_at: hoursAgo(h), active: [{ area_name: 'Faro', type: 'Vento', level: 'orange', start: '2026-11-26T06:00', end: '2026-11-26T18:00', text: 'Vento forte.' }, { area_name: 'Beja', type: 'Chuva', level: 'yellow', start: '2026-11-26T06:00', end: '2026-11-26T18:00', text: 'Chuva.' }], green_areas: 20 },
    sea: { read_at: hoursAgo(h), coasts: [{ name: 'Sagres, Costa', date: '2026-11-26', waves_min_m: 1.2, waves_max_m: 2, wave_dir: 'NW', sea_temp_min_c: 17, sea_temp_max_c: 18 }] }, fire: { read_at: hoursAgo(h), today: { low: 270, high: 8 }, municipalities: 278 },
    cams: { read_at: hoursAgo(h), items: [{ id: 'a', name: 'Tejo Live, Câmara VTS', place: 'lisboa', credit: 'APL', page: 'https://www.portodelisboa.pt/tejo-live' }] } })
const put = h => fs.writeFileSync(path.join(tmp, 'assets/weather/snapshot.json'), JSON.stringify(snap(h)))
t('fresh is under the limit', [fresh(hoursAgo(47), W), fresh(hoursAgo(49), W), fresh('', W), fresh('not a date', W)], [true, false, false, false])
put(1)
const w = fill['weather:warnings'](null, ctx)
t('a fresh warnings feed shows red, orange and yellow groups in order, with the area and the text', [/### Orange/.test(w), /### Yellow/.test(w), w.indexOf('Orange') < w.indexOf('Yellow'), /Faro: Vento/.test(w), /Vento forte/.test(w)], [true, true, true, true, true])
t('the sea table and the fire counts show', [/Sagres, Costa/.test(fill['weather:sea'](null, ctx)), /high: 8 of 278/.test(fill['weather:fire'](null, ctx))], [true, true])
t('a fresh camera feed gives the cleared operator\'s link with its credit', camLines(ctx, 'lisboa').length, 1)
t('and none for another town', camLines(ctx, 'faro'), [])
put(60)
t('a warnings feed older than 48 hours is not shown', [/Vento forte/.test(fill['weather:warnings'](null, ctx)), /more than 48 hours ago/.test(fill['weather:warnings'](null, ctx))], [false, true])
t('nor the sea or the fire risk', [/Sagres/.test(fill['weather:sea'](null, ctx)), /high: 8/.test(fill['weather:fire'](null, ctx))], [false, false])
t('nor a camera link', camLines(ctx, 'lisboa'), [])
fs.rmSync(path.join(tmp, 'assets/weather/snapshot.json'))
t('no snapshot: nothing is shown and nothing breaks', [fill['weather:warnings'](null, ctx), camLines(ctx, 'lisboa')], [W.missing, []])
fs.rmSync(tmp, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_weather: OK')
