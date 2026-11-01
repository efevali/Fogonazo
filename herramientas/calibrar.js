/* Calibración de dificultad con un bot imperfecto.
   Primero, el límite de Difícil: los movimientos, el tiempo o la primera meta de puntos de cada nivel, para que el bot
   gane con la tasa que pide levels.js (target). Después, en cada modo (S-28), las estrellas: en los niveles de pedido,
   la cantidad máxima de movidas (o de segundos) para dos y para tres; en los de puntos, la segunda y la tercera meta. Se
   eligen para que, de las partidas que el bot gana en ese modo, lleguen a dos estrellas o más y a tres las fracciones de
   `reparto` (MODES, en levels.js). También el fondo de escala del vúmetro de los de pedido. Al final, una verificación
   con las reglas de verdad.
   node herramientas/calibrar.js [partidas] [mejor] [niveles] [--estrellas] → escribe codigo/calibrated.json
   Ejemplos: node herramientas/calibrar.js 400 0.62 16,17,18
             node herramientas/calibrar.js 300 0.62 todos --estrellas   (deja el límite de Difícil y rehace las estrellas) */
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const E = require('../codigo/engine.js');
const LV = require('../codigo/levels.js');
const { LEVELS, MODES, resumen } = LV;
const ARCHIVO = __dirname + '/../codigo/calibrated.json';

const SKILL = { best: 0.62, second: 0.2 };   // 62% la mejor, 20% la segunda, 18% cualquiera

// una partida del bot. Devuelve si ganó, en qué jugada y segundo completó el pedido, los puntos antes del bonus y al final
function play(L, seed, skill, bonusSiempre) {
  const g = E.createGame(L, seed);
  const rnd = E.rngFrom(seed * 2654435761 >>> 0);
  let time = 0, usadas = null, segundos = null;
  while (!g.over) {
    const m = E.botChoose(g, rnd, skill);
    if (!m) break;
    const r = E.trySwap(g, m.a, m.b);
    time += 1.7 + rnd() * 1.4;
    for (const st of r.steps) time += E.stepDuration(st) / 1000;
    if (g.mode === 'time') { g.timeLeft = L.time - time; E.evaluateEnd(g, time >= L.time); }
    else E.evaluateEnd(g);
    if (g.won && usadas === null) { usadas = g.movesUsed; segundos = time; }
  }
  const pre = g.score;
  if (g.won || bonusSiempre) E.bonus(g);
  return { won: g.won, usadas, segundos, pre, puntos: g.score };
}

function quantile(arr, q) {
  const a = arr.slice().sort((x, y) => x - y);
  if (!a.length) return 0;
  const pos = Math.min(a.length - 1, Math.max(0, q * (a.length - 1)));
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return a[lo] + (a[hi] - a[lo]) * (pos - lo);
}
const roundTo = (v, s) => Math.max(s, Math.round(v / s) * s);
const paso = v => v > 20000 ? 500 : 100;
// el umbral de a `step` cuya fracción de valores ≤ umbral queda más cerca de `share`
function umbral(vals, share, step, max) {
  let best = step, err = 9;
  for (let m = step; m <= max; m += step) {
    const f = vals.filter(v => v <= m + 1e-9).length / vals.length, e = Math.abs(f - share);
    if (e < err - 1e-9) { err = e; best = m; }
  }
  return best;
}
// el nivel tal como se juega en un modo, con lo que haya en la calibración
function defIn(id, cal, M) {
  return LV.applyMode(LV.levelAt(id, { [id]: cal }), M);
}

// el límite de Difícil (lo de siempre)
function limite(li, n, skill, out) {
  const base = LEVELS[li];
  if (base.tune === 'score') {
    // con una meta inalcanzable, los puntos de jugar hasta el final (sin bonus): la meta deja ganar a la tasa buscada
    const L = Object.assign({}, base, { goals: [{ type: 'score', n: 1e9 }] });
    const scores = [];
    for (let s = 0; s < n; s++) scores.push(play(L, 1000 + s, skill).pre);
    const step = paso(quantile(scores, 0.5));
    out.scoreTarget = Math.floor(quantile(scores, 1 - base.target) / step) * step;
    out.medianScore = quantile(scores, 0.5);
    if (base.time) out.time = base.time; else out.moves = base.moves;
    return;
  }
  const L1 = Object.assign({}, base);
  if (base.tune === 'moves') L1.moves = 150; else L1.time = 900;
  const done = [];
  for (let s = 0; s < n; s++) {
    const r = play(L1, 1000 + s, skill);
    done.push(r.won ? (base.tune === 'moves' ? r.usadas : r.segundos) : Infinity);
  }
  const finite = done.filter(Number.isFinite);
  out.neverRate = 1 - finite.length / done.length;
  const step = base.tune === 'moves' ? 1 : 5;
  let knob = step, bestErr = 9;
  for (let m = step; m <= (base.tune === 'moves' ? 150 : 900); m += step) {
    const cdf = done.filter(v => v <= m).length / done.length;
    const err = Math.abs(cdf - base.target);
    if (err < bestErr) { bestErr = err; knob = m; }
    if (cdf > base.target + 0.1) break;
  }
  if (base.tune === 'moves') out.moves = knob; else out.time = knob;
  out.medianDone = quantile(finite, 0.5);
}

