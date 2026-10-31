// Fogonazo's progress: the difficulty, the stars and the best score of each level in each difficulty, and the zen
// records. Kept in this browser only. The volumes are the collection's (comun/sonido.js).
window.Estado = (() => {
  'use strict';
  const KEY = 'coleccion.fogonazo';
  const MODES = ['Fácil', 'Normal', 'Difícil'];   // the same order as the engine's modes (codigo/levels.js)
  const ULTIMO = 30;                                // the last level made by hand; from 31 on they are generated, without end
  const blank = () => ({ modo: 1, vista: 0, niveles: [{}, {}, {}], puntos: [{}, {}, {}], zen: { puntos: 0, tiempo: 0 } });
  let st = blank();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && raw.niveles) st = Object.assign(blank(), raw);   // the mockup's saves had only modo and niveles
  } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  // a level passed in any mode is open in all of them
  const best = n => Math.max(...st.niveles.map(m => m[n] || 0));
  const maxPassed = () => { let n = 0; for (const m of st.niveles) for (const k in m) if (m[k] > 0) n = Math.max(n, +k); return n; };

  return {
    MODES, ULTIMO,
    get modo() { return st.modo; }, set modo(v) { st.modo = v; save(); },
    // the instrument's «Modo» knob (Niveles, Zen, Récords): it stays where it was left
    get vista() { return st.vista || 0; }, set vista(v) { st.vista = v; save(); },
    stars: (n, modo = st.modo) => st.niveles[modo][n] || 0,
    total: (modo = st.modo) => Object.values(st.niveles[modo]).reduce((a, b) => a + b, 0),
    maxLevel: (modo = st.modo) => { let n = 0; for (const k in st.niveles[modo]) if (st.niveles[modo][k] > 0) n = Math.max(n, +k); return n; },
    next: () => maxPassed() + 1,
    open: n => n >= 1 && n <= maxPassed() + 1,
    best,
    puntos: (n, modo = st.modo) => st.puntos[modo][n] || 0,
    // stars and score of a finished level in the current mode; returns the best score it had before
    record(n, stars, score) {
      const m = st.niveles[st.modo], p = st.puntos[st.modo], prev = p[n] || 0;
      if (stars > (m[n] || 0)) m[n] = stars;
      if (stars > 0 && score > prev) p[n] = score;
      save();
      return prev;
    },
    // zen records: the best score and the longest match, saved while playing so they survive closing the app
    get zen() { return Object.assign({}, st.zen); },
    zenRecord(puntos, tiempo) {
      const z = st.zen;
      if (puntos <= z.puntos && tiempo <= z.tiempo) return;
      z.puntos = Math.max(z.puntos, puntos); z.tiempo = Math.max(z.tiempo, tiempo); save();
    },
  };
})();
