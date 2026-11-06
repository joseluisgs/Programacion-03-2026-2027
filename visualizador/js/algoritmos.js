/* ============================================================
   algoritmos.js — Los 7 algoritmos de ordenación y búsqueda
   ------------------------------------------------------------
   Cada algoritmo tiene:
     · codigo  → el MISMO código C# que en el tema (línea a línea)
     · flujo   → su diagrama de flujo Mermaid; los nodos se
                 llaman L<número de línea> para poder resaltarlos
                 en sincronía con el paso que se está ejecutando
     · generar → un generador que NO dibuja nada, solo emite
                 "trazas": qué línea se ejecutó, qué índices
                 toca, qué variables hay y qué mensaje mostrar

   La web (ui.js) es la que anima; los algoritmos solo cuentan.
   ============================================================ */

// ---------- Utilidades para construir trazas ----------
const paso = (l, act, extra = {}) => ({ l, act, ...extra });

/**
 * Copia de la pila de llamadas para el paso actual.
 * Sin copiarla, al materializar toda la traza de golpe, TODOS los pasos
 * verían el estado final de la pila en vez del suyo.
 */
const copiaPila = (pila) => pila.map((f) => ({ ...f }));

const rango = (desde, hasta) => {
  const res = [];
  for (let k = desde; k <= hasta; k++) res.push(k);
  return res;
};

/* ============================================================
   1) BURBUJA (Bubble Sort)
   ============================================================ */
const COD_BURBUJA = [
  'void Burbuja(int[] arr) {',
  '    for (int i = 0; i < arr.Length - 1; i++) {',
  '        bool intercambio = false;',
  '        for (int j = 0; j < arr.Length - 1 - i; j++) {',
  '            if (arr[j] > arr[j + 1]) {',
  '                (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]);',
  '                intercambio = true;',
  '            }',
  '        }',
  '        // Si no hubo intercambios, ya está ordenado',
  '        if (!intercambio) break;',
  '    }',
  '}'
];

const FLUJO_BURBUJA = `graph TD
  INICIO(["🎬 Inicio"]) --> L2["for (int i = 0; i &lt; arr.Length - 1; i++)"]
  L2 -->|"queda pasada"| L3["bool intercambio = false"]
  L2 -->|"i llegó al final"| FIN(["✅ Fin"])
  L3 --> L4["for (int j = 0; j &lt; arr.Length - 1 - i; j++)"]
  L4 -->|"hay j"| L5{"¿arr[j] &gt; arr[j + 1]?"}
  L4 -->|"pasada completa"| L11{"¿hubo intercambios?"}
  L5 -->|"Sí"| L6["(arr[j], arr[j+1]) = (arr[j+1], arr[j])"]
  L6 --> L7["intercambio = true"]
  L7 --> L4
  L5 -->|"No"| L4
  L11 -->|"Sí"| L2
  L11 -->|"No: ya está"| FIN`;

function* genBurbuja(arr) {
  const a = [...arr];
  const n = a.length;

  yield paso(2, 'inicio', { arr: [...a], vars: { n }, msg: `Empezamos con [${a.join(', ')}]` });

  for (let i = 0; i < n - 1; i++) {
    const fijos = rango(n - i, n - 1);
    let intercambio = false;

    yield paso(3, 'set', {
      arr: [...a], fijos, vars: { i, intercambio },
      msg: `Pasada ${i + 1}: marcamos intercambio = false${fijos.length ? ` · ya fijos: ${fijos.map((k) => a[k]).join(', ')}` : ''}`
    });

    yield paso(4, 'set', {
      arr: [...a], fijos, vars: { i },
      msg: `Recorremos con j desde 0 hasta ${n - 1 - i} (los últimos ${i} ya están en su sitio)`
    });

    for (let j = 0; j < n - 1 - i; j++) {
      const mayor = a[j] > a[j + 1];

      yield paso(5, 'cmp', {
        arr: [...a], fijos, vars: { i, j },
        idx: [[j, 'cmp'], [j + 1, 'cmp']],
        marcas: [['i', i], ['j', j]],
        msg: `¿${a[j]} > ${a[j + 1]}? ${mayor ? 'Sí → toca intercambiar' : 'No → seguimos'}`
      });

      if (mayor) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];

        yield paso(6, 'swap', {
          arr: [...a], fijos, vars: { i, j },
          idx: [[j, 'swap'], [j + 1, 'swap']],
          marcas: [['i', i], ['j', j]],
          msg: `Intercambiamos las posiciones ${j} y ${j + 1}: [${a.join(', ')}]`
        });

        intercambio = true;
        yield paso(7, 'set', {
          arr: [...a], fijos, vars: { i, j, intercambio },
          marcas: [['i', i], ['j', j]],
          msg: 'Marcamos intercambio = true'
        });
      }
    }

    const fijosFin = rango(n - i - 1, n - 1);
    yield paso(11, 'check', {
      arr: [...a], fijos: fijosFin, vars: { i, intercambio },
      msg: intercambio
        ? `Fin de la pasada ${i + 1}: hubo intercambios → seguimos`
        : 'No hubo intercambios en toda la pasada → el array ya está ordenado y salimos con break'
    });

    if (!intercambio) break;
  }

  yield paso(13, 'fin', { arr: [...a], fijos: rango(0, n - 1), msg: '✅ ¡Array ordenado!' });
}

/* ============================================================
   2) SELECCIÓN (Selection Sort)
   ============================================================ */
const COD_SELECCION = [
  'void Seleccion(int[] arr) {',
  '    for (int i = 0; i < arr.Length - 1; i++) {',
  '        int minIdx = i;',
  '        for (int j = i + 1; j < arr.Length; j++) {',
  '            if (arr[j] < arr[minIdx])',
  '                minIdx = j;',
  '        }',
  '        (arr[i], arr[minIdx]) = (arr[minIdx], arr[i]);',
  '    }',
  '}'
];

