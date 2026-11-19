/*! ptmap 1.0.1: the shared map of the PrompTugal.news sites (designer@PrompTugal.dinis, 19 Nov 2026;
 * board/spec-the-shared-map.md in PrompTugal/PrompTugal__News__Website). Vendor this file pinned by its sha384; never load it
 * from another site. No dependencies, no network, no innerHTML: every label is set as text, every link checked.
 * Outline: Natural Earth 110m (public domain) via world-atlas, ISC licence: Copyright 2013-2019 Michael Bostock.
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
 * provided that the above copyright notice and this permission notice appear in all copies. THE SOFTWARE IS PROVIDED "AS IS".
 *
 * PTMap.render(element, {
 *   places: [{ id, name, at: [lon, lat], href, n }],   // mainland places; n (optional) sizes the dot
 *   current: 'faro',                                   // the place this page is about, drawn larger and labelled
 *   london: { href, n } | null,                        // the small inset, if this site has London data
 *   eu: { href, n } | null,                            // the small Brussels inset, if this site has EU data
 *   label: 'Places on this site'                       // the map's accessible name
 * })
 */
(function (root) {
  'use strict'
  var OUTLINE = {"pt":[[[[-9.034,41.881],[-8.671,42.135],[-8.264,42.281],[-8.012,41.792],[-7.421,41.792],[-7.252,41.918],[-6.669,41.883],[-6.388,41.382],[-6.853,41.111],[-6.863,40.331],[-7.025,40.185],[-7.065,39.711],[-7.497,39.63],[-7.097,39.029],[-7.375,38.373],[-7.029,38.076],[-7.166,37.804],[-7.537,37.428],[-7.454,37.098],[-7.857,36.839],[-8.383,36.98],[-8.897,36.87],[-8.746,37.652],[-8.84,38.266],[-9.286,38.359],[-9.527,38.738],[-9.448,39.391],[-9.049,39.755],[-8.977,40.16],[-8.768,40.761],[-8.789,41.184],[-8.991,41.543],[-9.034,41.881]]]],"es":[[[[-7.454,37.098],[-7.537,37.428],[-7.166,37.804],[-7.029,38.076],[-7.375,38.373],[-7.097,39.029],[-7.497,39.63],[-7.065,39.711],[-7.025,40.185],[-6.863,40.331],[-6.853,41.111],[-6.388,41.382],[-6.669,41.883],[-7.252,41.918],[-7.421,41.792],[-8.012,41.792],[-8.264,42.281],[-8.671,42.135],[-9.034,41.881],[-8.984,42.592],[-9.394,43.027],[-7.979,43.748],[-6.755,43.569],[-5.413,43.574],[-4.347,43.403],[-3.519,43.455],[-1.903,43.423],[-1.503,43.034],[0.337,42.58],[0.7,42.795],[1.827,42.343],[2.986,42.474],[3.04,41.891],[2.093,41.226],[0.812,41.015],[0.722,40.678],[0.106,40.124],[-0.279,39.31],[0.11,38.738],[-0.466,38.293],[-0.682,37.643],[-1.438,37.443],[-2.147,36.675],[-3.415,36.66],[-4.369,36.678],[-4.995,36.325],[-5.377,35.947],[-5.866,36.03],[-6.237,36.367],[-6.521,36.942],[-7.454,37.098]]]]}
  var NS = 'http://www.w3.org/2000/svg'
  var V = { lon0: -9.65, lon1: -6.1, lat0: 36.85, lat1: 42.2 }, K = Math.cos(39.5 * Math.PI / 180), W = 300
  var SC = W / ((V.lon1 - V.lon0) * K), H = Math.round((V.lat1 - V.lat0) * SC)
  function X (lo) { return (lo - V.lon0) * K * SC } function Y (la) { return (V.lat1 - la) * SC }
  function el (n, a) { var e = document.createElementNS(NS, n); Object.keys(a).forEach(function (k) { e.setAttribute(k, String(a[k])) }); return e } // own keys only: a polluted Object.prototype adds nothing (1.0.1, security@'s low 1)
  function okHref (h) { try { var u = new URL(h, location.href); return u.protocol === 'https:' && !u.username && !u.password && !u.port && (u.hostname === 'promptugal.news' || /\.promptugal\.news$/.test(u.hostname)) ? u.href : null } catch (e) { return null } }
  function str (s, n) { return String(s == null ? '' : s).slice(0, n || 80) }
  function link (child, href, title) { var h = okHref(href); if (!h) return child; var a = el('a', { href: h }); var t = el('title', {}); t.textContent = str(title); a.appendChild(t); a.appendChild(child); return a }
  function inset (svg, x, y, name, sub, d, href) {
    var g = el('g', { 'class': 'ptm-inset' }); g.appendChild(el('rect', { x: x, y: y, width: 92, height: 40, rx: 4 }))
    g.appendChild(el('circle', { cx: x + 12, cy: y + 20, r: 4 }))
    var t = el('text', { x: x + 22, y: y + 17, 'class': 'ptm-in-n' }); t.textContent = name; g.appendChild(t)
    var s = el('text', { x: x + 22, y: y + 31, 'class': 'ptm-in-s' }); s.textContent = sub; g.appendChild(s)
    svg.appendChild(link(g, href, name + ' · ' + sub)); void d
  }
  function render (host, o) {
    o = o || {}; var places = (o.places || []).slice(0, 400)
    var svg = el('svg', { viewBox: '0 0 ' + (W + 104) + ' ' + H, 'class': 'ptm', role: 'img' })
    var ti = el('title', {}); ti.textContent = str(o.label || 'Map of the places on this site', 120); svg.appendChild(ti)
    ;[['es', 'ptm-es'], ['pt', 'ptm-pt']].forEach(function (c) {
      OUTLINE[c[0]].forEach(function (poly) { svg.appendChild(el('path', { 'class': c[1], d: poly.map(function (r) { return 'M' + r.map(function (p) { return X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1) }).join('L') + 'Z' }).join('') })) })
    })
    places.forEach(function (p) {
      if (!p || !Array.isArray(p.at) || !isFinite(p.at[0]) || !isFinite(p.at[1]) || typeof p.at[0] !== 'number' || typeof p.at[1] !== 'number') return
      var cur = p.id === o.current, n = Math.max(0, Math.min(999, +p.n || 0))
      var c = el('circle', { cx: X(p.at[0]).toFixed(1), cy: Y(p.at[1]).toFixed(1), r: (cur ? 6 : 2.5 + Math.min(4, Math.sqrt(n) / 2)).toFixed(1), 'class': cur ? 'ptm-dot ptm-cur' : 'ptm-dot' })
      svg.appendChild(link(c, p.href, str(p.name) + (n ? ' · ' + n : '')))
      if (cur) { var l = el('text', { x: (X(p.at[0]) + 9).toFixed(1), y: (Y(p.at[1]) + 4).toFixed(1), 'class': 'ptm-cur-l' }); l.textContent = str(p.name, 40); svg.appendChild(l) }
    })
    if (o.london) inset(svg, W + 8, 18, 'London', o.london.n ? str(o.london.n, 12) + ' items' : 'the UK', 0, o.london.href)
    if (o.eu) inset(svg, W + 8, 66, 'Brussels', o.eu.n ? str(o.eu.n, 12) + ' items' : 'the EU', 0, o.eu.href)
    host.textContent = ''; host.appendChild(svg); return svg
  }
  root.PTMap = { version: '1.0.1', render: render }
})(window)
