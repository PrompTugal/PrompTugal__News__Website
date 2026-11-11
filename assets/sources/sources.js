/* the live sources strip: the storm site's own updated time, read from its data in the reader's browser (designer@'s L6:
 * live facts from the storm site's data, never a copy). Nothing is sent; a failure leaves the strip as it is. */
(function () {
    document.querySelectorAll('.ls-src-a[data-updated]').forEach(function (a) {
        fetch(a.getAttribute('data-updated'), { credentials: 'omit', referrerPolicy: 'no-referrer' }).then(function (r) { return r.json() }).then(function (j) {
            var t = j && (j.updated || j.built_at); if (!t) return
            a.querySelector('.ls-src-t').textContent = '· updated ' + new Date(t).toISOString().slice(11, 16) + ' UTC'
        }).catch(function () { })
    })
})()
