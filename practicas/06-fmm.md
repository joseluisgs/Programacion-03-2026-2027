# Práctica FMM (Forest-Fire Model): Algoritmos y Matrices

- [Práctica FMM (Forest-Fire Model): Algoritmos y Matrices](#práctica-fmm-forest-fire-model-algoritmos-y-matrices)
  - [1. El Modelo FFM: Reglas de Evolución](#1-el-modelo-ffm-reglas-de-evolución)
  - [2. Especificaciones Técnicas y Constantes](#2-especificaciones-técnicas-y-constantes)
    - [2.1. Definición de Constantes (Lenguaje DAW)](#21-definición-de-constantes-lenguaje-daw)
    - [2.2. Parámetros Iniciales](#22-parámetros-iniciales)
  - [3. Requerimientos de Implementación y Doble Búfer](#3-requerimientos-de-implementación-y-doble-búfer)
    - [3.1. Estructura del Programa Principal (`Main`)](#31-estructura-del-programa-principal-main)
  - [4. Informe Final](#4-informe-final)


El **Modelo FFM (Forest-Fire Model)** es un sistema dinámico que simula la propagación del fuego en un bosque. La práctica consiste en implementar este modelo utilizando la estructura de programación modular del Lenguaje DAW y aplicando obligatoriamente la técnica de **Doble Búfer** para el manejo consistente de las matrices.

## 1\. El Modelo FFM: Reglas de Evolución

El sistema se basa en una cuadrícula de celdas que pueden tener tres estados. La evolución en el tiempo viene determinada por las siguientes cuatro reglas, aplicadas **simultáneamente** a cada celda de la cuadrícula:

1.  **Ardiendo $\rightarrow$ Vacía:** Una celda que está ardiendo se convierte en un espacio vacío en el siguiente paso.
2.  **Árbol $\rightarrow$ Ardiendo (Contagio):** Un árbol arderá si al menos uno de sus **vecinos adyacentes (8 direcciones)** está ardiendo.
3.  **Árbol $\rightarrow$ Ardiendo (Espontáneo):** Un árbol comienza a arder con una probabilidad $P_{ARDER}$ incluso si no tiene ningún vecino ardiendo.
4.  **Vacía $\rightarrow$ Árbol:** Un árbol brota en un espacio vacío con una probabilidad $P_{CRECER}$.

## 2\. Especificaciones Técnicas y Constantes

### 2.1. Definición de Constantes (Lenguaje DAW)

| Estado       | Símbolo de Impresión (`print`) | Valor Entero (DAW)        |
| :----------- | :----------------------------- | :------------------------ |
| **Vacía**    | `     ` (Espacio)              | `const int VACIO = 0;`    |
| **Árbol**    | `🌳`                            | `const int ARBOL = 1;`    |
| **Ardiendo** | `🔥`                            | `const int ARDIENDO = 2;` |

| Nombre               | Valor     | Tipo           | Descripción                                      |
| :------------------- | :-------- | :------------- | :----------------------------------------------- |
| `PARDER`             | $0.00006$ | `const double` | Probabilidad de ignición espontánea (Regla 3).   |
| `PCRECER`            | $0.01$    | `const double` | Probabilidad de crecimiento (Regla 4).           |
| `TIEMPO_MAX`         | $60$      | `const int`    | Duración máxima de la simulación en segundos.    |
| `FILAS` / `COLUMNAS` | $20$      | `const int`    | Dimensión de la cuadrícula a utilizar (ejemplo). |

### 2.2. Parámetros Iniciales

  * **Tamaño de la Cuadrícula:** Utilizar una matriz **`int[][]`** (array de arrays) de $20 \times 20$.
  * **Árboles Iniciales:** El porcentaje de celdas iniciales con estado `ARBOL` debe ser **aleatorio**, entre el **30% y el 80%** del total de celdas.

-----

## 3\. Requerimientos de Implementación y Doble Búfer

La solución debe garantizar la **consistencia de datos** en cada paso de la simulación utilizando **Doble Búfer**. Esto implica trabajar con dos matrices: `frontBuffer` (lectura/visualización) y `backBuffer` (escritura/cálculo).

| Funciones Requeridas      | Propósito y Relevancia                                                                                                                                          |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`cloneMatrix`**         | **Copia Profunda (O($n^2$)).** Debe crear una copia del `frontBuffer` para inicializar el `backBuffer`. **Clave para asegurar dos áreas de memoria separadas.** |
| **`initForest`**          | **Inicialización.** Rellena el `frontBuffer` con estados `ARBOL` o `VACIO` según el porcentaje aleatorio inicial.                                               |
| **`hasBurningNeighbour`** | **Lógica de Vecinos.** Implementa la búsqueda de celdas `ARDIENDO` entre los 8 vecinos de una posición.                                                         |
| **`step`**                | **Algoritmo FFM.** Realiza un paso de la simulación. **Debe LEER de `frontBuffer` y ESCRIBIR en `backBuffer`.**                                                 |
| **`printMatrix`**         | **Visualización.** Muestra el estado actual del `frontBuffer` con los caracteres definidos.                                                                     |

### 3.1. Estructura del Programa Principal (`Main`)

La función `Main` debe orquestar el flujo de la simulación, controlando el tiempo y el mecanismo de Doble Búfer.

1.  **Inicialización:** Crear e inicializar el `frontBuffer` y, usando `cloneMatrix`, inicializar el `backBuffer`.
2.  **Control de Tiempo:** Implementar un bucle `while` que controle la duración máxima de $60$ segundos.
3.  **Llamadas a Funciones:** Dentro del bucle, llamar a `printMatrix` y luego a `step`.
4.  **Intercambio de Roles (SWAP):** Implementar el **Intercambio de Referencias** de `frontBuffer` y `backBuffer`. Este debe ser una operación **$O(1)$** (constante) para mantener la eficiencia.
5.  **Pausa entre Iteraciones:** Utilizar `Thread.Sleep(1000)` para pausar $1$ segundo entre cada iteración, simulando el paso del tiempo.

-----

## 4\. Informe Final

El programa debe calcular y reportar las siguientes estadísticas (acumuladas a lo largo de toda la simulación de 60 segundos):

  * Número **total** de celdas que han ardido (transiciones Árbol $\rightarrow$ Ardiendo).
  * Número **total** de árboles que han nacido (transiciones Vacío $\rightarrow$ Árbol).
  * Número final de celdas vacías, árboles y ardiendo.
  * Listado de las coordenadas de las celdas que tienen un árbol al finalizar la interacción.


El informe final debe documentar las decisiones de diseño tomadas para la eficiencia del *Forest Fire Model*. En esta sección se destacará:

1.  **Eficiencia del Intercambio (Swap):**
    Se debe explicar por qué el *swap* de referencias entre el *frontBuffer* y el *backBuffer* es una operación de **tiempo constante, $O(1)$**, independientemente del tamaño del bosque.

2.  **Contraste con la Clonación:**
    Se debe comparar esta eficiencia con el costo de realizar una copia profunda de la matriz en cada paso, justificando por qué esa operación sería de **tiempo cuadrático, $O(n^2)$**, lo que resultaría ineficiente.

---
