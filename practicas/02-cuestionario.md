### **Cuestionario de Investigación y Desarrollo: Almacenamiento Estático y Cadenas en C#**

**Instrucciones:** Lee cada pregunta con atención y proporciona una respuesta detallada, justificando tus afirmaciones con los conceptos aprendidos.

---

**1. Indexación Basada en Cero y Cálculo de Memoria**
Justifica desde el punto de vista del cálculo de direcciones de memoria por qué la Indexación Basada en Cero es la convención más eficiente para los arrays en C#. ¿Qué representa el índice 0 en la fórmula matemática `Dirección(A[i]) = Dirección Base + (i × Tamaño del Tipo)`? Compara con la Basada en Uno y explica por qué C#, Java, Python y C++ usan la Basada en Cero.

**2. Contigüidad y Localidad de Referencia**
Explica cómo la propiedad de contigüidad en memoria de los arrays garantiza que el acceso a cualquier elemento sea en tiempo constante. ¿Qué es la "localidad de referencia" y por qué el procesador carga datos cercanos en caché? Incluye un ejemplo práctico de cuándo un acceso secuencial es más rápido que uno aleatorio.

**3. Inmutabilidad del Tamaño y Gestión de Memoria**
Dado que el tamaño de un array es inmutable en C#, justifica por qué la solución para aumentar o reducir su tamaño es crear un array nuevo y copiar los datos. Explica la justificación técnica en términos de la gestión de memoria contigua. ¿Qué alternativa dinámica verás en la UD07?

**4. Tipos de Referencia y Clonación Profunda**
Los arrays son tipos de referencia en C#. Diseña un escenario donde pasar un array a una función sin clonar provoque un bug inesperado. Explica la diferencia entre copia por referencia, copia superficial y copia profunda, indicando cuándo es necesaria cada una.

**5. Doble Búfer y Consistencia de Datos**
En simulaciones de propagación de estado (como un juego de la vida o propagación de fuego), ¿por qué es esencial utilizar la técnica de Doble Búfer en lugar de leer y escribir sobre la misma matriz simultáneamente? Justifica con un ejemplo concreto qué pasaría sin Doble Búfer y explica la eficiencia del Swap de referencias.

**6. Inmutabilidad de Strings y Rendimiento**
Explica el concepto de inmutabilidad de las cadenas de texto en C#. ¿Qué implicación de rendimiento tiene usar el operador `+` repetidamente dentro de un bucle? Compara la complejidad de `+` con `StringBuilder.Append()` y justifica por qué StringBuilder es la solución correcta.

**7. Expresiones Regulares: Anclaje y Seguridad**
Al validar un formato de datos (como un DNI o un teléfono) usando `.IsMatch()`, ¿por qué es fundamental anclar el patrón usando `^` y `$`? Muestra un ejemplo concreto de un patrón que valide incorrectamente si no se ancla, y explica el riesgo que esto supone en una aplicación real.

**8. Comparativa de Algoritmos de Ordenación O(n²)**
Compara los algoritmos Burbuja, Selección e Inserción en términos de: número de intercambios, mejor caso, estabilidad y casos de uso recomendados. Si el coste de intercambiar elementos en memoria fuera excepcionalmente alto, ¿cuál de los tres sería preferible y por qué?

**9. Búsqueda Binaria: Coste Inicial vs. Búsqueda Lineal**
La Búsqueda Binaria ofrece O(log n) pero requiere un array ordenado. Discuta la siguiente situación: necesitas buscar repetidamente 1000 elementos en un array de 10.000 elementos inicialmente desordenado. ¿Es más eficiente aplicar Búsqueda Lineal siempre (1000 × O(n)) o pagar el coste de ordenar (O(n log n)) y luego aplicar Búsqueda Binaria (1000 × O(log n))? Justifica con números concretos.

**10. Notación Big O y Decisiones de Diseño**
Un compañero de equipo afirma que "un algoritmo O(n²) siempre es peor que uno O(n log n)". ¿Es esta afirmación siempre cierra? Presenta un escenario donde un algoritmo O(n²) sea preferible a uno O(n log n) (piensa en arrays pequeños, coste de memoria, o simplicidad del código). Justifica tu respuesta usando la notación Big O.
