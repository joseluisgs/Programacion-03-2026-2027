using System.Text;

// ============================================================
//
// Ejercicio INTEGRADOR de arrays 1D (resumen del punto): recorrer
// el vector en ascendente y descendente, buscar máximo y mínimo,
// calcular la media, sumar los elementos, buscar un elemento,
// comprobar si es capicúa, invertirlo, clonarlo, comparar dos
// vectores, sumar posiciones pares/impares y rotar el vector —
// cada operación en SU PROPIA función (SRP).
//
// Conceptos UD03 que repasa:
//   - int[] y recorrido con for — 2.2
//   - .Length y acceso por índice — 2.2
//   - Búsqueda lineal (devuelve índice o -1) — 2.8
//   - Capicúa e invertir: extremos hacia el centro (dos punteros) — 2.2
//   - Copia profunda con clonación manual — 2.3.7
//   - Identidad (==) vs. igualdad de contenido en arrays — 2.3
//   - Posiciones pares/impares con el operador % — 2.2
//   - Rotación: recorrido desplazado con módulo — 2.2
//   - Paso por valor de un array a funciones — 2.3
// ============================================================

// Constantes
const int TamDefault = 20; // número de lecturas del sensor
const int LecturaMin = 10; // lectura mínima simulada
const int LecturaMax = 99; // lectura máxima simulada


// Main Program

Console.OutputEncoding = Encoding.UTF8;

Console.WriteLine("📡 Analizador de lecturas de sensores");
Console.WriteLine($"Generando {TamDefault} lecturas aleatorias entre {LecturaMin} y {LecturaMax}...");

// Un solo Random para todo el programa
var rnd = new Random();

// Generar el array de lecturas y mostrarlo tal cual
var lecturas = GenerarLecturas(TamDefault, LecturaMin, LecturaMax);
Console.WriteLine("\n--- Lecturas iniciales ---");
MostrarAscendente(lecturas);

// Bucle principal con menú hasta que el usuario salga
var salir = false;

do {
    var opcion = LeerOpcionMenu();

    switch (opcion) {
        case 1:
            MostrarAscendente(lecturas);
            break;

        case 2:
            MostrarDescendente(lecturas);
            break;

        case 3:
            var indiceMax = BuscarIndiceMaximo(lecturas);
            Console.WriteLine($"📈 Máximo: {lecturas[indiceMax]} (posición {indiceMax})");
            break;

        case 4:
            var indiceMin = BuscarIndiceMinimo(lecturas);
            Console.WriteLine($"📉 Mínimo: {lecturas[indiceMin]} (posición {indiceMin})");
            break;

        case 5:
            Console.WriteLine($"📊 Media: {CalcularMedia(lecturas):F2}");
            break;

        case 6:
            Console.WriteLine($"🧮 Suma de los {lecturas.Length} elementos: {SumarElementos(lecturas)}");
            break;

        case 7:
            BuscarElementoInteractivo(lecturas);
            break;

        case 8:
            GenerarInforme(lecturas);
            break;

        case 9:
            DemostrarCapicua(lecturas);
            break;

        case 10:
            DemostrarInversion(lecturas);
            break;

        case 11:
            DemostrarCopiasYComparacion(lecturas);
            break;

        case 12:
            MostrarSumasParesImpares(lecturas);
            break;

        case 13:
            lecturas = DemostrarRotacion(lecturas);
            break;

        case 0:
            salir = true;
            break;

        default:
            Console.WriteLine("❌ Opción no válida.");
            break;
    }
} while (!salir);

Console.WriteLine("\n👋 Analizador apagado. ¡Hasta luego!");
return;

// End Main Program

// Genera un array de "lecturas" con valores aleatorios en [min..max].
int[] GenerarLecturas(int cantidad, int min, int max) {
    var datos = new int[cantidad];

    // Next(min, max) es exclusivo en el máximo: se suma 1 para incluirlo
    for (var i = 0; i < datos.Length; i++)
        datos[i] = rnd.Next(min, max + 1);

    return datos;
}

