using System.Text;
using static System.Console;

// ----------------------------------------------------
// CONSTANTES GLOBALES
// ----------------------------------------------------
const int Size = 10; // Tamaño del mapa (vector)
const int MaxValue = 20; // Maximo de minerales por celda
const int ProbMineral = 50; // Probabilidad de que haya mineral en la celda (s/n)
const int MaxTime = 30; // tiempo máximo o número de pasos
const int ProbTakeMineral = 50; // Probabilidad de tomar mineral (s/n)
const int PauseTime = 1000; // Pausa entre paso de simulación (1 seg.)
const int NumMineralsTaken = 2; // Número de minerales que cojo de una "una vez"
const int ProbDecision = 50; // Probabilidad de decisión de si cambio o no de dirección

// ----------------------------------------------------
// BLOQUE PRINCIPAL (MAIN)
// ----------------------------------------------------

OutputEncoding = Encoding.UTF8;
Clear();

WriteLine("Detector de Minerales");

// Un solo Random global para todo el programa (se captura en las funciones)
var rnd = new Random();

// Creamos el mapa
var mapMinerales = CrearMapa(Size, MaxValue, ProbMineral);
WriteLine("--- Mapa Inicial de Minerales (Valores) ---");
PrintMapMinerales(mapMinerales);

// Variables que necesitamos en nuestro Program
var time = 1;
var cantidadMineral = 0;
var direccionBusqueda = 1;
var posicionActual = 0;

// Bucle de simulación
do {
    WriteLine();
    WriteLine($"--- Paso {time} / {MaxTime} ---");
    WriteLine($"Mineral Recolectado: {cantidadMineral}");
    WriteLine($"Posicion Actual: {posicionActual + 1}");
    WriteLine($"Direccion de Busqueda: {(direccionBusqueda == 1 ? "Derecha ➡️" : "Izquierda ⬅️")}");

    PrintTablero(posicionActual);

    // En la celda que estoy decido si cojo mineral, y actulizo si lo cojo.
    cantidadMineral += BuscarMineral(mapMinerales, posicionActual);

    // Cada 2 veces decidio si cambio de dirección
    if (time % 2 == 0)
        // ahora sorteo si decido cambiar o no
        direccionBusqueda = DireccionBusqueda(ProbDecision, direccionBusqueda);

    // Analizamos si hemos llegado al final dada una dirección
    if (IsEndMap(mapMinerales, posicionActual, direccionBusqueda)) {
        WriteLine("He llegado al extremo del mapa, cambio de Direccion obligatoriamente");
        direccionBusqueda *= -1;
    }

    // Actualizamos la siguiente posición: la actual más la dirección
    posicionActual += direccionBusqueda;

    // Suspendemos y aumentamos el numero de pasos
    Thread.Sleep(PauseTime);
    time++;

    // La simulación dura mientras se cumpla
    // Que haya minerales (true) Y
    // Estemos dentro del tiempo máximo
} while (HayMineral(mapMinerales) && time <= MaxTime);


// Informe final
InformeFinal(time, cantidadMineral, posicionActual, mapMinerales);

WriteLine("Presiona una tecla para salir...");
ReadKey();
// Fin de Programa
return;



// ----------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------
void PrintTablero(int posicion) {
    for (var i = 0; i < Size; i++)
        if (i == posicion)
            Write("[🤖]");
        else
            Write("[  ]");
    WriteLine();
}

// Analiza si ha llegado al final del mapa teniendo el cuenta la dirección
bool IsEndMap(int[] mapa, int posicion, int direccion) {
    return (posicion == 0 && direccion == -1) ||
           (posicion == mapa.Length - 1 && direccion == 1);
}

// Busca Mineral y elige si tomarlo o no, si puede
int BuscarMineral(int[] mapa, int posicion) {
    if (mapa[posicion] >= NumMineralsTaken) {
        WriteLine($"Mineral encontrado en la posicion {posicion + 1}");

        if (rnd.Next(0, 100) < ProbTakeMineral) {
            WriteLine($"Mineral tomado (-{NumMineralsTaken})");
            mapa[posicion] -= NumMineralsTaken;
            return NumMineralsTaken;
        }

        WriteLine("Mineral no tomado (Probabilidad fallida)");
        return 0;
    }

    WriteLine($"No hay mineral suficiente para tomar en la posicion {posicion + 1}");
    return 0;
}

// Crea el mapa según probabilidad y valores por celda
int[] CrearMapa(int size, int maxValue, int probMineral) {
    var map = new int[size];

    // Captura el rnd global (un solo Random en todo el programa)
    for (var i = 0; i < map.Length; i++)
        if (rnd.Next(0, 100) < probMineral)
            map[i] = rnd.Next(0, maxValue + 1);
        else
            map[i] = 0;

    return map;
}

// Imprime el mapa

// Comprueba si hay mineral
bool HayMineral(int[] map) {
    foreach (var m in map)
        if (m > 0)
            return true;
    return false;
}

// Obtiene la nueva dirección de busqueda, si la hay
int DireccionBusqueda(int probDecision, int direccionBusquedaOriginal) {
    // Sorteo y no se cumple, no cambiamos
    if (rnd.Next(0, 100) >= probDecision)
        return direccionBusquedaOriginal;

    // su cumple el sorteo
    WriteLine("He decidido cambiar de Direccion, me lo pienso...");
    // si no quisiesemos mas soteos, solo multiplico y devulevo
    // return direccionBusquedaOriginal * -1;

    // Sorteo la nueva dirección, 0 o 1
    var nuevaDireccionRandom = rnd.Next(0, 2);
    var nuevaDireccionBusqueda = nuevaDireccionRandom == 0 ? -1 : 1;

    // Mensaje de estado
    if (nuevaDireccionBusqueda != direccionBusquedaOriginal) {
        WriteLine("...Cambio de Direccion");
        return nuevaDireccionBusqueda;
    }

    // si he llegado aquí es que no he cambiado ni con el nuevo sorteo
    WriteLine("...No cambio de Direccion");
    return direccionBusquedaOriginal;
}

void PrintMapMinerales(int[] map) {
    foreach (var celda in map)
        Write($"[{celda}]");

    WriteLine();
}

// Imprime el informe
void InformeFinal(int tiempo, int totalMinerales, int posicionFinal, int[] ints) {
    WriteLine();
    WriteLine("--------------------------------------");
    WriteLine("FIN DE LA EXPLORACION");
    WriteLine("--------------------------------------");
    WriteLine($"Tiempo Final: {tiempo - 1}");
    WriteLine($"Cantidad de Mineral Total: {totalMinerales}");
    WriteLine($"Posicion Final: {posicionFinal + 1}");
    WriteLine("--- Mapa Final de Minerales (Valores) ---");
    PrintMapMinerales(ints);
}