using System.Text;
using _35_VecesMatriz.Structs;

// ============================================================================
// Contar y ubicar un número en una matriz (struct Veces + struct Posicion)
//
// ENUNCIADO: dado una matriz de enteros y un número, decir CUÁNTAS VECES
// aparece y EN QUÉ CELDAS aparece. Las celdas se identifican con DOS
// índices (fila y columna), así que la posición se guarda en un struct
// Posicion y el resultado viaja entero dentro de un struct Veces.
//
// Conceptos UD03/UD01 que ilustra:
//   - int[,] y GetLength(0) / GetLength(1) — tema 3
//   - Recorrido por FILAS con dos bucles anidados — tema 3
//   - struct de datos (Posicion) dentro de otro struct (Veces) — 3.3
//   - DOS PASADAS sobre la misma matriz: contar y luego rellenar
//   - Reserva de array con el TAMAÑO EXACTO (new Posicion[conteo])
//   - Early Return cuando no hay nada que buscar — punto 4
//   - El orden del recorrido decide el orden de las posiciones devueltas
//
// Ejecutar: dotnet run
// ============================================================================

Console.OutputEncoding = Encoding.UTF8;

// ------------------------------------------------------------
// CONSTANTES (nada de números sueltos por el código)
// ------------------------------------------------------------
const int FilasMatriz = 5; // nº de filas de la matriz de prueba
const int ColumnasMatriz = 7; // nº de columnas (matriz NO cuadrada a propósito)
const int ValorMin = 1; // valor mínimo simulado
const int ValorMax = 9; // valor máximo simulado (pocos => se repiten)

// ------------------------------------------------------------
// PROGRAMA PRINCIPAL
// ------------------------------------------------------------
Console.WriteLine("📊 Analizador de repetidos en una matriz");

// Matriz NO cuadrada (5x7): así se ven los errores de límite que un
// cuadrado taparía, porque GetLength(0) y GetLength(1) dan números distintos
var rnd = new Random();
var datos = GenerarMatriz(FilasMatriz, ColumnasMatriz, ValorMin, ValorMax, rnd);

MostrarMatriz("Matriz de lecturas", datos);

Console.WriteLine();
var objetivo = LeerEntero("🔎 ¿Qué número buscamos?: ");

// Una sola llamada devuelve TODO lo que sabemos sobre el objetivo
var resultado = ContarYUbicar(datos, objetivo);

MostrarResultado(objetivo, resultado, datos);

Console.WriteLine("\n🏁 Fin del análisis.");

// ------------------------------------------------------------
// FUNCIONES
// ------------------------------------------------------------

// GenerarMatriz: rellena la matriz con valores aleatorios.
int[,] GenerarMatriz(int filas, int columnas, int minimo, int maximo, Random rnd)
{
    var matriz = new int[filas, columnas];

    for (int i = 0; i < filas; i++)
    {
        for (int j = 0; j < columnas; j++)
        {
            matriz[i, j] = rnd.Next(minimo, maximo + 1); // Next es exclusivo en el tope
        }
    }

    return matriz;
}

// ContarYUbicar: el corazón del ejemplo. Devuelve un Veces con el CONTADOR
// y las POSICIONES (celdas). Idéntica estructura a la del vector, con la
// diferencia de que el recorrido necesita DOS bucles anidados.
//
// Se recorre la matriz DOS VECES:
//
//   1ª PASADA — solo CONTAR. Así sabemos cuántos huecos reservar.
//   2ª PASADA — solo RELLENAR. El array ya tiene el tamaño exacto.
//
// ¿Por qué dos pasadas? Porque un array en C# NO crece. Ir añadiendo
// posiciones "sobre la marcha" obligaría a reasignar el array entero
// dentro del bucle: O(n²) y memoria tirada. Primero medimos, después
// cortamos la tela del tamaño justo.
//
// Complejidad: O(n·m) en tiempo y O(k) en memoria, con k = nº de aciertos.
Veces ContarYUbicar(int[,] matriz, int objetivo)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);

    // ---- 1ª PASADA: ¿cuántas veces aparece? ----
    // Recorrido por FILAS (el habitual): la fila es el bucle externo.
    int conteo = 0;

    for (int i = 0; i < filas; i++)
    {
        for (int j = 0; j < columnas; j++)
        {
            if (matriz[i, j] == objetivo)
            {
                conteo++;
            }
        }
    }

    // Early Return: si no aparece ni una vez, no hay celdas que rellenar
    if (conteo == 0)
    {
        return new Veces(); // el constructor por defecto da 0 y array vacío
    }

    // ---- Reserva con el TAMAÑO EXACTO ----
    // Es el motivo por el que necesitábamos la 1ª pasada. Fíjate en que el
    // array es de Posicion[], no de int[]: una celda necesita DOS índices.
    Posicion[] posiciones = new Posicion[conteo];

    // ---- 2ª PASADA: ¿dónde aparece? ----
    // k (dónde ESCRIBIMOS) no es i/j (dónde LEEMOS). k avanza solo cuando
    // hay acierto; i y j avanzan siempre, porque hay que mirarlo todo.
    int k = 0;

    for (int i = 0; i < filas; i++)
    {
        for (int j = 0; j < columnas; j++)
        {
            if (matriz[i, j] == objetivo)
            {
                // Guardamos la CELDA (fila y columna), no el valor
                posiciones[k] = new Posicion { Fila = i, Columna = j };
                k++;
            }
        }
    }

    return new Veces { Conteo = conteo, Posiciones = posiciones };
}

// MostrarMatriz: imprime la matriz como una tabla con números de fila y
// columna, para poder leer cualquier celda sin contar a mano.
void MostrarMatriz(string titulo, int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);

    Console.WriteLine($"\n--- {titulo} ({filas}x{columnas}) ---");

    // Cabecera con los índices de columna
    Console.Write("       ");
    for (int j = 0; j < columnas; j++)
    {
        Console.Write($"c{j,4}");
    }
    Console.WriteLine();

    // Filas con su índice a la izquierda
    for (int i = 0; i < filas; i++)
    {
        Console.Write($"   f{i}: ");
        for (int j = 0; j < columnas; j++)
        {
            Console.Write($"{matriz[i, j],4}");
        }
        Console.WriteLine();
    }
}

// MostrarResultado: pinta el contador y, si lo hay, el detalle celda a celda
// con el valor real que hay en cada posición.
void MostrarResultado(int objetivo, Veces resultado, int[,] matriz)
{
    Console.WriteLine();
    Console.WriteLine($"--- Resultado para el {objetivo} ---");
    Console.WriteLine($"Veces que aparece: {resultado.Conteo}");

    // Early Return: sin aciertos no hay nada más que contar
    if (resultado.Conteo == 0)
    {
        Console.WriteLine("   ❌ El número no aparece en la matriz.");
        return;
    }

    // Resumen en una línea, con las celdas separadas por comas
    Console.WriteLine($"   Posiciones: {string.Join(", ", resultado.Posiciones)}");

    // Y ahora el detalle: qué valor hay realmente en cada celda
    for (int p = 0; p < resultado.Posiciones.Length; p++)
    {
        Posicion posicion = resultado.Posiciones[p];
        Console.WriteLine(
            $"   #{p + 1}: fila {posicion.Fila}, columna {posicion.Columna} "
            + $"→ valor {matriz[posicion.Fila, posicion.Columna]}");
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
