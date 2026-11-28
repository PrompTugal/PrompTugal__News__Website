// A change to board/keys.json is held to the agent it concerns (cl-6.security's follow-up 1b, 26 Nov 2026), one decision per ENTRY, not one
// per commit. Each commit on the first-parent line after a pinned baseline that changes an entry (added, removed, or a change to its status,
// superseded, superseded_in, superseded_by, ssh, agent or bundle) is judged like this, against board/keys.json as it stood in the commit's PARENT:
//   an ADDED entry: vouched for by its own key (first publication) or by an active key of its agent in the parent;
//   a CHANGED or REMOVED existing entry: only by an active key of its agent in the parent, never by a key the commit adds: so a commit that adds
//     a new key for X, retires X's real one and is signed by the new key is reported as a hand-over (it needs an operator);
//   a RE-ACTIVATION (superseded or revoked back to active) is always reported, even when the agent signs: a retired key's private half outlives its session.
// An entry whose ssh field holds no key counts by its bundle.sign key (the same key, in PEM); until cl-6.abp's S9 commit retires the ~109 entries that hold
// none, their bundle.sign keys count as their agents' keys (cl-6.security, 26 Nov 2026: low risk, most are ended sessions). An operator key vouches for any entry: it is recognised only by its ssh fingerprint listed in newsroom/tools/operator-keys.json (empty until Dinis states his), never by an agent name or role in board/keys.json, which any agent can add. The verifier is named on the command line. The result is
// HOME KEY PINS (cl-6.security, 28 Nov 2026, S19): a key is also vouched for when it is byte-identical to the key its agent published in its own home (site/keys/<role>.json), recorded as a pin in
//   newsroom/tools/home-key-pins.json. The pins are read from the commit's PARENT, never from the commit itself, so a push cannot pin its own key; a commit that adds or changes a pin is
//   itself judged: it must be signed by an operator, or by an active key of the file's "pinned_by" agent (cl-6.security). An ADDED key for an agent that already has an active key, signed only by
//   that new key, is reported unless it matches a pin; a hand-over (the added key retires the old) passes when the added key matches a pin and signs the commit.
// a list of problems; the gate shows them as warnings until Dinis's key is in board/keys.json, then as errors. Known gap: a first publication is
// self-signed. Pure of the gate: root, baseline and the operator list are parameters.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { ROOT } from './config.mjs'
import { envProblem } from './git-env.mjs'

const FIELDS = ['status', 'superseded', 'superseded_in', 'superseded_by', 'ssh', 'agent', 'bundle']
const SSH = /^(ecdsa-sha2-nistp256|ssh-ed25519) AAAA[A-Za-z0-9+/]{40,}={0,3}$/
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] })
const tryGit = (cwd, args) => { try { return git(cwd, args) } catch { return null } }
const PINS = 'newsroom/tools/home-key-pins.json'
const pinsAt = (root, c) => { try { const j = JSON.parse(git(root, ['show', `${c}:${PINS}`])); return { exists: true, by: String(j.pinned_by || ''), pins: Array.isArray(j.pins) ? j.pins : [] } } catch { return { exists: false, by: '', pins: [] } } }
const keysAt = (root, c) => { try { return (JSON.parse(git(root, ['show', `${c}:board/keys.json`])).keys) || [] } catch { return null } }
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

// the entries a commit changed: [{ id, agent (the owner in the PARENT, or the new owner of an added entry), added }]
export function changedEntries(before, after) {
    const B = new Map(before.map(k => [k.id, k])), A = new Map(after.map(k => [k.id, k])), out = []
    for (const id of new Set([...B.keys(), ...A.keys()])) {
        const b = B.get(id), a = A.get(id)
        if (!b || !a || FIELDS.some(f => !same(b[f], a[f]))) out.push({ id, agent: (b || a).agent || '', newAgent: (a || b).agent || '', added: !b, removed: !a })
    }
    return out
}

