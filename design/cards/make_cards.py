#!/usr/bin/env python3
"""PrompTugal.news business cards (brand identity v2.0): generic, no names, printed on white stock.

designer@PrompTugal.dinis, 6 November 2026 (WS-177), proof 2. At Dinis's word: no solid colours (no floods, so
the card prints cheaply: ink, red and green type and hairlines on white stock), generic (PrompTugal.news, not a
person), with a tagline and a link to RiskMandate. Two variants: A with no Web Summit line, B with one. A design tool, not part of the site's build: it needs
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
OUT = os.path.join(HERE, 'generic')

# brand v2.0 colours (design/brand/README.txt)
PAPER, INK, RED, GREEN, MUTED, RULE = '#F6F3EC', '#121317', '#C52830', '#006600', '#666860', '#D8D4CB'
D_RED, D_GREEN, D_MUTED = '#F07278', '#6DBB7E', '#B4B6AD'

PT = 25.4 / 72      # mm per point
BLEED, W, H = 3.0, 85.0, 55.0
SITE = 'https://promptugal.news/'



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


def embed(svg_file, x, y, w, unfill=None):
    """Place a brand master (outlined SVG) at (x, y) mm, w mm wide, unchanged but for `unfill`: a ground colour
    left unprinted (the stamp's paper square, so white stock shows through and nothing floods)."""
    src = open(os.path.join(BRAND, svg_file)).read()
    if unfill: src = src.replace(f'fill="{unfill}"', 'fill="none"')
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
    return f'<path fill="{INK}" d="{rects}"/>', q.version, mod  # the quiet zone is the unprinted white stock


def svg(body, title, bg):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W + 2 * BLEED}mm" height="{H + 2 * BLEED}mm" '
            f'viewBox="{-BLEED} {-BLEED} {W + 2 * BLEED} {H + 2 * BLEED}"><title>{title}</title>'
            f'<rect x="{-BLEED}" y="{-BLEED}" width="{W + 2 * BLEED}" height="{H + 2 * BLEED}" fill="{bg}"/>'
            f'{body}</svg>\n')


M = 6.0  # the margin: twice the shop's 3 mm safe area
WHITE = '#FFFFFF'  # the stock: nothing printed

VARIANTS = [
    {'id': 'a-generic', 'label': 'A, generic', 'edition': False},
    {'id': 'b-web-summit', 'label': 'B, with the Web Summit line', 'edition': True},
]


def centre(face, text, size, y, fill, tracking=0.0):
    return face.path(text, size, W / 2, y, fill, anchor='middle', tracking=tracking)


def front(v):
    out = []
    mark, mh = embed('promptugal-wordmark-light.svg', (W - 66.0) / 2, 11.5, 66.0)
    out.append(mark)
    out.append(f'<rect x="{W / 2 - 9:.3f}" y="27.2" width="18" height="0.5" fill="{GREEN}"/>')
    out.append(centre(SERIF_ITALIC, 'Technology and AI, in context.', 12, 36.0, INK))
    if v['edition']:
        out.append(centre(MONO, 'THE WEB SUMMIT LISBON 2026 EDITION', 7, 47.5, INK, tracking=0.04))
    return svg(''.join(out), f"PrompTugal.news card {v['label']}: front", WHITE)


def back(v):
    out = []
    stamp, sh = embed('pt-news-stamp-light.svg', M, M, 22.0, unfill='#F6F3EC')
    out.append(stamp)
    qs = 24.0
    code, ver, mod = qr(W - M - qs + 2.2, M - 2.2, qs, SITE)  # its quiet zone overhangs the margin, never the trim
    out.append(code)
    out.append(MONO.path('promptugal.news', 7, W - M, M + qs - 2.2 + 3.2, INK, anchor='end'))
    out.append(MONO.path('A PORTUGUESE PERSPECTIVE.', 7, M, 35.2, INK, tracking=0.04))
    out.append(MONO.path('A EUROPEAN CONVERSATION.', 7, M, 38.5, INK, tracking=0.04))
    up = 1.8 if v['edition'] else 0.0  # B makes room for the independence line
    out.append(f'<rect x="{M}" y="{43.6 - up}" width="{W - 2 * M}" height="0.25" fill="{INK}"/>')
    out.append(SANS_600.path('Powered by RiskMandate', 8, M, 48.6 - up, INK))
    out.append(MONO.path('riskmandate.ai', 7, W - M, 48.6 - up, INK, anchor='end'))
    if v['edition']:
        out.append(MONO.path('INDEPENDENT. NOT AFFILIATED WITH WEB SUMMIT.', 7, M, 51.0, INK, tracking=0.02))
    return svg(''.join(out), f"PrompTugal.news card {v['label']}: back", WHITE), ver, mod


def main():
    report = []
    for v in VARIANTS:
        d = os.path.join(OUT, v['id']); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'card-front.svg'), 'w').write(front(v))
        b, ver, mod = back(v)
        open(os.path.join(d, 'card-back.svg'), 'w').write(b)
        report.append(f"{v['id']}: QR version {ver}, module {mod:.2f} mm")
    report.append(f"tagline {SERIF_ITALIC.width('Technology and AI, in context.', 12):.1f} mm; "
                  f"independence line {MONO.width('INDEPENDENT. NOT AFFILIATED WITH WEB SUMMIT.', 7, 0.02):.1f} mm of {W - 2 * M:.0f}")
    print('\n'.join(report))


if __name__ == '__main__':
    main()
