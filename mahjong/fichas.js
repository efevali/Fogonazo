/* Las 42 fichas del mahjong, dibujadas con código: cada una pide una cantidad exacta de círculos o bambúes y su
   ideograma correcto (el uno de bambú es el pajarito tradicional). Los ideogramas usan «Mahjong JP», un subconjunto de
   Noto Serif CJK JP Bold con solo los 27 que hacen falta (comun/fuentes/noto-serif-jp-mahjong-700.woff2).

   Fichas.FACES: [{ id, name, svg, key }]; key junta las flores entre sí y las estaciones entre sí.
   Fichas.defs(): los símbolos de las caras y el degradé del hueso, para poner una vez en la página.
   Fichas.cuerpo(id): el dibujo de una ficha de hueso con dorso verde (S-19): la cara, y el grosor (hueso sobre
   verde) hacia abajo a la derecha, y una sombra corta. Medidas en unidades de ficha: 36 × 48, más 4 de grosor.
   Los colores van por CSS en cada pantalla (.sombra, .dorso, .canto, .cara, .tinte). */
window.Fichas = (() => {
  'use strict';
  const AI = '#2B4C7E', SHU = '#B8392B', MID = '#2F6A52', INK = '#1F2A44';
  const JP = "'Mahjong JP','Noto Serif JP','Noto Serif CJK JP',serif";
  const r2 = n => +n.toFixed(2);
  function circ(cx, cy, r, c) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="1.15"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r2(r * 0.5)}" fill="currentColor" stroke="${INK}" stroke-width=".85"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r2(r * 0.17)}" fill="${c}"/>`;
  }
  function cana(cx, cy, h, c) {
    const w = 5.2, x = r2(cx - w / 2), y = r2(cy - h / 2);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.6" fill="${c}" stroke="${INK}" stroke-width="1.1"/>` +
      `<path d="M${x} ${cy}h${w}" stroke="${INK}" stroke-width="1"/>` +
      `<path d="M${cx} ${r2(y + 2.6)}v${r2(h / 2 - 4.4)}M${cx} ${r2(cy + 1.8)}v${r2(h / 2 - 4.4)}" stroke="currentColor" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/>`;
  }
  const PIN = {
    2: [[18, 13, 8, MID], [18, 35, 8, AI]],
    3: [[9, 10, 6.5, AI], [18, 24, 6.5, SHU], [27, 38, 6.5, MID]],
    4: [[10, 13, 7, AI], [26, 13, 7, MID], [10, 35, 7, MID], [26, 35, 7, AI]],
    5: [[9, 10, 6, AI], [27, 10, 6, MID], [18, 24, 6, SHU], [9, 38, 6, MID], [27, 38, 6, AI]],
    6: [[10, 9, 5.6, MID], [26, 9, 5.6, MID], [10, 27, 5.6, SHU], [26, 27, 5.6, SHU], [10, 40, 5.6, SHU], [26, 40, 5.6, SHU]],
    7: [[8, 7, 4.6, MID], [18, 11, 4.6, MID], [28, 15, 4.6, MID], [11, 28, 5, SHU], [25, 28, 5, SHU], [11, 40, 5, SHU], [25, 40, 5, SHU]],
    8: [[11, 7, 4.8, AI], [25, 7, 4.8, AI], [11, 18, 4.8, AI], [25, 18, 4.8, AI], [11, 30, 4.8, AI], [25, 30, 4.8, AI], [11, 41, 4.8, AI], [25, 41, 4.8, AI]],
    9: [9, 24, 39].flatMap((y, i) => [8, 18, 28].map(x => [x, y, 4.7, [AI, SHU, MID][i]])),
  };
  const SOU = {
    2: [[18, 13, 17, MID], [18, 35, 17, MID]],
    3: [[18, 13, 17, MID], [11, 35, 17, MID], [25, 35, 17, MID]],
    4: [[11, 13, 17, MID], [25, 13, 17, AI], [11, 35, 17, AI], [25, 35, 17, MID]],
    5: [[10, 13, 17, MID], [26, 13, 17, AI], [18, 24, 17, SHU], [10, 35, 17, AI], [26, 35, 17, MID]],
    6: [13, 35].flatMap(y => [8, 18, 28].map(x => [x, y, 17, MID])),
    7: [[18, 9, 12, SHU], ...[25, 39].flatMap(y => [8, 18, 28].map(x => [x, y, 12, MID]))],
    8: [13, 35].flatMap(y => [6, 14, 22, 30].map(x => [x, y, 17, MID])),
    9: [8, 24, 40].flatMap(y => [8, 18, 28].map(x => [x, y, 12, x === 18 ? SHU : MID])),
  };
  const PAJARO = `<g stroke="${INK}" stroke-width="1"><ellipse cx="9.5" cy="25" rx="2.4" ry="7" transform="rotate(-30 9.5 25)" fill="${SHU}"/><ellipse cx="7.5" cy="30.5" rx="2.4" ry="7" transform="rotate(-68 7.5 30.5)" fill="${AI}"/><ellipse cx="12" cy="21.5" rx="2.2" ry="6.5" transform="rotate(-8 12 21.5)" fill="${SHU}"/></g>` +
    `<path d="M17 37l-1 5M21 37l1 5" stroke="${SHU}" stroke-width="1.4" stroke-linecap="round"/>` +
    `<ellipse cx="19" cy="28" rx="8.5" ry="9" fill="${MID}" stroke="${INK}" stroke-width="1.2"/>` +
    `<path d="M13.5 27c4-4.5 9-3.5 11.5 1.5-4 3.5-8.5 3.5-11.5-1.5z" fill="${AI}" stroke="${INK}" stroke-width="1"/>` +
    `<path d="M26.6 15.2l4.4 1.4-4.4 1.8z" fill="${SHU}" stroke="${INK}" stroke-width=".8" stroke-linejoin="round"/>` +
    `<circle cx="22.5" cy="16.5" r="5" fill="${MID}" stroke="${INK}" stroke-width="1.2"/>` +
    `<circle cx="24" cy="15.6" r="1.2" fill="${INK}"/>`;
  const PIN1 = `<circle cx="18" cy="24" r="13.5" fill="${MID}" stroke="${INK}" stroke-width="1.4"/>` +
    Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `<circle cx="${r2(18 + 11.4 * Math.cos(a))}" cy="${r2(24 + 11.4 * Math.sin(a))}" r="1.15" fill="currentColor"/>`; }).join('') +
    `<circle cx="18" cy="24" r="9.2" fill="currentColor" stroke="${INK}" stroke-width="1"/><circle cx="18" cy="24" r="6.4" fill="${SHU}" stroke="${INK}" stroke-width="1"/>` +
    `<circle cx="18" cy="24" r="3.4" fill="currentColor" stroke="${INK}" stroke-width=".8"/><circle cx="18" cy="24" r="1.3" fill="${AI}"/>`;
  const txt = (s, y, size, c) => `<text x="18" y="${y}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${c}" font-family="${JP}">${s}</text>`;
  const NUMK = '一二三四五六七八九';
  const NUMES = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'];
  const FACES = [];
  for (let n = 1; n <= 9; n++) FACES.push({ id: 'p' + n, name: `${NUMES[n - 1]} de círculos`, svg: n === 1 ? PIN1 : PIN[n].map(a => circ(...a)).join('') });
  for (let n = 1; n <= 9; n++) FACES.push({ id: 's' + n, name: `${NUMES[n - 1]} de bambúes`, svg: n === 1 ? PAJARO : SOU[n].map(a => cana(...a)).join('') });
  for (let n = 1; n <= 9; n++) FACES.push({ id: 'm' + n, name: `${NUMES[n - 1]} de caracteres`, svg: txt(NUMK[n - 1], 21, 17, AI) + txt('萬', 42, 16, SHU) });
  [['we', '東', 'Viento del este'], ['ws', '南', 'Viento del sur'], ['ww', '西', 'Viento del oeste'], ['wn', '北', 'Viento del norte']]
    .forEach(([id, k, name]) => FACES.push({ id, name, svg: txt(k, 32, 25, INK) }));
  FACES.push({ id: 'dr', name: 'Dragón rojo', svg: txt('中', 33, 27, SHU) });
  FACES.push({ id: 'dg', name: 'Dragón verde', svg: txt('發', 32, 25, MID) });
  FACES.push({ id: 'dw', name: 'Dragón blanco', svg: `<rect x="6" y="8" width="24" height="32" rx="3" fill="none" stroke="${AI}" stroke-width="2.4"/><rect x="10" y="12" width="16" height="24" rx="1.5" fill="none" stroke="${AI}" stroke-width="1"/>` });
  const FLOR = `<g fill="${SHU}" stroke="${INK}" stroke-width=".7">` + Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return `<circle cx="${r2(18 + 3.6 * Math.cos(a))}" cy="${r2(14 + 3.6 * Math.sin(a))}" r="2.7"/>`; }).join('') + `</g><circle cx="18" cy="14" r="1.6" fill="currentColor" stroke="${INK}" stroke-width=".6"/>`;
  const SOL = `<circle cx="18" cy="14" r="4.6" fill="${SHU}" stroke="${INK}" stroke-width=".9"/>` + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<path d="M${r2(18 + 6.6 * Math.cos(a))} ${r2(14 + 6.6 * Math.sin(a))}L${r2(18 + 8.6 * Math.cos(a))} ${r2(14 + 8.6 * Math.sin(a))}" stroke="${SHU}" stroke-width="1.3" stroke-linecap="round"/>`; }).join('');
  [['f1', '梅', 'Flor de ciruelo'], ['f2', '蘭', 'Flor de orquídea'], ['f3', '菊', 'Flor de crisantemo'], ['f4', '竹', 'Flor de bambú']]
    .forEach(([id, k, name]) => FACES.push({ id, name, svg: FLOR + txt(k, 41, 15, MID), key: 'flor' }));
  [['e1', '春', 'Primavera'], ['e2', '夏', 'Verano'], ['e3', '秋', 'Otoño'], ['e4', '冬', 'Invierno']]
    .forEach(([id, k, name]) => FACES.push({ id, name, svg: SOL + txt(k, 41, 15, AI), key: 'est' }));
  const FACE = {};
  FACES.forEach(f => { f.key = f.key || f.id; FACE[f.id] = f; });

  const W = 36, H = 48, D = 4;
  const defs = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    ${FACES.map(f => `<symbol id="f-${f.id}" viewBox="0 0 36 48">${f.svg}</symbol>`).join('')}
    <linearGradient id="hueso" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#fbf6ea"/><stop offset="1" stop-color="#e9dcbd"/></linearGradient>
  </defs></svg>`;
  // the body of a tile; the face is a <use>, so a shuffle only changes its href
  const cuerpo = id => `<rect class="sombra" x="${D + 1.5}" y="${D + 3}" width="${W}" height="${H}" rx="6"/>
    <rect class="dorso" x="${D}" y="${D}" width="${W}" height="${H}" rx="5"/>
    <rect class="canto" x="${D / 2}" y="${D / 2}" width="${W}" height="${H}" rx="5"/>
    <rect class="cara" width="${W}" height="${H}" rx="5"/>
    <svg class="dibujo" x="2.5" y="3" width="31" height="42" viewBox="0 0 36 48"><use href="#f-${id}"/></svg>
    <rect class="tinte" width="${W}" height="${H}" rx="5"/>`;
  return { FACES, FACE, W, H, D, defs, cuerpo };
})();
