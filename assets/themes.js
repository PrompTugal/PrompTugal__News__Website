/* PrompTugal.news: the theme, chosen and remembered (dev@web-summit.dinis, 6 November 2026, at Dinis's word).
   Ported from newsroom.sgit.ai's assets/themes/themes.js (its card 036), in this site's palette: the five themes are
   defined in assets/tokens.css, each with every colour token (the gate's check 14).

   A CLASSIC SCRIPT IN <head>, NOT A MODULE, NOT DEFERRED: it must set data-theme before the first paint, or the page
   would paint Paper and then flip to the reader's theme.

   THE STORED VALUE IS A KEY FROM THE LIST BELOW, NEVER ANYTHING ELSE. Local storage is writable by anything on this
   origin, so what comes back is checked against THEMES before it reaches the DOM; anything else is the default.
   It stays in this browser: the theme is a property of the screen in front of the reader, not of the reader.

   With nothing stored, the system's preference picks between the two defaults (Ink when the system is dark, Paper
   otherwise) and is followed if it changes while the page is open. The reader's first choice ends that.

   data-tone ("light" or "dark") goes beside data-theme, so the few rules that swap artwork (the wordmark, RiskMandate's
   mark) ask one question, not five. */
(function () {
  'use strict';
  var KEY = 'promptugal.theme', LIGHT = 'paper', DARK = 'ink';
  var THEMES = {
    paper:      { label: 'Paper',      note: 'The brand: paper and ink', tone: 'light', bar: '#f6f3ec' },
    ink:        { label: 'Ink',        note: 'Dark: paper on ink',       tone: 'dark',  bar: '#111214' },
    broadsheet: { label: 'Broadsheet', note: 'Brighter: white, black',   tone: 'light', bar: '#ffffff' },
    archive:    { label: 'Archive',    note: 'Sepia, for long reads',    tone: 'light', bar: '#efe6d2' },
    azulejo:    { label: 'Azulejo',    note: "Dark: Lisbon's tile blue", tone: 'dark',  bar: '#0f1c36' }
  };
  var has = function (k) { return Object.prototype.hasOwnProperty.call(THEMES, k); };
  function stored() { try { var v = localStorage.getItem(KEY); return has(v) ? v : null; } catch (e) { return null; } }
  function system() { try { return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT; } catch (e) { return LIGHT; } }
  function current() { return stored() || system(); }
  function apply(name) {
    var root = document.documentElement;
    root.setAttribute('data-theme', name);
    root.setAttribute('data-tone', THEMES[name].tone);
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) { metas[i].setAttribute('content', THEMES[name].bar); metas[i].removeAttribute('media'); }
    return name;
  }
  function set(name) {
    if (!has(name)) return current();
    try { localStorage.setItem(KEY, name); } catch (e) { /* unremembered, still applied */ }
    apply(name);
    try { window.dispatchEvent(new CustomEvent('promptugal:theme-changed', { detail: { theme: name, tone: THEMES[name].tone } })); } catch (e) {}
    return name;
  }
  window.__ptTheme = { themes: THEMES, key: KEY, get: current, stored: stored, set: set };
  apply(current());

  try {
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (!stored()) { apply(system()); render(); try { window.dispatchEvent(new CustomEvent('promptugal:theme-changed', { detail: { theme: current() } })); } catch (e) {} } });
  } catch (e) {}

  /* ---------- the picker: a button in the nav's tools (#nr-tools), a menu of five ---------- */
  var pick = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render() {
    if (!pick) {
      var tools = document.getElementById('nr-tools');
      if (!tools) return;
      pick = document.createElement('div'); pick.className = 'theme-pick';
      tools.insertBefore(pick, tools.firstChild);
    }
    var now = current(), items = '';
    for (var k in THEMES) if (has(k)) {
      items += '<li><button type="button" role="menuitemradio" data-pick="' + k + '" aria-checked="' + (k === now) + '">' +
               '<span class="sw sw-' + k + '" aria-hidden="true"></span><span>' + esc(THEMES[k].label) +
               '<span class="n">' + esc(THEMES[k].note) + '</span></span></button></li>';
    }
    pick.innerHTML = '<button type="button" class="tool" aria-haspopup="true" aria-expanded="false" title="The theme: five to choose from, kept in this browser">' +
      '<span class="sw sw-' + now + '" aria-hidden="true"></span><span class="name">' + esc(THEMES[now].label) + '</span>' +
      '<span class="caret" aria-hidden="true">&#9662;</span></button>' +
      '<ul role="menu" aria-label="Theme" hidden>' + items + '</ul>';
    var toggle = pick.firstChild, menu = pick.lastChild;
    var close = function () { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      toggle.setAttribute('aria-expanded', String(!menu.hidden));
      if (!menu.hidden) { var cur = menu.querySelector('[aria-checked="true"]'); if (cur) cur.focus(); }
    });
    var buttons = menu.querySelectorAll('[data-pick]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function (e) { set(e.currentTarget.getAttribute('data-pick')); close(); render(); pick.firstChild.focus(); });
    }
    menu.addEventListener('keydown', function (e) {
      var list = [].slice.call(menu.querySelectorAll('[data-pick]')), j = list.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); list[(j + 1) % list.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); list[(j - 1 + list.length) % list.length].focus(); }
      else if (e.key === 'Escape') { close(); toggle.focus(); }
    });
  }
  document.addEventListener('click', function (e) { if (pick && !pick.contains(e.target)) { var m = pick.querySelector('ul'), t = pick.firstChild; if (m && !m.hidden) { m.hidden = true; t.setAttribute('aria-expanded', 'false'); } } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
}());
