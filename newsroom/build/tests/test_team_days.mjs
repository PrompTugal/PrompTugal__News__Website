#!/usr/bin/env node
/* test_team_days.mjs: the team's days keep only minutes per agent per UTC day.   node newsroom/build/tests/test_team_days.mjs */
import { daysFrom, agentOf } from '../../tools/team-days.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const S = '\u0002', E = '\u0001'
const log = ['2026-11-28T09:05:00+01:00' + S + 'a subject with jo@example.com' + S + 'cl-6.dev@PrompTugal.dinis', '2026-11-28T08:07:00Z' + S + 'site v0.1.2430: x' + S, '2026-11-28T08:06:00Z' + S + 'something' + S + 'cl-6.dev@PrompTugal.dinis', '2026-11-27T23:59:00Z' + S + 'no trailer' + S].join(E)
const d = daysFrom(log)
t('minutes are UTC (the +01:00 commit is 08:05) and sorted', d['2026-11-28']['cl-6.dev@PrompTugal.dinis'], ['08:05', '08:06'])
t('CI and no-trailer commits are named, not dropped', [d['2026-11-28'].ci, d['2026-11-27'].other], [['08:07'], ['23:59']])
t('nothing but minutes is kept: no subject, no address', /example|subject/.test(JSON.stringify(d)), false)
t('an odd trailer is not an agent', agentOf('<script>x</script>', 'a'), 'other')
t('an address in a trailer is not an agent', [agentOf('jo.bloggs@gmail.com', 'a'), agentOf('jo@example.com', 'a'), agentOf('cl-6.dev@PrompTugal.dinis', 'a'), agentOf('accountant.c@AgentiCCells.dinis', 'a'), agentOf('newsroom@web-summit.dinis', 'a')], ['other', 'other', 'cl-6.dev@PrompTugal.dinis', 'accountant.c@AgentiCCells.dinis', 'newsroom@web-summit.dinis'])
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_team_days: OK')
