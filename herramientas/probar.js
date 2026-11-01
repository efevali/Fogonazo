// Prueba del motor: juega 180 partidas con el bot (6 por nivel hecho a mano) y 120 en los generados del 31 al 90 (2 por nivel) y verifica después de cada jugada que el
// tablero quede consistente: sin piezas en huecos, sin ids repetidos, la placa quieta y los únicos lugares
// vacíos, los tapados por quemados o cinta.
// node herramientas/probar.js
const E = require('../codigo/engine.js');
const { LEVELS, ZEN, MODES, applyMode, generated, levelAt } = require('../codigo/levels.js');
const CAL = require('../codigo/calibrated.json');

let emptySeen = 0;
function checkBoard(g, where) {
  const ids = new Set();
  for (let i = 0; i < E.N; i++) {
    const p = g.p[i];
    if (g.hole[i]) { if (p) throw new Error(where + ': pieza en hueco'); continue; }
    if (!p) { if (!E.shadowed(g, i)) throw new Error(where + ': celda vacía sin tapar ' + i); emptySeen++; continue; }
    if (ids.has(p.id)) throw new Error(where + ': id duplicado');
    ids.add(p.id);
    if ((p.k <= 3 || p.k === E.K.ANT) && (p.c < 0 || p.c >= g.colors)) throw new Error(where + ': color inválido ' + JSON.stringify(p));
  }
  if (!E.isStable(g)) throw new Error(where + ': la placa no quedó quieta');
}

const skill = { best: 0.65, second: 0.2 };
let t0 = Date.now(), games = 0, moves = 0, shuffles = 0;
// los generados, con la calibración de la fórmula: que la meta sea razonable
for (let n = LEVELS.length + 1; n <= 1000; n++) {
  const d = levelAt(n);
  if (d.time ? d.time < 30 || d.time > 180 : d.moves < 10 || d.moves > 60) throw new Error(`N${n}: ${d.time || d.moves} fuera de rango`);
  for (const M of MODES) {   // las estrellas de S-28, en orden: en pedido, límite > dos > tres > 0; en puntos, tres metas que suben
    const s = applyMode(levelAt(n), M).stars;
    const ok = d.starsBy === 'score' ? s[0] > 0 && s[1] > s[0] && s[2] > s[1] : s[0] > s[1] && s[1] > s[2] && s[2] > 0;
    if (!ok) throw new Error(`N${n} ${M.id}: estrellas ${s}`);
  }
  if (generated(n).layout && generated(n).layout.join('') !== levelAt(n).layout.join('')) throw new Error(`N${n}: no es siempre el mismo`);
}
// los hechos a mano, también sus estrellas en cada modo
for (let n = 1; n <= LEVELS.length; n++) for (const M of MODES) {
  const d = applyMode(levelAt(n, CAL), M), s = d.stars;
  const ok = d.starsBy === 'score' ? s[0] > 0 && s[1] > s[0] && s[2] > s[1] : s[0] > s[1] && s[1] > s[2] && s[2] > 0;
  if (!ok) throw new Error(`L${n} ${M.id}: estrellas ${s}`);
}
// las partidas, con las reglas de verdad (los de puntos, hasta la tercera meta) y los modos alternados, por la ayuda de piezas
const TODOS = Array.from({ length: LEVELS.length + 60 }, (_, i) => i + 1);
for (let li = 0; li < TODOS.length; li++) {
  const L = applyMode(levelAt(TODOS[li], CAL), MODES[li % 3]);
  if (!L.time && L.starsBy !== 'score') L.moves = 60;
  for (let s = 1; s <= (li < LEVELS.length ? 6 : 2); s++) {
    const g = E.createGame(L, s * 7919 + li);
    checkBoard(g, 'init L' + (li + 1));
    const rnd = E.rngFrom(s * 31 + 5);
    let time = 0;
    while (!g.over) {
      const m = E.botChoose(g, rnd, skill);
      if (!m) throw new Error('sin jugadas L' + (li + 1));
      const r = E.trySwap(g, m.a, m.b);
      if (!r.valid) throw new Error('jugada inválida elegida');
      moves++;
      for (const st of r.steps) { time += E.stepDuration(st) / 1000; if (st.t === 'shuffle') shuffles++; }
      time += 2;
      checkBoard(g, 'L' + (li + 1) + ' mov ' + g.movesUsed);
      if (g.mode === 'time') { g.timeLeft = L.time - time; E.evaluateEnd(g, time >= L.time); }
      else E.evaluateEnd(g);
    }
    if (g.won) { E.bonus(g); checkBoard(g, 'bonus L' + (li + 1)); }
    games++;
  }
}
// Modo zen: 6 partidas de 300 jugadas. No termina nunca y el encargo se renueva.
let orders = 0;
for (let s = 1; s <= 6; s++) {
  const g = E.createGame(ZEN, s * 104729);
  checkBoard(g, 'init zen');
  const rnd = E.rngFrom(s * 17 + 3);
  for (let k = 0; k < 300; k++) {
    const m = E.botChoose(g, rnd, skill);
    if (!m) throw new Error('sin jugadas en zen');
    const r = E.trySwap(g, m.a, m.b);
    if (!r.valid) throw new Error('jugada inválida elegida en zen');
    moves++;
    for (const st of r.steps) if (st.t === 'shuffle') shuffles++;
    checkBoard(g, 'zen mov ' + g.movesUsed);
    const before = g.goals[0].color;
    if (E.zenOrder(g)) { orders++; if (g.goals[0].color === before || g.goals[0].have !== 0) throw new Error('encargo mal renovado'); }
    E.evaluateEnd(g, true);
    if (g.over) throw new Error('el modo zen terminó solo');
  }
  games++;
}
console.log(`zen: ${orders} encargos cumplidos en 1800 jugadas`);
const dt = Date.now() - t0;
console.log(`${games} partidas, ${moves} jugadas, ${shuffles} mezclas, ${dt} ms (${(dt / moves).toFixed(2)} ms/jugada), ${emptySeen} celdas vacías tapadas vistas`);
