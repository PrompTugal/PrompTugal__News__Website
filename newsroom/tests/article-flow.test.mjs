import test from 'node:test'
import assert from 'node:assert/strict'
import { articleFlow, newsFlow } from '../build/lib/derive.mjs'

const registry = {
    index: { faro: 'faro', algarve: 'algarve', portugal: 'portugal' },
    places: [
        { id: 'portugal', name: 'Portugal', kind: 'country', parent: null, country: 'PT', at: null },
        { id: 'algarve', name: 'Algarve', kind: 'region', parent: 'place:portugal', country: 'PT', at: [-8, 37.2] },
        { id: 'faro', name: 'Faro', kind: 'municipality', parent: 'place:algarve', country: 'PT', at: [-7.9, 37] },
    ],
}
const art = (slug, fm) => ({ path: `content/articles/${slug}.md`, fm })
const arts = [art('local-a', { date: '2026-11-01', town: 'faro' }), art('regional-b', { date: '2026-11-02', region: 'algarve', builds_on: '[local-a, nowhere]' }), art('national-c', { date: '2026-11-03', region: 'portugal', builds_on: 'local-a, regional-b, national-c' }), art('plain-d', { date: '2026-11-03' })]

test('each article has its level and its place chain up to the country', () => {
    const f = articleFlow(registry, arts)
    assert.equal(f.articles['local-a'].level, 'local'); assert.deepEqual(f.articles['local-a'].places, ['faro', 'algarve', 'portugal'])
    assert.equal(f.articles['regional-b'].level, 'regional'); assert.equal(f.articles['national-c'].level, 'national')
    assert.equal(f.articles['plain-d'].level, 'unplaced'); assert.deepEqual(f.articles['plain-d'].places, [])
    assert.deepEqual(f.totals, { articles: 4, placed: 3, with_builds_on: 2, feeds_links: 3 })
})
test('builds_on keeps only existing articles other than itself; feeds is the inverse', () => {
    const f = articleFlow(registry, arts)
    assert.deepEqual(f.articles['regional-b'].builds_on, ['local-a']); assert.deepEqual(f.articles['national-c'].builds_on, ['local-a', 'regional-b'])
    assert.deepEqual(f.articles['local-a'].feeds, ['national-c', 'regional-b']); assert.deepEqual(f.articles['regional-b'].feeds, ['national-c'])
})
test('a partial date key that is not a year or a year-month is bucketed as other', () => {
    const f = newsFlow(registry, [{ id: 'faro', news: [{ key: 'a', date: '2026' }, { key: 'b', date: 'Spring 2026' }] }], [])
    assert.deepEqual(f.totals.undated.partial_dates, { '2026': 1, other: 1 })
})
