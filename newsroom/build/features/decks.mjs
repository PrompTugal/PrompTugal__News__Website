// The investor decks on the site (Dinis, 7 November 2026, about 09:45 UTC: "Put this on the website in HTML and
// available to download. Version control it."; board/team/investors/dinis-2026-11-07-go-live-and-structure.md).
//   Load       investors@'s decks: board/team/investors/decks/src/<name>.deck (self-contained HTML, 1920x1080 slides),
//              their deck.css and deck.js, and the PDF beside each (<name>.pdf)
//   Transform  each deck into a page of the build, /investors/decks/<name>/: its own markup kept (page.raw, the shell adds
//              the head tags, the version badge and the agent block), its images pointing at board/ (served), its
//              stylesheet and script copied out of board/ (no script is served from board/: S1b); the markdown twin is
//              the slides' text, heading by heading
//   Save       the pages, investors/decks/deck.css and deck.js; /investors/decks/ lists "Open" for each (postHtml)
import fs from 'node:fs'
import path from 'node:path'
export const order = 61

const DIR = 'board/team/investors/decks/', SRC = DIR + 'src/', OUT = 'investors/decks/'
const decks = ctx => fs.existsSync(ctx.R(SRC)) ? fs.readdirSync(ctx.R(SRC)).filter(f => f.endsWith('.deck')).sort() : []
const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()

// the slides as markdown: each slide's headings and paragraphs, in order
function twinOf(html) {
    const out = []
    for (const s of html.split(/<section\b/).slice(1)) {
        for (const m of s.matchAll(/<(h1|h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
            const t = strip(m[2]); if (!t) continue
            out.push(m[1] === 'h1' || m[1] === 'h2' ? `## ${t}` : m[1] === 'h3' ? `### ${t}` : m[1] === 'li' ? `- ${t}` : t)
        }
        out.push('')
    }
    return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

export function pages(ctx) {
    return decks(ctx).map(f => {
        const name = f.replace(/\.deck$/, ''), src = fs.readFileSync(ctx.R(SRC + f), 'utf8'), rel = `${OUT}${name}/index.html`
        const up = '../'.repeat(rel.split('/').length - 1)
        const raw = src.replace(/(src|href)="(img|shots)\//g, `$1="${up}${DIR}$2/`).replace(/(href|src)="deck\.(css|js)"/g, `$1="../deck.$2"`)
        const pdf = fs.existsSync(ctx.R(DIR + name + '.pdf')) ? `${up}${DIR}${name}.pdf` : ''
        return {
            rel, src: SRC + f, type: 'site', raw, title: strip((src.match(/<title>([\s\S]*?)<\/title>/) || [, name])[1]),
            summary: (src.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1], section: 'about',
            md: `${pdf ? `[Download the PDF](${pdf})\n\n` : ''}${twinOf(src)}`,
        }
    })
}

// the stylesheet and the script, out of board/
export const api = ctx => fs.existsSync(ctx.R(DIR + 'deck.css')) ? ['css', 'js'].map(x => ({ path: `${OUT}deck.${x}`, schema: null, data: fs.readFileSync(ctx.R(DIR + 'deck.' + x), 'utf8') })) : []

// /investors/decks/ (investors@'s page) gets an "Open the slides" list, so every deck page is reached
export function decorate(p, ctx) {
    if (p.rel !== OUT + 'index.html' || !decks(ctx).length) return
    const prev = p.postHtml, list = decks(ctx).map(f => f.replace(/\.deck$/, '')).map(n => `<li><a href="${n}/index.html">${n.replace(/^\d+-/, '').replace(/-/g, ' ')}</a></li>`).join('')
    p.postHtml = h => (prev ? prev(h) : h) + `\n<h2 id="open">Open the slides</h2><ul>${list}</ul>`
}
