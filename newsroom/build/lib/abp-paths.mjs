// A7 (cl-6.security's access review, 26 Nov 2026): a commit on dev stays in the paths its signer's ABP policy lets it write. Each first-parent commit
// after the snapshot's baseline is judged like this (the design is in the home repo's decisions.md, "A7", and cl-6.security's five points):
//   signed by an active key of board/keys.json as it stood in the PARENT (a commit that only publishes a key may be signed by that key): its agent's
//     `writes` globs, from newsroom/tools/abp-paths.json, must cover every file it changes, else a violation; an agent with no policy is reported
//     as "no policy", in its own category, and is neither a pass nor an error (A8 is Dinis's);
//   unsigned: exempt only when it changes exactly the release set (version.txt, versions.json, REALITY.md), whatever its author name says;
//     anything else is reported;
//   a merge is judged by its first-parent diff under its own signer, never exempt.
// A path match only says "may touch": board/keys.json and the gate's root files keep their own checks (keys-changes.mjs, signed-root.mjs).
// The verifier is named on the command line. Pure of the gate: root, snapshot and baseline are parameters. cl-6.dev@PrompTugal.dinis.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { ROOT } from './config.mjs'
import { envProblem } from './git-env.mjs'

export const RELEASE_SET = ['REALITY.md', 'newsroom/build/version.txt', 'newsroom/versions.json']
const SSH = /^(ecdsa-sha2-nistp256|ssh-ed25519) AAAA[A-Za-z0-9+/]{40,}={0,3}$/
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'] })
const tryGit = (cwd, args) => { try { return git(cwd, args) } catch { return null } }

// a glob of the policy: ** crosses folders, * does not
export const globRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*') + '$')
export const covers = (globs, file) => globs.some(g => globRe(g).test(file))
export const roleOf = agent => String(agent || '').replace(/@PrompTugal\.dinis$/, '')

const keysAt = (root, c) => { try { return JSON.parse(git(root, ['show', `${c}:board/keys.json`])).keys || [] } catch { return [] } }

export function checkAbpPaths({ root = ROOT, snapshot = null, sshKeygen } = {}) {
    const env = envProblem(root, sshKeygen ? { sshKeygen } : {}); if (env) return { violations: [env], noPolicy: [], unsigned: [] }
    if (!snapshot) { try { snapshot = JSON.parse(fs.readFileSync(path.join(root, 'newsroom/tools/abp-paths.json'), 'utf8')) } catch { return { violations: ['no snapshot (newsroom/tools/abp-paths.json)'], noPolicy: [], unsigned: [] } } }
    const out = { violations: [], noPolicy: [], unsigned: [] }, base = snapshot.baseline
    if (!base || tryGit(root, ['cat-file', '-e', `${base}^{commit}`]) === null) return { violations: ['the baseline commit is not in this checkout'], noPolicy: [], unsigned: [] }
    const roles = snapshot.roles || {}, tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'abp-paths-'))
    let n = 0
    try {
        const commits = (tryGit(root, ['rev-list', '--first-parent', '--reverse', `${base}..HEAD`]) || '').split('\n').filter(Boolean)
        for (const c of commits) {
            const parent = (tryGit(root, ['rev-parse', `${c}^`]) || '').trim(); if (!parent) continue
            const files = (tryGit(root, ['diff', '--name-only', parent, c]) || '').split('\n').filter(Boolean); if (!files.length) continue
            const at = c.slice(0, 9), keysOnly = files.every(f => f === 'board/keys.json')
            const allowed = (keysOnly ? [...keysAt(root, parent), ...keysAt(root, c)] : keysAt(root, parent)).filter(k => k.status === 'active' && k.agent && SSH.test(String(k.ssh || '').trim()))
            const f = path.join(tmp, `allowed${n++}`)
            fs.writeFileSync(f, allowed.map(k => `${k.agent} namespaces="git" ${String(k.ssh).trim()}`).join('\n') + '\n')
            const sig = (tryGit(root, ['-c', 'gpg.format=ssh', '-c', 'gpg.ssh.program=ssh-keygen', '-c', `gpg.ssh.allowedSignersFile=${f}`, 'log', '-1', '--format=%G?%n%GS', c]) || '').split('\n')
            const signer = sig[0] === 'G' ? sig[1] : ''
            if (!signer) {
                if (files.every(x => RELEASE_SET.includes(x))) continue          // the release commit, unsigned: exactly the release set
                out.unsigned.push(`${at}: not signed by an active key of board/keys.json (${files.length} file${files.length === 1 ? '' : 's'}, first ${files[0]})`); continue
            }
            const globs = roles[roleOf(signer)]
            if (!globs) { out.noPolicy.push(`${at}: ${signer} has no policy in the snapshot (${files.length} file${files.length === 1 ? '' : 's'})`); continue }
            const outside = files.filter(x => !covers(globs, x))
            if (outside.length) out.violations.push(`${at}: ${roleOf(signer)} changed ${outside.length} file${outside.length === 1 ? '' : 's'} outside its policy (first ${outside[0]})`)
        }
    } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
    return out
}
