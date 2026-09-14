- [Práctica 1: Test de Conocimientos](#práctica-1-test-de-conocimientos)
  - [Bloque 1: Arrays — Introducción y Unidimensionales (Preguntas 1-12)](#bloque-1-arrays--introducción-y-unidimensionales-preguntas-1-12)
  - [Bloque 2: Arrays Multidimensionales y Doble Búfer (Preguntas 13-25)](#bloque-2-arrays-multidimensionales-y-doble-búfer-preguntas-13-25)
  - [Bloque 3: Cadenas de Texto (Preguntas 26-36)](#bloque-3-cadenas-de-texto-preguntas-26-36)
  - [Bloque 4: Expresiones Regulares (Preguntas 37-41)](#bloque-4-expresiones-regulares-preguntas-37-41)
  - [Bloque 5: Algoritmos de Ordenación y Búsqueda (Preguntas 42-50)](#bloque-5-algoritmos-de-ordenación-y-búsqueda-preguntas-42-50)


# Práctica 1: Test de Conocimientos

**Instrucciones:** Lee atentamente cada pregunta y selecciona la opción que consideres correcta.

---

### Bloque 1: Arrays — Introducción y Unidimensionales (Preguntas 1-12)

1.  **¿Cuál de las siguientes NO es una característica clave de los arrays en C#?**
    a) Contigüidad en memoria.
    b) Homogeneidad (todos los elementos del mismo tipo).
    c) Tamaño mutable después de la creación.
    d) Acceso a elementos en tiempo constante.

2.  **La Indexación Basada en Cero es el estándar en C#. ¿Qué representa el índice 0?**
    a) La posición ordinal (el primer elemento).
    b) La dirección base más el tamaño del tipo de dato.
    c) El desplazamiento cero desde la dirección de inicio del array.
    d) Una convención puramente matemática, como en Fortran.

3.  **Si se intenta acceder a una posición de un array que es negativa o igual/mayor a su tamaño, ¿qué excepción se genera?**
    a) `NullReferenceException`.
    b) `StackOverflowException`.
    c) `IndexOutOfRangeException`.
    d) `ArrayTypeMismatchException`.

4.  **Si un array de tipo `int[]` se crea solo con su tamaño (`new int[5]`), ¿cuál es el valor por defecto en cada posición?**
    a) `null`.
    b) `""` (cadena vacía).
    c) `0`.
    d) `-1`.

5.  **Un array de tipo `string[]` se inicializa, por defecto, con qué valor en todas sus posiciones?**
    a) `""` (cadena vacía).
    b) `false`.
    c) `0`.
    d) `null`.

6.  **La inmutabilidad del tamaño de los arrays implica que, si se necesita un tamaño diferente, ¿cuál es la única solución?**
    a) Usar la propiedad `.Resize()`.
    b) Crear un nuevo array y copiar los elementos existentes.
    c) Modificar el índice de la última posición.
    d) Convertir el array a un tipo `List`.

7.  **Para recorrer un array cuando se necesita modificar los elementos o conocer el índice de la posición actual, ¿qué bucle se recomienda?**
    a) `while`.
    b) `foreach`.
    c) `do-while`.
    d) `for`.

8.  **¿Por qué se considera que los arrays son tipos de referencia en C#?**
    a) Porque almacenan directamente los datos.
    b) Porque la variable almacena la dirección de memoria donde se encuentran los datos.
    c) Porque su tamaño es inmutable.
    d) Porque todos sus elementos deben ser del mismo tipo.

9.  **Cuando se pasa un array a una función sin modificador, se copia la dirección de memoria. Si se modifican los elementos dentro de la función, ¿qué efecto tiene sobre el array original?**
    a) El array original no se modifica porque se usa el paso por valor.
    b) El array original se modifica porque ambas variables apuntan al mismo sitio.
    c) Solo se modifica el tamaño del array original.
    d) Se produce un `IndexOutOfRangeException`.

10. **¿Qué se debe hacer para obtener un array completamente independiente de otro, rompiendo la referencia?**
    a) Aplicar una copia por referencia (`var arrayB = arrayA;`).
    b) Clonar manualmente el contenido elemento por elemento (copia profunda).
    c) Comparar ambos arrays con el operador `==`.
    d) Usar un bucle `foreach`.

11. **¿Qué compara el operador `==` cuando se utiliza para comparar dos variables que contienen arrays?**
    a) Si tienen el mismo contenido (igualdad).
    b) Si apuntan a la misma dirección de memoria (identidad).
    c) Si tienen la misma longitud.
    d) Si sus primeros elementos son iguales.

12. **¿Qué requisito fundamental debe cumplir un array para que se pueda aplicar Búsqueda Binaria?**
    a) Que no contenga elementos repetidos.
    b) Que sea un array escalonado.
    c) Que esté previamente ordenado.
    d) Que se haya calculado la media de sus elementos.

---

### Bloque 2: Arrays Multidimensionales y Doble Búfer (Preguntas 13-25)

13. **En un array bidimensional (matriz) en C#, ¿cuántos índices se necesitan para identificar un elemento?**
    a) Uno (la posición lineal).
    b) Dos (fila y columna).
    c) Tres (base, fila y columna).
    d) Uno (usando la propiedad `.Length`).

