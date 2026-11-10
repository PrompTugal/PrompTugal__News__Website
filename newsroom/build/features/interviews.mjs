// Interviews whose video lives in a public SG/Vault (journalist@PrompTugal.dinis, 10 November 2026, at Dinis Cruz's word:
// "the video should go on the vault, and you need to embed the vault on the page").
//   Load       desks/journalist-promptugal/interviews/*.md (front matter: rel, title, summary, the vault's endpoint, id,
//              public read key and the video's folder; the body, with a line PTVIDEO where the player goes)
//   Transform  the page; PTVIDEO becomes <figure class="vault-video"> with the vault's coordinates as data-*
//   Save       <rel> and its twin. While status says "unlisted": noindex, kept out of the sitemap and linked only from the newsroom (the gate wants every page linked and in llms.txt)
// The player is assets/vault-video/vault-video.js over SGVaultEmbed.Reader: the browser fetches ciphertext from the vault's
// read API and decrypts it; only a public read key (sgit_public_read_ + 64 hex) is ever on the page.
import fs from 'node:fs'
import path from 'node:path'
import { frontMatter } from '../lib/markdown.mjs'
export const order = 91

const DIR = 'desks/journalist-promptugal/interviews'
const R = f => new URL(`../../../${f}`, import.meta.url)
const READ_KEY = /^sgit_public_read_[0-9a-f]{64}$/

function sources() {
    if (!fs.existsSync(R(DIR))) return []
    return fs.readdirSync(R(DIR)).filter(f => f.endsWith('.md')).sort().map(f => {
        const src = `${DIR}/${f}`, { meta, body } = frontMatter(fs.readFileSync(R(src), 'utf8'))
        return { src, meta, body }
    })
}

export function pages(ctx) {
    return sources().map(({ src, meta, body }) => {
        const esc = ctx.md.esc, unlisted = /unlisted/.test(meta.status || '')
        const widget = `<figure class="vault-video" data-endpoint="${esc(meta.vault_endpoint)}" data-vault="${esc(meta.vault_id)}" data-key="${esc(meta.vault_read_key)}" data-path="${esc(meta.vault_path)}">` +
            `<figcaption>${esc(meta.person)}, ${esc(meta.company)}, interviewed by ${esc(meta.interviewer)}. Played from vault <code>${esc(meta.vault_id)}</code>, decrypted in your browser.</figcaption></figure>`
        return {
            rel: meta.rel, src, type: 'site', title: meta.title, summary: meta.summary, date: meta.date,
            listed: true, noindex: unlisted, meta: { ...meta, noindex: unlisted },
            crumbs: [[null, meta.title]],
            assets: { css: ['assets/vault-video/vault-video.css'], js: ['assets/vendor/sgit-ai/2026-11-05/vault-embed.js', 'assets/vault-video/vault-video.js'] },
            md: body, twinMd: body.replace(/^PTVIDEO$/m, `The video is played from PrompTugal's public interviews vault (${meta.vault_id}), folder ${meta.vault_path}.`),
            postHtml: h => h.replace('<p>PTVIDEO</p>', widget),
        }
    })
}

export function validate() {
    const errors = []
    for (const { src, meta, body } of sources()) {
        for (const k of ['rel', 'title', 'summary', 'vault_endpoint', 'vault_id', 'vault_read_key', 'vault_path', 'person', 'company', 'interviewer'])
            if (!meta[k]) errors.push(`${src}: front matter needs ${k}`)
        if (meta.vault_read_key && !READ_KEY.test(meta.vault_read_key)) errors.push(`${src}: vault_read_key must be a public read key (sgit_public_read_ + 64 hex), never a vault key`)
        if (!/^PTVIDEO$/m.test(body)) errors.push(`${src}: the body needs a line PTVIDEO where the video goes`)
    }
    return errors
}
