#!/usr/bin/env node
/* sync-places.mjs: bring the place files from the places' homes (PrompTugal__Agent__Place__<Name>, branch dev) into data/by-place/,
 * trusting only commits signed by the one key pinned in newsroom/tools/place-signers.json.
 *
 *   node newsroom/tools/sync-places.mjs [--only id,id] [--dry] [--cache dir]
 *
 * The rules (cl-6.security, 26 November 2026; decisions of cl-6.dev's home, site/factory/dinis-cruz/account-f/decisions.md):
 *  1. The trust is the PIN, never a key read from a home: a home's site/keys/cl-6.places.json must equal the pinned ssh string
 *     byte for byte, or that place is stopped and reported (never followed).
 *  2. A file's bytes come from a commit that `git verify-commit` accepts against the pin alone AND that carries the trailer
 *     "Agent: cl-6.places@PrompTugal.dinis": taken with `git show <sha>:<path>`, never from a working tree. A newer commit that is
 *     unsigned, signed by another key, a bot's or without the trailer is skipped; the last good version is taken, or nothing.
 *  3. Fail closed: no pin, no key in the home, no good version: nothing is written for that place, and it is reported.
 *  4. Nothing is deleted. A changed place file loses its old .json.sig (made by an old site key over the old bytes, so it no longer
 *     verifies); the provenance is newsroom/tools/place-sources.json (commit, signer, time), written by this tool.
 * The result is an ordinary working-tree change: commit it and release it with newsroom/tools/release.sh (the gate checks every file).
 * The pin file changes only by a signed commit of the dev agent and cl-6.security's review; this tool never writes it. */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const TRAILER = /^Agent: cl-6\.places@PrompTugal\.dinis$/m
const HOME_URL = /^https:\/\/github\.com\/PrompTugal\/PrompTugal__Agent__Place__[A-Za-z0-9-]+$/

const git = (cwd, args, env = {}) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_LFS_SKIP_SMUDGE: '1', ...env } })
const tryGit = (cwd, args, env) => { try { return git(cwd, args, env) } catch { return null } }

// the pinned signer, or null (fail closed)
export function readPin(file = path.join(ROOT, 'newsroom/tools/place-signers.json')) {
    let j; try { j = JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null }
    const s = (j.signers || [])[0]
    return s && s.ssh && s.agent && /^ecdsa-sha2-nistp256 \S+$/.test(s.ssh) ? { ssh: s.ssh, agent: s.agent, home_key_path: s.home_key_path || 'site/keys/cl-6.places.json', fingerprint: s.ssh_fingerprint || '' } : null
}

// a home's own key file, read at `head`, must equal the pin byte for byte
export function homeKeyMatches(dir, head, pin) {
    const raw = tryGit(dir, ['show', `${head}:${pin.home_key_path}`]); if (raw == null) return { ok: false, why: 'no key file in the home' }
    let k; try { k = JSON.parse(raw) } catch { return { ok: false, why: 'the home key file is not JSON' } }
    return String(k.ssh || '').trim() === pin.ssh ? { ok: true } : { ok: false, why: 'the home publishes a different key than the pin' }
}

