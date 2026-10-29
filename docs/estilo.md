# Guía de estilo

Las reglas vigentes de cómo se ve y cómo suena la colección. Por qué se decidió cada una y qué se descartó está en el [registro de decisiones](decisiones.md); cómo se piden y se montan las imágenes, en [imágenes](imagenes.md).

## Para todos

- **Ilustración pintada, no pixel art.** La referencia es la sala: un living de los 70 cálidos, con luz de atardecer y lámparas cálidas. Cada juego tiene su estilo, pero tiene que sentirse parte de ella.
- **La IA pinta, el código dibuja encima** lo que cambia (números, textos, estados) y lo que se anima. Lo que se anima se hace chico y simple; si la imagen ya trae algo que se va a animar, se repinta encima.
- **Los botones de volver,** abajo a la derecha: una etiqueta Dymo negra, un poco torcida, con letras blancas en Barlow Semi Condensed, de unos 132 × 34 píxeles en el teléfono en todas las pantallas. «◀ Volver» en los juegos; «Salir ▶» en la sala, con la flecha a la derecha.
- **Letras legibles en el teléfono:** nada por debajo de unos 10 píxeles reales. Las escenas se ven achicadas (la del instrumento de Fogonazo, a un 55 %), así que los tamaños se miden en píxeles del teléfono, no de la imagen.
- **Lo importante, en la franja central:** las imágenes son casi 16:9 y el teléfono en horizontal ronda 20:9, así que se recortan arriba y abajo. Lo que importa va en el 80 % central del alto.
- **Sin texto, logos ni personas** en las imágenes. Los textos los pone el código.

## La sala

- **Vista frontal** de un living de los 70 en un departamento actual con ambientación de época, al atardecer con lluvia. Luz cálida pero no exagerada. Muebles con construcción lógica: los brazos del sillón van de punta a punta y los cajones abren hacia adelante.
- **De izquierda a derecha:** el banco de electrónica de aficionado (osciloscopio, protoboard con LEDs, soldador, cajonera, lámpara articulada verde, tablero perforado, estante con manuales y una radio, banqueta); la ventana con lluvia y la ciudad, cortinas ocre, el sillón de corderoy color óxido con almohadones y una manta, la lámpara de arco sobre la mesa ratona de nogal con un mahjong en juego (estuche abierto, muro de fichas, fichas en mano, tetera y tazas) y la alfombra peluda; el equipo de audio (bafles, aparador con receiver, grabador de cinta, casetera y discos), el cuadro del arcoíris con su lámpara, la costilla de Adán, la lámpara de lava, la biblioteca con la lámpara hongo, y adelante, un puf de cuero.
- **Objetos activos:** el banco, la mesa ratona y el equipo de audio. Sin carteles, círculos ni punteados: cada uno brilla apenas, de a uno por turno, cada unos 5 segundos. Al tocarlo, un destello en una capa propia, que no interrumpe el ciclo.
- **Ambiente animado:** la lluvia afuera y las gotas que bajan por el vidrio (por detrás de la lámpara de arco), la traza del osciloscopio, los LEDs del banco, el vapor de la tetera, la cera de la lámpara de lava, el disco que gira, los vúmetros y las lámparas, que respiran apenas.
- **Los ajustes de la colección** (S-14): un rack de audio de los 70, con laterales de nogal y módulos uno sobre otro, en aluminio cepillado o negro, sin tornillos. Título en Fraunces; rótulos y textos en Barlow Semi Condensed; lecturas en IBM Plex Mono. «Sonido»: música, efectos y lluvia, cada uno con un medidor de diez LEDs (seis verdes, dos amarillos, dos rojos) y su número en un display ámbar. «Sistema», en negro: la versión en un display verde, una luz (verde al día, ámbar con versión nueva) y «Actualizar», apagado si no hay nada nuevo. «Instalar», en Chrome sin instalar, con el ícono y un botón oscuro con una lámpara ámbar. Abajo, un hueco con tapa ciega y «Listo». En pantallas bajas (Chrome con sus barras) el rack se aprieta para que «Listo» quede a la vista.
- **El paso de la sala a un juego:** un fundido corto a negro, provisorio.

## Fogonazo

