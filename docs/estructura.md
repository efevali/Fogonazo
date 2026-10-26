# Estructura de Fogonazo en la colección

Aprobada por Producto el 26/10. Define cómo se organiza el juego dentro de la colección: el recorrido de pantallas, los niveles, la dificultad, los récords, el sonido y el guardado. No define cómo se ve cada pantalla (eso viene en los bocetos) ni cambia las reglas del juego, los especiales ni los obstáculos del [manifiesto](manifiesto.md).

## Recorrido

```
Sala ── banco de electrónica ──► Fogonazo (pantalla-instrumento)
                                    ├── Niveles ──► mapa continuo ──► partida
                                    ├── Zen ──────────────────────► partida
                                    ├── Dificultad, récords, manual
                                    └── Sonido (el parlante)
```

- **El «atrás» de Android** desanda el camino: de la partida a la pausa; de la pausa al mapa (o a Fogonazo, si era zen); del mapa a Fogonazo; de Fogonazo a la sala, y de la sala sale de la aplicación. Es la lógica de Kasa que ya usa Fogonazo, con un escalón más.
- **Se entra directo al juego.** No hay pantalla de título de Fogonazo aparte de la pantalla-instrumento.

## La pantalla-instrumento

La pantalla propia de Fogonazo. Es un instrumento del banco visto de cerca: parece parte del escritorio de trabajo, aunque no sea fiel a la imagen de la sala. Reemplaza al mapa actual como portada del juego y a la pantalla de Ajustes.

- **Idea de partida:** la pantalla de un osciloscopio (verde fósforo, retícula) muestra; las perillas de su frente eligen. Por ejemplo, un selector rotativo como el de un multímetro para pasar entre Niveles, Zen y Récords.
- **Contenido:** entrar a los niveles (con el nivel siguiente a la vista), entrar al zen, elegir la dificultad, ver los récords, abrir el manual y el sonido.
- **Sonido:** un circuito a medio armar con un parlante conectado por cables a la placa. Al tocarlo se abren los ajustes, con un vúmetro de LEDs verdes, amarillos y rojos que se encienden al subir cada volumen.
- **A decidir en el boceto:** qué instrumento exactamente y cómo se reparten las opciones entre pantalla y perillas.

## Niveles: un camino continuo

Los niveles son una sola secuencia numerada, sin capítulos ni títulos, como en Candy Crush.

- **Sin nombres ni textos por nivel.** Se quitan el nombre de circuito real y el texto de presentación que hoy tiene cada nivel. El sabor de «electrónica de verdad» queda en las piezas, el escritorio y el manual.
- **Del 1 al 30, a mano.** Son los 30 niveles actuales, transpuestos de 8 × 10 a 10 × 8 y recalibrados. Conservan su progresión: enseñan cada componente, especial y obstáculo en orden, con las oleadas de dificultad.
- **Del 31 en adelante, generados.** Cada nivel sale de su número, que fija una semilla y su lugar en la curva de dificultad, así que el nivel 57 es siempre el mismo para cualquiera y reintentarlo es jugar el mismo nivel. No hay último nivel. No traen mecánicas nuevas: combinan lo que ya existe (tipo de pedido, obstáculos, forma de la placa y huecos, movimientos o contrarreloj).
- **La curva** sigue en oleadas: tramos exigentes y respiros. Crece de a poco hasta una meseta cercana a la dificultad de los niveles 26 a 30, para que nunca se vuelva imposible.
- **Calibración:** las reglas del generador se ajustan con el bot en la computadora, hasta que los niveles generados ganen en una proporción parecida a los hechos a mano. El teléfono no simula nada.
- **Agregar niveles a mano** más adelante es insertar uno en la lista; los generados se corren detrás.
- **Novedades:** cada componente, especial u obstáculo aparece por primera vez en un nivel puntual. Esa primera vez, junto a la placa hay una nota de cuaderno escrita con birome y pegada en la mesa, como un recordatorio que alguien se hizo, que explica el movimiento de la forma más simple. Reemplaza la idea del nivel 1 como tutorial guiado y el criterio anterior de descubrir la antena sin aviso.
- **Contrarreloj:** como en los 30 hechos a mano, uno de cada cinco niveles generados.

### El mapa

Un camino continuo en horizontal que se recorre deslizando, con el nivel siguiente siempre a la vista. Muestra los niveles jugados con sus estrellas y unos pocos por delante; como no hay último nivel, se va armando a medida que se avanza. Su aspecto queda para los bocetos.

## Dificultad, estrellas y récords

- **Los tres modos siguen:** Fácil, Normal (el de entrada) y Difícil, con los mismos ajustes de movimientos y puntos sobre la calibración de Difícil. Se eligen en la pantalla-instrumento.
- **Estrellas:** como hoy, valen lo mismo en cualquier modo; cada modo guarda las suyas y un nivel pasado en cualquier modo queda abierto en todos.
- **Récords por modo:** estrellas sumadas y nivel más alto alcanzado. Con niveles sin fin, el nivel más alto pasa a ser el récord principal.
- **Zen:** sin cambios. Récords de puntos y de tiempo, igual en todos los modos.

## Sonido

- **Un solo juego de volúmenes para toda la colección**, guardado en un lugar. El equipo de audio de la sala y el parlante de Fogonazo leen y escriben los mismos valores: lo que se cambia en uno ya está cambiado en el otro.
- **En Fogonazo, solo música y efectos.**
- **La lluvia es del ambiente:** suena en la sala, se apaga al entrar a un juego y vuelve al volver a la sala.

## Guardado

- **El avance actual no se conserva.** La colección arranca con un guardado nuevo y no hay migración.
- **Sin clave de guardado.** Se quitan el código FCKGW y la pantalla «Progreso». Con varios juegos en la colección, resguardar el avance es un tema propio que se verá más adelante.
- **El avance vive solo en Chrome, en el teléfono.** Un aviso breve lo dice en los récords de la pantalla-instrumento, que es donde importa saber que se puede perder. Si más adelante la sala tiene un lugar para lo común a todos los juegos, el aviso se muda ahí.

## Lo que queda para después

El aspecto del mapa y de la pantalla-instrumento, los especiales y obstáculos en el estilo del banco, el fin de nivel y la pausa, el manual y la intro del tipito de guardapolvo. Se definen después de aprobar esta estructura, de lo general a lo particular.
