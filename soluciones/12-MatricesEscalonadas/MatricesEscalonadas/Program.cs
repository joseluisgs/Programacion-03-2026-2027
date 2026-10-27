var rdm = new Random();


// Matriz Rectangular
var matrizRectangular = new int [4,5];

// Valores aleatorios
for (var i = 0; i < matrizRectangular.GetLength(0); i++) {
    for (var j = 0; j < matrizRectangular.GetLength(1); j++) {
        matrizRectangular[i, j] = rdm.Next(0, 10); // Valores aleatorios entre 0 y 9
    }
}

Console.WriteLine("Matriz Rectangular");
// Cuidado con Length
Console.WriteLine($"Matriz A {matrizRectangular.GetLength(0)}x{matrizRectangular.GetLength(1)}");
Console.WriteLine("Matriz A total de elementos: " + matrizRectangular.Length);

// La imprimimos
for (var i = 0; i < matrizRectangular.GetLength(0); i++) {
    for (var j = 0; j < matrizRectangular.GetLength(1); j++) {
        Console.Write(matrizRectangular[i, j] + " ");
    }
    Console.WriteLine();
}

// Matriz Escalada -- Array de arrays
// El primer array es el numero de filas
var matrizEscalada = new int [4][];

// Por cada fila, indicamos el numero de columnas
for (var i = 0; i < matrizEscalada.Length; i++) {
    matrizEscalada[i] = new int[i + 1];
}


// La inicializamos
for (int i = 0; i < matrizEscalada.Length; i++) {
    for (int j = 0; j < matrizEscalada[i].Length; j++) {
        matrizEscalada[i][j] = rdm.Next(0, 10);
    }
}


Console.WriteLine("Matriz Escalada");

// La dimensión de cada fila
for (var i = 0; i < matrizEscalada.Length; i++) {
    Console.WriteLine($"Fila {i} tiene {matrizEscalada[i].Length} columnas");
}

// La imprimimos
for (var i = 0; i < matrizEscalada.Length; i++) {
    for (var j = 0; j < matrizEscalada[i].Length; j++) {
        Console.Write(matrizEscalada[i][j] + " ");
    }
    Console.WriteLine();
}

Console.WriteLine("Matriz Rectangular");