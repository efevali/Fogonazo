/* Prueba los tableros del mahjong sin navegador.

   node herramientas/mahjong/probar.js [repartos]      (por defecto, 40 repartos por tablero)

   Verifica que cada tablero tenga una cantidad par de fichas, que no haya dos fichas en el mismo lugar, que toda
   ficha de arriba se apoye en alguna de abajo, que el reparto siempre asigne una cara a cada lugar y que su salida
   guardada se pueda jugar hasta el final. Después juega cada reparto eligiendo pares libres al azar y cuenta cuántas
   veces se limpia sin barajar: es una idea de la dificultad (quien juega mira antes de elegir, así que le va mejor
   que al azar). Termina con error si algo falla. */
const path = require('path');
global.window = {};
require(path.join(__dirname, '../../mahjong/fichas.js'));
global.Fichas = window.Fichas;
require(path.join(__dirname, '../../mahjong/tableros.js'));
const T = window.Tableros;
const N = +process.argv[2] || 40;
let fallas = 0;
const ok = (c, m) => { if (!c) { console.log('  ✗ ' + m); fallas++; } };

for (const tab of T.LISTA) {
  const P = tab.P;
  ok(P.length % 2 === 0, `${tab.nombre}: cantidad impar (${P.length})`);
  const lugar = new Set(P.map(t => `${t.x},${t.y},${t.z}`));
  ok(lugar.size === P.length, `${tab.nombre}: fichas repetidas en un mismo lugar`);
  P.forEach((t, i) => {
    for (let j = 0; j < i; j++) { const u = P[j]; if (u.z === t.z && Math.abs(u.x - t.x) < 2 && Math.abs(u.y - t.y) < 2) ok(false, `${tab.nombre}: fichas encimadas en la capa ${t.z}`); }
    if (t.z > 0) ok(P.some(u => u.z === t.z - 1 && Math.abs(u.x - t.x) < 2 && Math.abs(u.y - t.y) < 2), `${tab.nombre}: una ficha flota en (${t.x}, ${t.y}, ${t.z})`);
  });
  let limpios = 0, ms = 0;
  for (let r = 0; r < N; r++) {
    const t0 = Date.now(), cara = T.nuevo(tab); ms += Date.now() - t0;
    ok(P.every((_, i) => cara[i]), `${tab.nombre}: un lugar quedó sin cara`);
    const sal = new Set(P.map((_, i) => i));
    for (const [a, b] of cara.salida) { ok(T.libre(a, sal, P) && T.libre(b, sal, P) && Fichas.FACE[cara[a]].key === Fichas.FACE[cara[b]].key, `${tab.nombre}: la salida guardada no se puede jugar`); sal.delete(a); sal.delete(b); }
    const occ = new Set(P.map((_, i) => i));
    let pp;
    while (occ.size && (pp = T.pares(occ, cara, P)).length) { const [a, b] = T.azar(pp); occ.delete(a); occ.delete(b); }
    if (!occ.size) limpios++;
  }
  console.log(`${tab.nombre.padEnd(10)} ${String(P.length).padStart(3)} fichas · reparto en ${(ms / N).toFixed(0)} ms · al azar se limpia ${Math.round(limpios / N * 100)} %`);
}
console.log(fallas ? `\n${fallas} falla(s).` : '\nTodo bien.');
process.exit(fallas ? 1 : 0);
