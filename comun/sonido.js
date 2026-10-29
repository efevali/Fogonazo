/* El sonido de la colección, sintetizado con WebAudio: sin archivos de audio.
   - Voces básicas (pulso, triangular, ruido y FM de dos operadores), con las que se arman los efectos y la música.
   - Los efectos y los cuatro temas de Fogonazo (Placa, Taller, Urgente y Siesta), su sonido de siempre.
   - La lluvia de la sala: un colchón de ruido rosa apagado y gotitas en el vidrio.
   - Un solo juego de volúmenes para toda la colección (música, efectos y lluvia, de 0 a 10), guardado en Chrome.
   Vive en la página contenedora (index.html), así que no se corta al pasar de una pantalla a otra. */
const Sound = (() => {
  let ctx = null, master, sfxBus, musicBus, rainBus, noiseBuf;
  // volúmenes de 0 a 10; con los de entrada, los efectos y la música suenan como en el Fogonazo publicado (70 y 35 %)
  // y la lluvia queda de fondo
  const CLAVE = 'coleccion.sonido';
  const vol = { musica: 7, efectos: 8, lluvia: 7 };
  try { const v = JSON.parse(localStorage.getItem(CLAVE)); if (v) for (const k in vol) if (Number.isFinite(v[k])) vol[k] = Math.max(0, Math.min(10, Math.round(v[k]))); } catch (e) {}
  const set = { sfx: 0.7, music: 0.35, mute: false };
  const fromVol = () => { set.sfx = vol.efectos / 10 * 0.875; set.music = vol.musica / 10 * 0.5; };
  fromVol();
  const last = {};
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const N = s => { const m = /^([A-G])([#b]?)(-?\d)$/.exec(s); return 12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); };
  let pulseWaves = null;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return true; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
    master = ctx.createGain(); master.gain.value = 1.035;   // 0.3.0: +15 % (antes 0.9)
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    sfxBus = ctx.createGain(); musicBus = ctx.createGain(); rainBus = ctx.createGain(); rainBus.gain.value = 0;
    sfxBus.connect(master); musicBus.connect(master); master.connect(comp); comp.connect(ctx.destination); rainBus.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    pulseWaves = {};
    for (const duty of [0.125, 0.25, 0.5]) {
      const n = 48, re = new Float32Array(n), im = new Float32Array(n);
      for (let k = 1; k < n; k++) { re[k] = Math.sin(2 * Math.PI * k * duty) / (Math.PI * k); im[k] = (1 - Math.cos(2 * Math.PI * k * duty)) / (Math.PI * k); }
      pulseWaves[duty] = ctx.createPeriodicWave(re, im);
    }
    apply();
    return true;
  }
  function apply() {
    if (!ctx) return;
    const m = set.mute ? 0 : 1;
    sfxBus.gain.setTargetAtTime(set.sfx * m, ctx.currentTime, 0.02);
    musicBus.gain.setTargetAtTime(set.music * 0.6 * m * (Music.ducked ? 0.3 : 1), ctx.currentTime, 0.05);
    if (set.music * m > 0) Music.resume(); else Music.halt();
    Rain.apply();
  }
  function throttle(name, ms) {
    const now = performance.now();
    if (last[name] && now - last[name] < ms) return false;
    last[name] = now; return true;
  }

  // ------------------------------------------------------------ voces básicas
  function out(dest, pan) {
    if (!pan || !ctx.createStereoPanner) return dest;
    const p = ctx.createStereoPanner(); p.pan.value = pan; p.connect(dest); return p;
  }
  function env(g, t, a, peak, dec, sus, end, rel) {
    const tA = Math.max(t + 0.001, Math.min(t + a, end));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, tA);
    let lvl = peak, tD = tA;
    if (dec && end > tA) {
      tD = Math.min(tA + dec, end);
      lvl = Math.max(0.0001, peak * Math.pow(sus, (tD - tA) / dec));
      g.gain.exponentialRampToValueAtTime(lvl, tD);
    }
    if (end > tD) g.gain.setValueAtTime(lvl, end);
    g.gain.exponentialRampToValueAtTime(0.0001, Math.max(end, tD) + rel);
  }
  function tone(o) {
    const t = o.at !== undefined ? o.at : ctx.currentTime + (o.t || 0);
    const osc = ctx.createOscillator(), g = ctx.createGain();
    if (o.duty) osc.setPeriodicWave(pulseWaves[o.duty]); else osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + (o.slide || o.dur));
    if (o.vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.5; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(o.f * 0.012, t + Math.min(0.35, o.dur * 0.6)); l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + o.dur + 0.1); }
    const v = o.vol || 0.15;
    if (o.hold) env(g, t, o.attack || 0.004, v, o.dec || 0, o.sus || 1, t + o.dur, o.rel || 0.04);
    else { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur); }
    osc.connect(g); g.connect(out(o.dest || sfxBus, o.pan));
    osc.start(t); osc.stop(t + o.dur + (o.rel || 0.04) + 0.05);
  }
  function noise(o) {
    const t = o.at !== undefined ? o.at : ctx.currentTime + (o.t || 0);
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = o.filter || 'lowpass';
    f.frequency.setValueAtTime(o.freq || 1000, t);
    if (o.freq2) f.frequency.exponentialRampToValueAtTime(o.freq2, t + o.dur);
    f.Q.value = o.q || 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.15, t + (o.attack || 0.003));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(f); f.connect(g); g.connect(out(o.dest || sfxBus, o.pan));
    src.start(t, Math.random() * 0.5); src.stop(t + o.dur + 0.03);
  }
  // FM de 2 operadores: modulador → frecuencia del portador. index = desvío / frecuencia del modulador.
  function fm(o) {
    const t = o.at !== undefined ? o.at : ctx.currentTime + (o.t || 0);
    const f = o.f, ratio = o.ratio || 1, fmf = f * ratio;
    const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    car.type = o.car || 'sine'; mod.type = o.mod || 'sine';
    car.frequency.setValueAtTime(f, t);
    if (o.f2) car.frequency.exponentialRampToValueAtTime(o.f2, t + (o.slide || o.dur));
    if (o.detune) car.detune.value = o.detune;
    mod.frequency.setValueAtTime(fmf, t);
    if (o.f2) mod.frequency.exponentialRampToValueAtTime(o.f2 * ratio, t + (o.slide || o.dur));
    const i0 = (o.index || 2) * fmf, i1 = (o.indexEnd !== undefined ? o.indexEnd : (o.index || 2) * 0.3) * fmf;
    mg.gain.setValueAtTime(i0, t);
    mg.gain.exponentialRampToValueAtTime(Math.max(0.01, i1), t + (o.indexTime || 0.15));
    mod.connect(mg); mg.connect(car.frequency);
    if (o.vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.01, t + Math.min(0.3, o.dur * 0.6)); l.connect(lg); lg.connect(car.frequency); l.start(t); l.stop(t + o.dur + 0.2); }
    const rel = o.rel || 0.08;
    env(g, t, o.attack || 0.004, o.vol || 0.12, o.dec || 0, o.sus === undefined ? 1 : o.sus, t + o.dur, rel);
    car.connect(g); g.connect(out(o.dest || sfxBus, o.pan));
    if (o.send) g.connect(o.send);
    car.start(t); mod.start(t); car.stop(t + o.dur + rel + 0.05); mod.stop(t + o.dur + rel + 0.05);
  }

  // ------------------------------------------------------------ efectos
  const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5, 1568];
  const FX8 = {
    click() { tone({ f: 1400, dur: 0.03, vol: 0.06 }); },
    swap() { tone({ f: 520, f2: 820, dur: 0.07, vol: 0.07, duty: 0.25 }); },
    bad() { tone({ f: 190, dur: 0.09, vol: 0.09 }); tone({ f: 150, t: 0.1, dur: 0.12, vol: 0.09 }); },
    match(c) {
      const k = Math.min(PENTA.length - 1, (c || 1) - 1);
      tone({ f: PENTA[k], dur: 0.14, vol: 0.09, duty: 0.25 });
      tone({ f: PENTA[k] / 2, dur: 0.18, vol: 0.08, type: 'triangle' });
      noise({ dur: 0.04, vol: 0.05, filter: 'highpass', freq: 5000 });
    },
    special() { [0, 0.05, 0.1].forEach((t, i) => tone({ f: [660, 880, 1320][i], t, dur: 0.08, vol: 0.07, duty: 0.125 })); },
    beam() { tone({ f: 1800, f2: 160, dur: 0.28, vol: 0.06, type: 'sawtooth' }); noise({ dur: 0.25, vol: 0.09, filter: 'bandpass', freq: 3000, freq2: 600, q: 2 }); },
    blast() { noise({ dur: 0.45, vol: 0.22, filter: 'lowpass', freq: 1400, freq2: 120 }); tone({ f: 140, f2: 40, dur: 0.35, vol: 0.18, type: 'triangle' }); },
    zap() { tone({ f: 300, f2: 2400, dur: 0.35, vol: 0.06, duty: 0.125 }); for (let i = 0; i < 5; i++) noise({ t: i * 0.06, dur: 0.04, vol: 0.08, filter: 'highpass', freq: 2500 }); },
    ant() { [0, 0.07, 0.14].forEach(t => tone({ f: 1568, f2: 2093, t, dur: 0.05, vol: 0.06, duty: 0.25 })); tone({ f: 2400, f2: 600, t: 0.2, dur: 0.18, vol: 0.04, duty: 0.125 }); },
    nova() { tone({ f: 80, f2: 1600, dur: 0.6, vol: 0.08, duty: 0.5 }); noise({ dur: 0.8, vol: 0.2, filter: 'lowpass', freq: 3000, freq2: 100 }); },
    solder() { noise({ dur: 0.22, vol: 0.05, filter: 'bandpass', freq: 5200, q: 3 }); tone({ f: 2100, dur: 0.05, vol: 0.025, type: 'triangle' }); },
    crack() { noise({ dur: 0.12, vol: 0.14, filter: 'lowpass', freq: 900 }); tone({ f: 95, dur: 0.1, vol: 0.1 }); },
    rip() { noise({ dur: 0.16, vol: 0.1, filter: 'highpass', freq: 600, freq2: 6000 }); },
    tube() { tone({ f: 220, dur: 0.18, vol: 0.06, type: 'triangle' }); [880, 1108.7, 1318.5].forEach((f, i) => tone({ f, t: 0.08 + i * 0.07, dur: 0.12, vol: 0.05, duty: 0.25 })); },
    shuffle() { noise({ dur: 0.5, vol: 0.08, filter: 'bandpass', freq: 400, freq2: 3000, q: 1.5 }); },
    star(i) { const f = [988, 1175, 1568][i] || 988; tone({ f, dur: 0.3, vol: 0.08, duty: 0.25 }); tone({ f: f * 2, t: 0.06, dur: 0.2, vol: 0.04, duty: 0.125 }); },
    win() { [523, 659, 784, 1047].forEach((f, i) => { tone({ f, t: i * 0.11, dur: 0.16, vol: 0.08, duty: 0.25 }); tone({ f: f / 2, t: i * 0.11, dur: 0.2, vol: 0.06, type: 'triangle' }); }); tone({ f: 1047, t: 0.46, dur: 0.5, vol: 0.07, duty: 0.25 }); },
    lose() { [392, 330, 262, 196].forEach((f, i) => tone({ f, t: i * 0.16, dur: 0.2, vol: 0.08, type: 'triangle' })); },
    warn() { tone({ f: 1760, dur: 0.05, vol: 0.05, duty: 0.5 }); },
    bonus(i) { tone({ f: 660 * Math.pow(1.06, i || 0), dur: 0.06, vol: 0.05, duty: 0.125 }); },
    goal() { tone({ f: 1318.5, dur: 0.08, vol: 0.06, duty: 0.25 }); tone({ f: 1760, t: 0.08, dur: 0.12, vol: 0.06, duty: 0.25 }); },
  };

  function play(name, arg, gap) {
    if (!ctx || set.mute || set.sfx <= 0) return;
    if (!throttle(name, gap === undefined ? 35 : gap)) return;
    try { FX8[name](arg); } catch (e) {}
  }

  // ------------------------------------------------------------ música
  // Temas de 4 compases (64 semicorcheas). "Placa" es el tema original del juego;
  // "Taller" (mapa) y "Urgente" (contrarreloj) salen de la misma familia.
  // "Siesta" (modo zen) es más tranquilo: tonalidad mayor, acordes con séptima, sin hi-hats seguidos,
  // bajo largo e instrumentos suaves (soft: true, ver ARR['8s']).
  const SONGS = {
    map: {
      name: 'Taller', bpm: 92,
      chords: [['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4']],
      roots: ['C3', 'G2', 'A2', 'F2'],
      bass: [0, 6, 8, 14], bassLen: 1.8, octave: [],
      arpEvery: 2, hats: [2, 6, 10, 14], hatAccent: [], kick: [], snare: [], leadPasses: 'odd',
      lead: [[0, 'E5', 4], [4, 'G5', 2], [6, 'E5', 2], [8, 'D5', 4], [12, 'C5', 4],
        [16, 'D5', 2], [18, 'B4', 2], [20, 'D5', 4], [24, 'G5', 6],
        [32, 'C5', 2], [34, 'E5', 2], [36, 'A5', 4], [40, 'G5', 2], [42, 'E5', 2], [44, 'C5', 4],
        [48, 'A4', 2], [50, 'C5', 2], [52, 'F5', 4], [56, 'E5', 3], [60, 'D5', 4]],
    },
    game: {
      name: 'Placa', bpm: 104,
      chords: [['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4']],
      roots: ['A2', 'F2', 'C3', 'G2'],
      bass: [0, 6, 8, 14], bassLen: 1.8, octave: [],
      arpEvery: 1, hats: [0, 2, 4, 6, 8, 10, 12, 14], hatAccent: [2, 6, 10, 14], kick: [], snare: [], leadPasses: 'odd',
      lead: [[0, 'E5', 2], [4, 'G5', 2], [8, 'A5', 3], [14, 'G5', 2],
        [16, 'F5', 2], [20, 'E5', 2], [24, 'C5', 4],
        [32, 'E5', 2], [36, 'G5', 2], [40, 'C6', 3], [46, 'B5', 2],
        [48, 'A5', 2], [52, 'G5', 2], [56, 'D5', 4]],
    },
    timed: {
      name: 'Urgente', bpm: 144,
      chords: [['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['D4', 'F4', 'A4'], ['E3', 'G#3', 'B3']],
      roots: ['A2', 'F2', 'D3', 'E2'],
      bass: [0, 2, 4, 6, 8, 10, 12, 14], bassLen: 1.3, octave: [2, 6, 10, 14],
      arpEvery: 1, hats: [0, 2, 4, 6, 8, 10, 12, 14], hatAccent: [2, 6, 10, 14], kick: [0, 8], snare: [4, 12], leadPasses: 'all',
      lead: [[0, 'A5', 2], [2, 'G5', 2], [4, 'A5', 2], [6, 'E5', 2], [8, 'A5', 2], [10, 'C6', 2], [12, 'B5', 2], [14, 'A5', 2],
        [16, 'A5', 2], [18, 'G5', 2], [20, 'F5', 2], [22, 'C5', 2], [24, 'F5', 2], [26, 'A5', 2], [28, 'G5', 2], [30, 'F5', 2],
        [32, 'F5', 2], [34, 'E5', 2], [36, 'D5', 2], [38, 'A4', 2], [40, 'D5', 2], [42, 'F5', 2], [44, 'E5', 2], [46, 'D5', 2],
        [48, 'E5', 2], [50, 'F5', 2], [52, 'G#5', 4], [56, 'B5', 2], [58, 'G#5', 2], [60, 'E5', 4]],
    },
    zen: {
      name: 'Siesta', bpm: 104, soft: true,
      chords: [['F3', 'A3', 'C4', 'E4'], ['E3', 'G3', 'B3', 'D4'], ['D3', 'F3', 'A3', 'C4'], ['C3', 'E3', 'G3', 'D4']],
      roots: ['F2', 'E2', 'D2', 'C2'],
      bass: [0, 10], bassLen: 5, octave: [],
      arpEvery: 2, hats: [4, 12], hatAccent: [], kick: [], snare: [], leadPasses: 'odd',
      lead: [[0, 'A5', 6], [8, 'G5', 2], [10, 'E5', 4],
        [16, 'D5', 6], [24, 'E5', 2], [26, 'G5', 4],
        [32, 'F5', 6], [40, 'E5', 2], [42, 'C5', 4],
        [48, 'D5', 4], [52, 'E5', 2], [54, 'G5', 2], [56, 'E5', 6]],
    },
  };
  function defineSong(id, s) {
    s.chordsM = s.chords.map(c => c.map(N));
    s.rootsM = s.roots.map(N);
    s.leadByStep = new Map(s.lead.map(([st, n, len]) => [st, [N(n), len]]));
    SONGS[id] = s;
  }
  for (const [id, s] of Object.entries(SONGS)) defineSong(id, s);

  // los instrumentos del tema original (pulsos percusivos, cuadrada, triangular, ruido)
  function pluck(f, t, dur, vol, type, dest, duty) {
    const osc = ctx.createOscillator(), g = ctx.createGain();
    if (duty) osc.setPeriodicWave(pulseWaves[duty]); else osc.type = type;
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(dest); osc.start(t); osc.stop(t + dur + 0.02);
  }
  function hiss(t, vol, dest, dur, freq, type, pan) {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type || 'highpass'; f.frequency.value = freq || 7000;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.04));
    src.connect(f); f.connect(g); g.connect(out(dest, pan)); src.start(t, Math.random() * 0.5); src.stop(t + (dur || 0.04) + 0.02);
  }
  const ARR = {
    '8': {
      bass(f, t, d, dest) { pluck(f, t, d, 0.12, 'square', dest); },
      arp(f, t, d, dest) { pluck(f, t, d, 0.035, 'triangle', dest); },
      hat(t, acc, dest) { hiss(t, acc ? 0.05 : 0.025, dest); },
      kick(t, dest) { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.08); g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11); o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.13); },
      snare(t, dest) { hiss(t, 0.08, dest, 0.11, 1500, 'bandpass'); },
      lead(f, t, d, dest) { pluck(f, t, d, 0.045, 'square', dest); },
    },
    // suave (modo zen): bajo triangular, arpegio de pulso fino tipo caja de música, melodía de pulso al 25 %
    '8s': {
      bass(f, t, d, dest) { pluck(f, t, Math.min(d, 1.2), 0.13, 'triangle', dest); },
      arp(f, t, d, dest) { pluck(f, t, d * 1.6, 0.022, null, dest, 0.125); },
      hat(t, acc, dest) { hiss(t, 0.014, dest, 0.03, 9000); },
      kick() {}, snare() {},
      lead(f, t, d, dest) { pluck(f, t, d, 0.04, null, dest, 0.25); },
    },
  };

  const Music = (() => {
    let timer = null, cur = null, step = 0, nextT = 0, want = null;
    const st = { ducked: false };
    function makeBus() {
      const b = ctx.createGain(); b.gain.value = 1;
      b.connect(musicBus);
      const d = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain(), lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2400; fb.gain.value = 0.22; wet.gain.value = 0.14;
      d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(wet); wet.connect(b);
      return { b, echoIn: d, delay: d };
    }
    function schedStep(c, t, S) {
      const song = c.song, A = ARR[song.soft ? '8s' : '8'], dest = c.bus.b, k = step % 64, bar = (k / 16) | 0, b = k % 16;
      const chord = song.chordsM[bar], root = song.rootsM[bar];
      if (song.bass.includes(b)) A.bass(mtof(root + (song.octave.includes(b) ? 12 : 0)), t, S * song.bassLen, dest);
      if (b % song.arpEvery === 0) A.arp(mtof(chord[(b / song.arpEvery) % chord.length] + 12), t, S * song.arpEvery * 0.9, dest, b);
      if (song.hats.includes(b)) A.hat(t, song.hatAccent.includes(b), dest);
      if (song.kick.includes(b)) A.kick(t, dest);
      if (song.snare.includes(b)) A.snare(t, dest);
      const pass = (step / 64) | 0;
      if (song.leadPasses === 'all' || pass % 2 === 1) {
        const L = song.leadByStep.get(k);
        if (L) A.lead(mtof(L[0]), t, S * L[1] * 0.95, dest, k, c.bus.echoIn);
      }
    }
    function tick() {
      if (!cur) return;
      const S = 60 / cur.song.bpm / 4;
      while (nextT < ctx.currentTime + 0.15) { schedStep(cur, nextT, S); step++; nextT += S; }
    }
    function start(track) {
      if (!ctx) return;
      if (cur && cur.track === track) return;
      stopNow(0.25);
      cur = { track, song: SONGS[track], bus: makeBus() };
      step = 0; nextT = ctx.currentTime + 0.08;
      if (!timer) timer = setInterval(tick, 30);
    }
    function stopNow(fade) {
      if (cur) {
        const bb = cur.bus.b, t = ctx.currentTime;
        bb.gain.setValueAtTime(bb.gain.value, t); bb.gain.linearRampToValueAtTime(0, t + (fade || 0.05));
        setTimeout(() => { try { bb.disconnect(); } catch (e) {} }, ((fade || 0.05) + 0.6) * 1000);
      }
      cur = null;
      if (timer) { clearInterval(timer); timer = null; }
    }
    return {
      get ducked() { return st.ducked; },
      want(track) { want = { track }; if (ctx && set.music > 0 && !set.mute && !document.hidden) start(want.track); },
      resume() { if (want && ctx && !document.hidden) start(want.track); },
      halt() { stopNow(0.2); },
      duck(on) { st.ducked = on; apply(); },
      stop() { want = null; stopNow(0.3); },
      current() { return cur ? { track: cur.track, name: cur.song.name } : null; },
      songs: SONGS,
    };
  })();

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) { Music.halt(); ctx.suspend().catch(() => {}); }
    else { ctx.resume().catch(() => {}); apply(); }
  });

  // ------------------------------------------------------------ lluvia (la de la sala)
  // 0.5.0 (#39): una lluvia leve escuchada desde adentro, detrás del vidrio. Un colchón grave y apagado (ruido rosa
  // filtrado) y gotitas cortas, parejas y apagadas, que pegan en el vidrio al azar y repartidas en el estéreo. Sin gotas
  // gordas espaciadas: desde adentro suenan falsas. La anterior era solo el colchón, más brillante, y sonaba a viento.
  const Rain = (() => {
    const BED = { hp: 90, lp: 520, g: 0.15 }, DROPS = { rate: 34, lo: 1600, hi: 4200, dur: 0.018, vol: 0.05 };
    let built = false, on = false, timer = null, next = 0;
    function build() {
      const len = ctx.sampleRate * 4, buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const dd = buf.getChannelData(c); let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.96900 * b2 + w * 0.1538520;
          b3 = 0.86650 * b3 + w * 0.3104856; b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
          dd[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
        }
      }
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = BED.hp;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = BED.lp;
      const g = ctx.createGain(); g.gain.value = BED.g;
      src.connect(hp).connect(lp).connect(g).connect(rainBus);
      src.start();
      built = true;
    }
    // una gota en el vidrio: un chasquido de ruido muy corto por un filtro resonante
    function drop(t) {
      const D = DROPS, src = ctx.createBufferSource(); src.buffer = noiseBuf;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = D.lo * Math.pow(D.hi / D.lo, Math.random()); f.Q.value = 3 + Math.random() * 6;
      const g = ctx.createGain(), v = D.vol * (0.3 + Math.random() * Math.random() * 1.7), dur = D.dur * (0.6 + Math.random() * 0.9);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.0012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const p = ctx.createStereoPanner(); p.pan.value = Math.random() * 1.8 - 0.9;
      src.connect(f).connect(g).connect(p).connect(rainBus); src.start(t, Math.random() * 0.9); src.stop(t + dur + 0.02);
    }
    function tick() {
      const now = ctx.currentTime, until = now + 0.12;
      if (next < now) next = now + 0.02;
      while (next < until) { drop(next); next += -Math.log(1 - Math.random()) / DROPS.rate; }
    }
    return {
      want(v) { on = v; this.apply(); },
      apply() {
        if (!ctx) return;
        // 0.5.0: con la lluvia nueva, 0,155 la deja frente a la música como en la prueba de sonido aprobada
        const g = on && !set.mute ? vol.lluvia / 10 * 0.155 : 0;
        if (g > 0 && !built) build();
        rainBus.gain.setTargetAtTime(g, ctx.currentTime, 0.4);
        if (g > 0 && !timer) timer = setInterval(tick, 40);
        else if (g === 0 && timer) { clearInterval(timer); timer = null; }
      },
    };
  })();

  function setVolume(k, v) {
    if (!(k in vol)) return;
    vol[k] = Math.max(0, Math.min(10, Math.round(v)));
    fromVol(); apply();
    try { localStorage.setItem(CLAVE, JSON.stringify(vol)); } catch (e) {}
  }

  return {
    ensure, play,
    volume: k => vol[k], setVolume,
    music(track) { Music.want(track); },
    stopMusic() { Music.stop(); },
    rain(on) { Rain.want(on); },
    duck(on) { Music.duck(on); },
    nowPlaying() { return Music.current(); },
    FX: Object.keys(FX8),
    _tap() { return ctx ? { ctx, master } : null; },
  };
})();
