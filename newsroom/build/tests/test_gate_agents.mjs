#!/usr/bin/env node
/* test_gate_agents.mjs: which agent names the gate accepts for a board/team/<role> folder (datacheck.mjs, agentIsRole).
 *   node newsroom/build/tests/test_gate_agents.mjs
 * Pins the 26 November change (7f45a4b71): an account-prefixed twin cl-<n>.<role>@PrompTugal.dinis is the same role, and
 * nothing wider. Written by cl-6.dev@PrompTugal.dinis. Exit 1 on the first failure. */
import { agentIsRole } from '../lib/datacheck.mjs'
let bad = 0
const t = (agent, role, want) => { const got = agentIsRole(agent, role); if (got !== want) { bad++; console.error(`FAIL agentIsRole(${agent}, ${role}) = ${got}, want ${want}`) } }
// accepted: the plain name, Dinis's other domains, a numbered twin
t('dev@PrompTugal.dinis', 'dev', true)
t('dev@account-b.dinis', 'dev', true)
t('dev@AgentiCCells.dinis', 'dev', true)
t('cl-6.dev@PrompTugal.dinis', 'dev', true)
t('cl-12.conductor@PrompTugal.dinis', 'conductor', true)
t('cl-6.dev.search@PrompTugal.dinis', 'dev.search', true)
// refused: another role, a twin of another role, a made-up prefix, a prefix with a dot, a missing number, another domain
t('conductor@PrompTugal.dinis', 'dev', false)
t('cl-6.conductor@PrompTugal.dinis', 'dev', false)
t('cl-6.dev@PrompTugal.dinis', 'dev.search', false)
t('cl-6.dev.search@PrompTugal.dinis', 'dev', false)  // a dotted worker is not its main role
t('x.dev@PrompTugal.dinis', 'dev', false)
t('cl-.dev@PrompTugal.dinis', 'dev', false)
t('cl-6.x.dev@PrompTugal.dinis', 'dev', false)
t('cl-6a.dev@PrompTugal.dinis', 'dev', false)
t('CL-6.dev@PrompTugal.dinis', 'dev', false)
t('cl-6.dev@evil.example', 'dev', false)
t('cl-6.dev@PrompTugal.dinis.evil', 'dev', false)
t('cl-6.dev@promptugal.dinis', 'dev', false)
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_gate_agents: OK')
