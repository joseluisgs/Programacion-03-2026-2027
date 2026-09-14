# Práctica FMM (Forest-Fire Model): Algoritmos y Matrices

**Instrucciones:** Implementa el Modelo FFM (Forest-Fire Model) en C# usando Top-Level Statements. Aplica obligatoriamente la técnica de **Doble Búfer** para el manejo consistente de las matrices. Recuerda: **primero el diseño en papel, luego la codificación**.

---

## 1. El Modelo FFM: Reglas de Evolución

El sistema se basa en una cuadrícula de celdas que pueden tener tres estados. La evolución en el tiempo viene determinada por las siguientes cuatro reglas, aplicadas **simultáneamente** a cada celda:

1. **Ardiendo → Vacía:** Una celda que está ardiendo se convierte en un espacio vacío en el siguiente paso.
2. **Árbol → Ardiendo (Contagio):** Un árbol arderá si al menos uno de sus **8 vecinos adyacentes** está ardiendo.
3. **Árbol → Ardiendo (Espontáneo):** Un árbol comienza a arder con una probabilidad `PARDER` incluso si no tiene ningún vecino ardiendo.
4. **Vacía → Árbol:** Un árbol brota en un espacio vacío con una probabilidad `PCRECER`.

## 2. Especificaciones Técnicas y Constantes

### 2.1. Estados y Constantes

| Estado | Símbolo de Impresión | Constante en C# |
| :--- | :--- | :--- |
| **Vacía** | ` ` (espacio) | `const int VACIO = 0;` |
| **Árbol** | `T` | `const int ARBOL = 1;` |
| **Ardiendo** | `*` | `const int ARDIENDO = 2;` |

| Constante | Valor | Descripción |
| :--- | :--- | :--- |
| `PARDER` | `0.00006` | Probabilidad de ignición espontánea (Regla 3) |
| `PCRECER` | `0.01` | Probabilidad de crecimiento (Regla 4) |
| `TIEMPO_MAX` | `60` | Duración máxima de la simulación en segundos |
| `FILAS` / `COLUMNAS` | `20` | Dimensión de la cuadrícula |

### 2.2. Parámetros Iniciales

- **Tamaño de la Cuadrícula:** Matriz `int[20,20]`.
- **Árboles Iniciales:** El porcentaje de celdas con estado `ARBOL` debe ser **aleatorio**, entre el **30% y el 80%** del total.

## 3. Requerimientos de Implementación

La solución debe garantizar la **consistencia de datos** en cada paso utilizando **Doble Búfer**: `frontBuffer` (lectura/visualización) y `backBuffer` (escritura/cálculo).

| Función | Propósito |
| :--- | :--- |
| `cloneMatrix` | Copia profunda para inicializar el backBuffer desde el frontBuffer |
| `initForest` | Rellena el frontBuffer con estados ARBOL o VACIO según el porcentaje aleatorio |
| `hasBurningNeighbour` | Busca celdas ARDIENDO entre los 8 vecinos de una posición |
| `step` | Realiza un paso: LEE de frontBuffer, ESCRIBE en backBuffer |
| `printMatrix` | Muestra el estado actual del frontBuffer con los caracteres definidos |

### 3.1. Estructura del Programa Principal

1. **Inicialización:** Crear frontBuffer y clonarlo para backBuffer.
2. **Control de Tiempo:** Bucle `while` con duración máxima de 60 segundos.
3. **Llamadas:** Dentro del bucle, llamar a `printMatrix` y luego a `step`.
4. **Swap:** Intercambiar referencias de frontBuffer y backBuffer (operación O(1)).
5. **Pausa:** `Thread.Sleep(1000)` entre iteraciones.

## 4. Informe Final

El programa debe calcular y reportar:

- Número **total** de celdas que han ardido (transiciones Árbol → Ardiendo).
- Número **total** de árboles que han nacido (transiciones Vacío → Árbol).
- Número final de celdas vacías, árboles y ardiendo.
- Coordenadas de las celdas con árbol al finalizar.

**Documentación del diseño:**

1. **Eficiencia del Swap:** Explicar por qué el intercambio de referencias es O(1).
2. **Contraste con Clonación:** Comparar con el costo O(n²) de copiar la matriz completa en cada paso.
