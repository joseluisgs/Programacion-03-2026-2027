# Batería de Ejercicios: Arrays Unidimensionales en C# 14

**Instrucciones:** Para cada ejercicio, implementa el código en C# usando Top-Level Statements. Puedes usar C# scripting (`dotnet run ejercicio.cs`) o crear un proyecto. Recuerda: **primero el diseño en papel, luego la codificación**.

---

### Bloque I: Fundamentos y Análisis (Ejercicios 1-8)

**Ejercicio 1: Ficha de Tu Playlist**
Implementa un programa que declare un array de 5 canciones favoritas (`string[]`). Muestra la lista numerada, luego pide al usuario una posición y muestra qué canción hay en esa posición. Incluye manejo de `IndexOutOfRangeException`.

**Ejercicio 2: Estadísticas de un Equipo de Fútbol**
Implementa un programa con un array de 11 enteros (goles de cada jugador en la temporada). Calcula y muestra: el máximo goleador, el mínimo, la media de goles y cuántos jugadores superan la media.

**Ejercicio 3: Invertir un Array**
Implementa un programa que declare un array de 10 números enteros y lo **invierta** sin usar un array auxiliar (intercambia elementos desde los extremos hacia el centro). Muestra el array original y el invertido.

**Ejercicio 4: Capicúa**
Implementa un programa que determine si un array de 5 enteros es **capicúa** (se lee igual de izquierda a derecha que de derecha a izquierda). Ejemplo: `[1, 2, 3, 2, 1]` → sí es capicúa.

**Ejercicio 5: Búsqueda Lineal**
Implementa una función que reciba un array de enteros y un valor objetivo. Devuelve el índice donde se encuentra el valor, o `-1` si no existe. Prueba con al menos 3 casos.

**Ejercicio 6: Búsqueda Binaria**
Implementa la búsqueda binaria sobre un array **ordenado** de 1000 elementos. La búsqueda binaria funciona descartando la mitad del rango en cada paso, algo así como "adivinar un número del 1 al 1000 preguntando si es mayor o menor". Compara cuántas comparaciones hace la búsqueda binaria frente a la búsqueda lineal con el mismo array.

**Ejercicio 7: Ordenación por Burbuja**
Implementa el algoritmo de ordenación por burbuja sobre un array de 10 números. Muestra el array en cada pasada para visualizar cómo los elementos "burbujean" hacia su posición.

**Ejercicio 8: Ordenación por Selección**
Implementa el algoritmo de selección sobre un array de 10 números. En cada paso, muestra el array y el mínimo que se intercambia.

---

### Bloque II: Manipulación y Lógica (Ejercicios 9-16)

**Ejercicio 9: Suma y Media de Posiciones Pares/Impares**
Implementa un programa que calcule la suma y media de los elementos en posiciones pares y la suma y media de los elementos en posiciones impares de un array.

**Ejercicio 10: Eliminar Duplicados**
Implementa una función que reciba un array y devuelva un **nuevo array** sin elementos duplicados (manteniendo el orden de aparición).

**Ejercicio 11: Rotación a la Derecha**
Implementa un programa que **rote** todos los elementos de un array una posición a la derecha (el último pasa a ser el primero). Ejemplo: `[1, 2, 3, 4]` → `[4, 1, 2, 3]`.

**Ejercicio 12: Generación de Secuencia**
Implementa un programa que pida un valor entero, lo coloque en la primera posición de un array de 10 elementos y genere el resto. La regla es: cada posición se calcula sumando el valor anterior con la posición que ocupa. Por ejemplo, si introduces `2`, la secuencia sería: `[2, 3, 5, 8, 12, 17, 23, 30, 38, 47]`. Observa cómo crece cada elemento.

**Ejercicio 13: Mezclar Dos Arrays**
Implementa una función que reciba dos arrays de la misma longitud y cree un tercero **intercalando** sus elementos. Ejemplo: `[1, 3, 5]` + `[2, 4, 6]` → `[1, 2, 3, 4, 5, 6]`.

