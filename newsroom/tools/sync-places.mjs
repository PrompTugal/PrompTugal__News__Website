#!/usr/bin/env node
/* sync-places.mjs: bring the place files from the places' homes (PrompTugal__Agent__Place__<Name>, branch dev) into data/by-place/,
 * trusting only commits signed by the one key pinned in newsroom/tools/place-signers.json.
 *
 *   node newsroom/tools/sync-places.mjs [--only id,id] [--dry] [--cache dir]
 *
 * The rules (cl-6.security, 26 November 2026; decisions of cl-6.dev's home, site/factory/dinis-cruz/account-f/decisions.md):
 *  1. The trust is the PIN, never a key read from a home: the SHA-256 fingerprint of the key in a home's site/keys/cl-6.places.json must
 *     equal the pinned fingerprint (equal fingerprints are the same key), or that place is stopped and reported (never followed). The pin is
 *     a fingerprint, not the key string, because the gate's secrets rule keeps SSH public keys out of every file but board/keys.json.
 *  2. A file's bytes come from a commit that `git verify-commit` accepts against the pin alone AND that carries the trailer
 *     "Agent: cl-6.places@PrompTugal.dinis": taken with `git show <sha>:<path>`, never from a working tree. A newer commit that is
 *     unsigned, signed by another key, a bot's or without the trailer is skipped; the last good version is taken, or nothing.
 *  3. Fail closed: no pin, no key in the home, no good version: nothing is written for that place, and it is reported.
 *  4. Nothing is deleted. A changed place file loses its old .json.sig (made by an old site key over the old bytes, so it no longer
 *     verifies); the provenance is newsroom/tools/place-sources.json (commit, signer, time), written by this tool.
 * Limits: a file's last good version is looked for in the newest 30 commits that touched it, within the 50 commits fetched per home; beyond that the
 * file is not written (fail closed), never taken unsigned.
 * The result is an ordinary working-tree change: commit it and release it with newsroom/tools/release.sh (the gate checks every file).
 * The pin file changes only by a signed commit of the dev agent and cl-6.security's review; this tool never writes it. */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const trailerOf = agent => new RegExp('^Agent: ' + String(agent).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'm')   // the trailer a signer's commits carry: its own agent name
const HOME_URL = /^https:\/\/github\.com\/PrompTugal\/PrompTugal__Agent__Place__[A-Za-z0-9-]+$/

const sha = b => crypto.createHash('sha256').update(b).digest('hex')
const git = (cwd, args, env = {}) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_LFS_SKIP_SMUDGE: '1', ...env } })
const tryGit = (cwd, args, env) => { try { return git(cwd, args, env) } catch { return null } }

// the pinned signer, or null (fail closed)
const FPRE = /^SHA256:[A-Za-z0-9+/]{43}$/
// every pinned signer: the first covers all places not named by another; a later one covers only the places it names, read from its own home (a PrompTugal
// Place home URL) at its own data path, so no signer can speak for a place that is not its own (cl-6.dev, 26 Nov 2026, for London)
export function readPins(file = path.join(ROOT, 'newsroom/tools/place-signers.json')) {
    let j; try { j = JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return [] }
    return (j.signers || []).map((s, i) => {
        if (!s || !s.agent || !FPRE.test(s.ssh_fingerprint || '')) return null
        const pin = { agent: s.agent, home_key_path: s.home_key_path || 'site/keys/cl-6.places.json', fingerprint: s.ssh_fingerprint }
        if (i === 0) return pin
        const own = Array.isArray(s.places) && s.places.length && s.places.every(x => /^[a-z0-9-]+$/.test(x)) && HOME_URL.test(s.home || '') && /^(?!.*\.\.)[A-Za-z0-9._/-]+\.json$/.test(s.data_path || '')
        return own ? { ...pin, places: s.places, home: s.home, data_path: s.data_path } : null
    }).filter(Boolean)
}
export function readPin(file) { return readPins(file)[0] || null }
// the pin that speaks for a place: the signer that names it, else the first
export const pinFor = (pins, id) => pins.slice(1).find(p => p.places.includes(id)) || pins[0] || null

