# La sala (en curso)

Trabajo en curso: la pantalla de inicio de la colección de minijuegos que va a contener a Fogonazo, al mahjong y a los juegos que vengan. Es un living ilustrado donde algunos objetos, los objetos activos, llevan a los juegos. Todavía no forma parte de Fogonazo publicado ni tiene issues ni versión. Las decisiones están en el [registro](../decisiones.md#colección-y-mahjong-en-curso); acá figuran el estado, los archivos y cómo seguir.

## Estado al 25/10/2026

- **Imagen base vigente:** [`arte/sala-v2.png`](arte/sala-v2.png), de 2752 × 1536, generada con Gemini. Vista frontal de un living de los 70, al atardecer con lluvia.
- **Prototipo:** [`prototipo/`](prototipo/index.html), que se abre en Chrome en https://efevali.github.io/fogonazo/docs/sala/prototipo/. Es la misma página que el artefacto «Sala de los 70» de claude.ai, con la imagen en alta.
- Producto lo vio y dijo: «tiene aspecto de juego profesional».
- Producto lo probó en el teléfono (25/10): los objetos activos se ven bien. Queda un detalle del brillo (ver «Por revisar»).

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

Las referencias que se usaron para orientar el estilo (las ilustraciones isométricas y las fotos de livings de época) no se guardan acá: son de terceros y el repositorio es público. Para eso está la carpeta Referencias de Drive, que es privada (ver «Trabajo con Gemini en Drive»).

### Bocetos

| Boceto | Qué es | Estado |
|---|---|---|
| [S-01](bocetos/S-01-isometrica-neutra.jpg) | Primera prueba: living neutro en isométrica, en vertical | Descartado: muy simple, y los muebles mal construidos (el sillón, la biblioteca y los cajones que salían de costado) |
| [S-02](bocetos/S-02-isometrica-70.jpg) | Living de los 70 en isométrica, con luz calculada, en vertical | Descartado: luces excesivas, gato falso, y todo se veía chico en vertical |
| S-03 | Encuadres en horizontal: [a · isométrica recortada](bocetos/S-03a-encuadre-isometrica-recortada.png), [b · vista frontal](bocetos/S-03b-encuadre-vista-frontal.png), [c · isométrica con arrastre](bocetos/S-03c-encuadre-isometrica-con-arrastre.png); y los juegos: [d · Fogonazo 10 × 8](bocetos/S-03d-fogonazo-horizontal.png), [e · mahjong «tortuga»](bocetos/S-03e-mahjong-horizontal.png) | Se eligió la b. La d y la e son la referencia para pasar los juegos a horizontal (ninguna se aprobó como diseño final) |
| S-04 | Pruebas de estilo en vista frontal, del sector del equipo de audio: [a](bocetos/S-04a-prueba-frontal.jpg), [b · más detalle](bocetos/S-04b-prueba-frontal-detalle.jpg) | Superadas: se pasó a generar las imágenes con Gemini |
| [S-05](bocetos/S-05-composicion-sala.jpg) | Composición de la sala completa en vista frontal | Vigente como guía de composición: es la que se le pasó a Gemini |

## Cómo se trabaja la imagen

- **Gemini genera las imágenes; Desarrollo hace todo lo demás**: la composición, la revisión (lógica de los muebles, posición de los objetos activos, franja segura), las zonas táctiles, los brillos, las animaciones y el código.
- **Cambios puntuales sobre la misma base.** Se le pide a Gemini que cambie una sola cosa y deje el resto «exactamente igual». Funciona: al corregir el mahjong cambió alrededor del 1 % de la imagen, y la comparación píxel por píxel mostró todo lo demás idéntico. Importa porque las zonas táctiles y las animaciones se miden sobre la imagen: si algo se mueve, hay que volver a medir.
- **Bajar la imagen con la opción de descarga de Gemini.** Copiarla, compartirla o capturarla da una vista previa (salió una de 512 × 286). La descarga dio 2752 × 1536 en PNG.
- **Proporción.** La imagen es casi 16:9 y el teléfono en horizontal ronda 20:9: se recorta arriba y abajo. Lo importante tiene que quedar en la franja central, alrededor del 80 % del alto.
- **Coordenadas del prototipo.** Están en el sistema de 2576 × 1438 de la primera descarga; la imagen en alta se dibuja escalada en ese mismo recuadro y coincide sin corrimientos (se verificó).
- **Lo que se anima, chico y simple.** Cuando la imagen ya trae algo que se va a animar (la cera de la lámpara de lava, la etiqueta del disco, la traza del osciloscopio), se repinta encima.

### Trabajo con Gemini en Drive

Desde el 25/10 el intercambio con Gemini pasa por una carpeta privada del Drive de Producto, «IAs - Proyectos / Minijuegos», a la que Desarrollo entra con los conectores de Google Drive y Google Docs. Gemini trabaja dentro de una Gem llamada «Minijuegos». Producto supervisa y aprueba cada paso, sin copiar y pegar los pedidos.

- **Mesa de trabajo Claude y Gemini:** el documento conjunto. Cada pedido de imagen lleva número (P-001, P-002…) y reúne en un solo lugar el pedido, la aprobación de Producto, la entrega de Gemini, la revisión de Desarrollo y el cierre. También están ahí lo vigente y los temas abiertos.
- **Memoria de Gemini:** la documentación propia de Gemini (su rol, las reglas de trabajo, la guía de estilo, el inventario de la sala y los hitos). Reemplaza a su ficha anterior, que quedó en Superados.
- **Carpetas:** Vigentes (las imágenes en uso), Superados (lo reemplazado) y Referencias (material de terceros para orientar el estilo).
- **Este repositorio sigue siendo la fuente de verdad.** Las imágenes aprobadas se copian a `arte/` y las decisiones se registran en el registro de decisiones.

### Pedidos a Gemini

Desde el 25/10 los pedidos quedan en la mesa de trabajo; acá están los anteriores. El del sector del equipo de audio lo escribió Producto y no quedó registrado. La sala completa se pidió pasando dos imágenes: la composición S-05 y la del equipo de audio elegida (2a).

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

## Por revisar

- **La lámpara de arco** se lee como apoyada contra la ventana, detrás del sillón, y no sobre la mesa. Se decidió dejarla así: corregirla toca la geometría y es arriesgado.
- **El brillo de un objeto activo después de usarlo.** Al cerrar el panel y volver a la sala, al rato el sector que se tocó se vuelve a iluminar solo. Causa: el destello del toque reemplaza la animación de aviso y, cuando termina, esa animación arranca de cero, así que el objeto brilla de nuevo enseguida y queda desfasado de los otros dos. Arreglo posible: devolverle la animación con el desfase que le corresponde en el ciclo. Se corrige más adelante.
- **Coherencia entre la sala y cada juego.** El mahjong tiene hoy la estética de Kasa (verde papel y tinta azul) y Fogonazo la de 8 y 16 bits; la sala es una ilustración de los 70. Falta decidir si cada juego conserva su aspecto o se acerca al de la sala, y cómo se pasa de la sala al juego.

## Lo que sigue

1. Estructura de colección en el repositorio: la sala como pantalla de inicio y cada juego como módulo, con lo común aparte (sonido, guardado, «atrás» de Android, instalación).
2. Fogonazo en horizontal, con tablero de 10 × 8 y el marcador a los costados (referencia: S-03d). Obliga a transponer y recalibrar los niveles.
3. El mahjong en horizontal (referencia: S-03e).
4. Los menús, y la sala como juego de buscar y encontrar.
5. El nombre de la colección. El repositorio se renombra después.
