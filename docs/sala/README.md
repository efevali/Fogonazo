# La sala (en curso)

Trabajo en curso: la pantalla de inicio de la colección de minijuegos que va a contener a Fogonazo, al mahjong y a los juegos que vengan. Es un living ilustrado donde algunos objetos, los objetos activos, llevan a los juegos. Todavía no forma parte de Fogonazo publicado ni tiene issues ni versión. Las decisiones están en el [registro](../decisiones.md#colección-y-mahjong-en-curso); acá figuran el estado, los archivos y cómo seguir.

## Estado al 25/10/2026

- **Imagen base vigente:** [`arte/sala-v2.png`](arte/sala-v2.png), de 2752 × 1536, generada con Gemini. Vista frontal de un living de los 70, al atardecer con lluvia.
- **Piezas de Fogonazo vigentes:** [`arte/fogonazo/P-003_piezas-fogonazo.jpg`](arte/fogonazo/P-003_piezas-fogonazo.jpg), las siete piezas básicas de Gemini sobre fondo magenta, para recortar. Al montarlas se acortan las patas, como en el [montaje con patas cortas](bocetos/P-002-montaje-cortas.png).
- **Prototipo:** [`prototipo/`](prototipo/index.html), que se abre en Chrome en https://efevali.github.io/fogonazo/docs/sala/prototipo/. Es la misma página que el artefacto «Sala de los 70» de claude.ai, con la imagen en alta.
- Producto lo vio y dijo: «tiene aspecto de juego profesional».
- Producto lo probó en el teléfono (25/10): los objetos activos se ven bien. El brillo que se repetía después de tocar un objeto se arregló el 26/10 (ver «Por revisar»).
- **Maqueta de Fogonazo** (26/10): [`maqueta-fogonazo/`](maqueta-fogonazo/index.html), que se abre en Chrome en https://efevali.github.io/fogonazo/docs/sala/maqueta-fogonazo/. Es la partida del boceto S-06a con las piezas de Gemini. Ver «Maqueta de Fogonazo» más abajo. Producto la probó en el teléfono: «se ve muy bien», y se sigue adelante con esta estética.

## Qué hace el prototipo

- **Tres objetos activos**, sin carteles ni marcas; cada uno brilla apenas por turno, cada unos 5 s:
  - **Banco de electrónica → Fogonazo.** Tarjeta «próximamente» con aspecto de tapa de kit de electrónica.
  - **Mesa ratona con el mahjong → Mahjong.** Tarjeta «próximamente» con aspecto de estuche de paño rojo.
  - **Equipo de audio → Sonido.** Panel con aspecto de frente de receiver, con música, efectos y lluvia. La lluvia de fondo suena de verdad; música y efectos todavía no están conectados.
- **Ambiente animado:** lluvia afuera y gotas que bajan por el vidrio (pasan por detrás de la lámpara de arco), traza del osciloscopio, LEDs del banco, vapor de la tetera, cera de la lámpara de lava, disco girando, vúmetros y lámparas que respiran apenas.
- **Herramientas de prueba:** un botón muestra las zonas táctiles; otro pone pantalla completa y bloquea en horizontal donde el navegador lo permite. En vertical, se ve la sala entera, achicada.

## Archivos

| Carpeta | Qué hay |
|---|---|
| [`arte/`](arte/) | La imagen base vigente, en la resolución original de Gemini. |
| [`arte/historial/`](arte/historial/) | Las imágenes anteriores: (1) la prueba del sector del equipo de audio con ChatGPT; (2a) la de Gemini elegida, con la costilla de Adán, que fue la base del primer prototipo; (2b) su alternativa; (3) la primera sala completa de Gemini, con el mahjong mal resuelto. |
| [`bocetos/`](bocetos/) | Las pruebas que hizo Desarrollo dibujando con código, de la S-01 a la S-05 (ver abajo). |
| [`prototipo/`](prototipo/) | La página, la imagen base para la web, una copia aclarada para el brillo de los objetos activos y las máscaras de cada objeto activo y de la ventana. |
| [`maqueta-fogonazo/`](maqueta-fogonazo/index.html) | La maqueta jugable de la partida de Fogonazo: la página, el fondo prerenderizado, las piezas recortadas y las fuentes. |

Las referencias que se usaron para orientar el estilo (las ilustraciones isométricas y las fotos de livings de época) no se guardan acá: son de terceros y el repositorio es público. Para eso está la carpeta Referencias de Drive, que es privada (ver «Trabajo con Gemini en Drive»).

### Bocetos

| Boceto | Qué es | Estado |
|---|---|---|
| [S-01](bocetos/S-01-isometrica-neutra.jpg) | Primera prueba: living neutro en isométrica, en vertical | Descartado: muy simple, y los muebles mal construidos (el sillón, la biblioteca y los cajones que salían de costado) |
| [S-02](bocetos/S-02-isometrica-70.jpg) | Living de los 70 en isométrica, con luz calculada, en vertical | Descartado: luces excesivas, gato falso, y todo se veía chico en vertical |
| S-03 | Encuadres en horizontal: [a · isométrica recortada](bocetos/S-03a-encuadre-isometrica-recortada.png), [b · vista frontal](bocetos/S-03b-encuadre-vista-frontal.png), [c · isométrica con arrastre](bocetos/S-03c-encuadre-isometrica-con-arrastre.png); y los juegos: [d · Fogonazo 10 × 8](bocetos/S-03d-fogonazo-horizontal.png), [e · mahjong «tortuga»](bocetos/S-03e-mahjong-horizontal.png) | Se eligió la b. La d y la e son la referencia para pasar los juegos a horizontal (ninguna se aprobó como diseño final) |
| S-04 | Pruebas de estilo en vista frontal, del sector del equipo de audio: [a](bocetos/S-04a-prueba-frontal.jpg), [b · más detalle](bocetos/S-04b-prueba-frontal-detalle.jpg) | Superadas: se pasó a generar las imágenes con Gemini |
| [S-05](bocetos/S-05-composicion-sala.jpg) | Composición de la sala completa en vista frontal | Vigente como guía de composición: es la que se le pasó a Gemini |
| S-06 | Fogonazo en horizontal con estética de la colección (26/10): [a · banco](bocetos/S-06a-fogonazo-banco.png), componentes reales sobre una protoboard en el banco de nogal, con display de LED, instrumento de aguja, etiquetas Dymo y el pedido en una ficha; [b · kit](bocetos/S-06b-fogonazo-kit.png), piezas ilustradas planas en la bandeja de una caja de kit de los 70 | Se eligió la a (26/10): es la base del pedido de piezas a Gemini (P-002). Después de elegirla se le agregaron las patas a la resistencia, que no se dibujaban. La b queda como alternativa si las piezas de Gemini no sirven |
| S-07 | Estructura nueva de Fogonazo (26/10, ver [estructura](../estructura.md)): [a · pantalla-instrumento en Niveles](bocetos/S-07a-fogonazo-instrumento-niveles.png), [b · en Récords, con el aviso de Chrome](bocetos/S-07b-fogonazo-instrumento-records.png), [c · sonido con el parlante y los vúmetros](bocetos/S-07c-fogonazo-sonido.png), [d · mapa continuo en una placa verde](bocetos/S-07d-fogonazo-mapa.png), [e · nota de cuaderno de una novedad](bocetos/S-07e-fogonazo-nota.png) | En discusión |

## Cómo se trabaja la imagen

- **Gemini genera las imágenes; Desarrollo hace todo lo demás**: la composición, la revisión (lógica de los muebles, posición de los objetos activos, franja segura), las zonas táctiles, los brillos, las animaciones y el código.
- **Cambios puntuales sobre la misma base.** Se le pide a Gemini que cambie una sola cosa y deje el resto «exactamente igual». Funciona: al corregir el mahjong cambió alrededor del 1 % de la imagen, y la comparación píxel por píxel mostró todo lo demás idéntico. Importa porque las zonas táctiles y las animaciones se miden sobre la imagen: si algo se mueve, hay que volver a medir.
- **Bajar la imagen con la opción de descarga de Gemini.** Copiarla, compartirla o capturarla da una vista previa (salió una de 512 × 286). La descarga dio 2752 × 1536 en PNG. Que Gemini suba la imagen directo a Drive también da una versión reducida (salió un JPEG de 1375 × 768 con nombre .png).
- **Proporción.** La imagen es casi 16:9 y el teléfono en horizontal ronda 20:9: se recorta arriba y abajo. Lo importante tiene que quedar en la franja central, alrededor del 80 % del alto.
- **Coordenadas del prototipo.** Están en el sistema de 2576 × 1438 de la primera descarga; la imagen en alta se dibuja escalada en ese mismo recuadro y coincide sin corrimientos (se verificó).
- **Lo que se anima, chico y simple.** Cuando la imagen ya trae algo que se va a animar (la cera de la lámpara de lava, la etiqueta del disco, la traza del osciloscopio), se repinta encima.

### Trabajo con Gemini en Drive

Desde el 25/10, Gemini es una herramienta de edición de imágenes: ejecuta pedidos escritos por Desarrollo y aprobados por Producto, dentro de una Gem llamada «Minijuegos». El intercambio pasa por la carpeta privada «IAs - Proyectos / Minijuegos» del Drive de Producto, a la que Desarrollo entra con los conectores de Google Drive y Google Docs.

- **Mesa de trabajo:** el único documento. Lo escribe Desarrollo y Gemini lo lee antes de cada trabajo. Tiene la mecánica general (roles, ciclo de cada pedido, carpetas), las exigencias técnicas (formato y resolución, ediciones puntuales, franja segura, objetos activos, elementos animados, objetos sueltos, nombres de archivo), lo vigente, los temas abiertos y los pedidos en curso. Es general: lo propio de cada pantalla va solo en «Lo vigente» y en los pedidos. Queda solo lo actual; el historial se guarda en este repositorio.
- **Carpetas:** Entregas (lo entregado, sin revisar), Vigentes (lo que está en uso), Superados (lo reemplazado) y Referencias (material para orientar el estilo o la composición: imágenes de terceros y bocetos de Desarrollo). Desarrollo revisa cada entrega y, si se aprueba, la mueve a Vigentes y pasa la anterior a Superados.
- **Los pedidos siguen la numeración P-002, P-003…** El P-001 es la corrección del mahjong (abajo).
- **En la mesa, solo lo que Gemini puede abrir o usar** (26/10). Nada de rutas ni enlaces de este repositorio, ni datos que no le sirven para el trabajo: cada archivo que un pedido necesita se sube a Drive y la mesa lo nombra ahí.
- **Este repositorio sigue siendo la fuente de verdad.** Las imágenes aprobadas se copian a `arte/` y las decisiones se registran en el registro de decisiones.

Antes se probó que Gemini tuviera rol de equipo, con una memoria propia que editaba él mismo y un documento conjunto con Desarrollo. Desde la Gem, la edición resultó poco confiable y la Gem se limita a responder pedidos, así que se descartó. La memoria quedó en Superados.

### Pedidos a Gemini

Desde el 25/10 los pedidos se escriben en la mesa de trabajo; cuando se cierran, su historial se registra acá. Cerrados desde entonces:

- **P-002, piezas de Fogonazo** (26/10). Las siete piezas básicas con la terminación de la sala, en una grilla de 4 × 2 sobre fondo magenta (no verde croma, porque la bobina es verde), a partir de la lámina [`P-002-referencia-piezas.png`](bocetos/P-002-referencia-piezas.png), hecha con las piezas del boceto S-06a. La lámina y el boceto se subieron a Referencias y Gemini los leyó solo. **Entrega:** [`arte/historial/P-002_piezas-fogonazo.jpg`](arte/historial/P-002_piezas-fogonazo.jpg), 2752 × 1536; llegó como JPEG con nombre de fecha, bajado desde el teléfono. **Revisión:** aprobada como prueba. Las piezas son coherentes entre sí, están en el orden pedido y son técnicamente correctas. El fondo es parejo (253, 0, 252, con un desvío de 1,5), sin sombra ni halo, y el recorte sale limpio. Desvíos: el LED trae patas que la lámina no tenía, y el cerámico y el cristal, patas largas (como en la lámina). Así, en la casilla, las patas achican los cuerpos ([montaje tal cual](bocetos/P-002-montaje-tal.png)). Se resuelve en código: las patas se acortan al montar las piezas, como si estuvieran clavadas en la protoboard ([montaje con patas cortas](bocetos/P-002-montaje-cortas.png)). Al electrolítico le falta la ranura de la tapa, que no se nota a tamaño de juego. La resistencia queda finita; se pidió engrosarla en el P-003. Al responder «procedé» en el chat, Gemini no trabajó: el pedido figuraba como entregado y con turno de Claude, y la mesa manda.

- **P-003, resistencia más gruesa** (26/10). Edición puntual sobre la entrega del P-002: solo la resistencia, con el cuerpo el doble de largo que de alto y patas cortas. **Entrega:** [`arte/fogonazo/P-003_piezas-fogonazo.jpg`](arte/fogonazo/P-003_piezas-fogonazo.jpg), 2752 × 1536, otra vez en JPEG (una primera subida fue una vista reducida de 1024 × 572). **Revisión:** la edición fue puntual, y fuera de la celda 1 solo cambió la punta de la pata que asomaba en la celda 2. Pero no cumplió el objetivo: Gemini agrandó la resistencia entera, de 160 a 200 píxeles de alto y también más larga, sin cambiar la proporción (2,4 a 1). Montada en la casilla queda igual que la del P-002, a 14 píxeles de alto ([comparación](bocetos/P-003-comparacion-resistencia.png)). Desarrollo propuso engrosarla en código, estirada un 35 % (unos 19 píxeles), y Producto prefirió el dibujo original de Gemini. Queda vigente la del P-003, que tiene la misma forma pero más resolución. Reemplaza entera a la del P-002, porque las otras seis piezas son idénticas.

> Te paso dos imágenes. La primera es un boceto de composición de la sala completa de mi juego (vista frontal). La segunda es la ilustración que ya aprobamos del sector del equipo de audio. Convertí el boceto en una ilustración con exactamente el mismo estilo, paleta e iluminación que la segunda imagen.
> - Mantené el encuadre y la posición de cada mueble del boceto.
> - El sector del equipo de audio tiene que verse igual que en la segunda imagen: bafles, aparador con bandeja, receiver, grabador de cinta, casetera y discos; el cuadro del arcoíris con su lámpara; la costilla de Adán; la lámpara de lava; la biblioteca con la lámpara hongo.
> - Izquierda: banco de electrónica de aficionado de los 70, con osciloscopio, protoboard con LEDs, soldador, cajonera de componentes, lámpara articulada verde, tablero perforado con herramientas, estante con manuales y una radio, y una banqueta.
> - Centro: ventana con lluvia y ciudad al atardecer, cortinas ocre, sillón de corderoy color óxido con almohadones mostaza, crema y oliva y una manta tejida doblada, lámpara de arco con pantalla de bronce sobre una mesa ratona de nogal con un mahjong en juego (estuche abierto, muro de fichas, fichas en mano, tetera y tazas), y alfombra peluda.
> - Derecha, adelante: puf de cuero.
> - Muebles con construcción lógica: los brazos del sillón van de punta a punta y los cajones abren hacia adelante.
> - Luz cálida pero no exagerada. Sin texto, logos ni personas.
> - Dejá los objetos importantes lejos de los bordes de arriba y de abajo, porque se van a recortar.

El resultado (historial, 3) salió bien salvo el mahjong: el muro de fichas eran libros y la mano, una barra con letras inventadas. Se corrigió con:

> En la mesa ratona, reemplazá la pila de libros verdes y la barra gris por fichas de mahjong reales: una fila de fichas apiladas boca abajo con el dorso verde, y una fila de fichas paradas de frente, color marfil, con símbolos tradicionales (círculos, bambúes y caracteres chinos), sin letras latinas. Las fichas dentro del estuche abierto, también con esos símbolos. Dejá todo lo demás exactamente igual.

## Maqueta de Fogonazo

Una partida jugable en horizontal para probar en el teléfono cómo se ven y se juegan la estética del banco y las piezas de Gemini. No es el juego: tiene una lógica mínima propia, separada de `codigo/engine.js`.

- **Qué tiene:** placa de 10 × 8 con los siete componentes; intercambio deslizando o tocando dos piezas vecinas; líneas de tres o más, cascadas con puntaje creciente, caída y reposición desde arriba, y rebarajado si no quedan jugadas. Marcador con display de LED (movimientos), instrumento de aguja con las tres estrellas y puntaje; pedido en la ficha, que se tacha al completarse; carteles de fin («Placa armada» o «Sin movimientos»); pausa con «Empezar de nuevo», sonido, pantalla completa e «Ir a la sala». Sonidos mínimos sintetizados.
- **Qué no tiene:** especiales, obstáculos, niveles, guardado ni la música del juego.
- **Calibración de prueba:** nivel 27 con 25 movimientos y un pedido de 10 LEDs, 10 chips y 8 cristales; estrellas en 500, 1.000 y 1.600 puntos, y 50 de bonus por movimiento que sobra. Simulado: una estrategia al azar completa el pedido el 65 % de las veces y una codiciosa el 82 %.
- **Cómo está hecha:** el fondo (banco, protoboard, paneles y ficha) es una imagen prerenderizada; encima, los datos que cambian van en SVG y las piezas, como imágenes animadas con la sombra incluida, para que ande fluido en el teléfono. La escena mide 915 × 412 unidades y se ajusta a la pantalla.
- **Cómo se regenera:** el fondo sale de [`herramientas/sala/escena-banco.html`](../../herramientas/sala/escena-banco.html) con `?v=a&bg=1`, capturado a 915 × 412 con densidad 2,625 (la misma página dibuja el boceto S-06a con `?v=a`). Las piezas salen de la imagen vigente de Gemini con [`herramientas/sala/piezas.py`](../../herramientas/sala/piezas.py): recorte del magenta, patas acortadas, sombra incluida y 256 × 256 píxeles.

## Por revisar

- **La lámpara de arco** se lee como apoyada contra la ventana, detrás del sillón, y no sobre la mesa. Se decidió dejarla así: corregirla toca la geometría y es arriesgado.
- ~~**El brillo de un objeto activo después de usarlo.**~~ Arreglado el 26/10. Al cerrar el panel, el objeto tocado se volvía a iluminar enseguida y quedaba desfasado de los otros dos, porque el destello del toque reemplazaba la animación de aviso y esta arrancaba de cero. Ahora el destello va en una capa propia y el ciclo de aviso no se interrumpe nunca.
- **Coherencia entre la sala y cada juego.** El mahjong tiene hoy la estética de Kasa (verde papel y tinta azul) y Fogonazo la de 8 y 16 bits; la sala es una ilustración de los 70. Decidido el 26/10: Fogonazo deja el pixel art, y los juegos pueden tener estilos distintos pero tienen que sentirse parte de la colección. Falta definir cómo se ve cada juego y cómo se pasa de la sala al juego.

## Lo que sigue

1. ~~Maqueta de la partida de Fogonazo en horizontal (boceto S-06a) con las piezas de Gemini recortadas, para probar en el teléfono.~~ Hecha y aprobada (26/10).
2. Estructura de colección en el repositorio: la sala como pantalla de inicio y cada juego como módulo, con lo común aparte (sonido, guardado, «atrás» de Android, instalación).
3. Fogonazo en horizontal, con tablero de 10 × 8 y el marcador a los costados (referencia: S-03d). Obliga a transponer y recalibrar los niveles.
4. El mahjong en horizontal (referencia: S-03e).
5. Los menús, y la sala como juego de buscar y encontrar.
6. El nombre de la colección. El repositorio se renombra después.
