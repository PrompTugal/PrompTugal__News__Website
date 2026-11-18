#!/usr/bin/env node
// Reads each news outlet's own RSS or Atom feed (data/organisations/*/organisation.json, kind media) and keeps the five
// newest headlines with their links and dates, nothing else, in assets/media/feeds/<id>.json. Run by dev.places@ at each wake.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const ROOT = new URL('../../../', import.meta.url).pathname
const UA = 'PrompTugal.news feed reader (headline and link only)'
const un = s => String(s || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/\s+/g, ' ').trim()
// control characters and zero-width or bidi marks never reach a page (a feed is untrusted text)
const clean = s => s.replace(/[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, ' ').replace(/\s+/g, ' ').trim()
const tag = (b, t) => { const m = b.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, 'i')); return m ? m[1] : '' }
// a feed declares its own encoding (iso-8859-1 and windows-1252 are common in Portuguese outlets); utf-8 when it says nothing
const decode = buf => { const head = buf.subarray(0, 200).toString('latin1'), m = head.match(/encoding=["']([A-Za-z0-9_-]+)/i); try { return new TextDecoder(m ? m[1] : 'utf-8').decode(buf) } catch { return buf.toString('utf8') } }
export function parse(xml) {
    const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) || []
    return blocks.map(b => {
        const link = un(tag(b, 'link')) || (b.match(/<link[^>]*href="([^"]+)"/i) || [])[1] || ''
        const d = un(tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated')), t = d ? new Date(d) : null
        return { title: clean(un(un(tag(b, 'title')))).slice(0, 200), link: link.length <= 500 && !/[\s<>"]/.test(link) ? link : '', date: t && !isNaN(t) ? t.toISOString().slice(0, 10) : null }
    }).filter(i => i.title && /^https?:\/\//.test(i.link)).slice(0, 5)
}
const now = new Date().toISOString().slice(0, 16) + 'Z'
let ok = 0, bad = 0
for (const id of readdirSync(ROOT + 'data/organisations')) {
    let o; try { o = JSON.parse(readFileSync(`${ROOT}data/organisations/${id}/organisation.json`, 'utf8')) } catch { continue }
    if (o.kind !== 'media' || !o.media) continue
    const f = (o.media.feeds || []).find(x => ['rss', 'atom'].includes(x.format) && /^https?:\/\//.test(x.url))
    if (!f) continue
    try {
        const xml = execFileSync('curl', ['-sSL', '-m', '20', '--proto', '=http,https', '--proto-redir', '=http,https', '--max-redirs', '5', '--max-filesize', '5000000', '-A', UA, '--', f.url], { maxBuffer: 6e6, stdio: ['ignore', 'pipe', 'ignore'] })
        const items = parse(decode(xml))
        if (!items.length) throw new Error('no items')
        writeFileSync(`${ROOT}assets/media/feeds/${id}.json`, JSON.stringify({ id, feed: f.url, read_at: now, items }, null, 1) + '\n'); ok++
    } catch { bad++ }
}
console.log(`media-feeds: ${ok} read, ${bad} failed`)
