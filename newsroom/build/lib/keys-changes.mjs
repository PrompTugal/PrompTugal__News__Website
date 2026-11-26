// A change to board/keys.json is held to the agent it concerns (cl-6.security's follow-up 1b, 26 Nov 2026), one decision per ENTRY, not one
// per commit. Each commit on the first-parent line after a pinned baseline that changes an entry (added, removed, or a change to its status,
// superseded, superseded_in, superseded_by, ssh, agent or bundle) is judged like this, against board/keys.json as it stood in the commit's PARENT:
//   an ADDED entry: vouched for by its own key (first publication) or by an active key of its agent in the parent;
//   a CHANGED or REMOVED existing entry: only by an active key of its agent in the parent, never by a key the commit adds: so a commit that adds
//     a new key for X, retires X's real one and is signed by the new key is reported as a hand-over (it needs an operator);
//   a RE-ACTIVATION (superseded or revoked back to active) is always reported, even when the agent signs: a retired key's private half outlives its session.
// An operator key (none is published yet, so the list is empty) vouches for any entry. The verifier is named on the command line. The result is
// a list of problems; the gate shows them as warnings until Dinis's key is in board/keys.json, then as errors. Known gap: a first publication is
// self-signed. Pure of the gate: root, baseline and the operator list are parameters.
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
    let n = 0
    const verify = (c, lines) => { if (!lines.length) return false; const f = path.join(tmp, `allowed${n++}`); fs.writeFileSync(f, lines.join('\n') + '\n')
        return tryGit(root, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${f}`, 'verify-commit', c]) !== null }
    const line = (k, who) => { const ssh = String(k.ssh || '').trim(); return SSH.test(ssh) ? [`${who} namespaces="git" ${ssh}`] : [] }
    try {
        const commits = (tryGit(root, ['rev-list', '--first-parent', '--reverse', `${baseline}..HEAD`, '--', 'board/keys.json']) || '').split('\n').filter(Boolean)
        for (const c of commits) {
            const parent = (tryGit(root, ['rev-parse', `${c}^`]) || '').trim(), before = parent && keysAt(root, parent), after = keysAt(root, c)
            if (!before || !after) { problems.push(`${c.slice(0, 9)}: board/keys.json unreadable`); continue }
            const changed = changedEntries(before, after); if (!changed.length) continue
            const B = new Map(before.map(k => [k.id, k])), A = new Map(after.map(k => [k.id, k])), at = c.slice(0, 9)
            // the parent's active keys of an agent (or of an operator): the only keys that may vouch for an existing entry
            const parentKeys = agent => before.filter(k => k.status === 'active' && (k.agent === agent || operators.includes(k.agent))).flatMap(k => line(k, k.agent))
            const okParent = new Map(), okOwn = new Map()
            const parentOk = agent => { if (!okParent.has(agent)) okParent.set(agent, verify(c, parentKeys(agent))); return okParent.get(agent) }
            const ownOk = id => { if (!okOwn.has(id)) okOwn.set(id, verify(c, line(A.get(id) || {}, 'own'))); return okOwn.get(id) }
            const addedFor = agent => changed.filter(x => x.added && x.agent === agent && ownOk(x.id))
            for (const x of changed) {
                const b = B.get(x.id), a = A.get(x.id)
                if (b && a && b.status !== 'active' && a.status === 'active') { problems.push(`${at}: ${x.id} re-activated (${b.status} to active); operator only`); continue }
                if (x.added) { if (!(ownOk(x.id) || parentOk(x.agent))) problems.push(`${at}: ${x.id} added, not signed by its own key or by an active key of ${x.agent}`); continue }
                if (parentOk(x.agent)) continue
                if (addedFor(x.agent).length) problems.push(`${at}: ${x.id} ${x.removed ? 'removed' : 'changed'} in the commit that adds a key for ${x.agent} (hand-over; needs an operator)`)
                else problems.push(`${at}: ${x.id} ${x.removed ? 'removed' : 'changed'}, not signed by an active key of ${x.agent} as it stood in the parent`)
            }
        }
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
    return problems
}
