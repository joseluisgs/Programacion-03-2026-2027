using System.Text;
using _36_RecorridosMatriz.Structs;

// ============================================================================
// 18 recorridos de una matriz, cada uno en SU PROPIA función.
//
// ENUNCIADO: recorrer una matriz jugando con los índices de los dos bucles
// anidados, implementando cada variante como una función independiente:
//
//   Grupo A — RASTER (8): bucles rectos. Un recorrido recto se define con
//     tres decisiones: qué eje es el EXTERNO (2), su dirección (2) y la
//     dirección del INTERNO (2) => 2 x 2 x 2 = 8 combinaciones.
//       1. filas asc   columnas asc      5. filas asc   columnas desc
//       2. filas desc  columnas desc     6. filas desc  columnas asc
//       3. col  asc    filas asc         7. col  asc    filas desc
//       4. col  desc   filas desc        8. col  desc   filas asc
//
//   Grupo B — DIAGONALES (4): una sola diagonal completa, saliendo de una
//     esquina y avanzando en diagonal hasta salir de la matriz.
//       9. izq->der ascendente   (i + j constante, subiendo)
//      10. izq->der descendente  (i - j constante, bajando)
//      11. der->izq ascendente   (i - j constante, subiendo)
//      12. der->izq descendente  (i + j constante, bajando)
//
//   Grupo C — SERPENTINA (4): como el raster, pero la dirección del bucle
//     INTERNO ALTERNA en cada vuelta. Es el recorrido de una impresora, de
//     un tractor arando o de un escáner.
//      13. por filas,    empezando a la izquierda
//      14. por filas,    empezando a la derecha
//      15. por columnas, empezando arriba
//      16. por columnas, empezando abajo
//
//   Grupo D — ESPIRAL (2): se entra por el borde y se avanza hacia el
//     centro girando. El recorrido de matriz por excelencia en exámenes
//     y entrevistas.
//      17. horario
//      18. antihorario
//
// Conceptos UD03/UD01 que ilustra:
//   - int[,] y GetLength(0) / GetLength(1) — tema 3
//   - Dos bucles anidados y cómo sus direcciones cambian el resultado — 3
//   - struct Posicion como resultado de un recorrido — 3.3
//   - Una función = un recorrido (SRP); el main solo decide el orden
//   - HashSet<Posicion> para detectar celdas repetidas — tema 2
//   - Matriz cuadrada (5x5): el patrón de cada recorrido se lee de un vistazo
//
// Ejecutar: dotnet run
// ============================================================================

Console.OutputEncoding = Encoding.UTF8;

// ------------------------------------------------------------
// CONSTANTES (nada de números sueltos por el código)
// ------------------------------------------------------------
const int FilasMatriz = 5;   // nº de filas
const int ColumnasMatriz = 5; // nº de columnas: matriz cuadrada 5x5
const int PorLinea = 12;     // cuántos números imprimir por línea

// ------------------------------------------------------------
// PROGRAMA PRINCIPAL
// ------------------------------------------------------------

// Matriz de prueba con valores SECUENCIALES (1..25) en orden de lectura:
// así cada recorrido se lee como una permutación legible y cualquier
// desviación del orden se ve a simple vista.
var matriz = new int[FilasMatriz, ColumnasMatriz];
int valor = 1;
for (int i = 0; i < FilasMatriz; i++)
{
    for (int j = 0; j < ColumnasMatriz; j++)
    {
        matriz[i, j] = valor++;
    }
}

Console.WriteLine("🗺️  Recorridos de una matriz");
MostrarMatriz(matriz);

