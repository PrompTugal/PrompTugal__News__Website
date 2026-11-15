/* PrompTugal.news query engine: a small SQL over JSON tables, with graph traversals as table functions.
 * data.places@PrompTugal.dinis, 15 November 2026. No dependencies; the same file runs in the browser (window.PTSQL)
 * and in the build (require), so the gate runs every example query the page shows.
 *
 * The dialect (a subset of SQLite's):
 *   [WITH name AS (select), ...] select [UNION [ALL] select ...] [ORDER BY ...] [LIMIT n [OFFSET m]]
 *   SELECT [DISTINCT] expr [AS alias], t.*, *  FROM table|func(args)|(select) [AS] alias
 *     [[INNER|LEFT [OUTER]|CROSS] JOIN item [ON expr]] [WHERE expr] [GROUP BY expr, ...] [HAVING expr]
 *   expressions: literals, columns (t.col or col), + - * / % ||, = == != <> < <= > >=, AND OR NOT, [NOT] LIKE,
 *     [NOT] IN (list | select), IS [NOT] NULL, [NOT] BETWEEN a AND b, CASE [x] WHEN .. THEN .. [ELSE ..] END,
 *     EXISTS (select), scalar (select), function calls; aggregates count(*) count([DISTINCT] x) sum avg min max
 *     group_concat(x [, sep]).
 *   LIKE is case-insensitive, as in SQLite. Comments: -- to the end of the line, and C-style block comments.
 */
