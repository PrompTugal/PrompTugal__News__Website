#!/usr/bin/env node
/* test_superseded_sigs.mjs: when a superseded key still vouches for an article signature (superseded.cjs), in a real
 * temporary git repository.   node newsroom/build/tests/test_superseded_sigs.mjs
 * Rule (security@ S1, 26 Nov 2026): by ancestry, never by a commit's time. The .sig must be, at HEAD, the same blob it was at the
 * first commit that has the key as superseded. Written by cl-6.dev@PrompTugal.dinis. Exit 1 on a failure. */
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
const { supersededVouches, findSupersedeCommit } = createRequire(import.meta.url)('../superseded.cjs')
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sup-'))
const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null' }
const git = (args, e = {}) => execFileSync('git', args, { cwd: dir, env: { ...env, ...e }, encoding: 'utf8' })
const put = (f, text) => { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), text) }
const keys = o => put('board/keys.json', JSON.stringify({ keys: o }, null, 1) + '\n')
const commit = (m, e) => { git(['add', '-A']); git(['-c', 'commit.gpgsign=false', 'commit', '-q', '-m', m], e); return git(['rev-parse', 'HEAD']).trim() }
let bad = 0
const t = (what, got, want) => { if (got !== want) { bad++; console.error(`FAIL ${what}: ${got}, want ${want}`) } }
git(['init', '-q', '-b', 'dev'])
const A = { id: 'a', status: 'active' }, B = { id: 'b', status: 'active' }, sup = id => ({ id, status: 'superseded' })
keys([A, B]); put('articles/old.md.sig', 'signed-by-a-while-active'); commit('1')
put('articles/other.md', 'x'); commit('2: nothing about keys')
keys([sup('a'), B]); const c3 = commit('3: a superseded')
keys([sup('a'), sup('b')]); commit('4: b superseded')
t('finds the commit that superseded a', findSupersedeCommit(git, 'a'), c3)
t('active key has none', findSupersedeCommit(git, 'zzz'), null)
const keyA = { id: 'a', status: 'superseded' }
t('a sig present and unchanged since', supersededVouches(git, keyA, 'articles/old.md.sig'), true)
t('a recorded superseded_in that agrees is kept', supersededVouches(git, { id: 'a', status: 'superseded', superseded_in: c3.slice(0, 9) }, 'articles/old.md.sig'), true)
// a new .sig after the supersede, made with a BACKDATED commit: the date is a lie, ancestry is not
put('articles/new.md.sig', 'forged-with-a-leaked-superseded-key')
commit('5: new sig, backdated', { GIT_COMMITTER_DATE: '2026-11-01T00:00:00Z', GIT_AUTHOR_DATE: '2026-11-01T00:00:00Z' })
t('a new sig with a backdated commit is refused', supersededVouches(git, keyA, 'articles/new.md.sig'), false)
// a changed old .sig, backdated
put('articles/old.md.sig', 'changed-later'); commit('6: old sig changed, backdated', { GIT_COMMITTER_DATE: '2026-11-01T00:00:00Z' })
t('a changed sig is refused', supersededVouches(git, keyA, 'articles/old.md.sig'), false)
// dirty, absent, not superseded, no superseded commit, a note that disagrees
put('articles/old.md.sig', 'dirty'); t('a dirty sig is refused', supersededVouches(git, keyA, 'articles/old.md.sig'), false); git(['checkout', '--', 'articles/old.md.sig'])
t('an absent sig is refused', supersededVouches(git, keyA, 'articles/none.md.sig'), false)
t('an active key is not handled here', supersededVouches(git, { id: 'a', status: 'active' }, 'articles/new.md.sig'), false)
t('a key with no supersede commit is refused', supersededVouches(git, { id: 'ghost', status: 'superseded' }, 'articles/new.md.sig'), false)
t('a superseded_in that disagrees is refused', supersededVouches(git, { id: 'a', status: 'superseded', superseded_in: 'deadbeef' }, 'articles/new.md.sig'), false)
// b was superseded at commit 4; its sig committed at 7 after that is refused, one from before 4 is kept
const keyB = { id: 'b', status: 'superseded' }
put('articles/b-before.md.sig', 'b'); // not committed before 4: refused
commit('7: b sig after supersede')
t('a sig added after the key was superseded is refused', supersededVouches(git, keyB, 'articles/b-before.md.sig'), false)
fs.rmSync(dir, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_superseded_sigs: OK')
