# Colección de minijuegos

Una colección de minijuegos para el celular, en horizontal, que se instala desde Chrome como una sola app. Se entra por la sala, un living de los 70 ilustrado, y algunos de sus objetos llevan a los juegos. Todavía no tiene nombre: el repositorio conserva el de `fogonazo` hasta que lo tenga (ver [decisiones](docs/decisiones.md#la-colección)).

| Juego | Qué es | Estado |
|---|---|---|
| [Fogonazo](docs/fogonazo/README.md) | Juntar tres con componentes electrónicos sobre una protoboard, en el banco de la sala | Maqueta navegable; falta el juego real con la estética nueva |
| [Mahjong](docs/mahjong/README.md) | Mahjong solitario, en modo zen | Prototipo, todavía en vertical |

## Estado

- **Lo publicado** en https://efevali.github.io/fogonazo/ todavía es Fogonazo como juego único, en vertical (0.6.1, del 8/10/2026). La colección lo reemplaza en esa misma dirección con su primera versión, la 0.1.0 de una numeración nueva.
- **Para probar en el teléfono:** la [sala](https://efevali.github.io/fogonazo/docs/sala/prototipo/), que por el banco de electrónica lleva a la [maqueta de Fogonazo](https://efevali.github.io/fogonazo/docs/sala/maqueta-fogonazo/instrumento.html), y el [prototipo del mahjong](https://efevali.github.io/fogonazo/docs/mahjong/prototipo.html).
- **Lo que sigue**, en [la colección](docs/coleccion.md#lo-que-sigue).

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Qué es la colección y lo común a todos los juegos | [`docs/coleccion.md`](docs/coleccion.md) |
| Cómo se ve y cómo suena cada parte | [`docs/estilo.md`](docs/estilo.md) |
| Cómo se piden y se montan las imágenes hechas con IA | [`docs/imagenes.md`](docs/imagenes.md) |
| Por qué se decidió cada cosa y qué se descartó | [`docs/decisiones.md`](docs/decisiones.md) |
| La sala, Fogonazo y el mahjong: estado, reglas, bocetos y arte | [`docs/sala/`](docs/sala/README.md), [`docs/fogonazo/`](docs/fogonazo/README.md), [`docs/mahjong/`](docs/mahjong/README.md) |
| El método de trabajo | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Lo publicado | [`CHANGELOG.md`](CHANGELOG.md) |

## Qué hay en el repositorio

| Carpeta o archivo | Qué es |
|---|---|
| `docs/` | La documentación, los bocetos, el arte vigente y los prototipos. Lo que está en `docs/` también se publica en GitHub Pages, y así se prueban los prototipos en el teléfono. |
| `codigo/` | El código de Fogonazo publicado (0.6.1). Al armar la colección se conservan el motor (`engine.js`), los niveles (`levels.js`), la calibración (`calibrated.json`) y el sonido (`audio.js`); lo demás se retira. |
| `herramientas/` | Armado, pruebas, calibración de la dificultad y, en `herramientas/sala/`, los dibujos con código y los recortes de las imágenes (ver abajo). |
| `index.html`, `manifest.webmanifest`, `sw.js`, `fuentes/`, `iconos/` | Lo que publica GitHub Pages hoy: el juego armado en un solo archivo, la ficha de instalación, el *service worker* que lo deja andar sin conexión, las tipografías y los íconos. Se rehacen con la colección. |
| `.github/` | Las plantillas de issue y de pull request. |
| `package.json` | Los comandos y las dependencias de las herramientas. El juego no tiene dependencias. |
| `.nojekyll` | Le indica a GitHub Pages que publique los archivos tal cual. |

## Herramientas

Hace falta Node 18 o más nuevo; para las que sacan capturas, `npm install` y, la primera vez, `npx playwright install chromium`. Para probar en la computadora: `python3 -m http.server` en la carpeta del repositorio y abrir `http://localhost:8000` en Chrome, con la vista de teléfono.

Las del motor de Fogonazo siguen vigentes:

- `herramientas/probar.js`: juega 180 partidas con el bot y 6 partidas zen de 300 jugadas, y verifica que la placa quede siempre consistente. Se corre después de tocar el motor.
- `herramientas/calibrar.js`: recalibra la dificultad (`node herramientas/calibrar.js 400 0.62 16,17,18`: 400 partidas por nivel, con un bot que elige la mejor jugada el 62 % de las veces). Sin lista de niveles, recalibra los 30.
- `herramientas/medir.js`: la tasa de victoria del bot con los valores calibrados actuales.
- `herramientas/modos.js`: cuántas partidas gana el bot y cuántas llegan a dos y tres estrellas en cada modo de dificultad.
- `herramientas/bots.js`: compara el bot de la calibración con uno fuerte y uno perfecto.
- `herramientas/ayuda_piezas.js`: mide los niveles de pedido de piezas con y sin la ayuda de piezas del pedido.
- `herramientas/sala/`: los dibujos con código de los bocetos (`escena-banco.html`, `escena-instrumento*.html`, `arte-s10.js`, `catalogo-s10.html`, `referencia-p005.html`) y los recortes de las imágenes sobre magenta (`piezas.py` y `obstaculos.py`, con Python, Pillow, NumPy y SciPy).

Las demás (`armar.js`, `version.js`, `vista_previa.js`, `boceto.js`, `fuentes.js`, `iconos.js`, `probar_clave.js`) son del Fogonazo publicado y se rehacen o se retiran al armar la colección.

## Versiones

Versionado semántico: MAYOR.MENOR.PARCHE. Un parche arregla sin sumar nada; una menor suma algo sin romper lo anterior; mientras el primer número sea 0, la colección está en desarrollo. Cada versión se encuentra en el historial («Commits») porque el título de su commit empieza con el número, y se registra en [CHANGELOG.md](CHANGELOG.md).
