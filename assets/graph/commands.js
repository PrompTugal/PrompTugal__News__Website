/* The graph's commands for a chat, on every page. Registered through the page's tool queue, which works whatever
   the load order: (window.__toolQueue = window.__toolQueue || []).push(['register', name, spec]).
   On /graph/ the view commands drive the explorer (window.NRGraphExplorer); anywhere else they answer with the
   explorer's address for the state they ask for, and open it when asked (open: true). The read commands (search,
   query, select, path) answer on any page: they load the engine and the compact graph themselves.
   Results are compact. For a console without the tool API: window.NRGraphTools.call('graph.focus', {id: 'replit'}).
   By newsroom-graph@web-summit.dinis, 5 November 2026 (WS-14); after graphs.sgit.ai's view commands (select_node,
   explore_selection, pin_nodes, rank_nodes, graph_snapshot, get_state). */
(function () {
  'use strict';
  var me = document.currentScript, ROOT = me && me.src ? me.src.replace(/assets\/graph\/commands\.js.*$/, '') : '/';
  var onPage = function () { return !!document.getElementById('gx'); };
  var own = null;
  function loadScript(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { no(new Error('could not load ' + src)); }; document.head.appendChild(s); }); }
  /* the engine over the whole graph: the explorer's own on /graph/, else loaded once */
  function graph() {
    if (onPage() && window.NRGraphExplorer) return window.NRGraphExplorer.ready.then(function (api) { if (!api) throw new Error('the explorer did not load'); return api.engine; });
    if (onPage()) return new Promise(function (ok) { setTimeout(ok, 300); }).then(graph);
    return own || (own = (window.NRGraphEngine ? Promise.resolve() : loadScript(ROOT + 'assets/graph/engine.js'))
      .then(function () { return fetch(ROOT + 'api/v1/graph/explorer.json'); })
      .then(function (r) { if (!r.ok) throw new Error('the graph did not load (HTTP ' + r.status + ')'); return r.json(); })
      .then(function (d) { return window.NRGraphEngine.index(d); }));
  }
  function explorer() {
    var wait = function (n) { return window.NRGraphExplorer ? window.NRGraphExplorer.ready : n > 0 ? new Promise(function (ok) { setTimeout(ok, 200); }).then(function () { return wait(n - 1); }) : Promise.reject(new Error('the explorer is not ready')); };
    return wait(25);
  }
  var E = function () { return window.NRGraphEngine; };
  function id(G, x) { var i = E().resolve(G, x); if (i < 0) throw new Error('not in the graph: ' + x + ' (try graph.search)'); return G.nodes[i].id; }
  var enc = function (v) { return encodeURIComponent(v).replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%7E/g, '~').replace(/%3B/g, ';').replace(/%2F/g, '/').replace(/%7C/g, '|'); };
  /* off the explorer: the address of the state asked for, opened only with open: true */
  function offPage(query, a) {
    var url = ROOT + 'graph/' + (query ? '?' + query : '');
    var out = { on_page: false, url: url, note: 'The explorer is not on this page. ' + (a && a.open ? 'Opening it.' : 'Open this address (or call again with open: true) to see it.') };
    if (a && a.open) setTimeout(function () { location.assign(url); }, 50);
    return out;
  }
  /* a view command: on /graph/ the explorer runs it; elsewhere, query(G, args) builds the address */
  function view(method, query) {
    return function (a) {
      a = a || {};
      if (onPage()) return explorer().then(function (api) { if (!api) throw new Error('the explorer did not load'); return api[method](a); });
      return graph().then(function (G) { return offPage(query(G, a), a); });
    };
  }
  var S = { type: 'string' }, IDS = { type: 'array', items: S }, OPEN = { type: 'boolean', description: 'off /graph/: navigate there (default false: return the address)' };
  var TYPES = ['company', 'organisation', 'person', 'event', 'place', 'day', 'track', 'topic', 'fact', 'source', 'evidence', 'story', 'article'];
  var COMMANDS = [
    ['graph.load', 'view', 'Show a view of the graph: whole (the 60 most central nodes), industry, summit, people, or one entity\'s graph: companies/<slug>, events/<slug>, people/<slug>.',
      { view: { type: 'string', description: 'whole | industry | summit | people | companies/<slug> | events/<slug> | people/<slug>' }, open: OPEN }, ['view'],
      view('load', function (G, a) { return 'view=' + enc(a.view || 'whole'); })],
    ['graph.focus', 'view', 'Explore from one node: it and its neighbours to the given depth. Ids look like company:replit; a name works too.',
      { id: { type: 'string', description: 'node id (company:replit) or name' }, depth: { description: 'hops, default 1; "max" for everything connected', oneOf: [{ type: 'integer', minimum: 0, maximum: 6 }, { const: 'max' }] }, open: OPEN }, ['id'],
      view('focus', function (G, a) { return 'focus=' + enc(id(G, a.id)) + (a.depth != null && a.depth !== 1 ? '&depth=' + a.depth : ''); })],
    ['graph.expand', 'view', 'Add a node\'s neighbours (one hop) to what is drawn; nothing already drawn moves.',
      { id: { type: 'string' }, open: OPEN }, ['id'],
      view('expand', function (G, a) { var x = id(G, a.id); return 'focus=' + enc(x) + '&expand=' + enc(x); })],
    ['graph.filter', 'view', 'Filter what is shown, at four levels. Omitted keys stay as they are; null or [] shows all; reset: true clears every filter first.',
      { types: { type: 'array', items: { enum: TYPES } }, verbs: { type: 'array', items: S, description: 'ontology verbs, e.g. speaks_at, filed_under, appears_in' }, worlds: { type: 'array', items: { enum: ['summit', 'people', 'industry', 'evidence'] } },
        facets: { type: 'object', description: 'date (YYYY-MM-DD), organiser (web-summit | other), kind (session, pitch, side-event...), track, category (a field id, e.g. security), country', additionalProperties: { type: 'array', items: S } }, reset: { type: 'boolean' }, open: OPEN }, [],
      view('filter', function (G, a) { var q = []; ['types', 'verbs', 'worlds'].forEach(function (k) { if (a[k] && a[k].length) q.push(k + '=' + enc(a[k].join(','))); }); var f = a.facets ? Object.keys(a.facets).filter(function (k) { return a.facets[k] && [].concat(a.facets[k]).length; }) : []; if (f.length) q.push('facets=' + enc(f.map(function (k) { return k + ':' + [].concat(a.facets[k]).join('|'); }).join(';'))); return q.join('&'); })],
    ['graph.anchors', 'view', 'Pin the nodes to start from. Anchors sit on the canvas\'s left and right edges through every layout; the view walks out from them.',
      { ids: IDS, mode: { enum: ['set', 'add', 'clear'], description: 'default set' }, open: OPEN }, ['ids'],
      view('anchors', function (G, a) { return a.mode === 'clear' ? '' : 'anchors=' + enc((a.ids || []).map(function (x) { return id(G, x); }).join(',')); })],
    ['graph.top', 'view', 'Keep the top n nodes (or edges) by a ranking over the whole graph: pagerank, betweenness or degree; for edges, edge betweenness (the bridges). n 0 shows all. Returns the ranking.',
      { n: { type: 'integer', minimum: 0, maximum: 1500 }, by: { enum: ['pagerank', 'betweenness', 'degree'] }, what: { enum: ['nodes', 'edges'] }, open: OPEN }, ['n'],
      view('top', function (G, a) { return 'top=' + (a.n | 0) + (a.by ? '&by=' + a.by : '') + (a.what === 'edges' ? '&what=edges' : ''); })],
    ['graph.layout', 'view', 'Change the layout: force, map (the whole graph laid out at build), radial (rings by hops from the anchors), layered (by world), tree, grid, or list (a table).',
      { name: { enum: ['force', 'map', 'radial', 'layered', 'tree', 'grid', 'list'] }, open: OPEN }, ['name'],
      view('layout', function (G, a) { return 'layout=' + enc(a.name); })],
    ['graph.path', 'view', 'How is one node connected to another? Up to three shortest routes, each with its verbs and read as a sentence. On /graph/ it is also drawn.',
      { from: S, to: S, max: { type: 'integer', minimum: 1, maximum: 8, description: 'most hops, default 6' }, avoid: { type: 'array', items: { enum: TYPES }, description: 'node types not to pass through; default ["day"]' }, open: OPEN }, ['from', 'to'],
      function (a) {
        if (onPage()) return explorer().then(function (api) { return api.path(a); });
        return graph().then(function (G) {
          var f = E().resolve(G, a.from), t = E().resolve(G, a.to);
          if (f < 0 || t < 0) throw new Error('not in the graph: ' + (f < 0 ? a.from : a.to));
          var ps = E().shortestPaths(G, f, t, { max: a.max, avoid: a.avoid });
          var out = offPage('path=' + enc(G.nodes[f].id + '~' + G.nodes[t].id), a);
          out.paths = ps.map(function (p) { return { length: p.length, nodes: p.nodes.map(function (i) { return G.nodes[i].id; }), verbs: p.hops.map(function (h) { return h.verb; }), sentence: p.sentence }; });
          return out;
        });
      }],
    ['graph.select', 'view', 'A node\'s record: its facts, its rank, every connection read as a sentence with its source, and its page. On /graph/ it is also selected.',
      { id: S }, ['id'],
      function (a) {
        if (onPage()) return explorer().then(function (api) { return api.select(a); });
        return graph().then(function (G) { var r = E().record(G, E().resolve(G, id(G, a.id)), { limit: 30 }); r.explore = ROOT + 'graph/?focus=' + enc(r.id); if (r.page) r.page = ROOT + r.page; return r; });
      }],
    ['graph.state', 'read', 'What the graph shows now: the view, filters, anchors, focus, counts, the selection and the shareable address.',
      {}, [],
      function () {
        if (onPage()) return explorer().then(function (api) { return api.state(); });
        var fig = document.querySelector('.minigraph');
        return Promise.resolve({ on_page: false, url: ROOT + 'graph/', minigraph: fig ? { focus: fig.getAttribute('data-focus'), nodes: Array.from(fig.querySelectorAll('.g-node')).map(function (g) { return g.getAttribute('data-id'); }), explore: ROOT + 'graph/?focus=' + enc(fig.getAttribute('data-focus')) } : null });
      }],
    ['graph.snapshot', 'view', 'The graph canvas as a PNG data URL, to attach as an image so the model sees the layout. Only on /graph/.',
      { full: { type: 'boolean', description: 'the whole drawing rather than the visible part' } }, [],
      function (a) {
        if (onPage()) return explorer().then(function (api) { return api.snapshot(a); });
        return Promise.resolve({ on_page: false, url: ROOT + 'graph/', note: 'No graph canvas on this page; open the explorer first.' });
      }],
    ['graph.query', 'read', 'Query the whole graph. With verb, from or to: matching edges (verbs may be inverses, e.g. has_speaker; from and to may be ids, names or types). Otherwise: nodes by type and text.',
      { type: { enum: TYPES }, verb: S, from: S, to: S, text: S, limit: { type: 'integer', minimum: 1, maximum: 200 } }, [],
      function (a) { return graph().then(function (G) { return E().query(G, a); }); }],
    ['graph.search', 'read', 'Find nodes by name; returns ids for the other commands.',
      { text: S, type: { enum: TYPES }, limit: { type: 'integer', minimum: 1, maximum: 50 } }, ['text'],
      function (a) { return graph().then(function (G) { return { results: E().search(G, a.text, { type: a.type, limit: a.limit || 8 }) }; }); }],
    ['graph.reset', 'view', 'Back to the start view: the 60 most central nodes, no filters.',
      { open: OPEN }, [],
      view('reset', function () { return ''; })],
  ];
  var byName = {};
  var Q = (window.__toolQueue = window.__toolQueue || []);
  COMMANDS.forEach(function (c) {
    var spec = { level: c[1], description: c[2], params: { type: 'object', properties: c[3], required: c[4], additionalProperties: false }, run: function (args) { return Promise.resolve().then(function () { return c[5](args || {}); }); } };
    byName[c[0]] = spec;
    Q.push(['register', c[0], spec]);
  });
  window.NRGraphTools = { commands: byName, names: Object.keys(byName), call: function (name, args) { if (!byName[name]) return Promise.reject(new Error('no command ' + name)); return byName[name].run(args); } };
})();
