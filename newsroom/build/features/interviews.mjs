// Interviews whose video lives in a public SG/Vault (journalist@PrompTugal.dinis, 10 November 2026, at Dinis Cruz's word:
// "the video should go on the vault, and you need to embed the vault on the page").
//   Load       desks/journalist-promptugal/interviews/*.md (front matter: rel, title, summary, the vault's endpoint, id,
//              public read key and the video's folder; the body, with a line PTVIDEO where the player goes)
//   Transform  the page; PTVIDEO becomes <figure class="vault-video"> with the vault's coordinates as data-*
//   Save       <rel> and its twin. While status says "unlisted": noindex, kept out of the sitemap and linked only from the newsroom (the gate wants every page linked and in llms.txt)
//   Front      <!-- interviews:front --> in content/index.md: a band with every published interview's player, newest first
//              (Dinis, 10 November 2026, THE RESTART: the interviews on the home page, board/guidance/2026-11-10-the-restart.md)
// The player is assets/vault-video/vault-video.js over SGVaultEmbed.Reader: the browser fetches ciphertext from the vault's
// read API and decrypts it; only a public read key (sgit_public_read_ + 64 hex) is ever on the page.
import fs from 'node:fs'
import path from 'node:path'
import { frontMatter, slug } from '../lib/markdown.mjs'
export const order = 91

const DIR = 'desks/journalist-promptugal/interviews'
const R = f => new URL(`../../../${f}`, import.meta.url)
const READ_KEY = /^sgit_public_read_[0-9a-f]{64}$/

// Transcripts (journalist@web-summit.indi, 10 November 2026, at Indi Gupte's word: "a pill design tab where users can
// toggle between the article and the transcript with the video at the top", the toggle visible while scrolling, on every
// page with a video, an article and a transcript). desks/journalist-promptugal/interviews/transcripts/*.md (front
// matter: person, company; the body is the transcript). An interview takes the transcript named in its front matter
// (transcript: <file>.md), or the one with the same company and person. A transcript with no page yet waits for it.
const TDIR = `${DIR}/transcripts`
const plain = s => slug(String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
const key = m => `${plain(m.company)}--${plain(m.person)}`
function transcripts() {
    if (!fs.existsSync(R(TDIR))) return []
    return fs.readdirSync(R(TDIR)).filter(f => f.endsWith('.md')).sort().map(f => {
        const src = `${TDIR}/${f}`, { meta, body } = frontMatter(fs.readFileSync(R(src), 'utf8'))
        return { file: f, src, meta, body: body.trim() }
    })
}
const transcriptFor = meta => transcripts().find(t => meta.transcript ? t.file === meta.transcript : key(t.meta) === key(meta))

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
        const t = transcriptFor(meta), twinVideo = `The video is played from PrompTugal's public interviews vault (${meta.vault_id}), folder ${meta.vault_path}.`
        const js = ['assets/vendor/sgit-ai/2026-11-05/vault-embed.js', 'assets/vault-video/vault-video.js']
        // with a transcript: the video first, then the pills (sticky), then the article and the transcript as two panels
        const tMd = t && `## Transcript {#transcript}\n\n{.iv-tnote}\n${t.meta.note}\n\n${t.body}\n`
        const md = !t ? body : `PTVIDEO\n\n::: iv-tabs\n[Article](#article) [Transcript](#transcript)\n:::\n\n::: iv-panel\n## Article {#article}\n\n${body.replace(/^PTVIDEO$/m, '').trim()}\n:::\n\n::: iv-panel\n${tMd}:::\n`
        return {
            rel: meta.rel, src, type: 'site', title: meta.title, summary: meta.summary, date: meta.date,
            listed: true, noindex: unlisted, meta: { ...meta, noindex: unlisted },
            crumbs: [[null, meta.title]],
            assets: { css: ['assets/vault-video/vault-video.css'], js: t ? [...js, 'assets/vault-video/iv-tabs.js'] : js },
            md, twinMd: body.replace(/^PTVIDEO$/m, twinVideo) + (t ? `\n\n${tMd.replace('{.iv-tnote}\n', '')}` : ''),
            postHtml: h => h.replace('<p>PTVIDEO</p>', widget),
        }
    })
}

