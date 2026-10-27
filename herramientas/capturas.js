/* Recorre la app como en el teléfono y saca una captura de cada pantalla, para revisar antes de publicar.

   node herramientas/capturas.js [carpeta]      (por defecto, dist/capturas)

   Sirve el repositorio en un puerto local, abre la app en horizontal a 915 × 412 con densidad 2,625 (unos
   2400 × 1080 píxeles, como el teléfono de referencia) y verifica el camino y el «atrás» de Android:
   sala → ajustes → Fogonazo → sonido → manual → mapa → partida → pausa → mapa → … → sala.
   Al final prueba que la app abra sin conexión. Si algo no da lo esperado, lo dice y termina con error. */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { abrir } = require('./navegador');

const RAIZ = path.join(__dirname, '..');
const SALIDA = path.resolve(process.argv[2] || path.join(RAIZ, 'dist', 'capturas'));
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

function servidor() {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(RAIZ, p);
    if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

const espera = ms => new Promise(r => setTimeout(r, ms));
let fallas = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) fallas++; };

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const srv = await servidor();
  const URL0 = `http://localhost:${srv.address().port}/`;
  const nav = await abrir();
  const ctx = await nav.newContext({ viewport: { width: 915, height: 412 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true, locale: 'es-AR' });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });

  const pantalla = () => page.frames().find(f => f !== page.mainFrame());
  const ruta = () => new URL(pantalla().url()).pathname.replace(/^\//, '');
  async function listo() {
    await page.waitForFunction(() => !document.getElementById('velo').classList.contains('on'), null, { timeout: 8000 });
    await pantalla().evaluate(() => document.fonts.ready);
    await espera(500);
  }
  async function foto(nombre) { await page.screenshot({ path: path.join(SALIDA, nombre + '.png') }); console.log('    → ' + nombre + '.png'); }
  async function tocar(sel) { await pantalla().locator(sel).first().click({ force: true }); await espera(450); }
  async function atras() { await page.goBack({ waitUntil: 'commit' }).catch(() => {}); await espera(450); }
  const abierto = sel => pantalla().evaluate(s => { const e = document.querySelector(s); return !!e && !e.hidden && !(e.classList.contains('sheet') && e.tagName === 'g' && !e.classList.contains('open')); }, sel);

  console.log('Sala');
  await page.goto(URL0); await listo();
  ok(ruta().startsWith('sala/'), 'arranca en la sala');
  ok(await abierto('#salir'), 'la sala tiene «Salir», abajo a la derecha'); await foto('01-sala');
  await tocar('#hitAudio'); await espera(300);
  ok(await abierto('#sheetAudio'), 'el equipo de audio abre los ajustes');
  ok(await abierto('#instRow'), 'en el navegador, los ajustes ofrecen instalar'); await foto('02-sala-ajustes');
  await tocar('#instBtn');
  ok(await abierto('#sheetSteps'), 'sin el cuadro de Chrome, «Instalar» abre los pasos'); await foto('03-sala-instalar');
  await atras(); ok(!(await abierto('#sheetSteps')) && await abierto('#sheetAudio'), '«atrás» cierra los pasos y vuelve a los ajustes');
  await atras(); ok(!(await abierto('#sheetAudio')), '«atrás» cierra los ajustes');
  await tocar('#hitTable'); await espera(300); ok(await abierto('#sheetTable'), 'la mesa ratona abre «próximamente»'); await foto('04-sala-mahjong');
  await tocar('#sheetTable [data-close]'); ok(!(await abierto('#sheetTable')), '«Volver» cierra la tarjeta');

  console.log('Fogonazo');
  await tocar('#hitBench'); await listo();
  ok(ruta() === 'fogonazo/instrumento.html', 'el banco lleva al instrumento');
  // las aureolas respiran por turno; para la captura se muestran las dos en su punto más alto
  await pantalla().evaluate(() => document.querySelectorAll('.aura').forEach(a => { a.style.animation = 'none'; a.style.opacity = '1'; }));
  await foto('05-fogonazo-instrumento');
  await pantalla().evaluate(() => document.querySelectorAll('.aura').forEach(a => { a.style.animation = ''; a.style.opacity = ''; }));
  const tema = () => page.evaluate(() => (Sound.nowPlaying() || {}).name || null);
  ok(await tema() === 'Taller', 'en el instrumento suena Taller');
  await tocar('#hitSound'); ok(await abierto('#sound'), 'la placa abre el sonido'); await foto('06-fogonazo-sonido');
  await atras(); ok(!(await abierto('#sound')) && ruta() === 'fogonazo/instrumento.html', '«atrás» cierra el sonido');
  await tocar('#hitManual'); ok(await abierto('#manual'), 'la revista abre el manual'); await foto('07-fogonazo-manual');
  await tocar('#closeManual'); ok(!(await abierto('#manual')), '«Cerrar» cierra el manual');
  await tocar('#hitScreen'); await listo();
  ok(ruta() === 'fogonazo/mapa.html', 'la pantalla del osciloscopio abre el mapa'); await foto('08-fogonazo-mapa');
  await tocar('.lvl[data-n="1"]'); await listo();
  ok(ruta() === 'fogonazo/partida.html', 'el nivel 1 abre la partida'); await foto('09-fogonazo-partida');
  ok(await tema() === 'Placa', 'en la partida suena Placa');
  await atras(); ok(await abierto('#menu') && ruta() === 'fogonazo/partida.html', 'en la partida, «atrás» abre la pausa'); await foto('10-fogonazo-pausa');
  await tocar('#menu [data-act="resume"]'); ok(!(await abierto('#menu')), '«Seguir» cierra la pausa');
  await atras(); ok(await abierto('#menu'), 'después de seguir, «atrás» vuelve a abrir la pausa');
  await atras(); await listo(); ok(ruta() === 'fogonazo/mapa.html', 'desde la pausa, «atrás» va al mapa');
  await tocar('.lvl[data-n="1"]'); await listo();
  await tocar('#pause'); ok(await abierto('#menu'), 'el botón de pausa abre la pausa');
  await tocar('#menu [data-act="map"]'); await listo(); ok(ruta() === 'fogonazo/mapa.html', '«Volver al mapa» va al mapa');
  await tocar('.lvl[data-n="1"]'); await listo();
  await tocar('#volver'); await listo(); ok(ruta() === 'fogonazo/mapa.html', 'en la partida, «Volver» va al mapa sin pasar por la pausa');
  await atras(); await listo(); ok(ruta() === 'fogonazo/instrumento.html', 'desde el mapa, «atrás» va al instrumento');
  await atras(); await listo(); ok(ruta().startsWith('sala/'), 'desde el instrumento, «atrás» va a la sala');
  ok(await tema() === null, 'en la sala no hay música');
  const fuera = await page.evaluate(() => history.state && history.state.i);
  ok(fuera === 0, 'en la sala no quedan pasos en el historial: el próximo «atrás» sale de la app');

  console.log('Sonido');
  const volFog = await pantalla().evaluate(() => App.sonido.volumen('musica'));
  ok(Number.isInteger(volFog), 'los volúmenes vienen de la colección (música ' + volFog + ')');

  console.log('Sin conexión');
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 15000 }).catch(() => {});
  const conSW = await page.evaluate(() => !!(navigator.serviceWorker && navigator.serviceWorker.controller));
  if (!conSW) { await page.reload(); await listo(); }
  await ctx.setOffline(true);
  await page.reload(); await listo();
  ok(ruta().startsWith('sala/'), 'sin conexión, la app abre en la sala');
  await tocar('#hitBench'); await listo();
  ok(ruta() === 'fogonazo/instrumento.html', 'sin conexión, Fogonazo abre');
  await ctx.setOffline(false);

  ok(errores.length === 0, 'sin errores en la consola' + (errores.length ? ': ' + errores.join(' | ') : ''));
  await nav.close(); srv.close();
  console.log(fallas ? `\n${fallas} falla(s).` : `\nTodo bien. Capturas en ${SALIDA}`);
  process.exit(fallas ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