// the newest version of `file` in a commit that is signed by the pin and carries the trailer; skipped commits are counted
export function signedVersion(dir, head, pin, file, depth = 30) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'places-signers-'))
    const allowed = path.join(tmp, 'allowed_signers')
    fs.writeFileSync(allowed, `${pin.agent} namespaces="git" ${pin.ssh}\n`)
    try {
        const shas = (tryGit(dir, ['rev-list', '-n', String(depth), head, '--', file]) || '').split('\n').filter(Boolean)
        let skipped = 0
        for (const c of shas) {
            const good = tryGit(dir, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${allowed}`, 'verify-commit', c]) !== null   // the verifier is named here, not taken from whatever git config is around
            const msg = tryGit(dir, ['show', '-s', '--format=%B', c]) || ''
            if (good && TRAILER.test(msg)) { const bytes = tryGit(dir, ['show', `${c}:${file}`]); if (bytes != null) return { commit: c, bytes, skipped } }
            skipped++
        }
        return null
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
}

// one home: returns { id, wrote: [...], skipped: [...], stop: '...'|null }
export function syncHome({ dir, id, pin, siteRoot = ROOT, validate = null, dry = false }) {
    const out = { id, wrote: [], same: [], notes: [], stop: null }
    const head = (tryGit(dir, ['rev-parse', 'HEAD']) || '').trim()
    if (!head) { out.stop = 'no commit in the home'; return out }
    const key = homeKeyMatches(dir, head, pin); if (!key.ok) { out.stop = key.why; return out }
    out.head = head
    for (const rel of [`data/by-place/${id}.json`, `data/by-place/now/${id}.json`]) {
        if (tryGit(dir, ['cat-file', '-e', `${head}:${rel}`]) === null) continue   // the home has no such file (a now/ file only the Algarve has)
        const v = signedVersion(dir, head, pin, rel)
        if (!v) { out.notes.push(`${rel}: no commit signed by the pin with the trailer; nothing written`); continue }
        let j; try { j = JSON.parse(v.bytes) } catch { out.notes.push(`${rel}: not JSON at ${v.commit.slice(0, 9)}; nothing written`); continue }
        if (rel.indexOf('/now/') < 0 && j.id !== id) { out.notes.push(`${rel}: id is ${j.id}, not ${id}; nothing written`); continue }
        const errs = validate ? validate(j, rel) : []
        if (errs.length) { out.notes.push(`${rel}: ${errs.slice(0, 3).join('; ')}; nothing written`); continue }
        const dest = path.join(siteRoot, rel), cur = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null
        if (cur === v.bytes) { out.same.push(rel); continue }
        if (!dry) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, v.bytes); if (fs.existsSync(dest + '.sig')) fs.rmSync(dest + '.sig') }
        out.wrote.push({ file: rel, commit: v.commit, skipped: v.skipped })
    }
    return out
}

// ---- the command ----
async function main() {
    const a = process.argv.slice(2), has = f => a.includes(f), val = f => { const i = a.indexOf(f); return i >= 0 ? a[i + 1] : '' }
    const dry = has('--dry'), cache = val('--cache') || path.join(os.tmpdir(), 'place-homes'), only = val('--only') ? val('--only').split(',') : null
    const pin = readPin(); if (!pin) { console.error('sync-places: no pin in newsroom/tools/place-signers.json; nothing synced (fail closed)'); process.exit(2) }
    const { loadSchemas, validate: check } = await import('../build/lib/schema.mjs')
    const reg = loadSchemas(path.join(ROOT, 'data/schemas'))
    const validate = (j, rel) => check(j, rel.includes('/now/') ? 'by-place-now.schema.json' : 'by-place.schema.json', reg)
    const places = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/by-place/places.json'), 'utf8')).places
    fs.mkdirSync(cache, { recursive: true })
    const fetchHome = url => { const d = path.join(cache, url.split('/').pop()); if (fs.existsSync(path.join(d, '.git'))) { git(d, ['fetch', '-q', '--depth', '50', 'origin', 'dev']); git(d, ['checkout', '-q', '--detach', 'FETCH_HEAD']) } else git(cache, ['clone', '-q', '--depth', '50', '--branch', 'dev', '--single-branch', url, d]); return d }
    // each place's home: the registry in the Algarve home lists them; only a PrompTugal/PrompTugal__Agent__Place__<Name> URL is accepted
    const regDir = fetchHome('https://github.com/PrompTugal/PrompTugal__Agent__Place__Algarve')
    const regHead = git(regDir, ['rev-parse', 'HEAD']).trim()
    if (!homeKeyMatches(regDir, regHead, pin).ok) { console.error('sync-places: the Algarve home does not publish the pinned key; stopped'); process.exit(2) }
    const reg2 = signedVersion(regDir, regHead, pin, 'site/factory/dinis-cruz/account-f/places.json')
    if (!reg2) { console.error('sync-places: the registry of homes has no signed version; stopped'); process.exit(2) }
    const homes = new Map(JSON.parse(reg2.bytes).places.filter(p => HOME_URL.test(p.home || '')).map(p => [p.id, p.home]))
    const sources = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'newsroom/tools/place-sources.json'), 'utf8')) } catch { return { places: {} } } })()
    let stopped = 0, wrote = 0
    for (const p of places) {
        if (only && !only.includes(p.id)) continue
        const url = homes.get(p.id); if (!url) { console.log(`${p.id}: no home in the registry; skipped`); continue }
        let r; try { r = syncHome({ dir: fetchHome(url), id: p.id, pin, validate, dry }) } catch (e) { r = { id: p.id, wrote: [], same: [], notes: [], stop: String(e.message).split('\n')[0] } }
        if (r.stop) { stopped++; console.log(`${p.id}: STOPPED: ${r.stop}`); continue }
        for (const n of r.notes) console.log(`${p.id}: ${n}`)
        wrote += r.wrote.length
        console.log(`${p.id}: ${r.wrote.length} written, ${r.same.length} unchanged${r.wrote.length ? ' (' + r.wrote.map(w => `${w.file} @ ${w.commit.slice(0, 9)}${w.skipped ? `, ${w.skipped} newer unsigned skipped` : ''}`).join('; ') + ')' : ''}`)
        if (r.wrote.length && !dry) sources.places[p.id] = { repo: url, head: r.head, files: Object.fromEntries(r.wrote.map(w => [w.file, w.commit])), signed_by: pin.agent, key: pin.fingerprint, synced: new Date().toISOString().slice(0, 16) + 'Z' }
    }
    if (!dry) fs.writeFileSync(path.join(ROOT, 'newsroom/tools/place-sources.json'), JSON.stringify({ about: 'Where each place file came from: the home, the commit whose bytes were taken (signed by the pinned key, with the trailer), the signer and when. Written by newsroom/tools/sync-places.mjs.', places: sources.places }, null, 1) + '\n')
    console.log(`sync-places: ${wrote} file(s) ${dry ? 'would be ' : ''}written, ${stopped} place(s) stopped`)
    process.exit(stopped ? 1 : 0)
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
