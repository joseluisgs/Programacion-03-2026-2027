using System.Text;

// ============================================================
// 36. Paso por referencia, contenido, ref, redimensionado e in
//
// Demostración CONCEPTUAL de cómo se pasan los arrays (vectores
// y matrices) a las funciones. Se ve la diferencia entre tocar el
// CONTENIDO (afecta al original) y REASIGNAR la referencia (se
// pierde sin ref), el uso de ref, cómo redimensionar y el
// modificador in (solo lectura).
//
// Conceptos UD03 que repasa:
//   - Array = tipo de referencia: el contenido se comparte — 2.3
//   - Sin ref: reasignar el parámetro NO cambia el original — 2.3
//   - Con ref: la función reasigna el array del llamador — 2.3
//   - Array.Resize(ref ...) para vectores — 2.6
//   - Redimensionar matrices a mano (crear y copiar) — 2.6
//   - in: la variable es de solo lectura (CS8331) — 2.3.6
// ============================================================


// Main Program

Console.OutputEncoding = Encoding.UTF8;

Console.WriteLine("🔬 Demostración: paso de arrays a funciones\n");

DemostrarContenidoSeComparte();
DemostrarReasignacionSinRef();
DemostrarReasignacionConRef();
DemostrarRedimensionarVector();
DemostrarRedimensionarMatriz();
DemostrarInVector();
DemostrarInMatriz();

Console.WriteLine("\n✅ Demostración completada. ¡Hasta luego!");

// End Main Program

// ------------------------------------------------------------
// 1. CONTENIDO: el array es tipo de referencia, así que el
//    contenido se COMPARTE. Cambiar un elemento dentro de la
//    función cambia también el original (misma "caja" en memoria).
// ------------------------------------------------------------
void DemostrarContenidoSeComparte() {
    Console.WriteLine("=== 1. El contenido se comparte (tipo de referencia) ===");

    var vector = new int[] { 10, 20, 30 };
    Console.WriteLine($"   Antes    : {VectorATexto(vector)}");

    ModificarContenido(vector); // toca los elementos del MISMO array

    Console.WriteLine($"   Después  : {VectorATexto(vector)}");
    Console.WriteLine("   → El original CAMBIÓ: la función y Main comparten el mismo array.\n");
}

// Duplica el valor de cada elemento. Modifica el array original porque
// recibe la REFERENCIA a la misma "caja" de memoria (no una copia).
void ModificarContenido(int[] datos) {
    for (var i = 0; i < datos.Length; i++)
        datos[i] *= 2;
}

// ------------------------------------------------------------
// 2. REASIGNAR sin ref: si la función solo REASIGNA su parámetro
//    (apunta a otro array), el original NO cambia. El parámetro
//    es una COPIA de la referencia.
// ------------------------------------------------------------
void DemostrarReasignacionSinRef() {
    Console.WriteLine("=== 2. Reasignar sin ref: el original NO cambia ===");

    var vector = new int[] { 1, 2, 3 };
    Console.WriteLine($"   Antes    : {VectorATexto(vector)}");

    ReasignarSinRef(vector); // dentro apunta a otro array

    Console.WriteLine($"   Después  : {VectorATexto(vector)}");
    Console.WriteLine("   → El original NO cambió: solo se movió la copia local del puntero.\n");
}

// Apunta el parámetro a un array NUEVO. Como el parámetro es una copia
// de la referencia, el puntero del llamador sigue apuntando al viejo.
void ReasignarSinRef(int[] datos) {
    datos = new int[] { 999, 888, 777 }; // se pierde al salir de la función
}

// ------------------------------------------------------------
// 3. REASIGNAR con ref: la función recibe una REFERENCIA al
//    puntero del llamador, así que su reasignación SÍ llega fuera.
// ------------------------------------------------------------
void DemostrarReasignacionConRef() {
    Console.WriteLine("=== 3. Reasignar con ref: el original SÍ cambia ===");

    var vector = new int[] { 1, 2, 3 };
    Console.WriteLine($"   Antes    : {VectorATexto(vector)}");

    ReasignarConRef(ref vector); // ref: la función mueve el puntero original

    Console.WriteLine($"   Después  : {VectorATexto(vector)}");
    Console.WriteLine("   → El original CAMBIÓ: ref deja que la función reasigne el array de Main.\n");
}

// Recibe el puntero por referencia (ref) y lo reasigna a un array nuevo.
// El llamador ve el cambio porque no es una copia, sino el mismo puntero.
void ReasignarConRef(ref int[] datos) {
    datos = new int[] { 999, 888, 777 };
}

// ------------------------------------------------------------
// 4. REDIMENSIONAR un vector: .Length es de solo lectura, así que
//    se crea un array nuevo. Array.Resize hace ese trabajo, pero
//    necesita ref porque reasigna el puntero del llamador.
// ------------------------------------------------------------
void DemostrarRedimensionarVector() {
    Console.WriteLine("=== 4. Redimensionar un vector (Array.Resize con ref) ===");

    var vector = new int[] { 10, 20, 30, 40 };
    Console.WriteLine($"   Original ({vector.Length}): {VectorATexto(vector)}");

    // Ampliar: crea array de 6, copia los 4 viejos y los nuevos quedan en 0
    Array.Resize(ref vector, 6);
    vector[4] = 50;
    vector[5] = 60;
    Console.WriteLine($"   Ampliado ({vector.Length}): {VectorATexto(vector)}");

    // Reducir: crea array de 2 y copia solo los 2 primeros; el resto se pierde
    Array.Resize(ref vector, 2);
    Console.WriteLine($"   Reducido ({vector.Length}): {VectorATexto(vector)}");
    Console.WriteLine("   → Resize crea un array nuevo, copia lo que cabe y reasigna con ref.\n");
}

