# 08. Boleto de Lotería

## Enunciado
Crea un programa que genere un boleto de lotería con **6 números únicos aleatorios** entre 1 y 49. Los números no deben repetirse y deben mostrados ordenados de menor a mayor (o en el orden de generación, según preferencia).

## Conceptos Clave
- `int[]` — array de enteros para almacenar los números
- `Random.Next(min, max)` — genera un número aleatorio en el rango [min, max)
- Bucle `do-while` — repetir hasta generar un número no repetido
- `Array.Contains()` — comprobar si un valor ya existe en el array
- `string.Join(", ", array)` — formatear el array como texto legible

## Solución

1. Se crea un array `int[6]` para el cartón.
2. Se recorre el array con un `for` (de 0 a 5).
3. Para cada posición, se genera un número aleatorio con `Random.Next(1, 50)` dentro de un `do-while`.
4. El `do-while` comprueba con `Array.Contains()` si el número ya está en el array. Si está, se genera otro.
5. Se asigna el número único a la posición actual.
6. Se muestra el cartón con `string.Join()`.