const FLUJO_SELECCION = `graph TD
  INICIO(["🎬 Inicio"]) --> L2["for (int i = 0; i &lt; arr.Length - 1; i++)"]
  L2 -->|"queda array"| L3["int minIdx = i"]
  L2 -->|"i llegó al final"| FIN(["✅ Fin"])
  L3 --> L4["for (int j = i + 1; j &lt; arr.Length; j++)"]
  L4 -->|"hay j"| L5{"¿arr[j] &lt; arr[minIdx]?"}
  L4 -->|"recorrido completo"| L8["(arr[i], arr[minIdx]) = (arr[minIdx], arr[i])"]
  L5 -->|"Sí"| L6["minIdx = j"]
  L6 --> L4
  L5 -->|"No"| L4
  L8 --> L2`;

function* genSeleccion(arr) {
  const a = [...arr];
  const n = a.length;

  yield paso(2, 'inicio', { arr: [...a], vars: { n }, msg: `Buscamos el mínimo de [${a.join(', ')}] posición a posición` });

  for (let i = 0; i < n - 1; i++) {
    const fijos = rango(0, i - 1);
    let minIdx = i;

    yield paso(3, 'set', {
      arr: [...a], fijos, vars: { i, minIdx },
      idx: [[i, 'min']], marcas: [['i', i], ['min', i]],
      msg: `Empezamos tomando a[${i}] = ${a[i]} como mínimo`
    });

    yield paso(4, 'set', {
      arr: [...a], fijos, vars: { i, minIdx },
      marcas: [['i', i]],
      msg: `Miramos el resto: de la posición ${i + 1} hasta ${n - 1}`
    });

    for (let j = i + 1; j < n; j++) {
      const esMenor = a[j] < a[minIdx];

      yield paso(5, 'cmp', {
        arr: [...a], fijos, vars: { i, j, minIdx },
        idx: [[j, 'cmp'], [minIdx, 'min']],
        marcas: [['i', i], ['j', j], ['min', minIdx]],
        msg: `¿${a[j]} < mínimo actual (${a[minIdx]})? ${esMenor ? 'Sí → hemos encontrado uno más pequeño' : 'No → seguimos'}`
      });

      if (esMenor) {
        minIdx = j;
        yield paso(6, 'set', {
          arr: [...a], fijos, vars: { i, j, minIdx },
          idx: [[minIdx, 'min']], marcas: [['i', i], ['min', minIdx]],
          msg: `minIdx = ${j} → el nuevo mínimo es ${a[j]}`
        });
      }
    }

    const yaEsta = minIdx === i;
    if (!yaEsta) [a[i], a[minIdx]] = [a[minIdx], a[i]];

    yield paso(8, yaEsta ? 'set' : 'swap', {
      arr: [...a], fijos: [...fijos, i], vars: { i, minIdx },
      idx: yaEsta ? [[i, 'fijo']] : [[i, 'swap'], [minIdx, 'swap']],
      marcas: [['i', i], ['min', minIdx]],
      msg: yaEsta
        ? `a[${i}] ya era el mínimo: no hay nada que mover`
        : `Intercambiamos: ${a[i]} se queda en la posición ${i} y el resto avanza`
    });
  }

  yield paso(10, 'fin', { arr: [...a], fijos: rango(0, n - 1), msg: '✅ ¡Array ordenado!' });
}

/* ============================================================
   3) INSERCIÓN (Insertion Sort)
   ============================================================ */
const COD_INSERCION = [
  'void Insercion(int[] arr) {',
  '    for (int i = 1; i < arr.Length; i++) {',
  '        int clave = arr[i];',
  '        int j = i - 1;',
  '        while (j >= 0 && arr[j] > clave) {',
  '            arr[j + 1] = arr[j];',
  '            j--;',
  '        }',
  '        arr[j + 1] = clave;',
  '    }',
  '}'
];

const FLUJO_INSERCION = `graph TD
  INICIO(["🎬 Inicio"]) --> L2["for (int i = 1; i &lt; arr.Length; i++)"]
  L2 -->|"queda"| L3["int clave = arr[i]"]
  L2 -->|"fin"| FIN(["✅ Fin"])
  L3 --> L4["int j = i - 1"]
  L4 --> L5{"¿j &gt;= 0 y arr[j] &gt; clave?"}
  L5 -->|"Sí"| L6["arr[j + 1] = arr[j]"]
  L6 --> L7["j--"]
  L7 --> L5
  L5 -->|"No"| L9["arr[j + 1] = clave"]
  L9 --> L2`;

