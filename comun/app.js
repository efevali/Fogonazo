/* La página contenedora de la colección (index.html): muestra una pantalla por vez en un marco y resuelve lo común.

   - Pantallas: la sala (sala/) y las de cada juego (fogonazo/…). Se pasa de una a otra con un fundido corto.
   - «Atrás» de Android: cada paso que «atrás» tiene que deshacer (entrar a una pantalla, abrir un panel) suma una
     entrada al historial, siempre al tocar algo: Chrome saltea las entradas que una página suma sin que la toquen.
     Al volver, si el paso era un panel, la pantalla lo cierra (Pantalla.atras); si era una pantalla, se vuelve a la
     anterior. Desde la sala, «atrás» sale de la app.
   - Sonido: la música, los efectos y la lluvia viven acá (comun/sonido.js), así que no se cortan entre pantallas.
     La lluvia suena solo en la sala; cada juego elige su música.
   - Instalación: guarda el cuadro de instalación de Chrome para el panel de ajustes de la sala.
   - Versión: el service worker deja la versión nueva esperando y entra sola al cerrar la app del todo.

   Las pantallas lo usan como «App» a través de comun/pantalla.js. */
(() => {
  'use strict';
  const velo = document.getElementById('velo');
  let frame = null, nFrames = 0;
  const base = new URL('./', location.href).pathname;

  // ------------------------------------------------------------ ambiente de cada pantalla
  // lluvia: la de la sala; música: el tema de Fogonazo de cada lugar (Taller fuera de la partida, Placa en la partida)
  const AMBIENTE = [
    [/^sala\//, { lluvia: true, musica: null }],
    [/^fogonazo\/partida\.html/, { lluvia: false, musica: 'game' }],
    [/^fogonazo\//, { lluvia: false, musica: 'map' }],
  ];
  function ambiente(url) {
    const a = (AMBIENTE.find(([re]) => re.test(url)) || [null, { lluvia: false, musica: null }])[1];
    Sound.rain(a.lluvia);
    Sound.duck(false);
    if (a.musica) Sound.music(a.musica); else Sound.stopMusic();
  }

  // ------------------------------------------------------------ pantallas e historial
  const INICIO = 'sala/';
  // pila de pantallas; cada una con cuántas entradas del historial tiene encima (paneles o pasos propios)
  const pila = [{ url: INICIO, extra: 0 }];
  let pos = 0;                        // índice de la entrada actual del historial
  const top = () => pila[pila.length - 1];
  history.replaceState({ i: 0 }, '');

  // Cada pantalla va en un marco nuevo, con nombre propio. Si fuera siempre el mismo, al ir hacia atrás en el
  // historial Chrome le devolvería al marco la página que tenía en ese paso, por su cuenta.
  function cargar(url, primera) {
    velo.classList.add('on');
    setTimeout(() => {
      const nuevo = document.createElement('iframe');
      nuevo.className = 'pantalla'; nuevo.title = 'Minijuegos'; nuevo.name = 'pantalla' + (++nFrames);
      nuevo.addEventListener('load', () => alCargar(nuevo));
      nuevo.src = url;
      document.body.insertBefore(nuevo, velo);
      if (frame) frame.remove();
      frame = nuevo;
    }, primera ? 0 : 220);
  }
  function alCargar(f) {
    if (f !== frame) return;
    const doc = f.contentDocument;
    if (!doc || f.contentWindow.location.href === 'about:blank') return;
    // el primer toque en cualquier pantalla habilita el sonido (los navegadores lo piden)
    doc.addEventListener('pointerdown', desbloquear, true);
    doc.addEventListener('keydown', desbloquear, true);
    const url = frame.contentWindow.location.pathname.replace(base, '') + frame.contentWindow.location.search;
    ambiente(url);
    requestAnimationFrame(() => velo.classList.remove('on'));
  }
  function desbloquear() { Sound.ensure(); girar(); }

  // En horizontal. La ficha de instalación lo pide, pero una app instalada antes (la 0.6.1, en vertical) conserva su
  // orientación hasta que Chrome actualiza la ficha, y eso puede tardar días. Por eso se pide también desde acá; en
  // el navegador, sin pantalla completa, Chrome no lo permite y no pasa nada.
  let horizontal = false;
  function girar() {
    if (horizontal || !screen.orientation || !screen.orientation.lock) return;
    screen.orientation.lock('landscape').then(() => { horizontal = true; }).catch(() => {});
  }

  function empujar() { pos++; history.pushState({ i: pos }, ''); }

  // los pasos de «atrás»
  addEventListener('popstate', e => {
    const i = (e.state && Number.isInteger(e.state.i)) ? e.state.i : 0;
    let pasos = pos - i;
    if (pasos <= 0) { pos = i; return; }
    pos = i;
    const antes = top().url;
    if (pasos === 1 && top().extra > 0) {
      // un solo paso sobre una pantalla con algo encima: lo resuelve la pantalla
      top().extra--;
      const p = frame.contentWindow && frame.contentWindow.Pantalla;
      if (p && p.atras) p.atras();
      return;
    }
    while (pasos > 0 && pila.length) {
      if (top().extra > 0) { const n = Math.min(top().extra, pasos); top().extra -= n; pasos -= n; continue; }
      if (pila.length === 1) break;
      pila.pop(); pasos--;
    }
    if (top().url !== antes) cargar(top().url);
  });

  // ------------------------------------------------------------ instalación
  let cuadro = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); cuadro = e; });
  addEventListener('appinstalled', () => { cuadro = null; instalada = true; });
  let instalada = false;
  const enApp = () => instalada || matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone === true;

  // ------------------------------------------------------------ la App que ven las pantallas
  window.App = {
    // ir a otra pantalla; extra: entradas del historial que la pantalla nueva usa para sus propios pasos (la partida, 1)
    ir(url, extra = 0) {
      empujar(); pila.push({ url, extra: 0 });
      for (let k = 0; k < extra; k++) { empujar(); top().extra++; }
      cargar(url);
    },
    // cambiar la pantalla actual por otra, sin sumar un paso (de un nivel al siguiente)
    reemplazar(url, extra = top().extra) {
      while (top().extra < extra) { empujar(); top().extra++; }
      top().url = url;
      cargar(url);
    },
    // algo que «atrás» tiene que deshacer: un panel abierto, la pausa por abrir
    abrir() { empujar(); top().extra++; },
    // deshacer pasos, como el «atrás» del teléfono
    volver(n = 1) { if (n > 0) history.go(-n); },
    // cuántas entradas tiene encima la pantalla actual
    get extra() { return top().extra; },
    sonido: {
      fx(name, arg, gap) { Sound.play(name, arg, gap); },
      volumen: k => Sound.volume(k),
      setVolumen(k, v) { Sound.ensure(); Sound.setVolume(k, v); },
      duck(on) { Sound.duck(on); },
    },
    instalacion: {
      get disponible() { return !enApp(); },
      get cuadro() { return !!cuadro; },
      async abrir() {
        if (!cuadro) return false;
        const c = cuadro; cuadro = null;
        try { c.prompt(); const r = await c.userChoice; if (r && r.outcome === 'accepted') instalada = true; } catch (e) {}
        return true;
      },
      samsung: /SamsungBrowser/i.test(navigator.userAgent),
      ios: /iPhone|iPad|iPod/i.test(navigator.userAgent),
    },
  };

  // ------------------------------------------------------------ arranque
  // el avance del Fogonazo publicado y de la maqueta no se conservan: la colección arranca de cero
  try { localStorage.removeItem('chispazo.v1'); localStorage.removeItem('fogonazo.maqueta.v1'); } catch (e) {}
  Sound.ensure();   // instalada, Chrome deja sonar sin esperar un toque; si no, arranca con el primero
  girar();
  cargar(INICIO, true);

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
