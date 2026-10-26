# 05. Paso por referencia, ref, redimensionado e `in`

## Enunciado

Crea una demostración **conceptual** de cómo se pasan los arrays (vectores y matrices) a las funciones. El objetivo es ver con claridad la diferencia entre **tocar el contenido** (que afecta al original) y **reasignar la referencia** (que se pierde sin `ref`), además del uso de `ref`, del redimensionado y del modificador `in`. Cada concepto en su **propia función** (SRP).

1. **Contenido compartido**: la función modifica los elementos y el original cambia (el array es tipo de referencia).
2. **Reasignar sin `ref`**: la función apunta a otro array, pero el original **no** cambia (el parámetro es una copia del puntero).
3. **Reasignar con `ref`**: la función recibe una referencia al puntero del llamador, así que su reasignación **sí** llega fuera.
4. **Redimensionar un vector**: `Array.Resize(ref …)` crea un array nuevo, copia lo que cabe y reasigna con `ref`.
5. **Redimensionar una matriz**: no existe `Resize` para `[,]`, así que se crea la matriz nueva y se copia el solape a mano.
6. **`in` en un vector**: paso por referencia de **solo lectura**; la función lee los elementos pero no puede reasignar ni modificar.
7. **`in` en una matriz**: mismo principio de solo lectura sobre un array bidimensional.

## Conceptos Clave

- **Identidad vs. contenido**: un array es un **tipo de referencia**; el parámetro recibe una copia del puntero, no del array
- Cambiar `datos[i]` afecta al original (misma "caja"); reasignar `datos = new …` no (solo la copia local)
- **`ref`**: pasa una referencia al **puntero** del llamador; la reasignación de la función llega fuera
- **`Array.Resize(ref, n)`**: necesita `ref` porque crea un array nuevo y reasigna; al ampliar, lo nuevo vale `0`; al reducir, el sobrante se pierde
- **Redimensionar matrices a mano**: `new int[filas, columnas]` + copia del solape (`Math.Min`)
- **`in`** (2.4): paso por referencia pero **prohíbe modificar**; ideal para arrays grandes de solo lectura

## Solución

1. **`ModificarContenido()`**: recorre y duplica cada elemento; el original cambia porque comparten el mismo array.

2. **`ReasignarSinRef()` / `ReasignarConRef(ref …)`**: la primera apunta a otro array y el cambio se pierde; la segunda, con `ref`, reasigna el puntero del llamador.

3. **`Array.Resize(ref vector, n)`**: se amplía (las nuevas posiciones a `0`) y se reduce (el sobrante se pierde).

4. **`RedimensionarMatriz()`**: crea una matriz nueva y copia solo el solape con `Math.Min` en filas y columnas.

5. **`SumarContenido(in int[])` / `SumarMatriz(in int[,])`**: reciben el array con `in`; leen todo pero no pueden modificar (las líneas prohibidas quedan comentadas como referencia).

## Diagrama

```mermaid
flowchart TD
    A[Main: crear array] --> B{¿La función…}
    B -->|modifica datos i| C[El original CAMBIA<br/>mismo array en memoria]
    B -->|reasigna sin ref| D[El original NO cambIA<br/>copia local del puntero]
    B -->|reasigna con ref| E[El original SÍ cambIA<br/>ref al puntero de Main]
    B -->|recibe in| F[Solo LECTURA<br/>no modifica ni reasigna]
    C --> G[Salir]
    D --> G
    E --> G
    F --> G
    style A fill:#4CAF50,color:#fff
    style B fill:#FF9800,color:#fff
    style C fill:#2196F3,color:#fff
    style D fill:#f44336,color:#fff
    style E fill:#4CAF50,color:#fff
    style F fill:#9C27B0,color:#fff
    style G fill:#607D8B,color:#fff
```

```mermaid
flowchart LR
    subgraph Paso["Paso de un array"]
        P1["Main: vector"] --> P2["Copia del PUNTERO"]
        P2 --> P3["Mismo array<br/>(el contenido se comparte)"]
    end
    subgraph Resize["Array.Resize"]
        R1["Array viejo"] --> R2["Array nuevo + copia"]
        R2 --> R3["ref reasigna<br/>el puntero de Main"]
    end
    style P1 fill:#607D8B,color:#fff
    style P2 fill:#FF9800,color:#fff
    style P3 fill:#2196F3,color:#fff
    style R1 fill:#607D8B,color:#fff
    style R2 fill:#9C27B0,color:#fff
    style R3 fill:#4CAF50,color:#fff
```

> 💡 **Consejo:** Dibuja en papel la "caja" del array y el "puntero" que apunta a ella. Cuando la función toca la caja, se ve en Main; cuando mueve su puntero (sin `ref`), Main sigue apuntando a la de antes.
