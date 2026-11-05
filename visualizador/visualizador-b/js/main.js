/* ============================================================
   main.js — Cableado general del visualizador
   ------------------------------------------------------------
   · Modos: práctica (1 vista), comparar (2 vistas) y reto
   · Generación del array y carga de trazas en cada vista
   · Transporte: play, pausa, paso, reiniciar y fin
   · Tema claro/oscuro (mismo criterio que joseluisgs.dev)
   ============================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);

const estado = {
  modo: 'practica',
  algoA: 'burbuja',
  algoB: 'quicksort',
  datos: 'aleatorio',
  tam: 12,
  arrayBase: [],
  vistas: []
};

// ------------------------------------------------------------
// Tema claro / oscuro
// ------------------------------------------------------------
const temaActual = () => document.documentElement.getAttribute('data-theme') || 'light';

function pintarBotonTema() {
  $('#btn-tema').textContent = temaActual() === 'dark' ? '☀️' : '🌙';
}

function cambiarTema() {
  const nuevo = temaActual() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nuevo);
  try { localStorage.setItem('ud03-visualizador-tema', nuevo); } catch (e) { /* sin almacenamiento */ }
  pintarBotonTema();
  estado.vistas.forEach((v) => v.refrescarTema());
}

// ------------------------------------------------------------
// Array de datos
// ------------------------------------------------------------
function generarArray() {
  const n = estado.tam;
  const base = Array.from({ length: n }, () => 5 + Math.floor(Math.random() * 95));

  switch (estado.datos) {
    case 'ordenado':
      return base.sort((a, b) => a - b);
    case 'inverso':
      return base.sort((a, b) => b - a);
    case 'casi': {
      const s = base.sort((a, b) => a - b);
      const cambios = Math.max(1, Math.floor(n / 6));
      for (let k = 0; k < cambios; k++) {
        const i = Math.floor(Math.random() * (n - 1));
        [s[i], s[i + 1]] = [s[i + 1], s[i]];
      }
      return s;
    }
    default:
      return base;
  }
}

// ------------------------------------------------------------
// Utilidades de estado
// ------------------------------------------------------------
const algoritmosActivos = () =>
  estado.modo === 'comparar' ? [estado.algoA, estado.algoB] : [estado.algoA];

const velMs = () => Math.max(30, Math.round(750 - Number($('#rng-vel').value) * 7.2));
const pintarVelocidad = () => {
  const el = $('#val-vel');
  if (el) el.textContent = `${velMs()} ms`;
};

const todosTerminados = () => estado.vistas.length > 0 && estado.vistas.every((v) => v.motor.terminado);
const algunoCorriendo = () => estado.vistas.some((v) => v.motor.corriendo);

function mostrarAviso(texto) {
  const el = $('#aviso');
  el.innerHTML = `💡 ${texto}`;
  el.hidden = false;
  clearTimeout(mostrarAviso.timer);
  mostrarAviso.timer = setTimeout(() => { el.hidden = true; }, 7000);
}

// ------------------------------------------------------------
// Carga de las vistas
// ------------------------------------------------------------
function pedirObjetivo(arr, ids) {
  const hayBusqueda = ids.some((id) => ALGORITMOS[id].tipo === 'busqueda');
  $('#control-objetivo').classList.toggle('oculto', !hayBusqueda);
  if (!hayBusqueda) return null;

  const inp = $('#inp-objetivo');
  let v = parseInt(inp.value, 10);
  if (Number.isNaN(v)) {
    v = arr[Math.floor(Math.random() * arr.length)];
    inp.value = String(v);
  }
  return v;
}

function recargar() {
  const ids = algoritmosActivos();
  let arr = [...estado.arrayBase];

  // La búsqueda binaria exige array ordenado
  const requiereOrden = ids.some((id) => ALGORITMOS[id].complejidad.requiereOrden === true);
  if (requiereOrden) arr.sort((a, b) => a - b);

  const objetivo = pedirObjetivo(arr, ids);

  estado.vistas.forEach((v, k) => {
    const algo = ALGORITMOS[ids[k]];
    const trazas = [...algo.generar([...arr], objetivo)];

    v.cargar(algo, arr, trazas);
    v.motor.vel = velMs();
    v.motor.onPre = (p) => Quiz.pre(p, v);
    v.motor.onFin = () => alTerminar(v);
    v.saltarALinea = (l) => {
      if (v.motor.irALinea(l)) pintarPlay();
    };
  });

  $('#duelo').hidden = true;
  pintarPlay();

  if (requiereOrden && estado.datos !== 'ordenado') {
    mostrarAviso('La búsqueda binaria necesita el array ordenado: lo hemos ordenado para todas las vistas.');
  }
}

function montar() {
  const zona = $('#zona-vistas');
  zona.innerHTML = '';
  zona.classList.toggle('dos', estado.modo === 'comparar');
  estado.vistas = [];

  const n = estado.modo === 'comparar' ? 2 : 1;
  for (let k = 0; k < n; k++) estado.vistas.push(new Vista(k));

  $('#control-algo-b').classList.toggle('oculto', estado.modo !== 'comparar');

  const eraReto = Quiz.activo;
  Quiz.activo = estado.modo === 'reto';
  if (eraReto && !Quiz.activo) Quiz.cerrarSilencioso();
  if (estado.modo === 'reto' && !eraReto) Quiz.reiniciar();

  recargar();
}

// ------------------------------------------------------------
// Transporte
// ------------------------------------------------------------
function pintarPlay() {
  $('#btn-play').textContent = algunoCorriendo() ? '⏸ Pausa' : '▶ Play';
}

function playPausa() {
  if (todosTerminados()) recargar();

  if (algunoCorriendo()) {
    estado.vistas.forEach((v) => v.motor.parar());
  } else {
    estado.vistas.forEach((v) => v.motor.play());
  }
  pintarPlay();
}

