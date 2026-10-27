// Draws the S-10 sketch over the Fogonazo mockup match (fogonazo/index.html).
// Load arte-s10.js first, then call S10scene('especiales' | 'obstaculos').
window.S10scene = (which) => {
  'use strict';
  const C = 45, board = document.getElementById('board'), stage = document.getElementById('stage');
  const types = window.__maqueta.state().types;   // grid of types, [row][col]
  const pieces = [...board.querySelectorAll('.piece')];
  const pieceAt = (r, c) => pieces[r * 10 + c];
  const hide = (r, c) => { const p = pieceAt(r, c); if (p) p.style.visibility = 'hidden'; };
  const at = (kind, r, c, withPiece = true) => { hide(r, c); return S10.cell(kind, c * C, r * C, C, withPiece ? types[r][c] : undefined, 'piezas/'); };

  let under = '', over = '', outside = '';
  if (which === 'especiales') {
    over += at('rayoH', 1, 2) + at('rayoV', 2, 7) + at('sobre', 5, 3) + at('bateria', 4, 6, false) + at('antena', 6, 8);
  } else {
    // pads under a block of pieces, in the three states
    [[6, 1, 'pad1'], [6, 2, 'pad1'], [6, 3, 'pad2'], [7, 1, 'pad2'], [7, 2, 'padOk'], [7, 3, 'pad1']].forEach(([r, c, k]) => { under += at(k, r, c); });
    over += at('quem1', 2, 4, false) + at('quem2', 2, 5, false) + at('quem1', 3, 5, false);
    over += at('kapton', 4, 7) + at('kapton', 4, 8);
    over += at('valvula', 1, 8, false) + at('valvula', 3, 1, false);
    // holes in the top-left corner
    const holes = [[0, 0], [0, 1], [1, 0]];
    holes.forEach(([r, c]) => { hide(r, c); under += S10.cell('hueco', c * C, r * C, C); });
    under += S10.holeEdges(holes, C);
    outside += S10.zocalo(232.5 + 4, 26 + 8 * C + 1, 10 * C - 8, C, 'piezas/');
  }
  const mk = (html, z, box) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', box); s.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:${z}`;
    s.innerHTML = S10.defs + html; return s;
  };
  board.insertBefore(mk(under, 0, '0 0 450 360'), board.firstChild);
  board.appendChild(mk(over, 2, '0 0 450 360'));
  pieces.forEach(p => { p.style.zIndex = 1; });
  if (outside) { const s = mk(outside, 3, '0 0 915 412'); stage.insertBefore(s, document.getElementById('light')); }
};
