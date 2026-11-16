// The Swagger pages (datasci.places@PrompTugal.dinis, features/openapi.mjs): loads this site's own OpenAPI document,
// named by the page in #swagger-ui's data-spec, into the vendored Swagger UI (assets/swagger/vendor/5.33.3/). GET calls only,
// to this site only; no validator badge (it would call validator.swagger.io); nothing from a CDN.
(function () {
    function go() {
        var el = document.getElementById('swagger-ui')
        if (!el) return
        if (!window.SwaggerUIBundle) { el.textContent = 'Swagger UI did not load; the endpoints are listed below.'; return }
        fetch(el.getAttribute('data-spec')).then(function (r) { return r.json() }).then(function (doc) {
            var here = { url: location.origin, description: 'this site, as you read it' }
            doc.servers = [here].concat((doc.servers || []).filter(function (s) { return s.url !== location.origin }))
            window.SwaggerUIBundle({
                spec: doc, domNode: el, deepLinking: true, docExpansion: 'list', defaultModelsExpandDepth: 0,
                tryItOutEnabled: true, displayRequestDuration: true, filter: true, validatorUrl: null,
                supportedSubmitMethods: ['get', 'head'],
            })
        }).catch(function (e) { el.textContent = 'The OpenAPI document could not be loaded (' + e + '); the endpoints are listed below.' })
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go()
})()
