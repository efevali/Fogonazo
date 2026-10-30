# The icons of the collection: the rainy window with the arc lamp (P-007, made with Gemini from the room's window).
# Provisional until the collection has a name (see docs/decisiones.md).
#   python3 herramientas/iconos.py
# The image goes whole in both kinds: the common icon shows it all; Android's adaptive (maskable) one shows the
# central part inside its circle or rounded square, where the lamp and the window are.
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
art = Image.open(ROOT / 'docs/sala/arte/P-007_icono.jpg').convert('RGB')
out = ROOT / 'iconos'
out.mkdir(exist_ok=True)

for size in (192, 512):
    ic = art.resize((size, size), Image.LANCZOS)
    ic.save(out / f'icono-{size}.png', optimize=True)
    ic.save(out / f'icono-maskable-{size}.png', optimize=True)
art.resize((180, 180), Image.LANCZOS).save(out / 'apple-touch-icon.png', optimize=True)
print('íconos en', out)
