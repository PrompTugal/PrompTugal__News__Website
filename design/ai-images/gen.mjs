// AI-made infographics for an article, through OpenRouter (designer@PrompTugal.dinis, session 2, 6 November 2026).
//
//   node design/ai-images/gen.mjs --article <slug> --model <openrouter model id> [--style <name>] [--out <vault dir>]
//
// The whole article goes in the prompt (Dinis: the Gemini and OpenRouter models "work really well if you just give the
// entire story"), with the brand's palette and the rules below. The image is written to the designer's vault
// (default /root/.sg-send/designer/pt-designer/ai-images/<slug>/), never to git, and one line per call is appended to
// ai-images/log.jsonl there: model, style, prompt sha256, cost (OpenRouter's own usage.cost), seconds, bytes, file.
// The key: OPEN_ROUTER_KEY from the environment only; never printed, logged or written; sent only to openrouter.ai.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d }
const slug = arg('article'), model = arg('model'), style = arg('style', 'editorial')
if (!slug || !model) { console.error('usage: --article <slug> --model <id> [--style editorial|cartoon|explainer]'); process.exit(2) }
const KEY = process.env.OPEN_ROUTER_KEY
if (!KEY) { console.error('OPEN_ROUTER_KEY is not set in this session'); process.exit(2) }

const article = fs.readFileSync(path.join(root, 'content/articles', slug + '.md'), 'utf8')
const STYLES = JSON.parse(fs.readFileSync(path.join(here, 'styles.json'), 'utf8'))
if (!STYLES[style]) { console.error('unknown style; one of ' + Object.keys(STYLES).join(', ')); process.exit(2) }
const prompt = `${STYLES._rules}\n\nSTYLE: ${STYLES[style]}\n\nTHE ARTICLE (markdown, with its front matter):\n\n${article}`
const sha = crypto.createHash('sha256').update(prompt).digest('hex').slice(0, 16)

const out = path.resolve(arg('out', '/root/.sg-send/designer/pt-designer'))
const dir = path.join(out, 'ai-images', slug)
fs.mkdirSync(dir, { recursive: true })

const t0 = Date.now()
const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', 'X-Title': 'PrompTugal.news designer' },
    body: JSON.stringify({ model, modalities: ['image', 'text'], messages: [{ role: 'user', content: prompt }], usage: { include: true } }),
})
const secs = (Date.now() - t0) / 1000
const j = await res.json().catch(() => ({}))
const msg = j.choices?.[0]?.message || {}
const url = msg.images?.[0]?.image_url?.url || ''
const cost = j.usage?.cost ?? null
const line = { at: new Date().toISOString(), article: slug, model, style, prompt_sha256: sha, status: res.status, seconds: secs, cost_usd: cost, usage: j.usage ? { prompt_tokens: j.usage.prompt_tokens, completion_tokens: j.usage.completion_tokens } : null }
if (!url.startsWith('data:image/')) {
    line.error = (j.error?.message || 'no image in the reply').slice(0, 300)
    fs.appendFileSync(path.join(out, 'ai-images', 'log.jsonl'), JSON.stringify(line) + '\n')
    console.error('no image:', line.error); process.exit(1)
}
const ext = url.slice(11, url.indexOf(';')).replace('jpeg', 'jpg')
const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64')
const file = `${model.replace(/[^a-z0-9.-]+/gi, '_')}--${style}--${line.at.slice(11, 19).replace(/:/g, '')}.${ext}`
fs.writeFileSync(path.join(dir, file), buf)
Object.assign(line, { bytes: buf.length, file: `ai-images/${slug}/${file}`, text: (msg.content || '').slice(0, 300) })
fs.appendFileSync(path.join(out, 'ai-images', 'log.jsonl'), JSON.stringify(line) + '\n')
console.log(JSON.stringify({ file: line.file, cost_usd: cost, seconds: secs }))
