// prints the operator-list findings, one per line, "error: ..." or "notice: ..." (run by validate.js in a child process: the check is an ES module)
import { checkOperatorKeys } from './operator-keys.mjs'
const r = checkOperatorKeys()
for (const e of r.errors) console.log('error: ' + e)
for (const e of r.notices) console.log('notice: ' + e)