(function (root) {
    'use strict'
    const KW = new Set(['select', 'distinct', 'from', 'where', 'group', 'by', 'having', 'order', 'asc', 'desc', 'limit', 'offset',
        'join', 'inner', 'left', 'outer', 'cross', 'on', 'as', 'and', 'or', 'not', 'like', 'in', 'is', 'null', 'between',
        'case', 'when', 'then', 'else', 'end', 'union', 'all', 'with', 'exists', 'true', 'false', 'glob'])

    class SQLError extends Error {}
    const fail = m => { throw new SQLError(m) }

    // ---- the tokenizer
    function tokenize(src) {
        const out = []; let i = 0
        const n = src.length
        while (i < n) {
            const c = src[i]
            if (/\s/.test(c)) { i++; continue }
            if (c === '-' && src[i + 1] === '-') { while (i < n && src[i] !== '\n') i++; continue }
            if (c === '/' && src[i + 1] === '*') { const j = src.indexOf('*/', i + 2); i = j < 0 ? n : j + 2; continue }
            if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
                const m = /^[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?/.exec(src.slice(i)) || /^[0-9]+/.exec(src.slice(i))
                out.push({ t: 'num', v: Number(m[0]), p: i }); i += m[0].length; continue
            }
            if (c === "'") {
                let j = i + 1, s = ''
                for (;;) {
                    if (j >= n) fail(`unterminated string at ${i}`)
                    if (src[j] === "'") { if (src[j + 1] === "'") { s += "'"; j += 2; continue } break }
                    s += src[j++]
                }
                out.push({ t: 'str', v: s, p: i }); i = j + 1; continue
            }
            if (c === '"' || c === '`' || c === '[') {
                const close = c === '[' ? ']' : c, j = src.indexOf(close, i + 1)
                if (j < 0) fail(`unterminated identifier at ${i}`)
                out.push({ t: 'id', v: src.slice(i + 1, j), p: i, quoted: true }); i = j + 1; continue
            }
            if (/[A-Za-z_\u00C0-\uFFFF]/.test(c)) {
                const m = /^[A-Za-z_0-9\u00C0-\uFFFF$]+/.exec(src.slice(i))[0]
                const l = m.toLowerCase()
                out.push(KW.has(l) ? { t: 'kw', v: l, p: i } : { t: 'id', v: m, p: i }); i += m.length; continue
            }
            const two = src.slice(i, i + 2)
            if (['<=', '>=', '!=', '<>', '==', '||'].includes(two)) { out.push({ t: 'op', v: two, p: i }); i += 2; continue }
            if ('=<>+-*/%(),.;'.includes(c)) { out.push({ t: 'op', v: c, p: i }); i++; continue }
            fail(`unexpected character ${JSON.stringify(c)} at ${i}`)
        }
        out.push({ t: 'eof', p: n })
        return out
    }

    // ---- the parser
    function parse(src) {
        const T = tokenize(src); let k = 0
        const peek = (o = 0) => T[k + o]
        const is = (t, v) => { const x = T[k]; return x.t === t && (v === undefined || x.v === v) }
        const isKw = v => is('kw', v), isOp = v => is('op', v)
        const eat = (t, v) => { if (is(t, v)) return T[k++]; return null }
        const want = (t, v) => { const x = eat(t, v); if (!x) fail(`expected ${v || t} at ${T[k].p}, found ${T[k].v === undefined ? 'the end' : JSON.stringify(T[k].v)}`); return x }
        const ident = () => { const x = T[k]; if (x.t === 'id') { k++; return x.v } fail(`expected a name at ${x.p}, found ${x.v === undefined ? 'the end' : JSON.stringify(x.v)}`) }

        function query() {
            const ctes = []
            if (eat('kw', 'with')) {
                do { const name = ident(); want('kw', 'as'); want('op', '('); const q = query(); want('op', ')'); ctes.push({ name, q }) } while (eat('op', ','))
            }
            const parts = [core()], ops = []
            while (isKw('union')) { k++; ops.push(eat('kw', 'all') ? 'all' : 'distinct'); parts.push(core()) }
            const order = orderBy(), lim = limit()
            return { kind: 'query', ctes, parts, ops, order, limit: lim }
        }
        function orderBy() {
            if (!eat('kw', 'order')) return []
            want('kw', 'by'); const out = []
            do { const e = expr(); let dir = 1; if (eat('kw', 'desc')) dir = -1; else eat('kw', 'asc'); out.push({ e, dir }) } while (eat('op', ','))
            return out
        }
        function limit() {
            if (!eat('kw', 'limit')) return null
            const n = expr(); let off = null
            if (eat('kw', 'offset')) off = expr(); else if (eat('op', ',')) { off = n; return { n: expr(), off } }
            return { n, off }
        }
        function core() {
            want('kw', 'select')
            const distinct = !!eat('kw', 'distinct'); eat('kw', 'all')
            const items = []
            do {
                if (isOp('*')) { k++; items.push({ star: true }); continue }
                if (is('id') && peek(1).t === 'op' && peek(1).v === '.' && peek(2).t === 'op' && peek(2).v === '*') { const t = ident(); k += 2; items.push({ star: true, table: t }); continue }
                const e = expr(); let alias = null
                if (eat('kw', 'as')) alias = is('str') ? T[k++].v : ident()
                else if (is('id')) alias = ident()
                items.push({ e, alias })
            } while (eat('op', ','))
            let from = null
            if (eat('kw', 'from')) {
                from = [{ item: fromItem(), type: 'first' }]
                for (;;) {
                    if (eat('op', ',')) { from.push({ item: fromItem(), type: 'cross' }); continue }
                    let type = null
                    if (eat('kw', 'left')) { eat('kw', 'outer'); type = 'left' }
                    else if (eat('kw', 'inner')) type = 'inner'
                    else if (eat('kw', 'cross')) type = 'cross'
                    if (type || isKw('join')) {
                        want('kw', 'join'); const item = fromItem(); let on = null
                        if (eat('kw', 'on')) on = expr()
                        from.push({ item, type: type || 'inner', on }); continue
                    }
                    break
                }
            }
            const where = eat('kw', 'where') ? expr() : null
            let group = []
            if (eat('kw', 'group')) { want('kw', 'by'); do group.push(expr()); while (eat('op', ',')) }
            const having = eat('kw', 'having') ? expr() : null
            return { kind: 'select', distinct, items, from, where, group, having }
        }
        function fromItem() {
            let src
            if (eat('op', '(')) { src = { sub: query() }; want('op', ')') }
            else {
                const name = ident()
                if (eat('op', '(')) { const args = []; if (!isOp(')')) do args.push(expr()); while (eat('op', ',')); want('op', ')'); src = { func: name.toLowerCase(), args } }
                else src = { table: name }
            }
            let alias = null
            if (eat('kw', 'as')) alias = ident(); else if (is('id')) alias = ident()
            src.alias = alias || src.table || src.func || 'subquery'
            return src
        }
        // precedence: OR < AND < NOT < comparison < || < + - < * / % < unary
        function expr() { return or() }
        function or() { let l = and(); while (eat('kw', 'or')) l = { op: 'or', l, r: and() }; return l }
        function and() { let l = not(); while (eat('kw', 'and')) l = { op: 'and', l, r: not() }; return l }
        function not() { if (eat('kw', 'not')) return { op: 'not', e: not() }; return cmp() }
        function cmp() {
            let l = concat()
            for (;;) {
                if (is('op') && ['=', '==', '!=', '<>', '<', '<=', '>', '>='].includes(T[k].v)) { const op = T[k++].v; l = { op: op === '==' ? '=' : op === '<>' ? '!=' : op, l, r: concat() }; continue }
                let neg = false
                if (isKw('not') && peek(1).t === 'kw' && ['like', 'in', 'between', 'glob'].includes(peek(1).v)) { k++; neg = true }
                if (eat('kw', 'like')) { l = { op: 'like', l, r: concat(), neg }; continue }
                if (eat('kw', 'glob')) { l = { op: 'glob', l, r: concat(), neg }; continue }
                if (eat('kw', 'between')) { const a = concat(); want('kw', 'and'); l = { op: 'between', l, a, b: concat(), neg }; continue }
                if (eat('kw', 'in')) {
                    want('op', '(')
                    if (isKw('select') || isKw('with')) { const q = query(); want('op', ')'); l = { op: 'insub', l, q, neg }; continue }
                    const list = []; if (!isOp(')')) do list.push(expr()); while (eat('op', ',')); want('op', ')')
                    l = { op: 'in', l, list, neg }; continue
                }
                if (eat('kw', 'is')) { const n = !!eat('kw', 'not'); want('kw', 'null'); l = { op: 'isnull', e: l, neg: n }; continue }
                return l
            }
        }
        function concat() { let l = add(); while (isOp('||')) { k++; l = { op: '||', l, r: add() } } return l }
        function add() { let l = mul(); while (isOp('+') || isOp('-')) { const op = T[k++].v; l = { op, l, r: mul() } } return l }
        function mul() { let l = unary(); while (isOp('*') || isOp('/') || isOp('%')) { const op = T[k++].v; l = { op, l, r: unary() } } return l }
        function unary() { if (eat('op', '-')) return { op: 'neg', e: unary() }; if (eat('op', '+')) return unary(); return primary() }
        function primary() {
            const x = T[k]
            if (x.t === 'num' || x.t === 'str') { k++; return { lit: x.v } }
            if (eat('kw', 'null')) return { lit: null }
            if (eat('kw', 'true')) return { lit: 1 }
            if (eat('kw', 'false')) return { lit: 0 }
            if (eat('kw', 'exists')) { want('op', '('); const q = query(); want('op', ')'); return { op: 'exists', q } }
            if (eat('kw', 'case')) {
                let base = null; if (!isKw('when')) base = expr()
                const whens = []
                while (eat('kw', 'when')) { const w = expr(); want('kw', 'then'); whens.push([w, expr()]) }
                const els = eat('kw', 'else') ? expr() : null; want('kw', 'end')
                return { op: 'case', base, whens, els }
            }
            if (eat('op', '(')) {
                if (isKw('select') || isKw('with')) { const q = query(); want('op', ')'); return { op: 'scalar', q } }
                const e = expr(); want('op', ')'); return e
            }
            if (x.t === 'id' || (x.t === 'kw' && ['left', 'replace'].includes(x.v))) {
                const name = x.t === 'id' ? ident() : T[k++].v
                if (isOp('(') && !x.quoted) {
                    k++
                    const fn = name.toLowerCase()
                    if (isOp('*')) { k++; want('op', ')'); return { fn, args: [], star: true } }
                    const distinct = !!eat('kw', 'distinct'); const args = []
                    if (!isOp(')')) do args.push(expr()); while (eat('op', ','))
                    want('op', ')'); return { fn, args, distinct }
                }
                if (eat('op', '.')) return { col: ident(), table: name }
                return { col: name }
            }
            fail(`unexpected ${x.v === undefined ? 'end of query' : JSON.stringify(x.v)} at ${x.p}`)
        }
        const q = query(); eat('op', ';')
        if (!is('eof')) fail(`unexpected ${JSON.stringify(T[k].v)} at ${T[k].p}`)
        return q
    }

    // ---- values
    const isNull = v => v === null || v === undefined
    const num = v => typeof v === 'number' ? v : typeof v === 'boolean' ? +v : (v !== '' && !isNull(v) && !isNaN(+v)) ? +v : NaN
    function compare(a, b) {
        if (isNull(a) && isNull(b)) return 0
        if (isNull(a)) return -1
        if (isNull(b)) return 1
        if (typeof a === 'number' && typeof b === 'number') return a < b ? -1 : a > b ? 1 : 0
        if (typeof a === 'number' && !isNaN(num(b))) return a - num(b) < 0 ? -1 : a === num(b) ? 0 : 1
        if (typeof b === 'number' && !isNaN(num(a))) return num(a) - b < 0 ? -1 : num(a) === b ? 0 : 1
        const x = String(a), y = String(b); return x < y ? -1 : x > y ? 1 : 0
    }
    const truthy = v => !isNull(v) && v !== 0 && v !== false && v !== '0' && v !== ''
    const likeRe = (pat, ci) => new RegExp('^' + String(pat).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '[\\s\\S]*').replace(/_/g, '[\\s\\S]') + '$', ci ? 'i' : '')
    const globRe = pat => new RegExp('^' + String(pat).replace(/[.+^${}()|\\]/g, '\\$&').replace(/\*/g, '[\\s\\S]*').replace(/\?/g, '[\\s\\S]') + '$')
    const fold = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const SCALAR = {
        lower: s => isNull(s) ? null : String(s).toLowerCase(),
        upper: s => isNull(s) ? null : String(s).toUpperCase(),
        length: s => isNull(s) ? null : String(s).length,
        substr: (s, a, l) => { if (isNull(s)) return null; s = String(s); a = num(a); const st = a > 0 ? a - 1 : a < 0 ? Math.max(0, s.length + a) : 0; return isNull(l) ? s.slice(st) : s.substr(st, num(l)) },
        instr: (s, t) => isNull(s) || isNull(t) ? null : String(s).indexOf(String(t)) + 1,
        replace: (s, a, b) => isNull(s) ? null : String(s).split(String(a)).join(String(b)),
        trim: s => isNull(s) ? null : String(s).trim(), ltrim: s => isNull(s) ? null : String(s).replace(/^\s+/, ''), rtrim: s => isNull(s) ? null : String(s).replace(/\s+$/, ''),
        coalesce: (...a) => { for (const v of a) if (!isNull(v)) return v; return null },
        ifnull: (a, b) => isNull(a) ? b : a, nullif: (a, b) => compare(a, b) === 0 ? null : a,
        abs: v => isNull(v) ? null : Math.abs(num(v)),
        round: (v, d) => { if (isNull(v)) return null; const p = Math.pow(10, num(d) || 0); return Math.round(num(v) * p) / p },
        typeof: v => isNull(v) ? 'null' : typeof v === 'number' ? (Number.isInteger(v) ? 'integer' : 'real') : 'text',
        integer: v => isNull(v) ? null : Math.trunc(num(v)), real: v => isNull(v) ? null : num(v), text: v => isNull(v) ? null : String(v),
        unaccent: s => isNull(s) ? null : fold(s),
        year: s => isNull(s) ? null : (/^(\d{4})/.exec(String(s)) || [])[1] || null,
        host: s => { if (isNull(s)) return null; const m = /^[a-z]+:\/\/(?:www\.)?([^/?#]+)/i.exec(String(s)); return m ? m[1].toLowerCase() : null },
        max2: (a, b) => compare(a, b) >= 0 ? a : b, min2: (a, b) => compare(a, b) <= 0 ? a : b,
        printf: (f, ...a) => { let i = 0; return String(f).replace(/%[sd%]/g, m => m === '%%' ? '%' : String(a[i++])) },
    }
    const AGG = new Set(['count', 'sum', 'avg', 'min', 'max', 'group_concat', 'total'])

    // ---- the executor
    // an env is { scopes: [[alias, rowObject], ...], outer: env|null }
    function resolve(env, table, col) {
        for (let e = env; e; e = e.outer) {
            if (table) { for (const [a, r] of e.scopes) if (a.toLowerCase() === table.toLowerCase()) { if (col in r) return r[col]; const c = Object.keys(r).find(x => x.toLowerCase() === col.toLowerCase()); if (c !== undefined) return r[c]; fail(`no column ${table}.${col}`) } }
            else { for (const [, r] of e.scopes) { if (r && col in r) return r[col] } for (const [, r] of e.scopes) { if (!r) continue; const c = Object.keys(r).find(x => x.toLowerCase() === col.toLowerCase()); if (c !== undefined) return r[c] } }
        }
        if (table) fail(`no table or alias ${table}`)
        fail(`no column ${col}`)
    }
    const isAggCall = e => !!e.fn && AGG.has(e.fn) && ((e.fn !== 'min' && e.fn !== 'max') || e.args.length === 1)
    const hasAgg = e => !!e && typeof e === 'object' && (isAggCall(e) ||
        ['l', 'r', 'e', 'a', 'b', 'base', 'els'].some(f => hasAgg(e[f])) || (e.args || []).some(hasAgg) || (e.list || []).some(hasAgg) || (e.whens || []).some(w => hasAgg(w[0]) || hasAgg(w[1])))

    function Exec(db) {
        const tables = db.tables || {}, funcs = db.functions || {}
        let ctes = []
        const tableOf = name => {
            for (let i = ctes.length - 1; i >= 0; i--) if (ctes[i].has(name.toLowerCase())) return ctes[i].get(name.toLowerCase())
            const key = Object.keys(tables).find(t => t.toLowerCase() === name.toLowerCase())
            if (!key) fail(`no table ${name} (the tables: ${Object.keys(tables).join(', ')})`)
            return tables[key]
        }
        const objs = t => t._objs || (t._objs = t.rows.map(r => { const o = {}; t.columns.forEach((c, i) => { o[c] = r[i] === undefined ? null : r[i] }); return o }))

        function ev(e, env, grp) {
            if ('lit' in e) return e.lit
            if (e.col !== undefined) return resolve(env, e.table, e.col)
            if (e.fn) {
                if (isAggCall(e)) {
                    if (!grp) fail(`${e.fn}() outside a grouped query`)
                    let vals = e.star ? grp.map(() => 1) : grp.map(r => ev(e.args[0], r, null)).filter(v => !isNull(v))
                    if (e.distinct) { const seen = new Set(); vals = vals.filter(v => { const s = typeof v + ':' + v; if (seen.has(s)) return false; seen.add(s); return true }) }
                    switch (e.fn) {
                        case 'count': return vals.length
                        case 'sum': return vals.length ? vals.reduce((a, b) => a + num(b), 0) : null
                        case 'total': return vals.reduce((a, b) => a + num(b), 0)
                        case 'avg': return vals.length ? vals.reduce((a, b) => a + num(b), 0) / vals.length : null
                        case 'min': return vals.length ? vals.reduce((a, b) => compare(a, b) <= 0 ? a : b) : null
                        case 'max': return vals.length ? vals.reduce((a, b) => compare(a, b) >= 0 ? a : b) : null
                        case 'group_concat': { const sep = e.args[1] ? ev(e.args[1], grp[0] || env, null) : ','; return vals.length ? vals.map(String).join(sep) : null }
                    }
                }
                const f = e.fn === 'min' ? SCALAR.min2 : e.fn === 'max' ? SCALAR.max2 : SCALAR[e.fn]
                if (!f) fail(`no function ${e.fn}()`)
                return f(...e.args.map(a => ev(a, env, grp)))
            }
            switch (e.op) {
                case 'and': { const a = ev(e.l, env, grp); if (!isNull(a) && !truthy(a)) return 0; const b = ev(e.r, env, grp); if (!isNull(b) && !truthy(b)) return 0; return isNull(a) || isNull(b) ? null : 1 }
                case 'or': { const a = ev(e.l, env, grp); if (truthy(a)) return 1; const b = ev(e.r, env, grp); if (truthy(b)) return 1; return isNull(a) || isNull(b) ? null : 0 }
                case 'not': { const a = ev(e.e, env, grp); return isNull(a) ? null : truthy(a) ? 0 : 1 }
                case 'neg': { const a = ev(e.e, env, grp); return isNull(a) ? null : -num(a) }
                case '=': case '!=': case '<': case '<=': case '>': case '>=': {
                    const a = ev(e.l, env, grp), b = ev(e.r, env, grp)
                    if (isNull(a) || isNull(b)) return null
                    const c = compare(a, b)
                    return +({ '=': c === 0, '!=': c !== 0, '<': c < 0, '<=': c <= 0, '>': c > 0, '>=': c >= 0 })[e.op]
                }
                case '+': case '-': case '*': case '/': case '%': {
                    const a = ev(e.l, env, grp), b = ev(e.r, env, grp)
                    if (isNull(a) || isNull(b)) return null
                    const x = num(a), y = num(b)
                    if (e.op === '+') return x + y; if (e.op === '-') return x - y; if (e.op === '*') return x * y
                    if (y === 0) return null
                    if (e.op === '%') return x % y
                    return Number.isInteger(x) && Number.isInteger(y) ? Math.trunc(x / y) : x / y
                }
                case '||': { const a = ev(e.l, env, grp), b = ev(e.r, env, grp); return isNull(a) || isNull(b) ? null : String(a) + String(b) }
                case 'like': case 'glob': { const a = ev(e.l, env, grp), p = ev(e.r, env, grp); if (isNull(a) || isNull(p)) return null; const m = (e.op === 'like' ? likeRe(p, true) : globRe(p)).test(String(a)); return +(e.neg ? !m : m) }
                case 'between': { const a = ev(e.l, env, grp), lo = ev(e.a, env, grp), hi = ev(e.b, env, grp); if (isNull(a) || isNull(lo) || isNull(hi)) return null; const m = compare(a, lo) >= 0 && compare(a, hi) <= 0; return +(e.neg ? !m : m) }
                case 'in': { const a = ev(e.l, env, grp); if (isNull(a)) return null; const m = e.list.some(x => compare(a, ev(x, env, grp)) === 0 && !isNull(ev(x, env, grp))); return +(e.neg ? !m : m) }
                case 'insub': { const a = ev(e.l, env, grp); if (isNull(a)) return null; const r = runQuery(e.q, grp ? grp[0] || env : env); const m = r.rows.some(x => !isNull(x[0]) && compare(a, x[0]) === 0); return +(e.neg ? !m : m) }
                case 'isnull': { const m = isNull(ev(e.e, env, grp)); return +(e.neg ? !m : m) }
                case 'exists': return +(runQuery(e.q, grp ? grp[0] || env : env).rows.length > 0)
                case 'scalar': { const r = runQuery(e.q, grp ? grp[0] || env : env); return r.rows.length ? r.rows[0][0] : null }
                case 'case': {
                    if (e.base) { const b = ev(e.base, env, grp); for (const [w, t] of e.whens) if (compare(b, ev(w, env, grp)) === 0) return ev(t, env, grp) }
                    else for (const [w, t] of e.whens) if (truthy(ev(w, env, grp))) return ev(t, env, grp)
                    return e.els ? ev(e.els, env, grp) : null
                }
            }
            fail('cannot evaluate an expression')
        }

        function source(item, outer) {
            if (item.table) { const t = tableOf(item.table); return { columns: t.columns, rows: objs(t) } }
            if (item.sub) { const r = runQuery(item.sub, outer); return { columns: r.columns, rows: r.rows.map(row => { const o = {}; r.columns.forEach((c, i) => o[c] = row[i]); return o }) } }
            const f = funcs[item.func]
            if (!f) fail(`no table function ${item.func}() (the functions: ${Object.keys(funcs).join(', ') || 'none'})`)
            const r = f(item.args.map(a => ev(a, { scopes: [], outer }, null)))
            return { columns: r.columns, rows: r.rows.map(row => Array.isArray(row) ? Object.fromEntries(r.columns.map((c, i) => [c, row[i] === undefined ? null : row[i]])) : row) }
        }

        function runCore(s, outer) {
            // FROM: a list of envs (each a list of [alias, row])
            let envs = [{ scopes: [], outer }]
            const cols = []   // [alias, columns] in order, for *
            if (s.from) for (const j of s.from) {
                const src = source(j.item, outer); cols.push([j.item.alias, src.columns])
                const next = []
                // a hash join when ON is (or starts with) new.col = earlier.col
                let index = null, probe = null
                const eqs = []; (function walk(e) { if (!e) return; if (e.op === 'and') { walk(e.l); walk(e.r) } else eqs.push(e) })(j.on)
                const A = j.item.alias.toLowerCase()
                for (const e of eqs) {
                    if (e.op !== '=' || e.l.col === undefined || e.r.col === undefined || !e.l.table || !e.r.table) continue
                    const [mine, other] = e.l.table.toLowerCase() === A ? [e.l, e.r] : e.r.table.toLowerCase() === A ? [e.r, e.l] : [null, null]
                    if (!mine || other.table.toLowerCase() === A) continue
                    const c = src.columns.find(x => x.toLowerCase() === mine.col.toLowerCase()); if (c === undefined) continue
                    index = new Map(); for (const r of src.rows) { const v = r[c]; if (isNull(v)) continue; const k = typeof v === 'number' ? v : String(v); if (!index.has(k)) index.set(k, []); index.get(k).push(r) }
                    probe = other; break
                }
                for (const env of envs) {
                    let matched = false
                    let cand = src.rows
                    if (index) { const v = ev(probe, env, null); cand = isNull(v) ? [] : (index.get(typeof v === 'number' ? v : String(v)) || (typeof v === 'number' ? index.get(String(v)) : !isNaN(+v) ? index.get(+v) : null) || []) }
                    for (const r of cand) {
                        const e2 = { scopes: env.scopes.concat([[j.item.alias, r]]), outer }
                        if (j.on && !truthy(ev(j.on, e2, null))) continue
                        matched = true; next.push(e2)
                    }
                    if (!matched && j.type === 'left') next.push({ scopes: env.scopes.concat([[j.item.alias, Object.fromEntries(src.columns.map(c => [c, null]))]]), outer })
                }
                envs = next
            }
            if (s.where) envs = envs.filter(env => truthy(ev(s.where, env, null)))
            // the output columns
            const out = []
            for (const it of s.items) {
                if (it.star) { for (const [a, cs] of cols) if (!it.table || a.toLowerCase() === it.table.toLowerCase()) for (const c of cs) out.push({ name: c, e: { col: c, table: a } }); if (it.table && !cols.some(([a]) => a.toLowerCase() === it.table.toLowerCase())) fail(`no table or alias ${it.table}`) }
                else out.push({ name: it.alias || exprName(it.e), e: it.e })
            }
            const grouped = s.group.length > 0 || out.some(o => hasAgg(o.e)) || hasAgg(s.having)
            let rows = []   // { vals, env, grp }
            if (grouped) {
                const groups = new Map()
                for (const env of envs) {
                    const key = JSON.stringify(s.group.map(g => ev(g, env, null)))
                    if (!groups.has(key)) groups.set(key, [])
                    groups.get(key).push(env)
                }
                if (!groups.size && !s.group.length) groups.set('[]', [])
                for (const grp of groups.values()) {
                    const base = grp[0] || { scopes: [], outer }
                    const vals = out.map(o => ev(o.e, base, grp))
                    // HAVING may name an output column's alias, as in SQLite
                    if (s.having && !truthy(ev(s.having, { scopes: base.scopes.concat([['', Object.fromEntries(out.map((o, i) => [o.name, vals[i]]))]]), outer: base.outer }, grp))) continue
                    rows.push({ vals, env: base, grp })
                }
            } else rows = envs.map(env => ({ vals: out.map(o => ev(o.e, env, null)), env, grp: null }))
            if (s.distinct) { const seen = new Set(); rows = rows.filter(r => { const k = JSON.stringify(r.vals); if (seen.has(k)) return false; seen.add(k); return true }) }
            return { columns: out.map(o => o.name), rows, items: out }
        }

        function runQuery(q, outer = null) {
            const frame = new Map(); ctes.push(frame)
            try {
                for (const c of q.ctes) { const r = runQuery(c.q, outer); frame.set(c.name.toLowerCase(), { columns: r.columns, rows: r.rows }) }
                const parts = q.parts.map(p => runCore(p, outer))
                let res = parts[0], rows = res.rows
                for (let i = 1; i < parts.length; i++) {
                    if (parts[i].columns.length !== res.columns.length) fail('the parts of a UNION have different numbers of columns')
                    rows = rows.concat(parts[i].rows)
                    if (q.ops[i - 1] === 'distinct') { const seen = new Set(); rows = rows.filter(r => { const k = JSON.stringify(r.vals); if (seen.has(k)) return false; seen.add(k); return true }) }
                }
                const columns = res.columns
                if (q.order.length) {
                    const single = parts.length === 1
                    const key = (r, o) => {
                        if ('lit' in o.e && typeof o.e.lit === 'number') return r.vals[o.e.lit - 1]
                        if (o.e.col !== undefined && !o.e.table) { const i = columns.findIndex(c => c.toLowerCase() === o.e.col.toLowerCase()); if (i >= 0) return r.vals[i] }
                        if (!single) fail('ORDER BY after a UNION takes an output column name or number')
                        return ev(o.e, r.env, r.grp)
                    }
                    const keyed = rows.map(r => ({ r, k: q.order.map(o => key(r, o)) }))
                    keyed.sort((a, b) => { for (let i = 0; i < q.order.length; i++) { const c = compare(a.k[i], b.k[i]); if (c) return c * q.order[i].dir } return 0 })
                    rows = keyed.map(x => x.r)
                }
                if (q.limit) {
                    const n = num(ev(q.limit.n, { scopes: [], outer }, null)), off = q.limit.off ? num(ev(q.limit.off, { scopes: [], outer }, null)) : 0
                    rows = rows.slice(off, n < 0 ? undefined : off + n)
                }
                return { columns, rows: rows.map(r => r.vals) }
            } finally { ctes.pop() }
        }
        return runQuery
    }
    function exprName(e) {
        if (e.col !== undefined) return e.col
        if (e.fn) return `${e.fn}(${e.star ? '*' : e.args.map(exprName).join(', ')})`
        if ('lit' in e) return String(e.lit)
        return 'expr'
    }

    /** run(sql, db) -> { columns, rows, ms }. db: { tables: { name: { columns: [..], rows: [[..]] } }, functions: { name: args => ({ columns, rows }) } } */
    function run(sql, db) {
        const t0 = Date.now()
        const r = Exec(db)(parse(sql))
        r.ms = Date.now() - t0
        return r
    }
    const PTSQL = { run, parse, tokenize, SQLError, compare }
    root.PTSQL = PTSQL
    if (typeof module === 'object' && module.exports) module.exports = PTSQL
})(typeof window !== 'undefined' ? window : globalThis)
