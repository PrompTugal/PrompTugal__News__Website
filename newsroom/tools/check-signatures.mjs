#!/usr/bin/env node
// check-signatures.mjs: every new commit is SSH-signed by the key published in board/keys.json for its Agent:, with the
// Claude-Session: recorded on that key (Dinis, 19 November 2026; newsroom/tools/signing.json). Run by release.sh over the
// commits it is about to push, and by the gate over every commit since signing.json's start.
//   node newsroom/tools/check-signatures.mjs [<range>] [--json]      default range: <start>..HEAD
// Exit 1 if a commit fails; warnings (an agent with no ssh key published yet, while enforce is "enrolled") print but pass.
// dev@PrompTugal.dinis.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const sid = s => (String(s || '').match(/session_[A-Za-z0-9]+/) || [String(s || '').trim()])[0]

export function checkSignatures(range) {
    const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'newsroom/tools/signing.json'), 'utf8'))
    const keys = JSON.parse(fs.readFileSync(path.join(ROOT, 'board/keys.json'), 'utf8')).keys
    const enrolled = new Map()
    for (const k of keys) if (k.ssh && k.agent && k.status !== 'revoked') { if (!enrolled.has(k.agent)) enrolled.set(k.agent, []); enrolled.get(k.agent).push(k) }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sig-')), allowed = path.join(tmp, 'allowed_signers')
    fs.writeFileSync(allowed, [...enrolled].flatMap(([a, ks]) => ks.map(k => `${a} namespaces="git" ${k.ssh.split(/\s+/).slice(0, 2).join(' ')}`)).join('\n') + '\n')
    let r = range || `${C.start}..HEAD`
    try { git('cat-file', '-e', `${C.start}^{commit}`) } catch { return { fails: [], warns: [`signatures: the start commit ${C.start.slice(0, 9)} is not in this checkout; nothing checked`] } }
    const prog = path.join(ROOT, 'newsroom/tools/sshsig.mjs'), SEP = '\x1f'
    const log = git('-c', `gpg.ssh.allowedSignersFile=${allowed}`, '-c', `gpg.ssh.program=${prog}`, '-c', 'gpg.format=ssh', 'log', '--no-merges',
        `--format=%H${SEP}%cn${SEP}%s${SEP}%G?${SEP}%GS${SEP}%(trailers:key=Agent,valueonly,separator=;)${SEP}%(trailers:key=Claude-Session,valueonly,separator=;)%x1e`, r)
    fs.rmSync(tmp, { recursive: true, force: true })
    const fails = [], warns = [], ex = new RegExp(C.exempt.subject)
    for (const rec of log.split('\x1e').map(s => s.trim()).filter(Boolean)) {
        const [h, cn, subj, g, gs, agentT, sessT] = rec.split(SEP), id = h.slice(0, 9)
        if (C.exempt.committers.includes(cn) && ex.test(subj)) continue
        const agent = (agentT || '').split(';')[0].trim(), sess = sid((sessT || '').split(';')[0])
        if (!agent) { fails.push(`${id}: no Agent: trailer (${subj.slice(0, 60)})`); continue }
        const ks = enrolled.get(agent)
        if (!ks) { (C.enforce === 'all' ? fails : warns).push(`${id}: ${agent} has no ssh key in board/keys.json yet (newsroom/tools/signing-setup.sh)`); continue }
        if (g !== 'G' || gs !== agent) { fails.push(`${id}: not signed by ${agent}'s published key (${g === 'N' ? 'unsigned' : `signature ${g}${gs ? ' by ' + gs : ''}`})`); continue }
        if (!ks.some(k => sid(k.session) === sess)) fails.push(`${id}: Claude-Session ${sess || '(none)'} is not the session published with ${agent}'s key`)
    }
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