// Muestra el vector recorriéndolo en ORDEN ASCENDENTE de índice (0 → Length-1).
void MostrarAscendente(int[] datos) {
    Console.WriteLine("➡️  Ascendente (de la primera a la última posición):");
    Console.Write("   ");

    for (var i = 0; i < datos.Length; i++)
        Console.Write($"[{i}]={datos[i],3}  ");

    // Foreach
    //foreach (var dato in datos)
    //Console.Write($"[{Array.IndexOf(datos, dato)}]={dato,3}  ");


    Console.WriteLine();
}

// Muestra el vector recorriéndolo en ORDEN DESCENDENTE (Length-1 → 0).
void MostrarDescendente(int[] datos) {
    Console.WriteLine("⬅️  Descendente (de la última a la primera posición):");
    Console.Write("   ");

    // El bucle arranca en el último índice y va restando hasta 0
    for (var i = datos.Length - 1; i >= 0; i--)
        Console.Write($"[{i}]={datos[i],3}  ");

    Console.WriteLine();
}

// Devuelve el ÍNDICE donde está el valor máximo (bucle con guarda).
int BuscarIndiceMaximo(int[] datos) {
    var indiceMax = 0; // suponemos que el mayor está en el 0

    for (var i = 1; i < datos.Length; i++)
        if (datos[i] > datos[indiceMax])
            indiceMax = i;

    return indiceMax;
}

int BuscarMaximoElemento(int[] datos) {
    var maximo = datos[0]; // suponemos que el mayor está en el 0
    // El máximo si puedo sacarlo con un foreach porque lo recorro 
    // ascendentemente
    foreach (var dato in datos)
        if (dato > maximo)
            maximo = dato;

    return maximo;
}

// Devuelve el ÍNDICE donde está el valor mínimo (bucle con guarda).
int BuscarIndiceMinimo(int[] datos) {
    var indiceMin = 0; // suponemos que el menor está en el 0

    for (var i = 1; i < datos.Length; i++)
        if (datos[i] < datos[indiceMin])
            indiceMin = i;
    
    
    // Y haciéndolo con for, con comentarios
    /*for(var i =0; i<datos.Length; i++)
        if(datos[i]>minimo)
            minimo = datos[i];*/

    return indiceMin;
}

int BuscarMinimoElemento(int[] datos) {
    var minimo = datos[0]; // suponemos que el menor está en el 0
    // El mínimo si puedo sacarlo con un foreach porque lo recorro 
    // ascendentemente
    foreach (var dato in datos)
        if (dato < minimo)
            minimo = dato;
    
    // Y haciéndolo con for, con comentarios
    /*for(var i =0; i<datos.Length; i++)
        if(datos[i]<minimo)
            minimo = datos[i];*/

    return minimo;
}

// Calcula la MEDIA aritmética acumulando la suma en un acumulador.
double CalcularMedia(int[] datos) {
    var suma = 0;

    foreach (var dato in datos)
        suma += dato;

    return (double)suma / datos.Length;
}

// Suma TODOS los elementos del vector (acumulador).
int SumarElementos(int[] datos) {
    var suma = 0;
    
    foreach (var dato in datos)
        suma += dato;

    return suma;
}

// Búsqueda LINEAL: devuelve el primer ÍNDICE donde está el objetivo, o -1 si no existe.
int BuscarElemento(int[] datos, int objetivo) {
    for (var i = 0; i < datos.Length; i++)
        if (datos[i] == objetivo)
            return i; // ¡encontrado!

    return -1; // recorrimos todo y no estaba
}

// Pide un valor a buscar y muestra el resultado de la búsqueda lineal.
void BuscarElementoInteractivo(int[] datos) {
    var objetivo = LeerEntero("🔍 Valor a buscar: ");
    var indice = BuscarElemento(datos, objetivo);

    if (indice == -1)
        Console.WriteLine($"   El valor {objetivo} NO está en el vector.");
    else
        Console.WriteLine($"   ¡Encontrado! El valor {objetivo} está en la posición {indice}.");
}

