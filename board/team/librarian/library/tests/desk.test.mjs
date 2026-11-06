// Run: node --test board/team/librarian/library/tests/
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { intake, answer, index, redact, readRegister } from '../build/desk.mjs'

const fx = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/desk')
function setup(now = '2026-11-06T10:00:00Z') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'desk-test-'))
  const lib = path.join(root, 'board/team/librarian/library'); fs.mkdirSync(lib, { recursive: true })
  const o = { lib, now, keys: path.join(fx, 'keys.json'), cards: path.join(fx, 'cards.json'), catalogue: path.join(fx, 'catalogue.json'), waits: path.join(fx, 'waits.json'), accessions: path.join(fx, 'accessions.jsonl') }
  // the third message is made here: a key-shaped string must not sit in a committed fixture (the gate would refuse it)
  const from = path.join(root, 'messages'); fs.cpSync(path.join(fx, 'messages'), from, { recursive: true })
  const fake = 'sk-or-' + 'v1-abcdef0123456789abcdef0123456789'
  fs.writeFileSync(path.join(from, '2026-11-06/m3.json'), JSON.stringify({ from: 'someone@PrompTugal.dinis', to: 'librarian@PrompTugal.dinis', sent: '2026-11-06T18:00Z', subject: 'Is this key fine?', text: `Is it ok that my token is ${fake} and vault_key: abc123def456ghi789jkl?`, sealed_by: 'sha256:ffffffffffffffff', verified: '' }))
  return { lib, o, from }
}

test('intake twice takes nothing twice; kinds and signers', () => {
  const { lib, o, from } = setup()
  const a = intake({ ...o, from }); assert.equal(a.taken.length, 3)
  const b = intake({ ...o, from }); assert.equal(b.taken.length, 0)
  const { slips } = readRegister(path.join(lib, 'desk'))
  assert.equal(slips.length, 3)
  assert.deepEqual(slips.map(s => s.id), ['SLIP-20261106-001', 'SLIP-20261106-002', 'SLIP-20261106-003'])
  assert.deepEqual(slips.map(s => s.kind), ['question', 'notice', 'question'])
  assert.equal(slips[0].asked_by, 'sherpa@PrompTugal.dinis'); assert.equal(slips[0].signature, 'verified')
  assert.equal(slips[2].asked_by, 'unsigned'); assert.equal(slips[2].signature, 'unsigned')
  assert.ok(fs.existsSync(path.join(lib, 'desk/slips/SLIP-20261106-001.md')))
  assert.equal(fs.readFileSync(path.join(lib, 'desk/register.jsonl'), 'utf8').trim().split('\n').length, 3)
})

test('a key-shaped string is redacted, an agent name is not', () => {
  const r = redact('mail me at a.b@example.com, key ' + 'sk-or-' + 'v1-abcdef0123456789abcdef0123456789, from conductor@PrompTugal.dinis, fp sha256:4a76444c8799594b')
  assert.ok(!/example\.com|abcdef0123/.test(r.text)); assert.ok(r.text.includes('conductor@PrompTugal.dinis')); assert.ok(r.text.includes('sha256:4a76444c8799594b'))
  const { lib, o, from } = setup(); intake({ ...o, from })
  const s = readRegister(path.join(lib, 'desk')).slips[2]
  assert.ok(s.question.includes('[removed: R8]')); assert.ok(!/sk-or-v1|abc123def456/.test(s.question)); assert.ok(s.redacted >= 2)
  assert.ok(!/sk-or-v1/.test(fs.readFileSync(path.join(lib, 'desk/slips', s.id + '.md'), 'utf8')))
})

test('answer records cited cards and prints the send command', () => {
  const { lib, o, from } = setup(); intake({ ...o, from })
  const r = answer({ ...o, id: 'SLIP-20261106-001', file: path.join(fx, 'answer.md') })
  assert.deepEqual(r.line.cited, ['board:board/tools/agent_inboxes.py', 'page:index.html'])
  assert.deepEqual(r.line.cited_unknown, ['page:nonexistent.html'])
  assert.match(r.command, /^python3 -I board\/tools\/agent_inboxes\.py send \. --from librarian --to sherpa --subject /)
  const s = readRegister(path.join(lib, 'desk')).slips[0]
  assert.equal(s.state, 'answered'); assert.ok(s.answered_at); assert.ok(fs.existsSync(path.join(lib, 'desk/answers/SLIP-20261106-001.md')))
  assert.equal(fs.readFileSync(path.join(lib, 'desk/register.jsonl'), 'utf8').trim().split('\n').length, 4)
})

test('index marks overdue (open questions older than 6 hours) and writes wants', () => {
  const { lib, o, from } = setup('2026-11-06T10:00:00Z'); intake({ ...o, from })
  index({ ...o, now: '2026-11-06T13:00:00Z' }) // slip 1 is 5h old, slip 3 not yet received: nothing overdue
  assert.ok(!fs.readFileSync(path.join(lib, 'desk/index.md'), 'utf8').includes('overdue**'))
  index({ ...o, now: '2026-11-06T15:00:00Z' }) // slip 1 is 7h old
  const md = fs.readFileSync(path.join(lib, 'desk/index.md'), 'utf8')
  assert.match(md, /SLIP-20261106-001 .*\*\*overdue\*\*/)
  assert.ok(!/SLIP-20261106-002 .*overdue/.test(md)) // a notice is never overdue
  assert.match(fs.readFileSync(path.join(lib, 'desk/wants.md'), 'utf8'), /SLIP-20261106-001/)
  answer({ ...o, id: 'SLIP-20261106-001', file: path.join(fx, 'answer.md') })
  index({ ...o, now: '2026-11-06T15:00:00Z' })
  assert.ok(!/SLIP-20261106-001 .*overdue/.test(fs.readFileSync(path.join(lib, 'desk/index.md'), 'utf8')))
})

test('tables stop at 25 rows and the notice board stays under 60 lines', () => {
  const { lib, o } = setup()
  const desk = path.join(lib, 'desk'); fs.mkdirSync(desk, { recursive: true })
  const lines = []
  for (let i = 1; i <= 60; i++) lines.push(JSON.stringify({ id: `SLIP-20261106-${String(i).padStart(3, '0')}`, event: 'received', received: '2026-11-06T08:00:00Z', message_id: 'm' + i, kind: 'notice', asked_by: 'x@PrompTugal.dinis', signature: 'verified', subject: 'n' + i, question: 'n', state: 'open' }))
  fs.writeFileSync(path.join(desk, 'register.jsonl'), lines.join('\n') + '\n')
  const accs = Array.from({ length: 80 }, (_, i) => JSON.stringify({ acc: 'A' + i, id: 'page:p' + i, call: 'C' + i, at: '2026-11-06T13:30:00Z' })).join('\n')
  const af = path.join(lib, 'acc.jsonl'); fs.writeFileSync(af, accs + '\n')
  const r = index({ ...o, accessions: af })
  assert.ok(r.noticeLines < 60, 'notice board lines: ' + r.noticeLines)
  assert.ok(fs.readFileSync(path.join(lib, 'notice-board.md'), 'utf8').split('\n').length <= 61)
  const md = fs.readFileSync(path.join(desk, 'index.md'), 'utf8')
  const tableRuns = md.split('\n\n').filter(b => b.startsWith('| Slip')).map(b => b.split('\n').length - 2)
  assert.ok(tableRuns.length >= 3 && tableRuns.every(n => n <= 25), JSON.stringify(tableRuns))
})