// the SHA-256 fingerprint of an ecdsa-sha2-nistp256 public key string, or ''
export function fingerprintOf(ssh) {
    if (!/^ecdsa-sha2-nistp256 [A-Za-z0-9+/]+={0,3}$/.test(ssh)) return ''
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'places-fp-')), f = path.join(d, 'k.pub')
    try { fs.writeFileSync(f, ssh + '\n'); return (/(SHA256:\S+)/.exec(execFileSync('ssh-keygen', ['-lf', f], { encoding: 'utf8' })) || [])[1] || '' } catch { return '' } finally { fs.rmSync(d, { recursive: true, force: true }) }
}

// a home's own key file, read at `head`: its key's fingerprint must equal the pin; returns the key string to verify with
export function homeKeyMatches(dir, head, pin) {
    const raw = tryGit(dir, ['show', `${head}:${pin.home_key_path}`]); if (raw == null) return { ok: false, why: 'no key file in the home' }
    let k; try { k = JSON.parse(raw) } catch { return { ok: false, why: 'the home key file is not JSON' } }
    const ssh = String(k.ssh || '').trim()
    return fingerprintOf(ssh) === pin.fingerprint ? { ok: true, ssh } : { ok: false, why: 'the home publishes a different key than the pin' }
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
            if (good && trailerOf(pin.agent).test(msg)) { const bytes = tryGit(dir, ['show', `${c}:${file}`]); if (bytes != null) return { commit: c, bytes, skipped } }
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
    pin = { ...pin, ssh: key.ssh }   // the key string to verify with: the home's, proven to be the pinned key by its fingerprint
    // the files of a place: the default signer's home has them at data/by-place/; another signer's data path is pinned beside its fingerprint and it has no now/ file
    for (const [rel, srcPath] of (pin.data_path ? [[`data/by-place/${id}.json`, pin.data_path]] : [[`data/by-place/${id}.json`, `data/by-place/${id}.json`], [`data/by-place/now/${id}.json`, `data/by-place/now/${id}.json`]])) {
        if (tryGit(dir, ['cat-file', '-e', `${head}:${srcPath}`]) === null) continue   // the home has no such file (a now/ file only the Algarve has)
        const v = signedVersion(dir, head, pin, srcPath)
        if (!v) { out.notes.push(`${rel}: no commit signed by the pin with the trailer; nothing written`); continue }
        let j; try { j = JSON.parse(v.bytes) } catch { out.notes.push(`${rel}: not JSON at ${v.commit.slice(0, 9)}; nothing written`); continue }
        if (rel.indexOf('/now/') < 0 && j.id !== id) { out.notes.push(`${rel}: id is ${j.id}, not ${id}; nothing written`); continue }
        const errs = validate ? validate(j, rel) : []
        if (errs.length) { out.notes.push(`${rel}: ${errs.slice(0, 3).join('; ')}; nothing written`); continue }
        const dest = path.join(siteRoot, rel), cur = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null
        if (cur === v.bytes) { out.same.push({ file: rel, commit: v.commit, sha256: sha(v.bytes) }); continue }
        if (!dry) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, v.bytes); if (fs.existsSync(dest + '.sig')) fs.rmSync(dest + '.sig') }
        out.wrote.push({ file: rel, commit: v.commit, sha256: sha(v.bytes), skipped: v.skipped })
    }
    return out
}