// Genera el INFORME completo llamando a todas las funciones de análisis.
void GenerarInforme(int[] datos) {
    var indiceMax = BuscarIndiceMaximo(datos);
    var indiceMin = BuscarIndiceMinimo(datos);

    Console.WriteLine("\n========== 📋 INFORME DE LECTURAS ==========");
    Console.WriteLine($"Total de lecturas : {datos.Length}");
    Console.WriteLine($"Suma              : {SumarElementos(datos)}");
    Console.WriteLine($"Media             : {CalcularMedia(datos):F2}");
    Console.WriteLine($"Máximo            : {datos[indiceMax]} (posición {indiceMax})");
    Console.WriteLine($"Mínimo            : {datos[indiceMin]} (posición {indiceMin})");

    // Máximo y mínimo también con foreach (devuelven el VALOR, no el índice)
    Console.WriteLine($"Máximo (foreach)  : {BuscarMaximoElemento(datos)}");
    Console.WriteLine($"Mínimo (foreach)  : {BuscarMinimoElemento(datos)}");

    // Dato extra: cuántas lecturas superan la media (aplicando CalcularMedia)
    var media = CalcularMedia(datos);
    var sobreMedia = ContarMayoresQue(datos, media);
    Console.WriteLine($"Sobre la media    : {sobreMedia} de {datos.Length} lecturas");
    Console.WriteLine("=============================================\n");
}

// Cuenta cuántos elementos superan un umbral dado (filtro con contador).
int ContarMayoresQue(int[] datos, double umbral) {
    var contador = 0;

    for (var i = 0; i < datos.Length; i++)
        if (datos[i] > umbral)
            contador++;

    return contador;
}

// Comprueba si el vector es CAPICÚA: se lee igual de izquierda a derecha
// que de derecha a izquierda. Compara los extremos hacia el centro con
// dos índices que convergen; basta un desajuste para descartar.
bool EsCapicua(int[] datos) {
    var izquierda = 0; // puntero al inicio
    var derecha = datos.Length - 1; // puntero al final

    while (izquierda < derecha) {
        if (datos[izquierda] != datos[derecha])
            return false; // los extremos no coinciden: ya no puede ser capicúa

        izquierda++; // avanza el puntero izquierdo
        derecha--; // avanza el puntero derecho
    }
    
    
    // con un for seria
    for(var i = 0; i<datos.Length/2; i++)
        if(datos[i] != datos[datos.Length-1-i])
            return false; // los extremos no coinciden: ya no puede ser capicúa

    return true; // todos los pares simétricos coincidían
}

// Demuestra el capicúa con el vector real y con un vector de prueba sí capicúa.
void DemostrarCapicua(int[] datos) {
    Console.WriteLine("🔄 ¿Es capicúa? (se compara cada extremo hacia el centro)");

    Console.WriteLine("Vector real (lecturas aleatorias):");
    ImprimirLinea(datos);
    if (EsCapicua(datos))
        Console.WriteLine("   → SÍ es capicúa: se lee igual en ambos sentidos.");
    else
        Console.WriteLine("   → NO es capicúa: los extremos no coinciden.");

    // Vector de prueba sí capicúa: la segunda mitad es el reflejo de la primera
    var prueba = new[] { 12, 40, 7, 99, 7, 40, 12 };

    Console.WriteLine("\nVector de prueba (reflejado):");
    ImprimirLinea(prueba);
    if (EsCapicua(prueba))
        Console.WriteLine("   → SÍ es capicúa: se lee igual en ambos sentidos.");
    else
        Console.WriteLine("   → NO es capicúa: los extremos no coinciden.");
}

// Invierte el vector INTERCAMBIANDO los extremos hacia el centro, sin
// array auxiliar. Modifica el vector original (tipo de referencia: el
// cambio se ve en quien lo llamó, sin necesidad de ref).
void InvertirVector(int[] datos) {
    var izquierda = 0; // puntero al inicio
    var derecha = datos.Length - 1; // puntero al final

    while (izquierda < derecha) {
        // Intercambio de los dos extremos con una variable auxiliar
        var aux = datos[izquierda];
        datos[izquierda] = datos[derecha];
        datos[derecha] = aux;

        izquierda++; // los punteros convergen hacia el centro
        derecha--;
    }
}

