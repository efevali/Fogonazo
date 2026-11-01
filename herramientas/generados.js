/* Los niveles generados (del 31 en adelante) con el bot: no se calibran uno por uno, sino que se ajusta la fórmula
   GEN de codigo/levels.js sobre una muestra, y después se mide cómo quedaron.
   node herramientas/generados.js datos [desde] [hasta] [partidas]  → juega la muestra y guarda dist/generados-datos.json
   node herramientas/generados.js ajustar                           → con esos datos, propone los valores de GEN
   node herramientas/generados.js medir [desde] [hasta] [partidas]   → la tasa de victoria de cada nivel en los tres modos, con la fórmula
   node herramientas/generados.js estrellas                         → con esa medición, propone los puntos de las estrellas
   node herramientas/generados.js ver [desde] [hasta]                → qué pide cada nivel, sin jugar
   Ejemplo: node herramientas/generados.js datos 31 90 100 */
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const E = require('../codigo/engine.js');
const LV = require('../codigo/levels.js');
const { generated, features, medianMoves, calOf, levelAt, resumen, GEN } = LV;
const SKILL = { best: 0.62, second: 0.2 };
const DATOS = __dirname + '/../dist/generados-datos.json', MEDICION = __dirname + '/../dist/generados-medicion.json';

// una partida del bot, como en calibrar.js: devuelve si ganó, en qué jugada y segundo terminó, y los puntos
function play(L, seed) {
  const g = E.createGame(L, seed), rnd = E.rngFrom(seed * 2654435761 >>> 0);
  let time = 0, doneAt = null, doneTime = null, doneScore = null;
  while (!g.over) {
    const m = E.botChoose(g, rnd, SKILL);
    if (!m) break;
    const r = E.trySwap(g, m.a, m.b);
    time += 1.7 + rnd() * 1.4;
    for (const st of r.steps) time += E.stepDuration(st) / 1000;
    if (g.mode === 'time') { g.timeLeft = L.time - time; E.evaluateEnd(g, time >= L.time); } else E.evaluateEnd(g);
    if (g.won && doneAt === null) { doneAt = g.movesUsed; doneTime = time; doneScore = g.score; }
  }
  if (g.won) E.bonus(g);
  return { won: g.won, moves: doneAt, time: doneTime, scoreAt: doneScore, score: g.score };
}
const q = (arr, p) => { const a = arr.slice().sort((x, y) => x - y); if (!a.length) return NaN; const pos = Math.min(a.length - 1, Math.max(0, p * (a.length - 1))), lo = Math.floor(pos), hi = Math.ceil(pos); return a[lo] + (a[hi] - a[lo]) * (pos - lo); };

// ---- trabajo de cada hilo
function datos(n, partidas) {
  const L = generated(n), out = { n, tune: L.tune, target: L.target, colors: L.colors, f: features(L), resumen: resumen(L) };
  if (L.tune === 'score') {
    const d = levelAt(n); d.goals[0].n = 1e9;   // inalcanzable: los puntos de jugar hasta el final, sin bonus
    out.jug = L.time ? null : L.moves; out.time = L.time || null;
    out.scores = []; for (let s = 0; s < partidas; s++) out.scores.push(play(d, 1000 + s).score);
    return out;
  }
  const d = Object.assign({}, L, { goals: L.goals.map(o => Object.assign({}, o)), moves: 150 }); delete d.time;
  out.done = []; out.times = []; out.scoreAt = [];
  for (let s = 0; s < partidas; s++) {
    const r = play(d, 1000 + s);
    out.done.push(r.won ? r.moves : null); out.times.push(r.won ? r.time : null); out.scoreAt.push(r.won ? r.scoreAt : null);
  }
  return out;
}
function medir(n, partidas) {
  const d = levelAt(n), M = LV.MODES;
  const res = { n, resumen: resumen(d), target: d.target, colors: d.colors, tune: d.tune, valvulas: d.tubes ? d.tubes.n : 0, jug: d.time ? d.time / GEN.segundosPorJugada : d.moves, knob: d.tune === 'score' ? d.goals[0].n : d.time ? d.time + ' s' : d.moves + ' mov', modos: [] };
  for (const m of M) {
    const dm = LV.applyMode(Object.assign({}, d, { goals: d.goals.map(o => Object.assign({}, o)), stars: d.stars.slice() }), m);
    let w = 0, s2 = 0; const ganadores = [];
    for (let s = 0; s < partidas; s++) { const r = play(dm, 50000 + s); if (r.won) { w++; ganadores.push(r.score); if (r.score >= dm.stars[1]) s2++; } }
    res.modos.push({ id: m.id, win: w / partidas, dos: s2 / partidas, mediana: q(ganadores, 0.5), p86: q(ganadores, 0.86) });
  }
  return res;
}