14. **¿Cuál es la principal diferencia entre un array rectangular y un array escalonado (jagged array)?**
    a) El rectangular tiene más filas.
    b) El escalonado permite que cada fila tenga una longitud diferente.
    c) El rectangular es más rápido.
    d) No hay diferencia.

15. **Las matrices en C# se almacenan en memoria usando el orden por filas (Row-Major Order). ¿Por qué es más eficiente iterar primero sobre el índice de la fila?**
    a) Porque garantiza que todas las filas tengan el mismo tamaño.
    b) Porque los datos de una fila están contiguos en la memoria caché del procesador.
    c) Porque la complejidad es constante.
    d) Porque el lenguaje lo obliga.

16. **¿Qué significa transponer una matriz?**
    a) Calcular su determinante.
    b) Intercambiar los elementos de la diagonal principal.
    c) Intercambiar las filas por las columnas.
    d) Girarla 90 grados en el sentido de las agujas del reloj.

17. **En una matriz cuadrada, ¿cuál es la condición para que sea simétrica?**
    a) Que todos los elementos de la diagonal sean iguales.
    b) Que `matriz[i,j] = matriz[j,i]` para todo i, j.
    c) Que la suma de sus elementos sea cero.
    d) Que el determinante sea positivo.

18. **¿Por qué se considera que una copia superficial de un array escalonado es peligrosa?**
    a) Porque el tamaño se vuelve mutable.
    b) Porque las referencias a las filas internas siguen siendo compartidas.
    c) Porque genera una `IndexOutOfRangeException`.
    d) Porque el Doble Búfer no funciona correctamente.

19. **¿Qué técnica es necesaria para lograr la clonación profunda de un array escalonado?**
    a) Clonar solo el array exterior.
    b) Clonar el array exterior y cada fila interna de forma manual.
    c) Usar el operador `==`.
    d) Declarar la matriz como un tipo anulable.

20. **¿Cuál es el propósito del Búfer de Escritura (Back Buffer) en la técnica de Doble Búfer?**
    a) La matriz que se está leyendo o mostrando en pantalla.
    b) La matriz donde se aplican todas las modificaciones de la siguiente iteración.
    c) El array que contiene los índices.
    d) El elemento pivote de la simulación.

21. **El Mecanismo de Intercambio (Swap) de referencias en el Doble Búfer es crucial por su eficiencia. ¿Cuál es su complejidad?**
    a) Cuadrática.
    b) Lineal.
    c) Logarítmica.
    d) Constante.

22. **¿Por qué el Doble Búfer es esencial en simulaciones de propagación de estado?**
    a) Porque reduce el uso de memoria a la mitad.
    b) Porque garantiza consistencia al leer de un búfer mientras se escribe en el otro.
    c) Porque ordena los datos automáticamente.
    d) Porque convierte matrices en vectores.

23. **¿Qué problema visual evita el Doble Búfer en aplicaciones gráficas?**
    a) El parpadeo de la pantalla (tearing).
    b) Los errores de compilación.
    c) La pérdida de datos.
    d) Los bucles infinitos.

24. **En C#, ¿cómo se accede a un elemento de una matriz rectangular?**
    a) `matriz[fila][columna]`.
    b) `matriz[fila, columna]`.
    c) `matriz(fila, columna)`.
    d) `matriz.fila.columna`.

25. **¿Cuál es la diferencia principal entre un array rectangular y uno escalonado en términos de memoria?**
    a) El rectangular usa menos memoria.
    b) El escalonado es siempre más eficiente en memoria porque cada fila ocupa solo lo necesario.
    c) El rectangular es más rápido de acceder.
    d) No hay diferencia en memoria.

---

### Bloque 3: Cadenas de Texto (Preguntas 26-36)

26. **¿Qué implica la inmutabilidad de las cadenas de texto en C#?**
    a) Que la cadena original se modifica en memoria.
    b) Que cualquier método que parezca modificar la cadena en realidad devuelve una nueva cadena.
    c) Que el operador `==` compara referencias.
    d) Que no se pueden concatenar cadenas.

27. **Aunque los strings son tipos de referencia, ¿por qué el operador `==` realiza una comparación de valor?**
    a) Porque el compilador lo prohíbe.
    b) Para simplificar la programación, permitiendo comparar si dos cadenas tienen el mismo contenido.
    c) Porque el acceso es constante.
    d) Para garantizar la inmutabilidad.

28. **¿Qué método se utiliza para contar la cantidad de caracteres que tiene una cadena?**
    a) `.Count()`.
    b) `.Length`.
    c) `.Size()`.
    d) `.Index()`.

29. **¿Qué hace el método `.Trim()` de una cadena?**
    a) Convierte la cadena a mayúsculas.
    b) Elimina los espacios en blanco del inicio y final.
    c) Extrae una subcadena.
    d) Reemplaza todas las vocales.

