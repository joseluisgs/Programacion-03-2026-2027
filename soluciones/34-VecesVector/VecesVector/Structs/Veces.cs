namespace _34_VecesVector.Structs;

// Veces: lo que hemos encontrado al buscar un número en un vector.
// Es un struct de datos (repaso UD01/UD03): agrupa en un único tipo el
// CONTADOR y el DETALLE, para poder devolver las dos cosas a la vez desde
// una sola función. Si devolviéramos solo el contador, el llamador no
// sabría dónde está; si devolviéramos solo las posiciones, no sabríamos
// cuántas hay sin recorrer el array otra vez.
internal struct Veces
{
    public int Conteo; // Cuántas veces aparece el número (0 si no aparece)
    public int[] Posiciones; // Los índices EXACTOS donde aparece, sin huecos

    // Para que el compilador no se queje con Nullable enable, damos un
    // valor de fábrica razonable: cero apariciones y array vacío.
    public Veces()
    {
        Conteo = 0;
        Posiciones = [];
    }
}
