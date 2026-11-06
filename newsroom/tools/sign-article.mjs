#!/usr/bin/env node
// Sign an article so the signature survives releases: the signature covers the twin without the site version
// (newsroom/build/signed-form.cjs), not the twin as built, which changes at every release.
//
//   node newsroom/build/build.mjs
//   PKI_AGENT=/path/to/pki-agent.mjs node newsroom/tools/sign-article.mjs <slug> [<slug> ...]
//
// It writes the version-free form to a temporary file, signs it with your session key through pki-agent.mjs
// (`pki-agent.mjs sign <file>`, from https://pki.sgit.ai/agents/pki-agent.mjs; default ./pki-agent.mjs), and writes
// articles/<slug>.md.sig with the signature, your signing fingerprint and "form". Commit that .sig. The gate
// (check 8) verifies it against the signer's entry in board/keys.json; your entry must be there and active.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const { FORM, signedForm } = createRequire(import.meta.url)(path.join(ROOT, 'newsroom/build/signed-form.cjs'))
const PKI = path.resolve(process.env.PKI_AGENT || 'pki-agent.mjs')
const slugs = process.argv.slice(2)
if (!slugs.length) { console.error('usage: node newsroom/tools/sign-article.mjs <slug> [...]'); process.exit(2) }
if (!fs.existsSync(PKI)) { console.error(`no pki-agent.mjs at ${PKI}: set PKI_AGENT`); process.exit(2) }

const keys = JSON.parse(fs.readFileSync(path.join(ROOT, 'board/keys.json'), 'utf8')).keys
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sign-article-'))
try {
    for (const slug of slugs) {
        const twin = path.join(ROOT, 'articles', `${slug}.md`)
        if (!fs.existsSync(twin)) { console.error(`no articles/${slug}.md: build first`); process.exit(1) }
        const form = path.join(tmp, `${slug}.md`)
        fs.writeFileSync(form, signedForm(fs.readFileSync(twin, 'utf8')))
        execFileSync('node', [PKI, 'sign', form], { stdio: ['ignore', 'ignore', 'inherit'] })
        const s = JSON.parse(fs.readFileSync(form + '.sig', 'utf8'))
        const k = keys.find(k => k.bundle && k.bundle.signing_fingerprint === s.fingerprint)
        if (!k) console.error(`warning: ${s.fingerprint} is not in board/keys.json yet; the gate will refuse this signature until it is`)
        fs.writeFileSync(path.join(ROOT, 'articles', `${slug}.md.sig`), JSON.stringify({ ...s, form: FORM }, null, 2) + '\n')
        console.log(`articles/${slug}.md.sig: signed by ${s.fingerprint}${k ? ` (${k.id})` : ''}, form ${FORM}`)
    }
} finally { fs.rmSync(tmp, { recursive: true, force: true }) }
