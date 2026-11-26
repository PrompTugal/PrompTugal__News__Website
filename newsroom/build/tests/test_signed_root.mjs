#!/usr/bin/env node
/* test_signed_root.mjs: the gate's hold on place-signers.json and place-sources.json (lib/signed-root.mjs), in a real temporary git
 * repository with real SSH-signed commits.   node newsroom/build/tests/test_signed_root.mjs   Written by cl-6.dev@PrompTugal.dinis.
 * Rule (cl-6.security, 26 Nov 2026): an active dev or conductor key vouches for any commit; a superseded key only for a commit that is an
 * ancestor of (or equal to) its superseded_in; no superseded_in, or a revoked key, counts for nothing. */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { checkSignedRoot, keysFrom } from '../lib/signed-root.mjs'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'signedroot-'))
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' }
const run = (args) => execFileSync('git', args, { cwd: tmp, encoding: 'utf8', env })
const key = n => { const f = path.join(tmp, n); execFileSync('ssh-keygen', ['-q', '-t', 'ecdsa', '-b', '256', '-N', '', '-f', f]); return { file: f, pub: fs.readFileSync(f + '.pub', 'utf8').trim().split(' ').slice(0, 2).join(' ') } }
const DEV = key('dev'), COND = key('cond'), OLD = key('old'), STRANGER = key('stranger'), REV = key('revoked')
const F = ['newsroom/tools/place-signers.json', 'newsroom/tools/place-sources.json']
const head = () => run(['rev-parse', 'HEAD']).trim()
const keysOf = (oldIn) => ({ keys: [
    { id: 'dev-x', agent: 'cl-6.dev@PrompTugal.dinis', status: 'active', ssh: DEV.pub },
    { id: 'cond-x', agent: 'cl-6.conductor@PrompTugal.dinis', status: 'active', ssh: COND.pub },
    { id: 'old-x', agent: 'dev@PrompTugal.dinis', status: 'superseded', ssh: OLD.pub, ...(oldIn ? { superseded_in: oldIn } : {}) },
    { id: 'other-x', agent: 'security@PrompTugal.dinis', status: 'active', ssh: STRANGER.pub },
    { id: 'rev-x', agent: 'dev@PrompTugal.dinis', status: 'revoked', ssh: REV.pub },
] })
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const commit = (files, k, msg = 'c') => { for (const [f, c] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.writeFileSync(path.join(tmp, f), c) } run(['add', '-A'])
    run(k ? ['-c', 'gpg.format=ssh', '-c', `user.signingkey=${k.file}`, 'commit', '-S', '-q', '-m', msg] : ['-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg]) }
const chk = (keys) => checkSignedRoot({ root: tmp, keys })
run(['init', '-q', '-b', 'dev'])

const k0 = keysFrom(keysOf(null))
t('keysFrom: active dev and conductor only (security\'s, the revoked and the superseded-without-superseded_in count for nothing)', [k0.active.length, k0.superseded.length], [2, 0])
t('keysFrom: a superseded key with superseded_in is kept apart', keysFrom(keysOf('abc123')).superseded.length, 1)

commit({ 'board/keys.json': '{}', [F[0]]: '{}', [F[1]]: '{}' }, DEV, 'both signed by the active dev key')
t('active dev key passes', chk(keysOf(null)), [])
commit({ [F[1]]: '{"a":1}' }, COND, 'sources by the active conductor key')
t('active conductor key passes', chk(keysOf(null)), [])
commit({ [F[1]]: '{"a":2}' }, STRANGER, 'sources by another agent')
t('another agent\'s key fails', chk(keysOf(null)).length, 1)
commit({ [F[1]]: '{"a":3}' }, null, 'sources unsigned')
t('an unsigned change fails', chk(keysOf(null)).length, 1)
commit({ [F[1]]: '{"a":4}' }, REV, 'sources by a revoked key')
t('a revoked key fails', chk(keysOf(null)).length, 1)

// the superseded key: S is the commit it was superseded in; before or at S it vouches, after S never
commit({ [F[1]]: '{"a":5}' }, OLD, 'sources by the old dev key, while it was active')
const S = head()
t('a superseded key with no superseded_in counts for nothing', chk(keysOf(null)).length, 1)
t('a superseded key vouches for the commit it was superseded in (equal)', chk(keysOf(S)), [])
commit({ [F[0]]: '{"x":1}', [F[1]]: '{"a":5}' }, DEV, 'the dev key again, after S')
commit({ [F[1]]: '{"a":6}' }, OLD, 'sources by the OLD key after it was superseded')
t('the same superseded key on a commit AFTER superseded_in fails', chk(keysOf(S)).length, 1)
commit({ [F[1]]: '{"a":7}' }, DEV, 'fixed by the active dev key')
t('and passes again when an active key signs it', chk(keysOf(S)), [])
t('a superseded_in that is not a commit gives nothing (fails if only it signed)', (() => { commit({ [F[1]]: '{"a":8}' }, OLD, 'old again'); return chk(keysOf('deadbeef0000')).length })(), 1)

commit({ [F[1]]: '{"a":9}' }, DEV, 'restore')
fs.writeFileSync(path.join(tmp, F[0]), '{"edited":true}')
t('an uncommitted edit fails', chk(keysOf(S)).length, 1)
run(['checkout', '--', F[0]])
t('no dev or conductor key at all fails', chk({ keys: [] }).length, 1)
fs.rmSync(tmp, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_signed_root: OK')
