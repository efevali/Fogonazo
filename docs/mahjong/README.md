# Mahjong

El segundo juego de la colección: mahjong solitario. Por ahora es un prototipo para evaluar la idea, todavía en vertical, sin issues ni versión. Cómo se ve y cómo suena está en la [guía de estilo](../estilo.md#el-mahjong); por qué es así, en el [registro de decisiones](../decisiones.md#el-mahjong).

- **Prototipo:** [prototipo.html](prototipo.html), que se abre en Chrome en https://efevali.github.io/fogonazo/docs/mahjong/prototipo.html. Es la misma página que el artefacto «Mahjong zen» de claude.ai (versión 3, 24/10/2026).

## Qué tiene el prototipo

- Mahjong solitario: se juntan pares de fichas iguales que estén libres (sin otra encima y con un costado despejado). Flores con flores y estaciones con estaciones.
- La estética de Kasa, solo en tema claro, con las 42 fichas dibujadas. El muestrario completo se abre desde «Las fichas».
- Modo zen: cuatro tableros que rotan (Pirámide, Tortuga, Mariposa y Castillo, de 52 a 64 fichas), repartidos siempre con solución y rebarajados solos si no quedan pares libres. Guarda el mejor puntaje y el mayor tiempo.
- Deshacer, Pista y Barajar, sin límite.
- Sonido: efectos y canciones primas de los de Fogonazo (Siesta en la partida, Taller en el inicio, Placa elegible). En Ajustes, «Escuchar la original de Fogonazo» pasa a los temas de Fogonazo tal cual, para comparar.

## Por revisar jugando

- El puntaje es una propuesta de Desarrollo que todavía no se revisó: 10 por par, cadena que multiplica hasta ×5 si el par siguiente llega antes de 5 segundos, 100 por tablero limpio. Deshacer, Pista y Barajar cortan la cadena.
- El carácter de la música después del cambio a acordes originales y flauta tipo dizi, y el balance de volúmenes en el teléfono.
- El tamaño de las fichas con los tableros chicos.

## Lo que sigue

- **Pasar a horizontal**, como toda la colección (referencia: el boceto [S-03e](bocetos/S-03e-mahjong-horizontal.png), que no se aprobó como diseño final). En horizontal entra la tortuga clásica de 144 fichas.
- **Se abre desde la mesa ratona** de [la sala](../sala/README.md).
- Falta decidir si el mahjong conserva la estética de Kasa o se acerca a la de la sala.
- El nombre del juego, sin decidir.

## Notas técnicas

- Es una sola página autocontenida. Toma las tipografías de Google Fonts (Zen Kaku Gothic New y Shippori Mincho, las de Kasa).
- Guarda ajustes y récords en el navegador con claves `mjzen.*`, que no se cruzan con las de Fogonazo ni las de Kasa en `efevali.github.io`.
- El sonido usa el motor de `codigo/audio.js` de Fogonazo: las mismas voces básicas, más koto, flauta, bloque de madera, campana y tamborcito. Incluye los temas originales de Fogonazo sin cambios, solo para comparar.
- Los tableros se definen por capas en medias fichas, y el reparto quita pares libres al azar desde el tablero lleno, así que el orden inverso siempre tiene solución.
- El primer boceto, M-01, fue un dibujo en la conversación y lo reemplazó este prototipo.
