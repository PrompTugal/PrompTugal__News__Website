#!/usr/bin/env node
// The site-identity check of abp@PrompTugal.dinis (board/abp/policies.json, site_identity; Dinis, 15 November 2026:
// "make sure that each site has a PKI identity"; board/briefs/2026-11-15-the-place-agents.md). No dependencies.
//
// For every place in data/by-place/places.json:
//   agent key   an active entry in board/keys.json for place.<id>@PrompTugal.dinis (id place.<id>-promptugal[-b...])
//   site key    an active entry with id site.<id>-promptugal[-b...], "kind": "site", "site": https://promptugal.news/<path>
//   identity    data/by-place/<id>.json has identity.key_id = the site key's id and identity.signed_by = the agent
//   signature   data/by-place/<id>.json.sig (pki-agent.mjs sign: ECDSA P-256 over the file's raw bytes) is by the
//               site key and verifies over the file as committed
//
//   node board/abp/tools/site-identity.mjs            a table; exit 0 (warning mode, tonight)
//   node board/abp/tools/site-identity.mjs --warn     one "WARN site-identity: ..." line per gap, for the gate
//   node board/abp/tools/site-identity.mjs --json     the results as JSON
//   node board/abp/tools/site-identity.mjs --strict   exit 1 when any place fails (the gate, once Dinis says so)
//   import { checkSites } from './board/abp/tools/site-identity.mjs'   checkSites(root) -> [{ id, ok, problems, ... }]
//
// How a place agent makes its site key without clouding its own identity (the hooks read ~/.sg-send/keys/ and a second
// label there makes the session unidentified): keep the site key in its own home,
//   PKI_AGENT_HOME=~/.sg-send/sites/<id> node pki-agent.mjs keygen --session --name site.<id>-promptugal
//   PKI_AGENT_HOME=~/.sg-send/sites/<id> node pki-agent.mjs sign data/by-place/<id>.json
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const SITE = 'https://promptugal.news/'

