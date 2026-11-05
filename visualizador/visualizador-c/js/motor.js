/* ============================================================
   motor.js — Reproduce una lista de trazas con control de tempo
   ------------------------------------------------------------
   · play / pausa / un paso / ir al final
   · contador de pasos, comparaciones e intercambios
   · puede "bloquearse" para que el modo reto haga su pregunta
     antes de aplicar el paso (onPre devuelve true = esperar)
   ============================================================ */

class Motor {
  constructor() {
    this.trazas = [];
    this.i = -1;
    this.vel = 300; // ms entre pasos
    this.corriendo = false;
    this.timer = null;
    this.bloqueado = false;
    this.stats = { pasos: 0, cmp: 0, swap: 0 };

    this.onStep = null; // (paso, indice) => void
    this.onPre = null;  // (paso) => true si hay que detenerse (reto)
    this.onFin = null;  // () => void
  }

  /** Carga una lista de trazas y vuelve al principio. */
  cargar(trazas) {
    this.parar();
    this.trazas = trazas;
    this.i = -1;
    this.stats = { pasos: 0, cmp: 0, swap: 0 };
    this.bloqueado = false;
  }

  get total() { return this.trazas.length; }
  get terminado() { return this.i >= this.trazas.length - 1; }
  get progreso() { return this.total === 0 ? 0 : ((this.i + 1) / this.total) * 100; }

  /**
   * Aplica el siguiente paso.
   * Devuelve true (aplicado), false (ya no hay) o 'bloqueado' (el reto pregunta).
   */
  siguiente({ forzar = false } = {}) {
    if (this.terminado) return false;

    const paso = this.trazas[this.i + 1];

    if (!forzar && this.onPre && this.onPre(paso) === true) {
      this.bloqueado = true;
      return 'bloqueado';
    }

    this.bloqueado = false;
    this.i++;

    if (paso.act === 'cmp') this.stats.cmp++;
    if (paso.act === 'swap') this.stats.swap++;
    this.stats.pasos++;

    this.onStep?.(paso, this.i);

    if (this.terminado) {
      this.parar();
      this.onFin?.();
    }

    return true;
  }

  play() {
    if (this.corriendo || this.terminado || this.bloqueado) return;
    this.corriendo = true;
    this.programar();
  }

  programar() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.tick(), this.vel);
  }

  tick() {
    if (!this.corriendo || this.bloqueado) return;

    const r = this.siguiente();

    if (r === 'bloqueado') return; // el reto nos detiene; luego nos rellaman
    if (r === false) return;       // terminó (onFin ya se encargó)

    if (this.corriendo && !this.bloqueado) this.programar();
  }

  /** Lo llama el modo reto cuando el alumno responde: aplica el paso pendiente. */
  reanudar() {
    this.bloqueado = false;
    const r = this.siguiente({ forzar: true });
    if (r === true && this.corriendo) this.programar();
  }

  avanzarPaso() {
    if (this.bloqueado) return 'bloqueado';
    this.parar();
    return this.siguiente();
  }

  irAlFinal() {
    if (this.bloqueado) return;
    this.parar();
    let r = this.siguiente({ forzar: true });
    while (r === true) r = this.siguiente({ forzar: true });
  }

  /** Salta al primer paso que se ejecuta en la línea dada (clic en el diagrama). */
  irALinea(l) {
    if (this.bloqueado) return false;
    const idx = this.trazas.findIndex((p) => p.l === l);
    if (idx < 0 || idx === this.i) return false;

    this.parar();
    this.i = idx - 1;
    this.recalcularStats();
    const r = this.siguiente({ forzar: true });
    return r === true;
  }

  /** Vuelve a contar las métricas desde el principio hasta el paso actual. */
  recalcularStats() {
    this.stats = { pasos: 0, cmp: 0, swap: 0 };
    for (let k = 0; k <= this.i; k++) {
      const p = this.trazas[k];
      this.stats.pasos++;
      if (p.act === 'cmp') this.stats.cmp++;
      if (p.act === 'swap') this.stats.swap++;
    }
  }

  parar() {
    this.corriendo = false;
    clearTimeout(this.timer);
  }
}
