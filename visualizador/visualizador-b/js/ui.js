/* ============================================================
   ui.js — La parte visual: código, barras y diagrama de flujo
   ------------------------------------------------------------
   Una "Vista" = un algoritmo en pantalla. Tiene su propio Motor.
   Lo que hace aquí es traducir cada traza en:
     · la línea de código C# que se ilumina
     · las barras del array con su color
     · el mensaje en lenguaje llano
     · las variables y los contadores
     · el nodo del diagrama de flujo que se activa
   ============================================================ */

// ---------- Ayudantes de resaltado de sintaxis ----------
const escapar = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function resaltarCs(texto) {
  if (window.hljs) {
    try {
      const res = hljs.highlight(texto, { language: 'csharp', ignoreIllegals: true });
      if (res && res.value) return res.value;
    } catch (e) {
      // Sin resaltado (idioma no disponible): seguimos con texto plano
    }
  }
  return escapar(texto) || '&nbsp;';
}

const ICONOS_PASO = {
  inicio: '🎬', init: '🚀', set: '✏️', cmp: '🔍', swap: '🔀', move: '➡️',
  check: '❓', 'fin-cond': '🔚', call: '📞', ret: '↩️',
  found: '🎉', notfound: '😕', fin: '🏁'
};

const CLASES_PASO = {
  cmp: 'msg-cmp', swap: 'msg-swap', move: 'msg-swap',
  found: 'msg-ok', fin: 'msg-fin'
};

// ---------- Variables de tema para Mermaid ----------
function temaMermaid(oscuro) {
  return {
    background: 'transparent',
    fontFamily: 'Ubuntu, -apple-system, sans-serif',
    fontSize: '13px',
    primaryColor: oscuro ? '#202127' : '#f6f6f7',
    primaryTextColor: oscuro ? '#ebebf5db' : '#3c3c43',
    primaryBorderColor: oscuro ? '#7289da' : '#4967cf',
    secondaryColor: oscuro ? '#1438b824' : '#1438b829',
    secondaryTextColor: oscuro ? '#ebebf59a' : '#3c3c43c7',
    secondaryBorderColor: oscuro ? '#3c3f44' : '#c2c2c4',
    tertiaryColor: oscuro ? '#161618' : '#ffffff',
    tertiaryTextColor: oscuro ? '#ebebf59a' : '#3c3c43c7',
    tertiaryBorderColor: oscuro ? '#3c3f44' : '#c2c2c4',
    lineColor: oscuro ? '#939499' : '#656869',
    textColor: oscuro ? '#ebebf5db' : '#3c3c43',
    mainBkg: oscuro ? '#202127' : '#f6f6f7',
    nodeBorder: oscuro ? '#7289da' : '#4967cf',
    clusterBkg: oscuro ? '#161618' : '#f6f6f7',
    clusterBorder: oscuro ? '#3c3f44' : '#c2c2c4',
    titleColor: oscuro ? '#ebebf5db' : '#3c3c43',
    edgeLabelBackground: oscuro ? '#202127' : '#ffffff',
    edgeColor: oscuro ? '#939499' : '#656869',
    defaultEdgeColor: oscuro ? '#939499' : '#656869'
  };
}

/** Saca el número de línea de un nodo del diagrama (id tipo "flowchart-L8-3"). */
const lineaDeNodo = (id) => {
  const m = String(id || '').match(/(?:^|-)L(\d+)(?:-|$)/);
  return m ? Number(m[1]) : null;
};