// Catálogo de recorridos: nombre, si debe cubrir TODAS las celdas, y la
// función que produce el camino. Cada entrada apunta a una función propia.
var recorridos = new (string Nombre, bool CubreTodo, Func<int[,], List<Posicion>> Obtener)[]
{
    // ---- Grupo A: raster (8) ----
    ("01. Raster: filas ↑, columnas ↑",          true,  RasterFilasAscColumnasAsc),
    ("02. Raster: filas ↓, columnas ↓",          true,  RasterFilasDescColumnasDesc),
    ("03. Raster: columnas ↑, filas ↑",          true,  RasterColumnasAscFilasAsc),
    ("04. Raster: columnas ↓, filas ↓",          true,  RasterColumnasDescFilasDesc),
    ("05. Raster: filas ↑, columnas ↓",          true,  RasterFilasAscColumnasDesc),
    ("06. Raster: filas ↓, columnas ↑",          true,  RasterFilasDescColumnasAsc),
    ("07. Raster: columnas ↑, filas ↓",          true,  RasterColumnasAscFilasDesc),
    ("08. Raster: columnas ↓, filas ↑",          true,  RasterColumnasDescFilasAsc),

    // ---- Grupo B: diagonales (4) — solo UNA diagonal ----
    ("09. Diagonal izq→der ascendente",          false, DiagonalIzqDerAscendente),
    ("10. Diagonal izq→der descendente",         false, DiagonalIzqDerDescendente),
    ("11. Diagonal der→izq ascendente",          false, DiagonalDerIzqAscendente),
    ("12. Diagonal der→izq descendente",         false, DiagonalDerIzqDescendente),

    // ---- Grupo C: serpentina (4) — el interno ALTERNA ----
    ("13. Serpentina por filas, inicio izq.",    true,  SerpentinaFilasInicioIzquierda),
    ("14. Serpentina por filas, inicio der.",    true,  SerpentinaFilasInicioDerecha),
    ("15. Serpentina por columnas, inicio arr.", true,  SerpentinaColumnasInicioArriba),
    ("16. Serpentina por columnas, inicio abj.", true,  SerpentinaColumnasInicioAbajo),

    // ---- Grupo D: espiral (2) — del borde al centro ----
    ("17. Espiral hacia dentro, horario",        true,  EspiralHorario),
    ("18. Espiral hacia dentro, antihorario",    true,  EspiralAntihorario)
};

// Ejecutamos los 18 y comprobamos cada uno: sin celdas repetidas, sin
// celdas fuera de límites y (en los que lo prometen) cobertura completa.
int fallos = 0;

foreach (var (nombre, cubreTodo, obtener) in recorridos)
{
    var camino = obtener(matriz);
    var (ok, motivo) = VerificarCamino(camino, matriz, cubreTodo);

    if (!ok)
    {
        fallos++;
    }

    Console.WriteLine();
    Console.WriteLine($"── {nombre} ──");
    Console.WriteLine($"   Celdas: {camino.Count}   {(ok ? "✅ correcto" : $"❌ {motivo}")}");

    // Secuencia de VALORES visitados: como son 1..25 en orden de lectura,
    // el número indica la celda original sin necesidad de escribir (fila,col)
    ImprimirCamino(camino, matriz, PorLinea);
}

Console.WriteLine();
Console.WriteLine(fallos == 0
    ? "🏁 Los 18 recorridos completados sin errores."
    : $"🏁 Terminado con {fallos} fallo(s).");

// ------------------------------------------------------------
// GRUPO A — RASTER (8)
// ------------------------------------------------------------
// Los 8 se parecen en todo salvo en tres decisiones: cuál es el bucle
// EXTERNO (filas o columnas), hacia dónde va y hacia dónde va el INTERNO.
// Esa es la lección: con el mismo código, cambiando tres índices, salen ocho
// comportamientos distintos.

// 01. Externo = filas ↑, interno = columnas ↑. El recorrido "natural".
List<Posicion> RasterFilasAscColumnasAsc(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int i = 0; i < filas; i++)
    {
        for (int j = 0; j < columnas; j++)
        {
            camino.Add(new Posicion(i, j));
        }
    }

    return camino;
}

// 02. Externo = filas ↓, interno = columnas ↓. Exactamente al revés:
// se empieza por la última celda de la matriz.
List<Posicion> RasterFilasDescColumnasDesc(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int i = filas - 1; i >= 0; i--)
    {
        for (int j = columnas - 1; j >= 0; j--)
        {
            camino.Add(new Posicion(i, j));
        }
    }

    return camino;
}

// 03. Externo = columnas ↑, interno = filas ↑.
// OJO: el recorrido es el MISMO CONJUNTO de celdas que el 01, pero en otro
// orden: aquí se avanza columna a columna (por columnas), no fila a fila.
List<Posicion> RasterColumnasAscFilasAsc(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int j = 0; j < columnas; j++)
    {
        for (int i = 0; i < filas; i++)
        {
            camino.Add(new Posicion(i, j));
        }
    }

    return camino;
}

