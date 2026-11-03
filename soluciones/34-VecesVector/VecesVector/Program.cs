using System.Text;
using _34_VecesVector.Structs;

// ============================================================================
// Contar y ubicar un número en un vector (struct Veces)
//
// ENUNCIADO: dado un vector de enteros y un número, decir CUÁNTAS VECES
// aparece y EN QUÉ POSICIONES aparece. Las dos respuestas viajan juntas
// dentro del struct Veces: un entero (Conteo) y un array de tantas
// posiciones como el conteo (Posiciones).
//
// Conceptos UD03/UD01 que ilustra:
//   - int[] y recorrido completo con for — 2.2
//   - Struct como contenedor de VARIOS resultados a la vez (Veces) — 3.3
//   - DOS PASADAS sobre el mismo vector: primero contar, luego rellenar
//   - Reserva de array con el tamaño EXACTO (new int[conteo]) — 2.3
//   - Índice de ESCRITURA (k) separado del índice de LECTURA (i)
//   - Early Return cuando no hay nada que buscar — punto 4
//   - Paso de un array a funciones (el original nunca se modifica) — 2.3
//
// Ejecutar: dotnet run
// ============================================================================

Console.OutputEncoding = Encoding.UTF8;

// ------------------------------------------------------------
// CONSTANTES (nada de números sueltos por el código)
// ------------------------------------------------------------
const int TamanoVector = 20; // lecturas del sensor
const int ValorMin = 1;      // lectura mínima simulada
const int ValorMax = 9;      // lectura máxima simulada (pocas => se repiten)

// ------------------------------------------------------------
// PROGRAMA PRINCIPAL
// ------------------------------------------------------------
Console.WriteLine("📊 Analizador de repetidos en un vector");
Console.WriteLine($"Generando {TamanoVector} lecturas aleatorias entre {ValorMin} y {ValorMax}...");

var rnd = new Random();
var lecturas = GenerarLecturas(TamanoVector, ValorMin, ValorMax, rnd);

MostrarVector("Vector de lecturas", lecturas);

Console.WriteLine();
var objetivo = LeerEntero("🔎 ¿Qué número buscamos?: ");

// Una sola llamada devuelve TODO lo que sabemos sobre el objetivo
var resultado = ContarYUbicar(lecturas, objetivo);

MostrarResultado(objetivo, resultado, lecturas);

Console.WriteLine("\n🏁 Fin del análisis.");

// ------------------------------------------------------------
// FUNCIONES
// ------------------------------------------------------------

// GenerarLecturas: rellena el vector con valores aleatorios.
int[] GenerarLecturas(int tamano, int minimo, int maximo, Random rnd)
{
    var datos = new int[tamano];

    for (int i = 0; i < datos.Length; i++)
    {
        datos[i] = rnd.Next(minimo, maximo + 1); // el tope de Next es exclusivo
    }

    return datos;
}

// ContarYUbicar: el corazón del ejemplo. Devuelve un Veces con el CONTADOR
// y las POSICIONES. Se recorre el vector DOS VECES:
//
//   1ª PASADA — solo CONTAR. Así sabemos cuántos huecos reservar.
//   2ª PASADA — solo RELLENAR. El array ya tiene el tamaño exacto.
//
// ¿Por qué dos pasadas y no una? Porque en C# un array NO crece: no
// podemos ir añadiendo posiciones "sobre la marcha" sin reasignar el array
// dentro del bucle, lo que sería O(n²) y un gasto inútil de memoria.
// Primero medimos, después cortamos la tela del tamaño justo.
//
// Complejidad: O(n) en tiempo y O(m) en memoria, con m = nº de aciertos.
Veces ContarYUbicar(int[] datos, int objetivo)
{
    // ---- 1ª PASADA: ¿cuántas veces aparece? ----
    int conteo = 0;

    for (int i = 0; i < datos.Length; i++)
    {
        if (datos[i] == objetivo)
        {
            conteo++;
        }
    }

    // Early Return: si no aparece ni una vez, no hay posiciones que rellenar
    // y devolvemos el resultado vacío sin llegar a la segunda pasada.
    if (conteo == 0)
    {
        return new Veces(); // el constructor por defecto da 0 y un array vacío
    }

    // ---- Reserva con el TAMAÑO EXACTO ----
    // Este es el motivo por el que necesitábamos la 1ª pasada.
    int[] posiciones = new int[conteo];

    // ---- 2ª PASADA: ¿dónde aparece? ----
    // Ojo: k (dónde ESCRIBIMOS) no es i (dónde LEEMOS). k avanza solo
    // cuando hay acierto; i avanza siempre, porque hay que mirarlo todo.
    int k = 0;

    for (int i = 0; i < datos.Length; i++)
    {
        if (datos[i] == objetivo)
        {
            posiciones[k] = i; // guardamos el ÍNDICE, no el valor
            k++;
        }
    }

    // Si k no coincide con conteo, sobran huecos o faltan datos:
    // comprobarlo aquí es más barato que depurar un IndexOutOfRange luego.
    return new Veces { Conteo = conteo, Posiciones = posiciones };
}

// MostrarVector: imprime el vector entre corchetes y con sus índices encima
// para que se vea a simple vista qué posición es la 0, la 1, etc.
void MostrarVector(string titulo, int[] datos)
{
    Console.WriteLine($"\n--- {titulo} ---");

    // Fila de índices
    Console.Write("   idx:");
    for (int i = 0; i < datos.Length; i++)
    {
        Console.Write($"{i,4}");
    }
    Console.WriteLine();

    // Fila de valores
    Console.Write("   val:");
    for (int i = 0; i < datos.Length; i++)
    {
        Console.Write($"{datos[i],4}");
    }
    Console.WriteLine();
}

// MostrarResultado: pinta el contador y, si lo hay, el detalle posición a
// posición mostrando el VALOR que hay en cada índice.
void MostrarResultado(int objetivo, Veces resultado, int[] datos)
{
    Console.WriteLine();
    Console.WriteLine($"--- Resultado para el {objetivo} ---");
    Console.WriteLine($"Veces que aparece: {resultado.Conteo}");

    // Early Return: sin aciertos no hay nada más que contar
    if (resultado.Conteo == 0)
    {
        Console.WriteLine("   ❌ El número no aparece en el vector.");
        return;
    }

    // Resumen en una línea, con los índices separados por comas
    Console.WriteLine($"   Posiciones: {string.Join(", ", resultado.Posiciones)}");

    // Y ahora el detalle: qué valor hay realmente en cada posición
    for (int p = 0; p < resultado.Posiciones.Length; p++)
    {
        int indice = resultado.Posiciones[p];
        Console.WriteLine($"   #{p + 1}: índice {indice} → valor {datos[indice]}");
    }
}

// LeerEntero: lee un número entero repitiendo mientras el texto no sea
// válido (TryParse). Una entrada del usuario no es un error del sistema.
int LeerEntero(string mensaje)
{
    int valor;
    bool valido;

    do
    {
        Console.Write(mensaje);
        valido = int.TryParse(Console.ReadLine(), out valor);

        if (!valido)
        {
            Console.WriteLine("❌ Eso no es un número entero. Inténtalo otra vez.");
        }

    } while (!valido);

    return valor;
}
