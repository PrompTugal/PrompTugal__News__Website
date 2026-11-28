#!/usr/bin/env node
/* test_status_page.mjs: /newsroom/status/'s feeds are cut to named fields, scrubbed, and rendered as plain text (cell 2026-11-28-promptugal-status).   node newsroom/build/tests/test_status_page.mjs */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fromBriefing, fromQuestions } from '../../tools/sync-status.mjs'
import { statusMd } from '../lib/newsroom-status.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const b = fromBriefing({ waiting_on_dinis: [{ id: 'a', what: 'say yes to jo@example.com or +351 912 345 678', urgency: 'now', where: 'https://claude.ai/code/session_x', line: '"yes"', extra: 'dropped' }, { id: 'm', what: 'pay $500 for it' }] })
t('only the named fields, a contact scrubbed, a money item dropped, no session link kept', [b.length, Object.keys(b[0]).sort(), /@|912|claude\.ai/.test(JSON.stringify(b))], [1, ['id', 'line', 'urgency', 'what'], false])
const q = fromQuestions({ questions: [{ id: 'q1', question: 'a', status: 'open', since: '2026-11-28T01:00Z', asked_by: 'x' }, { id: 'q2', question: 'b', status: 'answered' }, { id: 'q3', question: 'c', status: 'closed' }] })
t('answered and closed questions are left out; since is a day', [q.map(x => x.id), q[0].since], [['q1'], '2026-11-28'])
// rendering: hostile text stays text
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'status-')); fs.mkdirSync(path.join(root, 'assets/newsroom'), { recursive: true })
const w = JSON.parse(fs.readFileSync(new URL('../../../assets/newsroom/status-words.json', import.meta.url), 'utf8'))
fs.writeFileSync(path.join(root, 'assets/newsroom/status-words.json'), JSON.stringify(w))
fs.writeFileSync(path.join(root, 'assets/newsroom/agents-cl6.json'), fs.readFileSync(new URL('../../../assets/newsroom/agents-cl6.json', import.meta.url)))
fs.writeFileSync(path.join(root, 'assets/newsroom/status-snapshot.json'), JSON.stringify({ briefing: { read_at: 'x', items: [{ id: 'h', what: '[click](javascript:alert(1)) <img src=x onerror=alert(1)> | pipe', urgency: 'now' }] }, questions: null }))
const md = statusMd({ readJSON: f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')) })
t('hostile text is not a link or a tag', [/\]\(javascript:/.test(md), /<img/.test(md)], [false, false])
t('a feed that could not be read says so', md.includes(w.not_read), true)
t('the data section says it is not read yet', md.includes(w.data_none), true)
fs.rmSync(root, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_status_page: OK')
