// The browser's onboarding code against the sweep's Python (newsroom/tools/obs/claims_lib.py): what Python signs and
// encrypts, onboard-core.js must derive, verify and open. Skipped where python3 or its cryptography package is missing.
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as O from '../../../assets/onboard/onboard-core.js'

const here = path.dirname(fileURLToPath(import.meta.url))
let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
let v
try { v = JSON.parse(execFileSync('python3', ['-I', path.join(here, 'onboard_interop_mint.py')], { encoding: 'utf8', timeout: 60000 })) }
catch (e) { console.log('skipped: python3 with cryptography is not available (' + String(e.message).split('\n')[0] + ')'); process.exit(0) }

const issuers = await O.issuersFromConfig({ issuer: v.issuer })
check(issuers.size === 1, 'config: the issuer’s PEM hashes to its pinned fingerprint')
check(!(await O.issuersFromConfig({ issuer: { ...v.issuer, fingerprint: 'sha256:0000000000000000' } })).size, 'config: a PEM that does not hash to the pin is refused')
const d = await O.derive(v.api_key)
check(d.lookup === v.lookup, 'python and browser derive the same lookup')
check(await O.verifyPool(v.pool, issuers), 'the browser verifies the pool python signed')
check(!(await O.verifyPool({ ...v.pool, updated: 'x' }, issuers)), 'a changed pool does not verify')
const lic = await O.openLicence(v.licence_file, v.api_key, { issuers })
check(lic.access_key === 'pilot-token-for-interop' && lic.lookup === v.lookup, 'the browser opens the licence python encrypted and signed')
check(await O.verifySigned(v.message_inner, issuers.get(v.issuer.fingerprint).sign), 'the browser verifies a message python signed')
console.log(failed ? `\n${failed} FAILED` : '\nALL INTEROP CHECKS PASS')
process.exit(failed ? 1 : 0)
