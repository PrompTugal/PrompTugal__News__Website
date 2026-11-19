#!/usr/bin/env node
// check-signatures-trusted.mjs: run the signature check as it was at BEFORE, the commit dev pointed to before this
// push, which was already checked (security@'s control 7, third ruling, 19 Nov 2026). Never the pushed tree's copy, never
// a tag, never the trusted base's copy except on the one push that adds the check (where BEFORE is the base).
//   BEFORE=<sha> node newsroom/tools/check-signatures-trusted.mjs [--json]      (CI: github.event.before)
// It fails closed: BEFORE missing or all zeros (a new branch), BEFORE not an ancestor of HEAD (a force push), or BEFORE
// without the checker. The range checked is everything since the trusted base up to HEAD (control 8: by ancestry only).
// Limit (security@'s): the workflow file itself comes from the pushed tree; branch protection closes that. dev@PrompTugal.dinis.
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const git = (...a) => execFileSync('git', a, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
const fail = m => { console.log('FAIL signatures: ' + m); process.exit(1) }
const FILES = ['check-signatures.mjs', 'sshsig.mjs', 'signing.json']
const before = String(process.env.BEFORE || '').trim()
if (!/^[0-9a-f]{40}$/.test(before) || /^0+$/.test(before)) fail('no BEFORE commit (a new branch, or none given): nothing already checked to run the checker from')
try { git('cat-file', '-e', `${before}^{commit}`) } catch { fail(`BEFORE ${before.slice(0, 9)} is not in this checkout`) }
try { git('merge-base', '--is-ancestor', before, 'HEAD') } catch { fail(`BEFORE ${before.slice(0, 9)} is not an ancestor of HEAD (a force push)`) }
for (const f of FILES) { try { git('cat-file', '-e', `${before}:newsroom/tools/${f}`) } catch { fail(`BEFORE ${before.slice(0, 9)} has no newsroom/tools/${f}: no trusted checker to run`) } }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sigtrusted-'))
for (const f of FILES) fs.writeFileSync(path.join(tmp, f), git('show', `${before}:newsroom/tools/${f}`))
fs.chmodSync(path.join(tmp, 'sshsig.mjs'), 0o755)
const r = spawnSync(process.execPath, [path.join(tmp, 'check-signatures.mjs'), ...process.argv.slice(2)], { cwd: ROOT, env: { ...process.env, CHECK_ROOT: ROOT }, stdio: 'inherit' })
fs.rmSync(tmp, { recursive: true, force: true })
if (!process.argv.includes('--json')) console.log(`signatures: checked with the checker of ${before.slice(0, 9)} (BEFORE)`)
process.exit(r.status ?? 1)
