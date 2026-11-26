// The gate's hold on the root of the place-data trust (cl-6.security's follow-up, 26 Nov 2026): newsroom/tools/place-signers.json (the pin) and
// newsroom/tools/place-sources.json (what the sync recorded) are what the place files are held to, so they change only by a commit signed by
// the dev agent's or the conductor's key as published in board/keys.json. The check takes the last commit on the first-parent line that
// changed each file and runs `git verify-commit` on it against an allowed-signers file built from those keys alone (the verifier is named
// on the command line). An uncommitted change, an unsigned commit or another key is an error. Needs the repository's history (CI checks
// out all of it); with none, it says so rather than pass.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { ROOT } from './config.mjs'
import { envProblem } from './git-env.mjs'

export const ROOT_FILES = ['newsroom/tools/place-signers.json', 'newsroom/tools/place-sources.json', 'newsroom/tools/keys-baseline.json', 'newsroom/tools/abp-paths.json', 'newsroom/tools/abp-signers.json']
const AGENTS = /^(cl-\d+\.)?(dev|conductor)@PrompTugal\.dinis$/
const SSH = /^(ecdsa-sha2-nistp256|ssh-ed25519) AAAA[A-Za-z0-9+/]{40,}={0,3}$/

const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] })
const tryGit = (cwd, args) => { try { return git(cwd, args) } catch { return null } }

// the keys of board/keys.json that may sign these files, by status (cl-6.security, 26 Nov 2026): an ACTIVE dev or conductor key vouches for any
// commit; a SUPERSEDED key vouches only for a commit that is an ancestor of (or equal to) its superseded_in commit, the same proof as
// superseded.cjs: its private half outlives its session, so it must never sign a new change. A superseded key without superseded_in, a
// revoked one, or one with no ssh field counts for nothing.
export function keysFrom(keysJson) {
    const active = [], superseded = []
    for (const k of (keysJson && keysJson.keys) || []) {
        const ssh = String(k.ssh || '').trim()
        if (!AGENTS.test(k.agent || '') || !SSH.test(ssh)) continue
        const line = `${k.agent} namespaces="git" ${ssh}`
        if (k.status === 'active') active.push(line)
        else if (k.status === 'superseded' && k.superseded_in) superseded.push({ line, in: String(k.superseded_in) })
    }
    return { active, superseded }
}

export function checkSignedRoot({ root = ROOT, files = ROOT_FILES, keys = null, sshKeygen } = {}) {
    const errors = [], env = envProblem(root, sshKeygen ? { sshKeygen } : {})
    if (env) return [env]
    if (!keys) { try { keys = JSON.parse(fs.readFileSync(path.join(root, 'board/keys.json'), 'utf8')) } catch { return ['board/keys.json: unreadable'] } }
    const { active, superseded } = keysFrom(keys)
    if (!active.length && !superseded.length) return ['no dev or conductor key in board/keys.json']
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'signed-root-'))
    const verify = (c, lines) => { const f = path.join(tmp, 'allowed_signers'); fs.writeFileSync(f, lines.join('\n') + '\n')
        return tryGit(root, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${f}`, 'verify-commit', c]) !== null }
    try {
        for (const f of files) {
            if (!fs.existsSync(path.join(root, f))) { errors.push(`${f}: missing`); continue }
            if ((tryGit(root, ['status', '--porcelain', '--', f]) || '').trim()) { errors.push(`${f}: changed and not committed`); continue }
            const c = (tryGit(root, ['log', '--first-parent', '-1', '--format=%H', '--', f]) || '').trim()
            if (!c) { errors.push(`${f}: no commit found (the gate needs the repository's history)`); continue }
            let ok = active.length > 0 && verify(c, active)
            // a superseded key: only for a commit at or before the commit that superseded it
            for (const s of superseded) {
                if (ok) break
                const at = (tryGit(root, ['rev-parse', '--verify', '-q', `${s.in}^{commit}`]) || '').trim()
                if (at && tryGit(root, ['merge-base', '--is-ancestor', c, at]) !== null && verify(c, [s.line])) ok = true
            }
            if (!ok) errors.push(`${f}: last changed by ${c.slice(0, 9)}, not signed by an active dev or conductor key (or a superseded one before its superseded_in)`)
        }
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
    return errors
}
