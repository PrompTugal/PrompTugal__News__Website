#!/usr/bin/env node
// check-signatures.mjs: every new commit is SSH-signed by the key published in board/keys.json for its Agent:, with the
// Claude-Session: recorded on that key (Dinis, 19 November 2026; newsroom/tools/signing.json). Run by release.sh over the
// commits it is about to push, and by the gate over every commit since signing.json's start.
//   node newsroom/tools/check-signatures.mjs [<range>] [--json]      default range: <start>..HEAD
// Each commit against its parent's keys; skips by ancestry only (control 8). Exit 1 if a commit fails; warnings (an agent with no ssh key published yet, while enforce is "enrolled") print but pass.
// dev@PrompTugal.dinis.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// the checker's own folder holds its config and signing program; the trusted launcher runs a copy of all three taken
// from the last release (control 7), so ROOT (the repository checked) can be given apart: CHECK_ROOT
const TOOLS = path.dirname(fileURLToPath(import.meta.url))
const ROOT = process.env.CHECK_ROOT ? path.resolve(process.env.CHECK_ROOT) : path.resolve(TOOLS, '../..')
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', env: { ...process.env, GIT_NO_REPLACE_OBJECTS: '1' }, stdio: ['ignore', 'pipe', 'pipe'] })   // control 9: no replace objects

// control 8 (security@, 19 Nov): a commit is skipped only by ancestry (an ancestor of the trusted base is outside the
// range), never by what it changes, its message, date, path or name; CI's version commits are checked like any other
// (they need CI's own published key: Dinis)
// each commit is checked against the keys of its PARENT's board/keys.json, never its own: a commit cannot add the key it
// is signed with (signals.b@'s review); a new or rotated key comes in a commit signed by a key already listed, or by a person
const signersOf = new Map()
function signers(h, tmp) {
    let blob; try { blob = git('rev-parse', `${h}^:board/keys.json`).trim() } catch { return null }
    if (signersOf.has(blob)) return signersOf.get(blob)
    const keys = JSON.parse(git('cat-file', 'blob', blob)).keys, enrolled = new Map()
    for (const k of keys) if (k.ssh && k.agent && k.status !== 'revoked') { if (!enrolled.has(k.agent)) enrolled.set(k.agent, []); enrolled.get(k.agent).push(k) }
    const file = path.join(tmp, `allowed-${blob}`)
    fs.writeFileSync(file, [...enrolled].flatMap(([a, ks]) => ks.map(k => `${a} namespaces="git" ${k.ssh.split(/\s+/).slice(0, 2).join(' ')}`)).join('\n') + '\n')
    const v = { enrolled, file }; signersOf.set(blob, v); return v
}

// control 10 (security@, ed70bd996): no symlinks. Refused: a mode 120000 entry added or changed by any commit in the
// range (git diff-tree per commit, against every parent, not only the final tree), a symlink in the checked-out tree,
// and a symlink in a downloaded artifact (CHECK_ARTIFACT, a folder). The only exceptions are the paths in
// symlink-exceptions.json beside this checker, which the trusted launcher takes from A's tree, so a path listed only in
// the pushed tree counts from the next anchor; each has its reason, and security@ reviews each one.
function symlinkExceptions() {
    const f = path.join(TOOLS, 'symlink-exceptions.json')
    if (!fs.existsSync(f)) return new Set()
    const st = fs.lstatSync(f); if (!st.isFile()) throw new Error('symlink-exceptions.json is not a plain file')
    const j = JSON.parse(fs.readFileSync(f, 'utf8'))
    return new Set((j.exceptions || []).filter(e => typeof e.path === 'string' && typeof e.reason === 'string' && e.reason.trim()).map(e => e.path))
}
function symlinksUnder(dir, rel = '', out = []) {
    for (const d of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
        const p = rel ? `${rel}/${d.name}` : d.name
        if (!rel && d.name === '.git') continue
        if (d.isSymbolicLink()) out.push(p); else if (d.isDirectory()) symlinksUnder(dir, p, out)
    }
    return out
}

