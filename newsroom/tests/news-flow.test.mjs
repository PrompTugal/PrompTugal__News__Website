import test from 'node:test'
import assert from 'node:assert/strict'
import { newsFlow } from '../build/lib/derive.mjs'

const registry = {
    index: { faro: 'faro', algarve: 'algarve', portugal: 'portugal', london: 'london' },
    places: [
        { id: 'portugal', name: 'Portugal', kind: 'country', parent: null, country: 'PT', at: null },
        { id: 'algarve', name: 'Algarve', kind: 'region', parent: 'place:portugal', country: 'PT', at: [-8, 37.2] },
        { id: 'faro', name: 'Faro', kind: 'municipality', parent: 'place:algarve', country: 'PT', at: [-7.9, 37] },
        { id: 'london', name: 'London', kind: 'city', parent: 'place:united-kingdom', country: 'GB', at: [0, 51.5] },
    ],
}
const news = [
    { id: 'faro', news: [{ key: 'u1', date: '2026-11-01' }, { key: 'u2', date: '2026-11-02' }] },
    { id: 'algarve', news: [{ key: 'u2', date: '2026-11-02' }, { key: 'u3', date: '' }] },
    { id: 'portugal', news: [{ key: 'u4', date: '2026-11-02' }] },
    { id: 'london', news: [{ key: 'u5', date: '2026-11-02' }] },
]
const art = (slug, fm) => ({ path: `content/articles/${slug}.md`, fm })
const flow = () => newsFlow(registry, news, [art('a', { date: '2026-11-02', town: 'faro' }), art('b', { date: '2026-11-02' }), art('c', { town: 'faro' })])

test('each story is counted once per day at the level of its place; a story at two levels counts at each', () => {
    const f = flow(), d = f.days['2026-11-02']
    assert.equal(d.local.stories, 1); assert.equal(d.regional.stories, 1); assert.equal(d.national.stories, 1); assert.equal(d.europe.stories, 1)
    assert.equal(f.totals.stories_distinct, 5); assert.equal(f.totals.spanning_stories, 1)
})
test('nothing is dropped: no date is undated, no place is unplaced', () => {
    const f = flow()
    assert.deepEqual(f.totals.undated, { stories: 1, articles: 1, partial_dates: {} })
    assert.equal(f.days['2026-11-02'].unplaced.articles, 1); assert.equal(f.totals.by_level.unplaced.articles, 1)
    assert.equal(f.totals.articles_total, 3); assert.equal(f.totals.articles_placed, 2)
})
test('a story lists every place and level it is filed under; ids are short hashes', () => {
    const f = flow(), both = Object.values(f.stories).find(s => s.places.length === 2)
    assert.deepEqual(both.places, ['algarve', 'faro']); assert.deepEqual(both.levels, ['local', 'regional'])
    for (const id of Object.keys(f.stories)) assert.match(id, /^[0-9a-f]{10}$/)
})
test('a partial date is not a day: it is counted as undated and listed', () => {
    const f = newsFlow(registry, [{ id: 'faro', news: [{ key: 'p1', date: '2026' }, { key: 'p2', date: '2025-05' }, { key: 'p3', date: '2026-11-03' }] }], [])
    assert.deepEqual(Object.keys(f.days), ['2026-11-03']); assert.equal(f.totals.undated.stories, 2)
    assert.deepEqual(f.totals.undated.partial_dates, { '2025-05': 1, '2026': 1 }); assert.equal(f.totals.stories_distinct, 3)
})
