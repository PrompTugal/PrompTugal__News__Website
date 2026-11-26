// What signed-commit checks need from the machine, said plainly (cl-6.maestro's ask of 26 Nov 2026, after sherpa.d's gate went red in a container
// without ssh-keygen and the gate blamed the signer): ssh-keygen to verify an SSH signature, and the repository's whole history. Returns a
// sentence naming what to fix, or null when the machine is fine.
import { execFileSync, spawnSync } from 'node:child_process'

export function envProblem(root, { sshKeygen = 'ssh-keygen' } = {}) {
    const r = spawnSync(sshKeygen, ['-?'], { stdio: 'ignore' })
    if (r.error && r.error.code === 'ENOENT') return `${sshKeygen} not found: install openssh-client (this is the machine, not a bad signature)`
    try {
        if (execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim() === 'true')
            return 'shallow clone: run git fetch --unshallow (signatures are checked against the history; this is the clone, not a bad signature)'
    } catch { /* not a git repository: the checks say so themselves */ }
    return null
}