// ---------- Plantilla de cada vista ----------
const plantillaVista = () => `
<div class="panel panel-codigo">
  <div class="panel-titulo"><span class="punto azul"></span> Código C# <span class="destaque algo-nombre"></span></div>
  <div class="codigo-scroll"><div class="codigo"></div></div>
  <p class="idea"></p>
  <div class="pie-codigo">
    <div class="complejidad"></div>
    <p class="uso"></p>
  </div>
</div>

<div class="panel panel-escena">
  <div class="mensaje"><span class="msg-icono">🎬</span><span class="msg-texto">Preparado…</span></div>
  <div class="progreso"><div class="progreso-barra"></div></div>
  <div class="zona-barras">
    <div class="barras">
      <div class="rango-banda" style="opacity:0"></div>
      <div class="marcas"></div>
    </div>
  </div>
  <div class="barra-estado">
    <div class="estado-grupo">
      <span class="estado-titulo">Variables</span>
      <div class="vars-lista"></div>
    </div>
    <div class="estado-grupo">
      <span class="estado-titulo">Contadores</span>
      <div class="stats">
        <div class="stat"><b data-stat="pasos">0</b><span>pasos</span></div>
        <div class="stat"><b data-stat="cmp">0</b><span>comparaciones</span></div>
        <div class="stat"><b data-stat="swap">0</b><span class="lbl-swap">intercambios</span></div>
      </div>
    </div>
  </div>
  <div class="leyenda">
    <span><i class="pt pt-cmp"></i>comparando</span>
    <span><i class="pt pt-swap"></i>intercambiando</span>
    <span><i class="pt pt-fijo"></i>ya fijo / encontrado</span>
    <span><i class="pt pt-pivot"></i>pivote, mínimo o medio</span>
    <span><i class="pt pt-fuera"></i>descartado</span>
  </div>
  <div class="diagrama-caja">
    <div class="diagrama-cab">
      <span>📐 Diagrama de flujo · haz clic en un nodo para saltar allí</span>
      <span class="zoom-controles">
        <button class="btn-mini" type="button" data-accion="zoom-menos" title="Reducir el diagrama">−</button>
        <span class="zoom-valor" data-zoom>100%</span>
        <button class="btn-mini" type="button" data-accion="zoom-mas" title="Ampliar el diagrama">+</button>
        <button class="btn-mini" type="button" data-accion="zoom-fit" title="Encogerlo para verlo entero en el cuadro">Ajustar</button>
        <button class="btn-mini" type="button" data-accion="diagrama">Ocultar</button>
      </span>
    </div>
    <div class="diagrama"></div>
  </div>
</div>

`;