export function checkKeyChanges({ root = ROOT, baseline = null, operators = [], sshKeygen } = {}) {
    const env = envProblem(root, sshKeygen ? { sshKeygen } : {}); if (env) return [env]
    if (!baseline) { try { baseline = JSON.parse(fs.readFileSync(path.join(root, 'newsroom/tools/keys-baseline.json'), 'utf8')).commit } catch { return ['no baseline commit (newsroom/tools/keys-baseline.json)'] } }
    if (tryGit(root, ['cat-file', '-e', `${baseline}^{commit}`]) === null) return ['the baseline commit is not in this checkout (the gate needs the repository\'s history)']
    const problems = [], tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'keys-changes-'))
    let n = 0
    const verify = (c, lines) => { if (!lines.length) return false; const f = path.join(tmp, `allowed${n++}`); fs.writeFileSync(f, lines.join('\n') + '\n')
        return tryGit(root, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${f}`, 'verify-commit', c]) !== null }
    // the SSH key of an entry: its ssh field, or, when that holds no key (cl-6.devops's entry held only the type, 26 Nov 2026), the same key from
    // the entry's own bundle.sign (a P-256 public key in PEM), converted by ssh-keygen; anything that does not convert is no key
    const sshOf = k => {
        const ssh = String(k.ssh || '').trim(); if (SSH.test(ssh)) return ssh
        const pem = String((k.bundle && k.bundle.sign) || '').trim(); if (!/^-----BEGIN PUBLIC KEY-----[A-Za-z0-9+/=\s]+-----END PUBLIC KEY-----$/.test(pem)) return ''
        const f = path.join(tmp, `pem${n++}`); fs.writeFileSync(f, pem + '\n')
        try { const o = execFileSync('ssh-keygen', ['-i', '-m', 'PKCS8', '-f', f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); return /^ecdsa-sha2-nistp256 AAAA/.test(o) && SSH.test(o) ? o : '' } catch { return '' }
    }
    // the SHA-256 fingerprint of an ssh key string: how an operator is recognised (newsroom/tools/operator-keys.json), never by a name in board/keys.json
    const fpOf = ssh => { const f = path.join(tmp, `fp${n++}.pub`); fs.writeFileSync(f, ssh + '\n'); try { return (/(SHA256:\S+)/.exec(execFileSync('ssh-keygen', ['-lf', f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })) || [])[1] || '' } catch { return '' } }
    const line = (k, who) => { const ssh = sshOf(k); return ssh ? [`${who} namespaces="git" ${ssh}`] : [] }
    try {
        const commits = (tryGit(root, ['rev-list', '--first-parent', '--reverse', `${baseline}..HEAD`, '--', 'board/keys.json', PINS]) || '').split('\n').filter(Boolean)
        // the pins as last ACCEPTED (cl-6.security, 28 Nov): the pinning agent and the pins move only by a change that was signed as the rules say, never by a reported commit, so a stranger's pin or a re-created file
        // does not become trusted by the next commit. Taken from the baseline; the file's first creation (none at the baseline, none accepted yet) is not judged, any later creation is operator-only.
        const t0 = pinsAt(root, baseline), trust = { by: t0.by, pins: t0.pins, had: t0.exists }
        for (const c of commits) {
            const parent = (tryGit(root, ['rev-parse', `${c}^`]) || '').trim(), before = parent && keysAt(root, parent), after = keysAt(root, c)
            if (!before || !after) { problems.push(`${c.slice(0, 9)}: board/keys.json unreadable`); continue }
            const pinsBefore = pinsAt(root, parent), pinsAfter = pinsAt(root, c), at0 = c.slice(0, 9)
            const trustedPins = trust.pins, trustedBy = trust.by      // as they stood before this commit: a pin made in the same commit does not vouch for it
            const opLines = () => before.filter(k => k.status === 'active').flatMap(k => { const ssh = sshOf(k); return ssh && operators.includes(fpOf(ssh)) ? [`operator namespaces="git" ${ssh}`] : [] })
            const report = what => problems.push(`${at0}: the home key pins file ${what}`)
            if (!pinsBefore.exists && pinsAfter.exists) {
                if (!trust.had) Object.assign(trust, { by: pinsAfter.by, pins: pinsAfter.pins, had: true })          // the first creation: no pins to trust yet
                else if (!verify(c, opLines())) report('was re-created, not signed by an operator')
                else Object.assign(trust, { by: pinsAfter.by, pins: pinsAfter.pins })
            } else if (pinsBefore.exists) {
                const byChanged = trustedBy !== pinsAfter.by || !pinsAfter.exists, pinsChanged = pinsAfter.exists && !same(pinsBefore.pins, pinsAfter.pins)
                if (byChanged || pinsChanged) {
                    // a pin added, changed or removed: an operator or an active key of the pinner as last accepted; a changed pinned_by or the deletion: an operator only
                    const byLines = !byChanged && trustedBy ? before.filter(k => k.status === 'active' && k.agent === trustedBy).flatMap(k => line(k, k.agent)) : []
                    if (!verify(c, [...opLines(), ...byLines])) report(`${!pinsAfter.exists ? 'was deleted' : byChanged ? 'changed its pinned_by' : 'had a pin added, changed or removed'}, not signed by ${byChanged ? 'an operator' : `an operator or an active key of ${trustedBy || 'the pinning agent'}`}`)
                    else Object.assign(trust, !pinsAfter.exists ? { pins: [] } : byChanged ? { by: pinsAfter.by, pins: pinsAfter.pins } : { pins: pinsAfter.pins })   // a pin-only change never moves the pinner
                }
            }
            const homeOk = e => { const ssh = e && sshOf(e); return !!ssh && trustedPins.some(x => x && x.agent === e.agent && x.ssh === ssh) }
            const changed = changedEntries(before, after); if (!changed.length) continue
            const B = new Map(before.map(k => [k.id, k])), A = new Map(after.map(k => [k.id, k])), at = c.slice(0, 9)
            // the parent's active keys of an agent: the only keys that may vouch for an existing entry (an operator's key, by fingerprint, may vouch for any)
            const parentKeys = agent => before.filter(k => k.status === 'active' && k.agent === agent).flatMap(k => line(k, k.agent))
            const okParent = new Map(), okOwn = new Map()
            let okOp = null
            const opOk = () => { if (okOp === null) okOp = operators.length > 0 && verify(c, before.filter(k => k.status === 'active').flatMap(k => { const ssh = sshOf(k); return ssh && operators.includes(fpOf(ssh)) ? [`operator namespaces="git" ${ssh}`] : [] })); return okOp }
            const parentOk = agent => { if (!okParent.has(agent)) okParent.set(agent, verify(c, parentKeys(agent))); return okParent.get(agent) }
            const ownOk = id => { if (!okOwn.has(id)) okOwn.set(id, verify(c, line(A.get(id) || {}, 'own'))); return okOwn.get(id) }
            const addedFor = agent => changed.filter(x => x.added && x.agent === agent && ownOk(x.id))
            for (const x of changed) {
                const b = B.get(x.id), a = A.get(x.id)
                if (opOk()) continue                  // signed by an operator's key (listed by fingerprint): any entry
                if (b && a && b.status !== 'active' && a.status === 'active') { problems.push(`${at}: ${x.id} re-activated (${b.status} to active); operator only`); continue }
                if (b && a && b.agent !== a.agent) { problems.push(`${at}: ${x.id} agent changed (${b.agent} to ${a.agent}); operator only`); continue }
                if (x.added) {
                    if (!(ownOk(x.id) || parentOk(x.agent))) { problems.push(`${at}: ${x.id} added, not signed by its own key or by an active key of ${x.agent}`); continue }
                    // a second key for an agent that already has one, vouched for only by itself, needs a home key pin (S19)
                    if (!parentOk(x.agent) && parentKeys(x.agent).length && !homeOk(A.get(x.id))) problems.push(`${at}: ${x.id} added for ${x.agent}, which already has an active key: signed only by itself, and no home key pin matches it`)
                    continue
                }
                if (parentOk(x.agent)) continue
                // a hand-over to a pinned key passes the retired entry when ANY key added for the agent is pinned; a pinned key that did not sign the commit is still reported by the x.added branch above (ownOk), so nothing passes unreported
                if (addedFor(x.agent).some(y => homeOk(A.get(y.id)))) continue
                if (addedFor(x.agent).length) problems.push(`${at}: ${x.id} ${x.removed ? 'removed' : 'changed'} in the commit that adds a key for ${x.agent} (hand-over; needs an operator)`)
                else problems.push(`${at}: ${x.id} ${x.removed ? 'removed' : 'changed'}, not signed by an active key of ${x.agent} as it stood in the parent`)
            }
        }
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
    return problems
}
