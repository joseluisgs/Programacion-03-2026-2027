# Batería de Ejercicios: Cadenas de Texto y Expresiones Regulares en C# 14

**Instrucciones:** Para cada ejercicio, implementa el código en C# usando Top-Level Statements. Puedes usar C# scripting (`dotnet run ejercicio.cs`) o crear un proyecto. Recuerda: **primero el diseño en papel, luego la codificación**.

---

### Bloque I: Fundamentos de Cadenas (Ejercicios 1-8)

**Ejercicio 1: Ficha de Perfil de TikTok**
Implementa un programa que pida al usuario nombre de usuario, biografía y correo. Muestra: longitud del nombre, si contiene arroba en la biografía, el nombre en mayúsculas y el correo en minúsculas.

**Ejercicio 2: Comparar y Ordenar Cadenas**
Implementa un programa que pida dos cadenas al usuario. Determine si son iguales, cuál es más larga y cuál va primero alfabéticamente.

**Ejercicio 3: Invertir una Cadena**
Implementa un programa que **invierta** el orden de una cadena. Ejemplo: `"Hola"` → `"aloH"`. Muestra el resultado.

**Ejercicio 4: Detector de Palíndromos**
Implementa un programa que determine si una palabra o frase es **palíndromo** (se lee igual al derecho y al revés). Ignora espacios y mayúsculas.

**Ejercicio 5: Contador de Vocales y Consonantes**
Implementa un programa que cuente cuántas vocales y cuántas consonantes hay en una cadena. Muestra ambos conteos.

**Ejercicio 6: Frecuencia de un Carácter**
Implementa un programa que pida una cadena y un carácter. Cuente cuántas veces aparece ese carácter en la cadena.

**Ejercicio 7: Primera Palabra, Última Palabra**
Implementa un programa que, dada una frase, muestre la **primera palabra** y la **última palabra** usando `.Split()`.

**Ejercicio 8: Normalizar Entrada de Usuario**
Implementa un programa que pida un nombre de usuario. Aplique `.Trim()` para quitar espacios, `.ToLower()` para minúsculas y muestre el resultado normalizado.

---

### Bloque II: Métodos de String (Ejercicios 9-16)

**Ejercicio 9: Palabra Más Larga**
Implementa un programa que, dada una frase, encuentre la **palabra de mayor longitud** usando `.Split()`.

**Ejercicio 10: Contador de Palabras**
Implementa un programa que cuente el **número de palabras** en un texto usando `.Split()` con espacio como delimitador.

**Ejercicio 11: Formato de Teléfono**
Implementa un programa que pida un número de teléfono sin formato (ej: `"612345678"`) y lo convierta a formato legible: `"(+34)-612-345-678"`.

**Ejercicio 12: Buscar y Reemplazar**
Implementa un programa que pida una cadena, un texto a buscar y un texto de reemplazo. Use `.Replace()` para hacer el cambio y muestre el resultado.

**Ejercicio 13: Extraer Subcadena**
Implementa un programa que pida una cadena, un índice de inicio y una longitud. Use `.Substring()` para extraer y mostrar la porción.

**Ejercicio 14: Interpolación de Cadenas**
Implementa un programa que pida nombre, edad y ciudad. Muestra 3 mensajes diferentes usando interpolación (`$"..."`), concatenación (`+`) y `.Format()`.

**Ejercicio 15: StringBuilder — Construir un Informe**
Implementa un programa que use `StringBuilder` para construir un informe de 1000 líneas. Compara el tiempo con `+` y justifica por qué `StringBuilder` es más rápido.

**Ejercicio 16: Cadena Palíndromo con StringBuilder**
Implementa el ejercicio del palíndromo pero usando `StringBuilder` para invertir la cadena eficientemente.

---

### Bloque III: Juegos con Cadenas (Ejercicios 17-22)

**Ejercicio 17: Juego del Ahorcado**
Implementa el juego del ahorcado: pide una palabra secreta y permite al jugador adivinar letras con un máximo de **7 intentos**. Muestra los aciertos y fallos.

**Ejercicio 18: Juego del Lingo**
Implementa el juego del Lingo: el jugador adivina palabras de 5 letras. El programa indica con un asterisco `*` si la letra está en posición correcta, con un `+` si está pero en posición incorrecta, y con un `-` si no existe en la palabra. Ejemplo con la palabra secreta "CASA":

