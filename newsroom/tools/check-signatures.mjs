#!/usr/bin/env node
// check-signatures.mjs: every new commit is SSH-signed by the key published in board/keys.json for its Agent:, with the
// Claude-Session: recorded on that key (Dinis, 19 November 2026; newsroom/tools/signing.json). Run by release.sh over the
// commits it is about to push, and by the gate over every commit since signing.json's start.
//   node newsroom/tools/check-signatures.mjs [<range>] [--json]      default range: <start>..HEAD
// Each commit against its parent's keys; CI's version commits exempt only by their content. Exit 1 if a commit fails; warnings (an agent with no ssh key published yet, while enforce is "enrolled") print but pass.
// dev@PrompTugal.dinis.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const sid = s => (String(s || '').match(/session_[A-Za-z0-9]+/) || [String(s || '').trim()])[0]

// CI's version commits are exempt only by what they change, never by a name anyone can set (signals.b@'s review, 19 Nov):
// exactly the version files, and in REALITY.md only its version line
const CI_FILES = ['REALITY.md', 'newsroom/build/version.txt', 'newsroom/versions.json']
const VLINE = /^[-+]# Reality: what exists \(site v\d+\.\d+\.\d+\)$/
function isVersionCommit(h, subj, C) {
    if (!new RegExp(C.exempt.subject).test(subj)) return false
    const files = git('diff-tree', '--no-commit-id', '--name-only', '-r', h).split('\n').filter(Boolean)
    if (!files.length || files.some(f => !CI_FILES.includes(f))) return false
    if (!files.includes('REALITY.md')) return true
    const d = git('diff-tree', '-p', '--no-commit-id', '-U0', h, '--', 'REALITY.md').split('\n').filter(l => /^[-+]/.test(l) && !/^(\+\+\+|---) /.test(l))
    return d.length > 0 && d.every(l => VLINE.test(l))
}

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

export function checkSignatures(range) {
    const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'newsroom/tools/signing.json'), 'utf8'))
    try { git('cat-file', '-e', `${C.start}^{commit}`) } catch { return { fails: [], warns: [`signatures: the start commit ${C.start.slice(0, 9)} is not in this checkout; nothing checked`] } }
    const r = range || `${C.start}..HEAD`, tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sig-')), prog = path.join(ROOT, 'newsroom/tools/sshsig.mjs'), SEP = '\x1f'
    const list = git('log', '--no-merges', `--format=%H${SEP}%s${SEP}%(trailers:key=Agent,valueonly,separator=;)${SEP}%(trailers:key=Claude-Session,valueonly,separator=;)%x1e`, r)
    const fails = [], warns = []
    for (const rec of list.split('\x1e').map(x => x.trim()).filter(Boolean)) {
        const [h, subj, agentT, sessT] = rec.split(SEP), id = h.slice(0, 9)
        if (isVersionCommit(h, subj, C)) continue
        const agent = (agentT || '').split(';')[0].trim(), sess = sid((sessT || '').split(';')[0])
        if (!agent) { fails.push(`${id}: no Agent: trailer (${subj.slice(0, 60)})`); continue }
        const S = signers(h, tmp)
        if (!S) { fails.push(`${id}: no parent board/keys.json to check against`); continue }
        const ks = S.enrolled.get(agent)
        if (!ks) { (C.enforce === 'all' ? fails : warns).push(`${id}: ${agent} has no ssh key in its parent's board/keys.json yet (newsroom/tools/signing-setup.sh)`); continue }
        const [g, gs] = git('-c', `gpg.ssh.allowedSignersFile=${S.file}`, '-c', `gpg.ssh.program=${prog}`, '-c', 'gpg.format=ssh', 'log', '-1', `--format=%G?${SEP}%GS`, h).trim().split(SEP)
        if (g !== 'G' || gs !== agent) { fails.push(`${id}: not signed by ${agent}'s published key (${g === 'N' ? 'unsigned' : `signature ${g}${gs ? ' by ' + gs : ''}`})`); continue }
        if (!ks.some(k => sid(k.session) === sess)) fails.push(`${id}: Claude-Session ${sess || '(none)'} is not the session published with ${agent}'s key`)
    }
    fs.rmSync(tmp, { recursive: true, force: true })
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
