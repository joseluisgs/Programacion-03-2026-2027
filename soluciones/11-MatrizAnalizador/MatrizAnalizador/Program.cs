using System.Text;

// ============================================================
// 35. Analizador de una matriz de sensores (matriz rectangular)
//
// Ejercicio INTEGRADOR de arrays bidimensionales: una matriz de
// lecturas 2D con análisis por filas y columnas — máximo, mínimo,
// media, suma por fila, suma por columna, suma de posiciones
// pares/impares (tablero de ajedrez), rotación 90° y búsqueda de
// un elemento con sus coordenadas. Cada operación en SU PROPIA
// función (SRP).
//
// Conceptos UD03 que repasa:
//   - int[,]: matriz rectangular y sus dos dimensiones — 3.1
//   - .GetLength(0) y .GetLength(1) para filas y columnas — 3.1
//   - Recorrido anidado (for dentro de for) — 3.2
//   - Sumas por fila y por columna (dos bucles separados) — 3.2
//   - Búsqueda de un elemento devolviendo coordenadas — 3.3
//   - Rotación 90°: la fila pasa a columna (matriz nueva) — 3.x
//   - Tuplas nombradas para devolver varias salidas — repaso UD01
// ============================================================

// Constantes
const int FilasDefault = 5;
const int ColumnasDefault = 8;
const int LecturaMin = 10;  // lectura mínima simulada
const int LecturaMax = 99;  // lectura máxima simulada


// Main Program

Console.OutputEncoding = Encoding.UTF8;

Console.WriteLine("🌡️ Analizador de matriz de sensores");
Console.WriteLine($"Generando matriz de {FilasDefault}x{ColumnasDefault} con lecturas entre {LecturaMin} y {LecturaMax}...");

// Un solo Random para todo el programa
var rnd = new Random();

// Generar la matriz (int[,] se inicializa sola con ceros)
var matriz = GenerarMatriz(FilasDefault, ColumnasDefault, LecturaMin, LecturaMax);
MostrarMatriz(matriz);

// Bucle principal con menú hasta que el usuario salga
var salir = false;

do {
    var opcion = LeerOpcionMenu();

    switch (opcion) {
        case 1:
            MostrarMatriz(matriz);
            break;

        case 2:
            var maximo = BuscarMaximo(matriz);
            Console.WriteLine($"📈 Máximo: {maximo.Valor} (fila {maximo.Fila}, columna {maximo.Columna})");
            break;

        case 3:
            var minimo = BuscarMinimo(matriz);
            Console.WriteLine($"📉 Mínimo: {minimo.Valor} (fila {minimo.Fila}, columna {minimo.Columna})");
            break;

        case 4:
            Console.WriteLine($"📊 Media global: {CalcularMedia(matriz):F2}");
            break;

        case 5:
            MostrarSumasPorFila(matriz);
            break;

        case 6:
            MostrarSumasPorColumna(matriz);
            break;

        case 7:
            MostrarSumasParesImpares(matriz);
            break;

        case 8:
            // La rotación 90° de una matriz rectangular CAMBIA sus dimensiones
            Console.WriteLine("Rotando 90° a la derecha...");
            matriz = RotarMatrizDerecha(matriz);
            MostrarMatriz(matriz);
            break;

        case 9:
            BuscarElementoInteractivo(matriz);
            break;

        case 10:
            GenerarInforme(matriz);
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

// Genera una matriz de "lecturas" con valores aleatorios en [min..max].
int[,] GenerarMatriz(int filas, int columnas, int min, int max) {
    var datos = new int[filas, columnas];

    // Next(min, max) es exclusivo en el máximo: se suma 1 para incluirlo
    for (var i = 0; i < filas; i++)
        for (var j = 0; j < columnas; j++)
            datos[i, j] = rnd.Next(min, max + 1);

    return datos;
}

// Muestra la matriz formateada con etiquetas de fila (F0..) y columna (C0..).
void MostrarMatriz(int[,] datos) {
    var filas = datos.GetLength(0);    // primera dimensión
    var columnas = datos.GetLength(1); // segunda dimensión

    Console.WriteLine("--- Matriz de lecturas ---");
    Console.Write("      "); // deja sitio para la etiqueta de fila

    // Cabecera de columnas
    for (var j = 0; j < columnas; j++)
        Console.Write($"{"C" + j,4}");
    Console.WriteLine();

    // Una línea por fila, con su etiqueta
    for (var i = 0; i < filas; i++) {
        Console.Write($"{"F" + i,-4}   ");
        for (var j = 0; j < columnas; j++)
            Console.Write($"{datos[i, j],4}");
        Console.WriteLine();
    }
}

// Devuelve el MÁXIMO de la matriz con su posición (fila y columna).
(int Valor, int Fila, int Columna) BuscarMaximo(int[,] datos) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);

    var maximo = datos[0, 0]; // suponemos que el mayor está en la esquina
    var filaMax = 0;
    var colMax = 0;

    for (var i = 0; i < filas; i++)
        for (var j = 0; j < columnas; j++)
            if (datos[i, j] > maximo) {
                maximo = datos[i, j];
                filaMax = i;
                colMax = j;
            }

    return (maximo, filaMax, colMax);
}

