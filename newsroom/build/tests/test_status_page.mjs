#!/usr/bin/env node
/* test_status_page.mjs: /newsroom/status/'s feeds are cut to named fields, scrubbed, and rendered as plain text (cell 2026-11-28-promptugal-status).   node newsroom/build/tests/test_status_page.mjs */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fromBriefing, fromQuestions } from '../../tools/sync-status.mjs'
import { statusMd, when } from '../lib/newsroom-status.mjs'
import { fromAgents, fromData, fromLog } from '../../tools/sync-status.mjs'
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
// the agents and data feeds: named fields only, a bad repo name and a bad date dropped, hostile text escaped in the HTML block
const ag = fromAgents({ agents: [{ id: '<b>x</b>@P', desk: 'Sec', home_repo: '../../etc/passwd', status: 'idle', last_activity: { at: 'yesterday', what: '<script>alert(1)</script>' }, blocked_on: 'say yes', secret: 'k', next_step: { next_wake: '2026-11-28T07:27Z', wake: 'w' } }] })
t('agents: a path as a repo is dropped, a relative date is dropped, only named fields', [ag[0].repo, ag[0].last_at, Object.keys(ag[0]).includes('secret')], ['', '', false])
t('when() is absolute with the hour', [when('2026-11-27T21:17Z'), when('yesterday')], ['27 Nov 21:17 UTC', ''])
const da = fromData({ generated_utc: '2026-11-28T01:00:00Z', datasets: [{ id: 'd', title: '<img src=x onerror=1>', freshness: 'source problem', age_hours: 40, rows: 3, owner: 'o' }] })
fs.writeFileSync(path.join(root, 'assets/newsroom/status-snapshot.json'), JSON.stringify({ briefing: null, questions: null, agents: { read_at: '2026-11-28T01:00Z', items: ag }, data: { read_at: '2026-11-28T01:00Z', ...da }, other_teams: { items: fromLog('2026-11-27T15:38:00+00:00\u0002s\u0002curator@PrompTugal.vicky\u0001') } }))
const md2 = statusMd({ readJSON: f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')) })
t('feeds render as text', [/<script|<img|<b>/.test(md2), md2.includes('source problem'), md2.includes('curator@PrompTugal.vicky')], [false, true, true])
const html = []; statusMd({ readJSON: f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')) }, { raw: h => (html.push(h), '') })
t('hostile names never become tags in the HTML blocks', [html.join('').includes('<script>'), html.join('').includes('<img src=x')], [false, false])
fs.rmSync(root, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_status_page: OK')