function* genInsercion(arr) {
  const a = [...arr];
  const n = a.length;

  yield paso(2, 'inicio', { arr: [...a], vars: { n }, msg: 'La izquierda ya está ordenada; vamos insertando cada elemento en su sitio' });

  for (let i = 1; i < n; i++) {
    const clave = a[i];
    let j = i - 1;
    const fijos = rango(0, i - 1);

    yield paso(3, 'set', {
      arr: [...a], fijos, vars: { i, clave, j },
      idx: [[i, 'cur']], marcas: [['i', i], ['clave', i]],
      msg: `Cogemos la carta clave = a[${i}] = ${clave}`
    });

    yield paso(4, 'set', {
      arr: [...a], fijos, vars: { i, clave, j },
      marcas: [['i', i], ['j', j]],
      msg: `j = ${j}: empezamos a mirar hacia la izquierda`
    });

    while (true) {
      const cond = j >= 0 && a[j] > clave;

      yield paso(5, j >= 0 ? 'cmp' : 'check', {
        arr: [...a], fijos, vars: { i, clave, j },
        idx: j >= 0 ? [[j, 'cmp'], [i, 'cur']] : [],
        marcas: j >= 0 ? [['i', i], ['j', j]] : [['i', i]],
        msg: j >= 0
          ? `¿${a[j]} > clave (${clave})? ${cond ? 'Sí → desplazamos a la derecha' : 'No → ya está en su sitio'}`
          : `j = ${j} < 0 → llegamos al principio del array`
      });

      if (!cond) break;

      a[j + 1] = a[j];
      yield paso(6, 'move', {
        arr: [...a], fijos, vars: { i, clave, j },
        idx: [[j + 1, 'move']], marcas: [['j', j], ['clave', i]],
        msg: `a[${j + 1}] = a[${j}]: movemos ${a[j]} un sitio a la derecha`
      });

      j--;
      yield paso(7, 'set', {
        arr: [...a], fijos, vars: { i, clave, j },
        marcas: [['i', i], ['j', j]],
        msg: `j-- → j = ${j}`
      });
    }

    a[j + 1] = clave;
    yield paso(9, 'set', {
      arr: [...a], fijos: rango(0, i), vars: { i, clave, j },
      idx: [[j + 1, 'fijo']], marcas: [['i', i]],
      msg: `Insertamos la clave ${clave} en la posición ${j + 1}`
    });
  }

  yield paso(11, 'fin', { arr: [...a], fijos: rango(0, n - 1), msg: '✅ ¡Array ordenado!' });
}

/* ============================================================
   4) SHELL SORT
   ============================================================ */
const COD_SHELL = [
  'void ShellSort(int[] arr) {',
  '    int n = arr.Length;',
  '    for (int gap = n / 2; gap > 0; gap /= 2) {',
  '        for (int i = gap; i < n; i++) {',
  '            int temp = arr[i];',
  '            int j = i;',
  '            while (j >= gap && arr[j - gap] > temp) {',
  '                arr[j] = arr[j - gap];',
  '                j -= gap;',
  '            }',
  '            arr[j] = temp;',
  '        }',
  '    }',
  '}'
];

const FLUJO_SHELL = `graph TD
  INICIO(["🎬 Inicio"]) --> L3["for (gap = n / 2; gap &gt; 0; gap /= 2)"]
  L3 -->|"gap &gt; 0"| L4["for (int i = gap; i &lt; n; i++)"]
  L3 -->|"gap = 0"| FIN(["✅ Fin"])
  L4 -->|"hay i"| L5["int temp = arr[i]"]
  L4 -->|"termina i"| L3
  L5 --> L7{"¿arr[j - gap] &gt; temp?"}
  L7 -->|"Sí"| L8["arr[j] = arr[j - gap]"]
  L8 --> L9["j -= gap"]
  L9 --> L7
  L7 -->|"No"| L11["arr[j] = temp"]
  L11 --> L4`;

function* genShell(arr) {
  const a = [...arr];
  const n = a.length;
  let gap = Math.floor(n / 2);

  yield paso(3, 'set', {
    arr: [...a], vars: { n, gap },
    msg: `gap = n / 2 = ${gap}: comparamos elementos separados ${gap} posiciones`
  });

  while (gap > 0) {
    yield paso(4, 'set', {
      arr: [...a], vars: { n, gap },
      msg: `Con gap = ${gap}, recorremos el array de la posición ${gap} en adelante`
    });

    for (let i = gap; i < n; i++) {
      const temp = a[i];

      yield paso(5, 'set', {
        arr: [...a], vars: { gap, i, temp },
        idx: [[i, 'cur']], marcas: [['i', i], ['temp', i]],
        msg: `Guardamos temp = a[${i}] = ${temp}`
      });

      let j = i;

      while (true) {
        const cond = j >= gap && a[j - gap] > temp;

        yield paso(7, j >= gap ? 'cmp' : 'check', {
          arr: [...a], vars: { gap, i, j, temp },
          idx: j >= gap ? [[j, 'cmp'], [j - gap, 'cmp']] : [],
          marcas: j >= gap ? [['j', j], ['j-gap', j - gap]] : [],
          msg: j >= gap
            ? `¿${a[j - gap]} > temp (${temp})? ${cond ? 'Sí → lo desplazamos ' + gap + ' posiciones' : 'No → paramos'}`
            : `j = ${j} &lt; gap = ${gap} → llegamos al principio del tramo`
        });

        if (!cond) break;

        a[j] = a[j - gap];
        yield paso(8, 'move', {
          arr: [...a], vars: { gap, j, temp },
          idx: [[j, 'move']], marcas: [['j', j]],
          msg: `a[${j}] = a[${j - gap}]: movemos ${a[j]} ${gap} posiciones a la derecha`
        });

        j -= gap;
        yield paso(9, 'set', {
          arr: [...a], vars: { gap, j, temp },
          marcas: [['j', j]],
          msg: `j -= gap → j = ${j}`
        });
      }

      a[j] = temp;
      yield paso(11, 'set', {
        arr: [...a], vars: { gap, i, j, temp },
        idx: [[j, 'cur']], marcas: [['temp', j]],
        msg: `Insertamos temp = ${temp} en la posición ${j}`
      });
    }

    gap = Math.floor(gap / 2);
    if (gap > 0) {
      yield paso(3, 'set', {
        arr: [...a], vars: { n, gap },
        msg: `Reducimos el salto → gap = ${gap}`
      });
    }
  }

  yield paso(14, 'fin', { arr: [...a], fijos: rango(0, n - 1), msg: '✅ ¡Array ordenado! (el último gap = 1 es Inserción normal)' });
}

/* ============================================================
   5) QUICKSORT
   ============================================================ */
