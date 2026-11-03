namespace _35_VecesMatriz.Structs;

// Posicion: una celda concreta de la matriz, identificada por su fila y su
// columna. En un vector basta un entero para decir "dónde", porque es
// unidimensional; en una matriz hacen falta SIEMPRE dos índices, y meterlos
// en un struct evita arrastrar dos arrays paralelos (filas[] y columnas[])
// que se pueden desincronizar.
internal struct Posicion
{
    public int Fila;    // Índice de la fila (0-indexado)
    public int Columna; // Índice de la columna (0-indexado)

    // El ToString nos deja imprimir una posición sin escribir a mano
    // $"{p.Fila},{p.Columna}" por todas partes.
    public override string ToString() => $"({Fila},{Columna})";
}
