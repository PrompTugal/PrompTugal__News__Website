// The signature check's controls 6 and 7 (security@, 19 Nov 2026), in a throwaway repository:
//   a good signed commit passes; an orphan signed with its own key fails (6); a merged unrelated history fails (6);
//   a shallow clone is refused (6); a push that weakens the checker and adds an unsigned commit still fails when the
//   checker is run as released (7). node newsroom/tests/signatures.test.mjs   dev@PrompTugal.dinis.
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../tools')
const T = fs.mkdtempSync(path.join(os.tmpdir(), 'sigtest-')), R = path.join(T, 'repo'), K = path.join(T, 'key')
const sh = (cwd, ...a) => execFileSync('git', a, { cwd, stdio: ['ignore', 'pipe', 'pipe'] }).toString()
const AG = 'tester@PrompTugal.dinis', SESS = 'https://claude.ai/code/session_TEST'
const msg = s => `${s}\n\nAgent: ${AG}\nClaude-Session: ${SESS}`
let fails = 0; const ok = (c, m) => { console.log(`${c ? 'ok  ' : 'FAIL'} ${m}`); if (!c) fails++ }
execFileSync(process.execPath, [path.join(SRC, 'sshsig.mjs'), 'keygen', K, AG])
fs.mkdirSync(path.join(R, 'board'), { recursive: true }); fs.mkdirSync(path.join(R, 'newsroom/tools'), { recursive: true })
sh(R, 'init', '-q', '-b', 'dev'); for (const [k, v] of [['user.name', 't'], ['user.email', 't@x'], ['gpg.format', 'ssh'], ['gpg.ssh.program', path.join(SRC, 'sshsig.mjs')], ['user.signingkey', K]]) sh(R, 'config', k, v)
const pub = fs.readFileSync(K + '.pub', 'utf8').trim().split(/\s+/).slice(0, 2).join(' ')
fs.writeFileSync(path.join(R, 'board/keys.json'), JSON.stringify({ keys: [{ id: 'tester', agent: AG, status: 'active', ssh: pub, session: SESS }] }, null, 2))
sh(R, 'add', '-A'); sh(R, 'commit', '-q', '-S', '-m', msg('base: the key'))
const base = sh(R, 'rev-parse', 'HEAD').trim()
for (const f of ['check-signatures.mjs', 'sshsig.mjs']) fs.copyFileSync(path.join(SRC, f), path.join(R, 'newsroom/tools', f))
fs.copyFileSync(path.join(SRC, 'check-signatures-trusted.mjs'), path.join(R, 'newsroom/tools/check-signatures-trusted.mjs'))
fs.writeFileSync(path.join(R, 'newsroom/tools/signing.json'), JSON.stringify({ start: base, trusted_base: base, enforce: 'enrolled', exempt: { subject: '^site v\\d+\\.\\d+\\.\\d+: ' } }))
sh(R, 'add', '-A'); sh(R, 'commit', '-q', '-S', '-m', msg('the checker')); sh(R, 'tag', 'v0.0.1')
const run = (tool, cwd = R) => spawnSync(process.execPath, [path.join(cwd, 'newsroom/tools', tool)], { cwd, encoding: 'utf8' })
ok(run('check-signatures.mjs').status === 0, 'good signed commits pass')
// control 6: an orphan, signed with its own key, merged in
sh(R, 'checkout', '-q', '--orphan', 'stray'); fs.writeFileSync(path.join(R, 'x.txt'), 'x'); sh(R, 'add', 'x.txt'); sh(R, 'commit', '-q', '-S', '-m', msg('an orphan'))
sh(R, 'checkout', '-q', 'dev'); sh(R, 'merge', '-q', '-S', '--allow-unrelated-histories', '-m', msg('merge an unrelated history'), 'stray')
let r = run('check-signatures.mjs'); ok(r.status !== 0 && /orphan/.test(r.stdout), 'an orphan signed with its own key, merged in, fails')
sh(R, 'reset', '-q', '--hard', 'v0.0.1')
// control 6: a shallow clone is refused
const S = path.join(T, 'shallow'); sh(T, 'clone', '-q', '--depth', '1', `file://${R}`, S)
r = run('check-signatures.mjs', S); ok(r.status !== 0 && /shallow/.test(r.stdout), 'a shallow checkout is refused')
// control 7: weaken the checker in the tree and add an unsigned commit
fs.writeFileSync(path.join(R, 'newsroom/tools/check-signatures.mjs'), "console.log('signatures: OK'); process.exit(0)\n")
fs.writeFileSync(path.join(R, 'y.txt'), 'y'); sh(R, 'add', '-A'); sh(R, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg('weaken the checker, unsigned'))
ok(run('check-signatures.mjs').status === 0, '(the weakened tree copy passes, as expected)')
r = run('check-signatures-trusted.mjs'); ok(r.status !== 0 && /not signed|unsigned/.test(r.stdout), 'run as released, the weakened push still fails')
fs.rmSync(T, { recursive: true, force: true })
if (fails) { console.log(`${fails} failed`); process.exit(1) } else console.log('signatures.test: all passed')
