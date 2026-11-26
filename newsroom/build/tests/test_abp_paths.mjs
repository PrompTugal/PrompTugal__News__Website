#!/usr/bin/env node
/* test_abp_paths.mjs: A7, a commit stays in its signer's ABP paths (cl-6.security's five points), in a real temporary repository with real SSH-signed commits.
 * node newsroom/build/tests/test_abp_paths.mjs */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { checkAbpPaths, covers, globRe, roleOf } from '../lib/abp-paths.mjs'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'abp-paths-test-'))
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_AUTHOR_NAME: 'GitHub Actions', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 'GitHub Actions', GIT_COMMITTER_EMAIL: 't@t' }
const run = a => execFileSync('git', a, { cwd: tmp, encoding: 'utf8', env })
const keys = fs.mkdtempSync(path.join(os.tmpdir(), 'abp-paths-keys-'))   // outside the repository, so a key is never a change
const key = n => { const f = path.join(keys, n); execFileSync('ssh-keygen', ['-q', '-t', 'ecdsa', '-b', '256', '-N', '', '-f', f]); return { file: f, pub: fs.readFileSync(f + '.pub', 'utf8').trim().split(' ').slice(0, 2).join(' ') } }
const KA = key('a'), KB = key('b'), KX = key('x')
const E = (id, agent, k) => ({ id, agent, status: 'active', ssh: k.pub })
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }
const put = files => { for (const [f, c] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true }); fs.writeFileSync(path.join(tmp, f), c) } }
const commit = (files, k, msg) => { put(files); run(['add', '-A']); run(k ? ['-c', 'gpg.format=ssh', '-c', `user.signingkey=${k.file}`, 'commit', '-S', '-q', '-m', msg] : ['-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg]); return run(['rev-parse', 'HEAD']).trim() }
const keysJson = keys => ({ 'board/keys.json': JSON.stringify({ keys }) })
const A = E('a-1', 'cl-6.a@PrompTugal.dinis', KA), B = E('b-1', 'cl-6.b@PrompTugal.dinis', KB)

run(['init', '-q', '-b', 'dev'])
const base = commit({ ...keysJson([A, B]), 'content/x.md': 'x', 'REALITY.md': 'r', 'newsroom/build/version.txt': '1', 'newsroom/versions.json': '[]' }, KA, 'base')
const snap = { baseline: base, roles: { 'cl-6.a': ['content/**', 'articles/*.sig', 'board/keys.json'] } }
const go = () => checkAbpPaths({ root: tmp, snapshot: snap })
t('nothing after the baseline: nothing reported', go(), { violations: [], noPolicy: [], unsigned: [] })
commit({ 'content/y.md': 'y' }, KA, 'a writes content')
t('a signer inside its paths passes', go(), { violations: [], noPolicy: [], unsigned: [] })
commit({ 'articles/s.md.sig': 's' }, KA, 'a writes a sig')
t('* does not cross a folder, a file directly under articles/ passes', go().violations, [])
commit({ 'newsroom/build/x.mjs': 'x' }, KA, 'a writes code')
let r = go(); t('a file outside the policy is a violation, named', [r.violations.length, /cl-6\.a changed 1 file outside its policy \(first newsroom\/build\/x\.mjs\)/.test(r.violations[0] || '')], [1, true])
commit({ 'content/z.md': 'z' }, KB, 'b has no policy')
r = go(); t('a signer with no policy is its own category, not a pass and not a violation', [r.violations.length, r.noPolicy.length, /cl-6\.b@PrompTugal\.dinis has no policy/.test(r.noPolicy[0] || '')], [1, 1, true])
commit({ 'content/w.md': 'w' }, KX, 'a stranger')
r = go(); t('a key not in board/keys.json is reported as unsigned', [r.unsigned.length, /not signed by an active key/.test(r.unsigned[0] || '')], [1, true])
commit({ 'content/u.md': 'u' }, null, 'unsigned, GitHub Actions')
t('an unsigned commit with another change is reported even under the name GitHub Actions', go().unsigned.length, 2)
commit({ 'REALITY.md': 'r2', 'newsroom/build/version.txt': '2', 'newsroom/versions.json': '[1]' }, null, 'site v0.0.2')
t('an unsigned commit of exactly the release set is exempt', go().unsigned.length, 2)
commit({ 'REALITY.md': 'r3', 'content/sneak.md': 's' }, null, 'site v0.0.3: release set plus a page')
t('an unsigned commit of the release set plus anything else is reported', go().unsigned.length, 3)
// a first publication: only board/keys.json changes, signed by the new key
const KN = key('n')
commit(keysJson([A, B, E('n-1', 'cl-6.n@PrompTugal.dinis', KN)]), KN, 'n publishes its first key')
t('a commit that only publishes a key may be signed by that key (no policy for n: its own category)', [go().unsigned.length, go().noPolicy.length], [3, 2])
// a merge is judged by its first parent diff under its own signer
run(['checkout', '-q', '-b', 'side']); commit({ 'content/side.md': 's' }, KA, 'side work'); run(['checkout', '-q', 'dev'])
commit({ 'content/main.md': 'm' }, KA, 'main work')
run(['-c', 'gpg.format=ssh', '-c', `user.signingkey=${KB.file}`, 'merge', '-S', '--no-ff', '-q', '-m', 'merge by b', 'side'])
r = go(); t('a merge is judged under its own signer (b has no policy) and its first-parent diff', r.noPolicy.some(x => /cl-6\.b@PrompTugal\.dinis has no policy in the snapshot \(1 file\)/.test(x)), true)
// helpers
t('glob: ** crosses folders', [covers(['desks/j/**'], 'desks/j/a/b.json'), covers(['desks/j/**'], 'desks/k/a.json')], [true, false])
t('glob: * stays in a folder and the dot is literal', [globRe('articles/*.sig').test('articles/a.md.sig'), globRe('articles/*.sig').test('articles/x/a.sig'), globRe('a.b').test('axb')], [true, false, false])
t('role is the agent without the domain', roleOf('cl-6.dev@PrompTugal.dinis'), 'cl-6.dev')
t('a missing baseline is reported', checkAbpPaths({ root: tmp, snapshot: { baseline: 'deadbeef'.repeat(5), roles: {} } }).violations.length, 1)
t('no ssh-keygen is named', (checkAbpPaths({ root: tmp, snapshot: snap, sshKeygen: 'ssh-keygen-not-there' }).violations[0] || '').includes('install openssh-client'), true)
fs.rmSync(tmp, { recursive: true, force: true }); fs.rmSync(keys, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_abp_paths: OK')