const COD_QUICKSORT = [
  'void QuickSort(int[] arr, int bajo, int alto) {',
  '    if (bajo < alto) {',
  '        int pivote = Partition(arr, bajo, alto);',
  '        QuickSort(arr, bajo, pivote - 1);',
  '        QuickSort(arr, pivote + 1, alto);',
  '    }',
  '}',
  '',
  'int Partition(int[] arr, int bajo, int alto) {',
  '    int pivote = arr[alto];',
  '    int i = bajo - 1;',
  '    for (int j = bajo; j < alto; j++) {',
  '        if (arr[j] < pivote) {',
  '            i++;',
  '            (arr[i], arr[j]) = (arr[j], arr[i]);',
  '        }',
  '    }',
  '    (arr[i + 1], arr[alto]) = (arr[alto], arr[i + 1]);',
  '    return i + 1;',
  '}'
];

const FLUJO_QUICKSORT = `graph TD
  INICIO(["🎬 Inicio"]) --> L2{"¿bajo &lt; alto?"}
  L2 -->|"Sí"| L3["int pivote = Partition(arr, bajo, alto)"]
  L2 -->|"No: un solo elemento"| FIN(["✅ Fin"])
  L3 -.->|"dentro de Partition"| L10["int pivote = arr[alto]"]
  L10 --> L11["int i = bajo - 1"]
  L11 --> L13{"¿arr[j] &lt; pivote?"}
  L13 -->|"Sí"| L14["i++"]
  L14 --> L15["(arr[i], arr[j]) = (arr[j], arr[i])"]
  L15 --> SIG{"¿j llegó a alto?"}
  L13 -->|"No"| SIG
  SIG -->|"No: siguiente j"| L13
  SIG -->|"Sí"| L18["(arr[i+1], arr[alto]) = (arr[alto], arr[i+1])"]
  L18 --> L19["return i + 1"]
  L19 --> L4["QuickSort(arr, bajo, pivote - 1)"]
  L4 --> L5["QuickSort(arr, pivote + 1, alto)"]
  L5 -->|"volvemos"| L2`;

function* genQuicksort(arr) {
  const a = [...arr];
  if (a.length === 0) {
    yield paso(1, 'fin', { arr: [...a], msg: 'Array vacío: no hay nada que ordenar' });
    return;
  }

  const pila = [];
  yield* genQs(a, 0, a.length - 1, pila);
  yield paso(7, 'fin', {
    arr: [...a], fijos: rango(0, a.length - 1), pila: copiaPila(pila),
    msg: '✅ ¡Array ordenado!'
  });
}

function* genQs(a, bajo, alto, pila) {
  pila.push({ nivel: pila.length, bajo, alto }); // abre el marco

  yield paso(2, 'check', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto }, pila: copiaPila(pila),
    msg: `¿bajo (${bajo}) < alto (${alto})? ${bajo < alto ? 'Sí → hay que particionar' : 'No → este trozo ya está ordenado'}`
  });

  if (bajo >= alto) { pila.pop(); return; } // cierra el marco

  yield paso(3, 'call', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto }, pila: copiaPila(pila),
    idx: [[alto, 'pivot']], marcas: [['bajo', bajo], ['alto', alto]],
    msg: 'Vamos a llamar a Partition: elegiremos pivote y separaremos menores y mayores'
  });

  const p = yield* genPartition(a, bajo, alto, pila);

  yield paso(4, 'call', {
    arr: [...a], rango: [bajo, Math.max(bajo, p - 1)], vars: { bajo, alto, pivote: p },
    idx: p > bajo ? [] : [], marcas: [['pivote', p]], pila: copiaPila(pila),
    msg: p > bajo
      ? `Recursión izquierda: QuickSort(${bajo}, ${p - 1})`
      : `No hay subarreglo izquierdo: ${p} = ${bajo}`
  });
  if (p > bajo) yield* genQs(a, bajo, p - 1, pila);

  yield paso(5, 'call', {
    arr: [...a], rango: [Math.min(alto, p + 1), alto], vars: { bajo, alto, pivote: p },
    marcas: [['pivote', p]], pila: copiaPila(pila),
    msg: p < alto
      ? `Recursión derecha: QuickSort(${p + 1}, ${alto})`
      : `No hay subarreglo derecho: ${p} = ${alto}`
  });
  if (p < alto) yield* genQs(a, p + 1, alto, pila);

  pila.pop(); // cierra el marco
}

function* genPartition(a, bajo, alto, pila) {
  const pivote = a[alto];

  yield paso(10, 'set', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote }, pila: copiaPila(pila),
    idx: [[alto, 'pivot']], marcas: [['pivote', alto]],
    msg: `pivote = arr[${alto}] = ${pivote} (tomamos el último como referencia)`
  });

  let i = bajo - 1;

  yield paso(11, 'set', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i }, pila: copiaPila(pila),
    idx: [[alto, 'pivot']], marcas: [['i', i], ['pivote', alto]],
    msg: `i = ${i}: por delante de i vivirán los menores que el pivote`
  });

  for (let j = bajo; j < alto; j++) {
    const menor = a[j] < pivote;

    yield paso(13, 'cmp', {
      arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i, j }, pila: copiaPila(pila),
      idx: [[j, 'cmp'], [alto, 'pivot']],
      marcas: [['i', i], ['j', j], ['pivote', alto]],
      msg: `¿${a[j]} < pivote (${pivote})? ${menor ? 'Sí → va con los menores' : 'No → se queda donde está'}`
    });

    if (menor) {
      i++;
      yield paso(14, 'set', {
        arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i, j }, pila: copiaPila(pila),
        idx: [[i, 'cur'], [j, 'cmp']],
        marcas: [['i', i], ['j', j], ['pivote', alto]],
        msg: `Sí → i++ = ${i}: ampliamos la zona de menores`
      });

      [a[i], a[j]] = [a[j], a[i]];
      yield paso(15, 'swap', {
        arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i, j }, pila: copiaPila(pila),
        idx: [[i, 'swap'], [j, 'swap']],
        marcas: [['i', i], ['j', j], ['pivote', alto]],
        msg: `Intercambiamos las posiciones ${i} y ${j}`
      });
    }
  }

  const pos = i + 1;
  const mover = pos !== alto;
  if (mover) [a[pos], a[alto]] = [a[alto], a[pos]];

  yield paso(18, mover ? 'swap' : 'set', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i }, pila: copiaPila(pila),
    idx: mover ? [[pos, 'swap'], [alto, 'swap']] : [[alto, 'pivot']],
    marcas: [['pivote', pos]],
    msg: mover
      ? `Colocamos el pivote en su sitio: posición ${pos}`
      : `El pivote ya estaba en su sitio (${pos})`
  });

  yield paso(19, 'ret', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote: pos }, pila: copiaPila(pila),
    idx: [[pos, 'fijo']], marcas: [['pivote', pos]],
    msg: `Partition devuelve ${pos} → ${a[pos]} queda fijo en su sitio ✅`
  });

  return pos;
}

