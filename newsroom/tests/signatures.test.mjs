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
fs.writeFileSync(path.join(R, 'newsroom/tools/signing.json'), JSON.stringify({ start: base, trusted_base: base, enforce: 'enrolled', }))
sh(R, 'add', '-A'); sh(R, 'commit', '-q', '-S', '-m', msg('the checker')); sh(R, 'tag', 'v0.0.1')
const run = (tool, cwd = R, env = {}) => spawnSync(process.execPath, [path.join(cwd, 'newsroom/tools', tool)], { cwd, encoding: 'utf8', env: { ...process.env, ...env } })
const C1 = sh(R, 'rev-parse', 'HEAD').trim()   // the commit that adds the checker: BEFORE for the pushes below
const trusted = (anchor = C1) => run('check-signatures-trusted.mjs', R, { ANCHOR: anchor })
const reset = () => sh(R, 'reset', '-q', '--hard', C1)
fs.writeFileSync(path.join(R, 'a.txt'), 'a'); sh(R, 'add', 'a.txt'); sh(R, 'commit', '-q', '-S', '-m', msg('a good signed change'))
ok(trusted().status === 0, 'good signed commits pass, run from the anchor')
reset()
// control 6: an orphan signed with its own key, merged in; and a backdated one (control 8: never by date)
for (const [label, env] of [['an orphan signed with its own key, merged in, fails', {}], ['a backdated orphan, merged in, fails', { GIT_COMMITTER_DATE: '2000-01-01T00:00:00Z', GIT_AUTHOR_DATE: '2000-01-01T00:00:00Z' }]]) {
    sh(R, 'checkout', '-q', '--orphan', 'stray'); sh(R, 'rm', '-rq', '--cached', '.'); fs.writeFileSync(path.join(R, 'x.txt'), 'x'); sh(R, 'add', 'x.txt')
    execFileSync('git', ['commit', '-q', '-S', '-m', msg('an orphan')], { cwd: R, env: { ...process.env, ...env }, stdio: 'ignore' })
    sh(R, 'checkout', '-q', '-f', 'dev'); sh(R, 'merge', '-q', '-S', '--allow-unrelated-histories', '-m', msg('merge an unrelated history'), 'stray')
    const r = trusted(); ok(r.status !== 0 && /orphan/.test(r.stdout), label); reset(); sh(R, 'branch', '-q', '-D', 'stray')
}
// control 6: a shallow clone is refused
const S = path.join(T, 'shallow'); sh(T, 'clone', '-q', '--depth', '1', `file://${R}`, S)
let r = spawnSync(process.execPath, [path.join(S, 'newsroom/tools/check-signatures.mjs')], { cwd: S, encoding: 'utf8' }); ok(r.status !== 0 && /shallow/.test(r.stdout), 'a shallow checkout is refused')
// control 7: weaken the checker in the tree and add an unsigned commit
fs.writeFileSync(path.join(R, 'newsroom/tools/check-signatures.mjs'), "console.log('signatures: OK'); process.exit(0)\n")
fs.writeFileSync(path.join(R, 'y.txt'), 'y'); sh(R, 'add', '-A'); sh(R, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg('weaken the checker, unsigned'))
ok(run('check-signatures.mjs').status === 0, '(the weakened tree copy passes, as expected)')
r = trusted(); ok(r.status !== 0 && /not signed|unsigned/.test(r.stdout), 'run from the anchor, a push that weakens the checker still fails'); reset()
// control 8: a commit that removes the checker and adds an unsigned change
fs.rmSync(path.join(R, 'newsroom/tools/check-signatures.mjs')); fs.writeFileSync(path.join(R, 'z.txt'), 'z'); sh(R, 'add', '-A'); sh(R, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg('remove the checker, unsigned'))
r = trusted(); ok(r.status !== 0 && /not signed|unsigned/.test(r.stdout), 'a commit that removes the checker and adds an unsigned change fails'); reset()
// control 7: fails closed
fs.writeFileSync(path.join(R, 'b.txt'), 'b'); sh(R, 'add', 'b.txt'); sh(R, 'commit', '-q', '-S', '-m', msg('another change'))
ok(/no newsroom\/tools/.test(trusted(base).stdout) && trusted(base).status !== 0, 'an anchor without a copy of the checker fails')
ok(trusted('0'.repeat(40)).status !== 0, 'a missing (zero) anchor fails')
sh(R, 'checkout', '-q', '-b', 'side', C1); fs.writeFileSync(path.join(R, 'c.txt'), 'c'); sh(R, 'add', 'c.txt'); sh(R, 'commit', '-q', '-S', '-m', msg('on another line')); const side = sh(R, 'rev-parse', 'HEAD').trim(); sh(R, 'checkout', '-q', 'dev')
r = trusted(side); ok(r.status !== 0 && /not an ancestor/.test(r.stdout), 'an anchor not an ancestor of HEAD (a force push) fails')
// the fourth ruling: an unsigned commit from a dropped run (between A and the last push) fails
sh(R, 'checkout', '-q', 'dev'); reset()
fs.writeFileSync(path.join(R, 'd.txt'), 'd'); sh(R, 'add', 'd.txt'); sh(R, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg('pushed in a run that was dropped, unsigned'))
const dropped = sh(R, 'rev-parse', 'HEAD').trim()
fs.writeFileSync(path.join(R, 'e.txt'), 'e'); sh(R, 'add', 'e.txt'); sh(R, 'commit', '-q', '-S', '-m', msg('the next push, signed'))
r = trusted(C1); ok(r.status !== 0 && r.stdout.includes(dropped.slice(0, 9)), 'an unsigned commit from a dropped run (between A and the last push) fails')
// a pushed tag on an unverified commit is never used: the launcher reads only ANCHOR
sh(R, 'tag', '-f', 'v9.9.9', dropped); r = run('check-signatures-trusted.mjs', R, { ANCHOR: '' }); ok(r.status !== 0 && /no anchor/.test(r.stdout), 'a pushed tag is not used as the anchor, and a missing anchor fails')
// control 9: a checker that is a symlink in the anchor's tree is refused
reset(); fs.rmSync(path.join(R, 'newsroom/tools/signing.json')); fs.symlinkSync('/etc/hostname', path.join(R, 'newsroom/tools/signing.json')); sh(R, 'add', '-A'); sh(R, 'commit', '-q', '-S', '-m', msg('the config as a symlink'))
const sym = sh(R, 'rev-parse', 'HEAD').trim(); r = trusted(sym); ok(r.status !== 0 && /symlink/.test(r.stdout), 'an anchor whose checker path is a symlink is refused')
// control 9: git's replace objects cannot swap a commit under the check
reset(); fs.writeFileSync(path.join(R, 'f.txt'), 'f'); sh(R, 'add', 'f.txt'); sh(R, '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', msg('unsigned, to be hidden'))
const bad = sh(R, 'rev-parse', 'HEAD').trim(); sh(R, 'replace', bad, C1)
r = trusted(C1); ok(r.status !== 0 && r.stdout.includes(bad.slice(0, 9)), 'a replace object does not hide an unsigned commit'); sh(R, 'replace', '-d', bad)
fs.rmSync(T, { recursive: true, force: true })
if (fails) { console.log(`${fails} failed`); process.exit(1) } else console.log('signatures.test: all passed')
