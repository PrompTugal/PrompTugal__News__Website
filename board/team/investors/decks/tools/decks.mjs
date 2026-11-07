// The investor decks: layout and words kept apart (investors@PrompTugal.dinis, 7 November 2026).
//
//   node decks.mjs extract <deck>          src/<deck>.deck (HTML with words)  ->  src/<deck>.tpl + i18n/<deck>/en.json
//   node decks.mjs build <deck> <lang>     src/<deck>.tpl + i18n/<deck>/<lang>.json  ->  <deck>.<lang>.html (for rendering; not committed)
//   node decks.mjs check <deck> <lang>     every key of en.json present in <lang>.json, inline tags kept
//
// A "text block" is an element whose text nodes carry the words and whose children are all inline (b, i, em, strong,
// span, a, br, tspan, code): its innerHTML is one string, so a translator sees a whole sentence with its emphasis.
// The template keeps the element with data-i18n="<key>" and no content; build puts the language's string back.
// Uses the Playwright that the environment provides (require('playwright')); nothing to install.
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '..')
const [cmd, deck, lang] = process.argv.slice(2)
const SRC = path.join(root, 'src'), I18N = path.join(root, 'i18n', deck || '')

if (cmd === 'extract') {
    const { chromium } = require('playwright')
    const html = fs.readFileSync(path.join(SRC, deck + '.deck'), 'utf8')
    const b = await chromium.launch(), p = await b.newPage()
    await p.setContent(html, { waitUntil: 'domcontentloaded' })
    const { tpl, strings } = await p.evaluate(() => {
        const INLINE = new Set(['B', 'I', 'EM', 'STRONG', 'SPAN', 'A', 'BR', 'TSPAN', 'CODE', 'SUP', 'SUB', 'SMALL', 'U', 'S'])
        const strings = {}
        let slide = 0, n = 0
        const isBlock = el => [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && [...el.children].every(c => INLINE.has(c.tagName.toUpperCase()))
        const walk = el => {
            if (['SCRIPT', 'STYLE'].includes(el.tagName.toUpperCase())) return
            if (el.matches && el.matches('section.slide')) { slide++; n = 0 }
            if (isBlock(el) || (el.tagName.toUpperCase() === 'TITLE')) {
                const k = `s${String(slide).padStart(2, '0')}.${++n}`
                strings[k] = el.innerHTML.trim().replace(/\s+/g, ' ')
                el.setAttribute('data-i18n', k); el.innerHTML = ''
                return
            }
            for (const c of [...el.children]) walk(c)
        }
        walk(document.documentElement)
        const meta = document.querySelector('meta[name="description"]')
        if (meta) { strings['meta.description'] = meta.getAttribute('content'); meta.setAttribute('content', '{{meta.description}}') }
        document.documentElement.setAttribute('lang', '{{lang}}')
        return { tpl: '<!doctype html>\n' + document.documentElement.outerHTML, strings }
    })
    await b.close()
    fs.mkdirSync(I18N, { recursive: true })
    fs.writeFileSync(path.join(SRC, deck + '.tpl'), tpl + '\n')
    fs.writeFileSync(path.join(I18N, 'en.json'), JSON.stringify(strings, null, 1) + '\n')
    console.log(`extracted ${Object.keys(strings).length} strings from ${deck}`)
} else if (cmd === 'build') {
    const tpl = fs.readFileSync(path.join(SRC, deck + '.tpl'), 'utf8')
    const en = JSON.parse(fs.readFileSync(path.join(I18N, 'en.json'), 'utf8'))
    const t = lang === 'en' ? en : { ...en, ...JSON.parse(fs.readFileSync(path.join(I18N, lang + '.json'), 'utf8')) }
    let out = tpl.replace(/(<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)(<\/\2>)/g, (m, open, tag, k, close) => open + (t[k] ?? en[k] ?? '') + close)
    out = out.replace('{{meta.description}}', (t['meta.description'] || '').replace(/"/g, '&quot;')).replace('lang="{{lang}}"', `lang="${lang}"`)
    const file = path.join(root, `${deck}.${lang}.html`)
    fs.writeFileSync(file, out)
    console.log('built', path.basename(file))
} else if (cmd === 'check') {
    const en = JSON.parse(fs.readFileSync(path.join(I18N, 'en.json'), 'utf8')), t = JSON.parse(fs.readFileSync(path.join(I18N, lang + '.json'), 'utf8'))
    const tags = s => (s.match(/<\/?[a-z]+/gi) || []).join(' ')
    const missing = Object.keys(en).filter(k => !(k in t)), extra = Object.keys(t).filter(k => !(k in en))
    const tagdiff = Object.keys(en).filter(k => k in t && tags(en[k]) !== tags(t[k]))
    console.log(`${deck} ${lang}: ${Object.keys(en).length} keys, missing ${missing.length}, extra ${extra.length}, inline tags changed ${tagdiff.length}`)
    if (missing.length) console.log(' missing:', missing.slice(0, 20).join(' '))
    if (tagdiff.length) console.log(' tags changed:', tagdiff.slice(0, 20).join(' '))
    process.exitCode = missing.length || tagdiff.length ? 1 : 0
} else {
    console.log('usage: node decks.mjs extract <deck> | build <deck> <lang> | check <deck> <lang>')
}
