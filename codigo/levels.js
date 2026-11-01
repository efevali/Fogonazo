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

/* ---------------- del 31 en adelante, los generados
   Cada nivel sale de su número: fija una semilla y su lugar en la curva, así que el 57 es siempre el mismo.
   La cuenta empieza después del último hecho a mano (g = 1 es el primer generado): si se suma un nivel a mano,
   los generados se corren detrás. Bloques de cinco, como del 1 al 30: arrancan amables y cierran exigentes; el
   cuarto es contrarreloj y el quinto, el cierre, junta dos o tres pedidos. Uno de cada dos bloques es un respiro.
   No hay calibración por nivel: los movimientos, el tiempo, la meta de puntos y las estrellas salen de una fórmula
   (GEN), ajustada con el bot sobre una muestra de generados (herramientas/generados.js). Algunos niveles salen más
   fáciles o más difíciles de lo buscado; ninguno, imposible: los diseños que el bot no podía terminar se sacaron. */
const GEN = {
  // tasa de victoria buscada en la meseta, por posición en el bloque; el respiro y la rampa inicial la suben
  meseta: [0.62, 0.56, 0.5, 0.45, 0.38], respiro: 0.08, rampa: 0.06, rampaBloques: 4,
  // movimientos medianos para terminar = colores × (base + el pedido más largo + juntos × los demás), con el costo
  // de cada pedido = costo × cantidad (piezas a juntar escaladas por colores / 6, celdas de pad por capa, golpes a
  // quemados, cintas, válvulas): los pedidos combinados avanzan a la vez. Ajustado con herramientas/generados.js.
  costo: { base: 8.1, piezas: 0.27, pads: 0.32, golpes: 0.11, cintas: 0.84, valvulas: 2.16 }, juntos: 0.12, seguidas: 0.93, golpesConValvulas: 2.4,
  colores: { 5: 1, 6: 1, 7: 1.85 },
  // movimientos para una tasa t = mediana × razon(t), interpolado
  razon: [[0.3, 0.85], [0.4, 0.93], [0.5, 1], [0.6, 1.07], [0.7, 1.19], [0.8, 1.28], [0.9, 1.44]],
  segundosPorJugada: 3.5,
  // puntos: por jugada (meta de los niveles de puntaje) y estrellas como múltiplos de la mediana de los ganadores
  puntosPorJugada: { 5: 630, 6: 420, 7: 270 }, razonPuntos: [[0.3, 1.23], [0.5, 1], [0.7, 0.84], [0.9, 0.67]],
  // estrellas de los niveles con pedido: la segunda, la mediana de los puntos de quien gana; la tercera, × 1,35
  estrellaPorJugada: { 5: 1100, 6: 550, 7: 280 }, estrellaPorValvula: 0, terceraEstrella: 1.35,
  // estrellas de los de puntaje, como múltiplos de la meta: la mediana de los puntos de quien gana y el 86 %
  estrellasPuntaje: [1.43, 1.67],
};
const r01 = seed => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const interp = (tab, x) => { if (x <= tab[0][0]) return tab[0][1]; for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) { const [a, b] = tab[i - 1], [c, d] = tab[i]; return b + (d - b) * (x - a) / (c - a); } return tab[tab.length - 1][1]; };

function targetOf(g) {
  const k = Math.floor((g - 1) / 5), p = (g - 1) % 5;
  const t = GEN.meseta[p] + (k % 2 === 0 ? GEN.respiro : 0) + Math.max(0, GEN.rampa * (1 - k / GEN.rampaBloques));
  return Math.round(t * 100) / 100;
}

