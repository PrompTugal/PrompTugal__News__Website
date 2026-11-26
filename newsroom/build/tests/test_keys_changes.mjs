#!/usr/bin/env node
/* test_keys_changes.mjs: a change to board/keys.json is held to the agent it concerns (lib/keys-changes.mjs), in a real temporary git
 * repository with real SSH-signed commits.   node newsroom/build/tests/test_keys_changes.mjs   Written by cl-6.dev@PrompTugal.dinis. */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { checkKeyChanges, changedEntries } from '../lib/keys-changes.mjs'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'keyschanges-'))
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' }
const run = a => execFileSync('git', a, { cwd: tmp, encoding: 'utf8', env })
const key = n => { const f = path.join(tmp, n); execFileSync('ssh-keygen', ['-q', '-t', 'ecdsa', '-b', '256', '-N', '', '-f', f]); return { file: f, pub: fs.readFileSync(f + '.pub', 'utf8').trim().split(' ').slice(0, 2).join(' ') } }
const KA = key('a'), KB = key('b'), KB2 = key('b2'), KC = key('c'), KX = key('x')
const E = (id, agent, k, extra = {}) => ({ id, agent, status: 'active', ssh: k.pub, ...extra })
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const write = keys => { fs.mkdirSync(path.join(tmp, 'board'), { recursive: true }); fs.writeFileSync(path.join(tmp, 'board/keys.json'), JSON.stringify({ keys }, null, 1) + '\n') }
const commit = (keys, k, msg) => { write(keys); run(['add', '-A']); run(k ? ['-c', 'gpg.format=ssh', '-c', `user.signingkey=${k.file}`, 'commit', '-S', '-q', '-m', msg] : ['-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg]); return run(['rev-parse', 'HEAD']).trim() }
const chk = (base) => checkKeyChanges({ root: tmp, baseline: base })
run(['init', '-q', '-b', 'dev'])
const A = E('a-1', 'a@x', KA), B = E('b-1', 'b@x', KB)
const base = commit([A, B], null, 'baseline (unsigned history before it is not checked)')
t('nothing after the baseline: nothing to report', chk(base), [])

let keys = [A, B, E('c-1', 'c@x', KC)]
commit(keys, KC, 'C publishes its first key, signed by it')
t('a first publication signed by the entry\'s own key passes', chk(base), [])

keys = [A, { ...B, status: 'superseded' }, E('c-1', 'c@x', KC)]
commit(keys, KA, 'A flips B\'s key (a stranger to B)')
t('another agent changing B\'s key is reported', chk(base).length, 1)

keys = [A, { ...B, status: 'superseded', superseded_in: 'abc' }, E('c-1', 'c@x', KC), E('b-2', 'b@x', KB2)]
commit(keys, KB2, 'B restarts: its new key supersedes the old, signed by the new key')
t('B superseding its own old key with a new one passes (the earlier problem stays)', chk(base).length, 1)

keys = [A, { ...B, status: 'superseded', superseded_in: 'abc' }, E('c-1', 'c@x', KC), E('b-2', 'b@x', KB2), E('x-1', 'x@x', KX)]
commit(keys, null, 'unsigned change')
t('an unsigned change is reported', chk(base).length, 2)

keys = [A, { ...B, status: 'superseded', superseded_in: 'abc' }, E('c-1', 'c@x', KC), E('b-2', 'b@x', KB2), E('x-1', 'x@x', KX)]
keys[0] = { ...keys[0], superseded_in: 'zzz' }
commit(keys, KA, 'A changes its own entry')
t('an agent changing its own entry passes', chk(base).length, 2)

keys = keys.map(k => k.id === 'a-1' ? { ...k, status: 'superseded' } : k.id === 'c-1' ? { ...k, status: 'superseded' } : k)
commit(keys, KA, 'A changes its own and C\'s')
t('two agents\' entries in one commit are reported', chk(base).length, 3)

keys = keys.map(k => k.id === 'b-1' ? { ...k, status: 'active' } : k)
commit(keys, KX, 'a stranger reactivates B\'s old key')
t('a stranger reactivating a key is reported', chk(base).length, 4)

t('changedEntries: a note-only change is not a change', changedEntries([{ ...A }], [{ ...A, note: 'x' }]).length, 0)
t('changedEntries: a status change is', changedEntries([{ ...A }], [{ ...A, status: 'superseded' }]).length, 1)
t('a missing baseline is reported, not passed', checkKeyChanges({ root: tmp, baseline: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef' }).length, 1)
fs.rmSync(tmp, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_keys_changes: OK')