30. **Si se usa el operador `+` para concatenar repetitivamente una cadena dentro de un bucle, ¿por qué se degrada el rendimiento?**
    a) Porque el compilador lo optimiza.
    b) Porque en cada concatenación se crea una nueva cadena en memoria.
    c) Porque se utiliza la Indexación Basada en Uno.
    d) Porque el algoritmo es recursivo.

31. **¿Qué clase está diseñada específicamente para construir cadenas mutables de forma eficiente?**
    a) `StringBuilter`.
    b) `ArrayString`.
    c) `StringBuilder`.
    d) `TextBuilder`.

32. **¿Cuándo se utiliza el método `.ToString()` sobre una instancia de `StringBuilder`?**
    a) Solo al inicio del bucle.
    b) Cuando se desea agregar un nuevo valor.
    c) Solo al final, para convertir el contenido mutable en una cadena `string` inmutable.
    d) Siempre que se usa `.Append()`.

33. **¿Qué método de la clase `string` extrae una porción de la cadena a partir de un índice de inicio?**
    a) `.Replace()`.
    b) `.IndexOf()`.
    c) `.Substring()`.
    d) `.Extract()`.

34. **¿Qué operador se utiliza para interpolación de cadenas en C#?**
    a) `#`.
    b) `$`.
    c) `@`.
    d) `%`.

35. **¿Qué significa el prefijo `@` delante de un string en C#?**
    a) Que es una cadena de interpolación.
    b) Que es una cadena verbatim (literal, sin escape).
    c) Que es una cadena binaria.
    d) Que es una cadena de regex.

36. **¿Qué método de `string` devuelve la posición de la primera aparición de un substring?**
    a) `.Search()`.
    b) `.Find()`.
    c) `.IndexOf()`.
    d) `.Position()`.

---

### Bloque 4: Expresiones Regulares (Preguntas 37-41)

37. **¿Qué es una expresión regular (regex)?**
    a) Una función para concatenar strings de forma eficiente.
    b) Un patrón de búsqueda que describe un conjunto de cadenas de texto.
    c) Un algoritmo de ordenación.
    d) Una forma de convertir arrays a strings.

38. **En regex, ¿cuál es el término para los símbolos especiales como `\d` o `+`?**
    a) Constantes.
    b) Literales.
    c) Metacaracteres.
    d) Delimitadores.

39. **Si un patrón regex usa `\d+`, ¿qué significa?**
    a) Cero o más caracteres de palabra.
    b) Exactamente un dígito.
    c) Una o más veces un dígito.
    d) Un carácter cualquiera seguido de una palabra.

40. **Para validar un formato completo usando `.IsMatch()`, ¿qué metacaracteres se usan para anclar el patrón?**
    a) `.` y `*`.
    b) `(` y `)`.
    c) `^` (inicio) y `$` (fin).
    d) `\w` y `\s`.

41. **¿Qué método de la clase `Regex` devuelve un valor booleano indicando si el patrón coincide con la cadena?**
    a) `.Replace()`.
    b) `.IsMatch()`.
    c) `.Match()`.
    d) `.Matches()`.

---

### Bloque 5: Algoritmos de Ordenación y Búsqueda (Preguntas 42-50)

42. **¿Qué significado tiene que un algoritmo sea "estable"?**
    a) Que siempre tiene la misma complejidad.
    b) Que mantiene el orden original de los elementos que tienen el mismo valor.
    c) Que no necesita arrays auxiliares.
    d) Que funciona en tiempo constante.

43. **¿Cuál de los siguientes algoritmos de ordenación realiza el mínimo número de intercambios?**
    a) Burbuja.
    b) Inserción.
    c) Selección.
    d) QuickSort.

44. **¿Cuál es la complejidad del mejor caso del algoritmo de Inserción (con array casi ordenado)?**
    a) Cuadrática.
    b) Lineal.
    c) Logarítmica.
    d) Constante.

45. **El algoritmo QuickSort utiliza un elemento para reordenar el array. ¿Cómo se llama ese elemento?**
    a) La mediana.
    b) El pivote.
    c) El índice central.
    d) Un búfer auxiliar.

46. **¿Cuál es la complejidad promedio del QuickSort?**
    a) Cuadrática.
    b) Lineal.
    c) Lineal-logarítmica.
    d) Constante.

47. **¿Qué mejora aplica el Shell Sort al Insertion Sort?**
    a) Usa un elemento pivote.
    b) Compara elementos separados por un intervalo (gap) mayor a 1.
    c) Es un algoritmo estable.
    d) Es inherentemente recursivo.

48. **La Búsqueda Lineal tiene una complejidad peor caso de:**
    a) Logarítmica.
    b) Cuadrática.
    c) Lineal.
    d) Constante.

49. **¿Cuál es la precondición obligatoria para poder utilizar la Búsqueda Binaria?**
    a) Que la colección no sea recursiva.
    b) Que la colección esté previamente ordenada.
    c) Que la colección contenga solo tipos de referencia.
    d) Que el elemento clave sea un número entero.

50. **En la Búsqueda Binaria, si el dato buscado es menor que el elemento central, ¿en qué sub-espacio se continúa?**
    a) En la mitad derecha del vector.
    b) En la mitad izquierda del vector.
    c) En todo el vector, sin dividirlo.
    d) El algoritmo se detiene.
