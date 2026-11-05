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

const rango = (desde, hasta) => {
  const res = [];
  for (let k = desde; k <= hasta; k++) res.push(k);
  return res;
};

/* ============================================================
   1) BURBUJA (Bubble Sort)
   ============================================================ */
const COD_BURBUJA = [
  'void Burbuja(int[] arr)',
  '{',
  '    for (int i = 0; i < arr.Length - 1; i++)',
  '    {',
  '        bool intercambio = false;',
  '        for (int j = 0; j < arr.Length - 1 - i; j++)',
  '        {',
  '            if (arr[j] > arr[j + 1])',
  '            {',
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
  INICIO(["🎬 Inicio"]) --> L3["for (int i = 0; i &lt; arr.Length - 1; i++)"]
  L3 -->|"queda pasada"| L5["bool intercambio = false"]
  L3 -->|"i llegó al final"| FIN(["✅ Fin"])
  L5 --> L6["for (int j = 0; j &lt; arr.Length - 1 - i; j++)"]
  L6 -->|"hay j"| L8{"¿arr[j] &gt; arr[j + 1]?"}
  L6 -->|"pasada completa"| L15{"¿hubo intercambios?"}
  L8 -->|"Sí"| L10["(arr[j], arr[j+1]) = (arr[j+1], arr[j])"]
  L10 --> L11["intercambio = true"]
  L11 --> L6
  L8 -->|"No"| L6
  L15 -->|"Sí"| L3
  L15 -->|"No: ya está"| FIN`;

function* genBurbuja(arr) {
  const a = [...arr];
  const n = a.length;

  yield paso(3, 'inicio', { arr: [...a], vars: { n }, msg: `Empezamos con [${a.join(', ')}]` });

  for (let i = 0; i < n - 1; i++) {
    const fijos = rango(n - i, n - 1);
    let intercambio = false;

    yield paso(5, 'set', {
      arr: [...a], fijos, vars: { i, intercambio },
      msg: `Pasada ${i + 1}: marcamos intercambio = false${fijos.length ? ` · ya fijos: ${fijos.map((k) => a[k]).join(', ')}` : ''}`
    });

    yield paso(6, 'set', {
      arr: [...a], fijos, vars: { i },
      msg: `Recorremos con j desde 0 hasta ${n - 1 - i} (los últimos ${i} ya están en su sitio)`
    });

    for (let j = 0; j < n - 1 - i; j++) {
      const mayor = a[j] > a[j + 1];

      yield paso(8, 'cmp', {
        arr: [...a], fijos, vars: { i, j },
        idx: [[j, 'cmp'], [j + 1, 'cmp']],
        marcas: [['i', i], ['j', j]],
        msg: `¿${a[j]} > ${a[j + 1]}? ${mayor ? 'Sí → toca intercambiar' : 'No → seguimos'}`
      });

      if (mayor) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];

        yield paso(10, 'swap', {
          arr: [...a], fijos, vars: { i, j },
          idx: [[j, 'swap'], [j + 1, 'swap']],
          marcas: [['i', i], ['j', j]],
          msg: `Intercambiamos las posiciones ${j} y ${j + 1}: [${a.join(', ')}]`
        });

        intercambio = true;
        yield paso(11, 'set', {
          arr: [...a], fijos, vars: { i, j, intercambio },
          marcas: [['i', i], ['j', j]],
          msg: 'Marcamos intercambio = true'
        });
      }
    }

    const fijosFin = rango(n - i - 1, n - 1);
    yield paso(15, 'check', {
      arr: [...a], fijos: fijosFin, vars: { i, intercambio },
      msg: intercambio
        ? `Fin de la pasada ${i + 1}: hubo intercambios → seguimos`
        : 'No hubo intercambios en toda la pasada → el array ya está ordenado y salimos con break'
    });

    if (!intercambio) break;
  }

  yield paso(17, 'fin', { arr: [...a], fijos: rango(0, n - 1), msg: '✅ ¡Array ordenado!' });
}

/* ============================================================
   2) SELECCIÓN (Selection Sort)
   ============================================================ */
const COD_SELECCION = [
  'void Seleccion(int[] arr)',
  '{',
  '    for (int i = 0; i < arr.Length - 1; i++)',
  '    {',
  '        int minIdx = i;',
  '        for (int j = i + 1; j < arr.Length; j++)',
  '        {',
  '            if (arr[j] < arr[minIdx])',
  '                minIdx = j;',
  '        }',
  '        (arr[i], arr[minIdx]) = (arr[minIdx], arr[i]);',
  '    }',
  '}'
];

const FLUJO_SELECCION = `graph TD
  INICIO(["🎬 Inicio"]) --> L3["for (int i = 0; i &lt; arr.Length - 1; i++)"]
  L3 -->|"queda array"| L5["int minIdx = i"]
  L3 -->|"i llegó al final"| FIN(["✅ Fin"])
  L5 --> L6["for (int j = i + 1; j &lt; arr.Length; j++)"]
  L6 -->|"hay j"| L8{"¿arr[j] &lt; arr[minIdx]?"}
  L6 -->|"recorrido completo"| L11["(arr[i], arr[minIdx]) = (arr[minIdx], arr[i])"]
  L8 -->|"Sí"| L9["minIdx = j"]
  L9 --> L6
  L8 -->|"No"| L6
  L11 --> L3`;

function* genSeleccion(arr) {
  const a = [...arr];
  const n = a.length;

  yield paso(3, 'inicio', { arr: [...a], vars: { n }, msg: `Buscamos el mínimo de [${a.join(', ')}] posición a posición` });

  for (let i = 0; i < n - 1; i++) {
    const fijos = rango(0, i - 1);
    let minIdx = i;

    yield paso(5, 'set', {
      arr: [...a], fijos, vars: { i, minIdx },
      idx: [[i, 'min']], marcas: [['i', i], ['min', i]],
      msg: `Empezamos tomando a[${i}] = ${a[i]} como mínimo`
    });

    yield paso(6, 'set', {
      arr: [...a], fijos, vars: { i, minIdx },
      marcas: [['i', i]],
      msg: `Miramos el resto: de la posición ${i + 1} hasta ${n - 1}`
    });

    for (let j = i + 1; j < n; j++) {
      const esMenor = a[j] < a[minIdx];

      yield paso(8, 'cmp', {
        arr: [...a], fijos, vars: { i, j, minIdx },
        idx: [[j, 'cmp'], [minIdx, 'min']],
        marcas: [['i', i], ['j', j], ['min', minIdx]],
        msg: `¿${a[j]} < mínimo actual (${a[minIdx]})? ${esMenor ? 'Sí → hemos encontrado uno más pequeño' : 'No → seguimos'}`
      });

      if (esMenor) {
        minIdx = j;
        yield paso(9, 'set', {
          arr: [...a], fijos, vars: { i, j, minIdx },
          idx: [[minIdx, 'min']], marcas: [['i', i], ['min', minIdx]],
          msg: `minIdx = ${j} → el nuevo mínimo es ${a[j]}`
        });
      }
    }

    const yaEsta = minIdx === i;
    if (!yaEsta) [a[i], a[minIdx]] = [a[minIdx], a[i]];

    yield paso(11, yaEsta ? 'set' : 'swap', {
      arr: [...a], fijos: [...fijos, i], vars: { i, minIdx },
      idx: yaEsta ? [[i, 'fijo']] : [[i, 'swap'], [minIdx, 'swap']],
      marcas: [['i', i], ['min', minIdx]],
      msg: yaEsta
        ? `a[${i}] ya era el mínimo: no hay nada que mover`
        : `Intercambiamos: ${a[i]} se queda en la posición ${i} y el resto avanza`
    });
  }

  yield paso(13, 'fin', { arr: [...a], fijos: rango(0, n - 1), msg: '✅ ¡Array ordenado!' });
}

/* ============================================================
   3) INSERCIÓN (Insertion Sort)
   ============================================================ */
const COD_INSERCION = [
  'void Insercion(int[] arr)',
  '{',
  '    for (int i = 1; i < arr.Length; i++)',
  '    {',
  '        int clave = arr[i];',
  '        int j = i - 1;',
  '        while (j >= 0 && arr[j] > clave)',
  '        {',
  '            arr[j + 1] = arr[j];',
  '            j--;',
  '        }',
  '        arr[j + 1] = clave;',
  '    }',
  '}'
];

const FLUJO_INSERCION = `graph TD
  INICIO(["🎬 Inicio"]) --> L3["for (int i = 1; i &lt; arr.Length; i++)"]
  L3 -->|"queda"| L5["int clave = arr[i]"]
  L3 -->|"fin"| FIN(["✅ Fin"])
  L5 --> L6["int j = i - 1"]
  L6 --> L7{"¿j &gt;= 0 y arr[j] &gt; clave?"}
  L7 -->|"Sí"| L9["arr[j + 1] = arr[j]"]
  L9 --> L10["j--"]
  L10 --> L7
  L7 -->|"No"| L12["arr[j + 1] = clave"]
  L12 --> L3`;

function* genInsercion(arr) {
  const a = [...arr];
  const n = a.length;

  yield paso(3, 'inicio', { arr: [...a], vars: { n }, msg: 'La izquierda ya está ordenada; vamos insertando cada elemento en su sitio' });

  for (let i = 1; i < n; i++) {
    const clave = a[i];
    let j = i - 1;
    const fijos = rango(0, i - 1);

    yield paso(5, 'set', {
      arr: [...a], fijos, vars: { i, clave, j },
      idx: [[i, 'cur']], marcas: [['i', i], ['clave', i]],
      msg: `Cogemos la carta clave = a[${i}] = ${clave}`
    });

    yield paso(6, 'set', {
      arr: [...a], fijos, vars: { i, clave, j },
      marcas: [['i', i], ['j', j]],
      msg: `j = ${j}: empezamos a mirar hacia la izquierda`
    });

    while (true) {
      const cond = j >= 0 && a[j] > clave;

      yield paso(7, j >= 0 ? 'cmp' : 'check', {
        arr: [...a], fijos, vars: { i, clave, j },
        idx: j >= 0 ? [[j, 'cmp'], [i, 'cur']] : [],
        marcas: j >= 0 ? [['i', i], ['j', j]] : [['i', i]],
        msg: j >= 0
          ? `¿${a[j]} > clave (${clave})? ${cond ? 'Sí → desplazamos a la derecha' : 'No → ya está en su sitio'}`
          : `j = ${j} < 0 → llegamos al principio del array`
      });

      if (!cond) break;

      a[j + 1] = a[j];
      yield paso(9, 'move', {
        arr: [...a], fijos, vars: { i, clave, j },
        idx: [[j + 1, 'move']], marcas: [['j', j], ['clave', i]],
        msg: `a[${j + 1}] = a[${j}]: movemos ${a[j]} un sitio a la derecha`
      });

      j--;
      yield paso(10, 'set', {
        arr: [...a], fijos, vars: { i, clave, j },
        marcas: [['i', i], ['j', j]],
        msg: `j-- → j = ${j}`
      });
    }

    a[j + 1] = clave;
    yield paso(12, 'set', {
      arr: [...a], fijos: rango(0, i), vars: { i, clave, j },
      idx: [[j + 1, 'fijo']], marcas: [['i', i]],
      msg: `Insertamos la clave ${clave} en la posición ${j + 1}`
    });
  }

  yield paso(14, 'fin', { arr: [...a], fijos: rango(0, n - 1), msg: '✅ ¡Array ordenado!' });
}

/* ============================================================
   4) SHELL SORT
   ============================================================ */
const COD_SHELL = [
  'void ShellSort(int[] arr)',
  '{',
  '    int n = arr.Length;',
  '    for (int gap = n / 2; gap > 0; gap /= 2)',
  '    {',
  '        for (int i = gap; i < n; i++)',
  '        {',
  '            int temp = arr[i];',
  '            int j = i;',
  '            while (j >= gap && arr[j - gap] > temp)',
  '            {',
  '                arr[j] = arr[j - gap];',
  '                j -= gap;',
  '            }',
  '            arr[j] = temp;',
  '        }',
  '    }',
  '}'
];

const FLUJO_SHELL = `graph TD
  INICIO(["🎬 Inicio"]) --> L4["for (gap = n / 2; gap &gt; 0; gap /= 2)"]
  L4 -->|"gap &gt; 0"| L6["for (int i = gap; i &lt; n; i++)"]
  L4 -->|"gap = 0"| FIN(["✅ Fin"])
  L6 -->|"hay i"| L8["int temp = arr[i]"]
  L6 -->|"termina i"| L4
  L8 --> L10{"¿arr[j - gap] &gt; temp?"}
  L10 -->|"Sí"| L12["arr[j] = arr[j - gap]"]
  L12 --> L13["j -= gap"]
  L13 --> L10
  L10 -->|"No"| L15["arr[j] = temp"]
  L15 --> L6`;

function* genShell(arr) {
  const a = [...arr];
  const n = a.length;
  let gap = Math.floor(n / 2);

  yield paso(4, 'set', {
    arr: [...a], vars: { n, gap },
    msg: `gap = n / 2 = ${gap}: comparamos elementos separados ${gap} posiciones`
  });

  while (gap > 0) {
    yield paso(6, 'set', {
      arr: [...a], vars: { n, gap },
      msg: `Con gap = ${gap}, recorremos el array de la posición ${gap} en adelante`
    });

    for (let i = gap; i < n; i++) {
      const temp = a[i];

      yield paso(8, 'set', {
        arr: [...a], vars: { gap, i, temp },
        idx: [[i, 'cur']], marcas: [['i', i], ['temp', i]],
        msg: `Guardamos temp = a[${i}] = ${temp}`
      });

      let j = i;

      while (true) {
        const cond = j >= gap && a[j - gap] > temp;

        yield paso(10, j >= gap ? 'cmp' : 'check', {
          arr: [...a], vars: { gap, i, j, temp },
          idx: j >= gap ? [[j, 'cmp'], [j - gap, 'cmp']] : [],
          marcas: j >= gap ? [['j', j], ['j-gap', j - gap]] : [],
          msg: j >= gap
            ? `¿${a[j - gap]} > temp (${temp})? ${cond ? 'Sí → lo desplazamos ' + gap + ' posiciones' : 'No → paramos'}`
            : `j = ${j} &lt; gap = ${gap} → llegamos al principio del tramo`
        });

        if (!cond) break;

        a[j] = a[j - gap];
        yield paso(12, 'move', {
          arr: [...a], vars: { gap, j, temp },
          idx: [[j, 'move']], marcas: [['j', j]],
          msg: `a[${j}] = a[${j - gap}]: movemos ${a[j]} ${gap} posiciones a la derecha`
        });

        j -= gap;
        yield paso(13, 'set', {
          arr: [...a], vars: { gap, j, temp },
          marcas: [['j', j]],
          msg: `j -= gap → j = ${j}`
        });
      }

      a[j] = temp;
      yield paso(15, 'set', {
        arr: [...a], vars: { gap, i, j, temp },
        idx: [[j, 'cur']], marcas: [['temp', j]],
        msg: `Insertamos temp = ${temp} en la posición ${j}`
      });
    }

    gap = Math.floor(gap / 2);
    if (gap > 0) {
      yield paso(4, 'set', {
        arr: [...a], vars: { n, gap },
        msg: `Reducimos el salto → gap = ${gap}`
      });
    }
  }

  yield paso(18, 'fin', { arr: [...a], fijos: rango(0, n - 1), msg: '✅ ¡Array ordenado! (el último gap = 1 es Inserción normal)' });
}

/* ============================================================
   5) QUICKSORT
   ============================================================ */
const COD_QUICKSORT = [
  'void QuickSort(int[] arr, int bajo, int alto)',
  '{',
  '    if (bajo < alto)',
  '    {',
  '        int pivote = Partition(arr, bajo, alto);',
  '        QuickSort(arr, bajo, pivote - 1);',
  '        QuickSort(arr, pivote + 1, alto);',
  '    }',
  '}',
  '',
  'int Partition(int[] arr, int bajo, int alto)',
  '{',
  '    int pivote = arr[alto];',
  '    int i = bajo - 1;',
  '    for (int j = bajo; j < alto; j++)',
  '    {',
  '        if (arr[j] < pivote)',
  '        {',
  '            i++;',
  '            (arr[i], arr[j]) = (arr[j], arr[i]);',
  '        }',
  '    }',
  '    (arr[i + 1], arr[alto]) = (arr[alto], arr[i + 1]);',
  '    return i + 1;',
  '}'
];

const FLUJO_QUICKSORT = `graph TD
  INICIO(["🎬 Inicio"]) --> L3{"¿bajo &lt; alto?"}
  L3 -->|"Sí"| L5["int pivote = Partition(arr, bajo, alto)"]
  L3 -->|"No: un solo elemento"| FIN(["✅ Fin"])
  L5 -.->|"dentro de Partition"| L13["int pivote = arr[alto]"]
  L13 --> L14["int i = bajo - 1"]
  L14 --> L17{"¿arr[j] &lt; pivote?"}
  L17 -->|"Sí"| L19["i++"]
  L19 --> L20["(arr[i], arr[j]) = (arr[j], arr[i])"]
  L20 --> SIG{"¿j llegó a alto?"}
  L17 -->|"No"| SIG
  SIG -->|"No: siguiente j"| L17
  SIG -->|"Sí"| L23["(arr[i+1], arr[alto]) = (arr[alto], arr[i+1])"]
  L23 --> L24["return i + 1"]
  L24 --> L6["QuickSort(arr, bajo, pivote - 1)"]
  L6 --> L7["QuickSort(arr, pivote + 1, alto)"]
  L7 -->|"volvemos"| L3`;

function* genQuicksort(arr) {
  const a = [...arr];
  if (a.length === 0) {
    yield paso(1, 'fin', { arr: [...a], msg: 'Array vacío: no hay nada que ordenar' });
    return;
  }

  yield* genQs(a, 0, a.length - 1);
  yield paso(9, 'fin', { arr: [...a], fijos: rango(0, a.length - 1), msg: '✅ ¡Array ordenado!' });
}

function* genQs(a, bajo, alto) {
  yield paso(3, 'check', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto },
    msg: `¿bajo (${bajo}) < alto (${alto})? ${bajo < alto ? 'Sí → hay que particionar' : 'No → este trozo ya está ordenado'}`
  });

  if (bajo >= alto) return;

  yield paso(5, 'call', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto },
    idx: [[alto, 'pivot']], marcas: [['bajo', bajo], ['alto', alto]],
    msg: 'Vamos a llamar a Partition: elegiremos pivote y separaremos menores y mayores'
  });

  const p = yield* genPartition(a, bajo, alto);

  yield paso(6, 'call', {
    arr: [...a], rango: [bajo, Math.max(bajo, p - 1)], vars: { bajo, alto, pivote: p },
    idx: p > bajo ? [] : [], marcas: [['pivote', p]],
    msg: p > bajo
      ? `Recursión izquierda: QuickSort(${bajo}, ${p - 1})`
      : `No hay subarreglo izquierdo: ${p} = ${bajo}`
  });
  if (p > bajo) yield* genQs(a, bajo, p - 1);

  yield paso(7, 'call', {
    arr: [...a], rango: [Math.min(alto, p + 1), alto], vars: { bajo, alto, pivote: p },
    marcas: [['pivote', p]],
    msg: p < alto
      ? `Recursión derecha: QuickSort(${p + 1}, ${alto})`
      : `No hay subarreglo derecho: ${p} = ${alto}`
  });
  if (p < alto) yield* genQs(a, p + 1, alto);
}

function* genPartition(a, bajo, alto) {
  const pivote = a[alto];

  yield paso(13, 'set', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote },
    idx: [[alto, 'pivot']], marcas: [['pivote', alto]],
    msg: `pivote = arr[${alto}] = ${pivote} (tomamos el último como referencia)`
  });

  let i = bajo - 1;

  yield paso(14, 'set', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i },
    idx: [[alto, 'pivot']], marcas: [['i', i], ['pivote', alto]],
    msg: `i = ${i}: por delante de i vivirán los menores que el pivote`
  });

  for (let j = bajo; j < alto; j++) {
    const menor = a[j] < pivote;

    yield paso(17, 'cmp', {
      arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i, j },
      idx: [[j, 'cmp'], [alto, 'pivot']],
      marcas: [['i', i], ['j', j], ['pivote', alto]],
      msg: `¿${a[j]} < pivote (${pivote})? ${menor ? 'Sí → va con los menores' : 'No → se queda donde está'}`
    });

    if (menor) {
      i++;
      yield paso(19, 'set', {
        arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i, j },
        idx: [[i, 'cur'], [j, 'cmp']],
        marcas: [['i', i], ['j', j], ['pivote', alto]],
        msg: `Sí → i++ = ${i}: ampliamos la zona de menores`
      });

      [a[i], a[j]] = [a[j], a[i]];
      yield paso(20, 'swap', {
        arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i, j },
        idx: [[i, 'swap'], [j, 'swap']],
        marcas: [['i', i], ['j', j], ['pivote', alto]],
        msg: `Intercambiamos las posiciones ${i} y ${j}`
      });
    }
  }

  const pos = i + 1;
  const mover = pos !== alto;
  if (mover) [a[pos], a[alto]] = [a[alto], a[pos]];

  yield paso(23, mover ? 'swap' : 'set', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote, i },
    idx: mover ? [[pos, 'swap'], [alto, 'swap']] : [[alto, 'pivot']],
    marcas: [['pivote', pos]],
    msg: mover
      ? `Colocamos el pivote en su sitio: posición ${pos}`
      : `El pivote ya estaba en su sitio (${pos})`
  });

  yield paso(24, 'ret', {
    arr: [...a], rango: [bajo, alto], vars: { bajo, alto, pivote: pos },
    idx: [[pos, 'fijo']], marcas: [['pivote', pos]],
    msg: `Partition devuelve ${pos} → ${a[pos]} queda fijo en su sitio ✅`
  });

  return pos;
}

/* ============================================================
   6) BÚSQUEDA LINEAL
   ============================================================ */
const COD_LINEAL = [
  'int BuscarLineal(int[] arr, int objetivo)',
  '{',
  '    for (int i = 0; i < arr.Length; i++)',
  '    {',
  '        if (arr[i] == objetivo)',
  '            return i;  // Encontrado',
  '    }',
  '    return -1;  // No encontrado',
  '}'
];

const FLUJO_LINEAL = `graph TD
  INICIO(["🎬 Inicio"]) --> L3["for (int i = 0; i &lt; arr.Length; i++)"]
  L3 -->|"hay i"| L5{"¿arr[i] == objetivo?"}
  L3 -->|"llegamos al final"| L8["return -1"]
  L5 -->|"Sí"| L6["return i"]
  L5 -->|"No: i++"| L3
  L6 --> OK(["🎉 ¡Encontrado!"])
  L8 --> KO(["😕 No encontrado"])`;

function* genLineal(arr, objetivo) {
  const a = [...arr];

  yield paso(3, 'inicio', {
    arr: [...a], vars: { objetivo }, visit: [],
    msg: `Vamos a recorrer el array entero buscando el ${objetivo}`
  });

  for (let i = 0; i < a.length; i++) {
    const igual = a[i] === objetivo;
    const visitados = rango(0, i - 1);

    yield paso(5, 'cmp', {
      arr: [...a], vars: { i, objetivo }, visit: [...visitados, i],
      idx: [[i, igual ? 'found' : 'cmp']], marcas: [['i', i]],
      msg: `¿a[${i}] = ${a[i]} es igual a ${objetivo}? ${igual ? '¡Sí! Lo hemos encontrado' : 'No → seguimos mirando'}`
    });

    if (igual) {
      yield paso(6, 'found', {
        arr: [...a], vars: { i, resultado: i }, visit: rango(0, i),
        idx: [[i, 'found']], marcas: [['i', i]],
        msg: `🎉 ¡Encontrado! Devolvemos la posición ${i}`
      });
      return i;
    }
  }

  yield paso(8, 'notfound', {
    arr: [...a], vars: { resultado: -1 }, visit: rango(0, a.length - 1),
    msg: `Recorrimos los ${a.length} elementos y ${objetivo} no está → devolvemos -1`
  });
  return -1;
}

/* ============================================================
   7) BÚSQUEDA BINARIA
   ============================================================ */
const COD_BINARIA = [
  'int BuscarBinaria(int[] arr, int objetivo)',
  '{',
  '    int bajo = 0, alto = arr.Length - 1;',
  '    while (bajo <= alto)',
  '    {',
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
  INICIO(["🎬 Inicio"]) --> L3["bajo = 0, alto = arr.Length - 1"]
  L3 --> L4{"¿bajo &lt;= alto?"}
  L4 -->|"Sí"| L8["medio = bajo + (alto - bajo) / 2"]
  L8 --> L9{"¿arr[medio] == objetivo?"}
  L9 -->|"Sí"| OK(["🎉 ¡Encontrado!"])
  L9 -->|"No"| L10["¿es menor? → bajo = medio + 1"]
  L10 -->|"Sí: mitad derecha"| L4
  L10 -->|"No: mitad izquierda"| L11["alto = medio - 1"]
  L11 --> L4
  L4 -->|"No queda sitio"| L13["return -1"]
  L13 --> KO(["😕 No encontrado"])`;

function* genBinaria(arr, objetivo) {
  const a = [...arr];
  let bajo = 0;
  let alto = a.length - 1;
  const visit = [];

  yield paso(3, 'init', {
    arr: [...a], vars: { bajo, alto, objetivo }, rango: [0, a.length - 1], descartar: true, visit: [],
    marcas: [['bajo', 0], ['alto', a.length - 1]],
    msg: `Empezamos con bajo = 0 y alto = ${a.length - 1}`
  });

  while (true) {
    const dentro = bajo <= alto;

    yield paso(4, dentro ? 'check' : 'fin-cond', {
      arr: [...a], vars: { bajo, alto, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
      marcas: dentro ? [['bajo', bajo], ['alto', alto]] : [],
      msg: dentro
        ? `¿bajo (${bajo}) <= alto (${alto})? Sí → seguimos buscando`
        : `¿bajo (${bajo}) <= alto (${alto})? No → no queda sitio, el elemento no está`
    });

    if (!dentro) break;

    const medio = bajo + Math.floor((alto - bajo) / 2);
    visit.push(medio);

    yield paso(8, 'set', {
      arr: [...a], vars: { bajo, alto, medio, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
      idx: [[medio, 'mid']], marcas: [['bajo', bajo], ['medio', medio], ['alto', alto]],
      msg: `medio = ${bajo} + (${alto} - ${bajo}) / 2 = ${medio}`
    });

    const igual = a[medio] === objetivo;

    yield paso(9, 'cmp', {
      arr: [...a], vars: { bajo, alto, medio, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
      idx: [[medio, igual ? 'found' : 'cmp']], marcas: [['bajo', bajo], ['medio', medio], ['alto', alto]],
      msg: `¿a[${medio}] = ${a[medio]} es igual a ${objetivo}? ${igual ? '¡Sí! Encontrado 🎉' : 'No → tenemos que descartar mitad'}`
    });

    if (igual) {
      yield paso(9, 'found', {
        arr: [...a], vars: { bajo, alto, medio, resultado: medio }, visit: [...visit],
        idx: [[medio, 'found']], marcas: [['medio', medio]],
        msg: `🎉 ¡Encontrado en la posición ${medio}!`
      });
      return medio;
    }

    if (a[medio] < objetivo) {
      const descartados = rango(bajo, medio);
      bajo = medio + 1;
      yield paso(10, 'set', {
        arr: [...a], vars: { bajo, alto, medio, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
        idx: [[medio, 'discard']], marcas: [['bajo', bajo], ['alto', alto]],
        msg: `${a[medio]} < ${objetivo} → descartamos ${descartados.length} posiciones de la izquierda (bajo = ${bajo})`
      });
    } else {
      const descartados = rango(medio, alto);
      alto = medio - 1;
      yield paso(11, 'set', {
        arr: [...a], vars: { bajo, alto, medio, objetivo }, rango: [bajo, alto], descartar: true, visit: [...visit],
        idx: [[medio, 'discard']], marcas: [['bajo', bajo], ['alto', alto]],
        msg: `${a[medio]} > ${objetivo} → descartamos ${descartados.length} posiciones de la derecha (alto = ${alto})`
      });
    }
  }

  yield paso(13, 'notfound', {
    arr: [...a], vars: { resultado: -1 }, visit: [...visit],
    msg: `No queda nada que mirar → ${objetivo} no está en el array (devolvemos -1)`
  });
  return -1;
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
  }
};

const ORDENACION = ['burbuja', 'seleccion', 'insercion', 'shell', 'quicksort'];
const BUSQUEDA = ['lineal', 'binaria'];
const TODOS = [...ORDENACION, ...BUSQUEDA];

// Líneas que tienen nodo en el diagrama (para resaltarlo al ejecutar)
const nodosDelFlujo = (flujo) => {
  const ids = new Set();
  const re = /\b(L\d+)\s*[\[{]/g;
  let m;
  while ((m = re.exec(flujo)) !== null) ids.add(m[1]);
  return ids;
};
