# Batería de Ejercicios: Arrays Multidimensionales y Doble Búfer en C# 14

**Instrucciones:** Para cada ejercicio, implementa el código en C# usando Top-Level Statements. Puedes usar C# scripting (`dotnet run ejercicio.cs`) o crear un proyecto. Recuerda: **primero el diseño en papel, luego la codificación**.

---

### Bloque I: Fundamentos y Análisis (Ejercicios 1-8)

**Ejercicio 1: Ficha de un Tablero de Videojuego**
Implementa un programa que declare una matriz rectangular `int[4,5]` representando un inventario (4 categorías × 5 objetos). Rellénala con datos, muéstrala formateada y calcula el total de cada categoría (fila) y de cada objeto (columna).

**Ejercicio 2: Análisis de una Matriz**
Implementa un programa con una matriz `int[3,4]` que realice: imprimir la matriz, calcular el máximo, el mínimo, la media de todos los elementos, y buscar si un elemento existe.

**Ejercicio 3: Suma de Diagonales**
Implementa un programa que, dada una matriz cuadrada `int[N,N]`, calcule la **suma de las dos diagonales** principales. Muestra cada diagonal por separado.

**Ejercicio 4: Máximos por Fila**
Implementa un programa que lea una matriz de enteros y calcule el **valor máximo de cada fila**. Después, obtén la **media de esos máximos**.

**Ejercicio 5: Extracción de Sumas a Vectores**
Implementa un programa que, dada una matriz `int[N,N]`, calcule la **suma de cada fila** y la **suma de cada columna**, guardando los resultados en dos vectores separados.

**Ejercicio 6: Análisis de Paridad**
Implementa un programa que, dada una matriz de enteros, calcule: suma y media de números pares, suma y media de impares, suma y media de números en posiciones pares, y suma y media en posiciones impares.

**Ejercicio 7: Buscar Elemento en Matriz**
Implementa una función que busque un elemento en una matriz y devuelva sus coordenadas `(fila, columna)`. Si no existe, devuelve `(-1, -1)`.

**Ejercicio 8: Contar Elementos por Frecuencia**
Implementa un programa que, dada una matriz, cuente cuántas veces aparece cada número distinto y muestre un ranking de frecuencia.

---

### Bloque II: Transformaciones y Lógica (Ejercicios 9-14)

**Ejercicio 9: Transposición de Matriz**
Implementa una función para **transponer** una matriz (intercambiar filas por columnas) guardando el resultado en una matriz auxiliar. Muestra la original y la transpuesta.

**Ejercicio 10: Transposición In Situ**
Implementa la transposición **sin matriz auxiliar** (sobre la misma matriz). Esto requiere un manejo cuidadoso de los índices: solo funciona en matrices cuadradas.

**Ejercicio 11: Rotación 90º a la Derecha**
Implementa una función que, dada una matriz cuadrada `int[N,N]`, la **gire 90 grados en el sentido de las agujas del reloj** y guarde el resultado en una matriz auxiliar.

**Ejercicio 12: Comprobación de Simetría**
Implementa un programa que compruebe si una matriz cuadrada es **simétrica** (`matriz[i,j] == matriz[j,i]` para todo i, j).

**Ejercicio 13: Permutación de Filas**
Implementa un programa que permita al usuario permutar dos filas de una matriz. **Generaliza** para que también se puedan permutar dos columnas.

**Ejercicio 14: Multiplicación de Matrices**
Implementa la **multiplicación** de dos matrices cuadradas `int[3,3]`. Recuerda: `C[i,j] = Σ A[i,k] × B[k,j]`.

---

### Bloque III: Juegos de Tablero (Ejercicios 15-20)

**Ejercicio 15: Buscaminas (Matriz)**
Implementa el Buscaminas con una matriz `int[8,8]`. El ordenador coloca 10 minas aleatoriamente y genera las pistas (cada casilla sin mina indica cuántas minas hay en sus 8 adyacentes).

