// A change to board/keys.json is held to the agent it concerns (cl-6.security's follow-up 1b, 26 Nov 2026): whoever can flip a key's status
// back to active re-enables it, so each commit on the first-parent line after a pinned baseline that changes an entry (added, removed, or a
// change to its status, superseded, superseded_in, superseded_by, ssh, agent or bundle) must be SSH-signed by a key of the agent that entry
// belongs to, as board/keys.json stood in the commit's PARENT (a commit cannot vouch for itself with a key it adds), or, for an entry the
// commit ADDS, by that entry's own key (first publication). A commit that changes entries of two agents needs an operator key (none is
// published yet, so it is reported). The verifier is named on the command line. It reports problems as a list; the gate shows them as
// warnings until Dinis's key is in board/keys.json, then as errors. Pure of the gate: root, baseline and the operator list are parameters.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { ROOT } from './config.mjs'

const FIELDS = ['status', 'superseded', 'superseded_in', 'superseded_by', 'ssh', 'agent', 'bundle']
const SSH = /^(ecdsa-sha2-nistp256|ssh-ed25519) AAAA[A-Za-z0-9+/]{40,}={0,3}$/
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] })
const tryGit = (cwd, args) => { try { return git(cwd, args) } catch { return null } }
const keysAt = (root, c) => { try { return (JSON.parse(git(root, ['show', `${c}:board/keys.json`])).keys) || [] } catch { return null } }
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

// the entries a commit changed: [{ id, agent, added }]
export function changedEntries(before, after) {
    const B = new Map(before.map(k => [k.id, k])), A = new Map(after.map(k => [k.id, k])), out = []
    for (const id of new Set([...B.keys(), ...A.keys()])) {
        const b = B.get(id), a = A.get(id)
        if (!b || !a || FIELDS.some(f => !same(b[f], a[f]))) out.push({ id, agent: (a || b).agent || '', added: !b, removed: !a })
    }
    return out
}

export function checkKeyChanges({ root = ROOT, baseline = null, operators = [] } = {}) {
    if (!baseline) { try { baseline = JSON.parse(fs.readFileSync(path.join(root, 'newsroom/tools/keys-baseline.json'), 'utf8')).commit } catch { return ['no baseline commit (newsroom/tools/keys-baseline.json)'] } }
    if (tryGit(root, ['cat-file', '-e', `${baseline}^{commit}`]) === null) return ['the baseline commit is not in this checkout (the gate needs the repository\'s history)']
    const problems = [], tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'keys-changes-'))
    try {
        const commits = (tryGit(root, ['rev-list', '--first-parent', '--reverse', `${baseline}..HEAD`, '--', 'board/keys.json']) || '').split('\n').filter(Boolean)
        for (const c of commits) {
            const parent = (tryGit(root, ['rev-parse', `${c}^`]) || '').trim(), before = parent && keysAt(root, parent), after = keysAt(root, c)
            if (!before || !after) { problems.push(`${c.slice(0, 9)}: board/keys.json unreadable`); continue }
            const changed = changedEntries(before, after); if (!changed.length) continue
            const agents = new Set(changed.map(x => x.agent))
            const lines = []
            const add = (k, who) => { const ssh = String(k.ssh || '').trim(); if (SSH.test(ssh)) lines.push(`${who} namespaces="git" ${ssh}`) }
            for (const k of before) if (k.status === 'active' && (agents.has(k.agent) || operators.includes(k.agent))) add(k, k.agent)   // as the PARENT had it
            for (const x of changed) if (x.added) add(after.find(k => k.id === x.id) || {}, x.agent)                                   // first publication: the entry's own key
            for (const o of operators) for (const k of before) if (k.agent === o && k.status === 'active') add(k, o)
            const f = path.join(tmp, 'allowed'); fs.writeFileSync(f, lines.join('\n') + '\n')
            const ok = lines.length > 0 && tryGit(root, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${f}`, 'verify-commit', c]) !== null
            const ids = changed.map(x => x.id).join(', ')
            if (!ok) problems.push(`${c.slice(0, 9)}: changed ${ids}, not signed by that agent's key as it stood in the parent`)
            else if (agents.size > 1 && !operators.length) problems.push(`${c.slice(0, 9)}: changed the keys of ${agents.size} agents in one commit (${ids}); only an operator may`)
        }
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
    return problems
}