const readJson = (root, f) => { try { return JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')) } catch { return null } }
const idRe = (prefix, id) => new RegExp(`^${prefix}\\.${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-promptugal(-[a-z0-9]+)?$`)
const latest = list => list.sort((a, b) => String(b.added || '').localeCompare(String(a.added || '')) || String(b.id).localeCompare(String(a.id)))[0]

export function checkSites(root = DEFAULT_ROOT) {
    const places = (readJson(root, 'data/by-place/places.json') || {}).places || []
    const keys = (readJson(root, 'board/keys.json') || {}).keys || []
    return places.map(p => {
        const agent = p.agent || `place.${p.id}@PrompTugal.dinis`
        const url = SITE + (p.path || '')
        const problems = []
        const agentKeys = keys.filter(k => k.kind !== 'site' && !/^site\./.test(k.id || '') && (k.agent === agent || idRe('place', p.id).test(k.id || '')))
        const agentKey = latest(agentKeys.filter(k => k.status === 'active'))
        if (!agentKey) problems.push(agentKeys.length ? `agent key: no active key for ${agent} (${agentKeys.map(k => `${k.id} ${k.status}`).join(', ')})` : `agent key: none for ${agent} (place.${p.id}-promptugal in board/keys.json)`)
        const siteKeys = keys.filter(k => idRe('site', p.id).test(k.id || ''))
        const siteKey = latest(siteKeys.filter(k => k.status === 'active'))
        if (!siteKey) problems.push(siteKeys.length ? `site key: no active site.${p.id}-promptugal (${siteKeys.map(k => `${k.id} ${k.status}`).join(', ')})` : `site key: none (site.${p.id}-promptugal in board/keys.json)`)
        else {
            if (siteKey.kind !== 'site') problems.push(`site key: ${siteKey.id} has no "kind": "site"`)
            if (siteKey.site !== url) problems.push(`site key: ${siteKey.id} has "site": ${JSON.stringify(siteKey.site || null)}, expected ${url}`)
            if (!siteKey.bundle || !siteKey.bundle.sign || !siteKey.bundle.signing_fingerprint) problems.push(`site key: ${siteKey.id} has no bundle.sign or bundle.signing_fingerprint`)
            if (agentKey && agentKey.bundle && siteKey.bundle && agentKey.bundle.signing_fingerprint === siteKey.bundle.signing_fingerprint) problems.push(`site key: ${siteKey.id} is the agent's own key; the site needs a key of its own`)
        }
        const file = `data/by-place/${p.id}.json`, sigFile = `${file}.sig`
        let bytes = null, data = null
        try { bytes = fs.readFileSync(path.join(root, file)); data = JSON.parse(bytes.toString('utf8')) } catch { problems.push(`file: ${file} missing or not JSON`) }
        if (data) {
            const ident = data.identity || {}
            if (!ident.key_id) problems.push(`identity: ${file} has no identity.key_id`)
            else if (siteKey && ident.key_id !== siteKey.id) problems.push(`identity: identity.key_id is ${ident.key_id}, expected ${siteKey.id}`)
            if (!ident.signed_by) problems.push(`identity: ${file} has no identity.signed_by`)
            else if (ident.signed_by !== agent) problems.push(`identity: identity.signed_by is ${ident.signed_by}, expected ${agent}`)
        }
        let signature = 'missing'
        if (bytes && fs.existsSync(path.join(root, sigFile))) {
            const s = readJson(root, sigFile)
            if (!s || !s.signature || !s.fingerprint) { signature = 'malformed'; problems.push(`signature: ${sigFile} has no signature or fingerprint`) }
            else {
                const signer = keys.find(k => k.bundle && k.bundle.signing_fingerprint === s.fingerprint)
                if (siteKey && siteKey.bundle && s.fingerprint !== siteKey.bundle.signing_fingerprint) { signature = 'wrong-key'; problems.push(`signature: by ${signer ? signer.id : s.fingerprint}, not by the site key ${siteKey.id}`) }
                else if (!siteKey) { signature = 'unchecked'; problems.push(`signature: by ${signer ? signer.id : s.fingerprint}; no site key to check it against`) }
                else {
                    let ok = false
                    try { ok = crypto.verify('sha256', bytes, { key: siteKey.bundle.sign, dsaEncoding: 'ieee-p1363' }, Buffer.from(s.signature, 'base64')) } catch (e) { problems.push(`signature: cannot verify (${e.message})`) }
                    signature = ok ? 'valid' : 'invalid'
                    if (!ok) problems.push(`signature: does not verify over ${file} (the file changed since it was signed: sign it again with the site key)`)
                }
            }
        } else if (bytes) problems.push(`signature: no ${sigFile}`)
        return { id: p.id, name: p.name, agent, site: url, agent_key: agentKey ? agentKey.id : null, site_key: siteKey ? siteKey.id : null, signature, ok: problems.length === 0, problems }
    })
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
    const root = (() => { const i = process.argv.indexOf('--root'); return i > 0 ? path.resolve(process.argv[i + 1]) : DEFAULT_ROOT })()
    const rows = checkSites(root)
    const bad = rows.filter(r => !r.ok)
    if (process.argv.includes('--json')) console.log(JSON.stringify({ checked: rows.length, ok: rows.length - bad.length, places: rows }, null, 1))
    else if (process.argv.includes('--warn')) {
        for (const r of bad) console.log(`WARN site-identity: ${r.id}: ${r.problems.join('; ')}`)
        console.log(`site-identity: ${rows.length - bad.length} of ${rows.length} places with agent key, site key and a valid signature`)
    } else {
        const w = Math.max(...rows.map(r => r.id.length), 4)
        console.log(`${'place'.padEnd(w)}  agent key  site key  signature`)
        for (const r of rows) console.log(`${r.id.padEnd(w)}  ${(r.agent_key ? 'yes' : 'NO').padEnd(9)}  ${(r.site_key ? 'yes' : 'NO').padEnd(8)}  ${r.signature}${r.ok ? '' : '   ' + r.problems.filter(x => !/^(agent key|site key): none/.test(x) && !/^signature: no /.test(x)).join('; ')}`)
        console.log(`\n${rows.length - bad.length} of ${rows.length} places pass (board/abp/policies.json site_identity)`)
    }
    if (process.argv.includes('--strict') && bad.length) process.exitCode = 1
}