// Devuelve el MÍNIMO de la matriz con su posición (fila y columna).
(int Valor, int Fila, int Columna) BuscarMinimo(int[,] datos) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);

    var minimo = datos[0, 0]; // suponemos que el menor está en la esquina
    var filaMin = 0;
    var colMin = 0;

    for (var i = 0; i < filas; i++)
        for (var j = 0; j < columnas; j++)
            if (datos[i, j] < minimo) {
                minimo = datos[i, j];
                filaMin = i;
                colMin = j;
            }

    return (minimo, filaMin, colMin);
}

// Calcula la MEDIA aritmética de TODOS los elementos de la matriz.
double CalcularMedia(int[,] datos) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);
    var suma = 0;

    // Recorrido anidado: filas por fuera, columnas por dentro
    for (var i = 0; i < filas; i++)
        for (var j = 0; j < columnas; j++)
            suma += datos[i, j];

    return (double)suma / (filas * columnas); // total de celdas
}

// Suma TODOS los elementos de UNA fila concreta.
int SumarFila(int[,] datos, int fila) {
    var columnas = datos.GetLength(1);
    var suma = 0;

    for (var j = 0; j < columnas; j++)
        suma += datos[fila, j];

    return suma;
}

// Suma TODOS los elementos de UNA columna concreta.
int SumarColumna(int[,] datos, int columna) {
    var filas = datos.GetLength(0);
    var suma = 0;

    for (var i = 0; i < filas; i++)
        suma += datos[i, columna];

    return suma;
}

// Calcula la suma de cada fila y la muestra como un vector horizontal.
void MostrarSumasPorFila(int[,] datos) {
    var filas = datos.GetLength(0);

    Console.WriteLine("➖ Suma de cada fila:");
    Console.Write("   ");

    for (var i = 0; i < filas; i++)
        Console.Write($"F{i}:{SumarFila(datos, i),-5}");
    Console.WriteLine();
}

// Calcula la suma de cada columna y la muestra como una lista vertical.
void MostrarSumasPorColumna(int[,] datos) {
    var columnas = datos.GetLength(1);

    Console.WriteLine("➖ Suma de cada columna:");

    for (var j = 0; j < columnas; j++)
        Console.WriteLine($"   Columna C{j}: {SumarColumna(datos, j)}");
}

// Suma las celdas en posiciones PARES del tablero de ajedrez: la
// posición (fila, columna) es "par" cuando fila + columna es par.
int SumarPosicionesPares(int[,] datos) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);
    var suma = 0;

    for (var i = 0; i < filas; i++)
        for (var j = 0; j < columnas; j++)
            if ((i + j) % 2 == 0) // casilla blanca del tablero
                suma += datos[i, j];

    return suma;
}

// Suma las celdas en posiciones IMPARES del tablero de ajedrez.
int SumarPosicionesImpares(int[,] datos) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);
    var suma = 0;

    for (var i = 0; i < filas; i++)
        for (var j = 0; j < columnas; j++)
            if ((i + j) % 2 == 1) // casilla negra del tablero
                suma += datos[i, j];

    return suma;
}

// Muestra ambas sumas (pares e impares) y su total de control.
void MostrarSumasParesImpares(int[,] datos) {
    var pares = SumarPosicionesPares(datos);
    var impares = SumarPosicionesImpares(datos);

    Console.WriteLine("♟️  Suma por tipo de casilla (tablero de ajedrez):");
    Console.WriteLine($"   Posiciones PARES  (i+j par)  : {pares}");
    Console.WriteLine($"   Posiciones IMPARES (i+j impar): {impares}");
    Console.WriteLine($"   Control (debe ser la media·n): {pares + impares}");
}

