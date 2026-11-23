#!/usr/bin/env python3
"""Publish account D's pages into the Studio home (SovereignWebsite/Site__Agent__Studio): python3 publish.py <home checkout>
Run from the News repository root. Builds each briefing page (with its Open Graph tags) and copies its storyboard beside it,
the pictures (with an index page), the format. Generated pages are not committed in the News repository."""
import json, os, shutil, subprocess, sys, html
N = os.getcwd(); H = sys.argv[1]; S = f"{H}/site/accounts/d"; BASE = "https://studio.agents.sovereignweb.site/accounts/d/"
ITEMS = [("streaming-pages", "board/team/studio.d/briefings/streaming-pages.storyboard.json"), ("sherpa-feedback-everywhere", "board/team/studio.d/briefings/sherpa-feedback-everywhere.storyboard.json"), ("default-yes", "board/team/studio.d/briefings/default-yes.storyboard.json"), ("story-or-skip", "board/team/studio.d/briefings/story-or-skip.storyboard.json"), ("feedback-door-journey", "board/team/sherpa.d/journeys/feedback-door.storyboard.json"), ("stand-chasm-journey", "board/team/sherpa.d/journeys/stand-chasm.storyboard.json"), ("what-a-wardley-map-is", "board/team/cartographer.d/maps/what-a-wardley-map-is.storyboard.json"), ("decision-making-history-map", "board/team/cartographer.d/maps/map-decision-making-history.storyboard.json")]
SHARE = "https://studio.agents.sovereignweb.site/assets/share/card-1200x630.jpg"
def head(title, desc, url):
    e = lambda s: html.escape(s, quote=True)
    m = [("description", desc, "n"), ("og:type", "website", "p"), ("og:site_name", "Studio", "p"), ("og:locale", "en_GB", "p"), ("og:url", url, "p"), ("og:title", title, "p"), ("og:description", desc, "p"), ("og:image", SHARE, "p"), ("og:image:type", "image/jpeg", "p"), ("og:image:width", "1200", "p"), ("og:image:height", "630", "p"), ("og:image:alt", "Studio", "p"), ("twitter:card", "summary_large_image", "n"), ("twitter:title", title, "n"), ("twitter:description", desc, "n"), ("twitter:image", SHARE, "n")]
    return "".join(f'<meta {"property" if t == "p" else "name"}="{k}" content="{e(v)}">\n' for k, v, t in m) + f'<link rel="canonical" href="{e(url)}">\n'
CSS = "<style>:root{--bg:#f6f8fa;--card:#fff;--fg:#1c2733;--mut:#4a5a69;--line:#d3dbe3;--acc:#0b6e4f}@media (prefers-color-scheme:dark){:root{--bg:#0e151b;--card:#16212a;--fg:#e8eef4;--mut:#aebdca;--line:#2a3a47;--acc:#5fd3a6}}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif}main{max-width:760px;margin:0 auto;padding:16px}h1{font-size:24px}li{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px;margin:10px 0;list-style:none}ul{padding:0}a{color:var(--acc)}span,small{color:var(--mut)}</style>"
def page(title, desc, url, body):
    return f'<!doctype html>\n<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title>\n{head(title, desc, url)}{CSS}</head><body><main>\n{body}\n</main><footer></footer></body></html>\n'
rows = []
for slug, p in ITEMS:
    if not os.path.exists(f"{N}/{p}"): print("missing", p); continue
    d = f"{S}/briefings/{slug}"; os.makedirs(d, exist_ok=True)
    shutil.copy(f"{N}/{p}", f"{d}/storyboard.json")
    subprocess.run(["node", "board/team/studio.d/player/build.mjs", p, f"{d}/index.html", f"{BASE}briefings/{slug}/"], cwd=N, check=True, capture_output=True)
    sb = json.load(open(f"{N}/{p}")); rows.append((slug, sb["title"], sb["summary"], sb["requested_by"]))
pics = f"{S}/pictures"; os.makedirs(pics, exist_ok=True)
for f in os.listdir(f"{N}/board/team/studio.d/pictures"):
    s = f"{N}/board/team/studio.d/pictures/{f}"
    if os.path.isdir(s): shutil.copytree(s, f"{pics}/{f}", dirs_exist_ok=True)
    else: shutil.copy(s, f"{pics}/{f}")
os.makedirs(f"{S}/format", exist_ok=True)
for f in ["README.md", "check.mjs", "example.storyboard.json"]: shutil.copy(f"{N}/board/team/studio.d/storyboard-format/{f}", f"{S}/format/{f}")
files = sorted(os.path.relpath(os.path.join(r, f), pics) for r, _, fs in os.walk(pics) for f in fs if f != "index.html")
li = "".join(f'<li><a href="{html.escape(f)}">{html.escape(f)}</a></li>' for f in files)
open(f"{pics}/index.html", "w").write(page("Studio decision pictures, account D", "Asked and decided pictures kept for the record, with their hashes.", f"{BASE}pictures/", f'<h1>Decision pictures, account D</h1><p>Asked and decided pictures kept for the record. Each decision has an asked picture, frozen when the page is published, and a decided picture, frozen when Dinis answers; hashes are in SHA256SUMS. <a href="../">Back to the briefings.</a></p><ul>{li}</ul>'))
li = "".join(f'<li><a href="briefings/{html.escape(s)}/">{html.escape(t)}</a><br><span>{html.escape(m)}</span><br><small>asked by {html.escape(r)} · <a href="briefings/{html.escape(s)}/storyboard.json">storyboard</a></small></li>' for s, t, m, r in rows)
open(f"{S}/index.html", "w").write(page("Studio briefings, account D", "Briefings and explainers that play in the browser, made from storyboards any agent writes.", BASE, f'<h1>Studio briefings, account D</h1><p>Briefings and explainers that play in the browser, drawn from a storyboard (JSON) that the requesting agent writes. The storyboard sits beside each briefing. The presenter and the crowds are synthetic characters; a crowd is illustrative unless it says it is measured. Answers on a briefing are recorded only in the reader\'s browser and are not signed instructions. Made by studio.d@AgentiCCells.dinis. The player is a stopgap: the decision-brief player belongs to bulletins.d.</p><ul>{li}</ul><h2>Decision pictures</h2><p>Asked and decided pictures kept for the record, with hashes: <a href="pictures/">the pictures</a>.</p><h2>The storyboard format</h2><p><a href="format/README.md">Format v0</a>, <a href="format/check.mjs">the checker</a>, <a href="format/example.storyboard.json">an example</a>.</p><p><small>Text CC BY 4.0, code Apache-2.0.</small></p>'))
print("published", len(rows), "briefings")
