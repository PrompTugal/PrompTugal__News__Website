#!/usr/bin/env node
/* test_operator_keys.mjs: the operator list's own rule (cl-6.security's O1, 26 Nov 2026), in a real temporary repository with real SSH-signed commits.
 * node newsroom/build/tests/test_operator_keys.mjs */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { checkOperatorKeys, FILE } from '../lib/operator-keys.mjs'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'opkeys-test-')), keysDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opkeys-keys-'))
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' }
const run = a => execFileSync('git', a, { cwd: tmp, encoding: 'utf8', env })
const key = n => { const f = path.join(keysDir, n); execFileSync('ssh-keygen', ['-q', '-t', 'ecdsa', '-b', '256', '-N', '', '-f', f]); return { file: f, pub: fs.readFileSync(f + '.pub', 'utf8').trim().split(' ').slice(0, 2).join(' '), fp: /(SHA256:\S+)/.exec(execFileSync('ssh-keygen', ['-lf', f + '.pub'], { encoding: 'utf8' }))[1] } }
const DEV = key('dev'), OP = key('op'), OP2 = key('op2')
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const E = (id, agent, k) => ({ id, agent, status: 'active', ssh: k.pub })
const write = (ops, keys) => { fs.mkdirSync(path.join(tmp, 'newsroom/tools'), { recursive: true }); fs.mkdirSync(path.join(tmp, 'board'), { recursive: true })
    fs.writeFileSync(path.join(tmp, FILE), JSON.stringify({ operators: ops }, null, 1) + '\n'); fs.writeFileSync(path.join(tmp, 'board/keys.json'), JSON.stringify({ keys }, null, 1) + '\n') }
const commit = (ops, keys, k, msg) => { write(ops, keys); run(['add', '-A']); run(['-c', 'gpg.format=ssh', '-c', `user.signingkey=${k.file}`, 'commit', '-S', '-q', '-m', msg]) }
const keys = [E('dev-1', 'cl-6.dev@PrompTugal.dinis', DEV), E('op-1', 'dinis@x', OP), E('op-2', 'dinis2@x', OP2)]
const go = () => checkOperatorKeys({ root: tmp })

run(['init', '-q', '-b', 'dev'])
commit([], keys, DEV, 'the empty list')
t('an empty list: nothing to say', go(), { errors: [], notices: [] })
commit([OP.fp], keys, DEV, 'the dev key adds a fingerprint that is not its own')
let r = go(); t('the first operator added by a key that is not the one it adds is an error', [r.errors.length, /signed by that very key/.test(r.errors[0] || '')], [1, true])
run(['reset', '-q', '--hard', 'HEAD~1'])
commit([OP.fp], keys, OP, 'the holder of the key bootstraps the list')
r = go(); t('the holder of the key may add it as the first operator', r.errors, [])
t('the standing notice names the fingerprint', r.notices, [`operator key listed: ${OP.fp} (cl-6.security checks it against the fingerprint Dinis states)`])
commit([OP.fp, OP2.fp], keys, DEV, 'the dev key adds a second operator')
r = go(); t('a dev key never suffices once the list is not empty', [r.errors.length, /never suffices/.test(r.errors[0] || '')], [1, true])
run(['reset', '-q', '--hard', 'HEAD~1'])
commit([OP.fp, OP2.fp], keys, OP, 'an operator adds a second operator')
t('an operator may change the list', go().errors, [])
commit([OP2.fp], keys, OP2, 'the second operator removes the first')
t('an operator listed in the parent may remove another', go().errors, [])
write([OP2.fp, DEV.fp], keys); t('an uncommitted edit is an error', go().errors.some(e => /not committed/.test(e)), true)
run(['checkout', '--', FILE])
t('no ssh-keygen is named', (checkOperatorKeys({ root: tmp, sshKeygen: 'ssh-keygen-not-there' }).errors[0] || '').includes('install openssh-client'), true)
fs.rmSync(tmp, { recursive: true, force: true }); fs.rmSync(keysDir, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_operator_keys: OK')
