import test from 'node:test'
import assert from 'node:assert/strict'
import { storyCounts } from '../build/lib/derive.mjs'

const registry = {
    index: { faro: 'faro', loule: 'loule', algarve: 'algarve', portugal: 'portugal', lisboa: 'lisbon', lisbon: 'lisbon' },
    places: [
        { id: 'portugal', name: 'Portugal', kind: 'country', parent: null, at: null },
        { id: 'algarve', name: 'Algarve', kind: 'region', parent: 'portugal', at: [-8, 37.2] },
        { id: 'faro', name: 'Faro', kind: 'municipality', parent: 'algarve', at: [-7.9, 37] },
        { id: 'loule', name: 'Loulé', kind: 'municipality', parent: 'algarve', at: [-8, 37.1] },
        { id: 'lisbon', name: 'Lisbon', kind: 'city', parent: 'portugal', at: [-9.1, 38.7] },
    ],
}
const news = [
    { id: 'faro', news: [{ key: 'u1', date: '2026-11-01' }, { key: 'u2', date: '2026-11-01' }] },
    { id: 'loule', news: [{ key: 'u2', date: '2026-11-02' }, { key: 'u3', date: '2026-11-03' }] },
    { id: 'lisboa', news: [{ key: 'u9', date: '2026-11-03' }] },
]
const art = (slug, fm) => ({ path: `content/articles/${slug}.md`, fm })

test('local_stories is each place\'s own list; a story shared by two places is counted once above them', () => {
    const c = storyCounts(registry, news, [])
    assert.equal(c.places.faro.local_stories, 2); assert.equal(c.places.loule.local_stories, 2)
    assert.equal(c.places.algarve.local_stories, 0); assert.equal(c.places.algarve.rolled_up.local_stories, 3)
    assert.equal(c.places.portugal.rolled_up.local_stories, 4); assert.equal(c.totals.local_stories_distinct, 4)
    assert.deepEqual(c.places.faro.local_by_date, { '2026-11-01': 2 })
})
test('an alias resolves to its place; an unknown place file is listed, not dropped silently', () => {
    const c = storyCounts(registry, [...news, { id: 'nowhere', news: [{ key: 'x', date: '' }] }], [])
    assert.equal(c.places.lisbon.local_stories, 1); assert.deepEqual(c.unresolved.by_place_files, ['nowhere'])
})
test('articles are placed by town, else region; the rest are counted as not placed', () => {
    const c = storyCounts(registry, news, [art('a', { town: 'loule', region: 'algarve' }), art('b', { region: 'algarve' }), art('c', {}), art('d', { town: 'atlantis' })])
    assert.equal(c.places.loule.articles, 1); assert.equal(c.places.algarve.articles, 1); assert.equal(c.places.algarve.rolled_up.articles, 2)
    assert.deepEqual(c.totals, { local_stories_distinct: 4, articles_total: 4, articles_placed: 2 }); assert.deepEqual(c.unresolved.articles, ['d: atlantis'])
})
test('a place with no story and no tagged article is left out', () => assert.equal(storyCounts(registry, [], []).places.faro, undefined))