// Lo que pide cada bloque, por posición. Tres pedidos simples distintos, el contrarreloj y el cierre con dos o tres.
const SIMPLES = ['collect', 'pads', 'burnt', 'locks', 'tubes'], RELOJ = ['score', 'collect', 'pads', 'burnt'];
function blockPlan(k) {
  const R = r01(9973 * (k + 1) + 17), pick = a => a[(R() * a.length) | 0];
  const pool = SIMPLES.slice();
  for (let i = pool.length - 1; i > 0; i--) { const j = (R() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const tres = pool.slice(0, 3);
  if (R() < 0.25) tres[1] = 'score';                       // de vez en cuando, uno de puntaje
  const reloj = pick(RELOJ.filter(t => t !== tres[2]));
  const resto = SIMPLES.filter(t => t !== reloj);
  const a = pick(resto), b = pick(resto.filter(t => t !== a));
  const cierre = [a, b];
  if (k >= 3 && R() < 0.35) cierre.push(pick(resto.filter(t => !cierre.includes(t) && t !== 'collect')));
  return [[tres[0]], [tres[1]], [tres[2]], [reloj], cierre];
}

// ---- diseños de placa: se dibuja la mitad izquierda (columnas 0 a 4) y se refleja
function blankGrid() { return Array.from({ length: 8 }, () => Array(10).fill('.')); }
function put(G, r, c, ch) { G[r][c] = ch; G[r][9 - c] = ch; }
const free = (G, r, c) => G[r][c] === '.';
// formas para la mitad izquierda: listas de [fila, columna]; los pads nunca en la fila de abajo ni en las esquinas
const FORMAS = {
  bloque: (R, f0, f1) => { const c0 = 1 + ((R() * 2) | 0), out = []; for (let r = f0; r <= f1; r++) for (let c = c0; c <= 4; c++) out.push([r, c]); return out; },
  anillo: (R, f0, f1) => { const c0 = 1 + ((R() * 2) | 0), out = []; for (let r = f0; r <= f1; r++) for (let c = c0; c <= 4; c++) if (r === f0 || r === f1 || c === c0) out.push([r, c]); return out; },
  rayas: (R, f0, f1) => { const c0 = 1 + ((R() * 2) | 0), out = []; for (let r = f0; r <= f1; r += 2) for (let c = c0; c <= 4; c++) out.push([r, c]); return out; },
  ajedrez: (R, f0, f1) => { const o = (R() * 2) | 0, out = []; for (let r = f0; r <= f1; r++) for (let c = 1; c <= 4; c++) if ((r + c + o) % 2 === 0) out.push([r, c]); return out; },
  columnas: (R, f0, f1) => { const cs = R() < 0.5 ? [1, 3] : [2, 4], out = []; for (let r = f0; r <= f1; r++) for (const c of cs) out.push([r, c]); return out; },
  diagonal: (R, f0, f1) => { const out = []; for (let r = f0; r <= f1; r++) { const c = 1 + (r - f0) % 4; out.push([r, c]); if (c < 4) out.push([r, c + 1]); } return out; },
};
const NOMBRES = Object.keys(FORMAS);
// filas disponibles para cada obstáculo dentro de una banda; las bandas separan pedidos combinados
function bands(n, R) {
  if (n === 1) return [[1 + ((R() * 2) | 0), 5 + ((R() * 2) | 0)]];
  if (n === 2) return R() < 0.5 ? [[1, 3], [4, 6]] : [[4, 6], [1, 3]];
  return [[1, 2], [3, 4], [5, 6]];
}

function generated(n) {
  const g = n - LEVELS.length, k = Math.floor((g - 1) / 5), p = (g - 1) % 5;
  const R = r01(2654435761 * g + 7), target = targetOf(g), hard = 1 - target;   // hard: 0,2 (amable) a 0,6
  const tipos = blockPlan(k)[p], reloj = p === 3;
  const L = { gen: g, goals: [], target };
  const tubes = tipos.includes('tubes');
  L.colors = tubes ? 5 : (hard > 0.48 && R() < 0.35 ? 7 : 6);
  const G = blankGrid();
  const obst = tipos.filter(t => t === 'pads' || t === 'burnt' || t === 'locks');
  const bs = bands(obst.length, R);
  let usaLayout = false;
  obst.forEach((t, i) => {
    const [f0, f1] = bs[i], forma = NOMBRES[(R() * NOMBRES.length) | 0];
    let cells = FORMAS[forma](R, f0, f1);
    if (t === 'burnt') cells = cells.filter((_, j) => j % 3 !== 2);          // siempre con pasos entre quemados
    const tope = t === 'pads' ? 7 + Math.round(hard * 14) : t === 'burnt' ? 5 + Math.round(hard * 10) : 4 + Math.round(hard * 8);
    for (let j = cells.length - 1; j > 0; j--) { const q = (R() * (j + 1)) | 0; [cells[j], cells[q]] = [cells[q], cells[j]]; }
    cells = cells.slice(0, tope);
    const doble = hard > 0.4 && R() < 0.5;
    for (const [r, c] of cells) {
      if (!free(G, r, c)) continue;
      if (t === 'pads') put(G, r, c, doble && R() < 0.6 ? '2' : '1');
      else if (t === 'burnt') put(G, r, c, doble && R() < 0.5 ? 'B' : 'b');
      else put(G, r, c, 'k');
    }
    usaLayout = true;
    L.goals.push({ type: t });
  });
  // huecos, a veces: esquinas o el centro; con válvulas, solo el centro
  const soloPuntos = tipos.length === 1 && tipos[0] === 'score';
  if (!reloj && !soloPuntos && R() < (tubes ? 0.45 : 0.25)) {
    const centro = tubes || R() < 0.5;
    if (centro) { for (const r of [3, 4]) if (free(G, r, 4)) put(G, r, 4, 'x'); }
    else for (const [r, c] of [[0, 0], [0, 1], [1, 0], [7, 0], [7, 1], [6, 0]]) if (free(G, r, c)) put(G, r, c, 'x');
    usaLayout = true;
  }
  if (usaLayout) L.layout = G.map(row => row.join(''));
  const col = () => (R() * L.colors) | 0;
  for (const t of tipos) {
    if (t === 'collect') {
      const dos = !reloj && R() < 0.5, c1 = col(); let c2 = col(); while (c2 === c1) c2 = col();
      const cant = () => 2 * Math.round((dos ? 11 : 13) + R() * 3 + hard * 6);
      L.goals.push({ type: 'collect', color: c1, n: cant() });
      if (dos) L.goals.push({ type: 'collect', color: c2, n: cant() });
    } else if (t === 'tubes') {
      const nt = 3 + Math.round(hard * 2 + R() * 2);
      L.goals.push({ type: 'tubes', n: nt }); L.tubes = { n: nt, max: 2 };
    } else if (t === 'score') L.goals.push({ type: 'score', n: 0 });
  }
  if (tipos.length === 1 && tipos[0] === 'score') L.tune = 'score';
  else L.tune = reloj ? 'time' : 'moves';
  if (L.tune === 'score') { if (reloj) L.time = 60 + 15 * Math.round(R() * 2); else L.moves = 18 + 2 * Math.round(R() * 3); }
  return L;
}

// Lo que cuesta terminar un nivel, para la fórmula: un renglón por pedido, con su cantidad en las unidades de GEN.costo
// (piezas a juntar escaladas por colores / 6, celdas de pad por capa, golpes a quemados, cintas, válvulas).
// También lo usa herramientas/generados.js para ajustar los costos.
function features(L) {
  const out = [], want = new Set(L.goals.map(o => o.type)), obst = { pads: 0, golpes: 0, cintas: 0 };
  for (const row of L.layout || []) for (const ch of row) {
    if (want.has('pads')) obst.pads += ch === '1' || ch === 'q' ? 1 : ch === '2' ? 2 : 0;
    if (want.has('burnt')) obst.golpes += ch === 'b' ? 1 : ch === 'B' ? 2 : 0;
    if (want.has('locks')) obst.cintas += ch === 'k' || ch === 'q' ? 1 : 0;
  }
  for (const o of L.goals) {
    if (o.type === 'collect') out.push(['piezas', o.n * L.colors / 6]);
    else if (o.type === 'tubes') out.push(['valvulas', o.n]);
    else if (o.type === 'pads') out.push(['pads', obst.pads]);
    else if (o.type === 'burnt') out.push(['golpes', obst.golpes]);
    else if (o.type === 'locks') out.push(['cintas', obst.cintas]);
  }
  return out;
}
// Los pedidos avanzan a la vez (juntos), salvo las válvulas con quemados, que esperan sobre ellos hasta que se rompen (seguidas).
function medianMoves(L, G = GEN, f = features(L)) {
  const traba = f.some(([k]) => k === 'golpes') && f.some(([k]) => k === 'valvulas');
  let extra = 0;
  const cs = [];
  for (const [k, v] of f) { const c = G.costo[k] * v * (traba && k === 'golpes' ? G.golpesConValvulas : 1); if (k === 'valvulas' && traba) extra += G.seguidas * c; else cs.push(c); }
  const max = cs.length ? Math.max(...cs) : 0, sum = cs.reduce((a, b) => a + b, 0);
  return G.colores[L.colors] * (G.costo.base + max + G.juntos * (sum - max) + extra);
}
const r100 = v => { const st = v > 20000 ? 500 : 100; return Math.max(st, Math.round(v / st) * st); };

// La calibración de un generado, en el formato de calibrated.json, sin jugar nada.
function calOf(L) {
  const out = { tune: L.tune, target: L.target };
  if (L.tune === 'score') {
    const jug = L.time ? L.time / GEN.segundosPorJugada : L.moves;
    const meta = r100(GEN.puntosPorJugada[L.colors] * jug * interp(GEN.razonPuntos, L.target));
    out.scoreTarget = meta;
    const s2 = Math.max(meta + 100, r100(meta * GEN.estrellasPuntaje[0]));
    out.stars = [meta, s2, Math.max(s2 + 100, r100(meta * GEN.estrellasPuntaje[1]))];
    if (L.time) out.time = L.time; else out.moves = L.moves;
    return out;
  }
  const mov = Math.max(10, Math.round(medianMoves(L) * interp(GEN.razon, L.target)));
  if (L.tune === 'time') out.time = Math.max(30, 5 * Math.round(mov * GEN.segundosPorJugada / 5)); else out.moves = mov;
  const s2 = r100(GEN.estrellaPorJugada[L.colors] * mov + GEN.estrellaPorValvula * (L.tubes ? L.tubes.n : 0));
  out.stars = [0, s2, Math.max(s2 + 100, r100(s2 * GEN.terceraEstrella))];
  return out;
}

// Un nivel cualquiera, con su calibración (la del archivo para los hechos a mano, la fórmula para los generados),
// listo para aplicarle un modo. Lo usan la partida y las herramientas.
function levelAt(n, CAL) {
  const base = n <= LEVELS.length ? LEVELS[n - 1] : generated(n);
  const cal = n <= LEVELS.length ? (CAL && CAL[n]) || {} : calOf(base);
  const d = Object.assign({}, base);
  d.goals = base.goals.map(o => Object.assign({}, o));
  if (cal.moves) d.moves = cal.moves;
  if (cal.time) { d.time = cal.time; d.moves = 0; }
  if (base.tune === 'score') d.goals[0].n = cal.scoreTarget || 1000;
  d.stars = (cal.stars || [0, 1000, 2000]).slice();
  d.n = n;
  return d;
}

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

if (typeof module !== 'undefined' && module.exports) module.exports = { LEVELS, ZEN, MODES, modeOf, applyMode, resumen, GEN, generated, features, medianMoves, calOf, levelAt, targetOf };
else { root.LEVELS = LEVELS; root.ZEN = ZEN; root.MODES = MODES; root.modeOf = modeOf; root.applyMode = applyMode; root.resumen = resumen; root.levelAt = levelAt; root.generated = generated; }
})(typeof window !== 'undefined' ? window : this);
