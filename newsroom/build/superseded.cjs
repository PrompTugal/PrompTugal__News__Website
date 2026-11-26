'use strict'
// Does a superseded key still vouch for a signature? Only for one made while the key was active (security@ S1, cl-6.security,
// 26 November 2026; the gate had accepted any superseded key's signature, whenever it was made).
// A signature file carries no time, and a commit's time can be set by whoever commits (GIT_COMMITTER_DATE), so the proof is
// ancestry, which cannot be backdated without a rewrite of history (forbidden here): find the first commit on the branch's
// first-parent line where board/keys.json has the key as superseded; the .sig counts only if its blob at HEAD is the same blob
// it was at that commit. Absent there, changed since, dirty, or no such commit: refused.
// `git(args)` runs git in the repository and returns stdout (it throws on a non-zero exit).
const KEYS = 'board/keys.json'

function supersededAtCommit(git, commit, keyId) {
    let keys
    try { keys = JSON.parse(git(['show', `${commit}:${KEYS}`])).keys || [] } catch { return false }
    const k = keys.find(k => k.id === keyId)
    return !!k && k.status === 'superseded'
}

// the first commit (oldest) on HEAD's first-parent line at which the key is superseded, or null. The state only moves one way
// (a key is never made active again), so a binary search over the commits that touched board/keys.json finds it; it checks the
// commit before is not superseded. If a key were ever set back to active, the search may land on a later supersede commit: still a
// point at which it was superseded, so it is never an opening, only stricter. (cl-6.security, 26 Nov 2026.)
function findSupersedeCommit(git, keyId) {
    const list = git(['rev-list', '--first-parent', '--reverse', 'HEAD', '--', KEYS]).split('\n').filter(Boolean)
    if (!list.length || !supersededAtCommit(git, list[list.length - 1], keyId)) return null
    let lo = 0, hi = list.length - 1
    while (lo < hi) { const mid = (lo + hi) >> 1; if (supersededAtCommit(git, list[mid], keyId)) hi = mid; else lo = mid + 1 }
    return list[lo]
}

const blob = (git, spec) => { try { return git(['rev-parse', '--verify', '-q', spec]).trim() } catch { return '' } }

// true when the superseded key `key` vouches for the committed, clean .sig at `sig` (a path from the repository root)
function supersededVouches(git, key, sig) {
    if (!key || key.status !== 'superseded') return false
    try {
        if (git(['status', '--porcelain', '--', sig]).trim()) return false
        const head = blob(git, `HEAD:${sig}`)
        if (!head) return false
        const commit = findSupersedeCommit(git, key.id)
        if (!commit) return false
        // a recorded superseded_in must be that commit (the board's own note must agree with the history)
        if (key.superseded_in && !commit.startsWith(String(key.superseded_in))) return false
        return blob(git, `${commit}:${sig}`) === head
    } catch { return false }
}
module.exports = { supersededVouches, findSupersedeCommit }