// ------------------------------------------------------------
// 5. REDIMENSIONAR una matriz: no hay Resize para [,], así que se
//    hace a mano: se crea la matriz nueva y se copia lo que cabe.
// ------------------------------------------------------------
void DemostrarRedimensionarMatriz() {
    Console.WriteLine("=== 5. Redimensionar una matriz (a mano) ===");

    var matriz = new int[,] { { 1, 2, 3 }, { 4, 5, 6 } };
    Console.WriteLine($"   Original ({matriz.GetLength(0)}x{matriz.GetLength(1)}):");
    ImprimirMatriz(matriz);

    var ampliada = RedimensionarMatriz(matriz, 3, 4); // 2x3 → 3x4
    Console.WriteLine($"   Ampliada ({ampliada.GetLength(0)}x{ampliada.GetLength(1)}):");
    ImprimirMatriz(ampliada);

    Console.WriteLine("   → Se crea la matriz nueva y se copia el solape; el resto queda en 0.\n");
}

// Devuelve una matriz NUEVA de filas x columnas copiando el solape con la
// original. Las posiciones fuera del solape quedan a 0 (valor por defecto).
int[,] RedimensionarMatriz(int[,] datos, int filas, int columnas) {
    var resultado = new int[filas, columnas];

    // Copiar solo el solape (lo que sobre en filas o columnas no se copia)
    var filasCopiar = Math.Min(datos.GetLength(0), filas);
    var columnasCopiar = Math.Min(datos.GetLength(1), columnas);

    for (var i = 0; i < filasCopiar; i++)
        for (var j = 0; j < columnasCopiar; j++)
            resultado[i, j] = datos[i, j];

    return resultado; // el llamador decide si reasignar
}

// ------------------------------------------------------------
// 6. MODIFICADOR in en un vector: pasa la dirección con la
//    variable de SOLO LECTURA. La función puede leer los
//    elementos, pero no puede reasignar la variable (CS8331).
//    Ojo: in protege la VARIABLE, no el contenido.
// ------------------------------------------------------------
void DemostrarInVector() {
    Console.WriteLine("=== 6. Modificador in en un vector (variable de solo lectura) ===");

    var vector = new int[] { 5, 15, 25, 35 };
    Console.WriteLine($"   Vector   : {VectorATexto(vector)}");
    Console.WriteLine($"   Suma (in): {SumarContenido(in vector)}");
    Console.WriteLine("   → in prohíbe REASIGNAR (CS8331): ideal para arrays grandes de solo lectura.\n");
}

// Recibe el vector con in: la variable es de solo lectura, así que
// no se puede reasignar el puntero. Si lo intentas, el compilador
// protesta con CS8331. Los elementos NO quedan protegidos: escribir
// datos[0] compilaría (por eso hay que cumplir la promesa de lectura).
int SumarContenido(in int[] datos) {
    var suma = 0;

    for (var i = 0; i < datos.Length; i++)
        suma += datos[i]; // leer SÍ está permitido

    // datos = new int[0];   // ❌ ERROR CS8331: no se puede reasignar un parámetro in
    // datos[0] = 100;       // ⚠️ compila y CAMBIA el array: in no protege los elementos

    return suma;
}

// ------------------------------------------------------------
// 7. MODIFICADOR in en una matriz: misma variable de solo
//    lectura, aquí sobre un array bidimensional.
// ------------------------------------------------------------
void DemostrarInMatriz() {
    Console.WriteLine("=== 7. Modificador in en una matriz (variable de solo lectura) ===");

    var matriz = new int[,] { { 1, 2, 3 }, { 4, 5, 6 } };
    Console.WriteLine("   Matriz:");
    ImprimirMatriz(matriz);
    Console.WriteLine($"   Suma (in): {SumarMatriz(in matriz)}");
    Console.WriteLine("   → en matrices la misma regla: la variable es de solo lectura (CS8331).\n");
}

// Suma todos los elementos de la matriz recibida con in (variable de solo lectura).
int SumarMatriz(in int[,] datos) {
    var suma = 0;

    for (var i = 0; i < datos.GetLength(0); i++)
        for (var j = 0; j < datos.GetLength(1); j++)
            suma += datos[i, j];

    return suma;
}

// ------------------------------------------------------------
// Auxiliares de presentación
// ------------------------------------------------------------

// Convierte un vector en texto legible: [10, 20, 30].
string VectorATexto(int[] datos) => "[" + string.Join(", ", datos) + "]";

// Imprime una matriz con etiquetas de fila (F0..) y columna (C0..).
void ImprimirMatriz(int[,] datos) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);

    Console.Write("        "); // deja sitio para la etiqueta de fila
    for (var j = 0; j < columnas; j++)
        Console.Write($"{"C" + j,5}");
    Console.WriteLine();

    for (var i = 0; i < filas; i++) {
        Console.Write($"   F{i}   ");
        for (var j = 0; j < columnas; j++)
            Console.Write($"{datos[i, j],5}");
        Console.WriteLine();
    }
}