// Rota la matriz 90° a la derecha (horaria) y devuelve una MATRIZ NUEVA.
// La fila i de la original pasa a ser la columna (filas-1-i) del resultado.
// Ojo: una matriz rectangular rota CAMBIA de dimensiones (5x8 → 8x5).
int[,] RotarMatrizDerecha(int[,] datos) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);

    // El resultado tiene las dimensiones intercambiadas
    var resultado = new int[columnas, filas];

    for (var i = 0; i < filas; i++)
        for (var j = 0; j < columnas; j++)
            resultado[j, filas - 1 - i] = datos[i, j]; // la fila pasa a columna

    return resultado; // el llamador decide si reasignar (aquí, sí)
}

// Búsqueda de un elemento en la matriz: devuelve la posición (fila,
// columna) donde está, o (-1, -1) si no existe en ninguna celda.
(int Fila, int Columna) BuscarElemento(int[,] datos, int objetivo) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);

    for (var i = 0; i < filas; i++)
        for (var j = 0; j < columnas; j++)
            if (datos[i, j] == objetivo)
                return (i, j); // ¡encontrado!

    return (-1, -1); // recorrimos todas las celdas y no estaba
}

// Pide un valor a buscar y muestra su posición (o avisa si no está).
void BuscarElementoInteractivo(int[,] datos) {
    var objetivo = LeerEntero("🔍 Valor a buscar: ");
    var posicion = BuscarElemento(datos, objetivo);

    if (posicion.Fila == -1)
        Console.WriteLine($"   El valor {objetivo} NO está en la matriz.");
    else
        Console.WriteLine($"   ¡Encontrado! El valor {objetivo} está en la fila {posicion.Fila}, columna {posicion.Columna}.");
}

// Genera el INFORME completo llamando a todas las funciones de análisis.
void GenerarInforme(int[,] datos) {
    var filas = datos.GetLength(0);
    var columnas = datos.GetLength(1);
    var maximo = BuscarMaximo(datos);
    var minimo = BuscarMinimo(datos);

    Console.WriteLine("\n========== 📋 INFORME DE LA MATRIZ ==========");
    Console.WriteLine($"Dimensiones     : {filas} filas x {columnas} columnas");
    Console.WriteLine($"Total de celdas : {filas * columnas}");
    Console.WriteLine($"Máximo          : {maximo.Valor} (fila {maximo.Fila}, columna {maximo.Columna})");
    Console.WriteLine($"Mínimo          : {minimo.Valor} (fila {minimo.Fila}, columna {minimo.Columna})");
    Console.WriteLine($"Media global    : {CalcularMedia(datos):F2}");
    Console.WriteLine($"Suma pares      : {SumarPosicionesPares(datos)}");
    Console.WriteLine($"Suma impares    : {SumarPosicionesImpares(datos)}");

    MostrarSumasPorFila(datos);
    MostrarSumasPorColumna(datos);
    Console.WriteLine("=============================================\n");
}

// Lee y valida una opción del menú (entero entre 0 y 10).
int LeerOpcionMenu() {
    var valido = false;
    var opcion = -1;

    do {
        Console.WriteLine("--- MENÚ ---");
        Console.WriteLine("1. Mostrar matriz");
        Console.WriteLine("2. Buscar máximo");
        Console.WriteLine("3. Buscar mínimo");
        Console.WriteLine("4. Media global");
        Console.WriteLine("5. Suma por filas");
        Console.WriteLine("6. Suma por columnas");
        Console.WriteLine("7. Suma posiciones pares/impares");
        Console.WriteLine("8. Rotar 90° a la derecha");
        Console.WriteLine("9. Buscar un elemento");
        Console.WriteLine("10. Informe completo");
        Console.WriteLine("0. Salir");
        Console.Write("Elige opción: ");

        var entrada = (Console.ReadLine() ?? "").Trim();

        if (int.TryParse(entrada, out var valor) && valor >= 0 && valor <= 10) {
            opcion = valor;
            valido = true;
        }
        else {
            Console.WriteLine("❌ Entrada no válida. Debes escribir un número del 0 al 10.");
        }
    } while (!valido);

    return opcion;
}

// Lee y valida un entero introducido por el usuario (reutilizable).
int LeerEntero(string mensaje) {
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
