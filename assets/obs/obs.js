// PrompTugal.news's page views and reads (observability@PrompTugal.dinis, 6 November 2026, at Dinis Cruz's word:
// "replicate what we have on web-summit.sgit.ai"). The team site's sender (its assets/obs-dinis.js, by
// observability@web-summit.dinis, after Jose's assets/telemetry.js and the observability pack), into this site's own
// vault (assets/obs/obs.json). Two events per page load:
//   view  when the page loads;
//   read  the first time the tab is hidden or closed: seconds the page was visible and the deepest scroll (percent).
// Each says: the page, the referring site (host only), the time to the minute, the site version, a random id that
// ends with the tab, the screen size class, the browser's language and time zone, an automation class if a bot
// declares itself, and the country, from the browser's own time zone through a fixed table (no network call; the
// ipapi.co and ipwho.is lookup was removed at Dinis's word, 19 November 2026, about 03:15 UTC). No IP address, no cookie, no user-agent
// string, no browser fingerprint. Sealed here to the drain key (sgit hybrid
// envelope v2: RSA-OAEP-SHA256 + AES-256-GCM) and written to a write-only append lane; on 507 (a lane full) the next.
// Do Not Track, Global Privacy Control and the footer's Pause switch stop it. Never blocks, never shows an error.
// The drain (newsroom/tools/obs/obs_drain.py) publishes counts only; the report is /newsroom/observability/.
(() => {
    'use strict'
    try {
        const nav = navigator
        const dnt = nav.doNotTrack === '1' || window.doNotTrack === '1' || nav.globalPrivacyControl === true
        const LS = { get: k => { try { return localStorage.getItem('pt.obs.' + k) } catch { return null } }, set: (k, v) => { try { v === null ? localStorage.removeItem('pt.obs.' + k) : localStorage.setItem('pt.obs.' + k, v) } catch { } } }
        const SS = { get: k => { try { return sessionStorage.getItem('pt.obs.' + k) } catch { return null } }, set: (k, v) => { try { sessionStorage.setItem('pt.obs.' + k, v) } catch { } }, del: k => { try { sessionStorage.removeItem('pt.obs.' + k) } catch { } } }
        const paused = () => LS.get('off') === '1'
        const script = document.currentScript, base = script ? script.src.replace(/obs\.js(\?.*)?$/, '') : '/assets/obs/'

        // the disclosure and the pause switch, in the footer of every page
        const footer = () => {
            const row = document.querySelector('footer .row p.small') || document.querySelector('footer .row'); if (!row || row.querySelector('.obs-note')) return
            const s = document.createElement('span'); s.className = 'obs-note'
            const a = document.createElement('a'); a.href = base + '../../newsroom/observability/index.html'; a.textContent = 'what is counted'
            if (dnt) { s.append(' · Page views: off (Do Not Track or Global Privacy Control is on). ', a); row.appendChild(s); return }
            const b = document.createElement('button'); b.type = 'button'; b.style.cssText = 'font:inherit;background:none;border:0;padding:0;text-decoration:underline;cursor:pointer;color:inherit'
            const t = document.createTextNode('')
            const draw = () => { t.textContent = paused() ? ' · Page views: paused on this device. ' : ' · Page views, reading time and your country (from your browser\'s time zone, never your IP address) are counted, publicly. No cookie. '; b.textContent = paused() ? 'Resume' : 'Pause' }
            b.onclick = () => { LS.set('off', paused() ? null : '1'); draw() }
            s.append(t, b, ' · ', a); draw(); row.appendChild(s)
        }
        const safeFooter = () => { try { footer() } catch { } }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeFooter); else safeFooter()
        if (dnt || paused()) return

        let sid = SS.get('sid'); if (!sid) { sid = [...crypto.getRandomValues(new Uint8Array(4))].map(x => x.toString(16).padStart(2, '0')).join(''); SS.set('sid', sid) }
        const path = location.pathname, done = new Set()

        const b64 = bytes => { let s = ''; for (const x of new Uint8Array(bytes)) s += String.fromCharCode(x); return btoa(s) }
        const unpem = pem => Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')), c => c.charCodeAt(0))
        async function seal(pem, text) {
            const S = crypto.subtle
            const pub = await S.importKey('spki', unpem(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt'])
            const aes = await S.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt'])
            const iv = crypto.getRandomValues(new Uint8Array(12))
            const c = await S.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, aes, new TextEncoder().encode(text))
            const w = await S.encrypt({ name: 'RSA-OAEP' }, pub, await S.exportKey('raw', aes))
            return btoa(btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) })))   // the lane takes base64 of the .enc text
        }
        // automation by class only, never the user-agent string itself
        const ua = nav.userAgent || ''
        const agent = nav.webdriver ? 'webdriver' : /HeadlessChrome|PhantomJS/.test(ua) ? 'headless'
            : /Googlebot/i.test(ua) ? 'googlebot' : /bingbot/i.test(ua) ? 'bingbot' : /bot|crawl|spider|slurp/i.test(ua) ? 'bot' : ''
        const w = window.innerWidth || 1024
        let ref = ''; try { ref = document.referrer ? new URL(document.referrer).host : '' } catch { }
        // the country only, from the browser's own time zone through a fixed table: no network call, no IP seen by anyone,
        // no region, city or map position (Dinis, 19 November 2026, about 03:15 UTC: "remove the IP base. So we're going to
        // keep the country still"; board/guidance/2026-11-19-no-ip-lookup-predictions-and-small-decisions.md). A zone not in
        // the table sends no country.
        const TZ = {"Europe/Lisbon":"PT","Atlantic/Madeira":"PT","Atlantic/Azores":"PT","Europe/Madrid":"ES","Atlantic/Canary":"ES","Africa/Ceuta":"ES","Europe/London":"GB","Europe/Dublin":"IE","Europe/Paris":"FR","Europe/Brussels":"BE","Europe/Amsterdam":"NL","Europe/Luxembourg":"LU","Europe/Berlin":"DE","Europe/Zurich":"CH","Europe/Vienna":"AT","Europe/Rome":"IT","Europe/Malta":"MT","Europe/Copenhagen":"DK","Europe/Oslo":"NO","Europe/Stockholm":"SE","Europe/Helsinki":"FI","Atlantic/Reykjavik":"IS","Europe/Warsaw":"PL","Europe/Prague":"CZ","Europe/Bratislava":"SK","Europe/Budapest":"HU","Europe/Ljubljana":"SI","Europe/Zagreb":"HR","Europe/Belgrade":"RS","Europe/Sarajevo":"BA","Europe/Podgorica":"ME","Europe/Skopje":"MK","Europe/Tirane":"AL","Europe/Athens":"GR","Europe/Sofia":"BG","Europe/Bucharest":"RO","Europe/Chisinau":"MD","Europe/Kyiv":"UA","Europe/Kiev":"UA","Europe/Vilnius":"LT","Europe/Riga":"LV","Europe/Tallinn":"EE","Europe/Istanbul":"TR","Asia/Nicosia":"CY","Europe/Monaco":"MC","Europe/Andorra":"AD","Europe/Gibraltar":"GI","Europe/Moscow":"RU","Europe/Minsk":"BY","America/New_York":"US","America/Chicago":"US","America/Denver":"US","America/Los_Angeles":"US","America/Phoenix":"US","America/Anchorage":"US","Pacific/Honolulu":"US","America/Detroit":"US","America/Toronto":"CA","America/Vancouver":"CA","America/Edmonton":"CA","America/Winnipeg":"CA","America/Halifax":"CA","America/St_Johns":"CA","America/Mexico_City":"MX","America/Sao_Paulo":"BR","America/Fortaleza":"BR","America/Recife":"BR","America/Bahia":"BR","America/Manaus":"BR","America/Belem":"BR","America/Argentina/Buenos_Aires":"AR","America/Santiago":"CL","America/Bogota":"CO","America/Lima":"PE","America/Caracas":"VE","America/Montevideo":"UY","America/Asuncion":"PY","America/La_Paz":"BO","America/Guayaquil":"EC","America/Panama":"PA","America/Costa_Rica":"CR","America/Havana":"CU","America/Santo_Domingo":"DO","America/Puerto_Rico":"PR","America/Guatemala":"GT","Africa/Luanda":"AO","Africa/Maputo":"MZ","Atlantic/Cape_Verde":"CV","Africa/Bissau":"GW","Africa/Sao_Tome":"ST","Africa/Lagos":"NG","Africa/Cairo":"EG","Africa/Johannesburg":"ZA","Africa/Nairobi":"KE","Africa/Casablanca":"MA","Africa/Algiers":"DZ","Africa/Tunis":"TN","Africa/Accra":"GH","Africa/Dakar":"SN","Africa/Addis_Ababa":"ET","Africa/Kigali":"RW","Africa/Kampala":"UG","Africa/Dar_es_Salaam":"TZ","Asia/Dubai":"AE","Asia/Riyadh":"SA","Asia/Qatar":"QA","Asia/Jerusalem":"IL","Asia/Tel_Aviv":"IL","Asia/Beirut":"LB","Asia/Amman":"JO","Asia/Tehran":"IR","Asia/Karachi":"PK","Asia/Kolkata":"IN","Asia/Calcutta":"IN","Asia/Dhaka":"BD","Asia/Kathmandu":"NP","Asia/Colombo":"LK","Asia/Bangkok":"TH","Asia/Ho_Chi_Minh":"VN","Asia/Jakarta":"ID","Asia/Kuala_Lumpur":"MY","Asia/Singapore":"SG","Asia/Manila":"PH","Asia/Hong_Kong":"HK","Asia/Macau":"MO","Asia/Shanghai":"CN","Asia/Taipei":"TW","Asia/Seoul":"KR","Asia/Tokyo":"JP","Asia/Almaty":"KZ","Asia/Tbilisi":"GE","Asia/Yerevan":"AM","Asia/Baku":"AZ","Asia/Dili":"TL","Australia/Sydney":"AU","Australia/Melbourne":"AU","Australia/Brisbane":"AU","Australia/Perth":"AU","Australia/Adelaide":"AU","Australia/Darwin":"AU","Australia/Hobart":"AU","Pacific/Auckland":"NZ","Pacific/Fiji":"FJ"}
        const NAMES = (() => { try { return new Intl.DisplayNames(['en'], { type: 'region' }) } catch { return null } })()
        const place = async () => {
            const cc = TZ[(Intl.DateTimeFormat().resolvedOptions().timeZone || '')] || ''
            let name = ''; try { name = cc && NAMES ? String(NAMES.of(cc) || '') : '' } catch { }
            return { country: name.slice(0, 60), country_code: cc, region: '', city: '' }
        }
        // a link's tag (Dinis, 6 November: "I just sent a link to somebody ... I would like to see if they open it ... and
        // forward it"): ?via=<tag> (or utm_source / utm_campaign) on the link you send. Kept for the tab, so the pages read
        // after arriving count too; a tag names the link, never the person. Letters, digits, '.', '_' and '-', 40 at most.
        const tagOf = () => { try { const q = new URLSearchParams(location.search); const t = q.get('via') || q.get('utm_campaign') || q.get('utm_source') || ''; return /^[A-Za-z0-9._-]{1,40}$/.test(t) ? t.toLowerCase() : '' } catch { return '' } }
        let via = tagOf(); if (via) SS.set('via', via); else via = SS.get('via') || ''
        const common = () => {
            const e = { v: 1, src: 'promptugal', site: location.host, ver: ((document.querySelector('a.ver') || {}).textContent || '').trim(),
                ts: new Date().toISOString().slice(0, 16) + 'Z', sid, path, ref, lang: nav.language || '',
                screen: w < 600 ? 'phone' : w < 1000 ? 'tablet' : 'desktop', tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || '') }
            if (agent) e.agent = agent
            if (via) e.via = via
            // an A/B test (Dinis, 6 November 2026, 13:20: "A/B testing when needed ... on the website"): the variant this page
            // was shown, from <html data-variant> or <meta name="variant">, set by whoever runs the test; no new identifier
            const H = document.documentElement.dataset, vr = H.variant || (document.querySelector('meta[name="variant"]') || {}).content || (H.top ? 'top-' + H.top : '')   // dev@'s A/B of the top: <html data-top="c|a">
            if (/^[A-Za-z0-9._-]{1,40}$/.test(vr)) e.variant = vr
            return e
        }

        let visibleMs = 0, since = document.visibilityState === 'visible' ? performance.now() : null, maxScroll = 0
        const scrolled = () => { const h = document.documentElement, top = window.scrollY || h.scrollTop, all = Math.max(1, h.scrollHeight - window.innerHeight); maxScroll = Math.max(maxScroll, Math.min(100, Math.round(100 * top / all))) }
        window.addEventListener('scroll', scrolled, { passive: true })

        let cfgP = null
        const cfg = () => cfgP || (cfgP = fetch(base + 'obs.json', { cache: 'no-cache' }).then(r => r.json()))
        const send = async ev => {
            if (paused()) return false
            const c = await cfg(); if (!c.enabled || !c.lanes || !c.lanes.site || !c.lanes.site.length) return false
            if (!('country' in ev)) Object.assign(ev, await place())
            const payload = await seal(c.recipient.encrypt, JSON.stringify(ev))
            const L = c.lanes.site, start = Math.floor(Math.random() * L.length)   // a random first lane spreads the load
            for (const token of L.map((_, i) => L[(start + i) % L.length])) {
                const r = await fetch(`${c.endpoint}/api/vault/append/write/${c.vault_id}`, { method: 'POST', keepalive: true,
                    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: token, payload }) })
                if (r.status !== 507) return r.ok
            }
            return false
        }
        const resend = () => {                                            // reads an earlier page in this tab could not finish sending
            try {
                for (const k of Object.keys(sessionStorage).filter(k => k.startsWith('pt.obs.pending.'))) {
                    const ev = JSON.parse(sessionStorage.getItem(k)); sessionStorage.removeItem(k)
                    send(ev).catch(() => { })
                }
            } catch { }
        }
        // a yes or no on a page (assets/talk/talk.js, dev.places@PrompTugal.dinis, 15 Nov 2026): one more event on this
        // lane, with no identity: the same fields as a view, plus the vote; absent under Do Not Track or the pause
        window.PTObs = { vote: (v, path) => send(Object.assign(common(), { type: 'vote', vote: v > 0 ? 1 : -1 }, path ? { voted_on: String(path).slice(0, 200) } : {})).catch(() => false) }
        const view = () => { resend(); if (done.has('view')) return; done.add('view'); send(Object.assign(common(), { type: 'view' })).catch(() => { }) }
        const finish = () => {
            if (since !== null) { visibleMs += performance.now() - since; since = null }
            if (done.has('read')) return
            scrolled(); done.add('read')
            const ev = Object.assign(common(), { type: 'read', visible_s: Math.min(3600, Math.round(visibleMs / 1000)), scroll: maxScroll })
            const key = 'pending.' + ev.path + '.' + Date.now()
            SS.set(key, JSON.stringify(ev))                                   // kept until written: leaving can cut the send short
            send(ev).then(ok => { if (ok) SS.del(key) }).catch(() => { })
        }
        document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') since = performance.now(); else finish() })
        window.addEventListener('pagehide', finish)
        cfg().catch(() => { })
        if (document.readyState === 'complete') setTimeout(view, 0); else window.addEventListener('load', view)
    } catch { }
})()
