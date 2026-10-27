// Fogonazo's progress in the mockup: difficulty and stars per level and difficulty, kept in this browser only.
// The volumes are the collection's (comun/sonido.js).
window.Maqueta = (() => {
  'use strict';
  const KEY = 'coleccion.fogonazo';
  const MODES = ['Fácil', 'Normal', 'Difícil'];
  const blank = () => ({ modo: 1, niveles: [{}, {}, {}] });
  let st = blank();
  try { const raw = JSON.parse(localStorage.getItem(KEY)); if (raw && raw.niveles) st = raw; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  // a level passed in any mode is open in all of them
  const best = n => Math.max(...st.niveles.map(m => m[n] || 0));
  const maxPassed = () => { let n = 0; for (const m of st.niveles) for (const k in m) if (m[k] > 0) n = Math.max(n, +k); return n; };

  // level n of the mockup: a seeded variation of the same match (orders, moves, star thresholds)
  function level(n, modo = st.modo) {
    let seed = n * 9301 + 49297;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const types = [0, 1, 2, 3, 4, 5, 6].sort(() => rnd() - .5);
    const k = n < 3 ? 2 : 3;
    const orders = types.slice(0, k).map(t => [t, 8 + Math.floor(rnd() * 4) + Math.min(4, Math.floor(n / 6))]);
    const base = 22 + Math.floor(rnd() * 5) - Math.min(3, Math.floor(n / 10));
    const mult = [1.3, 1.12, 1][modo], pts = [.8, .9, 1][modo];
    return { n, moves: Math.round(base * mult), orders, stars: [500, 1000, 1600].map(v => Math.round(v * pts / 10) * 10), bonus: 50 };
  }

  return {
    MODES,
    get modo() { return st.modo; }, set modo(v) { st.modo = v; save(); },
    stars: (n, modo = st.modo) => st.niveles[modo][n] || 0,
    total: (modo = st.modo) => Object.values(st.niveles[modo]).reduce((a, b) => a + b, 0),
    maxLevel: (modo = st.modo) => { let n = 0; for (const k in st.niveles[modo]) if (st.niveles[modo][k] > 0) n = Math.max(n, +k); return n; },
    next: () => maxPassed() + 1,
    open: n => n <= maxPassed() + 1,
    best,
    record(n, stars) { const m = st.niveles[st.modo]; if (stars > (m[n] || 0)) { m[n] = stars; save(); } },
    level,
  };
})();
