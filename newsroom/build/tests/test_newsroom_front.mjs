#!/usr/bin/env node
/* test_newsroom_front.mjs: the changes card shows only the site's own team's releases and never what the page says it never shows.   node newsroom/build/tests/test_newsroom_front.mjs */
import { publicChanges } from '../lib/newsroom-front.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const OWN = 'cl-6.dev@PrompTugal.dinis', v = (what, by = OWN, n = 1) => ({ version: `v0.1.${n}`, date: '2026-11-28', by, what: `${by}: ${what}` })
const keep = v('the status page is shorter on a phone')
const lines = [keep,
    v('Merge remote-tracking branch origin/dev into claude/x', OWN, 2),
    v('another team asked', 'reviewer@PrompTugal.vicky', 3), v('cells report back', 'c.maestro (account-c)', 4),
    v('what waits on Dinis is listed', OWN, 5), v('ledger +$138.78', OWN, 6), v('credit £4.99', OWN, 7), v('mail jo@example.com', OWN, 8),
    v('a session key for the curator', OWN, 9), v('board/keys.json entry', OWN, 10), v('a token in the header', OWN, 11), v('a secret', OWN, 12), v('the admin/ page', OWN, 13),
    v('the weather snapshot brought up to date (run by release.sh)', OWN, 14), v('the team\'s days brought up to date', OWN, 15), { version: 'v0.1.16', what: 'no author', by: '' }]
t('only the clean line of the site\'s own team survives', publicChanges(lines).map(x => x.version), ['v0.1.1'])
t('a merge, another team, a maestro line and each never-word are each dropped', lines.length - 1 - publicChanges(lines).length >= 14, true)
t('not an array: nothing', publicChanges(null), [])
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_newsroom_front: OK')
