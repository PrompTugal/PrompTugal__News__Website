/* The graph explorer's engine: pure functions over the compact graph (api/v1/graph/explorer.json). No DOM, no
   Cytoscape. Used by the explorer (/graph/) and by the chat commands on any page (assets/graph/commands.js).
   By newsroom-graph@web-summit.dinis, 5 November 2026 (WS-14).

   Ported from graphs.sgit.ai's universe reader (SGit-AI/SGit-AI__Website__Graphs, Apache-2.0; see the notes on
   each function): the N-degree explore walk with its closing sweep and the degree stepper (assets/universe/core/
   explore.js), the stats line (same file), the displayed-verb index and the path query (core/pathquery.js), and the
   border slots that hold pinned nodes (core/slots.js). Adapted from Cytoscape element data to the compact index.
   The rest (views, facets, ranking, shortest paths read as sentences, records, search) is this newsroom's.

   window.NRGraphEngine = { index, compute, defaultState, parseState, stateToQuery, search, resolve, record,
     shortestPaths, query, ranked, neighbourhood, nextDegree, graphStats, statsText, displayedVerbIndex,
     runPathQuery, defaultAssignments, slotPositions, SLOT_COUNT, PRESETS } */
(function () {
  'use strict';

  /* ------------------------------------------------------------ the index */
  function index(data) {
    var nodes = data.nodes, edges = data.edges;
    var byId = new Map(), adj = new Array(nodes.length), world = {}, typeLabel = {}, track = new Map();
    nodes.forEach(function (n, i) { byId.set(n.id, i); adj[i] = []; });
    edges.forEach(function (e, j) { adj[e[0]].push(j); if (e[1] !== e[0]) adj[e[1]].push(j); });
    data.types.forEach(function (t) { world[t.id] = t.world; typeLabel[t.id] = t.label; });
    var verbIdx = new Map(data.verbs.map(function (v, i) { return [v.verb, i]; }));
    var inverseIdx = new Map(data.verbs.map(function (v, i) { return [v.inverse, i]; }));
    var inTrack = verbIdx.get('in_track');
    edges.forEach(function (e) { if (e[2] === inTrack) track.set(e[0], nodes[e[1]].id.slice(6)); });
    return { data: data, nodes: nodes, edges: edges, byId: byId, adj: adj, world: world, typeLabel: typeLabel,
      verbs: data.verbs, verbIdx: verbIdx, inverseIdx: inverseIdx, track: track, sources: data.sources };
  }
  var other = function (G, j, i) { var e = G.edges[j]; return e[0] === i ? e[1] : e[0]; };

  /* ------------------------------------------------------------ ported: explore (universe/core/explore.js) */
  /** The ids kept by an N-degree walk from the start nodes, over undirected edges. Edges between kept nodes are
      kept (the closing sweep: or the view would show a false gap). Ported from neighbourhoodIds, over the index:
      okNode/okEdge are the filters, so the walk never crosses what the reader has hidden. */
  function neighbourhood(G, starts, degrees, okNode, okEdge) {
    var keep = new Set(), frontier = [];
    starts.forEach(function (s) { if (!keep.has(s)) { keep.add(s); frontier.push(s); } });
    for (var d = 0; d < degrees && frontier.length; d++) {
      var next = [];
      for (var k = 0; k < frontier.length; k++) {
        var v = frontier[k], a = G.adj[v];
        for (var q = 0; q < a.length; q++) {
          var j = a[q]; if (!okEdge(j)) continue;
          var w = other(G, j, v); if (!okNode(w) || keep.has(w)) continue;
          keep.add(w); next.push(w);
        }
      }
      frontier = next;
    }
    return keep;
  }
  /** The next explore degree from a stepper action: 'max' toggles; leaving it lands back on 1 (ported as is). */
  function nextDegree(cur, dir) {
    if (dir === 'max') return cur === 'max' ? 1 : 'max';
    if (cur === 'max') return 1;
    return dir === 'up' ? cur + 1 : Math.max(0, cur - 1);
  }
  /** Count what a view holds, node types and edge verbs apart (ported from graphStats). */
  function graphStats(G, nodeSet, edgeSet) {
    var nodes = {}, edges = {};
    nodeSet.forEach(function (i) { var t = G.nodes[i].type; nodes[t] = (nodes[t] || 0) + 1; });
    edgeSet.forEach(function (j) { var v = G.verbs[G.edges[j][2]].verb; edges[v] = (edges[v] || 0) + 1; });
    return { nodes: nodes, edges: edges };
  }
  /** One readable line from the counts (ported from statsText). */
  function statsText(stats) {
    var part = function (m) { return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; }).map(function (k) { return m[k] + ' ' + k.replace(/_/g, ' '); }).join(' · '); };
    var n = part(stats.nodes), e = part(stats.edges);
    if (!n && !e) return 'nothing visible';
    return (n || 'no nodes') + (e ? '. Edges: ' + e : '');
  }

  /* ------------------------------------------------------------ ported: path query (universe/core/pathquery.js) */
  var MAX_PATHS = 500;
  /** Displayed verbs to stored direction: a stored verb walks out, its declared inverse walks in (ported as is). */
  function displayedVerbIndex(verbs) {
    var idx = {};
    verbs.forEach(function (v) {
      idx[v.verb] = { stored: v.verb, dir: 'out' };
      if (v.inverse && v.inverse !== v.verb && !idx[v.inverse]) idx[v.inverse] = { stored: v.verb, dir: 'in' };
    });
    return idx;
  }
  /** Run a typed path query: steps [{verb, id?, type?}], the first a start constraint, every later one a hop that
      names the verb followed (stored or inverse) and constrains where it lands. Every matching path, capped. Ported
      from runPathQuery (family became type; elements became the index). */
  function runPathQuery(G, steps, startIds) {
    if (!steps || !steps.length) return { paths: [], truncated: false };
    var idx = displayedVerbIndex(G.verbs), truncated = false;
    var fits = function (i, st) { var n = G.nodes[i]; return st.id ? n.id === st.id : (st.type ? n.type === st.type : true); };
    var paths = [];
    G.nodes.forEach(function (n, i) { if (fits(i, steps[0]) && (!startIds || startIds.indexOf(n.id) !== -1)) paths.push([i]); });
    for (var s = 1; s < steps.length && paths.length; s++) {
      var st = steps[s], r = idx[st.verb] || { stored: st.verb, dir: 'out' }, vi = G.verbIdx.get(r.stored), next = [];
      for (var p = 0; p < paths.length; p++) {
        var path = paths[p], cur = path[path.length - 1];
        G.adj[cur].forEach(function (j) {
          var e = G.edges[j]; if (e[2] !== vi) return;
          if (r.dir === 'out' ? e[0] !== cur : e[1] !== cur) return;
          var nid = r.dir === 'out' ? e[1] : e[0];
          if (!fits(nid, st) || path.indexOf(nid) !== -1) return;
          if (next.length >= MAX_PATHS) { truncated = true; return; }
          next.push(path.concat(nid));
        });
      }
      paths = next;
    }
    return { paths: paths.map(function (p) { return p.map(function (i) { return G.nodes[i].id; }); }), truncated: truncated };
  }

  /* ------------------------------------------------------------ ported: border slots (universe/core/slots.js) */
  var SLOT_COUNT = 7;
  /** Anchors fill the left slots, then the right, top to bottom (ported from defaultAssignments). */
  function defaultAssignments(leftIds, rightIds) {
    var a = {};
    (leftIds || []).slice(0, SLOT_COUNT).forEach(function (id, i) { a[id] = { area: 'left', slot: i }; });
    (rightIds || []).slice(0, SLOT_COUNT).forEach(function (id, i) { a[id] = { area: 'right', slot: i }; });
    return a;
  }
  /** Canvas positions for slotted pins: each area a border band, its slots spread along it; the field between
      scales with how many free nodes must settle (ported from slotPositions). */
  function slotPositions(assignments, freeCount) {
    var w = Math.max(700, freeCount * 26), h = Math.max(480, freeCount * 14), pos = {};
    var along = function (slot, size, used) { return ((slot + 1) * size) / ((used || SLOT_COUNT) + 1); };
    var used = { top: 0, right: 0, bottom: 0, left: 0 };
    Object.keys(assignments).forEach(function (id) { used[assignments[id].area]++; });
    Object.keys(assignments).forEach(function (id) {
      var a = assignments[id], area = a.area, slot = a.slot;
      if (area === 'top') pos[id] = { x: along(slot, w, used.top), y: 0 };
      else if (area === 'bottom') pos[id] = { x: along(slot, w, used.bottom), y: h };
      else if (area === 'left') pos[id] = { x: 0, y: along(slot, h, used.left) };
      else pos[id] = { x: w, y: along(slot, h, used.right) };
    });
    return pos;
  }

  /* ------------------------------------------------------------ state, and its address */
  var LAYOUTS = ['force', 'map', 'radial', 'layered', 'tree', 'grid', 'list'];
  var BYS = ['pagerank', 'betweenness', 'degree'];
  function defaultState() {
    return { view: 'whole', focus: null, depth: 1, anchors: [], expand: [], path: null,
      top: { n: 60, by: 'pagerank', what: 'nodes' }, worlds: null, types: null, verbs: null, facets: {},
      layout: 'force', sel: null };
  }
  /** The preset views: bundles of state, one click instead of six toggles (the idea of the reader's PRESET_VIEWS). */
  var PRESETS = [
    { key: 'overview', label: 'Overview: the 60 most central nodes', state: { view: 'whole', top: { n: 60, by: 'pagerank', what: 'nodes' }, layout: 'force' } },
    { key: 'bridges', label: 'The bridges: top 80 edges by betweenness', state: { view: 'whole', top: { n: 80, by: 'betweenness', what: 'edges' }, layout: 'force' } },
    { key: 'industry', label: 'The industry: fields, companies, countries', state: { view: 'industry', top: { n: 0 }, layout: 'force' } },
    { key: 'industry-layered', label: 'Companies by field, layered', state: { view: 'industry', types: ['company', 'topic'], top: { n: 0 }, layout: 'layered' } },
    { key: 'programme', label: 'Web Summit\'s programme, by world', state: { view: 'summit', facets: { organiser: ['web-summit'] }, top: { n: 150, by: 'pagerank', what: 'nodes' }, layout: 'layered' } },
    { key: 'around-summit', label: 'Around the summit: other organisers', state: { view: 'summit', facets: { organiser: ['other'] }, top: { n: 0 }, layout: 'force' } },
    { key: 'people', label: 'Who speaks where: top 120', state: { view: 'people', top: { n: 120, by: 'pagerank', what: 'nodes' }, layout: 'force' } },
    { key: 'evidence', label: 'The evidence: facts and their sources', state: { view: 'whole', worlds: ['evidence', 'industry'], types: ['company', 'fact', 'source'], top: { n: 120, by: 'degree', what: 'nodes' }, layout: 'force' } },
  ];
  var list = function (s) { return s ? String(s).split(',').map(function (x) { return x.trim(); }).filter(Boolean) : null; };
  function parseState(search) {
    var q = new URLSearchParams(search || ''), st = defaultState(), has = false;
    var get = function (k) { var v = q.get(k); if (v != null) has = true; return v; };
    var v;
    if ((v = get('view'))) st.view = v;
    if ((v = get('focus'))) { st.focus = v; st.top = { n: 0, by: 'pagerank', what: 'nodes' }; }
    if ((v = get('depth'))) st.depth = v === 'max' ? 'max' : Math.max(0, parseInt(v, 10) || 1);
    if ((v = get('anchors'))) { st.anchors = list(v); st.top.n = 0; }
    if ((v = get('expand'))) st.expand = list(v);
    if ((v = get('path'))) { var p = v.split('~'); if (p.length === 2) { st.path = p; st.top.n = 0; } }
    if (st.view !== 'whole' && !q.get('top')) st.top.n = 0;
    if ((v = get('top')) != null) st.top.n = Math.max(0, parseInt(v, 10) || 0);
    if ((v = get('by')) && BYS.indexOf(v) !== -1) st.top.by = v;
    if ((v = get('what'))) st.top.what = v === 'edges' ? 'edges' : 'nodes';
    if ((v = get('worlds'))) st.worlds = list(v);
    if ((v = get('types'))) st.types = list(v);
    if ((v = get('verbs'))) st.verbs = list(v);
    if ((v = get('facets'))) v.split(';').forEach(function (kv) { var m = kv.split(':'); if (m.length >= 2) st.facets[m[0]] = m.slice(1).join(':').split('|'); });
    if ((v = get('layout')) && LAYOUTS.indexOf(v) !== -1) st.layout = v;
    if ((v = get('sel'))) st.sel = v;
    st.fromUrl = has;
    return st;
  }
  function stateToQuery(st) {
    var d = defaultState(), q = [];
    var put = function (k, v) { q.push(k + '=' + encodeURIComponent(v).replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%7E/g, '~').replace(/%3B/g, ';').replace(/%2F/g, '/').replace(/%7C/g, '|')); };
    if (st.view !== d.view) put('view', st.view);
    if (st.focus) put('focus', st.focus);
    if (st.focus && st.depth !== 1) put('depth', st.depth);
    if (st.anchors.length) put('anchors', st.anchors.join(','));
    if (st.expand.length) put('expand', st.expand.join(','));
    if (st.path) put('path', st.path.join('~'));
    var implied = (st.focus || st.anchors.length || st.path || st.view !== 'whole') ? 0 : d.top.n;
    if (st.top.n !== implied) put('top', st.top.n);
    if (st.top.n && st.top.by !== d.top.by) put('by', st.top.by);
    if (st.top.n && st.top.what !== 'nodes') put('what', st.top.what);
    if (st.worlds) put('worlds', st.worlds.join(','));
    if (st.types) put('types', st.types.join(','));
    if (st.verbs) put('verbs', st.verbs.join(','));
    var f = Object.keys(st.facets).filter(function (k) { return st.facets[k] && st.facets[k].length; });
    if (f.length) put('facets', f.map(function (k) { return k + ':' + st.facets[k].join('|'); }).join(';'));
    if (st.layout !== d.layout) put('layout', st.layout);
    if (st.sel) put('sel', st.sel);
    return q.length ? '?' + q.join('&') : '';
  }

  /* ------------------------------------------------------------ filters */
  var FACET_TYPE = { date: 'event', organiser: 'event', kind: 'event', track: 'event', pick: 'event', category: 'company', country: 'company' };
  function filters(G, st, viewSet) {
    var worlds = st.worlds && new Set(st.worlds), types = st.types && new Set(st.types);
    var verbs = st.verbs && new Set(st.verbs.map(function (v) { return G.verbIdx.has(v) ? G.verbIdx.get(v) : G.inverseIdx.get(v); }));
    var facets = Object.keys(st.facets || {}).filter(function (k) { return st.facets[k] && st.facets[k].length && FACET_TYPE[k]; });
    var okBase = function (i) {
      var n = G.nodes[i];
      if (worlds && !worlds.has(G.world[n.type])) return false;
      if (types && !types.has(n.type)) return false;
      for (var f = 0; f < facets.length; f++) {
        var k = facets[f]; if (FACET_TYPE[k] !== n.type) continue;
        var want = st.facets[k], val = k === 'track' ? G.track.get(i) : k === 'pick' ? (n.pick ? 'true' : 'false') : n[k];
        if (k === 'country') { if (!want.some(function (w) { return String(val || '').indexOf(w) === 0; })) return false; }
        else if (want.indexOf(String(val)) === -1) return false;
      }
      return true;
    };
    var okNode = viewSet ? function (i) { return viewSet.has(i) && okBase(i); } : okBase;
    var okEdge = function (j) { return !verbs || verbs.has(G.edges[j][2]); };
    return { okBase: okBase, okNode: okNode, okEdge: okEdge, active: !!(worlds || types || verbs || facets.length) };
  }

  /* ------------------------------------------------------------ resolving names to ids, and search */
  var TYPE_BOOST = { company: 6, person: 4, event: 4, topic: 5, organisation: 3, place: 3, track: 2, day: 2, article: 2, story: 1 };
  var fold = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  function search(G, text, opts) {
    opts = opts || {};
    var q = fold(text).trim(), limit = opts.limit || 10, type = opts.type, out = [];
    if (!q) return out;
    G.nodes.forEach(function (n, i) {
      if (type && n.type !== type) return;
      var l = fold(n.label), slug = n.id.slice(n.id.indexOf(':') + 1), s = 0;
      if (n.id === text || slug === q || l === q) s = 100;
      else if (l.indexOf(q) === 0 || slug.indexOf(q) === 0) s = 60;
      else if ((' ' + l).indexOf(' ' + q) !== -1) s = 40;
      else if (l.indexOf(q) !== -1) s = 20;
      else return;
      s += (TYPE_BOOST[n.type] || 0) + Math.min(5, (n.pr || 0) * 2);
      if (!type && (n.type === 'fact' || n.type === 'source')) s -= 30;   /* claims and pages last, unless asked for */
      out.push({ i: i, s: s });
    });
    out.sort(function (a, b) { return b.s - a.s; });
    return out.slice(0, limit).map(function (x) { var n = G.nodes[x.i]; return { id: n.id, label: n.label, type: n.type }; });
  }
  /** An id, a "type:slug", a bare slug or a name, to a node index (or -1). */
  function resolve(G, x) {
    if (x == null) return -1;
    if (typeof x === 'number') return G.nodes[x] ? x : -1;
    x = String(x).trim();
    if (G.byId.has(x)) return G.byId.get(x);
    var types = ['company', 'person', 'event', 'topic', 'organisation', 'place', 'track', 'day', 'article', 'story'];
    for (var t = 0; t < types.length; t++) if (G.byId.has(types[t] + ':' + x)) return G.byId.get(types[t] + ':' + x);
    var m = x.match(/^(companies|events|people|organisations|topics|places)\/([^/]+)$/);
    if (m) { var ty = { companies: 'company', events: 'event', people: 'person', organisations: 'organisation', topics: 'topic', places: 'place' }[m[1]]; if (G.byId.has(ty + ':' + m[2])) return G.byId.get(ty + ':' + m[2]); }
    var hit = search(G, x, { limit: 1 })[0];
    return hit ? G.byId.get(hit.id) : -1;
  }

  /* ------------------------------------------------------------ ranking */
  var METRIC = { pagerank: 'pr', betweenness: 'bc', degree: 'deg' };
  function ranked(G, nodeSet, by, n) {
    var k = METRIC[by] || 'pr';
    return Array.from(nodeSet).sort(function (a, b) { return (G.nodes[b][k] || 0) - (G.nodes[a][k] || 0) || a - b; }).slice(0, n || undefined);
  }

  /* ------------------------------------------------------------ shortest paths, read as sentences */
  function bfs(G, from, to, okNode, okEdge, banned, maxLen) {
    var prev = new Map([[from, -1]]), frontier = [from];
    for (var d = 0; d < maxLen && frontier.length; d++) {
      var next = [];
      for (var k = 0; k < frontier.length; k++) {
        var v = frontier[k], a = G.adj[v];
        for (var q = 0; q < a.length; q++) {
          var j = a[q]; if (!okEdge(j)) continue;
          var w = other(G, j, v);
          if (prev.has(w) || banned.has(w) || (w !== to && !okNode(w))) continue;
          prev.set(w, j);
          if (w === to) { var path = [to], edges = [], c = to; while (c !== from) { var ej = prev.get(c); edges.unshift(ej); c = other(G, ej, c); path.unshift(c); } return { nodes: path, edges: edges }; }
          next.push(w);
        }
      }
      frontier = next;
    }
    return null;
  }
  function hop(G, a, j) {
    var e = G.edges[j], v = G.verbs[e[2]], fwd = e[0] === a, A = G.nodes[e[0]].label, B = G.nodes[e[1]].label;
    return { verb: fwd ? v.verb : v.inverse, stored: v.verb, forward: fwd,
      text: (fwd ? v.reads : v.reads_inverse).replace('{from}', A).replace('{to}', B),
      source: e[3] >= 0 ? G.sources[e[3]] : null, read: e[4] || null };
  }
  /** Up to k shortest paths from one node to another, each a different route: after the first, each intermediate
      node of the paths found is banned in turn and the shortest remaining route is kept (a small Yen's). */
  function shortestPaths(G, from, to, opts) {
    opts = opts || {};
    var k = opts.k || 3, maxLen = opts.max || 6;
    var avoid = new Set(opts.avoid || ['day']);
    var okNode = function (i) { return !avoid.has(G.nodes[i].type) && (!opts.okNode || opts.okNode(i)); };
    var okEdge = opts.okEdge || function () { return true; };
    var found = [], seen = new Set(), tries = [new Set()];
    while (found.length < k && tries.length) {
      var best = null;
      for (var t = 0; t < tries.length; t++) {
        var r = bfs(G, from, to, okNode, okEdge, tries[t], maxLen);
        if (r && !seen.has(r.nodes.join(',')) && (!best || r.nodes.length < best.r.nodes.length)) best = { r: r, ban: tries[t] };
      }
      if (!best) break;
      seen.add(best.r.nodes.join(',')); found.push(best.r);
      var nextTries = [];
      found.forEach(function (p) { p.nodes.slice(1, -1).forEach(function (n) { var b = new Set(best.ban); b.add(n); nextTries.push(b); }); });
      tries = nextTries.slice(0, 40);
    }
    return found.map(function (p) {
      var hops = p.edges.map(function (j, i) { return hop(G, p.nodes[i], j); });
      return { nodes: p.nodes, edges: p.edges, length: p.edges.length, hops: hops,
        sentence: hops.map(function (h) { return h.text; }).join('; ') + '.' };
    });
  }

  /* ------------------------------------------------------------ what is drawn */
  /** The visible subgraph for a state: the view's universe, filtered at four levels (worlds, types, verbs, facets),
      walked from the anchors and the focus (the explore walk), plus expanded nodes and paths, cut to the top N nodes
      or edges by a ranking. viewSet: the view's node indexes, or null for the whole. */
  function compute(G, st, viewSet) {
    var F = filters(G, st, viewSet), FW = filters(G, st, null), notes = [];
    var roots = [];
    st.anchors.concat(st.focus ? [st.focus] : []).forEach(function (id) { var i = resolve(G, id); if (i >= 0 && roots.indexOf(i) === -1) roots.push(i); });
    var keep;
    if (roots.length) {
      var deg = st.depth === 'max' ? Infinity : st.depth;
      keep = neighbourhood(G, roots, deg, function (i) { return F.okNode(i) || roots.indexOf(i) !== -1; }, F.okEdge);
    } else if (st.path || st.expand.length) {
      keep = new Set();   /* a path, or expansions, with no anchor: just what they bring */
    } else {
      keep = new Set();
      for (var i = 0; i < G.nodes.length; i++) if (F.okNode(i)) keep.add(i);
    }
    var pinned = new Set(roots);
    st.expand.forEach(function (id) {
      var c = resolve(G, id); if (c < 0) return;
      keep.add(c); pinned.add(c);
      G.adj[c].forEach(function (j) { if (!FW.okEdge(j)) return; var w = other(G, j, c); if (FW.okBase(w)) keep.add(w); });
    });
    var paths = [];
    if (st.path) {
      var a = resolve(G, st.path[0]), b = resolve(G, st.path[1]);
      if (a >= 0 && b >= 0) {
        paths = shortestPaths(G, a, b, { okNode: FW.okBase, okEdge: FW.okEdge, avoid: st.avoid });
        paths.forEach(function (p) { p.nodes.forEach(function (n) { keep.add(n); pinned.add(n); }); });
        if (!paths.length) notes.push('No path within six hops under the current filters.');
      } else notes.push('Path: could not find ' + (a < 0 ? st.path[0] : st.path[1]) + '.');
    }
    var sel = st.sel ? resolve(G, st.sel) : -1;
    if (sel >= 0) { pinned.add(sel); keep.add(sel); }
    var pathEdges = new Set(); paths.forEach(function (p) { p.edges.forEach(function (j) { pathEdges.add(j); }); });
    var edgeOk = function (j) { var e = G.edges[j]; return F.okEdge(j) || pathEdges.has(j) ? keep.has(e[0]) && keep.has(e[1]) : false; };
    var edgesIn = function () { var s = new Set(); keep.forEach(function (v) { G.adj[v].forEach(function (j) { if (edgeOk(j)) s.add(j); }); }); return s; };
    var edges, topEdges = null, topNodes = null;
    var n = st.top && st.top.n;
    if (n && st.top.what === 'edges') {
      var all = Array.from(edgesIn()).sort(function (x, y) { return G.edges[y][5] - G.edges[x][5] || x - y; });
      topEdges = new Set(all.slice(0, n));
      pathEdges.forEach(function (j) { topEdges.add(j); });
      var k2 = new Set(pinned);
      topEdges.forEach(function (j) { k2.add(G.edges[j][0]); k2.add(G.edges[j][1]); });
      keep = k2; edges = topEdges;
    } else {
      if (n && keep.size > n) {
        topNodes = new Set(ranked(G, keep, st.top.by, n));
        pinned.forEach(function (p) { topNodes.add(p); });
        keep = topNodes;
      }
      edges = edgesIn();
    }
    if (F.active || n) {   /* filtered or cut to the top: a node left with no edge on screen is noise */
      var touched = new Set(); edges.forEach(function (j) { touched.add(G.edges[j][0]); touched.add(G.edges[j][1]); });
      keep.forEach(function (v) { if (!touched.has(v) && !pinned.has(v)) keep.delete(v); });
    }
    return { nodes: keep, edges: edges, roots: roots, pinned: pinned, paths: paths, sel: sel, topEdges: topEdges, notes: notes, filtered: F.active };
  }

  /* ------------------------------------------------------------ a node's record */
  function record(G, i, opts) {
    opts = opts || {};
    var n = G.nodes[i], conns = [], byVerb = {};
    G.adj[i].forEach(function (j) {
      var h = hop(G, i, j), o = G.nodes[other(G, j, i)];
      byVerb[h.verb] = (byVerb[h.verb] || 0) + 1;
      conns.push({ verb: h.verb, id: o.id, label: o.label, type: o.type, text: h.text, source: h.source, read: h.read });
    });
    var rec = { id: n.id, type: n.type, label: n.label, world: G.world[n.type], page: n.page || null,
      source: n.src >= 0 ? G.sources[n.src] : null, rank: { degree: n.deg, betweenness: n.bc, pagerank: n.pr },
      connections: { count: conns.length, by_verb: byVerb, list: opts.limit ? conns.slice(0, opts.limit) : conns } };
    ['what', 'kind', 'organiser', 'date', 'time', 'country', 'category', 'role', 'organisation', 'status', 'beat', 'by', 'read'].forEach(function (k) { if (n[k] != null) rec[k] = n[k]; });
    if (n.pick) rec.our_pick = true;
    return rec;
  }

  /* ------------------------------------------------------------ queries, for the chat */
  function query(G, a) {
    a = a || {};
    var limit = Math.min(a.limit || 25, 200);
    var pick = function (x) {
      if (!x) return null;
      if (G.world[x]) return { type: x };
      var i = resolve(G, x); return i >= 0 ? { i: i } : { none: true };
    };
    var match = function (c, i) { return !c || (c.i != null ? c.i === i : c.type ? G.nodes[i].type === c.type : false); };
    if (a.verb || a.from || a.to) {
      var f = pick(a.from), t = pick(a.to), dv = a.verb ? displayedVerbIndex(G.verbs)[a.verb] : null;
      if (a.verb && !dv) throw new Error('unknown verb: ' + a.verb + ' (the ontology has ' + G.verbs.map(function (v) { return v.verb; }).join(', ') + ', and their inverses)');
      if ((f && f.none) || (t && t.none)) throw new Error('could not find ' + (f && f.none ? a.from : a.to));
      var vi = dv ? G.verbIdx.get(dv.stored) : null, out = [];
      G.edges.forEach(function (e) {
        if (vi != null && e[2] !== vi) return;
        var s = e[0], o = e[1];
        if (dv && dv.dir === 'in') { s = e[1]; o = e[0]; }
        if (!match(f, s) || !match(t, o)) {
          if (dv || !(match(f, o) && match(t, s))) return;
          var x = s; s = o; o = x;
        }
        var fwd = s === e[0], v = G.verbs[e[2]];
        out.push({ from: G.nodes[s].id, from_label: G.nodes[s].label, verb: fwd ? v.verb : v.inverse, to: G.nodes[o].id, to_label: G.nodes[o].label, source: e[3] >= 0 ? G.sources[e[3]] : null });
      });
      return { kind: 'edges', total: out.length, edges: out.slice(0, limit) };
    }
    var res = [];
    G.nodes.forEach(function (n) {
      if (a.type && n.type !== a.type) return;
      if (a.text && fold(n.label).indexOf(fold(a.text)) === -1) return;
      res.push(n);
    });
    res.sort(function (x, y) { return (y.pr || 0) - (x.pr || 0); });
    return { kind: 'nodes', total: res.length, nodes: res.slice(0, limit).map(function (n) { return { id: n.id, label: n.label, type: n.type }; }) };
  }

  window.NRGraphEngine = { index: index, compute: compute, defaultState: defaultState, parseState: parseState,
    stateToQuery: stateToQuery, search: search, resolve: resolve, record: record, shortestPaths: shortestPaths,
    query: query, ranked: ranked, neighbourhood: neighbourhood, nextDegree: nextDegree, graphStats: graphStats,
    statsText: statsText, displayedVerbIndex: displayedVerbIndex, runPathQuery: runPathQuery,
    defaultAssignments: defaultAssignments, slotPositions: slotPositions, SLOT_COUNT: SLOT_COUNT, PRESETS: PRESETS,
    LAYOUTS: LAYOUTS, filters: filters };
})();
