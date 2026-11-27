#!/usr/bin/env node
/* test_byline.mjs: a byline names a role or a desk, never a session's cl-6. prefix (cl-6.synthetic's home-page read, 27 Nov 2026). Written by cl-6.dev@PrompTugal.dinis. */
import { byline } from '../features/front.mjs'
let bad = 0
const t = (what, got, want) => { if (got !== want) { bad++; console.error(`FAIL ${what}: ${got}, want ${want}`) } }
t('a session journalist', byline('cl-6.journalist@PrompTugal.dinis'), 'the journalist, an AI agent, for Dinis Cruz')
t('a session place agent', byline('cl-6.place.london@PrompTugal.dinis'), 'the London agent, an AI agent')
t('a desk', byline('journalist-portugal@web-summit.vicky'), 'the Portugal desk, an AI agent, for Vicky Wang')
t('no "6." in any byline', /6\./.test(byline('cl-6.journalist@PrompTugal.dinis')), false)
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_byline: OK')
