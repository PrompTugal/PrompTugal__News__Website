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

export const ROOT_FILES = ['newsroom/tools/place-signers.json', 'newsroom/tools/place-sources.json']
const AGENTS = /^(cl-\d+\.)?(dev|conductor)@PrompTugal\.dinis$/
const SSH = /^(ecdsa-sha2-nistp256|ssh-ed25519) AAAA[A-Za-z0-9+/]{40,}={0,3}$/

const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] })
const tryGit = (cwd, args) => { try { return git(cwd, args) } catch { return null } }

// the allowed signers from board/keys.json: every key of a dev or conductor agent that is not revoked
export function signersFrom(keysJson) {
    const out = []
    for (const k of (keysJson && keysJson.keys) || []) {
        const ssh = String(k.ssh || '').trim()
        if (AGENTS.test(k.agent || '') && k.status !== 'revoked' && SSH.test(ssh)) out.push(`${k.agent} namespaces="git" ${ssh}`)
    }
    return out
}

export function checkSignedRoot({ root = ROOT, files = ROOT_FILES, keys = null } = {}) {
    const errors = []
    if (!keys) { try { keys = JSON.parse(fs.readFileSync(path.join(root, 'board/keys.json'), 'utf8')) } catch { return ['board/keys.json: unreadable'] } }
    const signers = signersFrom(keys)
    if (!signers.length) return ['no dev or conductor key in board/keys.json']
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'signed-root-')), allowed = path.join(tmp, 'allowed_signers')
    fs.writeFileSync(allowed, signers.join('\n') + '\n')
    try {
        for (const f of files) {
            if (!fs.existsSync(path.join(root, f))) { errors.push(`${f}: missing`); continue }
            if ((tryGit(root, ['status', '--porcelain', '--', f]) || '').trim()) { errors.push(`${f}: changed and not committed`); continue }
            const c = (tryGit(root, ['log', '--first-parent', '-1', '--format=%H', '--', f]) || '').trim()
            if (!c) { errors.push(`${f}: no commit found (the gate needs the repository's history)`); continue }
            if (tryGit(root, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${allowed}`, 'verify-commit', c]) === null) errors.push(`${f}: last changed by ${c.slice(0, 9)}, not signed by a dev or conductor key in board/keys.json`)
        }
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
    return errors
}
