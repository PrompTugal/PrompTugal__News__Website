#!/usr/bin/env python3
"""The editors' business cards, PrompTugal.news (brand identity v2.0).

designer@PrompTugal.dinis, 6 November 2026 (WS-177). A design tool, not part of the site's build: it needs
Python 3 with fonttools, brotli, uharfbuzz and segno (pip install fonttools brotli uharfbuzz segno), and writes
SVG masters with every letter outlined, to the print shop's rules (the team site's /cards/print/):
85 x 55 mm trimmed, 3 mm bleed on every side (91 x 61 mm), all text at least 3 mm inside the trim, nothing under 7 pt.
Then `node design/cards/render.mjs` makes the PDFs (both sides, with bleed) and the 300 dpi PNGs (trimmed).

    python3 design/cards/make_cards.py
"""
import io, json, os
from fontTools.ttLib import TTFont
import uharfbuzz as hb
import segno

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
FONTS = os.path.join(ROOT, 'assets', 'fonts')
BRAND = os.path.join(ROOT, 'assets', 'brand')
OUT = os.path.join(HERE, 'editors')

# brand v2.0 colours (design/brand/README.txt)
PAPER, INK, RED, GREEN, MUTED, RULE = '#F6F3EC', '#121317', '#C52830', '#006600', '#666860', '#D8D4CB'
D_RED, D_GREEN, D_MUTED = '#F07278', '#6DBB7E', '#B4B6AD'

PT = 25.4 / 72      # mm per point
BLEED, W, H = 3.0, 85.0, 55.0
SITE = 'https://promptugal.news/'

EDITORS = json.load(open(os.path.join(HERE, 'editors.json')))


def ttf(name):
    t = TTFont(os.path.join(FONTS, name)); t.flavor = None
    b = io.BytesIO(); t.save(b); return b.getvalue()


class Face:
    def __init__(self, file, **variations):
        self.blob = hb.Blob(ttf(file)); self.face = hb.Face(self.blob)
        self.font = hb.Font(self.face); self.upem = self.face.upem
        if variations: self.font.set_variations(variations)

    def shape(self, text, tracking=0.0):
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
        hb.shape(self.font, buf, {'kern': True, 'liga': True})
        return buf.glyph_infos, buf.glyph_positions, tracking

    def width(self, text, size_pt, tracking=0.0):
        infos, pos, _ = self.shape(text)
        s = size_pt * PT / self.upem
        return sum(p.x_advance for p in pos) * s + tracking * size_pt * PT * max(len(infos) - 1, 0)

    def path(self, text, size_pt, x, y, fill, anchor='start', tracking=0.0):
        """Outlined text as one SVG <path>, baseline at y (mm). tracking in em."""
        infos, pos, _ = self.shape(text)
        s = size_pt * PT / self.upem
        w = self.width(text, size_pt, tracking)
        if anchor == 'end': x -= w
        elif anchor == 'middle': x -= w / 2
        d, cx = [], x
        for info, p in zip(infos, pos):
            pen = _Pen(cx + p.x_offset * s, y - p.y_offset * s, s)
            self.font.draw_glyph_with_pen(info.codepoint, pen)
            d.append(pen.d())
            cx += p.x_advance * s + tracking * size_pt * PT
        return f'<path fill="{fill}" d="{"".join(d)}"/>'


class _Pen:
    def __init__(self, ox, oy, s): self.ox, self.oy, self.s, self.o = ox, oy, s, []
    def _p(self, x, y): return f'{self.ox + x * self.s:.3f} {self.oy - y * self.s:.3f}'
    def moveTo(self, p): self.o.append('M' + self._p(*p))
    def lineTo(self, p): self.o.append('L' + self._p(*p))
    def qCurveTo(self, *pts):
        # a TrueType run of off-curve points: split at implied on-curve midpoints
        *offs, end = pts
        for i, c in enumerate(offs):
            nxt = end if i == len(offs) - 1 else ((c[0] + offs[i + 1][0]) / 2, (c[1] + offs[i + 1][1]) / 2)
            self.o.append('Q' + self._p(*c) + ' ' + self._p(*nxt))
    def curveTo(self, a, b, c): self.o.append('C' + self._p(*a) + ' ' + self._p(*b) + ' ' + self._p(*c))
    def closePath(self): self.o.append('Z')
    def endPath(self): pass
    def d(self): return ''.join(self.o)


SERIF_600 = Face('newsreader-variable.woff2', wght=600, opsz=36)
SERIF_ITALIC = Face('newsreader-400-italic.woff2', opsz=18)
SANS = Face('plex-sans-variable.woff2', wght=400)
SANS_600 = Face('plex-sans-variable.woff2', wght=600)
MONO = Face('plex-mono-400.woff2')


