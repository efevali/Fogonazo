/* Exporta un tema de la colección a un archivo WAV, tal como suena en el juego, para trabajarlo afuera (por ejemplo,
   como base para pedirle a otra IA un arreglo nuevo).

   node herramientas/tema-a-wav.js [tema] [vueltas] [salida.wav]
     tema:    zen (Siesta, por defecto), game (Placa), map (Taller) o timed (Urgente)
     vueltas: cuántas vueltas completas (por defecto 2). Una vuelta son dos pasadas de 4 compases: la primera sin
              melodía y la segunda con ella (en Urgente, la melodía va siempre)
     salida:  por defecto dist/<Nombre>.wav

   Carga comun/sonido.js en Chromium con un contexto de audio sin conexión, así el sonido es el mismo del juego:
   mismos instrumentos, eco y compresor. El archivo es un bucle exacto: se graba una vuelta de más al principio y se
   descarta, así el archivo arranca con los ecos y las colas de la vuelta anterior y, repetido, no tiene costura.
   Se normaliza a -1 dBFS. */
const fs = require('fs');
const path = require('path');
const { abrir } = require('./navegador');

const RAIZ = path.join(__dirname, '..');
const tema = process.argv[2] || 'zen';
const vueltas = Math.max(1, +process.argv[3] || 2);

(async () => {
  const nav = await abrir();
  const page = await nav.newPage();
  page.on('pageerror', e => console.error('Error en la página:', e.message));
  await page.setContent('<!doctype html><title>tema</title>');
  const { wav, nombre, segundos } = await page.evaluate(async ({ codigo, tema, vueltas }) => {
    const SR = 44100;
    // Sound crea su contexto con «new AudioContext()»: acá recibe uno sin conexión
    let off = null, largo = 0;
    window.AudioContext = function () { off = new OfflineAudioContext(2, largo, SR); return off; };
    (0, eval)(codigo + '\n;window.__Sound = Sound;');
    const Sound = window.__Sound;
    const song = { zen: 104, game: 104, map: 92, timed: 144 }[tema];
    if (!song) throw new Error('tema desconocido: ' + tema);
    const paso = 60 / song / 4, vuelta = 2 * 64 * paso, bucle = vueltas * vuelta, inicio = 0.08;
    largo = Math.ceil((inicio + vuelta + bucle + 0.5) * SR);
    Sound.ensure();
    Sound.setVolume('musica', 10);
    Sound.music(tema);
    const nombre = Sound.nowPlaying().name;
    // el secuenciador del juego programa con un reloj real; se lo deja correr deteniendo el render cada 0,1 s
    for (let k = 1; k / 10 < largo / SR - 0.05; k++) off.suspend(k / 10).then(() => setTimeout(() => off.resume(), 40));
    const buf = await off.startRendering();
    // las vueltas pedidas, después de la vuelta de calentamiento
    const a = Math.round((inicio + vuelta) * SR), n = Math.round(bucle * SR);
    const ch = [0, 1].map(c => buf.getChannelData(c).slice(a, a + n));
    let pico = 0; for (const o of ch) for (const v of o) pico = Math.max(pico, Math.abs(v));
    const g = pico ? Math.pow(10, -1 / 20) / pico : 1;
    // WAV de 16 bits, estéreo
    const out = new DataView(new ArrayBuffer(44 + n * 4));
    const txt = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
    txt(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); txt(8, 'WAVE'); txt(12, 'fmt '); out.setUint32(16, 16, true);
    out.setUint16(20, 1, true); out.setUint16(22, 2, true); out.setUint32(24, SR, true); out.setUint32(28, SR * 4, true);
    out.setUint16(32, 4, true); out.setUint16(34, 16, true); txt(36, 'data'); out.setUint32(40, n * 4, true);
    for (let i = 0, o = 44; i < n; i++) for (let c = 0; c < 2; c++, o += 2) out.setInt16(o, Math.max(-1, Math.min(1, ch[c][i] * g)) * 32767, true);
    let bin = ''; const u8 = new Uint8Array(out.buffer);
    for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return { wav: btoa(bin), nombre, segundos: n / SR };
  }, { codigo: fs.readFileSync(path.join(RAIZ, 'comun/sonido.js'), 'utf8'), tema, vueltas });
  await nav.close();
  const salida = path.resolve(process.argv[4] || path.join(RAIZ, 'dist', nombre + '.wav'));
  fs.mkdirSync(path.dirname(salida), { recursive: true });
  fs.writeFileSync(salida, Buffer.from(wav, 'base64'));
  console.log(`${nombre}: ${vueltas} vuelta(s), ${segundos.toFixed(2)} s → ${salida}`);
})();
