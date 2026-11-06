/* The graph explorer at /graph/: the canvas (Cytoscape.js, vendored), the bar, the panel, and the API the chat
   commands drive (window.NRGraphExplorer). The state lives in the URL. Pure graph logic is in engine.js.
   By newsroom-graph@web-summit.dinis, 5 November 2026 (WS-14).

   Ported from graphs.sgit.ai's universe reader (SGit-AI/SGit-AI__Website__Graphs, Apache-2.0): the focus ring with
   its dimmed surround (assets/universe/components/graph-fx.js focusNode), the stable-add layout run, by which a node
   already on the canvas never moves when the view gains nodes (runStableLayout), the pinned-slots layout run that
   holds anchors on the canvas's border bands through every layout (runPinnedLayout), the layout options (core/
   cystyle.js layoutOptions), the degree stepper, and the snapshot the chat attaches (universe-api.js graph_snapshot). */
(function () {
  'use strict';
  var E = window.NRGraphEngine, rootEl = document.getElementById('gx');
  if (!E || !rootEl || !window.cytoscape) return;
  var $ = function (s) { return rootEl.querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var ROOT = rootEl.getAttribute('data-root') || '../';
  var S = { G: null, st: E.defaultState(), viewSet: null, views: new Map(), res: null, cy: null, shown: null, lastLayout: null };
  var readyResolve, ready = new Promise(function (r) { readyResolve = r; });

  /* ------------------------------------------------------------ the look, from the page's own colour tokens */
  function tokens() {
    var cs = getComputedStyle(rootEl), v = function (n, f) { return (cs.getPropertyValue(n) || '').trim() || f; };
    return { brand: v('--brand', v('--accent', '#1b4597')), brandSoft: v('--brand-soft', v('--accent-soft', '#e3e9f5')),
      ink: v('--ink', '#121317'), ink2: v('--ink-2', '#3f424a'), ink3: v('--ink-3', '#595c64'), panel: v('--panel', '#fffdf8'),
      paper2: v('--paper-2', v('--paper-sunk', '#ece7db')), rule2: v('--rule-2', v('--rule', '#9d9580')), hair: v('--hair', '#d9d2c1'),
      focus: v('--focus', '#ffbf1f'), live: v('--live', '#b42318'), ok: v('--ok', '#2b6a3c'), warn: v('--warn', '#8a5200') };
  }
  /* the vocabulary, after design/site.css's .n-* kinds (cf. the reader's cystyle.js graphStyle) */
  /* a type may carry its own look in the data (types[].shape, types[].color), for graphs with types of their own (the library's) */
  function typeRules() {
    var types = (S.G && S.G.data.types) || [];
    return types.filter(function (t) { return /^[a-z0-9_-]+$/.test(t.id) && ((t.shape && /^[a-z-]+$/.test(t.shape)) || (t.color && /^#[0-9a-fA-F]{3,8}$/.test(t.color))); }).map(function (t) {
      var st = {}; if (t.shape) st.shape = t.shape; if (t.color) { st['background-color'] = t.color; st['border-color'] = t.color; }
      return { selector: 'node[type = "' + t.id + '"]', style: st };
    });
  }
  function style(T) {
    return [
      { selector: 'node', style: { label: 'data(label)', width: 'data(size)', height: 'data(size)', 'font-family': 'IBM Plex Sans, system-ui, sans-serif',
        'font-size': 11, color: T.ink, 'text-valign': 'bottom', 'text-margin-y': 4, 'text-wrap': 'ellipsis', 'text-max-width': 130,
        'text-outline-color': T.panel, 'text-outline-width': 2.5, 'min-zoomed-font-size': 4.5, 'background-color': T.rule2, 'border-width': 1.5, 'border-color': T.rule2 } },
      { selector: 'node[type = "company"]', style: { 'background-color': T.brand, 'border-color': T.brand, 'font-weight': 600 } },
      { selector: 'node[type = "person"]', style: { 'background-color': T.panel, 'border-color': T.ink } },
      { selector: 'node[type = "organisation"]', style: { 'background-color': T.panel, 'border-color': T.brand, 'border-width': 2 } },
      { selector: 'node[type = "event"]', style: { shape: 'round-rectangle', 'background-color': T.paper2, 'border-color': T.ink2 } },
      { selector: 'node[type = "topic"]', style: { shape: 'round-rectangle', 'background-color': T.brandSoft, 'border-color': T.brand, 'font-weight': 600 } },
      { selector: 'node[type = "place"]', style: { shape: 'rectangle', 'background-color': T.panel, 'border-color': T.rule2, 'border-style': 'dashed' } },
      { selector: 'node[type = "day"]', style: { shape: 'diamond', 'background-color': T.paper2, 'border-color': T.ink3 } },
      { selector: 'node[type = "track"]', style: { shape: 'tag', 'background-color': T.brandSoft, 'border-color': T.ink3 } },
      { selector: 'node[type = "fact"]', style: { 'background-color': T.hair, 'border-color': T.ink3, 'font-size': 9 } },
      { selector: 'node[type = "source"]', style: { shape: 'rectangle', 'background-color': T.panel, 'border-color': T.ink3, 'font-size': 9 } },
      { selector: 'node[type = "evidence"]', style: { shape: 'triangle', 'background-color': T.paper2, 'border-color': T.warn } },
      { selector: 'node[type = "story"]', style: { shape: 'hexagon', 'background-color': T.paper2, 'border-color': T.warn } },
      { selector: 'node[type = "article"]', style: { shape: 'rectangle', 'background-color': T.ink, 'border-color': T.ink } },
      ].concat(typeRules(), [
      { selector: 'edge', style: { width: 1, 'line-color': T.rule2, 'curve-style': 'haystack', 'haystack-radius': 0, opacity: 0.75 } },
      { selector: 'edge.top', style: { width: 'data(w)', 'line-color': T.ink2, opacity: 0.9 } },
      { selector: 'edge.lit', style: { width: 1.8, 'line-color': T.ink2, 'curve-style': 'bezier', 'target-arrow-shape': 'triangle', 'target-arrow-color': T.ink2, 'arrow-scale': 0.7,
        label: 'data(verbLabel)', 'font-size': 9, color: T.ink2, 'text-rotation': 'autorotate', 'text-background-color': T.panel, 'text-background-opacity': 0.9, 'text-background-padding': 1.5, opacity: 1 } },
      { selector: 'edge.path', style: { 'min-zoomed-font-size': 0, width: 3.5, 'line-color': T.brand, 'target-arrow-color': T.brand, 'curve-style': 'bezier', 'target-arrow-shape': 'triangle',
        label: 'data(verbLabel)', 'font-size': 10, 'font-weight': 600, color: T.brand, 'text-rotation': 'autorotate', 'text-background-color': T.panel, 'text-background-opacity': 1, 'text-background-padding': 2, opacity: 1, 'z-index': 9 } },
      { selector: 'node.nl', style: { label: '' } },
      { selector: 'node.anchor', style: { 'min-zoomed-font-size': 0, 'border-width': 4, 'border-style': 'double', 'border-color': T.ink, 'font-weight': 700, 'font-size': 13, 'z-index': 8 } },
      { selector: 'node.path', style: { 'min-zoomed-font-size': 0, 'border-width': 3, 'border-color': T.brand, 'font-weight': 600, 'z-index': 8 } },
      { selector: 'node.gx-focus', style: { 'min-zoomed-font-size': 0, 'border-width': 4, 'border-color': T.focus, 'font-weight': 700, 'font-size': 13, 'z-index': 10, label: 'data(label)' } },
      { selector: 'node.hood', style: { label: 'data(label)' } },
      { selector: '.dim', style: { opacity: 0.14 } },
    ]);
  }

  /* ------------------------------------------------------------ data */
  function loadView(view) {
    if (!view || view === 'whole') return Promise.resolve(null);
    if (S.views.has(view)) return Promise.resolve(S.views.get(view));
    var dv = (S.G.data.views || []).filter(function (v) { return v.id === view && /^[\w\/.-]+\.json$/.test(v.file || ''); })[0];
    var file = dv ? dv.file : /^(industry|summit|people)$/.test(view) || /^(companies|events|people)\/[a-z0-9-]+$/.test(view) ? 'api/v1/graph/' + view + '.json' : null;
    if (!file) return Promise.reject(new Error('unknown view: ' + view + ' (whole, industry, summit, people, companies/<slug>, events/<slug>, people/<slug>)'));
    return fetch(ROOT + file).then(function (r) { if (!r.ok) throw new Error('no such view: ' + view + ' (HTTP ' + r.status + ')'); return r.json(); })
      .then(function (g) { var set = new Set(); g.nodes.forEach(function (n) { var i = S.G.byId.get(n.id); if (i != null) set.add(i); }); S.views.set(view, set); return set; });
  }

  /* ------------------------------------------------------------ layout (ported runStableLayout / runPinnedLayout) */
  var MAP_SCALE = 0.35; /* the map is laid out at 34 units an edge; drawn closer, so nodes stay visible zoomed out */
  var MAP_OVER = 200;   /* above this many nodes, force uses the build's map: cose on the whole graph takes 30 s */
  function layoutOptions(name, res) {
    var n = res.nodes.size;
    if (name === 'map' || (name === 'force' && n > MAP_OVER)) {
      var pos = {}; res.nodes.forEach(function (i) { var nd = S.G.nodes[i]; pos[nd.id] = { x: nd.x * MAP_SCALE, y: nd.y * MAP_SCALE }; });
      return { name: 'preset', animate: false, fit: false, positions: pos };
    }
    if (name === 'force') return { name: 'cose', animate: false, fit: false, randomize: true, padding: 24, componentSpacing: 60,
      nodeRepulsion: function () { return n > 300 ? 4500 : 9000; }, idealEdgeLength: function () { return n > 300 ? 40 : 70; }, edgeElasticity: function () { return 80; },
      numIter: n > 120 ? 250 : 1000, gravity: n > 120 ? 1 : 6, gravityRange: 2.4, nodeOverlap: 8, nestingFactor: 1.2 };
    if (name === 'radial') {
      var hop = hopsFrom(res);
      return { name: 'concentric', animate: false, fit: false, padding: 24, minNodeSpacing: n > 200 ? 6 : 16, startAngle: -Math.PI / 2,
        concentric: function (node) { var h = hop.get(node.id()); return h == null ? 0 : 100 - h; }, levelWidth: function () { return 1; } };
    }
    if (name === 'tree') {
      var roots = res.roots.length ? res.roots : res.sel >= 0 ? [res.sel] : E.ranked(S.G, res.nodes, 'pagerank', 1);
      return { name: 'breadthfirst', animate: false, fit: false, directed: false, padding: 24, spacingFactor: n > 150 ? 0.9 : 1.25,
        roots: roots.map(function (i) { return '#' + cssId(S.G.nodes[i].id); }).join(',') };
    }
    if (name === 'layered') return { name: 'preset', animate: false, fit: false, positions: layeredPositions(res) };
    return { name: 'grid', animate: false, fit: false, padding: 24, avoidOverlapPadding: 6,
      sort: function (a, b) { return a.data('type').localeCompare(b.data('type')) || b.data('pr') - a.data('pr'); } };
  }
  var cssId = function (id) { return id.replace(/([^a-zA-Z0-9_-])/g, '\\$1'); };
  /* hops from the anchors (or the selection, or the most central node) over what is drawn: the radial rings */
  function hopsFrom(res) {
    var G = S.G, starts = res.roots.length ? res.roots : res.sel >= 0 ? [res.sel] : E.ranked(G, res.nodes, 'pagerank', 1);
    var hop = new Map(), frontier = starts.slice();
    starts.forEach(function (i) { hop.set(G.nodes[i].id, 0); });
    for (var d = 1; frontier.length; d++) {
      var next = [];
      frontier.forEach(function (v) { G.adj[v].forEach(function (j) { if (!res.edges.has(j)) return; var e = G.edges[j], w = e[0] === v ? e[1] : e[0], id = G.nodes[w].id; if (!hop.has(id)) { hop.set(id, d); next.push(w); } }); });
      frontier = next;
    }
    return hop;
  }
  /* layered by world: one band per world (programme, people, industry, evidence), its types side by side */
  function layeredPositions(res) {
    var G = S.G, worlds = G.data.worlds, pos = {}, y = 0;
    worlds.forEach(function (w) {
      var x = 0, bandH = 0;
      w.types.forEach(function (t) {
        var ids = E.ranked(G, Array.from(res.nodes).filter(function (i) { return G.nodes[i].type === t; }), 'pagerank');
        if (!ids.length) return;
        var cols = Math.max(1, Math.ceil(Math.sqrt(ids.length * 1.6))), cw = 120, rh = 46;
        ids.forEach(function (i, k) { pos[G.nodes[i].id] = { x: x + (k % cols) * cw, y: y + Math.floor(k / cols) * rh + ((k % cols) % 2) * 14 }; });
        x += cols * cw + 90; bandH = Math.max(bandH, Math.ceil(ids.length / cols) * rh);
      });
      if (bandH) y += bandH + 110;
    });
    return pos;
  }
  /** Run the layout. Explicit asks lay out everything; an addition settles only the newcomers (stable-add, brief 26
      of graphs.sgit.ai: a move costs the reader their mental picture). Anchors sit in border slots, locked for the run. */
  function runLayout(full) {
    var cy = S.cy, res = S.res, vis = cy.elements(), nodes = vis.nodes();
    var opts = layoutOptions(S.st.layout === 'list' ? 'grid' : S.st.layout, res);
    var fresh = S.shown ? nodes.filter(function (n) { return !S.shown.has(n.id()); }) : nodes;
    var prev = nodes.difference(fresh);
    /* stable-add, unless the newcomers outnumber what is drawn three to one: then a full layout reads better */
    if (!full && S.shown && prev.length && fresh.length <= 3 * prev.length) {
      if (!fresh.length) { S.shown = new Set(nodes.map(function (n) { return n.id(); })); return; }
      fresh.forEach(function (n) { var near = n.neighborhood('node').intersection(prev); if (near.length) { var p = near[0].position(); n.position({ x: p.x + 40 + Math.random() * 40, y: p.y + 40 + Math.random() * 40 }); } });
      prev.lock();
      if (opts.name === 'cose') opts.randomize = false;
      if (opts.name === 'preset') { fresh.forEach(function (n) { if (opts.positions[n.id()]) n.position(opts.positions[n.id()]); }); }
      else vis.layout(opts).run();
      prev.unlock();
      fitGently(vis);
    } else {
      var anchorIds = anchorOrder(res);
      var pins = anchorIds.length && opts.name !== 'preset' && opts.name !== 'concentric' && opts.name !== 'breadthfirst' ? anchorIds : [];
      if (pins.length) {
        var left = pins.length === 2 ? [pins[0]] : pins.filter(function (_, i) { return i % 2 === 0; });
        var right = pins.length === 2 ? [pins[1]] : pins.filter(function (_, i) { return i % 2 === 1; });
        var assign = E.defaultAssignments(left, right), sp = E.slotPositions(assign, nodes.length - pins.length);
        var col = cy.collection(pins.map(function (id) { return cy.getElementById(id); }));
        var narrow = cy.width() < 600 ? Math.max(0.45, cy.width() / 700 * 1.3) : 1;   /* a phone: the bands closer */
        col.forEach(function (n) { var q = sp[n.id()]; n.position({ x: q.x * narrow, y: q.y }); });
        col.lock(); vis.layout(opts).run(); col.unlock();
      } else vis.layout(opts).run();
      fitGently(vis);
    }
    S.shown = new Set(nodes.map(function (n) { return n.id(); }));
  }
  /* fit what is drawn, but never zoom in past a readable scale (a view of three nodes is not drawn at 400%) */
  function fitGently(vis) {
    var cy = S.cy; cy.fit(vis, 30);
    if (cy.zoom() > 1.5) { cy.zoom(1.5); cy.center(vis); }
  }
  /* the anchors in order; a path's two ends are its anchors (from on the left, to on the right) */
  function anchorOrder(res) {
    var G = S.G, ids = res.roots.map(function (i) { return G.nodes[i].id; });
    if (res.paths.length) { var p = res.paths[0].nodes; ids = [G.nodes[p[0]].id, G.nodes[p[p.length - 1]].id].concat(ids.filter(function (x) { return x !== G.nodes[p[0]].id && x !== G.nodes[p[p.length - 1]].id; })); }
    return ids;
  }

  /* ------------------------------------------------------------ drawing */
  var verbLabel = function (G, e) { return G.verbs[e[2]].verb.replace(/_/g, ' '); };
  function draw(opts) {
    opts = opts || {};
    var G = S.G, st = S.st, t0 = performance.now();
    var res = S.res = E.compute(G, st, S.viewSet);
    var cy = S.cy, big = res.nodes.size > 150;
    var pathNodes = new Set(), pathEdges = new Set();
    res.paths.forEach(function (p) { p.nodes.forEach(function (n) { pathNodes.add(n); }); p.edges.forEach(function (j) { pathEdges.add(j); }); });
    var labelled = new Set(E.ranked(G, res.nodes, 'pagerank', big ? 40 : 400));
    var maxEb = 1; if (res.topEdges) res.topEdges.forEach(function (j) { maxEb = Math.max(maxEb, G.edges[j][5]); });
    cy.batch(function () {
      var want = new Set(), wantE = new Set();
      res.nodes.forEach(function (i) { want.add(G.nodes[i].id); });
      res.edges.forEach(function (j) { wantE.add('e' + j); });
      cy.elements().forEach(function (el) { if (el.isNode() ? !want.has(el.id()) : !wantE.has(el.id())) el.remove(); });
      var add = [];
      res.nodes.forEach(function (i) {
        var n = G.nodes[i];
        if (cy.getElementById(n.id).nonempty()) return;
        add.push({ group: 'nodes', data: { id: n.id, i: i, label: n.label.length > 48 ? n.label.slice(0, 46) + '…' : n.label, type: n.type, pr: n.pr || 0,
          size: Math.round(Math.max(10, Math.min(46, 9 + Math.sqrt(n.pr || 0) * 6))) } });
      });
      res.edges.forEach(function (j) {
        if (cy.getElementById('e' + j).nonempty()) return;
        var e = G.edges[j];
        add.push({ group: 'edges', data: { id: 'e' + j, j: j, source: G.nodes[e[0]].id, target: G.nodes[e[1]].id, verbLabel: verbLabel(G, e) } });
      });
      cy.add(add);
      cy.nodes().forEach(function (n) {
        var i = n.data('i');
        n.toggleClass('nl', !labelled.has(i) && !res.pinned.has(i));
        n.toggleClass('anchor', res.roots.indexOf(i) !== -1);
        n.toggleClass('path', pathNodes.has(i));
      });
      cy.edges().forEach(function (ed) {
        var j = ed.data('j');
        ed.toggleClass('path', pathEdges.has(j));
        var top = !!(res.topEdges && res.topEdges.has(j) && !pathEdges.has(j));
        ed.toggleClass('top', top);
        if (top) ed.data('w', 1 + 5 * Math.sqrt(G.edges[j][5] / maxEb));
      });
    });
    var full = opts.full !== false;
    runLayout(full);
    applyFocus(res.sel >= 0 ? G.nodes[res.sel].id : null, { keepView: true, dim: !!opts.dim });
    S.lastDraw = { ms: Math.round(performance.now() - t0), nodes: res.nodes.size, edges: res.edges.size };
    showList();
    reflect();
    syncUrl();
  }
  /** Focus one node: ring it, dim the rest, light its edges with their verbs (ported from focusNode). */
  function applyFocus(id, o) {
    o = o || {};
    var cy = S.cy;
    cy.elements().removeClass('gx-focus dim lit hood');
    if (!id) return;
    var node = cy.getElementById(id);
    if (node.empty()) return;
    var hood = node.closedNeighborhood();
    if (o.dim && S.res.paths.length === 0) cy.elements().not(hood).addClass('dim');
    hood.nodes().addClass('hood');
    node.connectedEdges().addClass('lit');
    node.addClass('gx-focus');
    if (!o.keepView) cy.animate({ center: { eles: node } }, { duration: 200 });
  }

  /* ------------------------------------------------------------ the list view */
  function showList() {
    var list = $('#gx-list'), cyEl = $('#gx-cy'), on = S.st.layout === 'list';
    list.hidden = !on; cyEl.style.visibility = on ? 'hidden' : '';
    if (!on) return;
    var G = S.G, rows = E.ranked(G, S.res.nodes, 'pagerank').slice(0, 500);
    list.innerHTML = '<table class="gx-table"><thead><tr><th>Node</th><th>Type</th><th class="num">Links</th><th class="num">Betweenness</th><th class="num">PageRank</th></tr></thead><tbody>' +
      rows.map(function (i) { var n = G.nodes[i]; return '<tr' + (i === S.res.sel ? ' class="is-sel"' : '') + '><td><button type="button" class="gx-link" data-go="' + esc(n.id) + '">' + esc(n.label) + '</button></td><td>' + esc(G.typeLabel[n.type]) + '</td><td class="num">' + n.deg + '</td><td class="num">' + (n.bc || 0).toFixed(2) + '</td><td class="num">' + (n.pr || 0).toFixed(2) + '</td></tr>'; }).join('') +
      '</tbody></table>' + (S.res.nodes.size > 500 ? '<p class="gx-note">The first 500 of ' + S.res.nodes.size + ', by PageRank.</p>' : '');
  }

  /* ------------------------------------------------------------ the panel */
  var short = function (u) { return String(u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, ''); };
  var dayShort = function (d) { return d ? new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }) : ''; };
  var srcChip = function (u, read) { if (!u) return ''; var ext = /^https?:/.test(u); return '<a class="chip src" href="' + esc(ext ? u : ROOT + u) + '"' + (ext ? ' rel="noopener"' : '') + '>' + esc(ext ? short(u) : u.split('/').slice(-2).join('/')) + (read ? ' · read ' + esc(dayShort(read)) : '') + '</a>'; };
  function panel() {
    var side = $('#gx-side'), G = S.G, res = S.res, h = '';
    if (res.paths.length) {
      var a = G.nodes[res.paths[0].nodes[0]], b = G.nodes[res.paths[0].nodes[res.paths[0].nodes.length - 1]];
      h += '<p class="kicker">How they connect</p><h2 class="gx-title">' + esc(a.label) + ' → ' + esc(b.label) + '</h2>';
      h += '<p class="gx-note">' + res.paths.length + ' shortest route' + (res.paths.length > 1 ? 's' : '') + ', each read as a sentence; every step names its source.</p>';
      res.paths.forEach(function (p, k) {
        var nodeBtn = function (x) { var nd = G.nodes[p.nodes[x]]; return '<button type="button" class="gx-link" data-go="' + esc(nd.id) + '">' + esc(nd.label) + '</button>'; };
        h += '<h3 class="mini-h">Route ' + (k + 1) + ' \u00b7 ' + p.length + ' step' + (p.length > 1 ? 's' : '') + '</h3><ul class="gx-route"><li class="gx-start">' + nodeBtn(0) + '</li>';
        p.hops.forEach(function (hp, x) { h += '<li><span class="gx-verb">' + esc(hp.verb.replace(/_/g, ' ')) + '</span> ' + nodeBtn(x + 1) + ' ' + srcChip(hp.source, hp.read) + '</li>'; });
        h += '</ul>';
      });
      h += '<p><button type="button" class="chip" data-act="clearpath">Clear the path</button></p>';
    }
    if (res.sel >= 0) h += recordHtml(res.sel);
    else if (!res.paths.length) {
      h += '<p class="kicker">The graph</p><h2 class="gx-title">' + esc(viewTitle()) + '</h2>';
      h += '<p class="gx-note">' + esc(E.statsText(E.graphStats(G, res.nodes, res.edges))) + '.</p>';
      if (res.notes.length) h += '<p class="gx-note">' + esc(res.notes.join(' ')) + '</p>';
      var top = E.ranked(G, res.nodes, S.st.top.by, 12);
      h += '<h3 class="mini-h">Most central here, by ' + esc(S.st.top.by) + '</h3><ol class="results gx-rank">' + top.map(function (i) { var n = G.nodes[i]; return '<li class="res"><span class="r-kind">' + esc(G.typeLabel[n.type]) + '</span><br><button type="button" class="gx-link r-title" data-go="' + esc(n.id) + '">' + esc(n.label) + '</button></li>'; }).join('') + '</ol>';
      h += '<p class="gx-note">Tap a node to read its record; double-tap to expand it. Find two companies in "How is … connected to …" to see the path between them.</p>';
    }
    h += legendHtml();
    side.innerHTML = h;
  }
  function viewTitle() {
    var v = S.st.view, d = (S.G.data.views.find(function (x) { return x.id === v; }) || {}).label;
    if (d) return d;
    var i = E.resolve(S.G, v); return i >= 0 ? S.G.nodes[i].label + ': its graph' : v;
  }
  function recordHtml(i) {
    var G = S.G, r = E.record(G, i), n = G.nodes[i], h = '';
    var kick = [G.typeLabel[n.type]];
    if (n.type === 'company' && n.category) { var t = G.byId.get('topic:' + n.category); if (t != null) kick.push(G.nodes[t].label); }
    if (n.type === 'event') kick.push(n.organiser === 'web-summit' ? 'Web Summit\'s programme' : 'Other organiser');
    h += '<p class="kicker">' + esc(kick.join(' · ')) + '</p><h2 class="gx-title">' + esc(n.label) + '</h2>';
    var facts = [];
    if (n.what) facts.push(['What they do', n.what]);
    if (n.country) facts.push(['Based in', n.country]);
    if (n.role) facts.push(['Listed as', n.role + (n.organisation ? ', ' + n.organisation : '')]);
    if (n.date) facts.push(['When', new Date(n.date + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) + (n.time ? ', ' + n.time.replace('-', ' to ') : '')]);
    if (n.kind) facts.push(['Kind', n.kind]);
    if (n.read && n.type === 'fact') facts.push(['Read', n.read + (n.by ? ' by ' + n.by : '')]);
    h += '<dl class="facts gx-facts">' + facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') +
      '<div><dt>Source</dt><dd>' + (srcChip(r.source) || 'none named') + '</dd></div>' +
      '<div><dt>Rank</dt><dd class="gx-num">' + r.rank.degree + ' links · betweenness ' + (r.rank.betweenness || 0).toFixed(2) + ' · PageRank ' + (r.rank.pagerank || 0).toFixed(2) + '</dd></div></dl>';
    h += '<p class="gx-btns">' + (n.page ? '<a class="btn primary" href="' + esc(ROOT + n.page) + '">Open its page</a> ' : '') +
      '<button type="button" class="btn quiet" data-act="expand" data-id="' + esc(n.id) + '">Expand</button> <button type="button" class="btn quiet" data-act="anchor" data-id="' + esc(n.id) + '">' + (S.st.anchors.indexOf(n.id) === -1 ? 'Anchor' : 'Unanchor') + '</button> <button type="button" class="btn quiet" data-act="focus" data-id="' + esc(n.id) + '">Explore from here</button> <button type="button" class="btn quiet" data-act="pathfrom" data-id="' + esc(n.id) + '">Path from here</button></p>';
    var groups = {};
    r.connections.list.forEach(function (c) { (groups[c.verb] = groups[c.verb] || []).push(c); });
    h += '<h3 class="mini-h">Connections · ' + r.connections.count + '</h3>';
    Object.keys(groups).sort(function (a, b) { return groups[b].length - groups[a].length; }).forEach(function (v) {
      var list = groups[v];
      h += '<details class="gx-conn"' + (list.length <= 8 ? ' open' : '') + '><summary><b>' + esc(v.replace(/_/g, ' ')) + '</b> <span class="n">' + list.length + '</span></summary><ul class="results">' +
        list.slice(0, 40).map(function (c) { return '<li class="res"><span class="r-kind">' + esc(G.typeLabel[c.type]) + '</span><br><button type="button" class="gx-link r-title" data-go="' + esc(c.id) + '" title="' + esc(c.text) + '">' + esc(c.label) + '</button><p class="r-meta">' + srcChip(c.source, c.read) + '</p></li>'; }).join('') +
        (list.length > 40 ? '<li class="res gx-note">and ' + (list.length - 40) + ' more</li>' : '') + '</ul></details>';
    });
    return h;
  }
  function legendHtml() {
    var counts = E.graphStats(S.G, S.res.nodes, S.res.edges).nodes;
    var cls = { company: 'l-co', person: 'l-person', event: 'l-session', topic: 'l-topic', place: 'l-place', organisation: 'l-org', day: 'l-day', track: 'l-track', fact: 'l-fact', source: 'l-source', evidence: 'l-evidence', story: 'l-story', article: 'l-article' };
    return '<p class="g-legend gx-legend">' + Object.keys(counts).map(function (t) { return '<span><i class="' + cls[t] + '"></i>' + esc(S.G.typeLabel[t].toLowerCase()) + ' ' + counts[t] + '</span>'; }).join('') + '</p>';
  }

  /* ------------------------------------------------------------ the bar reflects the state */
  function reflect() {
    var st = S.st, G = S.G;
    $('#gx-layout').value = st.layout;
    $('#gx-deg').textContent = st.depth === 'max' ? '∞' : st.depth;
    $('[data-deg="max"]').setAttribute('aria-pressed', st.depth === 'max');
    $('#gx-topn').value = String([0, 15, 30, 60, 120, 250].indexOf(st.top.n) !== -1 ? st.top.n : 0);
    if ($('#gx-topn').value !== String(st.top.n)) { var o = document.createElement('option'); o.textContent = st.top.n; $('#gx-topn').appendChild(o); $('#gx-topn').value = String(st.top.n); }
    $('#gx-by').value = st.top.by; $('#gx-what').value = st.top.what;
    var vis = E.graphStats(G, S.res.nodes, S.res.edges);
    rootEl.querySelectorAll('[data-world]').forEach(function (b) { b.setAttribute('aria-pressed', !st.worlds || st.worlds.indexOf(b.dataset.world) !== -1); });
    rootEl.querySelectorAll('[data-type]').forEach(function (b) { b.setAttribute('aria-pressed', !st.types || st.types.indexOf(b.dataset.type) !== -1); b.querySelector('.n').textContent = vis.nodes[b.dataset.type] || ''; });
    rootEl.querySelectorAll('[data-verb]').forEach(function (b) { b.setAttribute('aria-pressed', !st.verbs || st.verbs.indexOf(b.dataset.verb) !== -1); b.querySelector('.n').textContent = vis.edges[b.dataset.verb] || ''; });
    rootEl.querySelectorAll('[data-facet]').forEach(function (b) { var f = st.facets[b.dataset.facet] || []; b.setAttribute('aria-pressed', b.dataset.value ? f.indexOf(b.dataset.value) !== -1 : !f.length); });
    $('#gx-topic').value = (st.facets.category || [])[0] || ''; $('#gx-country').value = (st.facets.country || [])[0] || '';
    var sel = S.res.sel >= 0 ? G.nodes[S.res.sel].id : null;
    $('#gx-anchor').disabled = !sel; $('#gx-expand').disabled = !sel;
    $('#gx-anchor').textContent = sel && st.anchors.indexOf(sel) !== -1 ? 'Unanchor' : 'Anchor';
    var preset = E.PRESETS.find(function (p) { return p.key === S.preset; });
    $('#gx-view').value = preset ? preset.key : '';
    var cap = S.captions && S.preset && S.captions[S.preset]; $('#gx-caption').textContent = cap ? cap.caption : '';
    $('#gx-hint').textContent = S.res.nodes.size + ' nodes · ' + S.res.edges.size + ' edges' + (S.st.top.n ? ' · top ' + S.st.top.n + ' ' + S.st.top.what + ' by ' + S.st.top.by : '') + ' · drag, pinch or scroll to move; tap to select, double-tap to expand';
    panel();
  }
  function syncUrl() {
    var q = E.stateToQuery(S.st);
    try { history.replaceState(null, '', location.pathname + q + location.hash); } catch (e) { /* a sandboxed frame */ }
  }
  var url = function () { return location.origin + location.pathname + E.stateToQuery(S.st); };

  /* ------------------------------------------------------------ the API the chat commands drive */
  function need(id) { var i = E.resolve(S.G, id); if (i < 0) throw new Error('not in the graph: ' + id + ' (try graph.search)'); return S.G.nodes[i].id; }
  function summary() {
    var G = S.G, r = S.res;
    return { view: S.st.view, nodes: r.nodes.size, edges: r.edges.size, stats: E.statsText(E.graphStats(G, r.nodes, r.edges)),
      selected: r.sel >= 0 ? G.nodes[r.sel].id : null, anchors: S.st.anchors, focus: S.st.focus, depth: S.st.depth, layout: S.st.layout,
      top: S.st.top.n ? S.st.top : null, notes: r.notes.length ? r.notes : undefined, url: url() };
  }
  function set(patch, full) { Object.assign(S.st, patch); S.preset = null; draw({ full: full !== false }); return summary(); }
  var api = {
    ready: ready,
    load: function (a) { var v = (a && a.view) || 'whole'; return loadView(v).then(function (set_) { S.viewSet = set_; return set({ view: v, focus: null, anchors: [], expand: [], path: null, sel: null, top: Object.assign({}, S.st.top, { n: v === 'whole' ? (a && a.top) || 60 : 0 }) }); }); },
    focus: function (a) { var id = need(a.id); return set({ focus: id, depth: a.depth == null ? 1 : a.depth, sel: id, path: null, expand: [], top: Object.assign({}, S.st.top, { n: 0 }) }); },
    expand: function (a) { var id = need(a.id); var ex = S.st.expand.indexOf(id) === -1 ? S.st.expand.concat(id) : S.st.expand; var before = S.res.nodes.size; Object.assign(S.st, { expand: ex, sel: id }); draw({ full: false }); var s = summary(); s.added = S.res.nodes.size - before; return s; },
    filter: function (a) {
      a = a || {};
      if (a.reset) Object.assign(S.st, { types: null, verbs: null, worlds: null, facets: {} });
      ['types', 'verbs', 'worlds'].forEach(function (k) { if (a[k] !== undefined) S.st[k] = a[k] && a[k].length ? a[k] : null; });
      if (a.facets) Object.keys(a.facets).forEach(function (k) { var v = a.facets[k]; S.st.facets[k] = v == null || v === '' ? [] : [].concat(v).map(String); });
      return set({});
    },
    anchors: function (a) { var mode = (a && a.mode) || 'set', ids = ((a && a.ids) || []).map(need); var cur = mode === 'add' ? S.st.anchors.concat(ids.filter(function (x) { return S.st.anchors.indexOf(x) === -1; })) : mode === 'clear' ? [] : ids; return set({ anchors: cur, top: Object.assign({}, S.st.top, { n: cur.length ? 0 : S.st.top.n }) }); },
    top: function (a) {
      a = a || {}; var t = { n: Math.max(0, a.n | 0), by: a.by || S.st.top.by, what: a.what || 'nodes' };
      var s = set({ top: t }), G = S.G;
      if (t.what === 'edges' && S.res.topEdges) s.ranking = Array.from(S.res.topEdges).sort(function (x, y) { return G.edges[y][5] - G.edges[x][5]; }).slice(0, 15).map(function (j) { var e = G.edges[j]; return G.nodes[e[0]].label + ' ' + G.verbs[e[2]].verb + ' ' + G.nodes[e[1]].label; });
      else s.ranking = E.ranked(G, S.res.nodes, t.by, 15).map(function (i) { return G.nodes[i].id; });
      return s;
    },
    layout: function (a) { var n = a && a.name; if (E.LAYOUTS.indexOf(n) === -1) throw new Error('layout is one of ' + E.LAYOUTS.join(', ')); return set({ layout: n }); },
    path: function (a) {
      var f = need(a.from), t = need(a.to); if (a.avoid) S.st.avoid = a.avoid;
      var s = set({ path: [f, t], sel: null, top: Object.assign({}, S.st.top, { n: 0 }), focus: null, expand: [] });
      var G = S.G; s.paths = S.res.paths.map(function (p) { return { length: p.length, nodes: p.nodes.map(function (i) { return G.nodes[i].id; }), verbs: p.hops.map(function (h) { return h.verb; }), sentence: p.sentence }; });
      return s;
    },
    select: function (a) { var id = need(a.id); if (S.res.nodes.has(S.G.byId.get(id))) { S.st.sel = id; S.res.sel = S.G.byId.get(id); applyFocus(id, { dim: true, keepView: a.center === false }); reflect(); syncUrl(); } else { Object.assign(S.st, { sel: id }); S.preset = null; draw({ full: false, dim: true }); } return E.record(S.G, S.G.byId.get(id), { limit: 30 }); },
    clear: function () { S.st.sel = null; S.res.sel = -1; applyFocus(null); reflect(); syncUrl(); return summary(); },
    state: function () { var s = summary(); s.filters = { worlds: S.st.worlds, types: S.st.types, verbs: S.st.verbs, facets: S.st.facets }; s.expand = S.st.expand; s.path = S.st.path; s.draw_ms = S.lastDraw && S.lastDraw.ms; s.visible_sample = E.ranked(S.G, S.res.nodes, 'pagerank', 20).map(function (i) { return S.G.nodes[i].id; }); return s; },
    snapshot: function (a) { var T = tokens(); var data_url = S.cy.png({ output: 'base64uri', full: !!(a && a.full), scale: 1, maxWidth: 900, maxHeight: 700, bg: T.panel }); return { data_url: data_url, bytes: data_url.length, full: !!(a && a.full), note: 'attach as an image so the model sees the layout' }; },
    reset: function () { S.viewSet = null; S.st = E.defaultState(); S.preset = (E.PRESETS[0] || {}).key || 'overview'; draw(); return summary(); },
    preset: function (a) { var p = E.PRESETS.find(function (x) { return x.key === (a && a.key); }); if (!p) throw new Error('preset is one of ' + E.PRESETS.map(function (x) { return x.key; }).join(', ')); return loadView(p.state.view).then(function (vs) { S.viewSet = vs; var st = E.defaultState(); Object.keys(p.state).forEach(function (k) { st[k] = JSON.parse(JSON.stringify(p.state[k])); }); st.top = Object.assign({ n: 0, by: 'pagerank', what: 'nodes' }, st.top); S.st = st; S.preset = p.key; draw(); return summary(); }); },
    get engine() { return S.G; },
  };
  window.NRGraphExplorer = api;

  /* ------------------------------------------------------------ the bar's controls */
  function pressGroup(attr, key) {
    rootEl.querySelectorAll('[' + attr + ']').forEach(function (b) {
      b.addEventListener('click', function () {
        var all = Array.from(rootEl.querySelectorAll('[' + attr + ']')).map(function (x) { return x.getAttribute(attr); });
        var cur = S.st[key] ? S.st[key].slice() : all.slice(), v = b.getAttribute(attr), k = cur.indexOf(v);
        if (k === -1) cur.push(v); else cur.splice(k, 1);
        api.filter(Object.fromEntries([[key, cur.length === all.length ? null : cur]]));
      });
    });
  }
  function bindBar() {
    var G = S.G;
    var vsel = $('#gx-view');
    E.PRESETS.forEach(function (p) { var o = document.createElement('option'); o.value = p.key; o.textContent = p.label; vsel.appendChild(o); });
    vsel.addEventListener('change', function () { if (vsel.value) api.preset({ key: vsel.value }); });
    $('#gx-layout').addEventListener('change', function (e) { api.layout({ name: e.target.value }); });
    rootEl.querySelectorAll('[data-deg]').forEach(function (b) { b.addEventListener('click', function () { set({ depth: E.nextDegree(S.st.depth, b.dataset.deg) }); }); });
    var topc = function () { api.top({ n: +$('#gx-topn').value, by: $('#gx-by').value, what: $('#gx-what').value }); };
    ['#gx-topn', '#gx-by', '#gx-what'].forEach(function (s) { $(s).addEventListener('change', topc); });
    $('#gx-anchor').addEventListener('click', function () { var id = S.st.sel; if (!id) return; var on = S.st.anchors.indexOf(id) !== -1; api.anchors({ ids: on ? S.st.anchors.filter(function (x) { return x !== id; }) : S.st.anchors.concat(id) }); });
    $('#gx-expand').addEventListener('click', function () { if (S.st.sel) api.expand({ id: S.st.sel }); });
    $('#gx-reset').addEventListener('click', function () { api.reset(); });
    var share = $('#gx-share'), png = document.createElement('button'); png.type = 'button'; png.className = 'chip'; png.id = 'gx-png'; png.textContent = 'Save PNG'; png.title = 'Download the graph as a picture'; share.parentNode.insertBefore(png, share);
    var cp = document.createElement('p'); cp.className = 'gx-caption'; cp.id = 'gx-caption'; cp.setAttribute('aria-live', 'polite'); $('#gx-canvas').parentNode.insertBefore(cp, $('#gx-canvas'));
    $('#gx-png').addEventListener('click', function () { var T = tokens(); S.cy.png({ output: 'blob-promise', full: true, scale: 2, maxWidth: 4000, maxHeight: 4000, bg: T.panel }).then(function (bl) { var a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = 'promptugal-graph' + (S.preset ? '-' + S.preset : '') + '.png'; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000); }); });
    $('#gx-share').addEventListener('click', function () { var b = $('#gx-share'); (navigator.clipboard ? navigator.clipboard.writeText(url()) : Promise.reject()).then(function () { b.textContent = 'Copied'; }, function () { b.textContent = 'Link in the address bar'; }); setTimeout(function () { b.textContent = 'Copy link'; }, 1800); });
    pressGroup('data-world', 'worlds'); pressGroup('data-type', 'types'); pressGroup('data-verb', 'verbs');
    rootEl.querySelectorAll('[data-facet]').forEach(function (b) { b.addEventListener('click', function () { var f = {}; f[b.dataset.facet] = b.dataset.value ? [b.dataset.value] : []; api.filter({ facets: f }); }); });
    var days = $('#gx-days');
    G.nodes.filter(function (n) { return n.type === 'day'; }).sort(function (a, b) { return a.id.localeCompare(b.id); }).forEach(function (n) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.dataset.facet = 'date'; b.dataset.value = n.id.slice(4); b.setAttribute('aria-pressed', 'false');
      b.textContent = new Date(n.id.slice(4) + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
      b.addEventListener('click', function () { var cur = (S.st.facets.date || []).slice(), k = cur.indexOf(b.dataset.value); if (k === -1) cur.push(b.dataset.value); else cur.splice(k, 1); api.filter({ facets: { date: cur } }); });
      days.appendChild(b);
    });
    G.nodes.filter(function (n) { return n.type === 'topic' && n.kind === 'field'; }).sort(function (a, b) { return a.label.localeCompare(b.label); }).forEach(function (n) { var o = document.createElement('option'); o.value = n.id.slice(6); o.textContent = n.label; $('#gx-topic').appendChild(o); });
    var cs = {}; G.nodes.forEach(function (n) { if (n.type === 'company' && n.country) { var c = n.country.replace(/\s*\(.*$/, ''); cs[c] = (cs[c] || 0) + 1; } });
    Object.keys(cs).sort().forEach(function (c) { var o = document.createElement('option'); o.value = c; o.textContent = c + ' (' + cs[c] + ')'; $('#gx-country').appendChild(o); });
    $('#gx-topic').addEventListener('change', function (e) { api.filter({ facets: { category: e.target.value ? [e.target.value] : [] } }); });
    $('#gx-country').addEventListener('change', function (e) { api.filter({ facets: { country: e.target.value ? [e.target.value] : [] } }); });
    $('#gx-clearf').addEventListener('click', function () { api.filter({ reset: true }); });
    rootEl.querySelectorAll('[data-zoom]').forEach(function (b) { b.addEventListener('click', function () { var cy = S.cy, z = b.dataset.zoom; if (z === 'fit') cy.fit(cy.elements(), 30); else cy.zoom({ level: cy.zoom() * (z === 'in' ? 1.3 : 1 / 1.3), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } }); }); });
    // find, with suggestions (the designer's .search-pop)
    var q = $('#gx-q'), pop = $('#gx-pop'), hits = [], cur = 0;
    var showPop = function () {
      hits = E.search(G, q.value, { limit: 8 }); cur = 0;
      pop.hidden = !hits.length; q.setAttribute('aria-expanded', !!hits.length);
      pop.innerHTML = hits.map(function (h, k) { return '<a class="sp-item" role="option" href="#" data-go="' + esc(h.id) + '" aria-selected="' + (k === 0) + '"><span class="t1">' + esc(h.label) + '</span><span class="k tag">' + esc(G.typeLabel[h.type]) + '</span></a>'; }).join('');
    };
    q.addEventListener('input', showPop);
    q.addEventListener('keydown', function (e) {
      if (pop.hidden || !hits.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); cur = (cur + (e.key === 'ArrowDown' ? 1 : hits.length - 1)) % hits.length; pop.querySelectorAll('.sp-item').forEach(function (a, k) { a.setAttribute('aria-selected', k === cur); }); }
      if (e.key === 'Escape') { pop.hidden = true; }
    });
    $('.gx-find').addEventListener('submit', function (e) { e.preventDefault(); var h = hits[cur] || E.search(G, q.value, { limit: 1 })[0]; if (h) { pop.hidden = true; q.value = h.label; api.focus({ id: h.id, depth: 1 }); } });
    document.addEventListener('click', function (e) { if (!e.target.closest('.gx-find')) pop.hidden = true; });
    $('#gx-pathf').addEventListener('submit', function (e) {
      e.preventDefault();
      try { api.path({ from: $('#gx-from').value, to: $('#gx-to').value }); } catch (err) { $('#gx-hint').textContent = err.message; }
    });
    // clicks inside the panel, the list and the suggestions
    rootEl.addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]');
      if (go) { e.preventDefault(); pop.hidden = true; var id = go.dataset.go; if (S.res.nodes.has(G.byId.get(id))) api.select({ id: id }); else api.focus({ id: id, depth: 1 }); return; }
      var act = e.target.closest('[data-act]');
      if (!act) return;
      var a = act.dataset.act, id = act.dataset.id;
      if (a === 'expand') api.expand({ id: id });
      else if (a === 'anchor') { var on = S.st.anchors.indexOf(id) !== -1; api.anchors({ ids: on ? S.st.anchors.filter(function (x) { return x !== id; }) : S.st.anchors.concat(id) }); }
      else if (a === 'focus') api.focus({ id: id, depth: 1 });
      else if (a === 'pathfrom') { $('#gx-from').value = G.nodes[G.byId.get(id)].label; $('#gx-to').focus(); }
      else if (a === 'clearpath') set({ path: null });
    });
  }

  /* ------------------------------------------------------------ boot */
  function boot(data) {
    S.G = E.index(data);
    if (data.presets && data.presets.length) { E.PRESETS.length = 0; data.presets.forEach(function (p) { E.PRESETS.push(p); }); }   /* a graph may bring its own presets, in the shape engine.js's PRESETS has */
    var st = E.parseState(location.search), want = /[?&]preset=([\w-]+)/.exec(location.search);
    if (!want && !st.fromUrl && data.presets && data.presets.length) want = ['', data.presets[0].key];   /* a graph with presets of its own opens on its first */
    S.st = st; S.preset = st.fromUrl ? null : ((E.PRESETS[0] || {}).key || 'overview');
    S.cy = window.cytoscape({ container: $('#gx-cy'), style: style(tokens()), minZoom: 0.05, maxZoom: 4, boxSelectionEnabled: false,
      textureOnViewport: true, hideEdgesOnViewport: false, motionBlur: false, pixelRatio: 'auto' });
    S.cy.on('tap', 'node', function (e) { api.select({ id: e.target.id(), center: false }); });
    S.cy.on('tap', function (e) { if (e.target === S.cy) api.clear(); });
    S.cy.on('dbltap', 'node', function (e) { api.expand({ id: e.target.id() }); });
    /* label culling: below a zoom, only the most central keep their names; zoomed in, every name shows */
    var zt = 0; S.cy.on('zoom', function () { if (zt) return; zt = setTimeout(function () { zt = 0; rootEl.classList.toggle('gx-zoomed', S.cy.zoom() > 1.4); if (S.cy.zoom() > 1.4) S.cy.nodes('.nl').addClass('hood'); else if (!S.st.sel) S.cy.nodes('.hood').removeClass('hood'); }, 120); });
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && mq.addEventListener) mq.addEventListener('change', function () { S.cy.style(style(tokens())); });
    window.addEventListener('promptugal:theme-changed', function () { S.cy.style(style(tokens())); });   // the theme picker (assets/themes.js)
    bindBar();
    var viewErr = null;
    return loadView(st.view).catch(function (err) { viewErr = err.message; S.st.view = 'whole'; if (!/[?&]top=/.test(location.search)) S.st.top.n = 60; return null; }).then(function (vs) {
      S.viewSet = vs;
      draw();
      if (viewErr) $('#gx-hint').textContent = viewErr + '. Showing the whole graph.';
      readyResolve(api);
      if (want && E.PRESETS.some(function (p) { return p.key === want[1]; })) api.preset({ key: want[1] });
    });
  }
  var capUrl = rootEl.getAttribute('data-captions');
  if (capUrl) fetch(capUrl).then(function (r) { return r.json(); }).then(function (j) { S.captions = j.presets; if (S.res) reflect(); }).catch(function () { });
  fetch(rootEl.getAttribute('data-data')).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(boot).catch(function (err) { $('#gx-hint').textContent = 'The graph did not load: ' + err.message; readyResolve(null); });
})();
