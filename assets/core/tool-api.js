/* tool-api.js: the page's commands, published on window.__tool, for the chat, for agents driving a browser and for
 * the reader's own console. Loaded on every page. After graphs.sgit.ai's Tool API Primitive (levels read / view /
 * author, every call logged), made load-order free with a queue. The contract is in assets/core/README.md.
 *
 *   window.__tool.register(name, { level, description, params, run })   level: 'read' | 'view' | 'author'
 *   window.__tool.list({ levels })        [{ name, level, description, params }]
 *   window.__tool.call(name, args, { via, levels })   Promise of the result; logged
 *   window.__tool.log()                   the interaction log, newest last (at most 500 entries)
 *   window.__tool.schemas({ levels })     OpenAI / OpenRouter tool definitions (dots in names become __)
 *   window.__tool.on(fn)                  fn({ type: 'register' | 'unregister' | 'call' | 'result', ... }); returns off()
 *
 * A feature never waits for this file: it pushes to the queue, which works before and after this file has run:
 *   (window.__toolQueue = window.__toolQueue || []).push(['register', name, spec])
 */
(function (root, factory) {
    const api = factory()
    if (typeof module === 'object' && module.exports) module.exports = api
    else api.install(root)
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict'
    const LEVELS = ['read', 'view', 'author']
    const MAX_LOG = 500
    const NAME = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/

    // a JSON Schema subset, enough to refuse a bad call before it runs: type, required, enum, properties
    function check(schema, value, path) {
        path = path || 'args'
        if (!schema) return []
        const errs = []
        const t = schema.type
        const typeOk = v => {
            if (!t) return true
            const ts = Array.isArray(t) ? t : [t]
            return ts.some(x => x === 'array' ? Array.isArray(v) : x === 'integer' ? Number.isInteger(v) : x === 'null' ? v === null : x === 'object' ? v && typeof v === 'object' && !Array.isArray(v) : typeof v === x)
        }
        if (value === undefined) return errs
        if (!typeOk(value)) { errs.push(`${path} should be ${Array.isArray(t) ? t.join(' or ') : t}`); return errs }
        if (schema.enum && !schema.enum.includes(value)) errs.push(`${path} should be one of ${schema.enum.join(', ')}`)
        if (schema.type === 'object' && value) {
            for (const r of schema.required || []) if (value[r] === undefined || value[r] === null || value[r] === '') errs.push(`${path}.${r} is required`)
            for (const [k, s] of Object.entries(schema.properties || {})) errs.push(...check(s, value[k], `${path}.${k}`))
        }
        return errs
    }

    const wireName = n => n.replace(/\./g, '__')
    const short = (v, n) => { let s; try { s = JSON.stringify(v) } catch (e) { s = String(v) } return s === undefined ? 'undefined' : s.length > n ? s.slice(0, n) + '…' : s }

    function createToolApi(opts) {
        opts = opts || {}
        const now = opts.now || (() => Date.now())
        const tools = new Map()
        const entries = []
        const listeners = new Set()
        let seq = 0
        const emit = ev => { for (const fn of [...listeners]) { try { fn(ev) } catch (e) { /* a listener's failure is its own */ } } }

        const api = {
            version: '1.0.0',
            levels: LEVELS.slice(),
            register(name, spec) {
                if (!NAME.test(name || '')) throw new Error(`tool name "${name}" should be lower case words joined by _ or . (graph.focus)`)
                if (!spec || typeof spec.run !== 'function') throw new Error(`tool ${name}: spec.run must be a function`)
                const level = spec.level || 'read'
                if (!LEVELS.includes(level)) throw new Error(`tool ${name}: level must be one of ${LEVELS.join(', ')}`)
                const t = { name, level, description: String(spec.description || ''), params: spec.params || { type: 'object', properties: {} }, run: spec.run, example: spec.example, owner: spec.owner || '' }
                tools.set(name, t)
                emit({ type: 'register', name, level })
                if (typeof root_dispatch === 'function') root_dispatch('tool:registered', { name, level })
                return api
            },
            unregister(name) { const had = tools.delete(name); if (had) emit({ type: 'unregister', name }); return had },
            has: name => tools.has(name),
            get(name) { const t = tools.get(name); return t ? { name: t.name, level: t.level, description: t.description, params: t.params, example: t.example, owner: t.owner } : null },
            list(o) {
                const lv = o && o.levels
                return [...tools.values()].filter(t => !lv || lv.includes(t.level)).sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.name.localeCompare(b.name))
                    .map(t => ({ name: t.name, level: t.level, description: t.description, params: t.params, example: t.example, owner: t.owner }))
            },
            schemas(o) {
                return api.list(o).map(t => ({ type: 'function', function: { name: wireName(t.name), description: `[${t.level}] ${t.description}`, parameters: t.params } }))
            },
            fromWire(w) { if (tools.has(w)) return w; const n = String(w).replace(/__/g, '.'); return tools.has(n) ? n : null },
            wireName,
            async call(name, args, o) {
                o = o || {}
                const real = api.fromWire(name) || name
                const t = tools.get(real)
                const entry = { id: ++seq, at: new Date(now()).toISOString(), name: real, level: t ? t.level : null, args: args === undefined ? {} : args, via: o.via || 'page' }
                entries.push(entry)
                if (entries.length > MAX_LOG) entries.splice(0, entries.length - MAX_LOG)
                emit({ type: 'call', entry })
                const t0 = now()
                try {
                    if (!t) throw new Error(`no tool called ${name}; list() names them`)
                    if (o.levels && !o.levels.includes(t.level)) throw new Error(`${real} is a ${t.level} tool, and the ${t.level} level is not allowed here`)
                    const a = entry.args && typeof entry.args === 'object' ? entry.args : {}
                    const errs = check(t.params, a)
                    if (errs.length) throw new Error(`bad arguments for ${real}: ${errs.join('; ')}`)
                    const result = await t.run(a, { via: entry.via })
                    entry.ok = true
                    entry.ms = now() - t0
                    entry.result = short(result, 400)
                    emit({ type: 'result', entry, result })
                    return result
                } catch (e) {
                    entry.ok = false
                    entry.ms = now() - t0
                    entry.error = String(e && e.message || e)
                    emit({ type: 'result', entry, error: entry.error })
                    throw e
                }
            },
            log: () => entries.slice(),
            clearLog() { entries.length = 0 },
            on(fn) { listeners.add(fn); return () => listeners.delete(fn) },
            // graphs.sgit.ai's names, for consumers written against that API
            get_tool_schemas: o => api.schemas(o),
            get_levels: () => LEVELS.slice(),
            meta: { getLog: () => entries.slice(), getMethods: () => api.list().map(t => t.name), getVersion: () => '1.0.0' },
        }
        return api
    }

    let root_dispatch = null

    // in the page: one registry on window.__tool, the queue drained, and push replaced so later pushes act at once
    function install(root) {
        if (root.__tool && root.__tool.__nr) return root.__tool
        const api = createToolApi()
        api.__nr = true
        root_dispatch = (type, detail) => { try { root.dispatchEvent(new CustomEvent(type, { detail })) } catch (e) { /* no DOM */ } }
        root.__tool = api
        const q = root.__toolQueue = root.__toolQueue || []
        const run = item => {
            try {
                if (!Array.isArray(item)) return
                const [op, name, spec] = item
                if (op === 'register') api.register(name, spec)
                else if (op === 'unregister') api.unregister(name)
                else if (op === 'call') api.call(name, spec || {}, item[3] || {}).then(item[4] || (() => { }), item[5] || (() => { }))
            } catch (e) { if (root.console) root.console.warn('[tool-api]', e.message) }
        }
        const pending = q.splice(0, q.length)
        q.push = function () { for (const item of arguments) run(item); return q.length }
        for (const item of pending) run(item)
        root_dispatch('tool:ready', { version: api.version, tools: api.list().map(t => t.name) })
        return api
    }

    return { createToolApi, install, check, wireName, LEVELS }
})