export function checkSignatures(range) {
    const C = JSON.parse(fs.readFileSync(path.join(TOOLS, 'signing.json'), 'utf8'))
    // control 6: a shallow checkout cannot be checked (its boundary looks like an orphan and hides history)
    if (git('rev-parse', '--is-shallow-repository').trim() === 'true') return { fails: ['signatures: a shallow checkout; fetch the full history (fetch-depth 0, or git fetch --unshallow)'], warns: [] }
    try { git('cat-file', '-e', `${C.start}^{commit}`) } catch { return { fails: [], warns: [`signatures: the start commit ${C.start.slice(0, 9)} is not in this checkout; nothing checked`] } }
    // the range is always the trusted base's descendants: start..HEAD, or the given range cut to them
    const r = range ? `${C.trusted_base}..${range.split('..').pop() || 'HEAD'}` : `${C.trusted_base}..HEAD`, tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sig-')), prog = path.join(TOOLS, 'sshsig.mjs'), SEP = '\x1f'
    // every commit in the range, side branches and merges included (security@'s control 3)
    const list = git('log', `--format=%H${SEP}%P${SEP}%s${SEP}%(trailers:key=Agent,valueonly,separator=;)${SEP}%(trailers:key=Claude-Session,valueonly,separator=;)%x1e`, r)
    const fails = [], warns = [], EXC = symlinkExceptions()
    for (const rec of list.split('\x1e').map(x => x.trim()).filter(Boolean)) {
        const [h, parents, subj, agentT, sessT] = rec.split(SEP), id = h.slice(0, 9)
        // control 6: every orphan commit is refused, a merged unrelated history included; only the trusted base, by full id
        if (!parents.trim() && h !== C.trusted_base) { fails.push(`${id}: an orphan commit (no parent) that is not the trusted base`); continue }
        // control 10: a symlink added or changed by this commit, against each parent (a merge's too)
        // read NUL-separated (-z) and compared as whole strings, so a path holding a newline cannot slip past (events.b@'s 44d5402)
        const z = git('diff-tree', '-z', '-r', '--raw', '-m', '--no-commit-id', '--no-renames', '--root', h).split('\0')
        for (let i = 0; i + 1 < z.length; i++) {
            const m = /^:\d{6} (\d{6}) [0-9a-f]+ [0-9a-f]+ [A-Z]\d*$/.exec(z[i]); if (!m) continue
            const p = z[++i]
            if (m[1] === '120000' && !EXC.has(p)) fails.push(`${id}: adds or changes a symlink, ${JSON.stringify(p)} (control 10)`)
        }
        const agent = (agentT || '').split(';')[0].trim(), sess = (sessT || '').split(';')[0].trim()
        if (!agent) { fails.push(`${id}: no Agent: trailer (${subj.slice(0, 60)})`); continue }
        const S = signers(h, tmp)
        if (!S) { fails.push(`${id}: no parent board/keys.json to check against`); continue }
        const ks = S.enrolled.get(agent)
        if (!ks) { (C.enforce === 'all' ? fails : warns).push(`${id}: ${agent} has no ssh key in its parent's board/keys.json yet (newsroom/tools/signing-setup.sh)`); continue }
        const [g, gs] = git('-c', `gpg.ssh.allowedSignersFile=${S.file}`, '-c', `gpg.ssh.program=${prog}`, '-c', 'gpg.format=ssh', 'log', '-1', `--format=%G?${SEP}%GS`, h).trim().split(SEP)
        if (g !== 'G' || gs !== agent) { fails.push(`${id}: not signed by ${agent}'s published key (${g === 'N' ? 'unsigned' : `signature ${g}${gs ? ' by ' + gs : ''}`})`); continue }
        // the Claude-Session: trailer equals the session published with the signing key, the full URL compared exactly (control 5)
        if (!ks.some(k => k.session === sess && k.ssh)) fails.push(`${id}: Claude-Session ${sess || '(none)'} is not the session published with ${agent}'s key`)
    }
    fs.rmSync(tmp, { recursive: true, force: true })
    // control 10: the checked-out tree and a downloaded artifact hold no symlink
    for (const p of symlinksUnder(ROOT)) if (!EXC.has(p)) fails.push(`the checked-out tree holds a symlink, ${p} (control 10)`)
    if (process.env.CHECK_ARTIFACT) for (const p of symlinksUnder(path.resolve(process.env.CHECK_ARTIFACT))) fails.push(`the artifact holds a symlink, ${p} (control 10)`)
    return { fails, warns }
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const range = process.argv.slice(2).find(x => !x.startsWith('--'))
    const { fails, warns } = checkSignatures(range)
    if (process.argv.includes('--json')) { console.log(JSON.stringify({ fails, warns })); process.exit(fails.length ? 1 : 0) }
    for (const w of warns) console.log('WARN ' + w)
    for (const f of fails) console.log('FAIL ' + f)
    if (fails.length) process.exit(1)
    console.log(`signatures: OK${warns.length ? ` (${warns.length} warning${warns.length === 1 ? '' : 's'})` : ''}`)
}
