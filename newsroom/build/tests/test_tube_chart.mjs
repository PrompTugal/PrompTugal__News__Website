#!/usr/bin/env node
/* test_tube_chart.mjs: a strike's mark is filled once its start has passed in London, outlined before.   node newsroom/build/tests/test_tube_chart.mjs */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chart, stateLine } from '../features/tube-chart.mjs'
const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../assets/article/tube-strikes-2026')
const tmpl = fs.readFileSync(path.join(dir, 'chart.tmpl'), 'utf8'), data = JSON.parse(fs.readFileSync(path.join(dir, 'strikes.json'), 'utf8')), strikes = data.strikes, W = data.words
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const marks = d => [...chart(tmpl, strikes, d, W).matchAll(/<rect class="(fl|ol|pa)" x="[\d.]+" y="[\d.]+" width="8\.0" height="18"\/>/g)].map(m => m[1]).join(' ')
t('eight marks', strikes.length, 8)
t('before the first: all outlined', marks(new Date('2026-11-26T11:00:00Z')), 'ol ol ol ol ol ol ol ol')   // 11:00 in London, an hour before 12:00
t('the first has started', marks(new Date('2026-11-26T12:00:00Z')), 'fl ol ol ol ol ol ol ol')
t('in February London is on UTC: 11:00Z is before a 12:00 start', marks(new Date('2027-02-17T11:00:00Z')), 'pa pa pa pa pa ol ol ol')
t('after the last: all filled', marks(new Date('2027-03-01T00:00:00Z')), 'pa pa pa pa pa pa pa pa')
t('under way', stateLine(strikes, W, new Date('2026-11-26T13:00:00Z')), 'The first is under way.')
t('the first ended: the next is named', stateLine(strikes, W, new Date('2026-11-28T08:00:00Z')), 'The first (26 to 27 Nov) has ended; the next is 17 to 18 Dec.')
t('after the last', stateLine(strikes, W, new Date('2027-03-01T00:00:00Z')), 'All 8 have ended.')
t('no stale sentence in the made chart', /is under way/.test(chart(tmpl, strikes, new Date('2026-11-28T08:00:00Z'), W)), false)
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_tube_chart: OK')
