// The Swagger of Swaggers (/apis/): a picker over every PrompTugal site's OpenAPI document, loaded into the vendored
// Swagger UI (as assets/datasci/swagger-page.js does for one). The list comes from the page's #apis data-sites (built from
// assets/apis/apis.json); GET and HEAD only; no validator badge; names written with textContent. dev@PrompTugal.dinis.
(function () {
    function go() {
        var box = document.getElementById('apis'), ui = document.getElementById('swagger-ui')
        if (!box || !ui) return
        var sites; try { sites = JSON.parse(box.getAttribute('data-sites')) } catch (e) { return }
        if (!window.SwaggerUIBundle) { box.textContent = 'Swagger UI did not load; the documents are linked above.'; return }
        var label = document.createElement('label'), sel = document.createElement('select')
        label.textContent = box.getAttribute('data-pick') + ' '
        sites.forEach(function (s, i) { var o = document.createElement('option'); o.value = String(i); o.textContent = s.name; sel.appendChild(o) })
        label.appendChild(sel); box.replaceChildren(label)
        function load(i) {
            var s = sites[i], url = new URL(s.spec, location.href).href
            ui.textContent = 'Loading ' + s.name + '…'
            fetch(url, { credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() }).then(function (doc) {
                ui.textContent = ''
                var origin = new URL(url).origin
                doc.servers = [{ url: origin, description: s.name }].concat((doc.servers || []).filter(function (x) { return x.url !== origin }))
                window.SwaggerUIBundle({ spec: doc, domNode: ui, deepLinking: false, docExpansion: 'list', defaultModelsExpandDepth: 0,
                    tryItOutEnabled: true, displayRequestDuration: true, filter: true, validatorUrl: null, supportedSubmitMethods: ['get', 'head'] })
            }).catch(function (e) { ui.textContent = s.name + ': the OpenAPI document could not be loaded (' + e.message + ').' })
        }
        sel.onchange = function () { load(+sel.value) }
        load(0)
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go()
})()
