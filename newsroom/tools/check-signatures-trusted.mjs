#!/usr/bin/env node
// check-signatures-trusted.mjs: run the signature check as it was at the anchor A, the newest commit a passing run
// verified (security@'s fourth ruling, 19 Nov 2026, 948820a7e): in CI, the sha of the last successful github-pages
// deployment, read with the run's own token; never a tag (until Dinis's tag ruleset, a tag counts only if it equals
// that sha), never the pushed tree's copy, never the trusted base's copy except on the push that adds the check.
//   ANCHOR=<sha> node newsroom/tools/check-signatures-trusted.mjs [--json]
// It fails closed: A missing or zero, A not an ancestor of HEAD, or A without the checker. The range checked is every
// commit since the trusted base up to HEAD, which holds A..HEAD, so a dropped push's commits are covered (control 8:
// by ancestry only).
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
const before = String(process.env.ANCHOR || '').trim()
if (!/^[0-9a-f]{40}$/.test(before) || /^0+$/.test(before)) fail('no anchor (ANCHOR: the last verified deployment\'s commit): nothing already verified to run the checker from')
try { git('cat-file', '-e', `${before}^{commit}`) } catch { fail(`the anchor ${before.slice(0, 9)} is not in this checkout`) }
try { git('merge-base', '--is-ancestor', before, 'HEAD') } catch { fail(`the anchor ${before.slice(0, 9)} is not an ancestor of HEAD (a force push)`) }
for (const f of FILES) { try { git('cat-file', '-e', `${before}:newsroom/tools/${f}`) } catch { fail(`the anchor ${before.slice(0, 9)} has no newsroom/tools/${f}: no trusted checker to run`) } }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sigtrusted-'))
for (const f of FILES) fs.writeFileSync(path.join(tmp, f), git('show', `${before}:newsroom/tools/${f}`))
fs.chmodSync(path.join(tmp, 'sshsig.mjs'), 0o755)
const r = spawnSync(process.execPath, [path.join(tmp, 'check-signatures.mjs'), ...process.argv.slice(2)], { cwd: ROOT, env: { ...process.env, CHECK_ROOT: ROOT }, stdio: 'inherit' })
fs.rmSync(tmp, { recursive: true, force: true })
if (!process.argv.includes('--json')) console.log(`signatures: checked with the checker of ${before.slice(0, 9)} (the anchor)`)
process.exit(r.status ?? 1)
