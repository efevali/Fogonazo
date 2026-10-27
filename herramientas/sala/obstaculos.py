# Cut the eight P-005 objects (specials and obstacles) out of the magenta sheet and export 256x256 PNGs.
# Pads fill the whole cell and carry no shadow (they lie flat under a piece); the rest get the pieces' soft shadow.
import sys
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage

src_path, out_dir = sys.argv[1], sys.argv[2]
src = np.asarray(Image.open(src_path).convert('RGB')).astype(float)
R, G, B = src[..., 0], src[..., 1], src[..., 2]
m = np.minimum(R, B) - G
alpha = np.clip((230 - m) / (230 - 80), 0, 1)
fg = ndimage.binary_opening(m < 120, iterations=2)
lab, n = ndimage.label(ndimage.binary_closing(fg, iterations=6))
sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n + 1))
H, W = lab.shape
Mg = np.median(src[m > 200], axis=0)   # the sheet's actual magenta

NAMES = ['bateria', 'pad1', 'pad2', 'padOk', 'quemado1', 'quemado2', 'valvula', 'zocalo']
def cut(k):
    reg = ndimage.binary_fill_holes(ndimage.binary_dilation(lab == k, iterations=10))
    ys, xs = np.where(reg)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    al = (alpha * reg)[y0:y1, x0:x1]
    c = src[y0:y1, x0:x1]
    with np.errstate(divide='ignore', invalid='ignore'):
        un = np.clip(np.where(al[..., None] > 0, (c - (1 - al[..., None]) * Mg) / np.maximum(al[..., None], 1e-3), 0), 0, 255)
    return Image.fromarray(np.dstack([un, al * 255]).astype(np.uint8), 'RGBA'), (x0 + x1) / 2, (y0 + y1) / 2

S = 256
for k in [i + 1 for i, s in enumerate(sizes) if s > 5000]:
    im, cx, cy = cut(k)
    name = NAMES[int(cy // (H / 2)) * 4 + int(cx // (W / 4))]
    im = im.crop(im.getbbox())
    flat = name.startswith('pad')
    box = 1.0 if flat else 0.86
    f = min(S * box / im.width, S * box / im.height)
    im = im.resize((max(1, round(im.width * f)), max(1, round(im.height * f))), Image.LANCZOS)
    canvas = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    px, py = (S - im.width) // 2, (S - im.height) // 2
    if not flat:
        px, py = px - 3, py - 4
        sh = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        a = im.split()[3].point(lambda v: v * 0.5)
        sh.paste(Image.new('RGBA', im.size, (42, 22, 8, 255)), (px + 6, py + 9), a)
        canvas = sh.filter(ImageFilter.GaussianBlur(5))
    canvas.alpha_composite(im, (px, py))
    canvas.save(f'{out_dir}/{name}.png', optimize=True)
    print(name, im.size)
