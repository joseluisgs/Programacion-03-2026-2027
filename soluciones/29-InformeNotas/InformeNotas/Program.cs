using System.Text;

// ============================================================
// 33. Informe de notas de la clase (integrador)
//
// Ejercicio INTEGRADOR de arrays 1D que cierra la UD: estadística
// (máximo, mínimo, media, aprobados), ordenación POR BURBUJA y
// BÚSQUEDA BINARIA sobre el array ordenado, más un histograma de
// frecuencias. Todo en funciones SRP.
//
// Conceptos UD03 que repasa:
//   - double[] y recorridos — 2.2
//   - Ordenación por burbuja (intercambio de vecinos) — 2.8
//   - Búsqueda binaria: descarta la mitad, pero EXIGE orden previo — 2.8
//   - El array se pasa por referencia implícita (tipo de referencia) — 2.3
// ============================================================

// Constantes
const int NumAlumnos = 30;   // tamaño del array (una nota por alumno)
const double NotaMin = 0.0;  // nota mínima posible
const double NotaMax = 10.0; // nota máxima posible
const double NotaAprobado = 5.0;
const double Tolerancia = 0.05; // margen para comparar doubles en la binaria


// Main Program

Console.OutputEncoding = Encoding.UTF8;

Console.WriteLine("🎓 Informe de notas de la clase");
Console.WriteLine($"Generando {NumAlumnos} notas aleatorias entre {NotaMin} y {NotaMax}...");

// Un solo Random para todo el programa
var rnd = new Random();

// Generar el array de notas (tipo double[] para decimales)
var notas = GenerarNotas(NumAlumnos, NotaMin, NotaMax);
MostrarNotas(notas);

// 1) Estadística básica (antes de tocar el orden)
Console.WriteLine("\n--- 📊 Estadística ---");
Console.WriteLine($"Máximo      : {CalcularMaximo(notas):F1}");
Console.WriteLine($"Mínimo      : {CalcularMinimo(notas):F1}");
Console.WriteLine($"Media       : {CalcularMedia(notas):F2}");
Console.WriteLine($"Aprobados   : {ContarAprobados(notas)} de {notas.Length}");

// 2) Histograma de frecuencias por tramos
MostrarHistograma(notas);

// 3) Ordenar y buscar: aquí se ve PARA QUÉ sirve ordenar
Console.WriteLine("\n--- 🔎 Búsqueda binaria (requiere orden previo) ---");
Console.WriteLine("Ordenando el array con burbuja...");
OrdenarPorBurbuja(notas);
MostrarNotas(notas);

// Buscamos una nota generada de forma aleatoria para demostrar la binaria
var objetivo = notas[rnd.Next(0, notas.Length)];
var indice = BuscarBinaria(notas, objetivo);

if (indice == -1)
    Console.WriteLine($"   La nota {objetivo:F1} no se encontró (raro, era una del array).");
else
    Console.WriteLine($"   ✅ Nota {objetivo:F1} encontrada en la posición {indice} (alumno {indice + 1}).");

Console.WriteLine("\n👋 ¡Informe generado!");

// End Main Program

// Genera un array de notas con UN decimal aleatorio en [min..max].
double[] GenerarNotas(int cantidad, double min, double max) {
    var resultado = new double[cantidad];

    // Truco: se genera un ENTERO de 0 a 100 y se divide entre 10 → un decimal exacto
    // Así se evitan sorpresas de precisión al comparar doubles
    for (var i = 0; i < resultado.Length; i++) {
        var entero = rnd.Next((int)min * 10, (int)max * 10 + 1); // 0 a 100
        resultado[i] = entero / 10.0;
    }

    return resultado;
}

// Muestra todas las notas del array con su número de alumno.
void MostrarNotas(double[] notas) {
    Console.WriteLine("📋 Notas:");
    Console.Write("   ");

    for (var i = 0; i < notas.Length; i++) {
        Console.Write($"A{i + 1}:{notas[i],4:F1}  ");
        // Salto de línea cada 10 notas para que no se corte la fila
        if ((i + 1) % 10 == 0)
            Console.Write("\n   ");
    }

    Console.WriteLine();
}

// Devuelve la nota más alta (acumulador con guarda).
double CalcularMaximo(double[] calificaciones) {
    var maximo = calificaciones[0];

    for (var i = 1; i < calificaciones.Length; i++)
        if (calificaciones[i] > maximo)
            maximo = calificaciones[i];

    return maximo;
}

