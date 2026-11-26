// prints the A7 findings one per line with their category (run by validate.js in a child process: the check is an ES module)
import { checkAbpPaths } from './abp-paths.mjs'
const r = checkAbpPaths()
for (const [k, v] of Object.entries(r)) for (const p of v) console.log(`${k}: ${p}`)
