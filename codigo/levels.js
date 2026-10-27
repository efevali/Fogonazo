/* Fogonazo — los niveles hechos a mano, del 1 al 30, en la placa de 10 × 8 (10 columnas por 8 filas).
   Un solo camino, sin nombres ni textos por nivel: el sabor de electrónica de verdad está en las piezas, el banco
   y el manual. Del 31 en adelante, los niveles se generan (ver docs/fogonazo/README.md).
   Colores: 0 resistencia · 1 capacitor electrolítico · 2 LED · 3 bobina · 4 chip · 5 capacitor cerámico · 6 cristal
   Layout: hasta 8 filas de 10; '.' normal · 'x' hueco · '1'/'2' pad sin soldar (capas) · 'b'/'B' quemado (1/2 golpes) ·
   'k' cinta kapton · 'q' kapton sobre pad. Un diseño con menos filas se completa con filas libres arriba.
   tip: lo que el nivel presenta por primera vez (la nota de cuaderno junto a la placa).
   target = tasa de victoria buscada para el bot de calibración.
   tune: qué se calibra ('moves' | 'time' | 'score'). */
(function (root) {
const LEVELS = [
  // ---------------- 1 a 5 · lo básico
  { colors: 5, moves: 18, goals: [{ type: 'score', n: 0 }], tune: 'score', target: 0.97, tip: 'swap' },
  { colors: 5, moves: 20, goals: [{ type: 'score', n: 0 }], tune: 'score', target: 0.95, tip: 'line' },
  { colors: 5, moves: 20, goals: [{ type: 'collect', color: 0, n: 40 }, { type: 'collect', color: 1, n: 40 }], tune: 'moves', target: 0.92, tip: 'antenna' },
  { colors: 5, moves: 20, goals: [{ type: 'collect', color: 2, n: 50 }], tune: 'moves', target: 0.87, tip: 'bomb' },
  { colors: 5, time: 60, goals: [{ type: 'score', n: 0 }], tune: 'score', target: 0.82, tip: 'battery' },

  // ---------------- 6 a 10 · el capacitor cerámico; cierra con tres pedidos a la vez
  { colors: 6, moves: 20, goals: [{ type: 'collect', color: 4, n: 34 }], tune: 'moves', target: 0.9, tip: 'color6' },
  { colors: 6, moves: 22, goals: [{ type: 'collect', color: 5, n: 28 }, { type: 'collect', color: 1, n: 28 }], tune: 'moves', target: 0.83 },
  { colors: 6, moves: 22, goals: [{ type: 'score', n: 0 }], tune: 'score', target: 0.76 },
  { colors: 6, time: 90, goals: [{ type: 'collect', color: 2, n: 32 }], tune: 'time', target: 0.82 },
  { colors: 6, moves: 30, goals: [{ type: 'collect', color: 3, n: 28 }, { type: 'collect', color: 2, n: 28 }, { type: 'collect', color: 1, n: 28 }], tune: 'moves', target: 0.74 },

  // ---------------- 11 a 15 · pads de cobre, de una y de dos pasadas; cierra con pads chicos de doble pasada
  { colors: 5, moves: 20, goals: [{ type: 'pads' }], tune: 'moves', target: 0.88, tip: 'pads',
    layout: ['..........', '..........', '..111111..', '..111111..', '..111111..', '..111111..', '..........', '..........'] },
  { colors: 6, moves: 22, goals: [{ type: 'pads' }], tune: 'moves', target: 0.8,
    layout: ['..........', '.1.1.1.1..', '..1.1.1.1.', '.1.1.1.1..', '..1.1.1.1.', '.1.1.1.1..', '..1.1.1.1.', '..........'] },
  { colors: 6, moves: 24, goals: [{ type: 'pads' }], tune: 'moves', target: 0.72, tip: 'pads2',
    layout: ['..........', '.11111111.', '.12222221.', '.12....21.', '.12....21.', '.12222221.', '.11111111.', '..........'] },
  { colors: 6, time: 120, goals: [{ type: 'pads' }], tune: 'time', target: 0.65,
    layout: ['..........', '..111111..', '..........', '..111111..', '..........', '..111111..', '..........', '..........'] },
  { colors: 6, moves: 28, goals: [{ type: 'pads' }], tune: 'moves', target: 0.55,
    layout: ['..........', '.22....22.', '...2..2...', '...2..2...', '...2..2...', '...2..2...', '.22....22.', '..........'] },

  // ---------------- 16 a 20 · quemados, cinta y huecos; cierra con quemados, cinta y pads
  { colors: 5, moves: 22, goals: [{ type: 'burnt' }], tune: 'moves', target: 0.82, tip: 'burnt',
    layout: ['..........', '....bb....', '...b..b...', '..b.BB.b..', '.bB.bb.Bb.', '..b.bb.b..', '..........', '..........'] },
  { colors: 6, moves: 22, goals: [{ type: 'locks' }], tune: 'moves', target: 0.74, tip: 'locks',
    layout: ['..........', '..k.k.k...', '...k.k.k..', '..k.k.k...', '...k.k.k..', '..k.k.k...', '...k.k.k..', '..........'] },
  { colors: 6, moves: 26, goals: [{ type: 'burnt' }], tune: 'moves', target: 0.66, tip: 'burnt2',
    layout: ['xx......xx', 'x........x', '...BBBB...', '..B....B..', '..B....B..', '...BBBB...', 'x........x', 'xx......xx'] },
  { colors: 6, time: 120, goals: [{ type: 'burnt' }], tune: 'time', target: 0.58,
    layout: ['..........', '..........', '.bb.bb.bb.', '..........', '.bb.bb.bb.', '..........', '.bb.bb.bb.', '..........'] },
  { colors: 6, moves: 30, goals: [{ type: 'burnt' }, { type: 'pads' }], tune: 'moves', target: 0.5,
    layout: ['..........', '..k.kk.k..', '...BBBB...', '..11BB11..', '..11..11..', '...bbbb...', '..k.kk.k..', '..........'] },

  // ---------------- 21 a 25 · válvulas que bajan al zócalo; cierra con cuatro válvulas y pads
  { colors: 5, moves: 20, goals: [{ type: 'tubes', n: 3 }], tubes: { n: 3, max: 2 }, tune: 'moves', target: 0.76, tip: 'tubes' },
  { colors: 5, moves: 26, goals: [{ type: 'tubes', n: 5 }], tubes: { n: 5, max: 2 }, tune: 'moves', target: 0.66,
    layout: ['..........', '..........', '..........', '....xx....', '....xx....', '..........', '..........', '..........'] },
  { colors: 5, moves: 26, goals: [{ type: 'tubes', n: 4 }, { type: 'collect', color: 3, n: 28 }], tubes: { n: 4, max: 2 }, tune: 'moves', target: 0.58 },
  { colors: 6, time: 75, goals: [{ type: 'score', n: 0 }], tune: 'score', target: 0.52 },
  { colors: 5, moves: 30, goals: [{ type: 'tubes', n: 5 }, { type: 'pads' }], tubes: { n: 5, max: 2 }, tune: 'moves', target: 0.46,
    layout: ['..........', '..........', '..........', '..........', '..111111..', '..111111..', '..........', '..........'] },

  // ---------------- 26 a 30 · el cristal de cuarzo y todo junto; el 30 se gana en unos pocos intentos
  { colors: 7, moves: 26, goals: [{ type: 'collect', color: 6, n: 26 }, { type: 'collect', color: 4, n: 26 }], tune: 'moves', target: 0.6, tip: 'color7' },
  { colors: 6, moves: 28, goals: [{ type: 'pads' }], tune: 'moves', target: 0.52,
    layout: ['..222222..', '.2......2.', '.2......2.', '..111111..', '.2......2.', '.2......2.', '..222222..', '..........'] },
  { colors: 7, time: 90, goals: [{ type: 'score', n: 0 }], tune: 'score', target: 0.45 },
  { colors: 5, moves: 30, goals: [{ type: 'burnt' }, { type: 'locks' }, { type: 'tubes', n: 3 }], tubes: { n: 3, max: 2 }, tune: 'moves', target: 0.4,
    layout: ['..........', '..........', '..........', '.b.b..b.b.', '..k.kk.k..', '..........', '..........', '..........'] },
  { colors: 5, moves: 32, goals: [{ type: 'pads' }, { type: 'burnt' }, { type: 'tubes', n: 3 }], tubes: { n: 3, max: 2 }, tune: 'moves', target: 0.34,
    layout: ['..........', '..2.BB.2..', '..2....2..', '....11....', '....11....', '..2....2..', '..2.bb.2..', '..........'] },
];

// Para las herramientas: qué pide un nivel, en pocas palabras (antes lo decía su nombre)
const PIDE = { score: 'puntaje', collect: 'piezas', pads: 'pads', burnt: 'quemados', locks: 'cinta', tubes: 'válvulas' };
function resumen(L) {
  const tipos = [...new Set(L.goals.map(g => PIDE[g.type]))].join(' + ');
  return (L.time ? '⏱ ' : '') + tipos;
}

/* Modo zen (#19): una partida sin límite de movimientos ni de tiempo, en la placa libre, con los seis primeros
   componentes. El encargo es optativo: al completarlo suma `bonus` puntos y el motor pide otro (Engine.zenOrder),
   de otro componente y con una cantidad entre `min` y `max`, de a `step`. No da estrellas. */
const ZEN = { name: 'Libre', colors: 6, zen: true, goals: [{ type: 'collect', color: 2, n: 15 }],
  order: { bonus: 500, min: 12, max: 20, step: 2 } };

/* Modos de dificultad (la perilla «Dificultad» de la pantalla-instrumento). La estrella vale lo mismo en cualquier modo; cada modo guarda sus propios
   récords. Difícil es la calibración de calibrated.json tal cual; los otros dos multiplican los movimientos
   (o el tiempo) y los umbrales de estrellas. Se miden con herramientas/modos.js. */
const MODES = [
  { id: 'facil', name: 'Fácil', moves: 1.3, stars: 0.8 },
  { id: 'normal', name: 'Normal', moves: 1.12, stars: 0.9 },
  { id: 'dificil', name: 'Difícil', moves: 1, stars: 1 },
];
const modeOf = id => MODES.find(m => m.id === id) || MODES[1];
// Aplica un modo a la definición calibrada de un nivel (d.moves o d.time, d.stars y, si se juega por puntaje, la meta).
function applyMode(d, M) {
  const r50 = v => { const st = v > 20000 ? 500 : 100; return Math.max(st, Math.round(v / st) * st); };
  if (M.moves !== 1) { if (d.time) d.time = Math.round(d.time * M.moves); else d.moves = Math.round(d.moves * M.moves); }
  if (M.stars !== 1) {
    d.stars = d.stars.map((v, k) => k ? r50(v * M.stars) : v);
    if (d.tune === 'score') { d.goals[0].n = r50(d.goals[0].n * M.stars); d.stars[0] = d.goals[0].n; }
  }
  d.mode = M.id;
  return d;
}

if (typeof module !== 'undefined' && module.exports) module.exports = { LEVELS, ZEN, MODES, modeOf, applyMode, resumen };
else { root.LEVELS = LEVELS; root.ZEN = ZEN; root.MODES = MODES; root.modeOf = modeOf; root.applyMode = applyMode; root.resumen = resumen; }
})(typeof window !== 'undefined' ? window : this);
