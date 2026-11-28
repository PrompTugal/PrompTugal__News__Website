#!/usr/bin/env node
/* test_status_page.mjs: /newsroom/status/'s feeds are cut to named fields, scrubbed, and rendered as plain text (cell 2026-11-28-promptugal-status).   node newsroom/build/tests/test_status_page.mjs */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fromDecisions, clean } from '../../tools/sync-status.mjs'
import { statusMd, when } from '../lib/newsroom-status.mjs'
import { fromAgents, fromData, fromLog } from '../../tools/sync-status.mjs'
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
// DEFAULT DENY (cl-6.security, 28 Nov): only public === true reaches the snapshot, and only the named fields of a public card
const card = o => ({ id: 'secret-id', question: 'full question', asked_by: 'cl-6.x', since: '2026-11-27', context_url: 'session_016CrbJLv54Kh4CSTzagW2G3', line_to_paste: 'yes please', urgency: 'now', status: 'open', answer_line: 'yes, start it', where: "cl-6.maestro's session", where_url: 'https://claude.ai/code/session_016CrbJLv54Kh4CSTzagW2G3', options: ['a', 'b'], recommended: { answer: 'yes', by: 'cl-6.maestro' }, title: 'T', public_summary: 'S', why: 'W', if_you_wait: 'I', unblocks: 'U', tier: 'now', rank: 1, kind: 'approval', ...o })
const d = fromDecisions({ questions: [card({ public: false, title: 'PRIVATE-FALSE' }), card({ title: 'PRIVATE-MISSING' }), card({ public: 'true', title: 'PRIVATE-STRING' }), card({ public: 1, title: 'PRIVATE-ONE' }), card({ public: null, title: 'PRIVATE-NULL' }), card({ public: true, title: 'SHOWN' }), card({ public: true, title: 'PRIVATE-MONEY', if_you_wait: 'it costs $500' }), card({ public: true, title: 'ANSWERED', status: 'answered' })] })
t('only the item with public === true (the boolean) is kept, an answered or a money item is not', d.items.map(x => x.title), ['SHOWN'])
t('no private title anywhere in the snapshot shape', /PRIVATE/.test(JSON.stringify(d)), false)
t('a public card keeps only the named fields', Object.keys(d.items[0]).sort(), ['if_you_wait', 'summary', 'title'])
t('no answer line, option, link, id, session or person leaks from a public card', /yes, start it|claude\.ai|session_0|secret-id|yes please|recommended|cl-6\.x/i.test(JSON.stringify(d)), false)
t('no count of the items that are not public', Object.keys(d).sort(), ['items'])
t('no feed, no decisions', [fromDecisions(null).items, fromDecisions({}).items], [[], []])
t('a hostile title is cut and scrubbed, not trusted', fromDecisions({ questions: [card({ public: true, title: 'see session_016CrbJLv54Kh4CSTzagW2G3 and trig_0132oarAUsN5cwmgTAbj3GGk' })] }).items[0].title, 'see (a session) and (a scheduled task)')
t('clean() on its own', clean('a session_abcdef1234 b'), 'a (a session) b')
// rendering: hostile text stays text
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'status-')); fs.mkdirSync(path.join(root, 'assets/newsroom'), { recursive: true })
const w = JSON.parse(fs.readFileSync(new URL('../../../assets/newsroom/status-words.json', import.meta.url), 'utf8'))
fs.writeFileSync(path.join(root, 'assets/newsroom/status-words.json'), JSON.stringify(w))
fs.writeFileSync(path.join(root, 'assets/newsroom/agents-cl6.json'), fs.readFileSync(new URL('../../../assets/newsroom/agents-cl6.json', import.meta.url)))
fs.writeFileSync(path.join(root, 'assets/newsroom/status-snapshot.json'), JSON.stringify({ decisions: { read_at: 'x', items: [{ title: '[click](javascript:alert(1)) <img src=x onerror=alert(1)> | pipe', summary: 's', if_you_wait: '' }] } }))
const md = statusMd({ readJSON: f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')) })
t('hostile text is not a link or a tag', [/\]\(javascript:/.test(md), /<img/.test(md)], [false, false])
t('a feed that could not be read says so', md.includes(w.not_read), true)
t('the data section says it is not read yet', md.includes(w.data_none), true)
// the agents and data feeds: named fields only, a bad repo name and a bad date dropped, hostile text escaped in the HTML block
const ag = fromAgents({ agents: [{ id: '<b>x</b>@P', desk: 'Sec', home_repo: '../../etc/passwd', status: 'idle', last_activity: { at: 'yesterday', what: '<script>alert(1)</script>' }, blocked_on: 'say yes', secret: 'k', next_step: { next_wake: '2026-11-28T07:27Z', wake: 'w' } }] })
t('agents: a path as a repo is dropped, a relative date is dropped, only named fields, no free text of what it did or waits on', [ag[0].repo, ag[0].last_at, Object.keys(ag[0]).includes('secret'), /script|say yes/.test(JSON.stringify(ag))], ['', '', false, false])
t('blocked is a yes or no', ag[0].blocked, true)
t('when() is absolute with the hour', [when('2026-11-27T21:17Z'), when('yesterday')], ['27 Nov 21:17 UTC', ''])
const da = fromData({ generated_utc: '2026-11-28T01:00:00Z', datasets: [{ id: 'd', title: '<img src=x onerror=1>', freshness: 'source problem', age_hours: 40, rows: 3, owner: 'o' }] })
fs.writeFileSync(path.join(root, 'assets/newsroom/status-snapshot.json'), JSON.stringify({ agents: { read_at: '2026-11-28T01:00Z', items: ag }, data: { read_at: '2026-11-28T01:00Z', ...da }, other_teams: { items: fromLog('2026-11-27T15:38:00+00:00\u0002s\u0002curator@PrompTugal.vicky\u0001') } }))
const md2 = statusMd({ readJSON: f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')) })
t('feeds render as text', [/<script|<img|<b>/.test(md2), md2.includes('source problem'), md2.includes('curator@PrompTugal.vicky')], [false, true, true])
const html = []; statusMd({ readJSON: f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')) }, { raw: h => (html.push(h), '') })
t('hostile names never become tags in the HTML blocks', [html.join('').includes('<script>'), html.join('').includes('<img src=x')], [false, false])
fs.rmSync(root, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_status_page: OK')