// 04. Externo = columnas ↓, interno = filas ↓.
List<Posicion> RasterColumnasDescFilasDesc(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int j = columnas - 1; j >= 0; j--)
    {
        for (int i = filas - 1; i >= 0; i--)
        {
            camino.Add(new Posicion(i, j));
        }
    }

    return camino;
}

// 05. Externo = filas ↑, interno = columnas ↓.
// Cada fila se lee de derecha a izquierda (empieza por la última columna).
List<Posicion> RasterFilasAscColumnasDesc(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int i = 0; i < filas; i++)
    {
        for (int j = columnas - 1; j >= 0; j--)
        {
            camino.Add(new Posicion(i, j));
        }
    }

    return camino;
}

// 06. Externo = filas ↓, interno = columnas ↑. El "al contrario" del 05.
List<Posicion> RasterFilasDescColumnasAsc(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int i = filas - 1; i >= 0; i--)
    {
        for (int j = 0; j < columnas; j++)
        {
            camino.Add(new Posicion(i, j));
        }
    }

    return camino;
}

// 07. Externo = columnas ↑, interno = filas ↓.
List<Posicion> RasterColumnasAscFilasDesc(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int j = 0; j < columnas; j++)
    {
        for (int i = filas - 1; i >= 0; i--)
        {
            camino.Add(new Posicion(i, j));
        }
    }

    return camino;
}

// 08. Externo = columnas ↓, interno = filas ↑. El "al contrario" del 07.
List<Posicion> RasterColumnasDescFilasAsc(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int j = columnas - 1; j >= 0; j--)
    {
        for (int i = 0; i < filas; i++)
        {
            camino.Add(new Posicion(i, j));
        }
    }

    return camino;
}

// ------------------------------------------------------------
// GRUPO B — DIAGONALES (4)
// ------------------------------------------------------------
// Aquí ya no hay dos bucles anidados: hay UN bucle while que avanza en las
// dos direcciones a la vez (una fila para arriba/abajo y una columna para
// el lado contrario). Se sale de la matriz cuando uno de los dos índices
// se queda fuera, y ahí termina el bucle.

// 09. Izq→der ascendente: se sale por la esquina INFERIOR IZQUIERDA y se
// sube hacia la derecha. i + j queda constante (diagonal secundaria /).
List<Posicion> DiagonalIzqDerAscendente(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    int i = filas - 1; // fila inicial: abajo del todo
    int j = 0;         // columna inicial: a la izquierda del todo

    while (i >= 0 && j < columnas)
    {
        camino.Add(new Posicion(i, j));
        i--; // subir
        j++; // avanzar a la derecha
    }

    return camino;
}

// 10. Izq→der descendente: se sale por la esquina SUPERIOR IZQUIERDA y se
// baja hacia la derecha. i - j queda constante (diagonal principal \).
List<Posicion> DiagonalIzqDerDescendente(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    int i = 0;
    int j = 0;

    while (i < filas && j < columnas)
    {
        camino.Add(new Posicion(i, j));
        i++; // bajar
        j++; // avanzar a la derecha
    }

    return camino;
}

// 11. Der→izq ascendente: se sale por la esquina INFERIOR DERECHA y se
// sube hacia la izquierda. i - j queda constante (diagonal principal \).
List<Posicion> DiagonalDerIzqAscendente(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    int i = filas - 1;
    int j = columnas - 1;

    while (i >= 0 && j >= 0)
    {
        camino.Add(new Posicion(i, j));
        i--; // subir
        j--; // avanzar a la izquierda
    }

    return camino;
}

// 12. Der→izq descendente: se sale por la esquina SUPERIOR DERECHA y se
// baja hacia la izquierda. i + j queda constante (diagonal secundaria /).
List<Posicion> DiagonalDerIzqDescendente(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    int i = 0;
    int j = columnas - 1;

    while (i < filas && j >= 0)
    {
        camino.Add(new Posicion(i, j));
        i++; // bajar
        j--; // avanzar a la izquierda
    }

    return camino;
}

