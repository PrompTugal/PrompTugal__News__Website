#!/usr/bin/env node
/* test_sync_places.mjs: the place-data sync's trust rules (newsroom/tools/sync-places.mjs), in real temporary git repositories
 * with real SSH-signed commits.   node newsroom/build/tests/test_sync_places.mjs
 * A home is trusted only for commits signed by the pinned key AND carrying "Agent: cl-6.places@PrompTugal.dinis"; the home's own key
 * file must equal the pin; fail closed. Written by cl-6.dev@PrompTugal.dinis (cl-6.security's rules of 26 Nov 2026). Exit 1 on a failure. */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { syncHome, signedVersion, homeKeyMatches, readPins, pinFor } from '../../tools/sync-places.mjs'

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-test-'))
const run = (cwd, args, env = {}) => execFileSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t', ...env } })
const keygen = n => { const f = path.join(tmp, n); execFileSync('ssh-keygen', ['-q', '-t', 'ecdsa', '-b', '256', '-N', '', '-f', f]); return { file: f, pub: fs.readFileSync(f + '.pub', 'utf8').trim().split(' ').slice(0, 2).join(' ') } }
const K1 = keygen('k1'), K2 = keygen('k2')           // K1 is the pinned key, K2 a stranger
const AGENT = 'cl-6.places@PrompTugal.dinis', TR = `Agent: ${AGENT}`
const FP = k => /(SHA256:\S+)/.exec(execFileSync('ssh-keygen', ['-lf', k.file + '.pub'], { encoding: 'utf8' }))[1]
const pin = { ssh: K1.pub, agent: AGENT, home_key_path: 'site/keys/cl-6.places.json', fingerprint: FP(K1) }
let bad = 0
const t = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; console.error(`FAIL ${what}: ${JSON.stringify(got)}, want ${JSON.stringify(want)}`) } }

function home(name) { const d = path.join(tmp, name); fs.mkdirSync(d); run(d, ['init', '-q', '-b', 'dev']); return d }
function commit(d, files, msg, key) {
    for (const [f, c] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(d, f)), { recursive: true }); fs.writeFileSync(path.join(d, f), c) }
    run(d, ['add', '-A'])
    const sign = key ? ['-c', 'gpg.format=ssh', '-c', `user.signingkey=${key.file}`, 'commit', '-S'] : ['-c', 'commit.gpgsign=false', 'commit']
    run(d, [...sign, '-q', '-m', msg]); return run(d, ['rev-parse', 'HEAD']).trim()
}
const place = (v, id = 'x') => JSON.stringify({ id, name: 'X', v }) + '\n'
const KEYFILE = k => JSON.stringify({ agent: AGENT, ssh: k.pub })
const F = 'data/by-place/x.json'

