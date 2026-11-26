#!/usr/bin/env node
/* test_signed_root.mjs: the gate's hold on place-signers.json and place-sources.json (lib/signed-root.mjs), in a real temporary git
 * repository with real SSH-signed commits.   node newsroom/build/tests/test_signed_root.mjs   Written by cl-6.dev@PrompTugal.dinis. */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { checkSignedRoot, signersFrom } from '../lib/signed-root.mjs'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'signedroot-'))
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' }
const run = (args) => execFileSync('git', args, { cwd: tmp, encoding: 'utf8', env })
const key = n => { const f = path.join(tmp, n); execFileSync('ssh-keygen', ['-q', '-t', 'ecdsa', '-b', '256', '-N', '', '-f', f]); return { file: f, pub: fs.readFileSync(f + '.pub', 'utf8').trim().split(' ').slice(0, 2).join(' ') } }
const DEV = key('dev'), COND = key('cond'), STRANGER = key('stranger')
const keysJson = { keys: [
    { id: 'dev-x', agent: 'cl-6.dev@PrompTugal.dinis', status: 'active', ssh: DEV.pub },
    { id: 'cond-x', agent: 'cl-6.conductor@PrompTugal.dinis', status: 'superseded', ssh: COND.pub },
    { id: 'other-x', agent: 'security@PrompTugal.dinis', status: 'active', ssh: STRANGER.pub },
    { id: 'rev-x', agent: 'dev@PrompTugal.dinis', status: 'revoked', ssh: key('revoked').pub },
] }
const F = ['newsroom/tools/place-signers.json', 'newsroom/tools/place-sources.json']
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const commit = (files, k, msg = 'c') => { for (const [f, c] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.writeFileSync(path.join(tmp, f), c) } run(['add', '-A'])
    run(k ? ['-c', 'gpg.format=ssh', '-c', `user.signingkey=${k.file}`, 'commit', '-S', '-q', '-m', msg] : ['-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg]) }
run(['init', '-q', '-b', 'dev'])
t('signers: dev, conductor (even superseded), not security, not revoked', signersFrom(keysJson).length, 2)
commit({ 'board/keys.json': JSON.stringify(keysJson), [F[0]]: '{}', [F[1]]: '{}' }, DEV, 'both signed by the dev key')
t('both files signed by dev pass', checkSignedRoot({ root: tmp, keys: keysJson }), [])
commit({ [F[1]]: '{"a":1}' }, COND, 'sources by the conductor')
t('a conductor-signed change passes', checkSignedRoot({ root: tmp, keys: keysJson }), [])
commit({ [F[1]]: '{"a":2}' }, STRANGER, 'sources by another agent')
t('another agent\'s key fails', checkSignedRoot({ root: tmp, keys: keysJson }).length, 1)
commit({ [F[1]]: '{"a":3}' }, null, 'sources unsigned')
t('an unsigned change fails', checkSignedRoot({ root: tmp, keys: keysJson }).length, 1)
commit({ [F[1]]: '{"a":4}' }, DEV, 'fixed by the dev key')
t('and passes again when the dev key signs it', checkSignedRoot({ root: tmp, keys: keysJson }), [])
fs.writeFileSync(path.join(tmp, F[0]), '{"edited":true}')
t('an uncommitted edit fails', checkSignedRoot({ root: tmp, keys: keysJson }).length, 1)
run(['checkout', '--', F[0]])
t('no dev or conductor key at all fails', checkSignedRoot({ root: tmp, keys: { keys: [] } }).length, 1)
fs.rmSync(tmp, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_signed_root: OK')
