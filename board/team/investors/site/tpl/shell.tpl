<!doctype html>
<html lang="{{lang}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{{title}} · PrompTugal</title>
<meta name="description" content="{{summary}}">
<meta name="variant" content="inv-{{variant}}">
<meta name="theme-color" content="#121317">
<meta name="inv-up" content="{{up}}">
{{#alt}}<link rel="alternate" hreflang="{{code}}" href="{{href}}">
{{/alt}}<link rel="icon" href="{{up}}assets/brand/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{{up}}assets/fonts.css">
<link rel="stylesheet" href="{{up}}api/v1/investors/site.css">
<script defer src="{{up}}assets/obs/obs.js"></script>{{#personaJs}}
<script defer src="{{up}}api/v1/investors/persona.js"></script>{{/personaJs}}
</head><body class="inv inv-{{variant}}">
<a class="skip" href="#main">{{sh.skip}}</a>
<header class="ih"><div class="ih-in">
<a class="ih-brand" href="/investors/">Promp<span class="t">T</span><span class="u">ugal</span><span class="ih-sub">{{sh.brand_sub}}</span></a>
<nav class="ih-nav" aria-label="{{sh.footer_who}}">{{#nav}}<a href="{{href}}"{{#current}} aria-current="page"{{/current}}>{{label}}</a>{{/nav}}<span class="ih-sep"></span>{{#nav2}}<a href="{{href}}"{{#current}} aria-current="page"{{/current}}>{{label}}</a>{{/nav2}}</nav>
<nav class="ih-lang" aria-label="{{sh.language}}">{{#langs}}<a href="{{href}}" hreflang="{{code}}" lang="{{code}}" title="{{name}}"{{#current}} aria-current="true"{{/current}}>{{label}}</a>{{/langs}}</nav>
</div></header>
{{> persona}}
<main id="main">
{{{body}}}
</main>
<footer class="if"><div class="if-in">
<div class="if-col"><a class="ih-brand" href="/investors/">Promp<span class="t">T</span><span class="u">ugal</span></a><p>{{sh.footer_company}}</p><p>{{sh.footer_open}}</p><p><a href="/">{{sh.footer_back}}</a></p></div>
<div class="if-col"><h2>{{sh.footer_who}}</h2>{{#nav}}<a href="{{href}}">{{label}}</a>{{/nav}}</div>
<div class="if-col"><h2>{{sh.footer_library}}</h2>{{#lib}}<a href="{{href}}">{{label}}</a>{{/lib}}</div>
<div class="if-col"><h2>{{sh.language}}</h2><div class="if-lang">{{#langs}}<a href="{{href}}" hreflang="{{code}}" lang="{{code}}"{{#current}} aria-current="true"{{/current}}>{{name}}</a>{{/langs}}</div></div>
</div></footer>
</body></html>