// Demuestra la inversión mostrando el vector antes y después.
// ATENCIÓN: el vector original queda invertido (se modifica el original).
void DemostrarInversion(int[] datos) {
    Console.WriteLine("🔁 Invertir vector (extremos hacia el centro, sin auxiliar):");
    Console.WriteLine("Antes:");
    ImprimirLinea(datos);

    InvertirVector(datos); // esta llamada modifica datos "en el origen"

    Console.WriteLine("Después (el original queda invertido):");
    ImprimirLinea(datos);
}

// Devuelve una COPIA PROFUNDA del vector: un array nuevo e independiente
// que comparte ningún estado con el original (cada posición se copia a mano).
int[] ClonarVector(int[] datos) {
    var copia = new int[datos.Length]; // array nuevo con la misma longitud

    for (var i = 0; i < datos.Length; i++)
        copia[i] = datos[i]; // copia el valor de cada posición

    return copia; // el llamador decide qué hacer con la copia
}

// Compara dos vectores por CONTENIDO: mismo tamaño y mismo valor en cada
// posición. OJO: es distinto del == de arrays, que compara REFERENCIAS.
bool VectoresIguales(int[] a, int[] b) {
    if (a.Length != b.Length)
        return false; // tamaños distintos: ni hace falta recorrer

    for (var i = 0; i < a.Length; i++)
        if (a[i] != b[i])
            return false; // un solo valor distinto ya descarta

    return true; // todo el contenido coincide
}

// Demuestra clonar (copia profunda) y comparar por contenido, y deja
// claro la diferencia entre IDENTIDAD (==) e IGUALDAD de contenido.
void DemostrarCopiasYComparacion(int[] datos) {
    Console.WriteLine("📋 Copia y comparación de vectores:");

    Console.WriteLine("Original:");
    ImprimirLinea(datos);

    // 1) Clonar: se crea un array NUEVO con los mismos elementos
    var copia = ClonarVector(datos);
    Console.WriteLine("Copia (ClonarVector):");
    ImprimirLinea(copia);

    // 2) Comparar por contenido: mismo contenido → true, aunque sean arrays distintos
    if (VectoresIguales(datos, copia))
        Console.WriteLine("✅ VectoresIguales(original, copia) → SÍ (mismo contenido).");
    else
        Console.WriteLine("❌ VectoresIguales(original, copia) → NO.");

    // 3) El == de los arrays compara REFERENCIAS (misma dirección de memoria)
    if (datos == copia)
        Console.WriteLine("🔗 original == copia → SÍ (misma referencia).");
    else
        Console.WriteLine("🔗 original == copia → NO (son dos arrays distintos en memoria).");

    // 4) Modifico la copia: el original NO debe enterarse (es copia profunda)
    copia[0] = 999;
    Console.WriteLine("Tras poner copia[0] = 999, la copia:");
    ImprimirLinea(copia);
    Console.WriteLine("El original sigue intacto:");
    ImprimirLinea(datos);

    if (VectoresIguales(datos, copia))
        Console.WriteLine("   ✅ El contenido sigue coincidiendo.");
    else
        Console.WriteLine("   ❌ Ya NO coinciden: la copia era independiente del original.");
}

// Suma los elementos en posiciones PARES del vector (índice 0, 2, 4...).
// El operador % (módulo) da el resto de la división: i % 2 == 0 es par.
int SumarPosicionesPares(int[] datos) {
    var suma = 0;

    for (var i = 0; i < datos.Length; i += 2) // se avanza de 2 en 2
        suma += datos[i];

    return suma;
}

// Suma los elementos en posiciones IMPARES del vector (índice 1, 3, 5...).
int SumarPosicionesImpares(int[] datos) {
    var suma = 0;

    // Se arranca en 1 (la primera posición impar) y se avanza de 2 en 2
    for (var i = 1; i < datos.Length; i += 2)
        suma += datos[i];

    return suma;
}

// Muestra ambas sumas (pares e impares) y su total de control.
void MostrarSumasParesImpares(int[] datos) {
    var pares = SumarPosicionesPares(datos);
    var impares = SumarPosicionesImpares(datos);

    Console.WriteLine("🔢 Suma por paridad de posición:");
    Console.WriteLine($"   Posiciones PARES  (0, 2, 4...): {pares}");
    Console.WriteLine($"   Posiciones IMPARES (1, 3, 5...): {impares}");
    Console.WriteLine($"   Control (suma total)           : {pares + impares}");
}