const figure = (esc, m, caption) => `<figure class="vault-video" data-endpoint="${esc(m.vault_endpoint)}" data-vault="${esc(m.vault_id)}" data-key="${esc(m.vault_read_key)}" data-path="${esc(m.vault_path)}">` +
    `<figcaption>${caption}</figcaption></figure>`
const published = () => sources().filter(s => !/unlisted/.test(s.meta.status || '')).sort((a, b) => String(b.meta.recorded || '').localeCompare(String(a.meta.recorded || '')))

// the home page's band: the md has a placeholder per interview, the HTML gets the players (decorate adds the assets)
export const fill = {
    'interviews:front': (page, ctx) => {
        const list = published()
        if (!list.length) return ''
        const items = list.map(({ meta }, i) => `::: iv-card\nPTIFRONT-${i}\n\n**[${ctx.md.cell(meta.title)}](${ctx.link(page.rel, meta.rel)})**\n\n${ctx.md.cell(meta.home || meta.summary)}\n:::`).join('\n')
        return `::: interviews-band\n## Interviews from the summit {#interviews}\n\n{.iv-dek}\nOur editors' interviews at Web Summit Lisbon 2026, played from PrompTugal's public vault and decrypted in your browser.\n\n::: iv-grid\n${items}\n:::\n:::\n`
    },
}
export function decorate(p, ctx) {
    if (p.rel !== 'index.html' || !published().length) return
    p.assets = { ...(p.assets || {}), css: [...(p.assets?.css || []), 'assets/vault-video/vault-video.css'], js: [...(p.assets?.js || []), 'assets/vendor/sgit-ai/2026-11-05/vault-embed.js', 'assets/vault-video/vault-video.js'] }
    const prev = p.postHtml, esc = ctx.md.esc
    p.postHtml = h => (prev ? prev(h) : h).replace(/<p>PTIFRONT-(\d+)<\/p>/g, (m, i) => {
        const x = published()[+i]; if (!x) return ''
        return figure(esc, x.meta, `${esc(x.meta.person)}, ${esc(x.meta.company)}, interviewed by ${esc(x.meta.interviewer)}`)
    })
}

// The videos for the apps (conductor-newsapp@web-summit.indi, 10 November 2026, at Indi's word: "people need to watch
// videos within the app"): every published interview, newest first, with the same public coordinates its page carries
// (the vault's endpoint, id, public read key and the video's folder), so the iPhone and iPad app plays it natively.
export function api(ctx) {
    const items = published().map(({ meta }) => ({
        title: meta.title, person: meta.person, company: meta.company, interviewer: meta.interviewer,
        date: meta.date, recorded: meta.recorded || '', summary: meta.home || meta.summary, page: meta.rel,
        vault: { endpoint: meta.vault_endpoint, id: meta.vault_id, read_key: meta.vault_read_key, path: meta.vault_path },
    }))
    return [{ path: 'api/v1/live/videos.json', schema: null, data: { version: ctx.VERSION, about: 'Interview videos for the apps, newest first.', count: items.length, items } }]
}

export const llms = ctx => `## Interview videos\n- [api/v1/live/videos.json](${ctx.BASE}api/v1/live/videos.json): interview videos for the apps.\n\n`

export function validate() {
    const errors = []
    for (const { src, meta, body } of sources()) {
        for (const k of ['rel', 'title', 'summary', 'vault_endpoint', 'vault_id', 'vault_read_key', 'vault_path', 'person', 'company', 'interviewer'])
            if (!meta[k]) errors.push(`${src}: front matter needs ${k}`)
        if (meta.vault_read_key && !READ_KEY.test(meta.vault_read_key)) errors.push(`${src}: vault_read_key must be a public read key (sgit_public_read_ + 64 hex), never a vault key`)
        if (!/^PTVIDEO$/m.test(body)) errors.push(`${src}: the body needs a line PTVIDEO where the video goes`)
        if (meta.transcript && !transcripts().some(t => t.file === meta.transcript)) errors.push(`${src}: transcript ${meta.transcript} is not in ${TDIR}`)
    }
    for (const t of transcripts()) {
        for (const k of ['person', 'company', 'note']) if (!t.meta[k]) errors.push(`${t.src}: front matter needs ${k}`)
        if (!t.body) errors.push(`${t.src}: the transcript is empty`)
        if (/^#{1,2}\s/m.test(t.body)) errors.push(`${t.src}: no headings of level 1 or 2 in a transcript (the page adds "Transcript")`)
    }
    return errors
}
