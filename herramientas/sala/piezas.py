# Cut the seven pieces out of the magenta sheet, trim the legs, bake a soft shadow, export 256x256 PNGs.
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
Mg = np.array([253, 0.5, 252.])

def cut(k):
    reg = ndimage.binary_dilation(lab == k, iterations=10)
    ys, xs = np.where(reg)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    al = (alpha * reg)[y0:y1, x0:x1]
    c = src[y0:y1, x0:x1]
    with np.errstate(divide='ignore', invalid='ignore'):
        un = np.clip(np.where(al[..., None] > 0, (c - (1 - al[..., None]) * Mg) / np.maximum(al[..., None], 1e-3), 0), 0, 255)
    return Image.fromarray(np.dstack([un, al * 255]).astype(np.uint8), 'RGBA'), (x0 + x1) / 2, (y0 + y1) / 2

def trim_v(im, stub=0.16):
    a = np.asarray(im)[..., 3] > 128
    w = a.sum(1); rows = np.where(w > 0.45 * w.max())[0]
    top = np.where(w > 0)[0].min(); end = rows.max()
    return im.crop((0, 0, im.width, min(im.height, int(end + stub * (end - top)))))

def trim_h(im, stub=0.10):
    a = np.asarray(im)[..., 3] > 128
    h = a.sum(0); cols = np.where(h > 0.45 * h.max())[0]; b0, b1 = cols.min(), cols.max()
    s = int(stub * (b1 - b0))
    return im.crop((max(0, b0 - s), 0, min(im.width, b1 + s), im.height))

S, BOX = 256, 0.86          # canvas size, share of the canvas the piece may use
for k in [i + 1 for i, s in enumerate(sizes) if s > 5000]:
    im, cx, cy = cut(k)
    cell = int(cy // (H / 2)) * 4 + int(cx // (W / 4))
    if cell == 0: im = trim_h(im)
    elif cell in (2, 4, 5, 6): im = trim_v(im)
    im = im.crop(im.getbbox())
    f = min(S * BOX / im.width, S * BOX / im.height)
    im = im.resize((max(1, round(im.width * f)), max(1, round(im.height * f))), Image.LANCZOS)
    canvas = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    px, py = (S - im.width) // 2 - 3, (S - im.height) // 2 - 4
    sh = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    a = im.split()[3].point(lambda v: v * 0.5)
    sh.paste(Image.new('RGBA', im.size, (42, 22, 8, 255)), (px + 6, py + 9), a)
    sh = sh.filter(ImageFilter.GaussianBlur(5))
    canvas = Image.alpha_composite(sh, Image.new('RGBA', (S, S)))
    canvas.alpha_composite(im, (px, py))
    canvas.save(f'{out_dir}/pieza{cell}.png', optimize=True)
    print(cell, im.size)