// Rota el vector N posiciones a la IZQUIERDA y devuelve un vector NUEVO.
// Cada elemento pasa a la posición (i - desplazamiento + Length) % Length;
// el módulo hace que el índice "vuelva a empezar" al salir por el final.
// Devuelve un array nuevo: el original NO se modifica.
int[] RotarVector(int[] datos, int desplazamiento) {
    var n = datos.Length;

    // Normalizar el desplazamiento para que valga menos que n (evita vueltas de más)
    var k = (desplazamiento % n + n) % n;

    var resultado = new int[n];

    for (var i = 0; i < n; i++) {
        // El elemento de la posición i se recoloca en (i - k), girando con módulo
        var destino = (i - k + n) % n;
        resultado[destino] = datos[i];
    }

    return resultado; // el llamador decide si reasignar (aquí, sí)
}

// Demuestra la rotación con el vector real, pidiendo el desplazamiento.
// Devuelve el vector YA ROTADO para que el menú pueda reasignarlo
// (lección: las funciones devuelven el resultado y el Main lo guarda).
int[] DemostrarRotacion(int[] datos) {
    var desplazamiento = LeerEntero("⟳ Posiciones a rotar a la izquierda: ");

    Console.WriteLine("Antes:");
    ImprimirLinea(datos);

    var rotado = RotarVector(datos, desplazamiento);

    Console.WriteLine($"Después de rotar {desplazamiento} a la izquierda:");
    ImprimirLinea(rotado);

    // Aviso didáctico: RotarVector NO toca el original; hay que reasignarlo
    Console.WriteLine("   (el original sigue intacto; hay que hacer: vector = RotarVector(...))");

    return rotado; // el Main hará: lecturas = DemostrarRotacion(lecturas)
}

// Imprime los elementos del vector en una sola línea, separados por comas.
void ImprimirLinea(int[] datos) {
    Console.Write("   [");

    for (var i = 0; i < datos.Length; i++) {
        Console.Write(datos[i]);
        if (i < datos.Length - 1)
            Console.Write(", ");
    }

    Console.WriteLine("]");
}

// Lee y valida una opción del menú (entero entre 0 y 13).
int LeerOpcionMenu() {
    var valido = false;
    var opcion = -1;

    do {
        Console.WriteLine("--- MENÚ ---");
        Console.WriteLine("1. Mostrar ascendente");
        Console.WriteLine("2. Mostrar descendente");
        Console.WriteLine("3. Buscar máximo");
        Console.WriteLine("4. Buscar mínimo");
        Console.WriteLine("5. Calcular media");
        Console.WriteLine("6. Sumar elementos");
        Console.WriteLine("7. Buscar un elemento");
        Console.WriteLine("8. Informe completo");
        Console.WriteLine("9. Comprobar capicúa");
        Console.WriteLine("10. Invertir vector");
        Console.WriteLine("11. Clonar y comparar vectores");
        Console.WriteLine("12. Suma posiciones pares/impares");
        Console.WriteLine("13. Rotar vector");
        Console.WriteLine("0. Salir");
        Console.Write("Elige opción: ");

        var entrada = (Console.ReadLine() ?? "").Trim();

        if (int.TryParse(entrada, out var valor) && valor >= 0 && valor <= 13) {
            opcion = valor;
            valido = true;
        }
        else {
            Console.WriteLine("❌ Entrada no válida. Debes escribir un número del 0 al 13.");
        }
    } while (!valido);

    return opcion;
}

// Lee y valida un entero introducido por el usuario (reutilizable).
static int LeerEntero(string mensaje) {
    var valido = false;
    var numero = 0;

    do {
        Console.Write(mensaje);
        var entrada = (Console.ReadLine() ?? "").Trim();

        if (int.TryParse(entrada, out var valor)) {
            numero = valor;
            valido = true;
        }
        else {
            Console.WriteLine("❌ No es un número entero válido.");
        }
    } while (!valido);

    return numero;
}