// ---- the command ----
async function main() {
    const a = process.argv.slice(2), has = f => a.includes(f), val = f => { const i = a.indexOf(f); return i >= 0 ? a[i + 1] : '' }
    const dry = has('--dry'), cache = val('--cache') || path.join(os.tmpdir(), 'place-homes'), only = val('--only') ? val('--only').split(',') : null
    const pins = readPins(), pin = pins[0]; if (!pin) { console.error('sync-places: no pin in newsroom/tools/place-signers.json; nothing synced (fail closed)'); process.exit(2) }
    const { loadSchemas, validate: check } = await import('../build/lib/schema.mjs')
    const reg = loadSchemas(path.join(ROOT, 'data/schemas'))
    const validate = (j, rel) => check(j, rel.includes('/now/') ? 'by-place-now.schema.json' : 'by-place.schema.json', reg)
    const places = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/by-place/places.json'), 'utf8')).places
    fs.mkdirSync(cache, { recursive: true })
    const fetchHome = url => { const d = path.join(cache, url.split('/').pop()); if (fs.existsSync(path.join(d, '.git'))) { git(d, ['fetch', '-q', '--depth', '50', 'origin', 'dev']); git(d, ['checkout', '-q', '--detach', 'FETCH_HEAD']) } else git(cache, ['clone', '-q', '--depth', '50', '--branch', 'dev', '--single-branch', url, d]); return d }
    // each place's home: the registry in the Algarve home lists them; only a PrompTugal/PrompTugal__Agent__Place__<Name> URL is accepted
    const regDir = fetchHome('https://github.com/PrompTugal/PrompTugal__Agent__Place__Algarve')
    const regHead = git(regDir, ['rev-parse', 'HEAD']).trim()
    const regKey = homeKeyMatches(regDir, regHead, pin)
    if (!regKey.ok) { console.error('sync-places: the Algarve home does not publish the pinned key; stopped'); process.exit(2) }
    const reg2 = signedVersion(regDir, regHead, { ...pin, ssh: regKey.ssh }, 'site/factory/dinis-cruz/account-f/places.json')
    if (!reg2) { console.error('sync-places: the registry of homes has no signed version; stopped'); process.exit(2) }
    const homes = new Map(JSON.parse(reg2.bytes).places.filter(p => HOME_URL.test(p.home || '')).map(p => [p.id, p.home]))
    const sources = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'newsroom/tools/place-sources.json'), 'utf8')) } catch { return { places: {} } } })()
    let stopped = 0, wrote = 0
    for (const p of places) {
        if (only && !only.includes(p.id)) continue
        const sp = pinFor(pins, p.id), url = sp === pin ? homes.get(p.id) : sp.home   // a place a later signer names is read only from that signer's own home, whatever the registry says
        if (!url) { console.log(`${p.id}: no home in the registry; skipped`); continue }
        let r; try { r = syncHome({ dir: fetchHome(url), id: p.id, pin: sp, validate, dry }) } catch (e) { r = { id: p.id, wrote: [], same: [], notes: [], stop: String(e.message).split('\n')[0] } }
        if (r.stop) { stopped++; console.log(`${p.id}: STOPPED: ${r.stop}`); continue }
        for (const n of r.notes) console.log(`${p.id}: ${n}`)
        wrote += r.wrote.length
        console.log(`${p.id}: ${r.wrote.length} written, ${r.same.length} unchanged${r.wrote.length ? ' (' + r.wrote.map(w => `${w.file} @ ${w.commit.slice(0, 9)}${w.skipped ? `, ${w.skipped} newer unsigned skipped` : ''}`).join('; ') + ')' : ''}`)
        // every file taken or confirmed unchanged is recorded with its commit and the sha256 of its bytes; the gate (lib/place-sources.mjs) holds each place file to it
        if ((r.wrote.length || r.same.length) && !dry) sources.places[p.id] = { repo: url, head: r.head, files: Object.fromEntries([...r.wrote, ...r.same].map(w => [w.file, { commit: w.commit, sha256: w.sha256 }])), signed_by: sp.agent, key: sp.fingerprint, synced: new Date().toISOString().slice(0, 16) + 'Z' }
    }
    if (!dry) fs.writeFileSync(path.join(ROOT, 'newsroom/tools/place-sources.json'), JSON.stringify({ about: 'Where each place file came from: the home, the commit whose bytes were taken (signed by the pinned key, with the trailer), the signer and when. Written by newsroom/tools/sync-places.mjs.', places: sources.places }, null, 1) + '\n')
    console.log(`sync-places: ${wrote} file(s) ${dry ? 'would be ' : ''}written, ${stopped} place(s) stopped`)
    process.exit(stopped ? 1 : 0)
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
