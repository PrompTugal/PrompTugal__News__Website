#!/usr/bin/env node
/* test_article_flow.mjs: the news-flow front matter rules (lib/article-flow.mjs; cl-6.ontologist's proposal of 27 Nov 2026).   node newsroom/build/tests/test_article_flow.mjs */
import { checkFlow, levelOfArticle, listOf } from '../lib/article-flow.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const registry = { index: { faro: 'faro', algarve: 'algarve', portugal: 'portugal', london: 'london' }, places: [
    { id: 'portugal', kind: 'country', country: 'PT' }, { id: 'algarve', kind: 'region', country: 'PT' }, { id: 'faro', kind: 'municipality', country: 'PT' }, { id: 'london', kind: 'city', country: 'GB' }] }
t('a list in brackets or bare', [listOf('[a, b-c]'), listOf('a,b'), listOf(['x']), listOf('')], [['a', 'b-c'], ['a', 'b'], ['x'], []])
t('levels', ['faro', 'algarve', 'portugal', 'london', ''].map(w => levelOfArticle(registry, w ? { town: w } : {})), ['local', 'regional', 'national', 'europe', 'unplaced'])
const A = (slug, fm) => ({ slug, fm: { date: '2026-11-20', ...fm } })
t('untagged articles pass', checkFlow([A('a', {}), A('b', {})], registry), [])
t('an unknown town is an error', checkFlow([A('a', { town: 'atlantis' })], registry).length, 1)
t('a sound chain passes', checkFlow([A('l', { town: 'faro' }), A('r', { region: 'algarve', builds_on: '[l]', date: '2026-11-21' }), A('n', { region: 'portugal', builds_on: 'r, l', date: '2026-11-22' })], registry), [])
t('an unknown slug, itself', checkFlow([A('a', { builds_on: '[zzz]' }), A('b', { builds_on: 'b' })], registry).length, 2)
t('a later-dated source', checkFlow([A('a', { builds_on: 'b' }), A('b', { date: '2026-11-25' })], registry).length, 1)
t('a higher level', checkFlow([A('l', { town: 'faro', builds_on: 'n' }), A('n', { region: 'portugal' })], registry).length, 1)
t('europe and unplaced are not ranked', checkFlow([A('e', { town: 'london', builds_on: 'u' }), A('u', {})], registry), [])
t('a cycle of any length', checkFlow([A('a', { builds_on: 'b' }), A('b', { builds_on: 'c' }), A('c', { builds_on: 'a' })], registry).some(e => /cycle/.test(e)), true)
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_article_flow: OK')