// --- a home with a mixed history: good, good, wrong key, unsigned, bot, no trailer
{
    const d = home('mixed'); const key = { 'site/keys/cl-6.places.json': KEYFILE(K1) }
    commit(d, { ...key, [F]: place(1) }, `one\n\n${TR}`, K1)
    const c2 = commit(d, { [F]: place(2) }, `two\n\n${TR}`, K1)
    commit(d, { [F]: place(3) }, `three by a stranger\n\n${TR}`, K2)
    commit(d, { [F]: place(4) }, `four unsigned\n\n${TR}`, null)
    commit(d, { [F]: place(5) }, `five, a bot's (signed by the pin, no trailer)`, K1)
    const head = run(d, ['rev-parse', 'HEAD']).trim()
    const v = signedVersion(d, head, pin, F)
    t('the last good version is taken (v2), not the newer bad ones', v && JSON.parse(v.bytes).v, 2)
    t('and it is that commit', v && v.commit, c2)
    t('three newer commits were skipped', v && v.skipped, 3)
    // the sync writes only that version, reading bytes from the commit
    const site = path.join(tmp, 'site1'); fs.mkdirSync(site)
    fs.writeFileSync(path.join(d, F), place(99))          // a dirty working tree must never be read
    const r = syncHome({ dir: d, id: 'x', pin, siteRoot: site })
    t('wrote one file', r.wrote.length, 1)
    t('from the commit, not the working tree', JSON.parse(fs.readFileSync(path.join(site, F), 'utf8')).v, 2)
    t('no stop', r.stop, null)
    const r2 = syncHome({ dir: d, id: 'x', pin, siteRoot: site })
    t('a second run changes nothing', [r2.wrote.length, r2.same.length], [0, 1])
}
// --- a stale .json.sig of a replaced file is removed; nothing else is deleted
{
    const d = home('sig'); commit(d, { 'site/keys/cl-6.places.json': KEYFILE(K1), [F]: place(7) }, `s\n\n${TR}`, K1)
    const site = path.join(tmp, 'site2'); fs.mkdirSync(path.join(site, 'data/by-place'), { recursive: true })
    fs.writeFileSync(path.join(site, F), place(1)); fs.writeFileSync(path.join(site, F + '.sig'), '{}'); fs.writeFileSync(path.join(site, 'data/by-place/other.json'), '{}')
    syncHome({ dir: d, id: 'x', pin, siteRoot: site })
    t('the stale sig is gone', fs.existsSync(path.join(site, F + '.sig')), false)
    t('an unrelated file stays', fs.existsSync(path.join(site, 'data/by-place/other.json')), true)
}
// --- the home publishes a different key: stopped, nothing written
{
    const d = home('rotated'); commit(d, { 'site/keys/cl-6.places.json': KEYFILE(K2), [F]: place(1) }, `a\n\n${TR}`, K2)
    const site = path.join(tmp, 'site3'); fs.mkdirSync(site)
    const r = syncHome({ dir: d, id: 'x', pin, siteRoot: site })
    t('a home with another key is stopped', /different key/.test(r.stop || ''), true)
    t('nothing written', fs.existsSync(path.join(site, F)), false)
}
// --- the home has no key file: stopped
{
    const d = home('nokey'); commit(d, { [F]: place(1) }, `a\n\n${TR}`, K1)
    t('no key file in the home is stopped', /no key file/.test(syncHome({ dir: d, id: 'x', pin, siteRoot: path.join(tmp, 'site4') }).stop || ''), true)
    t('homeKeyMatches says so', homeKeyMatches(d, run(d, ['rev-parse', 'HEAD']).trim(), pin).ok, false)
}
// --- every commit unsigned: fail closed, nothing written
{
    const d = home('unsigned'); commit(d, { 'site/keys/cl-6.places.json': KEYFILE(K1), [F]: place(1) }, `a\n\n${TR}`, null)
    const site = path.join(tmp, 'site5'); fs.mkdirSync(site)
    const r = syncHome({ dir: d, id: 'x', pin, siteRoot: site })
    t('an unsigned history writes nothing', [r.wrote.length, fs.existsSync(path.join(site, F))], [0, false])
    t('and says why', r.notes.some(n => /no commit signed/.test(n)), true)
}
// --- signed by the pin but no trailer: skipped
{
    const d = home('notrailer'); commit(d, { 'site/keys/cl-6.places.json': KEYFILE(K1), [F]: place(1) }, 'signed, no trailer', K1)
    const r = syncHome({ dir: d, id: 'x', pin, siteRoot: path.join(tmp, 'site6') })
    t('no trailer, nothing written', r.wrote.length, 0)
}
// --- a wrong id inside the file, and a failing schema check, write nothing
{
    const d = home('wrongid'); commit(d, { 'site/keys/cl-6.places.json': KEYFILE(K1), [F]: place(1, 'someone-else') }, `a\n\n${TR}`, K1)
    t('a file for another place is refused', syncHome({ dir: d, id: 'x', pin, siteRoot: path.join(tmp, 'site7') }).wrote.length, 0)
    const d2 = home('badschema'); commit(d2, { 'site/keys/cl-6.places.json': KEYFILE(K1), [F]: place(1) }, `a\n\n${TR}`, K1)
    const r = syncHome({ dir: d2, id: 'x', pin, siteRoot: path.join(tmp, 'site8'), validate: () => ['bad shape'] })
    t('a failing schema check writes nothing', [r.wrote.length, r.notes.some(n => /bad shape/.test(n))], [0, true])
}
// --- a second signer for one place (London, 26 Nov 2026): its own trailer, its own home path, never another place's file
{
    const K3 = keygen('k3'), A2 = 'cl-6.place.london@PrompTugal.dinis', TR2 = `Agent: ${A2}`, P2 = 'site/factory/dinis-cruz/account-f/data/by-place/london.json'
    const pin2 = { ssh: K3.pub, agent: A2, home_key_path: 'site/keys/cl-6.place.london.json', fingerprint: FP(K3), places: ['london'], home: 'https://github.com/PrompTugal/PrompTugal__Agent__Place__London', data_path: P2 }
    const d = home('london'); const key3 = { 'site/keys/cl-6.place.london.json': JSON.stringify({ agent: A2, ssh: K3.pub }) }
    const lon = v => JSON.stringify({ id: 'london', name: 'London', v }) + '\n'
    commit(d, { ...key3, [P2]: lon(1) }, `one\n\n${TR2}`, K3)
    const c2 = commit(d, { [P2]: lon(2) }, `two\n\n${TR2}`, K3)
    commit(d, { [P2]: lon(3) }, `three: the default signer's key and trailer\n\n${TR}`, K1)
    const site = path.join(tmp, 'site9'); fs.mkdirSync(site)
    const r = syncHome({ dir: d, id: 'london', pin: pin2, siteRoot: site })
    t('a place of its own signer is read from the pinned data path, signed by its own key with its own trailer', [r.wrote.length, r.stop], [1, null])
    t('written to data/by-place/<id>.json in the site', JSON.parse(fs.readFileSync(path.join(site, 'data/by-place/london.json'), 'utf8')).v, 2)
    t('a newer commit by the default signer (another key, another trailer) is skipped', r.wrote[0].commit, c2)
    t('such a signer has no now/ file', fs.existsSync(path.join(site, 'data/by-place/now/london.json')), false)
    t('the default pin does not accept the london signer\'s commits', syncHome({ dir: d, id: 'london', pin, siteRoot: path.join(tmp, 'site10') }).stop !== null, true)
    // the pins file: the first signer is the default; a later one needs places, a home and a data path, or it is dropped
    const f = path.join(tmp, 'signers.json')
    const e = (ag, k, extra = {}) => ({ agent: ag, ssh_fingerprint: FP(k), ...extra })
    fs.writeFileSync(f, JSON.stringify({ signers: [e(AGENT, K1), e(A2, K3, { places: ['london'], home: pin2.home, data_path: P2 }), e('cl-6.bad@PrompTugal.dinis', K2, { places: ['x'] }), e('cl-6.bad2@PrompTugal.dinis', K2, { places: ['y'], home: 'https://evil.example/x', data_path: 'a.json' }), e('cl-6.bad3@PrompTugal.dinis', K2, { places: ['z'], home: pin2.home, data_path: '../etc.json' })] }))
    // a later signer cannot name a place another later signer already names
    const f2 = path.join(tmp, 'signers2.json')
    fs.writeFileSync(f2, JSON.stringify({ signers: [e(AGENT, K1), e(A2, K3, { places: ['london'], home: pin2.home, data_path: P2 }), e('cl-6.rival@PrompTugal.dinis', K2, { places: ['london', 'other'], home: 'https://github.com/PrompTugal/PrompTugal__Agent__Place__Rival', data_path: 'x/london.json' })] }))
    t('a later signer naming a place an earlier later signer names is dropped', readPins(f2).map(x => x.agent), [AGENT, A2])
    const pins = readPins(f)
    t('only the default and the fully named later signer are kept', pins.map(x => x.agent), [AGENT, A2])
    t('pinFor: a named place goes to its signer, any other to the default', [pinFor(pins, 'london').agent, pinFor(pins, 'faro').agent], [A2, AGENT])
}
fs.rmSync(tmp, { recursive: true, force: true })
if (bad) { console.error(`${bad} failed`); process.exit(1) }
console.log('test_sync_places: OK')
