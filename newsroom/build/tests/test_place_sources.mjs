#!/usr/bin/env node
/* test_place_sources.mjs: the gate's hold on the place files (lib/place-sources.mjs).   node newsroom/build/tests/test_place_sources.mjs
 * A place file counts only if its sha256 is the one recorded when it was synced from a verified commit. Written by cl-6.dev@PrompTugal.dinis. */
import crypto from 'node:crypto'
import { checkPlaceSources } from '../lib/place-sources.mjs'
const sha = s => crypto.createHash('sha256').update(s).digest('hex')
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const F = 'data/by-place/x.json', N = 'data/by-place/now/x.json'
const src = { x: { files: { [F]: { commit: 'abcdef012', sha256: sha('v1') }, [N]: { commit: 'abcdef012', sha256: sha('n1') } } } }
const files = m => f => (f in m ? Buffer.from(m[f]) : null)
t('the synced bytes pass', checkPlaceSources(['x'], src, files({ [F]: 'v1', [N]: 'n1' })), [])
t('a place with no now file passes', checkPlaceSources(['x'], src, files({ [F]: 'v1' })), [])
t('a hand-edited file fails', checkPlaceSources(['x'], src, files({ [F]: 'v1 edited' })).length, 1)
t('and names the commit', /abcdef012/.test(checkPlaceSources(['x'], src, files({ [F]: 'v1 edited' }))[0]), true)
t('a file that never came through the sync fails', checkPlaceSources(['y'], src, files({ 'data/by-place/y.json': 'v' })).length, 1)
t('a changed now file fails', checkPlaceSources(['x'], src, files({ [F]: 'v1', [N]: 'changed' })).length, 1)
t('an empty record fails every place file', checkPlaceSources(['x'], {}, files({ [F]: 'v1', [N]: 'n1' })).length, 2)
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_place_sources: OK')