**Ejercicio 14: Combinación de la Primitiva**
Implementa un programa que genere 6 números aleatorios del 1 al 49 **sin repetir**, simulando una combinación de la primitiva. Ordena los números de menor a mayor.

**Ejercicio 15: Racha Máxima de Éxitos**
Implementa un programa que, dado un array de 0s y 1s (1 = éxito, 0 = fallo), encuentre la **longitud de la racha máxima** de 1s consecutivos. Ejemplo: `[0, 1, 1, 1, 0, 1, 1]` → racha máxima = 3.

**Ejercicio 16: Intercalar Tareas Prioritarias y Secundarias**
Implementa un programa que reciba dos arrays: tareas prioritarias (`string[]`) y secundarias (`string[]`). Crea un tercero intercalando **2 prioritarias por 1 secundaria**. Si se acaban las de un tipo, continúan las del otro. Ejemplo: `["A","B","C"]` + `["X","Y"]` → `["A","B","X","C","Y"]`.

---

### Bloque III: Paso por Referencia y Clonación (Ejercicios 17-22)

**Ejercicio 17: Paso por Referencia vs. Copia**
Implementa un programa que demuestre la diferencia entre pasar un array **sin modificador** (se modifica el original) y pasar con **`ref`** (se puede reasignar el array completo).

**Ejercicio 18: Clonación Profunda de un Array**
Implementa una función que reciba un array de enteros y devuelva un **nuevo array** completamente independiente (copia profunda). Demuestra que modificar la copia no afecta al original.

**Ejercicio 19: Almacenamiento Elástico (Acordeón)**
Implementa un programa con un menú interactivo que permita **añadir** y **borrar** elementos de un array. Si la ocupación supera el 90%, expande el array un 50%. Si cae por debajo del 25%, reduce a la mitad.

**Ejercicio 20: Comparar Arrays con `==` y Clonación**
Implementa un programa que compare dos arrays: uno asignado con `=` (misma referencia) y otro clonado con copia profunda. Muestra qué devuelve `==` en cada caso y por qué.

**Ejercicio 21: Presupuesto con Paso por Referencia**
Implementa un programa que demuestre los peligros del paso por referencia: pasa un array de presupuesto a una función que modifica el último elemento. Compara el resultado con una copia profunda.

**Ejercicio 22: Historial de Errores con Nulos**
Implementa un programa con un array `string?[]` donde `null` = sin inspeccionar, `""` = rechazado, y cualquier otro texto = válido. Cuenta cuántos hay de cada tipo y muestra un informe. Ejemplo de salida:

```
=== Informe de Errores ===
Total de entradas: 8
Válidos: 3
Rechazados: 2
Sin inspeccionar: 3
```

---

### Bloque IV: Juegos y Simulación (Ejercicios 23-27)

**Ejercicio 23: ¿Dónde está la Mosca?**
Implementa el juego de la mosca con un array de 20 casillas (índices 0-19). La mosca está oculta en una posición aleatoria. El jugador introduce una posición y el programa responde: "¡Tocada!" si acierta, "¡Casi! La mosca revolotea" si está en una casilla adyacente (la casilla ±1), o "Agua" si está lejos. Cuando la mosca revolotea, se mueve a una posición adyacente aleatoria. Ejemplo de partida:

```
=== ¿Dónde está la mosca? (0-19) ===
Tu tiro: 5 → Agua
Tu tiro: 10 → ¡Casi! La mosca revolotea
Tu tiro: 11 → ¡Tocada! Has dado en la mosca en 3 intentos
```

**Ejercicio 24: El Buscaminas (Versión Vector)**
Implementa el Buscaminas con un vector de 20 casillas. El ordenador coloca 6 minas aleatoriamente y genera las pistas: cada casilla sin mina muestra cuántas minas hay en las casillas adyacentes (izquierda y derecha). La primera y última casilla solo tienen un vecino. Ejemplo:

```
Posiciones:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
Minas:       .  M  .  .  M  .  .  M  .  .  .  M  .  .  M  .  .  M  .  .
Pistas:      1  *  2  2  *  3  2  *  2  1  2  *  3  2  *  3  2  *  1  0
```

**Ejercicio 25: El Número de Pivote**
Genera un array de 20 números aleatorios. Pide al usuario una posición de pivote. El programa calcula la suma de todos los elementos a la izquierda del pivote, la suma de los de la derecha, y cuenta cuántos son mayores y cuántos menores que el valor del pivote. Ejemplo:

```
Array: [3, 8, 1, 5, 9, 2, 7, 4, 6, 1, 8, 3, 5, 2, 9, 7, 4, 1, 6, 8]
Pivote: posición 5 (valor 2)
Izquierda: [3, 8, 1, 5, 9] → Suma: 26, Mayores que 2: 4, Menores que 2: 0
Derecha:   [7, 4, 6, 1, 8, 3, 5, 2, 9, 7, 4, 1, 6, 8] → Suma: 65, Mayores: 10, Menores: 0
```

**Ejercicio 26: Juego de las Parejas (Vector)**
Implementa el juego de las parejas con un vector de 12 casillas (6 parejas de números del 1 al 6). El ordenador coloca los números aleatoriamente y oculta el panel. El jugador destapa de 2 en 2 casillas buscando coincidencias. Si acierta, esas casillas permanecen destapadas. El juego termina cuando se encuentran todas las parejas. Ejemplo de una jugada:

```
Panel oculto: [?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?]
Tu tiro 1: casilla 3 →_sale el 4
Tu tiro 2: casilla 7 →_sale el 2  → No coinciden, se vuelven a ocultar
Tu tiro 1: casilla 3 →_sale el 4
Tu tiro 2: casilla 11 →_sale el 4 → ¡Pareja! Quedan destapadas
```

**Ejercicio 27: Simulación de Onda (Piedra en el Río)**
Simula el lanzamiento de una piedra a un río (vector de 15 posiciones inicializadas a 0). El usuario elige la posición de impacto y la intensidad (un valor entero). La intensidad se almacena en esa casilla y en cada paso la onda se propaga: cada casilla adyacente recibe la mitad de la intensidad de su vecina (redondeando hacia abajo). La onda se propaga hasta que todas las casillas vuelven a 0. Ejemplo:

```
Lanzamiento en posición 7 con intensidad 16:

Paso 0: [0, 0, 0, 0, 0, 0, 0,16, 0, 0, 0, 0, 0, 0, 0]
Paso 1: [0, 0, 0, 0, 0, 0, 8,16, 8, 0, 0, 0, 0, 0, 0]
Paso 2: [0, 0, 0, 0, 0, 4, 8,16, 8, 4, 0, 0, 0, 0, 0]
Paso 3: [0, 0, 0, 0, 2, 4, 8,16, 8, 4, 2, 0, 0, 0, 0]
...
Paso 6: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
Paso 7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

---

### Bloque V: Rendimiento y Análisis (Ejercicios 28-30)

**Ejercicio 28: Comparar Rendimiento de Búsquedas**
Implementa un programa que genere un array de 10.000 números ordenados. Realiza una búsqueda lineal y una binaria del mismo elemento. Muestra cuántas comparaciones hace cada una.

**Ejercicio 29: Comparar Rendimiento de Ordenación**
Implementa burbuja, selección e inserción en el mismo array de 100 elementos. Mide y compara el tiempo de ejecución de cada algoritmo con `Stopwatch`.

**Ejercicio 30: Campeonato de Tiro al Blanco**
Simula un campeonato entre dos jugadores. Cada jugador tiene un vector de puntuaciones por ronda. Calcula la puntuación total, el ganador, y la ronda con mayor diferencia de puntuación.
