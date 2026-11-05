#!/usr/bin/env node
// The gate's checks that need the ES modules (called by admin/build/validate.js after it has built the site):
//   data       every data file against its schema, every reference resolved, derived files fresh (lib/datacheck.mjs)
//   features   each feature's own validate(gate) hook (the graph feature checks the graphs and the API, for example)
// Prints a JSON list of problems, each "check: problem"; an empty list is a pass.
import fs from 'node:fs'
import crypto from 'node:crypto'
import * as config from './lib/config.mjs'
import { checkData } from './lib/datacheck.mjs'
import { loadFeatures } from './lib/features.mjs'

const problems = []
try { for (const e of checkData()) problems.push(`data: ${e}`) } catch (e) { problems.push(`data: the check failed: ${e.stack || e}`) }
const gate = {
    ...config,
    generated: new Set(fs.readFileSync(config.R('.generated.txt'), 'utf8').split('\n').filter(Boolean)),
    json: p => JSON.parse(fs.readFileSync(config.R(p), 'utf8')),
    text: p => fs.readFileSync(config.R(p), 'utf8'),
    sha256: s => crypto.createHash('sha256').update(s).digest('hex'),
}
for (const f of await loadFeatures()) {
    if (!f.validate) continue
    try { for (const e of await f.validate(gate)) problems.push(`${f.name}: ${e}`) } catch (e) { problems.push(`${f.name}: the check failed: ${e.stack || e}`) }
}
process.stdout.write(JSON.stringify(problems))