- **La partida es el banco visto de cerca** (boceto S-06a, con la distribución de S-08c): componentes reales vistos desde arriba, clavados en una protoboard sobre el nogal, con la luz cálida de la lámpara.
- **Las piezas** son las del pedido P-003, con sombra suave y las patas acortadas al montarlas, como clavadas en la protoboard. Cada componente conserva su color: resistencia (naranja), capacitor electrolítico (azul), LED (rojo), bobina (verde), chip (violeta), capacitor cerámico (amarillo) y cristal de cuarzo (plateado).
- **El marcador, con objetos de época:** una etiqueta Dymo con el nivel y la dificultad, un display de LED para los movimientos, el puntaje, un instrumento de aguja con las estrellas y el pedido en una ficha escrita a máquina. Sin nombre de nivel, la columna izquierda tiene aire y el pedido es compacto.
- **Especiales y obstáculos** (S-10, con las imágenes del P-005):
  - **Rayo, sobrecarga y antena** son la pieza con una señal dibujada con código: flechas eléctricas blancas, con borde y brillo azul para que se lean sobre la protoboard clara, que se deslizan hacia donde barre; la pieza al rojo, con un halo y chispas que titilan, y un símbolo de wifi cuyos arcos se encienden por turno.
  - **Batería:** una pila de 9 V parada, en dos colores (negro y turquesa), como la conocida pila de tope cobre pero con otro par de colores.
  - **Pads de cobre**, con remaches si llevan dos pasadas, estañados al soldarse.
  - **Quemados**, carbonizados; los de dos golpes, en una cápsula metálica TO-3, que se puede agrandar en código si queda chica en la casilla.
  - **Cinta kapton**, ámbar y translúcida, dibujada con código.
  - **Válvula** de vidrio ahumado y **zócalo** octal, sobre una tira de baquelita debajo de cada columna.
  - **Huecos**, donde se ve la madera de la mesa.
- **Los efectos,** trazos de luz: los rayos que barren y la batería, relámpagos azules y blancos; la sobrecarga, un destello cálido que se expande; la antena, anillos y un pulso que viaja al blanco. Las piezas que se van destellan y sueltan chispas de su color; el estaño de los pads, un poco de humo. Los puntos de cada jugada flotan sobre la placa, en Barlow, blancos; las cascadas y los avisos, más grandes y en ámbar.
- **La nota de cuaderno:** la primera vez que aparece un componente, especial u obstáculo, junto a la placa hay una nota escrita con birome azul (Caveat) en papel cuadriculado, pegada en la mesa con un pedazo de cinta, como un recordatorio que alguien se hizo (S-08c): un título, un dibujito y una o dos frases. Entra entre la ficha del pedido y «Volver». Letra de 16,5 y título de 19,5 (S-17).
- **El contrarreloj y el zen** (S-13d): un reloj de cuatro dígitos en el mismo display, con el rótulo «TIEMPO». En el zen, el instrumento sin estrellas, con una marca de lápiz rojo y «récord» escrito a mano donde está el récord, y la ficha dice «Encargo», con «optativo · +500» en lápiz rojo.
- **La pausa** (S-13a): una placa de aluminio como la del marcador, con sus tornillos, el título en cinta Dymo y teclas de cinta Dymo; la principal, en cinta roja.
- **El fin de un nivel** (S-13b y c): una etiqueta de control de calidad de cartulina, con su ojal y sin hilo, escrita a máquina (Special Elite), con las estrellas estampadas en tinta roja, de a una, y el sello «Aprobada» en rojo o «Rechazada» en azul. En el zen, un parte de trabajo con el mismo aspecto (S-13e).
- **La pantalla-instrumento** (imagen del P-004 sobre la composición S-08a): un osciloscopio real, voluminoso, en perspectiva, con la pantalla mirando hacia adelante y una luz cónica desde arriba. La pantalla, verde fósforo con retícula, muestra; las perillas eligen (Modo: Niveles, Zen y Récords; Dificultad: Fácil, Normal y Difícil), y se tocan la palabra o la perilla, que gira. Las palabras de las perillas no rozan el borde del frente.
- **Aureolas en lo que se toca:** la placa del sonido y la revista del manual laten cada 2 segundos, una después de la otra, con un brillo más intenso que el de los objetos activos de la sala: una copia más cálida y luminosa de la escena vista a través de una forma difuminada del objeto.
- **El sonido:** una placa de pertinax de proyecto de revista de hobbista, un poco girada respecto del borde de la mesa, con potenciómetros, LEDs y el parlante conectado con cables. El panel que se abre es la misma placa de cerca (S-16): pertinax con brillo y pistas de cobre, potenciómetros con tuerca y perilla moleteada, LEDs de 5 mm, una resistencia arriba, dos separadas entre las tiras de LEDs, dos juntas abajo, el integrado y dos electrolíticos azules; las letras, casi negras. En los ajustes, las perillas giran con el dedo en círculo (27° por paso, lo mismo que gira el indicador) y una fila de diez LEDs verdes, amarillos y rojos sigue al dedo; tocar el primero cuando está solo apaga el canal. Los LEDs de la placa de la escena muestran los volúmenes.
- **El manual:** una revista de hobbista pegada con cinta en la pared del banco, un poco torcida: papel envejecido, título, bajada, dos columnas en serif y una foto en sepia con trama. Dos hojas (S-15): la 34, cómo se juega; la 35, las piezas especiales y un «Truco de taller» con las combinaciones. Un triangulito rojo en un círculo pasa de hoja; «Cerrar» va a la derecha de la revista, sin pisar «Volver». El texto, con la voz amena de una revista de aficionados de los 70.
- **El mapa:** una señal medida sobre hoja milimetrada, una onda con una pequeña modulación encima (S-08b). Los niveles son puntos medidos sobre ella: lo jugado en tinta, con sus estrellas; lo que viene, en lápiz. Se arrastra de costado.
- **Tipografías** (S-09): IBM Plex Mono SemiBold en la pantalla del osciloscopio, con un brillo simple; Barlow Semi Condensed en perillas, sonido, botones y marcador; PT Serif en el manual; Special Elite en la ficha del pedido; Caveat en lo escrito a mano del mapa.

