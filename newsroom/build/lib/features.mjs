// Loads every feature in newsroom/build/features/*.mjs, in a stable order: by its `order` (default 50), then by name.
// The contract is in newsroom/build/README.md. A feature is one file (plus, if it needs them, assets/<name>/).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { R } from './config.mjs'

export async function loadFeatures(dir = R('newsroom/build/features')) {
    const out = []
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.mjs')).sort()) {
        const m = await import(pathToFileURL(path.join(dir, f)).href)
        const name = m.name || f.replace(/\.mjs$/, '')
        out.push({ ...m, name, file: `newsroom/build/features/${f}`, order: m.order ?? 50 })
    }
    const names = new Set()
    for (const f of out) { if (names.has(f.name)) throw new Error(`two features are called ${f.name}`); names.add(f.name) }
    return out.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
}
