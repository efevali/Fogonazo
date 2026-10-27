# Fogonazo

Un juego de juntar tres con componentes electrónicos, el primero de la colección. Se juega en horizontal, sobre una placa de 10 × 8 (10 columnas por 8 filas), en el banco de electrónica de la sala visto de cerca. Tiene un camino continuo de niveles, los 30 primeros hechos a mano y los siguientes generados sin fin, y un modo zen para jugar sin límite. El nombre puede cambiar.

Cómo se ve y cómo suena está en la [guía de estilo](../estilo.md#fogonazo); por qué se decidió cada cosa, en el [registro de decisiones](../decisiones.md#fogonazo). Ante una duda de diseño del juego, se resuelve contra este documento.

Lo que vale para todo el juego:

1. **Mixto:** niveles por movimientos y niveles contrarreloj.
2. **Electrónica de verdad:** los componentes son técnicamente correctos, y el sabor de electrónica real está en las piezas, el banco y el manual.
3. **Dificultad en oleadas:** tramos exigentes y respiros. El nivel 30 se gana en unos pocos intentos.

## Estado

- **En la app desde la 0.1.0, como maqueta navegable** (ver abajo): pantalla-instrumento, mapa y partida, con las imágenes vigentes, su música y sus efectos, y una lógica mínima propia. Producto la probó: «se ve genial».
- **Arte vigente**, en [`arte/`](arte/): las siete piezas ([P-003](arte/P-003_piezas-fogonazo.jpg)), la escena de la pantalla-instrumento ([P-004](arte/P-004_escena-instrumento.png), de 1679 × 937; el teléfono la estira un 43 %, aceptable por el estilo pintado) y los especiales y obstáculos ([P-005](arte/P-005_especiales-obstaculos.jpg)). Los recortes listos para usar están en [`fogonazo/piezas/`](../../fogonazo/piezas/), en la app.
- **El motor** (`codigo/`) es todavía el del juego anterior, con placa de 8 × 10 y los 30 niveles con sus nombres; la maqueta no lo usa. Los pasos que siguen están en [la colección](../coleccion.md#lo-que-sigue).

## Recorrido

```
Sala ── banco de electrónica ──► pantalla-instrumento
                                    ├── Niveles ──► mapa ──► partida
                                    ├── Zen ─────────────► partida
                                    ├── Dificultad y Récords
                                    ├── Manual (la revista de la pared)
                                    └── Sonido (la placa con el parlante)
```

- **Se entra directo** a la pantalla-instrumento: no hay pantalla de título aparte.
- **El «atrás» de Android:** de la partida a la pausa; de la pausa al mapa (o a la pantalla-instrumento, si era zen); del mapa a la pantalla-instrumento, y de ahí a la sala.

## La pantalla-instrumento

La portada del juego y su lugar de ajustes: un osciloscopio del banco visto de cerca, con la pantalla verde fósforo que muestra y las perillas que eligen.

- **Perilla «Modo»:** Niveles (con el nivel siguiente a la vista; tocar la pantalla abre el mapa), Zen y Récords.
- **Perilla «Dificultad»:** Fácil, Normal y Difícil.
- **Récords**, por dificultad: el nivel más alto y las estrellas sumadas, con el aviso de que el avance vive en Chrome. También los récords del zen.
- **Sonido:** la placa con el parlante abre los ajustes de música y efectos, los mismos de toda la colección.
- **Manual:** la revista pegada en la pared, «Proyecto Nº 21», con cómo se juega y los especiales.
- **«◀ Sala»** vuelve a la sala.

## Niveles: un camino continuo

Una sola secuencia numerada, sin capítulos, nombres ni textos por nivel, como en Candy Crush.

- **Del 1 al 30, hechos a mano.** Son los 30 niveles del juego publicado, transpuestos de 8 × 10 a 10 × 8 y recalibrados. Conservan su progresión: enseñan cada componente, especial y obstáculo en orden, con las oleadas de dificultad (ver la tabla).
- **Del 31 en adelante, generados.** Cada nivel sale de su número, que fija una semilla y su lugar en la curva de dificultad: el nivel 57 es siempre el mismo para cualquiera, y reintentarlo es jugar el mismo nivel. No hay último nivel. No traen mecánicas nuevas: combinan lo que ya existe (tipo de pedido, obstáculos, forma de la placa y huecos, movimientos o contrarreloj).
- **La curva** sigue en oleadas y crece de a poco hasta una meseta cercana a la dificultad de los niveles 26 a 30, para que nunca se vuelva imposible.
- **Contrarreloj:** uno de cada cinco, también en los generados.
- **Calibración:** las reglas del generador se ajustan con el bot en la computadora, hasta que los generados ganen en una proporción parecida a los hechos a mano. El teléfono no simula nada.
- **Agregar un nivel a mano** más adelante es insertarlo en la lista; los generados se corren detrás.
- **Novedades:** cada componente, especial u obstáculo aparece por primera vez en un nivel puntual. Esa primera vez, junto a la placa hay una nota de cuaderno que explica el movimiento de la forma más simple. La antena todavía no tiene su nivel de presentación: se elige al transponer los niveles.

| Niveles | Qué suma | Contrarreloj | Cierre |
|---|---|---|---|
| 1 a 5 | Lo básico: el intercambio (1), el rayo (2), la sobrecarga (4) y la batería (5) | 5 | — |
| 6 a 10 | El capacitor cerámico, sexto componente (6) | 9 | 10: tres pedidos a la vez |
| 11 a 15 | Pads de cobre (11), con dos pasadas (13) | 14 | 15: pads chicos de doble pasada |
| 16 a 20 | Quemados (16), cinta kapton (17), quemados de dos golpes y huecos (18) | 19 | 20: quemados, cinta y pads |
| 21 a 25 | Válvulas que bajan al zócalo (21) | 24 | 25: cuatro válvulas y pads |
| 26 a 30 | El cristal de cuarzo, séptimo componente (26), y todo junto | 28 | 30: pads, quemados y válvulas |

Hay 24 niveles por movimientos y 6 contrarreloj. Los de puntaje son el 1, 2, 5, 8, 24 y 28; el resto pide piezas, pads, quemados, cinta o válvulas. La lista vigente vive en el código (`codigo/levels.js` y `codigo/calibrated.json`); si no coincide con esta tabla, manda el código.

### El mapa

Un camino continuo en horizontal que se recorre deslizando, con el nivel siguiente siempre a la vista: una señal medida sobre hoja milimetrada. Muestra los niveles jugados con sus estrellas y unos pocos por delante; como no hay último nivel, se va armando a medida que se avanza. Se juega el nivel siguiente o se repite uno pasado.

## Dificultad, estrellas y récords

- **Tres modos:** Fácil, Normal (el de entrada) y Difícil, que se eligen en la pantalla-instrumento.
- **La calibración es la de Difícil.** Un bot imperfecto juega 400 partidas por nivel y se eligen los movimientos, el tiempo o la meta de puntos para la tasa de victoria que pide cada nivel (`target` en `codigo/levels.js`), que baja en oleadas: de 97 % en el nivel 1 a 34 % en el 30. El bot elige la mejor jugada el 62 % de las veces, la segunda el 20 % y cualquiera el 18 %; en contrarreloj piensa entre 1,7 y 3,1 segundos por jugada.
- **Normal y Fácil** multiplican los movimientos (o el tiempo) y los puntos de cada estrella, y en los niveles de puntaje también la meta: Normal da 12 % más de movimientos y pide 10 % menos de puntos; Fácil, 30 % más y 20 % menos (`MODES` en `codigo/levels.js`).
- **Estrellas:** una por cumplir el pedido; dos y tres según el puntaje. Valen lo mismo en cualquier modo, pero cada modo guarda las suyas, y un nivel pasado en cualquier modo queda abierto en todos.
- **Récords por modo:** el nivel más alto alcanzado, que es el récord principal, y las estrellas sumadas.
- **Cómo se recalibra**, cuando cambia una regla del motor o el diseño de un nivel: `herramientas/probar.js` tiene que pasar sin errores; `herramientas/medir.js <niveles>` muestra cuánto cambió la tasa de victoria; si se apartó de lo buscado, `herramientas/calibrar.js 400 0.62 <niveles>` recalibra y actualiza `codigo/calibrated.json`, y `herramientas/modos.js 100 <niveles>` muestra cómo quedan Normal y Fácil. Los cambios se cuentan en el pull request y, si importan, en el registro de decisiones.

## Reglas

### Componentes

En orden de aparición: resistencia, capacitor electrolítico, LED, bobina toroidal y chip desde el nivel 1; capacitor cerámico desde el 6; cristal de cuarzo desde el 26.

### Cómo se juega

Se desliza una pieza hacia su vecina, o se toca una y después la otra. Si quedan tres o más iguales en línea, o cuatro en un cuadrado de 2 × 2, se eliminan y caen piezas nuevas. Hay que cumplir el pedido del nivel antes de quedarse sin movimientos o sin tiempo. Los niveles de puntaje se juegan hasta el final; los de pedido terminan al cumplirlo.

### Especiales

- **Rayo** (4 en línea): barre la fila o la columna que marcan las flechas, perpendicular a la línea que lo armó: cuatro en vertical dan un rayo que barre la fila.
- **Sobrecarga** (línea en L o en T): explota en rombo, con radio 2.
- **Batería** (5 en línea): intercambiada con un componente, elimina todos los de ese tipo; tocada, los del tipo que más hay.
- **Antena** (cuadrado de 2 × 2): rompe sus cuatro vecinas y transmite a un blanco, que elige sola: primero lo que pide el nivel (quemados, cinta, pads), después piezas de un color del pedido, después la pieza que está debajo de una válvula y, si no, una al azar.

Si una jugada forma más de un especial, gana el de mayor rango: batería > sobrecarga > rayo > antena. Los especiales se activan al eliminarlos en una línea, cuando los alcanza otra explosión, al intercambiarlos con otro especial o **tocándolos**: el toque cuenta como un movimiento.

Combinaciones: rayo + rayo (cruz), rayo + sobrecarga (3 filas y 3 columnas), sobrecarga + sobrecarga (5 × 5), batería + especial (convierte en ese especial todo el color y lo dispara), batería + batería (toda la placa), antena + antena (tres transmisiones), antena + rayo o sobrecarga (lo lleva al blanco y lo activa ahí).

### Obstáculos y pedidos

- **Pads de cobre:** se sueldan con una línea encima o con un especial. Los de remaches necesitan dos pasadas.
- **Quemados:** no se mueven ni dejan pasar lo que cae. Se rompen con líneas al lado o con especiales; los de carcasa metálica, con dos golpes.
- **Cinta kapton:** la pieza encintada no se mueve ni deja pasar lo que cae. Se despega incluyéndola en una línea.
- **Huecos:** la placa puede tener celdas cortadas; las piezas los atraviesan al caer.
- **Válvulas:** hay que bajarlas hasta la fila de abajo, el zócalo. Bajan solo cuando desaparecen las piezas que tienen debajo, y caen siempre derecho, nunca en diagonal. Se intercambian como cualquier pieza, solo si el cambio forma una línea. La partida arranca con una, y las siguientes aparecen con las jugadas, aunque la anterior todavía esté bajando: nunca dos en la misma jugada, con al menos 3 jugadas entre una y otra y como mucho dos a la vez en la placa. Pasadas esas 3 jugadas, cada jugada tiene un 35 % de traer la siguiente; si la placa quedó sin válvulas, aparece seguro. Caen desde arriba, por una de las columnas que se rellenan en esa jugada, de preferencia distinta de la anterior y sin otra válvula, siempre en columnas sin obstáculos fijos hasta el zócalo; si no hay ninguna (nivel 29), en cualquiera, y esperan sobre el obstáculo hasta que se rompe.

### Caída

Las piezas bajan de a un casillero y las nuevas entran solo por arriba. Un lugar tapado por un quemado o una cinta se llena en diagonal, a 45°, con una pieza de una columna vecina, que se repone desde arriba. Un lugar sin camino desde arriba, ni derecho ni en diagonal, queda vacío hasta que se rompa lo que lo tapa; no se puede mover una pieza a un lugar vacío.

### Bonus

Al cumplir el pedido, cada movimiento que sobra (o cada 5 segundos) se convierte en un rayo de bonus. En los niveles de puntaje, al terminar explotan los especiales que quedaron en la placa.

### Ayuda de piezas del pedido

En los niveles que piden piezas, una parte de las piezas nuevas sale de los colores que todavía faltan: 0,14 × (tipos que faltan ÷ tipos en la mesa). Con un solo tipo pedido, la ayuda es menor. No cambia los movimientos ni el tiempo.

## Modo zen

Una placa libre, sin obstáculos, con los seis primeros componentes y todos los especiales. No hay límite de movimientos ni de tiempo: un reloj cuenta cuánto lleva la partida y el puntaje sube hasta que el jugador termina desde la pausa. Si no quedan jugadas, la placa se rebaraja sola. El encargo es optativo: un pedido de un componente, de 12 a 20 piezas, que al cumplirse suma 500 puntos y se renueva con otro componente. Se guardan dos récords, el de puntos (la mejor partida) y el de tiempo (la más larga). No da estrellas y es igual en todos los modos de dificultad. La definición está en `ZEN`, en `codigo/levels.js`.

## Sonido y guardado

- **En Fogonazo, solo música y efectos;** la lluvia es de la sala. Los volúmenes son los de toda la colección.
- **El avance** (estrellas por nivel y modo, récords del zen, dificultad elegida) vive en Chrome, en el teléfono, sin clave. Ver [la colección](../coleccion.md#guardado).

## La maqueta

Un recorrido navegable para probar en el teléfono la estructura y las imágenes vigentes, hasta que esté la partida real. No es el juego: tiene una lógica mínima propia, separada de `codigo/engine.js`. Vive en [`fogonazo/`](../../fogonazo/), en la app, y se entra desde la sala por el banco.

- **Pantalla-instrumento** (`instrumento.html`), sobre la escena del P-004: las perillas Modo y Dificultad, el mapa al tocar la pantalla en Niveles, los récords con el aviso de Chrome, el sonido (perillas que se giran arrastrando y diez LEDs que siguen al dedo, con los volúmenes de toda la colección) y el manual. El zen todavía no está.
- **Mapa** (`mapa.html`): la señal sobre hoja milimetrada, que se arrastra de costado.
- **Partida** (`partida.html`), con la distribución de S-08c: placa de 10 × 8, intercambio deslizando o tocando, líneas de tres o más, cascadas, pedido, estrellas y bonus por movimientos que sobran; al ganar, «Siguiente nivel». Pausa con «Seguir», «Empezar de nuevo» y «Volver al mapa». Sin especiales, obstáculos ni nota.
- **Sonido:** Taller suena en el instrumento y el mapa, Placa en la partida; los efectos son los de siempre (intercambio, línea que sube con la cascada, jugada inválida, ganar y perder).
- **Niveles de prueba:** cada número da una variación del mismo nivel (dos o tres pedidos de 8 a 15 piezas, de 19 a 26 movimientos), ajustada por la dificultad como en el juego.
- **Guardado:** la dificultad y las estrellas por nivel y dificultad, en Chrome (`estado.js`).
- **Cómo está hecha:** cada pantalla dibuja encima de su imagen lo que cambia. El fondo de la partida sale de `herramientas/sala/escena-banco.html` con `?v=a2&bg=1`, capturado a 915 × 412 con densidad 2,625; las piezas, de la imagen del P-003 con `herramientas/sala/piezas.py`; los especiales y obstáculos, de la del P-005 con `herramientas/sala/obstaculos.py`; la pantalla-instrumento usa la imagen del P-004 tal cual, con las medidas de la pantalla, las perillas y los LEDs tomadas sobre ella.
- **Detalle por revisar:** los rótulos «MOVIMIENTOS» y «PUNTOS» de la partida, pintados en el fondo, son legibles pero justos.

## Bocetos

| Boceto | Qué fija |
|---|---|
| [S-06a](bocetos/S-06a-fogonazo-banco.png) | La partida como el banco visto de cerca: componentes reales sobre una protoboard en el nogal, con display de LED, instrumento de aguja, etiquetas Dymo y el pedido en una ficha |
| S-08 | [a · la escena del instrumento](bocetos/S-08a-fogonazo-escena-instrumento.png), composición para la IA ([versión limpia](bocetos/S-08a-fogonazo-escena-instrumento-limpia.png), sin textos ni contenido de pantalla); [b · el mapa sobre hoja milimetrada](bocetos/S-08b-fogonazo-mapa-milimetrado.png); [c · la partida redistribuida, con la nota](bocetos/S-08c-fogonazo-partida-nota.png) |
| S-09 | Las letras al tamaño del teléfono: [a · instrumento, antes y después](bocetos/S-09a-tipografias-instrumento.jpg), [b · récords](bocetos/S-09b-tipografias-records.jpg), [c · sonido y manual como página de revista](bocetos/S-09c-sonido-y-manual.jpg). Las palabras de las perillas, un poco más chicas que en la propuesta |
| S-10 | Especiales y obstáculos en el estilo del banco: [a · especiales en la partida](bocetos/S-10a-especiales-partida.jpg), [b · obstáculos](bocetos/S-10b-obstaculos-partida.jpg), [c · lámina de detalle](bocetos/S-10c-catalogo.jpg). Después se corrigieron la batería (parada, en negro y turquesa) y la antena (sin varilla, con wifi animado) |

Montajes de los pedidos de imágenes: [las piezas con patas cortas](bocetos/P-002-montaje-cortas.png) (con su [lámina de referencia](bocetos/P-002-referencia-piezas.png)), [la escena del instrumento en el teléfono](bocetos/P-004-montaje-telefono-chatgpt.png), y [los especiales](bocetos/P-005-montaje-especiales.jpg) y [los obstáculos](bocetos/P-005-montaje-obstaculos.jpg) en la partida (con su [lámina](bocetos/P-005-referencia.png)).

## Por definir

En bocetos, antes de implementar: la pausa, el fin de nivel (ganar y perder), la partida zen, el nivel en que se presenta la antena y el ícono de la app.