def embed(svg_file, x, y, w):
    """Place a brand master (outlined SVG) at (x, y) mm, w mm wide, unchanged."""
    src = open(os.path.join(BRAND, svg_file)).read()
    vb = [float(v) for v in src.split('viewBox="')[1].split('"')[0].split()]
    inner = src[src.index('>', src.index('<svg')) + 1: src.rindex('</svg>')]
    inner = inner.split('</title>', 1)[-1]
    k = w / vb[2]
    return (f'<g transform="translate({x:.3f} {y:.3f}) scale({k:.6f}) translate({-vb[0]} {-vb[1]})">{inner}</g>',
            vb[3] * k)


def qr(x, y, size, url):
    """Black modules on a white panel, a four-module quiet zone inside the panel."""
    q = segno.make(url, error='q', micro=False)
    m = q.matrix; n = len(m); mod = size / (n + 8)
    rects = ''.join(f'M{x + (c + 4) * mod:.3f} {y + (r + 4) * mod:.3f}h{mod:.3f}v{mod:.3f}h-{mod:.3f}z'
                    for r, row in enumerate(m) for c, v in enumerate(row) if v)
    return (f'<rect x="{x:.3f}" y="{y:.3f}" width="{size:.3f}" height="{size:.3f}" fill="#FFFFFF"/>'
            f'<path fill="#000000" d="{rects}"/>'), q.version, mod


def svg(body, title, bg):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W + 2 * BLEED}mm" height="{H + 2 * BLEED}mm" '
            f'viewBox="{-BLEED} {-BLEED} {W + 2 * BLEED} {H + 2 * BLEED}"><title>{title}</title>'
            f'<rect x="{-BLEED}" y="{-BLEED}" width="{W + 2 * BLEED}" height="{H + 2 * BLEED}" fill="{bg}"/>'
            f'{body}</svg>\n')


M = 6.0  # the margin: twice the shop's 3 mm safe area


def front(ed):
    out = []
    mark, mh = embed('promptugal-wordmark-light.svg', M - 0.8, M - 0.6, 52.0)  # the master carries its own clear space
    out.append(mark)
    out.append(SERIF_600.path(ed['name'], 15, M, 33.0, INK))
    out.append(SANS.path(ed['role'], 8.5, M, 38.6, INK))
    if ed.get('email'):
        out.append(MONO.path(ed['email'], 7.5, M, 43.4, INK))
    else:
        out.append(MONO.path('email to come', 7.5, M, 43.4, MUTED))
    out.append(f'<rect x="{M}" y="46.6" width="{W - 2 * M}" height="0.25" fill="{INK}"/>')
    out.append(MONO.path('WEB SUMMIT LISBON 2026 EDITION', 7, M, 50.6, INK))
    out.append(MONO.path('promptugal.news', 7, W - M, 50.6, INK, anchor='end'))
    return svg(''.join(out), f"{ed['name']}, Editor, PrompTugal.news: front", PAPER)


def back(ed):
    out = []
    stamp, sh = embed('pt-news-stamp-dark.svg', M, M, 24.0)
    out.append(stamp)
    code, ver, mod = qr(W - M - 27.0, M, 27.0, SITE)
    out.append(code)
    out.append(MONO.path('promptugal.news', 7, W - M - 13.5, M + 27.0 + 4.2, PAPER, anchor='middle'))
    out.append(SERIF_ITALIC.path('Technology and AI, in context.', 9.5, M, 37.0, PAPER))
    out.append(MONO.path('A PORTUGUESE PERSPECTIVE.', 7, M, 41.6, D_MUTED, tracking=0.04))
    out.append(MONO.path('A EUROPEAN CONVERSATION.', 7, M, 44.9, D_MUTED, tracking=0.04))
    out.append(f'<rect x="{M}" y="46.6" width="{W - 2 * M}" height="0.25" fill="{D_GREEN}"/>')
    out.append(MONO.path('INDEPENDENT. NOT AFFILIATED WITH WEB SUMMIT.', 7, M, 50.6, PAPER, tracking=0.02))
    return svg(''.join(out), f"{ed['name']}, Editor, PrompTugal.news: back", INK), ver, mod


def main():
    report = []
    for ed in EDITORS:
        d = os.path.join(OUT, ed['id']); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'card-front.svg'), 'w').write(front(ed))
        b, ver, mod = back(ed)
        open(os.path.join(d, 'card-back.svg'), 'w').write(b)
        report.append(f"{ed['id']}: QR version {ver}, module {mod:.2f} mm")
    w = MONO.width('INDEPENDENT. NOT AFFILIATED WITH WEB SUMMIT.', 7, 0.02)
    report.append(f'widest line: {w:.1f} mm of {W - 2 * M:.1f} mm')
    g = W - 2 * M - MONO.width('WEB SUMMIT LISBON 2026 EDITION', 7) - MONO.width('promptugal.news', 7)
    report.append(f'front foot gap: {g:.1f} mm')
    report.append(f"name widths: " + ', '.join(f"{e['name']} {SERIF_600.width(e['name'], 15):.1f} mm" for e in EDITORS))
    report.append(f"tagline: {SERIF_ITALIC.width('Technology and AI, in context.', 9.5):.1f} mm (room {W - 2*M - 27 - 3:.1f})")
    print('\n'.join(report))


if __name__ == '__main__':
    main()
