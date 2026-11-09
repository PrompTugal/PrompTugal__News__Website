/* The forms on /contribute/ (brief:20261109T2020Z-contribute): a contribution and the beta list. Each is sealed here, in
 * the browser, to the Web Summit team's public key (sgit envelope v2, assets/vendor/pki/ keys.js seal) and written to the
 * write-only sign-ups lane (board/lanes/signups.json); only that team's private CRM can open it. Nothing is kept on this
 * site or in this browser: no storage, no cookie, no outside script. The lane's address and key come from the page. */
(function () {
    'use strict'
    var forms = document.querySelectorAll('form.ct-form'), cfgEl = document.getElementById('ct-lane')
    if (!forms.length || !cfgEl) return
    var lane; try { lane = JSON.parse(cfgEl.textContent) } catch (e) { return }
    var me = document.querySelector('script[src*="assets/contribute/contribute.js"]'), up = me ? me.getAttribute('src').replace(/assets\/contribute\/contribute\.js.*$/, '') : '../'
    var K = null
    function keys() { return K || (K = import(new URL(up + 'assets/vendor/pki/2026-11-06/keys.js', location.href).href)) }
    function show(f, which) { f.querySelectorAll('.ct-status span').forEach(function (s) { s.hidden = !s.hasAttribute('data-' + which) }) }
    forms.forEach(function (f) {
        f.addEventListener('submit', function (ev) {
            ev.preventDefault()
            var v = function (n) { var e = f.elements[n]; return e ? (e.type === 'checkbox' ? e.checked : String(e.value || '').trim()) : '' }
            var kind = f.getAttribute('data-kind'), msg = v('message'), contact = v('contact')
            if (kind === 'beta' ? !contact || !v('contact_for_followup') : !msg) { show(f, 'empty'); return }
            var task = v('task'), body = {
                type: 'signup/v1', kind: kind, name: v('name'), contact: contact, track: f.getAttribute('data-track'),
                consent: { name_on_wall: !!v('name_on_wall'), contact_for_followup: !!v('contact_for_followup') },
                message: kind === 'beta' ? '' : (task ? 'task: ' + task + '\n\n' : '') + msg, at: new Date().toISOString(), page: location.origin + location.pathname
            }
            var btn = f.querySelector('button[type=submit]'); btn.disabled = true; show(f, 'sending')
            keys().then(function (k) { return k.seal({ encrypt: lane.recipient.encrypt }, JSON.stringify(body)) }).then(function (enc) {
                return fetch(lane.endpoint + '/api/vault/append/write/' + lane.vault_id, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ append_token: lane.append_token, payload: btoa(enc) }) })
            }).then(function (r) { if (!r.ok) throw new Error(r.status); show(f, 'sent'); f.reset() })
              .catch(function () { show(f, 'failed') }).then(function () { btn.disabled = false })
        })
    })
})()
