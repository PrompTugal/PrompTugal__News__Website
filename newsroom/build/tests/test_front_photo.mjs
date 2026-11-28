#!/usr/bin/env node
/* test_front_photo.mjs: a home-page picture is refused without rights_checked_by, off assets/front/, at a wrong size or over budget.   node newsroom/build/tests/test_front_photo.mjs */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { checkImage, frontImages, sizeOf, BUDGET } from '../lib/front-photo.mjs'
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fp-')); fs.mkdirSync(path.join(root, 'assets/front'), { recursive: true })
const jpg = (name, w, h, q) => { execFileSync('convert', ['-size', `${w}x${h}`, 'plasma:fractal', '-quality', String(q), path.join(root, 'assets/front', name)]) }
jpg('ok.jpg', 300, 200, 40); jpg('big.jpg', 900, 600, 95)
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const good = { path: 'assets/front/ok.jpg', kind: 'photo', credit: 'A. Author', licence: 'CC BY 4.0', licence_url: 'https://creativecommons.org/licenses/by/4.0', source_url: 'https://commons.wikimedia.org/wiki/File:X.jpg', rights_checked_by: 'cl-6.rights, 2026-11-28', alt: 'A street.', width: 300, height: 200 }
const refused = (what, im, role = 'thumb') => { let m = ''; try { checkImage('s', im, role, root) } catch (e) { m = e.message } t(what, /is refused/.test(m), true) }
t('size read from the file', sizeOf(fs.readFileSync(path.join(root, 'assets/front/ok.jpg'))), { h: 200, w: 300 })
t('a good record passes', checkImage('s', good, 'thumb', root).w, 300)
refused('no rights_checked_by', { ...good, rights_checked_by: '' })
refused('rights_checked_by missing', (({ rights_checked_by, ...r }) => r)(good))
refused('path outside assets/front', { ...good, path: 'assets/other/ok.jpg' })
refused('path traversal', { ...good, path: 'assets/front/../../x.jpg' })
refused('wrong size', { ...good, width: 301 })
refused('http source', { ...good, source_url: 'http://commons.wikimedia.org/x' })
refused('javascript licence link', { ...good, licence_url: 'javascript:alert(1)' })
refused('markup in alt', { ...good, alt: '<b>x</b>' })
refused('unknown kind', { ...good, kind: 'meme' })
refused('missing file', { ...good, path: 'assets/front/none.jpg' })
refused('over the thumbnail budget', { ...good, path: 'assets/front/big.jpg', width: 900, height: 600 })
t('budgets', BUDGET, { lead: 122880, thumb: 20480 })
t('a story with no record shows none', frontImages(root, { lead: { article: 'a' }, top: [{ article: 'b' }] }).size, 0)
t('a record is kept by its slug', [...frontImages(root, { lead: { article: 'a' }, top: [{ article: 'b', image: good }] }).keys()], ['b'])
if (bad) process.exit(1); console.log('ok test_front_photo')
