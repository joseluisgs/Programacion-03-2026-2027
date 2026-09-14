# Práctica: Compresión y Descompresión de Arrays

**Instrucciones:** Implementa dos funciones en C# para trabajar con arrays de números enteros (`int[]`). Recuerda: **primero el diseño en papel, luego la codificación**.

---

## 1. Compresión (Run-Length Encoding)

La función `Comprimir(array)` recibe un array de números y devuelve otro array donde las secuencias de números iguales se reemplazan por **pares** de valores:

- El **número de veces** que se repite el valor.
- El **valor** que se repite.

### Ejemplos de compresión

**Array sin repeticiones:**

```
Entrada:    0, 1, 2, 3, 4, 5
Comprimido: 1,0, 1,1, 1,2, 1,3, 1,4, 1,5
```

**Array con repeticiones:**

```
Entrada:    7, 7, 7, 8, 8
Comprimido: 3,7, 2,8
```

**Array con un solo elemento:**

```
Entrada:    10
Comprimido: 1,10
```

**Array con 255 elementos iguales:**

```
Entrada:    5,5,5,... (255 veces)
Comprimido: 255,5
```

## 2. Descompresión

La función `Descomprimir(array)` recibe un array previamente comprimido y devuelve el **array original**, restaurando todos los valores.

### Ejemplos de descompresión

**Comprimido sin repeticiones:**

```
Comprimido:    1,0, 1,1, 1,2, 1,3, 1,4, 1,5
Descomprimido: 0, 1, 2, 3, 4, 5
```

**Comprimido con repeticiones:**

```
Comprimido:    3,7, 2,8
Descomprimido: 7, 7, 7, 8, 8
```

**Comprimido con un solo elemento:**

```
Comprimido:    1,10
Descomprimido: 10
```

## 3. Requisitos de Implementación

- Ambas funciones deben ser **genéricas**: funcionan con cualquier `int[]`.
- La función `Comprimir` debe manejar arrays vacíos (devuelve array vacío).
- La función `Descomprimir` debe validar que el array comprimido tenga un número par de elementos.
- Incluye un programa de prueba que muestre los ejemplos anteriores y verifique que `Descomprimir(Comprimir(array))` devuelve el array original.
