/* ============================================================
   quiz.js — Modo reto: "¿qué línea se ejecuta a continuación?"
   ------------------------------------------------------------
   Se registra como "onPre" del Motor: justo ANTES de aplicar un
   paso, decide si toca pregunta. Si toca, devuelve true y el
   motor se detiene hasta que el alumno responda.
   ============================================================ */

const Quiz = {
  activo: false,
  vista: null,
  cada: 5,
  aciertos: 0,
  fallos: 0,
  preguntas: 0,
  racha: 0,
  mejorRacha: 0,
  pendiente: null,
  correcta: -1,
  respondida: false,

  init() {
    this.$fondo = document.getElementById('quiz-fondo');
    this.$fondo.innerHTML = `
      <div class="quiz-tarjeta" role="dialog" aria-modal="true" aria-label="Reto">
        <div class="quiz-cab">
          <h2>🧠 Reto: ¿qué línea se ejecuta ahora?</h2>
          <div class="quiz-score">
            <span class="ok">✓ <b data-score="ok">0</b></span>
            <span class="no">✗ <b data-score="no">0</b></span>
            <span>🔥 <b data-score="racha">0</b></span>
          </div>
        </div>
        <p class="quiz-contexto"></p>
        <div class="quiz-opciones"></div>
        <p class="quiz-veredicto"></p>
        <div class="quiz-pie">
          <label>Pregunta cada
            <select data-quiz="cada">
              <option value="3">3 pasos</option>
              <option value="5" selected>5 pasos</option>
              <option value="8">8 pasos</option>
              <option value="12">12 pasos</option>
            </select>
          </label>
          <button class="btn-mini" type="button" data-quiz="saltar">Seguir sin responder →</button>
        </div>
      </div>`;

    this.$contexto = this.$fondo.querySelector('.quiz-contexto');
    this.$opciones = this.$fondo.querySelector('.quiz-opciones');
    this.$veredicto = this.$fondo.querySelector('.quiz-veredicto');

    this.$fondo.querySelector('[data-quiz="saltar"]').addEventListener('click', () => this.cerrar());
    this.$fondo.querySelector('[data-quiz="cada"]').addEventListener('change', (ev) => {
      this.cada = Number(ev.target.value);
    });

    // Clic fuera de la tarjeta = seguir sin responder
    this.$fondo.addEventListener('click', (ev) => {
      if (ev.target === this.$fondo) this.cerrar();
    });

    // Teclas 1-4 para responder sin el ratón
    document.addEventListener('keydown', (ev) => {
      if (!this.abierto || this.respondida) return;
      const n = Number(ev.key);
      if (n >= 1 && n <= 4) {
        ev.preventDefault();
        this.responder(n - 1);
      }
    });
  },

  get abierto() { return !this.$fondo.hidden; },

  reiniciar() {
    this.aciertos = 0;
    this.fallos = 0;
    this.preguntas = 0;
    this.racha = 0;
    this.mejorRacha = 0;
    this.cerrarSilencioso();
    this.pintarScore();
  },

  cerrarSilencioso() {
    this.$fondo.hidden = true;
    this.pendiente = null;
    this.respondida = false;
    this.correcta = -1;
  },

  /**
   * El motor lo llama antes de aplicar cada paso.
   * Devuelve true => esperar (hay pregunta abierta o toca preguntar).
   */
  pre(paso, vista) {
    if (!this.activo) return false;
    if (this.pendiente) return true; // ya hay una pregunta en pantalla

    const numero = vista.motor.stats.pasos + 1;
    if (numero % this.cada !== 0) return false;

    this.pendiente = paso;
    this.vista = vista;
    this.preguntas++;
    this.mostrar(paso, vista);
    return true;
  },

  mostrar(paso, vista) {
    const algo = vista.algo;
    const estadoArr = (vista.pasoActual?.arr || vista.arrayBase).join(', ');
    const ultimo = vista.pasoActual?.msg ?? 'Empezamos';

    this.$contexto.innerHTML =
      `Estado del array: <code>[${escapar(estadoArr)}]</code><br />` +
      `Último paso: ${escapar(ultimo)}<br />` +
      `<b>👉 ¿Qué línea se ejecuta a continuación?</b>`;

    const opciones = this.construirOpciones(algo, paso);
    this.correcta = opciones.findIndex((o) => o.linea === paso.l);
    this.respondida = false;
    this.$veredicto.textContent = '';
    this.$veredicto.className = 'quiz-veredicto';

    this.$opciones.innerHTML = '';
    opciones.forEach((op, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'quiz-opcion';
      b.textContent = `${i + 1}. ${op.texto.trim()}`;
      b.title = `Línea ${op.linea}`;
      b.addEventListener('click', () => this.responder(i));
      this.$opciones.appendChild(b);
    });

    this.pintarScore();
    this.$fondo.hidden = false;
  },

  /** Opción correcta + 3 líneas de distracción reales del mismo código. */
  construirOpciones(algo, paso) {
    const lineas = algo.codigo;
    const ejecutables = [];

    lineas.forEach((texto, i) => {
      const s = texto.trim();
      if (!s || s === '{' || s === '}' || s.startsWith('//')) return;
      ejecutables.push(i);
    });

    const otros = this.mezclar(ejecutables.filter((i) => i + 1 !== paso.l));
    const distractores = otros.slice(0, 3);
    const indices = this.mezclar([paso.l - 1, ...distractores]);

    return indices.map((i) => ({ linea: i + 1, texto: lineas[i] }));
  },

  responder(i) {
    if (this.respondida || !this.pendiente) return;
    this.respondida = true;

    const botones = [...this.$opciones.children];
    botones.forEach((b) => { b.disabled = true; });
    botones[this.correcta]?.classList.add('correcta');

    const acierto = i === this.correcta;
    const lineaBuena = this.pendiente.l;

    if (acierto) {
      this.aciertos++;
      this.racha++;
      this.mejorRacha = Math.max(this.mejorRacha, this.racha);
      this.$veredicto.textContent = `🎉 ¡Correcto! Se ejecuta la línea ${lineaBuena}.`;
      this.$veredicto.className = 'quiz-veredicto ok';
    } else {
      this.fallos++;
      this.racha = 0;
      botones[i]?.classList.add('incorrecta');
      this.$veredicto.textContent = `❌ Casi: era la línea ${lineaBuena}. ¡Sigue practicando!`;
      this.$veredicto.className = 'quiz-veredicto no';
    }

    this.pintarScore();
    setTimeout(() => this.cerrar(), 1200);
  },

  /** Cierra la pregunta y le dice al motor que aplique el paso pendiente. */
  cerrar() {
    if (!this.pendiente) {
      this.cerrarSilencioso();
      return;
    }
    this.$fondo.hidden = true;
    this.pendiente = null;
    this.respondida = false;
    this.vista?.motor.reanudar();
  },

  pintarScore() {
    this.$fondo.querySelector('[data-score="ok"]').textContent = this.aciertos;
    this.$fondo.querySelector('[data-score="no"]').textContent = this.fallos;
    this.$fondo.querySelector('[data-score="racha"]').textContent = this.racha;
  },

  resumen() {
    if (this.preguntas === 0) return '';
    const nota = this.aciertos === 0 ? '💪' : this.aciertos >= this.preguntas * 0.7 ? '⭐' : '📚';
    return `${nota} Reto: <b>${this.aciertos}</b> aciertos y <b>${this.fallos}</b> fallos de ${this.preguntas} preguntas (mejor racha: ${this.mejorRacha})`;
  },

  mezclar(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
};