// las estrellas de un modo
function estrellas(id, cal, M, n, skill) {
  const d = defIn(id, cal, M), [r2, r3] = M.reparto;
  if (d.starsBy === 'score') {
    // se juegan todas las movidas (o todo el tiempo) y, si se pasó la primera meta, el bonus de los especiales que quedaron
    const L = Object.assign({}, d, { stars: [d.stars[0], 1e12, 1e12] });
    const fin = [];
    for (let s = 0; s < n; s++) { const r = play(L, 50000 + s, skill); if (r.won) fin.push(r.puntos); }
    const st = paso(quantile(fin, 0.5)), m1 = d.stars[0];
    const s2 = Math.max(m1 + st, roundTo(quantile(fin, 1 - r2), st));
    return { estrellas: [m1, s2, Math.max(s2 + st, roundTo(quantile(fin, 1 - r3), st))] };
  }
  const tiempo = d.starsBy === 'time', lim = d.stars[0], step = tiempo ? 5 : 1;
  const u = [], fin = [];
  for (let s = 0; s < n; s++) { const r = play(d, 50000 + s, skill); if (r.won) { u.push(tiempo ? r.segundos : r.usadas); fin.push(r.puntos); } }
  const t2 = umbral(u, r2, step, lim), t3 = umbral(u, r3, step, lim);
  return { estrellas: LV.umbralesDe(lim, t2, t3, step), escala: roundTo(quantile(fin, 0.9), paso(quantile(fin, 0.9))) };
}

// la verificación, con las reglas de verdad: cuántas gana, cuántas llegan a dos estrellas o más y cuántas a tres
function verificar(id, cal, M, n, skill) {
  const d = defIn(id, cal, M), h = [0, 0, 0, 0];
  for (let s = 0; s < n; s++) { const r = play(d, 90000 + s, skill); h[LV.estrellasDe(d, r)]++; }
  return { gana: (n - h[0]) / n, dos: (h[2] + h[3]) / n, tres: h[3] / n };
}

function calibrar(li, n, skill, soloEstrellas, prev) {
  const base = LEVELS[li], id = li + 1;
  const out = { id, name: resumen(base), tune: base.tune, target: base.target };
  if (soloEstrellas && prev) { for (const k of ['scoreTarget', 'medianScore', 'moves', 'time', 'neverRate', 'medianDone']) if (prev[k] !== undefined) out[k] = prev[k]; }
  else limite(li, n, skill, out);
  out.modos = {};
  for (const M of MODES) out.modos[M.id] = estrellas(id, out, M, n, skill);
  for (const M of MODES) Object.assign(out.modos[M.id], verificar(id, out, M, n, skill));
  out.winRate = out.modos.dificil.gana;
  return out;
}

if (isMainThread) {
  const args = process.argv.slice(2), soloEstrellas = args.includes('--estrellas');
  const [a, b, c] = args.filter(x => !x.startsWith('--'));
  const n = +a || 300;
  const skill = b ? { best: +b, second: 0.2 } : SKILL;
  const only = c && c !== 'todos' ? c.split(',').map(Number) : null;
  const ids = LEVELS.map((_, i) => i).filter(i => !only || only.includes(i + 1));
  let prev = {};
  try { prev = JSON.parse(fs.readFileSync(ARCHIVO, 'utf8')); } catch (e) {}
  const nW = Math.min(ids.length, require('os').cpus().length), results = [];
  let finished = 0;
  const t0 = Date.now(), pc = v => String(Math.round(v * 100)).padStart(3) + '%';
  for (let k = 0; k < nW; k++) {
    const mine = ids.filter((_, j) => j % nW === k);
    const wk = new Worker(__filename, { workerData: { ids: mine, n, skill, soloEstrellas, prev } });
    wk.on('error', e => { console.error(e); process.exit(1); });
    wk.on('message', r => {
      results.push(r);
      const knob = r.tune === 'score' ? `obj ${r.scoreTarget}` : r.tune === 'moves' ? `${r.moves} mov` : `${r.time} s`;
      console.log(`L${String(r.id).padStart(2)} ${r.name.padEnd(16)} ${knob.padEnd(10)} meta ${pc(r.target)} · ` + MODES.map(M => {
        const m = r.modos[M.id];
        return `${M.name} ★ ${m.estrellas.join('/')} gana ${pc(m.gana)} ≥2 ${pc(m.dos)} 3 ${pc(m.tres)}`;
      }).join(' · '));
    });
    wk.on('exit', () => {
      if (++finished < nW) return;
      results.sort((x, y) => x.id - y.id);
      for (const r of results) prev[r.id] = r;
      fs.writeFileSync(ARCHIVO, JSON.stringify(prev, null, 1));
      console.log(`listo en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    });
  }
} else {
  for (const li of workerData.ids) parentPort.postMessage(calibrar(li, workerData.n, workerData.skill, workerData.soloEstrellas, workerData.prev[li + 1]));
}
