// A small JSON Schema validator (no dependencies) for the subset data/schemas/ uses:
// type, enum, const, pattern, minLength, minimum, properties, required, additionalProperties, items, minItems,
// uniqueItems, anyOf, $ref ("#/$defs/x" within a schema, or "other.schema.json#/$defs/x" across data/schemas/),
// and format "date", "date-time", "uri". Returns a list of "path: problem" strings; empty means valid.
import fs from 'node:fs'
import path from 'node:path'

const FORMATS = {
    date: s => /^\d{4}-\d{2}-\d{2}$/.test(s),
    'date-time': s => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?Z$/.test(s),
    uri: s => /^https?:\/\/[^\s]+$/.test(s),
}
const typeOf = v => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v

export function loadSchemas(dir) {
    const reg = new Map()
    for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.schema.json'))) reg.set(f, JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    return reg
}

export function validate(value, schemaFile, reg) {
    const errors = []
    const resolve = (ref, base) => {
        const [file, frag = ''] = ref.split('#')
        const f = file || base
        let s = reg.get(f)
        if (!s) throw new Error(`schema ${f} not found (from ${ref})`)
        for (const k of frag.split('/').filter(Boolean)) s = s[k]
        if (!s) throw new Error(`schema ref ${ref} not found`)
        return [s, f]
    }
    const walk = (v, s, p, base) => {
        if (s === true || s === undefined) return
        if (s === false) { errors.push(`${p}: not allowed`); return }
        if (s.$ref) { const [r, f] = resolve(s.$ref, base); return walk(v, r, p, f) }
        if (s.anyOf) {
            const ok = s.anyOf.some(alt => { const before = errors.length; walk(v, alt, p, base); const bad = errors.length > before; errors.length = before; return !bad })
            if (!ok) errors.push(`${p}: matches none of the allowed shapes`)
            return
        }
        if (s.type) {
            const types = [].concat(s.type), t = typeOf(v)
            if (!types.includes(t) && !(t === 'integer' && types.includes('number'))) { errors.push(`${p}: is ${t}, expected ${types.join(' or ')}`); return }
        }
        if (s.const !== undefined && v !== s.const) errors.push(`${p}: must be ${JSON.stringify(s.const)}`)
        if (s.enum && !s.enum.includes(v)) errors.push(`${p}: ${JSON.stringify(v)} is not one of ${s.enum.join(', ')}`)
        if (typeof v === 'string') {
            if (s.minLength !== undefined && v.length < s.minLength) errors.push(`${p}: shorter than ${s.minLength}`)
            if (s.pattern && !new RegExp(s.pattern, 'u').test(v)) errors.push(`${p}: does not match ${s.pattern}`)
            if (s.format && FORMATS[s.format] && !FORMATS[s.format](v)) errors.push(`${p}: not a ${s.format}`)
        }
        if (typeof v === 'number' && s.minimum !== undefined && v < s.minimum) errors.push(`${p}: below ${s.minimum}`)
        if (Array.isArray(v)) {
            if (s.minItems !== undefined && v.length < s.minItems) errors.push(`${p}: fewer than ${s.minItems} items`)
            if (s.uniqueItems && new Set(v.map(x => JSON.stringify(x))).size !== v.length) errors.push(`${p}: items are not unique`)
            if (s.items) v.forEach((x, i) => walk(x, s.items, `${p}[${i}]`, base))
        }
        if (v && typeof v === 'object' && !Array.isArray(v)) {
            for (const r of s.required || []) if (!(r in v)) errors.push(`${p}: missing ${r}`)
            const props = s.properties || {}
            for (const [k, x] of Object.entries(v)) {
                if (k in props) walk(x, props[k], `${p}.${k}`, base)
                else if (s.additionalProperties === false) errors.push(`${p}: unexpected property ${k}`)
                else if (typeof s.additionalProperties === 'object') walk(x, s.additionalProperties, `${p}.${k}`, base)
            }
        }
    }
    walk(value, { $ref: `${schemaFile}#` }, '$', schemaFile)
    return errors
}
