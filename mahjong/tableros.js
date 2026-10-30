/* Los tableros del mahjong y sus reglas: qué ficha está libre y cómo se reparte para que siempre haya salida.

   Cada tablero se define por capas, en medias fichas: cada ficha ocupa 2 × 2 y z es la capa. «extra» suma fichas
   sueltas, como las tres puntas y la de arriba de la tortuga. Los cuatro de 80 a 100 fichas están pensados para el
   teléfono en horizontal (S-20); la tortuga clásica de 144 es la más grande, con fichas más chicas. El orden de la
   lista es el de las tarjetas del estuche; para sumar tableros se agregan acá (en el estuche se desliza de costado).

   Una ficha está libre si no tiene otra encima y le queda un costado despejado. El reparto quita pares libres al azar
   desde el tablero lleno y les asigna las caras: quitados en ese mismo orden, siempre tiene salida. */
window.Tableros = (() => {
  'use strict';
  const LISTA = [
    { id: 'mariposa', nombre: 'Mariposa', capas: [
      ['####....####', '#####..#####', '############', '############', '#####..#####', '####....####'],
      ['............', '.###....###.', '.###.##.###.', '.###.##.###.', '.###....###.', '............'],
      ['............', '............', '.....##.....', '.....##.....', '............', '............']] },
    { id: 'fortaleza', nombre: 'Fortaleza', capas: [
      Array(6).fill('##########'),
      ['##......##', '##......##', '..........', '..........', '##......##', '##......##'],
      ['#........#', '..........', '..........', '..........', '..........', '#........#']] },
    { id: 'puente', nombre: 'Puente', capas: [
      Array(4).fill('##############'),
      ['..............', '...########...', '...########...', '..............'],
      ['..............', '....######....', '....######....', '..............'],
      ['..............', '......##......', '......##......', '..............']] },
    { id: 'pagoda', nombre: 'Pagoda', capas: [
      Array(6).fill('##########'),
      ['..........', '..######..', '..######..', '..######..', '..######..', '..........'],
      ['..........', '..........', '....##....', '....##....', '..........', '..........']] },
    // la tortuga clásica: 87 abajo (con las tres puntas), 36, 16, 4 y una arriba de todo
    { id: 'tortuga', nombre: 'Tortuga', capas: [
      ['.############.', '...########...', '..##########..', '.############.', '.############.', '..##########..', '...########...', '.############.'],
      ['..............', '....######....', '....######....', '....######....', '....######....', '....######....', '....######....', '..............'],
      ['..............', '..............', '.....####.....', '.....####.....', '.....####.....', '.....####.....', '..............', '..............'],
      ['..............', '..............', '..............', '......##......', '......##......', '..............', '..............', '..............']],
      extra: [[0, 7, 0], [26, 7, 0], [28, 7, 0], [13, 7, 4]] },
  ];
  // las posiciones, de abajo hacia arriba y de atrás hacia adelante (el orden en que se dibujan)
  function armar(T) {
    const P = [];
    T.capas.forEach((filas, z) => filas.forEach((fila, r) => [...fila].forEach((ch, c) => { if (ch === '#') P.push({ x: 2 * c, y: 2 * r, z }); })));
    (T.extra || []).forEach(([x, y, z]) => P.push({ x, y, z }));
    return P.sort((a, b) => a.z - b.z || a.y - b.y || a.x - b.x);
  }
  LISTA.forEach(T => { T.P = armar(T); T.n = T.P.length; });
  const porId = id => LISTA.find(T => T.id === id) || LISTA[0];

  function libre(i, occ, P) {
    const t = P[i]; let izq = false, der = false;
    for (const j of occ) {
      if (j === i) continue;
      const u = P[j];
      if (u.z > t.z) { if (Math.abs(u.x - t.x) < 2 && Math.abs(u.y - t.y) < 2) return false; }
      else if (u.z === t.z && Math.abs(u.y - t.y) < 2) {
        if (u.x < t.x && u.x >= t.x - 2) izq = true;
        else if (u.x > t.x && u.x <= t.x + 2) der = true;
      }
    }
    return !(izq && der);
  }
  const azar = a => a[(Math.random() * a.length) | 0];
  function mezclar(a) { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
  // reparte quitando pares libres al azar desde lo que hay: en ese mismo orden, siempre tiene solución
  function repartir(pos, P, pares) {
    for (let intento = 0; intento < 300; intento++) {
      const occ = new Set(pos), orden = []; let ok = true;
      while (occ.size) {
        const libres = [...occ].filter(i => libre(i, occ, P));
        if (libres.length < 2) { ok = false; break; }
        const a = azar(libres), b = azar(libres.filter(i => i !== a));
        orden.push([a, b]); occ.delete(a); occ.delete(b);
      }
      if (!ok) continue;
      const pp = mezclar(pares.slice()), asign = {};
      orden.forEach(([a, b], k) => { asign[a] = pp[k][0]; asign[b] = pp[k][1]; });
      // la salida: los pares en el orden en que se quitaron (para las herramientas, que limpian el tablero sin jugarlo)
      Object.defineProperty(asign, 'salida', { value: orden.slice() });
      return asign;
    }
    return null;
  }
  // el juego completo son 72 pares: 34 caras con dos pares cada una, más las flores y las estaciones, que se juntan
  // entre sí; los tableros chicos toman una parte al azar
  function mazo(n) {
    const pares = [];
    Fichas.FACES.filter(f => f.key === f.id).forEach(f => pares.push([f.id, f.id], [f.id, f.id]));
    const fl = mezclar(['f1', 'f2', 'f3', 'f4']), es = mezclar(['e1', 'e2', 'e3', 'e4']);
    pares.push([fl[0], fl[1]], [fl[2], fl[3]], [es[0], es[1]], [es[2], es[3]]);
    return mezclar(pares).slice(0, n / 2);
  }
  function nuevo(T) {
    const pos = T.P.map((_, i) => i);
    let asign = null;
    while (!asign) asign = repartir(pos, T.P, mazo(pos.length));
    return asign;
  }
  // los pares libres que hay ahora
  function pares(occ, cara, P) {
    const by = {};
    for (const i of occ) if (libre(i, occ, P)) { const k = Fichas.FACE[cara[i]].key; (by[k] = by[k] || []).push(i); }
    return Object.values(by).filter(a => a.length >= 2).map(a => [a[0], a[1]]);
  }
  // barajar lo que queda: las mismas caras, repartidas de nuevo con salida; null si no hay forma
  function barajar(occ, cara, P) {
    const R = [...occ], by = {};
    R.forEach(i => { const f = cara[i], k = Fichas.FACE[f].key; (by[k] = by[k] || []).push(f); });
    const pp = [];
    Object.values(by).forEach(a => { for (let j = 0; j + 1 < a.length; j += 2) pp.push([a[j], a[j + 1]]); });
    return pp.length * 2 === R.length ? repartir(R, P, pp) : null;
  }
  return { LISTA, porId, libre, nuevo, pares, barajar, azar };
})();