**Ejercicio 16: Ajedrez — Movimientos de Piezas**
Implementa un tablero de ajedrez `char[8,8]`. Pide al usuario posición y pieza (Torre, Alfil, Dama o Caballo). Muestra en el tablero los movimientos posibles de esa pieza desde esa posición.

**Ejercicio 17: Barquitos Clásico (Matriz)**
Implementa el juego de barquitos para dos jugadores. Cada jugador tiene **dos paneles**: uno para su flota y otro para las tiradas del rival. Los barcos no pueden estar adyacentes.

**Ejercicio 18: Las Parejas (Matriz)**
Generaliza el juego de las parejas para una matriz `int[4,6]` (24 casillas = 12 parejas). Coloca las parejas aleatoriamente y deja al jugador destapar de 2 en 2.

**Ejercicio 19: ¿Dónde está la Mosca? (Matriz)**
Implementa la versión generalizada del juego de la mosca para una matriz `int[N,M]` con `K` moscas. Si golpeas una casilla adyacente a una mosca, esta "revolotea" a otra posición.

**Ejercicio 20: Sudoku — Verificador**
Implementa un programa que verifique si una matriz `int[9,9]` es un Sudoku válido: cada fila, cada columna y cada subcuadrante 3×3 contiene los números del 1 al 9 sin repetirse.

---

### Bloque IV: Simulación con Doble Búfer (Ejercicios 21-25)

**Ejercicio 21: Simulación de Onda (Piedra en el Lago — Versión A)**
Simula el lanzamiento de una piedra a un lago (matriz). La ola se **expande en todas las direcciones** (horizontales, verticales y diagonales). La simulación se detiene cuando el lago vuelve a estar en calma (todo a cero).

**Ejercicio 22: Simulación de Onda (Piedra en el Lago — Versión B)**
Versión alternativa: la ola se genera en **circunvalaciones** concéntricas desde el punto de impacto. Usa Doble Búfer para garantizar consistencia.

**Ejercicio 23: Propagación de Fuego en un Bosque (Doble Búfer)**
Simula la propagación de un incendio en un bosque representado como una matriz. Cada celda puede estar: vacía (0), con árbol vivo (1), en llamas (2), o quemada (3). Implementa Doble Búfer con Swap de referencias.

**Ejercicio 24: Brote Viral — Z-Virus (Doble Búfer)**
Simula la propagación de un virus en una ciudad `int[20,20]`. Estados: Vacío (0), Humano sano (1), Infectado nuevo (2), Infectado viejo (3, muere en el siguiente ciclo). Implementa Doble Búfer y ejecuta 10 ciclos.

**Ejercicio 25: Pokémon — Expedición al Bosque de Viridian**
Simula un recorido por un bosque `int[15,15]` durante 20 ciclos. Estados: Pasto vacío (0), Pokémon raro nuevo (1), Pokémon raro viejo (10, huye), Pokémon común (2, huye), Trampa (-1). El entrenador se mueve y captura Pokémon con 70% de probabilidad.

---

### Bloque V: Álgebra Lineal y Análisis (Ejercicios 26-30)

**Ejercicio 26: Suma y Resta de Matrices**
Implementa un programa que, dadas dos matrices cuadradas de hasta `int[3,3]`, calcule su **suma** y su **resta**.

**Ejercicio 27: Matriz Identidad**
Implementa una función que genere una **matriz identidad** de tamaño N×N (1s en la diagonal principal, 0s en el resto).

**Ejercicio 28: Determinante de una Matriz 2×2 y 3×3**
Implementa una función que calcule el **determinante** de una matriz cuadrada. Para 2×2: `ad - bc`. Para 3×3, usa la fórmula de Sarrus o cofactores.

**Ejercicio 29: Espejo Horizontal y Vertical**
Implementa un programa que, dada una matriz, genere su **espejo horizontal** (invierte las filas) y su **espejo vertical** (invierte las columnas).

**Ejercicio 30: Mapa de Calor**
Implementa un programa que, dada una matriz de enteros, la muestre como un **mapa de calor** usando caracteres: `·` para valores bajos, `o` para medios, `X` para altos, `█` para máximos (relativos al rango de la matriz).