if (!isMainThread) {
  const { tarea, ids, partidas } = workerData;
  for (const n of ids) parentPort.postMessage(tarea === 'datos' ? datos(n, partidas) : medir(n, partidas));
  return;
}

const [cmd = 'ver', a = '31', b = '90', c = '100'] = process.argv.slice(2);
const desde = +a, hasta = +b, partidas = +c, ids = [];
for (let n = desde; n <= hasta; n++) ids.push(n);

function enHilos(tarea, cada, fin) {
  const nW = 2, res = []; let listos = 0;
  for (let k = 0; k < nW; k++) {
    const w = new Worker(__filename, { workerData: { tarea, ids: ids.filter((_, j) => j % nW === k), partidas } });
    w.on('message', m => { res.push(m); cada(m); });
    w.on('error', e => { console.error(e); process.exit(1); });
    w.on('exit', () => { if (++listos === nW) fin(res.sort((x, y) => x.n - y.n)); });
  }
}

if (cmd === 'ver') {
  for (const n of ids) { const d = levelAt(n); console.log(`N${n} ${resumen(d).padEnd(28)} meta ${Math.round(d.target * 100)}%  ${d.tune === 'score' ? 'obj ' + d.goals[0].n : d.time ? d.time + ' s' : d.moves + ' mov'}  ${d.colors} colores`); }
} else if (cmd === 'datos') {
  const t0 = Date.now();
  enHilos('datos', m => process.stdout.write('.'), res => { fs.writeFileSync(DATOS, JSON.stringify(res)); console.log(`\n${res.length} niveles en ${((Date.now() - t0) / 1000) | 0} s → ${DATOS}`); });
} else if (cmd === 'ajustar') {
  const D = JSON.parse(fs.readFileSync(DATOS, 'utf8'));
  const jug = D.filter(d => d.done), keys = ['piezas', 'pads', 'golpes', 'cintas', 'valvulas'];
  // nunca: los que el bot no termina ni con 150 jugadas
  for (const d of jug) { const nunca = d.done.filter(v => v === null).length / d.done.length; if (nunca > 0.05) console.log(`N${d.n} ${d.resumen}: no termina en el ${(nunca * 100) | 0} %`); }
  // costos, «juntos» y el factor de colores: descenso por coordenadas sobre el error relativo de la mediana
  const y = jug.map(d => q(d.done.filter(v => v !== null), 0.5));
  const G = JSON.parse(JSON.stringify(GEN));
  const params = [['costo', 'base'], ...keys.map(k => ['costo', k]), ['juntos'], ['seguidas'], ['golpesConValvulas'], ['colores', '7']];
  const get = p => p.length === 1 ? G[p[0]] : G[p[0]][p[1]], set = (p, v) => { if (p.length === 1) G[p[0]] = v; else G[p[0]][p[1]] = v; };
  const pred = d => medianMoves({ colors: d.colors }, G, d.f);
  const loss = () => jug.reduce((s, d, i) => s + Math.log(pred(d) / y[i]) ** 2, 0);
  for (let it = 0; it < 80; it++) for (const p of params) {
    let best = loss(), v = get(p);
    for (const f of [1.3, 1.1, 1.03, 1 / 1.03, 1 / 1.1, 1 / 1.3]) { set(p, v * f); const l = loss(); if (l < best) { best = l; v = v * f; } }
    set(p, v);
  }
  if (!jug.some(d => d.colors === 5)) G.colores['5'] = 1;
  const r = x => +x.toFixed(3);
  console.log('costo:', JSON.stringify(Object.fromEntries(Object.entries(G.costo).map(([k, v]) => [k, r(v)]))), 'juntos:', r(G.juntos), 'seguidas:', r(G.seguidas), 'golpesConValvulas:', r(G.golpesConValvulas), 'colores:', JSON.stringify({ 5: r(G.colores[5]), 6: 1, 7: r(G.colores[7]) }));
  const err = jug.map((d, i) => Math.abs(pred(d) - y[i]) / y[i]);
  console.log(`error mediano ${(q(err, 0.5) * 100).toFixed(0)} %, el peor ${(Math.max(...err) * 100).toFixed(0)} %`);
  // razón: cuántas veces la mediana hace falta para cada tasa
  const razon = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(t => [t, +q(jug.map(d => { const f = d.done.map(v => v === null ? 1e9 : v); return q(f, t) / q(f, 0.5); }), 0.5).toFixed(3)]);
  console.log('razon:', JSON.stringify(razon));
  const spj = q(jug.flatMap(d => d.done.map((v, i) => v ? d.times[i] / v : null).filter(Boolean)), 0.5);
  console.log('segundosPorJugada:', spj.toFixed(2));
  const ppm = q(jug.flatMap(d => d.done.map((v, i) => v ? d.scoreAt[i] / v : null).filter(Boolean)), 0.5);
  console.log('puntosPorMovimientoGanado (al terminar, sin bonus):', ppm | 0);
  const sc = D.filter(d => d.scores);
  if (sc.length) {
    for (const cc of [5, 6, 7]) { const v = sc.filter(d => d.colors === cc).map(d => q(d.scores, 0.5) / (d.jug || d.time / spj)); if (v.length) console.log(`puntosPorJugada con ${cc} colores:`, q(v, 0.5) | 0, `(${v.length} niveles)`); }
    const rp = [0.3, 0.5, 0.7, 0.9].map(t => [t, +q(sc.map(d => q(d.scores, 1 - t) / q(d.scores, 0.5)), 0.5).toFixed(3)]);
    console.log('razonPuntos:', JSON.stringify(rp));
  }
} else if (cmd === 'estrellas') {
  // con la última medición: la mediana de los puntos de quien gana en Difícil, por jugada y por colores; y la meta de
  // los de puntaje contra lo que se ganó
  const R = JSON.parse(fs.readFileSync(MEDICION, 'utf8'));
  for (const cc of [5, 6, 7]) { const v = R.filter(r => r.tune !== 'score' && r.colors === cc).map(r => r.modos[2].mediana / r.jug); if (v.length) console.log(`estrellaPorJugada con ${cc} colores:`, q(v, 0.5) | 0, `(${v.length})`); }
  const pe = R.filter(r => r.tune !== 'score' && r.modos[2].mediana > 0);
  if (pe.length) console.log('terceraEstrella (los de pedido):', q(pe.map(r => r.modos[2].p86 / r.modos[2].mediana), 0.5).toFixed(2));
  const sc = R.filter(r => r.tune === 'score');
  if (sc.length) {
    console.log('puntaje, desvío mediano de la tasa en Difícil:', (q(sc.map(r => r.modos[2].win - r.target), 0.5) * 100).toFixed(0), 'puntos');
    const ok = sc.filter(r => r.modos[2].mediana > 0);
    console.log('estrellasPuntaje (× la meta):', JSON.stringify([q(ok.map(r => r.modos[2].mediana / r.knob), 0.5), q(ok.map(r => r.modos[2].p86 / r.knob), 0.5)].map(v => +v.toFixed(2))));
  }
} else if (cmd === 'medir') {
  const t0 = Date.now();
  enHilos('medir', () => process.stdout.write('.'), res => {
    console.log('');
    for (const r of res) console.log(`N${r.n} ${r.resumen.padEnd(28)} ${String(r.knob).padEnd(8)} meta ${String(Math.round(r.target * 100)).padStart(3)}%  ` + r.modos.map(m => `${m.id} ${String(Math.round(m.win * 100)).padStart(3)}% (★★ ${String(Math.round(m.dos * 100)).padStart(3)}%)`).join('  '));
    const dif = res.map(r => r.modos[2].win - r.target);
    console.log(`Difícil: desvío mediano ${(q(dif.map(Math.abs), 0.5) * 100).toFixed(0)} puntos, sesgo ${(q(dif, 0.5) * 100).toFixed(0)}; ` + LV.MODES.map((m, k) => `${m.name} gana ${(res.reduce((s, r) => s + r.modos[k].win, 0) / res.length * 100).toFixed(0)} %, ★★ ${(res.reduce((s, r) => s + r.modos[k].dos, 0) / res.length * 100).toFixed(0)} %`).join(' · ') + ` · ${((Date.now() - t0) / 1000) | 0} s`);
    fs.writeFileSync(MEDICION, JSON.stringify(res));
  });
}
