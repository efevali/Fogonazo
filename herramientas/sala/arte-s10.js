// Sketch S-10: specials and obstacles in the bench style, drawn with code.
// Each drawing lives in a 100 × 100 cell; art(kind, x, y, size) places it. It is a composition guide
// for the image request, not final art: the final pieces come from an image AI.
window.S10 = (() => {
  'use strict';
  const PIECE = t => `pieza${t}.png`;
  let uid = 0;

  const defs = `
  <defs>
    <filter id="s10glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="s10blue" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="b"/><feFlood flood-color="#2fc4ff"/><feComposite in2="b" operator="in" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="s10ember" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="b"/><feFlood flood-color="#ff6a10"/><feComposite in2="b" operator="in" result="c"/><feMerge><feMergeNode in="c"/><feMergeNode in="c"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="s10soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="s10drop" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="1.5" dy="3" stdDeviation="2" flood-color="#1a0d04" flood-opacity=".45"/></filter>
    <filter id="s10grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .04" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .18  0 0 0 0 .09  0 0 0 0 .03  0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <linearGradient id="s10cu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2b07a"/><stop offset=".45" stop-color="#cf7a3e"/><stop offset="1" stop-color="#94471c"/></linearGradient>
    <linearGradient id="s10cuIn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b8602a"/><stop offset="1" stop-color="#e59a62"/></linearGradient>
    <radialGradient id="s10tin" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="#dfe3e6"/><stop offset=".7" stop-color="#9aa1a7"/><stop offset="1" stop-color="#6b7177"/></radialGradient>
    <radialGradient id="s10brass" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff2b8"/><stop offset=".5" stop-color="#c9a13e"/><stop offset="1" stop-color="#7a5a14"/></radialGradient>
    <radialGradient id="s10hot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".95"/><stop offset=".45" stop-color="#ff9a2e" stop-opacity=".7"/><stop offset="1" stop-color="#ff5a10" stop-opacity="0"/></radialGradient>
    <radialGradient id="s10scorch" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2a1a10" stop-opacity=".75"/><stop offset=".55" stop-color="#5a3518" stop-opacity=".45"/><stop offset="1" stop-color="#7a4a20" stop-opacity="0"/></radialGradient>
    <radialGradient id="s10char" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#4a3e36"/><stop offset=".6" stop-color="#211a16"/><stop offset="1" stop-color="#0f0c0a"/></radialGradient>
    <linearGradient id="s10steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9dde0"/><stop offset=".5" stop-color="#8d949a"/><stop offset="1" stop-color="#4e5459"/></linearGradient>
    <radialGradient id="s10soot" cx=".55" cy=".5" r=".6"><stop offset="0" stop-color="#120e0b" stop-opacity=".9"/><stop offset=".6" stop-color="#2a2420" stop-opacity=".6"/><stop offset="1" stop-color="#2a2420" stop-opacity="0"/></radialGradient>
    <linearGradient id="s10bat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1c1c1e"/><stop offset=".2" stop-color="#3b3b3f"/><stop offset=".55" stop-color="#2a2a2d"/><stop offset="1" stop-color="#121214"/></linearGradient>
    <linearGradient id="s10gloss" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".35"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="s10glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8f2f4" stop-opacity=".55"/><stop offset=".22" stop-color="#ffffff" stop-opacity=".75"/><stop offset=".35" stop-color="#cfe2e6" stop-opacity=".18"/><stop offset=".85" stop-color="#cfe2e6" stop-opacity=".22"/><stop offset="1" stop-color="#e8f2f4" stop-opacity=".5"/></linearGradient>
    <linearGradient id="s10getter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6e9ec"/><stop offset=".6" stop-color="#7d858c"/><stop offset="1" stop-color="#3f454a" stop-opacity=".3"/></linearGradient>
    <linearGradient id="s10bake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3022"/><stop offset="1" stop-color="#1e120b"/></linearGradient>
    <linearGradient id="s10wood" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#7c4523"/><stop offset=".5" stop-color="#6a3a1c"/><stop offset="1" stop-color="#5a3016"/></linearGradient>
    <linearGradient id="s10shadowT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#140902" stop-opacity=".7"/><stop offset="1" stop-color="#140902" stop-opacity="0"/></linearGradient>
    <linearGradient id="s10shadowL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#140902" stop-opacity=".6"/><stop offset="1" stop-color="#140902" stop-opacity="0"/></linearGradient>
  </defs>`;

  const g = (x, y, s, body, extra = '') => `<g transform="translate(${x} ${y}) scale(${s / 100})" ${extra}>${body}</g>`;
  const piece = (t, base) => `<image href="${base}${PIECE(t)}" x="2" y="2" width="96" height="96" preserveAspectRatio="xMidYMid meet"/>`;

  const D = {
    // ---------- specials ----------
    // Lightning: the component plus two pairs of electric chevrons that point where it sweeps.
    rayoH: () => {
      const ch = (x, d) => `<path d="M${x},30 l${11 * d},20 l${-11 * d},20" stroke="#f2fdff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      return `<rect x="-2" y="44" width="104" height="12" rx="6" fill="#7fdcff" opacity=".35" filter="url(#s10soft)"/>
        <g filter="url(#s10blue)">${ch(13, -1)}${ch(87, 1)}</g>
        <g filter="url(#s10blue)" opacity=".7">${ch(24, -1).replace('stroke-width="6"', 'stroke-width="4"')}${ch(76, 1).replace('stroke-width="6"', 'stroke-width="4"')}</g>`;
    },
    rayoV: () => `<g transform="rotate(90 50 50)">${D.rayoH()}</g>`,
    // Overload: the component glowing hot, with a few sparks.
    sobreUnder: () => `<circle cx="50" cy="52" r="58" fill="url(#s10hot)"/><circle cx="50" cy="52" r="40" fill="url(#s10hot)"/>`,
    sobreOver: () => `<g filter="url(#s10ember)">${[[16, 18], [86, 22], [12, 80], [88, 84], [50, 6]].map(([x, y], i) => `<path d="M${x - 4},${y} h8 M${x},${y - 4} v8" stroke="#fff4c8" stroke-width="${i % 2 ? 2 : 2.6}" stroke-linecap="round"/>`).join('')}</g>
      <path d="M30,8 q4,-6 0,-12 M50,4 q4,-6 0,-12 M70,8 q4,-6 0,-12" stroke="#ffd59a" stroke-width="1.6" fill="none" opacity=".5"/>`,
    // Battery: a 9 V battery whose label has the seven component colors.
    bateria: () => {
      const cols = ['#e07a2a', '#2f6fd6', '#e33a2c', '#3e9a4a', '#7a4bb3', '#e7b52a', '#b9c0c6'];
      const band = cols.map((c, i) => `<rect x="${29 + i * 6}" y="40" width="6.2" height="36" fill="${c}"/>`).join('');
      return `<g filter="url(#s10drop)" transform="translate(50 56) scale(1.18) translate(-50 -56)">
        <rect x="27" y="22" width="46" height="70" rx="4" fill="url(#s10bat)"/>
        ${band}
        <rect x="29" y="40" width="42" height="36" fill="url(#s10gloss)"/>
        <rect x="29" y="38" width="42" height="2" fill="#d9d9d9" opacity=".6"/><rect x="29" y="76" width="42" height="2" fill="#d9d9d9" opacity=".6"/>
        <text x="50" y="88" text-anchor="middle" font-family="Barlow, sans-serif" font-weight="700" font-size="9" fill="#e9e5dc">9V</text>
        <rect x="27" y="18" width="46" height="8" rx="2" fill="#5a5d61"/>
        <path d="M34,18 v-8 h12 v8 z" fill="url(#s10steel)"/><path d="M35,10 l4,-3 h4 l4,3 z" fill="#c9cdd1"/>
        <rect x="55" y="9" width="11" height="9" rx="4" fill="url(#s10steel)"/><circle cx="60.5" cy="10" r="3.5" fill="#e6e9ec"/>
        <rect x="31" y="24" width="4" height="64" rx="2" fill="#fff" opacity=".18"/>
      </g>`;
    },
    // Antenna: the component with a short telescopic whip and two wave arcs.
    antena: () => `<g filter="url(#s10drop)">
        <circle cx="70" cy="44" r="5.5" fill="#4a4e53"/><circle cx="70" cy="44" r="3.2" fill="#c9cdd1"/>
        <path d="M70,44 L77,26" stroke="#2f3236" stroke-width="7.5" stroke-linecap="round"/><path d="M70,44 L77,26" stroke="#d3d7da" stroke-width="5" stroke-linecap="round"/>
        <path d="M77,26 L82,13" stroke="#2f3236" stroke-width="5.6" stroke-linecap="round"/><path d="M77,26 L82,13" stroke="#e6e9ec" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M82,13 L85,5" stroke="#2f3236" stroke-width="4" stroke-linecap="round"/><path d="M82,13 L85,5" stroke="#f5f6f7" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="85.5" cy="4.5" r="4" fill="#eef0f2" stroke="#2f3236" stroke-width="1.3"/></g>
      <g filter="url(#s10blue)" fill="none" stroke="#f2fdff" stroke-linecap="round"><path d="M76,-3 A11,11 0 0 0 76,12" stroke-width="3"/><path d="M95,-3 A11,11 0 0 1 95,12" stroke-width="3"/>
        <path d="M69,-8 A18,18 0 0 0 69,17" stroke-width="2.4" opacity=".6"/><path d="M102,-8 A18,18 0 0 1 102,17" stroke-width="2.4" opacity=".6"/></g>`,

    // ---------- obstacles ----------
    // Copper pad under a component: one pass solders it.
    pad1: () => `<rect x="3" y="3" width="94" height="94" rx="9" fill="url(#s10cu)"/><rect x="9" y="9" width="82" height="82" rx="6" fill="none" stroke="url(#s10cuIn)" stroke-width="3"/>
      <circle cx="50" cy="50" r="13" fill="#7e3a14"/><circle cx="50" cy="50" r="7" fill="#1a0c05"/><path d="M8,22 Q30,10 60,8" stroke="#ffe0bf" stroke-width="2.5" fill="none" opacity=".6" stroke-linecap="round"/>`,
    // Riveted pad: two passes (the first takes the rivets off).
    pad2: () => D.pad1() + [[14, 14], [86, 14], [14, 86], [86, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y + 1.5}" r="7" fill="#3a1c08" opacity=".5"/><circle cx="${x}" cy="${y}" r="6.5" fill="url(#s10brass)"/><circle cx="${x}" cy="${y}" r="2.2" fill="#4a3608"/>`).join(''),
    // Soldered pad: tinned, shiny.
    padOk: () => `<rect x="3" y="3" width="94" height="94" rx="9" fill="#b8bdc1"/><rect x="5" y="5" width="90" height="90" rx="8" fill="url(#s10tin)"/>
      <ellipse cx="34" cy="28" rx="18" ry="8" fill="#fff" opacity=".55" transform="rotate(-20 34 28)"/>`,
    // Burnt component: a charred, cracked blob with a scorch mark on the board. One hit.
    quem1: () => `<circle cx="50" cy="54" r="50" fill="url(#s10scorch)"/>
      <path d="M22,62 C14,44 26,22 46,20 C66,16 84,30 80,52 C86,70 70,86 50,84 C34,86 20,78 22,62 Z" fill="url(#s10char)" filter="url(#s10drop)"/>
      <path d="M36,34 L44,48 L40,62 L52,72 M60,30 L56,44 L68,56 M44,48 L58,46" stroke="#6b5e55" stroke-width="2" fill="none" stroke-linejoin="round"/>
      <g filter="url(#s10ember)">${[[44, 48], [56, 44], [52, 71], [68, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#ff7a2a"/>`).join('')}</g>
      <path d="M40,26 C46,22 56,22 62,25" stroke="#8a7d72" stroke-width="2" fill="none" opacity=".6"/>`,
    // Burnt component in a metal can (a TO-3 power transistor): two hits; the first leaves quem1.
    quem2: () => `<circle cx="50" cy="54" r="50" fill="url(#s10scorch)"/>
      <g filter="url(#s10drop)"><path d="M6,50 C6,40 16,34 26,34 L74,34 C84,34 94,40 94,50 C94,60 84,66 74,66 L26,66 C16,66 6,60 6,50 Z" fill="url(#s10steel)" transform="translate(0 4)"/>
      <circle cx="50" cy="54" r="24" fill="url(#s10steel)"/><circle cx="50" cy="54" r="24" fill="none" stroke="#3f4549" stroke-width="1.5"/>
      <circle cx="50" cy="54" r="24" fill="url(#s10soot)"/>
      ${[[17, 54], [83, 54]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#c8ccd0" stroke="#4e5459" stroke-width="1.2"/><path d="M${x - 4},${y} h8" stroke="#4e5459" stroke-width="1.8"/>`).join('')}</g>
      <path d="M40,46 L48,56 L45,66 M56,44 L54,54 L62,60" stroke="#7a6e66" stroke-width="1.8" fill="none"/>
      <g filter="url(#s10ember)"><circle cx="48" cy="56" r="2.2" fill="#ff7a2a"/><circle cx="54" cy="54" r="1.8" fill="#ff7a2a"/></g>
      <ellipse cx="42" cy="40" rx="10" ry="4" fill="#fff" opacity=".35" transform="rotate(-18 42 40)"/>`,
    // Kapton tape over a component: two crossed amber strips. A line including it peels it off.
    kapton: () => [-45, 45].map(a => `<g transform="rotate(${a} 50 50)"><rect x="-6" y="40" width="112" height="20" fill="#d9891e" opacity=".55"/>
      <rect x="-6" y="40" width="112" height="2" fill="#ffd9a0" opacity=".8"/><rect x="-6" y="58" width="112" height="2" fill="#8a4c08" opacity=".5"/>
      <rect x="-6" y="44" width="112" height="3" fill="#fff" opacity=".22"/></g>`).join(''),
    // Valve: a glass vacuum tube with a glowing filament; it must reach the bottom row (the socket).
    valvula: () => `<circle cx="50" cy="50" r="40" fill="#ffa040" opacity=".35" filter="url(#s10soft)"/><g filter="url(#s10drop)" transform="translate(50 54) scale(1.3 1.12) translate(-50 -54)">
        ${[38, 46, 54, 62].map(x => `<rect x="${x - 1.2}" y="88" width="2.4" height="9" fill="#c9cdd1"/>`).join('')}
        <path d="M30,78 h40 v10 a4,4 0 0 1 -4,4 h-32 a4,4 0 0 1 -4,-4 z" fill="url(#s10bake)"/>
        <rect x="38" y="36" width="24" height="34" rx="2" fill="#5d646a"/><rect x="40" y="38" width="20" height="30" fill="#3d4247"/>
        <rect x="46.5" y="32" width="7" height="40" fill="#ffc070" filter="url(#s10ember)"/><rect x="48.8" y="34" width="2.4" height="36" fill="#fff4d0"/>
        <path d="M28,80 V30 C28,14 38,8 50,8 C62,8 72,14 72,30 V80 Z" fill="url(#s10glass)" stroke="#ffffff" stroke-opacity=".55" stroke-width="1.5"/>
        <path d="M30,30 C30,16 40,10 50,10 C60,10 70,16 70,30 C64,24 36,24 30,30 Z" fill="url(#s10getter)" opacity=".9"/>
        <rect x="33" y="30" width="5" height="46" rx="2.5" fill="#fff" opacity=".45"/>
      </g>
      `,
    // Hole: no protoboard there; the walnut bench shows through, with the board's cut edge.
    hueco: () => `<rect x="0" y="0" width="100" height="100" fill="url(#s10wood)"/><rect x="0" y="0" width="100" height="100" fill="#000" filter="url(#s10grain)" opacity=".9"/>`,
  };

  // a 100 × 100 cell drawing; kinds: rayoH, rayoV, sobre, bateria, antena, pad1, pad2, padOk, quem1, quem2, kapton, valvula, hueco
  function cell(kind, x, y, s, t, base = '') {
    const P = t === undefined ? '' : piece(t, base);
    let b = '';
    switch (kind) {
      case 'rayoH': case 'rayoV': b = P + D[kind](); break;
      case 'sobre': b = D.sobreUnder() + P + `<rect x="6" y="6" width="88" height="88" fill="#ff7a20" opacity=".18" style="mix-blend-mode:color"/>` + D.sobreOver(); break;
      case 'antena': b = P + D.antena(); break;
      case 'pad1': case 'pad2': case 'padOk': b = D[kind]() + P; break;
      case 'kapton': b = P + D.kapton(); break;
      default: b = D[kind]();
    }
    return g(x, y, s, b);
  }
  // the board's cut edge around a set of hole cells (shadow cast onto the wood)
  function holeEdges(cells, C, ox = 0, oy = 0) {
    const has = (r, c) => cells.some(([rr, cc]) => rr === r && cc === c);
    let s = '';
    for (const [r, c] of cells) {
      const x = ox + c * C, y = oy + r * C;
      // grain
      for (let i = 0; i < 6; i++) { const yy = y + C * (.12 + i * .16) + (c % 2) * 2; s += `<path d="M${x},${yy} q${C * .5},${(i % 2 ? 1.6 : -1.4)} ${C},${i % 3 - 1}" stroke="#3e1f0c" stroke-width=".7" fill="none" opacity=".45"/>`; }
      // the board (about 2 mm thick) casts a shadow on the wood below and to the right of its edges
      if (!has(r - 1, c)) s += `<rect x="${x}" y="${y}" width="${C}" height="${C * .2}" fill="url(#s10shadowT)"/><rect x="${x}" y="${y}" width="${C}" height="1.6" fill="#f6f2ea"/>`;
      if (!has(r, c - 1)) s += `<rect x="${x}" y="${y}" width="${C * .16}" height="${C}" fill="url(#s10shadowL)"/><rect x="${x}" y="${y}" width="1.4" height="${C}" fill="#f6f2ea"/>`;
      if (!has(r + 1, c)) s += `<rect x="${x}" y="${y + C - 3}" width="${C}" height="3" fill="#d9d2c4"/><rect x="${x}" y="${y + C - 3}" width="${C}" height=".8" fill="#8a8274"/>`;
      if (!has(r, c + 1)) s += `<rect x="${x + C - 2.6}" y="${y}" width="2.6" height="${C}" fill="#cfc7b8"/><rect x="${x + C - 2.6}" y="${y}" width=".8" height="${C}" fill="#8a8274"/>`;
    }
    return s;
  }
  // the socket for valves: a bakelite strip with octal sockets along the bottom edge of the board
  function zocalo(x, y, w, C) {
    let s = `<g filter="url(#s10drop)"><rect x="${x}" y="${y}" width="${w}" height="${C * .24}" rx="2" fill="url(#s10bake)"/>`;
    for (let i = 0; i < w / C; i++) { const cx = x + C * (i + .5), cy = y + C * .12; s += `<circle cx="${cx}" cy="${cy}" r="${C * .08}" fill="#120a06"/><circle cx="${cx}" cy="${cy}" r="${C * .08}" fill="none" stroke="#7a5a3a" stroke-width=".8"/>`; }
    return s + '</g>';
  }
  return { defs, cell, holeEdges, zocalo, D };
})();