/* ============================================================
   6) BÚSQUEDA LINEAL
   ============================================================ */
const COD_LINEAL = [
  'int BuscarLineal(int[] arr, int objetivo) {',
  '    for (int i = 0; i < arr.Length; i++) {',
  '        if (arr[i] == objetivo)',
  '            return i;  // Encontrado',
  '    }',
  '    return -1;  // No encontrado',
  '}'
];

const FLUJO_LINEAL = `graph TD
  INICIO(["🎬 Inicio"]) --> L2["for (int i = 0; i &lt; arr.Length; i++)"]
  L2 -->|"hay i"| L3{"¿arr[i] == objetivo?"}
  L2 -->|"llegamos al final"| L6["return -1"]
  L3 -->|"Sí"| L4["return i"]
  L3 -->|"No: i++"| L2
  L4 --> OK(["🎉 ¡Encontrado!"])
  L6 --> KO(["😕 No encontrado"])`;

function* genLineal(arr, objetivo) {
  const a = [...arr];

  yield paso(2, 'inicio', {
    arr: [...a], vars: { objetivo }, visit: [],
    msg: `Vamos a recorrer el array entero buscando el ${objetivo}`
  });

  for (let i = 0; i < a.length; i++) {
    const igual = a[i] === objetivo;
    const visitados = rango(0, i - 1);

    yield paso(3, 'cmp', {
      arr: [...a], vars: { i, objetivo }, visit: [...visitados, i],
      idx: [[i, igual ? 'found' : 'cmp']], marcas: [['i', i]],
      msg: `¿a[${i}] = ${a[i]} es igual a ${objetivo}? ${igual ? '¡Sí! Lo hemos encontrado' : 'No → seguimos mirando'}`
    });

    if (igual) {
      yield paso(4, 'found', {
        arr: [...a], vars: { i, resultado: i }, visit: rango(0, i),
        idx: [[i, 'found']], marcas: [['i', i]],
        msg: `🎉 ¡Encontrado! Devolvemos la posición ${i}`
      });
      return i;
    }
  }

  yield paso(6, 'notfound', {
    arr: [...a], vars: { resultado: -1 }, visit: rango(0, a.length - 1),
    msg: `Recorrimos los ${a.length} elementos y ${objetivo} no está → devolvemos -1`
  });
  return -1;
}

/* ============================================================
   7) BÚSQUEDA BINARIA
   ============================================================ */
const COD_BINARIA = [
  'int BuscarBinaria(int[] arr, int objetivo) {',
  '    int bajo = 0, alto = arr.Length - 1;',
  '    while (bajo <= alto) {',
  '        // Esta forma evita un posible desbordamiento de entero',
  '        // que ocurriría con (bajo + alto) / 2',
  '        int medio = bajo + (alto - bajo) / 2;',
  '        if (arr[medio] == objetivo) return medio;',
  '        else if (arr[medio] < objetivo) bajo = medio + 1;',
  '        else alto = medio - 1;',
  '    }',
  '    return -1;',
  '}'
];

const FLUJO_BINARIA = `graph TD
  INICIO(["🎬 Inicio"]) --> L2["bajo = 0, alto = arr.Length - 1"]
  L2 --> L3{"¿bajo &lt;= alto?"}
  L3 -->|"Sí"| L6["medio = bajo + (alto - bajo) / 2"]
  L6 --> L7{"¿arr[medio] == objetivo?"}
  L7 -->|"Sí"| OK(["🎉 ¡Encontrado!"])
  L7 -->|"No"| L8["¿es menor? → bajo = medio + 1"]
  L8 -->|"Sí: mitad derecha"| L3
  L8 -->|"No: mitad izquierda"| L9["alto = medio - 1"]
  L9 --> L3
  L3 -->|"No queda sitio"| L11["return -1"]
  L11 --> KO(["😕 No encontrado"])`;

