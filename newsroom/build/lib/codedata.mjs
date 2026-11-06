// Code and data, measured: how much prose and markup sits inside the code (newsroom/build/, assets/) instead of in
// content/ (markdown) and data/ (JSON). Used by the gate's ratchet (features/quality.mjs: no code file may hold more
// prose than its baseline in newsroom/build/quality-baseline.json) and by the page /newsroom/quality/ that reports it.
//
// The measure: every string literal and template-literal text in a file (a small tokenizer: comments, regular
// expressions and ${...} code are skipped), and of those the "prose" ones: eight or more words of letters. Prose bytes
// are the bytes of those literals. HTML tags are counted in all literals. Vendored code is not ours and not counted.
import fs from 'node:fs'
import path from 'node:path'

export const SCOPE = ['newsroom/build', 'newsroom/tools', 'assets']
const SKIP = /(^|\/)(vendor|components\/sg-meter|node_modules)(\/|$)/
const EXT = /\.(mjs|cjs|js)$/
const WORDS = /\b[A-Za-z][a-z]{2,}\b/g
const TAG = /<(div|p|span|a|table|tr|td|th|ul|ol|li|h[1-6]|section|nav|svg|dl|dt|dd|button|details|summary|strong|em|small|header|footer|aside|code|pre|img|form|input|label|select|option|textarea)\b/g

// the literals of a JavaScript source: [{ text, line }]
export function literals(src) {
    const out = []
    let i = 0, line = 1, prev = ''   // prev: the last significant character, to tell a regex from a division
    const n = src.length
    const stack = []                  // open templates inside ${...}: { text so far, line, the brace depth to return at }
    let depth = 0
    const regexOK = () => !prev || /[(,=:[!&|?{};+\-*%<>~^]/.test(prev) || /\b(return|typeof|case|in|of|void|delete|throw|new|else|do)$/.test(src.slice(Math.max(0, i - 8), i).trimEnd())
    while (i < n) {
        const c = src[i], d = src[i + 1]
        if (c === '\n') { line++; i++; continue }
        if (c === ' ' || c === '\t' || c === '\r') { i++; continue }
        if (c === '/' && d === '/') { while (i < n && src[i] !== '\n') i++; continue }
        if (c === '/' && d === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++ } i += 2; continue }
        if (c === '/' && regexOK()) {   // a regular expression literal: skip it
            i++; let cls = false
            while (i < n && src[i] !== '\n') { const x = src[i]; if (x === '\\') { i += 2; continue } if (x === '[') cls = true; else if (x === ']') cls = false; else if (x === '/' && !cls) break; i++ }
            i++; while (i < n && /[a-z]/.test(src[i])) i++
            prev = '/r'; continue
        }
        if (c === '"' || c === "'") {
            const start = line; let s = ''; i++
            while (i < n && src[i] !== c && src[i] !== '\n') { if (src[i] === '\\') { s += src[i + 1] || ''; i += 2; continue } s += src[i++] }
            i++; out.push({ text: s, line: start }); prev = 'x'; continue
        }
        if (c === '`' || (c === '}' && stack.length && depth === stack[stack.length - 1].depth)) {
            // a template literal is one literal: its text pieces around ${...} are joined (the code inside is not)
            let cur
            if (c === '}') cur = stack.pop()
            else cur = { text: '', line }
            i++
            let resumed = false
            while (i < n && src[i] !== '`') {
                if (src[i] === '\\') { cur.text += src[i + 1] || ''; i += 2; continue }
                if (src[i] === '$' && src[i + 1] === '{') { cur.depth = depth; stack.push(cur); i += 2; resumed = true; break }
                if (src[i] === '\n') line++
                cur.text += src[i++]
            }
            if (!resumed) { if (src[i] === '`') i++; if (cur.text) out.push({ text: cur.text, line: cur.line }) }
            prev = 'x'; continue
        }
        if (c === '{') depth++
        else if (c === '}') depth--
        prev = c; i++
    }
    return out
}

export function measureFile(src) {
    const lits = literals(src)
    let prose = 0, tags = 0
    const samples = []
    for (const l of lits) {
        const words = (l.text.match(WORDS) || []).length
        tags += (l.text.match(TAG) || []).length
        if (words >= 8) { prose += Buffer.byteLength(l.text); if (samples.length < 3) samples.push({ line: l.line, text: l.text.replace(/\s+/g, ' ').slice(0, 90) }) }
    }
    return { bytes: Buffer.byteLength(src), prose, tags, samples }
}

export function measure(ROOT) {
    const rows = []
    const walk = d => { for (const name of fs.readdirSync(path.join(ROOT, d))) { const r = `${d}/${name}`; if (SKIP.test(r)) continue; const st = fs.statSync(path.join(ROOT, r)); if (st.isDirectory()) walk(r); else if (EXT.test(name)) rows.push({ file: r, ...measureFile(fs.readFileSync(path.join(ROOT, r), 'utf8')) }) } }
    for (const d of SCOPE) if (fs.existsSync(path.join(ROOT, d))) walk(d)
    return rows.sort((a, b) => b.prose - a.prose || a.file.localeCompare(b.file))
}
