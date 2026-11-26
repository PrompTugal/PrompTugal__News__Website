// prints the problems checkKeyChanges finds, one per line (run by validate.js in a child process: the check is an ES module)
import fs from 'node:fs'
import path from 'node:path'
import { checkKeyChanges } from './keys-changes.mjs'
import { ROOT } from './config.mjs'
let operators = []
try { operators = JSON.parse(fs.readFileSync(path.join(ROOT, 'newsroom/tools/operator-keys.json'), 'utf8')).operators.map(o => typeof o === 'string' ? o : o.ssh_fingerprint).filter(f => /^SHA256:[A-Za-z0-9+/]{43}$/.test(f || '')) } catch { }
for (const p of checkKeyChanges({ operators })) console.log(p)
