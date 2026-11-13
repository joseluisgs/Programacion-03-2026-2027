# 23. Cifrado César con Alfabeto Extendido

## Enunciado
Implementa el cifrado César clásico pero con un **alfabeto extendido** que incluya:

- Espacio, letras (incluida la Ñ), números y símbolos de puntuación
- Tildes y caracteres especiales (á, é, í, ó, ú, ñ, ç, etc.)

El programa genera un desplazamiento aleatorio, cifra un mensaje, luego lo descifra aplicando el desplazamiento negativo. Los caracteres que no estén en el alfabeto se mantienen sin modificar.

## Conceptos Clave
- `StringBuilder` — construcción eficiente de la cadena cifrada/descifrada
- `string.IndexOf()` — posición de un carácter en el alfabeto
- Aritmética modular `%` — envolver el desplazamiento alrededor del alfabeto
- `foreach` sobre `string` — iterar carácter a carácter
- `Random.Next(1, length)` — desplazamiento aleatorio
- Desplazamiento negativo → descifrado (revertir la operación)

## Solución

### Algoritmo de cifrado `CifrarCesar(mensaje, desplazamiento)`
1. Se define el alfabeto completo como `string` (espacio, a-z, A-Z, Ñ, números, símbolos).
2. Se calcula `desplazamientoEfectivo = desplazamiento % alfabeto.Length` para reducir desplazamientos grandes.
3. Para cada carácter del mensaje:
   - Se busca su posición con `IndexOf()`.
   - Si no está en el alfabeto (`posicion == -1`), se añade tal cual.
   - Si está, se calcula `nuevaPosicion = posicion + desplazamientoEfectivo`.
   - Se aplica módulo para envolver: si es negativo, se suma la longitud del alfabeto; si es positivo, `% alfabeto.Length`.
4. Se devuelve el `StringBuilder` como string.

### Cifrado ↔ Descifrado
- Cifrar con `+desplazamiento`.
- Descifrar con `-desplazamiento` (misma función, desplazamiento negativo).

## Diagrama

```mermaid
flowchart LR
    subgraph Alfabeto["Alfabeto: ' abcdefghijklmnñopqrstuvwxyz...'"]
        A0["0: ' '"] --> A1["1: 'a'"]
        A1 --> A2["2: 'b'"]
        A2 --> A3["..."]
        A3 --> An["n: ñ"]
    end

    subgraph Cifrado["Ejemplo: desplazamiento = 3"]
        C1["'a' (pos 1) → pos 4 → 'd'"]
        C2["'ñ' (pos 15) → pos 18 → 'p'"]
    end

    style Alfabeto fill:#2196F3,color:#fff
    style Cifrado fill:#4CAF50,color:#fff
```

```mermaid
flowchart TD
    A[Mensaje original] --> B[Por cada carácter]
    B --> C{¿Está en el alfabeto?}
    C -->|No| D[Añadir tal cual]
    C -->|Sí| E[Obtener posición]
    E --> F[nuevaPos = pos + desplazamiento]
    F --> G{¿nuevaPos < 0?}
    G -->|Sí| H[longitud + nuevaPos]
    G -->|No| I[nuevaPos % longitud]
    H --> J[Añadir carácter resultante]
    I --> J
    D --> J
    J --> K[Cadena cifrada]

    style A fill:#4CAF50,color:#fff
    style K fill:#f44336,color:#fff
```