## El mahjong

Por ahora conserva la estética de Kasa; si se acerca a la de la sala está por decidir.

- La paleta verde papel y tinta azul, bordes gruesos con sombra sólida, Zen Kaku Gothic New y Shippori Mincho. Solo tema claro.
- Las fichas se dibujan con código, porque cada una pide una cantidad exacta de círculos o bambúes y su ideograma correcto: los círculos y los bambúes se dibujan (el uno de bambú es el pajarito tradicional); los caracteres, los vientos y los dragones llevan su ideograma; las flores y las estaciones, su ideograma y un dibujito.

## Sonido

Todo se sintetiza en el navegador, sin archivos de audio, con `comun/sonido.js`. Los volúmenes son los mismos para toda la colección (ver [la colección](coleccion.md#sonido)).

- **La sala:** una lluvia leve escuchada desde adentro, detrás del vidrio: un colchón de ruido rosa grave y apagado y unas 34 gotitas por segundo, cortas y apagadas, que pegan en el vidrio al azar y repartidas en el estéreo. Sin música por ahora (ver [decisiones](decisiones.md)).
- **Fogonazo:** el sonido de siempre, el mismo del juego publicado. Cuatro temas: **Placa**, el original, en los niveles por movimientos (la menor, Am F C G, 104 ppm); **Taller**, fuera de la partida (do mayor, C G Am F, arpegio a corcheas, 92 ppm); **Urgente**, en el contrarreloj (la menor con final en mi mayor, Am F Dm E, 144 ppm), y **Siesta**, en el zen (fa mayor, Fmaj7 Em7 Dm7 C, 104 ppm). Bajo cuadrado, arpegio triangular, hi-hats de ruido y una melodía cuadrada que entra cada dos vueltas en Placa y Taller. Siesta usa instrumentos suaves (bajo triangular, arpegio de pulso fino y melodía de pulso al 25 %) y va unos 2 dB por debajo de Placa. La música baja al terminar un nivel para que se escuche la fanfarria.
- **El mahjong:** las canciones de Fogonazo como primas orientales, que se note que son de la misma familia: mismo tempo, ritmo, acordes y bajo, con la melodía en do pentatónica mayor (fa y si pasan a la nota vecina). Koto, flauta tipo dizi, bloque de madera y tamborcito de mano, con un glissando de koto al cerrar la vuelta sin melodía. Siesta en la partida, Taller en el inicio y Placa para elegir. Los efectos también son primos: el sonido de línea, tocado con koto, sube con la cadena igual que en Fogonazo.

## Textos

Amenos, en voseo rioplatense, sin errores ni redundancias. En Fogonazo, la electrónica es de verdad: componentes y explicaciones técnicamente correctos.