function unPaso() {
  if (todosTerminados()) return;
  estado.vistas.forEach((v) => v.motor.avanzarPaso());
  pintarPlay();
}

function irAlFinal() {
  estado.vistas.forEach((v) => v.motor.irAlFinal());
  pintarPlay();
}

function reiniciar() {
  recargar();
}

function alTerminar(v) {
  v.mostrarFin();

  if (estado.modo === 'reto' && v.$fin) {
    const resumen = Quiz.resumen();
    if (resumen) v.$fin.insertAdjacentHTML('beforeend', ` · ${resumen}`);
  }

  if (estado.modo === 'comparar' && todosTerminados()) mostrarDuelo();
  pintarPlay();
}

function mostrarDuelo() {
  const [va, vb] = estado.vistas;
  const ca = va.motor.stats.cmp;
  const cb = vb.motor.stats.cmp;
  const pa = va.motor.stats.pasos;
  const pb = vb.motor.stats.pasos;

  // Se gana por comparaciones: es la métrica de la tabla de complejidad
  const ganador = ca === cb
    ? '¡Empate en comparaciones!'
    : `${ca < cb ? va.algo.nombre : vb.algo.nombre} necesita menos comparaciones`;

  $('#duelo').innerHTML =
    `🏁 <b>${va.algo.icono} ${va.algo.nombre}</b>: <b>${ca}</b> comparaciones y ${pa} pasos · ` +
    `<b>${vb.algo.icono} ${vb.algo.nombre}</b>: <b>${cb}</b> comparaciones y ${pb} pasos → <b>${ganador}</b>`;
  $('#duelo').hidden = false;
}

// ------------------------------------------------------------
// Selects de algoritmo
// ------------------------------------------------------------
function rellenarSelects() {
  const grupo = (lista) =>
    lista.map((id) => `<option value="${id}">${ALGORITMOS[id].icono} ${ALGORITMOS[id].nombre}</option>`).join('');

  const html = `
    <optgroup label="Ordenación">${grupo(ORDENACION)}</optgroup>
    <optgroup label="Búsqueda">${grupo(BUSQUEDA)}</optgroup>`;

  $('#sel-algo-a').innerHTML = html;
  $('#sel-algo-b').innerHTML = html;
  $('#sel-algo-a').value = estado.algoA;
  $('#sel-algo-b').value = estado.algoB;
}

/** Evita que en modo comparar se elijan los mismos algoritmos. */
function evitarRepetidos(cual) {
  if (estado.algoA !== estado.algoB) return;
  const otro = TODOS.find((id) => id !== estado.algoA) || 'quicksort';
  if (cual === 'a') {
    estado.algoB = otro;
    $('#sel-algo-b').value = otro;
  } else {
    estado.algoA = otro;
    $('#sel-algo-a').value = otro;
  }
}

// ------------------------------------------------------------
// Eventos
// ------------------------------------------------------------
function registrarEventos() {
  // Modos
  document.querySelectorAll('.modo').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (estado.modo === btn.dataset.modo) return;
      document.querySelectorAll('.modo').forEach((b) => b.classList.remove('activo'));
      btn.classList.add('activo');
      estado.modo = btn.dataset.modo;
      montar();
    });
  });

  // Tema
  $('#btn-tema').addEventListener('click', cambiarTema);

  // Algoritmos
  $('#sel-algo-a').addEventListener('change', (ev) => {
    estado.algoA = ev.target.value;
    evitarRepetidos('a');
    recargar();
  });

  $('#sel-algo-b').addEventListener('change', (ev) => {
    estado.algoB = ev.target.value;
    evitarRepetidos('b');
    recargar();
  });

  // Objetivo de la búsqueda
  $('#inp-objetivo').addEventListener('change', () => recargar());

  // Datos
  $('#sel-datos').addEventListener('change', (ev) => {
    estado.datos = ev.target.value;
    estado.arrayBase = generarArray();
    recargar();
  });

  $('#rng-tam').addEventListener('input', (ev) => {
    estado.tam = Number(ev.target.value);
    $('#val-tam').textContent = estado.tam;
    estado.arrayBase = generarArray();
    recargar();
  });

  $('#rng-vel').addEventListener('input', () => {
    estado.vistas.forEach((v) => { v.motor.vel = velMs(); });
    pintarVelocidad();
  });

  // Transporte
  $('#btn-nuevo').addEventListener('click', () => {
    estado.arrayBase = generarArray();
    recargar();
  });
  $('#btn-reset').addEventListener('click', reiniciar);
  $('#btn-play').addEventListener('click', playPausa);
  $('#btn-paso').addEventListener('click', unPaso);
  $('#btn-fin').addEventListener('click', irAlFinal);

  // Atajos de teclado
  document.addEventListener('keydown', (ev) => {
    if (Quiz.abierto) return; // mientras hay pregunta, manda el modal
    const tag = (ev.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;

    if (ev.code === 'Space') {
      ev.preventDefault();
      playPausa();
    } else if (ev.code === 'ArrowRight') {
      ev.preventDefault();
      unPaso();
    } else if (ev.key === 'r' || ev.key === 'R') {
      if (!ev.ctrlKey && !ev.metaKey && !ev.altKey) reiniciar();
    } else if (ev.key === 'f' || ev.key === 'F') {
      if (!ev.ctrlKey && !ev.metaKey && !ev.altKey) irAlFinal();
    }
  });
}

// ------------------------------------------------------------
// Arranque
// ------------------------------------------------------------
Quiz.init();
rellenarSelects();
pintarBotonTema();
registrarEventos();
pintarVelocidad();
estado.arrayBase = generarArray();
montar();
