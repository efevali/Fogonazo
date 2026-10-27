# Provisional icons of the collection: the rainy window, cropped from the room (docs/sala/arte/sala-v2.png).
# A draft to move on; the final icon waits for the collection's name (see docs/decisiones.md).
#   python3 herramientas/iconos.py
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
room = Image.open(ROOT / 'docs/sala/arte/sala-v2.png').convert('RGB')
out = ROOT / 'iconos'
out.mkdir(exist_ok=True)

# the window panes, square; the maskable one has room around it, because Android shows only the central 80 %
ANY = (905, 268, 1445, 808)
MASKABLE = (860, 223, 1490, 853)

for size in (192, 512):
    room.crop(ANY).resize((size, size), Image.LANCZOS).save(out / f'icono-{size}.png', optimize=True)
    room.crop(MASKABLE).resize((size, size), Image.LANCZOS).save(out / f'icono-maskable-{size}.png', optimize=True)
room.crop(ANY).resize((180, 180), Image.LANCZOS).save(out / 'apple-touch-icon.png', optimize=True)
print('íconos en', out)
