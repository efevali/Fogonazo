# Colección de minijuegos

Una colección de minijuegos para el celular, en horizontal, que se instala desde Chrome como una sola app, por ahora con el nombre provisorio «Minijuegos». Se entra por la sala, un living de los 70 ilustrado, y algunos de sus objetos llevan a los juegos. Todavía no tiene nombre: el repositorio conserva el de `fogonazo` hasta que lo tenga (ver [decisiones](docs/decisiones.md#la-colección)).

| Juego | Qué es | Estado |
|---|---|---|
| [Fogonazo](docs/fogonazo/README.md) | Juntar tres con componentes electrónicos sobre una protoboard, en el banco de la sala | Maqueta navegable dentro de la app; falta el juego real |
| [Mahjong](docs/mahjong/README.md) | Mahjong solitario, en modo zen | Prototipo, todavía en vertical |

## Estado

- **Publicada:** la 0.1.0, en https://efevali.github.io/fogonazo/, que se abre en Chrome y se instala desde los ajustes de la sala (el equipo de audio) o desde el menú ⋮ → «Instalar app». Funciona sin conexión. Reemplazó a Fogonazo como juego único (0.6.1).
- **Qué tiene:** la sala con sus objetos activos; Fogonazo como maqueta navegable (instrumento, mapa y partida, sin especiales, obstáculos ni zen), con su música y sus efectos; los ajustes de sonido comunes y la instalación. Nombre e ícono son provisorios.
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

La app no se arma: lo que está en el repositorio es lo que publica GitHub Pages, tal cual.

| Carpeta o archivo | Qué es |
|---|---|
| `index.html` | La página contenedora: muestra una pantalla por vez y resuelve lo común (ver `comun/app.js`). |
| `comun/` | Lo común a toda la colección: `app.js` (pantallas, «atrás» de Android, sonido por pantalla, instalación), `pantalla.js` (lo que cada pantalla usa de la contenedora), `sonido.js` (el sonido sintetizado: voces, efectos y temas de Fogonazo, lluvia y volúmenes) y `fuentes/` (las tipografías, con sus licencias). |
| `sala/` | La sala: la página, la imagen, la copia aclarada para el brillo y las máscaras de los objetos activos. |
| `fogonazo/` | Fogonazo: la pantalla-instrumento, el mapa, la partida (todavía la maqueta), el avance (`estado.js`), las escenas y las piezas recortadas. |
| `codigo/` | El motor de Fogonazo (`engine.js`), los 30 niveles (`levels.js`) y su calibración (`calibrated.json`), que la partida real va a usar. Corren igual en el navegador y en Node. |
| `manifest.webmanifest`, `sw.js`, `iconos/` | La ficha de instalación (Minijuegos, en horizontal, a pantalla completa), el *service worker* que guarda la app en el teléfono para que ande sin conexión, y los íconos provisorios. |
| `docs/` | La documentación, los bocetos, el arte vigente y el prototipo del mahjong. Lo que está en `docs/` también se publica, pero no forma parte de la app. |
| `herramientas/` | Pruebas, capturas, versión, íconos, calibración y los dibujos con código de los bocetos (ver abajo). |
| `.github/` | Las plantillas de issue y de pull request. |
| `package.json` | Los comandos y las dependencias de las herramientas (Playwright). La app no tiene dependencias. |
| `.nojekyll` | Le indica a GitHub Pages que publique los archivos tal cual. |

## Herramientas

Hace falta Node 18 o más nuevo; para las capturas, `npm install` y, la primera vez, `npx playwright install chromium`. Para probar en la computadora: `python3 -m http.server` en la carpeta del repositorio y abrir `http://localhost:8000` en Chrome, con la vista de teléfono en horizontal.

- `herramientas/capturas.js`: recorre la app como en el teléfono (sala, ajustes, Fogonazo, mapa, partida, pausa y vuelta), verifica el «atrás» de Android y que abra sin conexión, y saca una captura de cada pantalla en `dist/capturas/`. Se corre antes de publicar.
- `herramientas/version.js`: sube la versión (`parche`, `menor` o `mayor`) en `sw.js`, con la fecha, y rehace la lista de archivos que el *service worker* guarda. Sin argumento, solo rehace la lista: hace falta cada vez que se suma o se quita un archivo de la app.
- `herramientas/iconos.py`: los íconos provisorios, la ventana con lluvia recortada de la imagen de la sala (Python con Pillow).
- `herramientas/probar.js`: juega 180 partidas con el bot y 6 partidas zen de 300 jugadas, y verifica que la placa quede siempre consistente. Se corre después de tocar el motor de Fogonazo.
- `herramientas/calibrar.js`: recalibra la dificultad de Fogonazo (`node herramientas/calibrar.js 400 0.62 16,17,18`: 400 partidas por nivel, con un bot que elige la mejor jugada el 62 % de las veces). Sin lista de niveles, recalibra los 30.
- `herramientas/medir.js`, `modos.js`, `bots.js` y `ayuda_piezas.js`: la tasa de victoria con los valores actuales, cómo quedan los modos de dificultad, la comparación entre bots y el efecto de la ayuda de piezas del pedido.
- `herramientas/sala/`: los dibujos con código de los bocetos (`escena-banco.html`, `escena-instrumento*.html`, `arte-s10.js`, `catalogo-s10.html`, `referencia-p005.html`, `boceto-s11.html`) y los recortes de las imágenes sobre magenta (`piezas.py` y `obstaculos.py`, con Python, Pillow, NumPy y SciPy).

## Cómo se publica una versión

1. Los cambios se prueban en la computadora y con `node herramientas/capturas.js`; si se tocó el motor de Fogonazo, también `node herramientas/probar.js`.
2. Se sube el número: `node herramientas/version.js parche|menor|mayor`.
3. Se suma la versión a `CHANGELOG.md`.
4. Se une el pull request de la versión a `main` en un solo commit cuyo título empieza con el número («0.2.0: …»). GitHub Pages la publica en un minuto o dos.

En el teléfono, la versión nueva se baja sola y entra al cerrar la app del todo y volver a abrirla. Dónde mostrar la versión está por definir.

## Versiones

Versionado semántico: MAYOR.MENOR.PARCHE. Un parche arregla sin sumar nada; una menor suma algo sin romper lo anterior; mientras el primer número sea 0, la colección está en desarrollo. Cada versión se encuentra en el historial («Commits») porque el título de su commit empieza con el número, y se registra en [CHANGELOG.md](CHANGELOG.md).
