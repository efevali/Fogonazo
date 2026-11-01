// La ayuda de piezas del pedido en cada modo (S-28): en cuántas movidas completa el bot los niveles que piden piezas
// con la ayuda de Difícil, de Normal y de Fácil, sin límite de movimientos. Mediana y percentil 80 de 200 partidas.
// node herramientas/ayuda_piezas.js 3,4,6
const E = require('../codigo/engine.js');
const { LEVELS, MODES, resumen, levelAt } = require('../codigo/levels.js');
const CAL = require('../codigo/calibrated.json');
const skill = { best: 0.62, second: 0.2 }, n = 200;
const q = (a, p) => { a = a.slice().sort((x, y) => x - y); return a[Math.round(p * (a.length - 1))]; };
const ids = process.argv[2] ? process.argv[2].split(',').map(Number) : LEVELS.map((_, i) => i + 1).filter(i => LEVELS[i - 1].goals.some(o => o.type === 'collect'));
for (const id of ids) {
  const fila = MODES.slice().reverse().map(M => {
    const d = levelAt(id, CAL); d.moves = 150; d.time = 0; d.ayuda = M.ayuda;
    const u = [];
    for (let s = 0; s < n; s++) {
      const g = E.createGame(d, 7000 + s), rnd = E.rngFrom(s * 977 + 3);
      while (!g.over) { const m = E.botChoose(g, rnd, skill); if (!m) break; E.trySwap(g, m.a, m.b); E.evaluateEnd(g); }
      u.push(g.won ? g.movesUsed : 999);
    }
    return `${M.name} ${String(q(u, 0.5)).padStart(3)} (p80 ${String(q(u, 0.8)).padStart(3)})`;
  });
  console.log(`L${String(id).padStart(2)} ${resumen(LEVELS[id - 1]).padEnd(18)} ${fila.join(' · ')}`);
}
