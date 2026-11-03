namespace _36_RecorridosMatriz.Structs;

// Posicion: una celda concreta de la matriz, identificada por su fila y su
// columna. Todos los recorridos devuelven un List<Posicion> para que se
// pueda ver el ORDEN exacto en que se visitan las celdas.
internal struct Posicion
{
    public int Fila;    // Índice de la fila (0-indexado)
    public int Columna; // Índice de la columna (0-indexado)

    public Posicion(int fila, int columna)
    {
        Fila = fila;
        Columna = columna;
    }

    // El ToString nos deja imprimir una posición sin repetir a mano
    // "fila X, columna Y" en cada recorrido.
    public override string ToString() => $"({Fila},{Columna})";
}
