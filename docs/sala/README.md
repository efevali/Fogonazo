# La sala

La pantalla de inicio de la colección: un living de los 70 ilustrado donde algunos objetos, los objetos activos, llevan a los juegos. Cómo se ve está en la [guía de estilo](../estilo.md#la-sala); por qué es así, en el [registro de decisiones](../decisiones.md#la-sala).

## Estado

- **Imagen base vigente:** [`arte/sala-v2.png`](arte/sala-v2.png), de 2752 × 1536, generada con Gemini. Vista frontal, al atardecer con lluvia.
- **Prototipo:** [`prototipo/`](prototipo/index.html), que se abre en Chrome en https://efevali.github.io/fogonazo/docs/sala/prototipo/. Producto lo probó en el teléfono: los objetos activos se ven bien, y «tiene aspecto de juego profesional».

## Qué hace el prototipo

- **Tres objetos activos**, que brillan apenas por turno:
  - **El banco de electrónica** lleva a la [maqueta de Fogonazo](maqueta-fogonazo/instrumento.html), que vuelve con «◀ Sala».
  - **La mesa ratona con el mahjong** abre una tarjeta «próximamente» con aspecto de estuche de paño rojo.
  - **El equipo de audio** abre el sonido, un panel con aspecto de frente de receiver, con música, efectos y lluvia. La lluvia suena de verdad; música y efectos todavía no están conectados.
- **El ambiente animado** de la [guía de estilo](../estilo.md#la-sala).
- **Herramientas de prueba:** un botón muestra las zonas táctiles; otro pone pantalla completa y bloquea en horizontal donde el navegador lo permite. En vertical se ve la sala entera, achicada.

## Archivos

| Carpeta | Qué hay |
|---|---|
| [`arte/`](arte/) | La imagen base vigente, en la resolución original. |
| [`bocetos/`](bocetos/) | Los bocetos de la sala y de lo común de la colección (ver abajo). |
| [`prototipo/`](prototipo/) | La página, la imagen base para la web, una copia aclarada para el brillo de los objetos activos y las máscaras de cada objeto activo y de la ventana. |
| [`maqueta-fogonazo/`](maqueta-fogonazo/instrumento.html) | La maqueta de Fogonazo, que se cuenta en [su documentación](../fogonazo/README.md#la-maqueta). Vive acá para que la sala la abra directamente. |

### Bocetos

| Boceto | Qué es | Estado |
|---|---|---|
| [S-05](bocetos/S-05-composicion-sala.jpg) | La composición de la sala completa que se le pasó a la IA | Vigente como guía para futuras ediciones de la imagen |
| S-11 | Los ajustes de la colección en el panel del equipo de audio, para la 0.1.0: sonido (música, efectos y lluvia, de 0 a 10) e instalar. [En Chrome, sin instalar](bocetos/S-11-ajustes-en-chrome.jpg), [instalada](bocetos/S-11-ajustes-instalada.jpg) y [los pasos para instalar](bocetos/S-11-instalar-pasos.jpg). El ícono de la fila «Instalar» es el provisorio. Se genera con [`herramientas/sala/boceto-s11.html`](../../herramientas/sala/boceto-s11.html) | Aprobado (27/10) |

Las referencias de estilo de terceros (ilustraciones isométricas, fotos de livings de época, el recorte de revista) no se guardan en este repositorio, que es público.

## Notas técnicas

- **Coordenadas:** las zonas táctiles y las animaciones están en el sistema de 2576 × 1438 de la primera descarga de la imagen; la imagen en alta se dibuja escalada en ese mismo recuadro y coincide sin corrimientos (se verificó).
- **Si la imagen cambia,** se pide un cambio puntual sobre ella (ver [imágenes](../imagenes.md#cómo-se-pide)), para no tener que volver a medir.
- **El brillo de cada objeto activo** va en una capa propia, separada del destello del toque, para que el ciclo de aviso no se interrumpa.

## Por definir

- La transición de la sala a cada juego. Para la 0.1.0, un fundido corto, provisorio.
- Dónde se muestran la versión y el aviso de versión nueva. En el panel del equipo de audio, no (27/10).
- La música de la sala, si la tiene.
- Los menús, y la sala como juego de buscar y encontrar.
