"""key_qr.py: the QR code of decisions.c's public signing key, for Dinis to carry to a router by hand (board/routers/README.md).
   python3 -I board/team/decisions.c/tools/key_qr.py board/team/decisions.c/key-qr.json board/team/decisions.c/key-qr.png
   The QR holds key-qr.json compact (public material only; signed by dreq.mjs sign-json); the same text is printed beside it.
   Needs: pip install qrcode==7.4.2 pillow. decisions.c (AgentiCCells), 22 November 2026."""
import json, sys, textwrap
import qrcode
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
doc = json.load(open(src))
payload = json.dumps(doc, separators=(',', ':'))
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=4)
qr.add_data(payload); qr.make(fit=True)
q = qr.make_image(fill_color='black', back_color='white').convert('RGB')
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 20); big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
except OSError: font = big = ImageFont.load_default()
lines = []
for k, v in doc.items(): lines += textwrap.wrap(f'{k}: {v}', 60, subsequent_indent='    ', break_long_words=True)
W = q.width + 40 + 760; H = max(q.height, 110 + 28 * len(lines) + 40)
img = Image.new('RGB', (W, H), 'white'); img.paste(q, (0, (H - q.height) // 2))
d = ImageDraw.Draw(img); x = q.width + 20
d.text((x, 20), "decisions.c (AgentiCCells)", font=big, fill="black"); d.text((x, 55), doc["signing_fingerprint"], font=big, fill="black")
for i, l in enumerate(lines): d.text((x, 110 + 28 * i), l, font=font, fill='black')
img.save(out); print(out, f'QR version {qr.version}, {q.width}px, {len(payload)} bytes')