function* genBinaria(arr, objetivo) {
  const a = [...arr];
  let bajo = 0;
  let alto = a.length - 1;
  const visit = [];

  yield paso(2, 'init', {
    arr: [...a], vars: { bajo, alto, objetivo }, rango: [0, a.length - 1], descartar: true, visit: [],
    marcas: [['bajo', 0], ['alto', a.length - 1]],
    msg: `Empezamos con bajo = 0 y alto = ${a.length - 1}`
  });

  while (true) {
    const dentro = bajo <= alto;

    yield paso(3, dentro ? 'check' : 'fin-cond', {
      arr: [...a], vars: { bajo, alto, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
      marcas: dentro ? [['bajo', bajo], ['alto', alto]] : [],
      msg: dentro
        ? `¿bajo (${bajo}) <= alto (${alto})? Sí → seguimos buscando`
        : `¿bajo (${bajo}) <= alto (${alto})? No → no queda sitio, el elemento no está`
    });

    if (!dentro) break;

    const medio = bajo + Math.floor((alto - bajo) / 2);
    visit.push(medio);

    yield paso(6, 'set', {
      arr: [...a], vars: { bajo, alto, medio, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
      idx: [[medio, 'mid']], marcas: [['bajo', bajo], ['medio', medio], ['alto', alto]],
      msg: `medio = ${bajo} + (${alto} - ${bajo}) / 2 = ${medio}`
    });

    const igual = a[medio] === objetivo;

    yield paso(7, 'cmp', {
      arr: [...a], vars: { bajo, alto, medio, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
      idx: [[medio, igual ? 'found' : 'cmp']], marcas: [['bajo', bajo], ['medio', medio], ['alto', alto]],
      msg: `¿a[${medio}] = ${a[medio]} es igual a ${objetivo}? ${igual ? '¡Sí! Encontrado 🎉' : 'No → tenemos que descartar mitad'}`
    });

    if (igual) {
      yield paso(7, 'found', {
        arr: [...a], vars: { bajo, alto, medio, resultado: medio }, visit: [...visit],
        idx: [[medio, 'found']], marcas: [['medio', medio]],
        msg: `🎉 ¡Encontrado en la posición ${medio}!`
      });
      return medio;
    }

    if (a[medio] < objetivo) {
      const descartados = rango(bajo, medio);
      bajo = medio + 1;
      yield paso(8, 'set', {
        arr: [...a], vars: { bajo, alto, medio, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
        idx: [[medio, 'discard']], marcas: [['bajo', bajo], ['alto', alto]],
        msg: `${a[medio]} < ${objetivo} → descartamos ${descartados.length} posiciones de la izquierda (bajo = ${bajo})`
      });
    } else {
      const descartados = rango(medio, alto);
      alto = medio - 1;
      yield paso(9, 'set', {
        arr: [...a], vars: { bajo, alto, medio, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
        idx: [[medio, 'discard']], marcas: [['bajo', bajo], ['alto', alto]],
        msg: `${a[medio]} > ${objetivo} → descartamos ${descartados.length} posiciones de la derecha (alto = ${alto})`
      });
    }
  }

  yield paso(11, 'notfound', {
    arr: [...a], vars: { resultado: -1 }, visit: [...visit],
    msg: `No queda nada que mirar → ${objetivo} no está en el array (devolvemos -1)`
  });
  return -1;
}

/* ============================================================
   8) BÚSQUEDA BINARIA RECURSIVA
   ------------------------------------------------------------
   Misma idea que la iterativa, pero la función se llama a sí
   misma con la mitad que queda en lugar de usar un while.
   ============================================================ */
const COD_BINARIA_REC = [
  'int BuscarBinariaRec(int[] arr, int objetivo, int bajo, int alto) {',
  '    // Caso base: no queda sitio, el objetivo no está',
  '    if (bajo > alto) return -1;',
  '    int medio = bajo + (alto - bajo) / 2;',
  '    if (arr[medio] == objetivo) return medio;',
  '    // ¿En qué mitad puede estar?',
  '    if (arr[medio] < objetivo)',
  '        return BuscarBinariaRec(arr, objetivo, medio + 1, alto);',
  '    return BuscarBinariaRec(arr, objetivo, bajo, medio - 1);',
  '}'
];

const FLUJO_BINARIA_REC = `graph TD
  INICIO(["🎬 Inicio"]) --> L3{"¿bajo &gt; alto?"}
  L3 -->|"Sí: no queda sitio"| KO(["😕 No encontrado"])
  L3 -->|"No: queda rango"| L4["medio = bajo + (alto - bajo) / 2"]
  L4 --> L5{"¿arr[medio] == objetivo?"}
  L5 -->|"Sí"| OK(["🎉 ¡Encontrado!"])
  L5 -->|"No"| L7{"¿arr[medio] &lt; objetivo?"}
  L7 -->|"Sí: mitad derecha"| L8["return BuscarBinariaRec(..., medio + 1, alto)"]
  L7 -->|"No: mitad izquierda"| L9["return BuscarBinariaRec(..., bajo, medio - 1)"]
  L8 --> REC(["📞 Nueva llamada"])
  L9 --> REC
  REC --> L3`;

function* genBinariaRec(arr, objetivo) {
  const a = [...arr];
  const visit = [];
  let nivel = -1;
  // Marcos de pila abiertos. Se COPIA en cada paso: si no, al materializar
  // toda la traza de golpe, todos los pasos verían el estado final.
  const pila = [];
  const marcos = () => pila.map((f) => ({ ...f }));

  yield paso(1, 'init', {
    arr: [...a], vars: { objetivo, bajo: 0, alto: a.length - 1 },
    rango: [0, a.length - 1], descartar: true, visit: [],
    marcas: [['bajo', 0], ['alto', a.length - 1]],
    msg: `Llamada inicial: buscar ${objetivo} entre las posiciones 0 y ${a.length - 1}`
  });

  // Cada nivel de la recursión es una llamada nueva a ESTA MISMA función.
  // `miNivel` se guarda al entrar: la variable compartida `nivel` sigue
  // creciendo con las llamadas hijas y no sirve para hablar del nivel actual.
  function* llamar(bajo, alto) {
    nivel++;
    const miNivel = nivel;
    pila.push({ nivel: miNivel, bajo, alto }); // abre el marco

    // ---- Línea 3: caso base ----
    const vacio = bajo > alto;
    yield paso(3, vacio ? 'notfound' : 'check', {
      arr: [...a], vars: { bajo, alto, objetivo, nivel: miNivel },
      rango: vacio ? [] : [bajo, alto], descartar: true, visit: [...visit],
      marcas: vacio ? [] : [['bajo', bajo], ['alto', alto]],
      pila: marcos(),
      msg: vacio
        ? `Nivel ${miNivel}: ¿bajo (${bajo}) > alto (${alto})? Sí → no queda sitio, devolvemos -1`
        : `Nivel ${miNivel}: ¿bajo (${bajo}) > alto (${alto})? No → seguimos con el rango ${bajo}..${alto}`
    });

    if (vacio) { pila.pop(); return -1; } // cierra el marco

    // ---- Línea 4: calculamos el medio ----
    const medio = bajo + Math.floor((alto - bajo) / 2);
    visit.push(medio);

    yield paso(4, 'set', {
      arr: [...a], vars: { bajo, alto, medio, objetivo, nivel: miNivel },
      rango: [bajo, alto], descartar: true, visit: [...visit],
      idx: [[medio, 'mid']], marcas: [['bajo', bajo], ['medio', medio], ['alto', alto]],
      pila: marcos(),
      msg: `Nivel ${miNivel}: medio = ${bajo} + (${alto} - ${bajo}) / 2 = ${medio}`
    });

    // ---- Línea 5: ¿lo hemos dado? ----
    const igual = a[medio] === objetivo;
    yield paso(5, 'cmp', {
      arr: [...a], vars: { bajo, alto, medio, objetivo, nivel: miNivel },
      rango: [bajo, alto], descartar: true, visit: [...visit],
      idx: [[medio, igual ? 'found' : 'cmp']], marcas: [['bajo', bajo], ['medio', medio], ['alto', alto]],
      pila: marcos(),
      msg: `¿a[${medio}] = ${a[medio]} es igual a ${objetivo}? ${igual ? '¡Sí! Encontrado 🎉' : 'No → elegimos mitad'}`
    });

    if (igual) {
      yield paso(5, 'found', {
        arr: [...a], vars: { bajo, alto, medio, objetivo, nivel: miNivel, resultado: medio },
        visit: [...visit], idx: [[medio, 'found']], marcas: [['medio', medio]],
        pila: marcos(),
        msg: `🎉 ¡Encontrado en la posición ${medio}! Cerramos la llamada del nivel ${miNivel}`
      });
      pila.pop(); // cierra el marco
      return medio;
    }

    // ---- Línea 7: ¿mitad derecha o izquierda? ----
    const derecha = a[medio] < objetivo;
    yield paso(7, 'check', {
      arr: [...a], vars: { bajo, alto, medio, objetivo, nivel: miNivel },
      rango: [bajo, alto], descartar: true, visit: [...visit],
      idx: [[medio, 'discard']], marcas: [['bajo', bajo], ['medio', medio], ['alto', alto]],
      pila: marcos(),
      msg: derecha
        ? `${a[medio]} < ${objetivo} → el objetivo está en la MITAD DERECHA`
        : `${a[medio]} > ${objetivo} → el objetivo está en la MITAD IZQUIERDA`
    });

    // ---- Líneas 8 y 9: la llamada recursiva ----
    const lineaLlamada = derecha ? 8 : 9;
    const nuevosLimites = derecha ? [medio + 1, alto] : [bajo, medio - 1];

    yield paso(lineaLlamada, 'call', {
      arr: [...a], vars: { bajo, alto, medio, objetivo, nivel: miNivel },
      rango: nuevosLimites, descartar: true, visit: [...visit],
      marcas: [['bajo', nuevosLimites[0]], ['alto', nuevosLimites[1]]],
      pila: marcos(),
      msg: `📞 Nivel ${miNivel}: llamamos a BuscarBinariaRec(arr, ${objetivo}, ${nuevosLimites[0]}, ${nuevosLimites[1]})`
    });

    const resultado = yield* llamar(nuevosLimites[0], nuevosLimites[1]);

    // El valor vuelve por la misma línea que hizo la llamada: eso es
    // lo que la recursión añade sobre la versión con bucle.
    yield paso(lineaLlamada, 'ret', {
      arr: [...a], vars: { bajo, alto, medio, objetivo, nivel: miNivel, resultado },
      rango: [bajo, alto], descartar: true, visit: [...visit],
      idx: resultado >= 0 ? [[resultado, 'found']] : [],
      marcas: resultado >= 0 ? [['medio', resultado]] : [],
      pila: marcos(),
      msg: resultado === -1
        ? `↩️ Nivel ${miNivel}: la llamada devolvió -1 → lo devolvemos a su vez`
        : `↩️ Nivel ${miNivel}: la llamada devolvió ${resultado} → lo devolvemos hasta arriba`
    });

    pila.pop(); // cierra el marco
    return resultado;
  }

  const res = yield* llamar(0, a.length - 1);
  nivel = -1; // dejamos el contador como estaba para la próxima ejecución

  if (res === -1) {
    yield paso(3, 'fin', {
      arr: [...a], vars: { resultado: -1 }, visit: [...visit],
      msg: `🏁 Resultado final: -1 → ${objetivo} no está en el array`
    });
  } else {
    yield paso(1, 'fin', {
      arr: [...a], vars: { resultado: res }, visit: [...visit],
      idx: [[res, 'found']], marcas: [['medio', res]],
      msg: `🏁 Resultado final: ${res} 🎉`
    });
  }
  return res;
}

/* ============================================================
   Registro de algoritmos (orden del tema)
   ============================================================ */
const ALGORITMOS = {
  burbuja: {
    id: 'burbuja', nombre: 'Burbuja', icono: '🫧', tipo: 'orden',
    idea: 'Compara dos vecinos y los intercambia; los más grandes "burbujear" hasta el final.',
    ejemplo: 'En un casting de televisión ordenan a los actores por altura comparando dos de pie, uno al lado del otro.',
    uso: 'Didáctico y arrays pequeños.',
    complejidad: { mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)', estable: true },
    codigo: COD_BURBUJA, flujo: FLUJO_BURBUJA, generar: genBurbuja
  },
  seleccion: {
    id: 'seleccion', nombre: 'Selección', icono: '🎯', tipo: 'orden',
    idea: 'Busca el mínimo de lo que queda y lo coloca en su sitio. Repite con el resto.',
    ejemplo: 'Un DJ que ordena sus discos por año: escanea todos, coge el más antiguo y lo pone el primero.',
    uso: 'Cuando intercambiar es caro (se hacen pocos intercambios).',
    complejidad: { mejor: 'O(n²)', promedio: 'O(n²)', peor: 'O(n²)', estable: false },
    codigo: COD_SELECCION, flujo: FLUJO_SELECCION, generar: genSeleccion
  },
  insercion: {
    id: 'insercion', nombre: 'Inserción', icono: '🃏', tipo: 'orden',
    idea: 'Como ordenar cartas en la mano: coges una y la insertas donde toca, desplazando las demás.',
    ejemplo: 'Netflix usa Inserción para ordenar tu "Lista de favoritos" cuando añades una sola película.',
    uso: 'Arrays pequeños o casi ordenados.',
    complejidad: { mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)', estable: true },
    codigo: COD_INSERCION, flujo: FLUJO_INSERCION, generar: genInsercion
  },
  shell: {
    id: 'shell', nombre: 'Shell', icono: '🐚', tipo: 'orden',
    idea: 'Inserción con saltos: primero saltos grandes (gap) que ordenan rápido y burdo, luego se afina.',
    ejemplo: 'Los motores de bases de datos usan Shell Sort para ordenar bloques pequeños antes de fusionarlos.',
    uso: 'Buen compromiso para arrays medianos.',
    complejidad: { mejor: 'O(n log n)', promedio: 'O(n^1.5)', peor: 'O(n²)', estable: false },
    codigo: COD_SHELL, flujo: FLUJO_SHELL, generar: genShell
  },
  quicksort: {
    id: 'quicksort', nombre: 'QuickSort', icono: '⚡', tipo: 'orden',
    idea: 'Elige un pivote, deja los menores a la izquierda y los mayores a la derecha, y repite en cada parte.',
    ejemplo: 'Google Search usa QuickSort para ordenar millones de resultados por relevancia.',
    uso: 'El más rápido en la práctica para grandes volúmenes.',
    complejidad: { mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n²)', estable: false },
    recursivo: true,
    codigo: COD_QUICKSORT, flujo: FLUJO_QUICKSORT, generar: genQuicksort
  },
  lineal: {
    id: 'lineal', nombre: 'Búsqueda lineal', icono: '🔍', tipo: 'busqueda',
    idea: 'Recorre el array entero de izquierda a derecha mirando elemento a elemento. No necesita orden.',
    ejemplo: 'Cuando buscas un contacto en tu móvil sin usar el buscador, deslizas mirando cada nombre.',
    uso: 'Arrays pequeños o no ordenados.',
    complejidad: { mejor: 'O(1)', promedio: 'O(n)', peor: 'O(n)', estable: false, requiereOrden: false },
    codigo: COD_LINEAL, flujo: FLUJO_LINEAL, generar: genLineal
  },
  binaria: {
    id: 'binaria', nombre: 'Búsqueda binaria', icono: '📚', tipo: 'busqueda',
    idea: 'Abre por la mitad: cada paso descarta la mitad de lo que queda. Requiere array ordenado.',
    ejemplo: 'El buscador de Netflix usa Búsqueda Binaria sobre los títulos ordenados alfabéticamente.',
    uso: 'Arrays grandes y ordenados.',
    complejidad: { mejor: 'O(1)', promedio: 'O(log n)', peor: 'O(log n)', estable: false, requiereOrden: true },
    codigo: COD_BINARIA, flujo: FLUJO_BINARIA, generar: genBinaria
  },
  binariarecursiva: {
    id: 'binariarecursiva', nombre: 'Búsqueda binaria recursiva', icono: '🌀', tipo: 'busqueda',
    idea: 'Lo mismo que la binaria, pero la función se llama a sí misma con la mitad que queda. Cada llamada descarta la mitad.',
    ejemplo: 'Como repartir una lista de invitados a dos equipos: eliges el del medio y le pides a alguien que siga con su mitad.',
    uso: 'Arrays grandes y ordenados, cuando la versión recursiva queda más clara.',
    complejidad: { mejor: 'O(1)', promedio: 'O(log n)', peor: 'O(log n)', estable: false, requiereOrden: true },
    recursivo: true,
    codigo: COD_BINARIA_REC, flujo: FLUJO_BINARIA_REC, generar: genBinariaRec
  }
};

const ORDENACION = ['burbuja', 'seleccion', 'insercion', 'shell', 'quicksort'];
const BUSQUEDA = ['lineal', 'binaria', 'binariarecursiva'];
const TODOS = [...ORDENACION, ...BUSQUEDA];

// Líneas que tienen nodo en el diagrama (para resaltarlo al ejecutar)
const nodosDelFlujo = (flujo) => {
  const ids = new Set();
  const re = /\b(L\d+)\s*[\[{]/g;
  let m;
  while ((m = re.exec(flujo)) !== null) ids.add(m[1]);
  return ids;
};

// ------------------------------------------------------------
// Sangría de 2 espacios: en el panel estrecho se lee mucho mejor
// que los 4 espacios del tema, y las líneas son más cortas
// ------------------------------------------------------------
const conSangria2 = (lineas) =>
  lineas.map((l) => l.replace(/^ +/, (espacios) => ' '.repeat(Math.floor(espacios.length / 2))));

Object.values(ALGORITMOS).forEach((algo) => {
  algo.codigo = conSangria2(algo.codigo);
});
