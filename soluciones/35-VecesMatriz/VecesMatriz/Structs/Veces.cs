namespace _35_VecesMatriz.Structs;

// Veces: lo que hemos encontrado al buscar un número en una matriz.
// Mismo planteamiento que en el ejemplo 34 (vector), con un matiz: aquí las
// posiciones NO son enteros sueltos, sino structs Posicion, porque una celda
// de una matriz se identifica con DOS índices.
internal struct Veces
{
    public int Conteo;          // Cuántas veces aparece el número (0 si no aparece)
    public Posicion[] Posiciones; // Las celdas EXACTAS donde aparece, sin huecos

    // Valor de fábrica razonable para que Nullable enable no se queje:
    // cero apariciones y array vacío.
    public Veces()
    {
        Conteo = 0;
        Posiciones = [];
    }
}