// ------------------------------------------------------------
// GRUPO C — SERPENTINA (4)
// ------------------------------------------------------------
// Mismo esqueleto que el raster, con UNA sola diferencia: dentro del bucle
// externo, el bucle interno cambia de dirección cuando el índice externo es
// impar. Esa alternancia es lo que produce el zigzag.

// 13. Por filas, empezando a la izquierda: fila 0 izq→der, fila 1 der→izq...
List<Posicion> SerpentinaFilasInicioIzquierda(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int i = 0; i < filas; i++)
    {
        if (i % 2 == 0)
        {
            // Filas pares (0, 2, 4...): de izquierda a derecha
            for (int j = 0; j < columnas; j++)
            {
                camino.Add(new Posicion(i, j));
            }
        }
        else
        {
            // Filas impares (1, 3, 5...): de derecha a izquierda
            for (int j = columnas - 1; j >= 0; j--)
            {
                camino.Add(new Posicion(i, j));
            }
        }
    }

    return camino;
}

// 14. Por filas, empezando a la derecha: el mismo recorrido con la
// paridad INVERTIDA (ahora son las pares las que van der→izq).
List<Posicion> SerpentinaFilasInicioDerecha(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int i = 0; i < filas; i++)
    {
        if (i % 2 == 0)
        {
            for (int j = columnas - 1; j >= 0; j--)
            {
                camino.Add(new Posicion(i, j));
            }
        }
        else
        {
            for (int j = 0; j < columnas; j++)
            {
                camino.Add(new Posicion(i, j));
            }
        }
    }

    return camino;
}

// 15. Por columnas, empezando arriba: columna 0 arriba→abajo,
// columna 1 abajo→arriba... El zigzag girado 90 grados.
List<Posicion> SerpentinaColumnasInicioArriba(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int j = 0; j < columnas; j++)
    {
        if (j % 2 == 0)
        {
            // Columnas pares: de arriba hacia abajo
            for (int i = 0; i < filas; i++)
            {
                camino.Add(new Posicion(i, j));
            }
        }
        else
        {
            // Columnas impares: de abajo hacia arriba
            for (int i = filas - 1; i >= 0; i--)
            {
                camino.Add(new Posicion(i, j));
            }
        }
    }

    return camino;
}

// 16. Por columnas, empezando abajo: paridad invertida respecto a la 15.
List<Posicion> SerpentinaColumnasInicioAbajo(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    for (int j = 0; j < columnas; j++)
    {
        if (j % 2 == 0)
        {
            for (int i = filas - 1; i >= 0; i--)
            {
                camino.Add(new Posicion(i, j));
            }
        }
        else
        {
            for (int i = 0; i < filas; i++)
            {
                camino.Add(new Posicion(i, j));
            }
        }
    }

    return camino;
}

// ------------------------------------------------------------
// GRUPO D — ESPIRAL (2)
// ------------------------------------------------------------
// Se mantiene un "marco" vivo con cuatro límites: arriba, abajo, izquierda
// y derecha. En cada vuelta se consume un borde entero y se estrecha el
// marco. Los dos ifs con guardia (arriba<=abajo y izquierda<=derecha) son
// lo que evita repetir celdas cuando ya queda una sola fila o una sola
// columna: sin ellos se recorre el borde dos veces.

// 17. Horario: fila superior izq→der, columna derecha arriba→abajo,
// fila inferior der→izq, columna izquierda abajo→arriba, y se repite.
List<Posicion> EspiralHorario(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    int arriba = 0;
    int abajo = filas - 1;
    int izquierda = 0;
    int derecha = columnas - 1;

    while (arriba <= abajo && izquierda <= derecha)
    {
        // Borde superior: de izquierda a derecha
        for (int j = izquierda; j <= derecha; j++)
        {
            camino.Add(new Posicion(arriba, j));
        }
        arriba++; // ese borde ya está consumido

        // Borde derecho: de arriba hacia abajo
        for (int i = arriba; i <= abajo; i++)
        {
            camino.Add(new Posicion(i, derecha));
        }
        derecha--;

        // Guardia: si ya no queda fila inferior, no hay nada que recorrer
        if (arriba <= abajo)
        {
            for (int j = derecha; j >= izquierda; j--)
            {
                camino.Add(new Posicion(abajo, j));
            }
            abajo--;
        }

        // Guardia: si ya no queda columna izquierda, no hay nada que recorrer
        if (izquierda <= derecha)
        {
            for (int i = abajo; i >= arriba; i--)
            {
                camino.Add(new Posicion(i, izquierda));
            }
            izquierda++;
        }
    }

    return camino;
}

