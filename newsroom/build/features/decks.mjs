// The investor decks on the site (Dinis, 7 November 2026, about 09:45 UTC: "Put this on the website in HTML and
// available to download. Version control it."; board/team/investors/dinis-2026-11-07-go-live-and-structure.md).
//   Load       investors@'s decks: board/team/investors/decks/src/<name>.tpl + i18n/<name>/<lang>.json (1920x1080 slides, words per language),
//              their deck.css and deck.js, and the PDF beside each (<name>.pdf)
//   Transform  each deck into a page of the build, /investors/decks/<name>/: its own markup kept (page.raw, the shell adds
//              the head tags, the version badge and the agent block), its images pointing at board/ (served), its
//              stylesheet and script copied out of board/ (to api/v1/decks/, generated) (no script is served from board/: S1b); the markdown twin is
//              the slides' text, heading by heading
//   Save       the pages, api/v1/decks/deck.css and deck.js; /investors/decks/ (content) links each page
import fs from 'node:fs'
import path from 'node:path'
export const order = 61

const DIR = 'board/team/investors/decks/', SRC = DIR + 'src/', I18N = DIR + 'i18n/', OUT = 'investors/decks/'
// since 7 Nov 2026 (investors@, at Dinis's word "the decks in Portuguese, in four languages, ten"): a deck is a layout,
// src/<name>.tpl (empty elements carrying data-i18n="<key>"), plus its words per language, i18n/<name>/<lang>.json.
// English is at /investors/decks/<name>/, every other language at /investors/decks/<name>/<lang>/. (.deck, HTML with
// its words in it, is still read if present.)
const decks = ctx => fs.existsSync(ctx.R(SRC)) ? fs.readdirSync(ctx.R(SRC)).filter(f => /\.(tpl|deck)$/.test(f)).map(f => f.replace(/\.(tpl|deck)$/, '')).filter((n, i, a) => a.indexOf(n) === i).sort() : []
const langsOf = (ctx, name) => fs.existsSync(ctx.R(I18N + name)) ? ['en', ...fs.readdirSync(ctx.R(I18N + name)).filter(f => f.endsWith('.json') && f !== 'en.json').map(f => f.replace('.json', '')).sort()] : ['en']
const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
// the deck's HTML in one language: the template with the words put back (the same merge as investors@'s tools/decks.mjs)
function deckHtml(ctx, name, lang) {
    if (!fs.existsSync(ctx.R(SRC + name + '.tpl'))) return fs.readFileSync(ctx.R(SRC + name + '.deck'), 'utf8')
    const tpl = fs.readFileSync(ctx.R(SRC + name + '.tpl'), 'utf8'), en = JSON.parse(fs.readFileSync(ctx.R(`${I18N}${name}/en.json`), 'utf8'))
    const t = lang === 'en' ? en : { ...en, ...JSON.parse(fs.readFileSync(ctx.R(`${I18N}${name}/${lang}.json`), 'utf8')) }
    return tpl.replace(/(<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)(<\/\2>)/g, (m, open, tag, k, close) => open + (t[k] ?? en[k] ?? '') + close)
        .replace('{{meta.description}}', (t['meta.description'] || '').replace(/"/g, '&quot;')).replace('lang="{{lang}}"', `lang="${lang}"`)
}
const relOf = (name, lang) => `${OUT}${name}/${lang === 'en' ? '' : lang + '/'}index.html`
const pdfOf = (name, lang) => DIR + name + (lang === 'en' ? '' : '.' + lang) + '.pdf'

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
    const all = decks(ctx)
    return all.flatMap(name => langsOf(ctx, name).map(lang => {
        const src = deckHtml(ctx, name, lang), rel = relOf(name, lang)
        const up = '../'.repeat(rel.split('/').length - 1)
        // what investors@'s player (deck.js) needs: every deck and language, this one's PDF (paths from this page)
        const player = { name, lang, langs: Object.fromEntries(langsOf(ctx, name).map(l => [l, up + relOf(name, l)])), pdf: fs.existsSync(ctx.R(pdfOf(name, lang))) ? up + pdfOf(name, lang) : '',
            decks: all.map(n => ({ name: n, href: up + relOf(n, langsOf(ctx, n).includes(lang) ? lang : 'en') })), index: up + OUT + 'index.html' }
        const raw = src.replace(/(src|href)="(img|shots)\//g, `$1="${up}${DIR}$2/`).replace(/(href|src)="deck\.(css|js)"/g, `$1="${up}api/v1/decks/deck.$2"`)
            .replace(/<body([^>]*)>/, `<body$1>\n<div id="deck-player" data-player="${JSON.stringify(player).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"></div>`)
        return {
            rel, src: SRC + name + '.tpl', type: 'site', raw, title: strip((src.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [, name])[1]),
            summary: (src.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1], section: 'about',
            md: `${player.pdf ? `[Download the PDF](${player.pdf})\n\n` : ''}${twinOf(src)}`,
        }
    }))
}

// the stylesheet and the script, out of board/
export const api = ctx => fs.existsSync(ctx.R(DIR + 'deck.css')) ? ['css', 'js'].map(x => ({ path: `api/v1/decks/deck.${x}`, schema: null, data: fs.readFileSync(ctx.R(DIR + 'deck.' + x), 'utf8') })) : []

// /investors/decks/ (investors@'s page) gets an "Open the slides" list, so every deck page is reached
// /investors/decks/ (investors@'s page, content/investors/decks.md) links every deck's page in every language, so
// none is an orphan; the player on each page links the others.
