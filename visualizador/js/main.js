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

    // Con la curva abierta solo manda cerrarla (Esc); el resto de
    // atajos no debe mover la simulación de detrás
    if (curvaAbierta()) {
      if (ev.key === 'Escape') cerrarCurva();
      return;
    }

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
// Modal: la curva del Big O (comparaciones según el tamaño)
// ------------------------------------------------------------
// Sin librerías: se pinta un SVG a mano para que la web siga
// funcionando con doble clic y sin internet.
const TAMAÑOS_CURVA = [6, 10, 14, 18, 22];
const COLORES_CURVA = ['#4967cf', '#e5484d', '#46a758', '#9c27b0', '#ff9800', '#0091b3', '#8b6f47', '#607D8B'];

/** Permutación determinista: mismos datos en cada medición. */
function arrayDePrueba(n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  let s = (n * 1103515245 + 12345) & 0x7fffffff;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Comparaciones que hace el algoritmo, sin animar nada. */
function contarComparaciones(algo, arr, objetivo) {
  let cmp = 0;
  for (const p of algo.generar(arr, objetivo)) if (p.act === 'cmp') cmp++;
  return cmp;
}

/**
 * Media de comparaciones para un tamaño dado.
 * · Ordenación: una ejecución con datos deterministas.
 * · Búsqueda: media de TODOS los objetivos posibles, así no depende
 *   de la suerte de coger uno cerca o lejos.
 */
function comparacionesMedias(algo, n) {
  if (algo.tipo === 'busqueda') {
    const ordenado = Array.from({ length: n }, (_, i) => i);
    let total = 0;
    for (let obj = 0; obj < n; obj++) total += contarComparaciones(algo, ordenado, obj);
    return Math.round(total / n);
  }
  return contarComparaciones(algo, arrayDePrueba(n), null);
}

/** Redondea "hacia arriba" a un número redondo para el eje Y. */
function techoBonito(v) {
  if (v <= 5) return 5;
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * exp;
}

function pintarCurva(algo) {
  // Solo se comparan algoritmos del MISMO tipo: mezclar ordenación con
  // búsqueda en un mismo eje no significa nada (n² vs log n)
  const delTipo = TODOS.filter((id) => ALGORITMOS[id].tipo === algo.tipo);

  const series = delTipo.map((id, i) => ({
    id,
    nombre: ALGORITMOS[id].nombre,
    color: COLORES_CURVA[i % COLORES_CURVA.length],
    activa: id === algo.id,
    puntos: TAMAÑOS_CURVA.map((n) => [n, comparacionesMedias(ALGORITMOS[id], n)]),
  }));

  // La serie activa se pinta la última (encima) y más gruesa
  series.sort((a, b) => Number(a.activa) - Number(b.activa));

  const W = 720;
  const H = 320;
  const ml = 56;
  const mr = 20;
  const mt = 18;
  const mb = 46;
  const iw = W - ml - mr;
  const ih = H - mt - mb;

  const maxBruto = Math.max(1, ...series.flatMap((s) => s.puntos.map((p) => p[1])));
  const maxY = techoBonito(maxBruto);
  const x = (n) => ml + TAMAÑOS_CURVA.indexOf(n) * (iw / (TAMAÑOS_CURVA.length - 1));
  const y = (v) => mt + ih - (v / maxY) * ih;

  const rejilla = [];
  for (let k = 0; k <= 4; k++) {
    const v = (maxY / 4) * k;
    const py = y(v);
    rejilla.push(
      `<line x1="${ml}" y1="${py}" x2="${W - mr}" y2="${py}" stroke="currentColor" stroke-opacity=".14" stroke-dasharray="${k === 0 ? '' : '3 4'}"/>` +
      `<text x="${ml - 8}" y="${py + 4}" text-anchor="end" class="cv-eje">${Math.round(v)}</text>`
    );
  }

  const ejesX = TAMAÑOS_CURVA.map((n) =>
    `<text x="${x(n)}" y="${H - mb + 20}" text-anchor="middle" class="cv-eje">${n}</text>`
  ).join('');

  const lineas = series.map((s) => {
    const d = s.puntos.map((p) => `${x(p[0])},${y(p[1])}`).join(' ');
    const grosor = s.activa ? 3 : 1.6;
    const opacidad = s.activa ? 1 : 0.42;
    const puntos = s.puntos.map((p) =>
      `<circle cx="${x(p[0])}" cy="${y(p[1])}" r="${s.activa ? 4.5 : 3}" fill="${s.color}" stroke="var(--vp-c-bg-elv)" stroke-width="1.5"/>`
    ).join('');
    return `<polyline points="${d}" fill="none" stroke="${s.color}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacidad}"/>${puntos}`;
  }).join('');

  const svg =
    `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Comparaciones según el tamaño del array">` +
    rejilla.join('') +
    ejesX +
    `<text x="${ml + iw / 2}" y="${H - 6}" text-anchor="middle" class="cv-eje cv-titulo">tamaño del array (n)</text>` +
    `<text x="14" y="${mt + ih / 2}" text-anchor="middle" class="cv-eje cv-titulo" transform="rotate(-90 14 ${mt + ih / 2})">comparaciones</text>` +
    lineas +
    `</svg>`;

  $('#curva-grafico').innerHTML = svg;
  $('#curva-leyenda').innerHTML = series
    .slice()
    .reverse()
    .map((s) => `<span class="${s.activa ? 'activa' : ''}"><i style="background:${s.color}"></i>${escapar(s.nombre)}</span>`)
    .join('');

  $('#curva-letra').innerHTML =
    `<b>${escapar(algo.nombre)}</b> (${escapar(algo.complejidad.promedio)}) frente a los demás algoritmos de ${algo.tipo === 'busqueda' ? 'búsqueda' : 'ordenación'}.`;
}

function abrirCurva(algo) {
  if (!algo) return;
  pintarCurva(algo);
  $('#curva-fondo').hidden = false;
}

function cerrarCurva() {
  $('#curva-fondo').hidden = true;
}

function curvaAbierta() {
  return !$('#curva-fondo').hidden;
}

document.addEventListener('curva:abrir', (ev) => abrirCurva(ev.detail && ev.detail.algo));
$('#curva-cerrar').addEventListener('click', cerrarCurva);
$('#curva-fondo').addEventListener('click', (ev) => {
  if (ev.target === ev.currentTarget) cerrarCurva(); // clic en el fondo
});

// ------------------------------------------------------------
// Arranque
// ------------------------------------------------------------
Quiz.init();
rellenarSelects();
pintarBotonTema();
registrarEventos();
estado.arrayBase = generarArray();
montar();
