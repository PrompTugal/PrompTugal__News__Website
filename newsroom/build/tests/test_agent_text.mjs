#!/usr/bin/env node
/* test_agent_text.mjs: what may be copied from an agent's home onto /newsroom/agents/ (cl-6.security, 26 Nov 2026): no outlet mailbox, no phone number, no money.
 * node newsroom/build/tests/test_agent_text.mjs */
import { cut, noMoney, scrub } from '../lib/agent-text.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const now = 'Wrote to redacao@outlet.example and +351 912 345 678 (call 00351 21 123 4567), cc cl-6.dev@PrompTugal.dinis.'
t('an outlet mailbox and two phone numbers are replaced, an agent name stays', cut(now, 400), 'Wrote to [address] and [number] (call [number]), cc cl-6.dev@PrompTugal.dinis.')
t('the operators\' agent names stay readable', cut('the old reviewer@PrompTugal.vicky and curator@PrompTugal.indi sessions, not x@other.example', 200), 'the old reviewer@PrompTugal.vicky and curator@PrompTugal.indi sessions, not [address]')
t('a hash and a path are not phone numbers', scrub('sha 0123456789abcdef0123456789abcdef /000110465916150147/'), 'sha 0123456789abcdef0123456789abcdef /000110465916150147/')
t('an item about money is dropped', noMoney([{ what: 'Spend: telemetry reports $409.05 API-equivalent' }, { what: 'Caps: 50 USD a day' }, { what: 'a £5 top-up' }, { what: 'the Stripe link' }, 'one line for the abp']).map(x => x.what || x), ['a £5 top-up', 'the Stripe link', 'one line for the abp'])
t('a long text is cut with an ellipsis', cut('x'.repeat(50), 10), 'xxxxxxxxx…')
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_agent_text: OK')
