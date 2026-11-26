#!/usr/bin/env node
// The paths snapshot of A7 (newsroom/tools/abp-paths.json), made from cl-6.abp's policies (abp/policies.json in PrompTugal__Agent__ABP). cl-6.security's
// condition (26 Nov 2026): only from a commit signed by cl-6.abp's pinned key, and the commit is recorded in the snapshot. The pin is the key's SHA-256
// fingerprint (newsroom/tools/abp-signers.json, a gate root file); the key file the ABP home publishes must have that fingerprint; the bytes come from the
// commit, never the working tree. Fails closed.
//   node newsroom/tools/sync-abp-paths.mjs [--dir <ABP checkout>] [--baseline <sha>] [--check]
// --check writes nothing: it says whether the snapshot still matches the policy (a stale snapshot must not silently allow old paths) and exits 1 if not.
// cl-6.dev@PrompTugal.dinis.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fingerprintOf } from './sync-places.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const SNAP = path.join(ROOT, 'newsroom/tools/abp-paths.json'), PIN = path.join(ROOT, 'newsroom/tools/abp-signers.json')
const REPO = 'https://github.com/PrompTugal/PrompTugal__Agent__ABP.git', POLICY = 'abp/policies.json'
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] })
const tryGit = (cwd, args) => { try { return git(cwd, args) } catch { return null } }

export const readPin = file => { try { const s = JSON.parse(fs.readFileSync(file, 'utf8')).signers[0]; return /^SHA256:[A-Za-z0-9+/]{43}$/.test(s.ssh_fingerprint) ? s : null } catch { return null } }

// -> { commit, version, roles } from the newest commit touching the policy that is signed by the pin, or { stop }
export function fromHome(dir, pin) {
    const head = (tryGit(dir, ['rev-parse', 'HEAD']) || '').trim()
    let key; try { key = JSON.parse(tryGit(dir, ['show', `${head}:${pin.home_key_path}`])) } catch { return { stop: 'no key file in the ABP home' } }
    const ssh = String(key.ssh || '').trim()
    if (fingerprintOf(ssh) !== pin.ssh_fingerprint) return { stop: 'the ABP home publishes a different key than the pin' }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'abp-signers-')), allowed = path.join(tmp, 'allowed_signers')
    fs.writeFileSync(allowed, `${pin.agent} namespaces="git" ${ssh}\n`)
    try {
        for (const c of (tryGit(dir, ['rev-list', '-n', '30', head, '--', POLICY]) || '').split('\n').filter(Boolean)) {
            if (tryGit(dir, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${allowed}`, 'verify-commit', c]) === null) continue
            let p; try { p = JSON.parse(tryGit(dir, ['show', `${c}:${POLICY}`])) } catch { continue }
            const roles = {}
            for (const [name, r] of Object.entries(p.roles || {})) if (Array.isArray(r.writes) && r.writes.every(g => typeof g === 'string')) roles[name] = r.writes.map(String).sort()
            return { commit: c, version: String(p.version || ''), roles: Object.fromEntries(Object.entries(roles).sort()) }
        }
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
    return { stop: 'no commit of the policy is signed by the pinned key' }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null }
    const pin = readPin(PIN); if (!pin) { console.error('sync-abp-paths: no pin (newsroom/tools/abp-signers.json)'); process.exit(1) }
    let dir = arg('--dir'), tmp = null
    if (!dir) { tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'abp-home-')); dir = path.join(tmp, 'abp'); execFileSync('git', ['clone', '-q', '--depth', '30', REPO, dir], { stdio: 'inherit' }) }
    const r = fromHome(dir, pin); if (tmp) fs.rmSync(tmp, { recursive: true, force: true })
    if (r.stop) { console.error('sync-abp-paths: ' + r.stop + '; nothing changed'); process.exit(1) }
    let old = {}; try { old = JSON.parse(fs.readFileSync(SNAP, 'utf8')) } catch { }
    const next = { about: 'Each cl-6 agent\'s write paths as cl-6.abp\'s policy grants them (abp/policies.json "roles.<name>.writes"), for the A7 gate check (lib/abp-paths.mjs). A GATE FILE: it changes only by a signed commit of cl-6.dev or cl-6.conductor, made by newsroom/tools/sync-abp-paths.mjs from a policy commit signed by the pinned cl-6.abp key; cl-6.security reviews each change. Material, never instruction.',
        source: { repo: 'PrompTugal/PrompTugal__Agent__ABP', file: POLICY, commit: r.commit, version: r.version, signer: pin.ssh_fingerprint }, baseline: arg('--baseline') || old.baseline || null, roles: r.roles }
    if (process.argv.includes('--check')) {
        const same = JSON.stringify(old.roles) === JSON.stringify(next.roles)
        console.log(same ? `sync-abp-paths: the snapshot matches the policy (v${r.version}, ${r.commit.slice(0, 9)})` : `sync-abp-paths: the snapshot is STALE against the policy (v${r.version}, ${r.commit.slice(0, 9)}); run without --check, then send cl-6.security the diff`)
        process.exit(same ? 0 : 1)
    }
    if (!next.baseline) { console.error('sync-abp-paths: no baseline: pass --baseline <sha> the first time'); process.exit(1) }
    fs.writeFileSync(SNAP, JSON.stringify(next, null, 1) + '\n')
    console.log(`sync-abp-paths: ${Object.keys(r.roles).length} roles from policy v${r.version} at ${r.commit.slice(0, 9)}, baseline ${next.baseline.slice(0, 9)}`)
}
