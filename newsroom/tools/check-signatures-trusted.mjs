#!/usr/bin/env node
// check-signatures-trusted.mjs: run the signature check as it was at the newest release, never from the pushed tree
// (security@'s control 7, 19 Nov 2026): a push that weakens the checker and adds an unsigned commit still fails.
// It takes newsroom/tools/check-signatures.mjs, sshsig.mjs and signing.json from the newest tag v*.*.* that has all three
// (git show <tag>:<path>, into a temporary folder) and runs that copy against this repository (CHECK_ROOT).
//   node newsroom/tools/check-signatures-trusted.mjs [<range>] [--json]
// Limit (security@'s): the workflow file itself still comes from the pushed tree; branch protection closes that.
// dev@PrompTugal.dinis.
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = process.env.CHECK_ROOT ? path.resolve(process.env.CHECK_ROOT) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const git = (...a) => execFileSync('git', a, { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
const FILES = ['check-signatures.mjs', 'sshsig.mjs', 'signing.json']
const tags = git('tag', '--list', 'v*.*.*', '--sort=-v:refname').toString().split('\n').filter(Boolean)
const tag = tags.find(t => FILES.every(f => { try { git('cat-file', '-e', `${t}:newsroom/tools/${f}`); return true } catch { return false } }))
if (!tag) { console.log('FAIL signatures: no release tag carries the checker yet (nothing trusted to run)'); process.exit(1) }
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sigtrusted-'))
for (const f of FILES) fs.writeFileSync(path.join(tmp, f), git('show', `${tag}:newsroom/tools/${f}`))
fs.chmodSync(path.join(tmp, 'sshsig.mjs'), 0o755)
const r = spawnSync(process.execPath, [path.join(tmp, 'check-signatures.mjs'), ...process.argv.slice(2)], { cwd: ROOT, env: { ...process.env, CHECK_ROOT: ROOT }, stdio: 'inherit' })
fs.rmSync(tmp, { recursive: true, force: true })
if (!process.argv.includes('--json')) console.log(`signatures: checked with the checker of ${tag}`)
process.exit(r.status ?? 1)