class Vista {
  constructor(indice) {
    this.indice = indice;
    this.algo = null;
    this.arrayBase = [];
    this.barras = [];
    this.lineasEls = [];
    this.flujoLineas = new Set();
    this.ultimaLinea = null;
    this.tokenRender = 0;
    this._scrollTimer = null;
    this.pasoActual = null;
    this.zoom = 1;      // 1 = 100 %: el usuario puede agrandarlo o encogerlo
    this.ajustado = true; // por defecto el diagrama se dibuja ajustado al cuadro
    this._baseH = 0;    // alto del diagrama a zoom 100 %

    this.raiz = document.createElement('div');
    this.raiz.className = 'vista';
    this.raiz.innerHTML = plantillaVista();
    document.getElementById('zona-vistas').appendChild(this.raiz);

    // Referencias a las piezas
    this.$nombre = this.raiz.querySelector('.algo-nombre');
    this.$idea = this.raiz.querySelector('.idea');
    this.$codigo = this.raiz.querySelector('.codigo');
    this.$mensaje = this.raiz.querySelector('.mensaje');
    this.$msgIcono = this.raiz.querySelector('.msg-icono');
    this.$msgTexto = this.raiz.querySelector('.msg-texto');
    this.$progreso = this.raiz.querySelector('.progreso-barra');
    this.$barras = this.raiz.querySelector('.barras');
    this.$banda = this.raiz.querySelector('.rango-banda');
    this.$marcas = this.raiz.querySelector('.marcas');
    this.$diagrama = this.raiz.querySelector('.diagrama');
    this.$zoomValor = this.raiz.querySelector('[data-zoom]');
    this.$vars = this.raiz.querySelector('.vars-lista');
    this.$stats = this.raiz.querySelector('.stats');
    this.$comp = this.raiz.querySelector('.complejidad');
    this.$uso = this.raiz.querySelector('.uso');

    // Motor propio de esta vista
    this.motor = new Motor();
    this.motor.onStep = (paso) => this.aplicarPaso(paso);

    // Botones del diagrama: ocultar y zoom
    this.raiz.querySelectorAll('[data-accion]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        const accion = ev.currentTarget.dataset.accion;
        if (accion === 'diagrama') {
          const visible = this.$diagrama.style.display !== 'none';
          this.$diagrama.style.display = visible ? 'none' : '';
          ev.currentTarget.textContent = visible ? 'Mostrar' : 'Ocultar';
          if (!visible) { // Se vuelve a mostrar: reescalamos
            if (this.ajustado) this.ajustarZoom();
            else this.aplicarZoom();
          }
        } else if (accion === 'zoom-menos') {
          this.cambiarZoom(-0.15);
        } else if (accion === 'zoom-mas') {
          this.cambiarZoom(0.15);
        } else if (accion === 'zoom-fit') {
          this.ajustarZoom();
        }
      });
    });

    // Si cambia el tamaño del cuadro (ventana, modo comparar...), reescalamos:
    // en modo ajustado se recalcula el encaje; si el usuario amplió a mano,
    // se respeta su zoom
    if (window.ResizeObserver) {
      this._observador = new ResizeObserver(() => {
        if (this.ajustado) this.ajustarZoom();
        else this.aplicarZoom();
      });
      this._observador.observe(this.$diagrama);

      // Si cambia el ancho del panel de código, reajustamos la letra
      this._obsCodigo = new ResizeObserver(() => {
        const cont = this.$codigo.parentElement;
        if (cont && cont.clientWidth !== this._ultAnchoCod) this.ajustarFuente();
      });
      if (this.$codigo.parentElement) this._obsCodigo.observe(this.$codigo.parentElement);
    }
  }

  /** Prepara la vista para un algoritmo concreto. */
  cargar(algo, arr, trazas) {
    this.algo = algo;
    this.arrayBase = [...arr];
    this.pintarCodigo(algo);
    this.pintarMeta(algo);
    this.pintarDiagrama(algo);
    this.motor.cargar(trazas);
    this.reiniciarVisual();
  }

  reiniciarVisual() {
    this.ultimaLinea = null;
    this.pasoActual = null;
    clearInterval(this._scrollTimer);
    this.lineasEls.forEach((el) => el.classList.remove('activa'));
    this.$diagrama.querySelectorAll('g.node.nodo-activo').forEach((n) => n.classList.remove('nodo-activo'));
    this.$diagrama.scrollTop = 0;
    this.$diagrama.scrollLeft = 0;
    this.pintarBarras(this.arrayBase, {});
    this.pintarMarcas({});
    this.pintarBanda({});
    this.pintarMensaje({ act: 'inicio', msg: 'Pulsa ▶ Play para animarlo, o ⏭ Paso para avanzar de uno en uno. Mira cómo se enciende la línea del código y el nodo del diagrama.' });
    this.pintarVars({});
    this.pintarStats();
    this.pintarProgreso();
    this.quitarFin();
  }

  // --------------------------------------------------------
  // Código C#
  // --------------------------------------------------------
  pintarCodigo(algo) {
    this.lineasTexto = algo.codigo;
    this.lineasEls = algo.codigo.map((texto, idx) => {
      const div = document.createElement('div');
      div.className = 'linea';
      div.dataset.l = String(idx + 1);
      div.innerHTML = `<span class="num">${idx + 1}</span><span class="txt">${resaltarCs(texto)}</span>`;
      return div;
    });
    this.$codigo.replaceChildren(...this.lineasEls);
    this.ajustarFuente();
  }

  /**
   * Encoge la letra del código hasta que la línea más larga cabe entera.
   * Así no hace falta barra horizontal ni partir las líneas.
   */
  ajustarFuente() {
    if (!this.lineasTexto || !this.lineasTexto.length) return;
    const cont = this.$codigo.parentElement; // .codigo-scroll
    if (!cont) return;

    this._ultAnchoCod = cont.clientWidth;
    // Hueco útil: ancho - rellenos del scroll - números - separaciones
    const disponible = cont.clientWidth - 60;
    if (disponible < 60) return;

    const base = 13;
    const mide = document.createElement('span');
    mide.style.cssText = 'position:absolute;left:-99999px;top:0;visibility:hidden;white-space:pre;';
    // Ojo: medir con la MISMA tipografía con la que se va a pintar (monoespaciada)
    mide.style.fontFamily = this.lineasEls.length
      ? getComputedStyle(this.lineasEls[0]).fontFamily
      : 'consolas, monospace';
    mide.style.fontSize = `${base}px`;
    document.body.appendChild(mide);

    let anchoMax = 0;
    for (const t of this.lineasTexto) {
      mide.textContent = t.length ? t : ' ';
      anchoMax = Math.max(anchoMax, mide.offsetWidth);
    }
    mide.remove();

    let fuente = base;
    if (anchoMax > disponible) {
      fuente = Math.max(9, Math.floor((disponible / anchoMax) * base * 10) / 10);
    }
    this.$codigo.style.fontSize = `${fuente}px`;
  }

  resaltarLinea(l) {
    this.lineasEls.forEach((el) => el.classList.toggle('activa', Number(el.dataset.l) === l));
    const activa = this.$codigo.querySelector('.linea.activa');
    if (activa) activa.scrollIntoView({ block: 'nearest' });
  }

  // --------------------------------------------------------
  // Metadatos: idea, ejemplo real y complejidad
  // --------------------------------------------------------
  pintarMeta(algo) {
    this.$nombre.textContent = `${algo.icono} ${algo.nombre}`;
    this.$idea.innerHTML = `💡 ${escapar(algo.idea)}<br />📌 Ejemplo real: ${escapar(algo.ejemplo)}`;

    const c = algo.complejidad;
    const filas = [
      ['Mejor caso', c.mejor, ''],
      ['Promedio', c.promedio, ''],
      ['Peor caso', c.peor, ''],
      ['Estable', c.estable ? 'Sí' : 'No', c.estable ? 'ok' : 'no']
    ];
    if (c.requiereOrden !== undefined) filas.push(['Requiere orden', c.requiereOrden ? 'Sí' : 'No', c.requiereOrden ? 'ok' : 'no']);

    this.$comp.innerHTML = filas
      .map(([etq, val, cls]) => `<div class="comp-fila"><span>${etq}</span><b class="${cls}">${escapar(val)}</b></div>`)
      .join('');

    this.$uso.textContent = `Cuándo usarlo: ${algo.uso}`;
    this.$stats.querySelector('.lbl-swap').textContent = algo.tipo === 'busqueda' ? 'visitados' : 'intercambios';
  }

  // --------------------------------------------------------
  // Diagrama de flujo (Mermaid)
  // --------------------------------------------------------
  async pintarDiagrama(algo) {
    const cont = this.$diagrama;

    if (!window.mermaid) {
      this.flujoLineas = new Set();
      cont.innerHTML = '<p class="vars-vacio">Diagrama no disponible: comprueba tu conexión a internet.</p>';
      return;
    }

    const token = ++this.tokenRender;
    const oscuro = document.documentElement.dataset.theme === 'dark';

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        flowchart: { htmlLabels: true, useMaxWidth: true, nodeSpacing: 20, rankSpacing: 18, curve: 'basis', padding: 6 },
        themeVariables: temaMermaid(oscuro)
      });

      const { svg } = await mermaid.render(`flujo-${this.indice}-${token}`, algo.flujo);
      if (token !== this.tokenRender) return; // Otra renderización llegó primero

      cont.innerHTML = svg;
      this.flujoLineas = nodosDelFlujo(algo.flujo);
      this.vincularNodos();
      this.aplicarZoom();

      // Se dibuja YA AJUSTADO al cuadro (sin tener que pulsar "Ajustar")
      this.ajustado = true;
      this.ajustarZoom();

      if (this.ultimaLinea !== null) this.resaltarNodo(this.ultimaLinea);
    } catch (e) {
      cont.innerHTML = '<p class="vars-vacio">No se pudo dibujar el diagrama.</p>';
    }
  }

  vincularNodos() {
    this.$diagrama.querySelectorAll('g.node').forEach((g) => {
      const l = lineaDeNodo(g.id);
      if (!l) return;
      g.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.saltarALinea?.(l);
      });
    });
  }

  // --------------------------------------------------------
  // Zoom del diagrama (− / + / Ajustar)
  // --------------------------------------------------------
  /** Aplica el zoom actual fijando el tamaño real del SVG (no un transform). */
  aplicarZoom() {
    const svg = this.$diagrama.querySelector('svg');
    if (!svg) return;

    const vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width
      ? svg.viewBox.baseVal
      : null;
    if (!vb) return;

    // Ancho útil del cuadro (clientWidth incluye el relleno: 12 px a cada lado)
    const ancho = Math.max(140, this.$diagrama.clientWidth - 24);
    const altoBase = vb.height * (ancho / vb.width); // alto a 100 %

    svg.style.width = `${Math.round(ancho * this.zoom)}px`;
    svg.style.height = `${Math.round(altoBase * this.zoom)}px`;
    svg.style.maxWidth = 'none';

    this._baseH = altoBase;
    this.pintarZoom();
  }

  pintarZoom() {
    if (this.$zoomValor) this.$zoomValor.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  cambiarZoom(delta) {
    const nuevo = Math.min(3, Math.max(0.08, Math.round((this.zoom + delta) * 100) / 100));
    if (nuevo === this.zoom) return;
    this.ajustado = false; // el usuario toma el control: ya no auto-ajustamos
    this.zoom = nuevo;
    this.aplicarZoom();
    this.recentrarActivo();
  }

  /**
   * Encoge el diagrama para que quepa COMPLETO dentro del cuadro.
   * Nunca amplía más del 100 % (el ancho está calculado a ancho de cuadro).
   */
  ajustarZoom() {
    // 1) Recalculamos el tamaño base con las medidas ACTUALES del cuadro
    this.aplicarZoom();
    if (!this._baseH) return;

    // 2) Capacidad real del cuadro: su max-height, no su altura actual.
    //    Si midiéramos la altura actual, encoger el SVG encogería el cuadro
    //    y entraríamos en un bucle de encogimiento continuo.
    const maxCss = getComputedStyle(this.$diagrama).maxHeight;
    const capacidad = maxCss.endsWith('px') ? parseFloat(maxCss) : this.$diagrama.clientHeight;
    const caja = Math.max(80, capacidad - 16);

    // 3) Encaje (máximo 100 %: a más de 100 % se saldría por el ancho)
    const encaje = caja / this._baseH;
    this.zoom = Math.min(1, Math.max(0.08, Math.round(encaje * 100) / 100));

    this.aplicarZoom();
    this.$diagrama.scrollTop = 0;
    this.$diagrama.scrollLeft = 0;
    this.recentrarActivo();
  }

  /** Vuelve a centrar el nodo activo tras cambiar el zoom. */
  recentrarActivo() {
    if (this.ultimaLinea === null) return;
    const activo = this.$diagrama.querySelector('g.node.nodo-activo');
    if (activo) this.centrarEnNodo(activo);
  }

  resaltarNodo(l) {
    this.ultimaLinea = l;
    const cont = this.$diagrama;
    cont.querySelectorAll('g.node.nodo-activo').forEach((n) => n.classList.remove('nodo-activo'));
    if (!this.flujoLineas.has(`L${l}`)) return; // Esta línea no tiene nodo: mantenemos el anterior
    const objetivo = [...cont.querySelectorAll('g.node')].find((g) => lineaDeNodo(g.id) === l);
    if (!objetivo) return;
    objetivo.classList.add('nodo-activo');
    this.centrarEnNodo(objetivo);
  }

  /** Desplaza SOLO el contenedor del diagrama para que el nodo activo se vea. */
  centrarEnNodo(nodo) {
    const cont = this.$diagrama;
    const nr = nodo.getBoundingClientRect();
    const cr = cont.getBoundingClientRect();
    if (!nr.height || !cr.height) return;

    const maxTop = Math.max(0, cont.scrollHeight - cont.clientHeight);
    const maxLeft = Math.max(0, cont.scrollWidth - cont.clientWidth);
    const top = Math.min(maxTop, Math.max(0,
      cont.scrollTop + (nr.top - cr.top) - (cont.clientHeight - nr.height) / 2));
    const left = Math.min(maxLeft, Math.max(0,
      cont.scrollLeft + (nr.left - cr.left) - (cont.clientWidth - nr.width) / 2));

    const s0t = cont.scrollTop;
    const s0l = cont.scrollLeft;
    const dt = top - s0t;
    const dl = left - s0l;
    if (Math.abs(dt) < 2 && Math.abs(dl) < 2) return;

    // Animación propia con setInterval: el scroll suave nativo y requestAnimationFrame
    // no llegan a ejecutarse si la pestaña está en segundo plano
    clearInterval(this._scrollTimer);
    const t0 = performance.now();
    const dur = 250;

    this._scrollTimer = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      cont.scrollTop = s0t + dt * e;
      cont.scrollLeft = s0l + dl * e;
      if (p >= 1) clearInterval(this._scrollTimer);
    }, 16);
  }

  // --------------------------------------------------------
  // Barras del array
  // --------------------------------------------------------
  construirBarras(arr) {
    this.$barras.querySelectorAll('.barra').forEach((b) => b.remove());
    arr.forEach((_, i) => {
      const b = document.createElement('div');
      b.className = 'barra';
      b.dataset.i = String(i);
      b.innerHTML = `<div class="barra-cuerpo"><span class="valor"></span></div><span class="indice">${i}</span>`;
      this.$barras.appendChild(b);
    });
    this.barras = [...this.$barras.querySelectorAll('.barra')];
  }

  pintarBarras(arr, paso = {}) {
    if (!arr || arr.length === 0) return;
    if (this.barras.length !== arr.length) this.construirBarras(arr);

    const max = Math.max(...arr, 1);
    const roles = new Map((paso.idx || []).map(([i, c]) => [i, c]));
    const fijos = new Set(paso.fijos || []);
    const visit = new Set(paso.visit || []);
    const r = paso.rango || [-1, -1];

    arr.forEach((v, i) => {
      const b = this.barras[i];
      b.querySelector('.valor').textContent = v;
      b.querySelector('.barra-cuerpo').style.height = `${Math.max(7, (v / max) * 100)}%`;

      let rol = 'base';
      if (fijos.has(i)) rol = 'fijo';
      if (visit.has(i) && rol === 'base') rol = 'visitado';
      if (paso.descartar && (i < r[0] || i > r[1])) rol = 'fuera';
      if (roles.has(i)) rol = roles.get(i);
      b.dataset.rol = rol;

      const toca = (paso.act === 'swap' || paso.act === 'move') && (paso.idx || []).some(([k]) => k === i);
      if (toca) {
        b.classList.remove('pulso');
        void b.offsetWidth; // reinicia la animación
        b.classList.add('pulso');
      } else {
        b.classList.remove('pulso');
      }
    });
  }

  pintarMarcas(paso) {
    const grupos = new Map();
    (paso.marcas || []).forEach(([etq, i]) => {
      if (!grupos.has(i)) grupos.set(i, []);
      grupos.get(i).push(etq);
    });

    const n = this.barras.length || 1;
    this.$marcas.innerHTML = [...grupos.entries()]
      .filter(([i]) => i >= 0 && i < n)
      .map(([i, etqs]) => `<span class="marca-barra" style="left:${(((i + 0.5) / n) * 100).toFixed(2)}%">${etqs.join('/')}</span>`)
      .join('');
  }

  pintarBanda(paso) {
    const r = paso.rango;
    if (!r || r[1] < r[0] || !this.barras[r[0]] || !this.barras[r[1]]) {
      this.$banda.style.opacity = '0';
      return;
    }
    const a = this.barras[r[0]];
    const b = this.barras[r[1]];
    this.$banda.style.left = `${a.offsetLeft}px`;
    this.$banda.style.width = `${b.offsetLeft + b.offsetWidth - a.offsetLeft}px`;
    this.$banda.style.opacity = '1';
  }

  // --------------------------------------------------------
  // Mensaje, variables, contadores y progreso
  // --------------------------------------------------------
  pintarMensaje(paso) {
    this.$mensaje.className = `mensaje ${CLASES_PASO[paso.act] || ''}`;
    this.$msgIcono.textContent = ICONOS_PASO[paso.act] || 'ℹ️';
    this.$msgTexto.textContent = paso.msg || '';
  }

  pintarVars(paso) {
    const vars = paso.vars || {};
    const entradas = Object.entries(vars);
    this.$vars.innerHTML = entradas.length
      ? entradas.map(([k, v]) => `<span class="var"><b>${escapar(k)}</b> = <i>${escapar(v)}</i></span>`).join('')
      : '<span class="vars-vacio">todavía no hay variables en marcha</span>';
  }

  pintarStats() {
    const s = this.motor.stats;
    this.$stats.querySelector('[data-stat="pasos"]').textContent = s.pasos;
    this.$stats.querySelector('[data-stat="cmp"]').textContent = s.cmp;
    this.$stats.querySelector('[data-stat="swap"]').textContent =
      this.algo && this.algo.tipo === 'busqueda'
        ? (this.pasoActual?.visit?.length ?? 0)
        : s.swap;
  }

  pintarProgreso() {
    this.$progreso.style.width = `${this.motor.progreso.toFixed(1)}%`;
  }

  // --------------------------------------------------------
  // Paso a paso y final
  // --------------------------------------------------------
  aplicarPaso(paso) {
    this.pasoActual = paso;
    this.resaltarLinea(paso.l);
    this.resaltarNodo(paso.l);
    this.pintarBarras(paso.arr, paso);
    this.pintarMarcas(paso);
    this.pintarBanda(paso);
    this.pintarMensaje(paso);
    this.pintarVars(paso);
    this.pintarStats();
    this.pintarProgreso();
  }

  mostrarFin() {
    this.quitarFin();
    const s = this.motor.stats;
    const caja = document.createElement('div');
    caja.className = 'fin-caja';
    caja.innerHTML = `🏁 Terminado en <b>${s.pasos}</b> pasos · ${s.cmp} comparaciones · ${
      this.algo.tipo === 'busqueda' ? 'búsqueda' : s.swap + ' intercambios'
    }`;
    this.raiz.querySelector('.panel-escena').appendChild(caja);
    this.$fin = caja;
  }

  quitarFin() {
    this.$fin?.remove();
    this.$fin = null;
  }

  /** Cambio de tema: hay que volver a dibujar el diagrama con los nuevos colores. */
  refrescarTema() {
    if (this.algo) this.pintarDiagrama(this.algo);
  }
}
