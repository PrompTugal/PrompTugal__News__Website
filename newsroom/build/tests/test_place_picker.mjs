#!/usr/bin/env node
/* test_place_picker.mjs: the place picker's groups (cl-6.sherpa's S1, 26 Nov 2026).   node newsroom/build/tests/test_place_picker.mjs */
import { groupPlaces, fill } from '../features/place-picker.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const P = [
    { id: 'portugal', name: 'Portugal', kind: 'country', parent: '', path: 'portugal/' },
    { id: 'algarve', name: 'The Algarve', kind: 'region', parent: 'portugal', path: 'algarve/' },
    { id: 'lagos', name: 'Lagos', kind: 'municipality', parent: 'algarve', path: 'algarve/lagos/' },
    { id: 'faro', name: 'Faro', kind: 'city', parent: 'algarve', path: 'algarve/faro/' },
    { id: 'porto', name: 'Porto', kind: 'city', parent: 'portugal', path: 'portugal/porto/' },
    { id: 'london', name: 'London', kind: 'city', parent: 'united-kingdom', path: 'europe/london/', group: 'Europe' },
    { id: 'bad', name: 'Bad', kind: 'city', parent: 'portugal', path: '../evil/' },
    { id: 'lost', name: 'Lost', kind: 'city', parent: 'nowhere', path: 'lost/' },
]
const g = groupPlaces(P)
t('the Algarve: its region page first, then its towns by name', g.algarve.map(p => p.id), ['algarve', 'faro', 'lagos'])
t('the rest of Portugal, Europe; a country is not a place to pick; a bad path and an orphan are left out', [g.portugal.map(p => p.id), g.europe.map(p => p.id)], [['porto'], ['london']])
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'picker-')); fs.mkdirSync(path.join(root, 'data/by-place'), { recursive: true })
fs.writeFileSync(path.join(root, 'data/by-place/places.json'), JSON.stringify({ places: [...P, { id: 'x', name: '[x](javascript:alert(1))', kind: 'city', parent: 'portugal', path: 'portugal/x/' }] }))
const md = fill['place-picker']({ rel: 'contribute/index.html' }, { ROOT: root, link: (from, to) => '../' + to })
t('a link per place to its own page, grouped, with the group names', [/^\*\*The Algarve:\*\* \[The Algarve\]\(\.\.\/algarve\/index\.html\) · \[Faro\]/.test(md), /\*\*Europe:\*\* \[London\]\(\.\.\/europe\/london\/index\.html\)/.test(md)], [true, true])
t('a place name that is a link is plain text', /\]\(javascript:/.test(md), false)
fs.rmSync(root, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_place_picker: OK')