// Devuelve la nota más baja (acumulador con guarda).
double CalcularMinimo(double[] calificaciones) {
    var minimo = calificaciones[0];

    for (var i = 1; i < calificaciones.Length; i++)
        if (calificaciones[i] < minimo)
            minimo = calificaciones[i];

    return minimo;
}

// Calcula la media aritmética de la class.
double CalcularMedia(double[] calificaciones) {
    var suma = 0.0;

    foreach (var calificacion in calificaciones)
        suma += calificacion;

    return suma / calificaciones.Length;
}

// Cuenta cuántos alumnos han aprobado (nota >= 5).
int ContarAprobados(double[] calificaciones) {
    var aprobados = 0;

    for (var i = 0; i < calificaciones.Length; i++)
        if (notas[i] >= NotaAprobado)
            aprobados++;

    return aprobados;
}

// Ordena el array POR BURBUJA de menor a mayor (modifica el original).
// Cada pasada "burbujea" el mayor hacia el final comparando vecinos.
void OrdenarPorBurbuja(double[] calificaciones) {
    var n = calificaciones.Length;

    // n-1 pasadas bastan; en la k-ésima, las k últimas posiciones ya están
    for (var pasada = 0; pasada < n - 1; pasada++) {
        var intercambiado = false; // optimización: si no hay cambios, ya está ordenado

        // En cada pasada se compara cada par de vecinos
        for (var i = 0; i < n - 1 - pasada; i++) {
            if (calificaciones[i] > calificaciones[i + 1]) {
                // Intercambio con tuplas
                (calificaciones[i], calificaciones[i + 1]) = (calificaciones[i + 1], calificaciones[i]);
                intercambiado = true;
            }
        }

        // Si una pasada entera no intercambió nada, el array ya está ordenado
        if (!intercambiado)
            break;
    }
}

// Búsqueda BINARIA sobre un array YA ORDENADO: descarta la mitad en cada paso.
// Devuelve el índice del objetivo o -1 si no está. Usa tolerancia por ser double.
int BuscarBinaria(double[] notasOrdenadas, double notaObjetivo) {
    var izquierda = 0;
    var derecha = notasOrdenadas.Length - 1;

    while (izquierda <= derecha) {
        var medio = (izquierda + derecha) / 2; // posición central del rango vivo

        if (Math.Abs(notasOrdenadas[medio] - notaObjetivo) <= Tolerancia)
            return medio; // ¡encontrado!
        if (notasOrdenadas[medio] < notaObjetivo)
            izquierda = medio + 1; // el objetivo está en la mitad derecha
        else
            derecha = medio - 1;   // el objetivo está en la mitad izquierda
    }

    return -1; // el rango se agotó: no está
}

// Muestra un histograma de frecuencias con 4 tramos de notas.
void MostrarHistograma(double[] notas) {
    // Contadores por tramo: suspensos, notable bajo, notable alto, sobresaliente
    var tramo1 = 0; // 0.0 - 4.9
    var tramo2 = 0; // 5.0 - 6.9
    var tramo3 = 0; // 7.0 - 8.9
    var tramo4 = 0; // 9.0 - 10.0

    for (var i = 0; i < notas.Length; i++) {
        if (notas[i] < 5.0)
            tramo1++;
        else if (notas[i] < 7.0)
            tramo2++;
        else if (notas[i] < 9.0)
            tramo3++;
        else
            tramo4++;
    }

    Console.WriteLine("\n--- 📊 Histograma (cada █ es un alumno) ---");
    ImprimirBarra("0.0 - 4.9 (suspensos)  ", tramo1);
    ImprimirBarra("5.0 - 6.9 (aprobados)  ", tramo2);
    ImprimirBarra("7.0 - 8.9 (notable)    ", tramo3);
    ImprimirBarra("9.0 - 10.0 (sobresal.) ", tramo4);
}

// Dibuja una barra de texto con "x" bloques (una por alumno del tramo).
void ImprimirBarra(string etiqueta, int cantidad) {
    Console.Write($"   {etiqueta} ");

    for (var i = 0; i < cantidad; i++)
        Console.Write("█");

    Console.WriteLine($" ({cantidad})");
}
