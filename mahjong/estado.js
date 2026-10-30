// El avance del mahjong: el récord de cada tablero (el menor tiempo para limpiarlo y los mejores puntos) y el último
// que se jugó. Vive solo en este Chrome. Los volúmenes son los de la colección (comun/sonido.js).
window.Estado = (() => {
  'use strict';
  const KEY = 'coleccion.mahjong';
  const blank = () => ({ records: {}, ultimo: null });
  let st = blank();
  try { const raw = JSON.parse(localStorage.getItem(KEY)); if (raw && raw.records) st = Object.assign(blank(), raw); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  return {
    record: id => Object.assign({ tiempo: 0, puntos: 0 }, st.records[id]),
    get ultimo() { return st.ultimo ? Object.assign({}, st.ultimo) : null; },
    empezado(id) { st.ultimo = { id, tiempo: 0 }; save(); },
    // un tablero limpio: devuelve qué récords mejoró
    limpio(id, tiempo, puntos) {
      const r = st.records[id] || (st.records[id] = { tiempo: 0, puntos: 0 });
      const t = !r.tiempo || tiempo < r.tiempo, p = puntos > r.puntos;
      if (t) r.tiempo = tiempo;
      if (p) r.puntos = puntos;
      st.ultimo = { id, tiempo };
      save();
      return { tiempo: t, puntos: p };
    },
  };
})();
