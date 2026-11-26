// prints the problems checkKeyChanges finds, one per line (run by validate.js in a child process: the check is an ES module)
import { checkKeyChanges } from './keys-changes.mjs'
for (const p of checkKeyChanges()) console.log(p)
