// newsroom/tools/operator-keys.json has its own rule, not signed-root's (cl-6.security's O1, 26 Nov 2026): signed-root accepts any dev or conductor key, so
// either could list its own fingerprint, sign the change and become an operator. Here, for every first-parent commit that changes the list:
//   the parent list is empty (the bootstrap): the commit must be signed by the very key it adds, so only that key's holder can start the list;
//   the parent list is not empty: the commit must be signed by a key whose fingerprint is in the PARENT's list; a dev or conductor key never suffices.
// The key behind a fingerprint is the active ssh key (or bundle.sign key) in board/keys.json at the commit (its parent for a change). The current list
// is returned as a standing notice, for cl-6.security to check out of band against the fingerprint Dinis states. An uncommitted change is an error.
// The verifier is named on the command line. cl-6.dev@PrompTugal.dinis.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { ROOT } from './config.mjs'
import { envProblem } from './git-env.mjs'

export const FILE = 'newsroom/tools/operator-keys.json'
const SSH = /^(ecdsa-sha2-nistp256|ssh-ed25519) AAAA[A-Za-z0-9+/]{40,}={0,3}$/, FP = /^SHA256:[A-Za-z0-9+/]{43}$/
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] })
const tryGit = (cwd, args) => { try { return git(cwd, args) } catch { return null } }
const list = txt => { try { return [...new Set(JSON.parse(txt).operators.map(o => typeof o === 'string' ? o : o && o.ssh_fingerprint).filter(f => FP.test(f || '')))] } catch { return null } }

export function checkOperatorKeys({ root = ROOT, sshKeygen } = {}) {
    const out = { errors: [], notices: [] }
    const env = envProblem(root, sshKeygen ? { sshKeygen } : {}); if (env) { out.errors.push(env); return out }
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'operator-keys-'))
    let n = 0
    const fpOf = ssh => { const f = path.join(tmp, `k${n++}.pub`); fs.writeFileSync(f, ssh + '\n'); try { return (/(SHA256:\S+)/.exec(execFileSync('ssh-keygen', ['-lf', f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })) || [])[1] || '' } catch { return '' } }
    const sshOf = k => { const s = String(k.ssh || '').trim(); if (SSH.test(s)) return s
        const pem = String((k.bundle && k.bundle.sign) || '').trim(); if (!/^-----BEGIN PUBLIC KEY-----[A-Za-z0-9+/=\s]+-----END PUBLIC KEY-----$/.test(pem)) return ''
        const f = path.join(tmp, `pem${n++}`); fs.writeFileSync(f, pem + '\n')
        try { const o = execFileSync('ssh-keygen', ['-i', '-m', 'PKCS8', '-f', f], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); return SSH.test(o) ? o : '' } catch { return '' } }
    // the active keys of board/keys.json at a commit whose fingerprint is in `fps`, as allowed-signers lines
    const lines = (at, fps) => { let ks; try { ks = JSON.parse(git(root, ['show', `${at}:board/keys.json`])).keys || [] } catch { return [] }
        return ks.filter(k => k.status === 'active').flatMap(k => { const ssh = sshOf(k); return ssh && fps.includes(fpOf(ssh)) ? [`operator namespaces="git" ${ssh}`] : [] }) }
    const signedBy = (c, ls) => { if (!ls.length) return false; const f = path.join(tmp, `allowed${n++}`); fs.writeFileSync(f, ls.join('\n') + '\n')
        return tryGit(root, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${f}`, 'verify-commit', c]) !== null }
    try {
        if ((tryGit(root, ['status', '--porcelain', '--', FILE]) || '').trim()) out.errors.push(`${FILE}: changed and not committed`)
        for (const c of (tryGit(root, ['rev-list', '--first-parent', '--reverse', 'HEAD', '--', FILE]) || '').split('\n').filter(Boolean)) {
            const parent = (tryGit(root, ['rev-parse', `${c}^`]) || '').trim()
            const before = parent ? list(tryGit(root, ['show', `${parent}:${FILE}`]) || '') || [] : [], after = list(tryGit(root, ['show', `${c}:${FILE}`]) || '')
            if (after === null) { out.errors.push(`${c.slice(0, 9)}: ${FILE} is not valid`); continue }
            if (JSON.stringify([...before].sort()) === JSON.stringify([...after].sort())) continue
            const at = c.slice(0, 9)
            if (!before.length) { if (!signedBy(c, lines(c, after))) out.errors.push(`${at}: the first operator key must be added by a commit signed by that very key (an active key in board/keys.json with a listed fingerprint)`) }
            else if (!signedBy(c, lines(parent, before))) out.errors.push(`${at}: the operator list changed, not signed by a key whose fingerprint is in the parent's list (a dev or conductor key never suffices)`)
        }
        const now = list(tryGit(root, ['show', `HEAD:${FILE}`]) || ''); for (const f of now || []) out.notices.push(`operator key listed: ${f} (cl-6.security checks it against the fingerprint Dinis states)`)
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
    return out
}
