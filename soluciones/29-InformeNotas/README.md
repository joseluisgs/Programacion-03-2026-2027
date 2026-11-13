# 29. Informe de notas de la clase

## Enunciado

Desarrolla un informe de notas para una clase de **30 alumnos**, con notas aleatorias de `0.0` a `10.0` (un decimal). El programa debe calcular la estadística, dibujar un histograma, **ordenar** las notas con **burbuja** y localizar una nota con **búsqueda binaria** sobre el array ya ordenado. Cada operación en su propia función (SRP).

1. **Estadística**: máximo, mínimo, media y nº de aprobados (≥ 5).
2. **Histograma**: 4 tramos (0-4.9, 5-6.9, 7-8.9, 9-10) con una barra de texto proporcional.
3. **Ordenación por burbuja**: modifica el array original de menor a mayor.
4. **Búsqueda binaria**: localiza una nota aleatoria del array sobre el ordenado (con tolerancia, por ser `double`).

## Conceptos Clave

- `double[]` para notas con decimales
- Generar decimales "exactos": entero aleatorio `0-100` dividido entre `10.0`
- **Burbuja**: comparar vecinos e intercambiar; `n-1` pasadas + optimización del banderín
- **Búsqueda binaria**: `izquierda`, `derecha`, `medio`; descarta la mitad en cada paso
- La binaria **exige orden previo** — por eso se ordena antes de buscar
- Comparar `double` con **tolerancia** (`Math.Abs(a - b) <= Tolerancia`) en vez de `==`
- Histograma con contadores por tramos

## Solución

1. **Generación**: `GenerarNotas()` rellena `double[30]` con un decimal aleatorio.

2. **Estadística**: `CalcularMaximo()`, `CalcularMinimo()`, `CalcularMedia()` y `ContarAprobados()` — bucles con guarda o acumulador.

3. **Histograma**: `MostrarHistograma()` cuenta los 4 tramos con `if / else if` y `ImprimirBarra()` dibuja una fila de `█` (uno por alumno).

4. **Ordenar y buscar**:
   - `OrdenarPorBurbuja()` modifica el array original (paso por referencia implícita) usando intercambio de vecinos, con banderín de optimización.
   - `BuscarBinaria()` trabaja sobre el array ordenado: calcula el `medio`, compara con tolerancia y descarta mitades hasta encontrar o agotar el rango.

## Diagrama

```mermaid
flowchart TD
    A[Generar 30 notas] --> B[Estadística: máx, mín, media, aprobados]
    B --> C[Histograma por tramos]
    C --> D[Ordenar con burbuja]
    D --> E[Buscar nota con binaria]
    E --> F[Fin]

    style A fill:#4CAF50,color:#fff
    style C fill:#FF9800,color:#fff
    style D fill:#2196F3,color:#fff
    style E fill:#9C27B0,color:#fff
    style F fill:#f44336,color:#fff
```

```mermaid
flowchart TD
    subgraph Burbuja["Burbuja: una pasada"]
        P0["[7, 3, 9, 1]"] --> P1["compara 7>3 → swap"]
        P1 --> P2["[3, 7, 9, 1]"]
        P2 --> P3["compara 7<9 → no swap"]
        P3 --> P4["compara 9>1 → swap"]
        P4 --> P5["[3, 7, 1, 9]<br/>el 9 queda al final"]
    end
    style P0 fill:#607D8B,color:#fff
    style P5 fill:#4CAF50,color:#fff
```

```mermaid
flowchart TD
    subgraph Binaria["Binaria: descarta mitades"]
        B0["rango 0..9<br/>objetivo 8.3"] --> B1["medio=4 → nota 5.1<br/>5.1 < 8.3 → mitad derecha"]
        B1 --> B2["rango 5..9<br/>medio=7 → nota 8.3<br/>¡encontrado en 7!"]
    end
    style B0 fill:#607D8B,color:#fff
    style B2 fill:#4CAF50,color:#fff
```