```
Palabra secreta: CASA (oculta)
Tu intento 1: CERO → C* E- R- O-  (acierto en posición 1)
Tu intento 2: SOLA → S- O+ L- A*  (A acertada, O existe pero en otra posición)
Tu intento 3: CASA → C* A* S* A*  ¡Enhorabuena! Has acertado en 3 intentos
```

**Ejercicio 19: La Clave del César**
Implementa el algoritmo de cifrado "Clave del César": desplaza cada letra 3 posiciones en el alfabeto (Z → C). Los números se convierten: 9 → 0. Los espacios y符号其他字符 se mantienen sin cambios. Muestra el texto original y el cifrado. Ejemplo:

```
Texto original:  HOLA MUNDO 123
Texto cifrado:   KROD PXQGR 123

Texto original:  XYZ
Texto cifrado:   ABC
```

**Ejercicio 20: Generador de Contraseñas**
Implementa un programa que genere una contraseña aleatoria de 12 caracteres usando letras mayúsculas, minúsculas, números y símbolos. Muestra la contraseña generada y verifica que contenga al menos un carácter de cada tipo.

**Ejercicio 21: Codificador Morse**
Implementa un programa que convierta un texto a código Morse y viceversa. Usa un diccionario o arrays para la conversión. El código Morse usa puntos (`.`) y guiones (`-`) para cada letra, separados por espacios entre letras y `/` entre palabras. Ejemplo:

```
Texto: HOLA MUNDO
Morse: .... --- .-.. .- / -- ..- -. -.. ---

Morse: ... --- ...
Texto: SOS
```

**Ejercicio 22: Adivina la Palabra**
Implementa un juego donde el jugador debe adivinar una palabra letra a letra. El programa elige una palabra de una lista y muestra guiones bajos por cada letra. El jugador propone letras; si acierta, se revela la posición. Si falla, pierde un intento. Máximo 7 intentos. Ejemplo:

```
Palabra: _ _ _ _ _ (5 letras)
Intento 1: A → ¡Correcto! _ A _ _ _
Intento 2: E → ¡Correcto! _ A _ _ E
Intento 3: Z → Fallo (6 intentos restantes)
Intento 4: R → _ A _ R E
Intento 5: P → ¡Correcto! P A _ R E
Intento 6: L → ¡Enhorabuena! PALABRA (4 intentos restantes)
```

---

### Bloque IV: Expresiones Regulares (Ejercicios 23-27)

**Ejercicio 23: Validación Numérica**
Usa `Regex.IsMatch()` para comprobar que una cadena es un **número entero positivo** (solo dígitos, sin signo).

**Ejercicio 24: Validación de DNI**
Usa `Regex.IsMatch()` para validar el formato de DNI español: 8 dígitos + 1 letra mayúscula o minúscula. Ancla el patrón con `^` y `$`.

**Ejercicio 25: Validación de Correo Electrónico**
Desarrolla un patrón regex que verifique si una cadena tiene el formato básico de email: `local@dominio.ext`.

**Ejercicio 26: Extracción de Teléfonos**
Dada una cadena larga con varios números de teléfono, usa `Regex.Matches()` para encontrar y extraer todas las secuencias que coincidan con un patrón de teléfono (9 dígitos).

**Ejercicio 27: Extracción de Fechas y URLs**
Implementa un módulo que, dado un texto, use `Regex` para extraer todas las **fechas** en formato DD/MM/AAAA o todas las **URLs** que empiecen por `http://` o `https://`.

---

### Bloque V: Rendimiento y Análisis (Ejercicios 28-30)

**Ejercicio 28: Comparar Rendimiento: `+` vs `StringBuilder`**
Implementa un programa que construya una cadena de 10.000 caracteres usando `+` y luego usando `StringBuilder`. Mide el tiempo de cada uno con `Stopwatch` y muestra la diferencia.

**Ejercicio 29: Buscar la Subcadena Más Larga Común**
Implementa un programa que, dadas dos cadenas, encuentre la **subcadena más larga** que tengan en común.

**Ejercicio 30: Validación de Formatos con Regex**
Implementa un programa con un menú que valide: número de teléfono (9 dígitos), email, DNI, código postal (5 dígitos) y URL. Usa `Regex.IsMatch()` para cada validación.