// 18. Antihorario: se gira en sentido contrario. Mismo marco, pero se
// consume primero la columna izquierda en vez de la fila superior.
List<Posicion> EspiralAntihorario(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);
    var camino = new List<Posicion>();

    int arriba = 0;
    int abajo = filas - 1;
    int izquierda = 0;
    int derecha = columnas - 1;

    while (arriba <= abajo && izquierda <= derecha)
    {
        // Borde izquierdo: de arriba hacia abajo
        for (int i = arriba; i <= abajo; i++)
        {
            camino.Add(new Posicion(i, izquierda));
        }
        izquierda++;

        // Borde inferior: de izquierda a derecha
        for (int j = izquierda; j <= derecha; j++)
        {
            camino.Add(new Posicion(abajo, j));
        }
        abajo--;

        // Guardia: si ya no queda columna derecha, no hay nada que recorrer
        if (izquierda <= derecha)
        {
            for (int i = abajo; i >= arriba; i--)
            {
                camino.Add(new Posicion(i, derecha));
            }
            derecha--;
        }

        // Guardia: si ya no queda fila superior, no hay nada que recorrer
        if (arriba <= abajo)
        {
            for (int j = derecha; j >= izquierda; j--)
            {
                camino.Add(new Posicion(arriba, j));
            }
            arriba++;
        }
    }

    return camino;
}

// ------------------------------------------------------------
// FUNCIONES AUXILIARES
// ------------------------------------------------------------

// VerificarCamino: la comprobación automática de los 18 recorridos.
// Devuelve si el camino es válido y, si no lo es, el primer motivo.
// Un recorrido es válido cuando:
//   - ninguna celda se sale de los límites de la matriz
//   - ninguna celda se visita dos veces
//   - si CubreTodo, se visitan las filas x columnas celdas
(bool Ok, string Motivo) VerificarCamino(List<Posicion> camino, int[,] matriz, bool debeCubrirTodo)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);

    // HashSet<Posicion> aprovecha la igualdad POR VALOR de los structs:
    // Add devuelve false si la posición ya estaba, y ahí tenemos el fallo.
    var vistas = new HashSet<Posicion>();

    foreach (Posicion p in camino)
    {
        if (p.Fila < 0 || p.Fila >= filas || p.Columna < 0 || p.Columna >= columnas)
        {
            return (false, $"celda fuera de límites {p}");
        }

        if (!vistas.Add(p))
        {
            return (false, $"celda repetida {p}");
        }
    }

    if (debeCubrirTodo && vistas.Count != filas * columnas)
    {
        return (false, $"solo {vistas.Count} de {filas * columnas} celdas");
    }

    return (true, "ok");
}

// ImprimirCamino: pinta la secuencia de VALORES visitados, en varias
// líneas para que no se corte por el ancho de la consola.
void ImprimirCamino(List<Posicion> camino, int[,] matriz, int porLinea)
{
    for (int p = 0; p < camino.Count; p += porLinea)
    {
        var trozo = new List<string>();
        int fin = Math.Min(p + porLinea, camino.Count);

        for (int q = p; q < fin; q++)
        {
            Posicion celda = camino[q];
            trozo.Add($"{matriz[celda.Fila, celda.Columna],2}");
        }

        Console.WriteLine("      " + string.Join(" ", trozo));
    }
}

// MostrarMatriz: tabla con los índices de fila y columna, para poder
// localizar cualquier celda sin contar a mano.
void MostrarMatriz(int[,] matriz)
{
    int filas = matriz.GetLength(0);
    int columnas = matriz.GetLength(1);

    Console.WriteLine($"\n--- Matriz de prueba ({filas}x{columnas}) ---");

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

    Console.WriteLine("\nCada número es la celda en orden de lectura:");
    Console.WriteLine("valor 1 = (0,0), valor 5 = (0,4), valor 6 = (1,0), etc.");
}
