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
let prev = null
const step = (keys, k, msg) => { const c = commit(keys, k, msg); const got = checkKeyChanges({ root: tmp, baseline: prev }); prev = c; return got }
run(['init', '-q', '-b', 'dev'])
const A = E('a-1', 'a@x', KA), B = E('b-1', 'b@x', KB), C = E('c-1', 'c@x', KC)
prev = commit([A, B], null, 'baseline (earlier history is not checked)')
t('nothing after the baseline: nothing to report', checkKeyChanges({ root: tmp, baseline: prev }), [])

t('a first publication signed by the entry\'s own key passes', step([A, B, C], KC, 'C publishes its first key'), [])
let r = step([A, { ...B, status: 'superseded' }, C], KA, 'A flips B\'s key (a stranger to B)')
t('another agent changing B\'s key is reported, once', [r.length, /b-1 changed, not signed by an active key of b@x/.test(r[0] || '')], [1, true])
r = step([A, { ...B, status: 'superseded', superseded_in: 'abc' }, C, E('b-2', 'b@x', KB2)], KB2, 'B hands over: a new key retires the old, signed by the new key')
t('a hand-over (a new key retiring the old one in the same commit) is reported as such, and the added key itself is fine', [r.length, /b-1 changed in the commit that adds a key for b@x \(hand-over; needs an operator\)/.test(r[0] || '')], [1, true])
r = step([A, { ...B, status: 'superseded', superseded_in: 'abc' }, C, E('b-2', 'b@x', KB2), E('x-1', 'x@x', KX)], null, 'an unsigned addition')
t('an unsigned change is reported', [r.length, /x-1 added, not signed/.test(r[0] || '')], [1, true])
let keys = [A, { ...B, status: 'superseded', superseded_in: 'abc' }, C, E('b-2', 'b@x', KB2), E('x-1', 'x@x', KX)]
t('an agent changing its own entry passes', step(keys.map(k => k.id === 'a-1' ? { ...k, superseded_in: 'zzz' } : k), KA, 'A changes its own entry'), [])
keys = keys.map(k => k.id === 'a-1' ? { ...k, superseded_in: 'zzz', status: 'superseded' } : k.id === 'c-1' ? { ...k, status: 'superseded' } : k)
r = step(keys, KA, 'A changes its own and C\'s')
t('another agent\'s entry in the same commit is reported (and only it)', [r.length, /c-1 changed/.test(r[0] || '')], [1, true])
r = step(keys.map(k => k.id === 'b-1' ? { ...k, status: 'active' } : k), KB2, 'B re-activates its own retired key')
t('re-activation is reported even when the entry\'s own agent signs it', [r.length, /b-1 re-activated \(superseded to active\); operator only/.test(r[0] || '')], [1, true])
keys = keys.map(k => k.id === 'b-1' ? { ...k, status: 'active' } : k)
r = step(keys.map(k => k.id === 'c-1' ? { ...k, status: 'active' } : k), KX, 'a stranger re-activates C\'s key')
t('a stranger re-activating a key: reported as a re-activation', [r.length, /c-1 re-activated/.test(r[0] || '')], [1, true])
keys = keys.map(k => k.id === 'c-1' ? { ...k, status: 'active' } : k)
t('a note-only change is not a change', step(keys.map(k => k.id === 'x-1' ? { ...k, note: 'hello' } : k), KX, 'a note'), [])
r = step(keys.filter(k => k.id !== 'x-1'), KA, 'A removes X\'s entry')
t('removing another agent\'s entry is reported', [r.length, /x-1 removed, not signed by an active key of x@x/.test(r[0] || '')], [1, true])
keys = keys.filter(k => k.id !== 'x-1')
t('an agent removing its own entry (its still-active key in the parent signs) passes', step(keys.filter(k => k.id !== 'b-2'), KB2, 'B removes its own active entry'), [])
keys = keys.filter(k => k.id !== 'b-2')
r = step(keys.filter(k => k.id !== 'a-1'), KA, 'A (its key already superseded) removes its own entry')
t('a superseded key no longer vouches, not even for its own removal', [r.length, /a-1 removed/.test(r[0] || '')], [1, true])
r = step(keys.filter(k => k.id !== 'a-1').map(k => k.id === 'c-1' ? { ...k, agent: 'x@x' } : k), KX, 'X rewrites C\'s agent field to itself and signs')
t('another agent rewriting an entry\'s agent field to itself is reported', [r.length, /c-1 agent changed \(c@x to x@x\); operator only/.test(r[0] || '')], [1, true])
t('changedEntries: a note-only change is not a change', changedEntries([{ ...A }], [{ ...A, note: 'x' }]).length, 0)
t('changedEntries: a status change is', changedEntries([{ ...A }], [{ ...A, status: 'superseded' }]).length, 1)
t('a missing baseline is reported, not passed', checkKeyChanges({ root: tmp, baseline: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef' }).length, 1)
// an entry whose ssh field holds only the key type is vouched for by its bundle.sign key (cl-6.devops, 26 Nov 2026)
{
    const KP = key('p'), KQ = key('q'), pem = k => execFileSync('ssh-keygen', ['-e', '-m', 'PKCS8', '-f', k.file + '.pub'], { encoding: 'utf8' }).trim()
    const P = { id: 'p-1', agent: 'p@x', status: 'active', ssh: 'ecdsa-sha2-nistp256', bundle: { sign: pem(KP) } }
    step([...keys, P], KP, 'P publishes with only the key type in ssh')
    r = step([...keys, { ...P, superseded_in: 'zzz' }], KP, 'P changes its own entry, signed by its bundle.sign key')
    t('an entry with no ssh key is vouched for by its bundle.sign key', r, [])
    r = step([...keys, { ...P, superseded_in: 'yyy' }], KQ, 'a stranger signs a change of P')
    t('a stranger is still reported for such an entry', [r.length > 0, /p-1/.test(r.join(' '))], [true, true])
    const BAD = { ...P, id: 'p-3', agent: 'bad@x', bundle: { sign: '-----BEGIN PUBLIC KEY-----\nAAAA\n-----END PUBLIC KEY-----' } }
    step([...keys, BAD], KQ, 'a bad PEM is published')
    r = step([...keys, { ...BAD, status: 'superseded' }], KQ, 'the bad-PEM entry is changed')
    t('a PEM that does not convert is no key', r.some(x => /p-3 changed/.test(x)), true)
}
// an operator is recognised by the fingerprint listed in operator-keys.json, never by a name in board/keys.json (cl-6.security, 26 Nov 2026)
{
    const KO = key('o'), KM = key('m'), fp = k => /(SHA256:\S+)/.exec(execFileSync('ssh-keygen', ['-lf', k.file + '.pub'], { encoding: 'utf8' }))[1]
    const OPK = E('o-1', 'dinis@x', KO), FAKE = E('m-1', 'operator@x', KM), V = E('v-1', 'v@x', KX), W2 = E('w-1', 'w@x', KX)
    const base0 = commit([...keys, OPK, FAKE, V], KO, 'an operator key and an agent called operator are published'); prev = base0
    const withOps = k => checkKeyChanges({ root: tmp, baseline: base0, operators: k })
    let c1 = commit([...keys, OPK, FAKE, { ...V, status: 'superseded' }], KO, 'the operator retires V')
    t('an operator, by fingerprint, may change another agent\'s entry', withOps([fp(KO)]), [])
    t('with no operator listed the same commit is reported', withOps([]).length, 1)
    prev = c1; let c2 = commit([...keys, OPK, FAKE, { ...V, status: 'active' }], KM, 'an agent called operator re-activates V')
    const r2 = checkKeyChanges({ root: tmp, baseline: c1, operators: [fp(KO)] })
    t('a key whose entry is named operator is not an operator: re-activation reported', [r2.length, /v-1 re-activated/.test(r2[0] || '')], [1, true])
    prev = c2; commit([...keys, OPK, FAKE, { ...V, status: 'active' }, { ...OPK, status: 'superseded' }], KO, 'the operator key itself is retired by its own signature')
    t('an operator, active in the parent, may retire its own key', checkKeyChanges({ root: tmp, baseline: c2, operators: [fp(KO)] }).length, 0)
}
fs.rmSync(tmp, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_keys_changes: OK')
